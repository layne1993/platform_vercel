// import request from '@/utils/restReport';
import request from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mrp = '/mrp_analysis';
// const mrp = '/mrp';
const mvt = '/mvt_report';

// 新增渠道
export async function insertChannel(params) {
    return request.postJSON(`${mrp}/hdChannel/insertChannel`, params);
}

// 查询所有渠道
export async function getChannels(params) {
    return request.postJSON(`${mrp}/hdChannel/getChannels`, params);
}

// 查询所有渠道类型
export async function getChannelTypes(params) {
    return request.get(`${mrp}/hdChannel/getChannelTypes`, params);
}

// 修改渠道
export async function updateChannel(params) {
    return request.postJSON(`${mrp}/hdChannel/updateChannel`, params);
}

// 查询所有经纪人
export async function getAllSalesman(params) {
    return request.postJSON(`${mrp}/hdSalesman/getAllSalesman`, params);
}

// 查询客户关联渠道
export async function getAllCustomerSale(params) {
    return request.postJSON(`${mrp}/hdCustomerSale/getAllCustomerSale`, params);
}

//查询客户名称
export async function selectCustomersInfo(params) {
    return request.postJSON(`${mrp}/hdCustomerSale/selectCustomersInfo`, params);
}

//新增客户关联
export async function insertSalesman(params) {
    return request.postJSON(`${mrp}/hdCustomerSale/insertCustomerSale`, params);
}

//新增经纪人
export async function addSalesman(params) {
    return request.postJSON(`${mrp}/hdSalesman/insertSalesman`, params);
}

//编辑经纪人
export async function updateSalesman(params) {
    return request.postJSON(`${mrp}/hdSalesman/updateSalesman`, params);
}

//删除客户关联
export async function deleteSalesman(params) {
    return request.postJSON(`${mrp}/hdCustomerSale/deleteCustomerSale`, params);
}

//查询所有产品费率配置
export async function getAllProductFeeRate(params) {
    return request.postJSON(`${mrp}/hdProductFeeRate/getAllProductFeeRate`, params);
}

//查询所有产品信息
export async function selectProductsInfo(params) {
    return request.postJSON(`${mrp}/hdProductFeeRate/selectProductsInfo`, params);
}

//新增产品费率配置
export async function insertProductFeeRate(params) {
    return request.postJSON(`${mrp}/hdProductFeeRate/insertProductFeeRate`, params);
}

//删除产品费率配置
export async function deleteProductFeeRate(params) {
    return request.postJSON(`${mrp}/hdProductFeeRate/deleteProductFeeRate`, params);
}

//认申赎明细
export async function tradeRecordFee(params) {
    return request.postJSON(`${mrp}/feeManagement/tradeRecordFee`, params);
}

//查询费用管理份额余额表
export async function shareRecordFee(params) {
    return request.postJSON(`${mrp}/feeManagement/shareRecordFee`, params);
}

//生成费用表查询
export async function feeListqurry(params) {
    return request.postJSON(`${mrp}/hdGenerateFee/query`, params);
}

//生成费用表生成
export async function createExcel(params) {
    return request.postJSON(`${mrp}/hdGenerateFee/createExcel`, params);
}

//生成批次列表下载
export async function downLoad(params) {
    return request.postBlob(`${mrp}/hdGenerateFee/downLoad`, params);
}

//删除批次列表
export async function deleteList(params) {
    return request.postJSON(`${mrp}/hdGenerateFee/delete`, params);
}

//认申赎明细导出
export async function exportTradeRecordFee(params) {
    return request.postBlob(`${mrp}/feeManagement/exportTradeRecordFee`, params);
}

//份额余额明细导出
export async function exportShareRecordFee(params) {
    return request.postBlob(`${mrp}/feeManagement/exportShareRecordFee`, params);
}

//查询产品是否配置过费率
export async function isExistProductFeeRate(params) {
    return request.postJSON(`${mrp}/hdProductFeeRate/isExistProductFeeRate`, params);
}
