/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-23 16:04:04
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    addShare,
    editShare,
    queryByCustomerName,
    queryDetails
} from './service';

export default modelExtend(pageModel, {
    namespace: 'shareDetails',
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


        // 新增份额
        *addShare({ payload, callback }, { call, put }) {
            const data = yield call(addShare, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 编辑份额
        *editShare({ payload, callback }, { call, put }) {
            const data = yield call(editShare, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 客户列表
        *queryByCustomerName({ payload, callback }, { call, put }) {
            const data = yield call(queryByCustomerName, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 客户列表
        *queryDetails({ payload, callback }, { call, put }) {
            const data = yield call(queryDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        }
    },
    reducers: {
    }
});
