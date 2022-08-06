import { tradeCreate, tradeQueryById, tradeUpdate } from './service';

const Model = {
    namespace: 'TransactionDetail',
    state: {},
    effects: {
        *TradeCreate({ payload, callback }, { call, put }) {
            const response = yield call(tradeCreate, payload);
            if (callback) callback(response);
        },
        *TradeQueryById({ payload, callback }, { call, put }) {
            const response = yield call(tradeQueryById, payload);
            if (callback) callback(response);
        },
        *TradeUpdate({ payload, callback }, { call, put }) {
            const response = yield call(tradeUpdate, payload);
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
