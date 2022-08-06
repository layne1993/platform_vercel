/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-05-13 14:22:36
 * @LastEditTime: 2021-08-17 13:30:07
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Dispatch } from 'umi';
import PropTypes, { number } from 'prop-types';
import { Input, Modal, Button, Row, Tree, Space, Upload, Col, message, Form, notification, Spin, Menu, Dropdown } from 'antd';
import { PlusOutlined, PlusCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import MXUploadProgress from '@/pages/components/MXUploadProgress';
import axios from 'axios';
import { getPermission, getRandomKey } from '@/utils/utils';
import request from '@/utils/rest';
import lodash from 'lodash';
import _styles from './styles.less';
import moment from 'moment';
import folder_icon from '@/assets/folder.svg';
import edit_icon from '@/assets/edit.svg';
import delete_icon from '@/assets/delete.svg';
import upload_icon from '@/assets/upload.svg';
import download_icon from '@/assets/download.svg';
const { Search } = Input;


const formItemLayout = {
    labelCol: {
        xs: { span: 6 },
        sm: { span: 6 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};


interface diskCenterProps {
    actionId: number | string,
    source: number | string,  // 来源 1：生命周期 2：打新
    sourceId: number | string, // 来源id (生命周期流程唯一id/打新流程唯一id)
    loading: boolean,
    dispatch: Dispatch,
    searchLoading: boolean,
    addNetWorkDiskLoading: boolean,
    updateFileNameLoading: boolean
}

interface DataNode {
    title: string;
    key: string | number;
    id: string,
    isLeaf?: boolean;
    children?: DataNode[];
    nodeName?: string;
    nodeId?: number;
    parentNodeId?: number,
    level?: number,
    source?: number,
    actionId?: number,
    sourceId?: number
}


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


// 把数据转化为tree需要的数据格式
const formatTreeData = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    let treeData = [];
    arr.map((item) => {
        treeData.push({
            ...item,
            icon: !item.isLeaf && <img src={folder_icon} />,
            title: item.isLeaf ? item.fileName : item.nodeName,
            key: item.isLeaf ? item.sharedNetWorkFileId : item.nodeId,
            id: item.isLeaf ? item.sharedNetWorkFileId : item.nodeId,
            children: item.children && formatTreeData(item.children)
        });
    });
    return treeData;
};


// 子树数据
const updateTreeData = (list: DataNode[], id: any, children: DataNode[]): DataNode[] => {
    return list.map((node: any) => {
        if (node.id === id) {
            return {
                ...node,
                children
            };
        }
        if (node.children) {
            return {
                ...node,
                icon: <img src={folder_icon} />,
                children: updateTreeData(node.children, id, children)
            };
        }
        return node;
    });
};


// 选中的行
let checkedRow: DataNode = {
    title: undefined,
    key: 0,
    id: '0',
    parentNodeId: 0
};
const setCheckedRow = (data: DataNode) => {
    checkedRow = data;
};

const { authEdit, authExport } = getPermission(40100);

const diskCenter: React.FC<diskCenterProps> = (props) => {

    const filterRef = React.createRef();


    const test = () => {
        // console.log(filterRef, 'filterRef');
    };

    const { loading, addNetWorkDiskLoading, updateFileNameLoading, searchLoading, dispatch, params = {} } = props;
    const [form] = Form.useForm();
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(undefined);
    const [flag, setFlag] = useState<boolean>(false);                                //网盘信息维护模态框
    const [isFile, setIsFile] = useState<boolean>(true);                             // 是否是文件夹
    const [isNewFolder, setIsNewFolder] = useState<boolean>(false);                   // 是否是新建文件夹
    const [queryResults, setQueryResults] = useState<any[]>([]);                     // 查询结果
    const [autoExpandParent, setAutoExpandParent] = useState<boolean>(false);        //是否展开所有
    const [expandedKeys, setExpandedKeys] = useState<number[]>([]);                  //展开的key
    const [loadedKeys, setLoadedKeys] = useState<any[]>([]);
    const [expandedKeys1, setExpandedKeys1] = useState<any[]>([]);


    useEffect(() => {
        setCheckedRow({
            title: undefined,
            key: 0,
            id: '0',
            parentNodeId: 0
        });
    }, []);

    // 获取树
    const getTreeData = () => {
        dispatch({
            type: 'DISKCENTER/selectAllNetwork',
            payload: {
                nodeId: null
            },
            callback: ({ code, data }: { code: number, data: DataNode[] }) => {
                if (code === 1008) {
                    setTreeData(formatTreeData(data));
                } else {
                    openNotification('error', '提醒', '查询失败！');
                }
            }
        });
    };



    useEffect(getTreeData, []);

    // 加载子树
    const loadData = (params) => {
        console.log(params, 'loadData-------------------');
        return new Promise<void>((resolve) => {
            let reqParams = {};
            if (params.level === 1) {
                reqParams = {
                    source: params.id
                };
            } else {
                reqParams = {
                    nodeId: params.id
                };
            }

            dispatch({
                type: 'DISKCENTER/getTreeData',
                payload: {
                    ...reqParams
                },
                callback: ({ code, data, message }: { code: number, data: DataNode[], message: string }) => {
                    if (code === 1008) {
                        setTreeData((origin) =>
                            updateTreeData(origin, params.id, formatTreeData(data)),
                        );
                    } else {
                        let txt = message || data || '查询失败！';
                        openNotification('error', '提醒', txt);
                    }
                    resolve();
                }
            });
        });
    };

    /**
     * @description 关闭模态框
     * 1、关闭模态框
     * 2、初始化数据
     */
    const onCancel = () => {
        setFlag(false);
        setIsFile(true);
        setIsNewFolder(false);
        form.setFieldsValue({
            folderName: undefined,
            fileName: undefined
        });
    };

    const onExpand1 = (keys, { node }) => {
        let newLoadKeys: any[] = [...loadedKeys];
        let newKeys = [...keys];
        // 判断当前是展开还是收起节点，当前展开的长度比之前的少，说明是收起。
        if (expandedKeys1.length > keys.length) {
            let checkIndex = expandedKeys1.indexOf(node.key);
            if (checkIndex !== -1) {
                newLoadKeys = loadedKeys.filter((i, index) => index < checkIndex);
                newKeys = [...newLoadKeys];
            } else {
                //  当是收起的时候，把这个收起的节点从loadedKeys中移除
                newLoadKeys = loadedKeys.filter((i) => keys.includes(i));
                newKeys = [...newLoadKeys];
            }

        }
        // console.log(newLoadKeys, 'newLoadKeyssetLoadedKeys');
        setExpandedKeys1(newKeys);
        setLoadedKeys(newLoadKeys);

    };

    /**
     * @description 新增文件夹
     */
    const addNetWorkDisk = (folderName) => {
        let reqParams = {
            ...checkedRow,
            nodeId: isNewFolder ? undefined : checkedRow.nodeId,
            parentNodeId: isNewFolder ? checkedRow.id : checkedRow.parentNodeId,
            nodeName: folderName
        };
        if (reqParams.level === 1) {
            reqParams.parentNodeId = reqParams.source || 0;
        }
        dispatch({
            type: 'DISKCENTER/addNetWorkDisk',
            payload: {
                ...reqParams
            },
            callback: ({ code, message }: { code: number, message: string }) => {
                if (code === 1008) {
                    openNotification('success', '提醒', '操作成功');
                    onCancel();
                    onExpand1(expandedKeys1, checkedRow.key);
                    if (checkedRow.level === 1) {
                        loadData({ ...checkedRow });
                    } else {
                        if (checkedRow.parentNodeId === 0) {
                            loadData({ ...checkedRow, level: 1, id: 0 });
                        } else {
                            if (isNewFolder) {
                                loadData({ ...checkedRow, id: checkedRow.id });
                            } else {
                                loadData({ ...checkedRow, id: checkedRow.parentNodeId });
                            }
                        }
                    }

                } else {
                    let txt = message || '操作失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    /**
     * @description 更新文件名称
     * @param fileName
     */
    const updateFileName = (fileName: string) => {
        dispatch({
            type: 'DISKCENTER/updateFileName',
            payload: {
                sharedNetWorkFileId: checkedRow.id,
                fileName
            },
            callback: ({ code, message }: { code: number, message: string }) => {
                if (code === 1008) {
                    onCancel();
                    loadData({ ...checkedRow, id: checkedRow.parentNodeId });
                    openNotification('success', '提醒', '修改成功');
                } else {
                    let txt = message || '操作失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };


    // 删除文件
    const deleteFile = (nodeId: number) => {
        dispatch({
            type: 'DISKCENTER/deleteFile',
            payload: {
                sharedNetWorkFileId: nodeId
            },
            callback: ({ code, data, message }: { code: number, data: DataNode[], message: string }) => {
                if (code === 1008) {
                    loadData({ ...checkedRow, id: checkedRow.parentNodeId });
                    openNotification('success', '提醒', '删除成功');
                } else {
                    let txt = message || '删除失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    // 删除文件夹
    const deleteFolder = (nodeId) => {
        dispatch({
            type: 'DISKCENTER/deleteFolder',
            payload: {
                nodeId
            },
            callback: ({ code, data, message }: { code: number, data: DataNode[], message: string }) => {
                if (code === 1008) {
                    // onExpand1(expandedKeys1, checkedRow.key);
                    if (checkedRow.parentNodeId === 0 && checkedRow.source === 0) {
                        loadData({ ...checkedRow, level: 1, id: 0 });
                    } else {
                        loadData({ ...checkedRow, id: checkedRow.parentNodeId });
                    }

                    openNotification('success', '提醒', '删除成功！');
                } else {
                    let txt = message || '删除失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    /**
     * @description 减号事件
     * @param data
     * @param event
     */
    const minusClick = (data, event) => {
        setCheckedRow({ ...data });
        event.stopPropagation();
        if (data.isLeaf) {
            Modal.confirm({
                title: '删除？',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => deleteFile(data.id)
            });
        } else {
            Modal.confirm({
                title: '删除？',
                icon: <ExclamationCircleOutlined />,
                content: '确定删除？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => deleteFolder(data.id)
            });
        }
    };


    // 无数据时添加
    const add = () => {
        setFlag(true);
        setIsFile(false);
        form.setFieldsValue({ folderName: undefined });
    };


    /**
     * @description 编辑事件
     * @param data
     * @param event
     */
    const eidtClick = (data, event) => {
        setCheckedRow(data);
        event.stopPropagation();
        // 文件点击编辑修改文件名称
        if (data.isLeaf) {
            form.setFieldsValue({ fileName: data.title });
        } else {
            // 文件夹名称编辑
            setIsFile(false);
            form.setFieldsValue({ folderName: data.title });
        }
        setFlag(true);
    };




    /**
     * @description tree onSelect事件
     * @param selectedKeysValue
     * @param info
     */
    const onSelect = (selectedKeysValue: React.Key[], info: any) => {
        console.log(info.node, 'node');
        setCheckedKeys(selectedKeysValue);
        setCheckedRow(info.node || {});
    };


    // 展开回调
    const onExpand = (expandedKeys) => {
        // console.log(expandedKeys, 'expandedKeys');
        setExpandedKeys(expandedKeys);
        setAutoExpandParent(true);
    };


    // 搜索
    const onSearch = (value) => {
        value = value && value.trim();
        if (!value) {
            setQueryResults([]);
            return;
        }
        dispatch({
            type: 'DISKCENTER/diskSearch',
            payload: {
                fileName: value
            },
            callback: ({ code, data, message }: { code: number, data: { jsonArray: DataNode[], list: number[] }, message: string }) => {
                if (code === 1008) {
                    setQueryResults(formatTreeData(data.jsonArray) || []);
                    onExpand(data.list);
                    if (data.jsonArray.length === 0) {
                        openNotification('warning', '提醒', '没有相关的文件信息！');
                    }
                } else {
                    let txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };



    // 确定事件
    const onFinish = () => {
        form.validateFields().then((values) => {
            const formData = form.getFieldsValue();
            // console.log(formData, 'formData');
            // 文件夹名称
            if (formData.folderName) {
                addNetWorkDisk(formData.folderName);
            }

            // 更新文件名称
            if (formData.fileName) {
                updateFileName(formData.fileName);
            }
            setFlag(false);
        });

    };


    // 下拉 a 标签 点击事件
    const uploadOption = (data, e) => {
        // console.log(data, 'uploadOption');
        setCheckedRow(data);
        e.stopPropagation();
    };

    // 下拉按钮点击事件
    const menuClick = (data) => {
        data.domEvent && data.domEvent.stopPropagation();
        if (data.key === '3') {
            setFlag(true);
            setIsFile(false);
            setIsNewFolder(true);
        }
    };

    /**
     * @description 文件下载
     * @param url
     * @param e
     */
    const downloadFile = (url, e) => {
        window.open(url);
        e.stopPropagation();
    };

    // 上传完成回调
    const callback = ({ status, message }) => {
        console.log(checkedRow, 'onSuccessonSuccessonSuccess----------------');
        if (status === 'success') {
            loadData(checkedRow);
        } else {
            openNotification(
                'warning',
                '提示',
                message,
                'topRight',
            );
        }

    };


    const onLoad = (loadedKeys) => {
        setLoadedKeys(loadedKeys);
    };

    // 行渲染
    const titleRender = (data) => {
        return (
            <span key={data.key}>
                <div className={_styles.titleBox}>
                    <div className={_styles.leftBox}>
                        <p style={{ marginBottom: 0 }}>{data.title}</p>
                        {data.isLeaf &&
                            <span>
                                {data.operateUserName && <span>{data.operateUserName}，</span>}
                                {data.updateTime && moment(data.updateTime).format('YYYY/MM/DD HH:mm')}
                            </span>

                        }
                    </div>
                    {(authEdit && checkedKeys && checkedKeys[0] === data.key && data.source === 0) &&
                        <Space className={_styles.extra}>
                            {data.level !== 1 && <span title="删除" onClick={(e) => minusClick(data, e)} className={_styles.optionBtn} ><img src={delete_icon} />删除</span>}
                            {data.level !== 1 && <span title="修改名称" onClick={(e) => eidtClick(data, e)} className={_styles.optionBtn} ><img src={edit_icon} />编辑</span>}
                            {data.isLeaf && <span title="下载" onClick={(e) => downloadFile(data.url, e)} className={_styles.optionBtn}><img src={download_icon} />下载</span>}
                            {
                                !data.isLeaf &&
                                <Dropdown overlay={
                                    (
                                        <Menu onClick={menuClick}>
                                            {data.level !== 1 &&
                                                <Menu.Item key={1}>
                                                    <MXUploadProgress
                                                        params={{
                                                            ...checkedRow,
                                                            actionId: checkedRow.actionId ? checkedRow.actionId : checkedRow.sourceId,
                                                            nodeId: checkedRow.id
                                                        }}
                                                        url={'/shareNetworkFile/addNetWorkFile'}
                                                        uploadProps={{
                                                            multiple: true
                                                        }}
                                                        callback={callback}

                                                    >
                                                        上传文件
                                                    </MXUploadProgress>
                                                </Menu.Item>
                                            }
                                            <Menu.Item key={2}>
                                                <MXUploadProgress
                                                    params={{
                                                        ...checkedRow,
                                                        actionId: checkedRow.actionId ? checkedRow.actionId : checkedRow.sourceId,
                                                        nodeId: checkedRow.id
                                                    }}
                                                    url={'/shareNetworkFile/moreFileUpload'}
                                                    uploadProps={{
                                                        directory: true
                                                    }}
                                                    callback={callback}
                                                >
                                                    上传文件夹
                                                </MXUploadProgress>
                                            </Menu.Item>
                                            <Menu.Item key={3}>新建文件夹</Menu.Item>
                                        </Menu>
                                    )
                                }
                                >
                                    <span title="上传操作" className={_styles.optionBtn} style={{ color: '#746d6d' }} onClick={(e) => uploadOption(data, e)}>
                                        <img src={upload_icon} /> 上传
                                    </span>
                                </Dropdown>
                            }
                        </Space>
                    }
                </div>

            </span >
        );
    };




    // console.log(treeData, 'gggg');

    return (
        <PageHeaderWrapper>
            <Spin spinning={loading}>
                <div className={_styles.diskCenterWarp}>
                    {treeData.length > 0 &&
                        <Row style={{ marginBottom: 20 }}>
                            <Col span={12}>
                                <Search
                                    loading={searchLoading}
                                    placeholder="请输入标题，或内容（支持word、excel、pdf、txt）"
                                    onSearch={onSearch}
                                    allowClear
                                />
                            </Col>
                        </Row>
                    }

                    <Row>

                        <Col span={24}>
                            {queryResults.length > 0 ?
                                <Tree.DirectoryTree
                                    showLine
                                    showIcon
                                    blockNode
                                    // height={450}
                                    treeData={queryResults}
                                    titleRender={titleRender}
                                    checkedKeys={checkedKeys}
                                    onSelect={onSelect}
                                    // loadData={loadData}
                                    expandedKeys={expandedKeys}
                                    onExpand={onExpand}
                                // autoExpandParent={autoExpandParent}
                                />
                                :
                                <div style={{ display: queryResults.length === 0 ? 'block' : 'none' }}>
                                    <Tree.DirectoryTree
                                        showLine
                                        showIcon
                                        blockNode
                                        // height={450}
                                        treeData={treeData}
                                        titleRender={titleRender}
                                        checkedKeys={checkedKeys}
                                        onSelect={onSelect}
                                        loadData={loadData}
                                        expandedKeys={expandedKeys1}
                                        onExpand={onExpand1}
                                        loadedKeys={loadedKeys}
                                        onLoad={onLoad}
                                    />
                                </div>
                            }
                        </Col>

                    </Row>

                    <Modal
                        title="网盘信息维护"
                        visible={flag}
                        onCancel={onCancel}
                        maskClosable={false}
                        width={'40%'}
                        destroyOnClose
                        footer={[
                            <Button key="back" onClick={onCancel}>
                                取消
                            </Button>,
                            <Button key="submit" type="primary" htmlType="submit" loading={addNetWorkDiskLoading || updateFileNameLoading} onClick={onFinish}>
                                确定
                            </Button>
                        ]}
                    >
                        <Form
                            {...formItemLayout}
                            form={form}
                            onFinish={onFinish}
                        >

                            {(isFile) &&
                                <Form.Item
                                    label="文件名称"
                                    name="fileName"
                                    rules={[{
                                        required: true,
                                        message: '请输入'
                                    }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            }

                            {(!isFile) &&
                                <Form.Item
                                    label="文件夹名称"
                                    name="folderName"
                                    rules={[{
                                        required: true,
                                        message: '请输入'
                                    }]}
                                >
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            }
                        </Form>
                    </Modal>
                    {
                        authEdit &&
                        treeData.length === 0 &&
                        <Row justify="center">
                            <Button icon={<PlusOutlined />} onClick={add}>新建文件夹</Button>
                        </Row>
                    }
                </div>
            </Spin>
        </PageHeaderWrapper>
    );
};



export default connect(({ loading }) => ({
    loading: loading.effects['DISKCENTER/selectAllNetwork'],
    // loading: loading.effects['DISKCENTER/getTreeData'],
    searchLoading: loading.effects['DISKCENTER/diskSearch'],
    addNetWorkDiskLoading: loading.effects['DISKCENTER/addNetWorkDisk'],
    updateFileNameLoading: loading.effects['DISKCENTER/updateFileName']
}))(diskCenter);


diskCenter.propTypes = {
    source: PropTypes.oneOfType([
        PropTypes.number.isRequired,
        PropTypes.string.isRequired
    ]),
    sourceId: PropTypes.oneOfType([
        PropTypes.number.isRequired,
        PropTypes.string.isRequired
    ]),
    actionId: PropTypes.oneOfType([
        PropTypes.number.isRequired,
        PropTypes.string.isRequired
    ])
};
