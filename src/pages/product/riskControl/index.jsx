/*
 * @description: 产品风控提醒列表
 * @Author: tangsc
 * @Date: 2021-02-01 15:30:16
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { RiskControlList } from '@/pages/product/components';
import { getPermission } from '@/utils/utils';

class RiskControl extends PureComponent {
    state = {
    };
    render() {
        return (
            <PageHeaderWrapper title="风控信息列表">
                <Card>
                    <RiskControlList {...getPermission(30600)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default RiskControl;
