/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-17 17:11:38
 * @LastEditTime: 2021-03-03 17:00:48
 */
import { setCookie } from '@/utils/utils';
import {
    getProcessList,
    querySignFlowInfo,
    //   getProductManual,
    saveAudit
} from './service';

const Model = {
    namespace: 'SIGN_REDEMING',
    state: {
        processDetail: {}
    },
    effects: {
        *getProcessList({ payload, callback }, { call, put }) {
            const response = yield call(getProcessList, payload);
            if (callback) callback(response);
        },

        // 查询流程信息
        *getBaseInfo({ payload, callback }, { call, put }) {
            const response = yield call(querySignFlowInfo, payload);
            yield put({
                type: 'saveInfo',
                payload: response
            });
            if (callback) callback(response);
        },
        // *getProductManual({ payload, callback }, { call }) {
        //     const response = yield call(getProductManual, payload);
        //     if (callback) callback(response);
        // },
        *saveAudit({ payload, callback }, { call }) {
            const response = yield call(saveAudit, payload);
            if (callback) callback(response);
        },
        /* 文件路径前半段 */
        *queryServer({ payload }, { call }) {
            const response = yield call(queryServer, payload);
            if (response.code === 1008) {
                setCookie('LinkUrl', response.data);
            }
        }

    },
    reducers: {
        saveInfo(state, action) {
            const { payload } = action;
            let { processDetail } = state;
            if (payload && payload.code === 1008) {
                processDetail = payload.data || {};
            }
            return { ...state, processDetail };
        },
        resetModel(state, { payload }) {
            return { ...state, ...payload };
        }
    }
};
export default Model;
