import React, {useState} from 'react';
import {Form, Select, InputNumber, Row, Col} from 'antd';

const formItemLayout = {
    labelCol: {
        span: 6
    },
    wrapperCol: {
        span: 14
    }
};

const MXForm = (props) => {
    const {formData, onFinish} = props;

    const FormItemRender = (data) => {
        const FORMITEM = {
            Select: (obj)=> (<Select placeholder="请选择">
                {
                    obj.options && obj.options.map((item, index) => {
                        return (
                            <Select.Option key={index} value={item.value} allowClear>
                                {item.label}
                            </Select.Option>
                        );
                    })
                }
            </Select>),
            InputNumber:(obj)=> (<InputNumber {...obj.tag}/>)
        };
        return FORMITEM[data.type](data);
    };

    return (
        <Form
            name="Form"
            onFinish={onFinish}
            initialValues={{}}
        >
            <Row>
                {
                    formData.map(((item, index) => (
                        <Col key={index}>
                            <Form.Item label="分红类型" name="dividendType">
                                {FormItemRender(item)}
                                {/* <Select placeholder="请选择">
                                    {
                                        XWDividendType.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })
                                    }
                                </Select> */}
                            </Form.Item>
                        </Col>
                    )))
                }

            </Row>
        </Form>
    );

};


export default MXForm;

MXForm.defaultProps = {
    formData: [],
    onFinish: () => {}
};
