/*
 * @description: 模板创建
 * @Author: tangsc
 * @Date: 2021-03-12 18:22:10
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    queryLifeCycleElementInfo,
    querylifeCycleTemplate,
    insertTemplate,
    updateTemplatStatus,
    selectAllUser,
    queryChangeInformation,
    copyLifeCycleTemplate
} from './service';

export default modelExtend(pageModel, {

    namespace: 'productTemplate',
    state: {
        templateName: '',           // 模板名称
        templateStatuis: 1,         // 模板状态(1-编辑中,2-发布,3-禁用)
        lifecycleNodeList: [],      // 节点数据列表
        currentNode: {},            // 当前节点数据 默认为第一条
        editHistory: []             // 模板修改历史记录

    },
    subscriptions: {
        // setup({ dispatch, history }) {
        //     history.listen((location) => {
        //         if (pathMatchRegexp('/product/list', location.pathname)) {
        //             dispatch({
        //                 type: 'getProductList',
        //             });
        //         }
        //     });
        // }
    },
    effects: {
        // 生命周期模板-查询产品要素
        *queryLifeCycleElementInfo({ payload, callback }, { call, put }) {
            const data = yield call(queryLifeCycleElementInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-查询模板数据
        *querylifeCycleTemplate({ payload, callback }, { call, put }) {
            const data = yield call(querylifeCycleTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-新增修改模板节点
        *insertTemplate({ payload, callback }, { call, put }) {
            const data = yield call(insertTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-新增模板基本信息
        *updateTemplatStatus({ payload, callback }, { call, put }) {
            const data = yield call(updateTemplatStatus, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-获取步骤默认处理人
        *selectAllUser({ payload, callback }, { call, put }) {
            const data = yield call(selectAllUser, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-获取修改信息
        *queryChangeInformation({ payload, callback }, { call, put }) {
            const data = yield call(queryChangeInformation, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-复制新模板
        *copyLifeCycleTemplate({ payload, callback }, { call, put }) {
            const data = yield call(copyLifeCycleTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
