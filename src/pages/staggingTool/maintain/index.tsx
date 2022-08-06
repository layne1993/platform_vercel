import React from 'react';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Manager from '../manager';
import Product from '../product';
import Underwriter from '../underwriter';
import Mechanism from '../mechanism';

const { TabPane } = Tabs;
const tabList = [{
    key: 1,
    tab: '配售对象信息维护',
    component: Product
}, {
    key: 2,
    tab: '管理人信息维护',
    component: Manager
}, {
    key: 3,
    tab: '承销商用户名和密码维护',
    component: Underwriter
}, {
    key: 4,
    tab: '机构信息维护',
    component: Mechanism
}];

const Maintain = () => {
    return (
        <PageHeaderWrapper>
            <Card>
                <Tabs>
                    {tabList.map((item) => (
                        <TabPane tab={item.tab} key={item.key}>
                            <item.component></item.component>
                        </TabPane>
                    ))}
                </Tabs>
            </Card>
        </PageHeaderWrapper>
    );
};

export default Maintain;
