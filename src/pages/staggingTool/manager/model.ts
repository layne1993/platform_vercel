import type { Effect } from 'umi';
import { getManagerList, createManager, updateManager, deleteManager } from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getManagerList: Effect;
        createManager: Effect;
        updateManager: Effect;
        deleteManager: Effect;
    };
    reducers: {
        updateModelData: any;
    };
}

const Model:ModelType = {
    namespace: 'staggingManager',
    state: {
        managerPageNum: 1,
        managerPageSzie: 10,
        managerTotal: 0,
        managerList: []
    },
    effects: {
        *getManagerList({ payload }, { call, put }) {
            const res = yield call(getManagerList, payload);
            if (res.code === 1008) {
                const { list, total } = res.data;
                yield put({
                    type: 'updateModelData',
                    payload: {
                        managerTotal: total,
                        managerList: list
                    }
                });
            }
            return res;
        },

        *createManager({ payload }, { call }) {
            const { sort } = payload;
            const res = yield call(createManager, {
                ...payload,
                sort: +sort
            });
            return res;
        },

        *updateManager({ payload }, { call }) {
            const { sort } = payload;
            const res = yield call(updateManager, {
                ...payload,
                sort: +sort
            });
            return res;
        },

        *deleteManager({ payload }, { call }) {
            const res = yield call(deleteManager, payload);
            return res;
        }
    },
    reducers: {
        updateModelData(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        }
    }
};
export default Model;
