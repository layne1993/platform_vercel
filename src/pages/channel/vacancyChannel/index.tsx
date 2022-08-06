/*
 * @Descripttion:空缺编号查询
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 14:24:26
 * @LastEditTime: 2021-07-07 11:35:23
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { objStringAttributeTrim } from '@/utils/utils';
import { Radio, Row, Space, Button, message, notification, Col, Form, Input, Tooltip } from 'antd';
import MXTable from '@/pages/components/MXTable';
import OptionModal from './optionModal';
import moment from 'moment';
import { connect, Link } from 'umi';

const date_format = 'YYYY-MM-DD HH:mm';

const openNotification = (type, message, description, placement?, duration = 3) => {
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

const vacancyChannel: FC<any> = (props) => {
    const { authEdit, authExport, loading, dispatch, updateChannelLoading } = props;
    const [form] = Form.useForm();
    const [listData, setListData] = useState<any>({ list: [], total: 0 });                  // list data
    const [pageData, setPageData] = useState<any>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                    // 选中行

    // 查询数据
    const getListData = (args = { ...pageData }) => {
        dispatch({
            type: 'CHANNEL/vacancyChannelList',
            payload: {
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

    useEffect(() => {
        form.setFieldsValue({ scope: 1 });
        getListData({ ...form.getFieldsValue(), ...pageData });
    }, []);

    /**
     * @description 更新渠道商
     */
    const updateChannel = (values) => {
        dispatch({
            type: 'CHANNEL/updateChannel',
            payload: {},
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    // getListData();
                    openNotification('success', '提醒', '更新成功');
                } else {
                    const txt = message || data || '更新失败！';
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
        setSelectedRowKeys([]);
        getListData({ ...pageData, pageNum: 1 });
        setPageData({ ...pageData, pageNum: 1 });
    };

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        const pageData = {
            pageNum: p.current,
            pageSize: p.pageSize
        };
        setPageData(pageData);
        setSelectedRowKeys([]);
        getListData({ ...form.getFieldsValue(), ...pageData });
    };




    // 表头
    const columns = [
        {
            title: '原始编码/别名',
            dataIndex: 'alias',
            width: 200,
            fixed: 'left'
        },
        {
            title: '关联渠道',
            dataIndex: 'channelList',
            width: 300,
            render: (arr) => {
                if (Array.isArray(arr) && arr.length > 0) {
                    return <Space>
                        {arr.map((item, index) => (
                            <Link key={index} to={`/channel/list/detail/${item.channelId}?channelName=${item.channelName}`}>{item.channelName}</Link>
                        ))}
                    </Space>;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '交易记录条数',
            dataIndex: 'recordNumber',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '操作',
            width: 200,
            render: (record) => <OptionModal params={record} success={() => { getListData({ ...pageData, pageNum: 1 }); setPageData({ ...pageData, pageNum: 1 }); }} />
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys
    };

    return (
        <PageHeaderWrapper
            title="空缺渠道编号查询"
        >
            <div style={{ backgroundColor: 'white', padding: 15 }}>
                <Form
                    form={form}
                    {...formItemLayout}
                    onFinish={(values) => { getListData({ ...values, ...pageData, pageNum: 1 }); setPageData({ ...pageData, pageNum: 1 }); }}
                >
                    <Row gutter={[8, 0]}>
                        <Col span={8}>
                            <Form.Item
                                label="渠道编码"
                                name="encodingRules"
                                extra="渠道编号是从交易记录中的信息获得的"
                            >
                                <Input placeholder="请输入" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                label="查询范围"
                                name="scope"
                                extra="默认是只看未匹配"
                            >
                                <Radio.Group >
                                    <Radio value={1}>只看未匹配的</Radio>
                                    <Radio value={2}>所有</Radio>
                                </Radio.Group>
                            </Form.Item>
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
                <Row>
                    <Space>
                        {authEdit &&
                            <Tooltip title="本操作需要重新将所有交易记录进行匹配，较慢，成功后会通过短信提醒告知">
                                <Button loading={updateChannelLoading} type="primary" onClick={updateChannel}>
                                    刷新匹配（请务必在新增或关联渠道后点击本按钮！）
                                </Button>
                            </Tooltip>
                        }
                    </Space>
                </Row>
                <MXTable
                    loading={loading}
                    // rowSelection={rowSelection}
                    columns={columns}
                    dataSource={listData.list || []}
                    rowKey={(record, index) => `id-${index}`}
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    sticky
                    total={listData.total}
                    pageNum={pageData.pageNum}
                    onChange={_tableChange}
                />
            </div>
        </PageHeaderWrapper>
    );
};

export default connect(({ CHANNEL, loading }) => ({
    loading: loading.effects['CHANNEL/vacancyChannelList'],
    updateChannelLoading: loading.effects['CHANNEL/updateChannel']
}))(vacancyChannel);

vacancyChannel.defaultProps = {
    loading: false,
    authEdit: true,
    authExport: true,
    updateChannelLoading: false
};

