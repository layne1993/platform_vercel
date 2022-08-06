import React, { PureComponent } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import Tab1 from './components/Tab1';
import { Card } from 'antd';
const operationTabList = [
    {
        key: 'tab1',
        tab: '基本信息'
    },
    {
        key: 'tab2',
        tab: '使用列表'
    }
];

class GeneralDoubleDetails extends PureComponent {
    state = {
        operationKey: 'tab1'
    };

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };


    render() {
        const { operationKey } = this.state;
        const {
            match: { params }
        } = this.props;

        const contentList = {
            tab1: <Tab1 params={params} />
            // tab2: <Tab2 params={params} />,
        };

        return (
            <PageHeaderWrapper title="双录详情" className={styles.pageHeader}>
                <div className={styles.main}>
                    <GridContent>
                        <Card
                            bordered={false}
                            tabList={contentList}
                            onTabChange={this.onOperationTabChange}
                            activeTabKey={operationKey}
                        >
                            {contentList[operationKey]}
                        </Card>
                    </GridContent>
                </div>
            </PageHeaderWrapper>
        );
    }
}
export default GeneralDoubleDetails;