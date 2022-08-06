import React, {useState, useEffect} from 'react';
import {Card, Spin, Form, Input, Button, Row, Col, Radio} from 'antd';
import {PlusCircleOutlined, MinusCircleOutlined} from '@ant-design/icons';
import BraftEditor from 'braft-editor';
import styles from './styles.less';
import {connect} from 'dva';

const ReturnVisitTemplate = (props) => {
    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    const [isView, changeType] = useState(false);
    const [form] = Form.useForm();
    const setProblem = (type, index) => {
        let arr = form.getFieldValue('users');
        if(type=== 'add') {
            arr.splice(index+ 1, 0, '');
        } else {
            arr.splice(index, 1);
        }

        form.setFieldsValue({
            users: arr
        });
        // console.log(type, index, arr)
    };
    const onFinish = (values) => {
        // console.log(values);
    };


    // 设置是编辑态还是查看态
    useEffect(() => {
        const {params} = props?.match;
        const {location} = props;
        const {query} = location;
        if (params.type === 'view') {
            // 查看，不可编辑
            changeType(true);
        }
    }, []);


    // 查询版本号
    useEffect(() => {
        const {location, dispatch} = props;
        const {query} = location;
        if (query.askType) {
            dispatch({
                type: 'returnVisitList/queryVersionNumber',
                payload: {askType: query.askType},
                callback(versionNumber) {
                    // console.log(versionNumber)
                }
            });
        }
    }, []);

    useEffect(() => {
        form.setFieldsValue({
            users: ['2'],
            defaultType: 0
        });
    }, []);
    return (
        <Spin spinning={false}>
            <Form form={form} onFinish={onFinish} {...layout}>
                <Card className={styles.cardBox} title={<div className={styles.cardTitleBox}><p>基本信息</p></div>}>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="customerName"
                                label="版本号"
                                extra="版本号自动生成，每次自动加1"
                            >
                                <Input disabled/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={12}>
                            <Form.Item
                                name="defaultType"
                                label="默认问题选中"
                                rules={[{required: true}]}
                            >
                                <Radio.Group>
                                    <Radio value={0}>是</Radio>
                                    <Radio value={1}>否</Radio>
                                </Radio.Group>
                            </ Form.Item>
                        </Col>
                    </Row>
                </Card>
                <Card
                    className={styles.cardBox}
                    title={<div className={styles.cardTitleBox}><p>回访内容设置</p><span>点击查看支持通配符信息</span></div>}
                >
                    <div>
                        <div className={styles.item}>
                            <p>1、回访单说明</p>
                            <BraftEditor
                                controls={[]}
                                contentStyle={{
                                    height: 200
                                }}
                                onChange={(e) => {
                                }}
                                style={{
                                    marginLeft: 22,
                                    border: '1px solid #000'
                                }}
                            />
                        </div>
                        <div className={styles.item}>
                            <p>2、回访单内容设置</p>
                            <Form.List name="users">
                                {
                                    (fields, {add, remove}) => {
                                        return (
                                            <>
                                                {
                                                    fields.map((field) => {
                                                        // console.log(field)
                                                        return (
                                                            <div
                                                                style={{
                                                                    display: 'flex',
                                                                    alignItems: 'flex-end'
                                                                }}
                                                                key={field.key}
                                                                name={field.name}
                                                            >
                                                                <Form.Item
                                                                    style={{
                                                                        paddingLeft: 20,
                                                                        width: 700
                                                                    }}
                                                                    labelCol={{span: 4}}
                                                                    wrapperCol={{span: 19}}
                                                                    name={field.name}
                                                                    label={`问题${field.key + 1}`}
                                                                >

                                                                    <Input style={{width: '100%'}}/>
                                                                </Form.Item>
                                                                <div style={{marginBottom: 24}}>
                                                                    <PlusCircleOutlined
                                                                        style={{
                                                                            fontSize: 20,
                                                                            paddingRight: 5,
                                                                            paddingLeft: 5,
                                                                            color: '#1890ff'
                                                                        }}
                                                                        onClick={() => {
                                                                            setProblem('add', field.key);
                                                                        }}
                                                                    />
                                                                    {
                                                                        fields.length === 1 ? null : (
                                                                            <MinusCircleOutlined
                                                                                style={{
                                                                                    fontSize: 20,
                                                                                    color: '#ff4d4f'
                                                                                }}
                                                                                onClick={() => {
                                                                                    setProblem('remove', field.key);
                                                                                }}
                                                                            />
                                                                        )
                                                                    }
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </>
                                        );
                                    }
                                }
                            </Form.List>
                        </div>
                        <div className={styles.item}>
                            <p>3、回访结束语</p>
                            <BraftEditor
                                controls={[]}
                                contentStyle={{
                                    height: 200
                                }}
                                onChange={(e) => {
                                }}
                                style={{
                                    marginLeft: 22,
                                    border: '1px solid #000'
                                }}
                            />
                        </div>
                    </div>
                </Card>
                <Card className={styles.cardBox} title={<div className={styles.cardTitleBox}><p>创建人信息</p></div>}>
                    1
                </Card>
                <Button type="primary" htmlType="submit">提交</Button>

            </Form>
        </Spin>
    );
};
export default connect(({loading}) => ({
    loading: loading.effects['returnVisitList/queryVersionNumber']
}))(ReturnVisitTemplate);
