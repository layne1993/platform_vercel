import { Card, Input, Form, Select } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { STATEMENT_STATUS } from '@/utils/publicData';
import moment from 'moment';
import { getRandomKey } from '@/utils/utils';
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
const Step3 = (props) => {

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
                <FormItem {...formItemLayout} label="税收证明文件确认">
                    <Input
                        value={(data.taxBookConfirmTime && moment(data.taxBookConfirmTime).format('YYYY-MM-DD HH:mm:ss')) ||'--'}
                        disabled
                    />
                </FormItem>

                <FormItem {...formItemLayout} label="税收类型">
                    <Select value={data.statementStatus} disabled  allowClear>
                        {STATEMENT_STATUS.map((itemO) => (
                            <Option key={getRandomKey(4)} value={itemO.value}>
                                {itemO.label}
                            </Option>
                        ))}
                    </Select>
                </FormItem>

                <FormItem {...formItemLayout} label="税收证明文件操作留痕" name="identifiedProgress">
                    <a
                        href={`${data.taxBookMarkUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {data.taxBookMarkUrl ? <img src={pseudo} alt="" /> : '暂无'}
                    </a>
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step3);


Step3.defaultProps = {
    flowData: {},
    params: {}
};
