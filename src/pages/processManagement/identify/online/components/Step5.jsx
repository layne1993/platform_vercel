import { Card, Input, Form, Select } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { XWnumriskLevel } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';
import moment from 'moment';
import pseudo from '@/assets/pseudo.png';

const FormItem = Form.Item;
const { Option } = Select;

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
const Step5 = (props) => {

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
                <FormItem {...formItemLayout} label="合格投资者承诺书确认">
                    <Input
                        value={
                            (data.promiseBookConfirmTime &&
                                moment(data.promiseBookConfirmTime).format('YYYY-MM-DD HH:mm:ss')) ||
                            '--'
                        }
                        disabled
                    />
                </FormItem>

                <FormItem {...formItemLayout} label="合格投资者承诺书操作留痕" name="identifiedProgress">
                    <a
                        href={`${data.promiseBookMarkUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {data.promiseBookMarkUrl ? <img src={pseudo} alt="" /> : '暂无'}
                    </a>
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step5);


Step5.defaultProps = {
    flowData: {},
    params: {}
};
