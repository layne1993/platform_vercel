import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getOpenDayList,
    getOpenDayDetails,
    createOpenDay,
    editOpenDay,
    deleteOpenDay
} from './service';
import { cloneDeep, isEmpty } from 'lodash';
import moment from 'moment';

export default modelExtend(pageModel, {
    namespace: 'openDayList',
    state: {
        openInfoList: [],                 // 开放日列表(包含page等信息)
        openList: []                      // 开放日table列表
    },
    subscriptions: {
        // setup({ dispatch, history }) {
        //     history.listen((location) => {
        //         if (pathMatchRegexp('/product/list', location.pathname)) {
        //             dispatch({
        //                 type: 'getProductList',
        //             });
        //         }
        //     });
        // }
    },
    effects: {


        // 产品开放日列表-查询
        *getOpenDayList({ payload }, { call, put }) {
            const { code, data } = yield call(getOpenDayList, payload);
            if (data && code === 1008) {
                yield put({
                    type: 'updateState',
                    payload: {
                        openInfoList: data
                    }
                });
                if (data.list) {
                    yield put({
                        type: 'changeDateStatus',
                        payload: data.list
                    });
                }
            }
        },

        // 产品开放日详情-查询
        *getOpenDayDetails({ payload, callback }, { call, put }) {
            const data = yield call(getOpenDayDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品开放日-新建
        *createOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(createOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品开放日-编辑
        *editOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(editOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品开放日-删除
        *deleteOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(deleteOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
        changeDateStatus(state, { payload = {} }) {
            // 周频天数
            const weekDay = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
            let tempTime = '';
            !isEmpty(payload) &&
                payload.forEach((element) => {
                    const {
                        noticeRule,
                        bookingRule,
                        bookingEndRule,
                        signingStartRules,
                        signingEndRules,
                        redemptionStartRules,
                        redemptionEndRules,
                        weekStart,
                        weekEnd,
                        monthStart,
                        monthEnd,
                        frequencyStatus,
                        openDayType,
                        openEndDate,
                        openStartDate
                    } = element;
                    // openDayType为0 按频率  为1则按时间
                    // if (openDayType === 0) {
                    //     if (frequencyStatus === 0) {
                    //         tempTime = `${weekDay[weekStart - 1]} ~ ${weekDay[weekEnd - 1]}`;
                    //     } else {
                    //         tempTime = `每月${monthStart}号~每月${monthEnd}号`;
                    //     }
                    // } else {
                    //     tempTime = `${moment(openStartDate).format('YYYY/MM/DD')} ~ ${moment(openEndDate).format('YYYY/MM/DD')}`;
                    // }
                    element.openingDayTime = tempTime;
                    if (noticeRule === 0) {
                        element.noticeRule = '当天';
                    } else {
                        element.noticeRule = `提前${noticeRule}天`;
                    }

                    if (bookingRule === 0) {
                        element.bookingRule = '当天';
                    } else if (bookingRule) {
                        element.bookingRule = `提前${bookingRule}天`;
                    }
                    if (bookingEndRule === 0) {
                        element.bookingEndRule = '当天';
                    } else if (bookingEndRule) {
                        element.bookingEndRule = `提前${bookingEndRule}天`;
                    }
                    if (signingStartRules === 0) {
                        element.signingStartRules = '当天';
                    } else if (signingStartRules) {
                        element.signingStartRules = `提前${signingStartRules}天`;
                    }
                    if (signingEndRules === 0) {
                        element.signingEndRules = '当天';
                    } else if (signingEndRules) {
                        element.signingEndRules = `提前${signingEndRules}天`;
                    }
                    if (redemptionStartRules === 0) {
                        element.redemptionStartRules = '当天';
                    } else if (redemptionStartRules) {
                        element.redemptionStartRules = `提前${redemptionStartRules}天`;
                    }
                    if (redemptionEndRules === 0) {
                        element.redemptionEndRules = '当天';
                    } else if (redemptionEndRules) {
                        element.redemptionEndRules = `提前${redemptionEndRules}天`;
                    }
                    element.bookingRuleDay = (element.bookingRule && element.bookingEndRule) ? `${element.bookingRule} ~ ${element.bookingEndRule}` : '--';
                    element.signingRules = (element.signingStartRules && element.signingEndRules) ? `${element.signingStartRules} ~ ${element.signingEndRules}` : '--';
                    element.redemptionRules = (element.redemptionStartRules && element.redemptionEndRules) ? `${element.redemptionStartRules} ~ ${element.redemptionEndRules}` : '--';
                });
            return {
                ...state,
                ...payload
            };
        }
    }
});
