/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-19 16:10:49
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getDividendsList,
    // getDividendsDetails,
    createDividends,
    dividendsDetail,
    dividendsEdit,
    deleteDividends,
    dividendStatistics,
    dividendUpload,
    queryByCustomerList,
    queryByProductList,
    statisticsList
} from './service';

export default modelExtend(pageModel, {
    namespace: 'DIVIDENDS_LIST',
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

        // 分红详情-查询
        *getDividendsList({ payload, callback }, { call }) {
            const res = yield call(getDividendsList, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        // 分红详情-查询
        *StatisticsList({ payload, callback }, { call }) {
            const res = yield call(statisticsList, payload);
            if (callback && typeof callback === 'function') callback(res);
        },

        // // 分红详情-查询
        // *getDividendsDetails({ payload, callback }, { call, put }) {
        //     const data = yield call(getDividendsDetails, payload);
        //     if (callback && typeof callback === 'function') callback(data);
        // },

        // 分红-删除
        *deleteDividends({ payload, callback }, { call, put }) {
            const data = yield call(deleteDividends, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 分红-新建
        *createDividends({ payload, callback }, { call, put }) {
            const data = yield call(createDividends, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 分红-详情
        *dividendsDetail({ payload, callback }, { call, put }) {
            const data = yield call(dividendsDetail, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 分红-编辑
        *dividendsEdit({ payload, callback }, { call, put }) {
            const data = yield call(dividendsEdit, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 分红-顶部统计
        *dividendStatistics({ payload, callback }, { call, put }) {
            const data = yield call(dividendStatistics, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 分红-批量上传
        *dividendUpload({ payload, callback }, { call, put }) {
            const data = yield call(dividendUpload, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 客户list
        *queryByCustomerList({ payload, callback }, { call, put }) {
            const data = yield call(queryByCustomerList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品list
        *queryByProductList({ payload, callback }, { call, put }) {
            const data = yield call(queryByProductList, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
