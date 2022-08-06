/*
 * @description: 净值管理列表
 * @Author: tangsc
 * @Date: 2020-10-21 16:24:43
 */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Menu,
    Dropdown,
    DatePicker,
    Checkbox,
    Space,
    Modal,
    notification
} from 'antd';
import {
    PlusOutlined,
    ExclamationCircleOutlined,
    DownOutlined
} from '@ant-design/icons';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './index.less';
import { isEmpty } from 'lodash';
import moment from 'moment';
import NetValueDetails from '../../netValueDetails';
import { getCookie, downloadFile, getRandomKey, fileExport, numberToThousand } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect } from '@/pages/components/Customize';
import ManagedData from '@/pages/components/Transaction/ManagedData';
import DataMaintenance from './dataMaintenance';


// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

// 周频天数
const weekDay = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 月频天数
const monthDay = [];
for (let i = 1; i <= 31; i++) {
    monthDay.push({
        label: `每月${i}号`,
        value: i
    });
}

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

@connect(({ netValue, loading }) => ({
    netValue,
    loading: loading.effects['netValue/getNetValueList']
}))
class NetValueList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        noRiskRate: 0,                      // 设置无风险利率
        searchParams: {},                   // 查询参数
        batchUploadModalFlag: false,        // 控制批量上传modal显示隐藏
        sortFiled: '',                      // 排序字段
        sortType: '',                       // 排序类型：asc-升序；desc-降序
        isModalVisible: false,              // 控制新增净值弹窗显示隐藏
        isAddOrEdit: 'add',                 // 判断新增或者编辑
        productNetvalueId: 0,               // 产品净值id
        enableStatistic: 0,                 // 是否启用统计数据：(0:否 1:是)
        frequencyValue: 1,                  // 净值频率 1：日频 2：周频 3：月频
        modelAndManagedData: false,
        productTypeList: []                 // 产品系列列表
    };

    componentDidMount() {
        const { productId } = this.props;
        this._setColums();
        // 查询产品系列列表
        this._queryProductTypeList();
        if (productId !== '0') {
            this._search();
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'netValue/updateState',
            payload: {
                netValueList: []
            }
        });
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        // {
        //     title: '产品名称',
        //     dataIndex: 'productName',
        //     width: 120,
        //     fixed: 'left',
        //     render: (val, record) => {
        //         return (
        //             <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
        //         );
        //     }
        // },
        {
            title: '净值日期',
            dataIndex: 'netDate',
            width: 120,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '单位净值',
            dataIndex: 'netValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '累计单位净值',
            dataIndex: 'acumulateNetValue',
            width: 130,
            sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '复权净值',
            dataIndex: 'adjustedNetValue',
            width: 120,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '资产净值',
            dataIndex: 'feeNetValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val && numberToThousand(val) || '--'}</span>
        },
        {
            title: '资产份额',
            dataIndex: 'shareValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val &&  numberToThousand(val)  || '--'}</span>
        },
        {
            title: '资产总值',
            dataIndex: 'totalValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val &&  numberToThousand(val)  || '--'}</span>
        },
        {
            title: '今年收益率',
            dataIndex: 'currRate',
            width: 130,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '累计收益率',
            dataIndex: 'cumulativeRate',
            width: 120,
            // ellipsis: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '平均年化收益率',
            dataIndex: 'avgRate',
            width: 130,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '复利年化收益率',
            dataIndex: 'compoundRate',
            width: 130,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '年化波动率',
            dataIndex: 'changeRate',
            width: 120,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '夏普比率',
            dataIndex: 'sharpeRatio',
            width: 120,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}`) || '--'}</span>
        },
        {
            title: '卡玛比率',
            dataIndex: 'karmaRatio',
            width: 120,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}`) || '--'}</span>
        },
        {
            title: '最大回撤率',
            dataIndex: 'maxDrawRate',
            width: 120,
            // sorter: true,
            render: (val) => <span>{(val && `${Number(val).toFixed(2)}%`) || '--'}</span>
        },
        {
            title: '分红日',
            dataIndex: 'isDividendDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isDividendDay')}
                    />
                );
            }
        },
        {
            title: '计提日',
            dataIndex: 'isfetchdDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isfetchdDay')}
                    />
                );
            }
        },
        {
            title: '开放日',
            dataIndex: 'isOpenDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isOpenDay')}
                    />
                );
            }
        },
        {
            title: '净值是否展示',
            dataIndex: 'isShowNetvalue',
            width: 110,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isShowNetvalue')}
                    />
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {this.props.authEdit && (
                            <Space>
                                <span className="details" onClick={() => this._handleEdit(record)}>
                                    编辑{' '}
                                </span>
                                <span
                                    className="details"
                                    onClick={() => this._handleDelete(record)}
                                >
                                    删除
                                </span>
                            </Space>
                        )}
                    </div>
                );
            }
        }
    ];

    columns2 = [
        // {
        //     title: '产品名称',
        //     dataIndex: 'productName',
        //     width: 120,
        //     fixed: 'left',
        //     render: (val, record) => {
        //         return (
        //             <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
        //         );
        //     }
        // },
        {
            title: '净值日期',
            dataIndex: 'netDate',
            width: 120,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '单位净值',
            dataIndex: 'netValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '累计单位净值',
            dataIndex: 'acumulateNetValue',
            width: 130,
            sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '复权净值',
            dataIndex: 'adjustedNetValue',
            width: 120,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '资产净值',
            dataIndex: 'feeNetValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val &&  numberToThousand(val)  || '--'}</span>
        },
        {
            title: '资产份额',
            dataIndex: 'shareValue',
            width: 120,
            sorter: true,
            render: (val) => <span>{val &&  numberToThousand(val) || '--'}</span>
        },
        {
            title: '资产总值',
            dataIndex: 'totalValue',
            width: 120,
            sorter: true,
            render: (val) =><span>{val &&  numberToThousand(val)  || '--'}</span>
        },
        {
            title: '分红日',
            dataIndex: 'isDividendDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isDividendDay')}
                    />
                );
            }
        },
        {
            title: '计提日',
            dataIndex: 'isfetchdDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isfetchdDay')}
                    />
                );
            }
        },
        {
            title: '开放日',
            dataIndex: 'isOpenDay',
            width: 100,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isOpenDay')}
                    />
                );
            }
        },
        {
            title: '净值是否展示',
            dataIndex: 'isShowNetvalue',
            width: 110,
            render: (text, record) => {
                return (
                    <Checkbox
                        disabled={!this.props.authEdit}
                        checked={text === 1}
                        onChange={() => this._checkedChange(text, record, 'isShowNetvalue')}
                    />
                );
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {this.props.authEdit && (
                            <Space>
                                <span className="details" onClick={() => this._handleEdit(record)}>
                                    编辑{' '}
                                </span>
                                <span
                                    className="details"
                                    onClick={() => this._handleDelete(record)}
                                >
                                    删除
                                </span>
                            </Space>
                        )}
                    </div>
                );
            }
        }
    ];

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { enableStatistic } = this.state;
        const { productId } = this.props;
        if(!productId){
            this.columns.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 120,
                fixed: 'left',
                render: (val, record) => {
                    return (
                        <span className="details" onClick={() => this._handleEdit(record)}>
                            {val || '--'}
                        </span>
                    );
                }
            });
            this.columns2.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 120,
                fixed: 'left',
                render: (val, record) => {
                    return (
                        <span className="details" onClick={() => this._handleEdit(record)}>
                            {val || '--'}
                        </span>
                    );
                }
            });
        }
        // if (!productId) {
        //     if (enableStatistic === 0) {
        //         this.columns2.unshift({
        //             title: '产品名称',
        //             dataIndex: 'productName',
        //             width: 120,
        //             fixed: 'left',
        //             render: (val, record) => {
        //                 return (
        //                     <span className="details" onClick={() => this._handleEdit(record)}>
        //                         {val || '--'}
        //                     </span>
        //                 );
        //             }
        //         });
        //     } else {
        //         this.columns.unshift({
        //             title: '产品名称',
        //             dataIndex: 'productName',
        //             width: 120,
        //             fixed: 'left',
        //             render: (val, record) => {
        //                 return (
        //                     <span className="details" onClick={() => this._handleEdit(record)}>
        //                         {val || '--'}
        //                     </span>
        //                 );
        //             }
        //         });
        //     }
        // }
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { netDate, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.netDate =
            (netDate && new Date(`${moment(netDate).format().split('T')[0]}T00:00:00`).getTime()) ||
            undefined;
        this.setState(
            {
                searchParams: {
                    ...params,
                    ...tempObj
                },
                selectedRowKeys:[],
                pageData: {
                    // 当前的分页数据
                    ...this.state.pageData,
                    current: 1
                    // pageSize: 20
                }
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 列表查询
     */
    _search = () => {
        const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;
        const { dispatch, productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'netValue/getNetValueList',
            payload: {
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                enableStatistic,
                ...tempObj,
                ...searchParams
            }
        });
    };


    /**
     * @description: 查询查询产品系列列表
     */
    _queryProductTypeList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/getProductType',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productTypeList: res.data
                    });
                }
            }
        });
    }

    /**
     * @description: 净值编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            productNetvalueId: record.productNetvalueId,
            isModalVisible: true
        });
    };

    /**
     * @description: 删除产品
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该净值信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'netValue/deleteNetValue',
                    payload: {
                        productNetvalueIds: [record.productNetvalueId]
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.productNetvalueId;
                            });
                            _this.setState({
                                selectedRowKeys: selectArr
                            });
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
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState(
            {
                searchParams: {},
                frequencyValue: 1,
                selectedRowKeys:[]
            },
            () => {
                this._search();
            },
        );
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
     * @description: 新增净值
     */
    _onAdd = () => {
        const { productName, productId } = this.props;
        if (productId === '0') {
            openNotification('warning', '提醒', '请先创建产品');
        } else {
            // history.push({
            //     pathname: `/product/netValueData/netValueDetails/${0}`
            // });
            this.setState({
                isModalVisible: true,
                isAddOrEdit: 'add'
            });
        }
    };

    /**
     * @description: 关闭新增、编辑净值弹窗
     * @param {*}
     */
    _handleClose = () => {
        this.setState(
            {
                isModalVisible: false
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState(
            {
                sortFiled: s.field,
                sortType: !!s.order ? (s.order === 'ascend' ? 'asc' : 'desc') : undefined,
                pageData: {
                    current: p.current,
                    pageSize: p.pageSize
                }
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description:无风险利率change事件
     * @param {Object} e
     */
    _onRiskChange = (e) => {
        this.setState({
            noRiskRate: e.target.value
        });
    };
    /**
     * @description: 无风险利率保存提交
     */
    _onSave = () => {
        // console.log('state', this.state.noRiskRate);
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
        this.setState(
            {
                batchUploadModalFlag: false
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 勾选是否展示分红日、计提日、净值
     * @param {*} text 表格单元格的值
     * @param {*} record 表格一行的值
     * @param {*} checkedType 判断三个checkbox类型
     */
    _checkedChange = (text, record, checkedType) => {
        const { dispatch } = this.props;
        const tempObj = {};
        tempObj.productNetvalueId = record.productNetvalueId;
        tempObj.productId = record.productId;
        tempObj[checkedType] = text === 1 ? 0 : 1;
        dispatch({
            type: 'netValue/editNetValue',
            payload: {
                ...record,
                ...tempObj
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    openNotification('success', '提示', '设置成功', 'topRight');
                } else {
                    openNotification('warning', '提示', '设置失败', 'topRight');
                }
                this._search();
            }
        });
    };

    /**
     * @description: 批量导出净值信息
     */
    _export = () => {
        const { selectedRowKeys, enableStatistic } = this.state;
        const { productId } = this.props;
        let params = {
            productNetvalueIds: selectedRowKeys,
            productId: productId ? Number(productId) : undefined,
            enableStatistic
        };
        downloadFile('/net/export', params, {}, this.failTips);
        // window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/net/export?productNetvalueIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
    };


    // 导出全部
    _downloadAll = () => {
        const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;
        const { productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        fileExport({
            method: 'post',
            url: '/net/allExport',
            data: {
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                enableStatistic,
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
     * @description: 导出失败回调
     * @param {*}
     */
    failTips = () => {
        openNotification('warning', '提示', '导出失败', 'topRight');
    };

    /**
     * @description: 开启关闭 计算数据
     * @param {*} _handleCalc
     */
    _handleCalc = (type) => {
        let tips = type === 0 ? '开启' : '关闭';
        this.setState(
            {
                enableStatistic: type === 0 ? 1 : 0
            },
            () => {
                openNotification('success', '提示', `${tips}成功`, 'topRight');
                // this._setColums();
                this._search();
            },
        );
    };

    /**
     * @description: 批量删除
     * @param {*}
     */
    _batchDelete = () => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后选中的净值信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'netValue/deleteNetValue',
                    payload: {
                        productNetvalueIds: selectedRowKeys
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            _this.setState({
                                selectedRowKeys: []
                            });
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
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    };

    /**
     * @description: 频率change事件
     * @param {*} e 1：日频  2：周频  3：月频
     */
    _handleFrequency = (e) => {
        this.setState({
            frequencyValue: e
        });
    };

    _getManagedData = (val) => {
        this.setState({
            modelAndManagedData: val
        });
    };

    // 刷新开放日

    updateOpenDay = ()=>{
        const {dispatch, productId} = this.props;
        dispatch({
            type:'netValue/refreshProductOpenDay',
            payload:{
                productId
            },
            callback:(res)=>{
                if (res.code === 1008) {
                    openNotification('success', '提示', '刷新成功', 'topRight');
                    this._search();
                    this.setState({
                        selectedRowKeys: []
                    });
                } else {
                    const warningText = res.message || res.data || '刷新失败！';
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

    render() {
        const {
            pageData,
            selectedRowKeys,
            batchUploadModalFlag,
            isModalVisible,
            isAddOrEdit,
            productNetvalueId,
            enableStatistic,
            frequencyValue,
            modelAndManagedData,
            productTypeList
        } = this.state;
        const {
            loading,
            productId,
            netValue: { netValueList = [] }
        } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <Form
                        name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        initialValues={{
                            frequency: 1,
                            week: 5,
                            month: 31
                        }}
                    >
                        <Row gutter={[8, 0]}>
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
                            <Col span={6}>
                                <FormItem label="净值日期" name="netDate">
                                    <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                </FormItem>
                            </Col>
                            <Col span={7} style={{ display: 'flex' }}>
                                <FormItem
                                    label="频率选择"
                                    name="frequency"
                                    style={{
                                        width: '50%',
                                        marginRight: 5,
                                        display: 'flex',
                                        flexWrap: 'nowrap'
                                    }}
                                >
                                    <Select placeholder="请选择"  allowClear onChange={this._handleFrequency}>
                                        <Option key={getRandomKey(5)} value={1}>
                                            日频
                                        </Option>
                                        <Option key={getRandomKey(5)} value={2}>
                                            周频
                                        </Option>
                                        <Option key={getRandomKey(5)} value={3}>
                                            月频
                                        </Option>
                                    </Select>
                                </FormItem>
                                {frequencyValue === 2 && (
                                    <FormItem name="week" style={{ width: '50%' }}>
                                        <Select placeholder="请选择"  allowClear>
                                            {weekDay.map((item, index) => {
                                                return (
                                                    <Option key={index} value={index + 1}>
                                                        {item}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                )}
                                {frequencyValue === 3 && (
                                    <FormItem name="month" style={{ width: '50%' }}>
                                        <Select placeholder="请选择"  allowClear>
                                            {monthDay.map((item) => {
                                                return (
                                                    <Option
                                                        key={getRandomKey(5)}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                )}
                            </Col>
                            {
                                productId &&
                                <Col span={6}></Col>
                            }
                            <Col span={5} className={styles.queryBtn}>
                                <Space>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button onClick={this._reset}>重置</Button>
                                </Space>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            {(frequencyValue === 2 || frequencyValue === 3) && (
                                <Col span={6}>
                                    <FormItem label="其他净值日期" name="otherDay">
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '100%' }}
                                            mode="multiple"
                                            allowClear
                                        >
                                            <Option key={getRandomKey(5)} value={1}>
                                                分红日
                                            </Option>
                                            <Option key={getRandomKey(5)} value={2}>
                                                业绩计提日
                                            </Option>
                                            <Option key={getRandomKey(5)} value={3}>
                                                开放日
                                            </Option>
                                        </Select>
                                    </FormItem>
                                </Col>
                            )}
                            {
                                !productId &&
                                <Col span={6}>
                                    <FormItem
                                        label="产品系列"
                                        name="seriesType"
                                    >
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                !isEmpty(productTypeList) &&
                                                productTypeList.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.codeValue}>{item.codeText}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                        </Row>
                    </Form>
                </div>
                <div className={styles.filter}>
                    <div className={styles.btnGroup}>
                        <div>
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
                                <Button type="primary" onClick={this._batchUpload}>
                                    批量上传
                                </Button>
                            )}
                            {this.props.authExport && (
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
                                // <Button onClick={this._export} disabled={isEmpty(selectedRowKeys)}>
                                //     批量导出
                                // </Button>
                            )}
                            {this.props.authExport && (
                                <Button
                                    onClick={() => this._batchDelete()}
                                    disabled={isEmpty(selectedRowKeys)}
                                >
                                    批量删除
                                </Button>
                            )}
                            {
                                this.props.authEdit && (
                                    <DataMaintenance {...this.props} ids={selectedRowKeys} total={netValueList.total} />
                                )

                            }
                            {this.props.authExport && !productId && (
                                <Button onClick={(e) => this._getManagedData(true)} type="link">
                                    读取托管数据
                                </Button>
                            )}
                            {
                                productId && <Button type="primary" onClick={this.updateOpenDay}>刷新本产品开放日起算日期</Button>
                            }

                        </div>
                        <Button type="primary" onClick={() => this._handleCalc(enableStatistic)}>
                            {enableStatistic === 1 ? '关闭计算数据' : '开启计算数据'}
                        </Button>
                    </div>
                </div>
                <div className={styles.dataTable}>
                    <MXTable
                        loading={loading}
                        columns={enableStatistic === 1 ? this.columns : this.columns2}
                        dataSource={netValueList && netValueList.list}
                        total={netValueList && netValueList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.productNetvalueId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                    />
                </div>
                {batchUploadModalFlag && (
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        closeModal={this.closeModal}
                        templateMsg="净值模板下载"
                        templateUrl={`/net/import/template?tokenId=${getCookie('vipAdminToken')}`}
                        params={{ productId: productId ? Number(productId) : undefined }}
                        onOk={this.closeModal}
                        url="/net/import"
                    />
                )}
                {isModalVisible && (
                    <NetValueDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        productNetvalueId={productNetvalueId}
                        type={isAddOrEdit}
                        productId={productId}
                        authEdit={this.props.authEdit}
                        authExport={this.props.authExport}
                    />
                )}
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
                        updateTable={this._reset}
                        type="netValue"
                    />
                </Modal>
            </div>
        );
    }
}
export default NetValueList;
