/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-15 16:39:12
 * @LastEditTime: 2021-07-12 10:04:51
 */


import { Effect } from 'umi';
import {
    queryBasicInformation,
    queryLifeCycleNodeDetail,
    queryLifeCycleNodeList,
    saveProcessNodeInfo,
    updateProcessTitle,
    selectAllUser,
    queryLifeCycleNodeListByReject
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        queryLifeCycleNodeList: Effect;
        queryLifeCycleNodeDetail: Effect,
        queryBasicInformation: Effect,
        saveProcessNodeInfo: Effect,
        updateProcessTitle: Effect,
        selectAllUser: Effect,
        queryLifeCycleNodeListByReject: Effect
    };
}

const Model: ModelType = {
    namespace: 'PRODUCTLIFECYCLEINFO_DETAIL',
    state: {

    },
    effects: {
        *queryLifeCycleNodeList({ payload, callback }, { call }) {
            const response = yield call(queryLifeCycleNodeList, payload);
            if (callback) callback(response);
        },
        *queryLifeCycleNodeDetail({ payload, callback }, { call }) {
            const response = yield call(queryLifeCycleNodeDetail, payload);
            if (callback) callback(response);
        },
        *queryBasicInformation({ payload, callback }, { call }) {
            const response = yield call(queryBasicInformation, payload);
            if (callback) callback(response);
        },
        *saveProcessNodeInfo({ payload, callback }, { call }) {
            const response = yield call(saveProcessNodeInfo, payload);
            if (callback) callback(response);
        },

        *updateProcessTitle({ payload, callback }, { call }) {
            const response = yield call(updateProcessTitle, payload);
            if (callback) callback(response);
        },

        *selectAllUser({ payload, callback }, { call }) {
            const response = yield call(selectAllUser, payload);
            if (callback && typeof callback === 'function') callback(response);
        },

        *queryLifeCycleNodeListByReject({ payload, callback }, { call }) {
            const response = yield call(queryLifeCycleNodeListByReject, payload);
            if (callback && typeof callback === 'function') callback(response);
        }


    }
};
export default Model;
