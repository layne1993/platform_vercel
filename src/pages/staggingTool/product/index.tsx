import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'umi';
import {
    Table,
    Form,
    Select,
    DatePicker,
    Button,
    Dropdown,
    Menu,
    Space,
    message,
    notification,
    Row,
    Col,
    Modal
} from 'antd';
import { cloneDeep } from 'lodash'
import { MultipleSelect } from '@/pages/components/Customize';
import BatchUpload from '@/pages/components/batchUpload';
import _styles from './index.less';
const { Option } = Select;
const { RangePicker } = DatePicker;
import { exportExcel, getCookie, fileExport } from '@/utils/utils';
import moment from 'moment';
import { getInfoList, getLpRefreshStatus, updateLpRefreshStatus } from './service';

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const sheetOptions = {
    fileName: '',
    datas: [
        {
            sheetData: [],
            sheetName: 'sheet',
            sheetFilter: [
                'productName',
                'productSacName',
                'lpInvestType',
                'canApplyNewShare',
                'productSacCode',
                'shanghaiStockExchangeAccount',
                'shenzhenStockExchangeAccount',
            ],
            sheetHeader: [
                '产品名称',
                '配售对象名称',
                '参与市场',
                '是否具有配售对象资质',
                '配售对象证券业协会备案编号',
                '配售对象证券账户号（沪市）',
                '配售对象证券账户号（深市）',
            ],
        },
    ],
};

const investTypeMap = {
    1: '沪市',
    2: '深市',
    3: '沪市深市',
};

const ProductMaintenance = (props) => {
    const initialValues = { pageNum: 1, pageSize: 10, productId: null, startDate: null, endDate: null, canApplyNewShare: 1, isShowSonProduct: 0 };
    const [form] = Form.useForm();
    const [tableLoading, setTableLoading] = useState(false); // 加载中
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 所有选中的产品
    const [tableProduct, setTableProduct] = useState([]); // 要展示的产品
    const [allProduct, setAllProduct] = useState([]);
    const [total, setTotal] = useState(0); // 分页总数
    const [reqParams, setReqParams] = useState(initialValues);
    const [batchUploadModalFlag, setBatchUploadModalFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [dataStatus, setDataStatus] = useState({ refreshStatus: 2, lpSwitch: 1 });
    let clearIntervalFlag = 0;
    // refreshStatus数据处理状态(1:处理中、2:处理完成、3、处理失败)lpSwitch出资方数据更新开关(1:开启  0:关闭)
    const reqParamsRef = useRef(reqParams);

    useEffect(() => {
        reqParamsRef.current = reqParams;
    }, [reqParams]);

    // Table 分页器
    const [paginationOptions, setPaginationOptions] = useState({
        showSizeChanger: true,
        showQuickJumper: true,
        total: 0,
        current: 1,
        showTotal: (_, range) => `共1条记录 第${range[0]} - ${range[1]} 条`,
        defaultPageSize: 10,
        pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400', '500', '1000', '999999'],
    });

    const columns: any[] = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            align: 'center',
            width: 200,
            fixed: 'left',
            render: (val, row) => (
                <Link to={`/staggingTool/product/detail/${row.productId}`}>{val}</Link>
            ),
        },
        {
            title: '出资方数据更新时间',
            dataIndex: 'lpRefreshTime',
            fixed: 'left',
            align: 'center',
            render: (time) => (time ? moment(time).format('YYYY-MM-DD') : '--'),
            width: 150,
        },
        {
            title: '配售对象名称',
            dataIndex: 'productSacName',
            align: 'center',
            width: 200,
            fixed: 'left',
        },
        {
            title: '参与市场',
            dataIndex: 'lpInvestType',
            align: 'center',
            width: 100,
            render: (val) => investTypeMap[val],
        },
        {
            title: '是否具有配售对象资质',
            dataIndex: 'canApplyNewShare',
            align: 'center',
            width: 100,
            render: (val) => (val === 0 ? '否' : '是'),
        },
        // {
        //     title: '深市股票平均市值（万元）',
        //     dataIndex: 'shenzhenStockAverageMarker',
        //     align: 'center',
        //     width: 200,
        // },
        // {
        //     title: '沪市股票平均市值（万元）',
        //     dataIndex: 'shanghaiStockAverageMarker',
        //     align: 'center',
        //     width: 200,
        // },
        {
            title: '资产净值',
            dataIndex: 'capitalScale',
            align: 'center',
            width: 140,
        },
        {
            title: '资产净值更新时间',
            dataIndex: 'capitalDate',
            align: 'center',
            width: 160,
        },
        {
            title: '配售对象证券业协会备案编号',
            dataIndex: 'productSacCode',
            align: 'center',
            width: 220,
        },
        {
            title: '配售对象证券账户号（沪市）',
            dataIndex: 'shanghaiStockExchangeAccount',
            align: 'center',
            width: 220,
        },
        {
            title: '配售对象证券账户号（深市）',
            dataIndex: 'shenzhenStockExchangeAccount',
            align: 'center',
            width: 220,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const onChangePage = useCallback((p) => {
        setReqParams({
            ...reqParamsRef.current,
            pageNum: p.current,
            pageSize: p.pageSize,
        });
    }, []);

    const getTableList = useCallback(async () => {
        setTableLoading(true);
        const res: any = await getInfoList(reqParams);
        setTableLoading(false);
        if (res.code == 1008) {
            setTableProduct(res.data.list || []);
            setTotal(res.data.total);
        }
    }, [reqParams]);

    const getAllTableList = useCallback(async () => {
        const params = {
            pageNum: 1,
            pageSize: 10000,
        };
        let res: any = await getInfoList(params);
        if (res.code == 1008) {
            setAllProduct(res.data.list || []);
        }
    }, []);

    const onSearch = useCallback(async () => {
        const res = form.getFieldsValue();
        const searchFormData: any = {
            canApplyNewShare: null,
            startDate: null,
            endDate: null,
            productId: null,
        };
        if (res.status !== undefined) {
            searchFormData.canApplyNewShare = res.status *= 1;
        }
        if (res.updateDate) {
            searchFormData.startDate = moment(res.updateDate[0]).format('YYYY-MM-DD');
            searchFormData.endDate = moment(res.updateDate[1]).format('YYYY-MM-DD');
        }
        if (res.productId !== undefined) {
            searchFormData.productId = res.productId;
        }
        setReqParams({
            ...reqParamsRef.current,
            ...res,
            ...searchFormData,
            pageNum: 1,
        });
    }, [form]);

    const handleReset = useCallback(() => {
        form.resetFields();
        setReqParams(cloneDeep(initialValues));
    }, [form]);

    const handleExport = useCallback(
        async (type, selectedRowKeys) => {
            // let data = [];
            // if (type == 'selected') {
            //     if (selectedRowKeys.length == 0) {
            //         message.warn('请先选择要导出的产品后再导出');
            //         return false;
            //     }
            //     sheetOptions.fileName = `${new Date().getTime()}`;
            //     data = selectedRowKeys.map((id) => {
            //         return tableProduct.find((item) => item.productId === id);
            //     });
            // } else {
            //     data = allProduct;
            // }
            // data = data.map((item) => {
            //     const { canApplyNewShare, lpInvestType } = item;
            //     item.canApplyNewShare = canApplyNewShare === 0 ? '否' : '是';
            //     item.lpInvestType = investTypeMap[lpInvestType];
            //     return item;
            // });
            // sheetOptions.fileName = `${new Date().getTime()}`;
            // sheetOptions.datas[0].sheetData = data;
            // exportExcel(sheetOptions);
            let data = {};
            if (type === 'selected') {
                data = { mode: 0, exportIds: selectedRowKeys }
                if (selectedRowKeys.length == 0) {
                    message.warn('请先选择要导出的产品后再导出');
                    return false;
                }
            } else {
                data = { mode: 1 }
            }
            fileExport({
                method: 'post',
                url: '/staggingnewApplyProduct/export',
                data,
                // callback: ({ status, message = '导出失败！' }) => {
                //     if (status === 'success') {
                //         openNotification('success', '提醒', '导出成功');
                //     }
                //     if (status === 'error') {
                //         openNotification('error', '提醒', message);
                //     }
                // }
            });
        },
        [allProduct, tableProduct],
    );

    useEffect(() => {
        getTableList();
    }, [getTableList]);

    useEffect(() => {
        getAllTableList();
    }, [getAllTableList]);

    useEffect(() => {
        setPaginationOptions({
            showSizeChanger: true,
            showQuickJumper: true,
            total: total,
            current: reqParams.pageNum || 1,
            showTotal: (_, range) => `共 ${total} 条记录 第${range[0]} - ${range[1]} 条`,
            defaultPageSize: 10,
            pageSizeOptions: [
                '10',
                '20',
                '50',
                '100',
                '200',
                '300',
                '400',
                '500',
                '1000',
                '999999',
            ],
        });
    }, [reqParams, total]);
    // 更新状态入库
    const updateStatus = (payload) =>{
        setLoading(true)
        updateLpRefreshStatus(payload).then((res)=>{
            setLoading(false)
            if(res.code === 1008){
                getStatus()
            } else {
                openNotification('info', '提示', res.message || '更新数据状态失败')
            }
        })
    }
    // 更新状态type:1 开启或关闭 type:2
    const updatePre = (type) => {
        if (type === 1) {
            updateStatus({ lpSwitch: dataStatus.lpSwitch === 1 ? 0 : 1 })
        } else {
            if (selectedRowKeys.length) {
                updateStatus({ productId: selectedRowKeys.join(','), lpSwitch: 0 })
            } else {
                openNotification('info', '提示', '请至少勾选一个产品进行数据刷新')
            }
        }
    }
    // 点击开启或关闭提示框
    const showModal = () => {
        let content = '';
        if (dataStatus.lpSwitch === 1) {
            content = '关闭数据自动更新后，产品出资方数据不根据交易记录实时更新，保持在当前数据状态。关闭数据自动更新时系统锁定数据状态可能需要较长时间，请耐心等待。'
        } else {
            content = '开启数据自动更新后，产品出资方数据会根据交易记录自动实时更新，保持最新数据状态。开启数据自动更新时系统更新数据状态可能需要较长时间，请耐心等待。'
        }
        Modal.confirm({
            title:'提示',
            content,
            onOk: () => updatePre(1)
        })
    }
    // 获取数据状态
    const getStatus = async () => {
        const res = await getLpRefreshStatus({});
        if (res.code === 1008) {
            setDataStatus(res.data)
        } else {
            openNotification('warning','提示',res.message || '查询数据状态失败')
        }
    }
    // 在当前页面，每隔5分钟查询一次
    useEffect(() => {
        getStatus();
        clearIntervalFlag = setInterval(()=>{
                getStatus()
        },1000*60*5);
        return ()=>{
            clearInterval(clearIntervalFlag)
        }
    }, []);
    // 展示数据状态
    const setStatus = () => {
        const { refreshStatus, lpSwitch } = dataStatus;
        if (refreshStatus === 1) {
            return <Button type="link" disabled>数据处理中...</Button>
        } else if (refreshStatus === 2) {
            return <Button loading={loading} type="link" onClick={showModal}>{`${lpSwitch === 1 ? '关闭' : '开启'}数据自动更新`}</Button>
        }
        return null
    }
    // 数据状态处于关闭时展示手动刷新按钮
    const setHandle = () => {
        const { refreshStatus, lpSwitch } = dataStatus;
        if (lpSwitch === 0) {
            return <Button type="primary" onClick={() => updatePre(2)} disabled={refreshStatus === 1}>手动刷新出资方数据</Button>
        }
        return null;
    }
    // 批量下载确定
    const uploadOnOk = () => {
        setBatchUploadModalFlag(false);
        onSearch()
    }
    return (
        <div className={_styles.productWrapper}>
            <div className={_styles.content}>
                <Form
                    form={form}
                    name="search_product_form"
                    onFinish={onSearch}
                    initialValues={{
                        switch: true,
                        status: "1",
                        isShowSonProduct: 0
                    }}
                >
                    <Row gutter={16}>
                        <Col span={6}>
                            <MultipleSelect
                                params="productId"
                                value="productId"
                                label="productName"
                                formLabel="产品名称"
                            />
                        </Col>
                        <Col span={8}>
                            <Form.Item label="是否具有配售对象资质" name="status">
                                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item name="isShowSonProduct" label="是否展示子产品">
                                <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                    <Option value={1}>是</Option>
                                    <Option value={0}>否</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={4}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={handleReset}>重置</Button>
                            </Space>

                        </Col>

                        {/* <Form.Item
                        label="更新日期"
                        name="updateDate"
                    >
                        <RangePicker style={{ width: '300px' }} />
                    </Form.Item> */}
                        <Col span={12}>
                            <Form.Item>
                                <Space>
                                    <Dropdown
                                        placement="bottomLeft"
                                        overlay={() => {
                                            return (
                                                <Menu>
                                                    <Menu.Item
                                                        key="selected"
                                                        onClick={() =>
                                                            handleExport(
                                                                'selected',
                                                                selectedRowKeys,
                                                            )
                                                        }
                                                    >
                                                        导出选中
                                                    </Menu.Item>
                                                    <Menu.Item
                                                        key="all"
                                                        onClick={() =>
                                                            handleExport('all', selectedRowKeys)
                                                        }
                                                    >
                                                        导出全部
                                                    </Menu.Item>
                                                </Menu>
                                            );
                                        }}
                                    >
                                        <Button>批量导出</Button>
                                    </Dropdown>
                                    <Button
                                        type="primary"
                                        onClick={() => setBatchUploadModalFlag(true)}
                                    >
                                        批量上传
                                    </Button>
                                    {setStatus()}
                                    {setHandle()}
                                </Space>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </div>
            {batchUploadModalFlag && (
                <BatchUpload
                    modalFlag={batchUploadModalFlag}
                    closeModal={() => setBatchUploadModalFlag(false)}
                    templateMsg="配售对象信息模板下载"
                    templateUrl={`/staggingnewApplyProduct/import/template?tokenId=${getCookie(
                        'vipAdminToken',
                    )}`}
                    // params={{ productId: productId ? Number(productId) : undefined }}
                    onOk={uploadOnOk}
                    url="/staggingnewApplyProduct/import"
                />
            )}
            <Table
                loading={tableLoading}
                columns={columns}
                dataSource={tableProduct}
                pagination={paginationOptions}
                scroll={{ x: '100%' }}
                sticky
                onChange={onChangePage}
                rowKey="productId"
                rowSelection={rowSelection}
            />
        </div>
    );
};

export default ProductMaintenance;
