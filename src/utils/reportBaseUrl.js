
function getReportBaseUrl() {
    // 易私募 Saas 系统的配置
    if (REACT_APP_ENV === 'vip' || REACT_APP_ENV === 'prod') {
        // eslint-disable-next-line no-undef
        const { NODE_ENV } = process.env;
        const devHostArr = [
            'vipdevfunds.simu800.com',
            'vipsitfunds.simu800.com'
        ];
        return (NODE_ENV === 'production' && !devHostArr.includes(location.host)) ? 'https://fof.meix.com' : 'https://dev.meix.com';
    }

    // 定制化的配置
    return window.location.origin;
}

const baseURL = getReportBaseUrl();

export { baseURL };
