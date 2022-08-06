import axios from '@/utils/rest';
import { getCookie } from '@/utils/utils';

const companyCode = getCookie('mobile_companyCode');

// 生命周期模板-查询产品要素
export async function queryLifeCycleElementInfo(params) {
    return axios.get('/manager/lifeCycleTemplate/queryLifeCycleElementInfo', params);
}

// 生命周期模板-查询模板数据
export async function querylifeCycleTemplate(params) {
    return axios.postJSON('/manager/lifeCycleTemplate/querylifeCycleTemplate', params);
}

// 生命周期模板-新增修改模板节点
export async function insertTemplate(params) {
    return axios.postJSON('/manager/lifeCycleTemplate/insertTemplate', params);
}

// 生命周期模板-新增模板基本信息
export async function updateTemplatStatus(params) {
    return axios.postJSON('/manager/lifeCycleTemplate/updateTemplatStatus', params);
}

// 生命周期模板-新增模板基本信息
export async function selectAllUser(params) {
    return axios.get('/manager/managerUser/selectAllUser', { ...params, companyCode });
}

// 生命周期模板-查询模板修改记录
export async function queryChangeInformation(params) {
    return axios.get('/manager/lifeCycleTemplate/queryChangeInformation', { ...params, companyCode });
}

// 生命周期模板-查询模板修改记录
export async function copyLifeCycleTemplate(params) {
    return axios.get('/manager/lifeCycleTemplate/copyLifeCycleTemplate', { ...params, companyCode });
}
