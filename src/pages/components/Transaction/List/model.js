/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-08-02 15:54:28
 */
import { tradeQuery, tradeDelete, tradeFlowConfirm, exportCustomers, downloadFile } from './service';

const Model = {
    namespace: 'RunningList',
    state: { },
    effects: {
        *TradeQuery({ payload, callback }, { call, put }) {
            const response = yield call(tradeQuery, payload);
            if (callback) callback(response);
        },
        *tradeDelete({ payload, callback }, { call, put }) {
            const response = yield call(tradeDelete, payload);
            if (callback) callback(response);
        },
        *exportCustomers({ payload, callback }, { call, put }) {
            const response = yield call(exportCustomers, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        // saveInfo(state, action) {
        //     const { payload } = action;
        //     let { processDetail } = state;
        //     if (payload && payload.code === 1008) {
        //         processDetail = payload.data || {};
        //     }
        //     return { ...state, processDetail };
        // },
        // resetModel(state, { payload }) {
        //     return { ...state, ...payload };
        // }
    }
};
export default Model;
