/*
 * @description: 交易信息
 * @Author: tangsc
 * @Date: 2020-11-14 13:16:52
 */
import React, { Component } from 'react';
import TransactionInfo from '@/pages/components/Transaction/List'; //申赎确认
import { Card } from 'antd';
import styles from './styles/Tab7.less';
import { getPermission } from '@/utils/utils';
class Tab8 extends Component {
    state = {

    };

    render() {
        const { params } = this.props;
        return (
            <div className={styles.container}>
                <Card>
                    <TransactionInfo params={params} {...getPermission(30107)} />
                </Card>
            </div>
        );
    }
}
export default Tab8;
