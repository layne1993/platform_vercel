/*
 * @Descripttion: 空缺渠道编号查询 操作模态框
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 18:58:44
 * @LastEditTime: 2021-07-07 11:31:42
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Modal, Form, Input, notification, Spin, Select, DatePicker, InputNumber, AutoComplete, Button } from 'antd';
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
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};



const optionModal: FC<any> = (props) => {
    const { params, dispatch, success, loading } = props;
    const [form] = Form.useForm();
    const [flag, setFlag] = useState<boolean>(false);
    const [channelList, setChnnelList] = useState([]); // 渠道list

    /**
     * @description 获取渠道商列表
     */
    const getChannelList = () => {
        dispatch({
            type: 'global/channelList',
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    setChnnelList(data || []);
                }
            }
        });
    };



    // useEffect(getChannelList, []);


    /**
     * @description 关联
     */
    const editRelatedStatus = () => {
        // const values = form.getFieldsValue();
        form.validateFields().then((values) => {
            dispatch({
                type: 'CHANNEL/changeChannelRelatedStatus',
                payload: {
                    ...values,
                    type: 1
                },
                callback: ({ code, data, message }: any) => {
                    if (code === 1008) {
                        setFlag(false);
                        success();
                        openNotification('success', '提醒', '关联成功');
                    } else {
                        const txt = message || data || '关联失败！';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });
    };

    // 解除锁定
    const doRelieve = () => {
        dispatch({
            type: 'CHANNEL/changeChannelRelatedStatus',
            payload: {
                ...params,
                type: 2
            },
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    success();
                    openNotification('success', '提醒', '解除成功');
                } else {
                    const txt = message || data || '解除失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    const relievePre = () => {
        Modal.confirm({
            title: '提示',
            icon: <ExclamationCircleOutlined />,
            content: '请确认是否解除关联',
            okText: '确认',
            onOk: doRelieve
        });
    };

    return (
        <>
            {flag &&
                <Modal
                    width={500}
                    visible={flag}
                    onCancel={() => setFlag(false)}
                    title="提示"
                    onOk={editRelatedStatus}
                    confirmLoading={loading}
                    destroyOnClose
                    maskClosable={false}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={editRelatedStatus}
                    >
                        <Form.Item
                            label="渠道编码"
                            name="encodingRules"
                            rules={[{ required: false, message: '请输入' }]}
                        >
                            <Input disabled />
                        </Form.Item>

                        <Form.Item
                            label="关联渠道"
                            name="channelIds"
                            rules={[{ required: true, message: '请输入' }]}
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                mode="multiple"
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    channelList.map((item, index) => {
                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
            }
            {Array.isArray(params.channelList) &&
                params.channelList.length > 0 ?
                <a onClick={relievePre}>解除</a>
                :
                <a onClick={() => {
                    setFlag(true);
                    getChannelList();
                    form.setFieldsValue({
                        ...params,
                        encodingRules: params.alias
                    });
                }}
                >关联渠道</a>}
        </>

    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['CHANNEL/changeChannelRelatedStatus']
}))(optionModal);

optionModal.defaultProps = {
    params: {},
    loading: false
};
