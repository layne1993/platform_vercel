import { queryProductist, queryTempList, queryStandardArr } from './service';

const Model = {
    namespace: 'queryForm',
    state: {
        templateArr: [],
        formData: {},
        checkedArrUseExportAndQueryTableList: [],
        standardCodes:[]
    },
    effects: {
        *queryProductist({ callback, payload }, { call }) {
            const response = yield call(queryProductist, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        *queryTempList({ callback, payload }, { call, put }) {
            const response = yield call(queryTempList, payload);
            if (response.code === 1008) {
                yield put({
                    type: 'saveTemp',
                    templateArr: response.data?.list
                });
            }
        },
        // 请求比较基准数据
        *queryStandardArr({ callback }, { call }) {
            const response = yield call(queryStandardArr);
            if (callback && response.code === 1008) callback(response.data);
        }
    },
    reducers: {
        saveTemp(state, { templateArr }) {
            return { ...state, templateArr };
        },
        setFormData(state, { formData }) {
            return { ...state, formData };
        },
        setCheckedArrUseExportAndQueryTableList(state, { checkedArrUseExportAndQueryTableList }) {
            return { ...state, checkedArrUseExportAndQueryTableList };
        },
        setStandardCodes(state, { standardCodes }) {
            return { ...state, standardCodes };
        },
        clearData() {
            return {
                templateArr: [],
                formData: {},
                checkedArrUseExportAndQueryTableList: []
            };
        }
    }
};
export default Model;
