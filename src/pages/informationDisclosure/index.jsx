/*
 * @description: 信披文件管理
 * @Author: tangsc
 * @Date: 2021-01-20 15:53:57
 */
import React, { PureComponent } from 'react';
import { Card, Tooltip } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Disclosure from '@/pages/components/MXInformationDisclosure/List';
import { InfoCircleOutlined } from '@ant-design/icons';
import { getPermission } from '@/utils/utils';

class InformationDisclosure extends PureComponent {
    state = {
    };
    render() {
        return (
            <PageHeaderWrapper title={<span>信披提醒列表 <Tooltip placement="top" title={'该信披提醒指针对管理人进行提醒，及时处理信披事务'}><InfoCircleOutlined /></Tooltip></span>}>
                <Card>
                    <Disclosure {...getPermission(20300)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}
export default InformationDisclosure;
