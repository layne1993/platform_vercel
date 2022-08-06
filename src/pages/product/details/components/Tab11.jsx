/*
 * @description: 信披管理
 * @Author: tangsc
 * @Date: 2020-12-23 10:01:07
 */
import React, { Component } from 'react';
import Disclosure from '@/pages/components/MXInformationDisclosure/List';
import { Card } from 'antd';
import styles from './styles/Tab2.less';
import { getPermission } from '@/utils/utils';

class Tab11 extends Component {
    state = {

    };

    render() {
        const { params } = this.props;
        const { productId } = params;
        return (
            <div className={styles.container}>
                <Card>
                    <Disclosure productId={productId}  {...getPermission(30109)} />
                    {/* <OpenDayList
                        productId={productId}
                    /> */}
                </Card>
            </div>
        );
    }
}
export default Tab11;
