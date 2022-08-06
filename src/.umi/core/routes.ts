// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from 'E:/公司代码/MRP报表/vip-manager/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@/components/PageLoading/index';

export function getRoutes() {
  const routes = [
  {
    "path": "/user",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__UserLayout' */'E:/公司代码/MRP报表/vip-manager/src/layouts/UserLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "name": "login",
        "icon": "smile",
        "path": "/user/login",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__login' */'E:/公司代码/MRP报表/vip-manager/src/pages/login'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'E:/公司代码/MRP报表/vip-manager/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__SecurityLayout' */'E:/公司代码/MRP报表/vip-manager/src/layouts/SecurityLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'layouts__BasicLayout' */'E:/公司代码/MRP报表/vip-manager/src/layouts/BasicLayout'), loading: LoadingComponent}),
        "routes": [
          {
            "path": "/",
            "redirect": "/panel",
            "exact": true
          },
          {
            "path": "/panel",
            "name": "panel",
            "icon": "dashboard",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__panel' */'E:/公司代码/MRP报表/vip-manager/src/pages/panel'), loading: LoadingComponent}),
            "tabLocalId": "menu.panel",
            "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
            "exact": true
          },
          {
            "path": "/businessAnalysis",
            "name": "businessAnalysis",
            "icon": "UserOutlined",
            "authority": [
              41000
            ],
            "routes": [
              {
                "name": "operate",
                "path": "/businessAnalysis/operateManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__businessAnalysis__operateManager' */'E:/公司代码/MRP报表/vip-manager/src/pages/businessAnalysis/operateManager'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.businessAnalysis.operate",
                "authority": [
                  41200
                ],
                "exact": true
              },
              {
                "name": "invest",
                "path": "/businessAnalysis/investManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__businessAnalysis__investManager' */'E:/公司代码/MRP报表/vip-manager/src/pages/businessAnalysis/investManager'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.businessAnalysis.invest",
                "authority": [
                  41300
                ],
                "exact": true
              },
              {
                "name": "market",
                "path": "/businessAnalysis/marketManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__businessAnalysis__marketManager' */'E:/公司代码/MRP报表/vip-manager/src/pages/businessAnalysis/marketManager'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.businessAnalysis.market",
                "authority": [
                  41400
                ],
                "exact": true
              }
            ]
          },
          {
            "path": "/product",
            "icon": "InboxOutlined",
            "name": "product",
            "authority": [
              30000
            ],
            "routes": [
              {
                "name": "productList",
                "icon": "form",
                "path": "/product/list/:timestamp?",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/list'), loading: LoadingComponent}),
                "authority": [
                  30100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product",
                "exact": true
              },
              {
                "name": "productDetails",
                "icon": "form",
                "path": "/product/list/details/:productId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__details' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/details'), loading: LoadingComponent}),
                "authority": [
                  30101
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.productDetails",
                "hideInMenu": true,
                "exact": true
              },
              {
                "name": "templateDetails",
                "path": "/product/list/details/:productId/template/:id",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__templateDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/templateDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.templateDetails",
                "exact": true
              },
              {
                "name": "signDetails",
                "path": "/product/list/details/:productId/signDetails/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__signDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/signDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.signDetails",
                "exact": true
              },
              {
                "name": "applyDetails",
                "path": "/product/list/details/:productId/applyDetails/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__applyDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/applyDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.applyDetails",
                "exact": true
              },
              {
                "name": "productConfig",
                "icon": "form",
                "path": "/product/productConfig",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__productConfig' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/productConfig'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.productConfig",
                "authority": [
                  30700
                ],
                "exact": true
              },
              {
                "name": "netValueData",
                "icon": "form",
                "path": "/product/netValueData",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__netValueData' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/netValueData'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.netValueData",
                "authority": [
                  30200
                ],
                "exact": true
              },
              {
                "name": "openDay",
                "icon": "form",
                "path": "/product/openDay",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__openDay' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/openDay'), loading: LoadingComponent}),
                "authority": [
                  30300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.openDay",
                "exact": true
              },
              {
                "name": "quantitativeFund",
                "icon": "form",
                "path": "/product/quantitativeFund",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__quantitativeFund' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/quantitativeFund'), loading: LoadingComponent}),
                "authority": [
                  30800
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.quantitativeFund",
                "exact": true
              }
            ]
          },
          {
            "path": "/infoDisclosure",
            "name": "infoDisclosure",
            "icon": "form",
            "authority": [
              30300,
              30400,
              75000
            ],
            "routes": [
              {
                "name": "noticeFile",
                "icon": "form",
                "path": "/infoDisclosure/notice/file",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__noticeFile' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/noticeFile'), loading: LoadingComponent}),
                "authority": [
                  30300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.noticeFile",
                "exact": true
              },
              {
                "name": "confirmAnnouncementSettings",
                "icon": "form",
                "path": "/infoDisclosure/confirmAnnouncementSettings",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__informationDisclosure__confirmAnnouncementSettings' */'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/confirmAnnouncementSettings'), loading: LoadingComponent}),
                "authority": [
                  30400
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.confirmAnnouncementSettings",
                "exact": true
              },
              {
                "name": "confirmationDocument",
                "icon": "form",
                "path": "/infoDisclosure/confirmAnnouncementSettings/confirmationDocument/:id",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__informationDisclosure__confirmAnnouncementSettings__confirmationDocument' */'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/confirmAnnouncementSettings/confirmationDocument'), loading: LoadingComponent}),
                "authority": [
                  80100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.confirmationDocument",
                "hideInMenu": true,
                "exact": true
              },
              {
                "name": "informationDisclosure",
                "icon": "form",
                "path": "/infoDisclosure/informationDisclosure/infoList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__informationDisclosure' */'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure'), loading: LoadingComponent}),
                "authority": [
                  30400
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.informationDisclosure",
                "exact": true
              },
              {
                "path": "/infoDisclosure/saleService",
                "name": "noticeList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__marketServices__SaleService__Notice__List' */'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/List'), loading: LoadingComponent}),
                "authority": [
                  75000
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.noticeList",
                "exact": true
              },
              {
                "path": "/infoDisclosure/saleService/template/:templateCode/:type?",
                "name": "createModule",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__marketServices__SaleService__Notice__Template' */'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/Template'), loading: LoadingComponent}),
                "authority": [
                  75000
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.createModule",
                "exact": true
              },
              {
                "path": "/infoDisclosure/setting",
                "name": "setting",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__informationDisclosure__setting' */'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/setting'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.infoDisclosure.setting",
                "exact": true
              }
            ]
          },
          {
            "name": "investor",
            "icon": "UserOutlined",
            "path": "/investor",
            "authority": [
              10000
            ],
            "routes": [
              {
                "name": "list",
                "path": "/investor/customerInfo/:timestamp?",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__customerInfo' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerInfo'), loading: LoadingComponent}),
                "authority": [
                  10100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.list",
                "exact": true
              },
              {
                "name": "realName",
                "path": "/investor/realName",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__realName' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/realName'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.realName",
                "exact": true
              },
              {
                "name": "InvestorDetails",
                "path": "/investor/customerInfo/investordetails/:customerId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__InvestorDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.InvestorDetails",
                "authority": [
                  10101
                ],
                "exact": true
              },
              {
                "name": "bankCardInfo",
                "path": "/investor/bankCardInfo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__BankCardInfo' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/BankCardInfo'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "authority": [
                  10200
                ],
                "tabLocalId": "menu.investor.bankCardInfo",
                "exact": true
              },
              {
                "name": "assetsProve",
                "path": "/investor/assetsProve",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__AssetsProve' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/AssetsProve'), loading: LoadingComponent}),
                "authority": [
                  11000
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.assetsProve",
                "exact": true
              },
              {
                "name": "shareInfo",
                "icon": "form",
                "path": "/investor/shareInfoAdmin/share/shareInfo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__share__shareInfo' */'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareInfo'), loading: LoadingComponent}),
                "authority": [
                  10700
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.shareInfo",
                "exact": true
              },
              {
                "name": "risklist",
                "path": "/investor/risk/list",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/risk/list'), loading: LoadingComponent}),
                "authority": [
                  50100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.riskManager.list",
                "exact": true
              },
              {
                "name": "investorsProcessList",
                "icon": "contacts",
                "path": "/investor/processManagement/investorsProcessList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/list'), loading: LoadingComponent}),
                "authority": [
                  20100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.investorsProcessList",
                "exact": true
              },
              {
                "name": "customerSignDetails",
                "path": "/investor/customerInfo/investordetails/:customerId/CustomerSignDetails/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__InvestorDetails__components__customerSignDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/components/customerSignDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.customerSignDetails",
                "exact": true
              },
              {
                "name": "customerSignDetails",
                "path": "/investor/customerInfo/investordetails/:customerId/customerApplyDetails/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__InvestorDetails__components__customerApplyDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/components/customerApplyDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.customerSignDetails",
                "exact": true
              },
              {
                "name": "customerManager",
                "path": "/investor/customerManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__investor__customerManager' */'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerManager'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "authority": [
                  10200
                ],
                "tabLocalId": "menu.investor.customerManager",
                "exact": true
              }
            ]
          },
          {
            "path": "/operation",
            "icon": "contacts",
            "name": "operation",
            "authority": [
              20100,
              10300,
              10400,
              10500,
              10600,
              10900
            ],
            "routes": [
              {
                "name": "investorsProcessList",
                "icon": "contacts",
                "path": "/operation/processManagement/investorsProcessList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/list'), loading: LoadingComponent}),
                "authority": [
                  20100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.investorsProcessList",
                "exact": true
              },
              {
                "name": "identifyFlowOnline",
                "icon": "contacts",
                "hideInMenu": true,
                "path": "/operation/processManagement/investorsProcessList/online/:identifyFlowId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__online' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/online'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.identifyFlowOnline",
                "exact": true
              },
              {
                "name": "identifyFlowOffline",
                "icon": "form",
                "hideInMenu": true,
                "path": "/operation/processManagement/investorsProcessList/offline/:identifyFlowId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__offline' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/offline'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.identifyFlowOffline",
                "exact": true
              },
              {
                "name": "RunningList",
                "icon": "strikethrough",
                "path": "/operation/transactionInfo/RunningList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__transactionInfo__RunningList' */'E:/公司代码/MRP报表/vip-manager/src/pages/transactionInfo/RunningList'), loading: LoadingComponent}),
                "authority": [
                  10300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.operation.RunningList",
                "exact": true
              },
              {
                "name": "OrderList",
                "path": "/operation/transactionInfo/OrderList",
                "icon": "container",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__transactionInfo__OrderList' */'E:/公司代码/MRP报表/vip-manager/src/pages/transactionInfo/OrderList'), loading: LoadingComponent}),
                "authority": [
                  10400
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.operation.OrderList",
                "exact": true
              },
              {
                "name": "TransactionList",
                "path": "/operation/transactionInfo/TransactionList/:timestamp?",
                "icon": "database",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__transactionInfo__TransactionList' */'E:/公司代码/MRP报表/vip-manager/src/pages/transactionInfo/TransactionList'), loading: LoadingComponent}),
                "authority": [
                  10500
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.operation.TransactionList",
                "exact": true
              },
              {
                "name": "dividends",
                "path": "/operation/dividends",
                "icon": "pie-chart",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__dividends__dividendsList' */'E:/公司代码/MRP报表/vip-manager/src/pages/dividends/dividendsList'), loading: LoadingComponent}),
                "authority": [
                  10600
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.operation.dividends",
                "exact": true
              },
              {
                "name": "shareInfo",
                "icon": "form",
                "path": "/operation/shareInfoAdmin/share/shareInfo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__share__shareInfo' */'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareInfo'), loading: LoadingComponent}),
                "authority": [
                  10700
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.investor.shareInfo",
                "exact": true
              },
              {
                "name": "shareConfirmation",
                "icon": "form",
                "path": "/operation/shareInfoAdmin/share/shareConfirmation",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__share__shareConfirmation' */'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation'), loading: LoadingComponent}),
                "authority": [
                  10900
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.operation.shareConfirmation",
                "exact": true
              }
            ]
          },
          {
            "path": "/raisingInfo",
            "icon": "strikethrough",
            "name": "raisingInfo",
            "authority": [
              20000,
              30500,
              20100,
              20200,
              20300,
              20400,
              60100,
              60200,
              60300
            ],
            "routes": [
              {
                "name": "reservation",
                "icon": "form",
                "path": "/raisingInfo/reservation",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__reservation' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/reservation'), loading: LoadingComponent}),
                "authority": [
                  30500
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.reservation",
                "exact": true
              },
              {
                "name": "investorsProcessList",
                "icon": "contacts",
                "path": "/raisingInfo/processManagement/investorsProcessList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/list'), loading: LoadingComponent}),
                "authority": [
                  20100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.investorsProcessList",
                "exact": true
              },
              {
                "name": "identifyFlowOnline",
                "icon": "contacts",
                "hideInMenu": true,
                "path": "/raisingInfo/processManagement/investorsProcessList/online/:identifyFlowId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__online' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/online'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.identifyFlowOnline",
                "exact": true
              },
              {
                "name": "identifyFlowOffline",
                "icon": "form",
                "hideInMenu": true,
                "path": "/raisingInfo/processManagement/investorsProcessList/offline/:identifyFlowId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__identify__offline' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/offline'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.identifyFlowOffline",
                "exact": true
              },
              {
                "name": "productProcessList",
                "path": "/raisingInfo/processManagement/productProcessList",
                "icon": "form",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__signingInfo__SigningList' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/signingInfo/SigningList'), loading: LoadingComponent}),
                "authority": [
                  20200
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.productProcessList",
                "exact": true
              },
              {
                "name": "productProcessDetails",
                "path": "/raisingInfo/processManagement/productProcessList/productProcessDetails/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__signingInfo__SigningProcess' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/signingInfo/SigningProcess'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.productProcessDetails",
                "exact": true
              },
              {
                "name": "applyPurchase",
                "path": "/raisingInfo/processManagement/productProcessList/applyPurchase/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__signingInfo__ApplyPurchase' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/signingInfo/ApplyPurchase'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.applyPurchase",
                "exact": true
              },
              {
                "name": "applyPurchase",
                "path": "/raisingInfo/processManagement/productProcessList/Redeming/:flowId",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__processManagement__signingInfo__redeming' */'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/signingInfo/redeming'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.applyPurchase",
                "exact": true
              },
              {
                "name": "separateAgreementSign",
                "icon": "contacts",
                "path": "/raisingInfo/separateAgreementSign",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__separateAgreementSign' */'E:/公司代码/MRP报表/vip-manager/src/pages/separateAgreementSign'), loading: LoadingComponent}),
                "authority": [
                  20300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.separateAgreementSign",
                "exact": true
              },
              {
                "name": "doubleRecordSolo",
                "icon": "form",
                "path": "/raisingInfo/doubleRecordSolo",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__doubleRecordSolo__list__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordSolo/list/index.tsx'), loading: LoadingComponent}),
                "authority": [
                  20400
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.doubleRecordSolo",
                "exact": true
              },
              {
                "name": "list",
                "path": "/raisingInfo/template/templateList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__template__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/template/list'), loading: LoadingComponent}),
                "authority": [
                  60100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.list",
                "exact": true
              },
              {
                "name": "detail",
                "path": "/raisingInfo/template/templateList/detail/:id",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__template__detail' */'E:/公司代码/MRP报表/vip-manager/src/pages/template/detail'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.detail",
                "exact": true
              },
              {
                "name": "doubleRecordinglist",
                "path": "/raisingInfo/doubleRecordConfig",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__doubleRecordConfig__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordConfig/list'), loading: LoadingComponent}),
                "authority": [
                  60200
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.doubleRecordinglist",
                "exact": true
              },
              {
                "name": "generalDoubleDetails",
                "path": "/raisingInfo/doubleRecordConfig/generalDoubleDetails/:id",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__doubleRecordConfig__details__GeneralDoubleDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordConfig/details/GeneralDoubleDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.generalDoubleDetails",
                "exact": true
              },
              {
                "name": "aiMindDetails",
                "path": "/raisingInfo/doubleRecordConfig/aiMindDetails/:id",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__doubleRecordConfig__details__AIMindDetails' */'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordConfig/details/AIMindDetails'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.aiMindDetails",
                "exact": true
              },
              {
                "name": "identifyConfig",
                "icon": "form",
                "path": "/raisingInfo/identifyConfig",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__identifyConfig' */'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig'), loading: LoadingComponent}),
                "authority": [
                  60300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.raisingInfo.identifyConfig",
                "exact": true
              }
            ]
          },
          {
            "name": "riskManager",
            "path": "/risk",
            "icon": "form",
            "authority": [
              50000,
              60300
            ],
            "routes": [
              {
                "name": "identifyConfig",
                "icon": "form",
                "path": "/risk/identifyConfig",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__identifyConfig' */'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig'), loading: LoadingComponent}),
                "authority": [
                  60300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.riskManager.identifyConfig",
                "exact": true
              },
              {
                "name": "templateList",
                "path": "/risk/templateList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk__templateList' */'E:/公司代码/MRP报表/vip-manager/src/pages/risk/templateList'), loading: LoadingComponent}),
                "authority": [
                  50200
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.riskManager.templateList",
                "exact": true
              },
              {
                "name": "template",
                "path": "/risk/templateList/template/:type/:id?",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk__template' */'E:/公司代码/MRP报表/vip-manager/src/pages/risk/template'), loading: LoadingComponent}),
                "hideInMenu": true,
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.riskManager.template",
                "exact": true
              },
              {
                "name": "accountOpeningForm",
                "path": "/risk/accountOpeningForm",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__risk__accountOpeningForm' */'E:/公司代码/MRP报表/vip-manager/src/pages/risk/accountOpeningForm'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.riskManager.accountOpeningForm",
                "exact": true
              }
            ]
          },
          {
            "name": "consulte",
            "icon": "form",
            "path": "/consulte",
            "authority": [
              80000
            ],
            "routes": [
              {
                "name": "consulteQuestion",
                "path": "/consulte/question",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__consulte__question' */'E:/公司代码/MRP报表/vip-manager/src/pages/consulte/question'), loading: LoadingComponent}),
                "authority": [
                  80100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.consulte.consulteQuestion",
                "exact": true
              }
            ]
          },
          {
            "name": "channel",
            "path": "/channel",
            "icon": "form",
            "authority": [
              42000
            ],
            "routes": [
              {
                "name": "list",
                "path": "/channel/list",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__channel__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/channel/list'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.channel.list",
                "authority": [
                  42100
                ],
                "exact": true
              },
              {
                "name": "detail",
                "path": "/channel/list/detail/:channelId",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__channel__detail' */'E:/公司代码/MRP报表/vip-manager/src/pages/channel/detail'), loading: LoadingComponent}),
                "hideInMenu": true,
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.channel.detail",
                "exact": true
              },
              {
                "name": "vacancyChannel",
                "path": "/channel/vacancyChannel",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__channel__vacancyChannel' */'E:/公司代码/MRP报表/vip-manager/src/pages/channel/vacancyChannel'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.channel.vacancyChannel",
                "authority": [
                  42200
                ],
                "exact": true
              }
            ]
          },
          {
            "path": "/riskManagement",
            "name": "riskManagement",
            "icon": "form",
            "authority": [
              30600
            ],
            "routes": [
              {
                "name": "RiskControl",
                "icon": "form",
                "path": "/riskManagement/RiskControl",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__product__riskControl' */'E:/公司代码/MRP报表/vip-manager/src/pages/product/riskControl'), loading: LoadingComponent}),
                "authority": [
                  30600
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.product.RiskControl",
                "exact": true
              }
            ]
          },
          {
            "name": "staggingTool",
            "icon": "edit",
            "path": "/staggingTool",
            "authority": [
              70000
            ],
            "routes": [
              {
                "name": "overView",
                "path": "/staggingTool/overView",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.staggingTool.overView",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "stockDetail",
                "path": "/staggingTool/overView/stock/:id",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "hideInMenu": true,
                "tabLocalId": "menu.staggingTool.stockDetail",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "maintain",
                "path": "/staggingTool/maintain",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.staggingTool.maintain",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "manager",
                "path": "/staggingTool/manager",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "hideInMenu": true,
                "tabLocalId": "menu.staggingTool.manager",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "underwriter",
                "path": "/staggingTool/underwriter",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "hideInMenu": true,
                "tabLocalId": "menu.staggingTool.underwriter",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "product",
                "path": "/staggingTool/product",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "hideInMenu": true,
                "tabLocalId": "menu.staggingTool.product",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              },
              {
                "name": "productDetail",
                "path": "/staggingTool/product/detail/:id",
                "authority": [
                  70100
                ],
                "microApp": "mackNew",
                "microAppProps": {
                  "base": "/vipmanager/",
                  "autoSetLoading": true
                },
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "hideInMenu": true,
                "tabLocalId": "menu.staggingTool.productDetail",
                "exact": false,
                "component": (() => {
          const { getMicroAppRouteComponent } = umiExports;
          return getMicroAppRouteComponent({ appName: 'mackNew', base: '/vipmanager/', masterHistoryType: 'browser', routeProps: {'settings':{},'base':'/vipmanager/','autoSetLoading':true} })
        })()
              }
            ]
          },
          {
            "path": "/reportCenter",
            "icon": "InboxOutlined",
            "name": "reportCenter",
            "authority": [
              90000
            ],
            "routes": [
              {
                "name": "reportManager",
                "path": "/reportCenter/reportManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__outsideLink__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/outsideLink/index'), loading: LoadingComponent}),
                "hideInMenu": true,
                "authority": [
                  90120
                ],
                "exact": true
              },
              {
                "name": "reportCenterLibrary",
                "path": "/reportCenter/library",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__library__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/library/index'), loading: LoadingComponent}),
                "authority": [
                  90120
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.reportCenterLibrary",
                "exact": true
              },
              {
                "name": "reportCenterLibraryList",
                "path": "/reportCenter/library/list",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__library__list__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/library/list/index'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.reportCenterLibraryList",
                "exact": true
              },
              {
                "name": "reportCenterLibraryListGenerateReport",
                "path": "/reportCenter/library/list/generateReport",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__library__generateReport' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/library/generateReport'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.reportCenterLibraryListGenerateReport",
                "exact": true
              },
              {
                "name": "reportCenterLibraryListDownRecord",
                "path": "/reportCenter/library/list/downRecord",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__library__downRecord' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/library/downRecord'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.reportCenterLibraryListDownRecord",
                "exact": true
              },
              {
                "name": "reportCenterInternalManagement",
                "path": "/reportCenter/internalManagement",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__internalManagement__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/internalManagement/index'), loading: LoadingComponent}),
                "authority": [
                  90130
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.reportCenterInternalManagement",
                "exact": true
              },
              {
                "name": "dataManager",
                "path": "/reportCenter/dataManager",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__reportCenter__dataManager__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/reportCenter/dataManager/index'), loading: LoadingComponent}),
                "authority": [
                  90110
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.reportCenter.dataManager",
                "exact": true
              }
            ]
          },
          {
            "path": "/valuationAnalysis",
            "icon": "contacts",
            "name": "valuationAnalysis",
            "authority": [
              100000
            ],
            "routes": [
              {
                "name": "valuationQuery",
                "path": "/valuationAnalysis/valuationQuery",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__valuationAnalysis__valuationQuery__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/valuationAnalysis/valuationQuery/index'), loading: LoadingComponent}),
                "authority": [
                  100100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.valuationAnalysis.valuationQuery",
                "exact": true
              },
              {
                "name": "valuationQueryValuationDetail",
                "path": "/valuationAnalysis/valuationQuery/valuationDetail",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__valuationAnalysis__valuationQuery__valuationDetail__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/valuationAnalysis/valuationQuery/valuationDetail/index'), loading: LoadingComponent}),
                "hideInMenu": true,
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.valuationAnalysis.valuationQueryValuationDetail",
                "exact": true
              },
              {
                "name": "subjectQuery",
                "path": "/valuationAnalysis/subjectQuery",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__valuationAnalysis__subjectQuery__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/valuationAnalysis/subjectQuery/index'), loading: LoadingComponent}),
                "authority": [
                  100200
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.valuationAnalysis.subjectQuery",
                "exact": true
              },
              {
                "name": "dataSourceQuery",
                "path": "/valuationAnalysis/dataSourceQuery",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__valuationAnalysis__dataSourceQuery__index' */'E:/公司代码/MRP报表/vip-manager/src/pages/valuationAnalysis/dataSourceQuery/index'), loading: LoadingComponent}),
                "authority": [
                  100300
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.valuationAnalysis.dataSourceQuery",
                "exact": true
              },
              {
                "name": "edit",
                "path": "/valuationAnalysis/dataSourceQuery/edit/:id",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__valuationAnalysis__dataSourceQuery__edit' */'E:/公司代码/MRP报表/vip-manager/src/pages/valuationAnalysis/dataSourceQuery/edit'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.valuationAnalysis.edit",
                "exact": true
              }
            ]
          },
          {
            "name": "productLifeCycle",
            "icon": "contacts",
            "path": "/productLifeCycleInfo",
            "authority": [
              40000
            ],
            "routes": [
              {
                "path": "/productLifeCycleInfo/list",
                "name": "productLifeCycleList",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__productLifeCycleInfoList' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoList'), loading: LoadingComponent}),
                "authority": [
                  40100
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.productLifeCycleList",
                "exact": true
              },
              {
                "path": "/productLifeCycleInfo/list/processDetails/:processId",
                "name": "productLifeCycleInfoDetail",
                "hideInMenu": true,
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__productLifeCycleInfoDetail' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoDetail'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.productLifeCycleInfoDetail",
                "exact": true
              },
              {
                "path": "/productLifeCycleInfo/expressInformation",
                "name": "expressInformation",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__expressInformation' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/expressInformation'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.expressInformation",
                "authority": [
                  40150
                ],
                "exact": true
              },
              {
                "path": "/productLifeCycleInfo/diskCenter",
                "name": "diskCenter",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__diskCenter' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/diskCenter'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.diskCenter",
                "authority": [
                  40200
                ],
                "exact": true
              },
              {
                "path": "/productLifeCycleInfo/productLifeCycleInfoTemplate",
                "name": "productLifeCycleInfoTemplate",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__productLifeCycleInfoTemplate' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoTemplate'), loading: LoadingComponent}),
                "authority": [
                  40400
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.productLifeCycleInfoTemplate",
                "exact": true
              },
              {
                "path": "/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/:templateId",
                "name": "newProductLifeCycleInfoTemplate",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__productLifeCycle__newProductLifeCycleInfoTemplate' */'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/newProductLifeCycleInfoTemplate'), loading: LoadingComponent}),
                "hideInMenu": true,
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.productLifeCycle.newProductLifeCycleInfoTemplate",
                "exact": true
              }
            ]
          },
          {
            "name": "settings",
            "icon": "edit",
            "path": "/settings",
            "authority": [
              120000
            ],
            "routes": [
              {
                "name": "account",
                "path": "/settings/account",
                "authority": [
                  121000
                ],
                "routes": [
                  {
                    "name": "list",
                    "path": "/settings/account",
                    "authority": [
                      121000
                    ],
                    "hideInMenu": true,
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__accountSettings__account__list' */'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/list'), loading: LoadingComponent}),
                    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                    "tabLocalId": "menu.settings.account.list",
                    "exact": true
                  },
                  {
                    "name": "edit",
                    "path": "/settings/account/edit/:account",
                    "hideInMenu": true,
                    "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__accountSettings__account__edit' */'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/edit'), loading: LoadingComponent}),
                    "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                    "tabLocalId": "menu.settings.account.edit",
                    "exact": true
                  }
                ]
              },
              {
                "name": "authority",
                "path": "/settings/authority",
                "authority": [
                  122000
                ],
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__accountSettings__authority' */'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/authority'), loading: LoadingComponent}),
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.settings.authority",
                "exact": true
              },
              {
                "name": "companySetting",
                "path": "/settings/company",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__accountSettings__company' */'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/company'), loading: LoadingComponent}),
                "authority": [
                  123000
                ],
                "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'@/components/PageTab/RouteWatcher'), loading: LoadingComponent})],
                "tabLocalId": "menu.settings.companySetting",
                "exact": true
              }
            ]
          },
          {
            "name": "exception",
            "icon": "warning",
            "hideInMenu": true,
            "path": "/exception",
            "routes": [
              {
                "name": "403",
                "icon": "smile",
                "path": "/exception/403",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__exception__403' */'E:/公司代码/MRP报表/vip-manager/src/pages/exception/403'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "invalid",
                "icon": "smile",
                "path": "/exception/invalid",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__exception__invalid' */'E:/公司代码/MRP报表/vip-manager/src/pages/exception/invalid'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "noJurisdiction",
                "icon": "smile",
                "path": "/exception/noJurisdiction",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__exception__noJurisdiction' */'E:/公司代码/MRP报表/vip-manager/src/pages/exception/noJurisdiction'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "name": "500",
                "icon": "smile",
                "path": "/exception/500",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__exception__500' */'E:/公司代码/MRP报表/vip-manager/src/pages/exception/500'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'E:/公司代码/MRP报表/vip-manager/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
