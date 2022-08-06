/*
 * @description:开放日
 * @Author: tangsc
 * @Date: 2020-10-29 15:35:18
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { OpenDayList } from '@/pages/product/components';
import { getPermission } from '@/utils/utils';

class OpenDay extends PureComponent {
    state = {
    };
    render() {
        return (
            <PageHeaderWrapper title="开放日列表">
                <Card>
                    <OpenDayList {...getPermission(30300)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default OpenDay;
