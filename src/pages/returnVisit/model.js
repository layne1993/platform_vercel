/*
 * @description:
 * @Author: tangsc
 * @Date: 2021-02-05 09:49:46
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getNetValueDetails,
    getProductAllList,
    getUserList,
    createSingle,
    delets,
    getTemplateList,
    queryVersionNumber
} from './service';


export default modelExtend(pageModel, {
    namespace: 'returnVisitList',
    state: {
    },
    subscriptions: {
    },
    effects: {
        // 请求回访单列表
        *getNetValueDetails({ payload, callback }, { call }) {
            const response = yield call(getNetValueDetails, payload);
            if (callback && response.code === 1008) callback(response);
        },
        // 新增-获取产品名称
        *getProductAllList({callback}, {call}) {
            const response = yield call(getProductAllList);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 新增-获取客户信息
        *getUserList({callback}, {call}) {
            const response = yield call(getUserList);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 新增客户回访
        *createSingle({callback, payload}, {call}) {
            const response = yield call(createSingle, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 回访单列表删除数据
        *delets({callback, payload}, {call}) {
            const response = yield call(delets, payload);
            if (callback) callback(response);
        },
        // 查询回访模板列表
        *getTemplateList({callback, payload}, {call}) {
            const response = yield call(getTemplateList, payload);
            if (callback && response.code === 1008) callback(response);
        },
        // 查询版本号
        * queryVersionNumber({payload, callback}, {call}) {
            const response = yield call(queryVersionNumber, payload);
            if (callback && response.code === 1008) callback(response.data);
        }
    },
    reducers: {
    }
});
