/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-12 17:05:51
 * @LastEditTime: 2021-08-12 17:05:52
 */
import { offlineIdentifyConfig, offlineIdentifyConfigUpdate } from './service';

const Model = {
    namespace: 'OFFLINE_CONFIG',
    state: {},
    effects: {
        *offlineIdentifyConfig({ payload, callback }, { call }) {
            const response = yield call(offlineIdentifyConfig, payload);
            if (callback) callback(response);
        },

        *offlineIdentifyConfigUpdate({ payload, callback }, { call }) {
            const response = yield call(offlineIdentifyConfigUpdate, payload);
            if (callback) callback(response);
        }
    },
    reducers: {}
};
export default Model;
