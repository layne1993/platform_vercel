import { setCookie } from '@/utils/utils';
import {
    getMarketingServiceInfo,
    updateMarketingServiceInfo,
    getHistoryHolderList,
    setCheckSession,
    queryProductTypes,
    queryRiskStyleCount,
    getEmailSetting,
    saveEmailSetting,
    getMarketingWildcard,
    noticeTemplate,
    getAdminUserList,
    getMarketingCustomer
} from './service';

export default {
    namespace: 'tempForm',

    state: {
        marketingServiceCode: 0, //  模板（通知）code
        marketingServiceName: '', //  通知标签
        status: 1, //  通知状态
        isUseWechat: 1, //  是否微信通知
        isUseMessage: 1, //  是否短信通知
        isUseEmail: 1, //  是否邮件通知
        customerList: [], //  营销服务对象
        noticeType: 2, //  1: 立即发送 2:定时发送
        noticeTime: '', //  发送时间
        notifyFrequency: undefined, //  通知频率类型
        triggerDate: undefined, // 出发通知的日期
        triggerTime: '', // 出发时间
        noticeStatus: 0, //  发送状态 0: 未发送, 1: 已发送
        wechatServiceJson: {
            //  微信通知详情
            otherWeixinID: '', //  其他关注客户
            contentJson: {
                subject: '', //  主题
                content: '', //  内容
                url: '' //  卡片链接
            }
        },
        wechartProductName: [], // 微信产品名称
        wechartIsAll: ['0'], // 微信模块的是否只对该产品持有人发送
        messageProductName: [], // 短信产品名称
        messageIsAll: ['0'], // 短信模块的是否只对该产品持有人发送
        mailProductName: [], // 邮箱产品名称
        mailIsAll: ['0'], // 邮箱的是否只对该产品持有人发送
        isNetWorth: undefined, // 净值表
        messageServiceJson: {
            //  短信通知详情
            otherMobile: '', //  其他手机号,以逗号分隔
            content: '' //  短信正文
        },
        emailServiceJson: {
            //  邮件通知详情
            otherEmail: '', //  其他邮箱, 以逗号分隔
            subject: '', //  邮件标题
            content: '' //  邮件正文
        }
    },

    effects: {
    // 获取通知模板详情
        *getNoticeTemplate({ payload, callback }, { call, put }) {
            const response = yield call(noticeTemplate, payload);
            // console.log('response', response);
            if (response.code === 1008) {
                yield put({
                    type: 'saveNoticeTemplate',
                    payload: response.data[0] || {}
                });
            }
            if (callback) callback(response);
        },
        // 获取通配符
        *getMarketingWildcardList({ payload, callback }, { call }) {
            const response = yield call(getMarketingWildcard, payload);
            if (callback) callback(response);
        },
        *getTemplateForm({ payload, callback }, { call, put }) {
            const response = yield call(getMarketingServiceInfo, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'saveFormData',
                    payload: response.data || {}
                });
            }
            if (callback) callback(response);
        },
        *submitTemplateForm({ payload, callback }, { call }) {
            const response = yield call(updateMarketingServiceInfo, payload);
            // if(response.code===1008) {
            //   yield put({
            //     type: 'saveFormData',
            //     payload: response.data|| {},
            //   });
            // }
            if (callback) callback(response);
        },
        *getCustomerList({ payload, callback }, { call }) {
            const response = yield call(getHistoryHolderList, payload);
            if (callback) callback(response);
        },
        *getSafeToken({ payload, callback }, { call }) {
            const response = yield call(setCheckSession, payload);
            if (response.code === 1008) {
                setCookie('safeToken_ss', response.data);
            }
            if (callback) callback(response);
        },
        *getProductList({ payload, callback }, { call }) {
            const response = yield call(queryProductTypes, payload);
            if (callback) callback(response);
        },
        *getRiskStyleList({ payload, callback }, { call }) {
            const response = yield call(queryRiskStyleCount, payload);
            if (callback) callback(response);
        },
        *getEmailForm({ payload, callback }, { call }) {
            const response = yield call(getEmailSetting, payload);
            if (callback) callback(response);
        },
        *submitEmailForm({ payload, callback }, { call }) {
            const response = yield call(saveEmailSetting, payload);
            if (callback) callback(response);
        },
        *getAdminUserList({ payload, callback }, { call }) {
            const response = yield call(getAdminUserList, payload);
            if (callback) callback(response);
        },
        *getMarketingCustomer({ payload, callback }, { call }) {
            const response = yield call(getMarketingCustomer, payload);
            if (callback) callback(response);
        }
    },

    reducers: {
        saveFormData(state, { payload }) {
            // console.log('payload', payload);
            const getSelectArr = (str) => {
                let selectArr;
                if (str) {
                    if (str === 'all') {
                        selectArr = ['all'];
                    } else {
                        selectArr = str.split(',').map((item) => Number(item));
                    }
                } else {
                    selectArr = [];
                }
                return selectArr;
            };
            const getCheckoutValue = (val) => {
                // console.log(val, val===1, 'vvvvv')
                let checkArr = [];
                if (val === 0) {
                    checkArr = ['0'];
                } else if (val === 1) {
                    checkArr = [`${val}`];
                } else {
                    checkArr = ['0'];
                }
                return checkArr;
            };
            return {
                ...state,
                ...payload,
                customerList:
          payload.customerList === 'all'
              ? ['all']
              : (payload.customerList
                  ? payload.customerList
                  : []),
                // wechartProductName: payload.wechatServiceJson.product && payload.wechatServiceJson.product.split(','),
                // wechartIsAll: payload.wechatServiceJson.onlyHolder && [payload.wechatServiceJson.onlyHolder],
                messageProductName: payload.messageServiceJson
                    ? getSelectArr(payload.messageServiceJson.product)
                    : [],
                messageIsAll: payload.messageServiceJson
                    ? getCheckoutValue(payload.messageServiceJson.onlyHolder)
                    : ['0'],
                mailProductName: payload.emailServiceJson
                    ? getSelectArr(payload.emailServiceJson.product)
                    : [],
                mailIsAll: payload.emailServiceJson
                    ? getCheckoutValue(payload.emailServiceJson.onlyHolder)
                    : ['0'],
                isNetWorth: payload.emailServiceJson && payload.emailServiceJson.isSendNetValue
            };
        },
        saveNoticeTemplate(state, { payload }) {
            const wechatServiceJson = payload.wechatServiceJson
                ? JSON.parse(payload.wechatServiceJson)
                : {};
            const messageServiceJson = payload.messageServiceJson
                ? JSON.parse(payload.messageServiceJson)
                : {};
            const emailServiceJson = payload.emailServiceJson ? JSON.parse(payload.emailServiceJson) : {};
            const noticeTimeSetting = payload.noticeTimeSetting
                ? JSON.parse(payload.noticeTimeSetting)
                : {};
            const getString = (str, field) => {
                let strJson = {};
                let strArr = [];
                if (str) {
                    strJson = JSON.parse(str);
                    const select = strJson[field];
                    if (select !== 'all') {
                        strArr = strJson[field] ? strJson[field].split(',') : [];
                        strArr = strArr.map((item) => Number(item));
                    } else {
                        strArr = ['all'];
                    }
                }
                return strArr;
            };
            return {
                ...state,
                ...payload,
                wechatServiceJson,
                messageServiceJson,
                emailServiceJson,
                noticeStatus: 0,
                customerList: payload.customerList?payload.customerList.split(','):'',
                wechartProductName: getString(payload.wechatServiceJson, 'product'),
                wechartIsAll: wechatServiceJson.onlyHolder && [wechatServiceJson.onlyHolder],
                messageProductName: getString(payload.messageServiceJson, 'product'),
                messageIsAll: messageServiceJson.onlyHolder &&
          messageServiceJson.onlyHolder && [messageServiceJson.onlyHolder],
                mailProductName: getString(payload.emailServiceJson, 'product'),
                mailIsAll: emailServiceJson.onlyHolder &&
          emailServiceJson.onlyHolder && [emailServiceJson.onlyHolder],
                notifyFrequency: `${noticeTimeSetting.frequence}`,
                triggerDate: noticeTimeSetting.day ? Number(noticeTimeSetting.day) : undefined,
                triggerTime: noticeTimeSetting.time,
                isNetWorth: emailServiceJson.isSendNetValue
            };
        },
        clearData(state) {
            return {
                ...state,
                marketingServiceCode: 0, //  模板（通知）code
                marketingServiceName: '', //  通知标签
                status: 1, //  通知状态
                isUseWechat: 1, //  是否微信通知
                isUseMessage: 1, //  是否短信通知
                isUseEmail: 1, //  是否邮件通知
                customerList: [], //  营销服务对象
                noticeType: 2, //  1: 立即发送 2:定时发送
                noticeTime: '', //  发送时间
                notifyFrequency: undefined, //  通知频率类型
                triggerDate: undefined, // 出发通知的日期
                triggerTime: '', // 出发时间
                noticeStatus: 0, //  发送状态 0: 未发送, 1: 已发送
                wechatServiceJson: {
                    //  微信通知详情
                    otherWeixinID: '', //  其他关注客户
                    contentJson: {
                        subject: '', //  主题
                        content: '', //  内容
                        url: '' //  卡片链接
                    }
                },
                wechartProductName: [], // 微信产品名称
                wechartIsAll: ['0'], // 微信模块的是否只对该产品持有人发送
                messageProductName: [], // 短信产品名称
                messageIsAll: ['0'], // 短信模块的是否只对该产品持有人发送
                mailProductName: [], // 邮箱产品名称
                mailIsAll: ['0'], // 邮箱的是否只对该产品持有人发送
                isNetWorth: undefined, // 净值表
                messageServiceJson: {
                    //  短信通知详情
                    otherMobile: '', //  其他手机号,以逗号分隔
                    content: '' //  短信正文
                },
                emailServiceJson: {
                    //  邮件通知详情
                    otherEmail: '', //  其他邮箱, 以逗号分隔
                    subject: '', //  邮件标题
                    content: '' //  邮件正文
                }
            };
        }
    }
};
