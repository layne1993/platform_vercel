import React, { useEffect } from 'react';
import { Modal, Form, Button, Space, InputNumber, Input, Row, notification } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import styles from '../styles.less';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

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

const EditStarModal = (props) => {

    const { isModalVisible, record = {}, onCancel, dispatch, onOk } = props;

    const [form] = Form.useForm();

    const _onFinish = (values) => {
        let tempObj = {
            ...record,
            ...values
        };
        dispatch({
            type: 'risk/checkRiskStarRating',
            payload: {
                ...tempObj
            },
            callback: (res) => {
                if (res.code === 1008) {
                    onOk(tempObj);
                } else {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });

    };

    const _initFormValues = () => {
        if (Array.isArray(record.starList) && !isEmpty(record.starList)) {
            form.setFieldsValue({
                starList: record.starList
            });
        } else {
            form.setFieldsValue({
                starList: [{ starLevel: `${record.riskText}一星`, minScore: Number(record.minScore), maxScore: Number(record.maxScore) }]
            });
        }

    };

    useEffect(() => {
        _initFormValues();
    }, [record]);

    return (
        <Modal
            title={`风险等级星级编辑-${record.riskText}`}
            width={700}
            centered
            maskClosable={false}
            visible={isModalVisible}
            footer={null}
            onCancel={onCancel}
            className={styles.editStarModalWrapper}
        >
            <Form
                form={form}
                onFinish={_onFinish}
                autoComplete="off"
            >
                <Form.List name="starList">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map((field, i) => (
                                <Space key={field.key} className={styles.timeWrapper}>
                                    <FormItem
                                        {...field}
                                        label={`星级${i + 1}`}
                                        name={[field.name, 'starLevel']}
                                        className={styles.posOrCountdown}
                                    >
                                        <Input />
                                    </FormItem>
                                    <FormItem
                                        {...field}
                                        label="最小分值"
                                        name={[field.name, 'minScore']}
                                        className={styles.tradingDay}
                                    >
                                        <InputNumber />
                                    </FormItem>
                                    <FormItem
                                        {...field}
                                        label="最大分值"
                                        name={[field.name, 'maxScore']}
                                        className={styles.tradingDay}
                                    >
                                        <InputNumber />
                                    </FormItem>
                                    <Space className={styles.btnGroup}>
                                        {/* {fields.length < 2 ? ( */}
                                        <PlusCircleOutlined className={styles.addIcon} onClick={() => { add(); }} />
                                        {/* ) : null} */}

                                        {fields.length > 1 ? (
                                            <MinusCircleOutlined className={styles.delIcon} onClick={() => remove(field.name)} />
                                        ) : null}
                                    </Space>
                                </Space>
                            ))}
                        </>
                    )}
                </Form.List>
                <Row justify="end" style={{ marginTop: 20 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            提交
                        </Button>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};

export default connect(({ risk }) => ({
    risk
}))(EditStarModal);