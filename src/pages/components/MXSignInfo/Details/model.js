/*
 * @Author: your name
 * @Date: 2021-07-29 18:42:59
 * @LastEditTime: 2021-09-14 17:24:57
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\MXSignInfo\Details\model.js
 */
import { setCookie } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    queryServer,
    getProcessList,
    querySignFlowInfo,
    //   getProductManual,
    saveAudit,
    saveSecondReviewCheck
} from './service';

export default modelExtend(pageModel, {
    namespace: 'signprocess',
    state: {
        processDetail: {},
        operationInfo: []        // 流程节点操作信息
    },
    effects: {
        *getProcessList({ payload, callback }, { call, put }) {
            const response = yield call(getProcessList, payload);
            if (callback) callback(response);
        },
        *SaveSecondReviewCheck({ payload, callback }, { call, put }) {
            const response = yield call(saveSecondReviewCheck, payload);
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
});
