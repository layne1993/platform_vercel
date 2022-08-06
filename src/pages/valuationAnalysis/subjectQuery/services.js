import requestR from '@/utils/restReport';

import { getCookie } from '@/utils/utils';

const mvt = '/mvt';

const header = {
  companyCode: getCookie('companyCode'),
  dataSource: 'simu',
};

// 估值表--解析科目查询列表
export async function getParseDetailDataList(params) {
  return requestR.postJSON(
      `${mvt}/data/getParseDetailDataList`,
      params,
      header,
  );
}

// 估值表--解析科目导出
export async function exportParseDetailDataList(params) {
  return requestR.postJSON(
      `${mvt}/data/exportParseDetailDataList`,
      params,
      header,
      'arraybuffer'
  );
}

// 估值表--解析科目删除
export async function deleteDetail(params) {
  return requestR.postJSON(
      `${mvt}/data/deleteDetail`,
      params,
      header,
  );
}