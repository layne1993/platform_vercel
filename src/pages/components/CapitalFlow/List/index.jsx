/*
 * @description: 资金流水列表
 * @author: wangcl
 * @Date: 2020/10/28
 */
import React, { PureComponent, Fragment } from 'react';
import { history, Link } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    Table,
    Alert,
    Checkbox,
    notification,
    Tree,
    Modal,
    DatePicker,
    Space,
    Dropdown,
    Menu
} from 'antd';
import {
    paginationPropsback,
    XWNotificationMethod,
    XWSourceType,
    XWFlowState,
    XWTransactionType,
    XWMessageAlert,
    XWFlowState2
} from '@/utils/publicData';
import { getCookie, getPermission, numTransform2, fileExport } from '@/utils/utils';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import Detail from '../Detail';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './index.less';
import { connect } from 'umi';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const FormItem = Form.Item;
const { Option } = Select;

@connect(({ CapitalFlowList, loading }) => ({
    loading: loading.effects['CapitalFlowList/TradeFlowQuery'],
    CapitalFlowList
}))
class List extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        isShow: false,
        checkedValues: undefined, //通知客户的集中选项
        showColumn: false, //列设置是否显示
        columnsStandard: [], //表头基准值  因为有列设置
        columnsValue: [], //表头
        confirmId: null, //单个点击确认金额的id
        dataSource: {
            list: [],
            pageNum: '',
            pageSize: '',
            pages: '',
            total: ''
        },
        formValues: {},
        productList: [],
        customerList: [],
        popNewadd: false,
        params: {},
        uploadFlag: false, //批量上传模态框
        isCustomer: false
        // checkList:[]
    };

    componentDidMount() {
        this.setState({
            columnsStandard: this.setTableHead(this.columns),
            columnsValue: this.setTableHead(this.columns)
        });
        this.getFlowingWaterList();
        this.getTradeGetNotifyType();
        const { params = {}, isCustomer } = this.props;
        this.setState({
            params,
            isCustomer
        });
    }

    // 设置表头
    setTableHead = (arr = []) => {
        const { params = {} } = this.props;
        let newArr = [...arr];
        if (!params.customerId) {
            newArr.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 120,
                fixed: 'left',
                render: (val) => val || '--'
            });
        }
        return newArr;
    };

    // 获取通知方式

    getTradeGetNotifyType = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/queryByProductName',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productList: res.data
                    });
                }
            }
        });

        dispatch({
            type: 'global/queryByCustomerName',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        customerList: res.data
                    });
                }
            }
        });
        dispatch({
            type: 'CapitalFlowList/TradeGetNotifyType',
            // payload:{

            // }
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    // const{checkedValues} = this.state;

                    // if(res.data.mobileNoteStatus === 1){
                    //     checkedValues.push(0);
                    // }
                    // if(res.data.emailNoteStatus === 1){
                    //     checkedValues.push(1);
                    // }

                    // console.log(checkedValues)
                    this.setState({
                        checkedValues: [
                            res.data.mobileNoteStatus === 1 && 0,
                            res.data.emailNoteStatus === 1 && 1
                        ]
                    });
                } else {
                    this.setState({
                        checkedValues: []
                    });
                }
            }
        });
    };

    // 获取列表
    getFlowingWaterList = (paging = {}, values = {}) => {
        const { dispatch, params = {} } = this.props;
        // console.log(params);
        dispatch({
            type: 'CapitalFlowList/TradeFlowQuery',
            payload: {
                ...paging,
                ...values,
                pageNum: paging.pageNum || 1,
                pageSize: paging.pageSize || 20,
                tradeTime:
                    values.tradeTime &&
                    moment(moment(values.tradeTime).format('YYYY-MM-DD')).valueOf(),
                customerId: (params && params.customerId) || undefined
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        dataSource: res.data,
                        formValues: values
                    });
                }
            }
        });
    };
    // 表单实例对象
    formRef = React.createRef();
    popUpRef = React.createRef();
    // Table的列
    columns = [
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '关联交易类型',
            dataIndex: 'tradeType',
            width: 110,
            render: (val) => {
                let obj = XWTransactionType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '交易申请日期',
            dataIndex: 'tradeApplyDate',
            width: 120,
            render: (val) => (val && moment(val).format('YYYY-MM-DD')) || '--'
        },
        {
            title: '交易申请金额',
            dataIndex: 'tradeApplyMoney',
            width: 110,
            render: (val) => numTransform2(val)
        },
        {
            title: '申请银行卡号',
            dataIndex: 'applyBankNumber',
            width: 140,
            render: (val) => val || '--'
        },
        {
            title: '流水银行卡号',
            dataIndex: 'bankNumber',
            width: 140,
            render: (val) => val || '--'
        },
        {
            title: '流水银行开户行',
            dataIndex: 'bankName',
            width: 140,
            render: (val) => val || '--'
        },
        {
            title: '流水时间',
            dataIndex: 'tradeTime',
            width: 140,
            // render: (val) => (val && moment(val).format('YYYY-MM-DD HH:mm:ss')) || '--'
            render: (val, record) => (
                <div>
                    <p> {(val && moment(val).format('YYYY-MM-DD HH:mm:ss')) || '--'} </p>
                    {record.queryTradeFlowRsps &&
                        record.queryTradeFlowRsps.map((item) => (
                            <p key={item.tradeFlowId}>
                                {(item.tradeTime &&
                                    moment(item.tradeTime).format('YYYY-MM-DD HH:mm:ss')) ||
                                    '--'}
                            </p>
                        ))}
                </div>
            )
        },
        {
            title: '流水金额',
            dataIndex: 'tradeMoney',
            width: 120,
            // render: (val) => val || '--'
            render: (val, record) => (
                <div>
                    <p> {numTransform2(val)} </p>
                    {record.queryTradeFlowRsps &&
                        record.queryTradeFlowRsps.map((item) => (
                            <p key={item.tradeFlowId}>{item.tradeMoney}</p>
                        ))}
                </div>
            )
        },

        {
            title: '币种',
            dataIndex: 'currency',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '消息提醒',
            dataIndex: 'messageStatus',
            width: 90,
            render: (val) => {
                let obj = XWMessageAlert.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '流水状态',
            dataIndex: 'tradeStatus',
            width: 100,
            render: (val) => {
                let obj = XWFlowState2.find((item) => {
                    return item.value === val;
                });
                return obj.label === '金额未确认' ? <span style={{ color: 'red' }} >{obj.label}</span> : <span>{obj.label}</span>;
                // return (obj && obj.label) || '--';
            }
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 80,
            render: (val) =>
                ((val === 1 || val === 2) && '系统录入') || (val === 3 && '托管下行') || '--'
        },
        {
            title: '操作',
            width: 150,
            dataIndex: 'tradeStatus',
            render: (value, record) => (
                <Space>
                    {this.props.authEdit && value === 0 && record.bankNumber && (
                        <a
                            onClick={() =>
                                Modal.confirm({
                                    title: '',
                                    content:
                                        '请您核对客户银行卡号和金额数据，点击确认后客户会收到银行流水确认通知并自动开启冷静期！',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: () => this.handleOk(record, 1)
                                })
                            }
                        >
                            流水确认
                        </a>
                        // <a
                        //     style={{ marginRight: 8 }}
                        //     onClick={() => this.ConfirmedAmount(record.tradeFlowId)}
                        // >
                        //     流水确认
                        // </a>
                    )}
                    {this.props.authEdit && value === 0 && (
                        <a onClick={() => this._edit(record)}>编辑</a>
                    )}
                    {this.props.authEdit && value === 0 && (
                        <a
                            onClick={() =>
                                Modal.confirm({
                                    title: '',
                                    content:
                                        '关闭后该条信息不再匹配对应流水或者申请信息，状态置为已关闭且不可恢复，请您确认',
                                    okText: '确认',
                                    cancelText: '取消',
                                    onOk: () => this.handleOk(record, 2)
                                })
                            }
                        >
                            关闭
                        </a>
                    )}
                    {value !== 0 && <a onClick={() => this._edit(record)}>查看</a>}
                </Space>
            )
        }
    ];

    _edit = (record) => {
        const { params } = this.state;
        this.setState({
            params: {
                ...params,
                ...record
            },
            popNewadd: true
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        this.getFlowingWaterList({}, values);
        // console.log('Success:', values);
    };
    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.getFlowingWaterList();
    };

    /**
     * @description: 分页
     * @param {type} page
     * @param {type} pageSize
     */
    // _onPageChange = (page, pageSize) => {
    //     this.setState({
    //         pageData: {
    //             current: page,
    //             pageSize
    //         }
    //     });
    // };

    /**
     * @description: pageSize change
     * @param {type} page
     * @param {type} pageSize
     */
    // _onShowSizeChange = (page, pageSize) => {
    //     this.setState({
    //         pageData: {
    //             current: page,
    //             pageSize
    //         }
    //     });
    // };

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
     * @description: 新增客户（路由跳转）
     */
    _onAdd = () => {
        const { popNewadd, params } = this.state;
        this.setState({
            popNewadd: !popNewadd,
            params: {
                ...params,
                tradeFlowId: undefined
            }
        });
    };

    /**
     * @description: 选择通知客户的方式
     * @param {Array} checkedValues
     */

    NotificationChange = (checkedValues) => {
        // console.log(checkedValues);
        this.setState({
            checkedValues
        });
        // console.log('checked = ', checkedValues);
    };

    /**
     * @description: 监听上传成功或者失败
     */
    handleFileChange = (e) => {
        this.setState({
            showModal: true
        });
        // console.log(e)
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                this.setState({
                    showModal: false
                });
                openNotification('success', '提醒', '上传成功');

                this.SearchMethod();
            } else {
                this.setState({
                    showModal: false
                });
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };
    /**
     *
     *@description: 批量删除
     **/
    onDelete = () => {
        // 调用接口 之后刷新列表
    };
    /**
     *@description: 列设置的下拉
     **/
    Columnmenu = () => {
        const { columnsStandard } = this.state;
        const newArray = [];
        const pitchonArray = [];
        columnsStandard.map((item, index) => {
            newArray.push({
                title: item.title,
                key: index,
                checkbox: true
            });
            pitchonArray.push(index);
        });
        // this.setState({
        //     pitchonArray
        // });
        return (
            <Tree
                style={{ width: '100%', paddingTop: 20, border: '1px solid #ccc' }}
                checkable
                defaultCheckedKeys={pitchonArray}
                onCheck={this.HeadColumn}
                // onCheck={onCheck}
                treeData={newArray}
            />
        );
    };
    /**
     *@description: 列设置变化
     **/
    HeadColumn = (selectedKeys, info) => {
        const select = info.checkedNodes;
        // console.log(select)
        // return;
        const { columnsStandard } = this.state;
        const headerArray = [];
        // columnsStandard.map(item=>)
        columnsStandard.forEach((currentValue) => {
            select.forEach((value) => {
                if (value.title === currentValue.title) {
                    headerArray.push(currentValue);
                }
            });
        });
        this.setState({
            columnsValue: headerArray
        });
    };
    /**
     *@description: 是否显示表头选项
     **/
    showColumn = () => {
        const { showColumn } = this.state;
        this.setState({
            showColumn: !showColumn
        });
    };
    /**
     *@description: 表格变化
     **/

    tableChange = (p, e, s) => {
        // console.log(p, e, s);
        const { formValues } = this.state;

        this.getFlowingWaterList(formValues, {
            pageNum: p.current,
            pageSize: p.pageSize
        });
    };

    // 保存通知方式

    saveChecked = () => {
        const { checkedValues } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'CapitalFlowList/TradeGetNotify',
            payload: {
                mobileNoteStatus: (checkedValues.indexOf(0) !== -1 && 1) || 0,
                emailNoteStatus: (checkedValues.indexOf(1) !== -1 && 1) || 0
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                } else {
                    openNotification('warning', '提醒', res.message || '保存失败');
                }
            }
        });
    };
    handleOk = (record = {}, tradeStatus) => {
        const { dispatch } = this.props;
        let ids = [];
        if (record.queryTradeFlowRsps && Array.isArray(record.queryTradeFlowRsps)) {
            record.queryTradeFlowRsps.map((item) => ids.push(item.tradeFlowId));
        }
        ids.push(record.tradeFlowId);
        dispatch({
            type: 'CapitalFlowList/TradeConfirm',
            payload: {
                tradeFlowIds: ids,
                tradeStatus: tradeStatus
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提醒', '操作成功');
                    this.getFlowingWaterList();
                } else {
                    openNotification('warning', '提醒', res.message || '操作失败');
                }
            }
        });
    };

    // 上传
    upload = () => {
        this.setState({ uploadFlag: true });
    };

    // 上传成功
    uploadSuccess = () => {
        this.getFlowingWaterList();
        this.closeUploadModal();
    };

    //  关闭模态框
    closeUploadModal = () => {
        this.setState({ uploadFlag: false });
    };

    /**
     * @description 批量下载
     */
    _batchDownload = () => {
        const { selectedRowKeys } = this.state;
        let ids = selectedRowKeys.join(',');
        const { params = {} } = this.props;
        if (params.customerId) {
            window.location.href = `${BASE_PATH.adminUrl
                }${'/tradeFlow/batchDownload'}?tradeFlowIds=${ids}&tokenId=${getCookie(
                    'vipAdminToken',
                )}&customerId=${params.customerId}`;
        } else {
            window.location.href = `${BASE_PATH.adminUrl
                }${'/tradeFlow/batchDownload'}?tradeFlowIds=${ids}&tokenId=${getCookie(
                    'vipAdminToken',
                )}`;
        }
    };

    // 导出全部
    _downloadAll = () => {
        const { params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        fileExport({
            method: 'post',
            url: '/tradeFlow/allExport',
            data: {
                ...params,
                ...formData
            },
            callback: ({ status, message = '导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    }

    render() {
        const {
            dataSource,
            selectedRowKeys,
            showColumn,
            columnsValue,
            checkedValues,
            productList,
            popNewadd,
            params,
            uploadFlag,
            isCustomer
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        // console.log(XWTransactionType);
        const { loading } = this.props;
        // console.log(params);
        return (
            <div className={styles.container}>
                <Modal
                    title={params.tradeFlowId && '编辑/查看' || '新建'}
                    closable={false}
                    visible={popNewadd}
                    footer={null}
                    destroyOnClose
                    width={'80%'}
                >
                    <Detail
                        params={params}
                        close={this._onAdd}
                        getFlowingWaterList={this.getFlowingWaterList}
                        authEdit={this.props.authEdit}
                    />
                </Modal>
                <div className={styles.filter}>
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        labelCol={{ span: 8 }}
                    >
                        <Row>
                            <Col span={20}>
                                <Row>
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="客户名称" name="customerName">
                                                <Input allowClear placeholder="请输入客户名称" />
                                            </FormItem>
                                        </Col>
                                    )}
                                    <Col span={8}>
                                        <FormItem label="产品名称" name="productIds">
                                            <Select
                                                placeholder="请输入"
                                                showSearch
                                                allowClear
                                                mode="multiple"
                                                filterOption={(input, option) =>
                                                    option.children
                                                        .toLowerCase()
                                                        .indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {productList.map((item, index) => (
                                                    <Option
                                                        key={item.productId}
                                                        value={item.productId}
                                                    >
                                                        {item.productName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>

                                    </Col>
                                    {/* {!isCustomer && ( */}
                                    <Col span={8}>
                                        <FormItem label="关联交易类型" name="tradeType">
                                            <Select placeholder="关联交易类型" allowClear>
                                                {XWTransactionType.map((item, index) => (
                                                    <Option key={index} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    {/* )} */}
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="流水银行卡号" name="bankNumber">
                                                <Input
                                                    allowClear
                                                    placeholder="请输入流水银行卡号"
                                                />
                                            </FormItem>
                                        </Col>
                                    )}
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="申请银行卡号" name="applyBankNumber">
                                                <Input
                                                    allowClear
                                                    placeholder="请输入流水银行卡号"
                                                />
                                            </FormItem>
                                        </Col>
                                    )}
                                    <Col span={8}>
                                        <FormItem label="交易申请日期" name="tradeApplyDate">
                                            <DatePicker style={{ width: '100%' }} />
                                        </FormItem>
                                    </Col>
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="流水日期" name="tradeTime">
                                                <DatePicker style={{ width: '100%' }} />
                                            </FormItem>
                                        </Col>
                                    )}
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="流水状态" name="tradeStatus">
                                                <Select placeholder="请选择流水状态" allowClear>
                                                    {XWFlowState.map((item, index) => (
                                                        <Option key={index} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                    )}
                                    {!isCustomer && (
                                        <Col span={8}>
                                            <FormItem label="证件号码" name="cardNumber">
                                                <Input placeholder="请输入" autoComplete="off" allowClear />
                                            </FormItem>
                                        </Col>
                                    )}
                                </Row>
                            </Col>
                            <Col span={4} style={{ textAlign: 'right' }}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button onClick={this._reset}>重置</Button>
                                </Space>
                            </Col>
                        </Row>
                    </Form>
                </div>

                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <Row>
                            <Col span={16}>
                                <Space>
                                    {this.props.authEdit && (
                                        <Button
                                            type="primary"
                                            icon={<PlusOutlined />}
                                            onClick={this._onAdd}
                                        >
                                            新建
                                        </Button>
                                    )}
                                    {this.props.authEdit && (
                                        <Button type="primary" onClick={this.upload}>
                                            {' '}
                                            批量上传{' '}
                                        </Button>
                                    )}
                                    {this.props.authExport && (
                                        <Dropdown
                                            overlay={<Menu>
                                                <Menu.Item
                                                    key="1"
                                                    disabled={selectedRowKeys.length === 0}
                                                    onClick={this._batchDownload}
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
                                    )}
                                </Space>
                            </Col>
                            <Col span={8}>
                                <Row>
                                    <Col span={6}>通知方式:</Col>
                                    <Col span={14}>
                                        <Checkbox.Group
                                            // options={XWNotificationMethod}
                                            value={checkedValues}
                                            onChange={this.NotificationChange}
                                        >
                                            {XWNotificationMethod.map((item) => (
                                                <Checkbox key={item.value} value={item.value}>
                                                    {item.label}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    </Col>
                                    <Col span={4}>
                                        {this.props.authEdit && (
                                            <Button
                                                type="primary"
                                                size="small"
                                                onClick={this.saveChecked}
                                            >
                                                保存
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                    {/* {!isEmpty(selectedRowKeys) && ( */}
                    <Alert
                        style={{ marginTop: 12 }}
                        message={
                            <Fragment>
                                <Row>
                                    <Col span={20}>
                                        已选择
                                        <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>
                                        项&nbsp;&nbsp;
                                        {/* <a onClick={this._cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                        清空
                                        </a> */}
                                    </Col>
                                    <Col span={4}>
                                        <Button onClick={this.showColumn} style={{ width: '100%' }}>
                                            列设置 <DownOutlined />
                                        </Button>
                                        <div
                                            style={{
                                                position: 'absolute',
                                                zIndex: 999,
                                                width: '100%'
                                            }}
                                        >
                                            {showColumn ? this.Columnmenu() : null}
                                        </div>

                                        {/*
                                      <Dropdown overlay={this.Columnmenu}>
                                          <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>

                                          </a>
                                      </Dropdown> */}
                                    </Col>
                                </Row>
                            </Fragment>
                        }
                        type="info"
                        showIcon
                    />
                    {/* )} */}
                    <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={columnsValue}
                        dataSource={dataSource.list}
                        rowKey="tradeFlowId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        pagination={paginationPropsback(dataSource.total, dataSource.pageNum)}
                        onChange={(p, e, s) => this.tableChange(p, e, s)}
                    />
                </div>

                {uploadFlag && (
                    <BatchUpload
                        modalFlag={uploadFlag}
                        url="/tradeFlow/batchUpload"
                        onOk={this.uploadSuccess}
                        closeModal={this.closeUploadModal}
                        params={params}
                        templateUrl={`/tradeFlow/downloadTemplate?&tokenId=${getCookie(
                            'vipAdminToken',
                        )}`}
                    />
                )}
            </div>
        );
    }
}
export default List;
