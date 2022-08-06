import { tradeFlowCreate, tradeFlowUpdate, tradeFlowQueryById, queryBank } from './service';

const Model = {
    namespace: 'CapitalFlowDetail',
    state: {},
    effects: {
        *TradeFlowCreate({ payload, callback }, { call, put }) {
            const response = yield call(tradeFlowCreate, payload);
            if (callback) callback(response);
        },
        *TradeFlowUpdate({ payload, callback }, { call, put }) {
            const response = yield call(tradeFlowUpdate, payload);
            if (callback) callback(response);
        },
        *TradeFlowQueryById({ payload, callback }, { call, put }) {
            const response = yield call(tradeFlowQueryById, payload);
            if (callback) callback(response);
        },
        *QueryBank({ payload, callback }, { call, put }) {
            const response = yield call(queryBank, payload);
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
