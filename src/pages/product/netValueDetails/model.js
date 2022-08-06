import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getNetValueList,
    getNetValueDetails,
    createNetValue,
    editNetValue,
    deleteNetValue
} from './service';

export default modelExtend(pageModel, {
    namespace: 'netValueDetails',
    state: {
        netValueList: []                 // 产品净值列表
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


        //产品信息列表-查询
        *getNetValueList({ payload }, { call, put }) {
            const { code, data } = yield call(getNetValueList, payload);
            if (data && code === 1008) {
                yield put({
                    type: 'updateState',
                    payload: {
                        netValueList: data
                    }
                });
            }
        },

        // 产品信息详情-查询
        *getNetValueDetails({ payload, callback }, { call, put }) {
            const data = yield call(getNetValueDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-新建
        *createNetValue({ payload, callback }, { call, put }) {
            const data = yield call(createNetValue, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-编辑
        *editNetValue({ payload, callback }, { call, put }) {
            const data = yield call(editNetValue, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-删除
        *deleteNetValue({ payload, callback }, { call, put }) {
            const data = yield call(deleteNetValue, payload);
            if (callback && typeof callback === 'function') callback(data);
        }
    },
    reducers: {
    }
});
