import requestR from '@/utils/restReport';

import { getCookie } from '@/utils/utils';

const mvt = '/mvt';

const header = {
  companyCode: getCookie('companyCode'),
  dataSource: 'report',
};

// 估值表解析成功的列表
export async function getValuationTableCountParsedList(params) {
  return requestR.postJSON(
      `${mvt}/data/getValuationTableList`,
      { ...params, fileType: 'product' },
      header,
  );
}