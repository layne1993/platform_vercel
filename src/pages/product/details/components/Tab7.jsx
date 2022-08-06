/*
 * @description: 份额确认书
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:35
 */
import React, { Component } from 'react';
import styles from './styles/Tab2.less';
import ShareConfirmation from '@/pages/share/shareConfirmation/list';
import { Card } from 'antd';
import { getPermission } from '@/utils/utils';
class Tab7 extends Component {


    render() {
        const { params } = this.props;
        return (
            <div className={styles.container}>
                <Card>
                    <ShareConfirmation params={params}  {...getPermission(30110)} />
                </Card>
            </div>

        );
    }
}
export default Tab7;