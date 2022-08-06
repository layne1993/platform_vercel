import { pathMatchRegexp } from '@/utils/utils';
import modelExtend from 'dva-model-extend';
import { pageModel } from '@/utils/model';
import {
    getProductList,
    getProductDetails,
    createProduct,
    editProduct,
    deleteProduct,
    exportProduct,
    queryFundSetting,
    saveFundSetting,
    queryDocumentList,
    managerSign,
    queryDocumentDetails,
    addDocument,
    getProductFile,
    deleteProductFile,
    queryManager,
    queryCompanyList,
    getManagerUser,
    getProductType,
    getProductShowSetting,
    queryToken,
    getLinkSimu,
    dividendWayRecord,
    dividendWayHistory,
    modifyDividend,
    dividendWayUpdate,
    closeOpen,
    createOrUpdate,
    getProductAccountList,
    setProductAccountList,
    getProductAccountDetail,
    deleteProductAccountList,
    setSecuritiesAccountList,
    getSecuritiesAccountList,
    applySettingFind,
    updateLpUpdateInfo,
    lpQuery,
    lpRecalculate,
    queryOutsourcingList,
    productInvestmentStrategy,
    getFundInfo,
    querySelectAllUser,
    getAMACFundInfo,
    getProductNoticeStatistics
} from './service';

export default modelExtend(pageModel, {
    namespace: 'productDetails',
    state: {
        linkSimu: 1,
        productInfo: {}
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (pathMatchRegexp('/product/list/details', location.pathname)) {
                    // console.log('----');
                }
            });
        }
    },
    effects: {

        /*产品信息-start*/
        // 产品信息列表-查询
        * getProductList({ payload, callback }, { call, put }) {
            const data = yield call(getProductList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 基础要素-查询
        * getProductDetails({ payload, callback }, { call, put }) {
            const data = yield call(getProductDetails, payload);
            yield put({
                type: 'save',
                payload: data
            });
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-新建
        * createProduct({ payload, callback }, { call, put }) {
            const data = yield call(createProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-编辑
        * editProduct({ payload, callback }, { call, put }) {
            const data = yield call(editProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-删除
        * deleteProduct({ payload, callback }, { call, put }) {
            const data = yield call(deleteProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-导出
        * exportProduct({ payload, callback }, { call, put }) {
            const data = yield call(exportProduct, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询所有产品经理
        * queryManager({ payload, callback }, { call, put }) {
            const data = yield call(queryManager, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询所有产品经理
        * queryCompanyList({ payload, callback }, { call, put }) {
            const data = yield call(queryCompanyList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询所有产品经理
        * getManagerUser({ payload, callback }, { call, put }) {
            const data = yield call(getManagerUser, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询产品系列列表
        * getProductType({ payload, callback }, { call, put }) {
            const data = yield call(getProductType, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品信息-查询产品系列列表
        * getProductShowSetting({ payload, callback }, { call, put }) {
            const data = yield call(getProductShowSetting, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        * queryOutsourcingList({ payload, callback }, { call, put }) {
            const data = yield call(queryOutsourcingList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        * productInvestmentStrategy({ payload, callback }, { call, put }) {
            const data = yield call(productInvestmentStrategy, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        * getFundInfo({ payload, callback }, { call, put }) {
            const data = yield call(getFundInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        /*产品信息-end*/



        /*文件信息-start*/
        // 文件列表-查询
        * getProductFile({ payload, callback }, { call, put }) {
            const data = yield call(getProductFile, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 文件-删除
        * deleteProductFile({ payload, callback }, { call, put }) {
            const data = yield call(deleteProductFile, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        /*文件信息-end*/



        /*产品配置- start*/
        // 产品配置-查询
        * queryFundSetting({ payload, callback }, { call, put }) {
            const data = yield call(queryFundSetting, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 产品配置-保存
        * saveFundSetting({ payload, callback }, { call, put }) {
            const data = yield call(saveFundSetting, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        /*产品配置- end*/



        /*协议模板配置- start*/
        // 查询列表（分页）
        * queryDocumentList({ payload, callback }, { call, put }) {
            const data = yield call(queryDocumentList, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 管理人用印
        * managerSign({ payload, callback }, { call, put }) {
            const data = yield call(managerSign, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 查看协议详情
        * queryDocumentDetails({ payload, callback }, { call, put }) {
            const data = yield call(queryDocumentDetails, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        // 新增协议
        * addDocument({ payload, callback }, { call, put }) {
            const data = yield call(addDocument, payload);
            if (callback && typeof callback === 'function') callback(data);
        },
        /*协议模板配置- end*/



        // 新老平台对接开发
        * queryToken({ payload, callback }, { call }) {
            const response = yield call(queryToken, payload);
            if (callback) callback(response);
        },

        // 获取不同环境是否展示新老Saas相关开发内容
        * getLinkSimu({ payload, callback }, { call, put }) {
            const response = yield call(getLinkSimu, payload);
            yield put({
                type: 'setLinkSimu',
                payload: response.data || {}
            });
            if (callback) { callback(); }
        },

        // 产品投资人--------------------
        // 新老平台对接开发
        * dividendWayRecord({ payload, callback }, { call }) {
            const response = yield call(dividendWayRecord, payload);
            if (callback) callback(response);
        },

        // 查看分红修改记录
        * dividendWayHistory({ payload, callback }, { call }) {
            const response = yield call(dividendWayHistory, payload);
            if (callback) callback(response);
        },

        // 开启修改分红
        * modifyDividend({ payload, callback }, { call }) {
            const response = yield call(modifyDividend, payload);
            if (callback) callback(response);
        },

        // 分红编辑
        * dividendWayUpdate({ payload, callback }, { call }) {
            const response = yield call(dividendWayUpdate, payload);
            if (callback) callback(response);
        },

        // 关闭开启
        * closeOpen({ payload, callback }, { call }) {
            const response = yield call(closeOpen, payload);
            if (callback) callback(response);
        },

        // 开户账户信息------------------
        // 获取账户列表
        * getProductAccountList({ payload, callback }, { call }) {
            const response = yield call(getProductAccountList, payload);
            if (callback) callback(response);
        },
        // 新建或编辑账户
        * setProductAccountList({ payload, callback }, { call }) {
            const response = yield call(setProductAccountList, payload);
            if (callback) callback(response);
        },
        // 获取账户详情
        * getProductAccountDetail({ payload, callback }, { call }) {
            const response = yield call(getProductAccountDetail, payload);
            if (callback) callback(response);
        },
        // 删除账户
        * deleteProductAccountList({ payload, callback }, { call }) {
            const response = yield call(deleteProductAccountList, payload);
            if (callback) callback(response);
        },
        // 新建或编辑证券账户
        * setSecuritiesAccountList({ payload, callback }, { call }) {
            const response = yield call(setSecuritiesAccountList, payload);
            if (callback) callback(response);
        },
        // 获取证券账户详情
        * getSecuritiesAccountList({ payload, callback }, { call }) {
            const response = yield call(getSecuritiesAccountList, payload);
            if (callback) callback(response);
        },

        // 产品出资方--------------------
        // 打新配置-查看产品打新所需基本信息
        * applySettingFind({ payload, callback }, { call }) {
            const response = yield call(applySettingFind, payload);
            if (callback) callback(response);
        },
        // 打新配置-编辑产品打新所需基本信息
        * createOrUpdate({ payload, callback }, { call }) {
            const response = yield call(createOrUpdate, payload);
            if (callback) callback(response);
        },

        // 打新配置-编辑产品打新出资表更新信息
        * updateLpUpdateInfo({ payload, callback }, { call }) {
            const response = yield call(updateLpUpdateInfo, payload);
            if (callback) callback(response);
        },

        // 打新配置-出资方查询
        * lpQuery({ payload, callback }, { call }) {
            const response = yield call(lpQuery, payload);
            if (callback) callback(response);
        },

        // 打新配置-出资方列表保存
        * lpRecalculate({ payload, callback }, { call }) {
            const response = yield call(lpRecalculate, payload);
            if (callback) callback(response);
        },

        // 查询所有用户
        *querySelectAllUser({ payload, callback }, { call, put }) {
            const data = yield call(querySelectAllUser, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 根据产品名称或者产品编号获取基金信息
        *getAMACFundInfo({ payload, callback }, { call, put }) {
            const data = yield call(getAMACFundInfo, payload);
            if (callback && typeof callback === 'function') callback(data);
        },

        // 获取产品详情红点
        *getProductNoticeStatistics({ payload, callback }, { call, put }) {
            const data = yield call(getProductNoticeStatistics, payload);
            if (callback && typeof callback === 'function') callback(data);
        }

    },
    reducers: {
        resetModel(state, { payload }) {
            return { ...state, ...payload };
        },
        save(state, action) {
            const { payload } = action;
            let { productInfo } = state;
            if (payload && payload.code === 1008) {
                productInfo = payload.data || {};
            }
            return { ...state, productInfo };
        },
        setLinkSimu(state, { payload }) {
            return { ...state, linkSimu: payload.linkSimu === undefined ? 1 : payload.linkSimu };
        }
    }
});
