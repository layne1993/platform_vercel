/*
 * @description: 认申赎流程
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:19
 */
import React, { Component } from 'react';
import MXSignInfoListTab from '@/pages/components/MXSignInfo/List/Components/Tab';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';
class Tab6 extends Component {
    state = {

    };

    componentWillUnmount() {
        sessionStorage.removeItem('product');
    }


    render() {
        const { params } = this.props;
        const { productId } = params;

        return (
            <div className={styles.container}>
                <Card>
                    <MXSignInfoListTab type="productTab" productId={productId} signType="all" {...getPermission(30106)} />
                </Card>
            </div>
        );
    }
}
export default Tab6;
