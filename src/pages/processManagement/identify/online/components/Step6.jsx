import { Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import fixedImg from '@/assets/pseudo.png';
import {getRandomKey } from '@/utils/utils';
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


const Step6 = (props) => {

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
                {data.signAttachments && data.signAttachments.map((item) => (
                    <div key={getRandomKey(5)}>
                        <h3>{item.documentName}</h3>
                        <FormItem {...formItemLayout} label="用印时间">
                            <Input
                                disabled
                                value={(item.sealTime && moment(item.sealTime).format('YYYY-MM-DD HH:mm:ss')) ||'--'}
                            />
                        </FormItem>
                        <FormItem {...formItemLayout} label="用印后文件">
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
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step6);


Step6.defaultProps = {
    flowData: {},
    params: {}
};
