/*
 * @description: 产品预约管理-列表
 * @Author: tangsc
 * @Date: 2020-11-02 17:51:03
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import { Button, Row, Col, Form, Select, Input, Dropdown, Menu, DatePicker, notification, Modal, Space } from 'antd';
import {
    XWAppointmentType,
    AppointmentSource,
    AppointmentProgress
} from '@/utils/publicData';
import { PlusOutlined, ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getRandomKey, getCookie, fileExport, numTransform2 } from '@/utils/utils';
import moment from 'moment';
import ReservationDetails from '../../reservationDetails';
import { MultipleSelect } from '@/pages/components/Customize';
import MXTable from '@/pages/components/MXTable';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ productList, loading }) => ({
    productList,
    loading: loading.effects['reservationList/getProductApply']
}))
class ReservationList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {},              // 查询参数
        sortFiled: '',                 // 排序字段
        sortType: '',                  // 排序类型：asc-升序；desc-降序
        productList: [],               // 产品列表
        isModalVisible: false,         // 控制新增弹窗显示隐藏
        isAddOrEdit: 'add',            // 判断新增或者编辑
        isExamineModal: false,         // 控制产品预约审核弹窗显示隐藏
        applyId: 0,                    // 产品预约id
        operateType: 1,                // 1：审核 2：修改
        rowInfo: {},                    //选择行信息
        needAudit: 0,                   // 是否需要审核 0：否 1：是
        columns: [],
        managerList: []                 // 客户经理
    };


    componentDidMount() {
        this.getManagerList();
        this._search();
        this._setColums();
        // 查询产品列表
        this._getProductList();
        this._queryProductSetting();
    }

    // 表单实例对象
    formRef = React.createRef();
    examineFormRef = React.createRef();

    // Table的列
    columns1 = [

        {
            title: '客户名称',
            dataIndex: 'customerName',
            fixed: 'left',
            width: 100,
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '客户经理',
            dataIndex: 'saleUserName',
            width: 150,
            render: (val) => <p style={{ marginBottom: 0 }} title={val}>{val}</p>
        },
        {
            title: '分配时间',
            dataIndex: 'managerDistribute',
            width: 150,
            render: (val) => val ? moment(val).format(dateFormat) : '--'
        },
        {
            title: '预约类型',
            dataIndex: 'applyType',
            width: 80,
            render: (val) => {
                let obj = XWAppointmentType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '预约时间',
            dataIndex: 'applyDate',
            width: 120,
            sorter: true,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '预约额',
            dataIndex: 'applyMoney',
            width: 120,
            sorter: true,
            render: (val) => <span>{numTransform2(val)}</span>
        },
        {
            title: '备注内容',
            dataIndex: 'remark',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预约来源',
            dataIndex: 'applySource',
            width: 100,
            render: (val) => {
                let obj = AppointmentSource.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },

        {
            title: '操作人员',
            dataIndex: 'operateUserName',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预约状态',
            dataIndex: 'status',
            width: 100,
            render: (val) => {
                let obj = AppointmentProgress.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 120,
            render: (text, record) => {
                return (
                    <Space>
                        {
                            (record.needAudit === 1 && this.props.authEdit) && <span className="details" onClick={() => this._examine(record.applyId, 1, record)} style={{ color: 'red' }}>审核 </span>
                        }
                        {
                            (record.editable === 1 && this.props.authEdit) && <span className="details" onClick={() => this._examine(record.applyId, 2, record)}>修改 </span>
                        }
                        {
                            this.props.authEdit && <span className="details" onClick={() => this._handleDelete(record.applyId)}>删除 </span>
                        }
                    </Space>
                );
            }
        }
    ];

    // Table的列
    columns2 = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            fixed: 'left',
            width: 100,
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '客户经理',
            dataIndex: 'saleUserName',
            width: 150,
            render: (val) => <p style={{ marginBottom: 0 }} title={val}>{val}</p>
        },
        {
            title: '分配时间',
            dataIndex: 'managerDistribute',
            width: 150,
            render: (val) => val ? moment(val).format(dateFormat) : '--'
        },
        {
            title: '预约类型',
            dataIndex: 'applyType',
            width: 80,
            render: (val) => {
                let obj = XWAppointmentType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '预约时间',
            dataIndex: 'applyDate',
            width: 120,
            sorter: true,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '预约额',
            dataIndex: 'applyMoney',
            width: 120,
            sorter: true,
            render: (val) => <span>{numTransform2(val)}</span>
        },
        {
            title: '备注内容',
            dataIndex: 'remark',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预约来源',
            dataIndex: 'applySource',
            width: 100,
            render: (val) => {
                let obj = AppointmentSource.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 120,
            render: (text, record) => {
                return (
                    <Space>
                        {
                            (record.needAudit === 1 && this.props.authEdit) && <span className="details" onClick={() => this._examine(record.applyId, 1, record)} style={{ color: 'red' }}>审核 </span>
                        }
                        {
                            (record.editable === 1 && this.props.authEdit) && <span className="details" onClick={() => this._examine(record.applyId, 2, record)}>修改 </span>
                        }
                        {
                            this.props.authEdit && <span className="details" onClick={() => this._handleDelete(record.applyId)}>删除 </span>
                        }
                    </Space>
                );
            }
        }
    ];

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { productId } = this.props;
        if (!productId) {
            this.columns1.splice(2, 0,
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    width: 120,
                    render: (val) => <span>{val || '--'}</span>
                });

            this.columns2.splice(2, 0,
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    width: 120,
                    render: (val) => <span>{val || '--'}</span>
                });
        }else{
            this.columns1.splice(0, 0,        {
                title: '份额类别',
                dataIndex: 'parentProductId',
                width:100,
                fixed: 'left',
                render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
            },);
            this.columns2.splice(0, 0,        {
                title: '份额类别',
                dataIndex: 'parentProductId',
                width:100,
                fixed: 'left',
                render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
            },);
        }

    }

    _queryProductSetting = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/queryProductSetting',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        needAudit: res.data.isApplyNeedCheck,
                        columns: res.data.isApplyNeedCheck === 1 ? this.columns1 : this.columns2
                    });
                }
            }
        });
    }

    /**
    * @description 获取客户经理
    */
    getManagerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/selectAllAccountManager',
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    this.setState({managerList: data});
                }
            }
        });
    };

    /**
     * @description: 点击审核按钮
     * @param {Number} id
     * @param {Number} type 1：审核 2：修改
     */
    _examine = (id, type, record) => {
        this.setState({
            applyId: id,
            isExamineModal: true,
            operateType: type,
            rowInfo: record
        });
    }

    /**
     * @description: 删除单条资产证明
     * @param {Number} id
     */
    _handleDelete = (id) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '是否删除该客户的产品预约申请?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后，后台和投资者端都没有该条申请信息，请您确认是否删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'reservationList/deleteApply',
                    payload: {
                        applyId: id
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== id;
                            });
                            _this.setState({
                                selectedRowKeys: selectArr
                            });
                        } else {
                            const warningText = res.message || res.data || '删除失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }


    /**
     * @description: 关闭产品预约审核弹窗
     * @param {*}
     */
    _onClose = () => {
        this.setState({
            isExamineModal: false,
            operateType: 1,
            applyId: 0
        });
    }


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { applyDate, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.applyDate = (applyDate && new Date(`${moment(applyDate).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        this.setState({
            searchParams: {
                ...params,
                ...tempObj
            },
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                current: 1
                // pageSize: 20
            }
        }, () => {
            this._search();
        });
    };


    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch, productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'reservationList/getProductApply',
            payload: {
                productId: !!productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        applyInfoList: res.data,
                        productId: !!productId ? Number(productId) : undefined
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        applyInfoList: []
                    });
                }
            }
        });
    }

    /**
     * @description: 查询所有产品
     * @param {*}
     */
    _getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/queryByProductName',
            payload: {
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {},
            selectedRowKeys: []
        }, () => {
            this._search();
        });
    };

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description: 清空已勾选
     */
    _cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: []
        });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState({
            sortFiled: s.field,
            sortType: !!s.order ? s.order === 'ascend' ? 'asc' : 'desc' : undefined,
            pageData: {
                current: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }

    /**
     * @description: 审核按钮
     * @param {*}
     */
    _onOk = (status) => {
        const { applyId } = this.state;
        const fields = this.examineFormRef.current.getFieldsValue();
        const { dispatch } = this.props;
        dispatch({
            type: 'reservationList/auditProductApply',
            payload: {
                applyId,
                status,
                ...fields
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '操作成功', 'topRight');
                    this._onClose();
                    this._search();
                } else {
                    const warningText = res.message || res.data || '操作失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }


    /**
     * @description: 新增预约
     */
    _onAdd = () => {
        this.setState({
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };


    /**
     * @description: 关闭新增弹窗
     * @param {*}
     */
    _handleClose = () => {
        this.setState({
            isModalVisible: false
        }, () => {
            this._search();
        });
    }

    /**
     * @description: 批量导出
     * @param {*}
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        const { productId } = this.props;
        if (productId) {
            window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/productApply/batchDownload?applyIds=${selectedRowKeys.toString()}&productId=${productId}&tokenId=${getCookie('vipAdminToken')}`;
        } else {
            window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/productApply/batchDownload?applyIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
        }

    }


    // 导出全部
    _downloadAll = () => {
        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        fileExport({
            method: 'post',
            url: '/productApply/allExport',
            data: {
                productId: !!productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    }

    render() {
        const { pageData, selectedRowKeys, applyInfoList, isModalVisible, isAddOrEdit, isExamineModal, operateType, needAudit, managerList, rowInfo } = this.state;
        const { loading, productId } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };


        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef} labelCol={{ span: 8 }}>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="客户名称" name="customerName">
                                    <Input placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            {
                                !productId &&
                                <Col span={6}>
                                    <MultipleSelect
                                        params="productIds"
                                        value="productId"
                                        label="productName"
                                        mode="multiple"
                                        formLabel="产品名称"
                                    />
                                </Col>
                            }
                            {
                                (productId && needAudit === 1) &&
                                <Col span={6}>
                                    <FormItem label="证件号码" name="cardNumber">
                                        <Input placeholder="请输入" />
                                    </FormItem>
                                </Col>
                            }

                            <Col span={6}>
                                <FormItem label="预约时间" name="applyDate">
                                    <DatePicker style={{ width: '100%' }} format={'YYYY/MM/DD'} />
                                </FormItem>
                            </Col>
                            <Col span={6} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="预约类型" name="applyType">
                                    <Select placeholder="请选择"  allowClear>
                                        {
                                            XWAppointmentType.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                needAudit === 1 &&
                                <Col span={6}>
                                    <FormItem label="预约状态" name="status">
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                AppointmentProgress.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }

                            <Col span={6}>
                                <FormItem label="预约来源" name="applySource">
                                    <Select placeholder="请选择"  allowClear>
                                        {
                                            AppointmentSource.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    label="客户经理"
                                    name="managerUserIds"
                                >
                                    <Select
                                        mode="multiple"
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children && option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {Array.isArray(managerList) && managerList.map((item) => (
                                            <Select.Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            {/* <Col span={8}>
                                <FormItem label="预约状态" name="status">
                                    <Select placeholder="请选择">
                                        {
                                            XWAppointmentStatus.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col> */}

                        </Row>
                        {
                            (!productId && needAudit === 1) &&
                            <Row gutter={[8, 0]}>
                                <Col span={6}>
                                    <FormItem label="证件号码" name="cardNumber">
                                        <Input placeholder="请输入" />
                                    </FormItem>
                                </Col>
                            </Row>
                        }

                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        {
                            this.props.authEdit &&
                            <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                新建
                            </Button>
                        }
                        {
                            this.props.authExport &&
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={this._export}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={this._downloadAll}
                                    >
                                        导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    &nbsp;&nbsp;批量导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        }

                    </div>
                    {/* {!isEmpty(selectedRowKeys) && (
                        <Alert
                            message={
                                <Fragment>
                                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                    <a onClick={this._cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                        清空
                                    </a>
                                </Fragment>
                            }
                            type="info"
                            showIcon
                        />
                    )} */}
                    {/* <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={applyInfoList && applyInfoList.list}
                        rowKey={(record) => record.applyId}
                        scroll={{ x: '100%',y:500,scrollToFirstRowOnChange:true }}
                        pagination={paginationPropsback(
                            applyInfoList && applyInfoList.total,
                            pageData.current
                        )}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                    /> */}
                    <MXTable
                        loading={loading}
                        columns={this.state.columns}
                        dataSource={applyInfoList && applyInfoList.list}
                        total={applyInfoList && applyInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.applyId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                    />
                </div>
                {
                    isModalVisible &&
                    <ReservationDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        productId={!!productId ? Number(productId) : undefined}
                        type={isAddOrEdit}
                        authEdit={this.props.authEdit}
                        authExport={this.props.authExport}
                    />
                }
                {
                    isExamineModal &&
                    <Modal
                        width={700}
                        title={operateType === 1 ? '产品预约审核' : '预约状态修改'}
                        centered
                        maskClosable={false}
                        visible={isExamineModal}
                        onCancel={this._onClose}
                        footer={
                            [

                                <Button key="cancel" className="modalButton" onClick={this._onClose}>
                                    取消
                                </Button>,
                                <Button key="next" className="modalButton" onClick={() => this._onOk(2)}>
                                    审核不通过
                                </Button>,
                                <Button
                                    key="next"
                                    type="primary"
                                    className="modalButton"
                                    onClick={() => this._onOk(1)}
                                    style={{ display: operateType === 2 ? 'none' : '' }}
                                >
                                    审核通过
                                </Button>
                            ]
                        }
                    >
                        <Form
                            name="examine"
                            ref={this.examineFormRef}
                            autoComplete="off"
                            {...formItemLayout}
                            initialValues={{
                                saleIdList: rowInfo.saleIdList
                            }}
                        >
                            <FormItem
                                label="审核不通过反馈"
                                name="auditOpinion"
                            >
                                <TextArea placeholder="请输入反馈意见" />
                            </FormItem>

                            <Form.Item
                                label="客户经理"
                                name="saleIdList"
                                rules={[{ required: false, message: '请选择' }]}
                            >
                                <Select mode="multiple" allowClear>
                                    {Array.isArray(managerList) && managerList.map((item) => (
                                        <Select.Option key={item.managerUserId} value={item.managerUserId + ''}>{item.userName}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <FormItem
                                label="客户经理自动分配时间"
                            >
                                {rowInfo?.managerDistribute && moment(rowInfo.managerDistribute).format('YYYY/MM/DD HH:mm')}
                            </FormItem>
                            <FormItem
                                label="投资者预约时间"
                            >
                                {rowInfo?.applyDate && moment(rowInfo.applyDate).format('YYYY/MM/DD HH:mm')}
                            </FormItem>

                        </Form>
                    </Modal>
                }
            </div >
        );
    }
}
export default ReservationList;
