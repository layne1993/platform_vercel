/*
 * @description: 模板列表
 * @Author: tangsc
 * @Date: 2021-03-12 18:22:10
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    querylifeCycleTemplateList
} from './service';

export default modelExtend(pageModel, {

    namespace: 'newProductLifeCycleInfoTemplate',
    state: {
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
        // 生命周期模板列表查询
        *querylifeCycleTemplateList({ payload, callback }, { call, put }) {
            const data = yield call(querylifeCycleTemplateList, payload);
            if (callback && typeof callback === 'function') callback(data);
        }
        // // 生命周期模板-查询模板数据
        // *querylifeCycleTemplate({ payload, callback }, { call, put }) {
        //     const data = yield call(querylifeCycleTemplate, payload);
        //     if (callback && typeof callback === 'function') callback(data);
        // },
        // // 生命周期模板-新增修改模板节点
        // *insertTemplate({ payload, callback }, { call, put }) {
        //     const data = yield call(insertTemplate, payload);
        //     if (callback && typeof callback === 'function') callback(data);
        // }

    },
    reducers: {
    }
});

