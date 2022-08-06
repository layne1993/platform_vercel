/*
 * @description: 开放日详情
 * @Author: tangsc
 * @Date: 2020-10-30 15:09:53
 */
import React, { PureComponent, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { Form, Input, Checkbox, DatePicker, Select, Button, Space, Radio, Row, Col, notification, Modal } from 'antd';
import styles from './index.less';
import { XWOpenDayObject, XWOpenDayStatus } from '@/utils/publicData';
import { getParams, getRandomKey } from '@/utils/utils';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';
import { addIcon, deleteIcon } from '@/utils/staticResources';

// 定义表单Item
const FormItem = Form.Item;

// 获取Select组件option选项
const { Option } = Select;

// 获取日期组件
const { RangePicker } = DatePicker;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

// 表单布局
const formLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 8
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 16
        }
    }
};

// 频率选择时布局
const timeLayout = {
    labelCol: {
        span: 12
    },
    wrapperCol: {
        span: 11
    }
};

// 周频天数
const weekDay = [
    {
        label: '周一',
        value: 1
    },
    {
        label: '周二',
        value: 2
    },
    {
        label: '周三',
        value: 3
    },
    {
        label: '周四',
        value: 4
    },
    {
        label: '周五',
        value: 5
    }
];

// 月频天数
const monthDay = [];
for (let i = 1; i <= 31; i++) {
    monthDay.push({
        label: `${i}号`,
        value: i
    });
}
// 季频天数
const seasonDay = [];
for (let i = 1; i <= 92; i++) {
    seasonDay.push({
        label: `第${i}个交易日`,
        value: i
    });
}

// 半年度天数
const halfYearDay = [];
for (let i = 1; i <= 180; i++) {
    halfYearDay.push({
        label: `第${i}个交易日`,
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

@connect(({ openDayDetails, loading }) => ({
    openDayDetails,
    loading: loading.effects['openDayDetails/createOpenDay'],
    editLoaidng: loading.effects['openDayDetails/editOpenDay']
}))
class OpenDayDetails extends PureComponent {
    state = {
        type: 1,                      // 开放日时间 0：按频率  1：按时间 默认为1
        dayType: 0,                   // 开放日类型 0：临时开放日  1：固定开放日
        frequencyStatusType: 0,       // 周度：0  月度：1  季度：2  半年度： 3
        productList: [],              // 所有产品列表
        notificationRules: [],        // 通知规则
        signRules: [],                // 签约规则
        frequencyDetails: 2,          // 具体日期：1  按日期顺序选择：2 按周选择：3  按月选择：4
        monthFrequency: 1,             // 月度频率 具体日期：1  按日期顺序选择：2
        saveTradeTypes: [1],
        remainNum: 0
    };

    componentDidMount() {
        const { operateType } = this.props;
        const { notificationRules } = this.state;

        let tempRules = cloneDeep(notificationRules);
        this._getProductList();
        for (let i = 0; i <= 31; i++) {
            if (i === 0) {
                tempRules.push({
                    label: '当天',
                    value: 0
                });
            } else {
                tempRules.push({
                    label: `提前${i}天`,
                    value: i
                });
            }
        }
        this.setState({
            notificationRules: tempRules,
            signRules: tempRules
        }, () => {
            if (operateType === 'edit') {
                this._editSearch();
            }
        });

        if (this.formRef.current) {
            this.formRef.current.setFieldsValue({
                timeRanges: [{ detailedTime: '' }],
                posOrCountRanges: [{ posOrCount: undefined, tradingDays: undefined }],
                monthAndWeek: [{ weekDaysFir: undefined, weekOfMonthFir: undefined }],
                quarterAndMonth: [{ monthOfQuarter: undefined, posOrCountRanges1: [{ posOrCount: undefined, tradingDays: undefined }] }]
            });
        }
    }

    // 获取表单实例对象
    formRef = React.createRef();


    /**
     * @description: 查询所有产品（不分页）
     */
    _getProductList = () => {
        const { dispatch, proId } = this.props;
        dispatch({
            type: 'global/getAllProduct',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    }, () => {
                        this._setValues(proId);
                    });
                }
            }
        });
    }

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        console.log('values', values);
        // return;
        const { dispatch, onCancel, productDayId, operateType } = this.props;
        const { dayType, frequencyStatusType, frequencyDetails, monthFrequency } = this.state;
        const {
            productId,
            peopleNumber,
            productScale,
            timeRanges,
            weekDaysFir,
            monthDaysFir,
            monthAndWeek,
            quarterAndMonth,
            posOrCountRanges,
            // bookingRule,
            // bookingEndRule,
            // signingStartRules,
            // signingEndRules,
            // redemptionStartRules,
            // redemptionEndRules,
            ...tempObj
        } = values;
        if (values.bookingRule < values.bookingEndRule) {
            openNotification('warning', '提示', '预约规则开始时间不能小于结束时间', 'topRight');
            return;
        }
        if (values.signingStartRules < values.signingEndRules) {
            openNotification('warning', '提示', '认申购签约规则开始时间不能小于结束时间', 'topRight');
            return;
        }
        if (values.redemptionStartRules < values.redemptionEndRules) {
            openNotification('warning', '提示', '赎回签约规则开始时间不能小于结束时间', 'topRight');
            return;
        }

        let addEditParams = {};
        addEditParams.peopleNumber = Number(peopleNumber) || undefined;
        addEditParams.productScale = Number(productScale) || undefined;
        addEditParams.productId = (!!productId && productId.split(',')[0]) || undefined;
        addEditParams.productName = (!!productId && productId.split(',')[1]) || undefined;

        if (dayType === 1) {                // 固定开放日

            if (frequencyStatusType === 0) {         //  周度

                if (frequencyDetails === 1) {        // 周度-具体日期

                    addEditParams.weekDays = [
                        { days: weekDaysFir }
                    ];

                } else if (frequencyDetails === 2) {            // 周度-按日期顺序选择

                    addEditParams.tradeDays = this.paramsChange(posOrCountRanges);

                }
            } else if (frequencyStatusType === 1) {   //  月度

                if (frequencyDetails === 1) {          // 月度-具体日期

                    addEditParams.monthDays = [
                        { days: monthDaysFir }
                    ];

                } else if (frequencyDetails === 2) {            // 月度-按日期顺序选择

                    addEditParams.tradeDays = this.paramsChange(posOrCountRanges);

                } else if (frequencyDetails === 3) {            // 月度-按周选择

                    let tempArr = [];
                    Array.isArray(monthAndWeek) && monthAndWeek.forEach((item) => {
                        tempArr.push({
                            weekOfMonth: item.weekOfMonthFir,
                            days: item.weekDaysFir
                        });
                    });
                    addEditParams.weekDays = tempArr;

                }
            } else if (frequencyStatusType === 2) {   //  季度
                if (frequencyDetails === 2) {            // 按日期顺序选择

                    addEditParams.tradeDays = this.paramsChange(posOrCountRanges);

                } else if (frequencyDetails === 4) {     // 季度-按月选择
                    if (monthFrequency === 1) {          // 季度-按月选择-具体日期

                        let tempArr = [];
                        Array.isArray(quarterAndMonth) && quarterAndMonth.forEach((item) => {
                            tempArr.push(
                                {
                                    monthOfQuarter: item.monthOfQuarter,
                                    days: item.exactDays
                                }
                            );
                        });
                        addEditParams.monthDays = tempArr;

                    } else if (monthFrequency === 2) {      // 季度-按月选择-选择日期

                        let tempArr = [];
                        Array.isArray(quarterAndMonth) && quarterAndMonth.forEach((item) => {
                            !isEmpty(item.posOrCountRanges1) &&
                                item.posOrCountRanges1.forEach((innerItem) => {
                                    tempArr.push(
                                        {
                                            monthOfQuarter: item.monthOfQuarter,
                                            tradeType: innerItem.posOrCount,
                                            days: innerItem.tradingDays
                                        }
                                    );
                                });
                        });
                        addEditParams.tradeDays = tempArr;

                    }
                }

            } else if (frequencyStatusType === 3) {   //  半年度
                addEditParams.tradeDays = this.paramsChange(posOrCountRanges);
            }
            addEditParams = { ...addEditParams, ...tempObj };

        } else {
            let tempArr = [];
            // 临时开放日转换成时间戳;
            Array.isArray(timeRanges) && timeRanges.forEach((item) => {
                tempArr.push(
                    {
                        startTime: (item.detailedTime && new Date(`${moment(item.detailedTime[0]).format().split('T')[0]}T00:00:00`,).getTime()) || undefined,
                        endTime: (item.detailedTime && new Date(`${moment(item.detailedTime[1]).format().split('T')[0]}T23:59:59`,).getTime()) || undefined
                    }
                );
            });
            addEditParams.timeRanges = tempArr;
            addEditParams = { ...addEditParams, ...tempObj };
        }
        // console.log('addEditParams', addEditParams);
        if (operateType === 'add') {
            dispatch({
                type: 'openDayDetails/createOpenDay',
                payload: {
                    ...addEditParams,
                    tradeTypes:[addEditParams.tradeTypes]
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '新增成功', 'topRight');
                        onCancel();
                    } else {
                        const warningText = res.message || res.data || '新增失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    }
                }
            });
        } else {
            dispatch({
                type: 'openDayDetails/editOpenDay',
                payload: {
                    productDayId,
                    ...addEditParams,
                    tradeTypes:[addEditParams.tradeTypes]
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        openNotification('success', '提示', '编辑成功', 'topRight');
                        onCancel();
                    } else {
                        const warningText = res.message || res.data || '编辑失败！';
                        openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                    }
                }
            });
        }

    };


    /**
     * @description: 正数、倒数参数整理转换
     * @param {Array} 正数倒数开放日时间数组
     */
    paramsChange = (arr) => {
        let tempArray = [];
        Array.isArray(arr) && arr.forEach((item) => {
            tempArray.push({
                tradeType: item.posOrCount,
                days: item.tradingDays
            });
        });
        return tempArray;
    }
    /**
     * @description:开放日类型change
     * @param {Object} value 0：临时开放日  1：固定开放日
     */
    _onChangeType = (value) => {
        this.setState({
            dayType: value
        });

        if (value === 0) {
            this.formRef.current.setFieldsValue({
                postpone: 1,
                timeRanges: [{ detailedTime: '' }]
            });
        }
    }

    /**
     * @description: 选择频率
     * @param {*} e 周度：0  月度：1  季度：2  半年度： 3
     */
    _onChangeFrequency = (e) => {
        const { frequencyDetails, monthFrequency } = this.state;

        // 切换频率时 将频率类型置为按照日期顺序选择
        // this.formRef.current.setFieldsValue({
        //     frequencyType: 2
        // });
        // 新增逻辑
        if(e===4){
            this.formRef.current.setFieldsValue({
                frequencyType: 1
            });
        }else{
            this.formRef.current.setFieldsValue({
                frequencyType: 2
            });
        }

        this.setState({
            frequencyStatusType: e,
            frequencyDetails: 2
        });

        // 切换时清空选择的开放日时间数据
        this.formRef.current.setFieldsValue({
            weekDaysFir: undefined,
            monthDaysFir: undefined,
            monthAndWeek: [{ weekDaysFir: undefined, weekOfMonthFir: undefined }],
            posOrCountRanges: [{ posOrCount: undefined, tradingDays: undefined }],
            quarterAndMonth: [{ monthOfQuarter: undefined, posOrCountRanges1: [{ posOrCount: undefined, tradingDays: undefined }] }]
        });

        // 1.当月度选择具体日期时 默认为顺延  2.季度-按月选择-具体日期-> 默认为顺延
        if ((e === 1 && frequencyDetails === 1) || (e === 2 && frequencyDetails === 4 && monthFrequency === 1)) {
            this.formRef.current.setFieldsValue({ postpone: 1 });
        }
    }

    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = () => {
        const { dispatch, productDayId } = this.props;
        dispatch({
            type: 'openDayDetails/getOpenDayDetails',
            payload: {
                productDayId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (res.data) {
                        const { data } = res;
                        const { frequencyType, productId, productName, timeRanges, weekDays, tradeDays, monthDays, tradeTypes, ...tempObj } = data;
                        let setValuesObj = {};

                        dispatch({
                            type: 'openDayDetails/selectProductByCount',
                            payload: {
                                productId: productId
                            },
                            callback: (res) => {
                                if (res.code === 1008 && res.data) {
                                    this.setState({
                                        remainNum: res.data.data
                                    });
                                }
                            }
                        });

                        // 临时开放日 ->  开放日时间转换
                        let tempTimeRanges = [];
                        Array.isArray(timeRanges) &&
                            timeRanges.forEach((item) => {
                                tempTimeRanges.push(
                                    {
                                        detailedTime: (item.startTime && item.endTime) ? [moment(item.startTime), moment(item.endTime)] : [null, null]
                                    }
                                );
                            });
                        if (!isEmpty(tempTimeRanges)) setValuesObj.timeRanges = tempTimeRanges;


                        // 固定开放日
                        // 周度 -> 具体日期
                        let tempWeekDays = [];
                        if (data.frequencyStatus === 0 && !isEmpty(weekDays)) {
                            const { days } = weekDays[0];
                            tempWeekDays = days;
                        }
                        if (!isEmpty(tempWeekDays)) setValuesObj.weekDaysFir = tempWeekDays;

                        // 1、周度 -> 按日期顺序选择
                        // 2、月度 -> 按日期顺序选择
                        // 3、季度 -> 按日期顺序选择
                        let tempPosOrCountArr = [];
                        Array.isArray(tradeDays) &&
                            tradeDays.forEach((item) => {
                                tempPosOrCountArr.push({
                                    posOrCount: item.tradeType,
                                    tradingDays: item.days
                                });
                            });
                        if (!isEmpty(tempPosOrCountArr)) setValuesObj.posOrCountRanges = tempPosOrCountArr;

                        // 月度 -> 具体日期
                        let tempMonthDays = [];
                        if (data.frequencyStatus === 1 && !isEmpty(monthDays)) {
                            const { days } = monthDays[0];
                            tempMonthDays = days;
                        }
                        if (!isEmpty(tempMonthDays)) setValuesObj.monthDaysFir = tempMonthDays;

                        // 月度 -> 按周选择
                        let tempMonthWeeks = [];
                        (data.frequencyStatus === 1 && Array.isArray(weekDays)) &&
                            weekDays.forEach((item) => {
                                tempMonthWeeks.push({
                                    weekOfMonthFir: item.weekOfMonth,
                                    weekDaysFir: item.days
                                });
                            });
                        if (!isEmpty(tempMonthWeeks)) setValuesObj.monthAndWeek = tempMonthWeeks;


                        // 季度 -> 按月选择 -> 具体日期
                        let quarterTempArr = [];
                        (data.frequencyStatus === 2 && Array.isArray(monthDays) && data.monthFrequencyType === 1) &&
                            monthDays.forEach((item) => {
                                quarterTempArr.push({
                                    monthOfQuarter: item.monthOfQuarter,
                                    exactDays: item.days
                                });
                            });
                        if (!isEmpty(quarterTempArr)) setValuesObj.quarterAndMonth = quarterTempArr;
                        // console.log('quarterTempArr', quarterTempArr);


                        // 季度 -> 按月选择 -> 按日期顺序选择
                        if (data.frequencyStatus === 2 && data.monthFrequencyType === 2) setValuesObj.quarterAndMonth = this._transData(tradeDays);

                        let tempArr = [];
                        for (let i = 0; i <= data.noticeRule; i++) {
                            if (i === 0) {
                                tempArr.push({
                                    label: '当天',
                                    value: 0
                                });
                            } else {
                                tempArr.push({
                                    label: `提前${i}天`,
                                    value: i
                                });
                            }
                        }
                        if (!isEmpty(tempArr)) {
                            this.setState({
                                signRules: tempArr
                            });
                        }


                        this.setState({
                            frequencyDetails: frequencyType,            // 设置频率类型
                            monthFrequency: data.monthFrequencyType,        // 设置月频
                            frequencyStatusType: data.frequencyStatus,
                            dayType: data.openType,
                            saveTradeTypes: data.tradeTypes
                        });

                        this.formRef.current.setFieldsValue({
                            productId: `${Number(productId)},${productName}`,
                            frequencyType,
                            ...tempObj,
                            ...setValuesObj,
                            tradeTypes:tradeTypes.length>1 ? 1 : Number(tradeTypes),
                            notificationList:data.notificationList || []
                        });
                    }
                }
            }
        });
    }

    /**
     * @description: 季度->按月选择->选择日期 接口数据转化 进而页面渲染
     * @param {Array} arr 接口获取的数组
     */
    _transData = (arr) => {
        let tempArr = [];
        let firMonthArr = [];    // 第一个月数据
        let secMonthArr = [];    // 第二个月数据
        let thrMonthArr = [];    // 第三个月数据
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        if (!isEmpty(arr)) {
            arr1 = arr.filter((item) => {
                return item.monthOfQuarter === 1;
            });
            Array.isArray(arr1) &&
                arr1.forEach((item) => {
                    firMonthArr.push(
                        { posOrCount: item.tradeType, tradingDays: item.days }
                    );
                });
            arr2 = arr.filter((item) => {
                return item.monthOfQuarter === 2;
            });
            Array.isArray(arr2) &&
                arr2.forEach((item) => {
                    secMonthArr.push(
                        { posOrCount: item.tradeType, tradingDays: item.days }
                    );
                });
            arr3 = arr.filter((item) => {
                return item.monthOfQuarter === 3;
            });
            Array.isArray(arr3) &&
                arr3.forEach((item) => {
                    thrMonthArr.push(
                        { posOrCount: item.tradeType, tradingDays: item.days }
                    );
                });
            !isEmpty(firMonthArr) && tempArr.push({ monthOfQuarter: 1, posOrCountRanges1: firMonthArr });
            !isEmpty(secMonthArr) && tempArr.push({ monthOfQuarter: 2, posOrCountRanges1: secMonthArr });
            !isEmpty(thrMonthArr) && tempArr.push({ monthOfQuarter: 3, posOrCountRanges1: thrMonthArr });
        }
        return tempArr;

    }

    /**
     * @description: 设置当前产品名称
     * @param {*} id
     */
    _setValues = (id) => {
        const { productList } = this.state;
        let tempObj = productList.filter((item) => {
            return Number(id) === item.productId;
        });
        if (!isEmpty(tempObj)) {
            this.formRef.current.setFieldsValue({
                productId: `${Number(id)},${tempObj[0].productName}`
            });
        }
    }

    /**
     * @description: 通知规则change事件
     * @param {*}
     */
    _handleRules = (e) => {
        console.log('this.formRef.current.getFieldValue()', this.formRef.current.getFieldValue());
        const { bookingRule, bookingEndRule, signingStartRules, signingEndRules, redemptionStartRules, redemptionEndRules } = this.formRef.current.getFieldValue();
        if (bookingRule && bookingRule > e) {
            this.formRef.current.setFieldsValue({
                bookingRule: undefined
            });
        }
        if (bookingEndRule && bookingEndRule > e) {
            this.formRef.current.setFieldsValue({
                bookingEndRule: undefined
            });
        }
        if (signingStartRules && signingStartRules > e) {
            this.formRef.current.setFieldsValue({
                signingStartRules: undefined
            });
        }
        if (signingEndRules && signingEndRules > e) {
            this.formRef.current.setFieldsValue({
                signingEndRules: undefined
            });
        }
        if (redemptionStartRules && redemptionStartRules > e) {
            this.formRef.current.setFieldsValue({
                redemptionStartRules: undefined
            });
        }
        if (redemptionEndRules && redemptionEndRules > e) {
            this.formRef.current.setFieldsValue({
                redemptionEndRules: undefined
            });
        }
        let tempArr = [];
        for (let i = 0; i <= e; i++) {
            if (i === 0) {
                tempArr.push({
                    label: '当天',
                    value: 0
                });
            } else {
                tempArr.push({
                    label: `提前${i}天`,
                    value: i
                });
            }
        }
        this.setState({
            signRules: tempArr
        });
    }

    /**
     * @description: 频率选择
     * @param {*} e 具体日期：1  按日期顺序选择：2  按周选择：3  按月选择：4
     */
    _onFrequencyType = (e) => {
        const { frequencyStatusType, monthFrequency } = this.state;
        this.setState({
            frequencyDetails: e.target.value
        });

        // 切换时清空选择的开放日时间数据
        this.formRef.current.setFieldsValue({
            weekDaysFir: undefined,
            monthDaysFir: undefined,
            monthAndWeek: [{ weekDaysFir: undefined, weekOfMonthFir: undefined }],
            posOrCountRanges: [{ posOrCount: undefined, tradingDays: undefined }],
            quarterAndMonth: [{ monthOfQuarter: undefined, posOrCountRanges1: [{ posOrCount: undefined, tradingDays: undefined }] }]
        });

        // 1.当月度选择具体日期时 默认为顺延  2.季度-按月选择-具体日期-> 默认为顺延
        if ((frequencyStatusType === 1 && e.target.value === 1) || (frequencyStatusType === 2 && e.target.value === 4 && monthFrequency === 1)) {
            this.formRef.current.setFieldsValue({ postpone: 1 });
        }
    }

    /**
     * @description: 月度频率
     * @param {*} e 1:按具体日期 2:按日期顺序
     */
    _onMonthFrequency = (e) => {
        const { frequencyStatusType, frequencyDetails } = this.state;

        this.setState({
            monthFrequency: e.target.value
        });

        // 切换时清空选择的开放日时间数据
        this.formRef.current.setFieldsValue({
            quarterAndMonth: [{ monthOfQuarter: undefined, posOrCountRanges1: [{ posOrCount: undefined, tradingDays: undefined }] }]
        });

        // 季度-按月选择-具体日期-> 默认为顺延
        if (frequencyStatusType === 2 && frequencyDetails === 4 && e.target.value === 1) {
            this.formRef.current.setFieldsValue({ postpone: 1 });
        }
    }

    /**
     * @description: formList 新增
     * @param {*}
     */
    _addItem = (type, i) => {
        const list = this.formRef.current.getFieldValue(type);
        list.splice(i, 0, { monthOfQuarter: undefined, posOrCountRanges1: [{ posOrCount: undefined, tradingDays: undefined }] });
        this.formRef.current.setFieldsValue({ type: list });
    };

    /**
     * @description: formList 删除
     * @param {*}
     */
    _removeItem = (type, i) => {
        const list = this.formRef.current.getFieldValue(type);
        list.splice(i, 1);
        this.formRef.current.setFieldsValue({ type: list });
    }


    /**
     * @description: 不可选择日期
     * @param {*} current
     */
    _disabledDate = (current) => {
        return current && current < moment().startOf('day');
    }

    _changeTradeTypes = (e) => {
        console.log(e);
        this.setState({
            saveTradeTypes: [e.target.value]
        });
    }

    _handleChange = (e) => {
        const { dispatch } = this.props;
        let id = (!!e && e.split(',')[0]) || undefined;
        dispatch({
            type: 'openDayDetails/selectProductByCount',
            payload: {
                productId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        remainNum: res.data.data
                    });
                }
            }
        });
    }

    render() {
        const { dayType, frequencyStatusType, productList, notificationRules, signRules, frequencyDetails, monthFrequency, saveTradeTypes, remainNum } = this.state;
        console.log(this.state);
        const { editLoaidng, loading, modalVisible, onCancel, operateType } = this.props;
        return (
            <Modal
                width="800px"
                className={styles.container}
                title={operateType === 'edit' ? '编辑开放日' : '新增开放日'}
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    initialValues={{
                        startStatus: 1,
                        frequencyStatus: 0,
                        openScope: 1,
                        postpone: 0,
                        openType: 0,
                        frequencyType: 2,
                        monthFrequencyType: 1,
                        tradeTypes:1,
                        notificationList:[],
                        everyDay:1
                    }}
                    {...formLayout}
                >
                    <FormItem
                        label="启用状态"
                        name="startStatus"
                        rules={[
                            {
                                required: true,
                                message: '请选择启用状态'
                            }
                        ]}
                        extra="启用的开放日生效"
                    >
                        <Radio.Group>
                            <Radio value={1}>启用</Radio>
                            <Radio value={0}>不启用</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem
                        label="产品名称"
                        name="productId"
                        rules={[
                            {
                                required: true,
                                message: '请选择产品名称'
                            }
                        ]}
                    >
                        <Select
                            placeholder="请选择"
                            showSearch
                            defaultActiveFirstOption={false}
                            allowClear
                            notFoundContent={null}
                            onChange={this._handleChange}
                        >
                            {
                                !isEmpty(productList) &&
                                productList.map((item) => <Option key={item.productId} value={`${item.productId},${item.productName}`}>{item.productName}</Option>)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        label="开放日对象"
                        name="openScope"
                        rules={[
                            {
                                required: true,
                                message: '请选择开放日对象'
                            }
                        ]}
                        extra="本设置仅便于管理人内部记录使用，不涉及权限控制"
                    >
                        <Select placeholder="请选择"  allowClear>
                            {
                                XWOpenDayObject.map((item) => {
                                    return (
                                        <Option key={getRandomKey(5)} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })}
                        </Select>
                    </FormItem>
                    <FormItem
                        label="支持交易类型"
                        name="tradeTypes"
                        rules={[
                            {
                                required: true,
                                message: '请选择交易类型'
                            }
                        ]}
                    >
                        <Radio.Group onChange={this._changeTradeTypes}>
                            <Radio value={1}>认申购</Radio>
                            <Radio value={2}>赎回</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem
                        label="非交易日是否顺延"
                        name="postpone"
                        rules={[
                            {
                                required: true,
                                message: '请选择非交易日是否顺延'
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={2}>往前顺延</Radio>
                            <Radio value={1}>往后顺延</Radio>
                            <Radio value={0}>不顺延</Radio>
                        </Radio.Group>
                    </FormItem>
                    <FormItem
                        label="开放日类型"
                        name="openType"
                        rules={[
                            {
                                required: true,
                                message: '请选择开放日类型'
                            }
                        ]}
                    >
                        <Select placeholder="请选择" onChange={this._onChangeType}  allowClear>
                            {
                                XWOpenDayStatus.map((item) => {
                                    return (
                                        <Option key={getRandomKey(5)} value={item.value}>
                                            {item.label}
                                        </Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    {
                        dayType === 1 &&
                        <>
                            <FormItem
                                label="选择频率"
                                name="frequencyStatus"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择频率'
                                    }
                                ]}
                            >
                                <Select onChange={this._onChangeFrequency} placeholder="请选择"  allowClear>
                                    <Option value={0}>周度</Option>
                                    <Option value={1}>月度</Option>
                                    <Option value={2}>季度</Option>
                                    <Option value={3}>半年度</Option>
                                    <Option value={4}>每交易日</Option>
                                </Select>
                            </FormItem>
                            {
                                frequencyStatusType !== 3 &&
                                <FormItem
                                    label="频率类型"
                                    name="frequencyType"
                                    className={styles.chooseType}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择频率类型'
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={this._onFrequencyType}>
                                        {(frequencyStatusType === 0 || frequencyStatusType === 1 || frequencyStatusType===4) && <Radio value={1}>具体日期</Radio>}
                                        {
                                            frequencyStatusType!==4 && <Radio value={2}>按日期顺序选择</Radio>
                                        }
                                        {frequencyStatusType === 1 && <Radio value={3}>按周选择</Radio>}
                                        {frequencyStatusType === 2 && <Radio value={4}>按月选择</Radio>}
                                    </Radio.Group>
                                </FormItem>
                            }

                        </>

                    }
                    {
                        dayType === 0 &&
                        <Form.List name="timeRanges">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} className={styles.detailsTimeWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'detailedTime']}
                                                className={styles.innerTime}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择开放日时间${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <RangePicker style={{ width: '100%' }} format={dateFormat} disabledDate={this._disabledDate} />
                                            </FormItem>
                                            <Space>
                                                <span
                                                    className={styles.addIcon}
                                                    onClick={() => { add(); }}
                                                >
                                                    <img src={addIcon} style={{ width: 20 }} />
                                                </span>
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {/* 周度: 具体日期 */}
                    {
                        (dayType === 1 && frequencyStatusType === 0 && frequencyDetails === 1) &&
                        <FormItem
                            label="开放日时间"
                            name="weekDaysFir"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择开放日时间'
                                }
                            ]}
                        >
                            <Select placeholder="请选择" mode="multiple"  allowClear>
                                {
                                    !isEmpty(weekDay) &&
                                    weekDay.map((item) => {
                                        return (
                                            <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </FormItem>
                    }
                    {/* 周度: 按日期顺序选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 0 && frequencyDetails === 2) &&
                        <Form.List name="posOrCountRanges">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} className={styles.timeWrapper}>
                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'posOrCount']}
                                                className={styles.posOrCountdown}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择开放日时间${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择"  allowClear>
                                                    <Option key={0} value={1}>顺数</Option>
                                                    <Option key={1} value={2}>倒数</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem
                                                {...field}
                                                name={[field.name, 'tradingDays']}
                                                className={styles.tradingDay}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择交易日'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" mode="multiple"  allowClear>
                                                    {
                                                        weekDay.map((item) => {
                                                            return (
                                                                <Option key={item.value} value={item.value}>第{item.value}个交易日</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                            <Space>
                                                {fields.length < 2 ? (
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => { add(); }}
                                                    >
                                                        <img src={addIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}

                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>

                    }

                    {/* 月度: 具体日期 */}
                    {
                        (dayType === 1 && frequencyStatusType === 1 && frequencyDetails === 1) &&
                        <FormItem
                            label="开放日时间"
                            name="monthDaysFir"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择开放日时间'
                                }
                            ]}
                        >
                            <Select placeholder="请选择" mode="multiple"  allowClear>
                                {
                                    !isEmpty(monthDay) &&
                                    monthDay.map((item) => {
                                        return (
                                            <Option key={item.value} value={item.value}>{item.label}</Option>
                                        );
                                    })
                                }
                            </Select>
                        </FormItem>
                    }
                    {/* 月度: 按日期顺序选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 1 && frequencyDetails === 2) &&
                        <Form.List name="posOrCountRanges">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} className={styles.timeWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'posOrCount']}
                                                className={styles.posOrCountdown}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择开放日时间${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择"  allowClear>
                                                    <Option key={0} value={1}>顺数</Option>
                                                    <Option key={1} value={2}>倒数</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem
                                                {...field}
                                                name={[field.name, 'tradingDays']}
                                                className={styles.tradingDay}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择交易日'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" mode="multiple"  allowClear>
                                                    {
                                                        monthDay.map((item) => {
                                                            return (
                                                                <Option key={item.value} value={item.value}>第{item.value}个交易日</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                            <Space>
                                                {fields.length < 2 ? (
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => { add(); }}
                                                    >
                                                        <img src={addIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {/* 月度: 按周选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 1 && frequencyDetails === 3) &&
                        <Form.List name="monthAndWeek">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} className={styles.timeWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'weekOfMonthFir']}
                                                className={styles.posOrCountdown}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择具体周'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择"  allowClear>
                                                    <Option value={1}>第一周</Option>
                                                    <Option value={2}>第二周</Option>
                                                    <Option value={3}>第三周</Option>
                                                    <Option value={4}>第四周</Option>
                                                    <Option value={5}>第五周</Option>
                                                    <Option value={6}>第六周</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem
                                                {...field}
                                                name={[field.name, 'weekDaysFir']}
                                                className={styles.tradingDay}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择交易日'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" mode="multiple"  allowClear>
                                                    {
                                                        !isEmpty(weekDay) &&
                                                        weekDay.map((item) => {
                                                            return (
                                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                            <Space>
                                                <span
                                                    className={styles.addIcon}
                                                    onClick={() => { add(); }}
                                                >
                                                    <img src={addIcon} style={{ width: 20 }} />
                                                </span>
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {/* 季度: 按日期顺序选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 2 && frequencyDetails === 2) &&
                        <Form.List name="posOrCountRanges">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} className={styles.timeWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'posOrCount']}
                                                className={styles.posOrCountdown}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择开放日时间${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择"  allowClear>
                                                    <Option key={0} value={1}>顺数</Option>
                                                    <Option key={1} value={2}>倒数</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem
                                                {...field}
                                                name={[field.name, 'tradingDays']}
                                                className={styles.tradingDay}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择交易日'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" mode="multiple"  allowClear>
                                                    {
                                                        seasonDay.map((item) => {
                                                            return (
                                                                <Option key={item.value} value={item.value}>第{item.value}个交易日</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                            <Space>
                                                {fields.length < 2 ? (
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => { add(); }}
                                                    >
                                                        <img src={addIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {/* 季度: 按月选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 2 && frequencyDetails === 4) &&
                        <FormItem
                            label={'月度频率'}
                            name="monthFrequencyType"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择月度频率'
                                }
                            ]}
                        >
                            <Radio.Group onChange={(e) => this._onMonthFrequency(e)}>
                                <Radio value={1}>具体日期</Radio>
                                <Radio value={2}>选择日期</Radio>
                            </Radio.Group>
                        </FormItem>
                    }
                    {
                        (dayType === 1 && frequencyStatusType === 2 && frequencyDetails === 4) &&
                        <Form.List name="quarterAndMonth">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space key={field.key} style={{ display: 'block' }} className={styles.quarterWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`选择具体月${i + 1}`}
                                                name={[field.name, 'monthOfQuarter']}
                                                fieldKey={[field.fieldKey, 'monthOfQuarter']}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择具体月${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" onChange={this._handleMonthChange}  allowClear>
                                                    <Option value={1}>第一个月</Option>
                                                    <Option value={2}>第二个月</Option>
                                                    <Option value={3}>第三个月</Option>
                                                </Select>
                                            </FormItem>
                                            <Space className={styles.quarterSpace}>
                                                {fields.length < 3 ? (
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => {
                                                            this._addItem('quarterAndMonth', i + 1);
                                                        }}
                                                    >
                                                        <img src={addIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => this._removeItem('quarterAndMonth', i)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                            {/* 选择日期 */}
                                            {
                                                (monthFrequency === 2) &&
                                                <Form.List name={[field.name, 'posOrCountRanges1']}>
                                                    {(fields1, { add, remove }) => (
                                                        <>
                                                            {fields1.map((field1, i) => (
                                                                <Space gutter={8} key={`${field.key}${field1.key}`} className={styles.timeWrapper}>

                                                                    <FormItem
                                                                        {...field1}
                                                                        label={`开放日时间${i + 1}`}
                                                                        name={[field1.name, 'posOrCount']}
                                                                        className={styles.posOrCountdown}
                                                                        fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'posOrCount']}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: `请选择开放日时间${i + 1}`
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Select placeholder="请选择"  allowClear>
                                                                            <Option key={0} value={1}>顺数</Option>
                                                                            <Option key={1} value={2}>倒数</Option>
                                                                        </Select>
                                                                    </FormItem>
                                                                    <FormItem
                                                                        {...field1}
                                                                        name={[field1.name, 'tradingDays']}
                                                                        className={styles.tradingDay}
                                                                        fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'tradingDays']}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: '请选择交易日'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Select placeholder="请选择"  allowClear mode="multiple">
                                                                            {
                                                                                monthDay.map((item) => {
                                                                                    return (
                                                                                        <Option key={item.value} value={item.value}>第{item.value}个交易日</Option>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </FormItem>
                                                                    <Space>
                                                                        {fields1.length < 2 ? (
                                                                            <span
                                                                                className={styles.addIcon}
                                                                                onClick={() => { add(); }}
                                                                            >
                                                                                <img src={addIcon} style={{ width: 20 }} />
                                                                            </span>
                                                                        ) : null}
                                                                        {fields1.length > 1 ? (
                                                                            <span className={styles.delIcon} onClick={() => remove(field1.name)}>
                                                                                <img src={deleteIcon} style={{ width: 20 }} />
                                                                            </span>
                                                                        ) : null}
                                                                    </Space>
                                                                </Space>
                                                            ))}
                                                        </>
                                                    )}
                                                </Form.List>
                                            }
                                            {/* 具体日期 */}
                                            {
                                                (monthFrequency === 1) &&
                                                <FormItem
                                                    {...field}
                                                    label={`开放日时间${i + 1}`}
                                                    name={[field.name, 'exactDays']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: `请选择开放日时间${i + 1}`
                                                        }
                                                    ]}
                                                >
                                                    <Select placeholder="请选择" mode="multiple"  allowClear>
                                                        {
                                                            !isEmpty(monthDay) &&
                                                            monthDay.map((item) => {
                                                                return (
                                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                            }
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {/* 半年度: 按日期顺序选择 */}
                    {
                        (dayType === 1 && frequencyStatusType === 3) &&
                        <Form.List name="posOrCountRanges">
                            {(fields, { add, remove }) => (
                                <>
                                    {fields.map((field, i) => (
                                        <Space gutter={8} key={field.key} className={styles.timeWrapper}>

                                            <FormItem
                                                {...field}
                                                label={`开放日时间${i + 1}`}
                                                name={[field.name, 'posOrCount']}
                                                className={styles.posOrCountdown}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: `请选择开放日时间${i + 1}`
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择"  allowClear>
                                                    <Option key={0} value={1}>顺数</Option>
                                                    <Option key={1} value={2}>倒数</Option>
                                                </Select>
                                            </FormItem>
                                            <FormItem
                                                {...field}
                                                name={[field.name, 'tradingDays']}
                                                className={styles.tradingDay}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择交易日'
                                                    }
                                                ]}
                                            >
                                                <Select placeholder="请选择" mode="multiple"  allowClear>
                                                    {
                                                        halfYearDay.map((item) => {
                                                            return (
                                                                <Option key={item.value} value={item.value}>第{item.value}个交易日</Option>
                                                            );
                                                        })
                                                    }
                                                </Select>
                                            </FormItem>
                                            <Space>
                                                {fields.length < 2 ? (
                                                    <span
                                                        className={styles.addIcon}
                                                        onClick={() => { add(); }}
                                                    >
                                                        <img src={addIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                                {fields.length > 1 ? (
                                                    <span className={styles.delIcon} onClick={() => remove(field.name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Space>
                                    ))}
                                </>
                            )}
                        </Form.List>
                    }
                    {
                        (dayType === 1 && frequencyStatusType ===4) && <FormItem
                            label="开放日时间"
                            name="everyDay"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择开放日时间'
                                }
                            ]}
                                                                       >
                            <Select disabled placeholder="请选择">
                                {
                                    <Option value={1}>每交易日</Option>
                                }
                            </Select>
                        </FormItem>
                    }
                    <FormItem
                        label="通知规则"
                        name="noticeRule"
                        rules={[
                            {
                                required: true,
                                message: '请选择通知规则'
                            }
                        ]}
                    >
                        <Select placeholder="请选择" onChange={this._handleRules}  allowClear>
                            {
                                !isEmpty(notificationRules) &&
                                notificationRules.map((item) => {
                                    return (
                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>

                    <FormItem
                        label="通知客户方式"
                        name="notificationList"
                        rules={[
                            {
                                required: false,
                                message: '请选择通知规则'
                            }
                        ]}
                        extra={'仅通知持有份额大于0的客户'}
                    >
                        <Checkbox.Group>
                            <Checkbox value={1}>
                                        邮件
                            </Checkbox>
                            <Checkbox value={2}>
                                        短信
                            </Checkbox>
                        </Checkbox.Group>
                    </FormItem>
                    <Row className={styles.bookingRuleRow}>
                        <Col span={24} className={styles.bookingRuleStart}>
                            <FormItem
                                label="预约规则"
                                name="bookingRule"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择预约规则'
                                    }
                                ]}
                                extra="选择后投资者端可进行产品预约操作"
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={24} className={styles.bookingRuleEnd}>
                            <FormItem
                                name="bookingEndRule"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择预约规则'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={styles.bookingRuleRow}>
                        <Col span={24} className={styles.bookingRuleStart}>
                            <FormItem
                                label="认申购签约规则"
                                name="signingStartRules"
                                rules={[
                                    {
                                        required: saveTradeTypes.includes(1),
                                        message: '请选择认申购签约规则'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={24} className={styles.bookingRuleEnd}>
                            <FormItem
                                name="signingEndRules"
                                rules={[
                                    {
                                        required: saveTradeTypes.includes(1),
                                        message: '请选择认申购签约规则'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row className={styles.bookingRuleRow}>
                        <Col span={24} className={styles.bookingRuleStart}>
                            <FormItem
                                label="赎回签约规则"
                                name="redemptionStartRules"
                                rules={[
                                    {
                                        required: saveTradeTypes.includes(2),
                                        message: '请选择赎回签约规则'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={24} className={styles.bookingRuleEnd}>
                            <FormItem
                                name="redemptionEndRules"
                                rules={[
                                    {
                                        required: saveTradeTypes.includes(2),
                                        message: '请选择赎回签约规则'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        !isEmpty(signRules) &&
                                        signRules.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <FormItem
                        label="预设购买人数"
                        name="peopleNumber"
                        extra={`预设总购买人数为200，根据持仓人数计算最大购买人数为${remainNum}。`}
                    >
                        <Input placeholder="请输入" autoComplete="off" type="number" min={0} />
                    </FormItem>
                    <FormItem
                        label="预设产品规模"
                        name="productScale"
                    >
                        <Input placeholder="请输入" autoComplete="off" addonAfter="万" type="number" min={0} />
                    </FormItem>
                    <FormItem
                        className={styles.btnGroup}
                        wrapperCol={
                            {
                                offset: 8,
                                span: 16
                            }
                        }
                    >
                        <Space>
                            {
                                this.props.authEdit &&
                                <Button type="primary" htmlType="submit" loading={editLoaidng || loading}>
                                    提交
                                </Button>
                            }

                            <Button onClick={onCancel}>
                                取消
                            </Button>
                        </Space>
                    </FormItem>
                </Form >
            </Modal >
        );
    }
}
export default OpenDayDetails;
