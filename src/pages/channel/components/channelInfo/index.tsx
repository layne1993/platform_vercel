import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card, Form, Input, notification, Spin, Select, Row, Col, Statistic, Radio, Button } from 'antd';
import { connect, history } from 'umi';
import type { Dispatch } from 'umi';
import moment from 'moment';
import { CHANNELTYPE } from '@/utils/publicData';
import { listToMap, objStringAttributeTrim } from '@/utils/utils';
import values from 'lodash-es/values';


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};


interface newFLowProps {
    params: any,
    dispatch: Dispatch,
    loading: boolean,
    submitLoading: boolean
}


const channelInfo: FC<newFLowProps> = (props) => {
    const { params, dispatch, loading, submitLoading } = props;
    const [form] = Form.useForm();
    const [channelInfo, setChannelInfo] = useState<any>({});
    const [channelManagerList, setChannelManagerList] = useState<any[]>([]);                           // 承销商list



    // 获取渠道维护人list
    const getChannelManagerList = () => {
        dispatch({
            type: 'global/getManagerList',
            payload: { pageSize: 99999, pageNum: 1 },
            callback: ({ code, data = {}, message }: any) => {
                if (code === 1008) {
                    setChannelManagerList(data.list || []);
                } else {
                    const txt = message || data || '获取渠道维护人失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    /**
     * @description 获取渠道信息
     */
    const getChannelInfo = () => {
        if (params.channelId === '0') return;
        dispatch({
            type: 'CHANNEL/channelInfo',
            payload: {
                ...params
            },
            callback: ({ code, data, message }: any) => {
                if (code === 1008 && data) {
                    form.setFieldsValue({
                        ...data
                    });
                    setChannelInfo(data || {});
                } else {
                    const txt = message || data || '获取渠道信息失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(getChannelInfo, []);
    useEffect(getChannelManagerList, []);



    /**
     * @description 新建
     */
    const crate = (values) => {
        dispatch({
            type: 'CHANNEL/createOrEdit',
            payload: {
                ...channelInfo,
                ...objStringAttributeTrim(values)
            },
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    // history.goBack();
                    history.push(`/channel/list/detail/${data.channelId}`)
                    openNotification('success', '提醒', '保存成功');
                } else {
                    const txt = message || data || '保存失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };



    return (
        <Card>
            <Spin spinning={loading}>
                {/* {params.channelId &&
                    <Row>
                        <Col span={5}>
                            <Statistic
                                title="当前合作投资者总数"
                                value={2}
                            />
                        </Col>
                        <Col span={5}>
                            <Statistic
                                title="历史合作投资者总数"
                                value={2}
                            />
                        </Col>
                        <Col span={5}>
                            <Statistic
                                title="当前合作投资者总市值（万）"
                                value={2}
                            />
                        </Col>
                        <Col span={5}>
                            <Statistic
                                title="市值占比"
                                value={2}
                            />
                        </Col>
                        <Col span={4}>
                            <Statistic
                                title="市值占比排名"
                                value={2}
                            />
                        </Col>
                    </Row>
                } */}
                <Form
                    {...formItemLayout}
                    form={form}
                    onFinish={crate}
                >
                    <h3>基本信息</h3>
                    <Form.Item
                        label="渠道名称"
                        name="channelName"
                        rules={[{ required: true, message: '请输入' }]}
                        extra={'渠道名称不可重复'}
                    >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="渠道类型"
                        name="channelType"
                        rules={[{ required: true, message: '请选择' }]}
                    >
                        <Radio.Group>
                            {
                                CHANNELTYPE.map((item) => (
                                    <Radio key={item.value} value={item.value}>{item.label}</Radio>
                                ))
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="渠道维护人"
                        name="channelMaintenance"
                        rules={[{ required: false, message: '请输入' }]}
                        extra={'可多选，管理人下所有的账户，不区分角色'}
                    >
                        <Select
                            placeholder="请选择"
                            showSearch
                            allowClear
                            mode="multiple"
                            filterOption={(input, option) =>
                                option.children && option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                channelManagerList.map((item) => {
                                    return <Select.Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Select.Option>;
                                })
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="联系手机"
                        name="mobile"
                    >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="联系座机"
                        name="landline"
                    >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="联系地址"
                        name="address"
                    >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="联系邮箱"
                        name="email"
                        rules={[
                            {
                                type: 'email',
                                message: '请输入正确的邮箱！'
                            }
                        ]}
                    >
                        <Input placeholder="请输入" allowClear />
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="note"
                    >
                        <Input.TextArea placeholder="请输入备注" allowClear />
                    </Form.Item>
                    <h3>匹配规则</h3>

                    <Form.Item
                        label="编码对应规则"
                        name="encodingRules"
                        rules={[{ required: true, message: '请输入' }]}
                        extra={<>
                            <div>例如0543，多个编码用英文","分割</div>
                            <div>特殊编号：</div>
                            <div>1、输入[null]，是指匹配认申赎确认中，渠道编号为空的记录信息。即如果那条认申赎确认渠道编号没有，就会对应成当前渠道；</div>
                            <div>2、输入[notnull]，是指匹配认申赎确认中，渠道编号不为空的记录信息，并且不能匹配到已维护渠道的记录。即如果那条认申赎确认渠道编号有，但是不能匹配到已维护的渠道，那么就会对应成当前渠道；</div>
                        </>}
                    >
                        <Input.TextArea placeholder="请输入托管内的编码对应规则" allowClear />
                    </Form.Item>
                    <Row justify="center">
                        <Button
                            loading={submitLoading}
                            type="primary"
                            htmlType="submit"
                        >保存</Button>
                    </Row>
                </Form>
            </Spin>
        </Card>

    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['CHANNEL/channelInfo'],
    submitLoading: loading.effects['CHANNEL/createOrEdit']
}))(channelInfo);

channelInfo.defaultProps = {
    params: {},
    loading: false,
    submitLoading: false
};
