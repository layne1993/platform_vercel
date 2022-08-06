import React, { useState, useEffect } from 'react';
import { Modal, Input, Form, Row, Col, Select, Divider, Button, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import ModalEonomyManage from './ModalEonomyManage';
import ModalPlaceManage from './ModalPlaceManage';
import { getAllSalesman, getChannels, selectCustomersInfo, insertSalesman } from '../../../service';

const { Search } = Input;

const ModalIncrease = (props) => {
    const [isModalEconomyVisible, setIsModalEconomyVisible] = useState(false);
    const [isModalPlaceVisible, setIsModalPlaceVisible] = useState(false);
    const [scaleManList, setScaleManList] = useState([]);
    const [channelList, setChannelList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [customerNum, setCustomerNum] = useState([]);
    const [channelRule, setChannelRule] = useState(true);
    const [saleManRule, setSaleManRule] = useState(true);

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    const formItemLayout = {
        labelCol: { span: 16 },
        wrapperCol: { span: 18 }
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            console.log(values, 'values值为');
        } catch (err) {
            console.log('请检查必填项');
        }
    };

    const handleOk = () => {
        setIsModalEonomyVisible(false);
    };

    const handleCancel = () => {
        setIsModalEconomyVisible(false);
    };

    const showEconomyModal = () => {
        setIsModalEconomyVisible(true);
        props.isModalShow(false);
    };

    const handlePlaceOk = () => {
        setIsModalPlaceVisible(false);
    };

    const handlePlaceCancel = () => {
        setIsModalPlaceVisible(false);
    };

    const showPlaceModal = () => {
        setIsModalPlaceVisible(true);
        props.isModalShow(false);
    };

    const onReset = () => {
        form.resetFields();
    };

    //新增客户关联
    const insertSalesmanAjax = async (params) => {
        const res = await insertSalesman(params);
        try {
            if (res.code == 1001) {
                message.success(res.message);
            } else {
                message.error(res.message);
            }
        } catch (err) {
            message.warning(err);
        }
    };

    //点击弹窗确定
    const clickOk = async () => {
        // form.validateFields().then((values) => {
        //     insertSalesmanAjax(values);
        // });
        const res = form.getFieldsValue();
        await insertSalesmanAjax(res);
        props.onOk();
        form.resetFields();
    };

    //查询所有经济人
    const getAllSalesmanAjax = async () => {
        const res = await getAllSalesman({
            pageNum: 1,
            pageSize: 99999
        });
        if (res.code == 1001) {
            setScaleManList([...res?.data.list] || '');
            console.log([...res.data.list], 111);
        }
    };

    //查询所有渠道
    const getChannelsAjax = async () => {
        const res = await getChannels({
            pageSize: 99999,
            pageNum: 1
        });
        if (res.code == 1001) {
            setChannelList([...res.data.list]);
        }
    };

    //查询客户名称
    const selectCustomersInfoAjax = async () => {
        const res = await selectCustomersInfo({
            pageSize: 99999,
            pageNum: 1
        });
        if (res.code == 1001) {
            setCustomerList([...res.data?.list] || '');
        }
    };

    const selectChange = (e, current) => {
        const arrNum = current.map((item) => {
            return item.key;
        });
        form.setFieldsValue({
            cardNum: arrNum
        });
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
        getAllSalesmanAjax();
        getChannelsAjax();
        selectCustomersInfoAjax();
    }, [isModalEconomyVisible, isModalPlaceVisible]);

    useEffect(() => {
        if (!props.visible) {
            form.resetFields();
            setChannelRule(true);
            setSaleManRule(true);
        }
    }, [props.visible]);

    return (
        <>
            <Modal title="新建" visible={props.visible} footer={null} onCancel={props.onCancel}>
                <Form {...layout} form={form} onFinish={clickOk}>
                    <Row>
                        <Col span={20}>
                            <Form.Item
                                label="客户名称"
                                name="customerIds"
                                rules={[{ required: 'true', message: '请填写客户名称' }]}
                            >
                                <Select
                                    allowClear
                                    placeholder="请选择"
                                    mode="multiple"
                                    onChange={selectChange}
                                    filterOption={(input, option) =>
                                        option.children &&
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {customerList.map((item) => (
                                        <Select.Option
                                            key={item.cardNumber}
                                            value={item.customerId}
                                        >
                                            {item.customerName}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item label="证件号码" name="cardNum">
                                <Input disabled />
                            </Form.Item>

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
                                    allowClear
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                    // disabled={saleManRule ? false : true}
                                    onChange={saleManChange}
                                    dropdownRender={(menu) => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'nowrap',
                                                    padding: 4
                                                }}
                                            >
                                                <a
                                                    style={{
                                                        flex: 'none',
                                                        padding: '4px',
                                                        display: 'block',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={showEconomyModal}
                                                >
                                                    <SettingOutlined style={{ marginRight: 4 }} />
                                                    添加和管理经纪人
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {scaleManList.map((item) => (
                                        <Select.Option
                                            key={item.salesmanId}
                                            value={item.salesmanId}
                                        >
                                            {item.salesmanName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>

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
                                    allowClear
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                    showSearch
                                    // disabled={channelRule ? false : true}
                                    onChange={channelChange}
                                    dropdownRender={(menu) => (
                                        <div>
                                            {menu}
                                            <Divider style={{ margin: '4px 0' }} />
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexWrap: 'nowrap',
                                                    padding: 4
                                                }}
                                            >
                                                <a
                                                    style={{
                                                        flex: 'none',
                                                        padding: '4px',
                                                        display: 'block',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={showPlaceModal}
                                                >
                                                    <SettingOutlined style={{ marginRight: 4 }} />
                                                    添加和管理渠道
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                >
                                    {channelList.map((item) => (
                                        <Select.Option key={item.channelId} value={item.channelId}>
                                            {item.channelName || ''}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <div style={{ textAlign: 'right' }}>
                        <Button style={{ marginRight: 8 }} onClick={() => props.onCancel()}>
                            取消
                        </Button>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                    </div>
                </Form>
            </Modal>
            <ModalEonomyManage
                visible={isModalEconomyVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                showModal={(data) => setIsModalEconomyVisible(data)}
            />
            <ModalPlaceManage
                visible={isModalPlaceVisible}
                onOk={handlePlaceOk}
                onCancel={handlePlaceCancel}
                showPlaceManageModal={(data) => setIsModalPlaceVisible(data)}
            />
        </>
    );
};

export default ModalIncrease;
