import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
// import { connect } from 'umi';
import Detail from '@/pages/components/Transaction/Detail';
// import TouristList from './components/touristList';
import styles from './index.less';

class TransactionDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        const {match:{params}} = this.props;
        return (
            <PageHeaderWrapper title="交易确认明细详情">
                <GridContent className={styles.tabsCard}>
                    <Card bordered={false}>
                        <Detail params={params}/>
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

// export default connect(({ Customerinfo }) => ({
// }))(SigningList);
export default TransactionDetail;

