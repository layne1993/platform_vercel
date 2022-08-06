/*
 * @description: 产品信息管理-证券类列表
 * @Author: tangsc
 * @Date: 2020-10-23 15:02:19
 */
import React, { PureComponent } from 'react';
import { history, connect } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    Input,
    DatePicker,
    Statistic,
    Space,
    Modal,
    Badge,
    notification,
    Dropdown,
    Menu,
    Tooltip,
    Alert
} from 'antd';
import {
    XWFundStatus,
    XWShelfStatus,
    XWPurchaseStatus,
    XWReservationStatus,
    XWFundStatusBadgeList,
    XWsignType
} from '@/utils/publicData';
import {
    DownOutlined,
    UpOutlined,
    PlusOutlined,
    ExclamationCircleOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { getRandomKey, getCookie, isNumber, fileExport, numberToThousand, getQueryString } from '@/utils/utils';
import { isEmpty } from 'lodash';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './ProductList.less';
import SortModal from './SortModal';
import NewProduct from './newProduct';

import SplitShare from './SplitShare';

const FormItem = Form.Item;
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 删除确认框
const { confirm } = Modal;

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const currency_chinese = {
    1: '人民币',
    2: '美元',
    3: '港币'
};



@connect(({ productList, loading }) => ({
    productList,
    loading: loading.effects['productList/getProductList']
}))
class ProductList extends PureComponent {
    state = {
        isShow: false, // 控制显示隐藏
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {}, // 查询参数
        sortFiled: '', // 排序字段
        sortType: '', // 排序类型：asc-升序；desc-降序
        managerList: [], // 产品经理
        projectManagerList: [], // 项目经理
        topStatistics: {}, // 顶部数据统计
        batchUploadModalFlag: false, // 控制批量上传modal显示隐藏
        enableStatistic: 1, // 是否启用统计数据：(0:否 1:是)
        companyList: [], // 托管公司列表
        isModalVisible: false,
        sortNum: 0,
        productFullName: '',
        productId: 0,
        productInfoList: {},
        productTypeList: [], // 产品系列列表
        productList: []
    };

    componentDidMount() {
        const rangeDate = getQueryString('rangeDate');
        if (rangeDate) {
            const currency = getQueryString('currency');
            let rangeDateArr = rangeDate.split('-');
            this.formRef.current.setFieldsValue({
                setDate: [moment(rangeDateArr[0] * 1), moment(rangeDateArr[1] * 1)],
                currency: currency_chinese[currency]
            });
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.setDateStart = moment(rangeDateArr[0] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.setDateEnd = moment(rangeDateArr[1] * 1);
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.searchParams.currency = currency_chinese[currency];
        }
        // 查询所有产品经理
        this._getManagerList();
        // 查询所有托管机构
        this._queryCompanyList();
        this._search();
        this._queryProductTypeList();
        this._queryByProductName();
        this.getStatistics()
    }

    getStatistics=()=>{
        const { enableStatistic } = this.state;
        const {dispatch} = this.props;
        if (enableStatistic === 1) {
            dispatch({
                type: 'productList/queryStatistics',
                payload: {
                    // pageNum: pageData.current || 1,
                    // pageSize: pageData.pageSize || 20,
                    enableStatistic
                    // ...tempObj,
                    // ...searchParams
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        this.setState({
                            topStatistics: res.data
                        });
                    }
                }
            });
        }
    }

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
    };

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '顺序',
            dataIndex: 'orderRule',
            fixed: 'left',
            width: 50,
            render: (val, record) => <a onClick={() => this.handleSort(record)}>{val || '--'}</a>
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            fixed: 'left',
            width: 100,
            render: (val, record) => (
                <span className="details" onClick={() => this._handleEdit(record)}>
                    {val || '--'}
                </span>
            )
        },
        {
            title: '备案编号',
            dataIndex: 'fundRecordNumber',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '投资经理',
            dataIndex: 'sales',
            width: 120,
            render: (val) => {
                let textList = [];
                !isEmpty(val) &&
                    val.forEach((item) => {
                        textList.push(item.saleUserName);
                    });
                return textList.join('，') || '--';
            }
        },
        {
            title: '项目经理',
            dataIndex: 'projectSales',
            width: 120,
            render: (val) => {
                let textList = [];
                !isEmpty(val) &&
                    val.forEach((item) => {
                        textList.push(item.saleUserName);
                    });
                return textList.join('，') || '--';
            }
        },
        {
            title: '托管机构',
            dataIndex: 'investment',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
            // render: (val) => {
            //     let obj = this.state.companyList.find((item) => {
            //         return item.trusteeshipCode === val;
            //     });
            //     return (obj && obj.trusteeshipName) || '--';
            // }
        },
        {
            title: '是否开放预约',
            dataIndex: 'appointmentStatus',
            width: 110,
            render: (val) => {
                let obj = XWReservationStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '是否开放认申赎',
            dataIndex: 'tradeTypes',
            width: 120,
            render: (val) => {
                if (!isEmpty(val)) {
                    let spanValue = [];
                    val.forEach((item) => {
                        if (item === 1) spanValue.push('可认申购');
                        if (item === 2) spanValue.push('可赎回');
                    });
                    return spanValue.join(',');
                } else {
                    return <span>--</span>;
                }
            }
        },
        // {
        //     title: '合同电子签',
        //     dataIndex: 'signType',
        //     width: 90,
        //     render: (val) => {
        //         let obj = XWsignType.find((item) => {
        //             return Number(item.value) === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
        {
            title: '上架状态',
            dataIndex: 'publishStatus',
            width: 80,
            render: (val) => {
                let obj = XWShelfStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '是否投顾类产品',
            dataIndex: 'isInvestmentProduct',
            width: 120,
            render: (val, record) => {
                if (isNumber(val)) {
                    let text = val === 1 ? '是' : '否';
                    return <span>{text}</span>;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '产品状态',
            dataIndex: 'productStatus',
            width: 80,
            render: (val, record) => {
                if (isNumber(val) && val > 0) {
                    let text = XWFundStatus[val - 1].label;
                    return <Badge status={XWFundStatusBadgeList[val - 1]} text={text} />;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '产品成立日',
            dataIndex: 'setDate',
            width: 120,
            sorter: true,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '投资者数量',
            dataIndex: 'customerNumber',
            width: 120,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '资产总份额',
            dataIndex: 'shareValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '资产总值',
            dataIndex: 'totalValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: (
                <Tooltip title="母份额产品，值 = 所有子份额基金投资者的份额余额累加 不是分层基金或是子份额基金，值 = 资产总份额">
                    母份额汇总
                    <QuestionCircleOutlined />
                </Tooltip>
            ),
            dataIndex: 'childrenShareTotal',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '募集账户银行账号',
            dataIndex: 'raiseAccount',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '托管账户',
            dataIndex: 'investmentAccount',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '最新净值日期',
            dataIndex: 'netDate',
            width: 150,
            // sorter: true,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '最新单位净值',
            dataIndex: 'netValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '最新累计净值',
            dataIndex: 'acumulateNetValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '累计涨跌幅',
            dataIndex: 'cumulativeChangeRate',
            width: 150,
            render: (val) => {
                if (isNumber(val)) {
                    return <span>{`${val}%`}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '销售方式',
            dataIndex: 'saleByProxy',
            width: 150,
            render: (val) => {
                if (val === '0') {
                    return <span>直销</span>;
                } else if (val === '1') {
                    return <span>代销</span>;
                } else if (val === '0,1') {
                    return <span>直销、代销</span>;
                }
                return <span>--</span>;
            }
        },
        {
            title: '操作',
            dataIndex: 'age',
            fixed: 'right',
            width: 150,
            render: (text, record) => {
                // eslint-disable-next-line no-undef
                const { authEdit } =
                    (sessionStorage.getItem('PERMISSION') &&
                        JSON.parse(sessionStorage.getItem('PERMISSION'))['30100']) ||
                    {};
                return (
                    authEdit && <Space size="middle">


                        <span className="details" onClick={() => this._handleEdit(record)}>
                                    编辑
                        </span>
                        <span className="details" onClick={() => this.handleSort(record)}>
                                    顺序调整
                        </span>
                        <span
                            className="details"
                            onClick={() => this._handleDelete(record)}
                        >
                                    删除
                        </span>
                    </Space>
                );
            }
        }
    ];

    columns2 = [
        {
            title: '顺序',
            dataIndex: 'orderRule',
            fixed: 'left',
            width: 50,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            fixed: 'left',
            width: 100,
            render: (val, record) => (
                <span className="details" onClick={() => this._handleEdit(record)}>
                    {val || '--'}
                </span>
            )
        },
        {
            title: '备案编号',
            dataIndex: 'fundRecordNumber',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '投资经理',
            dataIndex: 'sales',
            width: 120,
            render: (val) => {
                let textList = [];
                !isEmpty(val) &&
                    val.forEach((item) => {
                        textList.push(item.saleUserName);
                    });
                return textList.join('，') || '--';
            }
        },
        {
            title: '项目经理',
            dataIndex: 'projectSales',
            width: 120,
            render: (val) => {
                let textList = [];
                !isEmpty(val) &&
                    val.forEach((item) => {
                        textList.push(item.saleUserName);
                    });
                return textList.join('，') || '--';
            }
        },
        {
            title: '托管机构',
            dataIndex: 'investment',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
            // render: (val) => {
            //     let obj = this.state.companyList.find((item) => {
            //         return item.trusteeshipCode === val;
            //     });
            //     return (obj && obj.trusteeshipName) || '--';
            // }
        },
        {
            title: '是否开放预约',
            dataIndex: 'appointmentStatus',
            width: 110,
            render: (val) => {
                let obj = XWReservationStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '是否开放认申赎',
            dataIndex: 'tradeTypes',
            width: 120,
            render: (val) => {
                if (!isEmpty(val)) {
                    let spanValue = [];
                    val.forEach((item) => {
                        if (item === 1) spanValue.push('可认申购');
                        if (item === 2) spanValue.push('可赎回');
                    });
                    return spanValue.join(',');
                } else {
                    return <span>--</span>;
                }
            }
        },
        // {
        //     title: '合同电子签',
        //     dataIndex: 'signType',
        //     width: 90,
        //     render: (val) => {
        //         let obj = XWsignType.find((item) => {
        //             return Number(item.value) === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
        {
            title: '上架状态',
            dataIndex: 'publishStatus',
            width: 80,
            render: (val) => {
                let obj = XWShelfStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '产品状态',
            dataIndex: 'productStatus',
            width: 80,
            render: (val, record) => {
                if (isNumber(val) && val > 0) {
                    let text = XWFundStatus[val - 1].label;
                    return <Badge status={XWFundStatusBadgeList[val - 1]} text={text} />;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '是否投顾类产品',
            dataIndex: 'isInvestmentProduct',
            width: 120,
            render: (val, record) => {
                if (isNumber(val)) {
                    let text = val === 1 ? '是' : '否';
                    return <span>{text}</span>;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '产品成立日',
            dataIndex: 'setDate',
            width: 120,
            // sorter: true,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '最新净值日期',
            dataIndex: 'netDate',
            width: 150,
            // sorter: true,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '最新单位净值',
            dataIndex: 'netValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '最新累计净值',
            dataIndex: 'acumulateNetValue',
            width: 150,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '销售方式',
            dataIndex: 'saleByProxy',
            width: 150,
            render: (val) => {
                if (val === '0') {
                    return <span>直销</span>;
                } else if (val === '1') {
                    return <span>代销</span>;
                } else if (val === '0,1') {
                    return <span>直销、代销</span>;
                }
                return <span>--</span>;
            }
        },
        {
            title: '操作',
            dataIndex: 'age',
            // fixed: 'right',
            width: 150,
            render: (text, record) => {
                // eslint-disable-next-line no-undef
                const { authEdit } =
                    (sessionStorage.getItem('PERMISSION') &&
                        JSON.parse(sessionStorage.getItem('PERMISSION'))['30100']) ||
                    {};
                return (
                    <Space size="middle">
                        {authEdit && (
                            <div>
                                <span className="details" onClick={() => this._handleEdit(record)}>
                                    编辑{' '}
                                </span>
                                <span className="details" onClick={() => this.handleSort(record)}>
                                    顺序调整{' '}
                                </span>
                                <span
                                    className="details"
                                    onClick={() => this._handleDelete(record)}
                                >
                                    删除
                                </span>
                            </div>
                        )}
                    </Space>
                );
            }
        }
    ];

    /**
     * @description: 查询所有产品经理/项目经理
     */
    _getManagerList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/queryManager',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        managerList: res.data
                    });
                }
            }
        });
        dispatch({
            type: 'productDetails/getManagerUser',
            payload: {
                positionStatus: 4
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        projectManagerList: res.data.list
                    });
                }
            }
        });
    };

    /**
     * @description: 查询所有托管公司
     */
    _queryCompanyList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/queryCompanyList',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        companyList: res.data
                    });
                }
            }
        });
    };

    /**
     * @description: 查询所有托管公司
     */
    _queryByProductName = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productList/queryByProductName',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    });
                }
            }
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { setDate, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.setDateStart = setDate ? moment(setDate[0]).valueOf() : undefined;
        tempObj.setDateEnd = setDate ? moment(setDate[1]).valueOf() : undefined;
        this.setState(
            {
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
            },
            () => {
                this._search();
            },
        );
    };

    /**
     * @description: 列表查询
     * @param {number} isQueryStatistics 是否更改统计数值 第一次进入和重置时统计
     */
    _search = () => {
        const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;
        // console.log(searchParams)
        const { dispatch } = this.props;

        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'productList/getProductList',
            payload: {
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                enableStatistic,
                ...tempObj,
                ...searchParams,
                seriesTypes: searchParams.seriesTypes && [searchParams.seriesTypes]
            },
            callback: (res) => {
                // if(res.code === 1008){
                this.setState({
                    productInfoList: res
                });
                // }else{
                //     openNotification('warning', `提示（代码：${res.code}）`, res.message || '查询产品列表失败', 'topRight');
                // }
            }
        });
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
        this._queryProductTypeList();
        this.formRef.current.resetFields();
        this.setState(
            {
                searchParams: {},
                selectedRowKeys: []
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
     * @description: 新增客户（路由跳转）
     */
    _onAdd = () => {
        // `/manager/investor/investordetails/${0}`
        history.push({
            pathname: `/product/list/details/${0}`
        });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // console.log(p, s);
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
     * @description: 删除产品
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该产品和产品名下的所有文件、签约资料都会删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'productList/deleteProduct',
                    payload: {
                        productId: record.productId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.productId;
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
     * @description: 产品列表项编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        history.push({
            pathname: `/product/list/details/${record.productId}`
        });
    };

    handleSort = (record) => {
        const { isModalVisible } = this.state;
        if (isModalVisible) {
            this.setState(
                {
                    isModalVisible: false,
                    productFullName: '',
                    sortNum: 0,
                    productId: 0
                },
                () => {
                    this._search();
                },
            );
        } else {
            this.setState({
                isModalVisible: true,
                productFullName: record.productName,
                sortNum: record.sortNum,
                productId: record.productId
            });
        }
    };

    /**
     * @description: 批量导出产品信息
     */
    _export = () => {
        const { selectedRowKeys, enableStatistic } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/product/export?productIds=${selectedRowKeys.toString()}&enableStatistic=${enableStatistic}&tokenId=${getCookie('vipAdminToken')}`;
    }
    _exportMode = (mode) => {
        const { enableStatistic, selectedRowKeys } = this.state;
        fileExport({
            method: 'post',
            url: '/product/exportProductElements',
            data: {
                productIds: !mode ? selectedRowKeys : undefined,
                mode,
                enableStatistic
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
     * @description: 导出全部
     * @param {*}
     */
    _downloadAll = () => {
        const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;

        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        fileExport({
            method: 'post',
            url: '/product/allExport',
            data: {
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
    };
    /**
     * @description: 设置select搜索项
     * @param {String} inputValue
     * @param {Object} option
     */
    _filterPerson = (inputValue, option) => {
        return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
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
                this._search();
                this.getStatistics();
            },
        );
        if (type === 0) {
            this.setState({
                topStatistics: {}
            });
        }
    };

    // 字段值更新时回调
    productChange = (e, arr) => {
        if (Array.isArray(arr)) {
            // const sub = [];
            if (arr.length > 0) {
                this.formRef.current.setFieldsValue({
                    isShowSonProduct: 1
                });
            } else {
                this.formRef.current.setFieldsValue({
                    isShowSonProduct: 0
                });
            }
            // arr.map((item) => {
            //     if (item.parentProductId) {
            //         sub.push(item.parentProductId);
            //     }
            // });
            // if (sub.length > 0) {
            //     this.formRef.current.setFieldsValue({
            //         isShowSonProduct:  1
            //     });
            // } else {
            //     this.formRef.current.setFieldsValue({
            //         isShowSonProduct:  0
            //     });
            // }

        }
    }

    render() {
        const {
            isShow,
            pageData,
            selectedRowKeys,
            managerList,
            projectManagerList,
            topStatistics,
            batchUploadModalFlag,
            enableStatistic,
            companyList,
            isModalVisible,
            sortNum,
            productFullName,
            productId,
            productInfoList,
            productTypeList,
            productList
        } = this.state;
        const { loading } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        // eslint-disable-next-line no-undef
        const { authEdit, authExport } =
            (sessionStorage.getItem('PERMISSION') &&
                JSON.parse(sessionStorage.getItem('PERMISSION'))['30100']) ||
            {};
        // console.log(productInfoList);
        return (
            <div className={styles.container}>
                {enableStatistic === 1 && (
                    <div className={styles.header}>
                        <Row>
                            <Col span={8}>
                                <Statistic
                                    title="投资者数量"
                                    value={topStatistics.customerStatistic || '--'}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="资产总份额"
                                    value={topStatistics.shareValueStatistic || '--'}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="资产总值"
                                    value={topStatistics.totalValueStatistic || '--'}
                                />
                            </Col>
                        </Row>
                    </div>
                )}
                <div className={styles.filter}>
                    <Form name="basic"
                        onFinish={this._onFinish}
                        ref={this.formRef}
                        initialValues={{
                            // isShowSonProduct: 0
                        }}
                        onValuesChange={this.onValuesChange}
                    >
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem
                                    label="产品名称"
                                    name="productIds"
                                >
                                    <Select
                                        placeholder="请选择"
                                        showSearch
                                        filterOption={(input, option) =>
                                            option.children && option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        notFoundContent="暂无数据"
                                        mode="multiple"
                                        allowClear
                                        onChange={this.productChange}
                                    >
                                        {
                                            Array.isArray(productList) &&
                                            productList.map((item, i) => {
                                                return (
                                                    <Select.Option parentProductId={item.parentProductId} label={item.productName} key={i} value={item.productId}>{item.productName}</Select.Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="产品状态" name="productStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {XWFundStatus.map((item) => (
                                            <Option key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="备案编号" name="fundRecordNumber">
                                    <Input placeholder="请输入" autoComplete="off" />
                                </FormItem>
                            </Col>
                            <Col span={6} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                                <span className={styles.showMore} onClick={this._handleShowMore}>
                                    {isShow ? '隐藏' : '展开'}
                                    {isShow ? <UpOutlined /> : <DownOutlined />}
                                </span>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]} style={{ display: isShow ? '' : 'none' }}>
                            <Col span={6}>
                                <FormItem label="产品成立日期" name="setDate">
                                    <DatePicker.RangePicker placeholder="请选择" format={dateFormat} style={{ width: '100%' }} />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="是否开放预约" name="appointmentStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {XWReservationStatus.map((item) => (
                                            <Option key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="是否开放认申赎" name="tradeTypes">
                                    <Select
                                        placeholder="请选择"
                                        showSearch
                                        defaultActiveFirstOption={false}
                                        allowClear
                                        filterOption={this._filterPerson}
                                        notFoundContent={null}
                                        mode="multiple"
                                    >
                                        {!isEmpty(XWPurchaseStatus) &&
                                            XWPurchaseStatus.map((item) => (
                                                <Option key={getRandomKey(6)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]} style={{ display: isShow ? '' : 'none' }}>
                            <Col span={6}>
                                <FormItem label="上架状态" name="publishStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {XWShelfStatus.map((item) => (
                                            <Option key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="投资经理" name="saleUserIds">
                                    <Select
                                        placeholder="请选择"
                                        showSearch
                                        defaultActiveFirstOption={false}
                                        allowClear
                                        filterOption={this._filterPerson}
                                        notFoundContent={null}
                                        mode="multiple"
                                    >
                                        {!isEmpty(managerList) &&
                                            managerList.map((item) => (
                                                <Option
                                                    key={item.managerUserId}
                                                    value={item.managerUserId}
                                                >
                                                    {item.userName}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="项目经理" name="projectSaleUserIds">
                                    <Select
                                        placeholder="请选择"
                                        showSearch
                                        defaultActiveFirstOption={false}
                                        allowClear
                                        filterOption={this._filterPerson}
                                        notFoundContent={null}
                                        mode="multiple"
                                    >
                                        {!isEmpty(projectManagerList) &&
                                            projectManagerList.map((item) => (
                                                <Option
                                                    key={item.managerUserId}
                                                    value={item.managerUserId}
                                                >
                                                    {item.userName}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]} style={{ display: isShow ? '' : 'none' }}>
                            {/* <Col span={6}> */}
                            {/* <FormItem label="合同电子签" name="signType">
                                    <Select placeholder="请选择" allowClear>
                                        {XWsignType.map((item) => (
                                            <Option key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem> */}
                            {/* </Col> */}
                            <Col span={6}>
                                <FormItem label="托管机构" name="investment">
                                    <Select
                                        placeholder="请选择"
                                        showSearch
                                        defaultActiveFirstOption={false}
                                        // showArrow={false}
                                        filterOption={this._filterPerson}
                                        notFoundContent={null}
                                        allowClear
                                    >
                                        {!isEmpty(companyList) &&
                                            companyList.map((item) => (
                                                <Option
                                                    key={item.trusteeshipCode}
                                                    value={item.trusteeshipCode}
                                                >
                                                    {item.trusteeshipName}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6} className={styles.isInvestmentProductCol}>
                                <FormItem label="是否投顾类产品" name="isInvestmentProduct">
                                    <Select placeholder="请选择" allowClear>
                                        <Option key={getRandomKey(3)} value={0}>
                                            否
                                        </Option>
                                        <Option key={getRandomKey(3)} value={1}>
                                            是
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="产品系列" name="seriesTypes">
                                    <Select placeholder="请选择" allowClear>
                                        {!isEmpty(productTypeList) &&
                                            productTypeList.map((item) => {
                                                return (
                                                    <Option
                                                        key={getRandomKey(5)}
                                                        value={item.codeValue}
                                                    >
                                                        {item.codeText}
                                                    </Option>
                                                );
                                            })}
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>

                            <Col span={6}>
                                <FormItem label="销售方式" name="saleByProxy">
                                    <Select placeholder="请选择" allowClear>
                                        <Option
                                            key={getRandomKey(3)}
                                            value={'0'}
                                        >
                                            直销
                                        </Option>
                                        <Option
                                            key={getRandomKey(3)}
                                            value={'1'}
                                        >
                                            代销
                                        </Option>
                                        <Option
                                            key={getRandomKey(3)}
                                            value={'0,1'}
                                        >
                                            直销、代销
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="币种" name="currency">
                                    <Select placeholder="请选择" allowClear>
                                        <Option value="人民币">
                                            人民币
                                        </Option>
                                        <Option value="美元">
                                            美元
                                        </Option>
                                        <Option value="港币">
                                            港币
                                        </Option>
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6} className={styles.isInvestmentProductCol}>
                                <FormItem label="单独展示子份额基金" name="isShowSonProduct">
                                    <Select placeholder="请选择" allowClear >
                                        <Option key={getRandomKey(3)} value={0}>否</Option>
                                        <Option key={getRandomKey(3)} value={1}>是</Option>
                                    </Select>
                                </FormItem>
                            </Col>
                        </Row>
                        {/* <Row gutter={[8, 0]}>

                        </Row> */}
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        <div>
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
                            {
                                authExport &&
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
                                        &nbsp;&nbsp;产品要素导出
                                        <DownOutlined />
                                    </Button>
                                </Dropdown>
                            }
                            {authEdit && <SplitShare/>}
                            <NewProduct />
                        </div>

                        {/* <div onClick={() => this._handleCalc(enableStatistic)} className={styles.calcWrapper}>
                            <Tooltip placement="top" title={enableStatistic === 1 ? '关闭计算数据' : '开启计算数据'}>
                                {enableStatistic === 0 ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                            </Tooltip>
                        </div> */}
                        <Button type="primary" onClick={() => this._handleCalc(enableStatistic)}>
                            {enableStatistic === 1 ? '关闭计算数据' : '开启计算数据'}
                        </Button>
                    </div>
                    <MXTable
                        loading={loading}
                        columns={enableStatistic === 1 ? this.columns : this.columns2}
                        dataSource={productInfoList && productInfoList.list}
                        total={productInfoList && productInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.productId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    />
                    {batchUploadModalFlag && (
                        <BatchUpload
                            modalFlag={batchUploadModalFlag}
                            closeModal={this.closeModal}
                            templateMsg="产品信息模板下载"
                            templateUrl={`/product/import/template?tokenId=${getCookie(
                                'vipAdminToken',
                            )}`}
                            // params={}
                            onOk={this.closeModal}
                            url="/product/import"
                        />
                    )}
                    {isModalVisible && (
                        <SortModal
                            isModalVisible={isModalVisible}
                            closeModal={this.handleSort}
                            sortNum={sortNum}
                            productFullName={productFullName}
                            productId={productId}
                        />
                    )}
                </div>
            </div>
        );
    }
}
export default ProductList;
