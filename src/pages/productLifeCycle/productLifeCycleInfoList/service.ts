/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-03-19 11:06:53
 */
import request from '@/utils/rest';

// 创建生命周期流程
export async function createLifeCycleProcess(params) {
    return request.postJSON('/manager/LifeCycleManger/createLifeCycleProcess', params);
}


// 生命周期流程管理-查询列表
export async function queryLifeCycleMangerListPage(params) {
    return request.postJSON('/manager/LifeCycleManger/queryLifeCycleMangerListPage', params);
}


// 获取模板list
export async function templateList(params) {
    return request.postJSON('/manager/LifeCycleManger/createLifeCycleProcess', params);
}



// 获取产品list
export async function productList(params) {
    return request.postJSON('/manager/LifeCycleManger/createLifeCycleProcess', params);
}

// 撤销流程
export async function repealLifeCycleProcess(params) {
    return request.postJSON('/manager/LifeCycleManger/repealLifeCycleProcess', params);
}

// 获取产品
export async function queryByProductName(params) {
    return request.postJSON('/product/queryByProductName', params);
}



// 查询模板列表
export async function queryLifeCycleTemplateList(params) {
    return request.get('/manager/LifeCycleManger/queryLifeCycleTemplateList', params);
}


//获取管理员列表
export async function getAdminUserList(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}
