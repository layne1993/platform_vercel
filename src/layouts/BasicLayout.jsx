import ProLayout from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Link, useIntl, connect, history } from 'umi';
import { Result, Button, Badge } from 'antd';
import Authorized from '@/utils/Authorized';
import { setAuthority } from '@/utils/authority';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter, menuAuthTransform, authTransform, getCookie } from '@/utils/utils';
import _styles from './UserLayout.less';
import logo from './../assets/logo.png';
import { TabLayout } from '../components/PageTab/PageTabs';
import { badgeMenu } from './badgeMenu';


const noMatch = (
    <Result
        status={403}
        title="403"
        subTitle="对不起,您无权访问该页面!"
        extra={
            <Button type="primary">
                <Link to="/user/login">去登录</Link>
            </Button>
        }
    />
);

const menuDataRender = (menuList) =>
    menuList.map((item) => {
        const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
        return Authorized.check(item.authority, localItem, null) ;
    });

const BasicLayout = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const [bageMenuData, setBageMenuData] = useState({});
    const {
        location: { pathname = '', query = {} }
    } = props;
    var currentURL = window.location.href;
    var nocache = currentURL.indexOf('v=') !== -1;
    let params = { ...query, v: new Date().getTime() };
    // console.log(params);
    if (!nocache) {
        history.replace({
            pathname: pathname,
            query: {
                ...params
            }
        });
    }

    if (!document.title) {
        document.title = '财富管理中心';
    }

    const {
        dispatch,
        children,
        settings,
        location = {
            pathname: '/'
        }
    } = props;
    if (getCookie('vipAdminToken') && !sessionStorage.getItem('PERMISSION')) {
        dispatch({
            type: 'global/getSysMenu',
            callback: (res) => {
                if (res.code === 1008) {
                    let { email, menuAuths = [] } = res.data || {};
                    localStorage.setItem('email', email);
                    // eslint-disable-next-line no-undef
                    let permissionList = {};
                    menuAuths.map((item) => {
                        permissionList[item.menuCode] = authTransform(item);
                    });
                    let menuList = menuAuthTransform(menuAuths);
                    setAuthority(menuList);
                    // eslint-disable-next-line no-undef
                    sessionStorage.setItem('PERMISSION', JSON.stringify(permissionList));
                }
            }
        });
    }

    const handleMenuCollapse = (payload) => {
        setCollapsed(payload);
        if (dispatch) {
            dispatch({
                type: 'global/changeLayoutCollapsed',
                payload
            });
        }
    }; // get children authority


    /**
     * @description 菜单红点统计数据
     *
    */
    const getMenuMessageBadge = () => {
        dispatch({
            type: 'global/getMenuMessageBadge',
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    const newBageMenu = { ...badgeMenu };
                    newBageMenu['/investor/assetsProve'] = data.pendingAssetsCount;
                    newBageMenu['/operation/processManagement/investorsProcessList'] = data.pendingIdentifyCount;
                    newBageMenu['/product/openDay'] = data.openDayCount;
                    newBageMenu['/infoDisclosure/informationDisclosure/infoList'] = data.disclosureCount;
                    newBageMenu['/channel/vacancyChannel'] = data.defectChannel;
                    newBageMenu['/raisingInfo/reservation'] = data.onlineProductApplyCount;
                    newBageMenu['/raisingInfo/processManagement/investorsProcessList'] = data.onlinePendingIdentifyCount;
                    newBageMenu['/raisingInfo/processManagement/productProcessList'] = data.onlinePendingSignFlowCount;
                    newBageMenu['/raisingInfo/separateAgreementSign'] = data.onlinePendingSignUpCount;
                    newBageMenu['/raisingInfo/doubleRecordSolo'] = data.onlinePendingAppRecordCount;
                    newBageMenu['/productLifeCycleInfo/list'] = data.workflowCount;
                    newBageMenu['/productLifeCycleInfo/expressInformation'] = data.workflowExpressInfoCount;
                    newBageMenu['/riskManagement/RiskControl'] = data.riskCount;
                    newBageMenu['/staggingTool/overView'] = data.staggingNoticeCount + data.staggingPendingCount;
                    setBageMenuData(newBageMenu);
                }
            }
        });
    };

    useEffect(() => {
        getMenuMessageBadge();
    }, []);

    const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
        authority: undefined
    };
    const { formatMessage } = useIntl();

    // 自定义拥有子菜单菜单项的 render 方法
    const subMenuItemRender = (subMenuItemRenderProps, defaultDom) => {
        let dot = false;
        if (Array.isArray(subMenuItemRenderProps.children)) {
            for (let i = 0; i < subMenuItemRenderProps.children.length; i++) {
                if (bageMenuData[subMenuItemRenderProps.children[i].path] > 0) {
                    dot = true;
                    break;
                }
            }
        }
        return <Badge dot={dot}>{defaultDom}</Badge>;
    };

    const menuItemTxtRender = (menuItemProps, defaultDom) => {
        return bageMenuData[menuItemProps.path] > 0 ?
            <Badge offset={[12, -5]} size="small" count={bageMenuData[menuItemProps.path]}><Link to={menuItemProps.path}>{defaultDom}</Link></Badge>
            :
            <Link to={menuItemProps.path}>{defaultDom}</Link>;
    };

    return (
        <ProLayout
            logo={
                <div className={_styles.logo}>
                    <img src={logo} alt="" />
                    {!collapsed && (
                        <>
                            <div className={_styles.name}>财富管理中心</div>
                            <div className={_styles.company}>{getCookie('companyName')}</div>
                        </>
                    )}
                </div>
            }
            siderWidth={'218px'}
            formatMessage={formatMessage}
            menuHeaderRender={(logoDom) => <Link to="/">{logoDom}</Link>}
            collapsed={collapsed}
            menuItemRender={menuItemTxtRender}
            subMenuItemRender={subMenuItemRender}
            breadcrumbRender={(routers = []) => [...routers]}
            itemRender={(route, params, routes) => {
                const index = routes.indexOf(route);
                const first = index > 0 && index < routes.length - 1;
                const path = routes.find((item) => item.breadcrumbName === route.breadcrumbName).path;
                // return first ? (
                //     <Link style={{ color: '#1890ff' }} to={path}>
                //         {route.breadcrumbName}
                //     </Link>
                // ) : (
                //     <span style={{ color: '#000000' }}>{route.breadcrumbName}</span>
                // );
                return <span style={{ color: '#000000' }}>{route.breadcrumbName}</span>;
            }}
            footerRender={null}
            menuDataRender={menuDataRender}
            // menuContentRender={(a) => { console.log(a, '0000000000'); return null;}}
            rightContentRender={() => <RightContent />}
            collapsedButtonRender={false}
            headerContentRender={() => {
                return (
                    <div
                        onClick={() => handleMenuCollapse(!collapsed)}
                        style={{
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    </div>
                );
            }}
            {...props}
            {...settings}
            fixedHeader={false}
        >
            <Authorized authority={authorized.authority} noMatch={noMatch}>
                <TabLayout {...props}>
                    {children}
                </TabLayout>
            </Authorized>
        </ProLayout>
    );
};

export default connect(({ global, settings }) => ({
    collapsed: global.collapsed,
    settings
}))(BasicLayout);
