/*
 * @description: 开放日信息
 * @Author: tangsc
 * @Date: 2020-11-02 11:15:10
 */
import React, { Component } from 'react';
import { OpenDayList } from '@/pages/product/components';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';

class Tab12 extends Component {
    state = {

    };

    componentWillUnmount() {
        sessionStorage.removeItem('tabOpenDay');
    }

    render() {
        const { params } = this.props;
        const { productId } = params;
        return (
            <div className={styles.container}>
                <Card>
                    <OpenDayList
                        productId={productId}
                        {...getPermission(30104)}
                    />
                </Card>
            </div>
        );
    }
}
export default Tab12;



