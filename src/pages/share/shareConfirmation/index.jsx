/* eslint-disable no-undef */
/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-08-02 10:55:11
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import List from './list';
import TemplateList from './templateList';
import ReportTemplate from './reportTemplate';
import { getTabs, getPermission } from '@/utils/utils';

const sourceTabs = [
    {
        key: '0',
        tab: '份额确认书列表',
        permissionCode: 10910,
        render: (props) => <List {...props} {...getPermission(10910)} />
    },
    {
        key: '1',
        tab: '份额确认书自动生成模板',
        permissionCode: 10910,
        render: (props) => <ReportTemplate {...props} {...getPermission(10910)} />
    },
    {
        key: '2',
        tab: '份额确认书批量上传文件名解析规则配置',
        permissionCode: 10920,
        render: (props) => <TemplateList {...props} {...getPermission(10920)} />
    }
];

const TABLIST = getTabs(sourceTabs);

export default class FundReporting extends PureComponent {
    state= {
        tabKey: TABLIST.length > 0 ? TABLIST[0]['key'] : '',
        tabIndex: 0
    }


    tabChange = (key) => {
        let {tabIndex} = this.state;
        TABLIST.map((item, index) => {
            if(item.key === key) {
                tabIndex = index;
            }
        });
        this.setState({
            tabKey: key,
            tabIndex
        });
    };


    render() {

        const { tabKey, tabIndex } = this.state;

        let elementRender = TABLIST.length > 0 ? TABLIST[tabIndex].render : null;

        return (
            <PageHeaderWrapper title={'份额确认书管理'}>
                <Card bordered={false} tabList={TABLIST} activeTabKey={tabKey + ''} onTabChange={this.tabChange}>
                    {elementRender && elementRender({tabChange: this.tabChange})}
                </Card>
            </PageHeaderWrapper>
        );
    }
}
