import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Modal, Form, Button, Select, Space, Input, Checkbox, Row, Col } from 'antd';
import MXTable from '@/pages/components/MXTable';
import _styles from './index.less';
const { Option } = Select;

const ProductModal = (props) => {
    const {
        dispatch,
        id: stockId,
        isVisible,
        onCancel,
        onConfirm,
        tableLoading,
        submitLoading,
        canApplyProductList,
    } = props;
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            align: 'center',
            width: 200,
        },
        // {
        //     title: '沪市股票平均市值（万）',
        //     dataIndex: 'shanghaiStockAverageMarker',
        //     align: 'center',
        // },
        // {
        //     title: '深市股票平均市值（万）',
        //     dataIndex: 'shenzhenStockAverageMarker',
        //     align: 'center',
        // },
        {
            title: '资产净值',
            dataIndex: 'capitalScale',
            align: 'center',
        },
        {
            title: '参与市场',
            dataIndex: 'lpInvestType ',
            align: 'center',
            render: (val) => {
                const marketMap = {
                    1: '沪市',
                    2: '深市',
                    3: '科创',
                    4: '创业',
                };
                return marketMap[val];
            },
        },
        {
            title: '是否具有配售对象资质',
            dataIndex: 'canApplyNewShare',
            align: 'center',
            render: (val) => (val === 1 ? '是' : '否'),
        },
        {
            title: '配售对象协会编码',
            dataIndex: 'productSacCode',
            align: 'center',
        },
        {
            title: '配售对象证券账户号（沪市）',
            dataIndex: 'shanghaiStockExchangeAccount',
            align: 'center',
        },
        {
            title: '配售对象证券账户号（深市）',
            dataIndex: 'shenzhenStockExchangeAccount',
            align: 'center',
        },
    ];

    const rowSelection = {
        columnWidth: '32px',
        selectedRowKeys,
        onChange: setSelectedRowKeys,
    };

    const onSearch = useCallback(() => {
        const res = form.getFieldsValue();
        dispatch({
            type: 'staggingStockDetail/getCanApplyProductList',
            payload: {
                secuCode: stockId,
                ...res,
            },
        });
    }, [dispatch, form, stockId]);

    const handleReset = useCallback(() => {
        form.resetFields();
        const res = form.getFieldsValue();
        dispatch({
            type: 'staggingStockDetail/getCanApplyProductList',
            payload: {
                secuCode: stockId,
                ...res
            },
        });
    }, [dispatch, form, stockId]);

    const handleSubmit = useCallback(async () => {
        const productIds = selectedRowKeys;
        if (productIds.length === 0) {
            message.warn('请至少选择一个产品！');
            return;
        }

        const res = await dispatch({
            type: 'staggingStockDetail/generateStaggingMaterials',
            payload: {
                productIds,
                secuCode: stockId,
            },
        });

        if (res.code === 1008) {
            onConfirm(res.data);
        } else {
            message.error(res.message);
        }
    }, [dispatch, onConfirm, selectedRowKeys, stockId]);

    useEffect(() => {
        const selectedKeys = [];
        canApplyProductList.forEach((item) => {
            if (item.checked) selectedKeys.push(item.productId);
        });

        setSelectedRowKeys(selectedKeys);
    }, [canApplyProductList]);

    useEffect(() => {
        const res = form.getFieldsValue();
        if (isVisible) {
            dispatch({
                type: 'staggingStockDetail/getCanApplyProductList',
                payload: {
                    ...res,
                    canApplyNewShare: res.canApplyNewShare || 1,
                    isShowSonProduct: res.isShowSonProduct || 0,
                    secuCode: stockId,
                },
            });
            setTimeout(() => {
                form.resetFields();
            }, 100);
        }
    }, [dispatch, form, isVisible, stockId]);

    return (
        <Modal
            className={_styles.staggingProductModal}
            visible={isVisible}
            width="70%"
            destroyOnClose
            onCancel={onCancel}
            footer={[
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    loading={submitLoading}
                    onClick={handleSubmit}
                >
                    参与打新并生成承销商文件
                </Button>,
            ]}
        >
            <Form form={form} initialValues={{ canApplyNewShare: 1, isShowSonProduct: 0 }} onFinish={onSearch}>
                <Row gutter={12}>
                    <Col span={8}>
                        <Form.Item label="产品名称" name="productName">
                            <Input placeholder="请输入产品名称" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="是否具有配售对象资质" name="canApplyNewShare">
                            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                <Option value={1}>是</Option>
                                <Option value={0}>否</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="参与市场" name="lpInvestType">
                            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                <Option value={1}>沪市</Option>
                                <Option value={2}>深市</Option>
                                <Option value={3}>沪市、深市</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="isShowSonProduct" label="是否展示子产品">
                            <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                                <Option value={1}>是</Option>
                                <Option value={0}>否</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8} offset={8}>
                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={handleReset}>重置</Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <MXTable
                loading={tableLoading}
                columns={columns}
                dataSource={canApplyProductList}
                scroll={{ x: '100%', y: 400 }}
                sticky
                rowKey="productId"
                rowSelection={rowSelection}
                pagination={false}
            />
        </Modal>
    );
};

export default connect(({ staggingStockDetail, loading }) => ({
    tableLoading: loading.effects['staggingStockDetail/getCanApplyProductList'],
    submitLoading: loading.effects['staggingStockDetail/generateStaggingMaterials'],
    canApplyProductList: staggingStockDetail.canApplyProductList,
}))(ProductModal);
