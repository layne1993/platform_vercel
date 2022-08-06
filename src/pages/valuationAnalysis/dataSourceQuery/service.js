import requestR from '@/utils/restReport';

import { getCookie } from '@/utils/utils';
import {baseURL} from '@/utils/reportBaseUrl'

const mvt = '/mvt';

const header = {
    companyCode: getCookie('companyCode'),
    dataSource: 'simu',
};

// 有两个接口需要特殊处理companyCode , vip 是 000000
const urlArr = [
    'https://dev.meix.com',
    'https://fof.meix.com'
  ]
  const companyCode = urlArr.includes(baseURL) ? '000000' : getCookie('companyCode')

// 数据源列表
export async function getDataTableList(params) {
    return requestR.postJSON(`${mvt}/dataSource/list`, params, header);
}

// 数据源列表删除
export async function delDataTable(params) {
    return requestR.postJSON(`${mvt}/dataSource/delete?id=${params}`, {}, header);
}

// 手动解析
export async function doParse(params) {
    return requestR.postJSON(`${mvt}/dataSource/doParse`, params, header);
}

// 数据源信息保存
export async function saveDataInfo(params) {
    return requestR.postJSON(`${mvt}/dataSource/addOrUpdate`, params, header);
}

// 数据源规则保存
export async function saveDataRule(params) {
    return requestR.postJSON(`${mvt}/dataSource/saveRule`, params, header);
}

// 数据源详情
export async function getDataDetail(params) {
    return requestR.postJSON(`${mvt}/dataSource/detail?dataSourceId=${params.id}`, params, header);
}

// 模板下拉
export async function getTemplateSource(params) {
    return requestR.postJSON(`${mvt}/template/getTemplateList`, params, {
        ...header,
        companyCode
      });
}
