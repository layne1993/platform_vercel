import { queryTreeList } from './service';

const Model = {
    namespace: 'customMetricsSelectTree',
    state: {
        renderArr: [],
        checkedKeys: [],
        checkedOrgArr: [],
        initCheckedKeys: [],
        initCheckedOrgArr: []
    },
    effects: {
        *queryTreeList({ callback }, { call }) {
            const response = yield call(queryTreeList);
            if (callback && response.data) callback(response);
        }
    },
    reducers: {
        savecheckedKeysAndCheckedOrgArr(state, { checkedKeys, checkedOrgArr }) {
            return { ...state, checkedKeys, checkedOrgArr };
        },
        savecheckedKeys(state, { checkedKeys }) {
            return { ...state, checkedKeys };
        },
        saveRenderArr(state, { renderArr }) {
            return { ...state, renderArr };
        },
        clearData() {
            return {
                renderArr: [],
                checkedKeys: [],
                checkedOrgArr: []
            };
        },
        saveInitCheckKeysAndCheckedOrgArr(state, { initCheckedKeys, initCheckedOrgArr }) {
            return { ...state, initCheckedKeys, initCheckedOrgArr };
        }
    }
};
export default Model;
