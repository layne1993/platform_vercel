/*
 * @description: 份额列表
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import List from '@/pages/components/MXShare/List';
import styles from './style.less';
import { getPermission } from '@/utils/utils';

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

    render() {
        const { operationKey } = this.state;

        return (
            <PageHeaderWrapper title="份额余额信息列表">
                <GridContent className={styles.tabsCard}>
                    <Card bordered={false}>
                        <List {...getPermission(10700)}/>
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
    Customerinfo
}))(CustomerinfoInfo);
