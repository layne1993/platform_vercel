import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, notification, message, Input, Form, Select, Card, Row, Col, InputNumber, Checkbox, Space } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import moment from 'moment';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: { span: 3 },
        sm: { span: 3 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};


const Add = (props) => {
    const { loading, size, type, dispatch, addSuccess, timestamp = moment().valueOf() } = props;
    const [form] = Form.useForm();
    const [flag, setFlag] = useState(false);

    useEffect(() => {
        form.setFieldsValue({
            productList: [{dd: '1'}]
        });

    }, []);

    const onFinsh = () => {
        form.validateFields().then((values) => {
            dispatch({
                type: 'panel/addRemind',
                payload: {
                    ...values,
                    remindDate: timestamp
                },
                callback: ({ code, data = [], message = '新建成功！' }) => {
                    if (code === 1008) {
                        addSuccess();
                        openNotification('success', '提醒', message);
                        setFlag(false);
                    } else {
                        const txt = message || data || '新建失败！';
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
                title="新建日程"
                visible={flag}
                onCancel={(e) => {e.stopPropagation(); setFlag(false);}}
                maskClosable={false}
                footer={[
                    <Button key="sure" type="primary" loading={loading} onClick={(e) => {e.stopPropagation(); onFinsh(); }}>创建</Button>
                ]}
            >


                <Form
                    form={form}
                    // {...formItemLayout}
                >
                    <Form.Item
                        label={null}
                        name="remindTitle"
                        rules={[{ required: true, message: '请输入' }]}
                        // noStyle
                    >
                        <Input allowClear placeholder="输入主题"/>
                    </Form.Item>
                    <Form.Item
                        label={null}
                        name="remindContent"
                        rules={[{ required: true, message: '请输入' }]}
                        // noStyle
                    >
                        <Input.TextArea allowClear placeholder="输入详情"/>
                    </Form.Item>
                </Form>
            </Modal>



            }
            <Button size={size} type={type} onClick={(e) => { e.stopPropagation(); setFlag(true);}}> +新建</Button>
        </>
    );

};


Add.defaultProps = {
    type: 'primary',
    size: 'middle',
    onSuccess: () => { },
    addSuccess: () => {}
};

Add.propTypes = {
};


export default connect(({ panel, loading }) => ({
    loading: loading.effects['panel/addRemind']
}))(Add);
