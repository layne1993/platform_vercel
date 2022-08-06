/*
 * @Descripttion: 客户经理管理
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 18:58:44
 * @LastEditTime: 2021-08-16 16:42:55
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Dispatch } from 'umi';
import { Card, Form, Input, notification, Spin, Select, Row, Button, Checkbox } from 'antd';
import { connect } from 'umi';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import _styles from './styles.less';
import moment from 'moment';
import { getManagerDistributeSetting } from './service';
import { selectAllAccountManager } from '@/services/global';


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
    submitLoading: boolean,
    total: number
}


const Maintenance: FC<MaintenanceProps> = (props) => {
    const { dispatch, submitLoading, loading } = props;
    const [form] = Form.useForm();
    const [configInfo, setConfigInfo] = useState<any>({});
    const [managerList, setMangerList] = useState<any[]>([]);
    const [currentId, setCurrentId] = useState<number>(null);
    const [usedManagerList, setUsedManagerList] = useState<any[]>([]);


    /**
     * @description 数据混合
     * @param managerList
     * @param checkList
     */
    const dataMixins = (managerList = [], checkList = []) => {
        checkList.map((id) => {
            managerList.map((item) => {
                if (id === item.managerUserId) {
                    item.use = true;
                } else {
                    item.use = false;
                }
            });
        });
        return managerList;
    };

    /**
     * @description 获取参与分配的客户经理
     * @param useManagerIds
     * @param allManagerList
     */
    const getUsedManagerList = (useManagerIds, allManagerList) => {
        const newArr = [];
        allManagerList.map((item) => {
            if (useManagerIds.includes(item.managerUserId)) {
                newArr.push(item);
            }
        });
        setUsedManagerList(newArr);
    };


    /**
     * @description 查询配置信息
     */
    const getConfig = () => {
        dispatch({
            type: 'CUSTOMER_MANAGER/getManagerDistributeSetting',
            callback: ({ code, data = {}, message }) => {
                if (code === 1008) {
                    setConfigInfo(data || {});
                    setCurrentId(data.managerUserId);
                    form.setFieldsValue({
                        ...data
                    });
                }
            }
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



    // 获取数据
    const getData = async () => {
        Promise.all([getManagerDistributeSetting({}), selectAllAccountManager()]).then((result) => {
            let useManagerList = [];
            let allManagerList = [];
            if (result[0] && result[0].code === 1008) {
                const data = result[0].data || {};
                setConfigInfo(data || {});
                setCurrentId(data.managerUserId);
                form.setFieldsValue({
                    ...data
                });
                useManagerList = data.takeManagerUsers;
            }

            if (result[1] && result[1].code === 1008) {
                const data = result[1].data || {};
                setMangerList(data);
                allManagerList = data;
            }

            getUsedManagerList(useManagerList, allManagerList);

        });
    };


    useEffect(() => {
        getData();
        // getConfig();
        // getManagerList();
    }, []);

    // 客户经理排序
    const managerSort = (useManager = [], managerList = []) => {
        const newArr = [];
        if (useManager.length === 0) return JSON.stringify(newArr);
        managerList.map((item) => {
            if (useManager.includes(item.managerUserId)) {
                newArr.push(item.managerUserId);
            }
        });
        return JSON.stringify(newArr);
    };

    /**
     * @description 保存
     */
    const onFinish = (values) => {
        // const values = form.getFieldsValue();
        dispatch({
            type: 'CUSTOMER_MANAGER/saveManagerDistributeSetting',
            payload: {
                ...configInfo,
                ...values,
                distributeScene: JSON.stringify(values.distributeScene || []),
                takeManagerUsers: managerSort(values.takeManagerUsers, managerList)
            },
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    const txt = message || data || '保存成功';
                    openNotification('success', '提醒', txt);
                    getConfig();
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    // checkbox change事件
    const checkboxChange = (values) => {
        const newManagerList = dataMixins(managerList, values);
        // console.log(newManagerList, 'newManagerList');
        const { managerUserId, takeManagerUsers } = form.getFieldsValue();
        getUsedManagerList(values, newManagerList);
        if (takeManagerUsers.length === 0) {
            setCurrentId(undefined);
            form.setFieldsValue({ managerUserId: undefined });
            return;
        }
        if (Array(values) && !values.includes(managerUserId)) {

            let useManagerList = [];
            let currentManagerIndex = -1;
            let nextManagerId = 0;
            newManagerList.map((item, index) => {
                if (item.managerUserId === currentId) {
                    currentManagerIndex = index;
                }
                if (currentManagerIndex > -1 && nextManagerId === 0 && item.use) {
                    nextManagerId = item.managerUserId;
                }
                if (item.use) {
                    useManagerList.push(item);
                }
            });

            // console.log(nextManagerId, '---', useManagerList);

            if (nextManagerId === 0 && useManagerList.length > 0) {
                nextManagerId = useManagerList[0].managerUserId;
            }
            if (nextManagerId === 0) {
                nextManagerId = undefined;
            }
            setCurrentId(nextManagerId);
            form.setFieldsValue({ managerUserId: nextManagerId });
        }
    };


    const { prevDistributeLog } = configInfo;


    return (
        <Spin spinning={false}>
            <Card>
                <Form
                    form={form}
                    onFinish={onFinish}
                    {...formItemLayout}
                >
                    <Form.Item
                        label="自动分配客户经理的环节"
                        name="distributeScene"
                        extra="可以多选，或者不选，不选那么不会触发自动分配"
                    >
                        <Checkbox.Group>
                            <Checkbox value={1}>投资者提交合格投资者审核</Checkbox>
                            <Checkbox value={2}>投资者提交产品预约</Checkbox>
                        </Checkbox.Group>

                    </Form.Item>

                    <Form.Item
                        label="参与客户经理自动分配的有"
                        name="takeManagerUsers"
                        extra="参与分配的客户经理，将在有投资者预约时，如果这个投资者没有对应的客户经理的情况下，将按照排队分配一个客户经理"
                    >
                        <Checkbox.Group onChange={checkboxChange}>
                            {Array.isArray(managerList) && managerList.map(((item) => (
                                <Checkbox key={item.managerUserId} value={item.managerUserId}>{item.userName}</Checkbox>
                            )))}
                        </Checkbox.Group>

                    </Form.Item>
                    <Form.Item
                        label="上一个客户分配给"
                    >
                        {prevDistributeLog ? <span>{prevDistributeLog?.managerUserName}，分配客户为：{prevDistributeLog?.customerName}，分配时间：{prevDistributeLog?.updateTime && moment(prevDistributeLog?.updateTime).format('YYYYMMDD')}</span> : '--'}
                    </Form.Item>

                    <Form.Item
                        label="下一个客户分配给"
                        name="managerUserId"
                        rules={[{ required: false, message: '请选择' }]}
                    >
                        <Select>
                            {Array.isArray(usedManagerList) && usedManagerList.map((item) => (
                                <Select.Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Row justify="center">
                        <Button type="primary" htmlType="submit" loading={submitLoading}>保存</Button>
                    </Row>
                </Form>
            </Card>
        </Spin>
    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['CUSTOMER_MANAGER/getManagerDistributeSetting'],
    submitLoading: loading.effects['CUSTOMER_MANAGER/saveManagerDistributeSetting']
}))(Maintenance);

Maintenance.defaultProps = {
    params: {},
    authEdit: false
};
