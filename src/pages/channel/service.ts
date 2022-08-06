/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:48:57
 * @LastEditTime: 2021-06-10 17:13:24
 */

import request from '@/utils/rest';

/**
 * @description 获取列表
 * @param params
 * @returns
 */
export async function getListData(params) {
    return request.postJSON('/manager/channel/list', params);
}

/**
 * @description 刷新匹配（请务必在新增或关联渠道后点击本按钮！）
 * @param params
 * @returns
 */
export async function updateChannel(params) {
    return request.get('/manager/channel/matchingCustomer', params);
}



/**
 * @description 根据id获取渠道详情信息
 * @param params
 * @returns
 */
export async function channelInfo(params) {
    return request.get('/manager/channel/findByChannelId', params);
}


/**
 * @description 新建或者编辑
 * @param params
 * @returns
 */
export async function createOrEdit(params) {
    return request.postJSON('/manager/channel/save', params);
}

/**
 * @description 渠道推荐投资者列表
 * @param params
 * @returns
 */
export async function recommendedInvestor(params) {
    return request.postJSON('/manager/channel/recommendedInvestor', params);
}

/**
 * @description 渠道对应产品
 * @param params
 * @returns
 */
export async function channelProductList(params) {
    return request.postJSON('/manager/channel/productList', params);
}


// 修改渠道商关联状态
export async function changeChannelRelatedStatus(params) {
    return request.postJSON('/manager/channel/update', params);
}


/**
 * @description 空缺渠道编号查询
 * @param params
 * @returns
 */
export async function vacancyChannelList(params) {
    return request.postJSON('/manager/channel/vacancyList', params);
}

// 修改渠道状态
export async function editMarketValueStatus(params) {
    return request.postJSON('/manager/channel/update', params);
}





