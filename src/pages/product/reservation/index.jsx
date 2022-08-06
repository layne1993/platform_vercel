/*
 * @description: 产品预约管理
 * @Author: tangsc
 * @Date: 2020-10-29 15:35:13
 */
import React, { PureComponent } from 'react';
import { Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ReservationList } from '@/pages/product/components';
import { getPermission } from '@/utils/utils';

class Reservation extends PureComponent {
    state = {
    };
    render() {
        return (
            <PageHeaderWrapper title="产品预约列表">
                <Card>
                    <ReservationList {...getPermission(30500)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default Reservation;