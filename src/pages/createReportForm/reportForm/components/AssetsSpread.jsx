/*
 * @description: 资产分布
 * @Author: tangsc
 * @Date: 2021-03-29 14:35:30
 */
import React, { useState } from 'react';
import { connect } from 'umi';
import { Card, Empty, Modal } from 'antd';
import styles from '../index.less';
import ReactEcharts from 'echarts-for-react';
import { uploadIcon } from '@/utils/iconList';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import BatchUpload from '@/pages/components/batchUpload';
import { getCookie } from '@/utils/utils';
import { isEmpty } from 'lodash-es';

const { confirm } = Modal;

const AssetsSpread = (props) => {

    const { createReportForm, dispatch } = props;

    const { isShowa } = createReportForm;

    const [batchUploadModalFlag, setBatchUploadModalFlag] = useState(false);

    const [chartData1, setChartData1] = useState({});

    const [chartData2, setChartData2] = useState({});

    const _toggle = () => {
        setBatchUploadModalFlag((o) => !o);
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
                        assetAllocation: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    const _callback = (res) => {
        if (res.code === 1008 && res.data) {
            const { industry, position } = res.data;
            let industryX = [];
            let industryY = [];
            let positionX = [];
            let positionY = [];
            let tempObj1 = {};
            let tempObj2 = {};
            if (!isEmpty(industry)) {
                industry.forEach((item) => {
                    industryX.push(item.name);
                    industryY.push(item.value);
                });
                tempObj1 = {
                    industryX,
                    industryY
                };
            }
            if (!isEmpty(position)) {
                position.forEach((item) => {
                    positionX.push(item.name);
                    positionY.push(item.value);
                });
                tempObj2 = {
                    positionX,
                    positionY
                };
            }
            setChartData1(tempObj1);
            setChartData2(tempObj2);
        }

    };

    const option = {
        title: {
            text: '前十大行业分布（申万一级行业分类）',
            left: 'center',
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: chartData1.industryX,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    // interval: 2,
                    rotate: 45
                    //倾斜度 -90 至 90 默认为0
                    // margin: 10
                    // textStyle: {
                    //     fontWeight: 'bolder',
                    //     color: '#000000'
                    // }
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '百分比',
                type: 'bar',
                barWidth: 25,
                data: chartData1.industryY
            }
        ],
        color: ['red']
    };
    const option1 = {
        title: {
            text: '持仓分布',
            left: 'center',
            textStyle: {
                fontSize: 14
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: chartData2.positionX,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                // interval: 2,
                rotate: 45
                //倾斜度 -90 至 90 默认为0
                // margin: 10
                // textStyle: {
                //     fontWeight: 'bolder',
                //     color: '#000000'
                // }
            }
        },
        yAxis: {
            type: 'value'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        series: [{
            name: '百分比',
            type: 'bar',
            barWidth: 25,
            data: chartData2.positionY
        }],
        color: ['red']
    };

    return (
        <Card className={styles.assetsSpreadBox}>
            <h4><strong>资产分布</strong></h4>
            <div className={styles.chartWrapper}>
                {
                    !isEmpty(chartData2) &&
                    <div className={styles.chartItem}>
                        <ReactEcharts
                            option={option1}
                        />
                    </div>
                }
                {
                    !isEmpty(chartData1) &&
                    <div className={styles.chartItem}>
                        <ReactEcharts
                            option={option}
                        />
                    </div>
                }
            </div>
            {
                isEmpty(chartData1) && isEmpty(chartData2) &&
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }
            {
                isShowa && <span onClick={_toggle}>{uploadIcon}</span>
            }
            {
                isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
            }
            {
                batchUploadModalFlag &&
                <BatchUpload
                    modalFlag={batchUploadModalFlag}
                    closeModal={_toggle}
                    templateMsg="模板下载"
                    onOk={_toggle}
                    templateUrl={`/report/downloadTemplate?tokenId=${getCookie('vipAdminToken')}`}
                    // params={{ productId: productId ? Number(productId) : undefined }}
                    url="/report/uploadProperty"
                    callback={_callback}
                />
            }
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(AssetsSpread);
