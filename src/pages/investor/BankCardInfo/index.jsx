/*
 * @description:银行卡信息变更管理
 * @Author: tangsc
 * @Date: 2020-10-21 10:28:21
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import List from './Components/List';
import { getPermission } from '@/utils/utils';
class BankCardInfo extends PureComponent {
    state = {

    };
    render() {
        return (
            <PageHeaderWrapper title="银行卡信息列表">
                <Card>
                    <List {...getPermission(10100)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default BankCardInfo;
