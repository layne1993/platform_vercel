import React, { useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select, Upload, message, notification, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './styles.less';
import { getCookie, isJSON } from '@/utils/utils';
import moment from 'moment';
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const ModalPage = ({ closeModal, riskRecordId, isEdit, dispatch, loading, loading3, loading4, upDataParentData, askType }) => {
    const initRiskTypeSelect = [
        {
            type: 1,
            text: 'C1'
        },
        {
            type: 2,
            text: 'C2'
        },
        {
            type: 3,
            text: 'C3'
        },
        {
            type: 4,
            text: 'C4'
        },
        {
            type: 5,
            text: 'C5'
        }
    ];
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };

    // console.log(props)
    const [fileList, changeFieldList] = useState([]);
    const [fileInfomation, changeFileInfomation] = useState({});
    const [customerArr, setCustomerArr] = useState([]);
    const [attachmentsId, setAttachmentsId] = useState('');
    const [riskTypeSelect, setRiskTypeSelect] = useState([]);
    const [riskType, setRiskType] = useState(0);
    const [starList, setStarList] = useState([]);
    const [dataList, setDataList] = useState([]);

    const onFinish = (values) => {
        console.log(fileInfomation)
        // 如果是新增
        // if(!isEdit) {
        //     dispatch({
        //         type: 'risk/createNewRiskQuestionnaire',
        //         payload: {
        //             ...values,
        //             attachmentsId,
        //         },
        //         callback() {
        //             closeModal(false)
        //             upDataParentData()
        //         }
        //     })
        //     return
        // }
        dispatch({
            type: 'risk/editRiskQuestionnaire',
            payload: {
                ...values,
                riskRecordId,
                attachmentsId,
                usableStatus: 1,
                isUseSeal:fileInfomation.isUseSeal
            },
            callback(res) {
                if (res.code === 1008) {
                    closeModal(false);
                    upDataParentData();
                } else {
                    message.error(res.message);
                }
            }
        });
    };
    const filePreView = (file) => {
        window.open(file.url);
    };
    const handleFileChange = (e) => {
        changeFieldList(e.fileList);
        const { file } = e;
        if (file.status === 'removed') {
            dispatch({
                type: 'risk/deleteFile',
                payload: { attachmentsId },
                callback(res) {
                    if (res.code === 1008) {
                        setAttachmentsId('');
                        openNotification('success', '提醒', '删除成功');
                    } else {
                        openNotification('error', '提醒', '删除失败');
                    }
                }
            });

        }
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                changeFieldList([{
                    uid: file.response.data.attachmentsId,
                    status: 'done',
                    name: file.response.data.fileName,
                    url: `${file.response.data.baseUrl}`
                }]);
                setAttachmentsId(file.response.data.attachmentsId);
            } else {
                changeFieldList(e.fileList.slice(0, 1));
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    useEffect(() => {
        // 获取客户名称
        dispatch({
            type: 'risk/getAllCustomerArr',
            callback(res) {
                setCustomerArr(res);
            }
        });
        // 获取风险等级
        if (askType) {
            // askType 如果是3 也传2 ，
            askType = askType === 3 ? 2 : askType;
            dispatch({
                type: 'risk/queryRiskLevel',
                payload: { askType },
                callback(res) {
                    setRiskTypeSelect(res);
                }
            });
        } else {
            setRiskTypeSelect(initRiskTypeSelect);
        }
    }, []);

    const changeToOption = (arr, riskType) => {
        let optionArr = [];
        Array.isArray(arr) &&
            arr.forEach((item) => {
                if (item.riskText === `C${riskType}` && Array.isArray(item.starList)) {
                    item.starList.forEach((inner) => {
                        optionArr.push({
                            label: inner.starLevel,
                            value: inner.starLevel
                        });
                    });
                }
            });

        setStarList(optionArr);
    };

    useEffect(() => {
        if (isEdit) {
            dispatch({
                type: 'risk/detailRiskQuestionnaire',
                payload: { riskRecordId },
                callback(res) {
                    if (res.attachment) {
                        changeFieldList([
                            {
                                uid: res.attachment && res.attachment.attachmentsId,
                                status: 'done',
                                name: res.attachment && res.attachment.fileName,
                                url: res.attachment && res.attachment.signUrl || res.attachment.baseUrl,
                                fileUrl: res.attachment && res.attachment.signUrl || res.attachment.baseUrl
                            }
                        ]);
                    }
                    setRiskType(res.riskType);
                    if (isJSON(res.abilityJson)) {
                        let tempArr = JSON.parse(res.abilityJson);
                        setDataList(tempArr);
                        // changeToOption(tempArr, res.riskType);

                    }
                    setAttachmentsId(res.attachmentsId);
                    changeFileInfomation(res)
                    form.setFieldsValue({ ...res, riskDate: res.riskDate ? moment(res.riskDate) : null, riskLimitDate: res.riskLimitDate ? moment(res.riskLimitDate) : null });
                }
            });
        }

    }, []);

    const handleChange = (e) => {
        setRiskType(e);
    };
    useEffect(() => {
        changeToOption(dataList, riskType);
    }, [dataList, riskType]);

    return (
        <Spin spinning={Boolean(loading) || Boolean(loading3) || Boolean(loading4)}>
            <div className={styles.box} >
                <Form
                    form={form}
                    {...layout}
                    onFinish={onFinish}
                >
                    <Row gutter={24} style={{
                        width: '100%'
                    }}
                    >
                        <Col span={8}>
                            <Form.Item
                                name="customerId"
                                label="客户名称"
                                rules={[{ required: true, message: '客户名称必填' }]}
                            >
                                <Select
                                    allowClear
                                    disabled
                                    placeholder="请选择"
                                    showSearch
                                    filterOption={(input, option) => {
                                        return option.children.indexOf(input) >= 0;
                                    }}
                                >
                                    {
                                        customerArr.map((item) => (
                                            <Option key={item.customerId} value={item.customerId}>{item.customerName}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="riskType"
                                label="风险等级"
                                rules={[{ required: true, message: '风险等级必填' }]}
                            >
                                <Select placeholder="请选择"  allowClear onChange={handleChange}>
                                    {
                                        riskTypeSelect.map((item, index) => (
                                            <Option value={+item.type} key={item.type}>{item.text || '--'}</Option>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="score"
                                label="风险测评分值"
                            >
                                <Input placeholder="请输入"/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{
                        width: '100%'
                    }}
                    >
                        <Col span={8}>
                            <Form.Item
                                name="riskDate"
                                label="完成时间"
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                name="riskLimitDate"
                                label="问卷到期时间"
                            >
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        {/*<Col span={8}>*/}
                        {/*    <Form.Item*/}
                        {/*        name="usableStatus"*/}
                        {/*        label="问卷状态"*/}
                        {/*        rules={[{ required: true, message: '问卷状态必填' }]}*/}
                        {/*    >*/}
                        {/*        <Select placeholder="请选择">*/}
                        {/*            <Option value={1}>生效</Option>*/}
                        {/*            <Option value={0}>无效</Option>*/}
                        {/*        </Select>*/}
                        {/*    </Form.Item>*/}
                        {/*</Col>*/}
                        <Col span={8}>
                            <Form.Item name="sourceType" label="问卷来源" initialValue={2}>
                                <Select placeholder="请选择" disabled  allowClear>
                                    <Option value={1}>线上填写</Option>
                                    <Option value={2}>后台创建</Option>
                                    <Option value={3}>电子合同签约</Option>
                                    <Option value={4}>非电子合同签约</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24} style={{
                        width: '100%'
                    }}
                    >
                        <Col span={8}>
                            <Form.Item
                                label="星级"
                                name="riskStarRating"
                            >
                                <Select placeholder="请选择"  allowClear>
                                    {
                                        starList.map((item) => {
                                            return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={16} style={{ display: 'flex' }}>
                            <span style={{
                                paddingLeft: 26,
                                paddingTop: 6
                            }}
                            >测评问卷：</span>
                            <div className={styles.uploadBox}>
                                <Upload
                                    name="file"
                                    action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                    headers={{
                                        tokenId: getCookie('vipAdminToken')
                                    }}
                                    fileList={fileList}
                                    data={{
                                        source: 4,
                                        codeType: 107
                                    }}
                                    onPreview={filePreView}
                                    onChange={handleFileChange}
                                >
                                    <Button icon={<UploadOutlined />}>点击上传</Button>
                                </Upload>
                            </div>
                        </Col>
                    </Row>
                    <div className={styles.btnG}>
                        <Button htmlType="submit" type="primary" className={styles.subBtn}>
                            确定
                        </Button>
                        <Button onClick={(e) => closeModal(false)}>
                            取消
                        </Button>
                    </div>
                </Form>
            </div>
        </Spin>
    );
};

export default connect(({ risk, loading }) => ({
    risk,
    loading: loading.effects['risk/detailRiskQuestionnaire'],
    loading2: loading.effects['risk/queryRiskList'],
    loading3: loading.effects['risk/createNewRiskQuestionnaire'],
    loading4: loading.effects['risk/editRiskQuestionnaire']

}))(ModalPage);


