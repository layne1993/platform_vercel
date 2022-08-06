/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-28 18:47:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\list\model.js
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getProductList,
    getProductDetails,
    createProduct,
    editProduct,
    deleteProduct,
    exportProduct,
    queryStatistics,
    resetOrderRule,
    syncFundInfo,
    spiltShareValue,
    getSubFund,
    queryByProductName
} from './service';

export default modelExtend(pageModel, {
    namespace: 'productList',
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


        //产品信息列表-查询
        *getProductList({ payload, callback }, { call, put }) {
            const { code, data } = yield call(getProductList, payload);
            if (data && code === 1008) {
                yield put({
                    type: 'updateState',
                    payload: {
                        productInfoList: data
                    }
                });
                if (callback && typeof callback === 'function') callback(data);
            }

        },

        // 产品信息详情-查询
        *getProductDetails({ payload, callback }, { call, put }) {
            const data = yield call(getProductDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-新建
        *createProduct({ payload, callback }, { call, put }) {
            const data = yield call(createProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-编辑
        *editProduct({ payload, callback }, { call, put }) {
            const data = yield call(editProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-删除
        *deleteProduct({ payload, callback }, { call, put }) {
            const data = yield call(deleteProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-导出
        *exportProduct({ payload, callback }, { call, put }) {
            const data = yield call(exportProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信息-顶部统计
        *queryStatistics({ payload, callback }, { call, put }) {
            const data = yield call(queryStatistics, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 产品信息-顺序调整
        *resetOrderRule({ payload, callback }, { call, put }) {
            const data = yield call(resetOrderRule, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 同步新备案的产品
        *syncFundInfo({ payload, callback }, { call, put }) {
            const data = yield call(syncFundInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 份额拆分-回显
        *getSubFund({ payload, callback }, { call, put }) {
            const data = yield call(getSubFund, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 份额拆分-保存
        *spiltShareValue({ payload, callback }, { call, put }) {
            const data = yield call(spiltShareValue, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 查询母基金
        *queryByProductName({ payload, callback }, { call, put }) {
            const data = yield call(queryByProductName, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
