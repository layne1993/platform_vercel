import { Card, Col, Row, Radio } from 'antd';
import React, { useState } from 'react';
import { Bar } from './Charts';
import PageLoading from '@/pages/components/MakeNew/PageLoading';
import styles from '../style.less';

const radioOptions = [
    {
        label: '今年',
        value: 3
    },
    {
        label: '近一年',
        value: 4
    },
    {
        label: '本周',
        value: 1
    },
    {
        label: '本月',
        value: 2
    }
];

const SalesCard = ({ salesData, loading, title, tradeTimes, queryTradeTimes }) => {

    const [radioValue, setRadioValue] = useState(3);

    /*
    * @descripttion: 改变日期获取交易次数
    */
    const _changeTabs = (e) => {
        setRadioValue(e.target.value);
        queryTradeTimes(e.target.value);
    };

    return (
        <Card
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
            bordered={false}
            bodyStyle={{
                padding: 0
            }}
        >
            <div className={styles.salesCard}>
                <Row>
                    <Col span={24}>
                        <PageLoading loading={loading}>
                            <div className={styles.salesBar}>
                                <Bar
                                    height={575}
                                    title={null}
                                    // data={salesData}
                                    data={tradeTimes}
                                />
                            </div>
                        </PageLoading>
                    </Col>
                </Row>
            </div>
        </Card>
    );
};

export default SalesCard;
