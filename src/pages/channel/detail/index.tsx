/*
 * @Descripttion:渠道详情
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 14:33:10
 * @LastEditTime: 2021-06-18 14:21:05
 */

import React, { useState, useEffect, Suspense } from 'react';
import type { FC } from 'react';
import { Card, Spin } from 'antd';
import { connect, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import _styles from './styles.less';
import ChannelInfo from './../components/channelInfo';
import ChannelInvestor from './../components/channelInvestor';
import ChannelProduct from './../components/channelProduct';
import ChnnelTrade from '@/pages/components/Transaction/List';
import { getPermission, getTabs, getParams } from '@/utils/utils';

const sourceTabs = [
    {
        key: '0',
        tab: '基本要素',
        permissionCode: 10101,
        render: (props) => <ChannelInfo {...props} />
    },
    {
        key: '1',
        tab: '渠道推荐投资者',
        permissionCode: 10101,
        render: (props) => <ChannelInvestor {...props} />
    },
    {
        key: '2',
        tab: '渠道对应产品',
        permissionCode: 10102,
        render: (props) => <ChannelProduct {...props} />
    },
    {
        key: '3',
        tab: '渠道对应交易记录',
        permissionCode: 10102,
        render: (props) => <ChnnelTrade {...props} />
    }
];

const operationTabList = getTabs(sourceTabs);

interface channelDetailProps {
    params: any,
    dispatch: any,
    tabIndex: number,
    match:any,
    channelId:string,
}



const channelDetail: FC<channelDetailProps> = (props) => {
    const { params, match, dispatch } = props;
    const [channelId, setChannelId] = useState<string>(match.params.channelId);                   // 参数信息
    const [tabList, setTabList] = useState<any[]>((channelId === '0' && operationTabList.length > 0) ? [operationTabList[0]] : operationTabList);                // tab数组
    const [tabIndex, setTabIndex] = useState(0);                                    // 当前tab索引
    const { channelName } = getParams();

    console.log('====================================');
    console.log(props);
    console.log('====================================');
    /**
     * tab切换点击事件
     * @param {*} key
     */
    const onOperationTabChange = (key) => {
        let nextTabIndex = tabIndex;
        tabList.map((item, index) => {
            if (item.key === key) {
                nextTabIndex = index;
            }
        });
        // dispatch({
        //     type: 'CHANNEL_DETAIL/setTabIndex',
        //     payload: nextTabIndex
        // });
        setTabIndex(nextTabIndex);
    };

    // useEffect(() => {
    //     if (history.action === 'PUSH') {
    //         dispatch({
    //             type: 'CHANNEL_DETAIL/init',
    //             payload: 0
    //         });
    //     }
    // }, []);



    const element = (agrs) => {
        if (tabList.length === 0) return null;
        const elementRender = tabList[tabIndex * 1].render;
        return elementRender(agrs);
    };

    return (
        <Suspense fallback={<Spin spinning></Spin>}>
            <PageHeaderWrapper
                title={
                    <>
                        渠道详情{' '}
                        {channelName}
                    </>
                }
            >
                <div className={_styles.main}>
                    {/* <GridContent> */}
                    <Card
                        bordered={false}
                        tabList={tabList}
                        onTabChange={onOperationTabChange}
                        activeTabKey={tabList[tabIndex]['key']}
                    >
                        {element({ params: { ...params, channelId: channelId } })}
                    </Card>
                    {/* </GridContent> */}
                </div>
            </PageHeaderWrapper>
        </Suspense>
    );
};


export default connect(({ CHANNEL_DETAIL }) => ({
    ...CHANNEL_DETAIL
}))(channelDetail);

channelDetail.defaultProps = {
    params: {}
};
