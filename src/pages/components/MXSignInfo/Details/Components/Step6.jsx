import { Card, Input, Form, Select, Divider } from 'antd';
import { connect, Link } from 'umi';
import React, { Fragment, useEffect, useState } from 'react';
import moment from 'moment';
import { XWAgreementType } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';
import fixedImg from '@/assets/pseudo.png';
import styles from '../style.less';

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

const Step6 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'signprocess/getBaseInfo',
            payload: { ...params, codeValue: 2060 },
            callback: (res) => {
                if (res.code === 1008) {
                    setInfomation(res.data);
                }
            }
        });

    }, [1]);
    // console.log(sealedDocuments)
    return (
        <Card bordered={false}>
            <Form
                hideRequiredMark
                name="materialScience"
                className={styles.stepFrom}
            >
                {
                    infomation.sealedDocuments && infomation.sealedDocuments.map((item) => <Fragment key={getRandomKey(6)}>
                        {
                            item.documentType ? (
                                <div>
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
                                        label="用印时间"
                                    >
                                        <Input value={item.sealTime && moment(item.sealTime).format('YYYY/MM/DD HH:mm:ss')} disabled />
                                    </FormItem>


                                    <FormItem
                                        {...formItemLayout}
                                        label="用印后文件"
                                    >

                                        <a target="_blank" href={item.sealedUrl} rel="noopener noreferrer">
                                            <img src={fixedImg} className={styles.ImgStyle} alt="" />
                                        </a>

                                    </FormItem>

                                </div>

                            ) : (<div>
                                <h3><b>{item.documentName || '--'}</b></h3>
                                <FormItem
                                    {...formItemLayout}
                                    label="用印时间"
                                >
                                    <Input disabled value={item.sealTime && moment(item.sealTime).format('YYYY/MM/DD HH:mm:ss') || '--'} />
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="用印后的文件"
                                >
                                    <a target="_blank" rel="noopener noreferrer" href={item.sealedUrl}>
                                        {
                                            item.sealedUrl ? <img src={fixedImg} className={styles.ImgStyle} alt="" /> : '暂无'
                                        }

                                    </a>
                                </FormItem>
                            </div>)
                        }
                    </Fragment>
                    )}
            </Form>
        </Card>
    );
};

export default connect(({ signprocess, loading }) => ({
    signprocess,
    processDetail: signprocess.processDetail,
    submitting: loading.effects['accountNotice/submitRegularForm']
}))(Step6);
