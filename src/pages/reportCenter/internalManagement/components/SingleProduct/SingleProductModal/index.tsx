import React, { useState, useEffect, useRef } from 'react';
import { Modal, Spin, Select, Radio } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';
import * as echarts from 'echarts';

import { oneProductIndexQuery } from '../service';

import styles from './index.less';
const { Option } = Select;

interface propsTs {
    params: object;
}

const SingleProductModal: React.FC<propsTs> = (props) => {
    const { params } = props;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEchartsVisible, setIsEchartsVisible] = useState(true);
    const [tabValue, settabValue] = useState('0'); // tab 默认选中项
    const [flagArr, setflagArr] = useState<array>([true, false, false]); // 弹窗切换
    const [loading, setLoading] = useState(false);
    const [searchParams, setsearchParams] = useState({});
    const [current, setcurrent] = useState(0); // 当前选中类型

    const relativeObj = {
        xAxis: [],
        seriesO: [],
        seriesT: [],
    }; // 相对净值
    const backObj = {
        xAxis: [],
        seriesO: [],
        seriesT: [],
    }; // 相对净值
    const incomeRateObj = {
        xAxis: [],
        seriesO: [],
        seriesT: [],
    }; // 相对净值
    const [dataArr, setdataArr] = useState([relativeObj, backObj, incomeRateObj]);

    const selectObj = {
        '46': '上证50',
        '4978': '中证500',
        '3145': '沪深300',
        '39144': '中证1000',
    }; // 下拉码值

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onStandardChange = (value) => {
        searchParams.standard = value;
        params.standard = value;
        setsearchParams({ ...searchParams });
        oneProductIndexQueryAjax();
    };

    const callback = (e) => {
        const index = e.target.value;
        setcurrent(index);
        const arr = [false, false, false];
        arr[index] = true;
        setflagArr([...arr]);
        settabValue(index);
    };

    // 处理 option
    const dealOption = () => {
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            color: ['#1283D5', '#D52012'],
            legend: {
                itemHeight: 12,
                itemWidth: 12,
                bottom: 40,
                data: [
                    { name: params?.productName, icon: 'rect', color: 'red' },
                    { name: selectObj[params?.standard], icon: 'rect' },
                ],
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '25%',
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: dataArr[current]?.xAxis,
                axisTick: {
                    alignWithLabel: true,
                },
            },
            yAxis: {
                type: 'value',
            },
            series: [
                {
                    name: params?.productName,
                    type: 'line',
                    // stack: '总量',
                    data: dataArr[current]?.seriesO,
                    symbol: 'none',
                },
                {
                    name: selectObj[params?.standard],
                    type: 'line',
                    // stack: '总量',
                    data: dataArr[current]?.seriesT,
                    symbol: 'none',
                },
            ],
        };
        return option;
    };

    const formatData = (val) => parseFloat(val.toFixed(3));

    // 处理数据
    const dealDatarelativeObj = (arrO) => {
        relativeObj.xAxis = [];
        relativeObj.seriesO = [];
        relativeObj.seriesT = [];
        arrO.forEach((item) => {
            relativeObj.xAxis.push(item.date);
            relativeObj.seriesO.push(item.value ? formatData(item.value) : '');
            relativeObj.seriesT.push(item.baseValue ? formatData(item.baseValue) : '');
        });
        dataArr[0] = relativeObj;
        setdataArr([...dataArr]);
    };

    const dealDataBackObj = (arrT) => {
        backObj.xAxis = [];
        backObj.seriesO = [];
        backObj.seriesT = [];
        arrT.forEach((item) => {
            backObj.xAxis.push(item.date);
            backObj.seriesO.push(item.value ? formatData(item.value) : '');
            backObj.seriesT.push(item.baseValue ? formatData(item.baseValue) : '');
        });
        dataArr[1] = backObj;
        setdataArr([...dataArr]);
    };

    const dealDataIncomeRateObj = (arrTh) => {
        incomeRateObj.xAxis = [];
        incomeRateObj.seriesO = [];
        incomeRateObj.seriesT = [];
        arrTh.forEach((item) => {
            incomeRateObj.xAxis.push(item.date);
            incomeRateObj.seriesO.push(item.value ? formatData(item.value) : '');
            incomeRateObj.seriesT.push(item.baseValue ? formatData(item.baseValue) : '');
        });
        dataArr[2] = incomeRateObj;
        setdataArr([...dataArr]);
    };

    // 接口调用
    const oneProductIndexQueryAjax = async () => {
        setLoading(true);
        const res = await oneProductIndexQuery({
            ...params,
            ...searchParams,
        });
        if (+res.code === 1001) {
            const { relativeNetValue, back, incomeRate } = res.data;
            if (relativeNetValue) dealDatarelativeObj(relativeNetValue);
            if (back) dealDataBackObj(back);
            if (incomeRate) dealDataIncomeRateObj(incomeRate);
        }
        setLoading(false);
    };

    useEffect(() => {
        isModalVisible && oneProductIndexQueryAjax();
    }, [isModalVisible]);

    useEffect(() => {
        if (!isModalVisible) return;

        flagArr.forEach((item, index) => {
            if (item) {
                const dom = document.getElementById(`main${index}`);
                let myChart = echarts.init(dom);
                myChart.clear();
                console.log(current, 'current 值为');
                console.log(dataArr, 'dataArr');
                myChart.setOption(dealOption());
            }
        });
    });

    return (
        <>
            <LineChartOutlined
                onClick={showModal}
                style={{ color: '#3d7fff', height: 20, width: 20, marginRight: 16 }}
            />
            <Modal
                title="指标对比"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                width={700}
                footer={[]}
            >
                <Spin spinning={loading}>
                    <div className={styles.searchBox}>
                        <Radio.Group value={tabValue} onChange={callback}>
                            <Radio.Button value="0">相对净值</Radio.Button>
                            <Radio.Button value="1">回撤率</Radio.Button>
                            <Radio.Button value="2">收益率</Radio.Button>
                        </Radio.Group>

                        <div>
                            比较基准:
                            <Select
                                defaultValue="沪深300"
                                style={{ marginLeft: 16, width: 120 }}
                                onChange={onStandardChange}
                                value={searchParams.standard}
                            >
                                <Option value={3145}>沪深300</Option>
                                <Option value={46}>上证50</Option>
                                <Option value={4978}>中证500</Option>
                                <Option value={39144}>中证1000</Option>
                            </Select>
                        </div>
                    </div>
                    {flagArr[0] && (
                        <div id="main0" style={{ height: '470px', width: '100%' }}></div>
                    )}
                    {flagArr[1] && (
                        <div id="main1" style={{ height: '470px', width: '100%' }}></div>
                    )}
                    {flagArr[2] && (
                        <div id="main2" style={{ height: '470px', width: '100%' }}></div>
                    )}
                </Spin>
            </Modal>
        </>
    );
};

export default SingleProductModal;
