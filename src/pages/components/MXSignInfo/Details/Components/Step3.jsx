import { Card, Input, Form, Select, Divider } from 'antd';
import { connect, Link } from 'umi';
import React, { Fragment, useState, useEffect } from 'react';
import { XWAgreementType } from '@/utils/publicData';
import fixedImg from '@/assets/pseudo.png';
import { getRandomKey } from '@/utils/utils';
import styles from '../style.less';

const FormItem = Form.Item;
const { Option } = Select;


const Step3 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2030 },
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
                name=" materialScience"
                className={styles.stepFrom}
            >
                {
                    infomation.markedDocuments && infomation.markedDocuments.map((item) => <Fragment key={getRandomKey(6)}>
                        <h3><b>{item.documentName || '--'}</b></h3>
                        <Divider />
                        <FormItem
                            {...formItemLayout}
                            label="协议模板编号"
                            extra={item.documentId && <Link to={`/raisingInfo/template/templateList/detail/${item.documentId}`}>点击查看模板详情</Link> || null}
                        >
                            <Input value={item.documentCode} disabled />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="协议模板类型"
                        >
                            <Select value={item.documentType} disabled>
                                {
                                    XWAgreementType.map((itemT) => <Option key={getRandomKey(6)} value={itemT.value}>{itemT.label}</Option>)
                                }
                            </Select>

                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="阅读区域操作留痕"
                        >

                            <a target="_blank" href={item.markedUrl} rel="noopener noreferrer">
                                {
                                    item.markedUrl ? <img src={fixedImg} className={styles.ImgStyle} alt="" /> : '暂无'
                                }

                            </a>

                        </FormItem>
                    </Fragment>)
                }
            </Form>
        </Card>
    );
};

export default connect(({ signprocess, loading }) => ({
    signprocess,
    processDetail: signprocess.processDetail,
    submitting: loading.effects['accountNotice/submitRegularForm']
}))(Step3);
