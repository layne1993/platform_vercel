/*
 * @Descripttion: 交易签约 ---- 回访提醒
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 18:58:44
 * @LastEditTime: 2021-09-11 19:02:54
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Dispatch } from 'umi';
import { Modal, Form, Input, notification, Spin, Select, Radio, Button, Checkbox, Tooltip } from 'antd';
import { connect } from 'umi';
import { InfoCircleOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
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

interface VisitRemindProps {
    params: any;
    dispatch: Dispatch;
    success: any;
    loading: boolean;
    authEdit: boolean,
    ids: any,
    total: number
}


const VisitRemind: FC<VisitRemindProps> = (props) => {
    const { dispatch, success, loading, authEdit, ids, total } = props;
    const [form] = Form.useForm();
    const [flag, setFlag] = useState<boolean>(false);


    /**
     * @description 回访提醒
     */
    const visitRemind = () => {
        // const values = form.getFieldsValue();
        form.validateFields().then((values) => {
            dispatch({
                type: 'SIGN_VISITREMIND/visitRemind',
                payload: {
                    signFlowIds: ids,
                    ...values
                },
                callback: ({ code, data, message }: any) => {
                    if (code === 1008) {
                        const txt = message || data || '批量维护成功！';
                        openNotification('success', '提醒', txt);
                        setFlag(false);
                    } else {
                        const txt = message || data || '批量维护失败！';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });
    };



    return (
        <>
            {flag &&
                <Modal
                    title="批量客户回访提醒"
                    width={600}
                    visible={flag}
                    onCancel={() => setFlag(false)}
                    destroyOnClose
                    maskClosable={false}
                    footer={[<Button key="ok" loading={loading} type="primary" onClick={visitRemind} >批量维护保存</Button>]}
                >
                    <Form
                        form={form}
                        // layout="vertical"
                        {...formItemLayout}
                    >
                        <Form.Item
                            label="回访流程提醒"
                            name="remindTypes"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Checkbox.Group>
                                <Checkbox value={1}>短信</Checkbox>
                                <Checkbox value={2}>邮箱</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>

                    </Form>
                </Modal>
            }

            <>
                <Button type="primary" disabled={ids.length === 0} onClick={() => { setFlag(true); }} >
                    回访提醒
                </Button>
                <Tooltip
                    placement="top"
                    title={'筛选“交易类型”为“首次购买”，且“签约进度”为“冷静期结束”的客户，勾选后进行短信及邮件提醒客户尽快完成回访流程'}
                >
                    <InfoCircleOutlined />
                </Tooltip>
            </>

        </>

    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['SIGN_VISITREMIND/visitRemind']
}))(VisitRemind);

VisitRemind.defaultProps = {
    params: {},
    loading: false,
    authEdit: false,
    ids: [],
    total: 0
};
