/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-15 16:39:12
 * @LastEditTime: 2021-03-17 20:35:51
 */
import type { Effect, Reducer } from 'umi';

import { listData } from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getListData: Effect;
    };
    reducers: {
        setListData: any;
    };
}

const Model: ModelType = {
    namespace: 'NODE_MANAGEMENT',
    state: {
        listData: []
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
