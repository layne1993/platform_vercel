/*
 * @description: 资产证明管理
 * @Author: tangsc
 * @Date: 2020-10-29 13:23:57
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import List from './components/List';
import { Card } from 'antd';
import { getPermission } from '@/utils/utils';
class AssetsProve extends Component {
    state = {}
    render() {
        return (
            <PageHeaderWrapper title="资产证明信息列表">
                <Card>
                    <List {...getPermission(11000)}/>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default AssetsProve;
