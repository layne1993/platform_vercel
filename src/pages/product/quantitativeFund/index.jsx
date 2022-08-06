/**
 * @description
 * 量化基金
 */
import React, { useState } from 'react';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import CompanyInfo from './companyInfo';
import ProductInfo from './productInfoCon';
import { getPermission } from '@/utils/utils';



const TABLIST = [
    {
        key: '0',
        tab: '公司基本信息',
        // permissionCode: 10910,
        render: (props) => <CompanyInfo {...props} {...getPermission(30800)} />
    },
    {
        key: '1',
        tab: '产品信息维护',
        // permissionCode: 10910,
        render: (props) => <ProductInfo {...props} {...getPermission(30800)} />
    },
];

const QuantitativeFund = () => {
    const [tabKey, setTabKey] = useState(0);
    const [tabIndex, setTabIndex] = useState(0);

    const tabChange = (key) => {
        let nextIndex = tabIndex;
        TABLIST.map((item, index) => {
            if(item.key === key) {
                nextIndex = index;
            }
        });
        setTabKey(key)
        setTabIndex(nextIndex)
    };

    let elementRender = TABLIST.length > 0 ? TABLIST[tabIndex].render : null;
    return <PageHeaderWrapper title="公司设置">
        <Card bordered={false}  activeTabKey={tabKey + ''} tabList={TABLIST} onTabChange={tabChange}>
             {elementRender && elementRender()}
        </Card>
    </PageHeaderWrapper>;
};

export default QuantitativeFund;
