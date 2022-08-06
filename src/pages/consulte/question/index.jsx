import React, { useState } from 'react';
import { connect } from 'umi';
import { Tabs, Card } from 'antd';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import CommonQuestion from './components/commonQuestion/index';
import { questionTabs } from '../data';
import _styles from './styles.less';

const { TabPane } = Tabs;

function Question(props){

    return <PageHeaderWrapper title="常见问题管理">
        <GridContent>
            <Card>
                <Tabs>
                    {
                        questionTabs.map((item)=><TabPane tab={item.title} key={item.key}>
                            <CommonQuestion />
                        </TabPane>)
                    }
                </Tabs>
            </Card>
        </GridContent>

    </PageHeaderWrapper>;

}

export default connect(({  })=>({

}))(Question);