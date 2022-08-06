import { Card, Input, Form, Result, Spin, Descriptions } from 'antd';
import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
import { getCookie } from '@/utils/utils';
import styles from '../style.less';


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



const Step9 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2090 },
            callback: (res) => {
                if (res.code === 1008) {
                    setInfomation(res.data);
                }
            }
        });

    }, [1]);
    return (
        <Card bordered={false}>
            <Form
                hideRequiredMark
                name="materialScience"
                className={styles.stepFrom}
            >

                <FormItem
                    {...formItemLayout}
                    label="打款时间"
                >
                    <Input disabled value={infomation.remitTime && moment(infomation.remitTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                </FormItem>

                {/* <FormItem
          {...formItemLayout}
          label="资产情况"
          href="用于汇出产品认购款的本人中国大陆境内银行卡"
        >
          {
            infomation.paymentCards && infomation.paymentCards.map((item, i) => <a key={i} target="_blank" rel="noopener noreferrer" href={`${getCookie('LinkUrl')}${item.fileUrl}`}>
              <img src={fixedImg} className={styles.ImgStyle} alt="" />
            </a>) || '暂无资产情况'
          }

        </FormItem> */}

                {/* <FormItem
                    {...formItemLayout}
                    label="投资经历"
                    href="产品认购款的打款凭证上传"
                >
                    {
                        infomation.paymentProves && infomation.paymentProves.map((item, j) => <a key={j} target="_blank" rel="noopener noreferrer" href={`${getCookie('LinkUrl')}${item.fileUrl}`}>
                            <img src={fixedImg} className={styles.ImgStyle} alt="" />
                        </a>) || '暂无投资经历'
                    }

                </FormItem> */}
                {
                    infomation.waitTime !== '--' && (infomation.waitTime === '0' ?
                        <Result
                            className={styles.step9Content}
                            status="success"
                            title="冷静期结束"
                            subTitle={
                                <Descriptions column={1}>
                                    <Descriptions.Item label="冷静期开始时间">{infomation.calmStartTime && moment(infomation.calmStartTime).format('YYYY/MM/DD HH:mm:ss') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="冷静期">{infomation.calmHour}小时</Descriptions.Item>
                                    <Descriptions.Item label="剩余时间">{infomation.waitTime}小时</Descriptions.Item>
                                </Descriptions>
                            }
                        />
                        :
                        <Result
                            className={styles.step9Content}
                            icon={<Spin size="large" />}
                            title="冷静期"
                            subTitle={
                                <Descriptions column={1}>
                                    <Descriptions.Item label="冷静期开始时间">{infomation.calmStartTime && moment(infomation.calmStartTime).format('YYYY/MM/DD HH:mm:ss') || '-'}</Descriptions.Item>
                                    <Descriptions.Item label="冷静期">{infomation.calmHour}小时</Descriptions.Item>
                                    <Descriptions.Item label="剩余时间">{infomation.waitTime}小时</Descriptions.Item>
                                </Descriptions>
                            }
                        />) || null
                }

            </Form>
        </Card>
    );
};

export default connect(({ signprocess, loading }) => ({
    signprocess,
    infomation: signprocess.infomation,
    submitting: loading.effects['accountNotice/submitRegularForm']
}))(Step9);
