/*
 * @description: 净值数据管理
 * @Author: tangsc
 * @Date: 2020-10-29 15:35:30
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { NetValueList } from '@/pages/product/components';
import { getPermission } from '@/utils/utils';

class NetValueData extends PureComponent {
    state = {
    };
    render() {
        return (
            <PageHeaderWrapper title="净值列表">
                <Card>
                    <NetValueList {...getPermission(30200)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default NetValueData;