/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:49:05
 * @LastEditTime: 2021-05-19 11:17:33
 */
import type { Effect } from 'umi';
import {
    getTreeData,
    deleteFolder,
    addNetWorkDisk,
    diskSearch,
    deleteFile,
    updateFileName,
    selectAllNetwork
} from './service';

export interface ModelType {
    namespace: string;
    state: any;
    effects: {
        getTreeData: Effect;
        addNetWorkDisk: Effect;
        deleteFolder: Effect;
        deleteFile: Effect;
        diskSearch: Effect;
        updateFileName: Effect;
        selectAllNetwork: Effect;
    };
    reducers: {
        setListData: any;
    };
}

const Model: ModelType = {
    namespace: 'DISKCENTER',
    state: {
        listData: {}
    },
    effects: {
        *getTreeData({ payload, callback }, { call, put }) {
            const res = yield call(getTreeData, payload);
            if (callback) callback(res);
        },

        *addNetWorkDisk({ payload, callback }, { call, put }) {
            const res = yield call(addNetWorkDisk, payload);
            if (callback) callback(res);
        },

        *deleteFolder({ payload, callback }, { call, put }) {
            const res = yield call(deleteFolder, payload);
            if (callback) callback(res);
        },

        *deleteFile({ payload, callback }, { call, put }) {
            const res = yield call(deleteFile, payload);
            if (callback) callback(res);
        },

        *diskSearch({ payload, callback }, { call, put }) {
            const res = yield call(diskSearch, payload);
            if (callback) callback(res);
        },

        *updateFileName({ payload, callback }, { call, put }) {
            const res = yield call(updateFileName, payload);
            if (callback) callback(res);
        },

        *selectAllNetwork({ payload, callback }, { call, put }) {
            const res = yield call(selectAllNetwork, payload);
            if (callback) callback(res);
        }

    },
    reducers: {
        setListData(state, { payload }) {
            return {
                ...state,
                listData: payload
            };
        }
    }
};
export default Model;
