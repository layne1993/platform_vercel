/*
 * @description: 净值信息
 * @Author: tangsc
 * @Date: 2020-11-02 09:26:50
 */
import React, { Component } from 'react';
import { NetValueList } from '@/pages/product/components';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';

class Tab2 extends Component {
    state = {

    };

    render() {
        const { params } = this.props;
        const { productId } = params;
        return (
            <div className={styles.container}>
                <Card>
                    <NetValueList productId={productId} {...getPermission(30102)} />
                </Card>
            </div>
        );
    }
}
export default Tab2;