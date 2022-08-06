import type { Effect, Reducer } from 'umi';
import {
    getCustomerName,
    getProductFullName,
    getDoubleRecordList,
    getDoubleRecordCustomer,
    saveDoubleRecordCustomer,
    getCheckTypeInfo,
    saveManageCheck,
    termination,
    deleteAlone
} from './service';
interface ModalState {}

interface ModelType {
    namespace: string;
    state: ModalState;
    effects: {
        getProductFullName: Effect;
        getDoubleRecordList: Effect;
        getDoubleRecordCustomer: Effect;
        saveDoubleRecordCustomer: Effect;
        getCheckTypeInfo: Effect;
        saveManageCheck: Effect;
        termination: Effect;
        deleteAlone: Effect;
    };
    reducers: {
        // saveCurrentUser: Reducer<ModalState>;
    };
}

const Mode: ModelType = {
    namespace: 'doubleRecordSolo',
    state: {},
    effects: {
        *getProductFullName({ callback, payload }, { call }) {
            const response = yield call(getProductFullName, payload);
            if (callback) {
                callback(response);
            }
        },
        // 双录列表
        *getDoubleRecordList({ callback, payload }, { call }) {
            const response = yield call(getDoubleRecordList, payload);
            if (callback) {
                callback(response);
            }
        },
        *getDoubleRecordCustomer({ callback, payload }, { call }) {
            const response = yield call(getDoubleRecordCustomer, payload);
            if (callback) {
                callback(response);
            }
        },
        *saveDoubleRecordCustomer({ callback, payload }, { call }) {
            const response = yield call(saveDoubleRecordCustomer, payload);
            if (callback) {
                callback(response);
            }
        },
        // 获取双录审核信息
        *getCheckTypeInfo({ callback, payload }, { call }) {
            const response = yield call(getCheckTypeInfo, payload);
            if (callback) {
                callback(response);
            }
        },
        // 管理员审核
        *saveManageCheck({ callback, payload }, { call }) {
            const response = yield call(saveManageCheck, payload);
            if (callback) {
                callback(response);
            }
        },
        *termination({ callback, payload }, { call }) {
            const response = yield call(termination, payload);
            if (callback) {
                callback(response);
            }
        },
        *deleteAlone({ callback, payload }, { call }) {
            const response = yield call(deleteAlone, payload);
            if (callback) {
                callback(response);
            }
        }
    },
    reducers: {}
};
export default Mode;
