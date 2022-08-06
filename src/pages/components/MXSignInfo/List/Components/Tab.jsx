/*
 * @description: 列表展示
 * @Author: tangsc,hucc
 * @Date: 2020-10-27 16:56:52
 */
import React, { PureComponent, Fragment } from 'react';
import { history, Link, connect } from 'umi';
import { Radio, Button, Row, Col, Form, Select, Input, Dropdown, Menu, Statistic, notification, Tooltip, DatePicker, Modal, Divider } from 'antd';
import {
    XWcustomerCategoryOptions,
    XWsignType,
    XWSigningstatus,
    XWTradeType,
    XWIsDelete,
    XWInvalidSource,
    signSubscriptionStep,
    signApplyStep,
    redeming,
    XWOpenDayStatus
} from '@/utils/publicData';
import { InfoCircleOutlined, ExclamationCircleOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import './index.less';
import { getRandomKey, getCookie, numTransform2, fileExport } from '@/utils/utils';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import AddModal from './AddModal';
import EditOpenDayModal from './EditOpenDayModal';
import VisitRemind from './visitRemind';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { RangePicker } = DatePicker;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

const signTypeEmum = {
    1: signSubscriptionStep,
    2: signApplyStep,
    3: redeming
};

const contractWay = [
    { value: 1, label: '客户上传' },
    { value: 2, label: '后台创建' },
    { value: 3, label: 'FOF创建' }
];

const formItemLayout = {
    labelCol: {
        xs: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 }
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
@connect(({ signInfoList, loading }) => ({
    signInfoList,
    loading: loading.effects['signInfoList/querySignFlowAll']
}), null, null, { withRef: true })
class Tab extends PureComponent {
    state = {
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {},              // 查询参数
        sortFiled: '',                 // 排序字段
        sortType: '',                  // 排序类型：asc-升序；desc-降序
        signList: {},                  //查询返回全部信息（包括page、total等）
        signInfoList: [],              // 签约数据列表
        visible: false,                // 控制下载弹窗显示隐藏
        signProcessStep: [],           // 签约进度
        localFlowType: null,           // 流程类型(1:认购 2:申购 3:赎回)
        dType: 1,                      // 1：批量下载、2：下载全部
        isModalVisible: false,         // 控制新增弹窗显示隐藏
        fileType: 1,                   // 1新下载协议 2仅下载双录视频 3下载协议及双录视频
        signFlowId: '',
        editModalVisible: false,
        accountManagerList: []
    };

    componentDidMount() {
        this.search();
        // this._setColums();
        this._setColumsHead();
        this.getAccountManagerList();
    }

    componentWillUnmount() {
        sessionStorage.removeItem('customer');
    }
    getCustomeType = (type) => {
        let res = '';
        switch (type) {
            case 1:
                res = '普通投资者';
                break;
            case 2:
                res = '专业投资者';
                break;
            case 3:
                res = '特殊投资者';
                break;
            default:
                break;
        }
        return res;
    }
    getcustomerRiskLevel = (type) => {
        let res = '';
        switch (type) {
            case 1:
                res = 'C1';
                break;
            case 2:
                res = 'C2';
                break;
            case 3:
                res = 'C3';
                break;
            case 4:
                res = 'C4';
                break;
            case 5:
                res = 'C5';
                break;
            default:
                break;
        }
        return res;
    }
    getProductRiskLevel = (type) => {
        let res = '';
        switch (type) {
            case 1:
                res = 'R1';
                break;
            case 2:
                res = 'R2';
                break;
            case 3:
                res = 'R3';
                break;
            case 4:
                res = 'R4';
                break;
            case 5:
                res = 'R5';
                break;
            default:
                break;
        }
        return res;
    }
    // 表单实例对象
    formRef = React.createRef();

    tab1Columns = [
        // {
        //     title: '份额类别',
        //     dataIndex: 'parentProductId',
        //     width:100,
        //     fixed: 'left',
        //     render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
        // },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            fixed: 'left',
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: 100,
            render: (val, record) => <span onClick={() => this._onDetails(record, 1)} className="details">{val || '--'}</span>
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            ellipsis: true,
            render: (val) => <span>{this.getCustomeType(val) || '--'}</span>,
            width: 100
        },
        {
            title: '产品风险等级',
            dataIndex: 'productRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getProductRiskLevel(val) || '--'}</span>,
            width: 120
        },
        {
            title: '客户风险承受等级',
            dataIndex: 'customerRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getcustomerRiskLevel(val) || '--'}</span>,
            width: 140
        },
        {
            title: '客户经理',
            dataIndex: 'managerUserNames',
            render: (val) => <div>{val && val.toString() || '--'}</div>,
            width: 80
            // ellipsis: true
        },
        {
            title: '关联交易类型',
            dataIndex: 'flowType',
            width: 110,
            render: (val) => {
                let obj = XWTradeType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日类型',
            dataIndex: 'openType',
            width: 100,
            render: (val) => {
                let obj = XWOpenDayStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日日期',
            dataIndex: 'openDay',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        // {
        //     title: '合同电子签',
        //     dataIndex: 'signType',
        //     width: 100,
        //     render: (val) => {
        //         let obj = XWsignType.find((item) => {
        //             return Number(item.value) === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
        {
            title: '签约额',
            dataIndex: 'tradeMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '签约进度',
            dataIndex: 'codeText',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '开户行',
            dataIndex: 'subbranch',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '签约发起时间',
            dataIndex: 'signFlowStartDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约来源',
            dataIndex: 'contractWay',
            width: 80,
            render: (val) => {
                let obj = contractWay.find((item) => {
                    return Number(item.value) === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            width: 250,
            render: (_, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <Fragment>
                        {
                            this.props.authEdit &&
                            <span>
                                {
                                    /**
                                     * 为后台创建和FOF创建时 如果不是已审核状态则展示 审核按钮
                                     * nextCodeValue 线下审核流程 不为null时为客户上传
                                     */
                                    // 无效状态全部都为查看按钮
                                    // eslint-disable-next-line no-undef
                                    // record.contractWay === 1 ? // 客户上传
                                    ((record.nextCodeValue === 2070 || record.nextCodeValue === 3020 || record.nextCodeValue === 4020 || record.nextCodeValue === 2105 || record.nextCodeValue === 3037) && record.isDelete !== 1) ?
                                        (
                                            <span onClick={() => this._onDetails(record)} style={{ color: 'red', cursor: 'pointer' }}>审核</span>
                                        ) :
                                        (
                                            record.contractWay === 1 ? // 是客户上传则不需要判断审核状态
                                                <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                // 待审核不需要展示审核按钮 signStatus 2签约完成 代表审核通过
                                                : record.signStatus === 2 || record.isDelete === 1 ? <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                    : <Fragment>
                                                        <span style={{ color: 'red' }} onClick={() => this._onDetails(record, 1)} className="details">审核</span>
                                                    </Fragment>   // 为后台创建或FOF创建
                                        )
                                }
                            </span>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                disabled={!record.downloadSignConfirm || record.contractWay !== 1}
                                type="link"
                                style={{ border: 0 }}
                                onClick={() => this.downloadSignConfirm(record.signFlowId)}
                            >
                                申赎单下载
                            </Button>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                type="link"
                                disabled={record.isDelete === 1}
                                style={{ border: 0 }}
                                onClick={() => this.toggleEditModal(record.signFlowId)}
                            >
                                修改开放日
                            </Button>
                        }
                    </Fragment >
                );
            }
        },
        {
            title: <span><Tooltip placement="top" title={'默认该签约流程有效。若客户签约中止或者悔单，点击将该流程置为无效。一旦置为无效，该状态不可修改'}><InfoCircleOutlined /></Tooltip>&nbsp;签约有效性</span>,
            dataIndex: 'isDelete',
            width: 120,
            render: (val, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <span
                        style={{ color: val === 0 && this.props.authEdit ? '#3D7FFF' : '#797979', cursor: val === 0 && this.props.authEdit ? 'pointer' : null }}
                        onClick={val === 0 && this.props.authEdit ? () => this._onChange(record) : null}
                    >
                        {val === 0 ? '有效' : '无效'}
                    </span>

                );
            }
        }
    ]
    tab2Columns = [
        // {
        //     title: '份额类别',
        //     dataIndex: 'parentProductId',
        //     width:100,
        //     fixed: 'left',
        //     render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
        // },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            fixed: 'left',
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: 100,
            render: (val, record) => <span onClick={() => this._onDetails(record, 1)} className="details">{val || '--'}</span>
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            ellipsis: true,
            render: (val) => <span>{this.getCustomeType(val) || '--'}</span>,
            width: 100
        },
        {
            title: '产品风险等级',
            dataIndex: 'productRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getProductRiskLevel(val) || '--'}</span>,
            width: 120
        },
        {
            title: '客户风险承受等级',
            dataIndex: 'customerRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getcustomerRiskLevel(val) || '--'}</span>,
            width: 140
        },
        {
            title: '客户经理',
            dataIndex: 'managerUserNames',
            render: (val) => <div>{val && val.toString() || '--'}</div>,
            width: 80
            // ellipsis: true
        },
        {
            title: '关联交易类型',
            dataIndex: 'flowType',
            width: 110,
            render: (val) => {
                let obj = XWTradeType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日类型',
            dataIndex: 'openType',
            width: 100,
            render: (val) => {
                let obj = XWOpenDayStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日日期',
            dataIndex: 'openDay',
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
            title: '签约额',
            dataIndex: 'tradeMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '开户行',
            dataIndex: 'subbranch',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '签约发起时间',
            dataIndex: 'signFlowStartDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约结束时间',
            dataIndex: 'signFlowEndDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约来源',
            dataIndex: 'contractWay',
            width: 80,
            render: (val) => {
                let obj = contractWay.find((item) => {
                    return Number(item.value) === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            width: 400,
            render: (_, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <Fragment>
                        {
                            this.props.authEdit &&
                            <span>
                                {
                                    /**
                                     * 为后台创建和FOF创建时 如果不是已审核状态则展示 审核按钮
                                     * nextCodeValue 线下审核流程 不为null时为客户上传
                                     */
                                    // 无效状态全部都为查看按钮
                                    // eslint-disable-next-line no-undef
                                    // record.contractWay === 1 ? // 客户上传
                                    ((record.nextCodeValue === 2070 || record.nextCodeValue === 3020 || record.nextCodeValue === 4020 || record.nextCodeValue === 2105 || record.nextCodeValue === 3037) && record.isDelete !== 1) ?
                                        (
                                            <span onClick={() => this._onDetails(record)} style={{ color: 'red', cursor: 'pointer' }}>审核</span>
                                        ) :
                                        (
                                            record.contractWay === 1 ? // 是客户上传则不需要判断审核状态
                                                <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                // 审核通过不需要展示审核按钮 signStatus 2签约完成 代表审核通过
                                                : record.signStatus === 2 || record.isDelete === 1 ? <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                    : <Fragment>
                                                        <span style={{ color: 'red' }} onClick={() => this._onDetails(record, 1)} className="details">审核</span>
                                                    </Fragment>   // 为后台创建或FOF创建
                                        )
                                }
                            </span>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                type="link"
                                disabled={record.contractWay !== 1}
                                style={{ border: 0 }}
                                onClick={() => this.downloadSignConfirm(record.signFlowId)}
                            >
                                申赎单下载
                            </Button>
                        }
                        {
                            this.props.authExport &&
                            <Button
                                type="link"
                                style={{ border: 0 }}
                                disabled={!(record.codeValue === 2110 || record.codeValue === 3040 || record.codeValue === 4040)}
                                onClick={() => this._downloadDocument(record.signFlowId, 2)}
                            >
                                文档下载
                            </Button>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                type="link"
                                disabled={record.isDelete === 1}
                                style={{ border: 0 }}
                                onClick={() => this.toggleEditModal(record.signFlowId)}
                            >
                                修改开放日
                            </Button>
                        }
                    </Fragment>
                );
            }
        },
        {
            title: <span><Tooltip placement="top" title={'默认该签约流程有效。若客户签约中止或者悔单，点击将该流程置为无效。一旦置为无效，该状态不可修改'}><InfoCircleOutlined /></Tooltip>&nbsp;签约有效性</span>,
            dataIndex: 'isDelete',
            width: 120,
            render: (val, record) => {
                return (
                    <span
                        style={{ color: val === 0 && this.props.authEdit ? '#3D7FFF' : '#797979', cursor: val === 0 && this.props.authEdit ? 'pointer' : null }}
                        onClick={val === 0 && this.props.authEdit ? () => this._onChange(record) : null}
                    >
                        {val === 0 ? '有效' : '无效'}
                    </span>
                );
            }
        }
    ]
    tab3Columns = [
        // {
        //     title: '份额类别',
        //     dataIndex: 'parentProductId',
        //     width:100,
        //     fixed: 'left',
        //     render: (val, record) => <div style={{width:80}}>{val && record.productName || '--'}</div>
        // },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            fixed: 'left',
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: 100,
            render: (val, record) => <span onClick={() => this._onDetails(record, 1)} className="details">{val || '--'}</span>
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            ellipsis: true,
            render: (val) => <span>{this.getCustomeType(val) || '--'}</span>,
            width: 100
        },
        {
            title: '产品风险等级',
            dataIndex: 'productRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getProductRiskLevel(val) || '--'}</span>,
            width: 120
        },
        {
            title: '客户风险承受等级',
            dataIndex: 'customerRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getcustomerRiskLevel(val) || '--'}</span>,
            width: 140
        },
        {
            title: '客户经理',
            dataIndex: 'managerUserNames',
            width: 80,
            render: (val) => <div>{val && val.toString() || '--'}</div>
        },
        {
            title: '关联交易类型',
            dataIndex: 'flowType',
            width: 110,
            render: (val) => {
                let obj = XWTradeType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日类型',
            dataIndex: 'openType',
            width: 100,
            render: (val) => {
                let obj = XWOpenDayStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日日期',
            dataIndex: 'openDay',
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
            title: '签约额',
            dataIndex: 'tradeMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '签约进度',
            dataIndex: 'codeText',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '开户行',
            dataIndex: 'subbranch',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '无效来源',
            dataIndex: 'invalidSource',
            width: 120,
            render: (val) => {
                let obj = XWInvalidSource.find((item) => {
                    return Number(item.value) === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '签约发起时间',
            dataIndex: 'signFlowStartDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约无效时间',
            dataIndex: 'invalidDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约来源',
            dataIndex: 'contractWay',
            width: 80,
            render: (val) => {
                let obj = contractWay.find((item) => {
                    return Number(item.value) === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            width: 300,
            render: (_, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <Fragment>
                        {
                            this.props.authEdit &&
                            <span>
                                {
                                    /**
                                     * 为后台创建和FOF创建时 如果不是已审核状态则展示 审核按钮
                                     * nextCodeValue 线下审核流程 不为null时为客户上传
                                     */
                                    // 无效状态全部都为查看按钮
                                    // eslint-disable-next-line no-undef
                                    // record.contractWay === 1 ? // 客户上传
                                    ((record.nextCodeValue === 2070 || record.nextCodeValue === 3020 || record.nextCodeValue === 4020 || record.nextCodeValue === 2105 || record.nextCodeValue === 3037) && record.isDelete !== 1) ?
                                        (
                                            <span onClick={() => this._onDetails(record)} style={{ color: 'red', cursor: 'pointer' }}>审核</span>
                                        ) :
                                        (
                                            record.contractWay === 1 ? // 是客户上传则不需要判断审核状态
                                                <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                // 审核通过不需要展示审核按钮 signStatus 2签约完成 代表审核通过 无效签约也只能查看
                                                : record.signStatus === 2 || record.isDelete === 1 ? <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                    : <Fragment>
                                                        <span style={{ color: 'red' }} onClick={() => this._onDetails(record, 1)} className="details">审核</span>
                                                        {/* <Divider style={{ opacity: 0 }} type="vertical" />
                                                        <span onClick={() => this._onDetails(record, 1)} className="details">查看</span> */}
                                                    </Fragment>   // 为后台创建或FOF创建
                                        )
                                }
                            </span>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                disabled={!record.downloadSignConfirm || record.contractWay !== 1}
                                type="link"
                                style={{ border: 0 }}
                                onClick={() => this.downloadSignConfirm(record.signFlowId)}
                            >
                                申赎单下载
                            </Button>
                        }
                        {
                            this.props.authExport &&
                            <Button
                                type="link"
                                style={{ border: 0 }}
                                disabled={!(record.codeValue === 2110 || record.codeValue === 3040 || record.codeValue === 4040)}
                                onClick={() => this._downloadDocument(record.signFlowId, 2)}
                            >
                                文档下载
                            </Button>
                        }
                    </Fragment>
                );
            }
        },
        {
            title: <span><Tooltip placement="top" title={'默认该签约流程有效。若客户签约中止或者悔单，点击将该流程置为无效。一旦置为无效，该状态不可修改'}><InfoCircleOutlined /></Tooltip>&nbsp;签约有效性</span>,
            dataIndex: 'isDelete',
            width: 120,
            render: (val, record) => {
                return (
                    <span
                        style={{ color: val === 0 && this.props.authEdit ? '#3D7FFF' : '#797979', cursor: val === 0 && this.props.authEdit ? 'pointer' : null }}
                        onClick={val === 0 && this.props.authEdit ? () => this._onChange(record) : null}
                    >
                        {val === 0 ? '有效' : '无效'}
                    </span>
                );
            }
        }
    ]
    tab4Columns = [
        // {
        //     title: '产品名称',
        //     dataIndex: 'productFullName',
        //     width: 100,
        //     render: (val, record) => <span onClick={() => this._onDetails(record)} className="details">{val || '--'}</span>
        // },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            ellipsis: true,
            render: (val) => <span>{this.getCustomeType(val) || '--'}</span>,
            width: 100
        },
        {
            title: '产品风险等级',
            dataIndex: 'productRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getProductRiskLevel(val) || '--'}</span>,
            width: 120
        },
        {
            title: '客户风险承受等级',
            dataIndex: 'customerRiskType',
            // ellipsis: true,
            render: (val) => <span>{this.getcustomerRiskLevel(val) || '--'}</span>,
            width: 140
        },
        {
            title: '客户经理',
            dataIndex: 'managerUserNames',
            render: (val) => <div>{val && val.toString() || '--'}</div>,
            width: 80
        },
        {
            title: '签约发起时间',
            dataIndex: 'signFlowStartDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '关联交易类型',
            dataIndex: 'flowType',
            width: 110,
            render: (val) => {
                let obj = XWTradeType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日类型',
            dataIndex: 'openType',
            width: 100,
            render: (val) => {
                let obj = XWOpenDayStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日日期',
            dataIndex: 'openDay',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        // {
        //     title: '合同电子签',
        //     dataIndex: 'signType',
        //     width: 100,
        //     render: (val) => {
        //         let obj = XWsignType.find((item) => {
        //             return Number(item.value) === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
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
            title: '签约状态',
            dataIndex: 'signStatus',
            width: 80,
            render: (val) => {
                let obj = XWSigningstatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '签约额',
            dataIndex: 'tradeMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '签约进度',
            dataIndex: 'codeText',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '开户行',
            dataIndex: 'subbranch',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '银行卡号',
            dataIndex: 'accountNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '签约结束时间',
            dataIndex: 'signFlowEndDate',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '签约来源',
            dataIndex: 'contractWay',
            width: 80,
            render: (val) => {
                let obj = contractWay.find((item) => {
                    return Number(item.value) === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            width: 400,
            render: (_, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <Fragment>
                        {
                            this.props.authEdit &&
                            <span>
                                {
                                    /**
                                     * 为后台创建和FOF创建时 如果不是已审核状态则展示 审核按钮
                                     * nextCodeValue 线下审核流程 不为null时为客户上传
                                     */
                                    // 无效状态全部都为查看按钮
                                    // eslint-disable-next-line no-undef
                                    // record.contractWay === 1 ? // 客户上传
                                    ((record.nextCodeValue === 2070 || record.nextCodeValue === 3020 || record.nextCodeValue === 4020 || record.nextCodeValue === 2105 || record.nextCodeValue === 3037) && record.isDelete !== 1) ?
                                        (
                                            <span onClick={() => this._onDetails(record)} style={{ color: 'red', cursor: 'pointer' }}>审核</span>
                                        ) :
                                        (
                                            record.contractWay === 1 ? // 是客户上传则不需要判断审核状态
                                                <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                // 审核通过不需要展示审核按钮 signStatus 2签约完成 代表审核通过
                                                : record.signStatus === 2 || record.isDelete === 1 ? <span onClick={() => this._onDetails(record, 1)} className="details">查看</span>
                                                    : <Fragment>
                                                        <span style={{ color: 'red' }} onClick={() => this._onDetails(record, 1)} className="details">审核</span>
                                                    </Fragment>   // 为后台创建或FOF创建
                                        )
                                }
                            </span>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                disabled={!record.downloadSignConfirm || record.contractWay !== 1}
                                type="link"
                                style={{ border: 0 }}
                                onClick={() => this.downloadSignConfirm(record.signFlowId)}
                            >
                                申赎单下载
                            </Button>
                        }
                        {
                            this.props.authExport &&
                            <Button
                                type="link"
                                style={{ border: 0 }}
                                disabled={!(record.codeValue === 2110 || record.codeValue === 3040 || record.codeValue === 4040)}
                                onClick={() => this._downloadDocument(record.signFlowId, 2)}
                            >
                                文档下载
                            </Button>
                        }
                        {
                            this.props.authEdit &&
                            <Button
                                type="link"
                                disabled={record.isDelete === 1}
                                style={{ border: 0 }}
                                onClick={() => this.toggleEditModal(record.signFlowId)}
                            >
                                修改开放日
                            </Button>
                        }
                    </Fragment>
                );
            }
        },
        {
            title: <span><Tooltip placement="top" title={'默认该签约流程有效。若客户签约中止或者悔单，点击将该流程置为无效。一旦置为无效，该状态不可修改'}><InfoCircleOutlined /></Tooltip>&nbsp;签约有效性</span>,
            dataIndex: 'isDelete',
            width: 120,
            render: (val, record) => {
                // eslint-disable-next-line no-undef
                return (
                    <span
                        style={{ color: val === 0 && this.props.authEdit ? '#3D7FFF' : '#797979', cursor: val === 0 && this.props.authEdit ? 'pointer' : null }}
                        onClick={val === 0 && this.props.authEdit ? () => this._onChange(record) : null}
                    >
                        {val === 0 ? '有效' : '无效'}
                    </span>
                );

                // return <Switch checked={val === 0} onChange={() => this._onChange(record)} disabled={val === 1} />;
            }
        }
    ];
    columns = [];


    _setColums = () => {
        // eslint-disable-next-line no-undef
        let key = sessionStorage.getItem('processTabKey');
        if (key === 'tab1') {
            this.columns = this.tab1Columns;
        } else if (key === 'tab2') {
            this.columns = this.tab2Columns;
        } else if (key === 'tab3') {
            this.columns = this.tab3Columns;
        } else if (key === 'tab4') {
            this.columns = this.tab4Columns;
        }
    }


    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColumsHead = () => {
        const { productId, params = {} } = this.props;


        if (!params.customerId) {
            this.tab4Columns.unshift(
                {
                    title: '客户名称',
                    dataIndex: 'customerName',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
                });
        }
        if (!productId) {
            this.tab4Columns.splice(1, 0,
                {
                    title: '产品名称',
                    dataIndex: 'productFullName',
                    width: 100,
                    render: (val, record) => <span onClick={() => this._onDetails(record, 1)} className="details">{val || '--'}</span>
                });
        } else {
            this.tab4Columns.splice(0, 0,
                {
                    title: '份额类别',
                    dataIndex: 'parentProductId',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => <div style={{ width: 80 }}>{val && record.productName || '--'}</div>
                }
            );

        }

    }

    /**
     * @description: 开关控制签约有效性
     * @param {*} record
     */
    _onChange = (record) => {
        const { dispatch } = this.props;
        let _this = this;
        confirm({
            title: '请您确认是否修改该客户签约流程?',
            icon: <ExclamationCircleOutlined />,
            content: '默认该签约流程有效,一旦置为无效，该状态不可修改',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'signInfoList/updateSignFlow',
                    payload: record.signFlowId,
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '配置成功', 'topRight');
                            _this.search();
                        } else {
                            const warningText = res.message || res.data || '配置失败！';
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
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { openDayDate, signFlowStartDate, ...params } = values;
        let tempObj = {};

        tempObj.openDayStartTime = (openDayDate && moment(openDayDate[0]).valueOf()) || undefined;
        tempObj.openDayEndTime = (openDayDate && moment(openDayDate[1]).valueOf()) || undefined;
        tempObj.signFlowStartDateBegin = (signFlowStartDate && moment(signFlowStartDate[0]).valueOf()) || undefined;
        tempObj.signFlowStartDateEnd = (signFlowStartDate && moment(signFlowStartDate[1]).valueOf()) || undefined;

        this.setState({
            searchParams: {
                ...tempObj,
                ...params
            },
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                current: 1
                // pageSize: 20
            }
        }, () => {
            this.search();
        });
    };


    /**
     * @description: 列表查询
     */
    search = () => {
        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch, productId, type, signType } = this.props;
        let investorId = '';
        if (type === 'customerType') {
            const { params: { customerId } } = this.props;
            investorId = customerId;
        }
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }
        let key = sessionStorage.getItem('processTabKey');
        let queryType = 1;
        if (key === 'tab1') {                   // 签约中
            queryType = 1;
        } else if (key === 'tab2') {            // 签约完成
            queryType = 2;
        } else if (key === 'tab3') {            // 无效签约
            queryType = 3;
        } else if (key === 'tab4' || signType === 'all') {            // 全部
            queryType = 0;
        }
        dispatch({
            type: 'signInfoList/querySignFlowAll',
            payload: {
                customerId: !!investorId ? Number(investorId) : undefined,
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                queryType,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        signList: res.data,
                        signInfoList: res.data.list
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        signList: [],
                        signInfoList: []
                    });
                }
            }
        });
    }

    /**
     * @description:重置过滤条件
     */
    reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {},
            signProcessStep: [],
            selectedRowKeys: []
        }, () => {
            this.search();
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
            this.search();
        });
    }



    /**
     * @description: 查看签约流程详情
     * @param {*}
     */
    _onDetails = (record, view) => {
        // 将客户风险等级是否匹配产品风险等级存入缓存 再审核时提示
        if (record.productRiskType > record.customerRiskType) {
            localStorage.setItem('customerRiskMatching', 0);
        } else {
            localStorage.setItem('customerRiskMatching', 1);
        }
        if (view && (record.contractWay === 2 || record.contractWay === 3)) {

            this.setState({ signFlowId: record.signFlowId || '', isModalVisible: true });
            return null;
        }
        const { type } = this.props;
        let key = sessionStorage.getItem('processTabKey');
        let pathName = '';
        if (record.flowType === 1) {
            if (type === 'productTab') {
                pathName = `/product/list/details/${this.props.productId}/signDetails/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else if (type === 'customerType') {
                pathName = `/investor/customerInfo/investordetails/${record.customerId}/CustomerSignDetails/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else {
                pathName = `/raisingInfo/processManagement/productProcessList/productProcessDetails/${record.signFlowId}?key=${key}&isDelete=${record.isDelete}`;
            }
        } else if (record.flowType === 2) {
            if (type === 'productTab') {
                pathName = `/product/list/details/${this.props.productId}/applyDetails/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else if (type === 'customerType') {
                pathName = `/investor/customerInfo/investordetails/${record.customerId}/customerApplyDetails/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else {
                pathName = `/raisingInfo/processManagement/productProcessList/ApplyPurchase/${record.signFlowId}?key=${key}&isDelete=${record.isDelete}`;
            }
        } else if (record.flowType === 3) {
            if (type === 'productTab') {
                pathName = `/raisingInfo/processManagement/productProcessList/Redeming/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else if (type === 'customerType') {
                pathName = `/raisingInfo/processManagement/productProcessList/Redeming/${record.signFlowId}?type=${this.props.type}&isDelete=${record.isDelete}`;
            } else {
                pathName = `/raisingInfo/processManagement/productProcessList/Redeming/${record.signFlowId}?key=${key}&isDelete=${record.isDelete}`;
            }
        }

        history.push(pathName);
    }

    /**
     * @description: 关闭弹窗
     * @param {*}
     */
    _hideModal = () => {
        this.setState({
            visible: false,
            fileTypeShow: false
        });
    }

    /**
     * @description: 打开弹窗
     * @param {*}
     */
    _showModal = (type) => {
        this.setState({
            visible: true,
            dType: type
        });
    }

    // 导出全部
    _downloadAll = () => {
        const { pageData, sortFiled, sortType, searchParams, downloadType, fileType } = this.state;
        const { productId, type, signType } = this.props;
        let investorId = '';
        if (type === 'customerType') {
            const { params: { customerId } } = this.props;
            investorId = customerId;
        }
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }
        let key = sessionStorage.getItem('processTabKey');
        let queryType = 1;
        if (key === 'tab1') {                   // 签约中
            queryType = 1;
        } else if (key === 'tab2') {            // 签约完成
            queryType = 2;
        } else if (key === 'tab3') {            // 无效签约
            queryType = 3;
        } else if (key === 'tab4' || signType === 'all') {            // 全部
            queryType = 0;
        }

        fileExport({
            method: 'post',
            url: '/manager/signFlowController/allExport',
            data: {
                customerId: !!investorId ? Number(investorId) : undefined,
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                queryType,
                downloadType,
                type: fileType,
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

    /**
     * @description: 下载
     */
    _export = () => {
        const { selectedRowKeys, dType, downloadType, fileType } = this.state;
        const { productId } = this.props;
        if (dType === 1) {      // 批量下载
            if (productId) {
                window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                    }/manager/signFlowController/downloadSignFlowId?&signFlowIdList=${selectedRowKeys.toString()}&productId=${productId}&companyCode=${getCookie('companyCode')}&downloadType=${downloadType}&type=${fileType}`;
            } else {
                window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                    }/manager/signFlowController/downloadSignFlowId?&signFlowIdList=${selectedRowKeys.toString()}&companyCode=${getCookie('companyCode')}&downloadType=${downloadType}&type=${fileType}`;
            }
            // downloadFile('/manager/signFlowController/downloadSignFlowId', { signFlowIdList: selectedRowKeys, downloadType: type, companyCode: getCookie('companyCode') }, {}, this.failTips);

            const { params = {} } = this.props;
            // downloadFile('/manager/signFlowController/downloadSignFlowId', { signFlowIdList: selectedRowKeys, downloadType: type, companyCode: getCookie('companyCode') }, {}, this.failTips);
            if (params.customerId) {
                window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                    }/manager/signFlowController/downloadSignFlowId?&signFlowIdList=${selectedRowKeys.toString()}&companyCode=${getCookie('companyCode')}&downloadType=${downloadType}&customerId=${params.customerId}&type=${fileType}`;
            } else {
                window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
                    }/manager/signFlowController/downloadSignFlowId?&signFlowIdList=${selectedRowKeys.toString()}&companyCode=${getCookie('companyCode')}&downloadType=${downloadType}&type=${fileType}`;
            }
        } else if (dType === 2) {       // 下载全部
            this._downloadAll();
        }

        this._hideModal();
    }

    selectFile = (type) => {
        this.setState({
            downloadType: type,
            fileTypeShow: true
        });
    }


    /**
     * @description: 单个导出
     * @param {*}
     */
    _downloadDocument = (id, type) => {
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
            }/manager/signFlowController/downloadSignFlowId?&signFlowIdList=${id}&companyCode=${getCookie('companyCode')}&downloadType=${type}`;
    }

    /**
     * @description 签约流程-申赎单下载
     * @param {*} id
     */
    downloadSignConfirm = (id) => {
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl
            }/manager/signFlowController/downloadSignConfirm?&signFlowId=${id}&tokenId=${getCookie('vipAdminToken')}`;
    }

    /**
     * @description: 导出失败回调
     * @param {*}
     */
    failTips = () => {
        openNotification('warning', '提示', '导出失败', 'topRight');
    }

    /**
     * @description: 交易类型onchange事件
     * @param {*}
     */
    _handleFlowType = (e) => {
        const { localFlowType } = this.state;
        if (localFlowType !== e) {
            this.formRef.current.setFieldsValue({
                codeValue: undefined
            });
        }
        this.setState({
            localFlowType: e,
            signProcessStep: e === 1 ? signSubscriptionStep : signApplyStep
        });
    }

    // 打开关闭新增弹窗
    toggle = () => {
        this.setState({
            signFlowId: '',
            isModalVisible: !this.state.isModalVisible
        });
    }

    /**
     * @description: 新增弹窗onok事件
     * @param {Object} params
     */
    handleOk = (params, attachmentsArr) => {
        const { fileAuditStatus, fileAuditTime, fileAuditP, moneyAuditStatus, moneyAuditP, moneyAuditTime } = params;
        // return
        const arr = attachmentsArr.map((item) => item.map((val) => val.uid));
        const tempArr = [];
        // 整理审核信息
        const auditList = [
            {
                type: 1,
                auditStatus: fileAuditStatus,
                auditPersonId: fileAuditP ? fileAuditP[1] : null,
                auditTime: fileAuditTime && fileAuditTime.format('YYYY-MM-DD HH:mm:ss'),
                auditPersonName: fileAuditP ? fileAuditP[0] : null
            },
            {
                type: 2,
                auditStatus: moneyAuditStatus,
                auditPersonId: moneyAuditP ? moneyAuditP[1] : null,
                auditTime: moneyAuditTime && moneyAuditTime.format('YYYY-MM-DD HH:mm:ss'),
                auditPersonName: moneyAuditP ? moneyAuditP[0] : null
            }
        ];
        // 删除多余字段
        delete params.fileAuditP;
        delete params.fileAuditStatus;
        delete params.fileAuditTime;
        delete params.moneyAuditP;
        delete params.moneyAuditStatus;
        delete params.moneyAuditTime;
        delete params.baseAuditStatus;
        arr.forEach((val) => {
            tempArr.push(...val);
        });
        // createOrUpdateSignFlowOffline
        this.props.dispatch({
            type: 'signInfoList/createOrUpdateSignFlowOffline',
            payload: {
                ...params,
                signFlowId: this.state.signFlowId,
                signType: params.signType ? Number(params.signType) : null,
                completionDate: params.completionDate && params.completionDate.format('YYYY-MM-DD'),
                startDate: params.startDate && params.startDate.format('YYYY-MM-DD'),
                attachmentsIds: tempArr,
                auditList
            },
            callback: (res) => {
                this.setState({ isModalVisible: false });
                if (res.code === 1008) {
                    this.search();
                    openNotification('success', '提示', res.message, 'topRight');
                } else {
                    openNotification('warning', '提示', res.message, 'topRight');
                }
            }
        });
    }

    toggleEditModal = (signFlowId) => {
        const { editModalVisible } = this.state;

        if (editModalVisible) {
            this.setState({
                signFlowId: '',
                editModalVisible: false
            }, () => {
                this.search();
            });
        } else {
            this.setState({
                signFlowId,
                editModalVisible: true
            });
        }
    }

    getAccountManagerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_IDENTIFY/selectAllAccountManager',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        accountManagerList: res.data
                    });
                }
            }
        });
    };

    fileTypeChange = (e) => {
        this.setState({
            fileType: e.target.value
        });
    }


    render() {
        const { fileTypeShow, fileType, accountManagerList, pageData, selectedRowKeys, signList, signInfoList, visible, isModalVisible, localFlowType, editModalVisible, signFlowId } = this.state;
        const { loading, signType, params = {} } = this.props;
        // eslint-disable-next-line no-undef
        let key = sessionStorage.getItem('processTabKey');
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange,
            getCheckboxProps: (record) => ({
                disabled: record.isDelete === 1
            })
        };
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    {
                        signType === 'notFinished' &&
                        <Row>
                            <Col span={4}>
                                <Statistic title="待审核数量" value={signList.pending || '--'} suffix="个" />
                            </Col>
                            <Col span={4}>
                                <Statistic title={<span>待审核客户数量(去重)&nbsp;<Tooltip placement="top" title={'一个客户只计算一次'}><InfoCircleOutlined /></Tooltip></span>} value={signList.customersNumber || '--'} suffix="个" />
                            </Col>
                        </Row>
                    }
                    {
                        signType === 'finished' &&
                        <Row>
                            <Col span={4}>
                                <Statistic title="已签约条数" value={signList.contractedNum || '--'} suffix="个" />
                            </Col>
                            {/* <Col span={6}>
                                <Statistic  valueStyle={{width:'80%', wordBreak:'break-all'}}  title={<span>已签约金额&nbsp;<Tooltip placement="top" title={'认申购单内填写认申购金额统计'}><InfoCircleOutlined /></Tooltip></span>} value={signList.contractedNumAmount || '--'} />
                            </Col> */}
                            <Col span={4}>
                                <Statistic title={<span>签约客户数(去重)&nbsp;<Tooltip placement="top" title={'一个客户只计算一次'}><InfoCircleOutlined /></Tooltip></span>} value={signList.customersNumber || '--'} suffix="个" />
                            </Col>
                        </Row>
                    }

                    {
                        signType === 'invalid' &&
                        <Row>
                            <Col span={4}>
                                <Statistic title="无效签约条数" value={signList.deleteNum || '--'} suffix="个" />
                            </Col>
                            <Col span={4}>
                                <Statistic title={<span>无效签约客户数(去重)&nbsp;<Tooltip placement="top" title={'一个客户只计算一次'}><InfoCircleOutlined /></Tooltip></span>} value={signList.customersNumber || '--'} suffix="个" />
                            </Col>
                        </Row>
                    }
                    {
                        signType === 'all' &&
                        <Row>
                            <Col span={4}>
                                <Statistic title="已签约条数" value={signList.contractedNum || '--'} suffix="个" />
                            </Col>
                            {/* <Col span={6}>
                                <Statistic valueStyle={{width:'80%', wordBreak:'break-all'}} title={<span>已签约金额&nbsp;<Tooltip placement="top" title={'认申购单内填写认申购金额统计'}><InfoCircleOutlined /></Tooltip></span>} value={signList.contractedNumAmount || '--'} />
                            </Col> */}
                            <Col span={4}>
                                <Statistic title="待审核数量" value={signList.pending || '--'} suffix="个" />
                            </Col>
                            <Col span={4}>
                                <Statistic title={<span>签约客户数(去重)&nbsp;<Tooltip placement="top" title={'一个客户只计算一次'}><InfoCircleOutlined /></Tooltip></span>} value={signList.customersNumber || '--'} suffix="个" />
                            </Col>
                        </Row>
                    }
                </div>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                        <Row gutter={[16, 0]} justify="start">
                            {
                                !params.customerId &&
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="客户名称" name="customerName">
                                        <Input placeholder="请输入" autoComplete="off" />
                                    </FormItem>
                                </Col>
                            }
                            {
                                !params.customerId &&
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="客户类别" name="customerType">
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
                            }

                            <Col span={8}>
                                <FormItem {...formItemLayout} label="交易类型" name="flowType">
                                    <Select placeholder="请选择" onChange={this._handleFlowType} allowClear>
                                        {XWTradeType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>

                            {/* </Row> */}
                            {/* <Row gutter={[8, 0]}> */}
                            {
                                signType === 'invalid' &&
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="无效来源" name="invalidSource">
                                        <Select placeholder="请选择" allowClear>
                                            {XWInvalidSource.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            {
                                signType === 'all' &&
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="签约状态" name="signStatus">
                                        <Select placeholder="请选择" allowClear>
                                            {XWSigningstatus.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            {
                                (signType === 'all' || signType === 'notFinished') &&
                                <Col span={8} className={styles.signStep}>
                                    <FormItem {...formItemLayout} label={<span>签约进度<Tooltip placement="top" title={'请先选择交易类型，再查看签约进度选项'}><InfoCircleOutlined /></Tooltip></span>} name="codeValue">
                                        <Select placeholder="请选择" onChange={this._handleCodeValue} allowClear>
                                            {
                                                !isEmpty(signTypeEmum[localFlowType]) &&
                                                signTypeEmum[localFlowType].map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            {/* <Col span={8}>
                                <FormItem {...formItemLayout} label="合同电子签" name="signType">
                                    <Select placeholder="请选择" allowClear>
                                        {XWsignType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col> */}
                            {/* </Row> */}
                            {/* <Row gutter={[8, 0]}> */}
                            {
                                signType === 'all' &&
                                <Col span={8}>
                                    <FormItem {...formItemLayout} label="签约有效性" name="isDelete">
                                        <Select placeholder="请选择" allowClear>
                                            {XWIsDelete.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            <Col span={8}>
                                <MultipleSelect
                                    params="productIds"
                                    value="productId"
                                    label="productName"
                                    mode="multiple"
                                    formLabel="产品名称"
                                    formItemLayout={formItemLayout}
                                />
                            </Col>
                            <Col span={8}>
                                <CustomRangePicker formItemLayout={formItemLayout} assignment={this.formRef} label="开放日日期" name="openDayDate" />
                            </Col>

                            <Col span={8}>
                                <CustomRangePicker formItemLayout={formItemLayout} assignment={this.formRef} label="签约发起时间" name="signFlowStartDate" />
                            </Col>
                            {!params.customerId && (
                                <Col span={8}>
                                    <FormItem  {...formItemLayout} label="证件号码" name="cardNumber">
                                        <Input placeholder="请输入" autoComplete="off" allowClear />
                                    </FormItem>
                                </Col>
                            )}
                            <Col span={8}>
                                <FormItem  {...formItemLayout} label="客户经理" name="managerUserIds">
                                    <Select placeholder="请选择" allowClear>
                                        {accountManagerList.map((item, index) => (
                                            <Option key={index} value={item.managerUserId}>
                                                {item.userName}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>

                            <Col span={8} className={styles.isRiskTypeMatching}>
                                <FormItem  {...formItemLayout} label={<span title="客户承受风险等级与产品等级是否匹配" className={styles.overFlowEllipsis}>客户承受风险等级与产品等级是否匹配</span>} name="isRiskTypeMatching">
                                    <Select placeholder="请选择">
                                        <Option key={'isRiskTypeMatching1'} value={1}>
                                            是
                                        </Option>
                                        <Option key={'isRiskTypeMatching0'} value={0}>
                                            否
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]} justify="end">
                            <Col span={6} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this.reset}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        {
                            this.props.authEdit &&
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={this.toggle}
                            >
                                新建
                            </Button>
                        }
                        {this.props.authExport && signType !== 'invalid' &&
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={() => this._showModal(1)}
                                    >
                                        下载选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={() => this._showModal(2)}
                                    >
                                        下载全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    &nbsp;&nbsp;批量下载
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        }
                        <VisitRemind ids={selectedRowKeys} />
                        {/* {
                            this.props.authExport &&
                            <Button type="primary" disabled={isEmpty(selectedRowKeys)} onClick={this._showModal}>批量下载</Button>
                        } */}

                        {/* <span style={{ color: '#666666' }}>注：会系统自动同步，也可点击按钮手动同步</span> */}
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
                    )}
                    <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={signInfoList}
                        rowKey={(record) => record.signFlowId}
                        scroll={{ x: '100%',y:500,scrollToFirstRowOnChange:true }}
                        // sticky
                        pagination={paginationPropsback(
                            signList && signList.total,
                            pageData.current
                        )}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                    /> */}
                    {
                        key === 'tab1' &&
                        <MXTable
                            loading={loading}
                            columns={this.tab1Columns}
                            dataSource={signInfoList}
                            total={signList && signList.total}
                            pageNum={pageData.current}
                            rowKey={(record) => record.signFlowId}
                            onChange={(p, e, s) => this._tableChange(p, e, s)}
                            rowSelection={rowSelection}
                            scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                        />
                    }
                    {
                        key === 'tab2' &&
                        <MXTable
                            loading={loading}
                            columns={this.tab2Columns}
                            dataSource={signInfoList}
                            total={signList && signList.total}
                            pageNum={pageData.current}
                            rowKey={(record) => record.signFlowId}
                            onChange={(p, e, s) => this._tableChange(p, e, s)}
                            rowSelection={rowSelection}
                            scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                        />
                    }
                    {
                        key === 'tab3' &&
                        <MXTable
                            loading={loading}
                            columns={this.tab3Columns}
                            dataSource={signInfoList}
                            total={signList && signList.total}
                            pageNum={pageData.current}
                            rowKey={(record) => record.signFlowId}
                            onChange={(p, e, s) => this._tableChange(p, e, s)}
                            rowSelection={rowSelection}
                            scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                        />
                    }
                    {
                        key === 'tab4' &&
                        <MXTable
                            loading={loading}
                            columns={this.tab4Columns}
                            dataSource={signInfoList}
                            total={signList && signList.total}
                            pageNum={pageData.current}
                            rowKey={(record) => record.signFlowId}
                            onChange={(p, e, s) => this._tableChange(p, e, s)}
                            rowSelection={rowSelection}
                            scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                        />
                    }
                    <Modal
                        title="签约材料下载方式"
                        visible={visible}
                        onCancel={this._hideModal}
                        footer={null}
                        className={styles.downloadModal}
                    >
                        <Button type="primary" onClick={() => this.selectFile(2)}>按照客户层级下载签约文件</Button>
                        <Button type="primary" onClick={() => this.selectFile(1)}>按照文件层级下载签约文件</Button>
                    </Modal>
                    <Modal
                        title="请选择下载内容"
                        visible={fileTypeShow}
                        onCancel={this._hideModal}
                        footer={
                            <Button onClick={() => this._export()} type="primary">确定下载</Button>
                        }
                    >
                        <Radio.Group onChange={this.fileTypeChange} value={fileType}>
                            <Radio value={1}>仅下载协议</Radio>
                            <Radio value={2}>仅下载双录视频 </Radio>
                            <Radio value={3}>下载协议及双录视频</Radio>
                        </Radio.Group>
                    </Modal>
                    {
                        isModalVisible &&
                        <AddModal
                            params={params}
                            onCancel={this.toggle}
                            isModalVisible
                            signFlowId={this.state.signFlowId}
                            onOk={this.handleOk}
                        />
                    }
                    {
                        editModalVisible &&
                        <EditOpenDayModal
                            signFlowId={signFlowId}
                            editModalVisible
                            closeModal={this.toggleEditModal}
                        />
                    }
                </div>
            </div>
        );
    }
}
export default Tab;
