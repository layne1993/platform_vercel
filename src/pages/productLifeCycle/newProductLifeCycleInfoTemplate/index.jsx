/*
 * @description: 新建模板
 * @Author: tangsc
 * @Date: 2021-03-12 09:13:27
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import Tab1 from './Components/Tab1';



class ProductLifeCycleInfoTemplate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationKey: 'tab1',
            tabList: []
        };
    }

    componentDidMount() {
        this.tabAuthSetting();
    }

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };

    tabAuthSetting = () => {
        let tabList = [];
        tabList.push({
            key: 'tab1',
            tab: '基本要素'
        });
        this.setState({
            tabList
        });
    }
    render() {
        const { operationKey, tabList } = this.state;
        const { match: { params } } = this.props;
        const contentList = {
            tab1: <Tab1 params={params} />
        };
        return (
            <PageHeaderWrapper title="模板信息">
                <GridContent className={styles.tabsCard}>
                    <Card
                        bordered={false}
                        tabList={tabList}
                        onTabChange={this.onOperationTabChange}
                        activeTabKey={operationKey}
                    >
                        {contentList[operationKey]}
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ productLifeCycleInfoTemplate }) => ({
    productLifeCycleInfoTemplate
}))(ProductLifeCycleInfoTemplate);
