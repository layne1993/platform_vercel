import {
    getTableData,
    updateNotice,
    createNotice,
    updateNoticeStatus,
    queryNoticeDetail
} from './service.js';

const model = {
    namespace:'confirmAnnouncementSettings',
    state:{

    },
    effects:{
        // 获取表格数据
        *getTableData({ payload, callback }, { call }){
            const response = yield call(getTableData, payload);
            if(callback) callback(response);
        },
        // 新建
        *createNotice({ payload, callback }, { call }){
            const response = yield call(createNotice, payload);
            if(callback) callback(response);
        },
        // 编辑
        *updateNotice({ payload, callback }, { call }){
            const response = yield call(updateNotice, payload);
            if(callback) callback(response);
        },
        // 获取详情
        *queryNoticeDetail({ payload, callback }, { call }){
            const response = yield call(queryNoticeDetail, payload);
            if(callback) callback(response);
        },
        // 设为有效
        *updateNoticeStatus({ payload, callback }, { call }){
            const response = yield call(updateNoticeStatus, payload);
            if(callback) callback(response);
        }

    },
    reducers: {
    }
};

export default model;