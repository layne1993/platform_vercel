import React from 'react';
import { Form, Input } from 'antd';

const SaveTem: React.FC<{ forwardRef: any; templateName: string | undefined }> = (props) => {
    const [form] = Form.useForm();
    return (
        <React.Fragment>
            <Form ref={props.forwardRef} form={form} layout="vertical">
                <Form.Item
                    label="模板名称"
                    name="templateName"
                    rules={[{ required: true }]}
                    initialValue={props.templateName}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <span>备注：</span>
                    <p>1、本次模板会保存所选指标、净值频率；</p>
                    <p>
                        2、若时间范围和产品名称也需要保存，可以直接点击确认，若无需储存，可以删除该信息。
                    </p>
                </Form.Item>
            </Form>
        </React.Fragment>
    );
};

export default SaveTem;
