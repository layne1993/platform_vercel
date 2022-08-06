// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from 'E:/公司代码/MRP报表/vip-manager/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';
import ModelGlobal0 from 'E:/公司代码/MRP报表/vip-manager/src/models/global.js';
import ModelLogin1 from 'E:/公司代码/MRP报表/vip-manager/src/models/login.js';
import ModelSetting2 from 'E:/公司代码/MRP报表/vip-manager/src/models/setting.js';
import ModelUser3 from 'E:/公司代码/MRP报表/vip-manager/src/models/user.js';
import ModelModel4 from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/edit/model.js';
import ModelModel5 from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/list/model.js';
import ModelModel6 from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/password/model.js';
import ModelModel7 from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/authority/model.js';
import ModelModel8 from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/company/model.js';
import ModelModel9 from 'E:/公司代码/MRP报表/vip-manager/src/pages/businessAnalysis/components/operateView/model.js';
import ModelModel10 from 'E:/公司代码/MRP报表/vip-manager/src/pages/channel/detail/model.ts';
import ModelModel11 from 'E:/公司代码/MRP报表/vip-manager/src/pages/channel/model.ts';
import ModelModel12 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/CapitalFlow/Detail/model.js';
import ModelModel13 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/CapitalFlow/List/model.js';
import ModelModel14 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/ExpressInformationTracking/model.js';
import ModelModel15 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MakeNew/model.ts';
import ModelModel16 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXAnnouncement/model.js';
import ModelModel17 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXAuthentication/model.js';
import ModelModel18 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXInformationDisclosure/Details/model.js';
import ModelModel19 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXInformationDisclosure/List/model.js';
import ModelModel20 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXOnlineDisk/model.ts';
import ModelModel21 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXShare/Details/model.js';
import ModelModel22 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXShare/List/model.js';
import ModelModel23 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/ApplyPurchase/model.js';
import ModelModel24 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/Details/model.js';
import ModelModel25 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/List/Components/visitRemind/model.ts';
import ModelModel26 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/List/model.js';
import ModelModel27 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/Redeming/model.js';
import ModelModel28 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXTemplate/Details/model.js';
import ModelModel29 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXTemplate/List/model.js';
import ModelModel30 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/Transaction/Detail/model.js';
import ModelModel31 from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/Transaction/List/model.js';
import ModelModel32 from 'E:/公司代码/MRP报表/vip-manager/src/pages/consulte/question/model.js';
import ModelModel33 from 'E:/公司代码/MRP报表/vip-manager/src/pages/createReportForm/reportForm/model.js';
import ModelModel34 from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/QueryForm/model.js';
import ModelModel35 from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/SelectTree/model.js';
import ModelModel36 from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/TableContent/model.js';
import ModelModel37 from 'E:/公司代码/MRP报表/vip-manager/src/pages/dividends/dividendsList/model.js';
import ModelModel38 from 'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordConfig/model.js';
import ModelModel39 from 'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordSolo/model.ts';
import ModelModel40 from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/model.js';
import ModelModel41 from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/nodeInfoConfig/model.js';
import ModelModel42 from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/nodeInfoConfig/offlineConfig/model.js';
import ModelModel43 from 'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/confirmAnnouncementSettings/model.js';
import ModelModel44 from 'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/setting/model.ts';
import ModelModel45 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/AssetsProve/model.js';
import ModelModel46 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/BankCardInfo/model.js';
import ModelModel47 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerInfo/components/dataMaintenance/model.ts';
import ModelModel48 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerInfo/model.js';
import ModelModel49 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerManager/model.ts';
import ModelModel50 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/components/holdingProducts/model.js';
import ModelModel51 from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/model.js';
import ModelModel52 from 'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/List/model.js';
import ModelModel53 from 'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/Template/model.js';
import ModelModel54 from 'E:/公司代码/MRP报表/vip-manager/src/pages/onlineService/onlineServiceDetail/model.js';
import ModelModel55 from 'E:/公司代码/MRP报表/vip-manager/src/pages/onlineService/onlineServiceInfo/model.js';
import ModelModel56 from 'E:/公司代码/MRP报表/vip-manager/src/pages/panel/model.js';
import ModelModel57 from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/list/model.js';
import ModelModel58 from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/offline/model.js';
import ModelModel59 from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/online/model.js';
import ModelModel60 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/NetValueList/model.js';
import ModelModel61 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/OpenDayList/model.js';
import ModelModel62 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/ReservationList/model.js';
import ModelModel63 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/RiskControlList/model.js';
import ModelModel64 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/details/components/doubleConfig/model.js';
import ModelModel65 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/details/model.js';
import ModelModel66 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/fileInfo/model.js';
import ModelModel67 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/list/components/newProduct/model.js';
import ModelModel68 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/list/model.js';
import ModelModel69 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/netValueDetails/model.js';
import ModelModel70 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/noticeFile/batchAdd/model.js';
import ModelModel71 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/noticeFile/model.js';
import ModelModel72 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/openDayDetails/model.js';
import ModelModel73 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/productConfig/model.js';
import ModelModel74 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/quantitativeFund/model.js';
import ModelModel75 from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/reservationDetails/model.js';
import ModelModel76 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/diskCenter/model.ts';
import ModelModel77 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/expressInformation/model.js';
import ModelModel78 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/newProductLifeCycleInfoTemplate/model.js';
import ModelModel79 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/nodeManagement/model.ts';
import ModelModel80 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoDetail/model.ts';
import ModelModel81 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoList/model.ts';
import ModelModel82 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoTemplate/model.js';
import ModelModel83 from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/shareFiles/model.js';
import ModelModel84 from 'E:/公司代码/MRP报表/vip-manager/src/pages/returnVisit/model.js';
import ModelModel85 from 'E:/公司代码/MRP报表/vip-manager/src/pages/risk/model.js';
import ModelModel86 from 'E:/公司代码/MRP报表/vip-manager/src/pages/separateAgreementSign/model.ts';
import ModelModel87 from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/list/model.js';
import ModelModel88 from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/model.js';
import ModelModel89 from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/reportTemplate/model.js';
import ModelModel90 from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/manager/model.ts';
import ModelModel91 from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/overView/model.ts';
import ModelModel92 from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/stockDetail/model.ts';
import ModelModel93 from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/underwriter/model.ts';
import ModelModel94 from 'E:/公司代码/MRP报表/vip-manager/src/pages/transactionInfo/OrderList/model.js';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'global', ...ModelGlobal0 });
app.model({ namespace: 'login', ...ModelLogin1 });
app.model({ namespace: 'setting', ...ModelSetting2 });
app.model({ namespace: 'user', ...ModelUser3 });
app.model({ namespace: 'model', ...ModelModel4 });
app.model({ namespace: 'model', ...ModelModel5 });
app.model({ namespace: 'model', ...ModelModel6 });
app.model({ namespace: 'model', ...ModelModel7 });
app.model({ namespace: 'model', ...ModelModel8 });
app.model({ namespace: 'model', ...ModelModel9 });
app.model({ namespace: 'model', ...ModelModel10 });
app.model({ namespace: 'model', ...ModelModel11 });
app.model({ namespace: 'model', ...ModelModel12 });
app.model({ namespace: 'model', ...ModelModel13 });
app.model({ namespace: 'model', ...ModelModel14 });
app.model({ namespace: 'model', ...ModelModel15 });
app.model({ namespace: 'model', ...ModelModel16 });
app.model({ namespace: 'model', ...ModelModel17 });
app.model({ namespace: 'model', ...ModelModel18 });
app.model({ namespace: 'model', ...ModelModel19 });
app.model({ namespace: 'model', ...ModelModel20 });
app.model({ namespace: 'model', ...ModelModel21 });
app.model({ namespace: 'model', ...ModelModel22 });
app.model({ namespace: 'model', ...ModelModel23 });
app.model({ namespace: 'model', ...ModelModel24 });
app.model({ namespace: 'model', ...ModelModel25 });
app.model({ namespace: 'model', ...ModelModel26 });
app.model({ namespace: 'model', ...ModelModel27 });
app.model({ namespace: 'model', ...ModelModel28 });
app.model({ namespace: 'model', ...ModelModel29 });
app.model({ namespace: 'model', ...ModelModel30 });
app.model({ namespace: 'model', ...ModelModel31 });
app.model({ namespace: 'model', ...ModelModel32 });
app.model({ namespace: 'model', ...ModelModel33 });
app.model({ namespace: 'model', ...ModelModel34 });
app.model({ namespace: 'model', ...ModelModel35 });
app.model({ namespace: 'model', ...ModelModel36 });
app.model({ namespace: 'model', ...ModelModel37 });
app.model({ namespace: 'model', ...ModelModel38 });
app.model({ namespace: 'model', ...ModelModel39 });
app.model({ namespace: 'model', ...ModelModel40 });
app.model({ namespace: 'model', ...ModelModel41 });
app.model({ namespace: 'model', ...ModelModel42 });
app.model({ namespace: 'model', ...ModelModel43 });
app.model({ namespace: 'model', ...ModelModel44 });
app.model({ namespace: 'model', ...ModelModel45 });
app.model({ namespace: 'model', ...ModelModel46 });
app.model({ namespace: 'model', ...ModelModel47 });
app.model({ namespace: 'model', ...ModelModel48 });
app.model({ namespace: 'model', ...ModelModel49 });
app.model({ namespace: 'model', ...ModelModel50 });
app.model({ namespace: 'model', ...ModelModel51 });
app.model({ namespace: 'model', ...ModelModel52 });
app.model({ namespace: 'model', ...ModelModel53 });
app.model({ namespace: 'model', ...ModelModel54 });
app.model({ namespace: 'model', ...ModelModel55 });
app.model({ namespace: 'model', ...ModelModel56 });
app.model({ namespace: 'model', ...ModelModel57 });
app.model({ namespace: 'model', ...ModelModel58 });
app.model({ namespace: 'model', ...ModelModel59 });
app.model({ namespace: 'model', ...ModelModel60 });
app.model({ namespace: 'model', ...ModelModel61 });
app.model({ namespace: 'model', ...ModelModel62 });
app.model({ namespace: 'model', ...ModelModel63 });
app.model({ namespace: 'model', ...ModelModel64 });
app.model({ namespace: 'model', ...ModelModel65 });
app.model({ namespace: 'model', ...ModelModel66 });
app.model({ namespace: 'model', ...ModelModel67 });
app.model({ namespace: 'model', ...ModelModel68 });
app.model({ namespace: 'model', ...ModelModel69 });
app.model({ namespace: 'model', ...ModelModel70 });
app.model({ namespace: 'model', ...ModelModel71 });
app.model({ namespace: 'model', ...ModelModel72 });
app.model({ namespace: 'model', ...ModelModel73 });
app.model({ namespace: 'model', ...ModelModel74 });
app.model({ namespace: 'model', ...ModelModel75 });
app.model({ namespace: 'model', ...ModelModel76 });
app.model({ namespace: 'model', ...ModelModel77 });
app.model({ namespace: 'model', ...ModelModel78 });
app.model({ namespace: 'model', ...ModelModel79 });
app.model({ namespace: 'model', ...ModelModel80 });
app.model({ namespace: 'model', ...ModelModel81 });
app.model({ namespace: 'model', ...ModelModel82 });
app.model({ namespace: 'model', ...ModelModel83 });
app.model({ namespace: 'model', ...ModelModel84 });
app.model({ namespace: 'model', ...ModelModel85 });
app.model({ namespace: 'model', ...ModelModel86 });
app.model({ namespace: 'model', ...ModelModel87 });
app.model({ namespace: 'model', ...ModelModel88 });
app.model({ namespace: 'model', ...ModelModel89 });
app.model({ namespace: 'model', ...ModelModel90 });
app.model({ namespace: 'model', ...ModelModel91 });
app.model({ namespace: 'model', ...ModelModel92 });
app.model({ namespace: 'model', ...ModelModel93 });
app.model({ namespace: 'model', ...ModelModel94 });
  return app;
}

export function getApp() {
  return app;
}

/**
 * whether browser env
 * 
 * @returns boolean
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (isBrowser()) {
      _onCreate()
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
