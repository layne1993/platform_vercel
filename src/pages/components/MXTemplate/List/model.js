/*
 * @description:
 * @Author: tangsc
 * @Date: 2020-11-19 11:18:38
 */
import { getTemplateList, abolishOrRecovery, getProtocolAlert, queryDocumentInfo } from './service';

const Model = {
    namespace: 'templateList',
    state: {
        templateList: []
    },
    effects: {
        *queryTemplateList({ payload, callback }, { call, put }) {
            const response = yield call(getTemplateList, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },

        // 废除、恢复
        *abolishOrRecovery({ payload, callback }, { call, put }) {
            const data = yield call(abolishOrRecovery, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 查询协议警示
        *getProtocolAlert({ payload, callback }, { call, put }) {
            const data = yield call(getProtocolAlert, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 手动同步模板协议
        *queryDocumentInfo({ payload, callback }, { call  }) {
            const data = yield call(queryDocumentInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
        save(state, action) {
            const { payload } = action;
            let { templateList } = state;
            if (payload.data && payload.code === 1008) {
                if (payload.data.list) {
                    templateList = payload.data.list || [];
                }
            }
            return { ...state, templateList };
        }
    }
};
export default Model;
