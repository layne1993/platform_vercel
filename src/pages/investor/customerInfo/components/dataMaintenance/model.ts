/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:59
 * @LastEditTime: 2021-08-13 15:31:23
 */
import type { Effect } from 'umi';
import {
    batchUpdateCustomer
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        batchUpdateCustomer: Effect;
    };
    reducers: {
        setListData: any;
    };
}

const Model: ModelType = {
    namespace: 'CUSTOMER_INFO_MAINTENANCE',
    state: {
        listData: {}
    },
    effects: {
        *batchUpdateCustomer({ payload, callback }, { call, put }) {
            const res = yield call(batchUpdateCustomer, payload);
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
