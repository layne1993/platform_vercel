import React, { useEffect, useState } from 'react';
import { Input, Button, Card, DatePicker, Row, Col, Form, Modal, message } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

import MXTable from '@/pages/components/MXTable';
import ValuationUploadModal from './components/ValuationUploadModal';

import {
    getParseCatalogDataList,
    valuationTableDelete,
    exportParseCatalogDataList,
    valuationTableDownload
} from './services';
import { exportFileBlob } from '@/utils/fileBlob';

import styles from './index.less';

const { confirm } = Modal;

const defaultSearch = {
    productName: '',
    createDate: '',
    valuationDate: ''
};

const Valuation: React.FC<{}> = (props) => {
    const [form] = Form.useForm();

    const [searchParams, setsearchParams] = useState<object>(defaultSearch);
    const [parseVisiable, setParseVisible] = useState(false);
    const [visible, setvisible] = useState(false);
    const [loading, setloading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<array>([{ name: 12 }]);
    const [total, settotal] = useState<number>(0);
    const [pageData, setpageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20,
        sortFiled: '',
        sortRule: ''
    });
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

    const tableColumns = [
        {
            title: '估值表日期',
            dataIndex: 'valuationDate',
            align: 'center',
            width: 100
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            align: 'center',
            sorter: true,
            // render: (text) => moment(text).format('YYYY-MM-DD'),
            width: 120
        },
        {
            title: '基金名称',
            dataIndex: 'fundName',
            align: 'center',
            render: (text, record) => (
                <div onClick={() => onNameClick(record)} className={styles.tableBtn}>
                    {text}
                </div>
            ),
            width: 120
        },
        {
            title: '单位净值',
            dataIndex: 'netValue',
            align: 'center',
            width: 100
        },
        {
            title: '累计净值',
            dataIndex: 'accumulatedNetValue',
            align: 'center',
            width: 100
        },
        {
            title: '来源类型',
            dataIndex: 'source',
            align: 'center',
            width: 100
        },
        {
            title: '沪市股票市值(万)',
            dataIndex: 'hsStockQuotation',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? (text / 10000).toFixed(2) : '-'}</div>
        },
        {
            title: '深市股票市值(万)',
            dataIndex: 'ssStockQuotation',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? (text / 10000).toFixed(2) : '-'}</div>
        },
        {
            title: '资产规模(万)',
            dataIndex: 'assets',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? (text / 10000).toFixed(2) : '-'}</div>
        },
        {
            title: '日净值增长率',
            dataIndex: 'netValueRate',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? text + '%' : '-'}</div>
        },
        {
            title: '本期净值增长率',
            dataIndex: 'currentNetValueRate',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? text + '%' : '-'}</div>
        },
        {
            title: '累计净值增长率',
            dataIndex: 'accumulatedNetValueRate',
            align: 'center',
            width: 120,
            render: (text) => <div>{text ? text + '%' : '-'}</div>
        },
        {
            title: '累计派现金额',
            dataIndex: 'accumulatedSendCash',
            align: 'center',
            width: 120
        },
        {
            title: '实现收益',
            dataIndex: 'realizedProfit',
            align: 'center',
            width: 120
        },
        {
            title: '可分配收益',
            dataIndex: 'distributeProfit',
            align: 'center',
            width: 120
        },
        {
            title: '单位可分配收益',
            dataIndex: 'perDistributeProfit',
            align: 'center',
            width: 120
        },
        {
            title: '待抵扣负金融商品转让税',
            dataIndex: 'fundTransferTax',
            align: 'center',
            width: 120
        },
        {
            title: '待抵扣负估值增值暂估税',
            dataIndex: 'valuationTax',
            align: 'center',
            width: 120
        },
        {
            title: '现金类占净值比',
            dataIndex: 'cashProportion',
            align: 'center',
            width: 120
        },
        {
            title: '操作',
            dataIndex: '',
            align: 'center',
            fixed: 'right',
            render: (text, record) => (
                <div className={styles.tableBtnBox}>
                    <div className={styles.tableBtn} onClick={() => onTableDel(record)}>
                        删除
                    </div>
                    <div className={styles.tableBtn} onClick={() => onTableDown(record)}>
                        源文下载
                    </div>
                    <div className={styles.tableBtn} onClick={() => onNameClick(record)}>
                        详情
                    </div>
                </div>
            ),
            width: 200
        }
    ];

    // 上传估值表
    const onUpload = () => {
        setvisible(true);
    };

    // 导出信息
    const onExportInfo = async () => {
        const res = await exportParseCatalogDataList({
            fileType: 'product',
            exportIds: selectedRowKeys
        });
        exportFileBlob(res, '估值表数据文件.xls');
    };

    // 表格尾部导出估值表文件
    const onTableDown = async (record) => {
        const res = await valuationTableDownload({
            fileIds: JSON.stringify([record.fileId])
        });
        exportFileBlob(res, record.fileName);
    };

    // 导出估值表源文件
    const onExportSourceFile = async () => {
        const res = await valuationTableDownload({
            fileIds: JSON.stringify(selectedRowKeys)
        });

        // 判断如果选中一个文件名后缀是.xls
        const fileFor = selectedRowKeys.length > 1 ? 'zip' : 'xls';
        exportFileBlob(res, '估值表文件.' + fileFor);
    };

    // 删除
    const onDel = () => {
        confirm({
            title: '',
            content: '确认删除吗?',
            onOk() {
                valuationTableDeleteAjax(selectedRowKeys);
                setselectedRowKeys([]);
            },
            onCancel() { }
        });
    };

    // table 删除
    const onTableDel = (record) => {
        confirm({
            title: '',
            content: '确认删除吗?',
            onOk() {
                valuationTableDeleteAjax([record.fileId]);
            },
            onCancel() { }
        });
    };

    const valuationTableDeleteAjax = async (fileIds) => {
        const res = await valuationTableDelete({
            fileIds: JSON.stringify(fileIds)
        });
        if (+res.code === 1001) {
            message.success('删除成功');
            getParseCatalogDataListAjax(searchParams);
        }
    };

    // 查询
    const onSearch = async () => {
        form.validateFields().then((values) => {
            console.log(values, 'values');
            values.createDate = values.createDate
                ? moment(values.createDate).format('YYYY-MM-DD')
                : '';
            values.valuationDate = values.valuationDate
                ? moment(values.valuationDate).format('YYYY-MM-DD')
                : '';
            setsearchParams(values);
            getParseCatalogDataListAjax(values);
        });
    };

    // 重置
    const onRest = () => {
        form.setFieldsValue({
            productName: ''
        });
        setsearchParams(defaultSearch);
        getParseCatalogDataListAjax(defaultSearch);
    };

    const onTableSelectChange = (values) => {
        setselectedRowKeys([...values]);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onTableSelectChange
    };

    // 产品名称跳转
    const onNameClick = (record) => {
        history.replace({
            pathname: '/valuationAnalysis/valuationQuery/valuationDetail',
            query: {
                id: record.fileId
            }
        });
    };

    const onTableChange = (p, e, s) => {
        const { current, pageSize } = p;

        const { field, order } = s;
        pageData.sortFiled = field;
        pageData.sortRule = order === 'descend' ? 0 : order === 'ascend' ? 1 : -1;

        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setpageData({ ...pageData });
        getParseCatalogDataListAjax(searchParams);
    };

    useEffect(() => {
        getParseCatalogDataListAjax(searchParams);
    }, []);

    const getParseCatalogDataListAjax = async (params) => {
        setloading(true);
        const res = await getParseCatalogDataList({
            ...params,
            ...pageData,
            fileType: 'product'
        });
        if (+res.code === 1001) {
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        setloading(false);
    };

    return (
        <PageHeaderWrapper title="估值表查询">
            <Card>
                <div className={styles.container}>
                    <Form form={form} layout="horizontal">
                        <Row>
                            <Col span={8}>
                                <Form.Item
                                    label="产品名称"
                                    name="productName"
                                    initialValue={''}
                                    style={{ marginLeft: 10 }}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="创建时间"
                                    name="createDate"
                                    style={{ marginLeft: 10 }}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="估值表日期"
                                    name="valuationDate"
                                    style={{ marginLeft: 10 }}
                                >
                                    <DatePicker style={{ width: '100%' }} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className={styles.searchBar}>
                    <div>
                        <Button className={styles.btnBox} type="primary" onClick={onUpload}>
                            上传估值表
                        </Button>
                        <Button
                            disabled={!selectedRowKeys.length}
                            className={styles.btnBox}
                            type="primary"
                            onClick={onExportInfo}
                        >
                            导出信息
                        </Button>
                        <Button
                            disabled={!selectedRowKeys.length}
                            className={styles.btnBox}
                            type="primary"
                            onClick={onExportSourceFile}
                        >
                            导出估值表源文件
                        </Button>
                    </div>

                    <div>
                        <Button
                            disabled={!selectedRowKeys.length}
                            className={styles.btnBox}
                            danger
                            onClick={onDel}
                        >
                            删除
                        </Button>
                        <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                            查询
                        </Button>
                        <Button className={styles.btnBox} onClick={onRest}>
                            重置
                        </Button>
                    </div>
                </div>

                <MXTable
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={tableColumns}
                    dataSource={dataSource}
                    rowKey="fileId"
                    total={total}
                    pageNum={pageData.pageNum}
                    scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
                    onChange={(p, e, s) => onTableChange(p, e, s)}
                />
            </Card>

            {/* 上传估值表 */}
            <ValuationUploadModal
                visible={visible}
                onCancel={() => {
                    setvisible(false);
                    getParseCatalogDataListAjax(searchParams);
                }}
            />
        </PageHeaderWrapper>
    );
};

export default Valuation;
