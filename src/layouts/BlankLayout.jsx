import { PageLoading, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { formatMessage, connect } from 'umi';
import React from 'react';
// import { getCookie } from '@/utils/utils';

class Layout extends React.Component {
    state = {};

    componentDidMount() {}

    render() {
        const { loading, route = { routes: [] } } = this.props;
        const { routes = [] } = route;
        const { children, location = { pathname: '' } } = this.props;
        const { breadcrumb } = getMenuData(routes);
        const title = getPageTitle({
            pathname: location.pathname,
            formatMessage,
            breadcrumb,
            ...this.props
        });

        return (
            <HelmetProvider>
                <Helmet>
                    <title>{title}</title>
                </Helmet>
                {loading ? <PageLoading /> : <div style={{ height: '100%' }}>{children}</div>}
            </HelmetProvider>
        );
    }
}

export default connect(({ settings, loading }) => ({
    ...settings
}))(Layout);
