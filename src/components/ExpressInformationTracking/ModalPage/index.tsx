/*
 * @Author: your name
 * @Date: 2021-07-29 18:42:59
 * @LastEditTime: 2021-09-14 19:20:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\components\ExpressInformationTracking\ModalPage\index.tsx
 */

import React, {useRef, Fragment, useEffect} from 'react';
import {Form, Input, notification, Select, Spin} from 'antd';
import {connect} from 'dva';
import styles from './styles.less';

const openNotification = (type, message) => {
    notification[type]({
        message
    });
};

const {Option} = Select;
const { TextArea } = Input;
const ModalPage = (props) => {
    const { dispatch, expressDocumentId, loading, loading2 } = props;
    const [form] = Form.useForm();
    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 }
    };
    const inputBlur = (e) => {
        console.log(props);
    };
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
                    console.log(res);
                    form.setFieldsValue({
                        ...res.data,
                        sharedNetWorkFileIds: res.data?.sharedNetWorkFileIds?.split(',')
                    });
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
                    >
                        <Input placeholder={'请输入快递单号'} onBlur={inputBlur}/>
                    </Form.Item>
                    <Form.Item
                        label="快递跟踪"
                        name="username"
                        extra={'默认根据快递单号自动识别，如有误，请重新选择'}
                    >
                        <Select placeholder={'请选择'} allowClear>
                            <Option value={1}>1</Option>
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
                        <Select placeholder={'请输入快递单号'} showSearch mode={'multiple'} allowClear>
                            <Option value={1}>1</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="步骤"
                        name="step"
                        initialValue={props.stepVal}
                        rules={[{required: true}]}
                    >
                        <Input placeholder={'请输入快递单号'} disabled />
                    </Form.Item>
                </Form>
                <div className={styles.box}>
                    <p className={styles.title}>快递节点节点信息</p>
                </div>
            </Spin>
        </Fragment>
    );
};

export default connect(({loading})=>({
    loading: loading.effects['expressInformationTracking/getExpressDocumentDetail'],
    loading2: loading.effects['expressInformationTracking/saveExpressDocument']
}))(ModalPage);
