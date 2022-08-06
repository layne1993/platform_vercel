import { Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
import styles from '../style.less';

const FormItem = Form.Item;


const Step10 = (props) => {
    // pseudo.png
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2100 },
            callback: (res) => {
                if (res.code === 1008) {
                    setInfomation(res.data);
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
            <Form
                hideRequiredMark
                scrollToFirstError
                name="detail"
            >
                <FormItem
                    {...formItemLayout}
                    label="回访问卷用印时间"
                >
                    <Input disabled value={infomation.visitConfirmTime && moment(infomation.visitConfirmTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="回访问卷用印文件"
                >
                    <a target="_blank" rel="noopener noreferrer" href={infomation.visitTextUrl}>
                        {
                            infomation.visitTextUrl ? <img src={fixedImg} className={styles.ImgStyle} alt="" /> : '暂无'
                        }

                    </a>
                </FormItem>


            </Form>
        </Card>
    );
};

export default connect(({ signprocess }) => ({
    signprocess,
    infomation: signprocess.infomation
}))(Step10);
