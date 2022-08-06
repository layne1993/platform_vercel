import request from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mvt = '/mvt_report';
const mrp = '/mrp_analysis';

//多产品接口查询
export async function multyProductIndexQueryJson(params) {
    return request.postJSON(`${mrp}/multiProductsTarget/getMultiProductsTarget`, params);
}

//多产品接口导出
export async function multyProductIndexQuery(params) {
    return request.postBlob(`${mrp}/multiProductsTarget/getMultiProductsTarget`, params);
}

// 搜索产品弹窗，获取产品信息
export async function getProductTable(params) {
    return request.postJSON(`${mrp}/weekReport/productsBySearch`, params);
}