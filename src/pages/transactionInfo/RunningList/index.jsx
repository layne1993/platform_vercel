
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
// import { connect } from 'umi';
import List from '@/pages/components/CapitalFlow/List';
// import TouristList from './components/touristList';
import styles from './index.less';
import { getPermission } from '@/utils/utils';

class RunningList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    // componentDidMount() {
    // }

    render() {

        return (
            <PageHeaderWrapper title="资金流水列表">
                <GridContent className={styles.tabsCard}>
                    <Card bordered={false}>
                        <List {...getPermission(10300)}/>
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

// export default connect(({ Customerinfo }) => ({
// }))(SigningList);
export default RunningList;
