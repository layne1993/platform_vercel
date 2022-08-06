/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-07-06 13:21:18
 */
import {
    dividendWayRecord
} from './service';

const Model = {
    namespace: 'HoldingProducts',
    state: {
        elementInfo: {}
    },
    effects: {
        *dividendWayRecord({ payload, callback }, { call, put }) {
            const response = yield call(dividendWayRecord, payload);
            if (callback) callback(response);
        }

    },
    reducers: {
    }
};
export default Model;
