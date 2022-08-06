import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, Input, Select, Spin, notification, Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';
import _styles from './styles.less';

// 引入编辑器组件
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils'; // 引入编辑器样式
import 'braft-editor/dist/index.css';

const controls = ['bold', 'italic', 'underline', 'text-color', 'separator'];

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
};

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

function AddNew(props) {
    const {
        loadingSubmit,
        loadingGetDetail,
        loadingCreate
    } = props;
    const { visible, setVisible, tableSearch, id = null, data } = props;
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState([]); // 上传文件内容,仅限上传一个
    const [noticePerson, setNoticePerson] = useState(1); // 公告对象
    const [noticeType, setNoticeType] = useState(2); // 公告类型
    const [productList, setProductList] = useState([]); // 产品列表

    // 编辑时读取数据
    useEffect(() => {
        const { dispatch } = props;
        dispatch({
            type: 'global/queryByProductName',
            callback: (res) => {
                if (res.code === 1008) {
                    setProductList(res.data);
                }
            }
        });
        if (!id) return;
        const {
            noticeType,
            noticePerson,
            productIds,
            content,
            attachmentsId,
            fileName = null,
            fileUrl = null
        } = data;
        const contentToEditor =
        (content && BraftEditor.createEditorState(content)) || null;
        const attachmentList = (
            attachmentsId && [{
                uid: attachmentsId,
                name: fileName,
                url: fileUrl,
                status: 'done'
            }]
            || null
        );
        const ids = productIds && typeof productIds === 'string' && productIds.split(',') || [];
        const idLists = ids.map((item)=>Number(item));
        setFileList(attachmentList);
        setNoticeType(noticeType);
        setNoticePerson(noticePerson);
        form.setFieldsValue({
            ...data,
            noticeType,
            noticePerson,
            productIds:idLists || [],
            content: contentToEditor,
            fileList: attachmentList
        });
    }, []);

    const onFinish = () => {
        const { validateFields } = form;
        validateFields().then((values) => {
            const { dispatch } = props;
            const type = id ? 'updateNotice' : 'createNotice';
            const { fileList, readTime, content, customerType, productIds, ...params } = values;
            const attachmentsId = fileList && fileList.map((item) => item.uid) || null;
            const contentToString = (content && content.toHTML()) || null;
            const ids = Array.isArray(productIds) && productIds.join(',') || '';
            dispatch({
                type: `confirmAnnouncementSettings/${type}`,
                payload: {
                    ...params,
                    attachmentsId: Array.isArray(attachmentsId) && attachmentsId[0] || null,
                    content:contentToString,
                    readTime: Number(readTime),
                    customerType: customerType || null,
                    productIds:ids || null,
                    contraintNoticeId: id
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
    console.log(props)
    return (
        <Modal
            visible={visible}
            // mask={false}
            maskClosable={false}
            onCancel={() => setVisible(false)}
            onOk={onFinish}
            wrapClassName={_styles.addNew}
            title="新建强制确认公告"
        >
            <Form
                initialValues={{
                    isDelete:0,
                    readTime:10
                }}
                {...layout}
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    label="公告名称:"
                    name="noticeName"
                    rules={[
                        { required: true, message: '请输入公告名称!' },
                        { max: 70, message: '最多输入70个字符' }
                    ]}
                >
                    <Input max={140} />
                </Form.Item>
                <Form.Item
                    label="生效状态:"
                    name="isDelete"
                    rules={[{ required: true, message: '请选择生效状态!' }]}
                >
                    <Select placeholder="请选择" allowClear >
                        <Option value={0}>有效</Option>
                        <Option value={1}>无效</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="强制阅读时长(秒)"
                    name="readTime"
                    rules={[{ required: true, message: '请输入强制阅读时长!' }]}
                >
                    <Input max={140} type="number" min={0} />
                </Form.Item>
                <Form.Item
                    label="公告对象:"
                    name="noticePerson"
                    initialValue={1}
                    rules={[{ required: true, message: '请选择公告对象!' }]}
                >
                    <Select placeholder="请选择" allowClear onChange={(e) => setNoticePerson(e)}>
                        <Option value={1}>所有人</Option>
                        <Option value={2}>特定对象</Option>
                    </Select>
                </Form.Item>
                {
                    noticePerson === 2 && (
                        <>
                            <Form.Item
                                label="客户类型:"
                                name="customerType"
                                rules={[{ required: false, message: '请选择客户类型!' }]}
                            >
                                <Select placeholder="请选择" allowClear >
                                    <Option value={1}>自然人客户</Option>
                                    <Option value={2}>机构客户</Option>
                                    <Option value={3}>产品客户</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="持有产品:"
                                name="productIds"
                                rules={[{ required: false, message: '请选择持有产品!' }]}
                            >
                                <Select placeholder="请选择" allowClear  mode="multiple">
                                    {
                                        productList.map((item) => (
                                            <Option
                                                value={item.productId}
                                                key={item.productId}
                                            >
                                                {item.productName}
                                            </Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </>
                    )
                }
                <Form.Item
                    label="公告类型:"
                    name="noticeType"
                    initialValue={2}
                    rules={[{ required: true, message: '请选择公告类型!' }]}
                >
                    <Select placeholder="请选择" allowClear onChange={(e) => setNoticeType(e)}>
                        <Option value={1}>文字公告</Option>
                        <Option value={2}>文件公告</Option>
                    </Select>
                </Form.Item>
                {
                    noticeType === 1 && (
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
                    )
                }
                {
                    noticeType === 2 && (
                        <Form.Item
                            label="阅读文件"
                            name="fileList"
                            extra="最大可支持20M以内的PDF文件"
                            rules={[{ required: true, message: '请上传文件!', type: 'array' }]}
                            getValueFromEvent={normFile}
                        >
                            <Upload
                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                accept=".pdf"
                                data={{
                                    sourceId: '',
                                    source: 25,
                                    codeType: 167
                                }}
                                fileList={fileList}
                                onChange={uploadFileChange}
                                onRemove={deleteFile}
                                maxCount={1}
                            >
                                <Button
                                    disabled={fileList && fileList.length}
                                    icon={<UploadOutlined />}
                                    size="middle"
                                >
                                    上传
                                </Button>
                            </Upload>
                        </Form.Item>
                    )
                }
            </Form>
            {(loadingSubmit || loadingGetDetail || loadingCreate) && (
                <div className="consulteModalLoading">
                    <Spin />
                </div>
            )}
        </Modal>
    );
}

export default connect(({ loading }) => ({
    loadingSubmit: loading.effects['confirmAnnouncementSettings/createNotice'],
    loadingCreate: loading.effects['confirmAnnouncementSettings/updateNotice'],
    loadingGetDetail: loading.effects['confirmAnnouncementSettings/getQuestionDetail']
}))(AddNew);
