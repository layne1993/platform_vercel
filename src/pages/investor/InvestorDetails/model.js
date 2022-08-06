/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-02-26 16:53:54
 */
import {
    createCustomerInfo,
    getManagers,
    updateCustomerInfo,
    queryCustomerInfo,
    riskRecordList,
    riskRecordCreate,
    riskRecordDetail,
    riskRecordEdit,
    batchDownload,
    getAgencies,
    getCustomerNoticeStatistics
} from './service';

const Model = {
    namespace: 'INVESTOR_DETAIL',
    state: {
        elementInfo: {}
    },
    effects: {
        *getAgencies({ payload, callback }, { call, put }) {
            const response = yield call(getAgencies, payload);
            if (callback) callback(response);
        },

        *queryCustomerInfo({ payload, callback }, { call, put }) {
            const response = yield call(queryCustomerInfo, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *createCustomerInfo({ payload, callback }, { call }) {
            const response = yield call(createCustomerInfo, payload);
            if (callback) callback(response);
        },
        *updateCustomerInfo({ payload, callback }, { call }) {
            const response = yield call(updateCustomerInfo, payload);
            if (callback) callback(response);
        },
        *getManagersList({ payload, callback }, { call }) {
            const response = yield call(getManagers, payload);
            if (callback) callback(response);
        },

        *getRiskListData({ payload, callback }, { call }) {
            const response = yield call(riskRecordList, payload);
            if (callback) callback(response);
        },

        *riskRecordCreate({ payload, callback }, { call }) {
            const response = yield call(riskRecordCreate, payload);
            if (callback) callback(response);
        },

        *riskRecordDetail({ payload, callback }, { call }) {
            const response = yield call(riskRecordDetail, payload);
            if (callback) callback(response);
        },

        *riskRecordEdit({ payload, callback }, { call }) {
            const response = yield call(riskRecordEdit, payload);
            if (callback) callback(response);
        },

        *batchDownload({ payload, callback }, { call }) {
            const response = yield call(batchDownload, payload);
            if (callback) callback(response);
        },

        *getCustomerNoticeStatistics({ payload, callback }, { call }) {
            const response = yield call(getCustomerNoticeStatistics, payload);
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
