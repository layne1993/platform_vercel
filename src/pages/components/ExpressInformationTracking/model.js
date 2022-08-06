/*
 * @Author: your name
 * @Date: 2021-06-28 15:54:12
 * @LastEditTime: 2021-06-28 15:55:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\ExpressInformationTracking\model.js
 */
import {
    queryList,
    getExpressDocumentDetail,
    saveExpressDocument,
    deleteExpressDocumentBatch,
    querySelectNetWorkFile,
    autoTrackingCompany,
    queryTrackingMessage
} from './service';

const Model = {
    namespace: 'expressInformationTracking',
    state: {},
    effects: {
        // 快递列表查询
        *queryList({payload, callback}, {call}) {
            const response = yield call(queryList, payload);
            if (callback) callback(response);
        },
        *getExpressDocumentDetail({payload, callback}, {call}) {
            const response = yield call(getExpressDocumentDetail, payload);
            if (callback) callback(response);
        },
        *saveExpressDocument({payload, callback}, {call}) {
            const response = yield call(saveExpressDocument, payload);
            if (callback) callback(response);
        },
        *deleteExpressDocumentBatch({payload, callback}, {call}) {
            const response = yield call(deleteExpressDocumentBatch, payload);
            if (callback) callback(response);
        },
        // 请求网盘
        *querySelectNetWorkFile({payload, callback}, {call}) {
            const response = yield call(querySelectNetWorkFile, payload);
            if (callback) callback(response);
        },
        // 根据快递单号查询快递公司
        *autoTrackingCompany({payload, callback}, {call}) {
            const response = yield call(autoTrackingCompany, payload);
            if (callback) callback(response);
        },
        *queryTrackingMessage({payload, callback}, {call}) {
            const response = yield call(queryTrackingMessage, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
    }
};
export default Model;
