import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Space, Upload, Button, Input, Select, InputNumber, Affix, DatePicker, Checkbox, message, Collapse, notification } from 'antd';
import { connect, history } from 'umi';
import { getBirthdayByIdCard, getSexByIdCard, getAgeByIdCard } from '@/utils/utils';
import {
    XWcustomerCategoryOptions,
    XWDocumentType,
    XWGender,
    XWcertificateType,
    XWInvestorsType,
    PROFESSION,
    XWnameStatus,
    CUSTOMER_SOURCE,
    weChatBindState,
    CHANNELTYPE,
    CONSTASSOCIATIONINVESTORS
} from '@/utils/publicData';
import {
    DISABLEDFIELDS
} from './data.js';
import _styles from './styles.less';
import moment from 'moment';

import front from '@/assets/front.png';
import back from '@/assets/back.png';
import TextArea from 'antd/lib/input/TextArea';
// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

// 信息提示
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 12 }
};

const formItemLayout1 = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 }
};

const formItemLayout2 = {
    labelCol: { span: 10 },
    wrapperCol: { span: 10 }
};

const getChannelTypeStr = (arr) => {
    if (arr) {
        let strArr = [];
        CHANNELTYPE.map((item) => {
            if (arr.includes(item.value)) {
                strArr.push(item.label);
            }
        });
        return strArr.join('+');
    } else return null;
};


const CustomerInfo = (props) => {
    const { dispatch, params, loading, addLoading, updateLoading } = props;
    const [form] = Form.useForm();
    const [customerList, setCustomerList] = useState([]); // 客户经理
    const [frontSideUrl, setFrontSideUrl] = useState(null); // 身份证正面预览地址
    const [reverseSideUrl, setReverseSideUrl] = useState(null); // 身份证反面于丽娜地址
    const [frontFile, setFrontFile] = useState(null); // 身份证正面文件
    const [reverseFile, setReverseFile] = useState(null); // 身份证反面文件
    const [customerType, setCustomerType] = useState(1); // 客户类型
    const [customerInfo, setCustomerInfo] = useState({ }); //客户信息
    const [disableFields, setDisabled] = useState({ }); // 不可编辑字段
    const [agencies, setAgencies] = useState([]); // 经销商
    const [channelList, setChnnelList] = useState([]); // 经销商

    /**
     * @description 获取客户经理列表
     */
    const getManagers = () => {
        dispatch({
            type: 'INVESTOR_DETAIL/getManagersList',
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    setCustomerList(data.accountList || []);
                }
            }
        });
    };

    /**
     * @description 获取客户经理列表
     */
    const getAgencies = () => {
        dispatch({
            type: 'INVESTOR_DETAIL/getAgencies',
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    setAgencies(data || []);
                }
            }
        });
    };

    /**
     * @description 获取渠道商列表
     */
    const getChannelList = () => {
        dispatch({
            type: 'global/channelList',
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    setChnnelList(data || []);
                }
            }
        });
    };

    // 取消
    const onCancel = () => {
        history.goBack();
    };

    /**
     * 已经实名，不可编辑字段有值得话不可编辑字段
     * @param {*} disableSourceData 不可编辑的字段
     * @param {*} data
     */
    const setDisabledFields = (disableSourceData = { }, data = []) => {
        let disabledFields = { };
        for (let key in disableSourceData) {
            if (data[key]) {
                disabledFields[key] = true;
            }
        }
        return disabledFields;
    };

    /**
     * 查询用户信息
     */
    const getCustomerInfo = () => {
        if (params.customerId == 0) return;
        dispatch({
            type: 'INVESTOR_DETAIL/queryCustomerInfo',
            payload: { customerId: Number(params.customerId) },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    const { data = { } } = res;
                    let fromData = { };
                    for (let key in data) {
                        // eslint-disable-next-line no-prototype-builtins
                        if (data.hasOwnProperty(key)) {
                            fromData[key] = data[key];
                        }
                    }

                    if (data.customerType) {
                        setCustomerType(data.customerType);
                    }

                    if (data.realNameState === 1 || data.realNameState === 2) {
                        setDisabled(setDisabledFields(DISABLEDFIELDS, data));
                    }

                    setCustomerInfo(data);
                    try {
                        form.setFieldsValue({
                            ...fromData,
                            currentAutomatic: fromData.currentAutomatic ? fromData.currentAutomatic.split(',').map(Number) : undefined,
                            historyAutomatic: fromData.historyAutomatic ? fromData.historyAutomatic.split(',').map(Number) : undefined,
                            currentManual: fromData.currentManual ? fromData.currentManual.split(',').map(Number) : undefined,
                            historyManual: fromData.historyManual ? fromData.historyManual.split(',').map(Number) : undefined,
                            typeAutomatic: getChannelTypeStr(fromData.typeAutomatic),
                            typeManual: fromData.typeManual ? fromData.typeManual : undefined,
                            dealerIds: fromData.dealerIds ? fromData.dealerIds : undefined,
                            realNameDate: fromData.realNameDate && moment(fromData.realNameDate).format(dateFormat),
                            identifyCardUpdateDate: fromData.identifyCardUpdateDate && moment(fromData.identifyCardUpdateDate).format(dateFormat),
                            cardLongTime: Boolean(fromData.cardLongTime),
                            companyIsCardLongTime: Boolean(fromData.companyIsCardLongTime),
                            legalPersonIsCardLongTime: Boolean(fromData.legalPersonIsCardLongTime),
                            authorizedRepresentativeIsCardLongTime: Boolean(fromData.authorizedRepresentativeIsCardLongTime),
                            personBirthday: fromData.personBirthday && moment(fromData.personBirthday),
                            registerDate: fromData.registerDate && moment(fromData.registerDate),
                            registerTime: fromData.registerTime && moment(fromData.registerTime),
                            setDate: fromData.setDate && moment(fromData.setDate),
                            cardValidEndTime: fromData.cardValidEndTime && [moment(fromData.cardValidStartTime), moment(fromData.cardValidEndTime)],
                            companyCardValidEndTime: fromData.companyCardValidStartTime && [moment(fromData.companyCardValidStartTime), moment(fromData.companyCardValidEndTime)],
                            legalPersonCardValidEndTime: fromData.legalPersonCardValidStartTime && [moment(fromData.legalPersonCardValidStartTime), moment(fromData.legalPersonCardValidEndTime)],
                            authorizedRepresentativeCardValidEndTime: fromData.authorizedRepresentativeCardValidStartTime && [moment(fromData.authorizedRepresentativeCardValidStartTime), moment(fromData.authorizedRepresentativeCardValidEndTime)]
                        });
                        setFrontSideUrl(fromData.frontSide);
                        setReverseSideUrl(fromData.reverseSide);
                    } catch (error) {
                        // console.log(error);
                    }


                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };
    // 获取客户经理
    useEffect(getManagers, []);
    useEffect(getAgencies, []);
    useEffect(getChannelList, []);
    useEffect(getCustomerInfo, []);


    /**
     * @description 反面照
     * @param {} file
     */
    const beforeUpload = async (file, type) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只支持JPG/PNG文件！');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片最大为2MB!');
            return false;
        }

        getBase64(file, (imageUrl) => {
            if (type === 1) {
                setFrontSideUrl(imageUrl);
                setFrontFile(file);
            } else {
                setReverseSideUrl(imageUrl);
                setReverseFile(file);
            }
        });
        return false;
    };



    /**
     * @description 当证件类型为身份证时（身份证枚举类型为1） 自动计算性别年龄生日
     *
     */
    const getSexBirthdayAge = (type, val) => {
        // console.log(type, val, 'getSexBirthdayAge');
        const formValues = form.getFieldsValue();
        // console.log(formValues, 'formValues');
        // 个人
        if (formValues.cardType === 1 && formValues.cardNumber) {
            form.setFieldsValue({
                personSex: getSexByIdCard(formValues.cardNumber),
                personBirthday: getBirthdayByIdCard(formValues.cardNumber) && moment(getBirthdayByIdCard(formValues.cardNumber)),
                age: getAgeByIdCard(formValues.cardNumber)
            });
        }
        // 法人
        if (formValues.legalPersonCardType === 1 && formValues.legalPersonCardNumber) {
            form.setFieldsValue({
                legalPersonSex: getSexByIdCard(formValues.legalPersonCardNumber),
                legalPersonAge: getAgeByIdCard(formValues.legalPersonCardNumber)
            });
        }

        // 授权代表人
        if (formValues.authorizedRepresentativeCardType === 1 && formValues.authorizedRepresentativeCardNumber) {
            form.setFieldsValue({
                authorizedRepresentativeSex: getSexByIdCard(formValues.authorizedRepresentativeCardNumber),
                authorizedRepresentativeAge: getAgeByIdCard(formValues.authorizedRepresentativeCardNumber)
            });
        }
    };


    /**
     * @description 提交
     */
    const onFinish = (values) => {
        // console.log(values, 'values');
        const { params } = props;
        let url = params.customerId != 0 ? 'INVESTOR_DETAIL/updateCustomerInfo' : 'INVESTOR_DETAIL/createCustomerInfo';

        const formParams = {
            ...customerInfo,
            ...values,
            typeAutomatic: customerInfo.typeAutomatic,
            isVIP: values.isVIP ? true : false,
            historyAutomatic: values.historyAutomatic ? values.historyAutomatic.join(',') : undefined,
            currentAutomatic: values.currentAutomatic ? values.currentAutomatic.join(',') : undefined,
            currentManual: values.currentManual ? values.currentManual.join(',') : undefined,
            historyManual: values.historyManual ? values.historyManual.join(',') : undefined,
            loginMobile: values.loginMobile || null,
            // investorType: values.customerType === 3 ? 2 : values.investorType,
            cardLongTime: values.cardLongTime ? '1' : '0',
            companyIsCardLongTime: values.companyIsCardLongTime ? '1' : '0',
            legalPersonIsCardLongTime: values.legalPersonIsCardLongTime ? '1' : '0',
            authorizedRepresentativeIsCardLongTime: values.authorizedRepresentativeIsCardLongTime ? '1' : '0',
            // personBirthday: values.personBirthday && moment(values.personBirthday).valueOf(),
            // registerDate: values.registerDate && moment(values.registerDate).valueOf(),
            // setDate: values.setDate &&  moment(values.setDate).valueOf(),
            cardValidStartTime: values.cardValidEndTime && moment(values.cardValidEndTime[0]), //.valueOf(),
            cardValidEndTime: values.cardValidEndTime && moment(values.cardValidEndTime[1]), //.valueOf(),
            companyCardValidStartTime: values.companyCardValidEndTime && moment(values.companyCardValidEndTime[0]), // .valueOf(),
            companyCardValidEndTime: values.companyCardValidEndTime && moment(values.companyCardValidEndTime[1]), // .valueOf(),
            legalPersonCardValidStartTime: values.legalPersonCardValidEndTime && moment(values.legalPersonCardValidEndTime[0]), //.valueOf(),
            legalPersonCardValidEndTime: values.legalPersonCardValidEndTime && moment(values.legalPersonCardValidEndTime[1]), //.valueOf(),
            authorizedRepresentativeCardValidStartTime: values.authorizedRepresentativeCardValidEndTime && moment(values.authorizedRepresentativeCardValidEndTime[0]), //.valueOf(),
            authorizedRepresentativeCardValidEndTime: values.authorizedRepresentativeCardValidEndTime && moment(values.authorizedRepresentativeCardValidEndTime[1]) //.valueOf()
        };
        let formData = new window.FormData();
        frontFile && formData.append('frontSide', frontFile);
        reverseFile && formData.append('reverseSide', reverseFile);
        console.log('formParams', formParams);
        if (formParams) {
            for (let key in formParams) {
                console.log('eky', key, '----', formParams[key]);
                if (Array.isArray(formParams[key])) {
                    formParams[key].length > 0 && formData.append(key, formParams[key]);
                } else {
                    (formParams[key] || formParams[key] === false) && formData.append(key, formParams[key]);
                }
            }
        }

        dispatch({
            type: url,
            payload: formData,
            callback: (res) => {
                const { code, data } = res;
                if (code === 1008) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                    history.push(`/investor/customerInfo/investordetails/${params.customerId || data}`);
                    // history.goBack();

                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };


    // 自然人
    const Persion = (customerList = []) => (
        <>
            <Card title="基础信息">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="customerType"
                            label="客户类别"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择客户类别'
                                }
                            ]}
                        >
                            <Select onChange={setCustomerType} allowClear disabled={disableFields.customerType}>
                                {XWcustomerCategoryOptions.map((item) => (
                                    <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="customerName"
                            label="客户名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入客户名称'
                                }
                            ]}
                        >
                            <Input placeholder="请输入客户名称" disabled={disableFields.customerName} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="loginMobile"
                            label="登录手机号码"
                            rules={[
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '请输入格式正确的手机号'
                                }
                            ]}
                        >
                            <Input placeholder="请录入登录手机号码" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="investorType"
                            label="客户类型"
                        >
                            <Select placeholder="请选择客户类型" allowClear>
                                {XWInvestorsType.map((item) => (
                                    <Select.Option key={`investorType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="managerUserIds"
                            label="客户经理"
                        >
                            <Select placeholder="请选择客户经理" mode="multiple"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                                allowClear
                            >
                                {customerList.map((item) => (
                                    <Select.Option key={`managerUserIds-${item.managerUerId}`} value={item.managerUerId}>{item.username}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="agent"
                            label="经纪人"
                        >
                            <Input placeholder="请输入经纪人名称" maxLength={20} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="inviter"
                            label="邀请人"
                        >
                            <Input placeholder="请输入邀请人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cardType"
                            label="证件类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择证件类型'
                                }
                            ]}
                        >
                            <Select allowClear placeholder="请选择证件类型" onChange={getSexBirthdayAge} disabled={disableFields.cardType}>
                                {XWDocumentType.map((item) => (
                                    <Select.Option key={`cardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cardNumber"
                            label="证件号码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入证件号码'
                                }
                            ]}
                        >
                            <Input placeholder="请输入证件号码" onChange={getSexBirthdayAge} disabled={disableFields.cardNumber} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cardValidEndTime"
                            label="证件有效期"
                        >
                            <DatePicker.RangePicker/>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="cardLongTime"
                            label="证件长期有效"
                            valuePropName="checked"
                        >
                            <Checkbox >长期</Checkbox>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="remark"
                            label="备注"
                        >
                            <TextArea placeholder="请输入备注内容" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout2}
                            name="CNFundAssociationInvestorType"
                            label="中国基金业协会投资者类型"
                        >
                            <Select allowClear placeholder="请选择">
                                {CONSTASSOCIATIONINVESTORS.map((item) => (
                                    <Select.Option key={`type-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="personSex"
                            label="性别"
                        >
                            <Select placeholder="请选择性别" allowClear>
                                {XWGender.map((item) => (
                                    <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="personBirthday"
                            label="生日"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择生日" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="age"
                            label="年龄"
                        >
                            <InputNumber style={{width:'100%'}} min={0} max={150} placeholder="请输入年龄" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="nationality"
                            label="国籍"
                        >
                            <Input placeholder="请输入国籍" disabled={disableFields.nationality} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="birthplace"
                            label="出生地"
                        >
                            <Input placeholder="请输入出生地" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            // name="personProfession"
                            label="职业"
                        >
                            <Input.Group compact>
                                <Form.Item
                                    noStyle
                                    name="personProfession"
                                >
                                    <Select
                                        placeholder="请选择客户职业"
                                        allowClear
                                    >
                                        {PROFESSION.map((item) => (
                                            <Select.Option key={`investorType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate
                                >
                                    {
                                        ({ getFieldValue }) => (
                                            getFieldValue('personProfession') === 13 &&
                                            <Form.Item
                                                name="otherProfession"
                                                noStyle
                                            >
                                                <Input style={{ width: '60%' }} placeholder="请输入" allowClear />
                                            </Form.Item>)
                                    }
                                </Form.Item>

                            </Input.Group>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="personAddress"
                            label="联系地址"
                        >
                            <Input placeholder="请输入联系地址" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="personEmail"
                            label="联系邮箱"
                            rules={[{
                                type: 'email',
                                message: '邮箱格式不正确！'
                            }]}
                        >
                            <Input placeholder="请输入联系邮箱" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="dealerIds"
                            label="渠道编号"
                        >
                            <Select
                                placeholder="请选择销售商"
                                mode="multiple"
                                allowClear
                            >
                                {agencies.map((item) => (
                                    <Select.Option key={`dealerIds-${item.id}`} value={item.id}>{item.agencyFullName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            // name="origin"
                            label="客户来源"
                        >

                            <Input.Group compact>
                                <Form.Item
                                    noStyle
                                    name="origin"
                                >
                                    <Select
                                        placeholder="请选择客户来源"
                                        allowClear
                                    >
                                        <Select.Option value={1}>线上</Select.Option>
                                        <Select.Option value={2}>线下</Select.Option>
                                        <Select.Option value={3}>其他</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate
                                >
                                    {
                                        ({ getFieldValue }) => (
                                            getFieldValue('origin') === 3 &&
                                            <Form.Item
                                                name="otherOrigin"
                                                noStyle
                                            >
                                                <Input style={{ width: '60%' }} placeholder="请输入" allowClear />
                                            </Form.Item>)
                                    }
                                </Form.Item>
                            </Input.Group>

                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="registerTime"
                            label="注册时间"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="isVIP"
                            label="是否VIP"
                            help="VIP客户可以查看所有已上架的产品"
                            valuePropName="checked"
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>
                    </Col>

                </Row>
            </Card>
        </>
    );


    // 机构
    const Organization = (customerList = []) => (
        <>
            <Card title="基础信息">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="customerType"
                            label="客户类别"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择客户类别'
                                }
                            ]}
                        >
                            <Select onChange={setCustomerType} allowClear disabled={disableFields.customerType}>
                                {XWcustomerCategoryOptions.map((item) => (
                                    <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="customerName"
                            label="客户名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入客户名称'
                                }
                            ]}
                        >
                            <Input placeholder="请输入客户名称" disabled={disableFields.customerName} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="loginMobile"
                            label="登录手机号码"
                            rules={[
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '请输入格式正确的手机号'
                                }
                            ]}
                        >
                            <Input placeholder="请录入登录手机号码" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="investorType"
                            label="客户类型"
                        >
                            <Select placeholder="请选择客户类型" allowClear>
                                {XWInvestorsType.map((item) => (
                                    <Select.Option key={`investorType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="managerUserIds"
                            label="客户经理"
                        >
                            <Select placeholder="请选择客户经理" mode="multiple" allowClear>
                                {customerList.map((item) => (
                                    <Select.Option key={`managerUserIds-${item.managerUerId}`} value={item.managerUerId}>{item.username}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="agent"
                            label="经纪人"
                        >
                            <Input placeholder="请输入经纪人名称" maxLength={20} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="inviter"
                            label="邀请人"
                        >
                            <Input placeholder="请输入邀请人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="companyCardType"
                            label="证件类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择证件类型'
                                }
                            ]}
                        >
                            <Select allowClear placeholder="请选择证件类型" disabled={disableFields.companyCardType}>
                                {XWcertificateType.map((item) => (
                                    <Select.Option key={`cardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="companyCardNumber"
                            label="证件号码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入证件号码'
                                }
                            ]}
                        >
                            <Input placeholder="请输入证件号码" onChange={getSexBirthdayAge} disabled={disableFields.companyCardNumber} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="companyCardValidEndTime"
                            label="证件有效期"
                        >
                            <DatePicker.RangePicker/>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="companyIsCardLongTime"
                            label="证件长期有效"
                            valuePropName="checked"
                        >
                            <Checkbox >长期</Checkbox>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="remark"
                            label="备注"
                        >
                            <TextArea placeholder="请输入备注内容" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout2}
                            name="CNFundAssociationInvestorType"
                            label="中国基金业协会投资者类型"
                        >
                            <Select allowClear placeholder="请选择">
                                {CONSTASSOCIATIONINVESTORS.map((item) => (
                                    <Select.Option key={`type-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="businessScope"
                            label="经营范围"
                        >
                            <Input placeholder="请输入经营范围" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="registerArea"
                            label="注册国家/地区"
                        >
                            <Input placeholder="请输入注册国家/地区" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="registerAddress"
                            label="注册地址"
                        >
                            <Input placeholder="请输入注册地址" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="businessAddress"
                            label="办公地址"
                        >
                            <Input placeholder="请输入办公地址" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="registerMoney"
                            label="注册资金"
                        >
                            <Input placeholder="注册资金" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="controlPerson"
                            label="实际控制人"
                        >
                            <Input placeholder="请输入实际控制人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="companyEmail"
                            label="联系邮箱"
                            rules={[{
                                type: 'email',
                                message: '邮箱格式不正确！'
                            }]}
                        >
                            <Input placeholder="请输入联系邮箱" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="dealerIds"
                            label="渠道编号"
                        >
                            <Select
                                placeholder="请选择销售商"
                                mode="multiple"
                                allowClear
                            >
                                {agencies.map((item) => (
                                    <Select.Option key={`dealerIds-${item.id}`} value={item.id}>{item.agencyFullName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            // name="origin"
                            label="客户来源"
                            shouldUpdate
                        >
                            <Input.Group compact>
                                <Form.Item
                                    noStyle
                                    name="origin"
                                >
                                    <Select
                                        placeholder="请选择客户来源"
                                        allowClear
                                    >
                                        <Select.Option value={1}>线上</Select.Option>
                                        <Select.Option value={2}>线下</Select.Option>
                                        <Select.Option value={3}>其他</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate
                                >
                                    {
                                        ({ getFieldValue }) => (
                                            getFieldValue('origin') === 3 &&
                                            <Form.Item
                                                name="otherOrigin"
                                                noStyle
                                            >
                                                <Input style={{ width: '60%' }} placeholder="请输入" allowClear />
                                            </Form.Item>)
                                    }
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="registerTime"
                            label="注册时间"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="isVIP"
                            help="VIP客户可以查看所有已上架的产品"
                            label="是否VIP"
                            valuePropName="checked"
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Collapse defaultActiveKey={['1']} >
                <Collapse.Panel header="法人信息" key="1">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="controllingShareholder"
                                label="控股股东或实际控制人"
                            >
                                <Input placeholder="请输入控股股东或实际控制人" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonFullName"
                                label="法人姓名"
                            >
                                <Input placeholder="请输入法人姓名" disabled={disableFields.legalPersonFullName} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardType"
                                label="证件类型"
                            >
                                <Select placeholder="请选择证件类型"  allowClear onChange={getSexBirthdayAge} disabled={disableFields.legalPersonCardType}>
                                    {XWDocumentType.map((item) => (
                                        <Select.Option key={`legalPersonCardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardNumber"
                                label="证件号码"
                            >
                                <Input placeholder="请输入证件号码" onChange={getSexBirthdayAge} disabled={disableFields.legalPersonCardNumber} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardValidEndTime"
                                label="证件有效期"
                            >
                                <DatePicker.RangePicker/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonIsCardLongTime"
                                label="证件长期有效"
                                valuePropName="checked"
                            >
                                <Checkbox >长期</Checkbox>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonSex"
                                label="请选择性别"
                            >
                                <Select allowClear>
                                    {XWGender.map((item) => (
                                        <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonAge"
                                label="年龄"
                            >
                                <InputNumber style={{width:'100%'}} min={0} max={150} placeholder="请输入年龄" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonDuty"
                                label="职务"
                            >
                                <Input placeholder="请输入职务" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonEmail"
                                label="电子邮箱"
                                rules={[{
                                    type: 'email',
                                    message: '邮箱格式不正确！'
                                }]}
                            >
                                <Input placeholder="请输入电子邮箱" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonMobile"
                                label="联系电话"
                            >
                                <Input placeholder="请输入联系电话" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonWorkEmail"
                                label="办公邮编"
                            >
                                <Input placeholder="请输入办公邮编" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonBusinessAddress"
                                label="办公地址"
                            >
                                <Input placeholder="请输入办公地址" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Collapse.Panel>
                <Collapse.Panel header="授权代表人信息" key="2">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeFullName"
                                label="姓名"
                            >
                                <Input placeholder="请输入姓名" disabled={disableFields.authorizedRepresentativeFullName} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardType"
                                label="证件类型"
                            >
                                <Select placeholder="请选择证件类型"  allowClear onChange={getSexBirthdayAge} disabled={disableFields.authorizedRepresentativeCardType}>
                                    {XWDocumentType.map((item) => (
                                        <Select.Option key={`authorizedRepresentativeCardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardNumber"
                                label="证件号码"
                            >
                                <Input placeholder="请输入证件号码" onChange={getSexBirthdayAge} disabled={disableFields.authorizedRepresentativeCardNumber} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardValidEndTime"
                                label="证件有效期"
                            >
                                <DatePicker.RangePicker/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeIsCardLongTime"
                                label="证件长期有效"
                                valuePropName="checked"
                            >
                                <Checkbox >长期</Checkbox>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeSex"
                                label="请选择性别"
                            >
                                <Select allowClear>
                                    {XWGender.map((item) => (
                                        <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeAge"
                                label="年龄"
                            >
                                <InputNumber style={{width:'100%'}} min={0} max={150} placeholder="请输入年龄" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeDuty"
                                label="职务"
                            >
                                <Input placeholder="请输入客户职务" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeEmail"
                                label="电子邮箱"
                                rules={[{
                                    type: 'email',
                                    message: '邮箱格式不正确！'
                                }]}
                            >
                                <Input placeholder="请输入电子邮箱" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeMobile"
                                label="联系电话"
                            >
                                <Input placeholder="请输入联系电话" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeWorkEmail"
                                label="办公邮编"
                            >
                                <Input placeholder="请输入办公邮编" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeBusinessAddress"
                                label="办公地址"
                            >
                                <Input placeholder="请输入办公地址" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeRelation"
                                label="与该机构关系"
                            >
                                <Input placeholder="请输入与该机构关系" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
        </>
    );

    // 产品客户
    const ProductCustomer = (customerList = []) => (
        <>
            <Card title="基础信息">
                <Row>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="customerType"
                            label="客户类别"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择客户类别'
                                }
                            ]}
                        >
                            <Select onChange={setCustomerType} allowClear disabled={disableFields.customerType}>
                                {XWcustomerCategoryOptions.map((item) => (
                                    <Select.Option  key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="customerName"
                            label="客户名称"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入客户名称'
                                }
                            ]}
                        >
                            <Input placeholder="请输入客户名称" disabled={disableFields.customerName} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="loginMobile"
                            label="登录手机号码"
                            rules={[
                                {
                                    pattern: /^1\d{10}$/,
                                    message: '请输入格式正确的手机号'
                                }
                            ]}
                        >
                            <Input placeholder="请录入登录手机号码" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="investorType"
                            label="客户类型"
                        >
                            <Select placeholder="请选择客户类型" allowClear>
                                {XWInvestorsType.map((item) => (
                                    <Select.Option key={`investorType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="managerUserIds"
                            label="客户经理"
                        >
                            <Select placeholder="请选择客户经理" mode="multiple" allowClear
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {customerList.map((item) => (
                                    <Select.Option key={`managerUserIds-${item.managerUerId}`} value={item.managerUerId}>{item.username}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="agent"
                            label="经纪人"
                        >
                            <Input placeholder="请输入经纪人名称" maxLength={20} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="inviter"
                            label="邀请人"
                        >
                            <Input placeholder="请输入邀请人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productCardType"
                            label="证件类型"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择证件类型'
                                }
                            ]}
                        >
                            <Select placeholder="请选择证件类型" allowClear disabled={disableFields.productCardType}>
                                {XWcertificateType.map((item) => (
                                    <Select.Option key={`productCardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productCardNumber"
                            label="证件号码"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入证件号码'
                                }
                            ]}
                        >
                            <Input placeholder="请输入证件号码" disabled={disableFields.productCardNumber} />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="registerDate"
                            label="备案时间"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择备案时间" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="remark"
                            label="备注"
                        >
                            <TextArea placeholder="请输入备注内容" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout2}
                            name="CNFundAssociationInvestorType"
                            label="中国基金业协会投资者类型"
                        >
                            <Select allowClear placeholder="请选择">
                                {CONSTASSOCIATIONINVESTORS.map((item) => (
                                    <Select.Option key={`type-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            {...formItemLayout}
                            name="archivalOrganization"
                            label="产品备案机构"
                        >
                            <Input placeholder="请输入备案机构" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="setDate"
                            label="成立时间"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择成立时间" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productType"
                            label="产品类型"
                        >
                            <Input placeholder="请输入产品类型" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="duration"
                            label="产品存续期"
                        >
                            <Input placeholder="请输入产品存续期" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productCategory"
                            label="产品类别"
                        >
                            <Input placeholder="请输入产品类别" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productScale"
                            label="产品规模"
                        >
                            <Input placeholder="请输入产品规模" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="trustee"
                            label="产品托管人"
                        >
                            <Input placeholder="请输入产品托管人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="controlPerson"
                            label="实际控制人"
                        >
                            <Input placeholder="请输入实际控制人" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="productEmail"
                            label="联系邮箱"
                            rules={[{
                                type: 'email',
                                message: '邮箱格式不正确！'
                            }]}
                        >
                            <Input placeholder="请输入联系邮箱" />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="dealerIds"
                            label="渠道编号"
                        >
                            <Select
                                placeholder="请选择销售商"
                                mode="multiple"
                                allowClear
                            >
                                {agencies.map((item) => (
                                    <Select.Option key={`dealerIds-${item.id}`} value={item.id}>{item.agencyFullName}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            // name="origin"
                            label="客户来源"
                            shouldUpdate
                        >
                            <Input.Group compact>
                                <Form.Item
                                    noStyle
                                    name="origin"
                                >
                                    <Select
                                        placeholder="请选择客户来源"
                                        allowClear
                                    >
                                        <Select.Option value={1}>线上</Select.Option>
                                        <Select.Option value={2}>线下</Select.Option>
                                        <Select.Option value={3}>其他</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    noStyle
                                    shouldUpdate
                                >
                                    {
                                        ({ getFieldValue }) => (
                                            getFieldValue('origin') === 3 &&
                                            <Form.Item
                                                name="otherOrigin"
                                                noStyle
                                            >
                                                <Input style={{ width: '60%' }} placeholder="请输入" allowClear />
                                            </Form.Item>)
                                    }
                                </Form.Item>
                            </Input.Group>
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="registerTime"
                            label="注册时间"
                        >
                            <DatePicker style={{width:'100%'}} placeholder="请选择" />
                        </Form.Item>

                        <Form.Item
                            {...formItemLayout}
                            name="isVIP"
                            label="是否VIP"
                            help="VIP客户可以查看所有已上架的产品"
                            valuePropName="checked"
                        >
                            <Checkbox></Checkbox>
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Collapse defaultActiveKey={['1']} >
                <Collapse.Panel header="机构信息" key="1">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="custodian"
                                label="管理人名称"
                            >
                                <Input placeholder="请输入管理人名称" disabled={disableFields.custodian} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="companyCardType"
                                label="证件类型"
                            >
                                <Select placeholder="请选择证件类型"  disabled={disableFields.companyCardType} allowClear>
                                    {XWcertificateType.map((item) => (
                                        <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="companyCardNumber"
                                label="证件号码"
                            >
                                <Input placeholder="请输入证件号码" disabled={disableFields.companyCardNumber} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="companyCardValidEndTime"
                                label="证件有效期"
                            >
                                <DatePicker.RangePicker/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                name="companyIsCardLongTime"
                                label="证件长期有效"
                                valuePropName="checked"
                            >
                                <Checkbox >长期</Checkbox>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="businessScope"
                                label="经营范围"
                            >
                                <Input placeholder="请输入经营范围" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="registerArea"
                                label="注册国家/地区"
                            >
                                <Input placeholder="请输入注册国家/地区" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="registerAddress"
                                label="注册地址"
                            >
                                <Input placeholder="请输入注册地址" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="businessAddress"
                                label="办公地址"
                            >
                                <Input placeholder="请输入办公地址" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="registerMoney"
                                label="注册资金"
                            >
                                <Input placeholder="请输入注册资金" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="controlPerson"
                                label="实际控制人"
                            >
                                <Input placeholder="请输入实际控制人" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Collapse.Panel>
                <Collapse.Panel header="法人信息" key="2">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="controllingShareholder"
                                label="控股股东或实际控制人"
                            >
                                <Input placeholder="请输入控股股东或实际控制人" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonFullName"
                                label="法人姓名"
                            >
                                <Input placeholder="请输入法人姓名" disabled={disableFields.legalPersonFullName} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardType"
                                label="证件类型"
                            >
                                <Select placeholder="请选择证件类型"  onChange={getSexBirthdayAge} allowClear disabled={disableFields.legalPersonCardType}>
                                    {XWDocumentType.map((item) => (
                                        <Select.Option key={`legalPersonCardType-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardNumber"
                                label="证件号码"
                            >
                                <Input placeholder="请输入证件号码" onChange={getSexBirthdayAge} disabled={disableFields.legalPersonCardNumber} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonCardValidEndTime"
                                label="证件有效期"
                            >
                                <DatePicker.RangePicker/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonIsCardLongTime"
                                label="证件长期有效"
                                valuePropName="checked"
                            >
                                <Checkbox >长期</Checkbox>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonAge"
                                label="年龄"
                            >
                                <InputNumber style={{width:'100%'}} min={0} max={150} placeholder="请输入年龄" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonDuty"
                                label="职务"
                            >
                                <Input placeholder="请输入职务" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonEmail"
                                label="电子邮箱"
                                rules={[{
                                    type: 'email',
                                    message: '邮箱格式不正确！'
                                }]}
                            >
                                <Input placeholder="请输入电子邮箱" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonMobile"
                                label="联系电话"
                            >
                                <Input placeholder="请输入联系电话" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonWorkEmail"
                                label="办公邮编"
                            >
                                <Input placeholder="请输入办公邮编" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="legalPersonBusinessAddress"
                                label="办公地址"
                            >
                                <Input placeholder="请输入办公地址" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Collapse.Panel>
                <Collapse.Panel header="授权代表人信息" key="3">
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeFullName"
                                label="姓名"
                            >
                                <Input placeholder="请输入姓名" disabled={disableFields.authorizedRepresentativeFullName} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardType"
                                label="证件类型"
                            >
                                <Select placeholder="请选择证件类型"  onChange={getSexBirthdayAge} allowClear disabled={disableFields.authorizedRepresentativeCardType}>
                                    {XWDocumentType.map((item) => (
                                        <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardNumber"
                                label="证件号码"
                            >
                                <Input placeholder="请输入证件号码" disabled={disableFields.authorizedRepresentativeCardNumber} />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeCardValidEndTime"
                                label="证件有效期"
                            >
                                <DatePicker.RangePicker/>
                            </Form.Item>

                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeIsCardLongTime"
                                label="证件长期有效"
                                valuePropName="checked"
                            >
                                <Checkbox >长期</Checkbox>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeSex"
                                label="请选择性别"
                            >
                                <Select allowClear>
                                    {XWGender.map((item) => (
                                        <Select.Option key={`sex-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeAge"
                                label="年龄"
                            >
                                <InputNumber style={{width:'100%'}} min={0} max={150} placeholder="请输入年龄" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeDuty"
                                label="职务"
                            >
                                <Input placeholder="请输入客户职务" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeEmail"
                                label="电子邮箱"
                                rules={[{
                                    type: 'email',
                                    message: '邮箱格式不正确！'
                                }]}
                            >
                                <Input placeholder="请输入电子邮箱" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeMobile"
                                label="联系电话"
                            >
                                <Input placeholder="请输入联系电话" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeWorkEmail"
                                label="办公邮编"
                            >
                                <Input placeholder="请输入办公邮编" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeBusinessAddress"
                                label="办公地址"
                            >
                                <Input placeholder="请输入办公地址" />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                name="authorizedRepresentativeRelation"
                                label="与该机构关系"
                            >
                                <Input placeholder="请输入与该机构关系" />
                            </Form.Item>
                        </Col>
                    </Row>
                </Collapse.Panel>
            </Collapse>
        </>
    );

    return (
        <div className={_styles.CustomerInfoWarp}>
            <Form
                form={form}
                onFinish={onFinish}
                initialValues={{
                    customerType: customerType,
                    nationality: '中国'
                }}
            >
                {customerType === 1 && Persion(customerList)}
                {customerType === 2 && Organization(customerList)}
                {customerType === 3 && ProductCustomer(customerList)}

                <Row justify="space-between">
                    <Card title="实名信息" style={{ width: '48%', display: 'inline-block' }}>
                        <Form.Item
                            {...formItemLayout}
                            name="realNameState"
                            label="实名认证状态"
                        >
                            <Select placeholder="--" disabled>
                                {XWnameStatus.map((item) => (
                                    <Select.Option key={`realNameState-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="realName"
                            label="实名名称"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="realNameDate"
                            label="实名时间"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Card>
                    <Card title="绑定信息" style={{ width: '48%', display: 'inline-block' }}>
                        <Form.Item
                            {...formItemLayout}
                            name="sourceType"
                            label="客户账号来源"
                        >
                            <Select placeholder="--" disabled>
                                {CUSTOMER_SOURCE.map((item) => (
                                    <Select.Option key={`realNameState-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout}
                            name="weChatBindState"
                            label="微信绑定状态"
                        >
                            <Select placeholder="--" disabled>
                                {weChatBindState.map((item) => (
                                    <Select.Option key={`realNameState-${item.value}`} value={item.value}>{item.label}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Card>
                </Row>


                <Row justify="space-between">
                    {customerType === 1 &&
                        <Card title="证件照片" style={{ width: '48%', display: 'inline-block' }}>
                            <Form.Item
                                {...formItemLayout}
                                name="identifyCardUpdateDate"
                                label="身份证更新时间"
                            >
                                <Input disabled />
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                // name="frontSide"
                                label="身份证正面"
                            >
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={(file) => beforeUpload(file, 1)}
                                >
                                    {frontSideUrl ? <img src={frontSideUrl} alt="avatar" style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <img src={front} alt="avatar" style={{ width: '100%' }} />}
                                    {/* {frontSide ? <div style={{backgroundImage: `url(${frontSide})`, width: '150px', height: '100%', backgroundRepeat: 'no-repeat', backgroundSize:'cover'}} ></div> : <img src={front} alt="avatar" style={{ width: '100%' }} />} */}
                                </Upload>
                            </Form.Item>
                            <Form.Item
                                {...formItemLayout}
                                // name="reverseSide"
                                label="身份证反面"
                            >
                                <Upload
                                    name="file"
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={(file) => beforeUpload(file, 2)}
                                >
                                    {reverseSideUrl ? <img src={reverseSideUrl} alt="avatar" style={{ maxHeight: '100%', maxWidth: '100%' }} /> : <img src={back} alt="avatar" style={{ width: '100%' }} />}
                                </Upload>
                            </Form.Item>
                        </Card>
                    }
                    <Card title="渠道信息" style={{ width: '48%', display: 'inline-block' }}>
                        <Form.Item
                            {...formItemLayout1}
                            name="currentAutomatic"
                            label="当前渠道（自动）"
                            extra="根据投资者当前持有的产品的认申赎记录，自动记录"
                        >
                            <Select
                                allowClear
                                placeholder=""
                                showSearch
                                mode="multiple"
                                disabled
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    channelList.map((item, index) => {
                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout1}
                            name="historyAutomatic"
                            label="历史渠道（自动）"
                            extra="根据投资者当前持有的产品的认申赎记录，自动记录"
                        >
                            <Select
                                allowClear
                                placeholder=""
                                showSearch
                                mode="multiple"
                                disabled
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    channelList.map((item, index) => {
                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout1}
                            name="currentManual"
                            label="当前渠道（手动）"
                            extra="可搜索，可多选，默认为空，可自行维护"
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                mode="multiple"
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    channelList.map((item, index) => {
                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout1}
                            name="historyManual"
                            label="历史渠道（手动）"
                            extra="可搜索，可多选，默认为空，可自行维护"
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                mode="multiple"
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    channelList.map((item, index) => {
                                        return <Select.Option key={index} value={item.channelId}>{item.channelName}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout1}
                            name="typeAutomatic"
                            label="渠道类型（自动）"
                            extra="根据渠道自动划分"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            {...formItemLayout1}
                            name="typeManual"
                            label="渠道类型（手动）"
                            extra={<div>
                                <p style={{ marginBottom: 0 }}>默认为空，单选，可自行维护</p>
                                <p style={{ marginBottom: 0 }}>直销：客户可查看名下所有产品</p>
                                <p style={{ marginBottom: 0 }}>代销：根据配置，可能不允许客户登录及注册</p>
                                <p style={{ marginBottom: 0 }}>直销+代销：客户登录后仅可查看直销产品的份额、规模信息</p>
                            </div>}
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                showSearch
                                filterOption={(input, option) =>
                                    option.children && option.children
                                        .toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    CHANNELTYPE.map((item) => {
                                        return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>;
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Card>
                </Row>

                <Affix offsetBottom={0}>
                    <Row style={{
                        lineHeight: '64px',
                        backgroundColor: '#fff'
                    }} justify="center"
                    >
                        <Space>
                            {props.authEdit && <Button loading={addLoading || updateLoading} type="primary" htmlType="submit">提交</Button>}
                            <Button onClick={onCancel}>取消</Button>
                        </Space>
                    </Row>
                </Affix>

            </Form>
        </div>
    );
};

export default connect(({ INVESTOR_DETAIL, loading }) => ({
    INVESTOR_DETAIL,
    loading: loading.effects['INVESTOR_DETAIL/queryCustomerInfo'],
    addLoading: loading.effects['INVESTOR_DETAIL/updateCustomerInfo'],
    updateLoading: loading.effects['INVESTOR_DETAIL/createCustomerInfo']
}))(CustomerInfo);


CustomerInfo.defaultProps = {
    data: { }
};
