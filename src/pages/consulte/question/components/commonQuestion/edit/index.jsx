import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, Input, Select, Radio, Spin, notification, Upload, Button } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'; // 引入编辑器样式
import 'braft-editor/dist/index.css';

import _styles from './styles.less';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
};

const controls = ['bold', 'italic', 'underline', 'text-color', 'separator', 'link', 'separator'];

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const { Option } = Select;

function EditQuestionList(props) {
    const {
        consulteQuestion: { questionTypes },
        loadingSubmit,
        loadingGetDetail
    } = props;
    const { visible, setVisible, tableSearch, id = null } = props;
    const [form] = Form.useForm();

    const [contentType, setContentType] = useState(0); // 问题内容选择
    const [fileList, setFileList] = useState([]); // 上传文件内容,仅限上传一个
    const [contentLoading, setContentLoading] = useState(false); // 编辑器loading

    // 编辑时读取数据
    useEffect(() => {
        if (!id) return;
        const { dispatch } = props;
        dispatch({
            type: 'consulteQuestion/getQuestionDetail',
            payload: { onlineServiceId: id },
            callback: (res) => {
                if (res.code === 1008) {
                    const { data = {} } = res;
                    const { problem, problemId, contentType, content, attachment = [] } = data;
                    const contentToEditor =
                        (content && BraftEditor.createEditorState(content)) || null;
                    const isReallyProblemId = questionTypes.some(
                        (item) => item.codeValue === problemId,
                    );
                    const attachmentList =
                        (attachment &&
                            [attachment].map((item) => ({
                                uid: item.attachmentsId,
                                name: item.fileName,
                                url: item.baseUrl,
                                status: 'done'
                            }))) ||
                        [];
                    form.setFieldsValue({
                        problem,
                        problemId: isReallyProblemId ? problemId : '',
                        contentType,
                        content: contentToEditor,
                        fileList: attachmentList
                    });
                    setContentType(contentType);
                    setFileList(attachmentList);
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        `${res.message ? res.message : '获取数据失败!'}`,
                        'topRight',
                    );
                }
            }
        });
    }, []);

    const onFinish = () => {
        const { validateFields } = form;
        validateFields().then((values) => {
            const { dispatch } = props;
            // 将富文本编译器内容转换为html
            const { content, fileList, ...params } = values;
            const contentToString = (content && content.toHTML()) || null;
            const attachmentsId = (Array.isArray(fileList) && fileList[0].uid) || null;
            dispatch({
                type: 'consulteQuestion/submitQuestionDetail',
                payload: {
                    ...params,
                    contentType,
                    content: contentType === 0 ? contentToString : null,
                    attachmentsId: contentType === 1 ? attachmentsId : null,
                    onlineServiceId: id
                },
                callback: (res) => {
                    const { code = '', message = '' } = res;
                    if (code === 1008) {
                        openNotification('success', '提示', '保存成功');
                        tableSearch(); // 更新数据
                        setVisible(false);
                    } else {
                        openNotification(
                            'warning',
                            `提示（代码：${code}）`,
                            `${message ? message : '保存失败！'}`,
                            'topRight',
                        );
                    }
                }
            });
        });
    };

    // 上传图片方法
    const uploadFileChange = async ({ file, fileList }) => {
        if (file.status === 'uploading' || file.status === 'removed') {
            setFileList(fileList);
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                const flieObj = file.response.data || {};
                openNotification('success', '提醒', '上传成功');
                const fl = [
                    {
                        uid: flieObj.attachmentsId,
                        name: flieObj.fileName,
                        url: flieObj.baseUrl,
                        status: 'done'
                    }
                ];
                setFileList(fl);
                form.setFieldsValue({ fileList: fl });
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    // 删除文件
    const deleteFile = async (e) => {
        let res = await request.get('/attachments/deleteFile', { attachmentsId: e.uid });
        let fileList = form.getFieldValue('fileList') || [];
        let arr = [];
        if (res.code === 1008) {
            arr = fileList.filter((item) => item.uid !== e.uid);
            if (arr.length === 0) {
                form.setFieldsValue({ fileList: [] });
            } else {
                form.setFieldsValue({ fileList: arr });
            }
            setFileList(arr);
        }
    };

    // 转换upload值
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // 富文本编译器上传文件
    const customRequest = async ({ file }) => {
        if (!file) return false;
        setContentLoading(true);
        // eslint-disable-next-line no-undef
        const formData = new FormData();
        formData.append('file', file);
        formData.append('source', '17');
        formData.append('sourceId', '');
        formData.append('codeType', 154);
        const res = await request.postMultipart('/attachments/uploadFile', formData);
        if (res.code === 1008) {
            form.setFieldsValue({
                content: ContentUtils.insertMedias(form.getFieldValue('content'), [
                    {
                        type: 'IMAGE',
                        url: res.data.baseUrl
                    }
                ])
            });
        } else {
            openNotification('warning', '提醒', '上传失败');
        }
        setContentLoading(false);
        return false;
    };

    // 创建antd的upload
    const extendControls = [
        {
            key: 'antd-uploader',
            type: 'component',
            component: (
                <Upload accept="image/*" showUploadList={false} customRequest={customRequest}>
                    <button
                        type="button"
                        className="control-item button upload-button"
                        data-title="插入图片"
                    >
                        <PictureOutlined />
                    </button>
                </Upload>
            )
        }
    ];

    return (
        <Modal
            visible={visible}
            mask={false}
            maskClosable={false}
            onCancel={() => setVisible(false)}
            onOk={onFinish}
            wrapClassName={_styles.editQuestion}
            title="新建问题详情"
        >
            <Form {...layout} form={form} onFinish={onFinish} initialValues={{ contentType }}>
                <Form.Item
                    label="问题:"
                    name="problem"
                    rules={[
                        { required: true, message: '请输入问题!' },
                        { max: 70, message: '最多输入70个字符' }
                    ]}
                >
                    <Input placeholder="请在这里输入标题，最多70个字符" max={140} />
                </Form.Item>
                <Form.Item
                    label="问题类型:"
                    name="problemId"
                    rules={[{ required: true, message: '请选择问题类型!' }]}
                >
                    <Select placeholder="请选择" allowClear loading={Boolean(props.questionTypeLoading)}>
                        {questionTypes.map((item) => (
                            <Option value={item.codeValue} key={item.codeValue}>
                                {item.codeText}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="回复内容" name="contentType">
                    <Radio.Group onChange={(e) => setContentType(e.target.value)}>
                        <Radio value={0}>文字</Radio>
                        <Radio value={1}>上传文件或图片</Radio>
                    </Radio.Group>
                </Form.Item>
                {contentType === 0 && (
                    <Form.Item
                        label="请输入内容"
                        name="content"
                        initialValue={BraftEditor.createEditorState('')}
                        rules={[
                            { required: true, message: '请输入内容!' },
                            () => ({
                                validator(_, value) {
                                    if (value.isEmpty()) {
                                        return Promise.reject(new Error('请输入内容!'));
                                    }
                                    return Promise.resolve();
                                }
                            })
                        ]}
                    >
                        <BraftEditor
                            style={{ border: '1px solid #d9d9d9', width: '100%' }}
                            contentStyle={{ height: '300px' }}
                            controls={controls}
                            // extendControls={extendControls}
                        />
                    </Form.Item>
                )}
                {contentType === 1 && (
                    <Form.Item
                        label="请上传文件"
                        name="fileList"
                        extra="建议PDF、图片等手机能打开的格式"
                        rules={[{ required: true, message: '请上传文件!', type: 'array' }]}
                        getValueFromEvent={normFile}
                    >
                        <Upload
                            action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                            headers={{
                                tokenId: getCookie('vipAdminToken')
                            }}
                            accept=".jpg,.png,.pdf,.jpeg"
                            data={{
                                sourceId: '',
                                source: 17,
                                codeType: 154
                            }}
                            fileList={fileList}
                            onChange={uploadFileChange}
                            onRemove={deleteFile}
                            maxCount={1}
                        >
                            <Button
                                disabled={fileList.length}
                                icon={<UploadOutlined />}
                                size="middle"
                            >
                                上传
                            </Button>
                        </Upload>
                    </Form.Item>
                )}
            </Form>
            {(loadingSubmit || loadingGetDetail || contentLoading) && (
                <div className="consulteModalLoading">
                    <Spin />
                </div>
            )}
        </Modal>
    );
}

export default connect(({ consulteQuestion, loading }) => ({
    consulteQuestion,
    loadingSubmit: loading.effects['consulteQuestion/submitQuestionDetail'],
    loadingGetDetail: loading.effects['consulteQuestion/getQuestionDetail'],
    questionTypeLoading: loading.effects['consulteQuestion/getQuestionType']
}))(EditQuestionList);
