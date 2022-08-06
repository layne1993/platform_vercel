/*
 * @Descripttion: 审核模态框
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 10:40:47
 * @LastEditTime: 2021-08-17 15:08:16
 */
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, notification, message, Row, Col, Radio, Input, Space } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import fixedImg from '@/assets/pseudo.png';
import { connect, formatMessage } from 'umi';
import PropTypes from 'prop-types';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const check = (props) => {
    const {
        params,
        flag,
        title,
        onOk,
        closeModal,
        dispatch,
        loading,
        authEdit,
    } = props;
    const [form] = Form.useForm();
    const [radio, setRadio] = useState(1);
    const [detailInfo, setDetailInfo] = useState({}); //详情信息

    /**
     * 关闭模态框
     */
    const onCancel = () => {
        if (closeModal && typeof closeModal === 'function') closeModal();
    };

    const onFinish = (values) => {
        dispatch({
            type: 'INVESTOR_AUTHENTICATION/realNameAudit',
            payload: {
                ...params,
                ...values
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                } else {
                    openNotification('success', `提示（代码：${res.code}）`, '保存成功', 'topRight');
                    onOk();
                }

            }
        });
    };

    // 获取详情
    const getDetail = () => {
        dispatch({
            type: 'INVESTOR_AUTHENTICATION/realDetail',
            payload: {
                ...params
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '获取详情失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                } else {
                    setDetailInfo(res.data || {});
                    setRadio(res.data && res.data.auditResult);
                    form.setFieldsValue({
                        ...res.data
                    });
                }

            }
        });
    };

    useEffect(getDetail, []);



    return (
        <Modal
            maskClosable={false}
            title={title}
            visible={flag}
            onCancel={onCancel}
            destroyOnClose
            footer={null}
        >
            <Form
                form={form}
                onFinish={onFinish}
                layout="vertical"
                initialValues={{
                    sourceType: 1
                }}
            >
                <Row gutter={[20, 0]} >
                    <Col span={24}>
                        <Form.Item
                            label="授权委托书:"
                        >
                            {
                                Array.isArray(detailInfo.authorizationLetterList) && detailInfo.authorizationLetterList.map((item) => (
                                    <a target="_blank" key={item.authorizationLetterId} rel="noopener noreferrer" href={item.authorizationLetterUrl}>
                                        {
                                            item.authorizationLetterUrl ? <img src={fixedImg} alt="" /> : '暂无'
                                        }
                                    </a>
                                )) || '暂无'
                            }
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="审核结果:"
                            name="auditResult"
                            rules={[{
                                required: true,
                                message: '请选择'
                            }]}

                        >
                            <Radio.Group disabled={detailInfo.realnameState!==3} onChange={(e) =>setRadio(e.target.value)}>
                                <Radio value={1}>满足，结束</Radio>
                                <Radio value={2}>审核有误，流程打回</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {
                        radio === 2 &&
                        <Col span={24}>
                            <Form.Item
                                label="审核反馈"
                                name="auditOpinion"
                                extra="请输入审核反馈意见"
                            >
                                <Input.TextArea/>
                            </Form.Item>
                        </Col>
                    }

                </Row>
                {
                    <Row justify="center">
                        <Space>
                            <Button key="back" onClick={onCancel}>取消</Button>
                            {authEdit && <Button disabled={detailInfo.realnameState !== 3} type="primary" htmlType="submit" loading={loading} >确定</Button>}
                        </Space>
                    </Row>
                }
            </Form>
        </Modal>
    );

};


export default connect(({ INVESTOR_AUTHENTICATION, loading }) => ({
    INVESTOR_AUTHENTICATION,
    loading: loading.effects['INVESTOR_AUTHENTICATION/getRiskListData']
}))(check);

check.defaultProps = {
    title: '实名审核',
    flag: false,
    authEdit: true,
    params: {}, // 上传参数
    closeModal: () => { }, // 关闭模态框回调
    onOk: () => { } // 点击模态框确定按钮回调
};

check.propTypes = {
    flag: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    onOk: PropTypes.func,
    params: PropTypes.object
};
