import React, { useCallback } from 'react';
import { message, Modal, Select, Form, Input } from 'antd';
import { createInvestorLevel, editInvestorLevel } from '../../service';
import { useEffect } from 'react';
import { debounce } from 'lodash'
const { Option } = Select;

const EditInvestor = (props) => {
    const {
        layer,
        bizKey,
        productId,
        cardTypeList,
        amountTypeList,
        joinTypeList,
        isVisible,
        isEdit,
        editData,
        onConfirm,
        onCancel
    } = props;
    const [form] = Form.useForm();

    const handleSubmit = useCallback(async () => {
        const values = await form.validateFields();
        const { id } = editData;
        let res;
        if (!isEdit) {
            res = await createInvestorLevel({
                productId: productId,
                parentId: bizKey,
                level: layer,
                ...values
            });
        } else {
            res = await editInvestorLevel({
                id,
                productId,
                parentId: bizKey,
                level: layer,
                ...values
            });
        }

        if (res.code === 1008) {
            message.success(isEdit ? '编辑成功' : '添加成功');
            onConfirm();
        } else {
            message.error(res.msg || '保存失败');
        }
    }, [bizKey, editData, form, isEdit, layer, onConfirm, productId]);

    useEffect(() => {
        if (isEdit) {
            setTimeout(() => {
                form.setFieldsValue(editData);
            }, 500);
        }
    }, [editData, form, isEdit]);

    return (
        <Modal
            title={!isEdit ? `添加第${layer}层出资方` : '出资方基本信息编辑'}
            width="50%"
            visible={isVisible}
            onCancel={onCancel}
            onOk={debounce(handleSubmit,500)}
        >
            <Form
                form={form}
                labelCol={{ span: 9 }}
                wrapperCol={{ span: 16 }}
            >
                <Form.Item
                    label="出资方名称"
                    name="lpName"
                    rules={[{ required: true, message: '请输入出资方名称!' }]}
                >
                    <Input placeholder="请输入出资方名称" />
                </Form.Item>
                <Form.Item
                    label="配售对象"
                    name="buyConfigType"
                    rules={[{ required: true, message: '请输入配售对象!' }]}
                >
                    <Select allowClear>
                        <Select.Option value={1}>基金公司或其资产管理子公司一对多专户理财产品</Select.Option>
                        <Select.Option value={2}>私募基金</Select.Option>
                        <Select.Option value={3}>证券公司集合资产管理计划</Select.Option>
                    </Select>
                </Form.Item>


                <Form.Item
                    label="是否为自有资金"
                    name="isPrivateMoney"
                    rules={[{ required: true, message: '请选择是否为自有资金!' }]}
                >
                    <Select placeholder="请选择" allowClear>
                        <Option value={1}>是</Option>
                        <Option value={0}>否</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="为配售对象第几层出资方"
                    rules={[{ required: true, message: '请输入为配售对象第几层出资方!' }]}
                >
                    <Input disabled value={layer} placeholder="请输入为配售对象第几层出资方" />
                </Form.Item>

                <Form.Item
                    label="出资方身份证明类型"
                    name="cardType"
                    rules={[{ required: true, message: '请选择出资方身份证明类型!' }]}
                >
                    <Select placeholder="请选择" allowClear>
                        {cardTypeList.map((item, index) => (
                            <Option key={index} value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="出资方身份证明号"
                    name="cardNumber"
                    rules={[{ required: true, message: '请输入出资方身份证明号!' }]}
                >
                    <Input placeholder="请输入出资方身份证明号" />
                </Form.Item>

                <Form.Item
                    label="出资份额"
                    name="amount"
                    rules={[{ required: true, message: '请输入出资份额!' }]}
                >
                    <Input placeholder="请输入出资份额" />
                </Form.Item>

                <Form.Item
                    label="资金类型"
                    name="investAmountType"
                    rules={[{ required: true, message: '请选择资金类型!' }]}
                >
                    <Select placeholder="请选择" allowClear>
                        {amountTypeList.map((item, index) => (
                            <Option key={index} value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="参与类型"
                    name="lpInvestType"
                    rules={[{ required: true, message: '请选择参与类型!' }]}
                >
                    <Select placeholder="请选择" allowClear>
                        {joinTypeList.map((item, index) => (
                            <Option key={index} value={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditInvestor;
