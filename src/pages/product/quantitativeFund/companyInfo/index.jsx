// 量化公司基本信息
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Form, Input, Row, Col, Radio, Button, Spin, notification, Space } from 'antd';
import { objStringAttributeTrim } from '@/utils/utils';

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 }
    }
};

const formItemLayout1 = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 }
    }
};

const openNotification = (type, message, description, placement, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const CompanyInfo = (props) => {
    const { loading, dispatch, updateChannelLoading, authEdit } = props;
    const [form] = Form.useForm();
    const [quantitativeCompanyInfo, setQuantitativeCompanyInfo] = useState({});

    // 获取量化公司基本信息
    const getQuantitativeCompanyInfo = () => {
        dispatch({
            type: 'QUANTITATIVEFUND/getQuantitativeCompanyInfo',
            payload: {},
            callback: ({ code, data = {}, message }) => {
                if (code === 1008) {
                    form.setFieldsValue({
                        ...data
                    });
                    setQuantitativeCompanyInfo(data);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(() => {
        getQuantitativeCompanyInfo();
    }, []);

    // 保存
    const onFinish = (values) => {
        dispatch({
            type: 'QUANTITATIVEFUND/saveQuantitativeCompanyInfo',
            payload: {
                id: quantitativeCompanyInfo.id,
                ...objStringAttributeTrim(values)
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                    getQuantitativeCompanyInfo();
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                {...formItemLayout}
                onFinish={onFinish}
            >
                <Card title="管理人信息">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="管理人名称"
                                name="companyName"
                            // rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input disabled placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="管理人编码"
                                name="registerNo"
                            // rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input disabled placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="管理基金数量"
                                name="managementFundNumber"
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="量化基金数量"
                                name="quantizationFundNumber"
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="管理基金规模(元)"
                                name="managementFundScale"
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="量化基金规模(元)"
                                name="quantizationFundScale"
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input placeholder="系统自动获取" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card title="公司信息">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="是否存在境外关联方或子公司"
                                name="relatedParty"
                                rules={[{ required: true, message: '请选择' }]}

                            >
                                <Radio.Group defaultValue={0}>
                                    <Radio value={'1'}>是</Radio>
                                    <Radio value={'0'}>否</Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item shouldUpdate noStyle>
                        {() => (
                            form.getFieldValue('relatedParty') === '1' &&
                            <>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            {...formItemLayout1}
                                            label="境外关联方或子公司全称"
                                            name="relatedPartyName"
                                            rules={[{ required: true, message: '请输入' }]}
                                            extra={<span>( <span style={{ color: 'red' }}>注意:</span>如存在多个境外关联方或子公司,逐条填写,中文分号隔开。)</span>}
                                        >
                                            <Input.TextArea showCount maxLength={500} placeholder="请输入关联方或子公司名称" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            {...formItemLayout1}
                                            label="管理基金总资产(元)"
                                            name="managementFundTotal"
                                            rules={[{ required: true, message: '请输入' }]}
                                        >
                                            <Input placeholder="请输入管理基金总资产" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            {...formItemLayout1}
                                            label="管理基金净资产(元)"
                                            name="managementFundNetAsset"
                                            rules={[{ required: true, message: '请输入' }]}
                                        >
                                            <Input placeholder="请输入管理基金净资产" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            {...formItemLayout1}
                                            label="通过陆股通投资境内股票市值(元)"
                                            name="domesticStockMarketValue"
                                            rules={[{ required: true, message: '请输入' }]}
                                        >
                                            <Input placeholder="请输入通过陆股通投资境内股票市值" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <Form.Item
                                            {...formItemLayout1}
                                            label="境内股票交易服务商名称"
                                            name="transactionServiceProvider"
                                            rules={[{ required: true, message: '请输入' }]}
                                            extra={<span>( <span style={{ color: 'red' }}>注意:</span>如存在多个交易服务商，逐条填写，中文分号隔开。)</span>}
                                        >
                                            <Input.TextArea showCount maxLength={500} placeholder="请填写境外关联方和子公司投资境内股票所选择的交易服务商名称" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </>)
                        }
                    </Form.Item>

                    <Row>
                        <Col span={24}>
                            <Form.Item
                                {...formItemLayout1}
                                label="管理人需要说明的其他问题"
                                name="managerDescription"
                            >
                                <Input.TextArea maxLength={500} showCount />
                            </Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Row justify="center" style={{ marginTop: 30 }}>
                    <Space>
                        {authEdit && <Button type="primary" loading={updateChannelLoading} htmlType="submit" >保存</Button>}

                    </Space>
                </Row>
            </Form >
        </Spin >
    );
};

export default connect(({ QUANTITATIVEFUND, loading }) => ({
    loading: loading.effects['QUANTITATIVEFUND/getQuantitativeCompanyInfo'],
    updateChannelLoading: loading.effects['QUANTITATIVEFUND/saveQuantitativeCompanyInfo']
}))(CompanyInfo);

CompanyInfo.defaultProps = {
    loading: false,
    authEdit: false,
    authExport: false,
    updateChannelLoading: false
};
