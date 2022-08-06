/*
 * @Descripttion: 模板自动生成
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-06-17 11:12:46
 */
import React, { useState, useEffect } from 'react';
import {
    Form,
    Card,
    Input,
    Row,
    Space,
    Button,
    DatePicker,
    Upload,
    Select,
    Modal,
    notification
} from 'antd';
import { connect, history } from 'umi';
import { ExclamationCircleOutlined, InboxOutlined } from '@ant-design/icons';
import request from '@/utils/rest';
import {getCookie} from '@/utils/utils';
import moment from 'moment';
/**
 * 份额确认书, 新增文件
 */

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const autogeneration = (props) =>{
    const {params, flag, loading, closeModal, dispatch} = props;
    const [form] = Form.useForm();
    const [productList, setProductList] = useState([]);
    const [templateList, setTemplateList] = useState([]);


    /**
     * @description 获取产品列表
     */
    const getProductList = async () => {
        let res = await request.postJSON('/product/queryByProductName');
        if(res.code === 1008) {
            setProductList(res.data || []);
        }
    };

    const getTemplate = () => {
        dispatch({
            type: 'MANAGE_CONFIRMLIST/selectAll',
            payload: {},
            callback: ({ code, data }) => {
                if (code === 1008) {
                    setTemplateList(data || []);
                }
            }
        });
    };

    useEffect(() => {
        getProductList();
        getTemplate();
    }, []);





    /**
     * @description 文件保存
     * @param {} file
     */
    const doSave = async (values) => {
        dispatch({
            type: 'MANAGE_CONFIRMLIST/autoGeneration',
            payload: {
                ...values,
                tradeDate: values.tradeDate && moment(values.tradeDate).valueOf()
            },
            callback: ({ code, data = {}, message }) => {
                if (code === 1008) {
                    openNotification(
                        'success',
                        '份额确认书发布成功',
                        `共生成【${data.generateCount}】份额确认书`,
                        'topRight',
                    );
                    props.onSuccess();
                } else {
                    Modal.error({
                        title: '份额确认书发布失败',
                        content: message,
                        okText: '查看',
                        onOk: () => history.push('/operation/transactionInfo/TransactionList')
                    });
                }
            }
        });
    };




    return (
        <Modal
            width={800}
            title="份额确认书生成模板"
            visible={flag}
            onCancel={closeModal}
            footer={null}
        >
            <Card>
                <Form
                    {...formLayout}
                    form={form}
                    onFinish={doSave}
                    initialValues={{productId: params.productId ? params.productId * 1 : undefined}}
                >
                    <Form.Item
                        label={'产品名称'}
                        name="productId"
                        rules={[
                            {
                                required: true,
                                message: '请填写产品名称'
                            }
                        ]}
                    >
                        <Select
                            disabled={params.productId ? true : false}
                            placeholder="请选择"
                            showSearch
                            allowClear
                            filterOption={(input, option) =>
                                option.children &&
                               option.children.toString()
                                   .toLowerCase()
                                   .indexOf(input.toString().toLowerCase()) >= 0
                            }
                        >
                            {productList.map((item) => (
                                <Select.Option key={item.productId} value={item.productId}>{item.productName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="份额确认书模板"
                        name="confirmTemplateSettingId"
                        rules={[
                            {
                                required: true,
                                message: '请选择'
                            }
                        ]}
                    >
                        <Select
                            allowClear
                            placeholder="请选择"
                            showSearch
                            filterOption={(input, option) =>
                                option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {templateList.map((item) => (
                                <Select.Option key={item.confirmTemplateSettingId} value={item.confirmTemplateSettingId}>{item.templateName}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label={'交易申请日期'}
                        name="tradeDate"
                        rules={[
                            {
                                required: true,
                                message: '请选择'
                            }
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>


                    <Row justify="center">
                        <Space>
                            <Button onClick={closeModal}>取消</Button>
                            <Button loading={loading} type="primary" htmlType="submit">保存并发布</Button>
                        </Space>
                    </Row>
                </Form>
            </Card>
        </Modal>
    );

};

export default connect(({ MANAGE_CONFIRMLIST, loading }) => ({
    MANAGE_CONFIRMLIST,
    loading: loading.effects['MANAGE_CONFIRMLIST/autoGeneration']
}))(autogeneration);

autogeneration.defaultProps = {
    loading: false,
    params: {},
    closeModal: ()=> {}
};
