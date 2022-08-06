/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-07-28 14:39:25
 * @LastEditTime: 2021-07-29 13:38:11
 */

import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    syncFundInfo,
    createBatch,
    getInvestorList,
    queryCompanyList
} from './service';

export default modelExtend(pageModel, {
    namespace: 'NEW_PRODUCT',
    state: {
        productInfoList: []                 // 产品信息列表
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

        // 同步新备案的产品
        *syncFundInfo({ payload, callback }, { call, put }) {
            const data = yield call(syncFundInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        *createBatch({ payload, callback }, { call, put }) {
            const data = yield call(createBatch, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        *getInvestorList({ payload, callback }, { call, put }) {
            const data = yield call(getInvestorList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        *queryCompanyList({ payload, callback }, { call, put }) {
            const data = yield call(queryCompanyList, payload);
            if (callback && typeof callback === 'function') callback(data);
        }


    },
    reducers: {
    }
});
