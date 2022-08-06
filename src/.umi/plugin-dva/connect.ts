// @ts-nocheck
import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

export * from 'E:/公司代码/MRP报表/vip-manager/src/models/global';
export * from 'E:/公司代码/MRP报表/vip-manager/src/models/login';
export * from 'E:/公司代码/MRP报表/vip-manager/src/models/setting';
export * from 'E:/公司代码/MRP报表/vip-manager/src/models/user';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/edit/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/list/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/account/password/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/authority/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/accountSettings/company/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/businessAnalysis/components/operateView/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/channel/detail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/channel/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/CapitalFlow/Detail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/CapitalFlow/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/ExpressInformationTracking/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MakeNew/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXAnnouncement/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXAuthentication/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXInformationDisclosure/Details/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXInformationDisclosure/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXOnlineDisk/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXShare/Details/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXShare/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/ApplyPurchase/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/Details/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/List/Components/visitRemind/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXSignInfo/Redeming/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXTemplate/Details/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/MXTemplate/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/Transaction/Detail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/components/Transaction/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/consulte/question/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/createReportForm/reportForm/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/QueryForm/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/SelectTree/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/customMetrics/components/TableContent/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/dividends/dividendsList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/doubleRecordSolo/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/nodeInfoConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/identifyConfig/nodeInfoConfig/offlineConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/confirmAnnouncementSettings/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/informationDisclosure/setting/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/AssetsProve/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/BankCardInfo/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerInfo/components/dataMaintenance/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerInfo/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/customerManager/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/components/holdingProducts/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/investor/InvestorDetails/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/List/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/marketServices/SaleService/Notice/Template/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/onlineService/onlineServiceDetail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/onlineService/onlineServiceInfo/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/panel/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/list/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/offline/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/processManagement/identify/online/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/NetValueList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/OpenDayList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/ReservationList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/components/RiskControlList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/details/components/doubleConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/details/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/fileInfo/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/list/components/newProduct/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/list/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/netValueDetails/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/noticeFile/batchAdd/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/noticeFile/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/openDayDetails/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/productConfig/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/quantitativeFund/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/product/reservationDetails/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/diskCenter/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/expressInformation/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/newProductLifeCycleInfoTemplate/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/nodeManagement/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoDetail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoList/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/productLifeCycleInfoTemplate/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/productLifeCycle/shareFiles/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/returnVisit/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/risk/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/separateAgreementSign/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/list/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/share/shareConfirmation/reportTemplate/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/manager/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/overView/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/stockDetail/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/staggingTool/underwriter/model';
export * from 'E:/公司代码/MRP报表/vip-manager/src/pages/transactionInfo/OrderList/model';

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ImmerReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch<P = any, C = (payload: P) => void> = (action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    [key: string]: any;
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S> & { query: T };
  history: History;
  route: IRoute;
}

export type RequiredConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
  > = Required<ConnectProps<P, S, T>>

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<
  T = {},
  U = {},
  S = {},
  Q = {}
> = React.ForwardRefRenderFunction<any, T & RequiredConnectProps<U, S, Q>>;

