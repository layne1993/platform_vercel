/*
 * @description: 产品配置管理
 * @Author: tangsc
 * @Date: 2020-12-23 16:42:38
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import styles from './index.less';
import Tab1 from './Components/Tab1';
import Tab2 from './Components/Tab2';
import Tab3 from './Components/Tab3';
import { getPermission } from '@/utils/utils';

const operationTabList = [
    {
        key: 'tab1',
        tab: '默认产品配置'
    },
    // {
    //     key: 'tab2',
    //     tab: '产品设置信息'
    // },
    {
        key: 'tab3',
        tab: '银行卡变更材料维护'
    }
];
class ProductConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationKey: 'tab1'
        };
        this.tabRef = null;
    }

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };

    render() {
        const { operationKey } = this.state;
        const contentList = {
            tab1: <Tab1 {...getPermission(30700)} />,
            // tab2: <Tab2 />,
            tab3: <Tab3  {...getPermission(30700)} />
        };
        return (
            <PageHeaderWrapper title="产品配置管理">
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
            </PageHeaderWrapper>

        );
    }
}

export default ProductConfig;
