/*
 * @description: 客户信息管理-客户信息列表
 * @Author: tangsc
 * @Date: 2020-10-21 16:24:43
 */
import React, { PureComponent, Fragment } from 'react';
import { history, connect } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    Tooltip,
    notification,
    message,
    Modal,
    Space,
    Radio,
    Dropdown,
    Menu,
    Checkbox,
    DatePicker
} from 'antd';
import BatchUpload from '@/pages/components/batchUpload';
import MXTable from '@/pages/components/MXTable';
import {
    XWcustomerCategoryOptions,
    XWnameStatus,
    XWnumriskLevel,
    XWInvestorsType,
    XWCustomerLevel,
    CUSTOMERSHARETYPE,
    CHANNELTYPE,
    RISK_EFFECTIVE_STATUS
} from '@/utils/publicData';
import {
    DownOutlined,
    UpOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import styles from './qualifiedInvestor.less';
import { getRandomKey, listToMap, getCookie, getPermission, numTransform, fileExport, getQueryString } from '@/utils/utils';
import md5 from 'js-md5';
import sha1 from 'sha1';
import Statistic from './Statistic';
import DataMaintenance from './dataMaintenance';
import moment from 'moment';

const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

const RISK_EFFECTIVE_STATUS_MAP = listToMap(RISK_EFFECTIVE_STATUS);

// 不同币种单元格渲染
const currencyCell = ({ cny, usd, hkd }) => (
    <div>
        {cny !== null && cny !== '' && (
            <p style={{ marginBottom: 0 }}>
                {numTransform(cny)}
                <span>(CNY)</span>
            </p>
        )}
        {usd !== null && usd !== '' && (
            <p style={{ marginBottom: 0 }}>
                {numTransform(usd)}
                <span>(USD)</span>
            </p>
        )}
        {hkd !== null && hkd !== '' && (
            <p style={{ marginBottom: 0 }}>
                {numTransform(hkd)}
                <span>(HKD)</span>
            </p>
        )}
    </div>
);

// eslint-disable-next-line no-undef
const { authEdit, authExport } = getPermission(10100);
class qualifiedInvestor extends PureComponent {
    state = {
        isShow: false, // 控制显示隐藏
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        batchUploadModalFlag: false,
        dataSource: { },
        statisticsInfo: { },
        onOrOff: false,
        managerList: [],
        isModalVisible: false,
        resetPasswordMessage: { },
        isCustom: true,
        // agencies:[],
        channelList: []
    };

    componentDidMount() {

        // this.getStatistics();
        // if (this.formRef.current) {
        //     this.formRef.current.setFieldsValue({shareType: 1});
        // }
        const rangeDate = getQueryString('rangeDate');
        if (rangeDate) {
            let rangeDateArr = rangeDate.split('-');
            this.formRef.current.setFieldsValue({
                registerTime: [moment(rangeDateArr[0] * 1), moment(rangeDateArr[1] * 1)]
            });
        }

        this.getData();
        this.selectAllAccountManager();
        this.getAgencies();
    }

    // 表单实例对象
    formRef = React.createRef();
    passWordFormRef = React.createRef();

    getAgencies = () => {
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'INVESTOR_DETAIL/getAgencies',
        //     callback: (res) => {
        //         const {data, code} = res;
        //         if(code === 1008) {
        //             this.setState({
        //                 agencies:data
        //             });
        //         }
        //     }
        // });

        dispatch({
            type: 'global/channelList',
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    this.setState({
                        channelList: data
                    });
                } else {
                    const txt = message || data || '查询失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });

        // dispatch({
        //     type: 'CHANNEL/getListData',
        //     payload: {
        //         sortFiled: 'createTime',
        //         sortType: 'desc'
        //     },
        //     callback: ({ code, data, message }) => {
        //         if (code === 1008) {
        //             this.setState({
        //                 channelList:data.list
        //             });
        //         } else {
        //             const txt = message || data || '查询失败';
        //             openNotification('error', '提醒', txt);
        //         }
        //     }
        // });
    };

    // Table的列
    columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            fixed: 'left',
            width: 150,
            render: (txt, record) => <a onClick={() => this.doEdit(record)}>{txt} </a>
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120
        },
        {
            title: '客户类别',
            dataIndex: 'customerType',
            width: 100,
            render: (val) => listToMap(XWcustomerCategoryOptions)[val]
        },
        {
            title: BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级',
            dataIndex: 'customerLevel',
            width: 90,
            render: (val) => listToMap(XWCustomerLevel)[val]
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            width: 120,
            render: (val) => listToMap(XWInvestorsType)[val]
        },
        {
            title: '客户经理',
            dataIndex: 'saleUserName',
            width: 120,
            render: (val) => val || '--'
        },
        // {
        //     title: '渠道编号',
        //     dataIndex: 'dealer',
        //     width: 100,
        //     render: (val) => val || '--'
        // },
        {
            title: '渠道名称',
            dataIndex: 'channelNames',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '经纪人',
            dataIndex: 'agent',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '联系邮箱',
            dataIndex: 'email',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '登录手机号',
            dataIndex: 'mobile',
            width: 150,
            render: (val) => val || '--'
        },
        {
            title: '风险等级',
            dataIndex: 'riskType',
            width: 120,
            render: (val) => listToMap(XWnumriskLevel)[val]
        },
        {
            title: '实名状态',
            dataIndex: 'realNameState',
            width: 100,
            render: (val) => listToMap(XWnameStatus)[val]
        },
        {
            title: '风测状态',
            dataIndex: 'isExpire',
            width: 100,
            render: (val) => val === '0' ? <span style={{ color: 'red' }}>{RISK_EFFECTIVE_STATUS_MAP[val]}</span> : RISK_EFFECTIVE_STATUS_MAP[val]
        },
        {
            title: (
                <Tooltip title="统计有过交易信息或份额的产品数">
                    投资产品数
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'investedFundsNum',
            width: 110
        },
        {
            title: '投资总金额',
            dataIndex: 'totalInvestmentAmountDTO',
            width: 150,
            render: currencyCell
        },
        {
            title: (
                <Tooltip title="统计有交易记录或份额且持有份额不为0的产品数">
                    持有产品数
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'fundsAlreadyOwnedNum',
            width: 150
        },
        {
            title: (
                <Tooltip title="人民币产品/港元产品/美元产品：各产品持有份额*最新净值的总和（最新净值取该产品披露净值日期和交易记录净值日期最新的这天的净值）">
                    披露总市值
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'holdTotalAmountDTO',
            width: 150,
            render: currencyCell
        },
        {
            title: (
                <Tooltip title="根据您在产品总设置的设置，公式有：
                1、（默认）使用认申赎的确认金额累加；
                2、使用认申赎的确认金额累加-现金分红；"
                >
                    总本金
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'netPurchaseAmountDTO',
            width: 150,
            render: currencyCell
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 120,
            render: (val) => <div style={{ width: 110 }}>{val}</div> || '--'
        },
        {
            title: (
                <Tooltip
                    title={
                        <div>
                            <p style={{ marginBottom: 0 }}>收益=市值+现金分红+赎回-认购-申购-追加申购</p>
                            {/* <p>注：业绩提成返还为一种交易类型</p> */}
                        </div>
                    }
                >
                    披露总收益
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'holdingEarningsDTO',
            width: 150,
            render: currencyCell
        },
        {
            title: '微信昵称',
            dataIndex: 'nickName',
            width: 120,
            defaultHide: true,
            render: (val) => val || '--'
        },
        {
            title: '微信编号',
            dataIndex: 'openId',
            width: 120,
            defaultHide: true,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '是否VIP客户',
            dataIndex: 'isVIP',
            width: 110,
            render: (text, record) => {
                return (
                    <Checkbox
                        // disabled={!!this.props.authEdit}
                        checked={text}
                        onChange={() => this._checkedChange(text, record, 'isVIP')}
                    />
                );
            }
        },
        {
            title: (
                <Tooltip
                    title={
                        <div>
                            <p style={{ marginBottom: 0 }}>字段从产品客户的“授权代表人”中的证件号码拉取</p>
                            {/* <p>注：业绩提成返还为一种交易类型</p> */}
                        </div>
                    }
                >
                    营业执照号
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'cardNumber',
            width: 150,
            render: (val, record) => record.customerType === 2 ? val : '--'
        },
        {
            title: (
                <Tooltip
                    title={
                        <div>
                            <p style={{ marginBottom: 0 }}>字段从产品客户的“授权代表人”中的证件号码拉取</p>
                            {/* <p>注：业绩提成返还为一种交易类型</p> */}
                        </div>
                    }
                >
                    法人身份证号
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'legalPersonCardNumber',
            width: 150,
            render: (val, record) => record.customerType === 2 ? val : '--'
        },
        {
            title: (
                <Tooltip
                    title={
                        <div>
                            <p style={{ marginBottom: 0 }}>字段从产品客户的“授权代表人”中的证件号码拉取</p>
                            {/* <p>注：业绩提成返还为一种交易类型</p> */}
                        </div>
                    }
                >
                    经办人身份证号
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'authorizedRepresentativeCardNumber',
            width: 150,
            render: (val, record) => record.customerType === 2 ? val : '--'
        },
        {
            title: '操作',
            dataIndex: '',
            // fixed: 'right',
            width: 150,
            render: (record) => {
                return (
                    authEdit && (
                        <Space>
                            <a onClick={() => this.resetPassword(record)}>重置密码</a>
                            <a onClick={() => this.doEdit(record)}>编辑 </a>
                            <a onClick={() => this.forbiddenPre(record)}>
                                {record.forbidden == 1 ? '启用' : '禁用'}
                            </a>
                            {record.forbidden === 1 && (
                                <a onClick={() => this.deletePre([record.customerId])}>删除</a>
                            )}
                        </Space>
                    )
                );
            }
        }
    ];

    _checkedChange = (text, record, checkedType) => {
        const { dispatch } = this.props;
        const tempObj = { };
        tempObj.customerId = record.customerId;
        tempObj[checkedType] = !text;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/setIsVIP',
            payload: {
                ...tempObj
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '设置成功', 'topRight');
                } else {
                    openNotification('warning', '提示', '设置失败', 'topRight');
                }
                this.getData();
            }
        });
    };

    // 修改用户密码
    resetPassword = (params) => {
        const { dispatch } = this.props;
        const { customerId } = params;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/getResetPasswordFormData',
            payload: {
                customerId
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        isModalVisible: true,
                        resetPasswordMessage: res.data
                    });
                } else {
                    openNotification('warning', `提示(代码：${res.code})`, res.message, 'topRight');
                }
            }
        });
    };

    /**
     * @description 切换是否计算统计数据
     */
    changeCompute = () => {
        const { onOrOff } = this.state;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.onOrOff = !onOrOff;
        this.getStatistics();
        this.getData();
    };

    /**
     * @description 获取客户经理
     */
    selectAllAccountManager = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/selectAllAccountManager',
            payload: { },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        managerList: res.data || []
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * 查询统计信息
     */
    getStatistics = () => {
        const { onOrOff } = this.state;
        if (!onOrOff) {
            return;
        }
        const { dispatch } = this.props;
        const fromData = this.formRef.current.getFieldsValue();
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/getStatistics',
            payload: { ...fromData },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        statisticsInfo: res.data || { }
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 获取数据
     */
    getData = () => {
        const { dispatch, params } = this.props;
        const fromData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/customerData',
            payload: {
                ...fromData,
                ...pageData,
                registerTimeBegin: fromData.registerTime && moment(fromData.registerTime[0]).valueOf(),
                registerTimeEnd: fromData.registerTime && moment(fromData.registerTime[1]).valueOf()
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        dataSource: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = () => {
        this.setState({
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                pageNum: 1
                // pageSize: 20
            }
        });
        // this.state.pageData.pageNum = 1;
        // this.state.pageData.pageSize = 20;
        this.getData();
        this.getStatistics();
    };

    /**
     * @description: 点击显示隐藏
     */
    _handleShowMore = () => {
        const { isShow } = this.state;
        this.setState({
            isShow: !isShow
        });
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getData();
        this.getStatistics();
        this.setState({
            selectedRowKeys: []
        });
    };

    /**
     * @description: Table的Radio change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description 禁用启用前提示
     */
    deletePre = (ids) => {
        Modal.confirm({
            title: '请确认是否删除该客户',
            icon: <ExclamationCircleOutlined />,
            content: '删除后，该客户不可恢复，请确认删除！',
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.doDelete(ids)
        });
    };

    /**
     * @description 删除
     * @param {*} record
     */
    doDelete = (ids) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/deleteCustomer',
            payload: { customerIds: ids },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '删除', '删除成功', 'topRight');
                    this.setState({ selectedRowKeys: [] });
                    this.getData();
                    this.getStatistics();
                } else {
                    const warningText = res.message || res.data || '删除失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    /**
     * @description 禁用启用前提示
     */
    forbiddenPre = (data) => {
        Modal.confirm({
            title: `${data.forbidden == 1 ? '是否启用客户账号' : '是否禁用客户账号'}`,
            icon: <ExclamationCircleOutlined />,
            content: `${data.forbidden == 1
                ? '启用后，该客户可正常登录，请您确认。'
                : '禁用后，该客户无法登录，请您确认。禁用后也可启用该账号'
                }`,
            okText: '确认',
            cancelText: '取消',
            onOk: () => this.doForbidden(data)
        });
    };

    /**
     * @description 禁用/启用
     * @param {*} record
     */
    doForbidden = (record) => {
        const { dispatch } = this.props;
        let forbidden = record.forbidden == 1 ? 0 : 1;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/setForbidden',
            payload: { customerId: record.customerId, forbidden },
            callback: (res) => {
                if (res.code === 1008) {
                    if (forbidden == 1) {
                        openNotification('success', '禁用', '禁用成功', 'topRight');
                    } else {
                        openNotification('success', '启用', '启用成功', 'topRight');
                    }

                    this.setState({ selectedRowKeys: [] });
                    this.getData();
                    this.getStatistics();
                } else {
                    const warningText = res.message || res.data || '操作失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
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
     * @description 编辑页面
     * @param {*} record
     */
    doEdit = (record) => {
        history.push({
            pathname: `/investor/customerInfo/investordetails/${record.customerId}`
        });
    };

    /**
     * @description: 新增客户（路由跳转）
     */
    _onAdd = () => {
        // `/manager/investor/investordetails/${0}`
        history.push({
            pathname: `/investor/customerInfo/investordetails/${0}`
        });
    };

    /**
     * @description: 批量上传 打开模态框
     */
    _batchUpload = () => {
        this.setState({ batchUploadModalFlag: true });
    };

    /**
     * @description: 关闭上传模态框
     */
    closeModal = () => {
        this.setState({ batchUploadModalFlag: false });
    };

    onOK = () => {
        this.getData();
        this.getStatistics();
        this.closeModal();
    };


    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getData();
    };

    // 重置密码提交

    changePassword = () => {
        const fromData = this.passWordFormRef.current.getFieldsValue();
        const { resetPasswordMessage } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_CUSTOMERINFO/resetPassword',
            payload: {
                ...resetPasswordMessage,
                ...fromData,
                rawPassword: fromData.password,
                password: fromData.password && (resetPasswordMessage.encryptionWay === 1 ? sha1(fromData.password) : md5(fromData.password))
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification(
                        'success',
                        '提示',
                        '修改客户密码成功',
                        'topRight',
                    );
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        res.message,
                        'topRight',
                    );
                }
                this.setState({
                    isModalVisible: false,
                    isCustom: true
                });
            }
        });

    };

    // 改变是否身份证后六位

    isCustomChange = (e) => {
        if (e.target.value === 1) {
            this.setState({
                isCustom: true
            });
        } else {
            this.setState({
                isCustom: false
            });
        }
    }

    // 导出客户信息
    _exportMode = (mode) => {
        const { selectedRowKeys, onOrOff } = this.state;
        fileExport({
            method: 'post',
            url: '/customer/exportCustomerElements',
            data: {
                customerIds: !mode ? selectedRowKeys : undefined,
                mode,
                onOrOff
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

    /**
     * @description 批量下载
     */
    _batchDownload = (mode) => {
        const { selectedRowKeys, onOrOff } = this.state;
        //  let ids = selectedRowKeys.join(',');
        //  window.location.href = `${
        //      BASE_PATH.adminUrl
        //  }${'/customer/batchDownload'}?customerIds=${ids}&tokenId=${getCookie(
        //      'vipAdminToken',
        //  )}&onOrOff=${onOrOff}`;

        fileExport({
            method: 'post',
            url: '/customer/batchDownload',
            data: {
                customerIds: !mode ? selectedRowKeys : undefined,
                mode,
                onOrOff
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
    };


    render() {
        const {
            isShow,
            dataSource,
            selectedRowKeys,
            batchUploadModalFlag,
            pageData,
            statisticsInfo,
            onOrOff,
            managerList,
            isModalVisible,
            resetPasswordMessage,
            isCustom,
            // agencies,
            channelList
        } = this.state;
        const { loading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <div className={styles.container}>
                {onOrOff && <Statistic data={statisticsInfo} />}
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="客户名称" name="customerName">
                                    <Input allowClear placeholder="请输入" />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="客户类别" name="customerType">
                                    <Select placeholder="请选择" allowClear>
                                        {XWcustomerCategoryOptions.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label={BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级'} name="customerLevel">
                                    <Select placeholder="请选择" allowClear>
                                        {XWCustomerLevel.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                                {/* <span className={styles.showMore} onClick={this._handleShowMore}>
                                    {isShow ? '隐藏' : '展开'}
                                    {isShow ? <UpOutlined /> : <DownOutlined />}
                                </span> */}
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="客户类型" name="investorType">
                                    <Select placeholder="请选择" allowClear>
                                        {XWInvestorsType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="风险等级" name="riskType">
                                    <Select placeholder="请选择" allowClear>
                                        {XWnumriskLevel.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="实名状态" name="realNameState">
                                    <Select placeholder="请选择" allowClear>
                                        {XWnameStatus.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="联系邮箱" name="email">
                                    <Input allowClear placeholder="请输入" />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="登录手机号" name="mobile">
                                    <Input allowClear placeholder="请输入" />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="客户经理" name="saleUserId">
                                    <Select
                                        placeholder="请选择"
                                        allowClear
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        <Option
                                            value={0}
                                        >
                                            未分配
                                        </Option>
                                        {managerList.map((item) => {

                                            return (
                                                <Option
                                                    key={item.managerUserId}
                                                    value={item.managerUserId}
                                                >
                                                    <span>{item.userName}{item.isDelete === 1 && <span>(账号已删除)</span>}</span>
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="证件号码" name="cardNumber">
                                    <Input allowClear placeholder="请输入" />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="备注" name="remark">
                                    <Input allowClear placeholder="请输入" />
                                </FormItem>
                            </Col>

                            <Col span={6}>
                                <Form.Item
                                    // {...formItemLayout}
                                    name="channelIds"
                                    label="渠道名称"
                                >
                                    <Select
                                        placeholder="请选择渠道名称"
                                        mode="multiple"
                                        allowClear
                                    >
                                        {channelList.map((item) => (
                                            <Select.Option key={`channelIds-${item.channelId}`} value={item.channelId}>{item.channelName}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>

                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <Form.Item label="渠道类型" name="channelType">
                                    <Select placeholder="请选择" allowClear>
                                        {CHANNELTYPE.map((item) => {
                                            return (
                                                <Select.Option key={item.value} value={item.value}>
                                                    {item.label}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <FormItem label="客户筛选" name="shareType">
                                    <Select placeholder="请选择" allowClear>
                                        {CUSTOMERSHARETYPE.map((item) => (
                                            <Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <Form.Item
                                    // name="origin"
                                    label="客户来源"
                                >
                                    <Input.Group compact>
                                        <Form.Item
                                            noStyle
                                            name="origin"
                                        >
                                            <Select
                                                placeholder="请选择客户来源"
                                                allowClear
                                            >
                                                <Select.Option value={1}>线上</Select.Option>
                                                <Select.Option value={2}>线下</Select.Option>
                                                <Select.Option value={3}>其他</Select.Option>
                                            </Select>
                                        </Form.Item>
                                        <Form.Item
                                            noStyle
                                            shouldUpdate
                                        >
                                            {
                                                ({ getFieldValue }) => (
                                                    getFieldValue('origin') === 3 &&
                                                    <Form.Item
                                                        name="otherOrigin"
                                                        noStyle
                                                    >
                                                        <Input style={{ width: '60%' }} placeholder="请输入" allowClear />
                                                    </Form.Item>)
                                            }
                                        </Form.Item>
                                    </Input.Group>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="风测状态" name="isExpire">
                                    <Select placeholder="请选择" allowClear>
                                        {RISK_EFFECTIVE_STATUS.map((item) => (
                                            <Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="注册时间" name="registerTime">
                                    <DatePicker.RangePicker  />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="经纪人" name="agent">
                                    <Input placeholder="请输入经纪人名称" />
                                </FormItem>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <Space>
                            {authEdit && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={this._onAdd}
                                >
                                    新建
                                </Button>
                            )}
                            {authEdit && (
                                <Button type="primary" onClick={this._batchUpload}>
                                    批量上传
                                </Button>
                            )}
                            {/* {authExport && (
                                <Button
                                    disabled={selectedRowKeys.length === 0}
                                    onClick={this._batchDownload}
                                >
                                    批量导出
                                </Button>
                            )} */}

                            {
                                authExport &&
                                <Dropdown
                                    overlay={<Menu>
                                        <Menu.Item
                                            key="1"
                                            disabled={selectedRowKeys.length === 0}
                                            onClick={() => this._batchDownload(0)}
                                        >
                                            导出选中
                                        </Menu.Item>
                                        <Menu.Item
                                            key="0"
                                            onClick={() => this._batchDownload(1)}
                                        >
                                            导出全部
                                        </Menu.Item>
                                    </Menu>}
                                >
                                    <Button >
                                        &nbsp;&nbsp;查询内容导出
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                                // <Button onClick={this._export} disabled={isEmpty(selectedRowKeys)}>批量导出</Button>
                            }
                            {
                                authExport &&
                                <Dropdown
                                    overlay={<Menu>
                                        <Menu.Item
                                            key="1"
                                            disabled={selectedRowKeys.length === 0}
                                            onClick={() => this._exportMode(0)}
                                        >
                                            导出选中
                                        </Menu.Item>
                                        <Menu.Item
                                            key="0"
                                            onClick={() => this._exportMode(1)}
                                        >
                                            导出全部
                                        </Menu.Item>
                                    </Menu>}
                                >
                                    <Button >
                                        &nbsp;&nbsp;客户信息导出
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            }
                            {
                                authEdit && (
                                    <DataMaintenance {...this.props} params={this.formRef.current && this.formRef.current.getFieldsValue()} ids={selectedRowKeys} total={dataSource.total} />
                                )

                            }
                        </Space>

                        <Button type="primary" onClick={this.changeCompute}>
                            {onOrOff ? '关闭计算数据' : '开启计算数据'}
                        </Button>
                    </div>
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={dataSource.list || []}
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        rowKey="customerId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                    />
                </div>
                {batchUploadModalFlag && (
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        url="/customer/batchUpload"
                        onOk={this.onOK}
                        closeModal={this.closeModal}
                        templateUrl={`/customer/downloadTemplate?&tokenId=${getCookie(
                            'vipAdminToken',
                        )}`}
                    />
                )}

                <Modal
                    visible={isModalVisible}
                    // onOk={handleOk}
                    footer={null}
                    destroyOnClose
                    onCancel={() =>
                        this.setState({
                            isModalVisible: false,
                            isCustom: true
                        })
                    }
                >
                    <h3 style={{ width: '100%', textAlign: 'center' }}>重置密码</h3>
                    <Form
                        onFinish={this.changePassword}
                        ref={this.passWordFormRef}
                        initialValues={{
                            customerName: resetPasswordMessage.customerName,
                            mobile: resetPasswordMessage.mobile,
                            notifyFlag: (resetPasswordMessage.mobile && 1) || 0,
                            password: resetPasswordMessage.password,
                            isCustom: 1
                        }}
                    >
                        <FormItem
                            {...formItemLayout}
                            disabled
                            rules={[{ required: false, message: '请输入客户名称' }]}
                            label="客户名称"
                            name="customerName"
                        >
                            <Input disabled allowClear placeholder="请输入" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            rules={[{ required: false, message: '请输入手机号' }]}
                            label="手机号"
                            extra="为空,请先进入客户详情维护客户手机号"
                            name="mobile"
                        >
                            <Input disabled allowClear placeholder="请输入" />
                        </FormItem>

                        <FormItem label="改为证件号后6位" {...formItemLayout} name="isCustom">
                            <Radio.Group onChange={this.isCustomChange}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否,自定义</Radio>
                            </Radio.Group>
                        </FormItem>

                        <FormItem
                            extra="默认为投资者证件号后6位"
                            {...formItemLayout}
                            label="重置密码"
                            name="password"
                            rules={[
                                { required: false, message: '请输入密码' }
                                // {
                                //     pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,20}$/,
                                //     message: '密码长度8~20位，必须包含大写字母、小写字母和数字'
                                // }
                            ]}
                        >
                            <Input disabled={isCustom} allowClear placeholder="请输入" />
                        </FormItem>
                        <FormItem label=" " colon={false} {...formItemLayout} name="notifyFlag">
                            <Radio.Group>
                                <Radio value={1}>短信通知用户</Radio>
                                <Radio value={0}>不通知</Radio>
                            </Radio.Group>
                        </FormItem>
                        <FormItem label=" " colon={false} {...formItemLayout}>
                            <Button type="primary" htmlType="submit">
                                重置客户密码
                            </Button>
                        </FormItem>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_CUSTOMERINFO/customerData']
}))(qualifiedInvestor);
