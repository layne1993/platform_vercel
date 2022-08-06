/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:49:05
 * @LastEditTime: 2021-06-09 17:45:27
 */
import type { Effect } from 'umi';
import {
    getListData,
    createOrEdit,
    recommendedInvestor,
    channelProductList,
    channelInfo,
    updateChannel,
    changeChannelRelatedStatus,
    vacancyChannelList,
    editMarketValueStatus
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getListData: Effect;
        recommendedInvestor: Effect;
        createOrEdit: Effect;
        underwriterList: Effect;
        channelProductList: Effect;
        channelInfo: Effect;
        updateChannel: Effect;
        changeChannelRelatedStatus: Effect;
        vacancyChannelList: Effect;
        findTask: Effect;
        editMarketValueStatus: Effect
    };
    reducers: {
        setnoticesList: any;
    };
}

const Model: ModelType = {
    namespace: 'CHANNEL',
    state: {
        noticesList: {}
    },
    effects: {
        *getListData({ payload, callback }, { call, put }) {
            const res = yield call(getListData, payload);
            if (callback) callback(res);
        },

        *createOrEdit({ payload, callback }, { call, put }) {
            const res = yield call(createOrEdit, payload);
            if (callback) callback(res);
        },

        *recommendedInvestor({ payload, callback }, { call, put }) {
            const res = yield call(recommendedInvestor, payload);
            if (callback) callback(res);
        },

        *channelProductList({ payload, callback }, { call, put }) {
            const res = yield call(channelProductList, payload);
            if (callback) callback(res);
        },


        *underwriterList({ payload, callback }, { call, put }) {
            const res = yield call(channelProductList, payload);
            if (callback) callback(res);
        },

        *channelInfo({ payload, callback }, { call, put }) {
            const res = yield call(channelInfo, payload);
            if (callback) callback(res);
        },

        *updateChannel({ payload, callback }, { call, put }) {
            const res = yield call(updateChannel, payload);
            if (callback) callback(res);
        },
        *changeChannelRelatedStatus({ payload, callback }, { call, put }) {
            const res = yield call(changeChannelRelatedStatus, payload);
            if (callback) callback(res);
        },

        *vacancyChannelList({ payload, callback }, { call, put }) {
            const res = yield call(vacancyChannelList, payload);
            if (callback) callback(res);
        },

        *editMarketValueStatus({ payload, callback }, { call, put }) {
            const res = yield call(editMarketValueStatus, payload);
            if (callback) callback(res);
        }

    },
    reducers: {
        setnoticesList(state, { payload }) {
            return {
                ...state,
                noticesList: payload
            };
        }
    }
};
export default Model;
