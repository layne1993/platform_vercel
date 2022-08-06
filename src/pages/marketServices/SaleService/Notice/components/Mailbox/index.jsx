import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, Select, Radio, Spin } from 'antd';
import { emailHost, emailProtocol } from '@/utils/publicData';

const FormItem = Form.Item;
const { Password } = Input;
const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

// @Form.create()
class Mailbox extends PureComponent {
    static defaultProps = {
        handleModalVisible: () => { }
    };
    searchFormRef = React.createRef();
    constructor(props) {
        super(props);

        this.state = {
            host: '',
            radioType: 1
        };
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.searchFormRef && this.searchFormRef.current) {
                const { setFieldsValue } = this.searchFormRef.current;
                const { settings } = this.props;
                setFieldsValue({
                    emailSettingStatus: Number(settings.emailSettingStatus),
                    userEmail: settings.userEmail || '',
                    password: settings.password || '',
                    host: settings.host || '',
                    type: settings.type || ''
                });
                this.setState({
                    radioType: settings.emailSettingStatus
                });
            }
        }, 500);
    }
    // 模糊查询邮箱服务器
    filterEmailHost = (inputValue, option) => option.props.children.includes(inputValue);

    onSearchSelect = (host) => {
        if (host) {
            this.setState({ host });
        }
    };

    onBlurSelect = () => {
        const { setFieldsValue } = this.searchFormRef.current;
        const { host } = this.state;
        if (host) {
            setFieldsValue({
                host
            });
        }
    };

    handleSelectChange = (value) => {
        //  选择邮箱服务器后，自动设置邮箱类型
        const { setFieldsValue } = this.searchFormRef.current;
        let type = '';
        if (value.includes('pop')) {
            type = 'pop3';
        } else if (value.includes('imap')) {
            type = 'imap';
        }
        if (type) {
            setFieldsValue({
                type
            });
        }
        this.setState({ host: value });
    };

    handleSubmit = () => {
        const { handleEmailSubmit } = this.props;
        const { validateFields } = this.searchFormRef.current;
        validateFields()
            .then((values) => {
                //   console.log('values', values);
                handleEmailSubmit(values);
            })
            .catch((err) => {
                //   console.log(err);
            });
    };

    onEmailChange = (e) => {
        this.setState({
            radioType: e.target.value
        });
    };
    renderForm() {
        const {
            // radioType,
            settings = {}
            // onEmailChange,
        } = this.props;
        const { radioType } = this.state;
        return (
            <Form {...layout} style={{ marginTop: 8 }} ref={this.searchFormRef}>
                <FormItem
                    label="选择使用邮箱"
                    name={'emailSettingStatus'}
                    rules={[{ required: true, message: '请选择使用邮箱' }]}
                    initialValue={radioType}
                >
                    <Radio.Group onChange={this.onEmailChange}>
                        <Radio value={1}>使用管理人配置邮箱</Radio>
                        <Radio value={2}>使用易私慕默认邮箱</Radio>
                    </Radio.Group>
                </FormItem>
                {radioType === 1 ? (
                    <>
                        <FormItem
                            label="邮箱登录账号"
                            name={'userEmail'}
                            // initialValue={settings.userEmail || ''}
                            rules={[
                                { required: true, message: '请输入邮箱登录账号' },
                                {
                                    type: 'email',
                                    message: '您输入的邮箱格式不正确'
                                }
                            ]}
                        >
                            <Input placeholder="请输入用户名：***@126.com" />
                        </FormItem>
                        <FormItem
                            label="授权密码"
                            name={'password'}
                            initialValue={settings.password || ''}
                            rules={[{ required: true, message: '请输入密码' }]}
                        >
                            <Password placeholder="请输入密码" />
                        </FormItem>
                        <FormItem
                            label="邮箱服务器"
                            name={'host'}
                            initialValue={settings.host || ''}
                            rules={[{ required: true, message: '请选择邮箱服务器' }]}
                            help={<p> 已知QQ、网易（126/163）邮箱必须手动开启邮箱服务器，并使用授权密码登录。<a style={{ color: 'blue', marginRight: '5px' }} target="view_window" href="https://service.mail.qq.com/cgi-bin/help?subtype=1&id=28&no=166">QQ帮助</a><a style={{ color: 'blue' }} target="view_window" href="https://jingyan.baidu.com/article/9faa72318b76bf473c28cbf7.html">网易帮助</a></p>}
                        >
                            <Select
                                showSearch
                                title="例如：pop.exmail.qq.com"
                                placeholder="下拉可选通用服务器，或者自定义输入"
                                filterOption={this.filterEmailHost}
                                onSearch={this.onSearchSelect}
                                onBlur={this.onBlurSelect}
                                onChange={this.handleSelectChange}
                                allowClear
                            >
                                {emailHost.map((item) => (
                                    <Option key={item.key} title={item.label} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                        <FormItem
                            label="邮箱协议类型"
                            name={'type'}
                            initialValue={settings.type || ''}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择邮箱类型'
                                }
                            ]}
                        >
                            <Select placeholder="请选择" allowClear>
                                {emailProtocol.map((item) => (
                                    <Option key={item.key} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                    </>
                ) : null}
            </Form>
        );
    }

    renderFooter = () => {
        const { submitting } = this.props;
        return [
            <div key="emailSubmit" style={{ width: '100%', textAlign: 'center' }}>
                <Button type="primary" loading={submitting} onClick={this.handleSubmit}>
                    确定
              </Button>
            </div>
        ];
    };

    render() {
        const { modalVisible, top, handleModalVisible, loading } = this.props;
        return (
            <Modal
                width={720}
                style={{ top }}
                bodyStyle={{ padding: '12px 15px 0px' }}
                destroyOnClose
                maskClosable={false}
                title={
                    <span>
                        邮箱账号相关配置
                      <br />
                        <span style={{ fontSize: 12 }}>
                            (用于给投资者发送邮件的邮箱，建议首次执行邮件通知时确认该邮箱有效)
                            {/* 已知QQ、网易（126/163）邮箱必须手动开启邮箱服务器，并使用授权密码登录。<a style={{ color: 'blue', marginRight: '5px' }} target="view_window" href="https://service.mail.qq.com/">QQ帮助</a><a style={{ color: 'blue' }} target="view_window" href="http://help.mail.163.com/">网易帮助</a> */}
                        </span>
                    </span>
                }
                visible={modalVisible}
                footer={this.renderFooter()}
                onCancel={() => handleModalVisible(false)}
            >
                <Spin spinning={!!loading}>
                    <div>{this.renderForm()}</div>
                </Spin>
            </Modal>
        );
    }
}

export default Mailbox;
