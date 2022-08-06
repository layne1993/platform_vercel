import request from '@/utils/rest';
import requestR from '@/utils/restReport';

import { getCookie } from '@/utils/utils';

const mrp = '/mrp_analysis';
// const mrp = '/mrp';
const mvt = '/mvt_report';

const header = {
    companyCode: getCookie('companyCode'),
    dataSource: 'simu',
};

/**
 * 交易归属管理接口
 */
// 查询交易归属配置修改记录
export async function getTradeHisotry(params) {
    return request.postJSON(`${mrp}/tradeLocation/history`, params);
}

export async function getManagerListAjax(params) {
    return request.postJSON(`${mrp}/managementCostDivide/selectProducts`, params, header);
}

// 查询所有交易归属配置信息
export async function getTradeDataByCondition(params) {
    return request.postJSON(`${mrp}/tradeLocation/selectByCondition`, params);
}

// 根据产品id获取所有交易的客户数据类型
export async function getTradeCustomers(params) {
    return request.postJSON(`${mrp}/tradeLocation/selectCustomers`, params);
}

// 根据产品分组查询所有交易归属配置信息
export async function getTradeProducts(params) {
    return request.postJSON(`${mrp}/tradeLocation/selectProducts`, params);
}

// 更新交易归属配置
export async function updateTradeData(params) {
    return request.postJSON(`${mrp}/tradeLocation/update`, params);
}

// 增加交易管理费率配置
export async function addManageRate(params) {
    return request.postJSON(`${mrp}/managementRateConfigure/add`, params);
}

// 查询所有渠道的信息
export async function getChannelList(params) {
    return request.postJSON(`${mrp}/managementCostDivide/getChannels`, params);
}

// 查询所有销售人员的信息
export async function getSalemanList(params) {
    return request.postJSON(`${mrp}/managementCostDivide/selectSalesman`, params);
}
    
export async function getDataTableListAjax(params) {
    return requestR.postJSON(`${mvt}/dataSource/delete?id=${params}`, {}, header);
}
//查询单个产品管理费分层配置
export async function getManagerCostDivideListAjax(params) {
    return request.postJSON(`${mrp}/managementCostDivide/selectByCondition`, params, header);
}

export async function costDivideListDeleteAjax(params) {
    return request.postJSON(`${mrp}/managementCostDivide/delete`, params, header);
}

export async function costDivideListUpdateAjax(params) {
    return request.postJSON(`${mrp}/managementCostDivide/update`, params, header);
}

export async function costDivideListAddAjax(params) {
    return request.postJSON(`${mrp}/managementCostDivide/add`, params, header);
}

export async function costDivideListExportExcelAjax(params) {
    return request.postBlob(`${mrp}/managementCostDivide/exportExcel`, params, header);
}

// 产品管理费测算列表--头部统计
export async function queryFeeListHeaderAjax(params) {
    return request.postJSON(`${mrp}/managementFee/queryAll`, params, header);
}

// 产品管理费测算列表-- 列表
export async function queryFeeListAjax (params) {
    return request.postJSON(`${mrp}/managementFee/query`, params, header);
}

export async function queryFeeDetailListAjax(params) {
    return request.postJSON(`${mrp}/managementFeeDetails/query`, params, header);
}

export async function queryFeeDetailHeaderAjax(params) {
    return request.postJSON(`${mrp}/managementFeeDetails/queryAll`, params, header);
}

export async function queryFeeDevideListAjax(params) {
    return request.postJSON(`${mrp}/managementFeeDivide/totalList`, params, header);
}

export async function queryFeeDevideTableAjax(params) {
    return request.postJSON(`${mrp}/managementFeeDivide/totalTable`, params, header);
}

export async function exportFeeBySelect(params) {
    return request.postBlob(`${mrp}/managementFee/exportBySelect`, params, header);
}

export async function exportFeeByAll(params) {
    return request.postBlob(`${mrp}/managementFee/exportAll`, params, header);
}

export async function exportFeeDetailByAll(params) {
    return request.postBlob(`${mrp}/managementFeeDetails/export`, params, header);
}

export async function getChannelsAll(params) {
    return request.postJSON(`${mrp}/managementCostDivide/getChannels`, params, header);
}

export async function getSelectSalesman(params) {
    return request.postJSON(`${mrp}/managementCostDivide/selectSalesman`, params, header);
}

// 查询配置信息中的产品数量
export async function getDivideProducts(params) {
    return request.postJSON(`${mrp}/managementCostDivide/divideProducts`, params, header);
}

export async function getCopyOtherProduct(params) {
    return request.postJSON(`${mrp}/managementCostDivide/copyOtherProduct`, params, header);
}

export async function getSelectByCondition(params) {
    return request.postJSON(`${mrp}/managementRateConfigure/selectByCondition`, params, header);
}
// 查询配置信息中的产品数量
export async function copyProduct(params) {
    return request.postJSON(`${mrp}/managementCostDivide/copyOtherProduct`, params, header);
}

export async function exportFeeDevide(params) {
    return request.postBlob(`${mrp}/managementFeeDivide/toExcel`, params, header);
}