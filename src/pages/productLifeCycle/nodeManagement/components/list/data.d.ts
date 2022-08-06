/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 20:13:48
 * @LastEditTime: 2021-03-18 10:42:10
 */

// 表格数据
export interface PageData {
    pageNum: number,
    pageSize: number
}


// 表格数据
export interface TableListData {
    list: any[],
    total: number,
    pageSize: number,
    pages?: number,
}
