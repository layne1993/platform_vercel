/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:49:05
 * @LastEditTime: 2021-06-08 15:55:55
 */
import type { Effect } from 'umi';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {};
    reducers: {
        setTabIndex: any;
        init: any;
    };
}

const Model: ModelType = {
    namespace: 'CHANNEL_DETAIL',
    state: {
        tabIndex: 0
    },
    effects: {},
    reducers: {
        init(state, { payload }) {
            return {
                ...state,
                tabIndex: 0
            };
        },
        setTabIndex(state, { payload }) {
            return {
                ...state,
                tabIndex: payload
            };
        }
    }
};
export default Model;
