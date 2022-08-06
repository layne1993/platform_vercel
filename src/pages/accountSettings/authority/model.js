import { quireMenuByRoleId, quireRoleList, deleteRole, addRoleMenu, queryAllMenuRole, editRoleMenu } from './service';

const Model = {
    namespace: 'authority',
    state: {},
    effects: {
        *quireRoleList({ payload, callback }, { call }) {
            const response = yield call(quireRoleList, payload);
            if (callback) callback(response);
        },
        *quireMenuByRoleId({ payload, callback }, { call }) {
            const response = yield call(quireMenuByRoleId, payload);
            if (callback) callback(response);
        },
        *deleteRole({ payload, callback }, { call }) {
            const response = yield call(deleteRole, payload);
            if (callback) callback(response);
        },
        *addRoleMenu({ payload, callback }, { call }) {
            const response = yield call(addRoleMenu, payload);
            if (callback) callback(response);
        },
        *queryAllMenuRole({ payload, callback }, { call }) {
            const response = yield call(queryAllMenuRole, payload);
            if (callback) callback(response);
        },
        *editRoleMenu({ payload, callback }, { call }) {
            const response = yield call(editRoleMenu, payload);
            if (callback) callback(response);
        }
    }
};

export default Model;
