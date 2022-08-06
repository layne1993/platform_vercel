/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-07-12 10:04:10
 */
import request from '@/utils/rest';

// 客户列表
export async function customerData(params) {
    return request.postJSON('/customer/query', params);
}

// 查询生命周期节点详情
export async function queryLifeCycleNodeDetail(params) {
    return request.get('/manager/LifeCycleManger/queryLifeCycleNodeDetail', params);
}

// 查询生命周期基本信息
export async function queryBasicInformation(params) {
    return request.get('/manager/LifeCycleManger/queryBasicInformation', params);
}


// 查询生命周期节点列表
export async function queryLifeCycleNodeList(params) {
    return request.get('/manager/LifeCycleManger/queryLifeCycleNodeList', params);
}


// 保存生命周期流程节点信息
export async function saveProcessNodeInfo(params) {
    return request.postJSON('/manager/LifeCycleManger/saveProcessNodeInfo', params);
}

// 修改流程标题
export async function updateProcessTitle(params) {
    return request.postJSON('/manager/LifeCycleManger/updateProcessTitle', params);
}

// 生命周期模板-管理管下拉list
export async function selectAllUser(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}

export async function queryLifeCycleNodeListByReject(params) {
    return request.get('/manager/LifeCycleManger/queryLifeCycleNodeListByReject', params);
}