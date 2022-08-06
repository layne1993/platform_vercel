import { setCookie } from '@/utils/utils';
import {
    queryProductSignData,
    queryIdentifyData,
    queryFlowList,
    queryHeadInfo,
    queryServer,
    Refresh,
    queryList,
    queryTradeTimes,
    queryReminders,
    queryDataStatistics,
    queryNoticeList,
    queryIsNeedAudit,
    pendingProcessesAndNotification,
    isReadTrue,
    addRemind,
    deleteRemind
} from './service';

const Model = {
    namespace: 'panel',
    state: {
        headInfo: {},
        flowList: [],
        signData: [],
        identifyData: [],
        activities: []
    },
    effects: {
        *init(_, { put }) {
            yield put({
                type: 'fetchHeadInfo'
            });
            yield put({
                type: 'fetchSignData'
            });
            yield put({
                type: 'fetchIdentifyData'
            });
        },

        *fetchHeadInfo(_, { call, put }) {
            const response = yield call(queryHeadInfo);
            yield put({
                type: 'save',
                payload: response
            });
        },
        //  获取产品签约次数
        *fetchSignData({ payload, callback }, { call, put }) {
            const response = yield call(queryProductSignData, payload);
            yield put({
                type: 'saveSignData',
                payload: response
            });
            if (callback) callback(response);
        },
        //  获取合格投资者认定次数
        *fetchIdentifyData({ payload, callback }, { call, put }) {
            const response = yield call(queryIdentifyData, payload);
            yield put({
                type: 'saveIdentifyData',
                payload: response
            });
            if (callback) callback(response);
        },
        //  获取待处理流程列表
        *fetchFlowList({ payload, callback }, { call, put }) {
            const response = yield call(queryFlowList, payload);
            yield put({
                type: 'saveList',
                payload: response
                // payload: {
                //   activities: Array.isArray(response) ? response : [],
                // },
            });
            if (callback) callback(response);
        },
        // 获取通知信息列表
        *queryNoticeList({ payload, callback }, { call, put }) {
            const response = yield call(queryNoticeList, payload);
            if(callback) callback(response);
        },
        /* 文件路径前半段 */
        *queryServer({ payload }, { call }) {
            const response = yield call(queryServer, payload);
            if (response.code === 1008) {
                setCookie('LinkUrl', response.data);
            }
        },

        *refresh({ payload, callback }, { call }) {
            const response = yield call(Refresh, payload);
            if (callback) callback(response);
        },



        // 待处理流程-查询
        *queryList({ payload, callback }, { call }) {
            const response = yield call(queryList, payload);
            if (callback) callback(response);
        },
        // 交易统计-查询
        *queryTradeTimes({ payload, callback }, { call }) {
            const response = yield call(queryTradeTimes, payload);
            if (callback) callback(response);
        },
        // 交易统计-查询
        *queryReminders({ payload, callback }, { call }) {
            const response = yield call(queryReminders, payload);
            if (callback) callback(response);
        },
        // 数据统计-查询
        *queryDataStatistics({ payload, callback }, { call }) {
            const response = yield call(queryDataStatistics, payload);
            if (callback) callback(response);
        },
        // 查询是否需要审核
        *queryIsNeedAudit({ payload, callback }, { call, put }) {
            const data = yield call(queryIsNeedAudit, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 查询通知
        *pendingProcessesAndNotification({ payload, callback }, { call, put }) {
            const data = yield call(pendingProcessesAndNotification, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 已读
        *isReadTrue({ payload, callback }, { call, put }) {
            const data = yield call(isReadTrue, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 新增自定义提醒
        *addRemind({ payload, callback }, { call, put }) {
            const data = yield call(addRemind, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 自定义提醒删除
        *deleteRemind({ payload, callback }, { call, put }) {
            const data = yield call(deleteRemind, payload);
            if (callback && typeof callback === 'function') callback(data);
        }
    },
    reducers: {
        saveSignData(state, { payload }) {
            let { signData } = state;
            if (payload && payload.code === 1008) {
                signData = payload.data || [];
                const newList = [];
                signData.map((item) => newList.push({ x: `${Number(item.month)}月`, y: item.total }));
                signData = newList;
            }
            return { ...state, signData };
        },
        saveIdentifyData(state, { payload }) {
            let { identifyData } = state;
            if (payload && payload.code === 1008) {
                identifyData = payload.data || [];
                const newList = [];
                identifyData.map((item) => newList.push({ x: `${Number(item.month)}月`, y: item.total }));
                identifyData = newList;
            }
            return { ...state, identifyData };
        },
        saveList(state, { payload }) {
            let { flowList } = state;
            if (payload && payload.code === 1008) {
                flowList = Array.isArray(payload.data) ? payload.data : [];
            }
            return { ...state, flowList };
        },
        save(state, { payload }) {
            let { headInfo } = state;
            if (payload && payload.code === 1008) {
                headInfo = payload.data || {};
            }
            return { ...state, headInfo };
        },
        clear() {
            return {
                headInfo: {},
                signData: [],
                flowList: [],
                identifyData: [],
                activities: []
            };
        }
    }
};
export default Model;
