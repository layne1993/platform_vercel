/*
 * @description: 协议模板信息
 * @Author: tangsc
 * @Date: 2020-11-02 11:23:35
 */
import React, { Component } from 'react';
import styles from './styles/Tab2.less';
import TemplateList from '@/pages/components/MXTemplate/List';
import { Card } from 'antd';
import { getPermission } from '@/utils/utils';


class Tab10 extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentWillUnmount() {
        sessionStorage.removeItem('tabTemplate');
    }

    render() {
        const { params, goTab15 } = this.props;
        const { productId } = params;
        return (
            <div className={styles.container}>
                <Card>
                    <TemplateList type="productTab" productId={productId} goTab15={goTab15} {...getPermission(30111)} />
                </Card>
            </div>

        );
    }
}
export default Tab10;
