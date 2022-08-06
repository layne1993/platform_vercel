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

// 估值表查询列表
export async function getParseCatalogDataList(params) {
  return requestR.postJSON(
      `${mvt}/data/getParseCatalogDataList`,
      params,
      header,
  );
}

// 估值表数据导出
export async function exportParseCatalogDataList(params) {
  return requestR.postJSON(
      `${mvt}/data/exportParseCatalogDataList`,
      params,
      header,
      'arraybuffer'
  );
}

// 估值表编辑
export async function editParseCatalogData(params) {
  return requestR.postJSON(
      `${mvt}/data/editParseCatalogData`,
      params,
      header,
  );
}

// 估值表上传解析
export async function uploadAndParse(params) {
  return requestR.postJSON(
      `${mvt}/valuationTable/uploadAndParse`,
      params,
      header,
  );
}

// 估值表模板下拉
export async function getTemplateList(params) {
  return requestR.postJSON(
      `${mvt}/template/getTemplateList`,
      params,
      {
        ...header,
        companyCode
      },
  );
}

// 估值表文件下载
export async function valuationTableDownload(params) {
  return requestR.postJSON(
      `${mvt}/valuationTable/download`,
      params,
      header,
      'arraybuffer'
  );
}

// 估值表删除
export async function valuationTableDelete(params) {
  return requestR.postJSON(
      `${mvt}/valuationTable/delete`,
      params,
      header,
  );
}