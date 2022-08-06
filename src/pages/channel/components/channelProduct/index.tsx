/*
 * @Descripttion: 渠道对应产品
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 15:09:13
 * @LastEditTime: 2021-06-08 16:55:26
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Row, Space, Button, message, notification, Modal, Col, Form, Input, Select, DatePicker, Badge } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import { connect, Link } from 'umi';
import { listToMap, fileExport, isNumber, objStringAttributeTrim } from '@/utils/utils';
import qs from 'qs';


const FormItem = Form.Item;

const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

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



interface channelProductProps {
    loading: Boolean,
    dispatch: any,
    forwardRef: any,
    authEdit: boolean,
    authExport: boolean,
    params: any
}

interface listDataProps {
    list: [],
    total: 0
}

interface PageData {
    pageNum: number,
    pageSize: number
}


const channelProductList: FC<channelProductProps> = (props) => {
    const [form] = Form.useForm();
    const { loading, forwardRef, dispatch, params } = props;
    const [listData, setListData] = useState<listDataProps>({ list: [], total: 0 });                                          // list data
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                        // 选中行

    // 查询数据
    const getListData = (args = { ...pageData }) => {
        dispatch({
            type: 'CHANNEL/channelProductList',
            payload: {
                ...params,
                ...objStringAttributeTrim(args),
                sortFiled: 'createTime',
                sortType: 'desc'
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setListData(data || {});
                } else {
                    const txt = message || data || '查询失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    /**
     * @description 重置
     */
    const reset = () => {
        form.resetFields();
        getListData({ ...pageData, pageNum: 1 });
    };



    /**
     * @description 批量下载
     */
    const batchDownload = (id) => {
        fileExport({
            method: 'post',
            url: '/stagging/apply/downloadMaterialPackage',
            data: qs.stringify({ applyId: id }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    };

    useEffect(getListData, []);

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        const pageData = {
            pageNum: p.current,
            pageSize: p.pageSize
        };
        setPageData(pageData);
        getListData({ ...form.getFieldsValue(), ...pageData });
    };

    const _onSelectChange = (selectedRowKeys: number[]) => {
        setSelectedRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: _onSelectChange,
        getCheckboxProps: (record: any) => ({
            disabled: record.signedProgress !== 2 // Column configuration not to be checked
        })
    };

    // 表头
    const columns = [
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: 120,
            render: (val, record) => <Link to={`/product/list/details/${record.productId}`}>{val}</Link>
        },
        {
            title: '推荐投资者数量',
            dataIndex: 'customerNumber',
            width: 200
        },
        {
            title: '推荐次数',
            dataIndex: 'recommendedNumber',
            width: 120
        }
    ];

    return (
        <div>
            <Form
                ref={forwardRef}
                form={form}
                {...formItemLayout}
                onFinish={(values) => getListData({ ...values, ...pageData, pageNum: 1 })}
            >
                <Row gutter={[8, 0]}>
                    <Col span={8}>
                        <FormItem label="产品名称" name="productFullName">
                            <Input placeholder="请输入" allowClear />
                        </FormItem>
                    </Col>
                    <Col span={8} offset={8} style={{ textAlign: 'end' }}>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button htmlType="reset" onClick={reset}>重置</Button>
                        </Space>
                    </Col>

                </Row>
            </Form>
            <MXTable
                loading={loading}
                // rowSelection={rowSelection}
                columns={columns}
                dataSource={listData.list || []}
                rowKey={(record, index) => index}
                scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                sticky
                total={listData.total}
                pageNum={pageData.pageNum}
                onChange={_tableChange}
            />
        </div>
    );
};


export default connect(({ CHANNEL, loading }) => ({
    loading: loading.effects['CHANNEL/channelProductList'],
    data: CHANNEL.listData
}))(channelProductList);

channelProductList.defaultProps = {
    loading: false,
    params: {}
};
