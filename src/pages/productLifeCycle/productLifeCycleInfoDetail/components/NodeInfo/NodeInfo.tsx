/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-31 13:05:03
 * @LastEditTime: 2021-07-08 14:53:33
 */
import React from 'react';
import { Input, Row, Col, Radio, DatePicker, Select, Checkbox, Form } from 'antd';
const { Option } = Select;
import { CALL_METHOD, LIFE_STATUS } from '@/utils/publicData';
import TextArea from 'antd/lib/input/TextArea';


interface nodeInfoProps {
    nodeHandler: any[]
}

/**
     * @description 节点信息
     */
const NodeInfoItem = (props: nodeInfoProps) => {
    const { nodeHandler } = props;
    return (
        <>
            <Row>
                <Col span={12}>
                    <Form.Item
                        name="handlerList"
                        label="节点默认处理人"
                        extra="可多选"
                    >
                        <Select
                            disabled
                            mode="multiple"
                            placeholder="请选择"
                            style={{ maxWidth: 400 }}
                            allowClear
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {nodeHandler.map((item) => (
                                <Select.Option value={item.managerUserId} key={item.managerUserId}>
                                    {item.userName}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="cutOffTime"
                        label="节点截止时间（空则不提醒）"
                        extra="到达此时间未结束，将进行提醒"
                    >
                        <DatePicker showTime />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="remindNotifier"
                        label="截止后通知人员"
                    >
                        <Radio.Group>
                            <Radio value={1}>节点处理人</Radio>
                            <Radio value={2}>全流程处理人</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="remindModel"
                        label="通知方式"
                    >
                        <Checkbox.Group style={{ width: '100%' }}>
                            {
                                CALL_METHOD.map((item) => (
                                    <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>
                                ))
                            }
                        </Checkbox.Group>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="auditOpinion"
                        label="备注"
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
};


export default NodeInfoItem;

NodeInfoItem.defaultProps = {
    nodeHandler: []
};
