import React, { useEffect, useState } from 'react';
import { Spin, Form, Card, Radio, Input, Select, Button, Space, Row, Divider, notification } from 'antd';
import styles from './index.less';
import { Dispatch, connect } from 'umi';
import { addIcon, deleteIcon } from '@/utils/staticResources';
import { cloneDeep } from 'lodash';

interface SignetInfoSetting {
    companySetting: any;
    dispatch: Dispatch;
    loading: Boolean;
    saveLoading: Boolean
}

interface SealUserSelectSetting {
    type: number;
    dispatch: Dispatch;
    value: string | number,
    formRef: any,
    indexNum: number
}

const formLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 }
    }
};


const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formListBtnGroup = (add: Function, remove: Function, fields: Object[], field: any) => {

    return (
        <div className={styles.btnGroup}>
            <span
                className={styles.addIcon}
                onClick={() => { add(); }}
            >
                <img src={addIcon} style={{ width: 20 }} />
            </span>
            {fields.length > 1 ? (
                <span className={styles.delIcon} onClick={() => remove(field.name)} style={{ display: field.fieldKey === 0 ? 'none' : '' }}>
                    <img src={deleteIcon} style={{ width: 20 }} />
                </span>
            ) : null}
        </div>
    );
};

const SealUserSelect: React.FC<SealUserSelectSetting> = (props) => {

    const { type, dispatch, value, formRef, indexNum } = props;

    const [stampUserList, setStampUserList] = useState<any[]>([]);

    const [selectValue, setSelectValue] = useState<any>(null);

    const _getStampUserInfo = () => {

        dispatch({
            type: 'companySetting/getStampUserInfo',
            payload: {
                stampUseConfig: type
            },
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setStampUserList(res.data);
                }
            }
        });
    };

    const _handleSelectChange = (e: any) => {
        setSelectValue(e);
        let values = formRef.getFieldsValue();
        const { codeList, ...params } = values;
        if(codeList) codeList[indexNum].sealUserInfoId = e;
        formRef.setFieldsValue({
            codeList
        });
    };

    const _handleClear = () => {
        setSelectValue(null);
    };

    useEffect(() => {
        _getStampUserInfo();
    }, [type]);

    useEffect(() => {
        setSelectValue(value);
    }, [value]);

    return (
        <Select value={selectValue} allowClear onChange={_handleSelectChange} onClear={_handleClear}>
            {
                Array.isArray(stampUserList) &&
                stampUserList.map((item) => {
                    return (
                        <Option key={item.sealUserInfoId} value={item.sealUserInfoId}>{item.name}</Option>
                    );
                })
            }
        </Select>
    );

};

const SignetInfo: React.FC<SignetInfoSetting> = (props) => {

    const { loading, dispatch, saveLoading } = props;

    const [form] = Form.useForm();

    const [isDefaultList, setIsDefaultList] = useState<any[]>([]);

    const [isDefaultLegalList, setIsDefaultLegalList] = useState<any[]>([]);

    const [trusteeshipList, setTrusteeshipList] = useState<any[]>([]);

    const [dataSource, setDataSource] = useState<any>({});

    const [companySealList, setCompanySealList] = useState<any[]>([]);

    const [legalSealList, setLegalSealList] = useState<any[]>([]);

    const [allStampUserList, setAllStampUserList] = useState<any[]>([]);

    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false));
    }, [refresh]);

    const doRefresh = () => setRefresh(true);

    const _handleUserChange = () => {
        doRefresh();
    };

    const initForm = (data: any) => {

        let tempIsDefaultList = cloneDeep(isDefaultList);
        let tempIsDefaultLegalList = cloneDeep(isDefaultLegalList);
        // let tempArr = [];
        // let tempArr1 = [];
        // Array.isArray(data.sealScenesList) &&
        //     data.sealScenesList.forEach((item) => {
        //         if (item.scenesType === 0) {
        //             tempArr.push(item);
        //         } else {
        //             tempArr1.push(item);
        //         }
        //     });
        Array.isArray(data.sealSysScenesList) &&
            data.sealSysScenesList.forEach((item, i) => {
                if (item.isDefaultCompanySeal === 1) {
                    tempIsDefaultList.push(i);
                }
                if (item.isDefaultLegalSeal === 1) {
                    tempIsDefaultLegalList.push(i);
                }
            });
        setIsDefaultList(tempIsDefaultList);
        setIsDefaultLegalList(tempIsDefaultLegalList);
        console.log(data.useSealList)
        form.setFieldsValue({
            ...data.defaultSealInfo,
            useSealList: data.useSealList,
            codeList: data.sealCaptchaScenesList,
            autoSeal: data.sealSysScenesList
        });
    };

    const _onFinish = (values: any) => {
        const { autoSeal, codeList, useSealList, ...parmas } = values;
        Array.isArray(autoSeal) &&
            autoSeal.forEach((item) => {
                item.companySealType = 0;
                item.legalSealType = 1;
            });

        dispatch({
            type: 'companySetting/stampManager',
            payload: {
                ...parmas,
                useSealList,
                sealSysScenesList: autoSeal,
                sealCaptchaScenesList: codeList
                // sealScenesInfoList: [
                //     ...autoSeal,
                //     ...codeList
                // ]
            },
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    openNotification('success', '保存成功', 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const _handleChange = (e: any, i: Number, type: string) => {

        let tempArr = cloneDeep(isDefaultList);
        let tempArr1 = cloneDeep(isDefaultLegalList);
        if (e.target.value === 1) {     // 默认章
            if (type === 'isDefaultCompanySealType') {
                tempArr.push(i);
            } else {
                tempArr1.push(i);
            }
        } else {    // 指定章
            if (type === 'isDefaultCompanySealType') {
                tempArr = tempArr.filter((item) => {
                    return item !== i;
                });
            } else {
                tempArr1 = tempArr1.filter((item) => {
                    return item !== i;
                });
            }
        }
        setIsDefaultList(tempArr);
        setIsDefaultLegalList(tempArr1);
    };

    const _isDefaultUseSealChange = (e: any, index: number) => {

        if (e.target.value === 1) {
            let fields = form.getFieldsValue();
            const { useSealList = [] } = fields;
            useSealList.forEach((item, i) => {
                item.isDefaultUseSeal = i === index ? 1 : 0;
            });

            form.setFieldsValue({
                useSealList
            });
        }
    };

    const _getRealNameInfo = () => {

        dispatch({
            type: 'companySetting/querySealInfo',
            payload: {},
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setDataSource(res.data);
                    initForm(res.data);
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const _getSelectOption = () => {

        dispatch({
            type: 'companySetting/getTrusteeshipInfo',
            payload: {},
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setTrusteeshipList(res.data);
                }
            }
        });
        dispatch({
            type: 'companySetting/getSealNameInfo',
            payload: {
                // sealType: 0
            },
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setCompanySealList(res.data);
                }
            }
        });
        dispatch({
            type: 'companySetting/queryStampList',
            payload: {
                // sealType: 1
            },
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setLegalSealList(res.data);
                }
            }
        });
    };

    const _querytStampUserInfo = () => {

        dispatch({
            type: 'companySetting/queryManagerInfo',
            payload: {},
            callback: (res: any) => {
                if (res.code === 1008 && res.data) {
                    setAllStampUserList(res.data);
                }
            }
        });
    };

    useEffect(() => {
        _getRealNameInfo();
        _getSelectOption();
        _querytStampUserInfo();
    }, []);

    return (
        <div className={styles.container}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    onFinish={_onFinish}
                    autoComplete="off"
                    {...formLayout}
                >
                    <Space direction="vertical">
                        <Card title="默认章信息">
                            <h4>默认公司章</h4>
                            <FormItem
                                name="companySealName"
                                label="公司章"
                                rules={[
                                    {
                                        required: true,
                                        message: '公司章不能为空！'
                                    }
                                ]}
                            >
                                <Input disabled />
                            </FormItem>
                            <h4>默认法人/授权代表章</h4>
                            <FormItem
                                name="legalSealName"
                                label="法人/授权代表章"
                                rules={[
                                    {
                                        required: true,
                                        message: '法人/授权代表章不能为空！'
                                    }
                                ]}
                            >
                                <Input disabled />
                            </FormItem>
                            <FormItem
                                name="legalName"
                                label="姓名"
                                rules={[
                                    {
                                        required: true,
                                        message: '姓名不能为空！'
                                    }
                                ]}
                            >
                                <Input disabled />
                            </FormItem>
                        </Card>
                        <Card title="用印人管理">
                            <Form.List name="useSealList">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, i) => (
                                            <Space
                                                key={field.key}
                                                direction="vertical"
                                                className={styles.spaceItem}
                                            >
                                                <FormItem
                                                    {...field}
                                                    label={`用印人${i + 1}`}
                                                    name={[field.name, 'managerUserId']}
                                                >
                                                    <FormItem
                                                        {...field}
                                                        noStyle
                                                        label={`用印人${i + 1}`}
                                                        name={[field.name, 'managerUserId']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '用印人不能为空！'
                                                            }
                                                        ]}
                                                    >
                                                        <Select disabled={i === 0} allowClear>
                                                            {
                                                                Array.isArray(allStampUserList) &&
                                                                allStampUserList.map((item) => {
                                                                    return (
                                                                        <Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Option>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                    {formListBtnGroup(add, remove, fields, field)}
                                                </FormItem>
                                                <FormItem
                                                    {...field}
                                                    name={[field.name, 'mobile']}
                                                    label={`盖章手机号${i + 1}`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '盖章手机号不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <Input disabled={i === 0} />
                                                </FormItem>
                                                <FormItem
                                                    {...field}
                                                    name={[field.name, 'legalSealInfoId']}
                                                    label={`关联法人/授权代表章${i + 1}`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '关联法人/授权代表章不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <Select disabled={i === 0} allowClear>
                                                        {
                                                            Array.isArray(legalSealList) &&
                                                            legalSealList.map((item) => {
                                                                return (
                                                                    <Option key={item.id} value={item.legalSealInfoId}>{item.sealName}</Option>
                                                                );
                                                            })
                                                        }
                                                    </Select>
                                                </FormItem>
                                                <FormItem
                                                    {...field}
                                                    name={[field.name, 'isDefaultUseSeal']}
                                                    label={`是否默认用印人${i + 1}`}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择是否默认用印人'
                                                        }
                                                    ]}
                                                >
                                                    <Radio.Group onChange={(e) => _isDefaultUseSealChange(e, i)}>
                                                        <Radio value={1}>是</Radio>
                                                        <Radio value={0}>否</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                                <Divider />
                                            </Space>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Card title="验证码盖章场景管理">
                            <Form.List name="codeList">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Space
                                                key={field.key}
                                                direction="vertical"
                                                className={styles.spaceItem}
                                            >
                                                <FormItem
                                                    {...field}
                                                    label={`场景${index + 1}`}
                                                    name={[field.name, 'scenesName']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '场景不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <Select allowClear disabled>

                                                    </Select>
                                                </FormItem>
                                                <Form.List name={[field.name, 'sealScenesAssociateInfoList']}>
                                                    {(fields1, { add, remove }) => (
                                                        <>
                                                            {fields1.map((field1, i) => (
                                                                <Space
                                                                    key={`${field.key}${field1.key}`}
                                                                    direction="vertical"
                                                                    className={styles.spaceItem}
                                                                >
                                                                    <FormItem
                                                                        {...field}
                                                                        name={[field1.name, 'hostingNameList']}
                                                                        fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'hostingNameList']}
                                                                        label={`关联托管${i + 1}`}
                                                                    >
                                                                        <FormItem
                                                                            {...field}
                                                                            noStyle
                                                                            name={[field1.name, 'hostingNameList']}
                                                                            fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'hostingNameList']}
                                                                            label={`关联托管${i + 1}`}
                                                                            rules={[
                                                                                {
                                                                                    required: i !== 0,
                                                                                    message: '关联托管不能为空！'
                                                                                }
                                                                            ]}
                                                                        >
                                                                            <Select disabled={i === 0} allowClear mode="multiple">
                                                                                {
                                                                                    Array.isArray(trusteeshipList) &&
                                                                                    trusteeshipList.map((item) => {
                                                                                        return (
                                                                                            <Option key={item.trusteeshipName} value={item.trusteeshipName}>
                                                                                                {item.trusteeshipName}
                                                                                            </Option>
                                                                                        );
                                                                                    })
                                                                                }
                                                                            </Select>
                                                                        </FormItem>
                                                                        {formListBtnGroup(add, remove, fields1, field1)}
                                                                    </FormItem>
                                                                    <FormItem
                                                                        {...field}
                                                                        label={`公司章${i + 1}`}
                                                                        name={[field1.name, 'companySealInfoId']}
                                                                        fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'companySealInfoId']}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: '公司章不能为空！'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Select allowClear>
                                                                            {
                                                                                Array.isArray(companySealList) &&
                                                                                companySealList.map((item) => {
                                                                                    return (
                                                                                        <Option key={item.id} value={item.companySealInfoId}>{item.sealName}</Option>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </FormItem>
                                                                    <FormItem
                                                                        {...field}
                                                                        label={`法人/授权代表章${i + 1}`}
                                                                        name={[field1.name, 'legalSealInfoId']}
                                                                        fieldKey={[`${field.fieldKey}${field1.fieldKey}`, 'legalSealInfoId']}
                                                                        rules={[
                                                                            {
                                                                                required: true,
                                                                                message: '法人/授权代表章不能为空！'
                                                                            }
                                                                        ]}
                                                                    >
                                                                        <Select allowClear>
                                                                            {
                                                                                Array.isArray(legalSealList) &&
                                                                                legalSealList.map((item) => {
                                                                                    return (
                                                                                        <Option key={item.id} value={item.legalSealInfoId}>{item.sealName}</Option>
                                                                                    );
                                                                                })
                                                                            }
                                                                        </Select>
                                                                    </FormItem>
                                                                </Space>
                                                            ))}
                                                        </>
                                                    )}
                                                </Form.List>
                                                <FormItem
                                                    label={`盖章用印人配置${index + 1}`}
                                                    name={[field.name, 'stampUseConfig']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择盖章用印人'
                                                        }
                                                    ]}
                                                >
                                                    <Radio.Group onChange={_handleUserChange}>
                                                        <Radio value={1}>默认经办人</Radio>
                                                        {/* <Radio value={1}>后台登录账号对应经办人</Radio> */}
                                                        <Radio value={0}>指定经办人</Radio>
                                                    </Radio.Group>
                                                </FormItem>

                                                <FormItem
                                                    label={`选择用印人${index + 1}`}
                                                    name={[field.name, 'sealUserInfoId']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '选择用印人不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <SealUserSelect
                                                        // type={1}
                                                        formRef={form}
                                                        type={form.getFieldValue('codeList')[index]['stampUseConfig']}
                                                        dispatch={dispatch}
                                                        value={dataSource.sealCaptchaScenesList?.[index]['sealUserInfoId']}
                                                        indexNum={index}
                                                    />
                                                </FormItem>
                                                <Divider />
                                            </Space>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Card title="系统自动盖章场景管理">
                            <Form.List name="autoSeal">
                                {(fields, { add, remove }) => (
                                    <>
                                        {fields.map((field, i) => (
                                            <Space
                                                key={field.key}
                                                direction="vertical"
                                            >
                                                <FormItem
                                                    {...field}
                                                    label={`场景${i + 1}`}
                                                    name={[field.name, 'scenesName']}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '场景不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <Input disabled />
                                                </FormItem>
                                                <FormItem
                                                    {...field}
                                                    name={[field.name, 'isDefaultCompanySeal']}
                                                    label="公司章"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '公司章不能为空！'
                                                        }
                                                    ]}
                                                >
                                                    <Radio.Group onChange={(e) => _handleChange(e, i, 'isDefaultCompanySealType')}>
                                                        <Radio value={1}>默认公司章</Radio>
                                                        <Radio value={0}>指定公司章</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                                {
                                                    !isDefaultList.includes(i) &&
                                                    <FormItem
                                                        {...field}
                                                        name={[field.name, 'companySealInfoId']}
                                                        label="选择公司章"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '选择公司章不能为空！'
                                                            }
                                                        ]}
                                                    >
                                                        <Select allowClear>
                                                            {
                                                                Array.isArray(companySealList) &&
                                                                companySealList.map((item) => {
                                                                    return (
                                                                        <Option key={item.id} value={item.companySealInfoId}>{item.sealName}</Option>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                }
                                                <FormItem
                                                    {...field}
                                                    name={[field.name, 'isDefaultLegalSeal']}
                                                    label="法人/授权代表章"
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择法人/授权代表章'
                                                        }
                                                    ]}
                                                >
                                                    <Radio.Group onChange={(e) => _handleChange(e, i, 'isDefaultLegalSealType')} >
                                                        <Radio value={1}>默认法人/授权代表章</Radio>
                                                        <Radio value={0}>法人/授权代表章</Radio>
                                                    </Radio.Group>
                                                </FormItem>
                                                {
                                                    !isDefaultLegalList.includes(i) &&
                                                    <FormItem
                                                        {...field}
                                                        name={[field.name, 'legalSealInfoId']}
                                                        label="选择私章"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: '选择私章不能为空！'
                                                            }
                                                        ]}

                                                    >
                                                        <Select allowClear>
                                                            {
                                                                Array.isArray(legalSealList) &&
                                                                legalSealList.map((item) => {
                                                                    return (
                                                                        <Option key={item.id} value={item.legalSealInfoId}>{item.sealName}</Option>
                                                                    );
                                                                })
                                                            }
                                                        </Select>
                                                    </FormItem>
                                                }
                                                <Divider />
                                            </Space>
                                        ))}
                                    </>
                                )}
                            </Form.List>
                        </Card>
                        <Row justify="center">
                            <Button type="primary" htmlType="submit" style={{ width: 120 }} loading={saveLoading}>保存</Button>
                        </Row>
                    </Space>
                </Form>
            </Spin>
        </div >
    );
};

export default connect(({ companySetting, loading }) => ({
    companySetting,
    loading: loading.effects['companySetting/querySealInfo'],
    saveLoading: loading.effects['companySetting/stampManager']
}))(SignetInfo);
