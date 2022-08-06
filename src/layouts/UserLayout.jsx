import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import React from 'react';
// import SelectLang from '@/components/SelectLang';
import styles from './UserLayout.less';

const UserLayout = (props) => {
    const {
        route = {
            routes: []
        }
    } = props;
    const { routes = [] } = route;
    const {
        children,
        location = {
            pathname: ''
        }
    } = props;
    const { formatMessage } = useIntl();
    const { breadcrumb } = getMenuData(routes);
    const title = getPageTitle({
        pathname: location.pathname,
        formatMessage,
        breadcrumb,
        ...props
    });
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={title} />
            </Helmet>

            <div className={styles.container}>
                <div className={styles.logoArea}>
                    {/* <SelectLang /> */}
                    <div className={styles.left}>
                        <Link to="/">
                            {/* <img alt="logo" className={styles.logo} src={logo} /> */}
                        </Link>
                    </div>
                </div>
                <div className={styles.content}>
                    {children}
                </div>
                {/* <DefaultFooter
                    className={styles.footerBg}
                    copyright={<> 2016-2020 希瓦资产 &nbsp;版权所有</>}
                    links={[]}
                /> */}
            </div>
        </HelmetProvider>
    );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
