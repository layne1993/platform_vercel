/*
 * @Descripttion:公司设置-印章设置
 * @version:
 * @Author: yezi
 * @Date: 2021-06-04 13:22:15
 * @LastEditTime: 2021-07-22 14:45:01
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { connect, history, Link } from 'umi';
import { Card, Form, Row, Col, Radio, Input, Select, Button, Spin, notification, Upload, Space, Modal } from 'antd';
import { getPermission } from '@/utils/utils';
import { PlusOutlined } from '@ant-design/icons';
import { addIcon, deleteIcon } from '@/utils/staticResources';
import Add from './add';
import _styles from './styles.less';

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

const MAX_FILE_SIZE = 1024 * 1024 * 0.2;



const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};




const SealInfo: FC<any> = (props) => {
    const { authEdit, loading, saveLoading, dispatch, sendLoading } = props;
    const [form] = Form.useForm();
    const [infoData, setSettingInfo] = useState<{ [key: string]: string }>({});
    const [flag, setModalFlag] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        refresh && setTimeout(() => setRefresh(false));
    }, [refresh]);

    const doRefresh = () => setRefresh(true);



    // useEffect(() => {
    //     form.setFieldsValue({
    //         companySealList: [{ companyName: '', isSeal: 1 }],
    //         legalSealList: [{ companyName: '', isSeal: 1 }]
    //     });
    // }, []);

    const getFileList = (arr = []) => {
        const newArr = [];
        arr.map((item) => {
            newArr.push({
                ...item,
                fileList: item.sealBase64 && [
                    {
                        uid: 11111,
                        name: '图片',
                        url: `data:image/png;base64,${item.sealBase64}`,
                        // previewUrl: data.baseUrl,
                        status: 'done'
                    }
                ]
            });
        });
        return newArr;
    };

    // 获取配置
    const getSealInfo = () => {
        dispatch({
            type: 'companySetting/sealInfo',
            payload: {},
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    form.setFieldsValue({
                        companySealList: getFileList(data.companySealList),
                        legalSealList: getFileList(data.legalSealList)
                    });
                    setSettingInfo(data);
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(getSealInfo, []);



    // 用章change事件
    const sealChange = (val, index, fieldKey) => {
        if (val === 1) {
            const data = form.getFieldValue(fieldKey);
            data.map((item, i) => {
                if (index !== i) {
                    item.isDefaultSeal = 0;
                }
            });
            form.setFieldsValue({ fieldKey: data });
        }
    };

    // 保存
    const onFinish = (values) => {
        console.log(values, 'sealManager');
        const arr = values.companySealList || [];

        let noHasOne = true;
        arr.map((item) => {
            if (item.isDefaultSeal === 1) {
                noHasOne = false;
            }
        });
        if (noHasOne) {
            openNotification('error', '提醒', '公司章管理[是否默认印章]不能全为否！');
            return;
        }
        const arr1 = values.legalSealList || [];
        let noHasOne1 = true;
        arr1.map((item) => {
            if (item.isDefaultSeal === 1) {
                noHasOne1 = false;
            }
        });

        if (noHasOne1) {
            openNotification('error', '提醒', '法人/授权代表章[是否默认印章]不能全为否！');
            return;
        }
        dispatch({
            type: 'companySetting/sealManager',
            payload: {
                ...infoData,
                ...values
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    getSealInfo();
                    openNotification('success', '提醒', '保存成功');
                } else {
                    const txt = message || data || '保存失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    // 上传前文件格式校验
    const _beforeUpload = (file, index, fieldKey) => {
        if (file.size > MAX_FILE_SIZE) {
            openNotification('error', '提醒', '文件超过128k，请重新上传');
            doRefresh();
            return false;
        }
        if (file.type !== 'image/png') {
            openNotification('error', '提醒', '图片格式错误，请上传png格式图片');
            doRefresh();
            return false;
        } else {
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function (file) {
                let base64 = file.target.result;
                if (base64) {
                    const listData = form.getFieldValue(fieldKey);
                    listData[index]['sealBase64'] = base64.replace('data:image/png;base64,', '');
                    listData[index]['fileList'] = [
                        {
                            uid: 1111,
                            name: '图片',
                            url: base64,
                            // previewUrl: data.baseUrl,
                            status: 'done'
                        }
                    ];
                    form.setFieldsValue({ fieldKey: listData });
                    doRefresh();
                }

            };
            doRefresh();
        }

        return false;
    };


    const onSuccess = (values) => {
        setModalFlag(false);
        const list = form.getFieldValue('legalSealList');
        list.push({ ...values, isDefaultSeal: 1, sealConfigType: 1 });
        form.setFieldsValue({ legalSealList: list });
    };

    const normFile = (e: any) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const onPreview = (file) => {

        Modal.info({
            icon: null,
            content: <img src={file.url} />,
            okText: '关闭'
        });
    };

    const onRemove = (file, index, fieldKey) => {
        const listData = form.getFieldValue(fieldKey);
        listData[index]['sealBase64'] = null;
        listData[index]['fileList'] = [];
        form.setFieldsValue({ fieldKey: listData });
        doRefresh();
        return true;
    };


    return (
        <div className={_styles.sealInfoWarp}>
            <Spin spinning={loading}>
                <Form
                    form={form}
                    {...formItemLayout}
                    onFinish={onFinish}
                >
                    <Card title="公司章管理">
                        <Form.List name="companySealList">
                            {(fields, { add, remove }) => (
                                fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                    <Space direction="vertical" key={key} style={{ width: '100%' }}>
                                        <Form.Item
                                            label={<span><span style={{ color: 'red' }}>*</span>公司章</span>}
                                            // name={[name, 'sealName']}
                                            rules={[{ required: false, message: '请输入' }]}
                                        >
                                            <Form.Item
                                                noStyle
                                                {...restField}
                                                name={[name, 'sealName']}
                                                rules={[{ required: true, message: '请输入' }]}
                                            >
                                                <Input disabled={!!form.getFieldValue('companySealList')[index]['sealName']} />
                                            </Form.Item>
                                            <Space className={_styles.addBox}>
                                                <span
                                                    className={_styles.addIcon}
                                                    onClick={() => { add({ isDefaultSeal: 0, sealConfigType: 0 }); }}
                                                >
                                                    <img src={addIcon} style={{ width: 20 }} />
                                                </span>
                                                {(fields.length > 1 && index > 0) ? (
                                                    <span className={_styles.delIcon} onClick={() => remove(name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Form.Item>
                                        <Form.Item
                                            label="是否默认印章"
                                            // {...restField}
                                            name={[name, 'isDefaultSeal']}
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <Radio.Group onChange={(e) => sealChange(e.target.value, index, 'companySealList')}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="印模配置"
                                            // {...restField}
                                            name={[name, 'sealConfigType']}
                                            rules={[{ required: true, message: '请选择' }]}
                                            extra="采用印模上传的联系易私慕维护好印模图片"
                                        >
                                            <Radio.Group onChange={doRefresh}>
                                                <Radio value={0}>印模上传</Radio>
                                                <Radio value={1}>系统默认印模</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {(() => (
                                            form.getFieldValue('companySealList')[index] && form.getFieldValue('companySealList')[index]['sealConfigType'] === 0 &&
                                            <Form.Item
                                                name={[name, 'sealBase64']}
                                                // name="attachmentsId"
                                                label="印模文件上传"
                                                valuePropName="sealBase64"
                                                getValueFromEvent={normFile}
                                                rules={[{ required: true, message: '请上传' }]}
                                                extra="上传的图片需要判断：1、必须PNG格式；2、文件大小为128Kb内；3、文件尺寸为：200 X 200"
                                            >
                                                <Upload
                                                    // name="logo"
                                                    listType="picture-card"
                                                    accept=".png"
                                                    fileList={form.getFieldValue('companySealList')[index]['fileList'] || []}
                                                    beforeUpload={(file) => _beforeUpload(file, index, 'companySealList')}
                                                    maxCount={1}
                                                    onPreview={(file) => onPreview(file)}
                                                    onRemove={(file) => onRemove(file, index, 'companySealList')}
                                                >
                                                    <PlusOutlined />
                                                </Upload>
                                            </Form.Item>

                                        ))()}
                                    </Space>
                                ))
                            )}
                        </Form.List>
                    </Card>
                    <Card title="法人/授权代表章">
                        <Form.List name="legalSealList">
                            {(fields, { add, remove }) => (
                                fields.map(({ key, name, fieldKey, ...restField }, index) => (
                                    <Space direction="vertical" key={key} style={{ width: '100%' }}>
                                        <Form.Item
                                            label={<span><span style={{ color: 'red' }}>*</span>法人/授权代表章名称</span>}
                                            {...restField}
                                            // name={[name, 'sealName']}
                                            rules={[{ required: false, message: '请输入' }]}
                                        >
                                            <Form.Item
                                                noStyle
                                                {...restField}
                                                name={[name, 'sealName']}
                                                rules={[{ required: true, message: '请输入' }]}
                                            >
                                                <Input disabled />
                                            </Form.Item>

                                            <Space className={_styles.addBox}>
                                                <span
                                                    className={_styles.addIcon}
                                                    onClick={() => setModalFlag(true)}
                                                >
                                                    <img src={addIcon} style={{ width: 20 }} />
                                                </span>
                                                {(fields.length > 1 && index > 0) ? (
                                                    <span className={_styles.delIcon} onClick={() => remove(name)}>
                                                        <img src={deleteIcon} style={{ width: 20 }} />
                                                    </span>
                                                ) : null}
                                            </Space>
                                        </Form.Item>
                                        <Form.Item
                                            label="姓名"
                                            {...restField}
                                            name={[name, 'name']}
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                        {/* <Form.Item
                                            label="身份证号码"
                                            {...restField}
                                            name={[name, 'cardNumber']}
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item
                                            label="银行卡号"
                                            name={[name, 'bankCard']}
                                            rules={[{ required: true, message: '请输入' }]}
                                        >
                                            <Input disabled />
                                        </Form.Item>
                                        <Form.Item
                                            label="手机号"
                                            {...restField}
                                            name={[name, 'mobile']}
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <Input disabled />
                                        </Form.Item> */}
                                        <Form.Item
                                            label="是否默认印章"
                                            {...restField}
                                            name={[name, 'isDefaultSeal']}
                                            rules={[{ required: true, message: '请选择' }]}
                                        >
                                            <Radio.Group onChange={(e) => sealChange(e.target.value, index, 'legalSealList')}>
                                                <Radio value={1}>是</Radio>
                                                <Radio value={0}>否</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <Form.Item
                                            label="印模配置"
                                            {...restField}
                                            name={[name, 'sealConfigType']}
                                            rules={[{ required: true, message: '请选择' }]}
                                            extra="采用印模上传的联系易私慕维护好印模图片"
                                        >
                                            <Radio.Group onChange={doRefresh}>
                                                <Radio value={0}>印模上传</Radio>
                                                <Radio value={1}>系统默认印模</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        {(() => (
                                            form.getFieldValue('legalSealList')[index] && form.getFieldValue('legalSealList')[index]['sealConfigType'] === 0 &&
                                            <Form.Item
                                                // name="attachmentsId"
                                                label="印模文件上传"
                                                name={[name, 'sealBase64']}
                                                valuePropName="sealBase64"
                                                getValueFromEvent={normFile}
                                                rules={[{ required: true, message: '请上传' }]}
                                                extra="上传的图片需要判断：1、必须PNG格式；2、文件大小为128Kb内；3、文件尺寸为：200 X 200"
                                            >
                                                <Upload
                                                    // name="logo"
                                                    listType="picture-card"
                                                    accept=".png"
                                                    fileList={form.getFieldValue('legalSealList')[index]['fileList'] || []}
                                                    beforeUpload={(file) => _beforeUpload(file, index, 'legalSealList')}
                                                    maxCount={1}
                                                    onPreview={(file) => onPreview(file)}
                                                    onRemove={(file) => onRemove(file, index, 'legalSealList')}
                                                >
                                                    <PlusOutlined />
                                                </Upload>
                                            </Form.Item>

                                        ))()}

                                    </Space>
                                ))
                            )}
                        </Form.List>
                    </Card>
                    <Row justify="center">
                        {
                            authEdit &&
                            <Button loading={saveLoading} type="primary" htmlType="submit" style={{ marginRight: 8 }}>提交认证</Button>
                        }

                    </Row>
                </Form>
            </Spin>
            {
                flag &&
                <Add
                    flag={flag}
                    cancel={() => setModalFlag(false)}
                    onSuccess={onSuccess}
                />
            }
        </div >
    );
};

export default connect(({ companySetting, loading }) => ({
    loading: loading.effects['companySetting/sealInfo'],
    saveLoading: loading.effects['companySetting/sealManager'],
    sendloading: loading.effects['companySetting/sendAmount']
}))(SealInfo);

SealInfo.defaultProps = {
    loading: false,
    saveLoading: false,
    sendloading: false,
    authEdit: true
};

