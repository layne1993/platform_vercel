import { Button, Card, Input, Form, Radio, notification, Checkbox, Select } from 'antd';
import { connect, FormattedMessage } from 'umi';
import React, { useState, useEffect } from 'react';
import { formatSeconds } from '@/utils/utils';
import fixedImg from '@/assets/pseudo.png';
import styles from '../style.less';
import moment from 'moment';

const FormItem = Form.Item;
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const { TextArea } = Input;

const radioStyle = {
    display: 'block',
    height: '30px',
    lineHeight: '30px'
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

const examine = [
    { code: 1, text: '满足，结束' },
    { code: 2, text: '材料有误，流程打回' },
    { code: 3, text: '不满足，结束' }
];


const Step7 = (props) => {
    const { submitting, dispatch } = props;

    const [data, setData] = useState({});
    const [form] = Form.useForm();
    const [feedback, setfeedback] = useState(false);
    const [managerList, setManagerList] = useState([]);
    // eslint-disable-next-line no-undef
    const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['20100'] || {};

    /**
     * @description 填充表单数据
     * @param {*} data
     */
    const initFormData = (data) => {
        form.setFieldsValue({
            checkStatus: data.checkStatus || 1,
            materials: data.materials,
            saleIdList: data.saleIdList || []
        });
    };

    /**
    * @description 获取客户经理
    */
    const getManagerList = () => {
        dispatch({
            type: 'global/selectAllAccountManager',
            callback: ({ code, data = [], message }) => {
                if (code === 1008) {
                    setManagerList(data);
                }
            }
        });
    };

    /**
     * 获取当前节点数据
     */
    const getCurrentFlowInfo = () => {
        const { dispatch, params, codeValue } = props;
        dispatch({
            type: 'IDENTIFYFLOW_ONLINE/getDetail',
            payload: { identifyFlowId: params.identifyFlowId, codeValue: codeValue },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    let data = res.data || {};
                    setData(data);
                    initFormData(data);
                    setfeedback(data.checkStatus === 2);
                }
            }
        });
    };

    useEffect(() => { getCurrentFlowInfo(); getManagerList(); }, []);

    const onFinish = (values) => {
        const { dispatch } = props;
        dispatch({
            type: 'IDENTIFYFLOW_ONLINE/saveAudit',
            payload: { ...values, identifyFlowId: data.identifyFlowId },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    data.checkStatus = values.checkStatus;
                    if (props.getFlowInfo) {
                        props.getFlowInfo(data.identifyFlowId);
                    }
                    if (props.getFlowNodeDate) {
                        props.getFlowNodeDate(data.identifyFlowId);
                    }
                    if(props.getAllInfo){
                        props.getAllInfo()
                    }
                    // if(values.checkStatus===1){
                    //     props.getAllInfo()
                    // }   
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const onFinishFailed = () => {
        const warningText = '请输入材料反馈意见';
        openNotification('warning', '提醒', warningText, 'topRight');
    };

    const changeFeedback = (e) => {
        if (e.target.value === 2) {
            setfeedback(true);
        } else {
            setfeedback(false);
        }
    };

    return (
        <Card bordered={false}>
            <Form
                // hideRequiredMark
                name="materialScience"
                onFinish={onFinish}
                form={form}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    checkStatus: data.checkStatus || 1,
                    materials: data.checkStatus ? data.materials : undefined
                }}
            >
                {data.signAttachments && data.signAttachments.map((item, index) => (
                    <div key={index}>
                        {/* <h3>{item.documentName}</h3> */}
                        {/* <FormItem {...formItemLayout} label="用印时间">
                            <Input
                                disabled
                                value={(item.sealTime && moment(item.sealTime).format('YYYY-MM-DD HH:mm:ss')) ||'--'}
                            />
                        </FormItem> */}
                        <FormItem {...formItemLayout} label={`${index + 1}、${item.documentName}`}>
                            <a
                                target="_blank"
                                rel="noopener noreferrer"
                                href={`${item.documentUrl}`}
                            >
                                {item.documentUrl ? (
                                    <img src={fixedImg} className={styles.ImgStyle} alt="" />
                                ) : (
                                    '暂无'
                                )}
                            </a>
                        </FormItem>
                    </div>
                ))}
                <FormItem {...formItemLayout} label="投资者进入时间">
                    <Input
                        disabled
                        value={
                            data.createTime && moment(data.createTime).format('YYYY/MM/DD HH:mm:ss')
                        }
                    />
                </FormItem>

                {/* <FormItem {...formItemLayout} label="等待时间">
                    <Input disabled value={waitTime || '-'} />
                </FormItem> */}
                <FormItem {...formItemLayout} label="审核结果" name="checkStatus">
                    <Radio.Group onChange={changeFeedback} disabled={data.flowStatus === 2 || data.checkStatus === 2}>
                        {examine.map((item) => (
                            <Radio key={item.code} style={radioStyle} value={item.code}>
                                {item.text}
                            </Radio>
                        ))}
                    </Radio.Group>
                </FormItem>


                {
                    feedback &&
                        <FormItem
                            {...formItemLayout}
                            label="审核不通过的步骤"
                            name="signFlowFallbackNodes"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择'
                                }
                            ]}
                        >
                            <Checkbox.Group disabled={data.flowStatus === 2 || data.checkStatus === 2}>
                                {Array.isArray(data.fallbackNodeList) && data.fallbackNodeList.map((item) => (
                                    <Checkbox key={item.value} value={item.codeValue}>{item.codeText}</Checkbox>
                                ))}
                            </Checkbox.Group>
                        </FormItem>
                }

                {feedback ? (
                    <FormItem
                        {...formItemLayout}
                        label="审核反馈"
                        name="materials"
                        extra="请输入审核反馈意见"
                        rules={[
                            {
                                required: true,
                                message: '请输入审核反馈意见'
                            }
                        ]}
                    >
                        <TextArea disabled={data.flowStatus === 2 || data.checkStatus === 2} />
                    </FormItem>
                ) : null}
                <Form.Item
                    label="客户经理"
                    name="saleIdList"
                    rules={[{ required: false, message: '请选择' }]}
                    {...formItemLayout}
                >
                    <Select
                        placeholder="请选择"
                        mode="multiple"
                        allowClear
                        disabled={data.flowStatus === 2 || data.checkStatus === 2}
                        showSearch
                        filterOption={(input, option) =>
                            option.children && option.children
                                .toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        }
                    >
                        {Array.isArray(managerList) && managerList.map((item) => (
                            <Select.Option key={item.managerUserId} value={item.managerUserId + ''}>{item.userName}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <FormItem
                    label="客户经理自动分配时间"
                    {...formItemLayout}
                >
                    {data?.managerDistribute && moment(data.managerDistribute).format('YYYY/MM/DD HH:mm')}
                </FormItem>
                <FormItem
                    label="投资者预约时间"
                    {...formItemLayout}
                >
                    {data?.createTime && moment(data.createTime).format('YYYY/MM/DD HH:mm')}
                </FormItem>
                <FormItem
                    {...submitFormLayout}
                    style={{
                        marginTop: 32
                    }}
                >
                    {
                        authEdit &&
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={submitting}
                            disabled={data.flowStatus === 2 || data.checkStatus === 2}
                        >
                            <FormattedMessage id="formandbasic-form.form.save" />
                        </Button>
                    }
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE, loading }) => ({
    IDENTIFYFLOW_ONLINE,
    submitting: loading.effects['IDENTIFYFLOW_ONLINE/saveAudit']
}))(Step7);


Step7.defaultProps = {
    flowData: {},
    params: {}
};
