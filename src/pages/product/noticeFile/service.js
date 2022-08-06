import axios from '@/utils/rest';
// 产品信息：
// 产品文件列表-查询
export async function getProductList(params) {
    return axios.postJSON('/product/list', params);
}

// 产品信息详情-查询
export async function getProductDetails(params) {
    return axios.get('/product/detail', params);
}

// 产品信息-新建
export async function createProduct(params) {
    return axios.postJSON('/product/create', params);
}

// 产品信息-编辑
export async function editProduct(params) {
    return axios.put('/product/edit', params);
}

// 产品信息-删除
export async function deleteProduct(params) {
    return axios.ax_delete('/product/delete', params);
}

// 产品信息-导出
export async function exportProduct(params) {
    return axios.get('/product/export', params);
}

// 产品信息-查询所有产品经理
export async function queryManager(params) {
    return axios.get('/manager/managerUser/selectAllProductManager', params);
}

// 产品信息-查询托管公司列表
export async function queryCompanyList(params) {
    return axios.postJSON('/product/trusteeshipCompany/list', params);
}


// 产品信息-获取管理端用户
export async function getManagerUser(params) {
    return axios.get('/manager/managerUser/selectAllUser', params);
}

// 产品信息-查询产品系列列表
export async function getProductType(params) {
    return axios.postJSON('/product/series/list', params);
}

// 产品信息-查询默认的客户端显示设置
export async function getProductShowSetting(params) {
    return axios.get('/product/productShowSetting/default/detail', params);
}

export async function queryOutsourcingList(params) {
    return axios.postJSON('/outsourcingAgency/list', params);
}




// 文件信息：
// 文件列表-查询
export async function getProductFile(params) {
    return axios.postJSON('/productFile/list', params);
}

// 文件列表-删除
export async function deleteProductFile(params) {
    return axios.ax_delete('/productFile/delete', params);
}



// 协议模板信息
// 查询列表（分页）
export async function queryDocumentList(params) {
    return axios.postJSON('/product/document/page', params);
}

// 管理人用印
export async function managerSign(params) {
    return axios.postJSON('/product/document/managerSign', params);
}

// 查看协议详情
export async function queryDocumentDetails(params) {
    return axios.get('/product/document/detail', params);
}

// 新增协议
export async function addDocument(params) {
    return axios.postJSON('/product/document/save', params);
}



// 产品配置：
// 产品配置-查询
export async function queryFundSetting(params) {
    return axios.get('/productSetting/detail', params);
}

// 产品配置-保存
export async function saveFundSetting(params) {
    return axios.postJSON('/productSetting/save', params);
}

// 获取token
export async function queryToken(params) {
    return axios.get('/manager/productDocumentToSimu/getToken', params);
}

// 不同环境是否展示新老Saas相关内容
export async function getLinkSimu () {
    return axios.get('/manager/productDocumentToSimu/getLinkSimu');
}



// 产品投资人----------------------------------------

// list 数据查询
export async function dividendWayRecord(params) {
    return axios.postJSON('/dividendWayRecord/selectAll', params);
}


// 开启修改分红
export async function modifyDividend(params) {
    return axios.postJSON('/dividendWayRecord/modifyDividend', params);
}

// 分红编辑
export async function dividendWayUpdate(params) {
    return axios.postJSON('/dividendWayRecord/update', params);
}

// 关闭开启
export async function closeOpen(params) {
    return axios.postJSON('/dividendWayRecord/closeOpen', params);
}


// 查看分红修改记录
export async function dividendWayHistory(params) {
    return axios.postJSON('/dividendWayRecord/examine', params);
}

// 开户账户信息
// 列表
export async function getProductAccountList(params) {
    return axios.postJSON('/productAccount/list', params);
}

// 新建
export async function setProductAccountList(params) {
    return axios.postJSON('/productAccount/createOrUpdate', params);
}

// 详细
export async function getProductAccountDetail(params) {
    return axios.get('/productAccount', params);
}

// 删除
export async function deleteProductAccountList(params) {
    return axios.postJSON('/productAccount/delete', params);
}

// 证券新增及编辑
export async function setSecuritiesAccountList(params) {
    return axios.postJSON('/productAccount/securitiesAccount/createOrUpdate', params);
}

// 证券详情
export async function getSecuritiesAccountList(params) {
    return axios.get('/productAccount/securitiesAccount', params);
}


// 打新配置-查看产品打新所需基本信息
export async function applySettingFind(params) {
    return axios.get('/stagging/applySetting/find', params);
}

// 打新配置-编辑产品打新所需基本信息
export async function createOrUpdate(params) {
    return axios.postJSON('/stagging/applySetting/createOrUpdate', params);
}

// 打新配置-编辑产品打新出资表更新信息
export async function updateLpUpdateInfo(params) {
    return axios.postJSON('/stagging/applySetting/updateLpUpdateInfo', params);
}

// 打新配置-出资方管理-出资方列表
export async function lpQuery(params) {
    return axios.postForm('/stagging/lp/query', params);
}

// 打新配置-重新计算
export async function lpRecalculate(params) {
    return axios.postJSON('/stagging/lp/computeRate', params);
}


// 产品基本信息-获取产品投资策略

export async function productInvestmentStrategy(params) {
    return axios.postJSON('/product/selectSysCodeList', params);
}



