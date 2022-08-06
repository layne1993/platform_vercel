import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Spin } from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import type { Dispatch } from 'umi';

interface ExaminePageInter {
    dispatch: Dispatch;
    doubleRecordAloneId: number;
    loading: boolean;
    loading2: boolean;
    quertTableData(): void;
    changeShowModal2(val: boolean): void;
}

const { TextArea } = Input;
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

const openNotificationWithIcon = (type, message) => {
    notification[type]({
        message
    });
};

const ExaminePage: React.FC<ExaminePageInter> = (props) => {
    const { dispatch, doubleRecordAloneId, quertTableData } = props;
    const [form] = Form.useForm();
    const [data, setData] = useState<any>({});
    const checkType = (checkType) => {
        const feedback = form.getFieldValue('feedback');
        dispatch({
            type: 'doubleRecordSolo/saveManageCheck',
            payload: { checkType, doubleRecordAloneId, feedback },
            callback(res: any) {
                if (res.code !== 1008) {
                    openNotificationWithIcon('error', res.message || '接口出错');
                    return;
                }
                notification.success({
                    message: '操作成功'
                });
                props.changeShowModal2(false);
                quertTableData();
            }
        });
    };
    useEffect(() => {
        dispatch({
            type: 'doubleRecordSolo/getCheckTypeInfo',
            payload: { doubleRecordAloneId: props.doubleRecordAloneId },
            callback(res: any) {
                if (res.code !== 1008) {
                    openNotificationWithIcon('error', res.message || '接口错误');
                    return;
                }
                setData(res.data);
            }
        });
    }, []);
    return (
        <Spin spinning={Boolean(props.loading) || Boolean(props.loading2)}>
            <Form form={form}>
                <Form.Item label="投资者进入时间" {...formItemLayout}>
                    <Input
                        disabled
                        value={
                            (data.investorEntryTime &&
                                moment(data.investorEntryTime).format('YYYY/MM/DD HH:mm:ss')) ||
                            '--'
                        }
                    />
                </Form.Item>

                <Form.Item label="双录视频信息" {...formItemLayout}>
                    {data.fileUrl ? (
                        <video
                            src={data.fileUrl}
                            controls
                            style={{
                                width: 260,
                                height: 270,
                                border: '1px dashed #ccc',
                                marginRight: 20,
                                marginBottom: 15
                            }}
                        />
                    ) : (
                        '暂无双录视频信息'
                    )}
                </Form.Item>

                <Form.Item label="反馈" name="feedback" {...formItemLayout}>
                    <TextArea placeholder="请输入反馈意见" />
                </Form.Item>
                <Form.Item {...submitFormLayout}>
                    <Button
                        type="primary"
                        style={{ marginRight: 16 }}
                        onClick={(e) => checkType(1)}
                    >
                        审核通过
                    </Button>
                    <Button type="primary" onClick={(e) => checkType(2)}>
                        审核不通过
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['doubleRecordSolo/getCheckTypeInfo'],
    loading2: loading.effects['doubleRecordSolo/saveManageCheck']
}))(ExaminePage);
