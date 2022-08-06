import React, { PureComponent } from 'react';
import { connect, Link, history } from 'umi';
import { Card, Tabs, Checkbox, Row, Col  } from 'antd';
import OnlineConfig from './onlineConfig';
import OfflineConfig from './offlineConfig';



class nodeInfoConfig extends PureComponent {

    state = {
        tabKey: 0,
        checkedList:[]
    };



    render() {
        return (
            <Tabs
                defaultActiveKey="1"
                style={{backgroundColor: 'white'}}
            >
                <Tabs.TabPane tab="流程节点信息" key="1">
                    <OnlineConfig/>
                </Tabs.TabPane>
                <Tabs.TabPane tab="投资者端发起方式配置" key="2">
                    <OfflineConfig/>
                </Tabs.TabPane>
            </Tabs>
        );
    }

}

export default connect(({ loading }) => ({
    loading: loading.effects['NODE_INFO_CONFIG/queryQualifiedList']
}))(nodeInfoConfig);
