import { addProductFile, editProductFile, productFileDetail, productFileUpload } from './service';

const Model = {
    namespace: 'productNoticeBatch',
    state: {
        fileInfo: {}
    },
    effects: {
        *addProductFile({ payload, callback }, { call, put }) {
            const response = yield call(addProductFile, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *editProductFile({ payload, callback }, { call, put }) {
            const response = yield call(editProductFile, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *productFileDetail({ payload, callback }, { call, put }) {
            const response = yield call(productFileDetail, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },
        *productFileUpload({ payload, callback }, { call, put }) {
            const response = yield call(productFileUpload, payload);

            if (callback) callback(response);
        }
    },
    reducers: {
        save(state, action) {
            const { payload } = action;
            let { fileInfo } = state;
            if (payload && payload.code === 1008) {
                fileInfo = payload.data || {};
            }
            return { ...state, fileInfo };
        }
    }
};
export default Model;
