import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { CountContext } from '../../index';
import { EditableProTable } from '@ant-design/pro-table';
import { insertChannel, getChannels, getChannelTypes, updateChannel } from '../../../../service';

const ModalPlaceManage = (props) => {
    let { isModalVisible, setIsModalVisible } = useContext(CountContext);
    const [editableKeys, setEditableRowKeys] = useState([]);
    // const [dataSource, setDataSource] = useState(data);
    const [flag, setFlag] = useState(false);
    const [channelType, setChannelType] = useState();
    const [dataSource, setDataSource] = useState([]);
    const [loading, setloading] = useState(false);

    const waitTime = (time) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, time);
        });
    };

    //查询渠道
    const getChannelsAjax = async () => {
        setloading(true);
        const res = await getChannels({
            pageSize: 40,
            pageNum: 1,
        });
        if (res.code == 1001) {
            setDataSource([...res.data.list] || '');
        }
        setloading(false);
    };

    //查询渠道类型
    const getChannelTypesAjax = async () => {
        const res = await getChannelTypes({});
        if (res.code == 1001) {
            setChannelType(res.data);
        }
    };

    const columns = [
        {
            title: '渠道名称',
            dataIndex: 'channelName',
            editable: (text, record, index) => {
                console.log(index);
                return index >= dataSource.length;
            },
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
        },
        {
            title: '渠道类型',
            dataIndex: 'channelType',
            valueType: 'select',
            valueEnum: channelType,
            editable: (text, record, index) => {
                console.log(index);
                return index >= dataSource.length;
            },
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
        },
        {
            title: '户号',
            dataIndex: 'accountName',
        },
        {
            title: '账号',
            dataIndex: 'accountNumber',
        },
        {
            title: '开户行',
            dataIndex: 'accountBank',
        },
        {
            title: '操作',
            valueType: 'option',
            render: (val, record, index, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        // console.log(action);
                        action?.startEditable?.(index);
                    }}
                >
                    编辑
                </a>,
                // <a
                //     key="delete"
                //     onClick={() => {
                //         setDataSource(dataSource.filter((item) => item.id !== index));
                //     }}
                // >
                //     删除
                // </a>,
            ],
        },
    ];

    //新增渠道接口
    const insertChannelAjax = async (params) => {
        await insertChannel(params);
        getChannelsAjax();
    };

    //编辑聚到接口
    const updateChannelAjax = async (params) => {
        await updateChannel(params);
        getChannelsAjax();
    };

    const addClick = () => {};

    const handleShowClick = () => {
        props.showPlaceManageModal(false);
        setIsModalVisible(true);
    };

    useEffect(() => {
        if (props.visible) {
            getChannelsAjax();
            getChannelTypesAjax();
        }
    }, [props.visible]);

    return (
        <>
            <Modal
                title={
                    <>
                        <LeftOutlined onClick={handleShowClick} style={{ marginRight: 8 }} />
                        <span>渠道管理</span>
                    </>
                }
                visible={props.visible}
                onOk={props.onOk}
                onCancel={props.onCancel}
                width="920px"
                footer={null}
                destroyOnClose
            >
                <EditableProTable
                    loading={loading}
                    columns={columns}
                    value={dataSource}
                    scroll={{ y: 500 }}
                    // onChange={setDataSource}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        onSave: (rowKey, data, row) => {
                            console.log(rowKey, data, row, 123);
                            //编辑时保存
                            if (data.channelId) {
                                data.index = undefined;
                                data.channelTypeName = undefined;
                                data.createTime = undefined;
                                data.updateTime = undefined;
                                updateChannelAjax(data);
                            } else {
                                data.index = undefined;
                                //新增渠道
                                insertChannelAjax(data);
                            }
                        },
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, dom) => [dom.save, dom.cancel],
                    }}
                    bordered
                />
            </Modal>
        </>
    );
};

export default ModalPlaceManage;
