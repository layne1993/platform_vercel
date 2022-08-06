/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:49:05
 * @LastEditTime: 2021-06-04 13:34:35
 */
import type { Effect } from 'umi';
import {
    getSetting,
    createOrEdit
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getSetting: Effect;
        createOrEdit: Effect;
    };
    reducers: {
        setnoticesList: any;
    };
}

const Model: ModelType = {
    namespace: 'INFORMATION_SETTING',
    state: {
        noticesList: {}
    },
    effects: {
        *getSetting({ payload, callback }, { call, put }) {
            const res = yield call(getSetting, payload);
            if (callback) callback(res);
        },

        *createOrEdit({ payload, callback }, { call, put }) {
            const res = yield call(createOrEdit, payload);
            if (callback) callback(res);
        }


    },
    reducers: {
        setnoticesList(state, { payload }) {
            return {
                ...state,
                noticesList: payload
            };
        }
    }
};
export default Model;
