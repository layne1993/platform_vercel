import { Card, Input, Form, Divider, Button, notification, Checkbox } from 'antd';
import { connect, history } from 'umi';
import React, { Fragment, useState, useEffect } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
import styles from '../style.less';
import { getParams } from '@/utils/utils';

const { TextArea } = Input;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 7
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        },
        md: {
            span: 10
        }
    }
};

const submitFormLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 10,
            offset: 7
        }
    }
};


const Step7 = (props) => {
    const { params, dispatch, submitting, showFlag } = props;
    const { isDelete } = getParams();
    const [form] = Form.useForm();

    const [infomation, setInfomation] = useState({});
    const [feedback, setFaceBack] = useState('');
    const [savetype, setSavetype] = useState('');
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2070 },
            callback: (res) => {
                if (res.code === 1008) {
                    setInfomation(res.data);
                    res.data && form.setFieldsValue({
                        ...res.data
                    });
                }
            }
        });

    }, [1]);

    const examine = (type) => {
        const values = form.getFieldsValue();
        dispatch({
            type: 'signprocess/saveAudit',
            payload: { signFlowId: infomation.signFlowId, feedback, checkType: type, codeValueList: values.codeValueList },
            callback: (res) => {
                // 记录从产品信息或者从客户信息管理过来的地址
                const { type } = getParams();
                if (type) {
                    if (type === 'customerType') {
                        window.sessionStorage.setItem('customer', 'tab4');
                    } else {
                        window.sessionStorage.setItem('product', 'tab6');
                    }
                }
                if (res && res.code === 1008) {
                    openNotification('success', '提交成功', res.message, 'topRight');
                    history.go(-1);
                    // current()
                } else {
                    const warningText = res.message || res.data || '审核失败，请稍后再试！';
                    // history.go(-1);
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const onOKPre = (type) => {
        setSavetype(type);
        if (showFlag && type === 1 && !form.getFieldValue('special')) {
            openNotification('info', '提示', '请勾选特别风险确认');
            return null;
        }
        if (type === 2) {
            form.validateFields().then(() => { examine(type); });
        } else {
            examine(type);
        }

    };

    const changfaceBack = (e) => {
        setFaceBack(e.target.value);
    };
    return (
        <Card bordered={false}>
            <Form
                hideRequiredMark
                name=" materialScience"
                className={styles.stepFrom}
                form={form}
            >
                {
                    infomation.sealedDocuments && infomation.sealedDocuments.map((item, index) => <Fragment key={index}>
                        <h3><b>{item.documentName}</b></h3>
                        <FormItem
                            {...formItemLayout}
                            label="用印时间"
                        >
                            <Input disabled value={item.sealTime && moment(item.sealTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="用印后的文件"
                        >
                            <a target="_blank" rel="noopener noreferrer" href={item.sealedUrl}>
                                {
                                    item.sealedUrl ? <img src={fixedImg} className={styles.ImgStyle} alt="" /> : '暂无'
                                }

                            </a>
                        </FormItem>
                    </Fragment>)
                }

                <h3><b>双录</b></h3>
                <Divider />

                <FormItem
                    {...formItemLayout}
                    label="投资者进入时间"
                >
                    <Input disabled value={infomation.investorEntryTime && moment(infomation.investorEntryTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                </FormItem>

                <FormItem {...formItemLayout} label="双录视频信息">
                    {infomation.doubleRecordingUrl || infomation.videoUrl ? (
                        <video
                            src={infomation.doubleRecordingUrl || infomation.videoUrl}
                            controls="controls"
                            className={styles.ImgStyle}
                        />
                    ) : (
                        '暂无双录视频信息'
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="反馈"
                    name="feedback"
                >
                    <TextArea disabled={infomation.checkType === 1} placeholder="请输入反馈意见" onChange={changfaceBack} />
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="审核不通过的步骤"
                    name="codeValueList"
                    rules={[
                        {
                            required: true,
                            message: '请选择'
                        }
                    ]}
                >
                    <Checkbox.Group>
                        {Array.isArray(infomation.fallbackNodeList) && infomation.fallbackNodeList.map((item) => (
                            <Checkbox key={item.codeValue} value={item.codeValue}>{item.codeText}</Checkbox>
                        ))}
                    </Checkbox.Group>
                </FormItem>
                {
                    showFlag && <FormItem
                        {...formItemLayout}
                        label="特别风险确认"
                        name="special"
                        // rules={[
                        //     {
                        //         required: true,
                        //         message: '请选择'
                        //     }
                        // ]}
                        valuePropName="checked"
                        extra={
                            <div>
                                出现本提醒，说明基金产品未配置好基金合同和风险揭示书模板，如非管理人特地配置，可：
                                <div>1、进入产品详情，协议模板配置菜单，上传或配置合同或风险揭示书；</div>
                                <div>2、此流程，返回到列表页，点击【废除】，通知投资者重新签署；</div>
                            </div>
                        }
                                >
                        <Checkbox>管理人确认，本次签署无需签署基金合同或者风险揭示书！！！</Checkbox>
                    </FormItem>
                }

                {/*
                    特别提示：产品等级高于客户风险承受等级
                */}
                <FormItem {...submitFormLayout}>
                    {
                        Number(localStorage.getItem('customerRiskMatching')) === 0 ? <p style={{ color: 'red' }}>特别提示：产品等级高于客户风险承受等级</p> : null
                    }
                </FormItem>
                {
                    (Number(isDelete) !== 1 && props.authEdit) &&
                    <FormItem {...submitFormLayout}>
                        <Button type="primary" loading={savetype === 1 && submitting} disabled={!!infomation.checkType} onClick={() => { onOKPre(1); }}>审核通过</Button>
                        <Button type="primary" loading={savetype === 2 && submitting} disabled={!!infomation.checkType} style={{ marginLeft: 10 }} onClick={() => { onOKPre(2); }}>审核不通过</Button>
                    </FormItem>
                }


            </Form>
        </Card>
    );
};

export default connect(({ signprocess, loading }) => ({
    signprocess,
    infomation: signprocess.infomation,
    submitting: loading.effects['signprocess/saveAudit']
}))(Step7);
