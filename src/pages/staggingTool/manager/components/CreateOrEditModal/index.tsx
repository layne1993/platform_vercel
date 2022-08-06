import React, { useState, useEffect, useCallback } from 'react';
import { DatePicker, Modal, Form, Input, Select, Space, InputNumber } from 'antd';
import _styles from './index.less';
import Checkbox from 'antd/lib/checkbox/Checkbox';
const { Option } = Select;
const { RangePicker } = DatePicker;

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
};

const cardTypeMap = {
    1: '中国居民身份证',
    2: '港澳居民来往内地通行证',
    3: '台湾居民来往大陆通行证',
    4: '护照',
    5: '外国人永久居留身份证',
    6: '统一社会信用代码',
    7: '组织机构代码',
    8: '投资业务许可证',
    9: '境外机构注册号',
    10: '营业执照',
    11: '其他'
};

const managerTypeMap = {
    0: '0.未知',
    1: '1.对本机构实施控制或间接控制、持有5%的股东、共同控制或施加重大影响的机构和个人（含董监高）',
    2: '2.本机构的董事、监事、高级管理人员或执行合伙人',
    3: '3.本机构控股股东控制的其他机构（子公司）',
    4: '4.本机构控制、间接实施控制、共同控制或实施重大影响的机构（本投资者的控股子公司）',
    5: '5.除4外，本机构持有5%以上股份的机构（子公司）',
    6: '6.其他可能导致配售存在不当行为或存在不正当利益输送的其他自然人、法人和组织',
    7: '7.持有本投资者5%以上股份的股东情况',
    8: '8.本投资者的控股股东情况',
    9: '9.对本机构能够直接或间接实施控制、共同控制或施加重大影响的公司或个人',
    10: '10.法定代表人',
    11: '11.负责人',
    12: '12.授权办理业务人员',
    13: '13.本公司法人股东',
    14: '14.本公司自然人股东、实际控制人、董监高、和其他员工',
    15: '15.上述14条关联人关系密切的家庭成员，包括配偶、子女及其配偶、父母及配偶的父母、兄弟姐妹及其配偶、配偶的兄弟姐妹、子女配偶的父母',
    16: '16.本公司/本人控制或参股的公司，包含本公司为实际控制人的公司、本公司持有5%以上（含5%）股份的公司',
    17: '17.机构投资者实际控制人',
    18: '18.机构投资者控股股东控制的其他子公司和机构投资者的控股子公司、机构投资者能够实施重大影响的其他公司'
};

// 关联关系
const relevance = {
    14: [
        { label: '股东', value: 1 },
        { label: '实际控制人', value: 1 },
        { label: '董监高', value: 1 },
        { label: '其他员工', value: 2 }
    ],
    15: [
        { label: '配偶', value: 1 },
        { label: '子女', value: 1 },
        { label: '子女配偶', value: 1 },
        { label: '父母', value: 2 },
        { label: '配偶父母', value: 2 },
        { label: '兄弟姐妹', value: 2 },
        { label: '兄弟姐妹配偶', value: 2 },
        { label: '配偶的兄弟姐妹', value: 2 },
        { label: '子女配偶的父母', value: 2 }
    ],
    16: [
        { label: '股东', value: 1 },
        { label: '实际控制人', value: 1 },
        { label: '董监高', value: 1 },
        { label: '控股股东', value: 2 },
        { label: '控股子公司', value: 1 },
        { label: '控股股东控制的其他子公司', value: 1 }
    ]
};

const cardTypes = Object.keys(cardTypeMap).map((key) => ({ value: +key, label: cardTypeMap[key] }));
const managerTypes = Object.keys(managerTypeMap).map((key) => ({ value: +key, label: managerTypeMap[key] }));

const CreateOrEditModal = ({
    isVisible,
    formData,
    onCancel,
    onConfirm
}) => {
    const [form] = Form.useForm();
    const [type, setType] = useState(1);

    const handleConfirm = useCallback(async () => {
        const res = await form.validateFields();
        const { cardType, validityDate, isLongTerm } = res;
        if (formData.id) res.id = formData.id;
        delete res.validityDate;
        onConfirm({
            ...res,
            cardType: +cardType,
            isLongTerm: isLongTerm ? 1 : 0,
            validityOfCertificateStartDate: validityDate ? validityDate[0]?.format('YYYY-MM-DD') : '',
            validityOfCertificateEndDate: validityDate ? validityDate[1]?.format('YYYY-MM-DD') : ''
        });
    }, [form, formData, onConfirm]);

    useEffect(() => {
        if (isVisible) {
            const { id, type } = formData;
            if (id) {
                form.setFieldsValue(formData);
                setType(type);
            } else {
                setTimeout(() => {
                    form.resetFields();
                    setType(1);
                }, 100);
            }
        }
    }, [form, formData, isVisible]);

    return (
        <Modal
            destroyOnClose
            maskClosable={false}
            visible={isVisible}
            width="60%"
            title="管理人数据维护"
            onCancel={() => onCancel()}
            onOk={handleConfirm}
        >
            <Form
                {...formItemLayout}
                form={form}
                className={_styles.managerForm}
                initialValues={formData}
                scrollToFirstError
            >
                <Form.Item
                    name="type"
                    label="类型"
                    rules={[{ required: true, message: '请选择类型' }]}
                >
                    <Select placeholder="请选择类型" onChange={(v) => setType(+v)}>
                        {managerTypes.map((item) => (
                            <Option key={item.value} value={item.value}>{item.label}</Option>)
                        )}
                    </Select>
                </Form.Item>
                <Form.Item
                    name="sort"
                    label="序号"
                    rules={[{ required: true, message: '请输入序号' }]}
                    extra="请输入序号，前序编号与类别相关。如序号与已有序号相同，将排在已有序号之前，希望排在最前，请填1"
                >
                    <Input type="number" addonBefore={<span>{type}</span>} placeholder="请输入" />
                </Form.Item>
                {
                    [14, 15].includes(type) &&
                    <Form.Item
                        name="name"
                        label="姓名"
                        rules={[{ required: true, message: '请输入姓名' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [13].includes(type) &&
                    <Form.Item
                        name="name"
                        label="工商登记名称"
                        rules={[{ required: true, message: '请输入工商登记名' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [16].includes(type) &&
                    <Form.Item
                        name="name"
                        label="姓名/工商登记名称"
                        rules={[{ required: true, message: '请输入工商登记名' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [17].includes(type) &&
                    <Form.Item
                        name="name"
                        label="公司/自然人名称"
                        rules={[{ required: true, message: '请输入公司/自然人名称' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [18].includes(type) &&
                    <Form.Item
                        name="name"
                        label="公司名称"
                        rules={[{ required: true, message: '请输入公司名称' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [13, 16].includes(type) &&
                    <Form.Item
                        name="cardNumber"
                        label="组织机构代码或统一社会信用代码"
                        rules={[{ required: true, message: '请输入组织机构代码或统一社会信用代码或身份证号' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(type) &&
                    <Form.Item
                        name="name"
                        label="工商登记名称或自然人姓名"
                        rules={[{ required: true, message: '请输入工商登记名称或自然人姓名' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(type) &&
                    <Form.Item
                        name="cardType"
                        label="证件类型"
                        rules={[{ required: true, message: '请选择证件类型' }]}
                    >
                        <Select placeholder="请选择证件类型">
                            {cardTypes.map((item, index) => (
                                <Option key={index} value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                }



                {[1, 2].includes(type) &&
                    <Form.Item
                        name="holdAPost"
                        label="担任职务"
                        rules={[{ required: true, message: '请输入职务' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 17, 18].includes(type) &&
                    <Form.Item
                        name="cardNumber"
                        label="组织机构代码或统一社会信用代码或身份证号"
                        rules={[{ required: true, message: '请输入组织机构代码或统一社会信用代码或身份证号' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [15].includes(type) &&
                    <Form.Item
                        name="cardNumber"
                        label="身份证号"
                        rules={[{ required: true, message: '请输入身份证号' }]}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                }

                {
                    [14, 15, 16].includes(type) &&
                    <Form.Item
                        name="relationType"
                        label="关联关系"
                        rules={[{ required: true, message: '请选择关联关系' }]}
                    >
                        <Select placeholder="请选择证件类型">
                            {Array.isArray(relevance[type]) && relevance[type].map((item, index) => (
                                <Option key={index} value={item.label}>{item.label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                }

                {
                    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].includes(type) &&
                    <Form.Item label="证件有效期">
                        <Space>
                            <Form.Item
                                noStyle
                                name="validityDate"
                            >
                                <RangePicker />
                            </Form.Item>
                            <Form.Item
                                noStyle
                                name="isLongTerm"
                                valuePropName="checked"
                            >
                                <Checkbox>长期有效</Checkbox>
                            </Form.Item>
                        </Space>
                    </Form.Item>
                }

                {
                    [7, 17, 18].includes(type) &&
                    <>
                        <Form.Item
                            label="持股比例(%)"
                            name="shareholdingRatio"
                            rules={[{ required: true, message: '请输入' }]}
                        >
                            <InputNumber min={0} />
                        </Form.Item>
                    </>
                }

            </Form>
        </Modal>
    );
};

export default CreateOrEditModal;
