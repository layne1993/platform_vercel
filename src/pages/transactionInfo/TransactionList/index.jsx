
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
// import { connect } from 'umi';
import List from '@/pages/components/Transaction/List';
// import TouristList from './components/touristList';
import styles from './index.less';
import { getPermission } from '@/utils/utils';

class TransactionList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {

        return (
            <PageHeaderWrapper title="认申赎确认查询">
                <GridContent className={styles.tabsCard}>
                    <Card bordered={false}>
                        <List {...getPermission(10500)} />
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

// export default connect(({ Customerinfo }) => ({
// }))(SigningList);
export default TransactionList;
