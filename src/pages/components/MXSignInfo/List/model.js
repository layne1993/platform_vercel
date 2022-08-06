/*
 * @description: 签约-model
 * @Author: tangsc,hucc
 * @Date: 2020-11-19 17:16:20
 */
import {
    querySignFlowAll,
    updateSignFlow,
    queryBank,
    getProductList,
    getSignFlowOffline,
    getCustomerList,
    createOrUpdateSignFlowOffline,
    getNewProductDay,
    updateSignOpenDay,
    getCustomerByCustomerId
} from './service';

const Model = {
    namespace: 'signInfoList',
    state: {
        templateList: []
    },
    effects: {
        // 认申赎流程管理列表
        *getCustomerByCustomerId({ payload, callback }, { call, put }) {
            const response = yield call(getCustomerByCustomerId, payload);
            if (callback) callback(response);
        },
        // 认申赎流程管理列表
        *querySignFlowAll({ payload, callback }, { call, put }) {
            const response = yield call(querySignFlowAll, payload);
            if (callback) callback(response);
        },
        // 签约流程-修改签约流程有效性
        *updateSignFlow({ payload, callback }, { call, put }) {
            const response = yield call(updateSignFlow, payload);
            if (callback) callback(response);
        },
        // 签约流程-获取产品列表
        *getProductList({ payload, callback }, { call, put }) {
            const response = yield call(getProductList, payload);
            if (callback) callback(response);
        },
        // 签约流程-获取客户列表
        *getCustomerList({ payload, callback }, { call, put }) {
            const response = yield call(getCustomerList, payload);
            if (callback) callback(response);
        },
        // 创建列表
        *createOrUpdateSignFlowOffline({ payload, callback }, { call, put }) {
            const response = yield call(createOrUpdateSignFlowOffline, payload);
            if (callback) callback(response);
        },
        // 获取线下列表
        *getSignFlowOffline({ payload, callback }, { call, put }) {
            const response = yield call(getSignFlowOffline, payload);
            if (callback) callback(response);
        },
        // 获取线下列表
        *queryBank({ payload, callback }, { call, put }) {
            const response = yield call(queryBank, payload);
            if (callback) callback(response);
        },
        // 获取线下列表
        *getNewProductDay({ payload, callback }, { call, put }) {
            const response = yield call(getNewProductDay, payload);
            if (callback) callback(response);
        },
        *updateSignOpenDay({ payload, callback }, { call, put }) {
            const response = yield call(updateSignOpenDay, payload);
            if (callback) callback(response);
        }

    },
    reducers: {
    }
};
export default Model;
