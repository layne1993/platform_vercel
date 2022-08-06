/*
 * @description:认申赎流程管理列表
 * @Author: tangsc
 * @Date: 2020-10-27 16:55:26
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import List from '@/pages/transactionInfo/OrderList/Components/List';
// import TouristList from './components/touristList';
import styles from './index.less';
import { getPermission } from '@/utils/utils';

class SigningList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
    }

    render() {

        return (
            <PageHeaderWrapper title="认申赎下单查询">
                <GridContent className={styles.tabsCard}>
                    <Card bordered={false}>
                        <List {...getPermission(10400)}/>
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
}))(SigningList);
