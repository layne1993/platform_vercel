/*
 * @description: 份额列表
 * @Author: tangsc
 * @Date: 2020-11-04 13:51:30
 */
import React, { PureComponent } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MXShareDetails from '@/pages/components/MXShare/Details';
class ShareDetails extends PureComponent {
    state = {
    };

    render() {

        return (
            <PageHeaderWrapper title="份额明细">
                <MXShareDetails />
            </PageHeaderWrapper>

        );
    }
}
export default ShareDetails;
