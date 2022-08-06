/*
 * @description:披露规则详情
 * @Author: tangsc
 * @Date: 2021-01-21 10:09:40
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    addDisclosureDay,
    editDisclosureDay,
    queryDetails
} from './service';

export default modelExtend(pageModel, {
    namespace: 'disclosureDetails',
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
        // 产品信披日-新增
        *addDisclosureDay({ payload, callback }, { call, put }) {
            const data = yield call(addDisclosureDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信披日-编辑
        *editDisclosureDay({ payload, callback }, { call, put }) {
            const data = yield call(editDisclosureDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信披日-查询详情
        *queryDetails({ payload, callback }, { call, put }) {
            const data = yield call(queryDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
