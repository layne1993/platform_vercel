/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-02-26 16:53:54
 */
import {
    realNameList,
    realDetail,
    realNameAudit,
    getRealnameSetting,
    createOrUpdate
} from './service';

const Model = {
    namespace: 'INVESTOR_AUTHENTICATION',
    state: {
        elementInfo: {}
    },
    effects: {
        *realNameList({ payload, callback }, { call, put }) {
            const response = yield call(realNameList, payload);
            if (callback) callback(response);
        },

        *realDetail({ payload, callback }, { call, put }) {
            const response = yield call(realDetail, payload);
            if (callback) callback(response);
        },
        *realNameAudit({ payload, callback }, { call }) {
            const response = yield call(realNameAudit, payload);
            if (callback) callback(response);
        },
        *getRealnameSetting({ payload, callback }, { call }) {
            const response = yield call(getRealnameSetting, payload);
            if (callback) callback(response);
        },
        *createOrUpdate({ payload, callback }, { call }) {
            const response = yield call(createOrUpdate, payload);
            if (callback) callback(response);
        }



    },
    reducers: {
        save(state, action) {
            const { payload } = action;
            let { elementInfo } = state;
            if (payload && payload.code === 1008) {
                elementInfo = payload.data || {};
            }
            return { ...state, elementInfo };
        },
        resetModel(state, { payload }) {
            payload.elementInfo = {};
            return { ...state, ...payload };
        }
    }
};
export default Model;
