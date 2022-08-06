import React from 'react';
import { Card, Tabs } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPermission } from '@/utils/utils';
import Calendar from './components/Calendar';
import TodoList from './components/TodoList';

const { TabPane } = Tabs;
const tabList = [{
    key: 1,
    tab: '打新日历',
    component: Calendar
}, {
    key: 2,
    tab: '当日待办',
    component: TodoList
}];

const overView = () => {
    return (
        <PageHeaderWrapper>
            {/* TODO 保留这个，getPermission的逻辑 */}
            {/* <Card title="打新流程列表" className={_styles.cardExtra}>
                <FlowList {...getPermission(70100)} />
            </Card> */}
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

export default overView;
