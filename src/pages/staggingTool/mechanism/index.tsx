import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Input, Form, Spin, Select, DatePicker, Button, Checkbox, Menu, Space, message } from 'antd';
import _styles from './index.less';
import moment from 'moment';
const { Option } = Select;
const { RangePicker } = DatePicker;

import { getOriginInfo, addOriginInfo, editOriginInfo } from './service';

const MecanismInfo = (props) => {
    const [form] = Form.useForm();
    const dateFormat = 'YYYY-MM-DD';
    const [loading, setLoading] = useState(false);
    const [showOriginTax, setShowOriginTax] = useState(false); // 组织机构和税务登记默认不显示
    const [currentInfo, setCurrentInfo] = useState<any>({}); // 默认获取组织机构
    const [isAdd, setIsAdd] = useState(1); // 1表示当前为新增 0表示当前为编辑
    const [showCreditLong, setShowCreditLong] = useState(true); // 统一社会信用代码有效期是否显示 true显示 false不显示

    // 保存
    const onFinish = async (values: any) => {
        setLoading(true);
        console.log('Success:', values);
        const rangeBussiness = values['businessDate'];
        const rangeCredit = values['creditDate'];
        const rangeOrigin = values['originDate'];
        const rangeTax = values['taxDate'];
        let post: any = {};
        post.companyName = values.companyName;
        post.associationCode = values.associationCode;
        post.isThreeCard = values.isThreeCard;
        if (values.isThreeCard == '是' || values.isThreeCard == '1') {
            post.isThreeCard = 1;
            post.creditCode = values.creditCode;
        } else {
            post.isThreeCard = 0;
            post.businessNo = values.businessNo;
        }
        if (values.creditCodeIsLongTerm == true) {
            post.creditCodeIsLongTerm = 1;
        } else {
            post.creditCodeIsLongTerm = 0;
        }

        post.contactName = values.contactName;
        post.mobile = values.mobile;
        post.phone = values.phone;
        post.email = values.email;
        post.address = values.address;
        post.businessScope = values.businessScope;
        console.log(post);

        // 是否3合1选是
        if (values.isThreeCard == '1') {
            if (rangeCredit) {
                post.creditCodeCardValidStartDate = rangeCredit[0].format('YYYY-MM-DD');
                post.creditCodeCardValidEndDate = rangeCredit[1].format('YYYY-MM-DD');
            }
            if (isAdd == 1) {
                const res: any = await addOriginInfo(post);
                if (+res.code == 1008) {
                    message.success('保存成功');
                } else {
                    message.error('保存失败');
                }
            } else {
                post.id = currentInfo.id;
                const res: any = await editOriginInfo(post);
                if (+res.code == 1008) {
                    message.success('保存成功');
                } else {
                    message.error('保存失败');
                }
            }
            setLoading(false);
        } else {
            // 是否3合1选否
            if (rangeBussiness) {
                post.businessNoCardValidStartDate = rangeBussiness[0].format('YYYY-MM-DD');
                post.businessNoCardValidEndDate = rangeBussiness[1].format('YYYY-MM-DD');
            }
            if (rangeOrigin) {
                post.orgCodeCardValidStartDate = rangeOrigin[0].format('YYYY-MM-DD');
                post.orgCodeCardValidEndDate = rangeOrigin[1].format('YYYY-MM-DD');
            }
            if (rangeTax) {
                post.taxRegNoCardValidStartDate = rangeTax[0].format('YYYY-MM-DD');
                post.taxRegNoCardValidEndDate = rangeTax[1].format('YYYY-MM-DD');
            }
            if (values.businessNoIsLongTerm == true) { post.businessNoIsLongTerm = 1; } else { post.businessNoIsLongTerm = 0; }
            if (values.orgCodeIsLongTerm == true) { post.orgCodeIsLongTerm = 1; } else { post.orgCodeIsLongTerm = 0; }
            if (values.taxRegNoIsLongTerm == true) { post.taxRegNoIsLongTerm = 1; } else { post.taxRegNoIsLongTerm = 0; }
            post.businessNo = values.businessNo;
            post.orgCode = values.orgCode;
            post.taxRegNo = values.taxRegNo;
            if (isAdd == 1) {
                const res: any = await addOriginInfo(post);
                if (+res.code == 1008) {
                    message.success('保存成功');
                } else {
                    message.error('保存失败');
                }
            } else {
                post.id = currentInfo.id;
                const res: any = await editOriginInfo(post);
                if (+res.code == 1008) {
                    message.success('保存成功');
                } else {
                    message.error('保存失败');
                }
            }
            setLoading(false);
        }
    };

    const onFinishFailed = (errorInfo: any) => {
    };
    const onChange = (value) => {
        if (value == '0') {
            setShowOriginTax(true);
        } else {
            setShowOriginTax(false);
        }
    };

    // 营业执照证件有效期
    const onChangeDateBusiness = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };
    // 组织机构代码证件有效期
    const onChangeOrigin = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };
    // 税务登记号码有效期
    const onChangeTax = (value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
    };

    const getOrigin = async () => {
        setLoading(true);
        const res: any = await getOriginInfo();
        console.log(res);
        if (+res.code === 1008) {
            //当前状态为新增
            if (res.data == null || res.data == '') {
                setIsAdd(1);
            } else {
                //当前状态为编辑
                setIsAdd(0);
                setCurrentInfo(res.data);
                let arr = res.data;
                if (arr.isThreeCard == 1) {
                    arr.isThreeCard = '是';
                    if (res.data.creditCodeCardValidStartDate) {
                        arr.creditDate = [];
                        arr.creditDate[0] = moment(res.data.creditCodeCardValidStartDate);
                        arr.creditDate[1] = moment(res.data.creditCodeCardValidEndDate);
                    } else {
                        arr.creditDate = undefined
                    }

                } else {
                    arr.isThreeCard = '否';
                    setShowOriginTax(true);
                    if (res.data.businessNoCardValidStartDate) {
                        arr.businessDate = [];
                        arr.businessDate[0] = moment(res.data.businessNoCardValidStartDate);
                        arr.businessDate[1] = moment(res.data.businessNoCardValidEndDate);
                    } else {
                        arr.businessDate = undefined
                    }

                }

                if (res.data.orgCodeCardValidStartDate !== null) {
                    arr.originDate = [];
                    arr.originDate[0] = moment(res.data.orgCodeCardValidStartDate);
                    arr.originDate[1] = moment(res.data.orgCodeCardValidEndDate);
                }
                if (res.data.taxRegNoCardValidStartDate !== null) {
                    arr.taxDate = [];
                    arr.taxDate[0] = moment(res.data.taxRegNoCardValidStartDate);
                    arr.taxDate[1] = moment(res.data.taxRegNoCardValidEndDate);
                }
                form.setFieldsValue({
                    ...arr
                });
            }
        }
        setLoading(false);
    };

    const onChangeCreditLong = (checked) => {
        setShowCreditLong(!checked);
    };

    useEffect(() => {
        getOrigin();
    }, []);


    return (
        <div className={_styles.info}>
            <Spin spinning={loading}>
                <Form

                    form={form}
                    name="basic"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 10 }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="机构名称"
                        name="companyName"
                        rules={[{ required: true, message: '请输入机构名称!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="网下投资者协会编码（5位编码）"
                        name="associationCode"
                        rules={[{ required: true, message: '请输入网下投资者协会编码（5位编码）' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="是否三证合一"
                        name="isThreeCard"
                        rules={[{ required: true, message: '请选择是否三证合一' }]}
                    >
                        <Select
                            showSearch
                            placeholder="请选择"
                            optionFilterProp="children"
                            onChange={onChange}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            <Option value="1">是</Option>
                            <Option value="0">否</Option>
                        </Select>
                    </Form.Item>

                    {
                        showOriginTax
                            ? <div>
                                <Form.Item
                                    label="营业执照号："
                                    name="businessNo"
                                    rules={[{ required: true, message: '请输入营业执照号!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="营业执照证件有效期" required shouldUpdate>
                                    {({ getFieldValue }) => (
                                        <Space>
                                            <Form.Item
                                                noStyle
                                                rules={[{ required: !getFieldValue('businessNoIsLongTerm'), message: '请选择证件有效日期!' }]}
                                                name="businessDate"
                                            >
                                                <RangePicker />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name="businessNoIsLongTerm"
                                                valuePropName="checked"
                                            >
                                                <Checkbox>长期有效</Checkbox>
                                            </Form.Item>
                                        </Space>
                                    )}
                                </Form.Item>
                            </div>
                            : <div>
                                <Form.Item
                                    label="统一社会信用代码："
                                    name="creditCode"
                                    rules={[{ required: true, message: '请输入统一社会信用代码!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="证件有效期" required shouldUpdate>
                                    {({ getFieldValue }) => (
                                        <Space>
                                            <Form.Item
                                                noStyle
                                                name="creditDate"
                                                rules={[{ required: !getFieldValue('creditCodeIsLongTerm'), message: '请选择证件有效日期!' }]}
                                            >
                                                <RangePicker />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name="creditCodeIsLongTerm"
                                                valuePropName="checked"
                                            >
                                                <Checkbox>长期有效</Checkbox>
                                            </Form.Item>
                                        </Space>
                                    )}
                                </Form.Item>
                            </div>
                    }

                    {
                        showOriginTax
                            ? <div>
                                <Form.Item
                                    label="组织机构代码"
                                    name="orgCode"
                                    rules={[{ required: true, message: '请输入组织机构代码!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="证件有效期" required shouldUpdate>
                                    {({ getFieldValue }) => (
                                        <Space>
                                            <Form.Item
                                                noStyle
                                                name="originDate"
                                                rules={[{ required: !getFieldValue('orgCodeIsLongTerm'), message: '请选择证件有效日期!' }]}
                                            >
                                                <RangePicker />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name="orgCodeIsLongTerm"
                                                valuePropName="checked"
                                            >
                                                <Checkbox>长期有效</Checkbox>
                                            </Form.Item>
                                        </Space>
                                    )}
                                </Form.Item>
                                <Form.Item
                                    label="税务登记号码"
                                    name="taxRegNo"
                                    rules={[{ required: true, message: '请输入税务登记号码!' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item label="证件有效期" required shouldUpdate>
                                    {({ getFieldValue }) => (
                                        <Space>
                                            <Form.Item
                                                noStyle
                                                name="taxDate"
                                                rules={[{ required: !getFieldValue('taxRegNoIsLongTerm'), message: '请选择证件有效日期!' }]}
                                            >
                                                <RangePicker />
                                            </Form.Item>
                                            <Form.Item
                                                noStyle
                                                name="taxRegNoIsLongTerm"
                                                valuePropName="checked"
                                            >
                                                <Checkbox>长期有效</Checkbox>
                                            </Form.Item>
                                        </Space>
                                    )}
                                </Form.Item>
                            </div>
                            : ''
                    }
                    <Form.Item
                        label="业务联系人姓名"
                        name="contactName"
                        rules={[{ required: true, message: '请输入业务联系人姓名!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="办公电话"
                        name="phone"
                        rules={[{ required: true, message: '请输入办公电话!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="手机号码"
                        name="mobile"
                        rules={[{ required: true, message: '请输入手机号码!' },
                        {
                            required: false,
                            pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'),
                            message: '请输入正确的手机号'
                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[{ required: true, message: '请输入邮箱!' }, {
                            pattern: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,
                            message: '请输入正确的邮箱格式'

                        }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="办公地址"
                        name="address"
                        rules={[{ required: true, message: '请输入办公地址!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="经营范围"
                        name="businessScope"
                        rules={[{ required: true, message: '请输入经营范围!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            保存
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </div>
    );
};

export default MecanismInfo;
