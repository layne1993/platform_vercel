/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:49:05
 * @LastEditTime: 2021-03-30 17:10:28
 */
import type { Effect } from 'umi';
import { listData, productList, agreementEdit, customerList, queryByProductName, newSeparateSign, selectListCustomer } from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getListData: Effect;
        agreementEdit: Effect;
        getProductList: Effect;
        queryByProductName: Effect;
        getCustomerList: Effect;
        newSeparateSign: Effect;
        selectListCustomer: Effect;
    };
    reducers: {
        setListData: any;
    };
}

const Model: ModelType = {
    namespace: 'SEPARATEAGREEMENT',
    state: {
        listData: {}
    },
    effects: {
        *getListData({ payload, callback }, { call, put }) {
            const { code, data } = yield call(listData, payload);
            if (code === 1008) {
                yield put({
                    type: 'setListData',
                    payload: data
                });
            }
        },

        *agreementEdit({ payload, callback }, { call, put }) {
            const res = yield call(agreementEdit, payload);
            if (callback) callback(res);
        },

        *getProductList({ payload, callback }, { call, put }) {
            const res = yield call(productList, payload);
            if (callback) callback(res);
        },

        *queryByProductName({ payload, callback }, { call, put }) {
            const res = yield call(queryByProductName, payload);
            if (callback) callback(res);
        },

        *getCustomerList({ payload, callback }, { call, put }) {
            const res = yield call(customerList, payload);
            if (callback) callback(res);
        },

        *newSeparateSign({ payload, callback }, { call, put }) {
            const res = yield call(newSeparateSign, payload);
            if (callback) callback(res);
        },

        *selectListCustomer({ payload, callback }, { call, put }) {
            const res = yield call(selectListCustomer, payload);
            if (callback) callback(res);
        }
    },
    reducers: {
        setListData(state, { payload }) {
            return {
                ...state,
                listData: payload
            };
        }
    }
};
export default Model;
