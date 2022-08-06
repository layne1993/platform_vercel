/*
 * @Descripttion: 流程管理创建流程弹窗
 * @version:
 * @Author: yezi
 * @Date: 2021-03-18 13:04:51
 * @LastEditTime: 2021-06-23 18:24:45
 */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { connect, history } from 'umi';
import { Row, Form, Select, Space, Button, Modal, notification } from 'antd';

const openNotification = (type, message, description, placement, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


interface NewFlowModalProps {
    flag: boolean,
    loading: boolean,
    onClose: any,
    goProductDetail: any,
    onSuccess: any,
    dispatch: any
}

interface onFinishParams {
    lifecycleTemplateInfo: {
        label: string,
        value: number | string,
        key?: number | string,
    },
    productInfo: {
        label: string,
        value: number | string,
        key?: number | string,
    }
}

const NewFlowModal: FC<NewFlowModalProps> = (props) => {
    const { flag, loading, onClose, goProductDetail, onSuccess, dispatch } = props;
    const [form] = Form.useForm();
    const [temlateList, setTemplateList] = useState<any[]>([]); // 模板list
    const [productList, setProductList] = useState<any[]>([]); // 产品list
    const [showRelatedProducts, setShowRelatedProducts] = useState<any>(false); // 产品list


    /**
     * @description 获取模板lsit
     */
    const getTemplateList = () => {
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/queryLifeCycleTemplateList',
            payload: {},
            callback: (res) => {
                if (res.code === 1008) {
                    setTemplateList(res.data || []);
                } else {
                    const warningText = res.message || res.data || '查询失败';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 获取产品list
     */
    const getpProductList = () => {
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/queryByProductName',
            payload: {},
            callback: (res) => {
                if (res.code === 1008) {
                    setProductList(res.data || []);
                } else {
                    const warningText = res.message || res.data || '查询失败';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    useEffect(getTemplateList, []);
    useEffect(getpProductList, []);


    /**
     * @description 发起跳转 创建流程
     * @param values
     */
    const onFinish = (values: onFinishParams) => {
        const { productInfo, lifecycleTemplateInfo } = values;
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO/createLifeCycleProcess',
            payload: {
                lifecycleTemplateId: lifecycleTemplateInfo?.value,
                templateName: lifecycleTemplateInfo?.label,
                productFullName: productInfo?.label,
                productId: productInfo?.value
            },
            callback: (res) => {
                const { code, data } = res;
                if (code === 1008) {
                    history.push(`/productLifeCycleInfo/list/processDetails/${data.lifecycleFlowId}`);
                    onSuccess();
                } else {
                    const warningText = res.message || res.data || '创建失败！';
                    openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // 选择模板
    const onChange = (e) => {
        console.log(e);
        const arr = temlateList.filter((item) => item.lifecycleTemplateId === e.value) || [];
        const relatedProducts = (arr.length && arr[0].relatedProducts) || false;
        if (relatedProducts) {
            setShowRelatedProducts(true);
        } else {
            setShowRelatedProducts(false);
        }
    };

    return (
        <Modal
            title="创建流程"
            visible={flag}
            footer={null}
            onCancel={onClose}
        >
            <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    label="创建流程"
                    name="lifecycleTemplateInfo"
                    rules={[{ required: true, message: '请选择' }]}
                >
                    <Select
                        showSearch
                        allowClear
                        placeholder="请选择模板"
                        style={{ maxWidth: 400 }}
                        labelInValue
                        onChange={onChange}
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {temlateList.map((item) => (
                            <Select.Option value={item.lifecycleTemplateId} key={item.lifecycleTemplateId}>
                                {item.templateName}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {
                    showRelatedProducts ? <Form.Item
                        label={
                            <span>请关联产品
                                <a onClick={() => {
                                    goProductDetail({ productId: 0 });
                                    onClose();
                                }}
                                >添加产品</a>
                            </span>
                        }
                        name="productInfo"
                        rules={[{ required: showRelatedProducts, message: '请选择' }]}
                                          >
                        <Select
                            allowClear
                            showSearch
                            placeholder="请选择产品"
                            style={{ maxWidth: 400 }}
                            labelInValue
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {productList.map((item) => (
                                <Select.Option value={item.productId} key={item.productId}>
                                    {item.productName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item> : null
                }

                <Row justify="center">
                    <Space>
                        <Button onClick={onClose}>取消</Button>
                        <Button loading={loading} type="primary" htmlType="submit">确定</Button>
                    </Space>
                </Row>
            </Form>
        </Modal>
    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['PRODUCTLIFECYCLEINFO/createLifeCycleProcess']
}))(NewFlowModal);


NewFlowModal.defaultProps = {
    flag: false
};
