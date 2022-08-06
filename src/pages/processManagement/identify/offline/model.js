/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-17 17:11:38
 * @LastEditTime: 2020-11-24 18:15:10
 */
import { setCookie } from '@/utils/utils';
import {
    getDetail,
    saveAudit,
    getInvestorList,
    saveIdentifyOffline,
    queryProcessByFlowId
} from './service';

const Model = {
    namespace: 'IDENTIFYFLOW_OFFLINE',
    state: {
        flowData: {}
    },
    effects: {
        *getDetail({ payload, callback }, { put, call }) {
            const response = yield call(getDetail, payload);
            if (callback) callback(response);
        },
        *getInvestorList({ payload, callback }, { call }) {
            const response = yield call(getInvestorList, payload);
            if (callback) callback(response);
        },
        *saveAudit({ payload, callback }, { call }) {
            const response = yield call(saveAudit, payload);
            if (callback) callback(response);
        },
        *saveIdentifyOffline({ payload, callback }, { call, put }) {
            const response = yield call(saveIdentifyOffline, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *queryProcessByFlowId({ payload, callback }, { call }) {
            const response = yield call(queryProcessByFlowId, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                flowData: payload
            };
        },
        initModel() {
            return { flowData: {} };
        }
    }
};
export default Model;
