// import request from '@/utils/restReport';
import request from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mrp = '/mrp_analysis';
// const mrp = '/mrp';
const mvt = '/mvt_report';

// 报告库模板预览
export async function getModelReports(params) {
    return request.get(`${mrp}/modelPicture/getModelReports`, params);
}

// 报告库模板分类预览
export async function getModelReportType(params) {
    return request.postJSON(`${mrp}/modelPicture/getModelReportType`, params);
}

// 业绩报警计算以及预警表总览
export async function getProductReward(params) {
    return request.get(`${mrp}/productReward/getProductReward`, params);
}

// 根据产品名称和代码查询预警表数据
export async function getProductRewardByName(params) {
    return request.postJSON(`${mrp}/yiProductReward/getProductRewardByName`, params);
}

// 搜索产品弹窗，获取产品信息
export async function getProductTable(params) {
    return request.postJSON(`${mrp}/weekReport/productsBySearch`, params);
}

// 获取客户数据
export async function getCustomList(params) {
    return request.postJSON(`${mrp}/weekReport/getCustomers`, params);
}

// 客户报表生成
export async function queryReportByCustomer(params) {
    return request.postJSON(`${mrp}/weekReport/exportWordByCustomers`, params);
}

// 获取echarts数据
export async function getEchartsData(params) {
    return request.postJSON(`${mrp}/weekReport/getEcharts`, params);
}

// 获取日报echarts数据
export async function getDailyEchartsData(params) {
    return request.postJSON(`${mrp}/dailyReport/getEcharts`, params);
}

export async function getReportTemplateAjax(params) {
    return request.postJSON(`${mrp}/dailyReport/getTemplateListParent`, params);
}

export async function getReportColorData(params) {
    return request.postJSON(`${mrp}/dailyReport/getTemplateListColor`, params);
}
// 月报类型下拉
export async function monthlyReportgetTemplateList(params) {
    return request.postJSON(`${mrp}/monthlyReport/getTemplateList`, params);
}

// 获取月报数据
export async function getMonthlyReportImgData(params) {
    return request.postJSON(`${mrp}/monthlyReport/getMonthlyReportImgData`, params);
}

// 点击生成报表
export async function exportWordData(params) {
    return request.postJSON(`${mrp}/weekReport/exportWordData`, params);
}

// 估值表解析
const header = {
    companyCode: getCookie('companyCode'),
};
// 估值表解析成功的列表
export async function getValuationTableCountParsedList(params) {
    return request.postJSON(
        `${mvt}/reportValuationTableImport/getValuationTableCountParsedList`,
        params,
        header,
    );
}

// 估值表删除
export async function deteleValuationTable(params) {
    return request.postJSON(
        `${mvt}/reportValuationTableImport/deteleValuationTable`,
        params,
        header,
    );
}

// 估值表解析模板查询
export async function getTemplateList(params) {
    return request.postJSON(`${mvt}/reportValuationTableImport/getTemplateList`, params, header);
}

// 估值表导入列表查询
export async function getValuationTableList(params) {
    return request.postJSON(
        `${mvt}/reportValuationTableImport/getValuationTableList`,
        params,
        header,
    );
}

// 估值表产品模板关联列表查询
export async function getValuationTableProTempList(params) {
    return request.postJSON(
        `${mvt}/reportValuationTableImport/getValuationTableProTempList`,
        params,
        header,
    );
}

// 估值表解析
export async function parseValuationTable(params) {
    return request.postJSON(
        `${mvt}/reportValuationTableImport/parseValuationTable`,
        params,
        header,
    );
}


// 客户一览表列表
export async function getRelationShipTableList(params) {
    return request.postJSON(
        `${mrp}/customerInvestment/queryInvestment`,
        params,
        header,
    );
}

export async function getModalListById(params) {
    return request.postJSON(
        `${mrp}/customerInvestment/queryInvestmentByCustomerId`,
        params,
        header,
    );
}

export async function exportInverstment(params) {
    return request.postBlob(`${mrp}/exportExcel/customerInvestment`, params);
}

// 下载记录查询
export async function selectLogs(params) {
    return request.postJSON(`${mrp}/logRecord/selectLogs`, params);
}

