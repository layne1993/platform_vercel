import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Form, Input, Select, Spin, notification, DatePicker, Button } from 'antd';
import { UploadOutlined, PictureOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getCookie, getRandomKey } from '@/utils/utils';
import { accountTypeList } from '@/utils/publicData';

import _styles from './styles.less';

const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
};


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const { Option } = Select;

function EditQuestionList(props) {
    const {
        loadingSubmit,
        loadingGetDetail,
        loadingUserList
    } = props;
    const { visible, setVisible, tableSearch, accountId = null, productId } = props;
    const [form] = Form.useForm();

    const [userList, setUserList] = useState([]);

    // 查询所有用户
    const _querySelectAllUser = () => {
        const { dispatch } = props;
        dispatch({
            type: 'productDetails/querySelectAllUser',
            payload: {
                pageSize: 99999,
                pageNo: 1
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setUserList(res.data.list);
                }
            }
        });
    };

    // 编辑时读取数据
    useEffect(() => {
        _querySelectAllUser();
        if (!accountId) return;
        const { dispatch } = props;
        dispatch({
            type: 'productDetails/getProductAccountDetail',
            payload: { accountId },
            callback: (res) => {
                if (res.code === 1008) {
                    const { data = {} } = res;
                    const { openTime, ...params } = data;
                    form.setFieldsValue({
                        ...params,
                        openTime:moment(openTime)
                    });
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        `${res.message ? res.message : '获取数据失败!'}`,
                        'topRight',
                    );
                }
            }
        });
    }, []);

    const onFinish = () => {
        const { validateFields } = form;
        validateFields().then((values) => {
            const { dispatch } = props;
            const { openTime, ...params } = values;
            const time = new Date(openTime).getTime();
            dispatch({
                type: 'productDetails/setProductAccountList',
                payload: {
                    ...params,
                    openTime:time,
                    accountId,
                    productId
                },
                callback: (res) => {
                    const { code = '', message = '' } = res;
                    if (code === 1008) {
                        openNotification('success', '提示', '保存成功');
                        tableSearch(); // 更新数据
                        setVisible(false);
                    } else {
                        openNotification(
                            'warning',
                            `提示（代码：${code}）`,
                            `${message ? message : '保存失败！'}`,
                            'topRight',
                        );
                    }
                }
            });
        });
    };

    return (
        <Modal
            visible={visible}
            mask={false}
            maskClosable={false}
            onCancel={() => setVisible(false)}
            onOk={onFinish}
            wrapClassName={_styles.accountNewBuild}
            title="新建账户信息"
        >
            <Form {...layout}
                form={form}
                onFinish={onFinish}
                initialValues={{
                    openUserId:Number(getCookie('managerUserId'))
                }}
            >
                <Form.Item
                    label="账户类型:"
                    name="type"
                    rules={[{ required: true, message: '请选择账户类型!' }]}
                >
                    <Select placeholder="请选择"  allowClear loading={Boolean(props.questionTypeLoading)}>
                        {accountTypeList.map((item) => (
                            <Option value={item.value} key={item.value}>
                                {item.label}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="开具机构:"
                    name="openOrganization"
                    rules={[
                        { required: true, message: '请输入开具机构!' }
                    ]}
                >
                    <Input placeholder="请输入" max={140} />
                </Form.Item>
                <Form.Item
                    label="资金账户:"
                    name="account"
                    rules={[
                        { required: true, message: '请输入资金账户!' }
                    ]}
                >
                    <Input placeholder="请输入" max={140} />
                </Form.Item>
                <Form.Item
                    label="开具人:"
                    name="openUserId"
                    rules={[
                        { required: true, message: '请选择开具人!' }
                    ]}
                >
                    <Select placeholder="请选择"  allowClear>
                        {
                            userList.map((item) => {
                                return (
                                    <Option key={getRandomKey(5)} value={item.managerUserId}>{item.userName}</Option>
                                );
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item
                    label="营业部信息:"
                    name="salesDepartment"
                    rules={[
                        { required: true, message: '请输入营业部信息!' }
                    ]}
                >
                    <Input placeholder="请输入" max={140} />
                </Form.Item>
                <Form.Item
                    label="开具时间:"
                    name="openTime"
                    rules={[
                        { required: true, message: '请选择开具时间!' }
                    ]}
                >
                    <DatePicker />
                </Form.Item>
                <Form.Item
                    label="描述:"
                    name="description"
                    rules={[
                        { required: true, min:5,  message: '请输入至少五个字符!' }
                    ]}
                >
                    <Input.TextArea placeholder="请输入至少五个字符" />
                </Form.Item>
            </Form>
            {(loadingSubmit || loadingGetDetail || loadingUserList) && (
                <div className="consulteModalLoading">
                    <Spin />
                </div>
            )}
        </Modal>
    );
}

export default connect(({ consulteQuestion, loading }) => ({
    consulteQuestion,
    loadingSubmit: loading.effects['productDetails/setProductAccountList'],
    loadingGetDetail: loading.effects['productDetails/getProductAccountDetail'],
    loadingUserList:loading.effects['productDetails/querySelectAllUser']
}))(EditQuestionList);
