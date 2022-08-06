import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import axios from 'axios';
import { getCookie } from '@/utils/utils';
import { Card, Form, Button, DatePicker, Radio, Input, Select, Spin, message } from 'antd';
import * as echarts from 'echarts';
import moment from 'moment';
import {
    getDailyEchartsData,
    monthlyReportgetTemplateList,
    getReportTemplateAjax,
    getReportColorData,
} from '../../../service';

import styles from './index.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

// const customerSource = [{ value: 'dayReport', label: '测试' }];

const GenerateReport: React.FC<{}> = (props) => {
    const { parentForm } = props;
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [tempalteArr, setTempalteArr] = useState([]);
    const [colorArr, setColorArr] = useState([]);

    const [form] = Form.useForm();

    const onCancel = () => {
        history.go(-1);
    };

    // 获取模板下拉
    const getMonthlyReportgetTemplateList = async () => {
        const res = await getReportTemplateAjax({
            reportForm: 3,
            reportDimension: 1,
        });
        if (+res.code === 1001) {
            setTempalteArr(res.data);
        }
    };

    const getColorDatas = async (id) => {
        const params = {
            reportForm: 3,
            reportDimension: 1,
            parentId: id,
        };
        const res = await getReportColorData(params);
        if (+res.code === 1001) {
            form.setFieldsValue({
                templateName: '',
            });
            setColorArr(res.data);
        }
    };

    const onDownReport = async () => {
        try {
            const parentValues = await parentForm.validateFields();
            const values = await form.validateFields();
            parentValues.dateStart = parentValues.dateStart
                ? moment(parentValues.dateStart).format('YYYY-MM-DD')
                : null;
            parentValues.dateEnd = moment(parentValues.dateEnd).format('YYYY-MM-DD');
            const params = { ...values, ...parentValues };
            getEchartsDatas(params);
        } catch (err) {
            console.log(err, 'err');
            if (err.errorFields) {
                message.warning('请检查必填项');
            }
        }
    };

    const getEchartsDatas = async (formData) => {
        setDownloadLoading(true);
        const params = {
            customerIds: formData.productId,
            dateStart: formData.dateStart,
            dateEnd: formData.dateEnd,
        };
        const res = await getDailyEchartsData(params);
        setEchartsData(res.data, formData);
    };

    const setEchartsData = (data, formData) => {
        const urls = data.map((echartData) => {
            const product_xAxisData =
                echartData.investmentDateParams?.map((item) => item.investDate) || [];
            product_xAxisData.sort((a, b) => moment(a) - moment(b));

            let series = [
                {
                    name: '组合累计收益',
                    showSymbol: false,
                    type: 'line',
                    connectNulls: true,
                    data: [],
                    lineStyle: {
                        width: 1.5,
                        shadowColor: 'rgba(0,0,0,0.5)',
                        shadowBlur: 4,
                        shadowOffsetY: 5,
                    },
                },
            ];

            for (let i = 0; i < product_xAxisData.length; i++) {
                series[0].data[i] = '';
                for (let val of echartData.investmentDateParams) {
                    if (val.investDate === product_xAxisData[i]) {
                        series[0].data[i] = val.returnRate * 100;
                    }
                }
            }
            const echartsDom = document.getElementById('echartsId');
            echartsDom.innerHTML = '<div id="echartsline" style="height: 100%;"></div>';
            const myChart = echarts.init(document.getElementById('echartsline'));
            let promise = new Promise((resolve, reject) => {
                myChart.clear();
                // 绘制图表
                myChart.setOption(
                    {
                        title: { show: false },
                        tooltip: {},
                        legend: {
                            data: ['组合累计收益'],
                        },
                        color: ['#C92711'],
                        xAxis: {
                            data: product_xAxisData,
                            nameTextStyle: {
                                fontSize: 16,
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#000',
                                },
                            },
                        },
                        yAxis: {
                            nameTextStyle: {
                                fontSize: 16,
                            },
                            axisLine: {
                                show: true,
                                lineStyle: {
                                    color: '#000',
                                },
                            },
                            axisLabel: {
                                formatter: '{value} %',
                            },
                        },
                        series: series,
                    },
                    true,
                );
                myChart.on('finished', function () {
                    resolve();
                });
            });
            let echarturl = promise.then(() => {
                // 请求生成word
                let url = myChart.getDataURL({
                    type: 'png',
                    pixelRatio: 2,
                    backgroundColor: '#fff',
                });
                return url;
            });
            return { customerId: echartData.customerId, echarturl };
        });
        dispatchExportWord(urls, formData);
    };

    const dispatchExportWord = async (urls, formData) => {
        const echartUrls = urls.map((item) => item.echarturl);
        Promise.all(echartUrls).then((res) => {
            let params = {
                reportName: formData.reportName,
                customerIds: formData.productId,
                dateStart: formData.dateStart,
                dateEnd: formData.dateEnd,
                templateName: formData.templateName,
                remark: formData.remark,
            };
            params.customerIdImgListStr = res.map((item, index) => {
                return {
                    customerId: urls[index].customerId,
                    imgInfo: item.replace('data:image/png;base64,', ''),
                };
            });
            _postDownload('/mrp_analysis/dailyReport/exportDailyReport', params);
        });
    };

    const _postDownload = (url, data) => {
        axios({
            url: `${BASE_PATH.adminUrl}${url}`,
            data,
            method: 'post',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json; application/octet-stream',
                tokenId: getCookie('vipAdminToken') || '',
            },
        })
            .then((response) => {
                // console.log('response', response);
                let fileName = response.headers['content-disposition']
                    .split(';')[1]
                    .split('filename=')[1]
                    .split('.doc')[0];
                fileName = decodeURIComponent(fileName); // eslint-disable-next-line no-undef
                let blob = new Blob([response.data], {
                    type: 'application/msword', //word文档为msword,pdf文档为pdf，msexcel 为excel
                });
                let downloadElement = document.createElement('a');
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                downloadElement.download = fileName;
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
                setDownloadLoading(false);
            })
            .catch(function (error) {
                message.warning('下载失败!');
                setDownloadLoading(false);
            });
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 10 },
    };

    const radioArr = [
        { label: '根号250', value: '250' },
        { label: '根号252', value: '252' },
    ];

    useEffect(() => {
        form.setFieldsValue({
            flag: '250',
            entity: 'hs300',
        });

        getMonthlyReportgetTemplateList();
    }, []);

    return (
        <>
            <Form form={form} {...layout}>
                <div className={styles.boxItem}>
                    <div className={styles.topTitle}>产品指标设置</div>
                    <Form.Item name="flag" label="指标年化方式">
                        <Radio.Group options={radioArr} />
                    </Form.Item>

                    <Form.Item name="percent" label="无风险收益率">
                        <Input suffix="%" />
                    </Form.Item>

                    <Form.Item name="entity" label="基准选择">
                        <Select>
                            <Option value="hs300">沪深300</Option>
                        </Select>
                    </Form.Item>
                </div>

                <div className={styles.boxItem}>
                    <div className={styles.topTitle}>报告模板设置</div>
                    <Form.Item
                        name="templateName1"
                        label="模板选择"
                        rules={[{ required: true, message: '请选择模板' }]}
                    >
                        <Select onChange={getColorDatas}>
                            {tempalteArr.map((item) => (
                                <Option value={item.id}>{item.reportShowName}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="templateName"
                        label="模板分类"
                        rules={[{ required: true, message: '请选择颜色分类' }]}
                    >
                        <Select>
                            {colorArr.map((item) => (
                                <Option value={item.reportName}>{item.colorName || '默认'}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="reportName" label="报告名称设置" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="remark" label="报告声明" rules={[{ required: true }]}>
                        <Input.TextArea />
                    </Form.Item>
                </div>
            </Form>

            <div className={styles.echartId} id="echartsId"></div>

            <div className={styles.bottomBox}>
                <Button onClick={onCancel} className={styles.btnCancel}>
                    取消
                </Button>
                <Button type="primary" onClick={onDownReport} loading={downloadLoading}>
                    生成并下载报告
                </Button>
            </div>
        </>
    );
};

export default GenerateReport;
