/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 11:30:00
 * @LastEditTime: 2021-03-29 18:55:21
 */

export interface PageData {
    pageNum: number,
    pageSize: number
}

export interface TableListData {
    list: any[],
    total: number,
    pageSize: number,
    pages?: number,
    pageNum?: number
}
