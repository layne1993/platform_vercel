import { getQualifiedList, selectAllAccountManager, deleteIdentifyFlow } from './service';

const Model = {
    namespace: 'INVESTOR_IDENTIFY',
    state: {},
    effects: {
        *queryQualifiedList({ payload, callback }, { call }) {
            const response = yield call(getQualifiedList, payload);
            if (callback) callback(response);
        },
        *selectAllAccountManager({ payload, callback }, { call }) {
            const response = yield call(selectAllAccountManager, payload);
            if (callback) callback(response);
        },

        *deleteIdentifyFlow({ payload, callback }, { call }) {
            const response = yield call(deleteIdentifyFlow, payload);
            if (callback) callback(response);
        }
    },
    reducers: {}
};
export default Model;
