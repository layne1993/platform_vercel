/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-12-23 16:42:53
 */
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    query,
    addFile,
    deleteFile,
    queryCompany,
    queryEditaFile,
    queryProductSetting,
    saveProductSetting
} from './service';

export default modelExtend(pageModel, {

    namespace: 'productConfig',
    state: {
    },
    subscriptions: {
    },
    effects: {
        // 产品总配置查询
        *queryProductSetting({ payload, callback }, { call, put }) {
            const data = yield call(queryProductSetting, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品总配置保存
        *saveProductSetting({ payload, callback }, { call, put }) {
            const data = yield call(saveProductSetting, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 查询
        *query({ payload, callback }, { call, put }) {
            const data = yield call(query, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 新增
        *addFile({ payload, callback }, { call, put }) {
            const data = yield call(addFile, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 编辑时查询
        *queryEditaFile({ payload, callback }, { call, put }) {
            const data = yield call(queryEditaFile, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 删除
        *deleteFile({ payload, callback }, { call, put }) {
            const data = yield call(deleteFile, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询所有托管机构
        *queryCompany({ payload, callback }, { call, put }) {
            const data = yield call(queryCompany, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
