/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:59
 * @LastEditTime: 2021-08-12 17:25:03
 */
import type { Effect } from 'umi';
import {
    getManagerDistributeSetting,
    saveManagerDistributeSetting
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getManagerDistributeSetting: Effect;
        saveManagerDistributeSetting: Effect;
    };
    reducers: {
    };
}

const Model: ModelType = {
    namespace: 'CUSTOMER_MANAGER',
    state: {
        listData: {}
    },
    effects: {
        *getManagerDistributeSetting({ payload, callback }, { call, put }) {
            const res = yield call(getManagerDistributeSetting, payload);
            if (callback) callback(res);
        },

        *saveManagerDistributeSetting({ payload, callback }, { call, put }) {
            const res = yield call(saveManagerDistributeSetting, payload);
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
