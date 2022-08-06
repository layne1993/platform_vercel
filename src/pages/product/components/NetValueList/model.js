/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2021-07-06 10:55:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\product\components\NetValueList\model.js
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import { notification } from 'antd';
import {
    getNetValueList,
    getNetValueDetails,
    createNetValue,
    editNetValue,
    deleteNetValue,
    refreshProductOpenDay,
    batchMaintain
} from './service';

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

export default modelExtend(pageModel, {
    namespace: 'netValue',
    state: {
        netValueList: {}             // 产品净值列表
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
        // 刷新开放日
        *refreshProductOpenDay({ payload, callback }, { call, put }) {
            const data = yield call(refreshProductOpenDay, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        //产品信息列表-查询
        *getNetValueList({ payload }, { call, put }) {
            const { code, data, message } = yield call(getNetValueList, payload);
            if (data && code === 1008) {
                yield put({
                    type: 'updateState',
                    payload: {
                        netValueList: data
                    }
                });
            } else {
                const warningText = message || data || '查询失败！';
                openNotification('warning', `提示（代码：${code}）`, warningText, 'topRight');
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
        },

        // 批量维护
        *batchMaintain({ payload, callback }, { call, put }) {
            const data = yield call(batchMaintain, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
    }
});
