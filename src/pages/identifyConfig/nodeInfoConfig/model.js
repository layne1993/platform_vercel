/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-03-03 13:06:58
 */

import { selectIdentifyFlowText, saveIdentifyFlowText } from './service';

const Model = {
    namespace: 'NODE_INFO_CONFIG',
    state: {},
    effects: {
        *selectIdentifyFlowText({ payload, callback }, { call }) {
            const response = yield call(selectIdentifyFlowText, payload);
            if (callback) callback(response);
        },
        *saveIdentifyFlowText({ payload, callback }, { call }) {
            const response = yield call(saveIdentifyFlowText, payload);
            if (callback) callback(response);
        }
    },
    reducers: {}
};
export default Model;
