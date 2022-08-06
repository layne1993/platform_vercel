import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getOpenDayList,
    getOpenDayDetails,
    createOpenDay,
    editOpenDay,
    deleteOpenDay,
    selectProductByCount,
    setStatus
} from './service';

export default modelExtend(pageModel, {
    namespace: 'openDayDetails',
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

        // 产品开放日详情-查询
        *getOpenDayDetails({ payload, callback }, { call, put }) {
            const data = yield call(getOpenDayDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品开放日-新建
        *createOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(createOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-编辑
        *editOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(editOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        *selectProductByCount({ payload, callback }, { call, put }) {
            const data = yield call(selectProductByCount, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        *setStatus({ payload, callback }, { call, put }) {
            const data = yield call(setStatus, payload);
            if (callback && typeof callback === 'function') callback(data);
        }



    },
    reducers: {
    }
});
