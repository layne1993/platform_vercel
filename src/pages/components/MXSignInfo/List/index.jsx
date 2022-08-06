/*
 * @description: 列表展示
 * @Author: tangsc
 * @Date: 2020-10-27 16:56:52
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component, forwardRef } from 'react';
import { connect } from 'umi';
import Tab from './Components/Tab';
import styles from './index.less';
import { getPermission } from '@/utils/utils';

const operationTabList = [
    {
        key: 'tab1',
        tab: '未完成'
    },
    {
        key: 'tab2',
        tab: '已完成'
    },
    {
        key: 'tab3',
        tab: '无效签约'
    },
    {
        key: 'tab4',
        tab: '全部'
    }
];
class MXSignInfoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationKey: 'tab1'
        };
        this.tabRef = null;
    }

    componentDidMount() {
        let key = window.sessionStorage.getItem('processTabKey');
        // console.log('key', key);
        if (key) {
            this.onOperationTabChange(key);
        } else {
            this.onOperationTabChange('tab1');
        }

    }

    componentWillUnmount() {
        window.sessionStorage.removeItem('processTabKey');
    }

    onOperationTabChange = (key) => {
        window.sessionStorage.setItem('processTabKey', key);
        this.setState({
            operationKey: key
        }, () => {
            if (this.tabRef) {
                this.tabRef.getWrappedInstance().search();
                this.tabRef.getWrappedInstance().reset();
            }
        });
    };

    render() {
        const { operationKey } = this.state;
        const contentList = {
            tab1: <Tab signType="notFinished" ref={(self) => { this.tabRef = self; }} {...getPermission(20100)} />,
            tab2: <Tab signType="finished" ref={(self) => { this.tabRef = self; }} {...getPermission(20100)} />,
            tab3: <Tab signType="invalid" ref={(self) => { this.tabRef = self; }} {...getPermission(20100)} />,
            tab4: <Tab signType="all" ref={(self) => { this.tabRef = self; }} {...getPermission(20100)}/>
        };
        return (
            <GridContent className={styles.tabsCard}>
                <Card
                    bordered={false}
                    tabList={operationTabList}
                    onTabChange={this.onOperationTabChange}
                    activeTabKey={operationKey}
                >
                    {contentList[operationKey]}
                </Card>
            </GridContent>
        );
    }
}

export default connect(({ signInfoList }) => ({
    signInfoList
}))(MXSignInfoList);