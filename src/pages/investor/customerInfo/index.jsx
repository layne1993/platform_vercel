import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import QualifiedInvestor from './components/qualifiedInvestor';
// import TouristList from './components/touristList';
import styles from './style.less';


class CustomerinfoInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            operationKey: 'tab1'
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'Customerinfo/queryServer'
        });
    }

    onOperationTabChange = (key) => {
        this.setState({
            operationKey: key
        });
    };

    render() {
        const { operationKey } = this.state;
        const contentList = {
            tab1: <QualifiedInvestor />
            // tab2: <TouristList />
        };
        return (
            <PageHeaderWrapper title="客户信息列表">
                <GridContent className={styles.tabsCard}>
                    <Card
                        bordered={false}
                        // tabList={operationTabList}
                        // onTabChange={this.onOperationTabChange}
                    >
                        <QualifiedInvestor />
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
    Customerinfo
}))(CustomerinfoInfo);
