import { Card, Input, Form } from 'antd';
import { connect } from 'umi';
import React, { useState, useEffect, Fragment } from 'react';
import pseudo from '@/assets/pseudo.png';
import { XWInvestorAssets, XWPersonalExperience, XWOrganization } from '@/utils/publicData';

const { TextArea } = Input;

import styles from '../style.less';

const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 10
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

// customerType // 1个人 2 机构 3产品

const Step4 = (props) => {

    const [data, setData] = useState([]);

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
                    setData(res.data.newMaterialAttachments || []);
                }
            }
        });
    };

    useEffect(getCurrentFlowInfo, []);


    return (
        <Card bordered={false}>
            <Form hideRequiredMark name="materialScience">
                {Array.isArray(data) &&
                    data.map((item, index) => (
                        <FormItem
                            key={index}
                            {...formItemLayout}
                            colon={false}
                            label={<p style={{whiteSpace: 'normal', wordBreak: 'break-all', marginBottom: 0}}>{item.title}</p>}
                        >
                            {(item.fileList && Array.isArray(item.fileList) && item.fileList.map((item, i) => (
                                <a
                                    key={i}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    href={`${item.documentUrl}`}
                                >
                                    <img src={pseudo} className={styles.ImgStyle} alt="" />
                                </a>
                            ))) ||
                            '暂无'}
                        </FormItem>)
                    )
                }
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_ONLINE }) => ({
    IDENTIFYFLOW_ONLINE
}))(Step4);


Step4.defaultProps = {
    flowData: {},
    params: {}
};
