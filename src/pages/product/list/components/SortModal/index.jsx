import React, { useState, useEffect } from 'react';
import { Modal, Form, Row, Button, Space, InputNumber, Typography, notification } from 'antd';
import { connect } from '@/.umi/plugin-dva/exports';

const FormItem = Form.Item;
const { Text } = Typography;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const SortModal = (props) => {

    const { isModalVisible, closeModal, sortNum, loading, productFullName, productId, dispatch } = props;

    const [form] = Form.useForm();

    const _onFinish = (values) => {
        dispatch({
            type: 'productList/resetOrderRule',
            payload: {
                productId,
                ...values
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提醒', '设置成功');
                    closeModal();
                } else {
                    const warningText = res.message || res.data || '设置失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    return (
        <Modal
            title="顺序调整"
            width={400}
            visible={isModalVisible}
            onCancel={closeModal}
            maskClosable={false}
            footer={null}
        >
            <Form
                form={form}
                onFinish={_onFinish}
            >
                <Row>
                    <Text>目前{productFullName}的顺序为：{sortNum}</Text>
                </Row>
                <FormItem name="orderRule" extra="保存新的顺序后，其余产品顺序同步更新">
                    <InputNumber min={0} style={{ width: '85%', margin: '10px 0' }} placeholder="请输入" />
                </FormItem>
                <Row justify="center">
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
                        <Button onClick={closeModal}>取消</Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default connect(({ productList, loading }) => ({
    productList,
    loading: loading.effects['productList/resetOrderRule']
}))(SortModal);