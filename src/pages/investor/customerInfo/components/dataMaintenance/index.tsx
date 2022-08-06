/*
 * @Descripttion: 净值管理 ---- 批量维护
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 18:58:44
 * @LastEditTime: 2021-09-01 16:47:17
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Dispatch } from 'umi';
import { Modal, Form, Input, notification, Spin, Select, Radio, Button, Checkbox } from 'antd';
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
    const [managerList, setMangerList] = useState<any[]>([]);
    const [agentScope, setAgentScope] = useState(0);


    const initvalues = () => {
        form.setFieldsValue({
            managerConditionScope: 0,
            emailConditionScope: 0,
            vipConditionScope: 0,
            managerUpdateMethod: 0,
            dataScope: ids.length > 0 ? 0 : 1,
            riskRemind: [2],
            agentConditionScope: 0
        });
    };

    /**
     * @description 获取客户经理
     */
    const getManagerList = () => {
        dispatch({
            type: 'global/selectAllAccountManager',
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    setMangerList(data);
                }
            }
        });
    };

    useEffect(() => {
        getManagerList();
    }, []);

    const handleChangeRiskRemind = async (e, val) => {
        setTimeout(() => {
            const { riskRemind } = form.getFieldsValue();
            const checked = e.target.checked;

            if (checked) {
                if (val === 0 || val === 1) {
                    form.setFieldsValue({
                        riskRemind: (riskRemind || []).filter((i) => i !== 2)
                    });
                } else {
                    form.setFieldsValue({
                        riskRemind: [2]
                    });
                }
            }
        }, 0);
    };

    const handleChangeAgentScope = (e) => {
        setAgentScope(e.target.value);
    };

    /**
     * @description 关联
     */
    const batchUpdate = () => {
        // const values = form.getFieldsValue();
        form.validateFields().then((values) => {
            dispatch({
                type: 'CUSTOMER_INFO_MAINTENANCE/batchUpdateCustomer',
                payload: {
                    customerIds: ids,
                    queryCustomerReq: params,
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
                    title="批量维护投资者信息"
                    width={800}
                    visible={flag}
                    onCancel={() => setFlag(false)}
                    destroyOnClose
                    maskClosable={false}
                    footer={[<Button key="ok" loading={loading} type="primary" onClick={batchUpdate} >批量维护保存</Button>]}
                >
                    <Form
                        form={form}
                        {...formItemLayout}
                    >
                        <Form.Item
                            label="数据范围"
                            name="dataScope"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group disabled={ids.length === 0}>
                                <Radio value={0}>{`当前选择项(${ids.length}条记录)`}</Radio>
                                <Radio value={1}>{`当前查询条件下的所有记录(${total}条记录)`}</Radio>
                            </Radio.Group>

                        </Form.Item>

                        <Form.Item
                            label="客户经理变更"
                            name="managerConditionScope"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部覆盖为指定值</Radio>
                                <Radio value={2}>未设置记录，覆盖为指定值</Radio>
                                <Radio value={0}>不变更</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item shouldUpdate noStyle>
                            {() => (
                                form.getFieldValue('managerConditionScope') !== 0 &&
                                <>
                                    <Form.Item
                                        label="客户经理覆盖方式"
                                        name="managerUpdateMethod"
                                        rules={[{ required: true, message: '请选择' }]}
                                    >
                                        <Radio.Group>
                                            <Radio value={0}>替换原来的值</Radio>
                                            <Radio value={1}>追加新的客户经理</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item
                                        label="客户经理变更为"
                                        name="managerUserIds"
                                        rules={[{ required: false, message: '请选择' }]}
                                    >
                                        <Select
                                            // mode="multiple"
                                            allowClear
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children && option.children
                                                    .toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            }
                                            mode="multiple"
                                        >
                                            {Array.isArray(managerList) && managerList.map((item) => (
                                                <Select.Option key={item.managerUserId} value={item.managerUserId + ''}>{item.userName}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </>
                            )
                            }
                        </Form.Item>

                        <Form.Item
                            label="邮箱变更"
                            name="emailConditionScope"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部覆盖为指定值</Radio>
                                <Radio value={2}>未设置记录，覆盖为指定值</Radio>
                                <Radio value={0}>不变更</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item shouldUpdate noStyle>
                            {() => (
                                form.getFieldValue('emailConditionScope') !== 0 &&
                                <>
                                    <Form.Item
                                        label="邮箱变更为"
                                        name="email"
                                        rules={[{ type: 'email', message: '请输入正确的邮箱' }]}
                                    >
                                        <Input placeholder="请输入" allowClear />
                                    </Form.Item>
                                </>
                            )
                            }
                        </Form.Item>

                        <Form.Item
                            label="是否vip客户"
                            name="vipConditionScope"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group>
                                <Radio value={1}>全部为：是</Radio>
                                <Radio value={2}>全部为：否</Radio>
                                <Radio value={0}>不变更</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            label="风测到期提醒"
                            name="riskRemind"
                            rules={[{ required: true, message: '请选择' }]}
                            initialValue={[2]}
                        >
                            <Checkbox.Group>
                                <Checkbox value={0} onChange={(e) => handleChangeRiskRemind(e, 0)}>短信</Checkbox>
                                <Checkbox value={1} onChange={(e) => handleChangeRiskRemind(e, 1)}>邮箱</Checkbox>
                                <Checkbox value={2} onChange={(e) => handleChangeRiskRemind(e, 2)}>不变更</Checkbox>
                            </Checkbox.Group>
                        </Form.Item>

                        <Form.Item
                            label="经纪人"
                            name="agentConditionScope"
                            rules={[{ required: true, message: '请选择' }]}
                        >
                            <Radio.Group onChange={handleChangeAgentScope}>
                                <Radio value={1}>变更为</Radio>
                                <Radio value={0}>不变更</Radio>
                            </Radio.Group>
                        </Form.Item>
                        {
                            agentScope === 1 &&
                            <Form.Item
                                label=" "
                                name="agent"
                                colon={false}
                                required={false}
                                rules={[{ required: true, message: '请输入经纪人' }]}
                            >
                                <Input placeholder="请输入经纪人" maxLength={20} />
                            </Form.Item>
                        }
                    </Form>
                </Modal>
            }
            <Button type="primary" onClick={() => { initvalues(); setFlag(true); }} >批量维护</Button>
        </>

    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['CUSTOMER_INFO_MAINTENANCE/batchUpdateCustomer']
}))(Maintenance);

Maintenance.defaultProps = {
    params: { },
    loading: false,
    authEdit: false,
    ids: [],
    total: 0
};
