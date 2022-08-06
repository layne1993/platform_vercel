import { tradeFlowQuery, tradeGetNotifyType, tradeGetNotify, tradeConfirm } from './service';

const Model = {
    namespace: 'CapitalFlowList',
    state: {  },
    effects: {
        *TradeFlowQuery({ payload, callback }, { call, put }) {
            const response = yield call(tradeFlowQuery, payload);
            if (callback) callback(response);
        },
        *TradeGetNotifyType({ payload, callback }, { call, put }) {
            const response = yield call(tradeGetNotifyType, payload);
            if (callback) callback(response);
        },
        *TradeGetNotify({ payload, callback }, { call, put }) {
            const response = yield call(tradeGetNotify, payload);
            if (callback) callback(response);
        },
        *TradeConfirm({ payload, callback }, { call, put }) {
            const response = yield call(tradeConfirm, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        // saveInfo(state, action) {
        //   const { payload } = action;
        //   let { processDetail } = state;
        //   if (payload && payload.code === 1008) {
        //     processDetail = payload.data || {};
        //   }
        //   return { ...state, processDetail };
        // },
        // resetModel(state, { payload }) {
        //   return { ...state, ...payload };
        // },
    }
};
export default Model;
