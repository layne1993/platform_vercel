import { Card, Tabs  } from 'antd';
import { GridContent, PageHeaderWrapper} from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import DividendsList from './list';
import DividendStatistics from './dividendStatistics';
import { getPermission } from '@/utils/utils';

const { TabPane } = Tabs;
const tabList = [
    {
        key: 'tab1',
        tab: '产品分红统计'
    },
    {
        key: 'tab2',
        tab: '产品分红明细查询'
    }
];


class CustomerinfoInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            key: 'tab1',
            information:{}
        };
    }


    componentDidMount(){

    }

    onTabChange = (key, type) => {
        console.log(key, type);
        this.setState({ [type]: key, information:undefined });
    }
    viewDetails = (params)=>{
        this.setState({
            key:'tab2',
            information:params
        });

    }

    render() {
        const contentList = {
            tab1: <DividendStatistics {...getPermission(10600)} viewDetails={this.viewDetails}/>,
            tab2: <DividendsList {...getPermission(10600)} information={this.state.information}/>
        };
        return (
            <PageHeaderWrapper title="分红信息查询">
                <GridContent>

                    <Card
                        style={{ width: '100%' }}
                        tabList={tabList}
                        activeTabKey={this.state.key}
                        onTabChange={(key) => {
                            this.onTabChange(key, 'key');
                        }}
                    >
                        {contentList[this.state.key]}
                    </Card>
                    {/* <Card
                        bordered={false}
                    >
                        <Tabs style={{position:'relative'}} defaultActiveKey="1" onChange={this.tabCallback}>
                            <TabPane tab="产品分红统计" key="1">

                                <DividendStatistics {...getPermission(10600)} />
                            </TabPane>
                            <TabPane tab="产品分红明细查询" key="2">
                                <DividendsList {...getPermission(10600)} />
                            </TabPane>
                        </Tabs>
                    </Card> */}
                </GridContent>

            </PageHeaderWrapper>
        );
    }
}

export default connect(({ Customerinfo }) => ({
    Customerinfo
}))(CustomerinfoInfo);
