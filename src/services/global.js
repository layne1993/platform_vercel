/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-18 16:37:35
 * @LastEditTime: 2021-06-07 18:26:05
 */
import request from '@/utils/rest';

// 获取资源路径
export async function getResourcePath(params) {
    return request.get('/attachments/queryServer', params);
}

// 获取系统配置
export async function getSysSetting(params) {
    return request.get('/manager/sysSetting/querySysSetting', params);
}

// 获取所有客户列表
export async function queryByCustomerName(params) {
    return request.postJSON('/customer/queryByCustomerName', params);
}

// 获取所有产品列表
export async function queryByProductName(params) {
    return request.postJSON('/product/queryByProductName', params);
}

// 查询托管数据
export async function queryManagedData() {
    return request.get('/data/list');
}

// 更新托管数据
export async function updateData(path, payload) {
    return request.postJSON(path, payload);
}

// 获取公司密钥
export async function getCompanyUid(params) {
    return request.get('/company/getCompanyUid', params);
}


// 获取所有管理菜单的权限
export async function getSysMenu(params) {
    return request.get('/managerUser/getSysMenu', params);
}

// 获取所有管理者list
export async function getManagerList(params) {
    return request.get('/manager/managerUser/selectAllUser', params);
}

// 获取渠道list
export async function channelList(params) {
    return request.get('/manager/channel/customerIdList', params);
}


// 查询所有客户经理
export async function selectAllAccountManager(params) {
    return request.get('/manager/managerUser/selectAllAccountManager', params);
}


// 菜单红点统计数据
export async function getMenuMessageBadge(params) {
    return request.get('/panel/getNoticeStatistics', params);
}
