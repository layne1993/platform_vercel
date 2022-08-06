import { Card, Badge, Spin } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import Tab1 from './components/Tab1';
import Tab2 from './components/Tab2';
import Tab3 from './components/Tab3';
import Tab4 from './components/Tab4';
import Tab5 from './components/Tab5';
import Tab6 from './components/Tab6';
import Tab7 from './components/Tab7';
import Tab8 from './components/Tab8';
import Tab9 from './components/Tab9';
import Tab10 from './components/Tab10';
import Tab11 from './components/Tab11';
import Tab12 from './components/Tab12';
import Tab13 from './components/Tab13';
import Tab14 from './components/Tab14';
import Tab15 from './components/Tab15';
import Tab16 from './components/Tab16';
import Tab17 from './components/Tab17';
import styles from './style.less';
import { getPermission, getQueryString } from '@/utils/utils';

class ProductDetails extends Component {
    state = {
        operationKey: 'tab1',
        tabList: []
    };

    componentDidMount() {
        const { dispatch } = this.props;
        // 不同环境判断权限
        dispatch({
            type: 'productDetails/getLinkSimu',
            callback: () => {
                this.tabAuthSetting();
                // 签约信息展示全部tab
                window.sessionStorage.setItem('processTabKey', 'tab4');
                const tab6 = window.sessionStorage.getItem('product');
                const tab10 = window.sessionStorage.getItem('tabTemplate');
                const tab17 = window.sessionStorage.getItem('materialMaintenance');
                // const customertab = sessionStorage.getItem('manger');
                // const tab4 = sessionStorage.getItem('haveDeal');
                const tabKey = getQueryString('tabKey');
                if (tabKey) {
                    this.setState({
                        operationKey: tabKey
                    });
                }

                if (!!tab6) {
                    this.setState({
                        operationKey: tab6
                    });
                }
                if (!!tab10) {
                    this.setState({
                        operationKey: tab10
                    });
                }

                if (!!tab17) {
                    this.setState({
                        operationKey: tab17
                    });
                }
                this.getProductNoticeStatistics();
            }
        });
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        const payload = {
            productInfo: {}
        };
        dispatch({
            type: 'productDetails/resetModel',
            payload
        });
        sessionStorage.removeItem('processTabKey');
        sessionStorage.removeItem('materialMaintenance');
    }

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };

    tabAuthSetting = () => {
        const { productDetails: { linkSimu } } = this.props;
        const authority = window.localStorage.getItem('antd-pro-authority');
        const { match: { params } } = this.props;
        let tabList = [];

        if (authority.indexOf(30101) !== -1) {
            tabList.push({
                key: 'tab1',
                tab: '基本要素'
            });
        }
        if (authority.indexOf(30102) !== -1) {
            tabList.push({
                key: 'tab2',
                tab: '净值'
            });
        }
        if (authority.indexOf(30103) !== -1) {
            tabList.push({
                key: 'tab3',
                tab: '公告文件'
            });
        }
        if (authority.indexOf(30105) !== -1) {
            tabList.push({
                key: 'tab5',
                tab: '预约'
            });
        }

        if (authority.indexOf(30109) !== -1) {
            tabList.push({
                key: 'tab11',
                tab: '信披提醒'
            });
        }

        if (authority.indexOf(30114) !== -1) {
            tabList.push({
                key: 'tab4',
                tab: '投资人'
            });
        }

        if (authority.indexOf(30106) !== -1) {
            tabList.push({
                key: 'tab6',
                tab: '交易签约'
            });
        }
        if (authority.indexOf(30107) !== -1) {
            tabList.push({
                key: 'tab8',
                tab: '认申赎确认'
            });
        }

        if (authority.indexOf(30112) !== -1) {
            tabList.push({
                key: 'tab13',
                tab: '双录信息'
            });
        }


        if (authority.indexOf(30108) !== -1) {
            tabList.push({
                key: 'tab9',
                tab: '分红'
            });
        }

        if (authority.indexOf(30110) !== -1) {
            tabList.push({
                key: 'tab7',
                tab: '份额确认书'
            });
        }

        if (authority.indexOf(30104) !== -1) {
            tabList.push({
                key: 'tab12',
                tab: '开放日'
            });
        }

        if (authority.indexOf(30113) !== -1) {
            tabList.push({
                key: 'tab14',
                tab: '产品配置'
            });
        }

        if (authority.indexOf(30111) !== -1) {
            tabList.push({
                key: 'tab10',
                tab: '协议模板'
            });
        }

        if (authority.indexOf(30115) !== -1 && !linkSimu) {
            tabList.push({
                key: 'tab15',
                tab: '协议模板（有托管）'
            });
        }

        if (authority.indexOf(30117) !== -1) {
            tabList.push({
                key: 'tab16',
                tab: '开户账户信息'
            });
        }

        if (authority.indexOf(30116) !== -1) {
            tabList.push({
                key: 'tab17',
                tab: '打新信息维护'
            });
        }


        if (params.productId === '0') {
            tabList = tabList.slice(0, 1);
        }
        this.setState({
            operationKey: tabList[0] ? tabList[0].key : '',
            tabList
        });
    }

    getProductNoticeStatistics = () => {
        const { dispatch, match: { params } } = this.props;
        if (!params.productId || params.productId === '0') return;
        dispatch({
            type: 'productDetails/getProductNoticeStatistics',
            payload: { productId: params.productId },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    console.log('jjj');
                    const { tabList } = this.state;
                    const newArr = [];
                    console.log(tabList, 'tabList');
                    tabList.map((item) => {
                        if (item.key === 'tab12') {
                            newArr.push({
                                ...item,
                                badge: data.openDayCount,
                                tab: <>{item.tab}<Badge size="small" offset={[0, -15]} count={data.openDayCount || 0}></Badge></>
                            });
                        } else if (item.key === 'tab5') {
                            newArr.push({
                                ...item,
                                badge: data.onlineProductApplyCount,
                                tab: <>{item.tab}<Badge size="small" count={data.onlineProductApplyCount || 0}></Badge></>
                            });
                        } else if (item.key === 'tab11') {
                            newArr.push({
                                ...item,
                                badge: data.disclosureCount,
                                tab: <>{item.tab}<Badge size="small" offset={[0, -15]} count={data.disclosureCount || 0}></Badge></>
                            });
                        } else {
                            newArr.push({
                                ...item,
                                badge: 0
                            });
                        }
                    });
                    console.log(newArr, 'newArrnewArr');
                    this.setState({ tabList: newArr });
                }
            }
        });
    }

    // 产品要素保存成功回调
    saveCallback = () => {
        this.tabAuthSetting();
    }

    render() {
        const { operationKey, tabList } = this.state;
        const {
            match: { params },
            productDetails,
            tabLoading
        } = this.props;
        // console.log(productDetails.productInfo)
        const contentList = {
            tab1: <Tab1 params={params} saveCallback={this.saveCallback} onTabChange={this.onOperationTabChange} {...getPermission(30101)} />,
            tab2: <Tab2 params={params} />,
            tab3: <Tab3 params={params} {...getPermission(30103)} />,
            tab4: <Tab4 params={params} {...getPermission(30114)} />,
            tab5: <Tab5 params={params} />,
            tab6: <Tab6 params={params} />,
            tab7: <Tab7 params={params} />,
            tab8: <Tab8 params={params} />,
            tab9: <Tab9 params={params} />,
            tab10: <Tab10 params={params} goTab15={(e) => this.onOperationTabChange('tab15')} />,
            tab11: <Tab11 params={params} />,
            tab12: <Tab12 params={params} />,
            tab13: <Tab13 params={params} />,
            tab14: <Tab14 params={params} {...getPermission(30113)} />,
            tab15: <Tab15 params={params} />,
            tab16: <Tab16 params={params} {...getPermission(30117)} />,
            tab17: <Tab17 params={params} {...getPermission(30116)} />
        };
        return (
            <PageHeaderWrapper title={<>产品详情 {productDetails.productInfo.productName && <span style={{ fontSize: 16 }}>- {productDetails.productInfo.productFullName || ''}</span>}</>} className={styles.pageHeader}>
                <div className={styles.main}>
                    <Spin spinning={tabLoading || false}>
                        <GridContent>
                            <Card
                                bordered={false}
                                tabList={tabList}
                                onTabChange={this.onOperationTabChange}
                                activeTabKey={operationKey}
                            >
                                {contentList[operationKey]}
                            </Card>
                        </GridContent>
                    </Spin>
                </div>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ productDetails, loading }) => ({
    productDetails,
    tabLoading: loading.effects['productDetails/getLinkSimu']
}))(ProductDetails);
