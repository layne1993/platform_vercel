/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-24 10:07:44
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getProductApply,
    addProductApply,
    deleteApply,
    auditProductApply
} from './service';

export default modelExtend(pageModel, {

    namespace: 'reservationList',
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
        // 查询
        *getProductApply({ payload, callback }, { call, put }) {
            const data = yield call(getProductApply, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 新增
        *addProductApply({ payload, callback }, { call, put }) {
            const data = yield call(addProductApply, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 删除
        *deleteApply({ payload, callback }, { call, put }) {
            const data = yield call(deleteApply, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 审核
        *auditProductApply({ payload, callback }, { call, put }) {
            const data = yield call(auditProductApply, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
