import { Button, Card, Input, Form, Switch, Select, notification, Checkbox, Space } from 'antd';
import { connect, history } from 'umi';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getRandomKey, getParams } from '@/utils/utils';
import md5 from 'js-md5';
import { XWAccountType, RoleType } from '@/utils/publicData';
import styles from './style.less';
import { isEmpty } from 'lodash';

const { Option } = Select;

const FormItem = Form.Item;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class AccountEditForm extends Component {
    state = {
        managerUserId: null,
        isDelete: true, //  账号状态0启用1停用
        roleType: 0, //  用户角色(0:普通,1管理员)
        account: '',
        mobileNoteStatus: false, //  是打开短信通知(0:否,1:是)
        emailNoteStatus: false, //  是否邮箱通知(0:否,1:是）
        mobile: '',
        email: '',
        userList: [],
        permissionList: [],
        roleIds: [],
        parentId: undefined, // 上级id
        authoritySeeStatus: null,
        authorityStatus: null, //是否拥有全数据权限的字段
        isItOptional: true, // 是否禁用全数据选项
        superiorList: []
        // customerAuths: [],
    };
    formRef = React.createRef();
    componentDidMount() {
        const { dispatch, match:{params} } = this.props;
        dispatch({
            type: 'accountInfo/quireRoleList',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        permissionList: res.data
                    });
                }
            }
        });
        dispatch({
            type: 'accountInfo/querySelectAllUser',
            payload:{
                pageSize:9999999
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        superiorList: res.data.list
                    });
                }
            }
        });
        let managerUserId = '';
        managerUserId = params.account;

        if (managerUserId !== '0') {
            this.setState({
                managerUserId
            });
            dispatch({
                type: 'accountInfo/getAccountInfo',
                payload: {
                    managerUserId
                },
                callback: (res) => {
                    if (res && res.code === 1008) {
                        const data = res.data || {};
                        // let authorityStatus = data.authorityStatus === 1 ? 1 : 0;
                        // let authoritySeeStatus = data.authoritySeeStatus === 1 ? 2 : 0;
                        this.setState({
                            ...data,
                            isDelete: data.isDelete === 0,
                            mobileNoteStatus: data.mobileNoteStatus === 1,
                            emailNoteStatus: data.emailNoteStatus === 1,
                            authoritySeeStatus: [data.authoritySeeStatus],
                            authorityStatus: [data.authorityStatus],
                            parentId: data.parentId,
                            roleType: data.roleType,
                            roleIds: data.roleIds,
                            isItOptional:data.positionStatus !== '3'
                        });
                    } else {
                        const warningText = res.message || res.data || '查询失败，请稍后再试！';
                        openNotification(
                            'warning',
                            `提示（代码：${res.code}）`,
                            warningText,
                            'topRight',
                        );
                    }
                }
            });
        }
        // this.getUserList();
    }

    /**
     * 获取权限
     */
    getQuireMenuByRoleId = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/quireMenuByRoleId'
        });
    };

    //  保存账号信息
    onFinish = (values) => {
        const { dispatch } = this.props;
        const { managerUserId } = this.state;
        const {
            authoritySeeStatus,
            isDelete,
            mobileNoteStatus,
            emailNoteStatus,
            authorityStatus
        } = values;

        const body = {
            managerUserId,
            ...values,
            confirmPassword: '',
            password: values.password && md5(values.password),
            isDelete: isDelete ? 0 : 1,
            mobileNoteStatus: mobileNoteStatus ? 1 : 0,
            emailNoteStatus: emailNoteStatus ? 1 : 0,
            authoritySeeStatus: (authoritySeeStatus && Number(authoritySeeStatus.toString())) || 0,
            authorityStatus: (authorityStatus && Number(authorityStatus.toString())) || 0
        };
        dispatch({
            type: 'accountInfo/saveAccountInfo',
            payload: body,
            callback: (res) => {
                if (res && res.code === 1008) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                    this.getQuireMenuByRoleId();
                    history.push('/settings/account');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    onValuesChange = (changedValues, allValues) => {
        for (let key in changedValues) {
            if (key === 'positionStatus') {
                if (changedValues[key].includes('0')) {
                    this.formRef.current.setFieldsValue({
                        authorityStatus: [1]
                    });
                    this.setState({
                        isItOptional: true
                    });
                    return;
                }
                if (changedValues[key].includes('3')) {
                    this.formRef.current.setFieldsValue({
                        authorityStatus: [1]
                    });
                    this.setState({
                        isItOptional: false
                    });
                    return;
                }
                this.formRef.current.setFieldsValue({
                    authorityStatus: []
                });
                this.setState({
                    isItOptional: true
                });
            }
        }
    };

    filterPerson = (inputValue, option) => option.props.children.includes(inputValue);

    render() {
        // eslint-disable-next-line no-undef
        const { authEdit } =
            (sessionStorage.getItem('PERMISSION') &&
                JSON.parse(sessionStorage.getItem('PERMISSION'))['121000']) ||
            {};

        const { submitting, loading } = this.props;
        const {
            permissionList,
            parentId,
            roleIds,
            positionStatus,
            userList,
            managerUserId,
            isDelete,
            roleType,
            account,
            userName,
            mobileNoteStatus,
            emailNoteStatus,
            mobile,
            email,
            authoritySeeStatus,
            authorityStatus,
            superiorList,
            isItOptional
        } = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 7
                }
            },
            wrapperCol: {
                xs: {
                    span: 24
                },
                sm: {
                    span: 12
                },
                md: {
                    span: 10
                }
            }
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0
                },
                sm: {
                    span: 10,
                    offset: 7
                }
            }
        };

        return (
            <PageHeaderWrapper title={managerUserId ? '编辑账号' : '新建账号'}>
                <Card bordered={false} loading={loading} className={styles.noticeForm}>
                    <Form
                        {...formItemLayout}
                        hideRequiredMark
                        style={{
                            marginTop: 8
                        }}
                        ref={this.formRef}
                        name="accountEditForm"
                        initialValues={{
                            isDelete,
                            roleType,
                            account,
                            userName,
                            mobileNoteStatus,
                            emailNoteStatus,
                            mobile,
                            email,
                            positionStatus,
                            parentId,
                            roleIds,
                            authoritySeeStatus:
                                authoritySeeStatus === null ? [1] : authoritySeeStatus,
                            // customerAuths,
                            authorityStatus: authorityStatus === null ? [0] : authorityStatus
                        }}
                        onFinish={this.onFinish}
                        onValuesChange={this.onValuesChange}
                    >
                        <FormItem label="是否启用状态" name="isDelete" valuePropName="checked">
                            <Switch checkedChildren="是" unCheckedChildren="否" />
                        </FormItem>
                        <FormItem
                            label="账号名称"
                            name="userName"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入账号名称'
                                }
                            ]}
                        >
                            <Input placeholder="请输入账号名称" />
                        </FormItem>

                        <FormItem
                            label="登录手机号"
                            name="mobile"
                            rules={[
                                {
                                    // required: managerUserId === null,
                                    required: true,
                                    pattern: /^1\d{10}$/,
                                    message: '请输入格式正确的手机号'
                                }
                            ]}
                        >
                            <Input placeholder="请输入手机号" />
                        </FormItem>

                        <FormItem
                            label="登录邮箱"
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入登录邮箱'
                                },
                                {
                                    type: 'email',
                                    message: '请输入登录邮箱'
                                }
                            ]}
                        >
                            <Input placeholder="请输入登录邮箱" />
                        </FormItem>

                        <FormItem
                            label="新密码"
                            name="password"
                            rules={[
                                {
                                    required: !managerUserId,
                                    message: '请输入新密码'
                                },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,20}$/,
                                    message: '密码长度8~20位，必须包含大写字母、小写字母和数字'
                                }
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="密码长度8~20位，必须包含大写字母、小写字母和数字" />
                        </FormItem>

                        <FormItem
                            label="确认密码"
                            name="confirmPassword"
                            dependencies={['password']}
                            rules={[
                                {
                                    required: !managerUserId,
                                    message: '请再次输入密码'
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        const password = getFieldValue('password');
                                        if (password && value !== password) {
                                            return Promise.reject(
                                                new Error('两次输入的密码不一致'),
                                            );
                                        }
                                        return Promise.resolve();
                                    }
                                })
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder="请再次输入的密码" />
                        </FormItem>

                        <FormItem label="岗位" extra="管理员岗位拥有全客户查看权限不可修改；运营默认拥有全客户查看权限可修改">
                            <Space>
                                <FormItem
                                    style={{ width: 180 }}
                                    name="positionStatus"
                                >
                                    <Select placeholder="请选择岗位" mode={'multiple'} allowClear>
                                        {XWAccountType.map((item) => (
                                            <Option value={item.value} key={getRandomKey(5)}>
                                                {item.label}
                                            </Option>
                                        ))}
                                    </Select>
                                </FormItem>
                                <FormItem name="authorityStatus">
                                    <Checkbox.Group disabled={isItOptional}>
                                        <Checkbox value={1}>是否拥有全客户查看权限</Checkbox>
                                        {/* <Checkbox value={1}>允许上级查看下级所属客户</Checkbox> */}
                                    </Checkbox.Group>
                                </FormItem>

                            </Space>
                        </FormItem>
                        {/* <p>管理员岗位拥有全客户查看权限不可修改；运营默认拥有全客户查看权限可修改</p> */}
                        <FormItem
                            label="菜单权限"
                            name="roleIds"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择账号角色'
                                }
                            ]}
                        >
                            <Select
                                placeholder="请选择账号角色，不同角色对应不同菜单和查看权限"
                                mode="multiple"
                                showSearch
                                allowClear
                                filterOption={this.filterPerson}
                            >
                                {!isEmpty(permissionList) &&
                                    permissionList.map((item) => (
                                        <Option value={item.roleId} key={getRandomKey(5)}>
                                            {item.roleName}
                                        </Option>
                                    ))}
                            </Select>
                        </FormItem>
                        <Form.Item label="所属上级">
                            <Space>
                                <FormItem name="parentId">
                                    <Select
                                        placeholder="请选择所属上级"
                                        showSearch
                                        allowClear
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                        style={{ width: 180 }}
                                    >
                                        {!isEmpty(superiorList) &&
                                            superiorList.map((item) => (
                                                <Option
                                                    key={getRandomKey(5)}
                                                    value={item.managerUserId}
                                                >
                                                    {item.userName}
                                                </Option>
                                            ))}
                                    </Select>
                                </FormItem>
                                <FormItem name="authoritySeeStatus">
                                    <Checkbox.Group>
                                        {/* <Checkbox value={2}>是否拥有全客户查看权限</Checkbox> */}
                                        <Checkbox value={1}>允许上级查看下级所属客户</Checkbox>
                                    </Checkbox.Group>
                                </FormItem>
                            </Space>
                        </Form.Item>

                        <FormItem
                            {...submitFormLayout}
                            style={{
                                marginTop: 32
                            }}
                        >
                            {authEdit && (
                                <Button type="primary" htmlType="submit" loading={submitting}>
                                    保存
                                </Button>
                            )}
                        </FormItem>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['accountInfo/getAccountInfo'],
    submitting: loading.effects['accountInfo/saveAccountInfo']
}))(AccountEditForm);
