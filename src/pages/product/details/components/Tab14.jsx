/*
 * @description: 产品配置
 * @Author: tangsc
 * @Date: 2020-11-02 13:28:08
 */
import React, { PureComponent } from 'react';
import {
    Row,
    Col,
    Card,
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
import styles from './styles/Tab10.less';
import { getRandomKey } from '@/utils/utils';
import { connect, history } from 'umi';
import { InfoCircleOutlined } from '@ant-design/icons';

// 获取Select组件option选项
const { Option } = Select;

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


@connect(({ productDetails, loading }) => ({
    loading: loading.effects['productDetails/saveFundSetting']
}))
class Tab14 extends PureComponent {
    state = {
        incomeDisplayStatus: [1, 4],                    // 收益数据展示 1:成立以来收益 2:今年收益 3: 平均年化收益  4： 复利年化收益 默认选择1、2
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
        // signType: 1,                                    // 合同电子签:0:是 1:否(需线下签)
        signAuditStatus: 1,                             // 认申购流程是否需要审核：0 否，1 是
        redeemAuditStatus: 1,                           // 赎回流程是否需要审核：0 否，1 是
        bankCardStatus: 0,                              // 申购银行卡是否可修改：0 否，1 是
        warnLineType: 1,                                // 预警线报警配置类型（1:比例 2:数值）
        warnLine: 0,                                    // 预警线报警配置
        stopLineType: 1,                                // 止损线报警配置类型（1:比例 2:数值）
        stopLine: 0,                                    // 止损线报警配置
        matchCalmTimeMajor: 0,
        notMatchCalmTimeMajor: 0,
        matchCalmTimeSpecial: 0,
        notMatchCalmTimeSpecial: 0,
        netValueType: 1,
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
        const { params } = this.props;
        const { productId } = params;
        if (productId !== '0') {
            this._editSearch();
        }
        // dispatch({
        //     type: 'productDetails/queryFundSetting',
        //     payload: {
        //         productId
        //     }
        // })
    }

    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = () => {
        const { dispatch, params } = this.props;
        const { productId } = params;
        dispatch({
            type: 'productDetails/queryFundSetting',
            payload: {
                productId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        this.setState({
                            ...data
                        });
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
    _handleChange = (e, type) => {
        let tempObj = {};
        switch (type) {
            case 'income':
                tempObj.incomeDisplayStatus = e;
                break;
            case 'trend':
                tempObj.trendChartStatus = e;
                break;
            case 'compare':
                tempObj.standard = e;
                break;
            case 'profit':
                tempObj.referIncomeDisplayStatus = e.target.value;
                break;
            case 'share':
                tempObj.shareCalcStatus = e.target.value;
                break;
            case 'productRule':
                tempObj.openRule = e.target.value;
                break;
            case 'frequency':
                tempObj.frequency = e.target.value;
                break;
            case 'timeWeek':
                tempObj.week = e;
                break;
            case 'timeMonth':
                tempObj.month = e;
                break;
            case 'otherDate':
                tempObj.otherDay = e;
                break;
            case 'setSafeRate':
                tempObj.safeRate = e;
                break;
            case 'riskMatching':
                tempObj.matchCalmTime = e;
                break;
            case 'notMatchCalmTime':
                tempObj.notMatchCalmTime = e;
                break;
            case 'matchCalmTimeMajor':
                tempObj.matchCalmTimeMajor = e;
                break;
            case 'notMatchCalmTimeMajor':
                tempObj.notMatchCalmTimeMajor = e;
                break;
            case 'matchCalmTimeSpecial':
                tempObj.matchCalmTimeSpecial = e;
                break;
            case 'notMatchCalmTimeSpecial':
                tempObj.notMatchCalmTimeSpecial = e;
                break;
            case 'ordinaryPeopleVideoStatus':
                tempObj.ordinaryPeopleVideoStatus = e.target.value;
                break;
            case 'ordinaryInstitutionsVideoStatus':
                tempObj.ordinaryInstitutionsVideoStatus = e.target.value;
                break;
            case 'ordinaryProductsVideoStatus':
                tempObj.ordinaryProductsVideoStatus = e.target.value;
                break;
            case 'professionalPeopleVideoStatus':
                tempObj.professionalPeopleVideoStatus = e.target.value;
                break;
            case 'professionalInstitutionsVideoStatus':
                tempObj.professionalInstitutionsVideoStatus = e.target.value;
                break;
            case 'professionalProductsVideoStatus':
                tempObj.professionalProductsVideoStatus = e.target.value;
                break;
            case 'specialPeopleVideoStatus':
                tempObj.specialPeopleVideoStatus = e.target.value;
                break;
            case 'specialInstitutionsVideoStatus':
                tempObj.specialInstitutionsVideoStatus = e.target.value;
                break;
            case 'specialProductsVideoStatus':
                tempObj.specialProductsVideoStatus = e.target.value;
                break;
            case 'ordinaryPeopleVisitStatus':
                tempObj.ordinaryPeopleVisitStatus = e.target.value;
                break;
            case 'ordinaryInstitutionsVisitStatus':
                tempObj.ordinaryInstitutionsVisitStatus = e.target.value;
                break;
            case 'ordinaryProductsNoticeAndWarningLetter':
                tempObj.ordinaryProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'ordinaryProductsVisitStatus':
                tempObj.ordinaryProductsVisitStatus = e.target.value;
                break;
            case 'professionalPeopleVisitStatus':
                tempObj.professionalPeopleVisitStatus = e.target.value;
                break;
            case 'professionalInstitutionsVisitStatus':
                tempObj.professionalInstitutionsVisitStatus = e.target.value;
                break;
            case 'professionalProductsVisitStatus':
                tempObj.professionalProductsVisitStatus = e.target.value;
                break;
            case 'specialPeopleVisitStatus':
                tempObj.specialPeopleVisitStatus = e.target.value;
                break;
            case 'specialInstitutionsVisitStatus':
                tempObj.specialInstitutionsVisitStatus = e.target.value;
                break;
            case 'specialProductsVisitStatus':
                tempObj.specialProductsVisitStatus = e.target.value;
                break;
            case 'ordinaryPeopleNoticeAndWarningLetter':
                tempObj.ordinaryPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'ordinaryInstitutionsNoticeAndWarningLetter':
                tempObj.ordinaryInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalPeopleNoticeAndWarningLetter':
                tempObj.professionalPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalInstitutionsNoticeAndWarningLetter':
                tempObj.professionalInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'professionalProductsNoticeAndWarningLetter':
                tempObj.professionalProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialPeopleNoticeAndWarningLetter':
                tempObj.specialPeopleNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialInstitutionsNoticeAndWarningLetter':
                tempObj.specialInstitutionsNoticeAndWarningLetter = e.target.value;
                break;
            case 'specialProductsNoticeAndWarningLetter':
                tempObj.specialProductsNoticeAndWarningLetter = e.target.value;
                break;
            case 'subscribeVisitStatus':
                tempObj.subscribeVisitStatus = e.target.value;
                break;
            case 'coolPeriod':
                tempObj.calmCalcType = e.target.value;
                break;
            case 'idPhoto':
                tempObj.cardStatus = e.target.value;
                break;
            case 'isAllowedSignUp':
                tempObj.riskMismatch = e.target.value;
                break;
            case 'isDoubleRecord':
                tempObj.doubleRecord = e.target.value;
                break;
            case 'isDoubleCheckType':
                tempObj.doubleCheckType = e.target.value;
                break;
            case 'isSignType':
                tempObj.signType = e.target.value;
                break;
            case 'isSignAuditStatus':
                tempObj.signAuditStatus = e.target.value;
                break;
            case 'isEditBank':
                tempObj.bankCardStatus = e.target.value;
                break;
            case 'isRedeemAuditStatus':
                tempObj.redeemAuditStatus = e.target.value;
                break;
            case 'isWarnLineType':
                tempObj.warnLineType = e.target.value;
                break;
            case 'isWarnLine':
                tempObj.warnLine = e;
                break;
            case 'isStopLineType':
                tempObj.stopLineType = e.target.value;
                break;
            case 'isStopLine':
                tempObj.stopLine = e;
                break;
            case 'netValueType':
                tempObj.netValueType = e.target.value;
                break;
            case 'secondReviewCheck':
                tempObj.secondReviewCheck = e.target.value;
                break;
            default:
                break;
        }
        this.setState({
            ...tempObj
        });
    }

    /**
     * @description: 确定提交
     */
    _onOk = () => {
        const { dispatch, params } = this.props;
        const { frequency } = this.state;
        const { productId } = params;

        // 日频、周频、月频对应的入参
        let tempObj = {};
        if (frequency === 1) {
            const { week, month, otherDay, ...obj } = this.state;
            tempObj = obj;
        } else if (frequency === 2) {
            const { month, ...obj } = this.state;
            tempObj = obj;
        } else {
            const { week, ...obj } = this.state;
            tempObj = obj;
        }
        tempObj.productId = productId;
        // 新增
        if (productId === '0') {
            openNotification('warning', '提醒', '请先创建产品');
        } else {
            dispatch({
                type: 'productDetails/saveFundSetting',
                payload: {
                    ...tempObj
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '配置成功', 'topRight');
                        this._editSearch();
                    } else {
                        const warningText = res.message || res.data || '配置失败！';
                        openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    }
                }
            });
        }
    }

    _GoBack = () => {
        history.push({
            pathname: '/product/list'
        });
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
            netValueType,
            secondReviewCheck
        } = this.state;

        const { loading } = this.props;
        // eslint-disable-next-line no-undef
        const defaultDoubleCheckType = sessionStorage.getItem('defaultDoubleCheckType');

        return (
            <div className={styles.container}>
                <Card className={styles.dataShow} title="展示数据设置">
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>收益数据展示（多选）：</p>
                            <Checkbox.Group
                                value={incomeDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'income')}
                            >
                                <Checkbox value={5}>投资经理</Checkbox>
                                <Checkbox value={0}>单位净值</Checkbox>
                                <Checkbox value={1}>成立以来收益&emsp;&emsp;</Checkbox>
                                <Checkbox value={7}>周收益</Checkbox>
                                <Checkbox value={6}>累计净值</Checkbox>
                                <Checkbox value={2}>今年收益</Checkbox><br />
                                <Checkbox value={3}>平均年化收益</Checkbox>
                                <Checkbox value={4}>复利年化收益</Checkbox>
                            </Checkbox.Group>
                        </Col>
                        <Col span={9}>
                            <p>比较基准选择：</p>
                            <Select
                                placeholder="请选择"
                                value={standard}
                                allowClear
                                onChange={(e) => this._handleChange(e, 'compare')}
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
                        <Col span={7}>
                            <p>无风险收益（十年期国债）：</p>
                            <InputNumber
                                disabled={BASE_PATH.NoRiskDisable !== 1}
                                // precision={0.01}
                                step={0.0001}
                                min={0}
                                value={safeRate}
                                onChange={(e) => this._handleChange(e, 'setSafeRate')}
                            />&nbsp;
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        {/* <Col span={8}>
                            <p>是否需要展示参考收益：</p>
                            <Radio.Group
                                value={referIncomeDisplayStatus}
                                onChange={(e) => this._handleChange(e, 'profit')}
                            >
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={9}>
                            <p>
                                份额计算方式
                            </p>
                            <Radio.Group
                                value={shareCalcStatus}
                                onChange={(e) => this._handleChange(e, 'share')}
                            >
                                <Radio value={1}>根据客户交易和分红记录自动计算</Radio>
                                <Radio value={0}>对接托管份额</Radio>
                            </Radio.Group>
                        </Col> */}
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
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>净值频率选择（对客户端）：</p>
                            <Radio.Group
                                value={frequency}
                                onChange={(e) => this._handleChange(e, 'frequency')}
                            >
                                <Radio value={1}>日频</Radio>
                                <Radio value={2}>周频</Radio>
                                <Radio value={3}>月频</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={8}>
                            <p>净值计算方式：</p>
                            <Radio.Group
                                value={netValueType}
                                onChange={(e) => this._handleChange(e, 'netValueType')}
                            >
                                <Radio value={1}>累计净值</Radio>
                                <Radio value={2}>复权净值</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            frequency === 2 ?
                                <Col span={9}>
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
                                        allowClear
                                        value={week}
                                        onChange={(e) => this._handleChange(e, 'timeWeek')}
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
                                    <Col span={9}>
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
                                            allowClear
                                            value={month}
                                            onChange={(e) => this._handleChange(e, 'timeMonth')}
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
                            <Col span={7}>
                                <p>其他披露日期（多选）：</p>
                                <Checkbox.Group
                                    value={otherDay}
                                    onChange={(e) => this._handleChange(e, 'otherDate')}
                                >
                                    <Checkbox value={1}>分红日披露</Checkbox>
                                    <Checkbox value={2}>业绩计提日披露</Checkbox>
                                    <Checkbox value={3}>开放日披露</Checkbox>
                                </Checkbox.Group>
                            </Col>
                        }
                    </Row>
                </Card>
                <Card className={styles.contractConfig} title="产品签约配置">
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
                        <Col span={8}>
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
                                onChange={(e) => this._handleChange(e, 'coolPeriod')}
                            >
                                <Radio value={0}>客户手动开启冷静期</Radio><br />
                                <Radio value={1}>对接资金流水自动开启冷静期</Radio>
                            </Radio.Group>
                        </Col>
                        <Col span={8}>
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
                                onChange={(e) => this._handleChange(e, 'isAllowedSignUp')}
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
                                onChange={(e) => this._handleChange(e, 'isSignAuditStatus')}
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
                                onChange={(e) => this._handleChange(e, 'isRedeemAuditStatus')}
                            >
                                <Radio value={1}>是</Radio><br />
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                    <Row gutter={[8, 25]}>
                        <Col span={8}>
                            <p>申购银行卡是否允许修改：</p>
                            <Radio.Group
                                value={bankCardStatus}
                                onChange={(e) => this._handleChange(e, 'isEditBank')}
                            >
                                <Radio value={1}>可修改</Radio><br />
                                <Radio value={0}>不可修改</Radio>
                            </Radio.Group>
                        </Col>
                        {
                            // (doubleRecord !== 0 && videoStatus === 1 && defaultDoubleCheckType) &&
                            <Col span={7}>
                                <p>双录方式：</p>
                                <Radio.Group
                                    value={doubleCheckType}
                                    onChange={(e) => this._handleChange(e, 'isDoubleCheckType')}
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
                                onChange={(e) => this._handleChange(e, 'secondReviewCheck')}
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
                                        onChange={(e) => this._handleChange(e, 'riskMatching')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTime}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTime')}
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
                                        onChange={(e) => this._handleChange(e, 'matchCalmTimeMajor')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTimeMajor}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTimeMajor')}
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
                                        onChange={(e) => this._handleChange(e, 'matchCalmTimeSpecial')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                                <div>
                                    <span>风险不匹配情况下：</span>
                                    <InputNumber
                                        min={0}
                                        value={notMatchCalmTimeSpecial}
                                        onChange={(e) => this._handleChange(e, 'notMatchCalmTimeSpecial')}
                                    />&emsp;
                                    <span>小时</span>
                                </div>
                            </Space>
                        </Col>
                    </Row>
                </Card>
                <Card title="客户展示设置" className={styles.customerConfig}>
                    <Row gutter={[8, 25]}>

                        <Col span={8}>
                            <p>
                                份额计算方式：
                            </p>
                            <Radio.Group
                                value={shareCalcStatus}
                                onChange={(e) => this._handleChange(e, 'share')}
                            >
                                <Radio value={1}>根据客户交易和分红记录自动计算</Radio><br />
                                <Radio value={0}>对接托管份额或人工手动维护</Radio>
                            </Radio.Group>
                        </Col>
                    </Row>
                </Card>
                <Card className={styles.riskManagement} title="风控配置">
                    <Row>
                        <Col span={8}>
                            <p>
                                预警线报警配置：
                            </p>
                            <Radio.Group
                                value={warnLineType}
                                onChange={(e) => this._handleChange(e, 'isWarnLineType')}
                            >
                                <Radio value={1}>比例</Radio>
                                <Radio value={2}>数值</Radio>
                            </Radio.Group><br />
                            <InputNumber
                                step={0.1}
                                min={0}
                                style={{ marginTop: 10, marginBottom: 5 }}
                                value={warnLine}
                                onChange={(e) => this._handleChange(e, 'isWarnLine')}
                            />
                            <br />
                            <span style={{ color: '#F5222D', fontSize: '12px' }}>产品净值预警线基础上触发报警的数值配置</span>
                        </Col>
                        <Col span={9}>
                            <p>
                                止损线报警配置:
                            </p>
                            <Radio.Group
                                value={stopLineType}
                                onChange={(e) => this._handleChange(e, 'isStopLineType')}
                            >
                                <Radio value={1}>比例</Radio>
                                <Radio value={2}>数值</Radio>
                            </Radio.Group><br />
                            <InputNumber
                                step={0.1}
                                min={0}
                                style={{ marginTop: 10, marginBottom: 5 }}
                                value={stopLine}
                                onChange={(e) => this._handleChange(e, 'isStopLine')}
                            />
                            <br />
                            <span style={{ color: '#F5222D', fontSize: '12px' }}>产品净值止损线基础上触发报警的数值配置</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <p style={{ margin: 0, fontSize: '12px' }}>按比例的计算公式：报警净值=预警线*比例+预警线；止损净值=止损线*比率+止损线。比如预警线=0.7，比例0.1，那么报警净值=0.7*0.1+0.7=0.77</p>
                            <p style={{ margin: 0, fontSize: '12px' }}>按数值的计算公式：报警净值=预警线+数值；止损净值=止损线+数值。比如预警线=0.7，数值0.1，那么报警净值=0.7+0.1=0.8</p>
                        </Col>
                    </Row>
                </Card>
                {/* <Card
                    className={styles.customProduct}
                    title="自定义产品系列"
                    extra="可以自定义产品系列名称，添加好后请在产品要素里选择，投资人可根据系列搜索产品"
                >
                </Card> */}
                <Space>
                    {
                        this.props.authEdit &&
                        <Button type="primary" onClick={this._onOk} loading={loading}>确定</Button>
                    }
                    <Button onClick={this._GoBack} > 取消</Button>
                </Space>
            </div >
        );
    }
}
export default Tab14;
