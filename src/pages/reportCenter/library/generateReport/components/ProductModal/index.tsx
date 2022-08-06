import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Table, Checkbox, message } from 'antd';
import styles from './index.less';
import { getProductTable } from '../../../../service';

const ProductModal: React.FC<{}> = (props) => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState([]);
    const [selectRow, setSelectRow] = useState({});
    const [pageTotal, setPageTotal] = useState(0);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [params, setParams] = useState('');

    const { visible, handleCancel, handleSubmit } = props;

    const columns = [
        {
            title: '',
            align: 'center',
            width: 56,
            render: (data) => {
                return (
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Checkbox
                            checked={selectRow?.productId === data.productId}
                            onChange={() => checkboxClick(data)}
                        />
                    </div>
                );
            },
        },
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

    const checkboxClick = (data) => {
        setSelectRow(data);
    };

    const handleSelect = () => {
        if (selectRow.productId) {
            handleSubmit(selectRow);
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
        dispatchTableData();
    };

    const dispatchTableData = async (data) => {
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
    };

    const handlePageChange = (current, size) => {
        dispatchTableData({
            nameOrCode: params,
            pageNum: current,
            pageSize: size,
        });
    };

    useEffect(() => {
        handleReset();
    }, []);

    return (
        <Modal
            title="产品选择"
            visible={visible}
            width={640}
            forceRender
            onOk={handleSelect}
            onCancel={handleCancel}
        >
            <div className={styles.container}>
                <div className={styles.searchBar}>
                    <Form form={form} layout="inline" name="search-hooks" style={{ width: '100%' }}>
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
                    pagination={{
                        total: pageTotal,
                        pageSize: pageSize,
                        current: pageNum,
                        onChange: handlePageChange,
                    }}
                ></Table>
            </div>
        </Modal>
    );
};

export default ProductModal;
