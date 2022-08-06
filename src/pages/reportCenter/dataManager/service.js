import requestR from '@/utils/restReport';
import request from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mrp = '/mrp_analysis';
const mvt = '/mvt';

// 估值表解析
const header = {
    companyCode: getCookie('companyCode'),
    dataSource: 'report',
};
// 估值表解析成功的列表
export async function getValuationTableCountParsedList(params) {
    return requestR.postJSON(
        `${mvt}/data/getValuationTableCountParsedList`,
        { ...params, fileType: 'product' },
        header,
    );
}

// 估值表删除
export async function deteleValuationTable(params) {
    return requestR.postJSON(`${mvt}/valuationTable/delete`, params, header);
}

// 估值表解析模板查询
export async function getTemplateList(params) {
    return requestR.postJSON(`${mvt}/template/getTemplateList`, params, header);
}

// 估值表导入列表查询
export async function getValuationTableList(params) {
    return requestR.postJSON(
        `${mvt}/data/getValuationTableList`,
        { ...params, fileType: 'product' },
        header,
    );
}

// 估值表产品模板关联列表查询
export async function getValuationTableProTempList(params) {
    return requestR.postJSON(`${mvt}/template/getProTempList`, params, header);
}

// 新增产品
export async function addUpdateProduct(params) {
    return requestR.postJSON(`${mvt}/template/addOrUpdateProduct`, params, header);
}

// 查看产品详情
export async function getProductById(params) {
    return requestR.postJSON(`${mvt}/template/getProductById?id=${params.id}`, params, header);
}

// 删除产品
export async function delProductById(params) {
    return requestR.postJSON(`${mvt}/template/deleteProductById`, params, header);
}

// 模板关联
export async function updateProTemp(params) {
    return requestR.postJSON(`${mvt}/template/updateProTemp`, params, header);
}

// 估值表解析
export async function parseValuationTable(params) {
    return requestR.postJSON(`${mvt}/valuationTable/parseAndSave`, params, header);
}

export async function getValuationTablequeryParseValuationTable(params) {
    return requestR.postJSON(`${mvt}/valuationTable/parseAndSave`, params, header);
}

//大类资产列表
export async function getValuationTablequeryListByMenu(params) {
    return request.postJSON(`${mrp}/dataManager/queryListByMenu`, params, header);
}

//大类资产删除
export async function getValuationTablDeteleByMenu(params) {
    return request.postJSON(`${mrp}/dataManager/deteleByMenu`, params, header);
}

//大类资产模板下载
export async function getValuationTablImportByMenu(params) {
    return request.postMultipart(`${mrp}/dataManager/importByMenu`, params, header);
}

// 客户关系设定列表
export async function getRelationShipTableList(params) {
    return request.postJSON(`${mrp}/dataManager/queryCustomerRelationList`, params, header);
}

// 获取客户信息弹窗数据源
export async function queryCustomerSelect(params) {
    return request.postJSON(`${mrp}/dataManager/queryCustomerSelect`, params, header);
}

// 保存客户关系数据
export async function saveCustomerCorrelation(params) {
    return request.postJSON(`${mrp}/dataManager/saveCustomerCorrelation`, params, header);
}

// 获取单个客户关系详情
export async function editCustomerRelation(params) {
    return request.postJSON(`${mrp}/dataManager/editCustomerRelation`, params, header);
}

// 删除客户关系
export async function deteleCustomerRelation(params) {
    return request.postJSON(`${mrp}/dataManager/deteleCustomerRelation`, params, header);
}
