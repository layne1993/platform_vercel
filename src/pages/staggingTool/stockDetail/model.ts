import { take } from 'lodash-es';
import type { Effect } from 'umi';
import {
    addProductsMaterials,
    getStockInfoById,
    getCanApplyProductList,
    getApplyProductList,
    // getAllApplyProductList,
    getStockIPOStepDetail,
    getStaggingMaterials,
    queryApplyBySecuCode,
    finishCurrentIPOStep,
    reGenAllAttachments
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getStockDetail: Effect;
        getCanApplyProductList: Effect;
        getApplyProductList: Effect;
        getAllApplyProductList: Effect;
        getStockIPOStepDetail: Effect;
        generateStaggingMaterials: Effect;
        getStaggingMaterials: Effect;
        queryApplyBySecuCode: Effect;
        finishCurrentIPOStep: Effect;
        reGenAllAttachments: Effect;
    };
    reducers: {
        updateModelData: any;
    };
}

const Model: ModelType = {
    namespace: 'staggingStockDetail',
    state: {
        // 可以参与打新的产品列表
        canApplyProductList: [],

        // 标的详情
        stockDetail: {},

        // IPO材料
        IPOMaterialList: [],

        newIPOMaterialList: [],

        // 打新配售对象信息
        searchForm: {},
        applyProductList: [],
        applyProductPageNum: 1,
        applyProductPageSize: 10,
        applyProductTotal: 0
    },
    effects: {
        *getStockDetail({ payload }, { call, put }) {
            const res = yield call(getStockInfoById, { ...payload });
            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        stockDetail: res.data
                    }
                });
            }
        },

        *getCanApplyProductList({ payload }, { call, put }) {
            const res = yield call(getCanApplyProductList, { ...payload });
            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        canApplyProductList: res.data
                    }
                });
            }
        },

        *getApplyProductList({ payload }, { call, put }) {
            const res = yield call(getApplyProductList, { ...payload });
            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        applyProductList: res.data.list,
                        applyProductTotal: res.data.total
                    }
                });
            }
        },

        *getAllApplyProductList({ payload }, { call, put }) {
            const res = yield call(getApplyProductList, {
                ...payload,
                pageNum: 1,
                pageSize: 10000
            });
            return res;
        },

        *getStockIPOStepDetail({ payload }, { call, put }) {
            const res = yield call(getStockIPOStepDetail, { ...payload });
            return res;
        },

        *generateStaggingMaterials({ payload }, { call, put, select }) {
            const res = yield call(addProductsMaterials, { ...payload });
            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        newIPOMaterialList: res.data
                    }
                });
                const stateData = yield select((state) => state.staggingStockDetail);
                console.log(stateData, 'stateData');
                yield put({
                    type: 'getApplyProductList',
                    payload: {
                        secuCode: payload.secuCode,
                        pageNum: stateData.applyProductPageNum,
                        pageSize: stateData.applyProductPageSize,
                        ...stateData.searchForm
                    }
                });
            }
            return res;
        },

        *getStaggingMaterials({ payload }, { call, put }) {
            const res = yield call(getStaggingMaterials, { ...payload });
            if (res.code === 1008) {
                yield put({
                    type: 'updateModelData',
                    payload: {
                        IPOMaterialList: res.data
                    }
                });
            }
            return res;
        },

        *queryApplyBySecuCode({ payload }, { call, put }) {
            const res = yield call(queryApplyBySecuCode, { ...payload });
            return res;
        },

        *finishCurrentIPOStep({ payload }, { call, put }) {
            const res = yield call(finishCurrentIPOStep, { ...payload });
            return res;
        },

        *reGenAllAttachments({ payload }, { call, put }) {
            const res = yield call(reGenAllAttachments, { ...payload });
            if (res.code === 1008) {
                yield put({ type: 'getStaggingMaterials', payload });
            }
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
