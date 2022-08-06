import React, { useState, useEffect } from 'react';
import { Modal, Button, notification, Form, Row, Col, Select, Input } from 'antd';
import { connect } from 'umi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { XWFundRiskLevel, XWShelfStatus, XWReservationStatus, XWPurchaseStatus } from '@/utils/publicData';
import styles from './styles.less';
const { Option } = Select;
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 1
    });
};

const share = {
    2: 'A',
    3: 'B',
    4: 'C',
    5: 'D',
    6: 'E'
};

const SplitShare = (props) => {
    const [flag, setFlag] = useState(false);
    const [productId, setProductId] = useState('');
    const [productInfo, setProducInfo] = useState('');
    const [form] = Form.useForm();
    const [dataList, setDataList] = useState([]);
    const [data, setData] = useState([]);
    const getProductList = () => {
        // return new Promise((resolve, reject) => {
        // let formData = new window.FormData();
        // formData.fundLevel = 0;
        // request.postJSON('/product/queryByProductName', formData).then((res) => {
        //     if (res && res.code === 1008) {
        //         setDataList(res.data);
        //     }
        //     resolve(res);
        // });
        props.dispatch({
            type: 'productList/queryByProductName',
            payload: {
                fundLevel: 0
            },
            callback: (res) => {
                setDataList(res.data);
            }
        });
        // });
    };
    useEffect(() => {
        console.log(props);
        getProductList();
        form.setFieldsValue({
            'shareSplitProducts': []
        });
    }, []);

    const saveInfo = (values) => {
        const shareCategory = [];
        const pbInternalProductCode = [];
        if (values.shareSplitProducts.length <= 0) {
            return null;
        }
        values.shareSplitProducts.forEach((item) => {
            shareCategory.push(item.shareCategory);
            pbInternalProductCode.push(item.pbInternalProductCode);
        });
        if ([...new Set(shareCategory)].length !== shareCategory.length) {
            openNotification('warning', '提示', '份额类别不能一样');
            return;
        }
        if ([...new Set(pbInternalProductCode)].length !== pbInternalProductCode.length) {
            openNotification('warning', '提示', '托管机构内部产品代码不能一样');
            return;
        }
        props.dispatch({
            type: 'productList/spiltShareValue',
            payload: {
                parentProductId: productId,
                shareSplitProducts: values.shareSplitProducts.map((item) => {
                    return {
                        ...item,
                        tradeTypes: JSON.stringify(item.tradeTypes)
                    };
                })
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '保存成功');
                    setProductId('');
                    setFlag(false);
                } else {
                    openNotification('warning', '提示', res.message);
                }
            }
        });

        return;
    };

    const changeProductName = (value) => {
        dataList.map((item) => item.productId === value && setProducInfo(item));
        setProductId(value);
        props.dispatch({
            type: 'productList/getSubFund',
            payload: {
                parentProductId: value
            },
            callback: (res) => {
                if (res.code === 1008) {
                    console.log(res.data);
                    const shareSplitProducts = res.data.map((item) => {
                        return {
                            ...item,
                            tradeTypes: JSON.parse(item.tradeTypes),
                            disabled: item.shareCategory && item.pbInternalProductCode, // 查询回来的不能删，前两个字段不能编辑
                            isOld:true
                        };
                    }) || [];
                    form.setFieldsValue({
                        'shareSplitProducts': shareSplitProducts
                    });
                    setData(shareSplitProducts);
                }
            }
        });
    };

    const addFunc = (fun) => {
        if (productId) {
            const { riskType, publishStatus, appointmentStatus, tradeTypes } = productInfo;
            fun({
                riskType, publishStatus, appointmentStatus,
                pbInternalProductCode: productInfo.fundRecordNumber,
                tradeTypes: JSON.parse(tradeTypes)
            });
        } else {
            openNotification('error', '请先选择产品');
        }
        // if()

    };

    const changeShare = (value, key) => {
        const alldata = form.getFieldsValue(true);
        console.log(alldata, value, key);
        if (alldata.shareSplitProducts[key] && !alldata.shareSplitProducts[key].pbInternalProductCode) {
            alldata.shareSplitProducts[key].pbInternalProductCode = productInfo.fundRecordNumber ? `${productInfo.fundRecordNumber.substr(-5)}${share[value]}` : share[value];
            form.setFieldsValue({
                'shareSplitProducts': alldata.shareSplitProducts
            });
        }
        // form.setFieldsValue({
        //     'users':[]
        // })
        // console.log('====================================');
        // console.log(key);
        // console.log('====================================');
    };
    return (
        <>
            {flag && (
                <Modal
                    visible={flag}
                    onCancel={() => { setProductId(''); setFlag(false); }}
                    maskClosable={false}
                    width={'80%'}
                    destroyOnClose
                    footer={
                        null
                    }
                    className={styles.modalWarp}
                >
                    <Row justify={'center'} align="middle">
                        <Col span={4}>
                            <span style={{ color: 'red' }}>*</span> 请选择产品：
                        </Col>
                        <Col offset={2} span={8}>
                            <Select
                                placeholder="请选择"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children &&
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                notFoundContent="暂无数据"
                                allowClear
                                style={{ width: '100%' }}
                                onChange={changeProductName}
                            // onFocus={_search}
                            >
                                {Array.isArray(dataList) &&
                                    dataList.map((item, i) => {
                                        return (
                                            <Select.Option key={i} value={item.productId}>
                                                {item.productName}
                                            </Select.Option>
                                        );
                                    })}
                            </Select>
                        </Col>
                    </Row>
                    <Form form={form} preserve={false} name="baseInfo" onFinish={saveInfo} style={{ marginTop: '20px' }} autoComplete="off">
                        <Form.List name="shareSplitProducts">
                            {(fields, { add, remove }) => (
                                <>
                                    <Row justify={'center'} gutter={16} style={{ marginBottom: 16 }}>
                                        <Col span={3}><div>份额类别</div></Col>
                                        <Col span={5}><div>托管机构内部产品代码</div></Col>
                                        <Col span={3}><div>风险等级</div></Col>
                                        <Col span={3}><div>上架状态</div></Col>
                                        <Col span={3}><div>是否可预约状态</div></Col>
                                        <Col span={3}><div>是否开放认申赎</div></Col>
                                        <Col span={1}>
                                            <PlusOutlined onClick={() => addFunc(add)} />
                                        </Col>
                                    </Row>
                                    {fields.map(({ key, name, fieldKey, ...restField }) => (
                                        // console.log(key, name, fieldKey, restField)
                                        <Row
                                            key={key}
                                            gutter={16}
                                            justify={'center'}
                                        >
                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'shareCategory']}
                                                    fieldKey={[fieldKey, 'shareCategory']}
                                                    rules={[

                                                        {
                                                            required: true,
                                                            message: '请选择份额类别'
                                                        }
                                                    ]}
                                                >
                                                    <Select disabled={data.length && name < data.length && data[name].disabled} onChange={(value) => changeShare(value, name)} placeholder="请选择份额类别">
                                                        <Select.Option value={2}>A</Select.Option>
                                                        <Select.Option value={3}>B</Select.Option>
                                                        <Select.Option value={4}>C</Select.Option>
                                                        <Select.Option value={5}>D</Select.Option>
                                                        <Select.Option value={6}>E</Select.Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={5}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'pbInternalProductCode']}
                                                    fieldKey={[fieldKey, 'pbInternalProductCode']}

                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入托管机构内部产品代码'
                                                        }
                                                    ]}
                                                >
                                                    <Input disabled={data.length && name < data.length && data[name].disabled} placeholder="请输入产品代码" />
                                                </Form.Item>
                                            </Col>

                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'riskType']}
                                                    fieldKey={[fieldKey, 'riskType']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择风险等级'
                                                        }
                                                    ]}
                                                >
                                                    <Select placeholder="请选择风险等级" allowClear>
                                                        {
                                                            XWFundRiskLevel.map((item) => (
                                                                <Option value={item.value} key={item.value}>{item.label || '--'}</Option>
                                                            ))
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'publishStatus']}
                                                    fieldKey={[fieldKey, 'publishStatus']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择上架状态'
                                                        }
                                                    ]}
                                                >
                                                    <Select placeholder="请选择" allowClear>
                                                        {XWShelfStatus.map((item) => (
                                                            <Option key={item.value} value={item.value}>
                                                                {item.label}
                                                            </Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={3}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'appointmentStatus']}
                                                    fieldKey={[fieldKey, 'appointmentStatus']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择预约状态'
                                                        }
                                                    ]}
                                                >
                                                    <Select placeholder="请选择" allowClear>
                                                        {
                                                            XWReservationStatus.map((item) => {
                                                                return (
                                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>

                                            <Col span={3}>


                                                <Form.Item
                                                    {...restField}
                                                    name={[name, 'tradeTypes']}
                                                    fieldKey={[fieldKey, 'tradeTypes']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择是否开放认申赎'
                                                        }
                                                    ]}
                                                >
                                                    <Select mode="multiple" placeholder="请选择" allowClear>
                                                        {
                                                            XWPurchaseStatus.map((item) => {
                                                                return (
                                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            {
                                                data.length && name < data.length && data[name].isOld ? <Col span={1}></Col> : <Col span={1}>
                                                    <MinusCircleOutlined onClick={() => { console.log(name); remove(name); }} />
                                                </Col>

                                            }

                                        </Row>

                                    ))}
                                </>
                            )}
                        </Form.List>
                        <Row style={{ marginTop: 40 }}>
                            <Col span={4} offset={20} >
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        保存
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>

                    </Form>
                </Modal>
            )}

            <Button type="primary" onClick={() => { getProductList(); setFlag(true); }}>
                拆分AB份额
            </Button>
        </>
    );
};

export default connect(({ productList }) => ({
    productList
}))(SplitShare);

SplitShare.defaultProps = {};

SplitShare.propTypes = {};
