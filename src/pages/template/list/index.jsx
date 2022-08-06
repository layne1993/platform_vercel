import { Card } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getPermission } from '@/utils/utils';
import TemplateList from '@/pages/components/MXTemplate/List';
class ProtocolTemplate extends Component {
    render() {
        return (
            <PageHeaderWrapper>
                <Card bordered={false}>
                    <TemplateList type="templateType" {...getPermission(60100)} />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default ProtocolTemplate;
