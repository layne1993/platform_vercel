import { Card, Input, Form } from 'antd';
import { connect, Link } from 'umi';
import React, { useEffect, useState } from 'react';
import { getRandomKey } from '@/utils/utils';
import fixedImg from '@/assets/pseudo.png';
import moment from 'moment';

const ImgStyle = {
    width: '240px',
    height: '150px',
    border: '1px dashed #ccc',
    marginRight: '20px'
};

const FormItem = Form.Item;

const Step5 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2050 },
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
                    label="投资者进入时间"
                >
                    <Input disabled value={infomation.investorEntryTime && moment(infomation.investorEntryTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="双录视频信息"
                >

                    {infomation ? (
                        <video
                            src={infomation.doubleRecordingUrl || infomation.videoUrl}
                            controls="controls"
                            style={ImgStyle}
                        />
                    ) :
                        (
                            '暂无双录视频信息'
                        )}
                </FormItem>


            </Form>

        </Card>
    );
};

export default connect(({ signprocess, loading }) => ({
    signprocess,
    infomation: signprocess.infomation,
    submitting: loading.effects['accountNotice/submitRegularForm']
}))(Step5);
