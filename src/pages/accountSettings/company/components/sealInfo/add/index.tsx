/*
 * @Descripttion: 新增授权代表章
 * @version:
 * @Author: yezi
 * @Date: 2021-06-22 19:46:09
 * @LastEditTime: 2021-07-21 10:52:30
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Modal, Form, Input, notification, Spin, Select, Radio, InputNumber, AutoComplete, Button } from 'antd';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _styles from './styles.less';
import moment from 'moment';


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
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 14 },
        sm: { span: 14 }
    }
};

const TIME = 60;

const OptionModal: FC<any> = (props) => {
    const { params, flag, dispatch, success, loading, sendLoading, cancel, onSuccess } = props;
    const [form] = Form.useForm();
    const [mode, setMode] = useState<number>(1);
    const [second, setSecond] = useState<number>(TIME);
    const [sealManagerList, setSealManagerList] = useState<any[]>([]);                            // 已存在印章管理人信息
    const [checkInfo, setCheckInfo] = useState({});                                               // 验证信息
    const [userRealNameInfo, setUserRealNameInfo] = useState<{ [key: string]: string }>(null);      // 实名信息


    /**
     * @description 获取渠道商列表
     */
    const getChannelList = () => {
        dispatch({
            type: 'companySetting/getStampUserInfo',
            payload: {
                sealType: '1'
            },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    setSealManagerList(data || []);
                }
            }
        });
    };



    useEffect(getChannelList, []);


    /**
     * @description 关联
     */
    const editRelatedStatus = () => {
        // const values = form.getFieldsValue();
        form.validateFields().then((values) => {
            dispatch({
                type: 'companySetting/changeChannelRelatedStatus',
                payload: {
                    ...values,
                    type: 1
                },
                callback: ({ code, data, message }: any) => {
                    if (code === 1008) {
                        openNotification('success', '提醒', '关联成功');
                    } else {
                        const txt = message || data || '关联失败！';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });
    };

    let timer = null;
    useEffect(() => {
        if (TIME === second) return;
        timer = setTimeout(() => {
            if (second === 1) {
                clearTimeout(timer);
                setSecond(TIME);
            } else {
                setSecond(second - 1);
            }
        }, 1000);

    }, [second]);

    // 获取实名信息
    const getRealNameInfo = (e) => {
        const val = e.target.value;
        dispatch({
            type: 'companySetting/isHasRealName',
            payload: {
                idNumber: val,
                type: 1
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setUserRealNameInfo(data);
                    data && form.setFieldsValue({
                        ...data
                    });
                }
            }
        });
    };


    /**
     * @description 发送金额
     */
    const sendVerificationCode = (val) => {
        form.validateFields().then((values) => {
            let params = { ...values };
            if (userRealNameInfo) {
                params = {
                    ...userRealNameInfo,
                    ...params
                };
            }
            dispatch({
                type: 'companySetting/captcha',
                payload: params,
                callback: ({ code, data, message }) => {
                    if (code === 1008) {
                        setSecond(TIME - 1);
                        setCheckInfo(data);
                        openNotification('success', '提醒', '发送成功');
                    } else {
                        const txt = message || data || '保存失败';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });
    };

    const onOk = () => {
        form.validateFields().then((values) => {
            let params = { ...values };
            if (userRealNameInfo) {
                params = {
                    ...userRealNameInfo,
                    ...params
                };
            }
            dispatch({
                type: 'companySetting/openAccount',
                payload: params,
                callback: ({ code, data, message }) => {
                    if (code === 1008) {
                        onSuccess(params);
                    } else {
                        const txt = message || data || '提交失败！';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });

    };


    return (
        <Modal
            title="新增授权代表章"
            visible={flag}
            width={800}
            mask={false}
            destroyOnClose
            onCancel={cancel}
            onOk={onOk}
            confirmLoading={loading}
        >
            <Form
                {...formItemLayout}
                form={form}
                initialValues={{ mode: 1 }}
            >
                <Form.Item
                    label="是否新增授权人"
                    name="mode"
                    rules={[{ required: true, message: '请选择' }]}
                    extra="采用印模上传的联系易私慕维护好印模图片"
                >
                    <Radio.Group onChange={(e) => { setMode(e.target.value); setUserRealNameInfo(null); }}>
                        <Radio value={1}>是</Radio>
                        <Radio value={2}>否</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item
                    label="法人/授权代表章名称"
                    name="sealName"
                    rules={[{ required: true, message: '请输入' }]}
                >
                    <Input placeholder="请输入" />
                </Form.Item>
                {
                    mode === 1 && <>
                        {userRealNameInfo ? <>
                            <Form.Item
                                label="身份证号码"
                                name="cardNumber"
                                rules={[{ required: true, message: '请输入' }]}
                            >
                                <Input placeholder="请输入" disabled />
                            </Form.Item>
                        </> :
                            <>
                                <Form.Item
                                    label="姓名"
                                    name="name"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                                <Form.Item
                                    label="身份证号码"
                                    name="cardNumber"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" onBlur={getRealNameInfo} />
                                </Form.Item>
                                <Form.Item
                                    label="银行卡号"
                                    name="bankCard"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                                <Form.Item
                                    label="手机号"
                                    name="mobile"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </>

                        }

                        <Form.Item
                            label="输入验证码"
                            name="captcha"
                            rules={[{ required: false, message: '请输入' }]}
                        >
                            <Input.Search
                                placeholder="请输入"
                                allowClear
                                enterButton={<Button type="primary" disabled={second < TIME}>{second < TIME ? `${second}S` : '获取验证码'}</Button>}
                                size="large"
                                onSearch={sendVerificationCode}
                                loading={sendLoading}
                            />
                        </Form.Item>
                    </>
                }

                {
                    mode === 2 && <>
                        <Form.Item
                            label="姓名"
                            name="name"
                            rules={[{ required: true, message: '请输入' }]}
                            extra="请选择，选择列表为目前维护的私章人员"
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                onChange={(val, obj) => obj.data && form.setFieldsValue({
                                    cardNumber: obj.data.cardNumber,
                                    mobile: obj.data.mobile,
                                    bankCard: obj.data.bankCard
                                })}
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {sealManagerList.map((item, index) => (
                                    <Select.Option key={index} value={item.useSealName} data={item}>{item.useSealName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="身份证号码"
                            name="cardNumber"
                            rules={[{ required: true, message: '请输入' }]}
                            extra="不可变更"
                        >
                            <Input placeholder="" disabled />
                        </Form.Item>
                        <Form.Item
                            label="银行卡号"
                            name="bankCard"
                            rules={[{ required: true, message: '请输入' }]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            label="手机号"
                            name="mobile"
                            rules={[{ required: true, message: '请输入' }]}
                            extra="不可变更"
                        >
                            <Input placeholder="" disabled />
                        </Form.Item>
                    </>
                }

            </Form>
        </Modal>
    );
};


export default connect(({ loading }) => ({
    sendLoading: loading.effects['companySetting/captcha'],
    loading: loading.effects['companySetting/validateCaptcha']
}))(OptionModal);

OptionModal.defaultProps = {
    params: {},
    flag: false,
    loading: false,
    sendLoading: false,
    cancel: () => { },
    onSuccess: () => { }
};
