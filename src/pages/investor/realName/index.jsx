/*
 * @description: 实名信息
 * @Author: yezi
 * @Date: 2020-10-29 13:23:57
 */
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import List from '@/pages/components/MXAuthentication';
import { Card } from 'antd';
import { getPermission } from '@/utils/utils';
class Authentication extends Component {
    state = {}
    render() {
        return (
            <PageHeaderWrapper title="实名信息列表">
                <Card>
                    <List {...getPermission(11000)}/>
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default Authentication;
