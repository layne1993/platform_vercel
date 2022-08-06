
import { connect, Link, history } from 'umi';
import { Card, Tabs  } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import Incomplete from '@/pages/processManagement/identify/list/Components/incomplete';
import Done from '@/pages/processManagement/identify/list/Components/done';
import List from '@/pages/processManagement/identify/list/Components/list';
import { getPermission } from '@/utils/utils';



class IdentifyList extends Component {
    state = {
        tabKey: 0
    };
    // componentDidMount(){
    //     console.log(this.props)
    // }

    tabChange = (key) => {
        this.setState({
            tabKey: key
        });
    }

    render() {
        const {tabKey} = this.state;
        const TABLIST = [
            {
                key: 0,
                tab: '未完成',
                render: (props = {pathName:this.props.match.path},) => <Incomplete {...props} {...getPermission(20100)} />
            },
            {
                key: 1,
                tab: '已完成',
                render: (props = {pathName:this.props.match.path}) => <Done key={2} {...props} {...getPermission(20100)} />
            },
            {
                key: 2,
                tab: '全部',
                render: (props = {pathName:this.props.location.path}) => <List key={3} {...props} {...getPermission(20100)} />
            }
        ];
        let element = TABLIST[tabKey * 1].render;

        return (
            <PageHeaderWrapper title="合格投资者申请列表">
                <Card
                    bordered={false}
                    tabList={TABLIST}
                    onTabChange={this.tabChange}
                    activeTabKey={tabKey + ''}
                >
                    {element()}
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ global, loading }) => ({
    global,
    loading: loading.effects['INVESTOR_IDENTIFY/queryQualifiedList']
}))(IdentifyList);
