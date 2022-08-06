/**
 * 份额确认书, 报表模板
 */
import React, { useState, useEffect } from 'react';
import {
    Form,
    Card,
    Tabs,
    Row,
    Space,
    Button,
    DatePicker,
    Upload,
    Modal,
    notification,
    Collapse
} from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import request from '@/utils/rest';
import {getCookie} from '@/utils/utils';
import moment from 'moment';
import Template from './components/template/index';
import sh from '@/assets/sh.jpg';
import rsg from '@/assets/rsg.jpg';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const reportTemplate = (props) =>{



    return (
        <Card>
            <Collapse defaultActiveKey={['1']}>
                <Panel header="模板1" key="1">
                    <Tabs defaultActiveKey="1" centered>
                        <TabPane tab="认申购确认书" key="1">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Template
                                    imgUrl={rsg}
                                    jsonKey="subscribeCustomizeSetting"
                                    defaultParams={
                                        {
                                            title: '基金产品份额确认书',
                                            summary: '<p>尊敬的【客户名称】</p><p><br/>您好，感谢您认/申购【产品全称】，您的认/申购资金已划入基金托管户，基金管理人与基金托管人现将该认购资金按基金合同约定，确认您认购的份额如下：</p>'
                                        }
                                    }
                                />
                            </div>
                        </TabPane>
                        <TabPane tab="赎回确认书" key="2">
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <Template
                                    imgUrl={sh}
                                    jsonKey="redeemCustomizeSetting"
                                    defaultParams={
                                        {
                                            title: '基金产品赎回确认书',
                                            summary: '<p>尊敬的【客户名称】</p><p><br/>您好，根据基金份额持有人向基金管理人提交的《赎回申请书》，本基金的管理人与托管人将份额持有人申请赎回单位份数按照基金合同相关规定予以赎回，并确认已将赎回资金向受益人指定的账户划拨：</p>'
                                        }
                                    }
                                />
                            </div>
                        </TabPane>
                    </Tabs>
                </Panel>
            </Collapse>
        </Card>
    );

};
export default reportTemplate;

reportTemplate.defaultProps = {
    params: {},
    closeModal: ()=> {}
};
