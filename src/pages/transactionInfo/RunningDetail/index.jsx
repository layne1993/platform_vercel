import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
// import { connect } from 'umi';
import Detail from '@/pages/components/CapitalFlow/Detail';
// import TouristList from './components/touristList';
import styles from './index.less';

class RunningDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {
        const {match:{params}} = this.props;
        // console.log(params)
        return (
            <PageHeaderWrapper>
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
export default RunningDetail;

