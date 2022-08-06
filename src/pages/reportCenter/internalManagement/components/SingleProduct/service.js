import request from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mvt = '/mvt_report';
const mrp = '/mrp_analysis';

// 单一产品业绩指标
export async function oneProductIndexQuery(params) {
  return request.postJSON(`${mrp}/oneProductIndex/query`, params);
}


// 搜索产品弹窗，获取产品信息
export async function getProductTable(params) {
  return request.postJSON(`${mrp}/weekReport/productsBySearch`, params);
}

// 导出
export async function oneProductIndexExport(params) {
  return request.postBlob(`${mrp}/oneProductIndex/export `, params);
}

