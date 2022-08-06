/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-24 13:23:57
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getProductApply,
    addProductApply,
    auditProductApply
} from './service';

export default modelExtend(pageModel, {

    namespace: 'reservationDetails',
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

        // 新增
        *addProductApply({ payload, callback }, { call, put }) {
            const data = yield call(addProductApply, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
