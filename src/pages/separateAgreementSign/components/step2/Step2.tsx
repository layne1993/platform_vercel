
/*
 * @Descripttion:
 * @versio
 * @Author: yezi
 * @Date: 2021-03-29 16:34:05
 * @LastEditTime: 2021-11-11 20:56:07
 */
import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { listToMap } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import { Form, Select, Row, Col, Input, Button, Space, Table, notification } from 'antd';
import { XWInvestorsType, XWCustomerLevel2, XWcustomerCategoryOptions, SIGNINGPROCESS } from '@/utils/publicData';
import type { PageData, TableListData } from './../../data.d';

const FormItem = Form.Item;

const openNotification = (type: string, message: string, description: any, placement?: string, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

interface Step2Props {
    cancel: () => void,
    onOk: (check: number[]) => void,
    loading: false,
    dispatch: Dispatch
}

const Step2: FC<Step2Props> = (props) => {
    const { cancel, onOk, loading, dispatch } = props;
    const [form] = Form.useForm();
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                  // 选中的行
    const [customerData, setCustomerData] = useState<any>({});                             // 客户list
    const [isExpansion, setExpansion] = useState<boolean>(true);                          // 客户搜索条件是否展开
    const [customerSelectList, setCustomerSelectList] = useState<any[]>([]);            // 客户下拉list
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息

    /**
     * @description 获取tablelist
     */
    const getCustomerData = (filerParams = {}, pageData = { pageNum: 1, pageSize: 20 }) => {
        dispatch({
            type: 'SEPARATEAGREEMENT/getCustomerList',
            payload: { ...filerParams, ...pageData },
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    setCustomerData(data);
                } else {
                    const warningText = message || data || '查询失败';
                    openNotification('error', `提示（代码：${code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 获取下拉客户list
     */
    const getCustomerSelecttList = () => {
        dispatch({
            type: 'SEPARATEAGREEMENT/selectListCustomer',
            payload: {},
            callback: ({ code, message, data }: any) => {
                if (code === 1008) {
                    setCustomerSelectList(data || []);
                } else {
                    const warningText = message || data || '查询失败';
                    openNotification('error', `提示（代码：${code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // useEffect(getCustomerSelecttList, []);
    useEffect(getCustomerData, []);

    const onFinish = (values) => {
        setSelectedRowKeys([]);
        getCustomerData(values, { ...pageData, pageNum: 1 });
    };

    /**
     * @description 重置
     */
    const rest = () => {
        form.resetFields();
        setSelectedRowKeys([]);
        setPageData({ pageNum: 1, pageSize: 20 });
        getCustomerData({}, { ...pageData, pageNum: 1 });
    };

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getCustomerData(form.getFieldsValue(), { pageNum: p.current, pageSize: p.pageSize });
    };

    const _selectChange = (selectedRowKeys: number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: _selectChange
    };

    // 产品表头
    const columns = useMemo(() => [
        {
            title: '客户名称',
            dataIndex: 'customerName'
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber'
        },
        {
            title: '客户类别',
            dataIndex: 'customerType',
            render: (val: number) => val ? listToMap(XWcustomerCategoryOptions)[val] : '--'
        },
        {
            title: '客户类型',
            dataIndex: 'investorType',
            render: (val: number) => val ? listToMap(XWInvestorsType)[val] : '--'
        },
        {
            title: BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级',
            dataIndex: 'customerLevel',
            render: (val: number) => val ? listToMap(XWCustomerLevel2)[val] : '--'
        },
        {
            title: '持有产品',
            dataIndex: 'productFullName'
        }
    ], []);

    return (
        <>
            <Form
                {...formItemLayout}
                form={form}
                onFinish={onFinish}
            >
                <Row>
                    <Col span={12}>
                        <FormItem
                            label="客户名称"
                            name="customerName"
                        >
                            <Input placeholder="请输入客户名称" allowClear />
                            {/* <Select
                                allowClear
                                placeholder="请选择客户"
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {customerSelectList.map((item) => (
                                    <Select.Option key={item.customerId} value={item.customerId}>
                                        {item.customerName}
                                    </Select.Option>
                                ))}
                            </Select> */}
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="证件号码"
                            name="cardNumber"
                        >
                            <Input placeholder="请输入证件号码" allowClear />
                        </FormItem>
                    </Col>
                    {isExpansion && <>
                        <Col span={12}>
                            <FormItem
                                label="客户类别"
                                name="customerType"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {XWcustomerCategoryOptions.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="客户类型"
                                name="investorType"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {XWInvestorsType.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label={BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级'}
                                name="customerLevel"
                            >
                                <Select placeholder="请选择" allowClear>
                                    {XWCustomerLevel2.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span={12}>
                            <FormItem
                                label="持有产品"
                                name="productFullName"
                            >
                                <Input placeholder="请输入持有产品名称" allowClear />
                            </FormItem>
                        </Col>
                    </>}

                    <Col span={24} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={rest} >重置</Button>
                            <a onClick={() => setExpansion(!isExpansion)}>{isExpansion ? '收起' : '展开'}</a>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <MXTable
                loading={loading}
                columns={columns}
                rowKey="customerId"
                scroll={{ x: '100%', y: 260, scrollToFirstRowOnChange: true }}
                dataSource={customerData.list || []}
                rowSelection={rowSelection}
                total={customerData.total}
                pageNum={customerData.pageNum}
                onChange={_tableChange}
            />
            <Row justify="center" style={{ marginTop: 15 }}>
                <Space>
                    <Button type="primary" htmlType="submit" disabled={selectedRowKeys.length === 0} onClick={() => onOk(selectedRowKeys)} >确定</Button>
                    <Button onClick={cancel}>取消</Button>
                </Space>
            </Row>
        </>
    );

};



export default connect(({ loading }) => ({
    loading: loading.effects['SEPARATEAGREEMENT/getCustomerList']
}))(Step2);



Step2.defaultProps = {
    cancel: () => { },
    onOk: () => { }
};
