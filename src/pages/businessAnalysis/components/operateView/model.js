import {

    getProductOperate,
} from './service.js';

const model = {
    namespace:'operatView',
    state:{
        questionTypes:[]
    },
    effects:{
        // 获取问题详情
        *getProductOperate({ payload, callback }, { call }){
            const response = yield call(getProductOperate, payload);
            if(callback) callback(response);
        },
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