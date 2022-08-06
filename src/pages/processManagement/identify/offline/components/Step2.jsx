import { Button, Card, Input, Form, Radio, notification, Select, DatePicker } from 'antd';
import { connect, FormattedMessage } from 'umi';
import React, { useState, useEffect } from 'react';
import { XWInvestorsType } from '@/utils/publicData';
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

// 审核选项
const examine = [
    { code: 1, text: '满足，结束' },
    // { code: 2, text: '审核有误，流程打回' },
    { code: 3, text: '不满足，结束' }
];

const Step2 = (props) => {
    const { submitting, params, dispatch } = props;

    const [form] = Form.useForm();
    const [feedback, setfeedback] = useState(false);
    const [data, setData] = useState({});
    const [managerList, setManagerList] = useState([]);


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
     * @description 当参数不为零时 获取认定流程数据
     */
    const getFlowInfo = () => {
        const {dispatch, codeValue} = props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/getDetail',
            payload: {identifyFlowId: params.identifyFlowId, codeValue},
            callback: ({code, data}) => {
                if(code === 1008) {
                    setData(data || {});
                    form.setFieldsValue({
                        checkStatus: data.checkStatus || 1,
                        materials: data.checkStatus ? data.materials : undefined,
                        saleIdList: data.saleIdList || [],
                        investorType: data.investorType,
                        identifyTime: moment.invalid(data.identifyTime) ? moment(data.identifyTime) : undefined
                    });
                    if (data.checkStatus === 3) {
                        setfeedback(true);
                    }
                }
            }
        });

    };

    useEffect(() => {
        getManagerList();
        if(params.identifyFlowId !== '0') {
            getFlowInfo();
        }
    }, []);

    /**
     * @description 审核
     * @param {} values
     */
    const onFinish = (values) => {
        const { dispatch } = props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/saveAudit',
            payload: {
                ...values,
                identifyFlowId: data.identifyFlowId,
                identifyTime: moment(values.identifyTime).valueOf()
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    data.checkStatus = values.checkStatus;
                    openNotification('success', '提交成功', res.message, 'topRight');
                    props.calllback(res.data.identifyFlowId);
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
        if (e.target.value === 3) {
            setfeedback(true);
        } else {
            setfeedback(false);
        }
    };
    return (
        <Card bordered={false}>
            <Form
                // hideRequiredMark
                form={form}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <FormItem {...formItemLayout} label="审核结果" name="checkStatus">
                    <Radio.Group onChange={changeFeedback} disabled={data.flowStatus === 2}>
                        {examine.map((item) => (
                            <Radio key={item.code} style={radioStyle} value={item.code}>
                                {item.text}
                            </Radio>
                        ))}
                    </Radio.Group>
                </FormItem>

                {feedback ? (
                    <FormItem
                        {...formItemLayout}
                        label="材料反馈"
                        name="materials"
                        extra="请输入材料反馈意见"
                        rules={[
                            {
                                required: true,
                                message: '请输入材料反馈意见'
                            }
                        ]}
                    >
                        <TextArea disabled={data.flowStatus === 2} />
                    </FormItem>
                ) : null}
                <FormItem
                    {...formItemLayout}
                    label="合格投资者类型确认"
                    name="investorType"
                    rules={[{required: false, message: '请选择！'}]}
                >
                    <Select placeholder="请选择" allowClear disabled={data.flowStatus === 2}>
                        {XWInvestorsType.map((item) => {
                            return <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>;
                        })}
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="合格投资者认定时间"
                    name="identifyTime"
                    rules={[{required: false, message: '请选择！'}]}
                >
                    <DatePicker disabled={data.flowStatus === 2}/>
                </FormItem>
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
                        disabled={data.flowStatus === 2}
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
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={submitting}
                        disabled={data.flowStatus === 2}
                    >
                        <FormattedMessage id="formandbasic-form.form.save" />
                    </Button>
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_OFFLINE, loading }) => ({
    IDENTIFYFLOW_OFFLINE,
    data: IDENTIFYFLOW_OFFLINE.flowData,
    submitting: loading.effects['IDENTIFYFLOW_OFFLINE/saveAudit']
}))(Step2);


Step2.defaultProps = {
    data: {}
};
