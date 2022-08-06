/*
 * @Descripttion: 渠道推荐投资者
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 15:09:13
 * @LastEditTime: 2021-06-09 16:00:42
 */

import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Table, Row, Space, Button, message, notification, Modal, Col, Form, Input, Select, DatePicker, Badge } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import { connect, history, Link } from 'umi';
import { listToMap, fileExport, isNumber, objStringAttributeTrim, dataMasking } from '@/utils/utils';
import qs from 'qs';
// import NewSignFlow from '../newSignFlow/NewSignFlow';


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



interface channelInvestorProps {
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


const channelInvestorList: FC<channelInvestorProps> = (props) => {
    const [form] = Form.useForm();
    const { loading, forwardRef, dispatch, params } = props;
    const [listData, setListData] = useState<listDataProps>({ list: [], total: 0 });                                          // list data
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                        // 选中行

    // 查询数据
    const getListData = (args = { ...pageData }) => {
        dispatch({
            type: 'CHANNEL/recommendedInvestor',
            payload: {
                ...params,
                ...objStringAttributeTrim(args),
                sortFiled: 'createTime',
                sortType: 'desc'
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    setListData(data);
                } else {
                    const txt = message || data || '查询失败';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    /**
     * @description 删除调用接口
     * @param data
     */
    const doDelete = (ids) => {
        dispatch({
            type: 'CHANNEL/agreementEdit',
            payload: {
                agreementId: ids,
                isDelete: 0
            },
            callback: (res) => {
                if (res.code === 1008) {
                    getListData();
                    setSelectedRowKeys([]);
                    openNotification('success', '提醒', '删除成功');
                } else {
                    openNotification('error', '提醒', '删除失败');
                }
            }
        });
    };

    /**
     * @description 删除前提示
     */
    const deletePre = (data) => {
        Modal.confirm({
            title: '是否删除该客户签署的协议',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该协议无效，投资人看不到该协议，管理人不可下载该协议',
            okText: '确认',
            cancelText: '取消',
            onOk: () => doDelete(data)
        });
    };

    /**
     * @description 调用终止接口
     */
    const dostop = (ids) => {
        dispatch({
            type: 'CHANNEL/agreementEdit',
            payload: {
                agreementId: ids,
                isDelete: 1
            },
            callback: ({ code, data }) => {
                if (code === 1008) {
                    getListData();
                    openNotification('success', '提醒', '终止成功！');
                } else {
                    openNotification('error', '提醒', '终止失败！');
                }
            }
        });
    };

    /**
     * @description 终止前提醒
     */
    const stopPre = (agreementId) => {
        Modal.confirm({
            title: '是否终止该签署协议流程',
            icon: <ExclamationCircleOutlined />,
            content: '终止后该客户无需签署本协议，请您确认是否终止',
            okText: '确认',
            cancelText: '取消',
            onOk: () => dostop([agreementId])
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
            title: '投资者名称',
            dataIndex: 'customerName',
            width: 120,
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link>
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 200,
            render: (txt) => txt ? dataMasking(txt) : '--'
        },
        {
            title: '推荐产品数量',
            dataIndex: 'productNumber',
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
                        <FormItem label="投资者名称" name="name">
                            <Input placeholder="请输入" allowClear />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem label="投资者证件号" name="cardNumber">
                            <Input placeholder="请输入" allowClear />
                        </FormItem>
                    </Col>
                    <Col span={8} style={{ textAlign: 'end' }}>
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
    loading: loading.effects['CHANNEL/recommendedInvestor'],
    data: CHANNEL.listData
}))(channelInvestorList);

channelInvestorList.defaultProps = {
    loading: false,
    params: {}
};
