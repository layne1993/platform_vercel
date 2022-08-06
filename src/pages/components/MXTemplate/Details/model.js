/*
 * @Author: your name
 * @Date: 2021-04-01 13:14:02
 * @LastEditTime: 2021-04-18 17:54:53
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\components\MXTemplate\Details\model.js
 */
import { setCookie } from '@/utils/utils';
import {getPdfUrl, queryServer, managerSign, getTemplateBaseInfo, newAddSaveTemplateInfo, getAllList, sendCfcaSignMobileCode, getAllInfoList, getAllocatedProtocol } from './service';

const Model = {
    namespace: 'templateDetails',
    state: {
        baseInfo: {},
        lackDocumentType: undefined,  // 缺少的文档类型（1:产品合同,2:补充协议,3:风险揭示书,4:产品说明书)
        documentType: undefined       // 协议类型（1:产品合同,2:补充协议,3:风险揭示书)
    },
    effects: {
        *getTemplateInfo({ payload, callback }, { call, put }) {
            const response = yield call(getTemplateBaseInfo, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *newAddTemplate({ payload, callback }, { call, put }) {
            const response = yield call(newAddSaveTemplateInfo, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *getAllList({ payload, callback }, { call }) {
            const response = yield call(getAllList, payload);
            if (callback) callback(response);
        },
        *getAllInfoList({ payload, callback }, { call }) {
            const response = yield call(getAllInfoList, payload);
            if (callback) callback(response);
        },
        *sendCfcaSignMobileCode({ payload, callback }, { call }) {
            const response = yield call(sendCfcaSignMobileCode, payload);
            if (callback) callback(response);
        },
        *managerSign({ payload, callback }, { call, put }) {
            const response = yield call(managerSign, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        /* 文件路径前半段 */
        *queryServer({ payload }, { call }) {
            const response = yield call(queryServer, payload);
            if (response.code === 1008) {
                setCookie('LinkUrl', response.data);
            }
        },
        // 查询已配协议
        *getAllocatedProtocol({ payload, callback }, { call }) {
            const response = yield call(getAllocatedProtocol, payload);
            if (callback) callback(response);
        },
        // 获取图片地址
        *getPdfUrl({ payload, callback }, { call }) {
            const response = yield call(getPdfUrl, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        save(state, action) {
            const { payload } = action;
            let { baseInfo } = state;
            if (payload && payload.code === 1008 && payload.data) {
                baseInfo = payload.data || {};
            }
            return { ...state, baseInfo };
        },
        resetModel(state, { payload }) {
            return { ...state, ...payload };
        },
        saveUploadFile(state, { payload }) {
            const { baseInfo } = state;
            baseInfo.documentJsonObject = JSON.stringify(payload.data);
            if (payload.delete) {
                baseInfo.officialSignStatus = null;
                baseInfo.personalSignStatus = null;
            }
            return { ...state, baseInfo };
        },
        updateState(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
export default Model;
