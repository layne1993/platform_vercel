import React, {Fragment, useEffect, useState} from 'react';
import {Form, Input, notification, Select, Spin, Skeleton } from 'antd';
import {connect} from 'dva';
import moment from 'moment';
import styles from './styles.less';

const openNotification = (type, message) => {
    notification[type]({
        message
    });
};

const {Option} = Select;
const { TextArea } = Input;
const ModalPage = (props) => {
    const { dispatch, expressDocumentId, loading, loading2, sourceId } = props;
    const [diskList, setDiskList] = useState([]);
    const [nodeInfoList, setNodeInfoList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [trackingNumberVal, setTrackingNumberVal] = useState('');
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
    };
    const inputBlur = () => {
        const trackingNumber = form.getFieldValue('trackingNumber');
        if(trackingNumber === trackingNumberVal || !trackingNumber) return;
        setTrackingNumberVal(trackingNumber);
        dispatch({
            type: 'expressInformationTracking/autoTrackingCompany',
            payload: {
                trackingNumber
            },
            callback:(res) =>{
                if(res.code !== 1008) return openNotification('error', res.message || '接口出错');
                const flageData = Array.isArray(res.data) ? res.data : [];
                if(!flageData.length) {
                    form.setFieldsValue({
                        trackingCompanyInfo: undefined,
                        expressDocumentLogsInfo: undefined
                    });
                    setNodeInfoList( []);
                }
                if(flageData.length) {
                    const firstData = flageData.shift();
                    form.setFieldsValue({
                        trackingCompanyInfo: {value: firstData.courierCompanyCode, label: firstData.courierCompanyName}
                    });
                    // 请求快递节点信息
                    dispatch({
                        type: 'expressInformationTracking/queryTrackingMessage',
                        payload:{
                            trackingNumber,
                            trackingCompanyCode: firstData.courierCompanyCode
                        },
                        callback(res) {
                            if(res.code !== 1008) return openNotification('error', res.message || '接口出错');
                            form.setFieldsValue({
                                expressDocumentLogsInfo: res.data
                            });
                            setNodeInfoList(res.data?.data || []);
                        }
                    });
                }
            }
        });
    };
    const companyChange = (e) => {
        if(!trackingNumberVal) return;
        dispatch({
            type: 'expressInformationTracking/queryTrackingMessage',
            payload:{
                trackingNumber:trackingNumberVal,
                trackingCompanyCode: e.value
            },
            callback(res) {
                if(res.code !== 1008) {
                    form.setFieldsValue({
                        expressDocumentLogsInfo: undefined
                    });
                    setNodeInfoList(res.data?.data || []);
                    openNotification('error', res.message || '接口出错');
                    return;
                }
                form.setFieldsValue({
                    expressDocumentLogsInfo: res.data
                });
                setNodeInfoList(res.data?.data || []);
            }
        });
    };
    // 请求快递公司全量数据
    useEffect(() => {
        dispatch({
            type: 'expressInformationTracking/autoTrackingCompany',
            payload: {},
            callback:(res) =>{
                if(res.code !== 1008) return openNotification('error', res.message || '接口出错');
                setCompanyList(Array.isArray(res.data) ? res.data : []);
            }
        });
    }, []);
    // 请求网盘文件
    useEffect(() => {
        dispatch({
            type: 'expressInformationTracking/querySelectNetWorkFile',
            payload: {
                sourceId
            },
            callback(res:any) {
                if(res.code === 1008) {
                    const list = res.data.filter((item) => item.isLeaf);
                    setDiskList(list);
                } else {
                    openNotification('error', res.message);
                }
            }
        });
    }, []);
    // 数据回显
    useEffect(() => {
        props.expressDocumentId && dispatch({
            type: 'expressInformationTracking/getExpressDocumentDetail',
            payload: {
                expressDocumentId
            },
            callback(res:any) {
                if(res.code !== 1008) {
                    openNotification('error', res.message);
                    return;
                } else {
                    form.setFieldsValue({
                        ...res.data,
                        sharedNetWorkFileIds: res.data?.sharedNetWorkFileIds?.split(','),
                        expressDocumentLogsInfo: {state: res.data?.status, data: res.data?.expressDocumentLogs},
                        trackingCompanyInfo: {label: res.data?.trackingCompany, value: res.data?.trackingCompanyCode}
                    });
                    setNodeInfoList(res.data?.expressDocumentLogs);
                    setTrackingNumberVal(res.data?.trackingNumber);
                }
            }
        });
    }, []);
    return (
        <Fragment>
            <Spin spinning={Boolean(loading) || Boolean(loading2)}>
                <Form ref={props.formRef} {...layout} form={form}>
                    <Form.Item
                        label="快递单号"
                        name="trackingNumber"
                        rules={[{required: true}]}
                    >
                        <Input placeholder={'请输入快递单号'} onBlur={inputBlur}/>
                    </Form.Item>
                    <Form.Item
                        label="快递公司"
                        name="trackingCompanyInfo"
                        extra={'默认根据快递单号自动识别，如有误，请重新选择'}
                    >
                        <Select
                            placeholder={'请选择'}
                            labelInValue
                            showSearch
                            allowClear
                            filterOption={(input, option) =>{
                                return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}
                            loading={props.loading3}
                            disabled={props.loading3}
                            onChange={companyChange}
                        >
                            {
                                companyList.map(({courierCompanyCode, courierCompanyName}) => (
                                    <Option value={courierCompanyCode} key={courierCompanyCode}>{courierCompanyName}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="备注"
                        name="remark"
                        extra={'与您当前所属的步骤关联'}
                    >
                        <TextArea rows={4}/>
                    </Form.Item>
                    <Form.Item
                        label="关联网盘文件"
                        name="sharedNetWorkFileIds"
                        extra={'可选择关联快递文件所对应的网盘中文件'}
                    >
                        <Select
                            placeholder={'请搜索'}
                            allowClear
                            mode={'multiple'}
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                diskList.map((item) => (
                                    <Option value={String(item.sharedNetWorkFileId)} key={item.sharedNetWorkFileId}>{item.fileName}</Option>
                                ))
                            }
                        </Select>
                    </Form.Item>
                    <div className={styles.box}>
                        <p className={styles.title}>快递节点节点信息</p>
                        {
                            props.loading4 ? <Skeleton active />: (
                                <Form.List
                                    name="expressDocumentLogsInfo"
                                >
                                    {(fields) => {
                                        return (
                                            <div style={{
                                                maxHeight: 200,
                                                overflow: 'auto'
                                            }}
                                            >
                                                {
                                                    nodeInfoList.map((item, index) => (
                                                        <div key={index}>
                                                            <p style={{marginBottom: 0}}>{item.recordTime && moment(item.recordTime).format('YYYY-MM-DD HH:mm:ss') || '--'}</p>
                                                            <p style={{marginBottom: 0, paddingLeft: 8}}>{item.content || '--'}</p>
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        );
                                    }}
                                </Form.List>)
                        }

                    </div>
                </Form>
            </Spin>
        </Fragment>
    );
};

export default connect(({loading})=>({
    loading: loading.effects['expressInformationTracking/getExpressDocumentDetail'],
    loading2: loading.effects['expressInformationTracking/saveExpressDocument'],
    loading3: loading.effects['expressInformationTracking/autoTrackingCompany'],
    loading4: loading.effects['expressInformationTracking/queryTrackingMessage']
}))(ModalPage);
