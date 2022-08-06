/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 16:34:05
 * @LastEditTime: 2021-11-08 13:13:27
 */
import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Form, Select, Row, Col, Input, Button, Space, Table, notification } from 'antd';
import { XWTemplateType } from '@/utils/publicData';
import { listToMap } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import type { PageData, TableListData } from './../../data.d';
import { MultipleSelect } from '@/pages/components/Customize';

const openNotification = (type: string, message: string, description: any, placement?: string, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const FormItem = Form.Item;

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

interface Step1Props {
    cancel: () => void,
    productChange:()=>void,
    onOk: (check: number[]) => void,
    loading: false,
    dispatch: Dispatch
}

const Step1: FC<Step1Props> = (props) => {
    const { cancel, onOk, loading, dispatch,productChange } = props;
    const [form] = Form.useForm();
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                  // 选中的行
    const [productSelectList, setProductSelectList] = useState<any[]>([]);                 // 产品下拉list
    const [productData, setProductData] = useState<any>({});                             // 产品list

    /**
     * @description 获取产品list
     */
    const getProductSelecttList = () => {
        dispatch({
            type: 'SEPARATEAGREEMENT/queryByProductName',
            payload: {},
            callback: ({ code, message, data }: any) => {
                if (code === 1008) {
                    setProductSelectList(data || []);
                } else {
                    const warningText = message || data || '查询失败';
                    openNotification('error', `提示（代码：${code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 获取tablelist
     */
    const getProductList = (filerParams = {}, pageData = { pageNum: 1, pageSize: 20 }) => {
        dispatch({
            type: 'SEPARATEAGREEMENT/getProductList',
            payload: { ...filerParams, ...pageData },
            callback: ({ code, data }: any) => {
                if (code === 1008) {
                    setProductData(data);
                }
            }
        });
    };

    // useEffect(getProductSelecttList, []);
    useEffect(getProductList, []);

    const onFinish = (values) => {
        setSelectedRowKeys([]);
        getProductList(values, { ...pageData, pageNum: 1 });
    };

    /**
     * @description 重置
     */
    const rest = () => {
        form.resetFields();
        setSelectedRowKeys([]);
        setPageData({ ...pageData, pageNum: 1 });
        getProductList({}, { ...pageData, pageNum: 1 });
    };

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getProductList(form.getFieldsValue(), { pageNum: p.current, pageSize: p.pageSize });
    };


    const _selectChange = (selectedRowKeys: number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys: selectedRowKeys,
        preserveSelectedRowKeys: true,
        onChange: _selectChange
    };
    // const productChange = (values)=>{
       
    // }

    // 产品表头
    const columns = useMemo(() => [
        {
            title: '产品名称',
            dataIndex: 'productName'
        },
        {
            title: '协议类型',
            dataIndex: 'documentType',
            render: (val: number) => val ? listToMap(XWTemplateType)[val] : '--'
        },
        {
            title: '协议名称',
            dataIndex: 'documentName'
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
                        <MultipleSelect
                            params="productId"
                            value="productId"
                            label="productName"
                            formLabel="产品名称"
                            setUp={productChange}
                        />
                        {/* <FormItem
                            name="productName"
                            label="产品名称"
                        > */}
                        {/* <Input placeholder="请输入产品名称" allowClear /> */}
                        {/* <Select
                                showSearch
                                placeholder="请选择产品"
                                filterOption={(input, option: any) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {productSelectList.map((item) => (
                                    <Select.Option value={item.productId} key={item.productId}>
                                        {item.productName}
                                    </Select.Option>
                                ))}
                            </Select> */}
                        {/* </FormItem> */}
                    </Col>
                    <Col span={12}>
                        <FormItem
                            name="documentName"
                            label="协议名称"
                        >
                            <Input placeholder="请输入产协议名称" allowClear />
                        </FormItem>
                    </Col>
                    <Col span={12}>
                        <FormItem
                            label="协议类型"
                            name="documentType"
                        >
                            <Select placeholder="请选择" allowClear>
                                {XWTemplateType.map((item) => {
                                    return (
                                        <Select.Option key={item.value} value={item.value}>
                                            {item.label}
                                        </Select.Option>
                                    );
                                })}
                            </Select>
                        </FormItem>
                    </Col>
                    <Col span={12} style={{ textAlign: 'right' }}>
                        <Space>
                            <Button type="primary" htmlType="submit">查询</Button>
                            <Button onClick={rest}>重置</Button>
                        </Space>
                    </Col>
                </Row>
            </Form>
            <MXTable
                loading={loading}
                columns={columns}
                rowKey="documentId"
                scroll={{ x: '100%', y: 270, scrollToFirstRowOnChange: true }}
                dataSource={productData.list || []}
                rowSelection={rowSelection}
                total={productData.total}
                pageNum={productData.pageNum || 1}
                onChange={_tableChange}
            />
            <Row justify="center" style={{ marginTop: 15 }}>
                <Space>
                    <Button type="primary" htmlType="submit" disabled={selectedRowKeys.length === 0} onClick={() => onOk(selectedRowKeys)} >下一步</Button>
                    <Button onClick={cancel}>取消</Button>
                </Space>
            </Row>
        </>
    );

};



export default connect(({ loading }) => ({
    loading: loading.effects['SEPARATEAGREEMENT/getProductList']
}))(Step1);



Step1.defaultProps = {
    cancel: () => { },
    onOk: () => { },
    productChange:()=>{}
};
