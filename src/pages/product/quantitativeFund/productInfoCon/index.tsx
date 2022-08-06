import { openNotification } from '@/pages/investor/InvestorDetails/Public/formData'
import { paginationPropsback } from '@/utils/publicData'
import { fileExport, getCookie } from '@/utils/utils'
import { DownOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Form, Input, message, Modal, Radio, Row, Select, Space, Table, Tree, Upload } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { connect, withRouter } from 'umi'
import ProductInfoEdit from './productInfoEdit'
import _styles from './index.less'
const { Option } = Select;
export interface ProductInfoStatisticsItem {
    label: string,
    value: number,
    extra?: string,
    unit?: string,
    key: string
}

const ProductInfoList: React.FC = (props: any) => {
    const { dispatch, loading, authEdit, authExport } = props
    const productInfoStatisticsTem: ProductInfoStatisticsItem[] = [
        {
            label: '待补充内容托管',
            value: 0,
            // extra: '（中信、国信、申万宏源）',
            unit: '个',
            key: 'productInfoStatistics001'
        },
        {
            label: '待补充内容量化产品',
            value: 0,
            unit: '个',
            key: 'productInfoStatistics002'
        },
        {
            label: '量化产品总数量',
            value: 0,
            unit: '个',
            key: 'productInfoStatistics003'
        },
        {
            label: '产品总数量',
            value: 0,
            unit: '个',
            key: 'productInfoStatistics004'
        },
    ]
    const productInfoQueryCondition = [

    ]
    const columns = [
        {
            title: '基金名称',
            dataIndex: 'productFullName',
            width: 120,
            fixed: true,
            render: (val) => val || '--'
        },
        {
            title: '基金编码',
            dataIndex: 'fundRecordNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '是否量化产品',
            dataIndex: 'quantitativeProduct',
            width: 120,
            render: (val) => val ? Number(val) === 1 ? '是' : '否' : '--'
        },
        {
            title: '中登公司一码通账户',
            dataIndex: 'accountZhongdengCompany',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '期货保证金监控中心账户',
            dataIndex: 'futuresMarginmonitoringcenter',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '量化主策略',
            dataIndex: 'quantitativeMasterStrategy',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '量化辅策略',
            dataIndex: 'quantitativeAuxiliaryStrategy',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '当期量化主策略是否发生调整',
            dataIndex: 'quantitativeMasterStrategyChange',
            width: 220,
            render: (val) => val ? Number(val) === 1 ? '是' : '否' : '--'
        },
        {
            title: '基金规模',
            dataIndex: 'feeNetValue',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '基金总资产',
            dataIndex: 'totalValue',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '基金单位净值',
            dataIndex: 'netValue',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '基金单位累计净值',
            dataIndex: 'acumulateNetValue',
            width: 160,
            render: (val) => val || '--'
        },
        {
            title: '当期净值最大回撤',
            dataIndex: 'maximumRetreat',
            width: 160,
            render: (val) => val || '--'
        },
        {
            title: '股票投资金额',
            dataIndex: 'amountInvestedInStocks',
            width: 160,
            render: (val) => val || '--'
        },
        {
            title: '日均持有股票数量',
            dataIndex: 'numberShares',
            width: 160,
            render: (val) => val || '--'
        },
        {
            title: '日均股票成交金额（单边）',
            dataIndex: 'stockTransactionAmount',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '日均股票换手率（单边）',
            dataIndex: 'turnoverRate',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '期货及衍生品交易保证金',
            dataIndex: 'marginForDerivativesTrading',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '股指期货交易保证金',
            dataIndex: 'marginForStockIndexFuturesTrading',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '场外衍生品交易保证金',
            dataIndex: 'marginForOtcDerivativesTrading',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '场外衍生品合约价值',
            dataIndex: 'valueOfOtcDerivativesContracts',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '融资余额',
            dataIndex: 'balanceOfFinancing',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '融券余额',
            dataIndex: 'securitiesBalances',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '账户最高申报速率',
            dataIndex: 'maximumRateOfDeclaration',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '当期申购总金额',
            dataIndex: 'subscriptionAmountTotal',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '当期赎回总金额',
            dataIndex: 'redemptionAmountTotal',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '当期发生巨额赎回次数',
            dataIndex: 'mumberOfLargeRedemptions',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '巨额赎回情况说明',
            dataIndex: 'hugeRedemptionNotes',
            width: 220,
            render: (val) => val || '--'
        },
        {
            title: '托管方',
            dataIndex: 'fundName30',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '产品内容状态',
            dataIndex: 'status',
            width: 120,
            render: (val) => val ? Number(val) === 1 ? '待补充' : '已完成' : '--'
        },
        {
            title: '操作',
            width: 120,
            key: 'fundNameOpt',
            fixed: 'right',
            render: (recode) => {
                return (
                    authEdit ? <a style={{ cursor: 'pointer' }} onClick={() => editProductInfo(recode)}>编辑</a> : '--'
                )
            }
        },
    ]
    const editProductInfo = (productInfo) => {
        editProduct(productInfo)
    }
    const [dataSource, setDataSource] = useState([])
    const [showColumn, setShowColumn] = useState(false);
    const [columnsStandard, setColumnsStandard] = useState(columns); // 默认columns
    const [columnsValue, setColumnsValue] = useState(columns); // table最终使用的columns
    const [selectedTreeKeys, setSelectedTreeKeys] = useState([])
    // 分页信息
    const [current, setCurrent] = useState(1)
    const [total, setTotal] = useState(100)
    const [pageSize, setPageSize] = useState(20)
    const [productInfoStatistics, setProductInfoStatistics] = useState(JSON.parse(JSON.stringify(productInfoStatisticsTem))) // 头部数量统计
    const [form] = Form.useForm()
    const [editForm] = Form.useForm()
    const formItemLayout = {
        labelCol: {
            xs: { span: 8 },
            sm: { span: 8 }
        },
        wrapperCol: {
            xs: { span: 14 },
            sm: { span: 14 }
        }
    };
    const [show, setShow] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)
    const editProduct = (value) => {
        setShow(!show)
        // 将返回的字符串转成数组
        value.quantitativeAuxiliaryStrategy = value.quantitativeAuxiliaryStrategy && !Array.isArray(value.quantitativeAuxiliaryStrategy) && value.quantitativeAuxiliaryStrategy.split(',') || []
        editForm.setFieldsValue(value)
    }
    const handleCancel = () => {
        setShow(!show)
    }
    const handleOk = () => {
        editForm.validateFields().then((values) => {
            values.quantitativeAuxiliaryStrategy = values.quantitativeAuxiliaryStrategy.toString()
            setConfirmLoading(true)
            dispatch({
                type: 'QUANTITATIVEFUND/editProductInfo',
                payload: {
                    ...values
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        openNotification('success', '', '编辑成功');
                    } else {
                        const txt = res.message || res.data || '保存失败';
                        openNotification('error', '提醒', txt);
                    }
                }
            }).then(() => {
                setConfirmLoading(false)
                setShow(false)
                queryProductInfoList(form.getFieldsValue(), { pageNum: current, pageSize: pageSize })
            })
        }).catch(error => {
            openNotification('warn', '提示', '请检查表单项');
        })
    }
    const onFinish = () => {
        // 条件查询产品信息列表
        queryProductInfoList(form.getFieldsValue(), { pageNum: current, pageSize: pageSize })
    }
    const reset = () => {
        form.resetFields()
        queryProductInfoList({}, { pageNum: current, pageSize: pageSize })
    }
    // 点击分页
    const tableChange = (pagination) => {
        setTotal(() => pagination.total)
        setCurrent(() => pagination.current)
        setPageSize(() => pagination.pageSize)
        queryProductInfoList(form.getFieldsValue(), { pageNum: pagination.current, pageSize: pagination.pageSize })
    }
    /**
       *@description: 列设置的下拉
       **/
    const Columnmenu = () => {
        const newArray = [];
        const pitchonArray = [];
        columnsStandard.map((item, index) => {
            newArray.push({
                title: item.title,
                key: index,
                checkbox: selectedTreeKeys.indexOf(index)
            });
            pitchonArray.push(index);
        });
        return (
            <Tree
                style={{ width: '100%', paddingTop: 20, border: '1px solid #ccc', overflow: 'auto', maxHeight: '300px' }}
                checkable
                defaultCheckedKeys={selectedTreeKeys}
                onCheck={HeadColumn}
                // onCheck={onCheck}
                treeData={newArray}
            />
        );
    };
    /**
       *@description: 列设置变化
       **/
    const HeadColumn = (selectedKeys, info) => {
        const select = info.checkedNodes;
        const headerArray = [];
        // columnsStandard.map(item=>)
        columnsStandard.forEach((currentValue) => {
            select.forEach((value) => {
                if (value.title === currentValue.title) {
                    headerArray.push(currentValue);
                }
            });
        });
        setSelectedTreeKeys(selectedKeys)
        setColumnsValue(headerArray)
    };
    /**
       *@description: 是否显示表头选项
       **/
    const handleShowColumn = () => {
        setShowColumn(!showColumn)
    };
    const errorList = (data) => {
        return <div style={{ height: '300px', overflow: 'auto' }}>
            <p>产品库中未查询到以下产品，请新建对应产品信息</p>
            {
                data.file.response.data.failedProduct.map((item) => {
                    return <p>{item}</p>
                })
            }
        </div>
    }
    const changeFile = (data) => {
        if (data.file.status === 'uploading' && data.file.percent === 0) {
            message.loading({ content: '上传中...', key: 'upload', duration: 0 });
        }
        if (data.file.status === 'done') {

            if (data.file.response.code === 1008) {
                message.success({ content: '上传成功', key: 'upload', duration: 1 });
                if (data.file.response.data.failedProduct.length) {
                    Modal.info({
                        title: '上传不成功的产品列表',
                        content: errorList(data)
                    });
                }
                queryProductInfoList(form.getFieldsValue(), { pageNum: current, pageSize: pageSize })
            } else {
                message.warning({ content: '上传失败', key: 'upload', duration: 1 });
                openNotification('error', '提示', data.file.response.message);
            }
        }
    }
    const addProduct = () => {
        props.history.push('/product/list/details/0')
    }
    const queryProductInfoList = (params, pagination) => {
        dispatch({
            type: 'QUANTITATIVEFUND/queryProductInfo',
            payload: {
                ...pagination,
                ...params
            },
            callback: (res) => {
                if (res.code === 1008) {
                    // openNotification('success', '提醒', '');
                    const productInfoStatisticsC = JSON.parse(JSON.stringify(productInfoStatistics))
                    productInfoStatisticsC[0].value = 0;
                    productInfoStatisticsC[1].value = res.data.quantifiedProductsAdd;
                    productInfoStatisticsC[2].value = res.data.quantifiedProducts;
                    productInfoStatisticsC[3].value = res.data.totalProduct
                    setTotal(res.data.total)
                    setProductInfoStatistics(productInfoStatisticsC)
                    setDataSource(res.data.list)
                } else {
                    const txt = res.message || res.data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    }
    const exportMouReport = (type) => {
        window.location.href = `${BASE_PATH.adminUrl}/manager/fundPerformanceReport/exportManagedData/${type}?tokenId=${getCookie(
            'vipAdminToken',
        )}`
    }
    useEffect(() => {
        // 初始化默认选中的列
        const selectedKeys = columns.map((item, index) => index)
        setSelectedTreeKeys(selectedKeys)
        queryProductInfoList({}, { pageNum: current, pageSize: pageSize }) // 查询产品列表
        return () => {

        }
    }, [])
    return (
        <>
            <Row style={{ marginBottom: '20px' }}>
                {
                    productInfoStatistics.map((item: ProductInfoStatisticsItem, index: number) => {
                        return (
                            <Col span={6} key={item.key} style={{ textAlign: 'center' }}>
                                <p>{item.label}</p>
                                <p style={{ marginBottom: '0px', color: '#000', fontWeight: 600 }}>{item.value}{item.unit}</p>
                                { item.extra && <p title={item.extra} style={{ cursor: 'pointer' }}>{item.extra.length >= 12 ? `${item.extra.slice(0, 10)}...)` : item.extra}</p>}
                            </Col>
                        )
                    })
                }
            </Row>
            <Form
                form={form}
                {...formItemLayout}
                onFinish={onFinish}
            >
                <Row>
                    <Col span={8}>
                        <Form.Item
                            label="基金名称"
                            name="productFullName"
                        >
                            <Input placeholder="请输入基金名称" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="隶属托管"
                            name="belongingToHosting"
                        >
                            <Select
                                placeholder="请选择"
                                allowClear
                                disabled
                            >
                                <Option value={0}>全部</Option>
                                <Option value={1}>国泰君安</Option>
                                <Option value={2}>东吴证券</Option>
                                <Option value={3}>中信证券</Option>
                                <Option value={4}>西部证券</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="产品状态"
                            name="status"
                        >
                            <Select
                                placeholder="请选择"
                                allowClear
                            >
                                <Option value={null}>全部</Option>
                                <Option value={'0'}>已完成</Option>
                                <Option value={'1'}>待补充</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="产品类别"
                            name="productCategory"
                        >
                            <Select
                                placeholder="请选择"
                                allowClear
                            >
                                <Option value={null}>全部</Option>
                                <Option value={1}>量化产品</Option>
                                <Option value={0}>非量化产品</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item style={{ float: 'right', width: '200px', display: 'block' }}>
                            <Space>
                                <Button htmlType='submit' type='primary'>
                                    查询
                </Button>
                                <Button onClick={() => reset()}>
                                    重置
                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Space style={{ marginBottom: '12px' }}>
                {authEdit && <Upload accept='.xls,.xlsx' name="file"
                    action={`${BASE_PATH.adminUrl}/manager/fundPerformanceReport/uploadManagedData`}
                    headers={{
                        tokenId: getCookie('vipAdminToken')
                    }}
                    onChange={(info) => changeFile(info)}
                    showUploadList={false}
                >
                    <Button type='primary'>1、托管数据归集</Button>
                </Upload>
                }
                {
                    authExport && <Button type='primary' onClick={() => exportMouReport('1')}>
                        2、补全空缺数据
                                 </Button>
                }
                {
                    authEdit && <Upload
                        accept='.xls,.xlsx' name="file"
                        action={`${BASE_PATH.adminUrl}/manager/fundPerformanceReport/uploadManagedData`}
                        headers={{
                            tokenId: getCookie('vipAdminToken')
                        }}
                        onChange={(info) => changeFile(info)}
                        showUploadList={false}
                    >
                        <Button type='primary'>3、空缺数据导入</Button>
                    </Upload>
                }
                {
                    authExport && <Button type='primary' onClick={() => exportMouReport('2')}>
                        4、生成月度报告
                                 </Button>
                }
            </Space>
            {
                authEdit && <Button style={{ float: 'right',marginRight:'65px' }} type='primary' onClick={addProduct}>
                    新建产品
                            </Button>
            }
            <Alert
                style={{ padding: '10px' }}
                message={
                    <Fragment>
                        <Row>
                            <Col span={20}>
                                <p style={{ color: '#D9001B', lineHeight: '18px', position: 'relative', top: '5px' }}>（注：统计显示的都是截止上个月结束日的产品数据情况）</p>
                            </Col>
                            <Col span={4}>
                                <Button onClick={handleShowColumn} style={{ width: '100%' }}>
                                    列设置 <DownOutlined />
                                </Button>
                                <div
                                    style={{
                                        position: 'absolute',
                                        zIndex: 999,
                                        width: '100%'
                                    }}
                                >
                                    {showColumn ? Columnmenu() : null}
                                </div>
                            </Col>
                        </Row>
                    </Fragment>
                }
                type="info"
                showIcon
            />
            <Table
                loading={loading}
                // rowSelection={rowSelection}
                columns={columnsValue as any}
                dataSource={dataSource}
                rowKey="productId"
                scroll={{ x: '100%' }}
                sticky
                pagination={paginationPropsback(total, current)}
                onChange={(p) => tableChange(p)}
            />
            {
                authEdit && <Modal
                    title="产品详情信息"
                    width={1200}
                    visible={show}
                    bodyStyle={{ height: '600px', overflow: 'auto' }}
                    onOk={handleOk}
                    onCancel={() => setShow(!show)}
                    okText='提交'
                    cancelText='取消'
                    confirmLoading={confirmLoading}
                >
                    <ProductInfoEdit handleCancel={handleCancel} form={editForm} />
                </Modal>
            }

        </>
    )
}

export default connect(({ QUANTITATIVEFUND, loading }) => ({
    loading: loading.effects['QUANTITATIVEFUND/queryProductInfo'],
    // updateChannelLoading: loading.effects['QUANTITATIVEFUND/']
}))(withRouter(ProductInfoList))
