/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-08-13 17:57:59
 */

import { getQualifiedList, selectAllAccountManager } from './service';

const Model = {
    namespace: 'IDENTIFY_CONFIG',
    state: {},
    effects: {
        *queryQualifiedList({ payload, callback }, { call }) {
            const response = yield call(getQualifiedList, payload);
            if (callback) callback(response);
        },
        *selectAllAccountManager({ payload, callback }, { call }) {
            const response = yield call(selectAllAccountManager, payload);
            if (callback) callback(response);
        }

        // *offlineIdentifyConfig({ payload, callback }, { call }) {
        //     const response = yield call(offlineIdentifyConfig, payload);
        //     if (callback) callback(response);
        // }
    },
    reducers: {}
};
export default Model;
