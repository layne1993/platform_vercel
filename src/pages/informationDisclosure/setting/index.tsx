/*
 * @Descripttion:信披配置
 * @version:
 * @Author: yezi
 * @Date: 2021-06-04 13:22:15
 * @LastEditTime: 2021-07-22 17:57:57
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { connect, history, Link } from 'umi';
import { Card, Form, Row, Col, Radio, Button, Spin, notification, Input, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import { getPermission } from '@/utils/utils';

import previewText from '@/assets/previewText.gif';


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const Setting: FC<any> = (props) => {
    const { authEdit, loading, saveLoading, dispatch } = props;
    const [form] = Form.useForm();
    const [radio, setRadio] = useState(2);
    const [settingInfo, setSettingInfo] = useState<{ [key: string]: string }>({});
    const [showImg, setShowImg] = useState<boolean>(false);

    // 获取配置
    const getSetting = () => {
        dispatch({
            type: 'INFORMATION_SETTING/getSetting',
            payload: {},
            callback: ({ code, data, message }) => {
                if (code === 1008 && data) {
                    form.setFieldsValue({
                        ...data
                    });
                    if (data.allConsignment === 1) {
                        setRadio(1);
                    }
                    setSettingInfo(data);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(getSetting, []);

    // 保存
    const onFinish = (values) => {
        dispatch({
            type: 'INFORMATION_SETTING/createOrEdit',
            payload: {
                ...settingInfo,
                ...values
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    const radioChange = (e) => {
        const val = e.target.value;
        setRadio(val);
        if (val === 1) {
            form.setFieldsValue({ partConsignment: 1 });
        }
    };


    return (
        <PageHeaderWrapper
            title="信披配置"
        >
            <Card title="直销、代销投资者信披配置">
                <Spin spinning={loading}>
                    <Form
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row>
                            <Col span={12}>
                                <Form.Item
                                    label="投资者全部代销允许登录"
                                    name="allConsignment"
                                    rules={[{ required: false, message: '请选择' }]}
                                    extra="默认为是"
                                >
                                    <Radio.Group onChange={radioChange}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={2}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="投资者部分代销允许登录"
                                    name="partConsignment"
                                    rules={[{ required: false, message: '请选择' }]}
                                    extra="指投资者部分产品是通过直销购买的，默认为是"
                                >
                                    <Radio.Group disabled={radio === 1}>
                                        <Radio value={1}>是</Radio>
                                        <Radio value={2}>否</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="投资者个人中心可看产品范围"
                                    name="productScope"
                                    rules={[{ required: false, message: '请选择' }]}
                                    extra="默认为全部可看"
                                >
                                    <Radio.Group>
                                        <Radio value={1}>全部可看</Radio>
                                        <Radio value={2}>仅可看直销部分</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="代销投资者允许在线预约与认申赎"
                                    name="onlineContract"
                                    rules={[{ required: false, message: '请选择' }]}
                                    extra="默认为允许，不允许下，代销的投资者不允许在线预约与认申赎"
                                >
                                    <Radio.Group>
                                        <Radio value={1}>允许</Radio>
                                        <Radio value={2}>不允许</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="份额确认书文字提示"
                                    name="shareRecordRemind"
                                    rules={[{ required: false, message: '请输入份额确认书文字提示' }]}
                                    extra={<a onClick={()=> setShowImg(true)}>生效区域预览</a>}
                                >
                                    <Input.TextArea maxLength={500} rows={4} placeholder="请输入份额确认书文字提示"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center">
                            {
                                authEdit &&
                                <Button loading={saveLoading} type="primary" htmlType="submit" style={{ marginRight: 8 }}>保存</Button>
                            }

                        </Row>
                    </Form>
                </Spin>
            </Card>
            <Modal style={{textAlign:'center'}} visible={showImg} onCancel={()=>setShowImg(false)} footer={<Button type="primary" onClick={()=>setShowImg(false)}>关闭</Button>}>
                <img style={{width:'70%',height:700}} src={previewText}/>
            </Modal>
        </PageHeaderWrapper>
    );
};

export default connect(({ CHANNEL, loading }) => ({
    loading: loading.effects['INFORMATION_SETTING/getSetting'],
    saveLoading: loading.effects['INFORMATION_SETTING/createOrEdit']
}))(Setting);

Setting.defaultProps = {
    loading: false,
    saveLoading: false,
    authEdit: true
};
