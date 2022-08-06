/*
 * @Descripttion: 实名配置模态框
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 10:40:47
 * @LastEditTime: 2021-05-31 23:08:07
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, notification, message, Row, Col, Radio, Upload, Space } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import PropTypes from 'prop-types';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 10
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 14
        },
        md: {
            span: 14
        }
    }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const AuthenticationConfig = (props) => {
    const {
        params,
        flag,
        title,
        onOk,
        closeModal,
        authEdit,
        dispatch,
        loading
    } = props;
    const [form] = Form.useForm();
    const [file, setFile] = useState(null);
    const [fileList, setFilelist] = useState([]);
    // const [configInfo, setConfigInfo] = useState({})


    /**
     * 关闭模态框
     */
    const onCancel = () => {
        if (closeModal && typeof closeModal === 'function') closeModal();
    };



    // 确定
    const onFinish = (values) => {
        const formData = new window.FormData();
        if (values) {
            for (let key in values) {
                values[key] && formData.append(key, values[key]);
            }
        }
        if (file) {
            formData.append('file', file);
        }
        console.log('hhh');
        dispatch({
            type: 'INVESTOR_AUTHENTICATION/createOrUpdate',
            payload: formData,
            callback: (res) => {
                if (res.code === 1008) {
                    onCancel(true);
                    openNotification('success', `提示（代码：${res.code}）`, `${res.message || '保存成功！'}`, 'topRight');
                } else {
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message || '保存失败！'}`, 'topRight');
                }
            }
        });
    };


    // 获取详情
    const getDetail = () => {
        dispatch({
            type: 'INVESTOR_AUTHENTICATION/getRealnameSetting',
            payload: {
                ...params
            },
            callback: ({code, data = {}, message}) => {
                if (code !== 1008) {
                    const warningText = message || data || '获取配置失败！';
                    openNotification('warning', `提示（代码：${code}）`, warningText, 'topRight');
                } else {
                    if (data) {
                        form.setFieldsValue({
                            ...data
                        });
                        if (data.authorizationLetterUrl) {
                            setFilelist([
                                {
                                    uid: 'uqd1231', // 随手写的key
                                    name: '委托书',
                                    url: data.authorizationLetterUrl,
                                    status: 'done'
                                }
                            ]);
                        }
                    }
                }

            }
        });
    };

    useEffect(getDetail, []);

    /**
     * @description 反面照
     * @param {} file
    */
    const beforeUpload = async (file, fileList) => {
        console.log('fi', file);
        setFile(file);
        setFilelist(fileList);
        return false;
    };

    const removeFile = () => {
        setFile(null);
        setFilelist([]);
    };


    const normFile = (e) => {

        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };



    return (
        <Modal
            maskClosable={false}
            title={title}
            visible={flag}
            onCancel={onCancel}
            footer={null}
        >
            <h3>机构/产品实名配置</h3>
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    isNeedAudit: 2,
                    isNeedUploadAuthorizationLetter: 3
                }}
                // {...formItemLayout}
            >
                <Row gutter={[20, 0]} >
                    <Col span={24}>
                        <Form.Item
                            label="机构/产品是否需要审核"
                            name="isNeedAudit"
                            rules={[{
                                required: true,
                                message: '请选择'
                            }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>是</Radio>
                                <Radio value={2}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="机构/产品是否需要上传授权委托书"
                            name="isNeedUploadAuthorizationLetter"
                            rules={[{
                                required: true,
                                message: '请选择'
                            }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>是，必填</Radio>
                                <Radio value={2}>是，非必填</Radio>
                                <Radio value={3}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="授权委托书维护"
                            valuePropName="file"
                            getValueFromEvent={normFile}
                            extra="建议PDF、图片、压缩包格式文件"
                        >
                            <Upload
                                // listType="picture"
                                style={{ display: 'inline-block' }}
                                name="file"
                                fileList={fileList}
                                // showUploadList={{
                                //     showRemoveIcon: false,
                                //     showDownloadIcon: false,
                                //     showPreviewIcon: false
                                // }}
                                maxCount={1}
                                // disabled={isEdit}
                                onRemove={removeFile}
                                beforeUpload={beforeUpload}
                            >
                                <Button
                                    icon={<UploadOutlined />}
                                    // disabled={authEdit}
                                >
                                    上传文件
                                </Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="center">
                    <Space>
                        <Button onClick={() => onCancel(false)}> 取消</Button>
                        {authEdit && <Button type="primary" htmlType="submit" loading={loading} >确定</Button>}
                    </Space>
                </Row>
            </Form>
        </Modal>
    );

};

export default connect(({ INVESTOR_AUTHENTICATION, loading }) => ({
    INVESTOR_AUTHENTICATION,
    loading: loading.effects['INVESTOR_AUTHENTICATION/getRiskListData']
}))(AuthenticationConfig);


AuthenticationConfig.defaultProps = {
    title: '  实名配置',
    flag: false,
    authEdit: true,
    params: {}, // 上传参数
    closeModal: () => { }, // 关闭模态框回调
    onOk: () => { } // 点击模态框确定按钮回调
};

AuthenticationConfig.propTypes = {
    flag: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    onOk: PropTypes.func,
    params: PropTypes.object
};
