/*
 * @Descripttion: 净值管理 ---- 批量维护
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 18:58:44
 * @LastEditTime: 2021-07-28 14:33:44
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Dispatch } from 'umi';
import { Modal, Form, Input, notification, Spin, Select, Radio, Button } from 'antd';
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

interface MaintenanceProps {
    params: any;
    dispatch: Dispatch;
    success: any;
    loading: boolean;
    authEdit: boolean,
    ids: any,
    total: number
}


const Maintenance: FC<MaintenanceProps> = (props) => {
    const { params, dispatch, success, loading, authEdit, ids, total } = props;
    const [form] = Form.useForm();
    const [flag, setFlag] = useState<boolean>(false);


    const initvalues = () => {
        form.setFieldsValue({
            isDividendDay: 'null',
            isfetchdDay: 'null',
            isOpenDay: 'null',
            isShowNetvalue: 'null',
            isAll: ids.length > 0 ? 0 : 1
        });
    };


    /**
     * @description 关联
     */
    const batchUpdate = () => {
        // const values = form.getFieldsValue();
        form.validateFields().then((values) => {
            dispatch({
                type: 'netValue/batchMaintain',
                payload: {
                    productNetvalueIds: ids,
                    ...values,
                    isDividendDay: values.isDividendDay === 'null' ? null : values.isDividendDay,
                    isfetchdDay: values.isfetchdDay === 'null' ? null : values.isfetchdDay,
                    isOpenDay: values.isOpenDay === 'null' ? null : values.isOpenDay,
                    isShowNetvalue: values.isShowNetvalue === 'null' ? null : values.isShowNetvalue
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
                    title="批量维护产品净值信息"
                    width={800}
                    visible={flag}
                    onCancel={() => setFlag(false)}
                    destroyOnClose
                    maskClosable={false}
                    footer={[<Button key="ok" loading={loading} type="primary" onClick={batchUpdate} >批量维护保存</Button>]}
                >
                    <Form
                        form={form}
                        // layout="vertical"
                        {...formItemLayout}
                    >
                        <Form.Item
                            label="数据范围"
                            name="isAll"
                            rules={[{ required: false, message: '请选择' }]}
                        >
                            <Radio.Group disabled={ids.length === 0}>
                                <Radio value={0}>{`当前选择项(${ids.length}条记录)`}</Radio>
                                <Radio value={1}>{`当前查询条件下的所有记录(${total}条记录)`}</Radio>
                            </Radio.Group>

                        </Form.Item>

                        <Form.Item
                            label="分红日"
                            name="isDividendDay"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部为：是</Radio>
                                <Radio value={0}>全部为：否</Radio>
                                <Radio value={'null'}>不修改</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="计提日"
                            name="isfetchdDay"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部为：是</Radio>
                                <Radio value={0}>全部为：否</Radio>
                                <Radio value={'null'}>不修改</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="开放日"
                            name="isOpenDay"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部为：是</Radio>
                                <Radio value={0}>全部为：否</Radio>
                                <Radio value={'null'}>不修改</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="净值是否展示"
                            name="isShowNetvalue"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部为：是</Radio>
                                <Radio value={0}>全部为：否</Radio>
                                <Radio value={'null'}>不修改</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            }
            {authEdit && <Button type="primary" onClick={() => { initvalues(); setFlag(true); }} >批量维护</Button>}
        </>

    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['netValue/batchMaintain']
}))(Maintenance);

Maintenance.defaultProps = {
    params: {},
    loading: false,
    authEdit: false,
    ids: [],
    total: 0
};
