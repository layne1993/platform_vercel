import { Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
import styles from '../style.less';
import { isEmpty } from 'lodash';

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

const Step1 = (props) => {
    // pseudo.png
    const { params, dispatch, operationInfo } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        let ignore = false;
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2010 },
            callback: (res) => {
                if (res.code === 1008 && !ignore) {
                    setInfomation(res.data);
                }
            }
        });
        return () => {
            ignore = true;
        };
    }, [1]);

    return (
        <Card bordered={false}>
            <Form hideRequiredMark scrollToFirstError name="detail">
                <FormItem {...formItemLayout} label={`${!isEmpty(operationInfo) ? operationInfo[0].codeText : ''}确认`}>
                    <Input
                        disabled
                        value={
                            (infomation.riskNotificationConfirmTime &&
                                moment(infomation.riskNotificationConfirmTime).format('YYYY/MM/DD HH:mm:ss')) ||
                            '--'
                        }
                    />
                </FormItem>

                <FormItem {...formItemLayout} label={`${!isEmpty(operationInfo) ? operationInfo[0].codeText : ''}操作留痕`}>
                    <a target="_blank" rel="noopener noreferrer" href={infomation.riskNotificationMarkUrl}>
                        {infomation.riskNotificationMarkUrl ? (
                            <img src={fixedImg} className={styles.ImgStyle} alt="" />
                        ) : (
                            '暂无'
                        )}
                    </a>
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ signprocess }) => ({
    signprocess,
    operationInfo: signprocess.operationInfo
}))(Step1);
