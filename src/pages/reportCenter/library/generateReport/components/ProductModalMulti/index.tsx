import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Checkbox, message, Spin } from 'antd';
import styles from './index.less';
import { getProductTable, getCustomList } from '../../../../service';

const ProductModal: React.FC<{}> = (props) => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [customerData, setCustomerData] = useState([]);
    const [selectRow, setSelectRow] = useState({});
    const [pageTotal, setPageTotal] = useState(0);
    const [pageTotalC, setPageTotalC] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [pageNumC, setPageNumC] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [pageSizeC, setPageSizeC] = useState(10);
    const [params, setParams] = useState('');
    const [selectedRowKeys, setselectedRowKeys] = useState([]);
    const [selectedRows, setselectedRows] = useState([]);
    const [loading, setloading] = useState(false);

    const { visible, handleCancel, dimension, handleSubmit } = props;

    const columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            align: 'center',
            ellipsis: true,
        },
        {
            title: '产品编号',
            dataIndex: 'productCode',
            align: 'center',
            ellipsis: true,
        },
    ];

    const customColumn = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            align: 'center',
        },
    ];

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setselectedRowKeys(selectedRowKeys);
            setselectedRows(selectedRows);
        },
    };

    const handleSelect = () => {
        if (selectedRows.length) {
            handleSubmit(selectedRows);
        } else {
            message.error('请选择产品');
        }
    };

    const handleSearch = async () => {
        try {
            const values = await form.validateFields();
            setParams(values.nameOrCode);
            dispatchTableData(values);
        } catch (err) {
            console.info('err');
        }
    };

    const handleReset = () => {
        form.setFieldsValue({
            nameOrCode: '',
        });
        setParams('');
        dispatchTableData({
            pageNum: 1,
            pageSize: 10,
        });
    };

    const dispatchTableData = async (data) => {
        setloading(true);

        let params = {
            nameOrCode: '',
            pageNum: 1,
            pageSize: 10,
        };
        if (data) {
            params = { ...params, ...data };
        }
        const res = await getProductTable(params);
        setTableData(res.data?.list);
        setPageTotal(res.data?.total);
        setPageNum(res.data?.pageNum);
        setPageSize(res.data?.pageSize);
        setloading(false);
    };

    const handlePageChange = (current, size) => {
        dispatchTableData({
            nameOrCode: params,
            pageNum: current,
            pageSize: size,
        });
    };

    const handlePageChangeC = (current, size) => {
        dispatchCustomList({
            pageNum: current,
            pageSize: size,
        });
    };

    const dispatchCustomList = async (data) => {
        setloading(true);
        let params = {
            pageNum: 1,
            pageSize: 10,
        };
        if (data) {
            params = { ...params, ...data };
        }
        const res = await getCustomList(params);
        setCustomerData(res.data.list);
        setPageTotalC(res.data?.total);
        setPageNumC(res.data?.pageNum);
        setPageSizeC(res.data?.pageSize);
        setloading(false);
    };

    useEffect(() => {
        if (dimension === 'product') {
            handleReset();
        } else {
            dispatchCustomList({
                pageNum: 1,
                pageSize: 10,
            });
        }
    }, [dimension]);

    return (
        <Modal
            title="产品选择"
            visible={visible}
            width={640}
            forceRender
            onOk={handleSelect}
            onCancel={handleCancel}
        >
            <Spin spinning={loading}>
                <div className={styles.container}>
                    {dimension === 'product' ? (
                        <>
                            <div className={styles.searchBar}>
                                <Form
                                    form={form}
                                    layout="inline"
                                    name="search-hooks"
                                    style={{ width: '100%' }}
                                >
                                    <Form.Item name="nameOrCode" label="产品名称或产品编码">
                                        <Input style={{ width: 200 }} />
                                    </Form.Item>
                                    <Form.Item shouldUpdate>
                                        {() => (
                                            <>
                                                <Button
                                                    type="primary"
                                                    className={styles.searchBtn}
                                                    onClick={handleSearch}
                                                >
                                                    查询
                                                </Button>
                                                <Button onClick={handleReset}>重置</Button>
                                            </>
                                        )}
                                    </Form.Item>
                                </Form>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={tableData}
                                rowSelection={rowSelection}
                                rowKey="productId"
                                pagination={{
                                    total: pageTotal,
                                    pageSize: pageSize,
                                    current: pageNum,
                                    onChange: handlePageChange,
                                }}
                            />
                        </>
                    ) : (
                        <Table
                            columns={customColumn}
                            dataSource={customerData}
                            rowSelection={rowSelection}
                            rowKey="customerId"
                            pagination={{
                                total: pageTotalC,
                                pageSize: pageSizeC,
                                current: pageNumC,
                                onChange: handlePageChangeC,
                            }}
                        />
                    )}
                </div>
            </Spin>
        </Modal>
    );
};

export default ProductModal;
