import React, { useEffect, useState } from 'react';
import { Input, Button, message, Select, Radio, Spin, Row, Col } from 'antd';
import { history } from 'umi';

import { oneProductIndexQuery, getProductTable, oneProductIndexExport } from './service';
import { exportFileBlob } from '@/utils/fileBlob';
import { DatePicker, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { bgColorEnum } from '@/pages/panel/components/ReminderCalendar/data';

import SingleProductModal from '../SingleProduct/SingleProductModal/index';
import HistoryTable from './SingleTable/HistoryTable';
import YearTable from './SingleTable/YearTable';
import MonthTable from './SingleTable/MonthTable';

import moment from 'moment';

import { debounce } from 'lodash';

import styles from '../SingleProduct/index.less';
const { RangePicker } = DatePicker;
const { Option } = Select;

const defaultParams = {
    productId: '',
    standard: 3145,
    startDate: '',
    endDate: '',
    productName: ''
};

const SingleProduct: React.FC<{}> = (props) => {
    const [customerName, setCustomerName] = useState('');
    const [tabValue, settabValue] = useState('0'); // tab 默认选中项
    const [tabParams, settabParams] = useState({ tabValue: '0' }); //
    const [modalData, setModalData] = useState({});
    const [loading, setLoading] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [total, setTotal] = useState(0);
    const [params, setparams] = useState(defaultParams);
    const [nameOrCode, setnameOrCode] = useState(''); // 产品搜索名字
    const [productList, setproductList] = useState([]); // 产品下拉列表
    const [productName, setproductName] = useState(''); // 产品名
    const [dateRange, setdateRange] = useState([]); // 日期选择
    const [exportLoading, setexportLoading] = useState(false);

    const callback = (e) => {
        settabValue(e.target.value);
        tabParams.tabValue = e.target.value;
        settabParams({ ...tabParams });
    };

    // 产品下拉选中
    const onPorductChange = (value) => {
        params.productId = value;

        const obj = productList.filter((item) => +item.productId === +value)[0];
        setproductName(obj.productName);
        params.productName = obj.productName;
        setparams({ ...params });
    };

    // 产品下拉输入框变化
    const handleSearch = debounce((name) => {
        setnameOrCode(name);
        getProductTableAjax(name);
    }, 500);

    // 基准下拉
    const onStandardChange = (value) => {
        params.standard = value;
        setparams({ ...params });
    };

    // 日期变化
    const onTimeChange = (value) => {
        setdateRange(value);
        if (value) {
            params.startDate = moment(value[0]).format('YYYY-MM-DD');
            params.endDate = moment(value[1]).format('YYYY-MM-DD');
        } else {
            params.startDate = '';
            params.endDate = '';
        }
        setparams({ ...params });
    };

    // 获取产品下拉
    const getProductTableAjax = async (nameOrCode) => {
        const res = await getProductTable({
            nameOrCode,
            pageNum: 1,
            pageSize: 1000
        });
        if (+res.code === 1001) {
            setproductList(res.data.list);
        }
    };

    // 查询
    const onSearch = () => {
        oneProductIndexQueryAjax();
    };

    // 重置
    const onRest = () => {
        setdateRange([]);
        params.productId = '';
        params.standard = '';
        params.startDate = '';
        params.endDate = '';
        setparams(params);
        oneProductIndexQueryAjax();
    };

    // 接口调用
    const oneProductIndexQueryAjax = async () => {
        setLoading(true);
        // 判断是否是历史指标,如果是传开始和结束时间
        let startDate = params.startDate;
        let endDate = params.endDate;
        // if (+tabParams?.tabValue) {
        //     startDate = '';
        //     endDate = '';
        // }
        const res = await oneProductIndexQuery({
            ...params,
            startDate,
            endDate
        });
        if (+res.code === 1001) {
            setDataSource(res.data);
        } else {
        }
        setLoading(false);
    };

    // 导出
    const onExport = async () => {
        setexportLoading(true);
        // 判断是否是历史指标,如果是传开始和结束时间
        let startDate = params.startDate;
        let endDate = params.endDate;
        // if (+tabParams?.tabValue) {
        //     startDate = '';
        //     endDate = '';
        // }
        const res = await oneProductIndexExport({
            ...params,
            startDate,
            endDate
        });
        res?.data && exportFileBlob(res?.data, '单一产品业绩指标.xlsx');
        setexportLoading(false);
    };

    const renderTabCom = () => {
        switch (+tabValue) {
            case 0:
                return <HistoryTable dataSource={dataSource?.history} />;
                break;
            case 1:
                return <YearTable dataSource={dataSource?.year} titleArr={dataSource?.keySort} />;
                break;
            case 2:
                return <MonthTable dataSource={dataSource?.month} />;
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        getProductTableAjax(nameOrCode);
    }, []);

    useEffect(() => {
        // oneProductIndexQueryAjax();
    }, [tabValue]);

    return (
        <div className={styles.container}>
            <div>
                <Row style={{ marginBottom: 16 }}>
                    <Col span={8}>
                        产品名称：
                        <Select
                            showSearch
                            filterOption={false}
                            placeholder="鸿道全球优选私募证券投资基金"
                            style={{ marginRight: 16, width: '60%' }}
                            onChange={onPorductChange}
                            onSearch={handleSearch}
                            value={params.productId}
                        >
                            {productList.map((item) => (
                                <Option value={item.productId}>{item.productName}</Option>
                            ))}
                        </Select>
                    </Col>

                    <Col span={8}>
                        比较基准：
                        <Select
                            style={{ width: '60%' }}
                            defaultValue={params.standard}
                            onChange={onStandardChange}
                            value={params.standard}
                        >
                            <Option value={3145}>沪深300</Option>
                            <Option value={46}>上证50</Option>
                            <Option value={4978}>中证500</Option>
                            <Option value={39144}>中证1000</Option>
                        </Select>
                    </Col>

                    <Col span={8}>
                        <Button style={{ marginRight: 16 }} type="primary" onClick={onSearch}>
                            查询
                        </Button>
                        <Button onClick={onRest}>重置</Button>
                    </Col>
                </Row>
            </div>
            <div>
                <Row>
                    <Col span={10}>
                        <Radio.Group value={tabValue} onChange={callback}>
                            <Radio.Button value="0">历史指标</Radio.Button>
                            <Radio.Button value="1">年度指标</Radio.Button>
                            <Radio.Button value="2">月度收益率</Radio.Button>
                        </Radio.Group>
                    </Col>

                    <Col span={14} className={styles.flexR}>
                        {/* <div> */}
                        <SingleProductModal params={params} />
                        {!+tabValue ? (
                            <div>
                                起止日期:
                                <Space className={styles.dataBox} style={{ marginLeft: 16 }}>
                                    <RangePicker
                                        style={{ width: 232 }}
                                        onChange={onTimeChange}
                                        value={dateRange}
                                    />
                                </Space>
                            </div>
                        ) : (
                            ''
                        )}

                        <Button
                            type="primary"
                            disabled={!params.productId}
                            loading={exportLoading}
                            onClick={onExport}
                            icon={<DownloadOutlined />}
                            className={styles.exportBox}
                            style={{ marginLeft: 16, textAlign: 'center' }}
                        >
                            导出Excel
                        </Button>
                        {/* </div> */}
                    </Col>
                </Row>

                <div style={{ marginTop: 16 }}>
                    <Spin spinning={loading}>{renderTabCom()}</Spin>
                </div>
            </div>
        </div>
    );
};

export default SingleProduct;
