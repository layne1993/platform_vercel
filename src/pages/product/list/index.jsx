/*
 * @description: 产品信息管理-列表
 * @Author: tangsc
 * @Date: 2020-10-23 14:57:42
 */
import { Card } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import ProductList from '@/pages/product/list/components/ProductList';
import styles from './style.less';


// console.log(authority)

const operationTabList = [
    {
        key: 'tab1',
        tab: '证券类'
    }
    // {
    //     key: 'tab2',
    //     tab: '股权类'
    // }
];


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
            tab1: <ProductList />
            // tab2: <TouristList />
        };
        return (
            <PageHeaderWrapper title="产品信息列表">

                <GridContent className={styles.tabsCard}>
                    <Card bordered={false} tabList={operationTabList} onTabChange={this.onOperationTabChange}>
                        {contentList[operationKey]}
                    </Card>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
    Customerinfo
}))(CustomerinfoInfo);
