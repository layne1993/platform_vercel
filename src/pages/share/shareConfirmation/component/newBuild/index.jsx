/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2020-12-08 10:46:13
 */
import React, { useState, useEffect } from 'react';
import {
    Form,
    Card,
    Input,
    Row,
    Space,
    Button,
    DatePicker,
    Upload,
    Modal,
    notification
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import request from '@/utils/rest';
import {getCookie} from '@/utils/utils';
import moment from 'moment';
/**
 * 份额确认书, 新增文件
 */

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const Build = (props) =>{
    const {params, flag, closeModal} = props;
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [productList, setProductList] = useState([]);


    /**
     * @description 获取产品列表
     */
    const getProductList = async () => {
        let res = await request.postJSON('/product/queryByProductName');
        if(res.code === 1008) {
            setProductList(res.data || []);
        }
    };

    // useEffect(getProductList, []);

    /**
     * @description 移除文件
     * @param {*} file
     */
    const onRemove = (file) => {
        setFileList([]);
        form.setFieldsValue({fileList: undefined});
        return true;
    };

    /**
     * 选择文件
     * @param {*} file
     * @param {*} fileList
     */
    const beforeUpload =  (file, fileList) => {
        setFile(file);
        setFileList(fileList);
        return false;
    };


    /**
     * @description 文件上传
     * @param {} file
     */
    const doUpload = async () => {
        let formData = new window.FormData();
        formData.append('file', file);
        if(params) {
            for(let key in params) {
                formData.append(key, params[key]);
            }
        }
        let res = await request.postMultipart(`${BASE_PATH.adminUrl}/confirmFile/upload`, formData);
        if(res.code === 1008) {
            openNotification('success', '提醒', '上传成功');
            props.onOk();
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
    };

    // 监听上传成功或失败
    const handleFileChange = async (e) => {
        const { file } = e;

        if (file.status === 'uploading') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                let data = file.response.data && file.response.data[0];
                let fileInfo = {
                    uid: data.confirmFileId,
                    name: data.fileName,
                    url: data.attachment.baseUrl,
                    status: 'done',
                    confirmFileId: data.confirmFileId
                };
                setFileList([fileInfo]);
                form.setFieldsValue({
                    fileName: data.fileName,
                    productName: data.productName,
                    fileDate: data.fileDate ? moment(data.fileDate) : undefined,
                    publiDate: data.publiDate ? moment(data.publiDate) : undefined,
                    fileList: [fileInfo]
                });
            } else {
                openNotification('warning', '提醒', '上传失败');
                form.setFieldsValue({fileList:undefined});
                setFileList([]);
            }
        }
    };



    return (
        <Modal
            width={1000}
            title={params.confirmFileId ? '编辑' : '新建'}
            visible={flag}
            onCancel={closeModal}
            footer={null}
        >
            <Card>
                <Form {...formLayout} form={form} onFinish={doUpload}>
                    <Card type="inner" title="文件基本信息">
                        <Form.Item
                            label={'文件上传'}
                            name="fileList"
                            rules={[
                                {
                                    required: true,
                                    message: '请上传文件'
                                }
                            ]}
                            extra="仅支持上传PDF"
                        >
                            <Upload
                                name="file"
                                // action={`${BASE_PATH.adminUrl}/confirmFile/upload`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                fileList={fileList}
                                showUploadList={{
                                    showRemoveIcon: true,
                                    showDownloadIcon: false,
                                    showPreviewIcon: false
                                }}
                                onRemove={onRemove}
                                beforeUpload={beforeUpload}
                                // onChange={handleFileChange}
                            >
                                <Button icon={<UploadOutlined />}>上传文件</Button>
                            </Upload>
                        </Form.Item>
                    </Card>
                    <Card style={{ marginTop: 16 }} type="inner" title="基本信息">
                        <Form.Item
                            label={'产品名称'}
                            name="productName"
                            rules={[
                                {
                                    required: false,
                                    message: '请填写产品名称'
                                }
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label={'文件名称'}
                            name="fileName"
                            rules={[
                                {
                                    required: false,
                                    message: '请填写文件名称'
                                }
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label={'文件日期'} name="fileDate">
                            <DatePicker disabled />
                        </Form.Item>
                        <Form.Item label={'发布日期'} name="publiDate">
                            <DatePicker disabled />
                        </Form.Item>


                        <Row justify="center">
                            <Space>
                                <Button onClick={closeModal}>取消</Button>
                                <Button type="primary" htmlType="submit">发布</Button>
                            </Space>
                        </Row>
                    </Card>
                </Form>
            </Card>
        </Modal>
    );

};
export default Build;

Build.defaultProps = {
    params: {},
    closeModal: ()=> {}
};
