import { Card } from 'antd';
import { GridContent } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import ExpressInformationTracking from '@/pages/components/ExpressInformationTracking';
import styles from './style.less';

class ExpressInformation extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {

    }


    render() {

        return (
            <PageHeaderWrapper>
            <GridContent className={styles.tabsCard}>
                <ExpressInformationTracking
                    // code={40100} // 权限code
                    // source={1} // 生命周期或者打新流程
                    // sourceId={processId}
                    // actionId={baseInfo.lifecycleNodeDataId}
                    id={'package-info'}
                />
            </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ expressInformation }) => ({
    expressInformation
}))(ExpressInformation);
