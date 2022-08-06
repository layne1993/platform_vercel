import { findAllUser, deleteAccount} from './service';

const Model = {
    namespace: 'accountList',
    state: {
        data: {
            list: []
        }
    },
    effects: {
        *queryList({ payload, callback }, { call, put }) {
            const response = yield call(findAllUser, payload);
            yield put({
                type: 'save',
                payload: response
            });
            if (callback) callback(response);
        },

        *DeleteAccount({ payload, callback }, { call, put }) {
            const response = yield call(deleteAccount, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        save(state, action) {
            const { payload } = action;
            const { data } = state;
            if (payload && payload.code === 1008) {
                data.list = payload.data || [];
            }
            return { ...state, data };
        }
    }
};
export default Model;
