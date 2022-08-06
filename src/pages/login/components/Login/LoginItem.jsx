import { Button, Col, Input, Row, Form, notification } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import omit from 'omit.js';
import { getFakeCaptcha } from '@/services/login';
import ItemMap from './map';
import LoginContext from './LoginContext';
import styles from './index.less';
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message, description, placement, duration: duration || 3
    });
};
const FormItem = Form.Item;

const getFormItemOptions = ({ onChange, defaultValue, customProps = {}, rules }) => {
    const options = {
        rules: rules || customProps.rules
    };

    if (onChange) {
        options.onChange = onChange;
    }

    if (defaultValue) {
        options.initialValue = defaultValue;
    }

    return options;
};

const LoginItem = (props) => {
    const [count, setCount] = useState(props.countDown || 0);
    const [timing, setTiming] = useState(false); // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props tabUtil

    const {
        onChange,
        customProps,
        defaultValue,
        rules,
        name,
        getCaptchaButtonText,
        getCaptchaSecondText,
        updateActive,
        type,
        tabUtil,
        getCompanyList,
        ...restProps
    } = props;
    // const countDown = ()=>{
    //     setTiming(true)
    // }
    const onGetCaptcha = useCallback(async() => {
        // return;
        getCompanyList();
        // const res = await getFakeCaptcha({ mobile });
        // if (res && res.code === 1008) {
        //     openNotification('success', '验证码已经发送至你的手机！', res.message, 'topRight');
        // } else {
        //     const warningText = res.message || res.data || '验证码发送失败';
        //     openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
        // }
        // setTiming(true);
    }, [1]);
    useEffect(() => {
        setTiming(props.timing);
    }, [props.timing]);

    useEffect(() => {
        let interval = 0;
        const { countDown } = props;

        if (timing) {
            interval = window.setInterval(() => {
                setCount((preSecond) => {
                    if (preSecond <= 1) {
                        setTiming(false);
                        clearInterval(interval); // 重置秒数

                        return countDown || 60;
                    }

                    return preSecond - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [timing]);

    if (!name) {
        return null;
    } // get getFieldDecorator props

    const options = getFormItemOptions(props);
    const otherProps = restProps || {};

    if (type === 'Captcha') {
        const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
        return (
            <FormItem shouldUpdate noStyle>
                {({ getFieldValue, getFieldError }) => (
                    <Row gutter={8}>
                        <Col span={16}>
                            <FormItem name={name} {...options}>
                                <Input {...customProps} {...inputProps} />
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <Button
                                disabled={timing}
                                className={styles.getCaptcha}
                                size="large"
                                onClick={() => {
                                    const error = getFieldError('mobile');
                                    const value = getFieldValue('mobile');
                                    // console.log(error);
                                    // console.log(value);
                                    // return;
                                    if (value && error.length < 1) {
                                        onGetCaptcha(value);
                                    }else{
                                        openNotification('error', '提示', '请输入正确手机号', 'topRight');

                                    }
                                }}
                            >
                                {timing ? `${count} 秒` : '获取验证码'}
                            </Button>
                        </Col>
                    </Row>
                )}
            </FormItem>
        );
    }

    return (
        <FormItem name={name} {...options}>
            <Input {...customProps} {...otherProps} />
        </FormItem>
    );
};

const LoginItems = {};
Object.keys(ItemMap).forEach((key) => {
    const item = ItemMap[key];

    LoginItems[key] = (props) => (
        <LoginContext.Consumer>
            {(context) => (
                <LoginItem
                    customProps={item.props}
                    rules={item.rules}
                    {...props}
                    type={key}
                    {...context}
                    updateActive={context.updateActive}
                />
            )}
        </LoginContext.Consumer>
    );
});
export default LoginItems;
