/*
 * @description: 分红信息
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:24
 */
import React, { Component } from 'react';
import DividendsList from '@/pages/dividends/dividendsList/list';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';
class Tab9 extends Component {
    state = {

    };

    render() {
        const { params } = this.props;
        return (
            <div className={styles.container}>
                <Card>
                    <DividendsList
                        params={params}
                        {...getPermission(30108)}
                    />
                </Card>
            </div>
        );
    }
}
export default Tab9;
