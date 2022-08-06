/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-05-13 17:54:08
 */
import { setCookie } from '@/utils/utils';
import {
    getDetail,
    saveAudit,
    queryProcessByFlowId,
    selectIdentifyFlowText
} from './service';

const Model = {
    namespace: 'IDENTIFYFLOW_ONLINE',
    state: {
        flowData: {}
    },
    effects: {
        *getDetail({ payload, callback }, { put, call }) {
            // console.log(payload, 'payload');
            const response = yield call(getDetail, payload);
            // console.log(response, 'response');
            if (callback) callback(response);
        },
        *saveAudit({ payload, callback }, { call }) {
            const response = yield call(saveAudit, payload);
            if (callback) callback(response);
        },
        *queryProcessByFlowId({ payload, callback }, { call }) {
            const response = yield call(queryProcessByFlowId, payload);
            if (callback) callback(response);
        },

        *selectIdentifyFlowText({ payload, callback }, { call }) {
            const response = yield call(selectIdentifyFlowText, payload);
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
        resetModel(state, { payload }) {
            return { ...state, ...payload };
        }
    }
};
export default Model;
