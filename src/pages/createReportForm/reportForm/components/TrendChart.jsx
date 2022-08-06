/*
 * @description: 走势图
 * @Author: tangsc
 * @Date: 2021-03-29 14:31:32
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Radio, Modal } from 'antd';
import styles from '../index.less';
import ReactEcharts from 'echarts-for-react';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import moment from 'moment';

const { confirm } = Modal;
const options = [
    { label: '近一周', value: '1' },
    { label: '近一月', value: '2' },
    { label: '近三月', value: '3' },
    { label: '近半年', value: '4' },
    { label: '近一年', value: '5' },
    { label: '近三年', value: '6' }
];

const TrendChart = (props) => {


    const { createReportForm: { isShowa, customFormData = {} }, dispatch } = props;

    const [radioValue, setRadioValue] = useState('1');
    const [chartsData, setChartsData] = useState({});

    const _handleChange = (e) => {
        setRadioValue(e.target.value);
    };


    /**
     * @description: 删除模块
     */
    const _deleteModule = () => {
        confirm({
            title: '请您确认是否删除该模块?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'createReportForm/updateState',
                    payload: {
                        isNetValueTrends: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    const sortData = (data) => {
        let legendArr = [];
        let lineName = '';
        if (!isEmpty(data)) {
            lineName = data[0].standardName;
            legendArr = [lineName, '单位净值', '累计净值'];
        }
        let xArr = [];
        let netValueArr = [];
        let benchmarkArr = [];
        let acumulateNetValueArr = [];
        // "productId": 658842,
        // "productName": "赎回测试",
        // "netDate": "2020-11-02",
        // "netValue": 3.686,
        // "acumulateNetValue": 3.686,
        // "inflationHas": 1.4433,
        // "standardName": "上证50",
        // "standardCode": 46,
        // "setDate": 1616342400000
        Array.isArray(data) &&
            data.forEach((item) => {
                xArr.push(item.netDate);
                netValueArr.push(item.netValue);
                benchmarkArr.push((item.inflationHas));
                acumulateNetValueArr.push(item.acumulateNetValue);
            });
        let tempObj = {};
        tempObj.legendArr = legendArr;
        tempObj.xArr = xArr;
        tempObj.lineName = lineName;
        tempObj.netValueArr = netValueArr;
        tempObj.benchmarkArr = benchmarkArr;
        tempObj.acumulateNetValueArr = acumulateNetValueArr;
        setChartsData(tempObj);
    };

    useEffect(() => {
        if (!isEmpty(customFormData.netValueTrends)) {
            sortData(customFormData.netValueTrends.reverse());
        }
    }, [customFormData]);

    const option = {
        title: {
            text: '走势图'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: chartsData.legendArr
        },
        grid: {
            left: '5%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: chartsData.xArr
            // axisLabel: {
            // interval: 1,
            // rotate: 45,
            //倾斜度 -90 至 90 默认为0
            // margin: 10
            // textStyle: {
            //     fontWeight: 'bolder',
            //     color: '#000000'
            // }
            // }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: chartsData.lineName,
                type: 'line',
                // stack: '总量',
                showSymbol: false,
                data: chartsData.benchmarkArr,
                lineStyle: {
                    color: '#818BCD'
                },
                color: '#818BCD'
            },
            {
                name: '单位净值',
                type: 'line',
                // stack: '总量',
                showSymbol: false,
                data: chartsData.netValueArr,
                lineStyle: {
                    color: '#844F5F'
                },
                color: '#844F5F'
            },
            {
                name: '累计净值',
                type: 'line',
                // stack: '总量',
                showSymbol: false,
                data: chartsData.acumulateNetValueArr,
                lineStyle: {
                    color: '#D7A08A'
                },
                color: '#D7A08A'
            }
        ]
    };

    return (
        <Card className={styles.trendChartBox}>
            {/* <Radio.Group
                options={options}
                onChange={_handleChange}
                value={radioValue}
                optionType="button"
            /> */}
            <ReactEcharts
                option={option}
            />
            {
                isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
            }
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(TrendChart);