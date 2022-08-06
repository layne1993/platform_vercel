import { Card, Badge, Spin } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import CustomerInfo from './components/customerInfo'; // 基本要素
import Authentication from '@/pages/components/MXAuthentication';
// import Funders from './components/funders/Funders'; // 基本要素
import RiskAssessment from './components/riskAssessment/RiskAssessment'; // 风险测评信息
import InvestorIdentification from '@/pages/processManagement/identify/list/Components/QualifiedInvestor'; // 合格投资者认定
import MXSignInfoTab from '@/pages/components/MXSignInfo/List/Components/Tab'; // 认申赎流程
import TransactionInfo from '@/pages/components/Transaction/List'; //申赎确认
// import TransactionInfo from './components/transactionInfo/TransactionInfo'; // 申赎确认
import CapitalFlow from '@/pages/components/CapitalFlow/List'; //资金流水信息
import ShareInfo from '@/pages/components/MXShare/List'; // 份额余额信息
import Dividends from '@/pages/dividends/dividendsList/list';
import AssetsDetails from '../AssetsProve/components/List'; // 资产证明信息
import BankDetails from '@/pages/investor/BankCardInfo/Components/List'; //银行卡信息
import ShareConfirmation from '@/pages/share/shareConfirmation/list';
import HoldingProdcuts from './components/holdingProducts';  // 持有产品
import { getTabs, getPermission } from '@/utils/utils';

import styles from './style.less';

const sourceTabs = [
    {
        key: '0',
        tab: '基本要素',
        permissionCode: 10101,
        render: (props) => <CustomerInfo {...props} {...getPermission(10101)} />
    },
    {
        key: '1',
        tab: '持有产品',
        permissionCode: 10111,
        render: (props) => <HoldingProdcuts {...props} {...getPermission(10111)} />
    },
    {
        key: '12',
        tab: '实名信息',
        permissionCode: 10101,
        render: (props) => <Authentication {...props} />
    },
    {
        key: '2',
        tab: '风险测评信息',
        permissionCode: 10102,
        render: (props) => <RiskAssessment {...props} {...getPermission(10102)} />
    },
    {
        key: '10',
        tab: '银行卡信息',
        permissionCode: 10103,
        render: (props) => <BankDetails {...props} {...getPermission(10103)} />
    },
    {
        key: '3',
        tab: '合格投资者认定信息',
        permissionCode: 10104,
        render: (props) => <InvestorIdentification {...props} {...getPermission(10104)} />
    },
    {
        key: '5',
        tab: '募集户资金流水',
        permissionCode: 10105,
        render: (props) => <CapitalFlow {...props} {...getPermission(10105)} />
    },
    {
        key: '7',
        tab: '交易签约',
        permissionCode: 10106,
        render: (props) => <MXSignInfoTab {...props} {...getPermission(10106)} type="customerType" signType="all" />
    },
    {
        key: '4',
        tab: '认申赎确认信息',
        permissionCode: 10107,
        render: (props) => <TransactionInfo {...props} {...getPermission(10107)} />
    },
    {
        key: '8',
        tab: '分红信息',
        permissionCode: 10108,
        render: (props) => <Dividends {...props} {...getPermission(10108)} />
    },
    {
        key: '6',
        tab: '份额余额信息',
        permissionCode: 10109,
        render: (props) => <ShareInfo {...props} {...getPermission(10109)} />
    },

    {
        key: '11',
        tab: '份额确认书',
        permissionCode: 10110,
        render: (props) => <ShareConfirmation {...props} {...getPermission(10110)} />
    },
    {
        key: '9',
        tab: '资产证明信息',
        permissionCode: 10111,
        render: (props) => <AssetsDetails {...props} {...getPermission(10111)} />
    }

];

const operationTabList = getTabs(sourceTabs);

class InvestorDetailsInfo extends Component {
    state = {
        operationKey: '0',
        tabIndex: 0,
        tabList: operationTabList
    };

    componentDidMount() {
        this.getCustomerNoticeStatistics();
        this.getTabList();
        window.sessionStorage.setItem('processTabKey', 'tab4');
        if (window.sessionStorage.getItem('customer')) {
            this.setState({
                operationKey: window.sessionStorage.getItem('customer'),
                tabIndex: window.sessionStorage.getItem('customer') ? 6 : 0
            });
        }
    }

    // static getDerivedStateFromProps(nextProps,nextState) {
    //     console.log(nextProps,nextState)
    // }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({ type: 'INVESTOR_DETAIL/resetModel', payload: {} });
        window.sessionStorage.removeItem('processTabKey');
    }

    getCustomerNoticeStatistics = () => {
        const { dispatch, match: { params } } = this.props;
        if (!params.customerId || params.customerId === '0') return;
        dispatch({
            type: 'INVESTOR_DETAIL/getCustomerNoticeStatistics',
            payload: { customerId: params.customerId },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    const { tabList } = this.state;
                    const newArr = [];
                    tabList.map((item) => {
                        if (item.key === '3') {
                            newArr.push({
                                ...item,
                                badge: data.onlinePendingIdentifyCount,
                                tab: <>{item.tab}<Badge size="small" offset={[0, -15]} count={data.onlinePendingIdentifyCount || 0}></Badge></>
                            });
                        } else if (item.key === '7') {
                            newArr.push({
                                ...item,
                                badge: data.onlinePendingSignFlowCount,
                                tab: <>{item.tab}<Badge size="small" offset={[0, -15]} count={data.onlinePendingSignFlowCount || 0}></Badge></>
                            });
                        } else if (item.key === '9') {
                            newArr.push({
                                ...item,
                                badge: data.pendingAssetsCount,
                                tab: <>{item.tab}<Badge size="small" offset={[0, -15]} count={data.pendingAssetsCount || 0}></Badge></>
                            });
                        } else {
                            newArr.push({
                                ...item,
                                badge: 0
                            });
                        }
                    });
                    this.setState({ tabList: newArr });
                }
            }
        });
    }

    /**
     * 获取tablist
     */
    getTabList = () => {
        const {
            match: { params }
        } = this.props;
        let tabList = [];
        if (params.customerId !== '0') {
            tabList = operationTabList;
        } else {
            tabList = operationTabList.slice(0, 1);
        }
        if (tabList.length > 0) {
            this.setState({ tabList, operationKey: tabList[0]['key'] });
        } else {
            this.setState({ tabList: [], operationKey: undefined });
        }
    };

    /**
     * tab切换点击事件
     * @param {*} key
     */
    onOperationTabChange = (key) => {
        let { tabList, tabIndex } = this.state;
        tabList.map((item, index) => {
            if (item.key === key) {
                tabIndex = index;
            }
        });

        this.setState({
            operationKey: key,
            tabIndex
        });
    };

    render() {
        const { operationKey, tabList, tabIndex } = this.state;
        const {
            match: { params },
            INVESTOR_DETAIL, tabLoading
        } = this.props;
        let elementRender = null;
        if (tabList.length > 0) {
            elementRender = tabList[tabIndex * 1].render;
        }

        // console.log(elementRender);
        return (
            <PageHeaderWrapper
                title={
                    <>
                        客户详情{' '}
                        {INVESTOR_DETAIL.elementInfo.customerName && (
                            <span style={{ fontSize: 16 }}>
                                {' '}
                                - {INVESTOR_DETAIL.elementInfo.customerName || ''}
                            </span>
                        )}{' '}
                    </>
                }
                className={styles.pageHeader}
            >
                <div className={styles.main}>
                    <Spin spinning={tabLoading || false}>
                        <GridContent>
                            <Card
                                bordered={false}
                                tabList={tabList}
                                onTabChange={this.onOperationTabChange}
                                activeTabKey={operationKey}
                            >
                                {elementRender && elementRender({
                                    params: { ...params, customerId: params.customerId * 1 },
                                    setTab: this.onOperationTabChange,
                                    isCustomer: true
                                })}
                            </Card>
                        </GridContent>
                    </Spin>

                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ INVESTOR_DETAIL, loading }) => ({
    INVESTOR_DETAIL,
    tabLoading: loading.effects['INVESTOR_DETAIL/getCustomerNoticeStatistics']
}))(InvestorDetailsInfo);
