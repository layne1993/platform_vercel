/*
 * @description: 新建资产证明
 * @Author: tangsc
 * @Date: 2021-05-12 17:12:06
 */
import React, { useState, useEffect } from 'react';
import styles from './List.less';
import { connect } from 'umi';
import { Modal, Form, Button, Select, Row, Col, Input, notification, Space } from 'antd';
import { XWcustomerCategoryOptions } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';
import { cloneDeep, isEmpty } from 'lodash';
import MXTable from '@/pages/components/MXTable';


const FormItem = Form.Item;
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const AddModal = (props) => {

    const { isModalVisible, onCancel, onOk, dispatch, params = {}, loading, saveLoading } = props;
    const [formFilter] = Form.useForm();
    const [editForm] = Form.useForm();
    // console.log(props)
    // 保存所有产品列表
    const [productList, setProductList] = useState([]);

    // 列表选择项
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);


    const [isEditaVisible, setIsEditaVisible] = useState(false);

    const [holderList, setHolderList] = useState([]);

    // 客户id
    const [customerId, setCustomerId] = useState(0);

    // 列表查询
    const _search = () => {
        const fields = formFilter.getFieldsValue();
        // 初始化获取产品列表
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/queryHolders',
            payload: {
                ...fields,
                customerId:params.customerId,
                pageSize: 99999
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setHolderList(res.data.list);
                    setSelectedRowKeys([]);
                }
            }
        });
    };

    // form表单提交
    const _onFinish = (values) => {
        _search();
        // setIsEditaVisible(true);
        // onOk(values);
    };

    // 重置过滤条件
    const _reset = () => {
        formFilter.resetFields();
        _search();
    };

    // 查询持有产品列表
    const _queryHoldingProducts = (params = {}, change=0) => {
        // 初始化获取产品列表
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/holdingProducts',
            payload: {
                ...params
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setProductList(res.data);
                    if (change===1) {
                        let tempArr = [];
                        // Array.isArray(res.data) &&
                        res.data.forEach((item) => {
                            tempArr.push({
                                key: item.productId,
                                label: item.productFullName,
                                value: item.productId
                            });
                        });
                        editForm.setFieldsValue({
                            productIds: tempArr
                        });
                    }
                }
            }
        });
    };

    // 打开更改产品弹窗
    const _toggle = (record) => {
        setIsEditaVisible(true);
        if (record.productIds) {
            editForm.setFieldsValue({
                productIds: record.saveProducts
            });
        } else {
            _queryHoldingProducts({ customerId: record.customerId, change:1});
            // editForm.resetFields();
        }
        setCustomerId(record.customerId);
    };

    // Table的列
    const columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '客户类别',
            dataIndex: 'customerType',
            width: 100,
            render: (val) => {
                let obj = XWcustomerCategoryOptions.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '全部持有产品',
            dataIndex: 'allHoldingProducts',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '申请证明产品',
            dataIndex: 'productNames',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render: (text, record) => {
                return (
                    // this.props.authExport &&
                    <Space>
                        <a onClick={() => _toggle(record)}>更改产品 </a>
                    </Space >
                );
            }

        }
    ];

    // Table的CheckBox change事件
    const _onSelectChange = (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
    };


    const rowSelection = {
        selectedRowKeys,
        onChange: _onSelectChange
    };

    // 新建资产证明onok事件
    const _handleCreate = () => {
        let tempList = [];
        tempList = holderList.filter((item) => {
            return selectedRowKeys.includes(item.customerId);
        });
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/create',
            payload: {
                list: tempList
            },
            callback: (res) => {
                if (res.code === 1008) {
                    onCancel();
                    openNotification('success', '提示', '新建成功', 'topRight');
                } else {
                    const warningText = res.message || res.data || '新建失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const _onCancel = () => {
        setIsEditaVisible(false);
    };

    // 更改产品onok事件
    const _handelOk = () => {
        editForm.validateFields().then(() => {
            let fields = editForm.getFieldsValue();
            const { productIds } = fields;
            let nameList = [];
            let idList = [];
            if (Array.isArray(productIds)) {
                productIds.forEach((item) => {
                    nameList.push(item.label);
                    idList.push(item.value);
                });
            }
            let tempList = cloneDeep(holderList);
            tempList.forEach((item) => {
                if (!isEmpty(nameList) && item.customerId === customerId) {
                    item.productNames = nameList.join('，');
                    item.productIds = idList;
                    item.saveProducts = productIds;
                }
            });
            setHolderList(tempList);
            _onCancel();
        }).catch((errorInfo) => {
            console.log(errorInfo, 'errorInfo');
        });
    };

    useEffect(() => {
        _queryHoldingProducts(params);
        _search();
    }, []);

    return (
        <Modal
            width={'75%'}
            className={styles.addProveContainer}
            title="新建资产证明"
            centered
            maskClosable={false}
            visible={isModalVisible}
            onCancel={onCancel}
            footer={null}
        >
            <Form
                name="addForm"
                form={formFilter}
                autoComplete="off"
                onFinish={_onFinish}
            >
                {
                    !params.customerId &&
                    <Row gutter={[8, 0]} justify="space-around">

                        <Col span={10}>
                            <FormItem
                                label="客户名称"
                                name="customerName"
                            >
                                <Input placeholder="请输入" />
                            </FormItem>
                        </Col>

                        <Col span={10}>
                            <FormItem
                                label="证件号码"
                                name="cardNumber"
                            >
                                <Input placeholder="请输入" />
                            </FormItem>
                        </Col>
                    </Row>
                }
                <Row gutter={[8, 0]} justify={params.customerId ? 'start' : 'space-around'}>
                    {
                        !params.customerId &&
                        <Col span={10}>
                            <FormItem
                                label="客户类型"
                                name="customerType"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {
                                        !isEmpty(XWcustomerCategoryOptions) &&
                                        XWcustomerCategoryOptions.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    }
                    <Col span={10}>
                        <FormItem
                            label="持有产品"
                            name="productIds"
                            className={styles.multipleChoose}
                        >
                            <Select placeholder="请选择"
                                // showArrow
                                allowClear
                                showSearch
                                defaultActiveFirstOption={false}
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                notFoundContent={null}
                                mode="multiple"
                            >
                                {
                                    Array.isArray(productList) &&
                                    productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productFullName}</Option>)
                                }
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={[8, 0]} justify="space-around">
                    <Col span={10}></Col>
                    <Col span={10} className={styles.btnGroup}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button onClick={_reset}>重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <div className={styles.dataTable}>
                <MXTable
                    loading={loading}
                    columns={columns}
                    dataSource={holderList || []}
                    rowSelection={rowSelection}
                    scroll={{ x: '100%', y: 350, scrollToFirstRowOnChange: true }}
                    rowKey={(record) => record.customerId}
                    pagination={false}
                />

            </div>
            {
                <Space className={styles.modalBtnGroup}>
                    <Button type="primary" onClick={_handleCreate} loading={saveLoading}>保存</Button>
                    <Button onClick={onCancel} >取消</Button>
                    <div className={styles.btnTips}>
                        <p>选择客户后，点击确定自动生成该客户所有持有产品的资产证明，</p>
                        <p>如果您需要选择产品，请点击“更改产品”按钮</p>
                    </div>
                </Space>
            }
            {
                isEditaVisible &&
                <Modal
                    width={400}
                    title="更改产品"
                    centered
                    maskClosable={false}
                    visible={isEditaVisible}
                    onCancel={_onCancel}
                    className={styles.editProductModal}
                    footer={
                        [
                            <Button key="next" type="primary" className="modalButton" onClick={_handelOk}>
                                确定
                            </Button>,
                            <Button key="cancel" className="modalButton" onClick={_onCancel}>
                                取消
                            </Button>
                        ]
                    }
                >
                    <Form
                        name="edit"
                        form={editForm}
                        autoComplete="off"
                    >
                        <FormItem
                            label="持有产品"
                            name="productIds"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择持有产品'
                                }
                            ]}
                            className={styles.multipleChoose}
                        >
                            <Select placeholder="请选择"
                                // showArrow
                                allowClear
                                showSearch
                                defaultActiveFirstOption={false}
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                                notFoundContent={null}
                                mode="multiple"
                                labelInValue
                            >
                                {
                                    Array.isArray(productList) &&
                                    productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productFullName}</Option>)
                                }
                            </Select>
                        </FormItem>
                    </Form>
                </Modal>
            }

        </Modal >
    );
};
export default connect(({ INVESTOR_ASSETSPROVE, loading }) => ({
    INVESTOR_ASSETSPROVE,
    loading: loading.effects['INVESTOR_ASSETSPROVE/queryHolders'],
    saveLoading: loading.effects['INVESTOR_ASSETSPROVE/create']
}))(AddModal);
