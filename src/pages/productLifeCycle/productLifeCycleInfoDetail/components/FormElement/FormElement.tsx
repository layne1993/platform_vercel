import React from 'react';
import { Input, InputNumber, Radio, DatePicker, TimePicker, Select, Checkbox, Form } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
const { TextArea } = Input;

interface FromElementParams {
    lifecycleElementId?: number,
    type?: string,
    label?: string,
    placeholder?: string,
    options?: any[],
    required?: number,
    fieldName?: string,
    message?: string
}

const FromElement = (obj: FromElementParams) => {
    const { type } = obj;
    const element = {
        'input': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <Input placeholder={placeholder} allowClear />
            </Form.Item>
        ),
        'inputNumber': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <InputNumber style={{ width: '100%' }} placeholder={placeholder} />
            </Form.Item>),
        'textArea': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <TextArea placeholder={placeholder} allowClear />
            </Form.Item>
        ),
        'radio': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <Radio.Group>
                    {options.map((item) => (<Radio key={item.value} value={item.value}>{item.label}</Radio>))}
                </Radio.Group>
            </Form.Item>
        ),
        'datePicker': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <DatePicker placeholder={placeholder || '请选择'} allowClear />
            </Form.Item>
        ),
        'rangePicker': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <RangePicker allowClear />
            </Form.Item>
        ),
        'timePicker': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <TimePicker placeholder={placeholder} />
            </Form.Item>
        ),
        'select': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <Select
                    placeholder={placeholder}
                    allowClear
                >
                    {options.map((item) => (<Option key={item.value} value={item.value}>{item.label}</Option>))}
                </Select>
            </Form.Item>
        ),
        'selectMultiple': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <Select
                    mode="multiple"
                    placeholder={placeholder}
                    allowClear
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {options.map((item) => (<Option key={item.value} value={item.value}>{item.label}</Option>))}
                </Select>
            </Form.Item>
        ),
        'checkbox': ({ label, placeholder, options = [], required, fieldName, message }) => (
            <Form.Item
                label={label}
                name={fieldName}
                rules={[{ required: Boolean(required) }]}
            >
                <Checkbox.Group >
                    {options.map((item) => (<Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>))}
                </Checkbox.Group>
            </Form.Item>
        )
    };
    return element[type](obj);
};

export default FromElement;
