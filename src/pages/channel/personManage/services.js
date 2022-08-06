import requestR from '@/utils/rest';
import qs from "qs";

import { getCookie } from '@/utils/utils';
const mvt = '/mrp_analysis';

const header = {
  companyCode: getCookie('companyCode'),
  dataSource: 'simu',
};


// 查询所有销售人员
export async function getAllSeller(data={}) {
  return requestR.postJSON(
    `${mvt}/salesman/querySalesman`,
    data
  );
}
// 新增销售人员
export async function addSeller(data) {
  return requestR.postJSON(
    `${mvt}/salesman/addSalesman`,
    data
  );
}
// 编辑销售人员
export async function editSeller(data) {
  return requestR.postJSON(
    `${mvt}/salesman/editSalesman`,
    data
  );
}
// 删除销售人员
export async function delSeller(data) {
  return requestR.postJSON(
    `${mvt}/salesman/delSalesman`,
    data
  );
}
// 根据id导出excel
export async function exportSelect(data) {
  const reportSalesmanIdList = data.join(',');
  return requestR.postBlob(
    `${mvt}/salesman/exportBySelect?reportSalesmanIdList=${reportSalesmanIdList}`,
  );
}
// 导出全部excel
export async function exportSelectAll(data) {
  return requestR.postBlob(
    `${mvt}/salesman/exportAllByQuery`,
  );
}

// 下载上传模板
export async function downUploadMode() {
  return requestR.getBlob(
    `${mvt}/salesman/downloadTemplate`,
  );
}


