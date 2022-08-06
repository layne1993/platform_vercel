import { Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
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

const Step2 = (props) => {


    const [data, setData] = useState({});

    /**
     * 获取当前节点数据
     */
    const getCurrentFlowInfo = () => {
        const {dispatch, params, codeValue} = props;
        dispatch({
            type: 'IDENTIFYFLOW_ONLINE/getDetail',
            payload: {identifyFlowId: params.identifyFlowId, codeValue: codeValue},
            callback: (res) => {
                if(res.code === 1008 && res.data) {
                    setData(res.data || {});
                }
            }
        });
    };

    useEffect(getCurrentFlowInfo, []);

    return (
        <Card bordered={false}>
            <Form hideRequiredMark scrollToFirstError name="detail">
                <FormItem {...formItemLayout} label="专业投资者告知书确认">
                    <Input
                        disabled
                        value={
                            (
                                data.notifyBookConfirmTime &&
                                moment(data.notifyBookConfirmTime).format('YYYY-MM-DD HH:mm:ss')) ||
                            '--'
                        }
                    />
                </FormItem>

                <FormItem {...formItemLayout} label="专业投资者告知书操作留痕">
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`${data.notifyBookMarkUrl
                        }`}
                    >
                        {data.notifyBookMarkUrl ? (
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

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step2);

Step2.defaultProps = {
    flowData: {},
    params: {}
};
