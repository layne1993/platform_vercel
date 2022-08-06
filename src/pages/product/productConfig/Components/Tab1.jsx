/*
 * @description:产品总配置
 * @Author: tangsc
 * @Date: 2021-01-13 13:15:49
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Button,
    Radio,
    Space,
    Tooltip,
    Checkbox,
    InputNumber,
    notification
} from 'antd';
import { XWBenchmark } from '@/utils/publicData';
import styles from './styles/Tab1.less';
import {
    QuestionCircleOutlined
} from '@ant-design/icons';
import { dataMasking, getRandomKey } from '@/utils/utils';
import { connect, history } from 'umi';
import { InfoCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';

// 获取Select组件option选项
const { Option } = Select;

// 定义表单Item
const FormItem = Form.Item;


// 表单布局
const formLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    }
};

// 周频天数
const weekDay = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 月频天数
let monthDay = [];
for (let i = 1; i <= 31; i++) {
    monthDay.push({
        label: `每月${i}号`,
        value: i
    });
}

monthDay = monthDay.concat([{
    label: '每月第一个交易日',
    value: 32
}, {
    label: '每月最后一交易日',
    value: 33
}]);

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


@connect(({ productConfig, loading }) => ({
    loading: loading.effects['productConfig/saveProductSetting']
}))
class Tab1 extends PureComponent {
    state = {
        incomeDisplayStatus: [1, 4],                    // 收益数据展示 1: 2:今年收益 3: 平均年化收益  4： 复利年化收益 默认选择1、2
        // trendChartStatus: [1, 2, 3],                    // 走势图展示项目 1:单位净值 2:累计净值 3:比较基准 默认全选
        standard: null,                                 // 比较基准选择
        referIncomeDisplayStatus: 1,                    // 是否需要展示参考收益 0:是 1:否 默认0
        shareCalcStatus: 1,                             // 是否需要根据交易记录自动计算份额 1:是 0:否 默认1
        openRule: 0,                                    // 产品开放规则设置 0:手动设置规则  1：根据开放日自动设置
        frequency: 2,                                   // 净值频率选择（对客户端） 1:日频 2:周频 3:月频 默认2
        week: 5,                                        // 披露时间 周频
        month: 31,                                      // 披露时间 月频
        otherDay: [],                                   // 其他披露日期 1：分红日披露 2：业绩计提日披露
        safeRate: 0,                                    // 无风险利率
        matchCalmTime: 24,                              // 冷静期配置时间 风险匹配情况下：默认24小时
        notMatchCalmTime: 48,                           // 冷静期配置时间 风险不匹配情况下：默认48小时
        calmCalcType: 0,                                // 冷静期计算方式
        // cardStatus: 1,                               // 是否需要上传证件照 1:是 0:否 默认1
        riskMismatch: 1,                                // 风险不匹配是否允许签约 1:是 0:否 默认1
        doubleCheckType: 2,                             // 双录方式：1：普通；2：AI智能；3：同时支持
        doubleRecord: 1,                                // todo
        signType: 1,                                    // 签约类型:0:电子合同签约 1:非电子合同签约
        signAuditStatus: 1,                             // 认申购流程是否需要审核：0 否，1 是
        redeemAuditStatus: 1,                           // 赎回流程是否需要审核：0 否，1 是
        bankCardStatus: 0,                              // 申购银行卡是否可修改：0 否，1 是
        warnLineType: 1,                                // 预警线报警配置类型（1:比例 2:数值）
        warnLine: 0,                                    // 预警线报警配置
        stopLineType: 1,                                // 止损线报警配置类型（1:比例 2:数值）
        stopLine: 0,                                    // 止损线报警配置
        totalCostDisplayStatus: 1,                      // 是否需要展示总成本（0:不需要 1:需要）
        isApplyNeedCheck: 1,                            // 产品预约是否需要审核(1:是，0：否)
        isAssetNeedCheck: 1,                            // 资产证明是否需需要审核
        matchCalmTimeMajor: 0,
        notMatchCalmTimeMajor: 0,
        matchCalmTimeSpecial: 0,
        notMatchCalmTimeSpecial: 0,
        // isNeedApplyBeforeSign: 0,
        costCalType: 0,                                   //成本计算方式
        netValueType: 1,
        showStatus: 1,                                    //投资者权限不足，投资者列表是否展示该产品 默认展示
        isNeedApplyBeforeSign: 1,                         // '首次购买是否预约：1-是，0-否'
        isNeedAdditionalBeforeSign: 1,                    // '是否预约：1-是，0-否'
        isNeedRedemptionBeforeSign: 1,                    // '赎回是否预约：1-是，0-否',
        ordinaryPeopleVideoStatus: 1,                     // 普通个人是否需要客户录像上传:(0:不需要,1:需要)
        ordinaryInstitutionsVideoStatus: 1,               // 普通机构是否需要客户录像上传:(0:不需要,1:需要)
        ordinaryProductsVideoStatus: 1,                   // 普通产品是否需要客户录像上传:(0:不需要,1:需要)

        professionalPeopleVideoStatus: 1,                 // 专业个人是否需要客户录像上传:(0:不需要,1:需要)
        professionalInstitutionsVideoStatus: 1,           // 专业机构是否需要客户录像上传:(0:不需要,1:需要)
        professionalProductsVideoStatus: 1,               // 专业产品是否需要客户录像上传:(0:不需要,1:需要)

        specialPeopleVideoStatus: 1,                      // 特殊个人是否需要客户录像上传:(0:不需要,1:需要)
        specialInstitutionsVideoStatus: 1,                // 特殊机构是否需要客户录像上传:(0:不需要,1:需要)
        specialProductsVideoStatus: 1,                    // 特殊产品是否需要客户录像上传:(0:不需要,1:需要)

        ordinaryPeopleVisitStatus: 1,                     // 普通个人是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        ordinaryInstitutionsVisitStatus: 1,               // 普通机构是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        ordinaryProductsVisitStatus: 1,                   // 普通产品是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)

        professionalPeopleVisitStatus: 1,                 // 专业个人是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        professionalInstitutionsVisitStatus: 1,           // 专业机构是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        professionalProductsVisitStatus: 1,               // 专业产品是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)

        specialPeopleVisitStatus: 1,                      // 特殊个人是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        specialInstitutionsVisitStatus: 1,                // 特殊机构是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)
        specialProductsVisitStatus: 1,                    // 特殊产品是否需要首次购买是否需要冷静期和回访:(0:不需要,1:需要)

        ordinaryPeopleNoticeAndWarningLetter: 1,          // 普通个人是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        ordinaryInstitutionsNoticeAndWarningLetter: 1,    // 普通机构是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        ordinaryProductsNoticeAndWarningLetter: 1,        // 普通产品是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)

        professionalPeopleNoticeAndWarningLetter: 1,      // 专业个人是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        professionalInstitutionsNoticeAndWarningLetter: 1, // 专业机构是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        professionalProductsNoticeAndWarningLetter: 1,    // 专业产品是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)

        specialPeopleNoticeAndWarningLetter: 1,           // 特殊个人是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        specialInstitutionsNoticeAndWarningLetter: 1,     // 特殊机构是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)
        specialProductsNoticeAndWarningLetter: 1,         // 特殊产品是否需要风险匹配告知书和风险不匹配警示函:(0:不需要,1:需要)

        subscribeVisitStatus: 1                            // 追加购买是否需要冷静期和回访（如果选择是，要看首次购买的配置，和首次购买配置一样
    };

    componentDidMount() {
        this._editSearch();
    }

    // 表单实例对象
    formRef = React.createRef();

    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'productConfig/queryProductSetting',
            payload: {
                // productId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        this.setState({
                            ...data,
                            UniqueBenefits: {
                                incomeDisplayStatus: data.incomeDisplayStatus
                            }, //收益数据展示

                            UniqueComputing: {
                                netValueType: data.netValueType
                            },  //净值计算方式

                            UniqueFrequency: {
                                frequency: data.frequency,
                                week: data.week,
                                month: data.month,
                                otherDay: data.otherDay
                            },  //净值频率

                            UniqueBenchmark: {
                                standard: data.standard,
                                safeRate: data.safeRate
                            },  //比较基准
                            //默认签约配置
                            UniqueSigning: {
                                calmCalcType: data.calmCalcType,
                                riskMismatch: data.riskMismatch,
                                signAuditStatus: data.signAuditStatus,
                                redeemAuditStatus: data.redeemAuditStatus,
                                bankCardStatus: data.bankCardStatus,
                                doubleCheckType: data.doubleCheckType,
                                matchCalmTime: data.matchCalmTime,
                                notMatchCalmTime: data.notMatchCalmTime,
                                matchCalmTimeMajor: data.matchCalmTimeMajor,
                                notMatchCalmTimeMajor: data.notMatchCalmTimeMajor,
                                matchCalmTimeSpecial: data.matchCalmTimeSpecial,
                                notMatchCalmTimeSpecial: data.notMatchCalmTimeSpecial,
                                isNeedApplyBeforeSign: data.isNeedApplyBeforeSign,
                                isNeedAdditionalBeforeSign: data.isNeedAdditionalBeforeSign,
                                isNeedRedemptionBeforeSign: data.isNeedRedemptionBeforeSign,
                                ordinaryPeopleVideoStatus: data.ordinaryPeopleVideoStatus,
                                ordinaryInstitutionsVideoStatus: data.ordinaryInstitutionsVideoStatus,
                                ordinaryProductsVideoStatus: data.ordinaryProductsVideoStatus,
                                professionalPeopleVideoStatus: data.professionalPeopleVideoStatus,
                                professionalInstitutionsVideoStatus: data.professionalInstitutionsVideoStatus,
                                professionalProductsVideoStatus: data.professionalProductsVideoStatus,
                                specialPeopleVideoStatus: data.specialPeopleVideoStatus,
                                specialInstitutionsVideoStatus: data.specialInstitutionsVideoStatus,
                                specialProductsVideoStatus: data.specialProductsVideoStatus,
                                ordinaryPeopleVisitStatus: data.ordinaryPeopleVisitStatus,
                                ordinaryInstitutionsVisitStatus: data.ordinaryInstitutionsVisitStatus,
                                ordinaryProductsVisitStatus: data.ordinaryProductsVisitStatus,
                                professionalPeopleVisitStatus: data.professionalPeopleVisitStatus,
                                professionalInstitutionsVisitStatus: data.professionalInstitutionsVisitStatus,
                                professionalProductsVisitStatus: data.professionalProductsVisitStatus,
                                specialPeopleVisitStatus: data.specialPeopleVisitStatus,
                                specialInstitutionsVisitStatus: data.specialInstitutionsVisitStatus,
                                specialProductsVisitStatus: data.specialProductsVisitStatus,
                                ordinaryPeopleNoticeAndWarningLetter: data.ordinaryPeopleNoticeAndWarningLetter,
                                ordinaryInstitutionsNoticeAndWarningLetter: data.ordinaryInstitutionsNoticeAndWarningLetter,
                                ordinaryProductsNoticeAndWarningLetter: data.ordinaryProductsNoticeAndWarningLetter,
                                professionalPeopleNoticeAndWarningLetter: data.professionalPeopleNoticeAndWarningLetter,
                                professionalInstitutionsNoticeAndWarningLetter: data.professionalInstitutionsNoticeAndWarningLetter,
                                professionalProductsNoticeAndWarningLetter: data.professionalProductsNoticeAndWarningLetter,
                                specialPeopleNoticeAndWarningLetter: data.specialPeopleNoticeAndWarningLetter,
                                specialInstitutionsNoticeAndWarningLetter: data.specialInstitutionsNoticeAndWarningLetter,
                                specialProductsNoticeAndWarningLetter: data.specialProductsNoticeAndWarningLetter,
                                subscribeVisitStatus: data.subscribeVisitStatus,
                                secondReviewCheck: data.secondReviewCheck,
                                showStatus:data.showStatus
                            },
                            // 默认投资者端展示设置
                            UniqueConfiguration: {
                                referIncomeDisplayStatus: data.referIncomeDisplayStatus,
                                totalCostDisplayStatus: data.totalCostDisplayStatus,
                                shareCalcStatus: data.shareCalcStatus,
                                isApplyNeedCheck: data.isApplyNeedCheck,
                                isNeedApplyBeforeSign: data.isNeedApplyBeforeSign,
                                isAssetNeedCheck: data.isAssetNeedCheck,
                                costCalType: data.costCalType

                            },
                            //默认风控
                            UniqueRiskControl: {
                                warnLineType: data.warnLineType,
                                stopLineType: data.stopLineType,
                                stopLine: data.stopLine,
                                warnLine: data.warnLine
                            },
                            UniqueCustomization: {
                                productSeries: data.productSeries

                            }      //自定义产品系列
                        });
                        sessionStorage.setItem('needAudit', res.data.isApplyNeedCheck);
                        sessionStorage.setItem('isNeedCheck', res.data.isAssetNeedCheck);
                        if (this.formRef.current && !isEmpty(data.productSeries)) {
                            this.formRef.current.setFieldsValue({
                                productSeries: data.productSeries
                            });
                        }
                        // if(type){
                        //     this._onOk(1);
                        // }
                    }
                }
            }
        });
    }

    /**
     * @description: change事件保存选中的值
     * @param {String} type 判断具体哪个checkbox、radio、select
     * @param {*} e 改变的值
     */
    _handleChange = (e, type, mode) => {
        // console.log(type, mode);
        let tempObj = {};
        tempObj[mode] = { ...this.state[mode] || {} };
        switch (type) {
            case 'income':
                tempObj.incomeDisplayStatus = e;
                tempObj[mode].incomeDisplayStatus = e;
                break;
            case 'trend':
                tempObj.trendChartStatus = e;
                tempObj[mode].trendChartStatus = e;
                break;
            case 'compare':
                tempObj.standard = e;
                tempObj[mode].standard = e;
                break;
            case 'profit':
                tempObj.referIncomeDisplayStatus = e.target.value;
                tempObj[mode].referIncomeDisplayStatus = e.target.value;
                break;
            case 'totalCostDisplayStatus':
                tempObj.totalCostDisplayStatus = e.target.value;
                tempObj[mode].totalCostDisplayStatus = e.target.value;
                break;
            case 'share':
                tempObj.shareCalcStatus = e.target.value;
                tempObj[mode].shareCalcStatus = e.target.value;
                break;
            case 'productRule':
                tempObj.openRule = e.target.value;
                tempObj[mode].openRule = e.target.value;
                break;
            case 'frequency':
                tempObj.frequency = e.target.value;
                tempObj[mode].frequency = e.target.value;
                break;
            case 'timeWeek':
                tempObj.week = e;
                tempObj[mode].week = e;
                break;
            case 'timeMonth':
                tempObj.month = e;
                tempObj[mode].month = e;
                break;
            case 'otherDate':
                tempObj.otherDay = e;
                tempObj[mode].otherDay = e;
                break;
            case 'setSafeRate':
                tempObj.safeRate = e;
                tempObj[mode].safeRate = e;
                break;
            case 'riskMatching':
                tempObj.matchCalmTime = e;
                tempObj[mode].matchCalmTime = e;
                break;
            case 'notMatchCalmTime':
                tempObj.notMatchCalmTime = e;
                tempObj[mode].notMatchCalmTime = e;
                break;
            case 'matchCalmTimeMajor':
                tempObj.matchCalmTimeMajor = e;
                tempObj[mode].matchCalmTimeMajor = e;
                break;
            case 'notMatchCalmTimeMajor':
                tempObj.notMatchCalmTimeMajor = e;
                tempObj[mode].notMatchCalmTimeMajor = e;
                break;
            case 'matchCalmTimeSpecial':
                tempObj.matchCalmTimeSpecial = e;
                tempObj[mode].matchCalmTimeSpecial = e;
                break;
            case 'notMatchCalmTimeSpecial':
                tempObj.notMatchCalmTimeSpecial = e;
                tempObj[mode].notMatchCalmTimeSpecial = e;
                break;
            case 'isNeedApplyBeforeSign':
                tempObj.isNeedApplyBeforeSign = e.target.value;
                tempObj[mode].isNeedApplyBeforeSign = e.target.value;
                break;
            case 'isNeedAdditionalBeforeSign':
                tempObj.isNeedAdditionalBeforeSign = e.target.value;
                tempObj[mode].isNeedAdditionalBeforeSign = e.target.value;
                break;
            case 'isNeedRedemptionBeforeSign':
                tempObj.isNeedRedemptionBeforeSign = e.target.value;
                tempObj[mode].isNeedRedemptionBeforeSign = e.target.value;
                break;
            case 'ordinaryPeopleVideoStatus':
                tempObj.ordinaryPeopleVideoStatus = e.target.value;
                tempObj[mode].ordinaryPeopleVideoStatus = e.target.value;
                break;
            case 'ordinaryInstitutionsVideoStatus':
                tempObj.ordinaryInstitutionsVideoStatus = e.target.value;
                tempObj[mode].ordinaryInstitutionsVideoStatus = e.target.value;
                break;
            case 'ordinaryProductsVideoStatus':
                tempObj.ordinaryProductsVideoStatus = e.target.value;
                tempObj[mode].ordinaryProductsVideoStatus = e.target.value;
                break;
            case 'professionalPeopleVideoStatus':
                tempObj.professionalPeopleVideoStatus = e.target.value;
                tempObj[mode].professionalPeopleVideoStatus = e.target.value;
                break;
            case 'professionalInstitutionsVideoStatus':
                tempObj.professionalInstitutionsVideoStatus = e.target.value;
                tempObj[mode].professionalInstitutionsVideoStatus = e.target.value;
                break;
            case 'professionalProductsVideoStatus':
                tempObj.professionalProductsVideoStatus = e.target.value;
                tempObj[mode].professionalProductsVideoStatus = e.target.value;
                break;
            case 'specialPeopleVideoStatus':
                tempObj.specialPeopleVideoStatus = e.target.value;
                tempObj[mode].specialPeopleVideoStatus = e.target.value;
                break;
            case 'specialInstitutionsVideoStatus':
                tempObj.specialInstitutionsVideoStatus = e.target.value;
                tempObj[mode].specialInstitutionsVideoStatus = e.target.value;
                break;
            case 'specialProductsVideoStatus':
                tempObj.specialProductsVideoStatus = e.target.value;
                tempObj[mode].specialProductsVideoStatus = e.target.value;
                break;
            case 'ordinaryPeopleVisitStatus':
                tempObj.ordinaryPeopleVisitStatus = e.target.value;
                tempObj[mode].ordinaryPeopleVisitStatus = e.target.value;
                break;
            case 'ordinaryInstitutionsVisitStatus':
                tempObj.ordinaryInstitutionsVisitStatus = e.target.value;
                tempObj[mode].ordinaryInstitutionsVisitStatus = e.target.value;
                break;
            case 'ordinaryProductsNoticeAndWarningLetter':
                tempObj.ordinaryProductsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].ordinaryProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'ordinaryProductsVisitStatus':
                tempObj.ordinaryProductsVisitStatus = e.target.value;
                tempObj[mode].ordinaryProductsVisitStatus = e.target.value;
                break;
            case 'professionalPeopleVisitStatus':
                tempObj.professionalPeopleVisitStatus = e.target.value;
                tempObj[mode].professionalPeopleVisitStatus = e.target.value;
                break;
            case 'professionalInstitutionsVisitStatus':
                tempObj.professionalInstitutionsVisitStatus = e.target.value;
                tempObj[mode].professionalInstitutionsVisitStatus = e.target.value;
                break;
            case 'professionalProductsVisitStatus':
                tempObj.professionalProductsVisitStatus = e.target.value;
                tempObj[mode].professionalProductsVisitStatus = e.target.value;
                break;
            case 'specialPeopleVisitStatus':
                tempObj.specialPeopleVisitStatus = e.target.value;
                tempObj[mode].specialPeopleVisitStatus = e.target.value;
                break;
            case 'specialInstitutionsVisitStatus':
                tempObj.specialInstitutionsVisitStatus = e.target.value;
                tempObj[mode].specialInstitutionsVisitStatus = e.target.value;
                break;
            case 'specialProductsVisitStatus':
                tempObj.specialProductsVisitStatus = e.target.value;
                tempObj[mode].specialProductsVisitStatus = e.target.value;
                break;
            case 'ordinaryPeopleNoticeAndWarningLetter':
                tempObj.ordinaryPeopleNoticeAndWarningLetter = e.target.value;
                tempObj[mode].ordinaryPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'ordinaryInstitutionsNoticeAndWarningLetter':
                tempObj.ordinaryInstitutionsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].ordinaryInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalPeopleNoticeAndWarningLetter':
                tempObj.professionalPeopleNoticeAndWarningLetter = e.target.value;
                tempObj[mode].professionalPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalInstitutionsNoticeAndWarningLetter':
                tempObj.professionalInstitutionsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].professionalInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalProductsNoticeAndWarningLetter':
                tempObj.professionalProductsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].professionalProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialPeopleNoticeAndWarningLetter':
                tempObj.specialPeopleNoticeAndWarningLetter = e.target.value;
                tempObj[mode].specialPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialInstitutionsNoticeAndWarningLetter':
                tempObj.specialInstitutionsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].specialInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialProductsNoticeAndWarningLetter':
                tempObj.specialProductsNoticeAndWarningLetter = e.target.value;
                tempObj[mode].specialProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'subscribeVisitStatus':
                tempObj.subscribeVisitStatus = e.target.value;
                tempObj[mode].subscribeVisitStatus = e.target.value;
                break;
            case 'coolPeriod':
                tempObj.calmCalcType = e.target.value;
                tempObj[mode].calmCalcType = e.target.value;
                break;
            case 'idPhoto':
                tempObj.cardStatus = e.target.value;
                tempObj[mode].cardStatus = e.target.value;
                break;
            case 'isAllowedSignUp':
                tempObj.riskMismatch = e.target.value;
                tempObj[mode].riskMismatch = e.target.value;
                break;
            case 'showStatus':
                tempObj.showStatus = e.target.value;
                tempObj[mode].showStatus = e.target.value;
                break;
            case 'isDoubleRecord':
                tempObj.doubleRecord = e.target.value;
                tempObj[mode].doubleRecord = e.target.value;
                break;
            case 'isDoubleCheckType':
                tempObj.doubleCheckType = e.target.value;
                tempObj[mode].doubleCheckType = e.target.value;
                break;
            case 'isSignType':
                tempObj.signType = e.target.value;
                tempObj[mode].signType = e.target.value;
                break;
            case 'isSignAuditStatus':
                tempObj.signAuditStatus = e.target.value;
                tempObj[mode].signAuditStatus = e.target.value;
                break;
            case 'isRedeemAuditStatus':
                tempObj.redeemAuditStatus = e.target.value;
                tempObj[mode].redeemAuditStatus = e.target.value;
                break;
            case 'isEditBank':
                tempObj.bankCardStatus = e.target.value;
                tempObj[mode].bankCardStatus = e.target.value;
                break;
            case 'isWarnLineType':
                tempObj.warnLineType = e.target.value;
                tempObj[mode].warnLineType = e.target.value;
                break;
            case 'isWarnLine':
                tempObj.warnLine = e;
                tempObj[mode].warnLine = e;
                break;
            case 'isStopLineType':
                tempObj.stopLineType = e.target.value;
                tempObj[mode].stopLineType = e.target.value;
                break;
            case 'isStopLine':
                tempObj.stopLine = e;
                tempObj[mode].stopLine = e;
                break;
            case 'applyNeedCheckInfo':
                tempObj.isApplyNeedCheck = e.target.value;
                tempObj[mode].isApplyNeedCheck = e.target.value;
                break;
            case 'isNeedCheckInfo':
                tempObj.isAssetNeedCheck = e.target.value;
                tempObj[mode].isAssetNeedCheck = e.target.value;
                break;
            case 'costCalType':
                tempObj.costCalType = e.target.value;
                tempObj[mode].costCalType = e.target.value;
                break;
            case 'netValueType':
                tempObj.netValueType = e.target.value;
                tempObj[mode].netValueType = e.target.value;
                break;
            case 'secondReviewCheck':
                tempObj.secondReviewCheck = e.target.value;
                tempObj[mode].secondReviewCheck = e.target.value;
                break;
            default:
                break;
        }
        this.setState({
            ...tempObj,
            [mode]: tempObj[mode]
        });
    }

    /**
     * @description: 确定提交
     */
    _onOk = (name, isAll) => {

        // console.log(name, isAll);
        const { dispatch, params } = this.props;
        const { frequency } = this.state;
        let tempObj = {};
        let productSeries = [];
        productSeries = this.formRef.current.getFieldValue('productSeries');
        // console.log(name,isAll,productSeries)
        // console.log(tempObj[name])
        // return;
        if (name === 'UniqueCustomization') {
            if (productSeries[0] && productSeries[0].codeText) {
                tempObj[name] = { productSeries: productSeries };
            } else {
                tempObj[name] = { productSeries: [] };
            }

        } else if (name === 'UniqueFrequency') {
            if (frequency === 1) {
                const { week, month, otherDay, ...obj } = this.state[name];
                tempObj[name] = obj;
            } else if (frequency === 2) {
                const { month, ...obj } = this.state[name];
                tempObj[name] = obj;
            } else {
                const { week, ...obj } = this.state[name];
                tempObj[name] = obj;
            }
        } else {
            tempObj[name] = this.state[name];
        }

        // 哪个按钮  是否应用到所有


        // 获取产品系列值



        // 日频、周频、月频对应的入参

        // console.log(tempObj[name])

        // 新增
        dispatch({
            type: 'productConfig/saveProductSetting',
            payload: {
                ...tempObj[name],
                sysProductSettingId: this.state.sysProductSettingId,
                isApplyToAllProducts: isAll,
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    // console.log(type);
                    // if(type!==1){
                    openNotification('success', '提示', '配置成功', 'topRight');
                    // }

                    this._editSearch();
                } else {
                    const warningText = res.message || res.data || '配置失败！';
                    // if(!type){
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    // }

                }
            }
        });
    }

    _GoBack = () => {
        history.push({
            pathname: '/product/list'
        });
    }

    applyAll = () => {

    }

    render() {
        const {
            incomeDisplayStatus,
            trendChartStatus,
            standard,
            referIncomeDisplayStatus,
            shareCalcStatus,
            openRule,
            frequency,
            week,
            month,
            otherDay,
            safeRate,
            matchCalmTime,
            notMatchCalmTime,
            matchCalmTimeMajor,
            notMatchCalmTimeMajor,
            matchCalmTimeSpecial,
            notMatchCalmTimeSpecial,
            isNeedApplyBeforeSign,
            isNeedAdditionalBeforeSign,
            isNeedRedemptionBeforeSign,
            ordinaryPeopleVideoStatus,
            ordinaryInstitutionsVideoStatus,
            ordinaryProductsVideoStatus,
            professionalPeopleVideoStatus,
            professionalInstitutionsVideoStatus,
            professionalProductsVideoStatus,
            specialPeopleVideoStatus,
            specialInstitutionsVideoStatus,
            specialProductsVideoStatus,
            ordinaryPeopleVisitStatus,
            ordinaryInstitutionsVisitStatus,
            ordinaryProductsVisitStatus,
            professionalPeopleVisitStatus,
            professionalInstitutionsVisitStatus,
            professionalProductsVisitStatus,
            specialPeopleVisitStatus,
            specialInstitutionsVisitStatus,
            specialProductsVisitStatus,
            ordinaryPeopleNoticeAndWarningLetter,
            ordinaryInstitutionsNoticeAndWarningLetter,
            ordinaryProductsNoticeAndWarningLetter,
            professionalPeopleNoticeAndWarningLetter,
            professionalInstitutionsNoticeAndWarningLetter,
            professionalProductsNoticeAndWarningLetter,
            specialPeopleNoticeAndWarningLetter,
            specialInstitutionsNoticeAndWarningLetter,
            specialProductsNoticeAndWarningLetter,
            subscribeVisitStatus,
            calmCalcType,
            cardStatus,
            doubleRecord,
            doubleCheckType,
            signType,
            riskMismatch,
            signAuditStatus,
            redeemAuditStatus,
            bankCardStatus,
            warnLineType,
            stopLineType,
            warnLine,
            stopLine,
            totalCostDisplayStatus,
            isApplyNeedCheck,
            isAssetNeedCheck,
            // isNeedApplyBeforeSign,
            costCalType,
            netValueType,
            showStatus,
            secondReviewCheck
        } = this.state;

        const { loading } = this.props;
        // eslint-disable-next-line no-undef
        const defaultDoubleCheckType = sessionStorage.getItem('defaultDoubleCheckType');


        return (
            <div className={styles.container}>

                <Card className={styles.dataShow} title="默认数据设置">
                    <Row>
                        <Col span={24}>
                            <p>收益数据展示（多选）：</p>
                            <Checkbox.Group
                                value={incomeDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'income', 'UniqueBenefits')}
                            >
                                <Checkbox value={5}>投资经理</Checkbox>
                                <Checkbox value={0}>单位净值</Checkbox>
                                <Checkbox value={1}>成立以来收益</Checkbox>
                                <Checkbox value={7}>周收益</Checkbox>
                                <Checkbox value={6}>累计(复权)净值</Checkbox>
                                <Checkbox value={2}>今年收益</Checkbox>
                                <Checkbox value={3}>平均年化收益</Checkbox>
                                <Checkbox value={4}>复利年化收益</Checkbox>
                            </Checkbox.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueBenefits', 0)}>                <Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip>
                            </Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueBenefits', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col>
                    </Row>
                </Card>

                <Card>
                    <Row>
                        <Col span={24}>
                            <Radio.Group
                                value={netValueType}
                                onChange={(e) => this._handleChange(e, 'netValueType', 'UniqueComputing')}
                                style={{ width: '100%' }}
                            >
                                <Radio value={1}>
                                    累计净值计算方式<br />
                                    <span style={{ color: '#666' }}>
                                        累计净值计算方式适用于：累计净值=单位净值+分红系数
                                    </span>

                                </Radio>



                                <Radio value={2}>
                                    复权净值计算方式<br />
                                    <span style={{ color: '#666' }}>
                                        复权净值计算方式适用于：累计净值=单位净值*累计系数
                                    </span>
                                </Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueComputing', 0)}><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueComputing', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col>
                    </Row>

                </Card>

                <Card>
                    <Row>
                        <Col span={8}>
                            <p>净值频率选择（对客户端）：</p>
                            <Radio.Group
                                value={frequency}
                                onChange={(e) => this._handleChange(e, 'frequency', 'UniqueFrequency')}
                            >
                                <Radio value={1}>日频</Radio>
                                <Radio value={2}>周频</Radio>
                                <Radio value={3}>月频</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            frequency === 2 ?
                                <Col span={8}>
                                    <p>
                                        配置披露时间&nbsp;
                                        <Tooltip
                                            placement="top"
                                            title={
                                                <div>
                                                    <p style={{ margin: 0 }}>1、设置周频或者月频后，默认只展示披露日净值</p>
                                                    <p style={{ margin: 0 }}>2、若披露日不是交易日则自动展示前一个交易日净值</p>
                                                    <p style={{ margin: 0 }}>3、若有其他需要披露的净值，请在产品净值录入--净值是否展示这一列勾选</p>
                                                </div>
                                            }
                                        >
                                            <InfoCircleOutlined />
                                        </Tooltip>
                                        ：
                                    </p>
                                    <Select
                                        placeholder="请选择"
                                        style={{ width: '80%' }}
                                        value={week}
                                        allowClear
                                        onChange={(e) => this._handleChange(e, 'timeWeek', 'UniqueFrequency')}
                                    >
                                        {
                                            weekDay.map((item, index) => {
                                                return (
                                                    <Option key={index} value={index + 1}>{item}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Col>
                                :
                                frequency === 3 ?
                                    <Col span={8}>
                                        <p>
                                            配置披露时间&nbsp;
                                            <Tooltip
                                                placement="top"
                                                title={
                                                    <div>
                                                        <p style={{ margin: 0 }}>1、设置周频或者月频后，默认只展示披露日净值</p>
                                                        <p style={{ margin: 0 }}>2、若披露日不是交易日则自动展示前一个交易日净值</p>
                                                        <p style={{ margin: 0 }}>3、若有其他需要披露的净值，请在产品净值录入--净值是否展示这一列勾选</p>
                                                    </div>
                                                }
                                            >
                                                <InfoCircleOutlined />
                                            </Tooltip>
                                            ：
                                        </p>
                                        <Select
                                            placeholder="请选择"
                                            style={{ width: '80%' }}
                                            value={month}
                                            allowClear
                                            onChange={(e) => this._handleChange(e, 'timeMonth', 'UniqueFrequency')}
                                        >
                                            {
                                                monthDay.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </Col>
                                    : ''
                        }
                        {
                            (frequency === 2 || frequency === 3) &&
                            <Col span={8}>
                                <p>其他披露日期（多选）：</p>
                                <Checkbox.Group
                                    value={otherDay}
                                    onChange={(e) => this._handleChange(e, 'otherDate', 'UniqueFrequency')}
                                >
                                    <Checkbox value={1}>分红日披露</Checkbox>
                                    <Checkbox value={2}>业绩计提日披露</Checkbox>
                                    <Checkbox value={3}>开放日披露</Checkbox>
                                </Checkbox.Group>
                            </Col>
                        }
                        
                    </Row>
                    <Row>
                        注:如需修改所有产品历史净值的披露频率，请联系美市科技运营人员处理，历史数据处理较为耗时。
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueFrequency', 0)}><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            {/* <Button type="primary" onClick={() => this._onOk('UniqueFrequency', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button> */}
                        </Col>
                    </Row>
                </Card>


                <Card>
                    <Row>
                        <Col span={8}>
                            <p>比较基准选择：</p>
                            <Select
                                placeholder="请选择"
                                value={standard}
                                allowClear
                                style={{ width: '80%' }}
                                onChange={(e) => this._handleChange(e, 'compare', 'UniqueBenchmark')}
                            >
                                {
                                    XWBenchmark.map((item) => {
                                        return (
                                            <Option key={getRandomKey(5)} value={item.value}> {item.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </Col>
                        <Col span={8}>
                            <p>无风险收益（十年期国债）：</p>
                            <InputNumber
                                disabled={BASE_PATH.NoRiskDisable !== 1}
                                // precision={0.01}
                                step={0.0001}
                                min={0}
                                value={safeRate}
                                onChange={(e) => this._handleChange(e, 'setSafeRate', 'UniqueBenchmark')}
                            />&nbsp;
                        </Col>
                        {/* <Col span={9}>
                            <p>走势图展示项目（多选）：</p>
                            <Checkbox.Group
                                value={trendChartStatus}
                                onChange={(e) => this._handleChange(e, 'trend')}
                            >
                                <Checkbox value={1}>成立以来收益</Checkbox>
                                <Checkbox value={2}>今年收益</Checkbox>
                                <Checkbox value={3}>年化收益</Checkbox>
                            </Checkbox.Group>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueBenchmark', 0)} ><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueBenchmark', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col>
                        {/* <Col span={6}>
                            <p>产品开放规则设置</p>
                            <Radio.Group
                                value={openRule}
                                onChange={(e) => this._handleChange(e, 'productRule')}
                            >
                                <Radio value={0}>手动设置产品开放规则</Radio>
                                <Radio value={1}>根据开放日规则自动设置产品</Radio>
                            </Radio.Group>
                        </Col> */}
                    </Row>
                </Card>
                <Card className={styles.contractConfig} title="默认签约配置">
                    <h3>
                        <strong>签约前是否需要预约</strong>
                    </h3>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <div className={styles.itemFlex}>
                                <span>首次购买是否需要预约：</span>
                                <Radio.Group
                                    value={isNeedApplyBeforeSign}
                                    onChange={(e) => this._handleChange(e, 'isNeedApplyBeforeSign', 'UniqueSigning')}
                                >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className={styles.itemFlex}>
                                <span>追加购买是否需要预约：</span>
                                <Radio.Group
                                    value={isNeedAdditionalBeforeSign}
                                    onChange={(e) => this._handleChange(e, 'isNeedAdditionalBeforeSign', 'UniqueSigning')}
                                >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className={styles.itemFlex}>
                                <span>赎回是否需要预约：</span>
                                <Radio.Group
                                    value={isNeedRedemptionBeforeSign}
                                    onChange={(e) => this._handleChange(e, 'isNeedRedemptionBeforeSign', 'UniqueSigning')}
                                >
                                    <Radio value={1}>是</Radio>
                                    <Radio value={0}>否</Radio>
                                </Radio.Group>
                            </div>
                        </Col>
                    </Row>

                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <h3>
                                <strong>是否需要双录</strong>
                            </h3>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通个人：</span>
                                        <Radio.Group
                                            value={ordinaryPeopleVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryPeopleVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通机构：</span>
                                        <Radio.Group
                                            value={ordinaryInstitutionsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryInstitutionsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通产品：</span>
                                        <Radio.Group
                                            value={ordinaryProductsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryProductsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业个人：</span>
                                        <Radio.Group
                                            value={professionalPeopleVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalPeopleVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业机构：</span>
                                        <Radio.Group
                                            value={professionalInstitutionsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalInstitutionsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业产品：</span>
                                        <Radio.Group
                                            value={professionalProductsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalProductsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊个人：</span>
                                        <Radio.Group
                                            value={specialPeopleVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'specialPeopleVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊机构：</span>
                                        <Radio.Group
                                            value={specialInstitutionsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'specialInstitutionsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊产品：</span>
                                        <Radio.Group
                                            value={specialProductsVideoStatus}
                                            onChange={(e) => this._handleChange(e, 'specialProductsVideoStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <h3>
                                <strong>首次购买是否需要冷静期和回访</strong>
                            </h3>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通个人：</span>
                                        <Radio.Group
                                            value={ordinaryPeopleVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryPeopleVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通机构：</span>
                                        <Radio.Group
                                            value={ordinaryInstitutionsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryInstitutionsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通产品：</span>
                                        <Radio.Group
                                            value={ordinaryProductsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'ordinaryProductsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业个人：</span>
                                        <Radio.Group
                                            value={professionalPeopleVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalPeopleVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业机构：</span>
                                        <Radio.Group
                                            value={professionalInstitutionsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalInstitutionsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业产品：</span>
                                        <Radio.Group
                                            value={professionalProductsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'professionalProductsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊个人：</span>
                                        <Radio.Group
                                            value={specialPeopleVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'specialPeopleVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊机构：</span>
                                        <Radio.Group
                                            value={specialInstitutionsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'specialInstitutionsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊产品：</span>
                                        <Radio.Group
                                            value={specialProductsVisitStatus}
                                            onChange={(e) => this._handleChange(e, 'specialProductsVisitStatus', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={8}>
                            <h3>
                                <strong>是否需要风险匹配告知书和风险不匹配警示函</strong>
                            </h3>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通个人：</span>
                                        <Radio.Group
                                            value={ordinaryPeopleNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'ordinaryPeopleNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通机构：</span>
                                        <Radio.Group
                                            value={ordinaryInstitutionsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'ordinaryInstitutionsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>普通产品：</span>
                                        <Radio.Group
                                            value={ordinaryProductsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'ordinaryProductsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业个人：</span>
                                        <Radio.Group
                                            value={professionalPeopleNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'professionalPeopleNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业机构：</span>
                                        <Radio.Group
                                            value={professionalInstitutionsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'professionalInstitutionsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>专业产品：</span>
                                        <Radio.Group
                                            value={professionalProductsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'professionalProductsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊个人：</span>
                                        <Radio.Group
                                            value={specialPeopleNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'specialPeopleNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊机构：</span>
                                        <Radio.Group
                                            value={specialInstitutionsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'specialInstitutionsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                                <Col span={8}>
                                    <div className={styles.itemFlex}>
                                        <span>特殊产品：</span>
                                        <Radio.Group
                                            value={specialProductsNoticeAndWarningLetter}
                                            onChange={(e) => this._handleChange(e, 'specialProductsNoticeAndWarningLetter', 'UniqueSigning')}
                                        >
                                            <Radio value={1}>是</Radio><br />
                                            <Radio value={0}>否</Radio>
                                        </Radio.Group>
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>
                                追加购买是否需要冷静期和回访&nbsp;
                                <Tooltip
                                    placement="top"
                                    title={'勾选是以后，追加购买是否需要冷静期和回访和首次购买是否需要冷静期和回访的配置一致，例如专业机构首次购买配置为否，追加购买勾选为是，则专业机构追加购买不需要冷静期和回访，勾选否，则全部不需要冷静期和回访'}
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                ：
                            </p>
                            <Radio.Group
                                value={subscribeVisitStatus}
                                onChange={(e) => this._handleChange(e, 'subscribeVisitStatus', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={9}>
                            <p>
                                风险不匹配是否允许签约&nbsp;
                                <Tooltip
                                    placement="top"
                                    title={'若选择“是”，则风险不匹配客户也可进行签约；若选择“否”，只有风险匹配客户才可进行签约'}
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                ：
                            </p>
                            <Radio.Group
                                value={riskMismatch}
                                onChange={(e) => this._handleChange(e, 'isAllowedSignUp', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={7}>
                            <p>
                                投资者权限不足，投资者列表是否展示该产品：
                            </p>
                            <Radio.Group
                                value={showStatus}
                                onChange={(e) => this._handleChange(e, 'showStatus', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        {/* <Col span={7}>
                            <p>是否需要上传证件照：</p>
                            <Radio.Group
                                value={cardStatus}
                                onChange={(e) => this._handleChange(e, 'idPhoto')}
                            >
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col> */}
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>
                                认申购流程是否需要审核&nbsp;
                                <Tooltip
                                    placement="top"
                                    title={'若选择“是”，则所有客户认申购流程都需要管理人审核；若选择“否”，除了做普通双录的客户，其他客户认申购都无需审核；'}
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                ：
                            </p>
                            <Radio.Group
                                value={signAuditStatus}
                                onChange={(e) => this._handleChange(e, 'isSignAuditStatus', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={9}>
                            <p>
                                赎回流程是否需要审核&nbsp;
                                <Tooltip
                                    placement="top"
                                    title={'若选择“是”，则所有客户赎回流程都需要管理人审核；若选择“否”，则无需审核'}
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                ：
                            </p>
                            <Radio.Group
                                value={redeemAuditStatus}
                                onChange={(e) => this._handleChange(e, 'isRedeemAuditStatus', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={7}>
                            <p>
                                冷静期计算方式&nbsp;
                                <Tooltip
                                    placement="top"
                                    title={'手动开启冷静期：根据签约时间和填写的打款时间自动计算冷静期；对接资金流水开冷静期：根据托管下行到底资金流水自动开启冷静期'}
                                >
                                    <InfoCircleOutlined />
                                </Tooltip>
                                ：
                            </p>
                            <Radio.Group
                                value={calmCalcType}
                                onChange={(e) => this._handleChange(e, 'coolPeriod', 'UniqueSigning')}
                            >
                                <Radio value={0}>客户手动开启冷静期</Radio><br />
                                <Radio value={1}>对接资金流水自动开启冷静期</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>申购银行卡是否允许修改：</p>
                            <Radio.Group
                                value={bankCardStatus}
                                onChange={(e) => this._handleChange(e, 'isEditBank', 'UniqueSigning')}
                            >
                                <Radio value={1}>可修改</Radio><br />
                                <Radio value={0}>不可修改</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            // (doubleRecord !== 0 && defaultDoubleCheckType) &&
                            <Col span={9}>
                                <p>双录方式：</p>
                                <Radio.Group
                                    value={doubleCheckType}
                                    onChange={(e) => this._handleChange(e, 'isDoubleCheckType', 'UniqueSigning')}
                                >
                                    {Number(defaultDoubleCheckType) === 1 && <Radio value={1}>普通双录</Radio>}
                                    {Number(defaultDoubleCheckType) === 2 && <Radio value={2}>AI智能双录</Radio>}
                                    {
                                        Number(defaultDoubleCheckType) === 3 &&
                                        <div>
                                            <Radio value={1}>普通双录</Radio><br />
                                            <Radio value={2}>AI智能双录</Radio>
                                        </div>
                                    }
                                    {/* <Radio value={3}>同时支持</Radio> */}
                                </Radio.Group>
                            </Col>
                        }
                    </Row>

                    <Row gutter={[8, 25]}>

                        <Col span={8}>
                            <p>认申购流程是否增加二次审核:</p>
                            <Radio.Group
                                value={secondReviewCheck}
                                onChange={(e) => this._handleChange(e, 'secondReviewCheck', 'UniqueSigning')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>普通合格投资者冷静期配置：</p>
                            <Space direction="vertical">
                                <div>
                                    <span>&emsp;风险匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={matchCalmTime}
                                        onChange={(e) => this._handleChange(e, 'riskMatching', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTime}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTime', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                            </Space>
                        </Col>
                        <Col span={9}>
                            <p>专业合格投资者冷静期配置：</p>
                            <Space direction="vertical">
                                <div>
                                    <span>&emsp;风险匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={matchCalmTimeMajor}
                                        onChange={(e) => this._handleChange(e, 'matchCalmTimeMajor', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTimeMajor}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTimeMajor', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                            </Space>
                        </Col>
                        <Col span={7}>
                            <p>特殊合格投资者冷静期配置：</p>
                            <Space direction="vertical">
                                <div>
                                    <span>&emsp;风险匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={matchCalmTimeSpecial}
                                        onChange={(e) => this._handleChange(e, 'matchCalmTimeSpecial', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTimeSpecial}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTimeSpecial', 'UniqueSigning')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueSigning', 0)} ><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueSigning', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col >
                    </Row >
                </Card >
                <Card title="默认投资者端展示设置(对所有客户生效）" className={styles.customerConfig}>
                    <Row gutter={[8, 25]}>
                        {/* <Col span={8}>
                            <p>收益数据展示（多选）：</p>
                            <Checkbox.Group
                                value={incomeDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'income')}
                            >
                                <Checkbox value={1}>成立以来收益&emsp;&emsp;</Checkbox>
                                <Checkbox value={2}>今年收益</Checkbox><br />
                                <Checkbox value={3}>平均年化收益</Checkbox>
                                <Checkbox value={4}>复利年化收益</Checkbox>
                            </Checkbox.Group>
                        </Col> */}
                        <Col span={8}>
                            <p>是否需要展示总收益：</p>
                            <Radio.Group
                                value={referIncomeDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'profit', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={9}>
                            <p>是否需要展示总成本：</p>
                            <Radio.Group
                                value={totalCostDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'totalCostDisplayStatus', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={7}>
                            <p>
                                份额计算方式：
                            </p>
                            <Radio.Group
                                value={shareCalcStatus}
                                onChange={(e) => this._handleChange(e, 'share', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>根据客户交易和分红记录自动计算</Radio><br />
                                <Radio value={0}>对接托管份额或手动维护份额</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>产品预约是否需要审核：</p>
                            <Radio.Group
                                disabled
                                value={isApplyNeedCheck}
                                onChange={(e) => this._handleChange(e, 'applyNeedCheckInfo', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        {/* <Col span={9}>
                            <p>签约前是否需要预约：</p>
                            <Radio.Group
                                value={isNeedApplyBeforeSign}
                                onChange={(e) => this._handleChange(e, 'isNeedApplyBeforeSign', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col> */}
                        <Col span={7}>
                            <p>资产证明是否需要审核：</p>
                            <Radio.Group
                                value={isAssetNeedCheck}
                                onChange={(e) => this._handleChange(e, 'isNeedCheckInfo', 'UniqueConfiguration')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={7}>
                            <p>成本计算方式：</p>
                            <Radio.Group
                                value={costCalType}
                                onChange={(e) => this._handleChange(e, 'costCalType', 'UniqueConfiguration')}
                            >
                                <Radio value={0}>认申赎确认金额累加</Radio><br />
                                <Radio value={1}>认申赎确认金额累加 - 现金分红</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueConfiguration', 0)} ><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueConfiguration', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col>
                    </Row>
                </Card>
                <Card className={styles.riskManagement} title="默认风控配置">
                    <Row>
                        <Col span={8}>
                            <p>
                                预警线报警配置:
                            </p>
                            <Radio.Group
                                value={warnLineType}
                                onChange={(e) => this._handleChange(e, 'isWarnLineType', 'UniqueRiskControl')}
                            >
                                <Radio value={1}>比例</Radio>
                                <Radio value={2}>数值</Radio>
                            </Radio.Group><br />
                            <InputNumber
                                step={0.1}
                                min={0}
                                style={{ marginTop: 10, marginBottom: 5 }}
                                value={warnLine}
                                onChange={(e) => this._handleChange(e, 'isWarnLine', 'UniqueRiskControl')}
                            />
                            <br />
                            <span style={{ color: '#F5222D' }}>产品净值预警线基础上触发报警的数值配置</span>
                        </Col>
                        <Col span={9}>
                            <p>
                                止损线报警配置:
                            </p>
                            <Radio.Group
                                value={stopLineType}
                                onChange={(e) => this._handleChange(e, 'isStopLineType', 'UniqueRiskControl')}
                            >
                                <Radio value={1}>比例</Radio>
                                <Radio value={2}>数值</Radio>
                            </Radio.Group><br />
                            <InputNumber
                                step={0.1}
                                min={0}
                                style={{ marginTop: 10, marginBottom: 5 }}
                                value={stopLine}
                                onChange={(e) => this._handleChange(e, 'isStopLine', 'UniqueRiskControl')}
                            />
                            <br />
                            <span style={{ color: '#F5222D' }}>产品净值止损线基础上触发报警的数值配置</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <p style={{ margin: 0, fontSize: '12px' }}>按比例的计算公式：报警净值=预警线*比例+预警线；止损净值=止损线*比率+止损线。比如预警线=0.7，比例0.1，那么报警净值=0.7*0.1+0.7=0.77</p>
                            <p style={{ margin: 0, fontSize: '12px' }}>按数值的计算公式：报警净值=预警线+数值；止损净值=止损线+数值。比如预警线=0.7，数值0.1，那么报警净值=0.7+0.1=0.8</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col offset={16} span={8} >
                            <Button type="primary" onClick={() => this._onOk('UniqueRiskControl', 0)} ><Tooltip title="临时保存：对现有的产品不生效，对以后新创建的产品生效">
                                临时保存{' '}
                                <QuestionCircleOutlined />
                            </Tooltip></Button>
                            <Button type="primary" onClick={() => this._onOk('UniqueRiskControl', 1)} style={{ marginLeft: 8 }}>应用到所有产品</Button>
                        </Col>
                    </Row>
                </Card>
                <Card
                    className={styles.customProduct}
                    title="自定义产品系列"
                    extra="可以自定义产品系列名称，添加好后请在产品要素里选择，投资人可根据系列搜索产品"
                >
                    <Form
                        name="basic"
                        ref={this.formRef}
                        className={styles.formWrapper}
                        initialValues={{
                            productSeries: [{ codeText: '' }]
                        }}
                        {...formLayout}
                    >
                        <Form.List name="productSeries">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Row gutter={8} key={field.fieldKey}>

                                            <Col span={10}>
                                                <FormItem
                                                    {...field}
                                                    label={`产品系列名称${i + 1}`}
                                                    name={[field.name, 'codeText']}
                                                // rules={[
                                                //     {
                                                //         required: true,
                                                //         message: `请输入产品系列名称${i + 1}`
                                                //     }
                                                // ]}
                                                >
                                                    <Input autoComplete="off" placeholder="请输入产品系列名称" />
                                                </FormItem>
                                                <Space>
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => { add(); }}
                                                    >
                                                        <PlusOutlined />
                                                    </span>
                                                    {fields.length > 1 ? (
                                                        <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                            <CloseOutlined />
                                                        </span>
                                                    ) : null}
                                                </Space>
                                            </Col>
                                        </Row>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    </Form>
                    <Row>
                        <Col offset={18} span={6} >
                            <Button type="primary" onClick={() => this._onOk('UniqueCustomization', 1)} >保存</Button>

                        </Col>
                    </Row>
                </Card>
                {/* <Space>
                    {
                        this.props.authEdit &&
                        <Button type="primary" onClick={this._onOk} >确定</Button>
                    }
                </Space> */}
            </div >
        );
    }
}
export default Tab1;



