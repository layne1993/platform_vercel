import request from '@/utils/rest';


// 获取产品运营情况总览
export async function getProductOperate(params){
    return request.get('/mrp_analysis/simuAnalysis/productStat', params);
}




