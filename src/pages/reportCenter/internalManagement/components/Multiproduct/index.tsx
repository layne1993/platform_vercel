import React, { useEffect, useState } from 'react';
import { DatePicker, Button, Select, Row, Col } from 'antd';
import styles from '../Multiproduct/index.less';
import MXTable from '@/pages/components/MXTable';
// import TableModal from './TableModal';
import { exportFileBlob } from '@/utils/fileBlob';
import { DownloadOutlined } from '@ant-design/icons';
import { multyProductIndexQuery, multyProductIndexQueryJson, getProductTable } from './service';
import { debounce } from 'lodash';
import moment from 'moment';

const { Option } = Select;

const defaultParams = {
    standard: 3145,
};
const MultiProductIndex: React.FC<{}> = (props) => {
    const [dataSource, setDataSource] = useState([]);
    const [selectLoading, setselectLoading] = useState(false);
    const [productList, setproductList] = useState([]); // 产品下拉列表
    const [nameOrCode, setnameOrCode] = useState(''); // 产品搜索名字
    const [productIds, setproductIds] = useState([]);
    const [endDate, setEndDate] = useState('');
    const [total, setTotal] = useState<number>(0);
    const [pageData, setPageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10,
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [title, settitle] = useState('沪深300');
    const [params, setparams] = useState(defaultParams);

    //接口调用
    const multyProductIndexQueryAjax = async () => {
        setLoading(true);
        const res = await multyProductIndexQueryJson({
            productIds,
            standard: params.standard,
            responseType: 1,
            endDate,
            ...pageData,
        });
        if (+res.code === 1001) {
            setDataSource([...res.data.list]);
            setTotal(res.data.total);
        } else {
        }
        setLoading(false);
    };

    // 产品下拉输入框变化
    const handleSearchProduct = debounce((name) => {
        setnameOrCode(name);
        getProductTableAjax(name);
    }, 500);

    // 获取产品下拉
    const getProductTableAjax = async (nameOrCode) => {
        setselectLoading(true);
        const res = await getProductTable({
            nameOrCode,
            pageNum: 1,
            pageSize: 1000,
        });
        setselectLoading(false);
        if (+res.code === 1001) {
            setproductList(res.data.list);
        } else {
            setproductList([]);
        }
    };
    useEffect(() => {
        multyProductIndexQueryAjax();
        getProductTableAjax(nameOrCode);
    }, []);

    const handleChangeMulti = (val) => {
        setproductIds(val);
    };

    const handleChangPicker = (date, dateString) => {
        setEndDate(dateString);
    };

    const onTableChange = (data) => {
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setPageData({ ...pageData });
        multyProductIndexQueryAjax();
    };

    //调用查询接口
    const handleSearch = async () => {
        multyProductIndexQueryAjax();
    };

    //重置
    const btnReset = () => {
        setproductIds([]);
        setEndDate('');
        params.standard = 3145;
        setparams(params);
        multyProductIndexQueryAjax();
    };

    //导出Excel
    const handleExport = async () => {
        setExportLoading(true);

        const res = await multyProductIndexQuery({
            productIds,
            standard: params.standard,
            endDate,
            responseType: 2,
            ...pageData,
        });
        console.log(res, 'res值为');

        res.data && exportFileBlob(res.data, '多产品业绩指标.xlsx');
        setExportLoading(false);
    };

    //基准下拉
    const onStandardChange = async (value) => {
        const obj = {
            46: '上证50',
            4978: '中证500',
            3145: '沪深300',
            39144: '中证1000',
        };
        params.standard = value;
        settitle(obj[value]);
        setparams({ ...params });
        // 2021、9、22 无用功能
        // const res = await multyProductIndexQuery({
        //     "productFullName": inputValue,
        //     "standard": params.standard,
        //     endDate,
        //     "responseType": 1,
        //     "pageSize": 10,
        //     "pageNum": 1
        // })
    };

    const columns = [
        {
            title: '基金全称',
            width: 150,
            dataIndex: 'productFullName',
        },
        {
            title: '净值日期',
            width: 100,
            dataIndex: 'netDate',
        },
        {
            title: '复利年化收益率',
            dataIndex: 'compoundRate',
            width: 150,
        },
        {
            title: '最大回撤率',
            dataIndex: 'backRate',
            width: 150,
        },
        {
            title: '年化波动率',
            dataIndex: 'yearWaveRate',
            width: 150,
        },
        {
            title: '卡玛比率',
            dataIndex: 'kumar',
            width: 150,
        },
        {
            title: '夏普比率',
            dataIndex: 'sharp',
            width: 150,
        },
        {
            title: '下行风险',
            dataIndex: 'downside',
            width: 150,
        },
        {
            title: '索提诺比率',
            dataIndex: 'cupertino',
            width: 150,
        },
        {
            title: '近一月收益率',
            dataIndex: 'monthRate',
            width: 150,
        },
        {
            title: title,
            dataIndex: 'baseMonthRate',
            width: 150,
        },
        {
            title: '近三月收益率',
            dataIndex: 'quarterRate',
            width: 150,
        },
        {
            title: title,
            dataIndex: 'baseQuarterRate',
            width: 100,
        },
        {
            title: '近半年收益率',
            dataIndex: 'halfYearRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseHalfYearRate',
            width: 100,
        },
        {
            title: '近一年收益率',
            dataIndex: 'yearRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseYearRate',
            width: 100,
        },
        {
            title: '近二年收益率',
            dataIndex: 'twoYearRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseTwoYearRate',
            width: 100,
        },
        {
            title: '近三年收益率',
            dataIndex: 'threeYearRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseThreeYearRate',
            width: 100,
        },
        {
            title: '今年以来收益率',
            dataIndex: 'sinceYearRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseSinceYearRate',
            width: 100,
        },
        {
            title: '成立以来收益率',
            dataIndex: 'sinceFoundRate',
            width: 100,
        },
        {
            title: title,
            dataIndex: 'baseSinceFoundRate',
            width: 100,
        },
        {
            title: '今年以来年化',
            dataIndex: 'sinceYearYieldRate',
            width: 100,
        },
        {
            title: title + '今年以来年化',
            dataIndex: 'baseSinceYearYieldRate',
            width: 100,
        },
        {
            title: '成立以来年化',
            dataIndex: 'sinceFoundYieldRate',
            width: 100,
        },
        {
            title: title + '成立以来年化',
            dataIndex: 'baseSinceFoundYieldRate',
            width: 100,
        },
    ];

    return (
        <div className={styles.container}>
            <div>
                <Row>
                    <Col span={8}>
                        产品搜索：
                        <Select
                            value={productIds}
                            mode="multiple"
                            showSearch
                            allowClear
                            filterOption={false}
                            style={{ width: '70%' }}
                            placeholder="请选择产品"
                            loading={selectLoading}
                            onChange={handleChangeMulti}
                            onSearch={handleSearchProduct}
                        >
                            {productList.map((item) => (
                                <Option value={item.productId}>{item.productName}</Option>
                            ))}
                        </Select>
                    </Col>
                    <Col span={8}>
                        截至时间：
                        <DatePicker
                            placeholder="请选择截止时间"
                            value={endDate ? moment(endDate) : null}
                            onChange={handleChangPicker}
                        />
                    </Col>
                    <Col span={8}>
                        比较基准：
                        <Select
                            defaultValue={3145}
                            style={{ width: 140, marginLeft: 16 }}
                            onChange={onStandardChange}
                            value={params.standard}
                        >
                            <Option value={46}>上证50</Option>
                            <Option value={4978}>中证500</Option>
                            <Option value={3145}>沪深300</Option>
                            <Option value={39144}>中证1000</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{ marginTop: 16 }}>
                    <Col span={8}>
                        <Button type="primary" style={{ marginRight: 16 }} onClick={handleSearch}>
                            查询
                        </Button>
                        <Button style={{ marginRight: 16 }} onClick={btnReset}>
                            重置
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            type="primary"
                            onClick={handleExport}
                            loading={exportLoading}
                        >
                            导出Excel
                        </Button>
                    </Col>
                </Row>
            </div>
            <MXTable
                loading={loading}
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 442, y: 528 }}
                className={styles.relatedPartyMaint}
                total={total}
                pageNum={pageData.pageNum}
                onChange={onTableChange}
            />
            ,
        </div>
    );
};

export default MultiProductIndex;
