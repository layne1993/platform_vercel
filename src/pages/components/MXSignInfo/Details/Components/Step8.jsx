import { Card, Result, Spin, Descriptions, Form, Input } from 'antd';
import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import styles from '../style.less';
import fixedImg from '@/assets/pseudo.png';
import { isEmpty } from 'lodash';
import { getRandomKey } from '@/utils/utils';

const FormItem = Form.Item;

const Step8 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    const [paymentInfo, setPaymentInfo] = useState({});

    // console.log('infomation', infomation);
    // console.log('paymentInfo', paymentInfo);
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2080 },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setInfomation(res.data.tradeFlow);
                    setPaymentInfo(res.data);
                }
            }
        });
    }, [1]);
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

    return (
        <Card bordered={false}>
            {
                paymentInfo.calmCalcType === 0 &&
                <Form
                    hideRequiredMark
                    scrollToFirstError
                    name="detail"
                >
                    <FormItem
                        {...formItemLayout}
                        label="打款时间"
                    >
                        <Input disabled value={paymentInfo.remitTime && moment(paymentInfo.remitTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="打款凭证"
                        extra={paymentInfo.paymentProves ? '* 产品认购款的打款凭证上传' : ''}
                    >

                        {
                            !isEmpty(paymentInfo.paymentProves) ?
                                paymentInfo.paymentProves.map((item) => {
                                    return (
                                        <a target="_blank" rel="noopener noreferrer" href={item.fileUrl} key={getRandomKey(5)}>
                                            {
                                                item.fileUrl && <img src={fixedImg} className={styles.ImgStyle} alt="" />
                                            }
                                        </a>
                                    );
                                })
                                : '暂无'
                        }
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="银行卡"
                        extra={paymentInfo.paymentCards ? '* 用于汇出产品认购款的本人中国大陆境内银行卡' : ''}
                    >
                        <Input disabled value={paymentInfo.paymentCards || '--'} />
                    </FormItem>
                </Form>
            }
            {
                paymentInfo.calmCalcType === 1 && paymentInfo.tradeStatus === 0 &&
                <Result
                    className={styles.step8Content}
                    icon={<Spin size="large" />}
                    title="等待确权"
                    subTitle={
                        <Descriptions column={1}>
                            <Descriptions.Item label="投资者名称">{infomation && infomation.customerName || '--'}</Descriptions.Item>
                            <Descriptions.Item label="开户行">{infomation && infomation.bankName || '--'}</Descriptions.Item>
                            <Descriptions.Item label="银行卡号">{infomation && infomation.bankNumber || '--'}</Descriptions.Item>
                            <Descriptions.Item label="确权金额">{infomation && infomation.tradeMoney || '--'}</Descriptions.Item>
                            <Descriptions.Item label="完成时间">{infomation && infomation.tradeTime && moment(infomation.tradeTime).format('YYYY/MM/DD HH:mm:ss') || '--'}</Descriptions.Item>
                        </Descriptions>
                    }
                />
            }
            {
                paymentInfo.calmCalcType === 1 && paymentInfo.tradeStatus === 1 &&
                <Result
                    className={styles.step8Content}
                    status="success"
                    title="托管已确权"
                    subTitle={
                        <Descriptions column={1}>
                            <Descriptions.Item label="投资者名称">{infomation && infomation.customerName || '--'}</Descriptions.Item>
                            <Descriptions.Item label="开户行">{infomation && infomation.bankName || '--'}</Descriptions.Item>
                            <Descriptions.Item label="银行卡号">{infomation && infomation.bankNumber || '--'}</Descriptions.Item>
                            <Descriptions.Item label="确权金额">{infomation && infomation.tradeMoney || '--'}</Descriptions.Item>
                            <Descriptions.Item label="完成时间">{infomation && infomation.tradeTime && moment(infomation.tradeTime).format('YYYY/MM/DD HH:mm:ss') || '--'}</Descriptions.Item>
                        </Descriptions>
                    }
                />
            }
        </Card>
    );
};

export default connect(({ signprocess }) => ({
    signprocess,
    infomation: signprocess.infomation
}))(Step8);
