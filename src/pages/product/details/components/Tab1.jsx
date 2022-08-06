/*
 * @description: 基本要素
 * @Author: tangsc
 * @Date: 2020-10-23 15:47:22
 */
import React, { PureComponent, Fragment } from 'react';
import {
    Row,
    Col,
    Form,
    Card,
    Input,
    Select,
    Button,
    DatePicker,
    Modal,
    Radio,
    Space,
    Tooltip,
    Transfer,
    InputNumber,
    notification,
    Affix
} from 'antd';
import {
    InfoCircleOutlined,
    UpOutlined,
    DownOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { formItemLayout, formItemLayoutSec } from '../public/common';
import { FormattedMessage, connect, history } from 'umi';
import styles from './styles/Tab1.less';
import { cloneDeep, isEmpty, debounce } from 'lodash';
import { getRandomKey, getCookie } from '@/utils/utils';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import moment from 'moment';
import {
    XWFundRiskLevel,
    XWReservationStatus,
    XWPurchaseStatus,
    XWShelfStatus,
    XWIsFundTop,
    XWFundStatus,
    XWProductStrategy,
    productMixInfo,
    productNatureList,
    ShareType,
    ShareCategory,
    ArchitectureCategory,
    RecordStatus,
    BusinessModel,
    PropertyHolder,
    WithdrawalPoint,
    FundsType,
    OperationType
} from '@/utils/publicData';

// 定义表单Item
const FormItem = Form.Item;
const FormList = Form.List;
const { TextArea } = Input;
const { confirm } = Modal;

// 获取Select组件option选项
const { Option } = Select;

// 获取日期组件
const { RangePicker } = DatePicker;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';
const reg = /^(\.*)(\d+)(\.?)(\d{0,4}).*$/g;

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ productDetails, loading }) => ({
    loading: loading.effects['productDetails/createProduct'],
    editLoading: loading.effects['productDetails/editProduct']
}))
class Tab1 extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currencyValue: 0, // 0：母产品 1：子产品
            productId: 0, // 产品id
            managerList: [], // 产品经理
            projectManagerList: [], // 项目经理
            operationManagerList: [], // 运营经理
            salesManagerList: [], // 客户经理
            salesInfoList: [], // 编辑时保存已选择的产品经理数据
            companyList: [], // 托管公司列表
            outsourcingList: [],
            productTypeList: [], // 产品系列列表
            fundAuthority: [
                // 产品要素权限
                { value: 1, label: '风险匹配客户' },
                { value: 2, label: '合格投资者' },
                { value: 3, label: '持有人' },
                { value: 4, label: '所有人' }
            ],
            netAuthority: [
                { value: 1, label: '风险匹配客户' },
                { value: 2, label: '合格投资者' },
                { value: 3, label: '持有人' },
                { value: 4, label: '所有人' }
            ], // 净值权限
            isShowShuttleBox: false, // 控制穿梭框显示隐藏
            targetKeys: [], // 目标框数组
            selectedKeys: [], // 穿梭框选中项
            fundsList: [], // 母产品列表
            existedOpenDay: 0, // 是否已存在开放日 0：否 1：是
            dataSource: [], // Transfer穿梭框数据源
            productShowSetting: {}, // 客户端字段是否展示配置
            transferModalLoading: false, // 穿梭框弹窗确定按钮loading
            showOrhide: {
                // 控制各个模块显示隐藏
                iscomplianceConfig: true,
                isstatusConfig: true,
                isbasicInfo: true,
                israiseInfo: true,
                isscopeInfo: true,
                isfeeInfo: true,
                isopenDayInfo: true,
                isriskManage: true,
                isinvestmentInfo: true,
                isvaluationInfo: true,
                isLifeCycleInfo: true
            },
            productDeadlineType: 1, // 产品期限: 1-无固定存续期限, 2-有期限
            isRaiseAmountType: 0, // 是否有最低募集金额:(0-无,1-有)

            productInvestmentStrategy: [], //产品投资策略
            saveTimeObj: {
                productTime: null,
                publishStartTime: null,
                publishEndTime: null,
                marketStartTime: null,
                marketEndTime: null
            }
        };
        this.debounce_nameChange = debounce((e) => this._queryProdcutInfo('name', e), 1000);
        this.debounce_codeChange = debounce((e) => this._queryProdcutInfo('code', e), 1000);
    }

    componentDidMount() {
        const { netAuthority } = this.state;
        const { params } = this.props;
        const { productId } = params;

        // 查询所有产品经理
        this._getManagerList();
        // 查询所有托管机构
        this._queryCompanyList();
        this._queryOutsourcingList();
        // 查询产品系列列表
        this._queryProductTypeList();
        // 查询所有母产品
        this._queryFundsList();
        // 查询产品投资策略列表
        this._queryproductInvestmentStrategy();

        if (productId !== '0') {
            this._editSearch(productId);
            this.setState({
                productId
            });
        } else {
            // 查询默认的客户端显示设置
            this._getProductShowSetting();

            let arr = netAuthority.filter((item) => {
                return item.value !== 4;
            });
            this.setState({
                netAuthority: arr
            });
        }
    }

    // 查询产品投资策略列表

    _queryproductInvestmentStrategy = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/productInvestmentStrategy',
            payload: {
                type: 'productInvestmentStrategy'
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productInvestmentStrategy: res.data
                    });
                }
            }
        });
    };

    // 获取表单实例对象
    formRef = React.createRef();

    /**
     * @description: 选项在两栏之间转移时的回调函数
     * @param {Array} nextTargetKeys 目标数组
     * @param {String} direction 移动方向
     * @param {Array} moveKeys 移动的数组
     */
    _onfieldsChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({
            targetKeys: nextTargetKeys
        });
    };

    /**
     * @description: 选中项发生改变时的回调函数
     * @param {Array} sourceSelectedKeys 左边框选中的key数组
     * @param {Array} targetSelectedKeys 目标框选中的key数组
     */
    _onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({
            selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys]
        });
    };

    /**
     * @description: 查询所有产品经理/项目经理/运营经理/客户经理
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
        // 项目
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
        // 运营
        dispatch({
            type: 'productDetails/getManagerUser',
            payload: {
                positionStatus: 3
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        operationManagerList: res.data.list
                    });
                }
            }
        });
        // 客户
        dispatch({
            type: 'productDetails/getManagerUser',
            payload: {
                positionStatus: 1
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        salesManagerList: res.data.list
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

    _queryOutsourcingList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/queryOutsourcingList',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        outsourcingList: res.data
                    });
                }
            }
        });
    };

    /**
     * @description: 查询母产品列表
     * @param {*}
     */
    _queryFundsList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/getProductList',
            payload: {
                fundLevel: 0,
                pageNum: 0,
                pageSize: 0
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        fundsList: res.data.list
                    });
                }
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
    };

    /**
     * @description: 查询默认的客户端显示列表
     */
    _getProductShowSetting = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/getProductShowSetting',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    let tempArr = [...res.data.enableFields, ...res.data.disableFields];
                    let dataSource = [];
                    tempArr.forEach((item) => {
                        dataSource.push({
                            key: item.fieldCode,
                            fieldName: item.fieldName,
                            required: item.required,
                            enableShow: item.enableShow,
                            disabled: item.required === 1
                        });
                    });
                    this.setState({
                        productShowSetting: res.data,
                        dataSource: dataSource,
                        targetKeys: dataSource
                            .filter((item) => item.enableShow === 1)
                            .map((item) => item.key)
                        // selectedKeys: dataSource.filter((item) => item.enableShow === 0).map((item) => item.key)
                    });
                }
            }
        });
    };

    // 根据产品名称或者产品编号获取基金信息
    getAMACFundInfo = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/getAMACFundInfo',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.formRef.current({});
                }
            }
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        // console.log(values);
        const { productShowSetting } = this.state;
        const { dispatch, params, saveCallback } = this.props;
        const { productId } = params;
        const {
            marketStartDate,
            referenceDate,
            setDate,
            publishStartDate,
            productOperationDate,
            ...addEditParams
        } = values;
        let tempObj = {};
        // let salesList = [];

        // console.log(publishStartDate,marketStartDate)
        // return;

        // 转换成时间戳
        tempObj.setDate =
            (setDate && new Date(`${moment(setDate).format().split('T')[0]}T00:00:00`).getTime()) ||
            undefined;
        tempObj.productOperationDate =
            (productOperationDate &&
                new Date(
                    `${moment(productOperationDate).format().split('T')[0]}T00:00:00`,
                ).getTime()) ||
            undefined;
        tempObj.referenceDate =
            (referenceDate &&
                new Date(`${moment(referenceDate).format().split('T')[0]}T00:00:00`).getTime()) ||
            undefined;

        tempObj.publishStartDate =
            (publishStartDate && publishStartDate[0] && moment(publishStartDate[0]).valueOf()) ||
            undefined;

        tempObj.publishendDate =
            (publishStartDate && publishStartDate[1] && moment(publishStartDate[1]).valueOf()) ||
            undefined;

        tempObj.marketStartDate =
            (marketStartDate && marketStartDate[0] && moment(marketStartDate[0]).valueOf()) ||
            undefined;
        tempObj.marketendDate =
            (marketStartDate && marketStartDate[1] && moment(marketStartDate[1]).valueOf()) ||
            undefined;

        // 客户端字段展示设置
        tempObj.productShowSetting = productShowSetting;

        // !isEmpty(saleUserId) && saleUserId.forEach((item) => {
        //     salesList.push({
        //         saleUserId: item
        //     });
        // });
        // tempObj.sales = saleUserId;

        // tempObj.marketendDate = (marketStartDate && moment(marketStartDate[1]).format()) || undefined;   标准时间格式
        if (productId === '0') {
            dispatch({
                type: 'productDetails/createProduct',
                payload: {
                    ...addEditParams,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '新增成功', 'topRight');
                        // 保存新的productId 然后查询
                        history.push({
                            pathname: `/product/list/details/${res.data}`
                        });
                        saveCallback();
                        this.setState({
                            productId: res.data
                        });
                        this._editSearch(res.data);
                    } else {
                        const warningText = res.message || res.data || '新增失败！';
                        openNotification(
                            'warning',
                            `提示(代码：${res.code})`,
                            warningText,
                            'topRight',
                        );
                    }
                }
            });
        } else {
            dispatch({
                type: 'productDetails/editProduct',
                payload: {
                    productId,
                    ...addEditParams,
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '编辑成功', 'topRight');
                        // 保存新的productId 然后查询
                        history.push({
                            pathname: `/product/list/details/${res.data}`
                        });
                        saveCallback();
                        this.setState({
                            productId: res.data
                        });
                        this._editSearch(res.data);
                    } else {
                        const warningText = res.message || res.data || '编辑失败！';
                        openNotification(
                            'warning',
                            `提示(代码：${res.code})`,
                            warningText,
                            'topRight',
                        );
                    }
                }
            });
        }
        // 点击保存时需将label数据传递给后台
        // console.log('labelNameList', this.state.labelNameList);
    };

    /**e
     * @description: Radio单选框change事件
     * @param {Object} e 0：母产品 1：子产品
     */
    _handleChange = (e) => {
        this.setState({
            currencyValue: e
        });
        if (e === 0) {
            this.formRef.current.setFieldsValue({
                parentProductId: null
            });
        }
    };

    /**
     * @description: 产品期限change事件
     * @param {Object} e 产品期限: (1-无固定存续期限,2-有期限)
     */
    _handleChange1 = (e) => {
        this.setState({
            productDeadlineType: e
        });
    };

    /**
     * @description: 是否有最低募集金额change事件
     * @param {Object} e 是否有最低募集金额:(0-无,1-有)
     */
    _handleChange2 = (e) => {
        this.setState({
            isRaiseAmountType: e
        });
    };
    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productDetails/getProductDetails',
            payload: {
                productId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        const {
                            marketStartDate,
                            marketendDate,
                            referenceDate,
                            setDate,
                            publishStartDate,
                            publishendDate,
                            existedOpenDay,
                            productShowSetting,
                            dateemandSubmissionDate,
                            elementFinalizedDate,
                            contractProcessStartDate,
                            contractFirstDraftDate,
                            managerFinalizeDate,
                            salesOrganizationFinalizeDate,
                            trusteeAgencyFinalizeDate,
                            salesParametersSetDate,
                            recordRegisterDate,
                            liquidation,
                            productExpireDate,
                            productOperationDate,
                            outsourcingAgency,
                            ...tempObj
                        } = data;

                        let tempArr = [
                            ...productShowSetting.enableFields,
                            ...productShowSetting.disableFields
                        ];
                        let dataSource = [];
                        tempArr.forEach((item) => {
                            dataSource.push({
                                key: item.fieldCode,
                                fieldName: item.fieldName,
                                required: item.required,
                                enableShow: item.enableShow,
                                disabled: item.required === 1
                            });
                        });

                        let dateObj = {};
                        dateObj.publishStartTime = publishStartDate;
                        dateObj.publishEndTime = publishendDate;
                        dateObj.marketStartTime = marketStartDate;
                        dateObj.marketEndTime = marketendDate;
                        dateObj.productTime = setDate;

                        this.setState({
                            existedOpenDay,
                            currencyValue: data.fundLevel,
                            productDeadlineType: data.productDeadline,
                            isRaiseAmountType: data.isRaiseAmount,
                            productShowSetting,
                            saveTimeObj: dateObj,
                            dataSource: dataSource,
                            targetKeys: dataSource
                                .filter((item) => item.enableShow === 1)
                                .map((item) => item.key)
                        });
                        // let saleList = [];
                        // !isEmpty(sales) && sales.forEach((item) => {
                        //     saleList.push(item.saleUserId);
                        // });
                        if (this.formRef.current) {
                            this._onChange(data.productAuthority);
                            this.formRef.current.setFieldsValue({
                                setDate: setDate ? moment(setDate) : null,
                                productOperationDate: productOperationDate
                                    ? moment(productOperationDate)
                                    : null,
                                referenceDate: referenceDate ? moment(referenceDate) : null,
                                outsourcingAgency: outsourcingAgency
                                    ? Number(outsourcingAgency)
                                    : null,
                                dateemandSubmissionDate: dateemandSubmissionDate
                                    ? moment(dateemandSubmissionDate)
                                    : null,
                                elementFinalizedDate: elementFinalizedDate
                                    ? moment(elementFinalizedDate)
                                    : null,
                                contractProcessStartDate: contractProcessStartDate
                                    ? moment(contractProcessStartDate)
                                    : null,
                                contractFirstDraftDate: contractFirstDraftDate
                                    ? moment(contractFirstDraftDate)
                                    : null,
                                managerFinalizeDate: managerFinalizeDate
                                    ? moment(managerFinalizeDate)
                                    : null,
                                salesOrganizationFinalizeDate: salesOrganizationFinalizeDate
                                    ? moment(salesOrganizationFinalizeDate)
                                    : null,
                                trusteeAgencyFinalizeDate: trusteeAgencyFinalizeDate
                                    ? moment(trusteeAgencyFinalizeDate)
                                    : null,
                                salesParametersSetDate: salesParametersSetDate
                                    ? moment(salesParametersSetDate)
                                    : null,
                                recordRegisterDate: recordRegisterDate
                                    ? moment(recordRegisterDate)
                                    : null,
                                liquidation: liquidation ? moment(liquidation) : null,
                                productExpireDate: productExpireDate
                                    ? moment(productExpireDate)
                                    : null,
                                marketStartDate:
                                    marketStartDate && marketendDate
                                        ? [moment(marketStartDate), moment(marketendDate)]
                                        : [null, null],
                                publishStartDate:
                                    publishStartDate && publishendDate
                                        ? [moment(publishStartDate), moment(publishendDate)]
                                        : [null, null],
                                ...tempObj,
                                showStatus: data.showStatus === 0 ? 0 : 1
                            });
                        }
                    }
                }
            }
        });
    };

    /**
     * @description: 取消按钮返回上一路由
     */
    _handleGoBack = () => {
        history.push({
            pathname: '/product/list'
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
     * @description: 配置要素权限和净值权限的对应关系
     * @param {*}
     */
    _onChange = (arr) => {
        // { value: 1, label: '风险匹配客户' },
        // { value: 2, label: '合格投资者' },
        // { value: 3, label: '持有人' },
        // { value: 4, label: '所有人' }
        // console.log('arr', arr);
        const { fundAuthority } = this.state;
        let tempArr = [];
        let netSelectArr = this.formRef.current.getFieldValue('netValueAuthority');
        let selectTempArr = cloneDeep(netSelectArr);

        if (arr.includes(4)) {
            tempArr = cloneDeep(fundAuthority);
        } else if (arr.includes(1)) {
            tempArr = fundAuthority.filter((item) => {
                return item.value !== 4;
            });
            selectTempArr = netSelectArr.filter((item) => {
                return item !== 4;
            });
        } else if (arr.includes(2)) {
            tempArr = fundAuthority.filter((item) => {
                return item.value === 3 || item.value === 2;
            });
            selectTempArr = netSelectArr.filter((item) => {
                return item === 3 || item === 2;
            });
        } else if (arr.includes(3)) {
            tempArr = fundAuthority.filter((item) => {
                return item.value === 3;
            });
            selectTempArr = netSelectArr.filter((item) => {
                return item === 3;
            });
        } else if (isEmpty(arr)) {
            tempArr = [];
            selectTempArr = [];
        }
        this.setState({
            netAuthority: tempArr
        });
        this.formRef.current.setFieldsValue({
            netValueAuthority: selectTempArr
        });
    };

    /**
     * @description: 打开穿梭框modal
     * @param {*}
     */
    _onShowModal = () => {
        this.setState({
            isShowShuttleBox: true
        });
    };
    /**
     * @description: 关闭穿梭框modal
     * @param {*}
     */
    _onCancel = () => {
        this.setState({
            isShowShuttleBox: false
        });
    };

    /**
     * @description: 穿梭框字段配置onok事件
     * @param {*}
     */
    _handelOk = () => {
        const { targetKeys, dataSource } = this.state;
        let tempTargetArr = [];
        let tempArr = [];
        let tempObj = {};

        // 按钮loading
        this.setState({
            transferModalLoading: true
        });

        dataSource.forEach((item) => {
            if (targetKeys.includes(item.key)) {
                // 已展示字段
                tempTargetArr.push({
                    enableShow: 1,
                    required: item.required,
                    fieldCode: item.key,
                    fieldName: item.fieldName
                });
            } else {
                // 未展示字段
                tempArr.push({
                    enableShow: 0,
                    required: item.required,
                    fieldCode: item.key,
                    fieldName: item.fieldName
                });
            }
        });

        tempObj.enableFields = tempTargetArr;
        tempObj.disableFields = tempArr;
        tempObj.enable = 1;

        this.setState(
            {
                productShowSetting: tempObj,
                transferModalLoading: false
            },
            () => {
                openNotification(
                    'warning',
                    '提示',
                    '点击产品要素最下方的保存按钮后，投资者端字段展示配置才生效！',
                    'topRight',
                );
                this._onCancel();
            },
        );
    };

    /**
     * @description: 设置开放日规则 -> 跳转至产品开放日tab
     * @param {*}
     */
    _setOpenDayRules = () => {
        const { onTabChange } = this.props;
        onTabChange('tab12');
    };

    _showOrClose = (type) => {
        const { showOrhide } = this.state;
        let tempObj = cloneDeep(showOrhide);
        switch (type) {
            case 'complianceConfig':
                tempObj.iscomplianceConfig = !tempObj.iscomplianceConfig;
                break;
            case 'statusConfig':
                tempObj.isstatusConfig = !tempObj.isstatusConfig;
                break;
            case 'basicInfo':
                tempObj.isbasicInfo = !tempObj.isbasicInfo;
                break;
            case 'raiseInfo':
                tempObj.israiseInfo = !tempObj.israiseInfo;
                break;
            case 'scopeInfo':
                tempObj.isscopeInfo = !tempObj.isscopeInfo;
                break;
            case 'feeInfo':
                tempObj.isfeeInfo = !tempObj.isfeeInfo;
                break;
            case 'openDayInfo':
                tempObj.isopenDayInfo = !tempObj.isopenDayInfo;
                break;
            case 'riskManage':
                tempObj.isriskManage = !tempObj.isriskManage;
                break;
            case 'investmentInfo':
                tempObj.isinvestmentInfo = !tempObj.isinvestmentInfo;
                break;
            case 'valuationInfo':
                tempObj.isvaluationInfo = !tempObj.isvaluationInfo;
                break;
            case 'lifeCycleInfo':
                tempObj.isLifeCycleInfo = !tempObj.isLifeCycleInfo;
                break;
            default:
                break;
        }
        this.setState({
            showOrhide: tempObj
        });
    };

    // 根据名称获取code
    getTrusteeCode = (name) => {
        const { companyList } = this.state;
        let code = null;
        companyList.map((item) => {
            if (name === item.trusteeshipName) {
                code = item.code;
            }
        });

        return code;
    };

    _queryProdcutInfo = (type, values) => {
        if (!values) return;
        const { dispatch } = this.props;
        const fields = this.formRef.current.getFieldsValue();
        const { productName } = fields;

        const tempObj = {};

        if (type === 'name') {
            tempObj.productName = values;
        } else {
            tempObj.fundNo = values;
        }
        dispatch({
            type: 'productDetails/getAMACFundInfo',
            payload: {
                ...tempObj
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    if (data) {
                        if (type === 'name') {
                            this.formRef.current.setFieldsValue({
                                ...data,
                                recordRegisterDate: moment(data.recordRegisterDate),
                                setDate: moment(data.setDate),
                                fundRecordNumber: data.fundRecordNumber,
                                productFullName: data.productName,
                                investment: this.getTrusteeCode(data.trusteeshipName)
                            });
                        } else {
                            this.formRef.current.setFieldsValue({
                                ...data,
                                recordRegisterDate: moment(data.recordRegisterDate),
                                setDate: moment(data.setDate),
                                productFullName: data.productName,
                                investment: this.getTrusteeCode(data.trusteeshipName)
                            });
                        }
                    } else {
                        openNotification(
                            'info',
                            // `提示(代码：${code})`,
                            '',
                            '您输入的产品全称或编号无法查询到基金信息，请注意！',
                            'topRight',
                        );
                    }
                } else {
                    const warningText = message || data || '查询失败！';
                    openNotification('warning', `提示(代码：${code})`, warningText, 'topRight');
                }
            }
        });
    };

    disabledDate1 = (current) => {
        const { saveTimeObj } = this.state;
        // console.log('saveTimeObj', saveTimeObj);
        if (saveTimeObj.productTime && saveTimeObj.marketEndTime) {
            // console.log('------------------------');
            return (
                current &&
                !(
                    current <= moment(saveTimeObj.productTime).endOf('day') &&
                    current >= moment(saveTimeObj.marketEndTime).startOf('day')
                )
            );
        } else if (saveTimeObj.marketEndTime) {
            return current && current <= moment(saveTimeObj.marketEndTime).startOf('day');
        } else if (saveTimeObj.productTime) {
            return current && current >= moment(saveTimeObj.productTime).endOf('day');
        }
    };

    disabledDate2 = (current) => {
        const { saveTimeObj } = this.state;
        if (saveTimeObj.publishStartTime) {
            return current && current >= moment(saveTimeObj.publishStartTime).endOf('day');
        } else if (saveTimeObj.productTime) {
            // return current && current > moment(saveTimeObj.productTime);
            return current && current >= moment(saveTimeObj.productTime).endOf('day');
        }
    };

    disabledDate3 = (current) => {
        const { saveTimeObj } = this.state;
        if (saveTimeObj.publishEndTime) {
            return current && current <= moment(saveTimeObj.publishEndTime).startOf('day');
        } else if (saveTimeObj.marketEndTime) {
            return current && current <= moment(saveTimeObj.marketEndTime).startOf('day');
        }
    };

    productDateChange = (type, time) => {
        let tempObj = cloneDeep(this.state.saveTimeObj);
        if (type === 'publishStartDate') {
            tempObj.publishStartTime = (time && time[0] && moment(time[0]).valueOf()) || undefined;
            tempObj.publishEndTime = (time && time[1] && moment(time[1]).valueOf()) || undefined;
        } else if (type === 'marketStartDate') {
            tempObj.marketStartTime = (time && time[0] && moment(time[0]).valueOf()) || undefined;
            tempObj.marketEndTime = (time && time[1] && moment(time[1]).valueOf()) || undefined;
        } else {
            tempObj.productTime = (time && moment(time).valueOf()) || undefined;
        }
        // console.log('tempObj', tempObj);
        this.setState({
            saveTimeObj: tempObj
        });
    };

    render() {
        const {
            managerList,
            projectManagerList,
            salesManagerList,
            operationManagerList,
            companyList,
            outsourcingList,
            fundAuthority,
            netAuthority,
            productTypeList,
            isShowShuttleBox,
            targetKeys,
            selectedKeys,
            currencyValue,
            fundsList,
            existedOpenDay,
            dataSource,
            transferModalLoading,
            showOrhide,
            isRaiseAmountType,
            productInvestmentStrategy
        } = this.state;
        // console.log(dataSource,targetKeys)

        const { loading, editLoading, params } = this.props;
        const { productId } = params;

        return (
            <Fragment>
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    className={styles.container}
                    {...formItemLayout}
                    initialValues={{
                        currency: '人民币',
                        productAuthority: [1, 2, 3],
                        netValueAuthority: [1, 2, 3],
                        appointmentStatus: 1,
                        tradeTypes: [1],
                        publishStatus: 1,
                        // fundLevel: 0,
                        topStatus: 0,
                        openType: 1,
                        custodian: getCookie('companyName'),
                        productNature: 1,
                        productMix: 1,
                        // meritPayType: 1,
                        // valuationMethodType: 1,
                        // valuationDisclosurePeriod: 1,
                        // isRaiseAmount: 0,
                        initNetValue: 1,
                        // isInvestmentProduct: 0,
                        subscribeAffiliation: getCookie('companyName'),
                        subscriptionAffiliation: getCookie('companyName'),
                        redemptionAffiliation: getCookie('companyName')
                    }}
                    scrollToFirstError
                    autoComplete="off"
                >
                    <Card
                        className={styles.complianceConfig}
                        title="合规配置"
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.iscomplianceConfig ? (
                                    <DownOutlined
                                        onClick={() => this._showOrClose('complianceConfig')}
                                    />
                                ) : (
                                    <UpOutlined
                                        onClick={() => this._showOrClose('complianceConfig')}
                                    />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.iscomplianceConfig && (
                            <div>
                                <Row>
                                    <Col span={16}>
                                        <FormItem
                                            label="产品详情权限"
                                            name="productAuthority"
                                            tooltip={{
                                                title: '设置详细产品要素信息,只要满足其中一种条件即可见',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择产品详情权限'
                                                }
                                            ]}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                mode="multiple"
                                                onChange={this._onChange}
                                                allowClear
                                            >
                                                {!isEmpty(fundAuthority) &&
                                                    fundAuthority.map((item) => {
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem
                                            label="产品净值权限"
                                            name="netValueAuthority"
                                            tooltip={{
                                                title: '设置产品净值信息,只要满足其中一种条件即可见',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择产品净值权限'
                                                }
                                            ]}
                                        >
                                            <Select placeholder="请选择" mode="multiple" allowClear>
                                                {!isEmpty(netAuthority) &&
                                                    netAuthority.map((item) => {
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
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <MultipleSelect
                                            params="specificCustomers"
                                            value="customerId"
                                            label="customerBrief"
                                            type={2}
                                            formLabel="指定可查看的用户"
                                            isOptionLabelProp
                                            optionLabel="customerName"
                                            mode="multiple"
                                        />
                                        {/* <FormItem
                                            label="指定可查看的用户"
                                            name="todo"
                                        >
                                            <Select placeholder="请选择"
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                // showArrow={false}
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                                notFoundContent={null}
                                                optionLabelProp="label"
                                                mode="multiple"
                                            >
                                                {/* {
                                                    !isEmpty(customerList) &&
                                                    customerList.map((item, i) => <Option label={item.customerName} key={i} value={item.customerId}>{item.customerBrief}</Option>)
                                                } */}
                                        {/* </Select> */}
                                        {/* </FormItem> */}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={16}>
                                        <FormItem
                                            label="产品风险等级"
                                            name="riskType"
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择产品风险等级'
                                                }
                                            ]}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWFundRiskLevel.map((item) => {
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
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="产品状态配置"
                        className={styles.statusConfig}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isstatusConfig ? (
                                    <DownOutlined
                                        onClick={() => this._showOrClose('statusConfig')}
                                    />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('statusConfig')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isstatusConfig && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="是否开放预约"
                                            name="appointmentStatus"
                                            help="此状态为开关，需同时符合开放期才会开放"
                                            {...formItemLayoutSec}
                                        // rules={[
                                        //     {
                                        //         required: true,
                                        //         message: '请选择预约状态',
                                        //     },
                                        // ]}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWReservationStatus.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="是否开放认申赎"
                                            name="tradeTypes"
                                            {...formItemLayoutSec}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                mode="multiple"
                                                allowClear
                                            // disabled={existedOpenDay === 1}
                                            >
                                                {XWPurchaseStatus.map((item) => {
                                                    return (
                                                        <Option
                                                            key={getRandomKey(5)}
                                                            disabled={item.isDisabled}
                                                            value={item.value}
                                                        >
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="上架状态"
                                            name="publishStatus"
                                            {...formItemLayoutSec}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择上架状态'
                                                }
                                            ]}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWShelfStatus.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品是否置顶"
                                            name="topStatus"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWIsFundTop.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="顺序"
                                            name="orderRule"
                                            {...formItemLayoutSec}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: '请输入产品顺序'
                                                }
                                            ]}
                                            extra="控制管理后台产品列表及投资者端产品列表中产品的展示顺序"
                                        >
                                            <InputNumber min={0} placeholder="请输入产品顺序" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="投资者权限不足时，列表是否展示该产品"
                                            name="showStatus"
                                            {...formItemLayoutSec}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: '请选择'
                                                }
                                            ]}
                                            extra=""
                                        >
                                            <Select placeholder="请选择" defaultValue={1} allowClear>
                                                <Option
                                                    key={getRandomKey(5)}
                                                    value={1}
                                                >
                                                    是
                                                </Option>
                                                <Option
                                                    key={getRandomKey(5)}
                                                    value={0}
                                                >
                                                    否
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="基本信息"
                        className={styles.basicInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                <span
                                    onClick={this._onShowModal}
                                    style={{ color: '#3D7FFF', cursor: 'pointer' }}
                                >
                                    客户端展示设置
                                </span>
                                <Tooltip
                                    placement="top"
                                    title={
                                        '默认展示所有已填写内容字段，如果不想展示某些字段，请自行设置'
                                    }
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                {showOrhide.isbasicInfo ? (
                                    <DownOutlined onClick={() => this._showOrClose('basicInfo')} />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('basicInfo')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isbasicInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品全称"
                                            name="productFullName"
                                            {...formItemLayoutSec}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入产品全称'
                                                }
                                            ]}
                                        >
                                            {/* <Input placeholder="请输入" /> */}
                                            <Input
                                                placeholder="请输入"
                                                onBlur={((e)=> this.debounce_nameChange(e.target.value))}
                                                // onChange={(e) =>
                                                //     this.debounce_nameChange(e.target.value)
                                                // }
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品简称"
                                            name="productName"
                                            {...formItemLayoutSec}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请输入产品简称'
                                                }
                                            ]}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="基金业协会备案编号"
                                            name="fundRecordNumber"
                                            tooltip={{
                                                title: '若产品在协会备案，自动读取备案编码',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            rules={[
                                                {
                                                    required: false,
                                                    message: '基金业协会备案编号'
                                                }
                                            ]}
                                            {...formItemLayoutSec}
                                        >
                                            {/* <Input placeholder="请输入" /> */}
                                            <Input
                                                placeholder="请输入"
                                                onChange={(e) =>
                                                    this.debounce_codeChange(e.target.value)
                                                }
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="证券业协会备案编号"
                                            name="securitiesIndustryAssociationNum"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="代销机构销售代码"
                                            name="agentSalesCode"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="托管机构内部产品代码"
                                            name="pbInternalProductCode"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>

                                    <Col span={8}>
                                        <FormItem
                                            label="外包机构内部产品代码"
                                            name="epibolyInternalProductCode"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="是否份额分类产品"
                                            name="fundLevel"
                                            {...formItemLayoutSec}
                                        // className={styles.fundLevelWrapper}
                                        >
                                            <Select
                                                onChange={this._handleChange}
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={0}>否</Option>
                                                <Option value={1}>是</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="关联母份额产品"
                                            name="parentProductId"
                                            {...formItemLayoutSec}
                                        // className={styles.parentFunds}
                                        >
                                            <Select
                                                placeholder="请选择产品"
                                                allowClear
                                                showSearch
                                                filterOption={this._filterPerson}
                                                notFoundContent="暂无数据"
                                                disabled={currencyValue !== 1}
                                            >
                                                {!isEmpty(fundsList) &&
                                                    fundsList.map((item) => (
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
                                    <Col span={8}>
                                        <FormItem
                                            label="是否投顾类产品"
                                            name="isInvestmentProduct"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                <Option value={0}>否</Option>
                                                <Option value={1}>是</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品类型"
                                            name="productClassification"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {FundsType.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品性质"
                                            name="productNature"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {productNatureList.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="投资性质"
                                            name="investmentNature"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入投资性质" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品状态"
                                            name="productStatus"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWFundStatus.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="币种"
                                            name="currency"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                <Option key={getRandomKey(5)} value="人民币">
                                                    CNY
                                                </Option>
                                                <Option key={getRandomKey(5)} value="美元">
                                                    USD
                                                </Option>
                                                <Option key={getRandomKey(5)} value="港币">
                                                    HKD
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品运作开始日期"
                                            name="productOperationDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                style={{ width: '100%' }}
                                                format={dateFormat}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="托管账户名称"
                                            name="investmentAccountName"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入托管账户名称" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="托管账户"
                                            name="investmentAccount"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入托管账户" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="托管机构"
                                            name="investment"
                                            {...formItemLayoutSec}
                                        >
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
                                    <Col span={8}>
                                        <FormItem
                                            label="外包机构"
                                            name="outsourcingAgency"
                                            {...formItemLayoutSec}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                // showArrow={false}
                                                filterOption={this._filterPerson}
                                                notFoundContent={null}
                                                allowClear
                                            >
                                                {!isEmpty(outsourcingList) &&
                                                    outsourcingList.map((item) => (
                                                        <Option key={item.id} value={item.id}>
                                                            {item.name}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="外包机构服务编码"
                                            name="epibolyInternalServiceCode"
                                            {...formItemLayoutSec}
                                        >
                                            <Input allowClear placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="管理人"
                                            name="custodian"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="投资经理"
                                            name="saleUserIds"
                                            {...formItemLayoutSec}
                                        >
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
                                    <Col span={8}>
                                        <FormItem
                                            label="运营经理"
                                            name="operationManager"
                                            {...formItemLayoutSec}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                allowClear
                                                filterOption={this._filterPerson}
                                                notFoundContent={null}
                                                mode="multiple"
                                            >
                                                {!isEmpty(operationManagerList) &&
                                                    operationManagerList.map((item) => (
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
                                    <Col span={8}>
                                        <FormItem
                                            label="客户经理"
                                            name="salesManager"
                                            {...formItemLayoutSec}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                showSearch
                                                defaultActiveFirstOption={false}
                                                allowClear
                                                filterOption={this._filterPerson}
                                                notFoundContent={null}
                                                mode="multiple"
                                            >
                                                {!isEmpty(salesManagerList) &&
                                                    salesManagerList.map((item) => (
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
                                    <Col span={8}>
                                        <FormItem
                                            label="受托人"
                                            name="trustee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入受托人" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="投资顾问"
                                            name="investmentCounselor"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入投资顾问" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="项目经理"
                                            name="projectSaleUserIds"
                                            {...formItemLayoutSec}
                                        >
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
                                    <Col span={8}>
                                        <FormItem
                                            label="产品结构"
                                            name="productMix"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {!isEmpty(productMixInfo) &&
                                                    productMixInfo.map((item) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品合作策略"
                                            name="productStrategy"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {XWProductStrategy.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品投资策略"
                                            name="productInvestmentStrategy"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {productInvestmentStrategy.map((item) => {
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
                                    <Col span={8}>
                                        <FormItem
                                            label="初始认/申购起点（万）"
                                            name="personalBuyCondition"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} step="1" />
                                            {/* <Input
                                                placeholder="请输入"
                                                addonAfter="万"
                                                type="number"
                                            /> */}
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="机构类投资者初始认/申购起点（万）"
                                            name="organizationBuyCondition"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} step="1" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品类投资者初始认/申购起点（万）"
                                            name="productBuyCondition"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} step="1" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="追加申购起点（万）"
                                            name="publish"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} step="1" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品系列"
                                            name="seriesType"
                                            {...formItemLayoutSec}
                                        >
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
                                    <Col span={8}>
                                        <FormItem
                                            label="销售方式"
                                            name="saleByProxy"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                <Option key={getRandomKey(5)} value={'0'}>
                                                    直销
                                                </Option>
                                                <Option key={getRandomKey(5)} value={'1'}>
                                                    代销
                                                </Option>
                                                <Option key={getRandomKey(5)} value={'0,1'}>
                                                    代销、直销
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="代销机构"
                                            name="commissionAgents"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品成立日期"
                                            name="setDate"
                                            shouldUpdate
                                            tooltip={{
                                                title: '推介期时间开始时间 <= 推介期时间结束时间 <= 募集期时间开始时间 <= 募集期时间结束时间 <= 产品成立日期时间',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                disabledDate={this.disabledDate3}
                                                style={{ width: '100%' }}
                                                format={dateFormat}
                                                onChange={(time) =>
                                                    this.productDateChange('setDate', time)
                                                }
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集期"
                                            name="publishStartDate"
                                            shouldUpdate
                                            tooltip={{
                                                title: '推介期时间开始时间 <= 推介期时间结束时间 <= 募集期时间开始时间 <= 募集期时间结束时间 <= 产品成立日期时间',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            {...formItemLayoutSec}
                                        >
                                            <RangePicker
                                                disabledDate={this.disabledDate1}
                                                dateFormat="YYYY-MM-DD"
                                                onChange={(time) =>
                                                    this.productDateChange('publishStartDate', time)
                                                }
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="推介期"
                                            name="marketStartDate"
                                            shouldUpdate
                                            tooltip={{
                                                title: '推介期时间开始时间 <= 推介期时间结束时间 <= 募集期时间开始时间 <= 募集期时间结束时间 <= 产品成立日期时间',
                                                icon: <InfoCircleOutlined />
                                            }}
                                            {...formItemLayoutSec}
                                        >
                                            <RangePicker
                                                disabledDate={this.disabledDate2}
                                                dateFormat="YYYY-MM-DD"
                                                onChange={(time) =>
                                                    this.productDateChange('marketStartDate', time)
                                                }
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品期限类别"
                                            name="productDeadline"
                                            {...formItemLayoutSec}
                                            className={styles.valuationWay}
                                        >
                                            <Select
                                                onChange={this._handleChange1}
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={1}>无固定存续期限</Option>
                                                <Option value={2}>有期限</Option>
                                            </Select>
                                        </FormItem>
                                        {/* {
                                            productDeadlineType === 2 &&

                                        } */}
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品期限时间"
                                            name="deadlineYear"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                addonAfter="年"
                                                type="number"
                                                min={0}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="证券经纪商"
                                            name="securitiesBroker"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="期货经纪商"
                                            name="futuresDealer"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="初始净值"
                                            name="initNetValue"
                                            rules={[
                                                {
                                                    message: '小数位不能超过四位',
                                                    pattern: /^-?\d+(\.\d{1,4})?$/
                                                }
                                            ]}
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" step={0.1} />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="份额类型"
                                            name="shareType"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {ShareType.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="份额类别"
                                            name="shareCategory"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {ShareCategory.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="架构类别"
                                            name="architectureCategory"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {ArchitectureCategory.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="备案状态"
                                            name="recordStatus"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {RecordStatus.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="业务模式"
                                            name="businessMode"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {BusinessModel.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="持有人属性"
                                            name="holderAttribute"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {PropertyHolder.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="发行机构"
                                            name="issueOrganization"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入发行机构" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}></Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="人数上限"
                                            name="maxPerson"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择人数上限" allowClear>
                                                <Select.Option value={1}>1人</Select.Option>
                                                <Select.Option value={35}>35人</Select.Option>
                                                <Select.Option value={200}>200人</Select.Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="募集信息"
                        className={styles.raiseInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.israiseInfo ? (
                                    <DownOutlined onClick={() => this._showOrClose('raiseInfo')} />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('raiseInfo')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.israiseInfo && (
                            <div>



                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集账户名称"
                                            name="raiseName"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集账户银行账号"
                                            name="raiseAccount"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集账户开户银行"
                                            name="bankName"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集账户开户行网点名称"
                                            name="raiseBankName"
                                            {...formItemLayoutSec}
                                        >
                                            <Input allowClear placeholder="请输入" />
                                        </FormItem>
                                    </Col>

                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="大额支付号"
                                            name="payAccount"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="备注信息"
                                            name="remark"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="是否最低募集金额"
                                            name="isRaiseAmount"
                                            {...formItemLayoutSec}
                                            className={styles.valuationWay}
                                        >
                                            <Select
                                                onChange={this._handleChange2}
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={0}>无</Option>
                                                <Option value={1}>有</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="最低募集金额"
                                            name="raiseAmount"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                addonAfter="万"
                                                type="number"
                                                min={0}
                                                disabled={isRaiseAmountType !== 1}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="预计开始募集时间/期限"
                                            name="estimatedTimeOfRaising"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row className={styles.customizeWrap}> */}

                                    <Col span={8}>
                                        <FormItem
                                            label="募集期每次追加认购金额（万）："
                                            name="raiseAddAmt"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} />
                                        </FormItem>
                                    </Col>

                                    <Col span={8}>
                                        <FormItem
                                            label="监督机构"
                                            name="supervisoryBody"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="普通投资者打款时间"
                                            name="ordinaryInvestorPaymentTime"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="专业投资者打款时间"
                                            name="professionalInvestorPaymentTime"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="特殊投资者打款时间"
                                            name="specialInvestorPaymentTime"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>



                            </div>
                        )}
                    </Card>
                    <Card
                        title="规模信息"
                        className={styles.scopeInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isscopeInfo ? (
                                    <DownOutlined onClick={() => this._showOrClose('scopeInfo')} />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('scopeInfo')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isscopeInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="初始规模（万）"
                                            name="initialScale"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                addonAfter="万"
                                                type="number"
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="参考规模更新日期"
                                            name="referenceDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="参考规模（万）"
                                            name="referenceScale"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                addonAfter="万"
                                                type="number"
                                            />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row className={styles.customizeWrap}> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="目标规模（万）"
                                            name="targetScale"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                addonAfter="万"
                                                type="number"
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="费率信息"
                        className={styles.feeInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isfeeInfo ? (
                                    <DownOutlined onClick={() => this._showOrClose('feeInfo')} />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('feeInfo')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isfeeInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="认购费率"
                                            name="subscriptionfee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="申购费率"
                                            name="subscribeFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="赎回费率"
                                            name="redeemfee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="固定管理费率"
                                            name="fixedFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="托管费率"
                                            name="trusteeFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="外包费率"
                                            name="outsourcingServiceFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="投资顾问费"
                                            name="investmentAdvisoryFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="销售服务费"
                                            name="salesServiceFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬计提方式"
                                            name="meritPayType"
                                            {...formItemLayoutSec}
                                        // className={styles.valuationWay}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={1}>超额收益计提</Option>
                                                <Option value={2}>基金资产高水位</Option>
                                                <Option value={4}>单人单笔高水位</Option>
                                                <Option value={3}>其他</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬计提说明"
                                            name="meritPay"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬固定"
                                            name="meritPayFixed"
                                            {...formItemLayoutSec}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={1}>适用</Option>
                                                <Option value={2}>不适用</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬计提时点"
                                            name="meritPayProvisionPoint"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" mode="multiple" allowClear>
                                                {WithdrawalPoint.map((item) => {
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
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬计提比例（%）"
                                            name="meritPayProvisionRatio"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" min={0} />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="业绩报酬计提基准"
                                            name="meritPayProvisionStandard"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="收益分配"
                                            name="incomeDistribution"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="行政外包费"
                                            name="outsourcingFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="其他费用"
                                            name="otherFee"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        className={styles.openDayInfo}
                        title={
                            <Space>
                                <span>运作方案</span>
                                <span className={styles.titleTips}>
                                    可设置该产品的开放日规则，具体开放日类型、时间、规则会读取您设置好的开放日规则
                                </span>
                            </Space>
                        }
                        extra={
                            <div>
                                <Space className={styles.iconWrapper}>
                                    {productId !== '0' && (
                                        <div
                                            className={styles.extraInfo}
                                            onClick={this._setOpenDayRules}
                                        >
                                            设置开放日规则
                                        </div>
                                    )}
                                    {showOrhide.isopenDayInfo ? (
                                        <DownOutlined
                                            onClick={() => this._showOrClose('openDayInfo')}
                                        />
                                    ) : (
                                        <UpOutlined
                                            onClick={() => this._showOrClose('openDayInfo')}
                                        />
                                    )}
                                </Space>
                            </div>
                        }
                    >
                        {showOrhide.isopenDayInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="运作方式"
                                            name="modeOperation"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                {OperationType.map((item) => {
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
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="资本结构"
                                            name="capitalStructure"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="交易架构"
                                            name="dealStructure"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>

                                    <Col span={8}>
                                        <FormItem
                                            label="开放日规则说明"
                                            name="openRuleExplain"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="开放日申请说明"
                                            name="openDate"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="赎回申请说明"
                                            name="redeemApply"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>

                                    <Col span={8}>
                                        <FormItem
                                            label="封闭期说明"
                                            name="closurePeriodDescription"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="锁定期"
                                            name="lockupPeriod"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="募集方式"
                                            name="raiseWay"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>

                                    {/* <Col span={8}>
                                        <FormItem
                                            label="开放日类型"
                                            name="openType"
                                            {...formItemLayoutSec}
                                        >
                                            <Select disabled>
                                                <Option key={getRandomKey(5)} value={1}>
                                                    固定开放日
                                                </Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8} >
                                        <FormItem
                                            label="开放日时间"
                                            name="openDay"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                disabled={existedOpenDay === 1}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8} >
                                        <FormItem
                                            label="开放日签约规则"
                                            name="openRule"
                                            {...formItemLayoutSec}
                                        >
                                            <Input
                                                placeholder="请输入"
                                                disabled={existedOpenDay === 1}
                                            />
                                        </FormItem>
                                    </Col>
 */}

                                    <Col span={8}>
                                        <FormItem
                                            label="认购费归属方"
                                            name="subscribeAffiliation"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="申购费归属方"
                                            name="subscriptionAffiliation"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="赎回费归属方"
                                            name="redemptionAffiliation"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={8}>
                                        <FormItem label="业绩报酬固定" name="openDayInfoMeritPayFixed" {...formItemLayoutSec}>
                                            <Radio.Group>
                                                <Radio value={0}>适用</Radio>
                                                <Radio value={1}>不适用</Radio>
                                            </Radio.Group>
                                        </FormItem>
                                    </Col> */}

                                    <Col span={8}>
                                        <FormItem
                                            label="临时开放说明"
                                            name="stringemporaryOpeningNotes"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    {/* <Col span={8}>
                                        <FormItem label="业绩报酬计提时点" name="openDayInfoMeritPayProvisionPoint" {...formItemLayoutSec}>
                                            <Select placeholder="请选择">
                                                {
                                                    WithdrawalPoint.map((item) => {
                                                        return (
                                                            <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col> */}
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="产品风险控制"
                        className={styles.riskManage}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isriskManage ? (
                                    <DownOutlined onClick={() => this._showOrClose('riskManage')} />
                                ) : (
                                    <UpOutlined onClick={() => this._showOrClose('riskManage')} />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isriskManage && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="预警线"
                                            name="warnLine"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" step={0.1} />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="预警线说明"
                                            name="warningLineDescription"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="止损线"
                                            name="stopLine"
                                            {...formItemLayoutSec}
                                        >
                                            <InputNumber placeholder="请输入" step={0.1} />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="止损线说明"
                                            name="stopLossLineDescription"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="投资政策"
                        className={styles.investmentInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isinvestmentInfo ? (
                                    <DownOutlined
                                        onClick={() => this._showOrClose('investmentInfo')}
                                    />
                                ) : (
                                    <UpOutlined
                                        onClick={() => this._showOrClose('investmentInfo')}
                                    />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isinvestmentInfo && (
                            <div>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="投资经理介绍"
                                            name="investmentManagerIntroduce"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="投资目标"
                                            name="investmentObjective"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="投资范围"
                                            name="investRange"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="产品投资策略介绍"
                                            name="investStrategy"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="投资限制"
                                            name="investmentRestriction"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="风控条款"
                                            name="riskTerms"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" allowClear />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="巨额赎回"
                                            name="withdrawals"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="免责条款"
                                            name="exceptions"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={24}>
                                        <FormItem
                                            label="其他"
                                            name="otherInformation"
                                            {...formItemLayoutSec}
                                        >
                                            <TextArea placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="估值要素信息"
                        className={styles.valuationInfo}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isvaluationInfo ? (
                                    <DownOutlined
                                        onClick={() => this._showOrClose('valuationInfo')}
                                        style={{ color: '#1890ff' }}
                                    />
                                ) : (
                                    <UpOutlined
                                        onClick={() => this._showOrClose('valuationInfo')}
                                        style={{ color: '#1890ff' }}
                                    />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isvaluationInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="估值方法"
                                            name="valuationMethodType"
                                            {...formItemLayoutSec}
                                            className={styles.valuationWay}
                                        >
                                            <Select
                                                placeholder="请选择"
                                                allowClear
                                            >
                                                <Option value={1}>行业常规估值方法</Option>
                                                <Option value={2}>成本法</Option>
                                                <Option value={3}>其他</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="估值方法说明"
                                            name="valuationMethod"
                                            {...formItemLayoutSec}
                                        >
                                            <Input placeholder="请输入" />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="估值披露周期"
                                            name="valuationDisclosurePeriod"
                                            {...formItemLayoutSec}
                                        >
                                            <Select placeholder="请选择" allowClear>
                                                <Option value={1}>每日</Option>
                                                <Option value={2}>每周</Option>
                                                <Option value={3}>每月</Option>
                                                <Option value={4}>其他</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Card
                        title="生命周期日期"
                        className={styles.lifeCycleDate}
                        extra={
                            <Space className={styles.iconWrapper}>
                                {showOrhide.isLifeCycleInfo ? (
                                    <DownOutlined
                                        onClick={() => this._showOrClose('lifeCycleInfo')}
                                        style={{ color: '#1890ff' }}
                                    />
                                ) : (
                                    <UpOutlined
                                        onClick={() => this._showOrClose('lifeCycleInfo')}
                                        style={{ color: '#1890ff' }}
                                    />
                                )}
                            </Space>
                        }
                    >
                        {showOrhide.isLifeCycleInfo && (
                            <div>
                                <Row gutter={20}>
                                    <Col span={8}>
                                        <FormItem
                                            label="需求提出日期"
                                            name="dateemandSubmissionDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="要素表定稿日期"
                                            name="elementFinalizedDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="合同流程起始日期"
                                            name="contractProcessStartDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="合同初稿日期"
                                            name="contractFirstDraftDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="管理人定稿日期"
                                            name="managerFinalizeDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="销售机构定稿日期"
                                            name="salesOrganizationFinalizeDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="托管机构定稿日期"
                                            name="trusteeAgencyFinalizeDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="销售参数设定日期"
                                            name="salesParametersSetDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="备案登记日期"
                                            name="recordRegisterDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    {/* </Row>
                                <Row> */}
                                    <Col span={8}>
                                        <FormItem
                                            label="清盘日"
                                            name="liquidation"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                    <Col span={8}>
                                        <FormItem
                                            label="产品到期日"
                                            name="productExpireDate"
                                            {...formItemLayoutSec}
                                        >
                                            <DatePicker
                                                format={dateFormat}
                                                style={{ width: '100%' }}
                                            />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </div>
                        )}
                    </Card>
                    <Affix offsetBottom={0}>
                        <FormItem
                            // {...submitFormLayout}
                            wrapperCol={24}
                            style={{
                                lineHeight: '64px',
                                textAlign: 'center',
                                background: '#f0f2f5'
                            }}
                        >
                            <Space style={{ zIndex: 999 }}>
                                {this.props.authEdit && (
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        loading={loading || editLoading}
                                    >
                                        <FormattedMessage id="formandbasic-form.form.submit" />
                                    </Button>
                                )}

                                <Button onClick={this._handleGoBack}>取消</Button>
                                <span style={{ color: '#ff4d4f' }}>请使用Ctrl+F搜索</span>
                            </Space>
                        </FormItem>
                    </Affix>
                </Form>
                <Modal
                    className={styles.fieldsModalWrapper}
                    title="字段展示配置"
                    width={600}
                    centered
                    maskClosable={false}
                    visible={isShowShuttleBox}
                    onCancel={this._onCancel}
                    footer={[
                        <Button
                            key="next"
                            type="primary"
                            className="modalButton"
                            onClick={this._handelOk}
                            loading={transferModalLoading}
                        >
                            确定
                        </Button>,
                        <Button key="cancel" className="modalButton" onClick={this._onCancel}>
                            取消
                        </Button>
                    ]}
                >
                    <Transfer
                        dataSource={dataSource}
                        titles={['未展示要素', '已展示要素']}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        onChange={this._onfieldsChange}
                        onSelectChange={this._onSelectChange}
                        onScroll={this._onScroll}
                        render={(item) => item.fieldName}
                    />
                </Modal>
            </Fragment>
        );
    }
}
export default Tab1;
