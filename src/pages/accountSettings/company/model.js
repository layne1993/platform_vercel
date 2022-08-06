/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-05-10 17:00:49
 * @LastEditTime: 2021-07-20 17:14:57
 */
import {
    saveInfo,
    renderLogo,
    sendAmount,
    getRealNameInfo,
    verifiedCheck,
    verified,
    sealUpload,
    queryProvince,
    queryCity,
    queryBank,
    sealInfo,
    sealManager,
    stampManager,
    captcha,
    subbranch,
    getSealManager,
    getTrusteeshipInfo,
    getStampUserInfo,
    getSealNameInfo,
    validateCaptcha,
    queryManagerInfo,
    querySealInfo,
    queryStampList,
    deleteLogo,
    clearRealName,
    isHasRealName,
    openAccount,
    hasexistRealName
} from './service';

const Model = {
    namespace: 'companySetting',
    state: {

    },
    effects: {
        // 保存
        * saveInfo({ payload, callback }, { call }) {
            const response = yield call(saveInfo, payload);
            if (callback) callback(response);
        },
        // 首次进入回显
        * renderLogo({ callback, payload }, { call }) {
            const response = yield call(renderLogo, payload);
            if (callback) callback(response);
        },
        * getRealNameInfo({ callback, payload }, { call }) {
            const response = yield call(getRealNameInfo, payload);
            if (callback) callback(response);
        },

        * verifiedCheck({ callback, payload }, { call }) {
            const response = yield call(verifiedCheck, payload);
            if (callback) callback(response);
        },

        * verified({ callback, payload }, { call }) {
            const response = yield call(verified, payload);
            if (callback) callback(response);
        },

        * sealUpload({ callback, payload }, { call }) {
            const response = yield call(sealUpload, payload);
            if (callback) callback(response);
        },
        // 发送金额
        * sendAmount({ callback, payload }, { call }) {
            const response = yield call(sendAmount, payload);
            if (callback) callback(response);
        },

        * queryProvince({ callback, payload }, { call }) {
            const response = yield call(queryProvince, payload);
            if (callback) callback(response);
        },


        * queryCity({ callback, payload }, { call }) {
            const response = yield call(queryCity, payload);
            if (callback) callback(response);
        },

        * queryBank({ callback, payload }, { call }) {
            const response = yield call(queryBank, payload);
            if (callback) callback(response);
        },

        * sealInfo({ callback, payload }, { call }) {
            const response = yield call(sealInfo, payload);
            if (callback) callback(response);
        },

        * sealManager({ callback, payload }, { call }) {
            const response = yield call(sealManager, payload);
            if (callback) callback(response);
        },

        * stampManager({ callback, payload }, { call }) {
            const response = yield call(stampManager, payload);
            if (callback) callback(response);
        },

        * captcha({ callback, payload }, { call }) {
            const response = yield call(captcha, payload);
            if (callback) callback(response);
        },

        * subbranch({ callback, payload }, { call }) {
            const response = yield call(subbranch, payload);
            if (callback) callback(response);
        },

        * getSealManager({ callback, payload }, { call }) {
            const response = yield call(getSealManager, payload);
            if (callback) callback(response);
        },
        * getTrusteeshipInfo({ callback, payload }, { call }) {
            const response = yield call(getTrusteeshipInfo, payload);
            if (callback) callback(response);
        },
        * getStampUserInfo({ callback, payload }, { call }) {
            const response = yield call(getStampUserInfo, payload);
            if (callback) callback(response);
        },
        * getSealNameInfo({ callback, payload }, { call }) {
            const response = yield call(getSealNameInfo, payload);
            if (callback) callback(response);
        },
        * validateCaptcha({ callback, payload }, { call }) {
            const response = yield call(validateCaptcha, payload);
            if (callback) callback(response);
        },
        * queryManagerInfo({ callback, payload }, { call }) {
            const response = yield call(queryManagerInfo, payload);
            if (callback) callback(response);
        },
        * querySealInfo({ callback, payload }, { call }) {
            const response = yield call(querySealInfo, payload);
            if (callback) callback(response);
        },
        * queryStampList({ callback, payload }, { call }) {
            const response = yield call(queryStampList, payload);
            if (callback) callback(response);
        },
        * deleteLogo({ callback, payload }, { call }) {
            const response = yield call(deleteLogo, payload);
            if (callback) callback(response);
        },

        * clearRealName({ callback, payload }, { call }) {
            const response = yield call(clearRealName, payload);
            if (callback) callback(response);
        },

        * isHasRealName({ callback, payload }, { call }) {
            const response = yield call(isHasRealName, payload);
            if (callback) callback(response);
        },

        * openAccount({ callback, payload }, { call }) {
            const response = yield call(openAccount, payload);
            if (callback) callback(response);
        },

        * hasexistRealName({ callback, payload }, { call }) {
            const response = yield call(hasexistRealName, payload);
            if (callback) callback(response);
        }

    },
    reducers: {

    }
};
export default Model;
