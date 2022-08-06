import { Card } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './style.less';






class OnlineServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }


    render() {

        return (
            <GridContent className={styles.tabsCard}>
                <Card
                    bordered={false}

                >
                </Card>
            </GridContent>
        );
    }
}

export default connect(({ onlineServiceDetail }) => ({
    onlineServiceDetail
}))(OnlineServiceDetail);
