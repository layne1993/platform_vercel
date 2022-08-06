/*
 * @Descripttion:渠道管理
 * @version:
 * @Author: yezi
 * @Date: 2021-06-03 14:24:26
 * @LastEditTime: 2021-09-08 13:25:44
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Row, Space, Button, message, notification, Modal, Col, Form, Input, Select, Tooltip, Dropdown, Menu } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import _styles from './index.less';
import { getPermission, isNumber, listToMap, objStringAttributeTrim, fileExport, getCookie } from '@/utils/utils';
import { DownOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import moment from 'moment';
import { CHANNELTYPE } from '@/utils/publicData';
import { connect, history, Link } from 'umi';

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

const channelList: FC<any> = (props) => {
    const { authEdit, authExport, loading, dispatch, updateChannelLoading } = props;
    const [form] = Form.useForm();
    const [listData, setListData] = useState<any>({ list: [], total: 0 });                   // list data
    const [pageData, setPageData] = useState<any>({ pageNum: 1, pageSize: 20 });             // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                    // 选中行
    const [batchUploadModalFlag, setBatchUploadModalFlag] = useState<boolean>(false);        // 批量维护产品打新信息框
    const [channelManagerList, setChannelManagerList] = useState<any[]>([]);                           // 承销商list

    // 查询数据
    const getListData = (params = { ...pageData }) => {
        dispatch({
            type: 'CHANNEL/getListData',
            payload: {
                ...objStringAttributeTrim(params),
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

    // 获取渠道维护人list
    const getChannelManagerList = () => {
        dispatch({
            type: 'global/getManagerList',
            payload: { pageSize: 99999, pageNum: 1 },
            callback: ({ code, data = {}, message }: any) => {
                if (code === 1008) {
                    setChannelManagerList(data.list || []);
                } else {
                    const txt = message || data || '获取渠道维护人失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    useEffect(getChannelManagerList, []);
    useEffect(getListData, []);

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


    // 下载文档
    const _batchDownload = (params = {}) => {
        fileExport({
            method: 'post',
            url: '/manager/channel/export',
            data: {
                ...params
            },
            callback: ({ status, message = '导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    };


    // 表头
    const columns = [
        {
            title: '渠道名称',
            dataIndex: 'channelName',
            width: 120,
            fixed: 'left',
            render: (val, record) => <Link to={`/channel/list/detail/${record.channelId}?channelName=${record.channelName}`}>{val}</Link>
        },
        {
            title: '渠道类型',
            dataIndex: 'channelType',
            width: 100,
            render: (val) => listToMap(CHANNELTYPE)[val]
        },
        {
            title: '渠道维护人',
            dataIndex: 'channelMaintenance',
            width: 150,
            ellipsis: true,
            render: (arr: any[]) => {
                if (Array.isArray(channelManagerList) && Array.isArray(arr)) {
                    let strArr = [];
                    channelManagerList.map((item) => {
                        if (arr.includes(item.managerUserId)) {
                            strArr.push(item.userName);
                        }
                    });
                    return <p title={strArr.join(',')}>{strArr.join(',')}</p>;
                } else {
                    return '--';
                }
            }
        },
        {
            title: '渠道编码',
            dataIndex: 'encodingRules',
            width: 200,
            render: (val) => val ? <p title={val}>{val}</p> : '--'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 200,
            render: (val) => val ? moment(val).format(date_format) : '--'
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            width: 200,
            render: (val) => val ? moment(val).format(date_format) : '--'
        },
        // {
        //     title: '历史合作产品总数',
        //     dataIndex: 'createTime',
        //     width: 150,
        //     render: (val: number) => isNumber(val) || '--'
        // },
        // {
        //     title: '最新份额总计(万)',
        //     dataIndex: 'title',
        //     width: 200,
        //     render: (val: number) => numTransform2(val)
        // },
        // {
        //     title: '最新市值总计(万)',
        //     dataIndex: 'title',
        //     width: 200,
        //     render: (val: number) => numTransform2(val)
        // },
        // {
        //     title: '市值占比',
        //     dataIndex: 'currentActivityNumber',
        //     width: 100
        // },
        {
            title: '备注',
            dataIndex: 'note',
            width: 200
            // ellipsis: true
        },
        {
            title: '操作',
            width: 200,
            render: (record) => (
                <Space>
                    <a onClick={() => history.push(`/channel/list/detail/${record.channelId}?channelName=${record.channelName}`)} >编辑</a>
                </Space>
            )
        }
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: setSelectedRowKeys
    };

    return (
        <PageHeaderWrapper
            title="渠道管理"
        >
            <div style={{ backgroundColor: 'white', padding: 15 }}>
                <Form
                    form={form}
                    {...formItemLayout}
                    onFinish={(values) => { getListData({ ...values, ...pageData, pageNum: 1 }); setPageData({ ...pageData, pageNum: 1 }); }}
                >
                    <Row gutter={[8, 0]}>
                        <Col span={8}>
                            <Form.Item label="渠道名称" name="channelName">
                                <Input placeholder="请输入" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="渠道类型" name="channelType">
                                <Select placeholder="请选择" allowClear>
                                    {CHANNELTYPE.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="渠道维护人" name="channelMaintenance">
                                <Select
                                    placeholder="请选择"
                                    allowClear
                                    showSearch
                                    mode="multiple"
                                    filterOption={(input, option) =>
                                        option.children && option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {
                                        channelManagerList.map((item) => {
                                            return <Select.Option key={item.managerUserId} value={item.managerUserId}>{item.userName}</Select.Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="备注" name="note">
                                <Input placeholder="请输入" allowClear />
                            </Form.Item>
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
                <Row>
                    <Space>
                        {authEdit &&
                            <Button type="primary" onClick={() => history.push('/channel/list/detail/0')}>
                                新建
                            </Button>
                        }
                        {/* {authEdit &&
                            <Button type="primary" onClick={() => setBatchUploadModalFlag(true)}>
                                批量导入
                            </Button>
                        } */}
                        {authExport &&
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={() => _batchDownload({ channelIds: selectedRowKeys })}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={() => _batchDownload({ ...form.getFieldsValue() })}
                                    >
                                        导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    &nbsp;&nbsp;批量导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        }
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
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={listData.list || []}
                    rowKey="channelId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    sticky
                    total={listData.total}
                    pageNum={pageData.pageNum}
                    onChange={_tableChange}
                />

                {/* 批量导入 */}
                {batchUploadModalFlag && (
                    <BatchUpload
                        accept={'.xlsx, .xls'}
                        modalFlag={batchUploadModalFlag}
                        closeModal={() => setBatchUploadModalFlag(false)}
                        templateUrl={`/manager/channel/downloadTemplate?&tokenId=${getCookie('vipAdminToken',)}`}
                        templateMsg="下载模板"
                        // params={{ productId: productId ? Number(productId) : undefined }}
                        onOk={() => {
                            getListData({ ...pageData, pageNum: 1 });
                            setBatchUploadModalFlag(false);
                            setPageData({ ...pageData, pageNum: 1 });
                        }}
                        url="/manager/channel/upload"
                    />
                )}
            </div>
        </PageHeaderWrapper>
    );
};

export default connect(({ CHANNEL, loading }) => ({
    loading: loading.effects['CHANNEL/getListData'],
    updateChannelLoading: loading.effects['CHANNEL/updateChannel']
}))(channelList);

channelList.defaultProps = {
    loading: false,
    authEdit: true,
    authExport: true,
    updateChannelLoading: false
};
