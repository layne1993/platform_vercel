import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Row, Col, Button, notification, Spin, Upload, Modal, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from '../../styles.less';
import { connect } from 'dva';
import { getPermission, getCookie } from '@/utils/utils';
import { Dispatch } from 'umi';
import { isEmpty } from 'lodash';

interface CompanyPro {
    dispatch: Dispatch;
    loading: boolean;
    loading2: boolean;
    loading3: boolean;
}

const openNotification = (type, message) => {
    notification[type]({
        message
    });
};

function getBase64(file: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

const uploadButton = (
    <div>
        <PlusOutlined />
    </div>
);

const BasicInfo: React.FC<CompanyPro> = (props) => {
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
    };
    const [form] = Form.useForm();
    const { authEdit } = getPermission(123000);
    const { dispatch } = props;
    const [phone, changePhone] = useState<string>('');
    const [fileList, setFileList] = useState<any[]>([]);
    const [previewImage, setPreviewImage] = useState<string>('');
    const [previewVisible, setPreviewVisible] = useState<boolean>(false);

    const saveInfo = () => {
        const data = form.getFieldsValue();
        const { logoFile, ...params } = data;
        dispatch({
            type: 'companySetting/saveInfo',
            payload: {
                ...params,
                attachmentsId: !isEmpty(fileList) ? fileList[0].uid : undefined
            },
            callback(res: any) {
                if (res.code === 1008) {
                    openNotification('success', '保存成功');
                } else {
                    openNotification('error', res.message);
                }
            }
        });
    };
    useEffect(() => {
        dispatch({
            type: 'companySetting/renderLogo',
            callback(res: any) {
                if (res.code === 1008 && res.data) {
                    let tempData = {};
                    if (res.data.attachmentsId && res.data.companyLogo) {
                        tempData = {
                            uid: res.data.attachmentsId,
                            status: 'done',
                            name: '',
                            url: res.data.companyLogo
                        };
                    }
                    if (!isEmpty(tempData)) setFileList([tempData]);
                    form.setFieldsValue({
                        ...res.data,
                        logoFile: !isEmpty(tempData) ? tempData : undefined
                    });
                    // changePhone(res.data?.phone);
                } else if (res.code !== 1008) {
                    openNotification('error', res.message);
                }
            }
        });
    }, []);

    const _beforeUpload = (file: any) => {
        if (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg') {
            return true;
        } else {
            openNotification('warning', '图片仅支持png/jpg格式！');
            return false;
        }
    };


    const _handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
    };

    const _handleCancel = () => setPreviewVisible(false);

    const _handleFileChange = (info: any) => {
        setFileList(info.fileList);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1008) {
                openNotification('success', '上传成功');
                const { data = [] } = info.file.response;
                const tempList = [{
                    uid: data.attachmentsId,
                    status: 'done',
                    name: data.fileName,
                    url: data.baseUrl
                }];
                setFileList(tempList);
            } else {
                openNotification('warning', '上传失败');
            }
        }
    };


    // 文件删除
    const _onRemove = (file) => {
        dispatch({
            type: 'companySetting/deleteLogo',
            payload: {
                attachmentsId: file.uid
            },
            callback: (res: any) => {
                if (res.code === 1008) {
                    openNotification('success', '删除成功');
                    setFileList([]);
                } else {
                    openNotification('warning', '删除失败');
                }
            }
        });
        return false;
    };

    return (
        <Spin spinning={Boolean(props.loading) || Boolean(props.loading2) || Boolean(props.loading3)}>
            {/* <Card title="基本信息设置"> */}
            <Form form={form} {...layout}>
                <Row gutter={50}>
                    <Col span={12} >
                        <Form.Item label={'公司名称'} name={'companyName'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'注册地址'} name={'registerAddress'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'注册资本'} name={'registerCapital'}>
                            <InputNumber placeholder={'请输入'} min={0} style={{ width: '200px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'实缴资本'} name={'contributedCapital'}>
                            <InputNumber placeholder={'请输入'} min={0} style={{ width: '200px' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'协会登记编号'} name={'registerNo'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'法定代表人'} name={'legalPerson'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'联系人'} name={'linkMan'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item
                            label={'公司联系电话'}
                            name={'phone'}
                        // rules={[{ required: false, type: 'number', message: '联系电话格式不正确' }]}
                        >
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'公司地址'} name={'companyAddress'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'公司联系邮箱'} name={'email'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'公司网址'} name={'companyUrl'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item label={'传真'} name={'faxes'}>
                            <Input placeholder={'请输入'} />
                        </Form.Item>
                    </Col>
                    <Col span={12} >
                        <Form.Item
                            label="公司logo"
                            name="logoFile"
                        // extra="支持扩展名：.pdf，只能上传一个文件"
                        >
                            <Upload
                                name="file"
                                accept=".png, .jpg"
                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                data={{
                                    sourceId: '',
                                    source: 21,
                                    codeType: 137
                                }}
                                listType="picture-card"
                                fileList={fileList}
                                beforeUpload={_beforeUpload}
                                onRemove={_onRemove}
                                onChange={_handleFileChange}
                                onPreview={_handlePreview}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Modal
                visible={previewVisible}
                title="logo预览"
                footer={null}
                onCancel={_handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
            {/* </Card> */}
            <div className={styles.box} style={{
                display: authEdit ? '' : 'none'
            }}
            >
                <Button type={'primary'} onClick={saveInfo}>保存</Button>
            </div>
        </Spin >
    );
};

export default connect(({ companySetting, loading }) => ({
    companySetting,
    loading: loading.effects['companySetting/saveInfo'],
    loading2: loading.effects['companySetting/renderLogo'],
    loading3: loading.effects['risk/deleteFile']
}))(BasicInfo);
