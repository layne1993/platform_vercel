import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, message } from 'antd';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
import _styles from './index.less';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
};

const EditModal = ({
    isVisible,
    submitLoading,
    formData,
    onCancel,
    onConfirm
}) => {
    const [form] = Form.useForm();
    const [showTips, toggleTips] = useState(true);

    const handleConfirm = useCallback(async () => {
        const res = form.getFieldsValue();
        const { password, password1 } = res;
        if (password !== password1) {
            message.error('两次密码不一致');
            return;
        }

        if (formData.underwriterId) res.underwriterId = formData.underwriterId;
        onConfirm(res);
    }, [form, formData, onConfirm]);

    useEffect(() => {
        if (isVisible) {
            form.setFieldsValue(formData);
        }
    }, [form, formData, isVisible]);

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            visible={isVisible}
            confirmLoading={submitLoading}
            width="50%"
            title="承销商账号密码维护"
            onCancel={onCancel}
            onOk={handleConfirm}
        >
            {showTips &&
                <div className={_styles.tips}>
                    <ExclamationCircleOutlined />
                    <span>当前承销商信息未维护，请先维护承销商信息</span>
                    <CloseOutlined onClick={() => toggleTips(false)} />
                </div>
            }
            <Form
                {...formItemLayout}
                form={form}
                initialValues={formData}
                scrollToFirstError
            >
                <Form.Item
                    name="underwriterName"
                    label="承销商名称"
                    extra="如需创建承销商，请将承销商提供的模板zip发送到ipo@meix.com；预计4小时内创建完毕"
                >
                    <Input disabled style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    name="account"
                    label="承销商登录账号"
                    rules={[{ required: true, message: '请输入承销商登录账号', whitespace: true }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    name="password"
                    label="承销商登录密码"
                    rules={[{ required: true, message: '请输入承销商登录密码' }]}
                >
                    <Input type="password" />
                </Form.Item>

                <Form.Item
                    name="password1"
                    label="确认承销商登录密码"
                    rules={[{ required: true, message: '请输入承销商登录密码' }]}
                >
                    <Input type="password" />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditModal;
