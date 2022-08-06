import React, { useState, useEffect } from 'react';
import { Modal, Button, Radio, Form, Select, Row, Space, notification } from 'antd';
import styles from './index.less';
import { connect } from 'umi';
import { getRandomKey } from '@/utils/utils';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;


// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const EditOpenDayModal = (props) => {

    const { editModalVisible, closeModal, loading, dispatch, signFlowId } = props;

    const [form] = Form.useForm();

    const [openDayList, setOpenDayList] = useState([]);

    const _onFinish = (values) => {
        dispatch({
            type: 'signInfoList/updateSignOpenDay',
            payload: {
                signFlowId,
                openDay: values.signOpenDay,
                openDayType: values.openType
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '修改成功', 'topRight');
                    closeModal();
                } else {
                    const warningText = res.message || res.data || '修改失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const _searchOpenDay = (type) => {
        dispatch({
            type: 'signInfoList/getNewProductDay',
            payload: {
                openDayType: type,
                signFlowId
                // productDayId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    if (!isEmpty(res.data) && res.data[0]) {
                        form.setFieldsValue({
                            signOpenDay: res.data[0].stringTime
                        });
                    } else {
                        form.setFieldsValue({
                            signOpenDay: undefined
                        });
                    }
                    setOpenDayList(res.data);
                }
            }
        });
    };

    const _handleChange = (e) => {
        _searchOpenDay(e.target.value);
    };

    useEffect(() => {
        _searchOpenDay(2);
    }, []);

    return (
        <Modal
            title="选择开放日"
            width={500}
            visible={editModalVisible}
            onCancel={closeModal}
            maskClosable={false}
            footer={null}
            className={styles.editModalContainer}
        >
            <Form
                form={form}
                onFinish={_onFinish}
                initialValues={{
                    openType: 2
                }}
            >
                <FormItem name="openType">
                    <Radio.Group onChange={_handleChange}>
                        <Radio value={1}>固定开放日</Radio>
                        <Radio value={0}>临时开放日</Radio>
                        <Radio value={2}>默认最新开放日</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem name="signOpenDay">
                    <Select placeholder="请选择开放日" allowClear>
                        {
                            openDayList.map((item) => {
                                return (
                                    <Option key={getRandomKey(5)} value={item.stringTime}>{item.stringTime}</Option>
                                );
                            })
                        }
                    </Select>
                </FormItem>
                <Row justify="center">
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>保存</Button>
                        <Button onClick={closeModal}>取消</Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default connect(({ signInfoList, loading }) => ({
    signInfoList,
    loading: loading.effects['signInfoList/updateSignOpenDay']
}))(EditOpenDayModal);