/*
 * @description: 预约信息
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:13
 */
import React, { Component } from 'react';
import { ReservationList } from '@/pages/product/components';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';

class Tab5 extends Component {
    state = {

    };

    render() {
        const { params } = this.props;
        const { productId } = params;
        return (
            <div className={styles.container}>
                <Card>
                    <ReservationList productId={productId} {...getPermission(30105)} />
                </Card>
            </div>
        );
    }
}
export default Tab5;