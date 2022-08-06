import { getWechatNoticeList, getMessageNoticeList, getEMailNoticeList, deleteMarketingNoticeList, getEmailSetting, saveEmailSetting, templateList, getMarketingSendDetailList, resendMarketingNotice } from './service';

export default {
    namespace: 'tempList',

    state: {
        weChatList: {
            list: []
            // pagination: {"total":0,"pageSize":10,"current":1},
        },
        messageList: {
            list: []
            // pagination: {"total":0,"pageSize":10,"current":1},
        },
        emailList: {
            list: []
            // pagination: {"total":0,"pageSize":10,"current":1},
        },
        tempList: {
            list: []
        }
    },

    effects: {
    // 获取通知模板列表
        *getTemplateList({ payload, callback }, { call, put }) {
            const response = yield call(templateList, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'save',
                    params: { ...payload, type: 'template' },
                    payload: response.data || []
                });
            }
            if (callback) callback(response);
        },
        *getWechatList({ payload, callback }, { call, put }) {
            const response = yield call(getWechatNoticeList, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'save',
                    params: { ...payload, type: 'weChat' },
                    payload: response.data || []
                });
            }
            if (callback) callback(response);
        },
        *getMessageList({ payload, callback }, { call, put }) {
            const response = yield call(getMessageNoticeList, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'save',
                    params: { ...payload, type: 'message' },
                    payload: response.data || []
                });
            }
            if (callback) callback(response);
        },
        *getEMailList({ payload, callback }, { call, put }) {
            const response = yield call(getEMailNoticeList, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'save',
                    params: { ...payload, type: 'email' },
                    payload: response.data || []
                });
            }
            if (callback) callback(response);
        },
        *deletList({ payload, callback }, { call }) {
            const response = yield call(deleteMarketingNoticeList, payload);
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
        *getMarketingSendDetailList({ payload, callback }, { call }) {
            const response = yield call(getMarketingSendDetailList, payload);
            if (callback) callback(response);
        },
        *resendMarketingNotice({ payload, callback }, { call }) {
            const response = yield call(resendMarketingNotice, payload);
            if (callback) callback(response);
        }
    },

    reducers: {
        save(state, { payload, params }) {
            const { weChatList, messageList, emailList, tempList } = state;
            const { type } = params;
            if (type === 'weChat') {
                weChatList.list = payload.sort((a, b) => b.createTime - a.createTime);
            }
            if (type === 'message') {
                messageList.list = payload.sort((a, b) => b.createTime - a.createTime);
            }
            if (type === 'email') {
                emailList.list = payload.sort((a, b) => b.createTime - a.createTime);
            }
            if (type === 'template') {
                tempList.list = payload.sort((a, b) => b.updateTime - a.updateTime);
            }
            return {
                ...state,
                weChatList,
                messageList,
                emailList
            };
        },
        savePagination(state, { payload }) {
            const { weChatList } = state;
            weChatList.pagination = payload;
            // let { data: { pagination } } = state;
            // pagination = { ...pagination, payload };
            return {
                ...state,
                weChatList
            };
        }
    }
};
