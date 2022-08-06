/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-15 16:39:12
 * @LastEditTime: 2021-03-30 17:22:17
 */
import { Effect } from 'umi';

import {
    queryLifeCycleMangerListPage,
    createLifeCycleProcess,
    templateList,
    productList,
    repealLifeCycleProcess,
    queryByProductName,
    queryLifeCycleTemplateList,
    getAdminUserList
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getListData: Effect;
        createLifeCycleProcess: Effect,
        templateList: Effect,
        productList: Effect,
        repealLifeCycleProcess: Effect,
        queryByProductName: Effect,
        queryLifeCycleTemplateList: Effect,
        getAdminUserList: Effect
    };
}


const Model: ModelType = {
    namespace: 'PRODUCTLIFECYCLEINFO',
    state: {

    },
    effects: {
        // 查询listData
        *getListData({ payload, callback }, { call }) {
            const response = yield call(queryLifeCycleMangerListPage, payload);
            if (callback) callback(response);
        },

        *createLifeCycleProcess({ payload, callback }, { call }) {
            const response = yield call(createLifeCycleProcess, payload);
            if (callback) callback(response);
        },

        *templateList({ payload, callback }, { call }) {
            const response = yield call(templateList, payload);
            if (callback) callback(response);
        },

        *productList({ payload, callback }, { call }) {
            const response = yield call(productList, payload);
            if (callback) callback(response);
        },

        *repealLifeCycleProcess({ payload, callback }, { call }) {
            const response = yield call(repealLifeCycleProcess, payload);
            if (callback) callback(response);
        },

        *queryByProductName({ payload, callback }, { call }) {
            const response = yield call(queryByProductName, payload);
            if (callback) callback(response);
        },

        *queryLifeCycleTemplateList({ payload, callback }, { call }) {
            const response = yield call(queryLifeCycleTemplateList, payload);
            if (callback) callback(response);
        },

        *getAdminUserList({ payload, callback }, { call }) {
            const response = yield call(getAdminUserList, payload);
            if (callback) callback(response);
        }
    }
};
export default Model;
