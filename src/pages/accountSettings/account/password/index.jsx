import { Button, Card, Input, Form, notification } from 'antd';
import { connect, history } from 'umi';
import React, { Component } from 'react';
import md5 from 'js-md5';
import { getCookie, clearCookie } from '@/utils/utils';
import styles from './style.less';

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

class PasswordForm extends Component {
    state = {
        // account: getCookie('account'),

    };

    componentDidMount() {
    }


    onFinish = (values) => {
        //  保存提醒通知管理
        const { dispatch } = this.props;

        dispatch({
            type: 'passwordInfo/submitPasswordForm',
            payload: {
                managerUserId: getCookie('managerUserId'),
                ...values,
                confirmPassword: undefined,
                password: values.password && md5(values.password),
                newPassword: md5(values.newPassword)
            },
            callback: (res) => {
                if (res && res.code === 1008) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                    dispatch({
                        type: 'LOGIN/logout',
                        callback: (res) => {
                            if(res.code === 1008) {
                                sessionStorage.removeItem('tokenId');
                                clearCookie();
                                history.replace({
                                    pathname: '/user/login'
                                });
                            }
                        }
                    });
                } else {
                    const warningText = res.message || res.data || '保存密码失败，请稍后再试！';
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

    render() {
        const { submitting, loading } = this.props;
        const email = getCookie('email') || '';
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
            // <PageHeaderWrapper title="修改密码">
            <Card bordered={false} loading={loading} className={styles.passwordForm}>
                <Form
                    {...formItemLayout}
                    hideRequiredMark
                    style={{
                        marginTop: 8
                    }}
                    name="passwordForm"
                    initialValues={{
                        email
                    }}
                    onFinish={this.onFinish}
                >
                    <FormItem label="当前账号" name="email">
                        <Input disabled />
                    </FormItem>
                    <FormItem
                        label="原登录密码"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入原密码'
                            }
                        ]}
                    >
                        <Input.Password placeholder="请输入原密码" />
                    </FormItem>
                    <FormItem
                        label="新密码"
                        name="newPassword"
                        rules={[
                            {
                                required: true,
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
                        dependencies={['newPassword']}
                        rules={[
                            {
                                required: true,
                                message: '请再次输入的密码'
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('两次输入的密码不一致'));
                                }
                            })
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="请再次输入的密码" />
                    </FormItem>
                    <FormItem
                        {...submitFormLayout}
                        style={{
                            marginTop: 32
                        }}
                    >
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                        >
                            保存
                        </Button>
                    </FormItem>
                </Form>
            </Card>
            // </PageHeaderWrapper>
        );
    }
}

export default connect(({ loading }) => ({
    submitting: loading.effects['passwordInfo/submitPasswordForm']
}))(PasswordForm);
