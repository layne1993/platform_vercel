import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, notification, Spin, Input, Form, Select, Card, Row, Col, InputNumber, Checkbox, Space } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import styles from './styles.less';
import { fundAuthority, netAuthority } from './data';
import { InfoCircleOutlined, UpOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import {
    XWFundRiskLevel,
    XWReservationStatus,
    XWPurchaseStatus,
    XWShelfStatus,
    XWIsFundTop
} from '@/utils/publicData';
import moment from 'moment';

const DATE_FORMAT = 'YYYY-MM-DD';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: { span: 3 },
        sm: { span: 3 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

const formItemLayout1 = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 24 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 }
    }
};

const DD = [{
    currency: '人民币，美元',
    fundRecordNumber: 'sn111',
    productName: '小牛1号',
    recordRegisterDate: '20210728',
    setDate: '20210728',
    trusteeName: '光大证券'
}
];

const NewProduct = (props) => {
    const { dispatch, addLoading } = props;
    const [form] = Form.useForm();
    const [flag, setFlag] = useState(false);
    const [newProductList, setNewProductList] = useState([]);
    const [customerList, setCustomerList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [notMatchflag, setNotMatchflagFlag] = useState(false);
    const [notMatchProductList, setNotMatchProductList] = useState([]);
    const [noCrateLoading, setNoCrateLoading] = useState(false);
    const [formData, setFormData] = useState([]);


    // 获取投资者list
    const getInvestorList = () => {
        dispatch({
            type: 'NEW_PRODUCT/getInvestorList',
            payload: {},
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setCustomerList(data);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    /**
     * @description: 查询所有托管公司
     */
    const _queryCompanyList = () => {
        dispatch({
            type: 'NEW_PRODUCT/queryCompanyList',
            callback: (res) => {
                if (res.code === 1008) {
                    setCompanyList(res.data || []);
                }
            }
        });
    };

    // 获取新产品
    const getNewProductList = () => {
        dispatch({
            type: 'NEW_PRODUCT/syncFundInfo',
            payload: {},
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setNewProductList(data);
                    // setNewProductList(DD);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(() => {
        getNewProductList();
        getInvestorList();
        _queryCompanyList();
    }, []);


    const onFinsh = () => {
        form.validateFields().then((values) => {
            const { productList } = values;
            const newProducts = [];
            Array.isArray(productList) && productList.map((item) => {
                if (item.use === true) {
                    newProducts.push({
                        ...item,
                        productFullName: item.productName
                    });
                }
            });

            if (newProducts.length === 0) {
                openNotification('warning', '提醒', '至少选择一个产品');
                return;
            }

            dispatch({
                type: 'NEW_PRODUCT/createBatch',
                payload: newProducts,
                callback: ({ code, data, message }) => {
                    if (code === 1008) {
                        setNewProductList([]);
                        setFlag(false);
                        getNewProductList();
                        const txt = message || data || '创建成功！';
                        openNotification('success', '提醒', txt);
                    } else {
                        const txt = message || data || '查询失败！';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });

    };

    const setFrom = (arr = []) => {

        setLoading(true);
        setTimeout(() => {
            let formList = [];
            const notMatchList = [];
            arr.map((item) => {
                formList.push({ use: true, ...item });
                if (!item.currency || !item.trusteeshipCode) {
                    notMatchList.push({ ...item });
                }
            });
            form.setFieldsValue({
                productList: formList
            });
            setFormData(formList);
            setLoading(false);
            if (notMatchList.length > 0) {
                setNotMatchProductList(notMatchList);
                setNotMatchflagFlag(true);
            }
        }, 1000);


    };

    // 不创建错误数据
    const filterMatchProduct = (arr = []) => {
        setNoCrateLoading(true);
        const newArr = [];
        arr.map((item) => {
            if (item.currency && item.trusteeshipCode) {
                newArr.push({ use: true, ...item });
            } else {
                newArr.push({ use: false, ...item });
            }
        });

        form.setFieldsValue({
            productList: newArr
        });
        setNoCrateLoading(false);
        setNotMatchflagFlag(false);
    };


    // 获取string
    const getString = (arr = []) => {
        let arrStr = [];
        arr.map((item, index) => {
            if (index < 1) {
                arrStr.push(item.productName);
            }
        });
        return `检测到贵司有新备案产品：${arrStr.join()}等产品未维护，点击开始创建产品`;
    };

    const setUse = (val, index) => {
        let { productList } = form.getFieldsValue();
        setFormData(productList);
    };

    // console.log(formData, 'formData');
    // console.log('1111');

    return (
        <>

            {flag &&
                <Modal
                    title={'根据协会信息，快速创建产品'}
                    visible={flag}
                    onCancel={() => { setFlag(false); form.resetFields(); }}
                    maskClosable={false}
                    width={'80%'}
                    footer={[
                        <Button key="sure" type="primary" htmlType="submit" loading={addLoading} onClick={onFinsh}>快速创建</Button>
                    ]}
                    className={styles.modalWarp}
                    bodyStyle={{
                        height: '700px',
                        overflowY: 'auto'
                    }}
                >

                    <Spin spinning={loading}>
                        <Form
                            form={form}
                            {...formItemLayout}
                        >
                            <Form.List name="productList">
                                {(fields, { add, remove }) => (
                                    fields.map(({ key, name, fieldKey, ...restField }, index) => {
                                        const itemObj = newProductList[index] ? newProductList[index] : {};

                                        return (
                                            <Space key={key} className={styles.warpSpace}>
                                                <Card
                                                    title={<span>产品：{itemObj.productName}, {itemObj.fundRecordNumber}</span>}
                                                    extra={<Form.Item noStyle name={[name, 'use']} valuePropName="checked">
                                                        <Checkbox onChange={(val) => setUse(val, index)} value={1}></Checkbox>
                                                    </Form.Item>}
                                                >
                                                    <Form.Item
                                                        label="产品详情权限"
                                                        name={[name, 'productAuthority']}
                                                        rules={[{ required: formData[index] && formData[index].use, message: '请选择' }]}
                                                        tooltip={{
                                                            title: '设置详细产品要素信息,只要满足其中一种条件即可见',
                                                            icon: <InfoCircleOutlined />
                                                        }}
                                                    >
                                                        <Select
                                                            allowClear
                                                            mode="multiple"
                                                            placeholder="请选择"
                                                        >
                                                            {fundAuthority.map((item) => (
                                                                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="产品净值权限"
                                                        name={[name, 'netValueAuthority']}
                                                        rules={[{ required: formData[index] && formData[index].use, message: '请选择' }]}
                                                        tooltip={{
                                                            title: '设置产品净值信息,只要满足其中一种条件即可见',
                                                            icon: <InfoCircleOutlined />
                                                        }}
                                                    >
                                                        <Select
                                                            allowClear
                                                            mode="multiple"
                                                            placeholder="请选择"
                                                        >
                                                            {netAuthority.map((item) => (
                                                                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                                                            ))}
                                                        </Select>
                                                    </Form.Item>
                                                    <Form.Item
                                                        label="指定可查看的用户"
                                                        name={[name, 'specificCustomers']}
                                                    // rules={[{ required: formData[index] && formData[index].use, message: '请选择' }]}
                                                    >
                                                        <Select
                                                            allowClear
                                                            mode="multiple"
                                                            placeholder="请选择"
                                                            optionLabelProp="label"
                                                        >
                                                            {
                                                                Array.isArray(customerList) &&
                                                                customerList.map((item, i) => {
                                                                    return (
                                                                        <Select.Option label={item.customerName} key={i} value={item.customerId}>{item.customerBrief}</Select.Option>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </Form.Item>
                                                    {/* <MultipleSelect
                                            // params="specificCustomers"
                                                value="customerId"
                                                label="customerBrief"
                                                type={2}
                                                formLabel="指定可查看的用户"
                                                isOptionLabelProp
                                                optionLabel="customerName"
                                                mode="multiple"
                                                params={[name, 'specificCustomers']}
                                            /> */}
                                                    <Form.Item
                                                        label="产品风险等级"
                                                        name={[name, 'riskType']}
                                                        rules={[
                                                            {
                                                                required: formData[index] && formData[index].use,
                                                                message: '请选择产品风险等级'
                                                            }
                                                        ]}
                                                    >
                                                        <Select placeholder="请选择" allowClear>
                                                            {XWFundRiskLevel.map((item) => {
                                                                return (
                                                                    <Select.Option
                                                                        key={item.value}
                                                                        value={item.value}
                                                                    >
                                                                        {item.label}
                                                                    </Select.Option>
                                                                );
                                                            })}
                                                        </Select>
                                                    </Form.Item>
                                                    <Row gutter={[16, 16]}>
                                                        <Col span={7}>
                                                            <Form.Item
                                                                label="是否开放预约"
                                                                name={[name, 'appointmentStatus']}
                                                                help="此状态为开关，需同时符合开放期才会开放"
                                                                {...formItemLayout1}
                                                                labelAlign="left"
                                                                rules={[
                                                                    {
                                                                        required: formData[index] && formData[index].use,
                                                                        message: '请选择预约状态'
                                                                    }
                                                                ]}
                                                            >
                                                                <Select placeholder="请选择" allowClear>
                                                                    {XWReservationStatus.map((item) => {
                                                                        return (
                                                                            <Select.Option
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7} offset={1}>
                                                            <Form.Item
                                                                label="是否开放认申赎"
                                                                {...formItemLayout1}
                                                                labelAlign="left"
                                                                name={[name, 'tradeTypes']}
                                                            >
                                                                <Select
                                                                    placeholder="请选择"
                                                                    mode="multiple"
                                                                    allowClear
                                                                // disabled={existedOpenDay === 1}
                                                                >
                                                                    {XWPurchaseStatus.map((item) => {
                                                                        return (
                                                                            <Select.Option
                                                                                key={item.value}
                                                                                disabled={item.isDisabled}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7} offset={1}>
                                                            <Form.Item
                                                                label="上架状态"
                                                                name={[name, 'publishStatus']}
                                                                {...formItemLayout1}
                                                                labelAlign="left"
                                                                rules={[
                                                                    {
                                                                        required: formData[index] && formData[index].use,
                                                                        message: '请选择上架状态'
                                                                    }
                                                                ]}
                                                            >
                                                                <Select placeholder="请选择" allowClear>
                                                                    {XWShelfStatus.map((item) => {
                                                                        return (
                                                                            <Select.Option
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7}>
                                                            <Form.Item
                                                                label="产品是否置顶"
                                                                name={[name, 'topStatus']}
                                                                {...formItemLayout1}
                                                                labelAlign="left"
                                                            >
                                                                <Select placeholder="请选择" allowClear>
                                                                    {XWIsFundTop.map((item) => {
                                                                        return (
                                                                            <Select.Option
                                                                                key={item.value}
                                                                                value={item.value}
                                                                            >
                                                                                {item.label}
                                                                            </Select.Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={7} offset={1}>
                                                            <Form.Item
                                                                label="顺序"
                                                                name={[name, 'orderRule']}
                                                                {...formItemLayout1}
                                                                labelAlign="left"
                                                                rules={[
                                                                    {
                                                                        required: false,
                                                                        message: '请输入产品顺序'
                                                                    }
                                                                ]}
                                                                extra="控制管理后台产品列表及投资者端产品列表中产品的展示顺序"
                                                            >
                                                                <InputNumber width={200} min={0} placeholder="请输入产品顺序" />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                    <div className={styles.extraInfo}>
                                                        <div>以下信息，根据基金业协会信息，自动填充，括号后面代表基金业协会的字段名称：</div>
                                                        <div>产品成立日期（成立时间）: {newProductList[index] && moment(itemObj.setDate).format(DATE_FORMAT)}</div>
                                                        <div>备案登记日期（备案时间）: {newProductList[index] && moment(itemObj.recordRegisterDate).format(DATE_FORMAT)}</div>
                                                        <div>币种（币种）:人民币现钞（{newProductList[index] && itemObj.amacCurrency}）</div>
                                                        <div>托管机构（托管人名称）: {newProductList[index] && itemObj.trusteeName}</div>
                                                    </div>
                                                </Card>
                                            </Space>
                                        );
                                    }

                                    )
                                )}
                            </Form.List>

                        </Form>
                    </Spin>
                </Modal>



            }
            {newProductList.length > 0 &&
                <div className={styles.newProductTxt} onClick={() => { setFlag(true); setFrom(newProductList); }}>
                    {getString(newProductList)}
                </div>
            }

            {
                notMatchflag &&
                <Modal
                    visible={notMatchflag}
                    title="错误信息提醒"
                    onCancel={() => { setNotMatchflagFlag(false); }}
                    footer={[
                        <Button key="cancel" loading={noCrateLoading} onClick={() => filterMatchProduct(newProductList)}>不创建</Button>,
                        <Button key="sure" type="primary" onClick={() => { setNotMatchflagFlag(false); }}>忽略错误数据，继续创建</Button>
                    ]}
                    bodyStyle={{ maxHeight: '500px', overflowY: 'auto' }}
                >
                    {Array.isArray(notMatchProductList) &&
                        notMatchProductList.map((item) => (
                            <p key={item.fundRecordNumber}>
                                <span>{item.productName}({item.fundRecordNumber})</span>,
                                <span>币种：<span style={{ color: 'red' }}>{item.amacCurrency}</span></span>,
                                <span>托管机构(托管人名称)：<span style={{ color: 'red' }}>{item.trusteeName}</span></span>,
                                不支持，无法创建
                            </p>
                        ))
                    }
                </Modal>
            }
        </>
    );

};


NewProduct.defaultProps = {
};

NewProduct.propTypes = {
};


export default connect(({ loading }) => ({
    addLoading: loading.effects['NEW_PRODUCT/createBatch']
}))(NewProduct);
