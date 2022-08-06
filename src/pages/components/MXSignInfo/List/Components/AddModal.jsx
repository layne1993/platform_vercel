/*
 * @description: 新建认申赎流程
 * @Author: tangsc,hucc
 * @Date: 2021-05-19 15:00:00
 */

import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { connect, history } from 'umi';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Form, Button, Select, Upload, DatePicker, InputNumber, Input, notification, Space, Radio, Row, Col, Card } from 'antd';
import { XWsignType, XWTradeType } from '@/utils/publicData';
import { getRandomKey, getCookie, dataMasking } from '@/utils/utils';
import { isEmpty, cloneDeep } from 'lodash';
import { selectAllUser } from '../service';

const FormItem = Form.Item;
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';
const dateFormatShowTime = 'YYYY/MM/DD HH:mm:ss';
const uploadArr = [
    { label: '风险告知书', code: 121 },
    { label: '风险揭示书上传', code: 122 },
    { label: '基金合同上传', code: 123 },
    { label: '补充协议', code: 124 },
    { label: '购买确认书', code: 125 },
    { label: '录音录像', code: 126 },
    { label: '打款证明', code: 127 },
    { label: '打款银行卡', code: 128 },
    { label: '回访问卷', code: 129 },
    { label: '其他材料', code: 149 }
];

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const AddModal = (props) => {

    const { isModalVisible, onCancel, onOk, dispatch, signFlowId, params = {} } = props;
    const [formModal] = Form.useForm();
    // 保存所有产品列表
    const [productList, setProductList] = useState([]);

    // 保存所有客户列表
    const [customerList, setCustomerList] = useState([]);
    const [data, setData] = useState([]);

    // 文件列表
    const [fileList, setFileList] = useState([[], [], [], [], [], [], [], [], [], []]);

    const [allUser, setAlluser] = useState([]);
    // form表单提交
    const _onFinish = (values) => {
        onOk({ ...params, ...values }, fileList);
    };

    // upload change事件
    const _handleFileChange = (info, index) => {

        const fileArr = [...fileList];
        fileArr[index] = info.fileList;
        setFileList(fileArr);
        if (info.file.status === 'uploading') {

            // setFileList(info.fileList)
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                const { data = [] } = info.file.response;
                const tempObj = {
                    uid: data.attachmentsId,
                    status: 'done',
                    name: data.fileName.length && data.fileName.length > 25 ? data.fileName.substring(0, 25) + '...' : data.fileName,
                    url: data.baseUrl,
                    linkProps: JSON.stringify({ title: data.fileName })
                };
                if (fileList[index] == null) {
                    fileList[index] = [];
                }
                fileList[index].pop();
                fileList[index].push(tempObj);
                setFileList(fileList);
                // _queryPLInfo();
                // _lpSummary();
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };


    // 文件删除
    const _onRemove = (index) => {
        const fileArr = [...fileList];
        fileArr[index] = [];
        setFileList(fileArr);
    };
    const queryBank = (customerId) => {
        dispatch({
            type: 'signInfoList/queryBank',
            payload: { customerId },
            callback: (res) => {
                if (res.code === 1008) {
                    setData(res.data.map((item) => item.accountNumber));
                }
            }
        });
    };

    const queryBaseInfo = (customerId) => {
        if (customerId) {
            dispatch({
                type: 'signInfoList/getCustomerByCustomerId',
                payload: {
                    customerId
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        const { data } = res
                        if (data.mobile || data.email) {
                            let contact = ''
                            if (data.mobile) {
                                contact += `手机:${dataMasking(data.mobile)},`
                            }
                            if (data.email) {
                                contact += `邮箱:${data.email}`
                            }
                            formModal.setFieldsValue({
                                contact
                            });
                        } else {
                            formModal.setFieldsValue({
                                contact: ''
                            });
                        }

                    }
                }
            });
        }
    };

    // 审核状态改变回调
    const changeAuditStatus = (e) => {
        // 签署文件审核和打款与回访审核都通过 则将基本信息审核置为审核通过
        const fileAuditStatus = formModal.getFieldValue('fileAuditStatus');
        const moneyAuditStatus = formModal.getFieldValue('moneyAuditStatus');
        if (fileAuditStatus === 0 || moneyAuditStatus === 0) {
            formModal.setFieldsValue({ baseAuditStatus: '待审核' })
            return
        }
        if (fileAuditStatus === 1 && moneyAuditStatus === 1) {
            formModal.setFieldsValue({ baseAuditStatus: '审核已通过' })
        } else {
            formModal.setFieldsValue({ baseAuditStatus: '审核未通过' })
        }
    }
    // 根据文件审核和回访审核确定基本审核状态
    const handleBaseAuditStatus = (data) => {
        if (data) {
            if (data[0].auditStatus === 0 || data[1].auditStatus === 0) {
                return '待审核';
            }
            if (data[0].auditStatus === 1 && data[1].auditStatus === 1) {
                return '审核通过';
            } else {
                return '审核不通过';
            }
        }
        return '待审核';
    }
    // 文件预览
    const _filePreView = (file) => {
        window.open(file.url);
    };
    useEffect(() => {
        // 初始化获取产品列表
        dispatch({
            type: 'signInfoList/getProductList',
            payload: {
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setProductList(res.data);
                }
            }
        });
        // 初始化获取客户列表
        dispatch({
            type: 'signInfoList/getCustomerList',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setCustomerList(res.data);
                }
            }
        });
        if (signFlowId) {
            dispatch({
                type: 'signInfoList/getSignFlowOffline',
                payload: { signFlowId },
                callback: (res) => {
                    if (res.code === 1008) {
                        queryBank(res.data.customerId);
                        queryBaseInfo(res.data.customerId);
                        formModal && formModal.setFieldsValue({
                            ...res.data,
                            startDate: res.data.startDate ? moment(res.data.startDate) : '',
                            completionDate: res.data.completionDate ? moment(res.data.completionDate) : '',
                            // baseAuditStatus基本信息审核状态：当签署文件审核和打款与回访审核都通过是 则通过 否则不通过
                            // baseAuditStatus: res.data.auditList&&res.data.auditList[0].auditStatus === 1 && res.data.auditList[1].auditStatus === 1 ? '审核通过' : '审核不通过',
                            baseAuditStatus: handleBaseAuditStatus(res.data.auditList),
                            fileAuditStatus: res.data.auditList && res.data.auditList[0].auditStatus,
                            fileAuditTime: res.data.auditList && res.data.auditList[0].auditTime ? moment(res.data.auditList[0].auditTime) : '',
                            fileAuditP: res.data.auditList && [res.data.auditList[0].auditPersonName, res.data.auditList[0].auditPersonId],
                            moneyAuditStatus: res.data.auditList && res.data.auditList[1].auditStatus,
                            moneyAuditTime: res.data.auditList && res.data.auditList[1].auditTime ? moment(res.data.auditList[1].auditTime) : '',
                            moneyAuditP: res.data.auditList && [res.data.auditList[1].auditPersonName, res.data.auditList[1].auditPersonId]
                        });
                        uploadArr.forEach((item, index) => {
                            res.data.attachments.forEach((itm) => {
                                if (item.code === itm.codeType) {
                                    if (fileList[index] == null) {
                                        fileList[index] = [];
                                    }
                                    fileList[index].push({
                                        uid: itm.attachmentsId,
                                        status: 'done',
                                        name: itm.fileName.length && itm.fileName.length > 25 ? itm.fileName.substring(0, 25) + '...' : itm.fileName,
                                        url: itm.fileUrl,
                                        linkProps: JSON.stringify({ title: itm.fileName })
                                    });
                                }
                            });
                        });
                        setFileList(fileList);
                    }
                }
            });
        } else {
            formModal && formModal.setFieldsValue({
                baseAuditStatus: '审核通过',
                fileAuditStatus: 1,
                moneyAuditStatus: 1
            });
        }
        if (params.customerId) {
            queryBank(params.customerId);
        }
        // 获取所有管理员用户
        selectAllUser({ pageNum: 1, pageSize: 9999999 }).then((res) => {
            // setAlluser()
            if (res.code === 1008) {
                setAlluser(res.data.list);
            }
        })
    }, []);


    const onChange = (customerId) => {
        queryBank(customerId);
        queryBaseInfo(customerId);
    };


    const turn = <a onClick={() => {
        history.push('/investor/bankCardInfo');
        onCancel();
    }}
    >点击前往维护</a>;
    return (
        <Modal
            width="1200px"
            className={styles.addContainer}
            title={signFlowId ? '修改' : '新建'}
            centered
            maskClosable={false}
            visible={isModalVisible}
            onCancel={onCancel}
            footer={null}
            forceRender
            destroyOnClose
        >
            <Form
                name="addForm"
                form={formModal}
                autoComplete="off"
                onFinish={_onFinish}
                initialValues={{
                    notifier: 0
                }}
            >
                <Card title="基本信息" bordered={false}>
                    <Row gutter={[12, 12]}>
                        <Col span={12}>
                            {!params.customerId &&
                                <FormItem
                                    label="客户名称"
                                    name="customerId"
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择客户'
                                        }
                                    ]}
                                >
                                    <Select placeholder="请选择"
                                        style={{ width: '100%' }}
                                        showSearch
                                        allowClear
                                        defaultActiveFirstOption={false}
                                        // showArrow={false}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                        onChange={onChange}
                                        notFoundContent={null}
                                        optionLabelProp="label"
                                    >
                                        {
                                            !isEmpty(customerList) &&
                                            customerList.map((item) => <Option label={item.customerName} key={item.customerId} value={item.customerId}>{item.customerBrief}</Option>)
                                        }
                                    </Select>
                                </FormItem>
                            }
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="产品全称"
                                name="productId"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择产品'
                                    }
                                ]}
                            >
                                <Select placeholder="请选择"
                                    // showArrow
                                    allowClear
                                    showSearch
                                    defaultActiveFirstOption={false}
                                    filterOption={
                                        (inputValue, option) => {
                                            return option.children.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
                                        }}
                                    notFoundContent={null}
                                >
                                    {
                                        Array.isArray(productList) &&
                                        productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productName}</Option>)
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="通知投资者方式"
                                name="notifier"
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择通知投资者方式'
                                    }
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={0}>不通知</Radio >
                                    <Radio value={1}>短信</Radio >
                                    <Radio value={2}>邮件</Radio >
                                    <Radio value={3}>短信+邮件</Radio >
                                </Radio.Group>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="投资者联系方式"
                                name="contact"
                            >
                                <Input disabled />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="关联交易类型"
                                name="flowType"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {
                                        !isEmpty(XWTradeType) &&
                                        XWTradeType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col>
                        {/* <Col span={12}>
                            <FormItem
                                label="合同电子签"
                                name="signType"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {
                                        !isEmpty(XWsignType) &&
                                        XWsignType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={Number(item.value)}>{item.label}</Option>
                                            );
                                        })
                                    }
                                </Select>
                            </FormItem>
                        </Col> */}
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="签约额"
                                name="tradeMoney"
                            >
                                <InputNumber style={{ width: '100%' }} placeholder="请输入" min={0} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="银行卡号"
                                name="accountNumber"
                                help={<div>如未维护投资者银行卡信息，{turn}</div>}
                            >
                                <Select allowClear>
                                    {data.map((item) => <Option key={getRandomKey(5)} value={item}>{item}</Option>)}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="签约开始日期"
                                name="startDate"
                            >
                                <DatePicker style={{ width: '100%' }} format={dateFormat} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="签约完成日期"
                                name="completionDate"
                            >
                                <DatePicker style={{ width: '100%' }} format={dateFormat} />
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="审核状态"
                                name="baseAuditStatus"
                            >
                                <Input disabled bordered={false} />
                            </FormItem>
                        </Col>
                        <Col span={12}>
                        </Col>
                    </Row>
                </Card>
                {/* 10个上传文件项前六个一组 后四个一组 分两次遍历 */}
                <Card title="签署文件审核" bordered={false}>
                    {uploadArr.map((item, index) => {
                        if (index >= 6) {
                            return;
                        }
                        if (index % 2 !== 0) {
                            return (
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            key={`attachmentsId${index - 1}`}
                                            label={uploadArr[index - 1].label}
                                            name={`attachmentsId${index - 1}`}
                                            extra="支持压缩包，上传的文件鼠标点击可下载查阅"
                                        >
                                            <Upload
                                                name="file"
                                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                                headers={{
                                                    tokenId: getCookie('vipAdminToken')
                                                }}
                                                data={{
                                                    sourceId: '',
                                                    source: 23,
                                                    codeType: uploadArr[index - 1].code
                                                }}
                                                fileList={fileList[index - 1]}
                                                // beforeUpload={_beforeUpload}
                                                onRemove={() => _onRemove(index - 1)}
                                                onChange={(info) => _handleFileChange(info, index - 1)}
                                                onPreview={!isEmpty(fileList[index - 1]) ? _filePreView : false}
                                            >
                                                <Button><UploadOutlined /> 上传文件</Button>
                                            </Upload>
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            key={`attachmentsId${index}`}
                                            label={item.label}
                                            name={`attachmentsId${index}`}
                                            extra="支持压缩包，上传的文件鼠标点击可下载查阅"
                                        >
                                            <Upload
                                                name="file"
                                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                                headers={{
                                                    tokenId: getCookie('vipAdminToken')
                                                }}
                                                data={{
                                                    sourceId: '',
                                                    source: 23,
                                                    codeType: item.code
                                                }}
                                                fileList={fileList[index]}
                                                // beforeUpload={_beforeUpload}
                                                onRemove={() => _onRemove(index)}
                                                onChange={(info) => _handleFileChange(info, index)}
                                                onPreview={!isEmpty(fileList[index]) ? _filePreView : false}
                                            >
                                                <Button><UploadOutlined /> 上传文件</Button>
                                            </Upload>
                                        </FormItem>
                                    </Col>
                                </Row>
                            );
                        }
                    })}
                    {/* 审核认和审核状态 */}
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="审核"
                                name="fileAuditStatus"
                            >
                                <Select placeholder="请选择"
                                    // showArrow
                                    onChange={(e) => changeAuditStatus(e)}
                                >
                                    <Option key={'addModal待审核0'} value={0}>待审核</Option>
                                    <Option key={'addModal审核通过1'} value={1}>审核通过</Option>
                                    <Option key={'addModal审核不通过2'} value={2}>审核不通过</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="审核人"
                                name="fileAuditP"
                            >
                                <Select placeholder="请选择"
                                    showArrow
                                    allowClear
                                    showSearch
                                // notFoundContent={null}
                                >
                                    {Array.isArray(allUser) && allUser.map((item, index) => {
                                        return <Option key={item.managerUserId} value={[item.userName || '', item.managerUserId || '']}>{item.userName}</Option>
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="审核时间"
                                name="fileAuditTime"
                            >
                                <DatePicker showTime style={{ width: '100%' }} format={dateFormatShowTime} />
                            </FormItem>
                        </Col>
                        <Col span={12}>

                        </Col>
                    </Row>
                </Card>
                <Card title="打款与回访审核" bordered={false}>
                    {uploadArr.map((item, index) => {
                        if (index < 6) {
                            return;
                        }
                        if (index % 2 !== 0) {
                            return (
                                <Row>
                                    <Col span={12}>
                                        <FormItem
                                            key={`attachmentsId${index - 1}`}
                                            label={uploadArr[index - 1].label}
                                            name={`attachmentsId${index - 1}`}
                                            extra="支持压缩包，上传的文件鼠标点击可下载查阅"
                                        >
                                            <Upload
                                                name="file"
                                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                                headers={{
                                                    tokenId: getCookie('vipAdminToken')
                                                }}
                                                data={{
                                                    sourceId: '',
                                                    source: 23,
                                                    codeType: uploadArr[index - 1].code
                                                }}
                                                fileList={fileList[index - 1]}
                                                // beforeUpload={_beforeUpload}
                                                onRemove={() => _onRemove(index - 1)}
                                                onChange={(info) => _handleFileChange(info, index - 1)}
                                                onPreview={!isEmpty(fileList[index - 1]) ? _filePreView : false}
                                            >
                                                <Button><UploadOutlined /> 上传文件</Button>
                                            </Upload>
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem
                                            key={`attachmentsId${index}`}
                                            label={item.label}
                                            name={`attachmentsId${index}`}
                                            extra="支持压缩包，上传的文件鼠标点击可下载查阅"
                                        >
                                            <Upload
                                                name="file"
                                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                                headers={{
                                                    tokenId: getCookie('vipAdminToken')
                                                }}
                                                data={{
                                                    sourceId: '',
                                                    source: 23,
                                                    codeType: item.code
                                                }}
                                                fileList={fileList[index]}
                                                // beforeUpload={_beforeUpload}
                                                onRemove={() => _onRemove(index)}
                                                onChange={(info) => _handleFileChange(info, index)}
                                                onPreview={!isEmpty(fileList[index]) ? _filePreView : false}
                                            >
                                                <Button><UploadOutlined /> 上传文件</Button>
                                            </Upload>
                                        </FormItem>
                                    </Col>
                                </Row>
                            );
                        }
                    })}
                    {/* 审核认和审核状态 */}
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="审核"
                                name="moneyAuditStatus"
                            >
                                <Select placeholder="请选择"
                                    // showArrow
                                    // notFoundContent={null}
                                    onChange={(e) => changeAuditStatus(e)}
                                >
                                    {/* {
                                        Array.isArray(productList) &&
                                        productList.map((item) => <Option key={item.productId} value={item.productId}>{item.productName}</Option>)
                                    } */}
                                    <Option key={'addModal待审核0'} value={0}>待审核</Option>
                                    <Option key={'addModal审核通过1'} value={1}>审核通过</Option>
                                    <Option key={'addModal审核不通过2'} value={2}>审核不通过</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="审核人"
                                name="moneyAuditP"
                            >
                                <Select placeholder="请选择"
                                    showArrow
                                    allowClear
                                    showSearch
                                // notFoundContent={null}
                                >
                                    {Array.isArray(allUser) && allUser.map((item, index) => {
                                        return <Option key={item.managerUserId} value={[item.userName, item.managerUserId]}>{item.userName}</Option>
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <FormItem
                                label="审核时间"
                                name="moneyAuditTime"
                            >
                                <DatePicker showTime style={{ width: '100%' }} format={dateFormatShowTime} />
                            </FormItem>
                        </Col>
                        <Col span={12}>

                        </Col>
                    </Row>
                </Card>
                {/* {uploadArr.map((item, index) => {
                    return (
                        <FormItem
                            key={`attachmentsId${index}`}
                            label={item.label}
                            name={`attachmentsId${index}`}
                            extra="支持压缩包，上传的文件鼠标点击可下载查阅"
                        >
                            <Upload
                                name="file"
                                action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                data={{
                                    sourceId: '',
                                    source: 23,
                                    codeType: item.code
                                }}
                                fileList={fileList[index]}
                                // beforeUpload={_beforeUpload}
                                onRemove={() => _onRemove(index)}
                                onChange={(info) => _handleFileChange(info, index)}
                                onPreview={!isEmpty(fileList[index]) ? _filePreView : false}
                            >
                                <Button><UploadOutlined /> 上传文件</Button>
                            </Upload>
                        </FormItem>
                    );
                })} */}

                {
                    <Space className={styles.modalBtnGroup}>
                        <Button type="primary" htmlType="submit">保存</Button>
                        <Button onClick={onCancel} >取消</Button>
                    </Space>
                }
            </Form>
        </Modal>
    );

};
export default connect(({ signInfoList, loading }) => ({
    signInfoList
}))(AddModal);