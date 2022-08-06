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
    notification,
    Upload,
    Tree,
    DatePicker,
    Modal,
    Checkbox,
    Statistic,
    Space,
    Popconfirm,
    Dropdown,
    Menu,
    AutoComplete
} from 'antd';
import {
    XWcustomerCategoryOptions,
    paginationPropsback,
    XWSourceType,
    XWNotificationMethod,
    tradeType,
    CHANNELTYPE,
    CUSTOMERSHARETYPE
} from '@/utils/publicData';
import { DownOutlined, UpOutlined, InboxOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';
import Detail from '../Detail';
import BatchUpload from '@/pages/components/batchUpload';
import { getCookie, getPermission, getRandomKey, isNumber, numTransform2, fileExport, listToMap, getQueryString } from '@/utils/utils';
import ManagedData from '@/pages/components/Transaction/ManagedData';
import { CustomRangePicker } from '@/pages/components/Customize';
import { isEmpty } from 'lodash';

import ReUploadModal from './Components/ReUploadModal';


const { Dragger } = Upload;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

// 设置日期格式
const dateFormat = 'YYYY-MM-DD HH:mm:ss';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { TextArea } = Input;

const { Option } = Select;


const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

const currencyObj = {
    人民币: 'CNY',
    美元: 'USD',
    港币: 'HKD'
};
@connect(({ TradeQuery, loading }) => ({
    loading: loading.effects['RunningList/TradeQuery'],
    deleteLoading: loading.effects['RunningList/tradeDelete'],
    TradeQuery
}))
class List extends PureComponent {
    state = {
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: { }, // 查询参数
        sortFiled: '', // 排序字段
        sortType: '', // 排序类型：asc-升序；desc-降序
        checkedValues: undefined, //通知客户的集中选项
        showColumn: false, //列设置是否显示
        columnsStandard: [], //表头基准值  因为有列设置
        columnsValue: [], //表头
        confirmId: null, //单个点击确认金额的id
        productList: [],
        customerList: [],
        popNewadd: false,
        uploadFlag: false, //批量上传模态框,
        modelAndManagedData: false, // 读取托管数据
        currency: undefined, // 币种类型
        page: {
            list: [],
            pageNum: '',
            pageSize: '',
            pages: '',
            total: ''
        },
        isModalVisible: false,   // 重新上传客户弹窗
        uploadFailKey: { },        // 上传失败回调 保存重新上传客户的key
        channelList: [],      //渠道列表
        accountManagerList: [],
        isShowStatisticalData: false    //是否展示认申赎确认统计信息

    };

    componentDidMount() {
        const { params = { } } = this.props;
        this.setState({
            columnsStandard: this.setTableHead(this.columns),
            columnsValue: this.setTableHead(this.columns)
        });
        const rangeDate = getQueryString('rangeDate');
        const Confirmationdate = getQueryString('Confirmationdate');
        if (rangeDate) {
            let tradeTypes = getQueryString('tradeTypes');
            // console.log(Object.prototype.toString.call(tradeTypes.split(',')), 'type');
            tradeTypes = tradeTypes.split(',');
            let newTradeTypes = [];
            tradeTypes.map((item) => {
                newTradeTypes.push(item * 1);
            });

            if (tradeTypes) {
                tradeTypes = newTradeTypes;
            }
            let rangeDateArr = rangeDate.split('-');
            this.formRef.current.setFieldsValue({
                Applicationdate: [moment(rangeDateArr[0] * 1), moment(rangeDateArr[1] * 1)],
                tradeTypes: tradeTypes,
                currency: undefined
            });
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeApplyTimeStart = moment(rangeDateArr[0] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeApplyTimeEnd = moment(rangeDateArr[1] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeTypes = tradeTypes;
        }


        if (Confirmationdate) {
            let tradeTypes = getQueryString('tradeTypes');
            // console.log(Object.prototype.toString.call(tradeTypes.split(',')), 'type');
            tradeTypes = tradeTypes.split(',');
            let newTradeTypes = [];
            tradeTypes.map((item) => {
                newTradeTypes.push(item * 1);
            });

            if (tradeTypes) {
                tradeTypes = newTradeTypes;
            }
            let rangeDateArr = Confirmationdate.split('-');
            this.formRef.current.setFieldsValue({
                Confirmationdate: [moment(rangeDateArr[0] * 1), moment(rangeDateArr[1] * 1)],
                tradeTypes: tradeTypes,
                currency: undefined
            });
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeTimeStart = moment(rangeDateArr[0] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeTimeEnd = moment(rangeDateArr[1] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.tradeTypes = tradeTypes;
        }

        this._search();
        // if (!params.customerId && !rangeDate) {
        // this.formRef.current.setFieldsValue({ shareType: 1 });
        // eslint-disable-next-line react/no-direct-mutation-state
        // this.state.searchParams.shareType = 1;
        // }

        // if (!params.productId && !rangeDate) {
        //     this.formRef.current.setFieldsValue({
        //         currency: '人民币'
        //     });
        //     this.setState({
        //         currency: '人民币'
        //     }, () => {
        //         this._search();
        //     });
        // } else {
        //     this._search();
        // }

        this.getTradeGetNotifyType();
        this.setState({
            parameter: params
        });
        this.getChannelList();
        this.getAccountManagerList();
        // this._setColums();
    }

    // 获取渠道列表

    getChannelList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/channelList',
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    this.setState({
                        channelList: res.data
                    });
                }
            }
        });
    };


    // 设置表头
    setTableHead = (arr = []) => {
        const { params = { } } = this.props;
        let newArr = [...arr];


        if (!params.customerId) {
            newArr.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 120,
                // fixed: 'left',
                render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
            });
        }
        if (!params.productId) {
            newArr.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                // fixed: 'left',
                // ellipsis: true,
                width: 120,
                render: (val, record) => <Link to={`/product/list/details/${record.productId}`}>{val}</Link> || '--'
            });
        } else {
            newArr.unshift(
                {
                    title: '份额类别',
                    dataIndex: 'parentProductId',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => <div style={{ width: 80 }}>{val && record.productName || '--'}</div>
                }
            );
        }


        return newArr;
    };

    // 下载
    templateDownload = (data = { }) => {
        fileExport({
            method: 'get',
            url: `/trade/downloadConfirmFile/${data.tradeRecordId || 0}`,
            data: { },
            callback: ({ status, message = '导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
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

    productchange = (value, arr) => {
        console.log(value);
        const { productList } = this.state;
        const changeArr = [];
        if (value) {
            productList.map((item) => {
                Array.isArray(value) && value.map((itemT) => {
                    item.productId === itemT && changeArr.push(item.currency);
                });
            });
        }
        if (changeArr.length > 0) {
            changeArr.some((value, index) => {
                if (value !== changeArr[0]) {
                    this.formRef.current.setFieldsValue({
                        currency: undefined
                    });
                } else {
                    this.formRef.current.setFieldsValue({
                        currency: changeArr[0]
                    });
                }
            });
        } else {
            this.formRef.current.setFieldsValue({
                currency: changeArr[0]
            });
        }
    }

    // 表单实例对象
    formRef = React.createRef();
    popUpRef = React.createRef();
    // Table的列
    columns = [

        // {
        //     title: '产品名称',
        //     dataIndex: 'productName',
        //     // ellipsis: true,
        //     width: 120,
        //     render: (val) => val || '--'
        // },
        {
            title: '客户经理',
            dataIndex: 'managerUserNames',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120
        },
        {
            title: '交易账号',
            dataIndex: 'tradeAccount',
            width: 100,
            // ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '交易类型',
            dataIndex: 'tradeType',
            width: 80,
            // fixed: true,
            render: (val) => {
                let obj = tradeType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '币种',
            dataIndex: 'currency',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '确认日期',
            dataIndex: 'tradeTime',
            width: 120,
            render: (val) => (val && moment(val).format('YYYY/MM/DD')) || '--'
        },
        {
            title: '确认金额',
            dataIndex: 'tradeMoney',
            // ellipsis: true,
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '确认份额',
            dataIndex: 'tradeShare',
            // ellipsis: true,
            width: 100,
            render: (val) => val
        },
        {
            title: '交易净值',
            dataIndex: 'tradeNetValue',
            // ellipsis: true,
            width: 100,
            render: (val) => isNumber(val) ? val : '--'
        },
        {
            title: '申请日期',
            dataIndex: 'tradeApplyTime',
            width: 120,
            render: (val) => (val && moment(val).format('YYYY/MM/DD')) || '--'
        },
        {
            title: '申请金额',
            dataIndex: 'tradeApplyMoney',
            width: 120,
            // ellipsis: true,
            render: (val) => numTransform2(val)
        },
        {
            title: '申请份额',
            dataIndex: 'tradeApplyShare',
            // ellipsis: true,
            width: 100,
            render: (val) =>val
        },
        {
            title: '交易费用',
            dataIndex: 'tradeFare',
            // ellipsis: true,
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '手续费',
            dataIndex: 'serviceMoney',
            // ellipsis: true,
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '业绩报酬',
            dataIndex: 'reward',
            // ellipsis: true,
            width: 100,
            render: (val) => isNumber(val) ? val : '--'
        },
        {
            title: '份额确认书',
            dataIndex: 'isConfirmFile',
            // ellipsis: true,
            width: 100,
            render: (val, data) => {
                if (val) {
                    return <a onClick={() => this.templateDownload(data)}>下载</a>;
                }
                return '--';
            }
        },
        {
            title: '渠道编码',
            dataIndex: 'dealer',
            width: 100,
            ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '渠道名称',
            dataIndex: 'channelName',
            width: 100,
            // ellipsis: true,
            render: (val) => val || '--'
        },
        {
            title: '渠道类型',
            dataIndex: 'channelType',
            width: 100,
            // ellipsis: true,
            render: (val, record) => {
                if (val && record.channelName) {
                    let strArr = [];
                    CHANNELTYPE.map((item) => {
                        if (val.includes(item.value)) {
                            strArr.push(item.label);
                        }
                    });
                    return strArr.join(',');
                } else return '--';
            }
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 120,
            render: (val) => {
                let obj = XWSourceType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },

        {
            title: '操作',
            width: 120,
            // ellipsis: true,
            render: (_, record) => (
                <Space>
                    {this.props.authEdit && <a onClick={() => this._edit(record)}>编辑</a>}
                    {this.props.authEdit && (
                        <Popconfirm
                            title="确定删除？"
                            onConfirm={() => this.doDelete(record.tradeRecordId)}
                        >
                            <a>删除</a>
                        </Popconfirm>
                    )}
                </Space>
            )
        }
    ];

    getAccountManagerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_IDENTIFY/selectAllAccountManager',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    console.log(res);
                    this.setState({
                        accountManagerList: res.data
                    });
                }
            }
        });
    };
    _edit = (record) => {
        const { parameter } = this.state;
        // params.tradeFlowId = tradeFlowId;
        console.log(parameter);
        this.setState({
            parameter: {
                ...parameter,
                ...record
            },
            popNewadd: true
        });
    };

    // 删除
    doDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'RunningList/tradeDelete',
            payload: { tradeRecordId: id },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '删除成功！', 'topRight');
                    this.setState({ selectedRowKeys: [] });
                    this._search();
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
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { currency, Confirmationdate = [], Applicationdate = [], ...formParmas } = values;
        let tempObj = { };
        tempObj.tradeTimeStart = Confirmationdate && Confirmationdate[0] || undefined;
        tempObj.tradeTimeEnd = Confirmationdate && Confirmationdate[1] || undefined;
        tempObj.tradeApplyTimeStart = Applicationdate && Applicationdate[0] || undefined;
        tempObj.tradeApplyTimeEnd = Applicationdate && Applicationdate[1] || undefined;

        this.setState({
            searchParams: {
                ...formParmas,
                ...tempObj
            },
            currency,
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

    // 获取列表
    _search = () => {
        const { pageData, sortFiled, sortType, searchParams, currency } = this.state;
        const { dispatch, params = { } } = this.props;
        const tempObj = { };
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }
        dispatch({
            type: 'RunningList/TradeQuery',
            payload: {
                currency,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams,
                ...params
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    const { page = { } } = res.data;
                    // 当在产品列表时显示当前产品默认币种
                    // if (!!params.productId && !isEmpty(page.list)) {
                    //     this.setState({
                    //         currency: page.list[0].currency
                    //     });
                    // }
                    this.setState({
                        ...res.data
                    });
                }
            }
        });
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        const { params = { } } = this.props;
        this.formRef.current.resetFields();
        // if (!params.productId) {
        //     this.formRef.current.setFieldsValue({
        //         currency: '人民币'
        //     });
        // }

        this.setState({
            searchParams: { },
            currency:undefined,
            selectedRowKeys: []
        }, () => {
            // if (!params.productId) {
            this._search();
            // }
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
     * @description: 新增客户（路由跳转）
     */
    _onAdd = () => {
        const { popNewadd, parameter } = this.state;
        this.setState({
            popNewadd: !popNewadd,
            parameter: {
                ...parameter,
                tradeRecordId: undefined
            }
        });
    };

    /**
     * @description: 选择通知客户的方式
     * @param {Array} checkedValues
     */

    NotificationChange = (checkedValues) => {
        this.setState({
            checkedValues
        });
    };

    /**
     * @description: 监听上传成功或者失败
     */
    handleFileChange = (e) => {
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');

                this.SearchMethod();
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };
    /**
     *
     *@description: 批量导出
     **/
    bulkdownload = () => {
        const { selectedRowKeys } = this.state;
        const { dispatch } = this.props;
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
        return (
            <Tree
                style={{ width: '100%', paddingTop: 20, border: '1px solid #ccc' }}
                checkable
                defaultCheckedKeys={pitchonArray}
                onCheck={this.HeadColumn}
                treeData={newArray}
            />
        );
    };
    /**
     *@description: 列设置变化
     **/
    HeadColumn = (selectedKeys, info) => {
        const select = info.checkedNodes;
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
     *@description: 切换托管行
     **/
    switchHosting = (value) => {
        console.log(value);
    };

    // 批量删除
    _delete = () => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        dispatch({
            type: 'RunningList/tradeDelete',
            payload: { tradeRecordId: selectedRowKeys.toString() },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '删除成功！', 'topRight');
                    this.setState({ selectedRowKeys: [] });
                    this._search();
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
    }


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

    // 上传
    upload = () => {
        this.setState({ uploadFlag: true });
    };

    // 上传成功
    uploadSuccess = () => {
        this._search();
        this.closeUploadModal();
    };

    // 上传失败回调
    uploadFail = (res) => {
        if (res && res.data && res.data.success === false) {
            this.setState({
                isModalVisible: true,
                uploadFailKey: res && res.data && res.data.key
            });
        }
    }

    //  关闭模态框
    closeUploadModal = () => {
        this.setState({ uploadFlag: false });
    };

    /**
     * @description 批量下载
     */
    _batchDownload = () => {
        const { selectedRowKeys } = this.state;
        const { params = { } } = this.props;
        let ids = selectedRowKeys.join(',');
        if (params.productId) {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/trade/batchDownload'}?tradeRecordIds=${ids}&productId=${params.productId
            }&tokenId=${getCookie('vipAdminToken')}`;
        } else {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/trade/batchDownload'}?tradeRecordIds=${ids}&tokenId=${getCookie(
                'vipAdminToken',
            )}`;
        }
        if (params.customerId) {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/trade/batchDownload'}?tradeRecordIds=${ids}&tokenId=${getCookie(
                'vipAdminToken',
            )}&customerId=${params.customerId}`;
        } else {
            window.location.href = `${BASE_PATH.adminUrl
            }${'/trade/batchDownload'}?tradeRecordIds=${ids}&tokenId=${getCookie(
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
            url: '/trade/allExport',
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

    _getManagedData = (val) => {
        this.setState({
            modelAndManagedData: val
        });
    };

    // 关闭重新上传客户弹窗
    onCancelModal = () => {
        this.setState({
            isModalVisible: false
        });
    }

    // onOk = () => {

    // }

    render() {
        const {
            checkedValues,
            page,
            pageData,
            selectedRowKeys,
            showColumn,
            columnsValue,
            customerNum,
            productNum,
            totalReward,
            totalServiceMoney,
            totalTradeApplyMoney,
            totalTradeApplyShare,
            totalTradeFare,
            totalTradeMoney,
            totalTradeShare,
            productList,
            popNewadd,
            parameter,
            uploadFlag,
            modelAndManagedData,
            currency,
            isModalVisible,
            deleteLoading,
            uploadFailKey,
            channelList,
            accountManagerList,
            isShowStatisticalData
        } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        const { loading, params = { } } = this.props;
        return (
            <div className={styles.container}>
                <Modal
                    title={parameter && parameter.tradeRecordId ? '编辑':'新建'}
                    closable={false}
                    visible={popNewadd}
                    footer={null}
                    destroyOnClose
                    width={'80%'}
                >
                    <Detail
                        params={parameter}
                        close={this._onAdd}
                        getTradeQuery={this._search}
                    />
                </Modal>
                <Modal
                    visible={modelAndManagedData}
                    footer={null}
                    title={'读取托管数据'}
                    maskClosable={false}
                    destroyOnClose
                    onCancel={(e) => this._getManagedData(false)}
                >
                    <ManagedData
                        changeModal={this._getManagedData}
                        updateTable={(e) => this._reset()}
                        type="transactionManaged"
                    />
                </Modal>
                <Row>
                    <Col offset={18} span={6}>
                        <a onClick={() => this.setState({
                            isShowStatisticalData: !isShowStatisticalData
                        })}
                        >
                            {
                                isShowStatisticalData ? '不' : ''
                            }
                            {'展示认申赎确认统计数据'} {' '}
                            {
                                isShowStatisticalData ? <UpOutlined></UpOutlined> : <DownOutlined></DownOutlined>
                            }
                        </a>
                    </Col>
                </Row>
                {
                    isShowStatisticalData && <div className={styles.top}>
                        <Row gutter={[8, 18]}>
                            {!params.productId && (
                                <Col span={6}>
                                    <Statistic title="产品数量" value={isNumber(productNum) ? productNum : '--'} />
                                </Col>
                            )}
                            {!params.customerId && (
                                <Col span={6}>
                                    <Statistic title="客户数量" value={isNumber(customerNum) ? customerNum : '--'} />
                                </Col>
                            )}

                            <Col span={6}>
                                <Statistic
                                    title={
                                        !!currencyObj[currency]
                                            ? `总申请金额(${currencyObj[currency]})`
                                            : '总申请金额'
                                    }
                                    value={isNumber(totalTradeApplyMoney) ? totalTradeApplyMoney : '--'}
                                />
                            </Col>

                            <Col span={6}>
                                <Statistic
                                    title={
                                        !!currencyObj[currency]
                                            ? `总确认金额(${currencyObj[currency]})`
                                            : '总确认金额'
                                    }
                                    value={isNumber(totalTradeMoney) ? totalTradeMoney : '--'}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic title="总申请份额" value={isNumber(totalTradeApplyShare) ? totalTradeApplyShare : '--'} />
                            </Col>
                            <Col span={6}>
                                <Statistic title="总确认份额(不含分红信息)" value={isNumber(totalTradeShare) ? totalTradeShare : '--'} />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={
                                        !!currencyObj[currency]
                                            ? `总业绩报酬(${currencyObj[currency]})`
                                            : '总业绩报酬'
                                    }
                                    value={isNumber(totalReward) ? totalReward : '--'}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={
                                        !!currencyObj[currency]
                                            ? `总交易费用(${currencyObj[currency]})`
                                            : '总交易费用'
                                    }
                                    value={isNumber(totalTradeFare) ? totalTradeFare : '--'}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title={
                                        !!currencyObj[currency]
                                            ? `总手续费(${currencyObj[currency]})`
                                            : '总手续费'
                                    }
                                    value={isNumber(totalServiceMoney) ? totalServiceMoney : '--'}
                                />
                            </Col>
                        </Row>
                    </div>


                }


                <div className={styles.filter}>
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        {...formItemLayout}
                    // initialValues={{
                    //     currency: '人民币'
                    // }}
                    >
                        <Row gutter={[8, 0]}>
                            <Col span={20}>
                                <Row>
                                    {!params.customerId && (
                                        <Col span={8}>
                                            <FormItem label="客户名称" name="customerName">
                                                <Input placeholder="请输入客户名称" allowClear />
                                                {/* <Select
                                            placeholder="请输入客户名称"
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                        >
                                            {customerList.map((item, index) => (
                                                <Option
                                                    key={item.customerId}
                                                    value={item.customerName}
                                                >
                                                    {item.customerName}
                                                </Option>
                                            ))}
                                        </Select> */}
                                            </FormItem>
                                        </Col>
                                    )}
                                    {!params.productId && (
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
                                                    onChange={this.productchange}
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
                                    )}

                                    {!params.channelId &&
                                        <Col span={8}>
                                            <FormItem label="渠道编码" name="encodingRules">
                                                {/* <Input placeholder="请输入渠道编码" /> */}
                                                <AutoComplete
                                                    // style={{ width: 200 }}
                                                    backfill
                                                    // onChange={debounce_getShareList}
                                                    // onSelect={_getStockInfo}
                                                    placeholder="请选择渠道编码"
                                                >
                                                    {channelList.map((item) => (
                                                        <AutoComplete.Option key={item.channelId} value={item.encodingRules} allowClear>
                                                            {
                                                                item.encodingRules
                                                            }
                                                        </AutoComplete.Option>
                                                    ))}
                                                </AutoComplete>
                                            </FormItem>
                                        </Col>
                                    }
                                    <Col span={8}>
                                        <CustomRangePicker assignment={this.formRef} label="确认日期" name="Confirmationdate" />
                                        {/* <FormItem label="确认日期" name="Confirmationdate">
                                            <RangePicker style={{ width: '100%' }} />
                                        </FormItem> */}
                                    </Col>
                                    <Col span={8}>
                                        <CustomRangePicker assignment={this.formRef} label="申请日期" name="Applicationdate" />
                                        {/* <FormItem label="申请日期" name="Applicationdate">
                                            <RangePicker style={{ width: '100%' }} />
                                        </FormItem> */}
                                    </Col>
                                    {
                                        !params.productId &&
                                        <Col span={8}>
                                            <FormItem label="币种" name="currency">
                                                <Select placeholder="请选择" allowClear>
                                                    <Option key={getRandomKey(3)} value="人民币">
                                                        人民币
                                                    </Option>
                                                    <Option key={getRandomKey(3)} value="美元">
                                                        美元
                                                    </Option>
                                                    <Option key={getRandomKey(3)} value="港币">
                                                        港币
                                                    </Option>
                                                </Select>
                                            </FormItem>
                                        </Col>
                                    }
                                    <Col span={8}>
                                        <FormItem label="交易类型" name="tradeTypes">
                                            <Select
                                                placeholder="请选择"
                                                allowClear
                                                mode="multiple"
                                            >
                                                {tradeType.map((item) => (
                                                    <Option key={item.value} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    {!params.channelId &&
                                        <Col span={8}>
                                            <FormItem label="渠道名称" name="channelName">
                                                {/* <Input placeholder="请输入" /> */}
                                                <AutoComplete
                                                    // style={{ width: 200 }}
                                                    backfill
                                                    // onChange={debounce_getShareList}
                                                    // onSelect={_getStockInfo}
                                                    placeholder="请选择渠道名称"
                                                >
                                                    {channelList.map((item) => (
                                                        <AutoComplete.Option key={item.channelId} value={item.channelName} allowClear>
                                                            {item.channelName}
                                                        </AutoComplete.Option>
                                                    ))}
                                                </AutoComplete>
                                            </FormItem>
                                        </Col>
                                    }
                                    {!params.channelId &&
                                        <Col span={8}>
                                            <FormItem label="渠道类型" name="channelType">
                                                <Select placeholder="请选择" allowClear>
                                                    {CHANNELTYPE.map((item) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        </Col>
                                    }
                                    {!params.customerId && (
                                        <Col span={8}>
                                            <FormItem label="证件号码" name="cardNumber">
                                                <Input placeholder="请输入" autoComplete="off" allowClear />
                                            </FormItem>
                                        </Col>
                                    )}
                                    {!params.customerId && (
                                        <Col span={8}>
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
                                    )}
                                    <Col span={8}>
                                        <FormItem label="客户经理" name="managerUserIds">
                                            <Select placeholder="请选择" allowClear>
                                                {accountManagerList.map((item, index) => (
                                                    <Option key={index} value={item.managerUserId}>
                                                        {item.userName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem label="份额确认书" name="isConfirmFile">
                                            <Select placeholder="请选择" allowClear>
                                                <Option value={1} >
                                                    有
                                                </Option>
                                                <Option value={0}>
                                                    无
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={4} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                            </Col>
                        </Row>
                        {/*
                        <Row gutter={[8, 0]}>

                        </Row> */}
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
                                            批量上传
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
                                    {/* {this.props.authExport && (
                                        <Button
                                            onClick={this._batchDownload}
                                            disabled={selectedRowKeys.length === 0}
                                        >
                                            批量导出
                                        </Button>
                                    )} */}
                                    {this.props.authEdit &&
                                        <Button
                                            loading={deleteLoading}
                                            onClick={this._delete}
                                            disabled={selectedRowKeys.length === 0}
                                        >
                                            批量删除
                                        </Button>
                                    }
                                    {this.props.authExport && !params.customerId && !params.productId && (
                                        <Button
                                            onClick={(e) => this._getManagedData(true)}
                                            type="link"
                                        >
                                            读取托管数据
                                        </Button>
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
                                        已选择{' '}
                                        <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}
                                        项&nbsp;&nbsp;
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
                        dataSource={page.list}
                        rowKey="tradeRecordId"
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                        pagination={paginationPropsback(page.total, page.pageNum)}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                    />
                </div>

                {uploadFlag && (
                    <BatchUpload
                        modalFlag={uploadFlag}
                        url="/trade/batchUpload"
                        onOk={this.uploadSuccess}
                        closeModal={this.closeUploadModal}
                        params={params}
                        templateUrl={`/trade/downloadTemplate?&tokenId=${getCookie(
                            'vipAdminToken',
                        )}`}
                        failCallback={this.uploadFail}
                    // params={{ productId: params.productId ? Number(params.productId) : undefined }}
                    />
                )}
                {
                    isModalVisible &&
                    <ReUploadModal
                        onCancel={this.onCancelModal}
                        isModalVisible
                        onOk={this.onOk}
                        uploadFailKey={uploadFailKey}
                    />
                }
                {/* <Button onClick={this.uploadFail}>test</Button> */}
            </div>
        );
    }
}
export default List;
