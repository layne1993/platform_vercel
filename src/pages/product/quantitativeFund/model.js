/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-05-10 17:00:49
 * @LastEditTime: 2021-11-09 10:30:44
 */
import {
    saveQuantitativeCompanyInfo,
    getQuantitativeCompanyInfo,
    getProductList,
    uploadManagedData,
    saveEquityRunReport
} from './service';
// 假数据
const Model = {
    namespace: 'QUANTITATIVEFUND',
    state: {

    },
    effects: {
        // 保存
        * saveQuantitativeCompanyInfo({ payload, callback }, { call }) {
            const response = yield call(saveQuantitativeCompanyInfo, payload);
            if (callback) callback(response);
        },
        * getQuantitativeCompanyInfo({ callback, payload }, { call }) {
            const response = yield call(getQuantitativeCompanyInfo, payload);
            if (callback) callback(response);
        },
        // 查询产品信息列表
        *queryProductInfo({ payload, callback }, { call }){
          const response = yield call(getProductList,payload)
          console.log(32)
          if (callback) callback(response);
        },
        *uploadHostingDataFiles({ payload, callback }, { call }){
            const response = yield call(uploadManagedData,payload);
            if (callback) callback(response);
        },
        // 编辑产品信息
        *editProductInfo({ payload, callback }, { call }){
            const response = yield call(saveEquityRunReport,payload)
            if(callback) callback(response);
        },
        // /manager/fundPerformanceReport/uploadManagedData

    },
    reducers: {

    }
};
export default Model;
