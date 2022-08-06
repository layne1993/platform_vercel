import request from '@/utils/rest';
import { getToken } from '@/utils/utils';

const param = {
    tokenId:getToken()
  };
/**
 * @description 获取机构信息
 * @param params
 * @returns
 */
export async function getOriginInfo() {
    return request.get('/staggingnewOrgInfo/getOrgInfo');
}
/**
 * @description 新增机构信息
 * @param params
 * @returns
 */
 export async function addOriginInfo(params) {
    return request.postJSON('/staggingnewOrgInfo/addOrgInfo',params);
}
/**
 * @description 编辑机构信息
 * @param params
 * @returns
 */
 export async function editOriginInfo(params) {
    return request.postJSON('/staggingnewOrgInfo/updateOrgInfo',params);
}