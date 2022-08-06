import {
    getQuestionSettingTableData,
    getQuestionType,
    addQuestionType,
    deleteQuestionType,
    submitQuestionDetail,
    getQuestionDetail,
    deleteQuestionDetail
} from './service.js';

const model = {
    namespace:'consulteQuestion',
    state:{
        questionTypes:[]
    },
    effects:{
    // 获取表格数据
        *getQuestionSettingTableData({ payload, callback }, { call }){
            const response = yield call(getQuestionSettingTableData, payload);
            if(callback) callback(response);
        },
        // 获取问题类型
        *getQuestionType({ payload, callback }, { call, put }){
            const response = yield call(getQuestionType, payload);
            if(response.code === 1008){
                yield put({
                    type:'setQuestionTypes',
                    payload:response
                });
            }
            if(callback) callback(response);
        },
        // 新增修改问题类型
        *addQuestionType({ payload, callback }, { call }){
            const response = yield call(addQuestionType, payload);
            if(callback) callback(response);
        },
        // 删除问题类型
        *deleteQuestionType({ payload, callback }, { call }){
            const response = yield call(deleteQuestionType, payload);
            if(callback) callback(response);
        },
        // 提交问题详情
        *submitQuestionDetail({ payload, callback }, { call }){
            const response = yield call(submitQuestionDetail, payload);
            if(callback) callback(response);
        },
        // 获取问题详情
        *getQuestionDetail({ payload, callback }, { call }){
            const response = yield call(getQuestionDetail, payload);
            if(callback) callback(response);
        },
        // 删除问题详情
        *deleteQuestionDetail({ payload, callback }, { call }){
            const response = yield call(deleteQuestionDetail, payload);
            if(callback) callback(response);
        }
    },
    reducers:{
    // 设置问题类型数据缓存
        setQuestionTypes(state, { payload }){
            const { data = [] } = payload;
            return { ...state, questionTypes:data };
        }
    }
};

export default model;