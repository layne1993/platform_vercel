import React, { useState, useEffect, useRef  } from 'react';
import { Alert, Checkbox, Button, Modal, List, notification, Form, Input } from 'antd';
import { MailOutlined, LockTwoTone, MobileTwoTone } from '@ant-design/icons';
import { connect, history } from 'umi';
import LoginFrom from './components/Login';
import md5 from 'js-md5';
import { getCookie, setCookie, menuAuthTransform, authTransform } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';
import styles from './style.less';

const { UserName, Password, Submit, Mobile, Captcha } = LoginFrom;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const LoginMessage = ({ content }) => (
    <Alert
        style={{
            marginBottom: 24
        }}
        message={content}
        type="error"
        showIcon
    />
);

const Login = (props) => {
    const [form] = Form.useForm();



    const { getCustomer, submitting } = props;
    const [isCheck, setCheck] = useState(false);
    const [hasRememberPassword, setHasRememberPassword] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showButton, setshowButton] = useState(true);
    const [accountList, setAccountList] = useState([]);
    const [code, setCode] = useState('');
    const [timing, setTiming] = useState(false);
    /**
     * @description 获取记录密码的状态
     */
    const getRememberPasswordStatus = () => {
        // eslint-disable-next-line no-undef
        let status = localStorage.getItem('hasRememberPassword');
        let hasRememberPassword = false;
        if(status === '1') {
            hasRememberPassword = true;
            // eslint-disable-next-line no-undef
            form.setFieldsValue({email: localStorage.getItem('email')});
        }

        // console.log(hasRememberPassword, 'hasRememberPassword');

        setCheck(hasRememberPassword);
        setHasRememberPassword(hasRememberPassword);
    };


    useEffect(getRememberPasswordStatus, []);


    /**
     * @description 记住账号
     * @param {*} val
     */
    const rememberPassword = (val) => {
        setCheck(isCheck);
        setHasRememberPassword(val);
    };
    //获取验证码

    const getCode = (code)=>{
        setCode(code);
        const { dispatch } = props;
        const formData = form.getFieldsValue();
        dispatch({
            type:'LOGIN/getFakeCaptcha',
            payload:{
                companyCode:code,
                mobile:formData.mobile
            },
            callback:(res)=>{
                if(res.code === 1008){
                    openNotification('success', '提示', '验证码发送成功', 'topRight');
                    setModalVisible(false);
                    setTiming(true);
                }
            }
        });
    };

    /**
     * @description 登录
     * @param {*} values
     */
    const doLogin = (code) => {
        const { dispatch } = props;
        const formData = form.getFieldsValue();
        for(let key  in formData){
            formData[key] = formData[key] && formData[key].trim() || formData[key]
        }
        dispatch({
            type: 'LOGIN/login',
            payload: {
                ...formData,
                password: formData.password && md5(formData.password),
                isChecked: isCheck,
                loginType: showButton ? 1 : 2,
                companyCode: code
            },
            callback: (res) => {
                if (res.code === 1008) {
                    // console.log(res, 'ggg');
                    let { token, account, userName, companyCode, managerUserId, email, companyName, menuAuths=[] } = res.data || {};
                    // eslint-disable-next-line no-undef
                    sessionStorage.setItem('tokenId', token);
                    setCookie('vipAdminToken', token);
                    setCookie('account', account);
                    setCookie('userName', userName);
                    setCookie('companyCode', companyCode);
                    setCookie('managerUserId', managerUserId);
                    setCookie('email', email);
                    setCookie('companyName', companyName);
                    // eslint-disable-next-line no-undef
                    localStorage.setItem('email', email);
                    // eslint-disable-next-line no-undef
                    localStorage.setItem('hasRememberPassword', hasRememberPassword | 0);
                    let permissionList = {};
                    menuAuths.map((item) => {
                        permissionList[item.menuCode] = authTransform(item);
                    });
                    let menuList = menuAuthTransform(menuAuths);
                    setAuthority(menuList);
                    // eslint-disable-next-line no-undef
                    sessionStorage.setItem('PERMISSION', JSON.stringify(permissionList));

                    window.location.href=`${BASE_PATH.baseUrl}panel`;
                    // history.replace({pathname: '/panel'});
                } else {
                    if (showButton) {
                        let msg = res.message || '账号或密码错误';
                        openNotification('warning', '提示', msg, 'topRight');
                    } else {
                        let msg = res.message || '手机号或验证码错误';
                        openNotification('warning', '提示', msg, 'topRight');
                    }
                }
            }
        });
    };


    /**
     * 获取公司信息
     */
    const getCompanyList = () => {
        const {dispatch} = props;
        const formData = form.getFieldsValue();
        for(let key  in formData){
            formData[key] = formData[key] && formData[key].trim() || formData[key]
        }
        dispatch({
            type: 'LOGIN/getCompanies',
            payload: {
                ...formData,
                password: formData.password && md5(formData.password),
                loginType: showButton ? 1 : 2
            },
            callback: (res) => {
                if (res.code === 1008) {
                    if ((res.data).length === 0) {
                        if (showButton) {
                            openNotification('warning', '提示', '账号或密码错误', 'topRight');
                        } else {
                            openNotification('warning', '提示', '手机号或验证码错误', 'topRight');
                        }
                    } else if ((res.data).length === 1) {
                        let obj = res.data[0] || {};
                        if(showButton){
                            doLogin(obj.companyCode);
                        }else{
                            getCode(obj.companyCode);
                        }
                    } else {
                        setAccountList(res.data);
                        setModalVisible(true);
                    }
                } else {
                    if (showButton) {
                        let msg = res.message || '账号或密码错误';
                        openNotification('warning', '提示', msg, 'topRight');
                    } else {
                        let msg = res.message || '手机号或验证码错误';
                        openNotification('warning', '提示', msg, 'topRight');
                    }
                }
                // return;
            }
        });
    };

    // 登录
    const onFinish = (values) => {
        // console.log(values)
        if(showButton){
            getCompanyList();
        }else{
            doLogin(code);
        }
    };





    // 选择登录方式
    const ChangeButtonValue = () => {
        const { dispatch } = props;
        setshowButton(!showButton);
    };

    // 选择登录


    return (
        <div className={styles.main}>

            <div className={styles.loginBox}>
                <div className={styles.pbutton}>
                    <p>建议使用谷歌或360浏览器</p>
                    <Button className={styles.button} onClick={ChangeButtonValue}>
                        {showButton ? '手机登录' : '账号密码登录'}
                    </Button>
                </div>

                <Form
                    form={form}
                    onFinish={onFinish}
                >
                    {showButton && <>
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入登录邮箱'
                                }
                            ]}
                        >
                            <Input
                                style={{height: '40px'}}
                                prefix={<MailOutlined style={{color: '#1890ff'}} className={styles.prefixIcon}/>}
                                placeholder="请输入登录邮箱..."
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入密码！'
                                },
                                {
                                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[\s\S]{8,20}$/,
                                    message: '密码长度8~20位，必须包含大写字母、小写字母和数字'
                                }
                            ]}
                        >
                            <Input
                                style={{height: '40px'}}
                                prefix={<LockTwoTone className={styles.prefixIcon} />}
                                type="password"
                                placeholder="请输入密码..."
                            />
                        </Form.Item>
                        <Checkbox
                            checked={hasRememberPassword}
                            onChange={(e) => rememberPassword(e.target.checked)}
                        >
                            记住账号
                        </Checkbox>
                    </>}

                    {!showButton &&  <>
                        <Form.Item
                            name="mobile"
                            placeholder="手机号"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入手机号！'
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '手机号格式错误！'
                                }
                            ]}
                        >
                            <Input
                                style={{height: '40px'}}
                                prefix={<MobileTwoTone className={styles.prefixIcon} />}
                                placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Captcha
                            name="verificationCode"
                            placeholder="验证码"
                            countDown={60}
                            getCaptchaButtonText=""
                            getCaptchaSecondText="秒"
                            timing={timing}
                            rules={[
                                {
                                    required: true,
                                    message: '请输入验证码！'
                                }
                            ]}
                            getCompanyList={getCompanyList}
                        />
                    </>}
                    <Button style={{width: '100%', marginTop: '15px', height: '40px'}} type="primary" htmlType="submit" loading={submitting || getCustomer}>登录</Button>

                </Form>

            </div>


            {/* 选择公司 */}
            <Modal
                className={styles.modal}
                title="请选择登录账号"
                visible={modalVisible}
                footer={null}
                keyboard={false}
                maskClosable={false}
                onCancel={() => setModalVisible(false)}
            >
                <List
                    header={
                        <div className={styles.ListHeader}>
                            <h3>公司名称</h3>
                            <h3>操作</h3>
                        </div>
                    }
                    // itemLayout="horizontal"
                    dataSource={accountList}
                    renderItem={(item, index) => (
                        <List.Item style={{ paddingLeft: 20 }} className={`testAutomation-multiManager${index}`}>
                            <div>{item.companyName}</div>
                            <Button type="primary" onClick={() => showButton && doLogin(item.companyCode) || getCode(item.companyCode)}>
                                {showButton ? '登录' :'发送验证码'}
                            </Button>
                        </List.Item>
                    )}
                />
            </Modal>
        </div>
    );
};

export default connect(({ login, loading }) => ({
    userLogin: login,
    submitting: loading.effects['LOGIN/login'],
    getCustomer: loading.effects['LOGIN/getCustomer']
}))(Login);
