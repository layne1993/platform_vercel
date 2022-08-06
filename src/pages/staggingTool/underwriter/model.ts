import type { Effect } from 'umi';
import { getUnderwriterList, updateUnderwriter } from './service';
export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getUnderwriterList: Effect;
        updateUnderwriter: Effect;
    };
    reducers: {
        updateModelData: any;
    };
}

const Model:ModelType = {
    namespace: 'staggingUnderwriter',
    state: {
        underwriterPageNum: 1,
        underwriterPageSize: 10,
        underwriterTotal: 0,
        underwriterList: []
    },
    effects: {
        *getUnderwriterList({ payload }, { call, put }) {
            const res = yield call(getUnderwriterList, payload);
            if (res.code === 1008) {
                const { list, total } = res.data;
                yield put({
                    type: 'updateModelData',
                    payload: {
                        underwriterTotal: total,
                        underwriterList: list
                    }
                });
            }
            return res;
        },

        *updateUnderwriter({ payload }, { call }) {
            const res = yield call(updateUnderwriter, {
                ...payload
            });
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
