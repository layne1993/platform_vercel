import request from '@/utils/rest';

// 获取客户名称
export async function getCustomerName(params) {
    return request.get('/manager/DoubleRecordAlone/getCustomerName', params);
}

// 获取产品
export async function getProductFullName(params) {
    return request.get('/manager/DoubleRecordAlone/getProductFullName', params);
}

// 双录列表
export async function getDoubleRecordList(params) {
    return request.postJSON('/manager/DoubleRecordAlone/getDoubleRecordList', params);
}

// 获取需要单独双录的用户
export async function getDoubleRecordCustomer(params) {
    return request.postJSON('/manager/DoubleRecordAlone/getDoubleRecordCustomer', params);
}

// 保存需要单独双录的用户
export async function saveDoubleRecordCustomer(params) {
    return request.postJSON('/manager/DoubleRecordAlone/saveDoubleRecordCustomer', params);
}

// 获取双录审核信息
export async function getCheckTypeInfo(params) {
    return request.get('/manager/DoubleRecordAlone/getCheckTypeInfo', params);
}

// 管理员审核
export async function saveManageCheck(params) {
    return request.postJSON('/manager/DoubleRecordAlone/saveManageCheck', params);
}

// 单独双录终止
export async function termination(params) {
    return request.deleteForm(`/manager/DoubleRecordAlone/termination/${params}`);
}

// 单独双录删除
export async function deleteAlone(params) {
    return request.deleteForm(`/manager/DoubleRecordAlone/delete/${params}`);
}
