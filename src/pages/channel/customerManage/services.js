import requestR from '@/utils/rest';

import { getCookie } from '@/utils/utils';

const mvt = '/mrp_analysis';

const header = {
  companyCode: getCookie('companyCode'),
  dataSource: 'simu',
};

// 客户查询列表
export async function getCustomer(data={}) {
  return requestR.postJSON(
      `${mvt}/customerSalesman/queryCustomerSalesman`,
      data
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

// 查询客户修改记录
export async function getChange() {
  return requestR.postJSON(
      `${mvt}/customerSalesman/queryHistory`,
  );
}
// 查询所有销售人员
export async function getAllSeller(data={}) {
  return requestR.postJSON(
    `${mvt}/salesman/querySalesman`,
    data
  );
}

// 替换所属销售
export async function replaceSeller(data={}) {
  return requestR.postJSON(
    `${mvt}/customerSalesman/replaceSales`,
    data
  );
}

// 批量替换所属销售
export async function replaceAllSeller(data=[]) {
  
  return requestR.postArray(
    `${mvt}/customerSalesman/replaceSalesBatch`,
    data
  );
}

// 根据id导出excel
export async function exportSelect(data) {
  const customerIdList = data.join(',');
  return requestR.postBlob(
    `${mvt}/customerSalesman/exportBySelect?customerIdList=${customerIdList}`,
  );
}
// 导出全部excel
export async function exportSelectAll(data) {
  return requestR.postBlob(
    `${mvt}/customerSalesman/exportAllByQuery`,
  );
}
