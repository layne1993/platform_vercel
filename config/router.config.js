const RouteWatcher = '@/components/PageTab/RouteWatcher';

import defaultSettings from './defaultSettings';
const { REACT_APP_ENV } = process.env;
const BASE_PATH = defaultSettings[REACT_APP_ENV || 'dev'];

export default [
    // 管理人登录
    {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
            {
                path: '/user',
                redirect: '/user/login',
            },
            {
                name: 'login',
                icon: 'smile',
                path: '/user/login',
                component: './login',
            },
            {
                component: '404',
            },
        ],
    },

    {
        path: '/',
        component: '../layouts/SecurityLayout',
        routes: [
            {
                path: '/',
                component: '../layouts/BasicLayout',
                // Routes: ['src/pages/Authorized'],
                // authority: ['admin', 'user'],
                routes: [
                    {
                        path: '/',
                        redirect: '/panel',
                        // authority: ['admin', 'user'],
                    },
                    //  面板
                    {
                        path: `/panel`,
                        name: 'panel',
                        icon: 'dashboard',
                        // authority: ['1000'],
                        component: './panel',
                        tabLocalId: 'menu.panel',
                        wrappers: [RouteWatcher],
                    },

                    //  业务分析
                    {
                        path: '/businessAnalysis',
                        name: 'businessAnalysis',
                        icon: 'UserOutlined',
                        authority: [41000],
                        //component: './panel',
                        routes: [
                            // 总经理报告
                            // {
                            //     name: 'general',
                            //     path: '/businessAnalysis/generalManager',
                            //     component: './businessAnalysis/generalManager',
                            //     tabLocalId: 'menu.businessAnalysis.general',
                            //     wrappers: [RouteWatcher],
                            //     authority: [41100],
                            // },
                            // 运营经理报告
                            {
                                name: 'operate',
                                path: '/businessAnalysis/operateManager',
                                component: './businessAnalysis/operateManager',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.businessAnalysis.operate',
                                authority: [41200],
                            },
                            // 投资经理报告
                            {
                                name: 'invest',
                                path: '/businessAnalysis/investManager',
                                component: './businessAnalysis/investManager',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.businessAnalysis.invest',
                                authority: [41300],
                            },

                            // 市场经理报告
                            {
                                name: 'market',
                                path: '/businessAnalysis/marketManager',
                                component: './businessAnalysis/marketManager',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.businessAnalysis.market',
                                authority: [41400],
                            },
                        ],
                    },

                    // 产品信息管理
                    {
                        path: '/product',
                        icon: 'InboxOutlined',
                        name: 'product',
                        authority: [30000],
                        routes: [
                            {
                                name: 'productList',
                                icon: 'form',
                                path: '/product/list/:timestamp?',
                                component: './product/list',
                                authority: [30100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product',
                            },
                            // 产品信息详情
                            {
                                name: 'productDetails',
                                icon: 'form',
                                path: '/product/list/details/:productId',
                                component: './product/details',
                                authority: [30101],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.productDetails',
                                hideInMenu: true,
                            },
                            //  协议模板详情
                            {
                                name: 'templateDetails',
                                path: '/product/list/details/:productId/template/:id',
                                hideInMenu: true,
                                component: './product/templateDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.templateDetails',
                            },
                            //  签约流程详情-认购
                            {
                                name: 'signDetails',
                                path: '/product/list/details/:productId/signDetails/:flowId',
                                hideInMenu: true,
                                component: './product/signDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.signDetails',
                            },
                            //  签约流程详情-申购
                            {
                                name: 'applyDetails',
                                path: '/product/list/details/:productId/applyDetails/:flowId',
                                hideInMenu: true,
                                component: './product/applyDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.applyDetails',
                            },
                            // 产品配置管理
                            {
                                name: 'productConfig',
                                icon: 'form',
                                path: '/product/productConfig',
                                component: './product/productConfig',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.productConfig',
                                authority: [30700],
                            },
                            // 净值
                            {
                                name: 'netValueData',
                                icon: 'form',
                                path: '/product/netValueData',
                                component: './product/netValueData',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.netValueData',
                                authority: [30200],
                            },
                            // 产品开放日管理
                            {
                                name: 'openDay',
                                icon: 'form',
                                path: '/product/openDay',
                                component: './product/openDay',
                                authority: [30300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.openDay',
                            },
                            // 量化私募基金运行报表
                            {
                                name: 'quantitativeFund',
                                icon: 'form',
                                path: '/product/quantitativeFund',
                                component: './product/quantitativeFund',
                                authority: [30800],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.quantitativeFund',
                            },
                        ],
                    },

                    // 信息披露
                    {
                        path: '/infoDisclosure',
                        name: 'infoDisclosure',
                        icon: 'form',
                        authority: [30300, 30400, 75000],
                        routes: [
                            // 产品公告文件
                            {
                                name: 'noticeFile',
                                icon: 'form',
                                path: '/infoDisclosure/notice/file',
                                component: './product/noticeFile',
                                authority: [30300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.noticeFile',
                            },
                            // 强制确认公告配置
                            {
                                name: 'confirmAnnouncementSettings',
                                icon: 'form',
                                path: '/infoDisclosure/confirmAnnouncementSettings',
                                component: './informationDisclosure/confirmAnnouncementSettings',
                                authority: [30400],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.confirmAnnouncementSettings',
                            },
                            // 强制确认公告
                            {
                                name: 'confirmationDocument',
                                icon: 'form',
                                path: '/infoDisclosure/confirmAnnouncementSettings/confirmationDocument/:id',
                                component:
                                    './informationDisclosure/confirmAnnouncementSettings/confirmationDocument',
                                authority: [80100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.confirmationDocument',
                                hideInMenu: true,
                            },
                            // 信披文件管理
                            {
                                name: 'informationDisclosure',
                                icon: 'form',
                                path: '/infoDisclosure/informationDisclosure/infoList',
                                component: './informationDisclosure',
                                authority: [30400],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.informationDisclosure',
                            },
                            //信息服务列表
                            {
                                path: '/infoDisclosure/saleService',
                                name: 'noticeList',
                                component: './marketServices/SaleService/Notice/List',
                                authority: [75000],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.noticeList',
                            },
                            //创建通知模板
                            {
                                path: '/infoDisclosure/saleService/template/:templateCode/:type?',
                                name: 'createModule',
                                hideInMenu: true,
                                component: './marketServices/SaleService/Notice/Template',
                                authority: [75000],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.createModule',
                            },
                            //信披配置
                            {
                                path: '/infoDisclosure/setting',
                                name: 'setting',
                                component: './informationDisclosure/setting',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.infoDisclosure.setting',
                                // authority: [75000],
                            },
                        ],
                    },

                    // 客户信息管理
                    {
                        name: 'investor',
                        icon: 'UserOutlined',
                        path: '/investor',
                        authority: [10000],
                        routes: [
                            //  客户信息列表
                            {
                                name: 'list',
                                path: '/investor/customerInfo/:timestamp?',
                                component: './investor/customerInfo',
                                authority: [10100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.list',
                            },
                            // 实名信息
                            {
                                name: 'realName',
                                path: '/investor/realName',
                                component: './investor/realName',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.realName',
                                // authority: [10100],
                            },
                            //  客户详情(新建、编辑)
                            {
                                name: 'InvestorDetails',
                                path: '/investor/customerInfo/investordetails/:customerId',
                                hideInMenu: true,
                                component: './investor/InvestorDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.InvestorDetails',
                                authority: [10101],
                            },
                            // 银行卡管理
                            {
                                name: 'bankCardInfo',
                                path: '/investor/bankCardInfo',
                                component: './investor/BankCardInfo',
                                wrappers: [RouteWatcher],
                                authority: [10200],
                                tabLocalId: 'menu.investor.bankCardInfo',
                            },

                            // 资产证明管理
                            {
                                name: 'assetsProve',
                                path: '/investor/assetsProve',
                                component: './investor/AssetsProve',
                                authority: [11000],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.assetsProve',
                            },
                            // 份额余额信息列表
                            {
                                name: 'shareInfo',
                                icon: 'form',
                                path: '/investor/shareInfoAdmin/share/shareInfo',
                                component: './share/shareInfo',
                                authority: [10700],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.shareInfo',
                            },
                            //  风险测评问卷列表
                            {
                                name: 'risklist',
                                path: '/investor/risk/list',
                                component: './risk/list',
                                authority: [50100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.riskManager.list',
                            },
                            // 合格投资者认定列表
                            {
                                name: 'investorsProcessList',
                                icon: 'contacts',
                                path: '/investor/processManagement/investorsProcessList',
                                component: './processManagement/identify/list',
                                authority: [20100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.investorsProcessList',
                            },
                            //  签约流程详情-认购
                            {
                                name: 'customerSignDetails',
                                path: '/investor/customerInfo/investordetails/:customerId/CustomerSignDetails/:flowId',
                                hideInMenu: true,
                                component:
                                    './investor/InvestorDetails/components/customerSignDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.customerSignDetails',
                            },
                            //  签约流程详情-申购
                            {
                                name: 'customerSignDetails',
                                path: '/investor/customerInfo/investordetails/:customerId/customerApplyDetails/:flowId',
                                hideInMenu: true,
                                component:
                                    './investor/InvestorDetails/components/customerApplyDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.customerSignDetails',
                            },
                            // 客户经理管理
                            {
                                name: 'customerManager',
                                path: '/investor/customerManager',
                                component: './investor/customerManager',
                                wrappers: [RouteWatcher],
                                authority: [10200],
                                tabLocalId: 'menu.investor.customerManager',
                            },
                        ],
                    },

                    // 运营管理

                    {
                        path: '/operation',
                        icon: 'contacts',
                        name: 'operation',
                        authority: [20100, 10300, 10400, 10500, 10600, 10900],
                        routes: [
                            // 合格投资者认定列表
                            {
                                name: 'investorsProcessList',
                                icon: 'contacts',
                                path: '/operation/processManagement/investorsProcessList',
                                component: './processManagement/identify/list',
                                authority: [20100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.investorsProcessList',
                            },
                            // 合格投资者认定-- 线上
                            {
                                name: 'identifyFlowOnline',
                                icon: 'contacts',
                                hideInMenu: true,
                                path: '/operation/processManagement/investorsProcessList/online/:identifyFlowId',
                                component: './processManagement/identify/online',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.identifyFlowOnline',
                            },

                            // 合格投资者认定流程 -- 线下
                            {
                                name: 'identifyFlowOffline',
                                icon: 'form',
                                hideInMenu: true,
                                path: '/operation/processManagement/investorsProcessList/offline/:identifyFlowId',
                                component: './processManagement/identify/offline',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.identifyFlowOffline',
                            },
                            // 募集户资金流水
                            {
                                name: 'RunningList',
                                icon: 'strikethrough',
                                path: '/operation/transactionInfo/RunningList',
                                component: './transactionInfo/RunningList',
                                authority: [10300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.operation.RunningList',
                            },
                            //  认申赎下单信息
                            {
                                name: 'OrderList',
                                path: '/operation/transactionInfo/OrderList',
                                icon: 'container',
                                component: './transactionInfo/OrderList',
                                authority: [10400],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.operation.OrderList',
                            },
                            // 认申赎确认信息
                            {
                                name: 'TransactionList',
                                path: '/operation/transactionInfo/TransactionList/:timestamp?',
                                icon: 'database',
                                component: './transactionInfo/TransactionList',
                                authority: [10500],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.operation.TransactionList',
                            },
                            // 分红信息查询
                            {
                                name: 'dividends',
                                path: '/operation/dividends',
                                icon: 'pie-chart',
                                component: './dividends/dividendsList',
                                authority: [10600],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.operation.dividends',
                            },
                            // 份额余额信息列表
                            {
                                name: 'shareInfo',
                                icon: 'form',
                                path: '/operation/shareInfoAdmin/share/shareInfo',
                                component: './share/shareInfo',
                                authority: [10700],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.investor.shareInfo',
                            },
                            // 份额确认书
                            {
                                name: 'shareConfirmation',
                                icon: 'form',
                                path: '/operation/shareInfoAdmin/share/shareConfirmation',
                                component: './share/shareConfirmation',
                                authority: [10900],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.operation.shareConfirmation',
                            },
                        ],
                    },

                    // 网上直销
                    {
                        path: '/raisingInfo',
                        icon: 'strikethrough',
                        name: 'raisingInfo',
                        authority: [20000, 30500, 20100, 20200, 20300, 20400, 60100, 60200, 60300],
                        routes: [
                            // 产品预约管理
                            {
                                name: 'reservation',
                                icon: 'form',
                                path: '/raisingInfo/reservation',
                                component: './product/reservation',
                                authority: [30500],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.reservation',
                            },
                            // 合格投资者认定列表
                            {
                                name: 'investorsProcessList',
                                icon: 'contacts',
                                path: '/raisingInfo/processManagement/investorsProcessList',
                                component: './processManagement/identify/list',
                                authority: [20100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.investorsProcessList',
                            },

                            // 合格投资者认定-- 线上
                            {
                                name: 'identifyFlowOnline',
                                icon: 'contacts',
                                hideInMenu: true,
                                path: '/raisingInfo/processManagement/investorsProcessList/online/:identifyFlowId',
                                component: './processManagement/identify/online',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.identifyFlowOnline',
                            },

                            // 合格投资者认定流程 -- 线下
                            {
                                name: 'identifyFlowOffline',
                                icon: 'form',
                                hideInMenu: true,
                                path: '/raisingInfo/processManagement/investorsProcessList/offline/:identifyFlowId',
                                component: './processManagement/identify/offline',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.identifyFlowOffline',
                            },
                            //  交易签约
                            {
                                name: 'productProcessList',
                                path: '/raisingInfo/processManagement/productProcessList',
                                icon: 'form',
                                component: './processManagement/signingInfo/SigningList',
                                authority: [20200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.productProcessList',
                            },
                            // 认购
                            {
                                name: 'productProcessDetails',
                                path: '/raisingInfo/processManagement/productProcessList/productProcessDetails/:flowId',
                                hideInMenu: true,
                                component: './processManagement/signingInfo/SigningProcess',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.productProcessDetails',
                            },
                            // 申购
                            {
                                name: 'applyPurchase',
                                path: '/raisingInfo/processManagement/productProcessList/applyPurchase/:flowId',
                                hideInMenu: true,
                                component: './processManagement/signingInfo/ApplyPurchase',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.applyPurchase',
                            },

                            // 赎回
                            {
                                name: 'applyPurchase',
                                path: '/raisingInfo/processManagement/productProcessList/Redeming/:flowId',
                                hideInMenu: true,
                                component: './processManagement/signingInfo/redeming',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.applyPurchase',
                            },
                            // 单独签署协议
                            {
                                name: 'separateAgreementSign',
                                icon: 'contacts',
                                path: '/raisingInfo/separateAgreementSign',
                                component: './separateAgreementSign',
                                authority: [20300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.separateAgreementSign',
                            },
                            // 单独双录
                            {
                                name: 'doubleRecordSolo',
                                icon: 'form',
                                path: '/raisingInfo/doubleRecordSolo',
                                component: './doubleRecordSolo/list/index.tsx',
                                authority: [20400],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.doubleRecordSolo',
                            },
                            //  签署协议配置
                            {
                                name: 'list',
                                path: '/raisingInfo/template/templateList',
                                // hideInMenu: true,
                                component: './template/list',
                                authority: [60100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.list',
                            },
                            // 签署协议配置详情
                            {
                                name: 'detail',
                                path: '/raisingInfo/template/templateList/detail/:id',
                                hideInMenu: true,
                                component: './template/detail',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.detail',
                            },
                            //  双录话术配置
                            {
                                name: 'doubleRecordinglist',
                                path: '/raisingInfo/doubleRecordConfig',
                                component: './doubleRecordConfig/list',
                                authority: [60200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.doubleRecordinglist',
                            },
                            //  普通双录配置
                            {
                                name: 'generalDoubleDetails',
                                path: '/raisingInfo/doubleRecordConfig/generalDoubleDetails/:id',
                                hideInMenu: true,
                                component: './doubleRecordConfig/details/GeneralDoubleDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.generalDoubleDetails',
                            },
                            //  AI智能双录配置
                            {
                                name: 'aiMindDetails',
                                path: '/raisingInfo/doubleRecordConfig/aiMindDetails/:id',
                                hideInMenu: true,
                                component: './doubleRecordConfig/details/AIMindDetails',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.aiMindDetails',
                            },
                            // 合格投资者认定模板配置
                            {
                                name: 'identifyConfig',
                                icon: 'form',
                                // hideInMenu: false,
                                path: '/raisingInfo/identifyConfig',
                                component: './identifyConfig',
                                authority: [60300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.raisingInfo.identifyConfig',
                            },
                        ],
                    },

                    // 适当性管理
                    {
                        name: 'riskManager',
                        path: '/risk',
                        icon: 'form',
                        authority: [50000, 60300],
                        routes: [
                            // 合格投资者认定模板配置
                            {
                                name: 'identifyConfig',
                                icon: 'form',
                                // hideInMenu: false,
                                path: '/risk/identifyConfig',
                                component: './identifyConfig',
                                authority: [60300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.riskManager.identifyConfig',
                            },
                            // 风险测评问卷模板列表
                            {
                                name: 'templateList',
                                path: '/risk/templateList',
                                component: './risk/templateList',
                                authority: [50200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.riskManager.templateList',
                            },
                            // 分线测评问卷模板
                            {
                                name: 'template',
                                path: '/risk/templateList/template/:type/:id?',
                                component: './risk/template',
                                hideInMenu: true,
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.riskManager.template',
                            },
                            // // 投资者协会账号开通表
                            // {
                            //     name: 'situationChecklist',
                            //     path: '/risk/situationChecklist',
                            //     component: './risk/situationChecklist',
                            //     wrappers: [RouteWatcher],
                            //     tabLocalId: 'menu.riskManager.situationChecklist',
                            // },
                            // //  基协投资者账号自动导出
                            {
                                name: 'accountOpeningForm',
                                path: '/risk/accountOpeningForm',
                                component: './risk/accountOpeningForm',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.riskManager.accountOpeningForm',
                            },
                        ],
                    },

                    // 营销管理
                    {
                        name: 'consulte',
                        icon: 'form',
                        path: '/consulte',
                        authority: [80000],
                        routes: [
                            {
                                name: 'consulteQuestion',
                                path: '/consulte/question',
                                component: './consulte/question',
                                authority: [80100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.consulte.consulteQuestion',
                            },
                        ],
                    },

                    // 销售管理
                    // 渠道管理
                    {
                        name: 'channel',
                        path: '/channel',
                        icon: 'form',
                        authority: [42000],
                        routes: [
                            //  销售人员管理
                            // {
                            //     name: 'personManage',
                            //     path: '/channel/personManage',
                            //     component: './channel/personManage',
                            //     wrappers: [RouteWatcher],
                            //     tabLocalId: 'menu.channel.personManage',
                            // },
                            // //  客户归属管理
                            // {
                            //     name: 'customerManage',
                            //     path: '/channel/customerManage',
                            //     component: './channel/customerManage',
                            //     wrappers: [RouteWatcher],
                            //     tabLocalId: 'menu.channel.customerManage',
                            // },
                            //  销售管理
                            {
                                name: 'list',
                                path: '/channel/list',
                                component: './channel/list',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.channel.list',
                                authority: [42100],
                            },
                            // 渠道详情
                            {
                                name: 'detail',
                                path: '/channel/list/detail/:channelId',
                                component: './channel/detail',
                                hideInMenu: true,
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.channel.detail',
                            },
                            // 空缺编号查询
                            {
                                name: 'vacancyChannel',
                                path: '/channel/vacancyChannel',
                                component: './channel/vacancyChannel',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.channel.vacancyChannel',
                                authority: [42200],
                            },
                        ],
                    },

                    // 风险管理
                    {
                        path: '/riskManagement',
                        name: 'riskManagement',
                        icon: 'form',
                        authority: [30600],
                        routes: [
                            // 产品风控
                            {
                                name: 'RiskControl',
                                icon: 'form',
                                path: '/riskManagement/RiskControl',
                                component: './product/riskControl',
                                authority: [30600],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.product.RiskControl',
                            },
                        ],
                    },

                    // // 费用管理
                    // {
                    //     name: 'costManagement',
                    //     path: '/costManagement',
                    //     icon: 'contacts',
                    //     authority: [43000],
                    //     // 空缺编号查询
                    //     routes: [
                    //         {
                    //             name: 'dividedConfiguration',
                    //             path: '/costManagement/dividedConfiguration',
                    //             component: './costManagement/dividedConfiguration',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.dividedConfiguration',
                    //             authority: [43100],
                    //         },
                    //         // 新增(编辑)
                    //         {
                    //             name: 'dividedConfigurationEdit',
                    //             path: '/costManagement/dividedConfiguration/edit/:id',
                    //             // authority: ['admin'],
                    //             hideInMenu: true,
                    //             component: './costManagement/dividedConfiguration/edit',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.dividedConfigurationEdit',
                    //         },
                    //         {
                    //             name: 'transactionOwnership',
                    //             path: '/costManagement/transactionOwnership',
                    //             component: './costManagement/transactionOwnership',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.transactionOwnership',
                    //             authority: [43200],
                    //         },
                    //         // 新增(编辑)
                    //         {
                    //             name: 'transactionOwnershipEdit',
                    //             path: '/costManagement/transactionOwnership/edit/:id',
                    //             // authority: ['admin'],
                    //             hideInMenu: true,
                    //             component: './costManagement/transactionOwnership/edit',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.transactionOwnershipEdit',
                    //         },
                    //         {
                    //             name: 'productFee',
                    //             path: '/costManagement/productFee',
                    //             component: './costManagement/productFee',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.productFee',
                    //             authority: [43300],
                    //         },
                    //         // 明细测算
                    //         {
                    //             name: 'productFeeDetailEdit',
                    //             path: '/costManagement/productFee/detail/:id',
                    //             // authority: ['admin'],
                    //             hideInMenu: true,
                    //             component: './costManagement/productFee/detail',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.productFeeDetailEdit',
                    //         },
                    //         // 分成测算
                    //         {
                    //             name: 'productFeeDevideEdit',
                    //             path: '/costManagement/productFee/devide/:id',
                    //             // authority: ['admin'],
                    //             hideInMenu: true,
                    //             component: './costManagement/productFee/devide',
                    //             wrappers: [RouteWatcher],
                    //             tabLocalId: 'menu.costManagement.productFeeDevideEdit',
                    //         },
                    //     ],
                    // },

                    // 打新工具
                    {
                        name: 'staggingTool',
                        icon: 'edit',
                        path: '/staggingTool',
                        authority: [70000],
                        routes: [
                            // 打新首页
                            {
                                name: 'overView',
                                path: '/staggingTool/overView',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.staggingTool.overView',
                            },
                            // 标的详情
                            {
                                name: 'stockDetail',
                                path: '/staggingTool/overView/stock/:id',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                hideInMenu: true,
                                tabLocalId: 'menu.staggingTool.stockDetail',
                            },
                            // 打新参数维护
                            {
                                name: 'maintain',
                                path: '/staggingTool/maintain',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.staggingTool.maintain',
                            },
                            // 管理人信息维护
                            {
                                name: 'manager',
                                path: '/staggingTool/manager',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                hideInMenu: true,
                                tabLocalId: 'menu.staggingTool.manager',
                            },
                            // 承销商用户名和密码维护
                            {
                                name: 'underwriter',
                                path: '/staggingTool/underwriter',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                hideInMenu: true,
                                tabLocalId: 'menu.staggingTool.underwriter',
                            },
                            // 配售对象(基金产品)信息维护
                            {
                                name: 'product',
                                path: '/staggingTool/product',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                hideInMenu: true,
                                tabLocalId: 'menu.staggingTool.product',
                            },
                            // 配售对象(基金产品)详情
                            {
                                name: 'productDetail',
                                path: '/staggingTool/product/detail/:id',
                                authority: [70100],
                                microApp: 'mackNew',
                                microAppProps: {
                                    base: BASE_PATH.baseUrl,
                                    autoSetLoading: true,
                                },
                                wrappers: [RouteWatcher],
                                hideInMenu: true,
                                tabLocalId: 'menu.staggingTool.productDetail',
                            },
                        ],
                    },

                    // 易报表
                    {
                        path: '/reportCenter',
                        icon: 'InboxOutlined',
                        name: 'reportCenter',
                        authority: [90000],
                        routes: [
                            // 数据指标报表
                            // {
                            //     path: '/reportCenter/customMetricsList',
                            //     name: 'createModuleList',
                            //     // hideInMenu: true,
                            //     component: './customMetrics/index.tsx',
                            //     authority: [90100]
                            // },
                            //报表管理
                            {
                                name: 'reportManager',
                                path: '/reportCenter/reportManager',
                                component: './outsideLink/index',
                                hideInMenu: true,
                                authority: [90120],
                            },

                            // 报告库
                            {
                                name: 'reportCenterLibrary',
                                path: '/reportCenter/library',
                                component: './reportCenter/library/index',
                                authority: [90120],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.reportCenter.reportCenterLibrary',
                            },

                            {
                                name: 'reportCenterLibraryList',
                                path: '/reportCenter/library/list',
                                hideInMenu: true,
                                component: './reportCenter/library/list/index',
                                // authority: [90200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.reportCenter.reportCenterLibraryList',
                            },
                            {
                                name: 'reportCenterLibraryListGenerateReport',
                                path: '/reportCenter/library/list/generateReport',
                                hideInMenu: true,
                                component: './reportCenter/library/generateReport',
                                // authority: [90200],
                                wrappers: [RouteWatcher],
                                tabLocalId:
                                    'menu.reportCenter.reportCenterLibraryListGenerateReport',
                            },
                            // 下载记录
                            {
                                name: 'reportCenterLibraryListDownRecord',
                                path: '/reportCenter/library/list/downRecord',
                                hideInMenu: true,
                                component: './reportCenter/library/downRecord',
                                // authority: [90200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.reportCenter.reportCenterLibraryListDownRecord',
                            },
                            // {
                            //     name: 'reportCenterLibraryListGenerateReportMonth',
                            //     path: '/reportCenter/library/month',
                            //     hideInMenu: true,
                            //     component: './reportCenter/library/generateReport/month',
                            //     authority: [90200],
                            // },
                            // 内部管理表
                            {
                                name: 'reportCenterInternalManagement',
                                path: '/reportCenter/internalManagement',
                                component: './reportCenter/internalManagement/index',
                                authority: [90130],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.reportCenter.reportCenterInternalManagement',
                            },
                            // 数据指标
                            // {
                            //     path: '/reportCenter/createReportForm/customMetricsList',
                            //     name: 'createModuleList',
                            //     // hideInMenu: true,
                            //     component: './customMetrics/index.tsx',
                            //     authority: [90100],
                            //     wrappers: [RouteWatcher],
                            //     tabLocalId: 'menu.createReportForm.createModuleList',
                            // },
                            // 数据管理
                            {
                                name: 'dataManager',
                                path: '/reportCenter/dataManager',
                                component: './reportCenter/dataManager/index',
                                authority: [90110],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.reportCenter.dataManager',
                            },
                        ],
                    },

                    // 估值表解析
                    {
                        path: '/valuationAnalysis',
                        icon: 'contacts',
                        name: 'valuationAnalysis',
                        authority: [100000],
                        routes: [
                            // 估值表查询
                            {
                                name: 'valuationQuery',
                                path: '/valuationAnalysis/valuationQuery',
                                component: './valuationAnalysis/valuationQuery/index',
                                authority: [100100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.valuationAnalysis.valuationQuery',
                            },
                            {
                                name: 'valuationQueryValuationDetail',
                                path: '/valuationAnalysis/valuationQuery/valuationDetail',
                                component:
                                    './valuationAnalysis/valuationQuery/valuationDetail/index',
                                // authority: [90200],
                                hideInMenu: true,
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.valuationAnalysis.valuationQueryValuationDetail',
                            },
                            // 科目查询
                            {
                                name: 'subjectQuery',
                                path: '/valuationAnalysis/subjectQuery',
                                component: './valuationAnalysis/subjectQuery/index',
                                authority: [100200],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.valuationAnalysis.subjectQuery',
                            },
                            // 数据源配置
                            {
                                name: 'dataSourceQuery',
                                path: '/valuationAnalysis/dataSourceQuery',
                                component: './valuationAnalysis/dataSourceQuery/index',
                                authority: [100300],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.valuationAnalysis.dataSourceQuery',
                            },
                            // 新增(编辑)
                            {
                                name: 'edit',
                                path: '/valuationAnalysis/dataSourceQuery/edit/:id',
                                // authority: ['admin'],
                                hideInMenu: true,
                                component: './valuationAnalysis/dataSourceQuery/edit',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.valuationAnalysis.edit',
                            },
                        ],
                    },

                    // 工作流管理

                    {
                        name: 'productLifeCycle',
                        icon: 'contacts',
                        path: '/productLifeCycleInfo',
                        authority: [40000],
                        routes: [
                            // 流程管理
                            {
                                path: '/productLifeCycleInfo/list',
                                name: 'productLifeCycleList',
                                component: './productLifeCycle/productLifeCycleInfoList',
                                authority: [40100],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.productLifeCycleList',
                            },
                            // 流程详情
                            {
                                path: '/productLifeCycleInfo/list/processDetails/:processId',
                                name: 'productLifeCycleInfoDetail',
                                hideInMenu: true,
                                component: './productLifeCycle/productLifeCycleInfoDetail',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.productLifeCycleInfoDetail',
                            },

                            // 节点管理
                            // {
                            //     path: '/productLifeCycleInfo/nodeManagement',
                            //     name: 'nodeManagement',
                            //     component: './productLifeCycle/nodeManagement',
                            //     // authority: [520],
                            // },
                            // 快递信息
                            {
                                path: '/productLifeCycleInfo/expressInformation',
                                name: 'expressInformation',
                                component: './productLifeCycle/expressInformation',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.expressInformation',
                                authority: [40150],
                            },
                            // // 共享文件
                            // {
                            //     path: '/productLifeCycleInfo/shareFiles',
                            //     name: 'shareFiles',
                            //     component: './productLifeCycle/shareFiles',
                            //     authority: [40300],
                            // },

                            //网盘中心
                            {
                                path: '/productLifeCycleInfo/diskCenter',
                                name: 'diskCenter',
                                component: './productLifeCycle/diskCenter',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.diskCenter',
                                authority: [40200],
                            },

                            // 模板管理
                            {
                                path: '/productLifeCycleInfo/productLifeCycleInfoTemplate',
                                name: 'productLifeCycleInfoTemplate',
                                component: './productLifeCycle/productLifeCycleInfoTemplate',
                                authority: [40400],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.productLifeCycleInfoTemplate',
                            },
                            // 新建模板
                            {
                                path: '/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/:templateId',
                                name: 'newProductLifeCycleInfoTemplate',
                                component: './productLifeCycle/newProductLifeCycleInfoTemplate',
                                hideInMenu: true,
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.productLifeCycle.newProductLifeCycleInfoTemplate',
                                // authority: [520],
                            },
                        ],
                    },

                    //  回访单设置
                    // {
                    //     name: 'returnVisit',
                    //     icon: 'edit',
                    //     path: '/returnVisit',
                    //     // authority: [130000],
                    //     routes: [
                    //         {
                    //             name: 'list',
                    //             path: '/returnVisit/list',
                    //             // authority: [130100],
                    //             component: './returnVisit/list',
                    //         },
                    //         {
                    //             name: 'templateList',
                    //             path: '/returnVisit/templateList',
                    //             // authority: [130100],
                    //             component: './returnVisit/templateList',
                    //         },
                    //         // 角色权限
                    //         {
                    //             name: 'template',
                    //             path: '/returnVisit/template/:type/:id?',
                    //             // authority: [130200],
                    //             // hideInMenu: true,
                    //             component: './returnVisit/template',
                    //         },
                    //     ],
                    // },

                    //  系统管理
                    {
                        name: 'settings',
                        icon: 'edit',
                        path: '/settings',
                        authority: [120000],
                        routes: [
                            {
                                name: 'account',
                                path: '/settings/account',
                                authority: [121000],
                                routes: [
                                    //  账号列表
                                    {
                                        name: 'list',
                                        path: '/settings/account',
                                        authority: [121000],
                                        hideInMenu: true,
                                        component: './accountSettings/account/list',
                                        wrappers: [RouteWatcher],
                                        tabLocalId: 'menu.settings.account.list',
                                    },
                                    // 新增(编辑) 账号
                                    {
                                        name: 'edit',
                                        path: '/settings/account/edit/:account',
                                        // authority: ['admin'],
                                        hideInMenu: true,
                                        component: './accountSettings/account/edit',
                                        wrappers: [RouteWatcher],
                                        tabLocalId: 'menu.settings.account.edit',
                                    },
                                ],
                            },
                            // 角色权限
                            {
                                name: 'authority',
                                path: '/settings/authority',
                                authority: [122000],
                                // hideInMenu: true,
                                component: './accountSettings/authority',
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.settings.authority',
                            },
                            // 公司设置
                            {
                                name: 'companySetting',
                                path: '/settings/company',
                                component: './accountSettings/company',
                                authority: [123000],
                                wrappers: [RouteWatcher],
                                tabLocalId: 'menu.settings.companySetting',
                            },
                        ],
                    },

                    {
                        name: 'exception',
                        icon: 'warning',
                        hideInMenu: true,
                        path: '/exception',
                        routes: [
                            {
                                name: '403',
                                icon: 'smile',
                                path: '/exception/403',
                                component: './exception/403',
                            },
                            {
                                name: 'invalid',
                                icon: 'smile',
                                path: '/exception/invalid',
                                component: './exception/invalid',
                            },
                            {
                                name: 'noJurisdiction',
                                icon: 'smile',
                                path: '/exception/noJurisdiction',
                                component: './exception/noJurisdiction',
                            },
                            {
                                name: '500',
                                icon: 'smile',
                                path: '/exception/500',
                                component: './exception/500',
                            },
                        ],
                    },
                    {
                        component: '404',
                    },
                ],
            },
        ],
    },
];
