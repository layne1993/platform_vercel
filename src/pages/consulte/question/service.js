import request from '@/utils/rest';

// 上传文件
export async function uploadEmailAttachment(params){
    return request.postMultipart('/attachments/uploadFile', params);
}

// 获取列表数据
export async function getQuestionSettingTableData(params){
    return request.postJSON('/onlineService/list', params);
}

// 获取问题类型
export async function getQuestionType(params){
    return request.get('/onlineService/selectList', params);
}

// 修改添加问题类型
export async function addQuestionType(params){
    return request.postJSON('/onlineService/insertOnline', params);
}

// 删除问题类型
export async function deleteQuestionType(params){
    return request.get('/onlineService/deleteSysCode', params);
}

// 提交问题详情
export async function submitQuestionDetail(params){
    return request.postJSON('/onlineService/modify', params);
}

// 获取问题详情
export async function getQuestionDetail(params){
    return request.get('/onlineService/details', params);
}

// 删除问题详情
export async function deleteQuestionDetail(params){
    return request.get('/onlineService/delete', params);
}



