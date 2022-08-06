import React, { PureComponent } from 'react';
import { connect, Link, history } from 'umi';
import { Card, Tabs  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import _styles from './styles.less';
import NodeInfoConfig from './nodeInfoConfig';


class IdentifyConfig extends PureComponent {

    state = {
        tabKey: 0
    };



    render() {
        return (
            <PageHeaderWrapper title="合格投资者认定流程配置">
                <Card>
                    <NodeInfoConfig/>
                </Card>
            </PageHeaderWrapper>
        );
    }

}

export default connect(({ loading }) => ({
    loading: loading.effects['IDENTIFY_CONFIG/queryQualifiedList']
}))(IdentifyConfig);
