import { deleteTem, queryTableList, saveTemplate, exportTemplate, queryTips } from './service';

const Model = {
    namespace: 'customMetricsTable',
    state: {
        tableData: {},
        pageNumber: 1,
        pageSize: 20,
        columns: []
    },
    effects: {
        *deleteTem({ callback, payload }, { call }) {
            const response = yield call(deleteTem, payload);
            if (callback) callback(response);
        },
        *queryTableList({ callback, payload }, { call, put }) {
            const response = yield call(queryTableList, payload);
            if (response.code === 1008) {
                callback(response);
                yield put({
                    type: 'saveTableList',
                    tableData: response.data || {}
                });
            }
        },
        // 保存模板
        *saveTemplate({ payload, callback }, { call }) {
            const response = yield call(saveTemplate, payload);
            if (callback) callback(response);
        },
        // 导出模板
        *exportTemplate({ payload, callback, errorCallback }, { call }) {
            const response = yield call(exportTemplate, payload);
            if(response && callback && response.headers['content-disposition']) {
                callback(response);
            } else {
                errorCallback('导出失败');
            }
        },
        // 查询提示
        *queryTips({ payload, callback }, { call }) {
            const response = yield call(queryTips, payload);
            if (callback) callback(response);
        }
    },
    reducers: {
        saveTableList(state, { tableData }) {
            return { ...state, tableData };
        },
        changePageNumber(state, { pageNumber }) {
            return { ...state, pageNumber };
        },
        changePageSize(state, { pageSize }) {
            return { ...state, pageSize };
        },
        clearData() {
            return {
                tableData: {},
                pageNumber: 1,
                pageSize: 20
            };
        },
        saveColumns(state, { columns }) {
            return { ...state, columns };
        }
    }
};
export default Model;
