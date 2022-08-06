import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    queryShare,
    deleteShare,
    getProduct
} from './service';

export default modelExtend(pageModel, {
    namespace: 'shareList',
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
        *queryShare({ payload, callback }, { call, put }) {
            const data = yield call(queryShare, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        //删除
        *deleteShare({ payload, callback }, { call, put }) {
            const data = yield call(deleteShare, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 查询
        *getProductList({ payload, callback }, { call, put }) {
            const data = yield call(getProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        }


    },
    reducers: {
    }
});
