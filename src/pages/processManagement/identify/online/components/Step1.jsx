import { Card, Input, Form, Select } from 'antd';
import { connect } from 'umi';
import React, { useEffect, useState } from 'react';
import { XWInvestorsType } from '@/utils/publicData';
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
const Step1 = (props) => {
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
                <FormItem {...formItemLayout} label="基本信息表确认">
                    <Input
                        value={(data.baseInfoConfirmTime && moment(data.baseInfoConfirmTime).format('YYYY-MM-DD HH:mm:ss')) ||'--'}
                        disabled
                    />
                </FormItem>

                <FormItem {...formItemLayout} label="投资者类型">
                    <Select value={data.investorType} disabled  allowClear>
                        {XWInvestorsType.map((itemO) => (
                            <Option key={getRandomKey(4)} value={itemO.value}>
                                {itemO.label}
                            </Option>
                        ))}
                    </Select>
                </FormItem>

                <FormItem {...formItemLayout} label="基本信息表文档" name="identifiedProgress">
                    <a
                        href={`${data.baseInfoMarkUrl && data.baseInfoMarkUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {data.baseInfoMarkUrl ? <img src={pseudo} alt="" /> : '暂无'}
                    </a>
                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step1);

Step1.defaultProps = {
    flowData: {},
    params: {}
};
