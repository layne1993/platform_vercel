/*
 * @description: 披露规则列表model
 * @Author: tangsc
 * @Date: 2021-01-21 09:44:13
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    queryDisclosureDay,
    deleteDisclosureDay,
    editDisclosureDay
} from './service';

export default modelExtend(pageModel, {
    namespace: 'disclosureList',
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
        // 产品信披日-查询
        *queryDisclosureDay({ payload, callback }, { call, put }) {
            const data = yield call(queryDisclosureDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信披日-删除
        *deleteDisclosureDay({ payload, callback }, { call, put }) {
            const data = yield call(deleteDisclosureDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信披日-编辑
        *editDisclosureDay({ payload, callback }, { call, put }) {
            const data = yield call(editDisclosureDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
