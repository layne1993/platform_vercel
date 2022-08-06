import React, { useState, useEffect, useCallback } from 'react';
import { connect, Link } from 'umi';
import { message, Card, Form, Select, DatePicker, Button, Dropdown, Menu, Space } from 'antd';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect } from '@/pages/components/Customize';
import moment from 'moment';
import { exportExcel } from '@/utils/utils';
import _styles from './index.less';
const { Option } = Select;

const sheetOptions = {
    fileName: '',
    datas: [
        {
            sheetData: [],
            sheetName: 'sheet',
            sheetFilter: [
                'productName',
                'lpInvestDetail',
                'updateTime',
                'capitalScale',
                'proposedPrice',
                'proposedShares',
                'applyResult',
                'initalShares',
                'quota',
                'brokerageFee',
                'payInAmount',
                'type',
                'payInStatus',
                'restrictedRate',
                'restrictedShares',
                'restrictedTime'
            ],
            sheetHeader: [
                '产品名称',
                '出资方信息概览（X层/Y个）',
                '出资方更新日期',
                '资产规模数据',
                '拟申报价格',
                '拟申购股数',
                '初步配售股数',
                '申报结果',
                '获配金额',
                '经纪佣金',
                '合计应缴',
                '分类',
                '缴款状态',
                '限售比例',
                '限售股数',
                '限售时间'
            ]
        }
    ]
};

const ProductInfo = (props) => {
    const { dispatch, id, tableLoading, staggingStockDetail, onReChoose } = props;
    const { applyProductPageNum, applyProductPageSize, applyProductList, applyProductTotal, searchForm } = staggingStockDetail;

    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const columns = [{
        title: '产品名称',
        dataIndex: 'productName',
        align: 'center',
        fixed: 'left',
        width: 200,
        render: (val, row) => <Link to={`/staggingTool/product/detail/${row.productId}`}>{val}</Link>
    }, {
        title: '出资方信息概览（X层/Y个）',
        dataIndex: 'lpInvestDetail',
        align: 'center',
        width: 200
    }, {
        title: '出资方更新日期',
        dataIndex: 'updateTime',
        align: 'center',
        width: 200,
        render: (val) => val ? moment(val).format('YYYY-MM-DD') : ''
    }, {
        title: '资产规模数据',
        dataIndex: 'capitalScale',
        align: 'center',
        width: 200
    }, {
        title: '拟申报价格',
        dataIndex: 'proposedPrice',
        align: 'center',
        width: 200
    }, {
        title: '拟申购股数',
        dataIndex: 'proposedShares',
        align: 'center',
        width: 200
    }, {
        title: '申报结果',
        dataIndex: 'applyResult',
        align: 'center',
        width: 200
    }, {
        title: '初步配售股数',
        dataIndex: 'initalShares',
        align: 'center',
        width: 200
    }, {
        title: '获配金额',
        dataIndex: 'quota',
        align: 'center',
        width: 200
    }, {
        title: '经纪佣金',
        dataIndex: 'brokerageFee',
        align: 'center',
        width: 200
    }, {
        title: '合计应缴',
        dataIndex: 'payInAmount',
        align: 'center',
        width: 200
    }, {
        title: '分类',
        dataIndex: 'type',
        align: 'center',
        width: 200
    }, {
        title: '缴款状态',
        dataIndex: 'payInStatus',
        align: 'center',
        render: (val) => val === 1 ? '已缴款' : '未缴款',
        width: 200
    }, {
        title: '限售比例',
        dataIndex: 'restrictedRate',
        align: 'center',
        width: 200
    }, {
        title: '限售股数',
        dataIndex: 'restrictedShares',
        align: 'center',
        width: 200
    }, {
        title: '限售时间',
        dataIndex: 'restrictedTime',
        align: 'center',
        width: 200
    }];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys
    };

    const onSearch = useCallback(() => {
        const { productId, applyResult, updateTime } = form.getFieldsValue();
        const searchForm = {
            applyResult,
            productId: productId,
            updateTime: updateTime ? moment(updateTime).format('YYYY-MM-DD') : ''
        };
        dispatch({
            type: 'staggingStockDetail/updateModelData',
            payload: {
                applyProductPageNum: 1,
                searchForm
            }
        });
    }, [dispatch, form]);

    const handleReset = useCallback(() => {
        form.resetFields();
        dispatch({
            type: 'staggingStockDetail/updateModelData',
            payload: {
                applyProductPageNum: 1,
                searchForm: {}
            }
        });
    }, [dispatch, form]);

    const handleExport = useCallback(async (type) => {
        let data = [];
        if (type === 'selected') {
            if (selectedRowKeys.length === 0) {
                message.info('请至少选择一行！');
                return;
            }
            data = selectedRowKeys.map((id) => {
                return applyProductList.find((item) => item.id === id);
            });
        } else {
            const res = await dispatch({
                type: 'staggingStockDetail/getAllApplyProductList',
                payload: {
                    secuCode: id
                }
            });
            const allData = res.data || {};
            data = allData.list || [];
        }

        data.forEach((item) => {
            item.updateTime = item.updateTime ? moment(item.updateTime).format('YYYY-MM-DD') : '';
            item.payInStatus = item.payInStatus === 1 ? '已缴款' : '未缴款';
        });

        sheetOptions.fileName = `${new Date().getTime()}`;
        sheetOptions.datas[0].sheetData = data;
        exportExcel(sheetOptions);
    }, [applyProductList, dispatch, id, selectedRowKeys]);

    const onChangePage = useCallback((p) => {
        dispatch({
            type: 'staggingStockDetail/updateModelData',
            payload: {
                applyProductPageNum: p.current,
                applyProductPageSize: p.pageSize
            }
        });
    }, [dispatch]);

    useEffect(() => {
        dispatch({
            type: 'staggingStockDetail/getApplyProductList',
            payload: {
                secuCode: id,
                pageNum: applyProductPageNum,
                pageSize: applyProductPageSize,
                ...searchForm
            }
        });
    }, [applyProductPageNum, applyProductPageSize, dispatch, id, searchForm]);

    return (
        <Card title="配售对象信息表" className={_styles.productInfo}>
            <Form
                form={form}
                name="search_product_form"
                layout="inline"
                onFinish={onSearch}
            >
                <MultipleSelect
                    params="productId"
                    value="productId"
                    label="productName"
                    formItemLayout={{ style: { width: 300 } }}
                    formLabel="产品名称"
                />
                <Form.Item
                    label="申报结果"
                    name="applyResult"
                >
                    <Select placeholder="请选择" style={{ width: '200px' }} allowClear>
                        <Option value={1}>中签</Option>
                        <Option value={0}>未中签</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    label="更新日期"
                    name="updateTime"
                >
                    <DatePicker style={{ width: '200px' }}></DatePicker>
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" onClick={onReChoose}>修改参与产品</Button>
                        <Dropdown
                            placement="bottomLeft"
                            overlay={() => {
                                return <Menu>
                                    <Menu.Item onClick={() => handleExport('selected')}>导出选中</Menu.Item>
                                    <Menu.Item onClick={() => handleExport('all')}>导出全部</Menu.Item>
                                </Menu>;
                            }}
                        >
                            <Button>批量导出</Button>
                        </Dropdown>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <Button onClick={handleReset}>重置</Button>
                    </Space>
                </Form.Item>
            </Form>
            <MXTable
                loading={tableLoading}
                columns={columns}
                dataSource={applyProductList}
                total={applyProductTotal}
                pageNum={applyProductPageNum}
                scroll={{ x: '100%' }}
                sticky
                onChange={onChangePage}
                rowKey="id"
                rowSelection={rowSelection}
            />
        </Card>
    );
};

export default connect(({ staggingStockDetail, loading }) => ({
    staggingStockDetail,
    tableLoading: loading.effects['staggingStockDetail/getApplyProductList']
}))(ProductInfo);
