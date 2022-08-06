/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 17:38:15
 * @LastEditTime: 2021-02-23 14:59:07
 */
import {
    queryByProductName,
    saveAndPublish
} from './service';

const Model = {
    namespace: 'PRODUCT_ANNOUNCEMENT',
    state: {
        flowData: {}
    },
    effects: {
        *queryByProductName({ payload, callback }, { put, call }) {
            const response = yield call(queryByProductName, payload);
            if (callback) callback(response);
        },
        *saveAndPublish({ payload, callback }, { call }) {
            const response = yield call(saveAndPublish, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        save(state, {payload}) {
            return {
                ...state,
                flowData: payload
            };
        },
        initModel() {
            return { flowData: {} };
        }
    }
};
export default Model;
