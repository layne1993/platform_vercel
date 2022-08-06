/*
 * @description: 模板创建
 * @Author: tangsc
 * @Date: 2021-03-12 18:22:10
 */
import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import { reportFormLogo } from '@/utils/staticResources';
import {
    getProductList,
    queryCustomReport,
    createTemplate,
    queryByProductId,
    getReportData,
    deleteTemplate,
    updateTemplate
} from './service';

export default modelExtend(pageModel, {

    namespace: 'createReportForm',
    state: {
        baseInfo: {                                // logo模块基本信息
            headline: '报表标题',
            logoUrl: reportFormLogo,
            color: '#E4E4E4',
            textColor: '#000000'
        },
        customFormData: {},                        // 查询报表模板数据
        tipsInfo: '',                              // 提示信息
        isShowa: true,                             // 控制导出时操作按钮隐藏
        templateList: [],                          // 模板列表
        attachmentsId: 0,                          // 上传文件id
        time: [],                                  // 报表选择的日期
        templateId: 0,                             // 当前模板id
        productId: 0,                              // 当前产品id
        assetAllocation: false,                    // 是否存在资产分布模块,true-展示
        isNetValueInfo: false,                     // 是否存在净值信息模块
        isProductInfo: false,                      // 是否存在产品信息模块
        isNetValueTrends: false,                   // 是否存在走势图模块
        isHistoricalIncomes: false,                // 是否存在收益率模块
        isStatisticalTable: false,                 // 是否存在统计表格模块
        isText: false,                             // 是否存在文本框和标题模块
        isImportantNote: false,                    // 是否存在重要提示文本内容模块
        periods: [],                               // 可展示数据时间周期
        isSelectAll: false                         // 是否全选
    },
    // subscriptions: {
    //     setup({ dispatch, history }) {
    //         history.listen((location) => {
    //             if (pathMatchRegexp('/createReportForm/list', location.pathname)) {
    //                 dispatch({
    //                     type: 'queryCustomReport',
    //                     payload: {
    //                         'endDate': '2021-04-07T08:13:42.927Z',
    //                         'productId': 658842,
    //                         'reportTemplateId': 1182219
    //                     }
    //                 });
    //             }
    //         });
    //     }
    // },
    effects: {
        // 查询产品列表
        *getProductList({ payload, callback }, { call, put }) {
            const data = yield call(getProductList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 自定报表数据查询
        *queryCustomReport({ payload, callback }, { call, put }) {
            const res = yield call(queryCustomReport, payload);
            if (res.code === 1008 && res.data) {
                const { data } = res;
                yield put({
                    type: 'updateState',
                    payload: {
                        baseInfo: {
                            headline: data.headline,
                            logoUrl: data.logoUrl,
                            color: data.color,
                            textColor: data.textColor
                        },
                        customFormData: data,
                        assetAllocation: data.assetAllocation,
                        isNetValueInfo: data.isNetValueInfo,
                        isProductInfo: data.isProductInfo,
                        isNetValueTrends: data.isNetValueTrends,
                        isHistoricalIncomes: data.isHistoricalIncomes,
                        isStatisticalTable: data.isStatisticalTable,
                        isText: data.isText,
                        isImportantNote: data.isImportantNote,
                        periods: data.performanceRangeShows,
                        isSelectAll: data.isAllProducts
                    }
                });
            }
            if (callback && typeof callback === 'function') callback(res);

        },
        // 保存模板
        *createTemplate({ payload, callback }, { call, put }) {
            const data = yield call(createTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 根据产品id查询模板
        *queryByProductId({ payload, callback }, { call, put }) {
            const data = yield call(queryByProductId, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 生命周期模板-获取修改信息
        *getReportData({ payload, callback }, { call, put }) {
            const data = yield call(getReportData, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 删除模板
        *deleteTemplate({ payload, callback }, { call, put }) {
            const data = yield call(deleteTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 修改模板
        *updateTemplate({ payload, callback }, { call, put }) {
            const data = yield call(updateTemplate, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
        clearData(state, { payload = {} }) {
            let params = {
                baseInfo: {
                    headline: '报表标题',
                    logoUrl: reportFormLogo,
                    color: '#E4E4E4',
                    textColor: '#000000'
                },
                customFormData: {},
                tipsInfo: '',
                isShowa: true,
                templateList: [],
                attachmentsId: 0,
                time: [],
                templateId: 0,
                productId: 0,
                assetAllocation: false,
                isNetValueInfo: false,
                isProductInfo: false,
                isNetValueTrends: false,
                isHistoricalIncomes: false,
                isStatisticalTable: false,
                isText: false,
                isImportantNote: false,
                periods: [],
                isSelectAll: false
            };
            return {
                ...state,
                ...params,
                ...payload
            };
        }
    }
});
