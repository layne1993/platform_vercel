import request from '@/utils/rest';

// 获取列表数据
export async function getTableData(params){
    return request.postJSON('/contraintNotice/queryNotice', params);
}

// 新建强制确认公告
export async function createNotice(params){
    return request.postJSON('/contraintNotice/createNotice', params);
}

// 获取详情
export async function queryNoticeDetail(params){
    return request.postJSON('/contraintNotice/queryNoticeDetail', params);
}

// 编辑强制确认公告
export async function updateNotice(params){
    return request.postJSON('/contraintNotice/updateNotice', params);
}

// 设置有效
export async function updateNoticeStatus(params){
    return request.postJSON('/contraintNotice/updateNoticeStatus', params);
}