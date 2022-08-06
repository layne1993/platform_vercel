/*
 * @Descripttion:公司设置-实名设置
 * @version:
 * @Author: yezi
 * @Date: 2021-06-04 13:22:15
 * @LastEditTime: 2021-10-11 09:25:44
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import type { Dispatch } from 'umi';
import { connect, history, Link } from 'umi';
import { Card, Form, Row, Col, Modal, Input, Select, Button, Spin, notification, AutoComplete } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getPermission } from '@/utils/utils';
import _styles from './styles.less';
import lodash from 'lodash';

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 12 },
        sm: { span: 12 }
    }
};


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

interface realNameInfoProps {
    dispatch: Dispatch,
    loading: boolean,
    saveLoading: boolean,
    sendLoading: boolean,
    authEdit: boolean,
    resetLoading: boolean,
    exisRealNametLoading: boolean,
    fetching: boolean
}

const TIME = 60;

const RealNameInfo: FC<realNameInfoProps> = (props) => {
    const { authEdit, loading, saveLoading, dispatch, sendLoading, resetLoading, exisRealNametLoading, fetching } = props;
    const [form] = Form.useForm();
    const [realNameInfo, setRealNameInfo] = useState<{ [key: string]: string | number }>({});
    const [second, setSecond] = useState<number>(TIME);                                                                 // 倒计时
    const [provincesList, setProvincesList] = useState<any[]>([]);                                                     // 省份
    const [citiesList, setCitiesList] = useState<any[]>([]);                                                           // 城市
    const [openingBankList, setOpeningBankList] = useState<any[]>([]);                                                 // 开户行
    const [subbranchList, setSubbranchList] = useState<any[]>([]);                                                     // 开户支行全称
    const [sendStatus, setSendStatus] = useState<boolean>(false);                                                       // 金额发送状态
    const [prcptcd, setPrcptcd] = useState<string>();                                                                   // 银行唯一识别码
    const [hasRealName, setHasRealName] = useState<{ [key: string]: string | number }>(null);                             // 是否已实名
    const [realNameServiceId, setRealNameServiceId] = useState<string>(null);


    // 获取配置
    const getRealNameInfo = () => {
        dispatch({
            type: 'companySetting/getRealNameInfo',
            payload: {},
            callback: ({ code, data = {}, message }) => {
                if (code === 1008) {
                    form.setFieldsValue({
                        ...data,
                        companyName: data.customerName,
                        usingName: data.proxyName,
                        idCard: data.proxyIdNo,
                        mobile: data.proxyMobile,
                        payCardno: data.organPayCardno
                    });
                    setPrcptcd(data.organPayPrcptcd);
                    setRealNameInfo(data);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    // 对象转数据
    const objToList = (data = {}) => {
        const arr = [];
        for (let key in data) {
            arr.push({
                label: data[key],
                value: key
            });
        }
        return arr;
    };

    // 获取省份
    const getProvinces = () => {
        dispatch({
            type: 'companySetting/queryProvince',
            payload: {},
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    setProvincesList(objToList(data));
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    // 获取银行信息
    const getBanks = (val) => {
        console.log(val, 'lll');
        dispatch({
            type: 'companySetting/queryBank',
            payload: {
                bankName: val
            },
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    const newArr = [];
                    data.map((item) => {
                        newArr.push({
                            label: item,
                            value: item
                        });
                    });
                    setOpeningBankList(newArr);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(() => {
        getRealNameInfo();
        getProvinces();
        // getBanks();
    }, []);

    /**
     * @description 发送金额
     */
    const sendAmount = () => {
        form.validateFields().then((values) => {
            dispatch({
                type: 'companySetting/verifiedCheck',
                payload: {
                    idNoType: 1,
                    prcptcd,
                    ...values,
                    usingMobile: values.mobile,
                    usingIdNo: values.usingIdNo,
                    organPayPrcptcd: prcptcd
                },
                callback: ({ code, data, message }) => {
                    if (code === 1008) {
                        setRealNameServiceId(data);
                        setSendStatus(true);
                        openNotification('success', '提醒', '发送成功');
                    } else {
                        const txt = message || data || '发送失败';
                        openNotification('error', '提醒', txt);
                    }
                }
            });
        });

    };

    // 开户行模糊搜索
    const getSearchBanks = (val) => {
        if (val) {
            getBanks(val);
        } else {
            setOpeningBankList([]);
        }
    };

    /**
     * 选择支行
     */
    const getSubBank = (val) => {
        if (val) {
            val.trim();
        }
        if (!val) return;
        // const { organPayBank, organPayProvice, organPayCity } = form.getFieldsValue();
        dispatch({
            type: 'companySetting/subbranch',
            payload: {
                keywords: val
            },
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    setSubbranchList(data);
                    // form.setFieldsValue({ organPayCity: undefined });
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });

    };


    const getSearchBanks_debounce = lodash.debounce(getSearchBanks, 500);
    const getBranchSearch_debounce = lodash.debounce(getSubBank, 800);

    let timer = null;
    useEffect(() => {
        if (TIME === second) return;
        timer = setTimeout(() => {
            if (second === 1) {
                clearTimeout(timer);
                setSecond(TIME);
            } else {
                setSecond(second - 1);
            }
        }, 1000);

    }, [second]);


    // 获取城市
    const getCities = (val) => {
        dispatch({
            type: 'companySetting/queryCity',
            payload: {
                province: val
            },
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    setCitiesList(objToList(data));
                    // form.setFieldsValue({ organPayCity: undefined });
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    // 失去焦点的时候根据统一社会信用代码查询企业是否实名
    const getComanyRealNameInfo = (e) => {
        const val = e.target.value;
        dispatch({
            type: 'companySetting/isHasRealName',
            payload: {
                idNumber: val,
                type: 2 // 1个人 2机构
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setHasRealName(data);
                    data && form.setFieldsValue({
                        ...data
                    });
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    // 已存在的机构发送验证码
    const sendCode = () => {
        dispatch({
            type: 'companySetting/captcha',
            payload: {
                ...hasRealName,
                type: 0 // 1个人 2机构
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setSecond(TIME - 1);
                    setSendStatus(true);
                    openNotification('success', '提醒', '发送成功');
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    const existRealName = (values) => {
        dispatch({
            type: 'companySetting/hasexistRealName',
            payload: {
                idNoType: 1,
                ...hasRealName,
                ...values
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                    getRealNameInfo();
                    setHasRealName(null);
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    // 保存
    const onFinish = (values) => {
        dispatch({
            type: 'companySetting/verified',
            payload: {
                idNoType: 1,
                ...realNameInfo,
                prcptcd,
                ...values,
                realNameServiceId,
                organPayPrcptcd: prcptcd
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                    getRealNameInfo();
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    // 清除实名
    const restRealName = () => {
        dispatch({
            type: 'companySetting/clearRealName',
            payload: {},
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '清空成功');
                    form.resetFields();
                    setRealNameInfo({});
                    setPrcptcd(null);
                    // getRealNameInfo();
                } else {
                    const txt = message || data || '清空失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    /**
     * @description 清空前提示
     */
    const resetPre = () => {
        Modal.confirm({
            title: '提醒',
            icon: <ExclamationCircleOutlined />,
            content: '确认后实行信息将被清空！',
            okText: '确认',
            cancelText: '取消',
            onOk: () => restRealName()
        });
    };

    // 根据支行获取银行卡信息
    const getSubBankInfo = (val: any, options: any) => {
        const { cnapsCode, bank, province, city } = options.data || {};
        setPrcptcd(cnapsCode);
        form.setFieldsValue({
            organPayBank: bank,
            organPayProvice: province,
            organPayCity: city
        });
    };

    const isEdit = sendStatus || realNameInfo.realNameState === 1;

    return (
        <div className={_styles.realNameInfoWarp}>
            <Spin spinning={loading}>

                {
                    hasRealName ?
                        <Form
                            form={form}
                            {...formItemLayout}
                            onFinish={existRealName}
                        >
                            <Card title="企业基本信息">
                                <Form.Item
                                    label="企业名称"
                                    name="companyName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入企业名称" disabled allowClear />
                                </Form.Item>
                                <Form.Item
                                    label="统一社会信用代码"
                                    name="idNo"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入统一社会信用代码" disabled allowClear onBlur={getComanyRealNameInfo} />
                                </Form.Item>
                                <Form.Item
                                    label="法人姓名"
                                    name="legalName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入法人姓名" allowClear disabled />
                                </Form.Item>
                            </Card>
                            <Card title={<h3>快捷实名验证，<span style={{ color: 'red' }}>注：贵司已经在其它业务场景完成实名认证</span></h3>}>
                                <Form.Item
                                    label="默认用印人"
                                    name="useSealName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    label="默认用印人手机号"
                                    name="useSealMobile"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    label="验证码"
                                    name="captcha"
                                    rules={[{ required: sendStatus, message: '请输入' }]}
                                    extra={<span style={{ color: 'red' }}>贵司已经有完成实名认证，需要通过验证贵司的默认用印人短信校验码完成实名认证</span>}
                                >
                                    <Input.Search
                                        placeholder="请输入"
                                        allowClear
                                        enterButton={<Button type="primary" disabled={second < TIME}>{second < TIME ? `${second}S` : '获取验证码'}</Button>} size="large"
                                        onSearch={sendCode}
                                    // disabled={!sendStatus}
                                    />
                                </Form.Item>
                            </Card>
                            <Row justify="center" className={_styles.btnWarp}>
                                {
                                    (authEdit && realNameInfo.realNameState !== 1) &&
                                    <Button loading={exisRealNametLoading} disabled={!sendStatus} type="primary" htmlType="submit" style={{ marginRight: 8 }}>提交认证</Button>
                                }
                            </Row>
                        </Form>
                        :
                        <Form
                            form={form}
                            {...formItemLayout}
                            onFinish={onFinish}
                        >
                            <Card title="企业基本信息">
                                <Form.Item
                                    label="企业名称"
                                    name="companyName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入企业名称" disabled={isEdit} allowClear />
                                </Form.Item>
                                <Form.Item
                                    label="统一社会信用代码"
                                    name="idNo"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入统一社会信用代码" allowClear onBlur={getComanyRealNameInfo} disabled={isEdit} />
                                </Form.Item>
                                <Form.Item
                                    label="法人姓名"
                                    name="legalName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入法人姓名" allowClear disabled={isEdit} />
                                </Form.Item>
                            </Card>
                            <Card title="法定代表人信息">
                                <Form.Item
                                    label="法人姓名"
                                    name="usingName"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入法人姓名" allowClear disabled={!!realNameInfo.proxyName} />
                                </Form.Item>
                                <Form.Item
                                    label="法人身份证号码"
                                    name="idCard"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" allowClear disabled={isEdit} />
                                </Form.Item>
                                <Form.Item
                                    label="法人手机号"
                                    name="mobile"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" allowClear disabled={isEdit} />
                                </Form.Item>
                            </Card>
                            <Card title="企业对公银行卡信息">
                                <Form.Item
                                    label="开户行卡号"
                                    name="payCardno"
                                    rules={[{ required: true, message: '请输入' }]}
                                >
                                    <Input placeholder="请输入" allowClear disabled={isEdit} />
                                </Form.Item>
                                <Form.Item
                                    label="开户行支行全称"
                                    name="organPaySubbranch"
                                    rules={[{ required: true, message: '请选择' }]}
                                    extra={<div style={{ color: 'red' }}>
                                        <p style={{ marginBottom: 0 }}>1.可输入完整的银行名称进行查询，比如“上海浦东发展银行北蔡支行”;</p>
                                        <p style={{ marginBottom: 0 }}>2.可直接对支行信息进行搜索并选择，比如“北蔡”</p>
                                    </div>}
                                >
                                    <AutoComplete
                                        disabled={isEdit}
                                        onSearch={getBranchSearch_debounce}
                                        placeholder="请输入"
                                        onSelect={getSubBankInfo}
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                    >
                                        {subbranchList.map((item, index) => (
                                            <AutoComplete.Option data={item} key={index} value={item.subbranch}>
                                                {item.subbranch}
                                            </AutoComplete.Option>
                                        ))}
                                    </AutoComplete>
                                </Form.Item>
                                <Form.Item
                                    label="开户行名称"
                                    name="organPayBank"
                                    rules={[{ required: true, message: '请选择' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    label="开户行所在省"
                                    name="organPayProvice"
                                    rules={[{ required: true, message: '请选择' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                <Form.Item
                                    label="开户行所在市"
                                    name="organPayCity"
                                    rules={[{ required: true, message: '请选择' }]}
                                >
                                    <Input disabled />
                                </Form.Item>
                                {realNameInfo.realNameState !== 1 &&
                                    <Form.Item
                                        label="输入金额"
                                        name="cashFloat"
                                        rules={[{ required: sendStatus, message: '请输入' }]}
                                        extra={<span style={{ color: 'red' }}>会向贵公司对公银行账户打一笔款项，如0.48元，将金额输入后可完成认证，若一直未收到打款短信，可以至网上银行查阅。</span>}
                                    >
                                        <Input.Search
                                            placeholder="请输入"
                                            allowClear
                                            enterButton={<Button type="primary" loading={sendLoading} disabled={sendStatus}>{sendStatus ? '已获取' : '获取金额'}</Button>}
                                            size="large"
                                            onSearch={sendAmount}
                                            disabled={!sendStatus}
                                        />
                                    </Form.Item>
                                }
                            </Card>
                            <Row justify="center" className={_styles.btnWarp}>
                                {
                                    (authEdit && realNameInfo.realNameState !== 1) &&
                                    <Button loading={saveLoading} disabled={!sendStatus} type="primary" htmlType="submit" style={{ marginRight: 8 }}>提交认证</Button>
                                }

                                {
                                    (authEdit && realNameInfo.realNameState === 1) &&
                                    <Button loading={resetLoading} type="primary" onClick={resetPre} style={{ marginRight: 8 }}>清空重做</Button>
                                }

                            </Row>
                        </Form>
                }
            </Spin>
        </div >
    );
};

export default connect(({ companySetting, loading }) => ({
    loading: loading.effects['companySetting/getRealNameInfo'],
    saveLoading: loading.effects['companySetting/verified'],
    sendLoading: loading.effects['companySetting/verifiedCheck'],
    resetLoading: loading.effects['companySetting/clearRealName'],
    fetching: loading.effects['companySetting/subbranch']
}))(RealNameInfo);

RealNameInfo.defaultProps = {
    loading: false,
    saveLoading: false,
    sendLoading: false,
    authEdit: false,
    resetLoading: false,
    exisRealNametLoading: false,
    fetching: false
};
