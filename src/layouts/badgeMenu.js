/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-08-02 15:12:48
 * @LastEditTime: 2021-08-02 15:12:48
 */
export const badgeMenu = {
    // 客户管理/资产证明管理：待审核的数量；
    '/investor/assetsProve': 0,
    // 运营管理/合格投资者认定管理：待审核的数量；
    '/operation/processManagement/investorsProcessList': 0,
    // 产品管理/开放日管理：开放日状态=通知期OR签约期的产品数量；
    '/product/openDay': 0,
    // 信息披露/文件信披提醒管理： 信披状态=披露期OR 通知期的产品数量；
    '/infoDisclosure/informationDisclosure/infoList': 0,
    // 渠道管理/空缺编号查询：空缺渠道数量；
    '/channel/vacancyChannel': 0,
    // 网上直销/预约管理：待审核的数量；
    '/raisingInfo/reservation': 0,
    // 网上直销/合格投资者认定管理：待审核的数量；
    '/raisingInfo/processManagement/investorsProcessList': 0,
    // 网上直销/在线直销流程：待审核的数量；
    '/raisingInfo/processManagement/productProcessList': 0,
    // 网上直销/单独签署管理：签署进度=未完成的数量；
    '/raisingInfo/separateAgreementSign': 0,
    // 网上直销/单独双录管理：待审核的数量；
    '/raisingInfo/doubleRecordSolo': 0,
    // 工作流管理/流程管理：（状态=进行中 & 处理人 IN (自己 OR 空 OR 所有)）的数量；
    '/productLifeCycleInfo/list': 0,
    // 工作流管理/快递信息管理：（状态=签收 & 修改时间=今天）的数量；
    '/productLifeCycleInfo/expressInformation': 0,
    // 风险管理/产品风控提醒：警示状态=警示中的数量；
    '/riskManagement/RiskControl': 0,
    // 打新工具/打新首页：当日有提醒的标的数量 + 代办未完成数量；里面TAB页再做提醒；
    '/staggingTool/overView': 0,
    // 估值表解析/估值表查询：当日新增加的估值表记录数量
    '/valuationAnalysis/valuationQuery': 0
};
