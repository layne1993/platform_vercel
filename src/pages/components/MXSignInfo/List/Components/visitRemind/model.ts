/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 13:58:59
 * @LastEditTime: 2021-08-13 15:31:23
 */
import type { Effect } from 'umi';
import {
    visitRemind
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        visitRemind: Effect;
    };
    reducers: {
        setListData: any;
    };
}

const Model: ModelType = {
    namespace: 'SIGN_VISITREMIND',
    state: {
        listData: { }
    },
    effects: {
        *visitRemind({ payload, callback }, { call, put }) {
            const res = yield call(visitRemind, payload);
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
