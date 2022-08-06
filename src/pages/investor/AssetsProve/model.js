import {
    listData,
    check,
    create,
    queryHolders,
    holdingProducts,
    deleteAssetProve,
    queryProductSetting
} from './service';

const Model = {
    namespace: 'INVESTOR_ASSETSPROVE',
    state: {
        elementInfo: {}
    },
    effects: {

        // 查询listData
        *listData({ payload, callback }, { call }) {
            const response = yield call(listData, payload);
            if (callback) callback(response);
        },
        // 审核
        *check({ payload, callback }, { call }) {
            const response = yield call(check, payload);
            if (callback) callback(response);
        },
        // 新建前查询列表
        *queryHolders({ payload, callback }, { call }) {
            const response = yield call(queryHolders, payload);
            if (callback) callback(response);
        },
        // 查询持有产品列表
        *holdingProducts({ payload, callback }, { call }) {
            const response = yield call(holdingProducts, payload);
            if (callback) callback(response);
        },
        // 新建
        *create({ payload, callback }, { call }) {
            const response = yield call(create, payload);
            if (callback) callback(response);
        },
        // 删除
        *deleteAssetProve({ payload, callback }, { call }) {
            const response = yield call(deleteAssetProve, payload);
            if (callback) callback(response);
        },
        // 查询产品配置
        *queryProductSetting({ payload, callback }, { call }) {
            const response = yield call(queryProductSetting, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
    }
};
export default Model;
