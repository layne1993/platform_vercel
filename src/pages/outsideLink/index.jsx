import React, { useEffect } from 'react';
import { getCookie } from '@/utils/utils';

const Redirect = () => {
    //   const menuItemTxtRender = (menuItemProps, defaultDom) => {
    //     if (menuItemProps.path === '/website') {
    //         const companyCode = getCookie('companyCode');
    //         const externalCompanyCode = getCookie('externalCompanyCode') || '';
    //         const userCode = getCookie('managerUserId');
    //         const account = getCookie('account')
    //         const tokenId = getCookie('vipAdminToken')
    //         const host =
    //             BASE_PATH.isSaas === 2
    //                 ? window.location.origin
    //                 : 'https://vipsitfunds.simu800.com/vipmrp';
    //         const href = `${host}/productSheet/productGoal?companySource=0&companyCode=${companyCode}&simuCompanyCode=${externalCompanyCode}&userCode=${userCode}&tokenId=${tokenId}`;
    //         return (
    //             <a href={href} target="_blank">
    //                 {defaultDom}
    //             </a>
    //         );
    //     }
    //     return bageMenuData[menuItemProps.path] > 0 ? (
    //         <Badge offset={[12, -5]} size="small" count={bageMenuData[menuItemProps.path]}>
    //             <Link to={menuItemProps.path}>{defaultDom}</Link>
    //         </Badge>
    //     ) : (
    //         <Link to={menuItemProps.path}>{defaultDom}</Link>
    //     );
    // };

    useEffect(() => {
        const tokenId = getCookie('vipAdminToken');
        const companyCode = getCookie('companyCode');
        const managerUserId = getCookie('managerUserId');
        window.open(
            `${location.origin}/vipmrp/productSheet/productGoal?${tokenId}&${companyCode}&${managerUserId}`,
        );
    });

    return <section>已跳转页面...</section>;
};

export default Redirect;
