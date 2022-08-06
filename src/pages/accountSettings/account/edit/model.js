import { findUserById, insertUser, quireRoleList, querySelectAllUser } from './service';

const Model = {
    namespace: 'accountInfo',
    state: {},
    effects: {
        *getAccountInfo({ payload, callback }, { call }) {
            const response = yield call(findUserById, payload);
            if (callback) callback(response);
        },
        *saveAccountInfo({ payload, callback }, { call }) {
            const response = yield call(insertUser, payload);
            if (callback) callback(response);
        },
        *quireRoleList({ payload, callback }, { call }) {
            const response = yield call(quireRoleList, payload);
            if (callback) callback(response);
        },
        *querySelectAllUser({ payload, callback }, { call }) {
            const response = yield call(querySelectAllUser, payload);
            if (callback) callback(response);
        }
    }
};

export default Model;
