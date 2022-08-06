/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-08-04 11:27:58
 */
import { setCookie } from '@/utils/utils';
import {
    // queryServer,
    // exportCustomerList,
    // batchImportCustomer,
    customerData,
    deleteBatch,
    setForbidden,
    selectAllAccountManager,
    // queryIdentifyData,
    statistics,
    getResetPasswordFormData,
    resetPassword,
    setIsVIP
} from './service';

const Model = {
    namespace: 'INVESTOR_CUSTOMERINFO',
    state: {
        baseInfo: {}
    },
    effects: {

        *setIsVIP({ payload, callback }, { call }) {
            const response = yield call(setIsVIP, payload);
            if (callback) callback(response);
        },
        *resetPassword({ payload, callback }, { call }) {
            const response = yield call(resetPassword, payload);
            if (callback) callback(response);
        },
        *getResetPasswordFormData({ payload, callback }, { call }) {
            const response = yield call(getResetPasswordFormData, payload);
            if (callback) callback(response);
        },
        *customerData({ payload, callback }, { call }) {
            const response = yield call(customerData, payload);
            // yield put({
            //   type: 'save',
            //   payload: response,
            // });
            if (callback) callback(response);
        },
        *deleteCustomer({ payload, callback }, { call }) {
            const response = yield call(deleteBatch, payload);
            if (callback) callback(response);
        },

        *getStatistics({ payload, callback }, { call }) {
            const response = yield call(statistics, payload);
            if (callback) callback(response);
        },
        *setForbidden({ payload, callback }, { call }) {
            const response = yield call(setForbidden, payload);
            if (callback) callback(response);
        },
        *selectAllAccountManager({ payload, callback }, { call }) {
            const response = yield call(selectAllAccountManager, payload);
            if (callback) callback(response);
        }

        // *queryIdentifyData({ payload, callback }, { call }) {
        //     const response = yield call(queryIdentifyData, payload);
        //     if (callback) callback(response);
        // },
        // *batchImportCustomer({ payload, callback }, { call }) {
        //     const response = yield call(batchImportCustomer, payload);
        //     if (callback) callback(response);
        // },
        // *exportCustomerList({ payload, callback }, { call }) {
        //     const response = yield call(exportCustomerList, payload);
        //     if (callback) callback(response);
        // },
        /* 文件路径前半段 */
        // *queryServer({ payload }, { call }) {
        //     const response = yield call(queryServer, payload);
        //     if (response.code === 1008) {
        //         setCookie('LinkUrl', response.data);
        //     }
        // }
    },
    reducers: {
    // save(state, action) {
    //   const { payload } = action;
    //   let { baseInfo } = state;
    //   if (payload && payload.code === 1008 && payload.data) {
    //     baseInfo = payload.data || {};
    //   }
    //   return { ...state, baseInfo };
    // },
    }
};
export default Model;
