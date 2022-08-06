/*
 * @Author: your name
 * @Date: 2021-05-23 20:35:40
 * @LastEditTime: 2021-10-11 09:18:03
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\accountSettings\company\index.tsx
 */

import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import BasicInfo from './components/BasicInfo';
import RealnameInfo from './components/realNameInfo';
import SealInfo from './components/sealInfo';
import SignetInfo from './components/SignetInfo';
import { getPermission } from '@/utils/utils';
import { Card, Tabs } from 'antd';
const { TabPane } = Tabs;
import { Dispatch } from 'umi';

interface CompanyPro {
    dispatch: Dispatch;
    loading: boolean;
    loading2: boolean;
    loading3: boolean;
}


const CompanySetting: React.FC<CompanyPro> = (props) => {

    const { authEdit } = getPermission(123000);
    const [tabKey, setTabKey] = useState<string>('1');

    const _tabChange = (key: string) => {
        setTabKey(key);
    };

    return (
        <PageHeaderWrapper title="公司设置">
            <Card bordered={false}>
                <Tabs defaultActiveKey="1" onChange={_tabChange}>
                    <TabPane tab="基本信息" key="1">
                        {tabKey === '1' && <BasicInfo />}
                    </TabPane>
                    <TabPane tab="实名信息管理" key="2">
                        {tabKey === '2' && <RealnameInfo authEdit={authEdit} />}
                    </TabPane>
                    {/* <TabPane tab="印章体系管理" key="3">
                        {tabKey === '3' && <SealInfo />}
                    </TabPane>
                    <TabPane tab="盖章体系管理" key="4">
                        {tabKey === '4' && <SignetInfo />}
                    </TabPane> */}
                </Tabs>

            </Card>

        </PageHeaderWrapper>
    );
};

export default connect(({ companySetting, loading }) => ({
    companySetting,
    loading: loading.effects['companySetting/saveInfo'],
    loading2: loading.effects['companySetting/renderLogo'],
    loading3: loading.effects['risk/deleteFile']
}))(CompanySetting);
