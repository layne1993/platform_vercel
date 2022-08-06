/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-17 20:04:08
 * @LastEditTime: 2021-09-02 16:11:01
 */
import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';
import { Menu, Row, Space, Button, Dropdown, notification, Modal } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import { connect } from 'umi';
import { listToMap, fileExport } from '@/utils/utils';
import { XWTemplateType, SIGNINGPROCESS } from '@/utils/publicData';
import type { PageData, TableListData } from './../../data.d';
import NewSignFlow from '../newSignFlow/NewSignFlow';


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const DATE_FORMAT = 'YYYY-MM-DD';

interface ListProps {
    loading: boolean,
    dispatch: any,
    forwardRef: any,
    data: TableListData,
    authEdit: boolean,
    authExport: boolean
}

const List: FC<ListProps> = (props) => {
    const { loading, data, forwardRef, dispatch } = props;
    const [pageData, setPageData] = useState<PageData>({ pageNum: 1, pageSize: 20 });            // 分页信息
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);                        // 选中行
    const [NewSignFlowFlag, setNewSignFlowFlag] = useState<boolean>(false);                      // 新建流程模态框

    // 查询数据
    const getListData = (pageData = { pageNum: 1, pageSize: 20 }) => {
        let params = {};
        if (forwardRef) {
            params = forwardRef.current.getFieldsValue();
        }
        dispatch({
            type: 'SEPARATEAGREEMENT/getListData',
            payload: {
                ...params,
                ...pageData
            }
        });
    };

    /**
     * @description 删除调用接口
     * @param data
     */
    const doDelete = (ids) => {
        dispatch({
            type: 'SEPARATEAGREEMENT/agreementEdit',
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
            type: 'SEPARATEAGREEMENT/agreementEdit',
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
     * @description终止前提醒
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
     * @description 新建成功回调
     */
    const success = () => {
        getListData();
        setNewSignFlowFlag(false);
    };


    /**
     * @description 批量下载
     */
    const batchDownload = (ids) => {
        fileExport({
            method: 'post',
            url: '/separateAgreement/download',
            data: { agreementIds: ids },
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


    /**
     * @description 下载全部
     */
    const _downloadAll = () => {
        let params = {};
        if (forwardRef) {
            params = forwardRef.current.getFieldsValue();
        }
        fileExport({
            method: 'post',
            url: '/separateAgreement/downloadAll',
            data: {
                ...params,
                ...pageData
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '下载成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '下载失败！');
                }
            }
        });
    };

    useEffect(getListData, []);

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
        getListData({ pageNum: p.current, pageSize: p.pageSize });
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
    const columns = useMemo(() => [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 150
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '产品全称',
            dataIndex: 'productName',
            width: 200
        },
        {
            title: '协议类型',
            dataIndex: 'agreementType',
            width: 120,
            render: (val: number) => val ? listToMap(XWTemplateType)[val] : '--'
        },
        {
            title: '协议名称',
            dataIndex: 'agreementName',
            width: 200
        },
        {
            title: '签署进度',
            dataIndex: 'signedProgress',
            width: 100,
            render: (val: number) => val !== null ? listToMap(SIGNINGPROCESS)[val] : '--'
        },
        {
            title: '完成时间',
            dataIndex: 'completeTime',
            width: 200,
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--',
            sorter: (a, b) => a.completeTime - b.completeTime,
            ellipsis: true
        },
        {
            title: '操作人员',
            dataIndex: 'userName',
            width: 120
        },
        {
            title: '操作',
            width:100,
            render: (record) => (
                <Space>
                    {props.authExport && record.signedProgress === 2 && <a onClick={() => batchDownload([record.agreementId])}>下载</a>}
                    {props.authEdit && record.signedProgress === 1 && <a onClick={() => stopPre(record.agreementId)} >终止</a>}
                    {props.authEdit && record.signedProgress === 2 && <a onClick={() => deletePre([record.agreementId])} >删除</a>}
                </Space>
            )
        }
    ], []);

    return (
        <>
            <Row>
                <Space>
                    {props.authEdit && <Button type="primary" onClick={() => setNewSignFlowFlag(true)}>新建单独签署流程</Button>}
                    {
                        props.authExport &&
                        <Dropdown
                            overlay={<Menu>
                                <Menu.Item
                                    key="1"
                                    disabled={selectedRowKeys.length === 0}
                                    onClick={() => batchDownload(selectedRowKeys)}
                                >
                                    下载选中
                                </Menu.Item>
                                <Menu.Item
                                    key="0"
                                    onClick={_downloadAll}
                                >
                                    下载全部
                                </Menu.Item>
                            </Menu>}
                        >
                            <Button >
                                &nbsp;&nbsp;批量下载
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    }

                    {/* {props.authExport && <Button disabled={selectedRowKeys.length === 0} onClick={() => batchDownload(selectedRowKeys)}>批量下载</Button>} */}
                    {props.authEdit && <Button disabled={selectedRowKeys.length === 0} onClick={() => deletePre(selectedRowKeys)}>批量删除</Button>}
                </Space>
            </Row>
            <MXTable
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data.list || []}
                rowKey="agreementId"
                scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                sticky
                total={data.total}
                pageNum={pageData.pageNum}
                onChange={_tableChange}
            />
            {NewSignFlowFlag && <NewSignFlow flag={NewSignFlowFlag} cancel={() => setNewSignFlowFlag(false)} success={success} />}
        </>
    );
};


export default connect(({ SEPARATEAGREEMENT, loading }) => ({
    loading: loading.effects['SEPARATEAGREEMENT/getListData'],
    data: SEPARATEAGREEMENT.listData
}))(List);

List.defaultProps = {
    data: {
        list: [],
        pageSize: 0,
        pages: 0,
        total: 0
    },
    loading: false
};
