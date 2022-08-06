import request from '@/utils/rest';

export async function deleteTem(params) {
    return request.deleteForm('/productTarget/template/delete', params);
}

export async function queryTableList(params) {
    return request.postJSON('/productTarget/data/list', params);
}

export async function saveTemplate(params) {
    return request.postJSON('/productTarget/template/save', params);
}

export async function exportTemplate(params) {
    return request.postBlob('/productTarget/data/export', params);
}

export async function queryTips(params) {
    return request.postJSON('/productTarget/data/tips', params);
}
