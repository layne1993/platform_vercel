import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from '@/utils/utils';
import { Form, Button, DatePicker, Radio, Input, Select, Spin, message } from 'antd';
import { RestOutlined } from '@ant-design/icons';
import moment from 'moment';
import {
    getMonthlyReportImgData,
    getReportTemplateAjax,
    getReportColorData,
} from '../../../service';
import { setEchartsData, setPositionStep, setTopTen } from './monthChart/ruiChart' // 中欧瑞博日报
import { setNingquanTrend, setPositionPie, setIndustryBar } from './monthChart/ningChart'; // 宁泉季度报表
import MatchModal from '../components/MatchModal';

import styles from './index.less';

const { Option } = Select;

const GenerateReport: React.FC<{}> = (props) => {
    const { parentForm, productNames } = props;
    const [downloadLoading, setDownloadLoading] = useState(false);
    const [tempalteArr, settempalteArr] = useState([]);
    const [colorArr, setColorArr] = useState([]);
    const [titleArr, setTitleArr] = useState([{ item: '', id: 1 }]);
    const [count, setCount] = useState(2);
    const [modalVisible, setModalVisible] = useState(false);

    const sinogram = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const [form] = Form.useForm();

    const onCancel = () => {
        history.go(-1);
    };

    // 删除标题
    const deleteItem = (index) => {
        const titleArray = titleArr.filter((i, j) => {
            return j !== index;
        });
        setTitleArr(titleArray);
    };
    // 增加标题
    const addItem = () => {
        if (titleArr.length < 5) {
            // titleArr.push({ item: '', id: count + 1 });
            setCount(count + 1);
            setTitleArr([...titleArr, { item: '', id: count + 1 }]);
        }
    };

    const getReportTemplate = async (data) => {
        const res = await getReportTemplateAjax(data);
        if (+res.code === 1001) {
            settempalteArr(res.data);
        }
    };

    const getColorDatas = async (val, option) => {
        const params = {
            reportForm: 5,
            reportDimension: 2,
            parentId: val,
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
            let newValues = { ...values };
            let count = 1;
            let num = 1;
            for (let i in values) {
                if (i.indexOf('title') !== -1) {
                    delete newValues[i];
                    newValues = { ...newValues, [`title${count}`]: values[i] };
                    count++;
                } else if (i.indexOf('content') !== -1) {
                    delete newValues[i];
                    newValues = { ...newValues, [`content${num}`]: values[i] };
                    num++;
                }
            }
            parentValues.dateStart = parentValues.year.format('YYYY') + '-01-01';
            parentValues.dateEnd = moment(parentValues.dateStart)
                .add(1, 'years')
                .subtract(1, 'days')
                .format('YYYY-MM-DD');
            const params = { ...newValues, ...parentValues };
            getMonthlyReportImgDatas(params);
        } catch (err) {
            console.log(err, 'err');
            if (err.errorFields) {
                message.warning('请检查必填项');
            }
        }
    };

    const getMonthlyReportImgDatas = async (formData) => {
        setDownloadLoading(true);
        const params = {
            title1: formData.title1 || '',
            title2: formData.title2 || '',
            title3: formData.title3 || '',
            title4: formData.title4 || '',
            title5: formData.title5 || '',
            content1: formData.content1 || '',
            content2: formData.content2 || '',
            content3: formData.content3 || '',
            content4: formData.content4 || '',
            content5: formData.content5 || '',
            productIds: formData.productId,
            dateStart: formData.dateStart,
            dateEnd: formData.dateEnd,
            standard: formData.standard,
            templateName: formData.templateName,
            singleOrTwo: formData.singleOrTwo,
            remark: formData.remark,
            reportName: formData.reportName,
            interestType: formData.interestType,
        };
        const res = await getMonthlyReportImgData(params);

        // 判断是否中欧季度报表, 还是青骊季度报表
        (formData.templateName.indexOf('ningquan') !== -1) && getNingChart(res, params); // 宁泉
        (formData.templateName.indexOf('ruibo') !== -1) && getRuiChart(res, params);  // 中欧瑞博
    };

    // 中欧瑞博季度报表画图
    const getRuiChart = (res, params) => {
        const productIdImgList = []
        new Promise((resolve, reject) => {
            let index = 0
            res.data.forEach(async item => {
                let asset = ''
                setPositionStep(item.imgInfo, item.productId).then(str => {
                    asset = str
                })
                let industry = ''
                setTopTen(item.imgInfo, item.productId).then(str => {
                    industry = str
                })

                let performance = ''
                setEchartsData(item.imgInfo, item.productId).then(str => {
                    performance = str

                    productIdImgList.push({
                        productId: item.productId,
                        imgInfo: {
                            performance,
                            asset,
                            industry,
                            productTrend: ''
                        }
                    })
                    index++
                    if (index === res.data.length) resolve(productIdImgList)
                })
            })

        }).then((productIdImgListStr) => {
            _postDownload('/mrp_analysis/monthlyReport/createMonthlyReport', {
                ...params,
                productIdImgListStr
            });
        })
    }

    //宁泉季度报表画图
    const getNingChart = (res, params) => {
        const productIdImgList = [];
        new Promise((resolve, reject) => {
            let index = 0;
            res.data.forEach(async (item, index) => {
                let ningquanPosition = '';
                setPositionPie(item.imgInfo, item.productId).then((str) => {
                    ningquanPosition = str;
                });

                let ningquanIndustry = '';
                setIndustryBar(item.imgInfo, item.productId).then((str) => {
                    ningquanIndustry = str;
                });

                let ningquanTrend = '';
                setNingquanTrend(item.imgInfo, productNames[index], item.productId).then((str) => {
                    ningquanTrend = str;

                    productIdImgList.push({
                        productId: item.productId,
                        imgInfo: {
                            ningquanTrend,
                            ningquanIndustry,
                            ningquanPosition,
                        },
                    });
                    index++;
                    if (index === res.data.length) resolve(productIdImgList);
                });
            });
        }).then((productIdImgListStr) => {
            // setImgSrc('data:image/png;base64,' + productIdImgListStr[0].imgInfo.ningquanIndustry)
            _postDownload('/mrp_analysis/monthlyReport/createMonthlyReport', {
                ...params,
                productIdImgListStr,
            });
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
            standard: 4978,
            entity: '沪深300',
        });

        // getMonthlyReportgetTemplateList()
        // 请求模板
        getReportTemplate({ reportForm: 5, reportDimension: 2 });
    }, []);

    // const [imgSrc, setImgSrc] = useState('');

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
                        <Input readOnly />
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

                    <Form.Item
                        name="singleOrTwo"
                        label="标题是否双行"
                        initialValue={1}
                        rules={[{ required: true, message: '请选择标题是否双行' }]}
                    >
                        <Radio.Group>
                            <Radio value={2}>是</Radio>
                            <Radio value={1}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item name="reportName" label="报告名称设置" rules={[{ required: false }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="remark" label="报告声明" rules={[{ required: false }]}>
                        <Button type="primary" onClick={addItem}>
                            增加标题
                        </Button>
                    </Form.Item>
                    {titleArr.map((i, index) => {
                        return (
                            <div key={i.id}>
                                <Form.Item
                                    name={`title${i.id}`}
                                    label={`标题${sinogram[index + 1]}`}
                                    rules={[{ required: false }]}
                                >
                                    <Input
                                        suffix={
                                            <RestOutlined
                                                className={styles.delete}
                                                onClick={() => deleteItem(index)}
                                            />
                                        }
                                    />
                                </Form.Item>
                                <Form.Item
                                    name={`content${i.id}`}
                                    label="正文"
                                    rules={[{ required: false }]}
                                >
                                    <Input.TextArea />
                                </Form.Item>
                            </div>
                        );
                    })}
                </div>
            </Form>

            <div className={styles.echartId} id="echartsId">
                {/* <img src={imgSrc} width="100%" height="100%" /> */}
            </div>

            <div className={styles.bottomBox}>
                <Button onClick={onCancel} className={styles.btnCancel}>
                    取消
                </Button>
                <Button type="primary" onClick={onDownReport} loading={downloadLoading}>
                    生成并下载报告
                </Button>
            </div>
            <MatchModal visible={modalVisible} onCancel={() => setModalVisible(false)} />
        </>
    );
};

export default GenerateReport;
