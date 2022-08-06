import {
    queryRiskList,
    createNewRiskQuestionnaire,
    detailRiskQuestionnaire,
    getAllCustomerArr,
    getRiskQuestionnaireTemList,
    editRiskQuestionnaire,
    queryVersionNumber,
    createRiskAsk,
    queryRiskLevel,
    queryRiskAskDetail,
    updateRiskAsk,
    deleteFile,
    queryQuestionnaires,
    checkRiskStarRating,
    riskAskSettingDetail,
    riskAskSettingUpdate,
    copySave,
    investorSuitableList
} from './service';

const Model = {
    namespace: 'risk',
    state: {},
    effects: {

        // 查询基协投资者账号自动导出
        * investorSuitableList({ payload, callback }, { call }) {
            const response = yield call(investorSuitableList, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 投资者风险测评问卷使用配置
        * riskAskSettingDetail({ payload, callback }, { call }) {
            const response = yield call(riskAskSettingDetail, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 投资者风险测评问卷使用配置
        * riskAskSettingUpdate({ payload, callback }, { call }) {
            const response = yield call(riskAskSettingUpdate, payload);
            if (callback) callback(response);
        },
        // 查询表格
        * queryRiskList({ payload, callback }, { call }) {
            const response = yield call(queryRiskList, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 新建风险测评问卷
        * createNewRiskQuestionnaire({ payload, callback }, { call }) {
            const response = yield call(createNewRiskQuestionnaire, payload);
            if (callback) callback(response);
        },
        // 编辑测评问卷
        * editRiskQuestionnaire({ payload, callback }, { call }) {
            const response = yield call(editRiskQuestionnaire, payload);
            if (callback) callback(response);
        },
        // 点击编辑
        * detailRiskQuestionnaire({ payload, callback }, { call }) {
            const response = yield call(detailRiskQuestionnaire, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 请求全部客户
        * getAllCustomerArr({ callback }, { call }) {
            const response = yield call(getAllCustomerArr);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 请求风险测评问卷模板
        * getRiskQuestionnaireTemList({ payload, callback }, { call }) {
            const response = yield call(getRiskQuestionnaireTemList, payload);
            if (callback && response.code === 1008) callback(response);
        },
        // 查询版本号
        * queryVersionNumber({ payload, callback }, { call }) {
            const response = yield call(queryVersionNumber, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 创建问卷模板
        * createRiskAsk({ payload, callback }, { call }) {
            const response = yield call(createRiskAsk, payload);
            if (callback) callback(response);
        },
        // 风险测评模板-详细信息
        * queryRiskAskDetail({ payload, callback }, { call }) {
            const response = yield call(queryRiskAskDetail, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 风险测评问卷列表风险等级
        * queryRiskLevel({ payload, callback }, { call }) {
            const response = yield call(queryRiskLevel, payload);
            if (callback && response.code === 1008) callback(response.data);
        },
        // 编辑问卷模板
        * updateRiskAsk({ payload, callback }, { call }) {
            const response = yield call(updateRiskAsk, payload);
            if (callback) callback(response);
        },
        // 删除上传的文件
        * deleteFile({ payload, callback }, { call }) {
            const response = yield call(deleteFile, payload);
            if (callback) callback(response);
        },
        // 查询相关默认信息
        *queryQuestionnaires({ payload, callback }, { call }) {
            const response = yield call(queryQuestionnaires, payload);
            if (callback) callback(response);
        },
        // 校验星级评分
        *checkRiskStarRating({ payload, callback }, { call }) {
            const response = yield call(checkRiskStarRating, payload);
            if (callback) callback(response);
        },
        // 校验星级评分
        *copySave({ payload, callback }, { call }) {
            const response = yield call(copySave, payload);
            if (callback) callback(response);
        }

    },
    reducers: {}
};
export default Model;
