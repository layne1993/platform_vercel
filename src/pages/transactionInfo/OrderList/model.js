
import { signConfirmList, signConfirmExport, trusteeship} from './service';

const Model = {
    namespace: 'OrderList',
    state: {
        // processDetail: {},
    },
    effects: {
        *SignConfirmList({ payload, callback }, { call, put }) {
            const response = yield call(signConfirmList, payload);
            if (callback) callback(response);
        },
        *SignConfirmExport({ payload, callback }, { call, put }) {
            const response = yield call(signConfirmExport, payload);
            if (callback) callback(response);
        },
        *trusteeship({ payload, callback }, { call, put }) {
            const response = yield call(trusteeship, payload);
            if (callback) callback(response);
        }
    //     *getProductManual({ payload, callback }, { call }) {
    //         const response = yield call(getProductManual, payload);
    //         if (callback) callback(response);
    //     },
    //     *saveAudit({ payload, callback }, { call }) {
    //         const response = yield call(saveAudit, payload);
    //         if (callback) callback(response);
    //     },
    //     /* 文件路径前半段 */
    //     *queryServer({ payload }, { call }) {
    //         const response = yield call(queryServer, payload);
    //         if (response.code === 1008) {
    //             setCookie('LinkUrl', response.data);
    //         }
    //     },
    },
    reducers: {
        // saveInfo(state, action) {
        //     const { payload } = action;
        //     let { processDetail } = state;
        //     if (payload && payload.code === 1008) {
        //         processDetail = payload.data || {};
        //     }
        //     return { ...state, processDetail };
        // },
        // resetModel(state, { payload }) {
        //     return { ...state, ...payload };
        // },
    }
};
export default Model;
