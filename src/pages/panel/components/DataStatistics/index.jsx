import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Radio, Row, Col, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { listToMap } from '@/utils/utils';
import PageLoading from '@/pages/components/MakeNew/PageLoading';
import datastatistis1 from '@/assets/datastatistis/datastatistis1.png';
import datastatistis2 from '@/assets/datastatistis/datastatistis2.png';
import datastatistis3 from '@/assets/datastatistis/datastatistis3.png';
import datastatistis4 from '@/assets/datastatistis/datastatistis4.png';
import datastatistis5 from '@/assets/datastatistis/datastatistis5.png';
import styles from './styles.less';
import { history } from 'umi';
import moment from 'moment';

const radioOptions = [
    {
        label: '本周',
        value: 1
    },
    {
        label: '本月',
        value: 2
    },
    {
        label: '今年',
        value: 3
    }
];

const currencyOptions = [
    {
        label: 'CNY',
        value: 1
    },
    {
        label: 'USD',
        value: 2
    },
    {
        label: 'HKD',
        value: 3
    }
];


/*
 * @descripttion: 面板数据统计
 */
const DataStatistics = ({ title, dispatch, loading = false, update = 0 }) => {
    const [radioValue, setRadioValue] = useState(1); //时间
    const [currency, setCurrency] = useState(1); // 币种
    const [data, setData] = useState({}); // 数据

    const statisticTree = [
        {
            title: '持有人(认申购/赎回)',
            prop: 'newHolderSubscribe',
            prop1: 'newHolderRedeem',
            icon: datastatistis1,
            size: 4,
            color: '#F7FAFF',
            type: 1,
            leftType: '1,2',
            rightType: 3
        },
        {
            title: '新增注册客户',
            prop: 'newCustomer',
            icon: datastatistis2,
            size: 4,
            color: '#FFF5E9',
            type: 2
        },
        {
            title: '产品数量(新增)',
            prop: 'newProduct',
            prop1: 'productLiquidation',
            icon: datastatistis3,
            size: 4,
            color: '#FBF7FF',
            type: 2,
            leftType: 1,
            rightType: 3
        },
        {
            title: `募集规模(申/赎)(${listToMap(currencyOptions)[currency]})`,
            prop: 'offeringSizeSubscribe',
            prop1: 'offeringSizeRedeem',
            icon: datastatistis4,
            size: 4,
            color: '#FFF8F7',
            tips: (
                <Tooltip title="新增募集规模=区间内所有产品的认申购数据加总">
                    <InfoCircleOutlined />
                </Tooltip>
            ),
            type: 1,
            leftType: '1,2',
            rightType: 3
        },
        {
            title: `新增管理规模(${listToMap(currencyOptions)[currency]})`,
            prop: 'managementScale',
            icon: datastatistis5,
            size: 4,
            color: '#F4FAFF',
            tips: (
                <Tooltip title="新增管理规模=区间内所有产品净值*份额数据相减。本周是当日-上周最后一个交易日数据；本月是当日-上月最后一个交易日数据；今年是当日-去年最后一个交易日数据。">
                    <InfoCircleOutlined />
                </Tooltip>
            ),
            type: 2
        }
    ];

    const queryData = () => {
        dispatch({
            type: 'panel/queryDataStatistics',
            payload: {
                period: radioValue,
                currencyType: currency
            },
            callback: (res) => {
                if (res.code === 1008) {
                    setData(res.data);
                }
            }
        });
    };
    useEffect(() => {
        queryData();
    }, [radioValue, currency, update]);

    const _changeTabs = (e) => {
        setRadioValue(e.target.value);
    };

    /**
     * @description 跳转到对应的页面
     */
    const goDetailPage = (item, params) => {
        let rangeDate = '';
        if (radioValue === 1) {
            rangeDate = `${moment().startOf('week').valueOf()}-${moment().endOf('week').valueOf()}`;
        } else if (radioValue === 2) {
            rangeDate = `${moment().startOf('month').valueOf()}-${moment().endOf('month').valueOf()}`;
        } else if (radioValue === 3) {
            rangeDate = `${moment().startOf('year').valueOf()}-${moment().endOf('year').valueOf()}`;
        }
        if (item.prop === 'newHolderSubscribe') {
            history.push(`/operation/transactionInfo/TransactionList/${moment().valueOf()}?rangeDate=${rangeDate}&tradeTypes=${params}`);
        } else if (item.prop === 'newCustomer') {
            history.push(`/investor/customerInfo/${moment().valueOf()}?rangeDate=${rangeDate}`);
        } else if (item.prop === 'newProduct') {
            history.push(`/product/list/${moment().valueOf()}?rangeDate=${rangeDate}&currency=${currency}`);
        } else if (item.prop === 'offeringSizeSubscribe') {
            history.push(`/operation/transactionInfo/TransactionList/${moment().valueOf()}?rangeDate=${rangeDate}&tradeTypes=${params}`);
        }
    };

    return (
        <Card
            headStyle={{
                borderBottom: 'none'
            }}
            bodyStyle={{
                padding: 0
            }}
            bordered={false}
            title={title}
            extra={
                <Radio.Group
                    options={radioOptions}
                    onChange={_changeTabs}
                    value={radioValue}
                    optionType="button"
                    buttonStyle="solid"
                />
            }
        >
            <PageLoading loading={Boolean(loading)}>
                <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                    {statisticTree.map((item, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: item.color }}
                            className={styles.statisticContent}
                        >
                            <div>
                                <span>
                                    {item.title}
                                    {item.tips}
                                </span>
                                <h4 style={{ fontWeight: 700, fontSize: 18 }}>
                                    {item.type === 1
                                        ? <><span style={{ cursor: 'pointer' }} onClick={() => goDetailPage(item, item.leftType)}>{data[item.prop] && '+' + data[item.prop] || '--'}</span> / <span style={{ cursor: 'pointer' }} onClick={() => goDetailPage(item, item.rightType)}>{data[item.prop1] && '-' + data[item.prop1] || '--'}</span></>
                                        : <span style={{ cursor: 'pointer' }} onClick={() => goDetailPage(item)}>{data[item.prop] || '--'}</span>}
                                </h4>
                                <img src={item.icon} alt="" />
                            </div>
                        </div>
                    ))}
                </div>
            </PageLoading>
            <Row gutter={24} style={{ padding: '0 12px' }}>
                <Col xl={24} lg={24} md={24} sm={24} xs={24} className={styles.currencyRadio}>
                    <Radio.Group
                        options={currencyOptions}
                        onChange={(e) => setCurrency(e.target.value)}
                        value={currency}
                        optionType="button"
                    // buttonStyle="solid"
                    />
                </Col>
            </Row>
        </Card>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['panel/queryDataStatistics']
}))(DataStatistics);
