/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-08-03 14:12:27
 */
import {
    list, deleteConfirmFile, publish, queryByProductList, selectAll,
    autoGeneration, recordQuery, recordQueryFile, recordFileUpload
} from './service';

const Model = {
    namespace: 'MANAGE_CONFIRMLIST',
    state: {
        listData: [],
        accountManager:[],
        totalCount: 0
    },
    effects: {
        *getListData({ payload, callback }, { call, put }) {
            const response = yield call(list, payload);
            if(response.code === 1008) {
                yield put({
                    type: 'setListData',
                    payload: response || {}
                });
            }
            if (callback) callback(response);
        },
        *deleteConfirmFile({ payload, callback }, { call }) {
            const response = yield call(deleteConfirmFile, payload);
            if (callback) callback(response);
        },
        *publish({ payload, callback }, { call }) {
            const response = yield call(publish, payload);
            if (callback) callback(response);
        },
        *queryByProductList({ payload, callback }, { call }) {
            const response = yield call(queryByProductList, payload);
            if (callback) callback(response);
        },
        *selectAll({ payload, callback }, { call }) {
            const response = yield call(selectAll, payload);
            if (callback) callback(response);
        },
        *autoGeneration({ payload, callback }, { call }) {
            const response = yield call(autoGeneration, payload);
            if (callback) callback(response);
        },
        *recordQuery({ payload, callback }, { call }) {
            const response = yield call(recordQuery, payload);
            if (callback) callback(response);
        },
        *recordQueryFile({ payload, callback }, { call }) {
            const response = yield call(recordQueryFile, payload);
            if (callback) callback(response);
        },
        *recordFileUpload({ payload, callback }, { call }) {
            const response = yield call(recordFileUpload, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        setListData(state, { payload }) {
            return {
                ...state,
                listData: payload
            };
        },
        setAccountManager(state, { payload }) {
            return {
                ...state,
                accountManager: payload
            };
        }
    }
};
export default Model;
