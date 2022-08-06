import React, { useEffect, useState } from 'react';

import { PageHeaderWrapper } from '@ant-design/pro-layout';

import axios from 'axios';

import { getCookie } from '@/utils/utils';

import { Card, Form, Button, DatePicker, Radio, Input, Select, Spin, message } from 'antd';

import moment from 'moment';

import ProductModalMulti from './components/ProductModalMulti';

import Weekly from './reports/weekly';

import Monthly from './reports/month';

import Daily from './reports/daily';
import Quarter from './reports/quarter';
import Year from './reports/year';

import styles from './index.less';

const { RangePicker, WeekPicker } = DatePicker;

const { Option } = Select;

const GenerateReport: React.FC<{}> = (props) => {
    const [visible, setVisible] = useState(false);

    const [productName, setProductName] = useState([]);

    const [loading, setloading] = useState<boolean>(false);

    const [reportType, setReportType] = useState<string>('weekly');

    const [dimension, setDimension] = useState<string>('product');

    const [interestType, setInterestType] = useState<number>(1);

    const [form] = Form.useForm();

    const onProductSel = () => {
        setVisible(true);
    };

    const handleSubmit = (data) => {
        const productIdArr = [];

        const productNameArr = [];

        if (dimension === 'customer') {
            data.forEach((item) => {
                productIdArr.push(item.customerId);

                productNameArr.push(item.customerName);
            });
        } else {
            data.forEach((item) => {
                productIdArr.push(item.productId);

                productNameArr.push(item.productName);
            });
        }

        form.setFieldsValue({
            productId: productIdArr,
        });

        setProductName(productNameArr);

        setVisible(false);
    };

    const layout = {
        labelCol: { span: 4 },

        wrapperCol: { span: 10 },
    };

    const typeArr = [
        { label: '日报', value: 'daily' },

        { label: '周报', value: 'weekly' },

        { label: '月报', value: 'monthly' },

        { label: '季报', value: 'quarter' },

        { label: '年报', value: 'year' },
    ];

    const dimensionArr = [
        { label: '客户', value: 'customer' },

        { label: '产品', value: 'product' },
    ];

    const interestArr = [
        { label: '是', value: 1 },

        { label: '否', value: 2 },
    ];

    const handleChangeType = (e) => {
        setReportType(e.target.value);

        form.setFieldsValue({
            productId: [],
        });

        setProductName([]);

        if (e.target.value === 'daily') {
            setDimension('customer');

            form.setFieldsValue({
                dimension: 'customer',
            });
        } else {
            setDimension('product');

            form.setFieldsValue({
                dimension: 'product',
            });
        }
    };

    const handleChangeDimen = (e) => {
        setDimension(e.target.value);

        // 清空产品

        setProductName([]);
    };

    const handleChangeInterest = (e) => {
        setInterestType(e.target.value);
    };

    const renderComponent = () => {
        switch (reportType) {
            case 'daily':
                return <Daily parentForm={form} />;

                break;

            case 'weekly':
                return <Weekly dimension={dimension} parentForm={form} />;

                break;

            case 'monthly':
                return (
                    <Monthly
                        parentForm={form}
                        interestType={interestType}
                        productNames={productName}
                    />
                );
                break;
            case 'quarter':
                return (
                    <Quarter
                        parentForm={form}
                        interestType={interestType}
                        productNames={productName}
                    />
                );
                break;
            case 'year':
                return (
                    <Year
                        parentForm={form}
                        interestType={interestType}
                        productNames={productName}
                    />
                );
        }
    };

    const onDownClick = () => {
        props.history.push('/reportCenter/library/list/downRecord');
    };

    useEffect(() => {
        form.setFieldsValue({
            reportType: 'weekly',

            dimension: 'product',

            interestType: 1,
        });
    }, []);

    return (
        <PageHeaderWrapper title={'生成报告'}>
            <Spin spinning={loading}>
                <Card>
                    <Form form={form} {...layout}>
                        <div className={styles.boxItem}>
                            <div className={styles.topTitle}>
                                <div>产品选择 {console.log(getCookie('email'))}</div>

                                {getCookie('email').indexOf('yuanxin') !== -1 && (
                                    <Button type="primary" onClick={onDownClick}>
                                        下载记录
                                    </Button>
                                )}
                            </div>

                            <Form.Item
                                name="reportType"
                                label="报告形式"
                                rules={[{ required: true }]}
                            >
                                <Radio.Group options={typeArr} onChange={handleChangeType} />
                            </Form.Item>

                            {reportType === 'weekly' ? (
                                <Form.Item
                                    name="dimension"
                                    label="报表维度"
                                    rules={[{ required: true }]}
                                >
                                    <Radio.Group
                                        options={dimensionArr}
                                        onChange={handleChangeDimen}
                                    />
                                </Form.Item>
                            ) : null}

                            {reportType === 'daily' || reportType === 'weekly' ? null : (
                                <Form.Item
                                    name="interestType"
                                    label="是否单利"
                                    rules={[{ required: true }]}
                                >
                                    <Radio.Group
                                        options={interestArr}
                                        onChange={handleChangeInterest}
                                    />
                                </Form.Item>
                            )}

                            <Form.Item
                                name="productId"
                                label={dimension === 'product' ? '产品选择' : '客户选择'}
                                rules={[{ required: true }]}
                            >
                                <Form.Item noStyle>
                                    <Button type="primary" onClick={onProductSel}>
                                        {dimension === 'product' ? '产品选择' : '客户选择'}
                                    </Button>
                                </Form.Item>

                                <span style={{ marginLeft: 12 }}>{productName.join(', ')}</span>
                            </Form.Item>

                            {reportType === 'quarter' ? (
                                <Form.Item
                                    label="季度报告"
                                    name="quarter"
                                    rules={[{ required: true, message: '请选择报告季度' }]}
                                >
                                    <DatePicker picker="quarter" />
                                </Form.Item>
                            ) : reportType === 'year' ? (
                                <Form.Item
                                    label="年度报告"
                                    name="year"
                                    rules={[{ required: true, message: '请选择报告年度' }]}
                                >
                                    <DatePicker picker="year" />
                                </Form.Item>
                            ) : (
                                <>
                                    <Form.Item
                                        label="报告开始日期"
                                        name="dateStart"
                                        rules={[{ required: false, message: '请选择报告开始日期' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>

                                    <Form.Item
                                        label="报告结束日期"
                                        name="dateEnd"
                                        rules={[{ required: true, message: '请选择报告结束日期' }]}
                                    >
                                        <DatePicker />
                                    </Form.Item>
                                </>
                            )}
                        </div>
                    </Form>

                    {renderComponent()}
                </Card>

                <ProductModalMulti
                    visible={visible}
                    dimension={dimension}
                    handleCancel={() => setVisible(false)}
                    handleSubmit={handleSubmit}
                />
            </Spin>
        </PageHeaderWrapper>
    );
};

export default GenerateReport;
