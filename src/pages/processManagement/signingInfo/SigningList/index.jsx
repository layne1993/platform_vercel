/*
 * @description:认申赎流程管理列表
 * @Author: tangsc
 * @Date: 2020-10-27 16:55:26
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
// import TouristList from './components/touristList';
import styles from './index.less';
import MXSignInfoList from '@/pages/components/MXSignInfo/List';

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
            <PageHeaderWrapper>
                <MXSignInfoList />
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
}))(SigningList);
