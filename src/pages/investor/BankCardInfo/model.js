/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 17:36:23
 * @LastEditTime: 2021-02-26 14:15:12
 */
import {
    bankList,
    freeze,
    queryBank,
    createOrUpdateCustomerBank,
    findCustomer,
    findCustomerBankProduct,
    saveCustomerBankProduct,
    queryByProductName,
    viewChangeHistory,
    deleteCustomerBank

} from './service';

const Model = {
    namespace: 'INVESTOR_BANKINFO',
    state: {

    },
    effects: {

        // 查询listData
        *bankList({ payload, callback }, { call }) {
            const response = yield call(bankList, payload);
            if (callback) callback(response);
        },
        *doFreeze({ payload, callback }, { call }) {
            const response = yield call(freeze, payload);
            if (callback) callback(response);
        },

        *queryBank({ payload, callback }, { call }) {
            const response = yield call(queryBank, payload);
            if (callback) callback(response);
        },
        *createOrUpdateCustomerBank({ payload, callback }, { call }) {
            const response = yield call(createOrUpdateCustomerBank, payload);
            if (callback) callback(response);
        },

        *findCustomer({ payload, callback }, { call }) {
            const response = yield call(findCustomer, payload);
            if (callback) callback(response);
        },

        *findCustomerBankProduct({ payload, callback }, { call }) {
            const response = yield call(findCustomerBankProduct, payload);
            if (callback) callback(response);
        },


        *saveCustomerBankProduct({ payload, callback }, { call }) {
            const response = yield call(saveCustomerBankProduct, payload);
            if (callback) callback(response);
        },

        *queryByProductName({ payload, callback }, { put, call }) {
            const response = yield call(queryByProductName, payload);
            if (callback) callback(response);
        },

        *viewChangeHistory({ payload, callback }, { put, call }) {
            const response = yield call(viewChangeHistory, payload);
            if (callback) callback(response);
        },

        *deleteCustomerBank({ payload, callback }, { call }) {
            const response = yield call(deleteCustomerBank, payload);
            if (callback) callback(response);
        }

    },
    reducers: {

    }
};
export default Model;
