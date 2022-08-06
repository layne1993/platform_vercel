/*
 * @Author: your name
 * @Date: 2021-05-20 13:30:21
 * @LastEditTime: 2021-06-16 16:07:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \page-tabs-ant-pro4-app-master\src\components\PageTab\RouteWatcher.tsx
 */
import React from 'react';
import { RouteWatcher } from './PageTabs';
import { useIntl } from 'umi';

export default function (props: any) {
    const intl = useIntl();
    const { route } = props;
    if (route.tabLocalId) {
        route.tabLocalName = intl.formatMessage({ id: route.tabLocalId, defaultMessage: route.name });
    }
    return <RouteWatcher {...props} />;
}
