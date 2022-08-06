/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 09:48:57
 * @LastEditTime: 2021-05-19 11:16:50
 */

import request from '@/utils/rest';

/**
 * @description 通过父id搜索文件及文件夹 若不传id则查询全部
 * @param params
 * @returns
 */
export async function getTreeData(params) {
    return request.postJSON('/shareNetworkDisk/selectNetWorkDiskById', params);
}

/**
 * @description 新增网盘文件夹
 * @param params
 * @returns
 */
export async function addNetWorkDisk(params) {
    return request.postJSON('/shareNetworkDisk/addNetWorkDisk', params);
}

// 删除网盘文件夹及其子文件夹
export async function deleteFolder(params) {
    return request.get('/shareNetworkDisk/deleteNetWorkDisk', params);
}

// 删除文件
export async function deleteFile(params) {
    return request.get('/shareNetworkFile/deleteNetWorkFile', params);
}

// 修改文件名称
export async function updateFileName(params) {
    return request.postJSON('/shareNetworkFile/updateNetWorkFile', params);
}



/**
 * @description 搜索查询网盘文件
 * @param params
 * @returns
 */
export async function diskSearch(params) {
    return request.postJSON('/shareNetworkFile/searchByName', params);
}


/**
 * @description 0524新需求查询公司下的全部网盘
 * @param params
 * @returns
 */
export async function selectAllNetwork(params) {
    return request.postForm('/shareNetworkDisk/selectAllNetwork', params);
}
