/*
 * @description:风控列表
 * @Author: tangsc
 * @Date: 2020-11-24 10:07:44
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getRiskControlInfo,
    deleteRiskControlInfo
} from './service';

export default modelExtend(pageModel, {

    namespace: 'riskControlList',
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
        *getRiskControlInfo({ payload, callback }, { call, put }) {
            const data = yield call(getRiskControlInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 删除
        *deleteRiskControlInfo({ payload, callback }, { call, put }) {
            const data = yield call(deleteRiskControlInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        }
    },
    reducers: {
    }
});
