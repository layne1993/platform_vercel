import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Input, Select, Modal, message } from 'antd';
import styles from './index.less';
import {
    selectProductsInfo,
    getChannels,
    getAllSalesman,
    insertProductFeeRate,
    isExistProductFeeRate
} from '../../../service';

const ModalAdd = (props) => {
    const [productNameList, setProductNameList] = useState([]);
    const [channelList, setChannelList] = useState([]);
    const [salesManList, setSalesManList] = useState([]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [channelRule, setChannelRule] = useState(true);
    const [saleManRule, setSaleManRule] = useState(true);

    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log(values, 'values值为');
        } catch (err) {
            console.log('请检查必填项');
        }
    };

    const onReset = () => {
        form.resetFields();
    };

    const selectChange = (e, current) => {
        // const arrNum = current.map((item) => {
        //     return item.key;
        // });
        // console.log(arrNum);
        console.log(current.value);
        isExistProductFeeRateAjax(current.value);
        form.setFieldsValue({
            fundRecordNumber: current.key
        });
    };

    //查询所有产品信息接口
    const selectProductsInfoAjax = async () => {
        const res = await selectProductsInfo({});
        if (res.code == 1001) {
            setProductNameList([...res.data.list] || '');
        }
    };

    //查询所有渠道
    const getChannelsAjax = async () => {
        const res = await getChannels({});
        if (res.code == 1001) {
            setChannelList([...res.data.list] || '');
        }
    };

    //查询所有经纪人
    const getAllSalesmanAjax = async () => {
        const res = await getAllSalesman({
            // pageSize: 20,
            // pageNum: 1,
        });
        if (res.code == 1001) {
            setSalesManList([...res.data.list] || '');
        }
    };

    //新增产品费率配置
    const insertProductFeeRateAjax = async (params) => {
        const res = await insertProductFeeRate(params);
        if (res.code == 1001) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
    };

    //查询产品是否配置过费率接口
    const isExistProductFeeRateAjax = async (params) => {
        const res = await isExistProductFeeRate({
            productId: params
        });
        if (res?.code == 1001) {
            form.setFieldsValue({
                subscriptionRate: res.data.subscriptionRate,
                repeatSubscriptionRate: res.data.repeatSubscriptionRate,
                redemptionRate: res.data.redemptionRate,
                managementFeeRate: res.data.managementFeeRate,
                performanceRewardRate: res.data.performanceRewardRate
            });
            setIsDisabled(true);
            message.warning('该产品已经配置过费率');
        }
        if (res?.code == 1002) {
            setIsDisabled(false);
            form.setFieldsValue({
                subscriptionRate: '',
                repeatSubscriptionRate: '',
                redemptionRate: '',
                managementFeeRate: '',
                performanceRewardRate: ''
            });
        }
    };

    //点击确定
    const handleSubmit = async () => {
        await form.validateFields().then(async (values) => {
            values.productIds = [values.productIds] || [];
            await insertProductFeeRateAjax(values);
        });
        props.onOk();
        form.resetFields();
    };

    //取消弹框
    const handleCancel = () => {
        props.onCancel();
        form.resetFields();
    };

    const channelChange = (e) => {
        if (e) {
            setSaleManRule(false);
        } else {
            setSaleManRule(true);
        }
    };

    const saleManChange = (e) => {
        if (e) {
            setChannelRule(false);
        } else {
            setChannelRule(true);
        }
    };

    useEffect(() => {
        selectProductsInfoAjax();
        getChannelsAjax();
        getAllSalesmanAjax();
    }, []);

    return (
        <>
            <Modal
                title="新建"
                visible={props.visible}
                onOk={handleSubmit}
                onCancel={handleCancel}
                width="920px"
            >
                <Form form={form} initialValues={{}} {...formItemLayout}>
                    <div className={styles.firstTitle}>产品基本费率</div>
                    <Row style={{ marginBottom: 36 }}>
                        <Col span={12}>
                            <Form.Item label="产品名称" name="productIds" rules={[{ required: 'true', message: '请选择产品名称' }]} >
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    onChange={selectChange}
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {productNameList.map((item) => (
                                        <Select.Option
                                            key={item.fundRecordNumber}
                                            value={item.productId}
                                        >
                                            {item.productFullName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="认购费率" name="subscriptionRate" rules={[{ required: 'true', message: '请选择认购费率' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                    disabled={isDisabled}
                                ></Input>
                            </Form.Item>
                            <Form.Item label="赎回费率" name="redemptionRate" rules={[{ required: 'true', message: '请选择赎回费率' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                    disabled={isDisabled}
                                ></Input>
                            </Form.Item>
                            <Form.Item label="业绩报酬计提方式" rules={[{ required: 'true', message: '请选择业绩报酬计提方式' }]}>
                                <Select placeholder="请选择" style={{ width: '224px' }}>
                                    <Select.Option key={0} value={0}>
                                        单人单笔高水位法
                                    </Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="备案编号" name="fundRecordNumber">
                                <Select
                                    placeholder="自动生成"
                                    style={{ width: '224px' }}
                                    mode="multiple"
                                    disabled
                                ></Select>
                            </Form.Item>
                            <Form.Item label="申购费率" name="repeatSubscriptionRate" rules={[{ required: 'true', message: '请选择申购费率' }]}>
                                <Input
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                    disabled={isDisabled}
                                ></Input>
                            </Form.Item>
                            <Form.Item label="管理费率" name="managementFeeRate" rules={[{ required: 'true', message: '请选择管理费率' }]}>
                                <Input
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                    disabled={isDisabled}
                                ></Input>
                            </Form.Item>
                            <Form.Item label="业绩报酬率" name="performanceRewardRate" rules={[{ required: 'true', message: '请输入业绩报酬率' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                    disabled={isDisabled}
                                ></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div className={styles.firstTitle}>产品提成费率</div>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                label="渠道名称"
                                name="channelId"
                                rules={
                                    channelRule
                                        ? [{ required: 'true', message: '选择渠道名称或经纪人' }]
                                        : []
                                }
                            >
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    allowClear
                                    onChange={channelChange}
                                >
                                    {channelList.map((item) => (
                                        <Select.Option key={item.channelId} value={item.channelId}>
                                            {item.channelName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="认购费提成比例" name="subscriptionRoyaltyRate" rules={[{ required: 'true', message: '请选择认购费提成比例' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="赎回费提成比例" name="redemptionRoyaltyRate" rules={[{ required: 'true', message: '请选择赎回费提成比例' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="税率" name="taxRate" rules={[{ required: 'true', message: '请选择税率' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="经纪人"
                                name="salesmanId"
                                rules={
                                    saleManRule
                                        ? [{ required: 'true', message: '请选择渠道名称或经纪人' }]
                                        : []
                                }
                            >
                                <Select
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    allowClear
                                    onChange={saleManChange}
                                >
                                    {salesManList.map((item) => (
                                        <Select.Option
                                            key={item.salesmanId}
                                            value={item.salesmanId}
                                        >
                                            {item.salesmanName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item label="申购费提成比例" name="repeatSubscriptionRoyaltyRate" rules={[{ required: 'true', message: '请选择申购费提成比例' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="管理费提成比例" name="managementFeeRoyaltyRate" rules={[{ required: 'true', message: '请选择管理费提成比例' }]}>
                                <Input
                                    placeholder="请输入"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                            <Form.Item label="业绩报酬提成比例" name="performanceRewardRoyaltyRate" rules={[{ required: 'true', message: '请选择业绩报酬提成比例' }]}>
                                <Input
                                    placeholder="请选择"
                                    style={{ width: '224px' }}
                                    suffix="%"
                                ></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export default ModalAdd;
