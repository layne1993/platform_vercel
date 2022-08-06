import React, { useState, useContext, useEffect } from 'react';
import { Modal } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { CountContext } from '../../index';
import { EditableProTable } from '@ant-design/pro-table';
import { getAllSalesman, addSalesman, updateSalesman } from '../../../../service';

const ModalEonomyManage = (props) => {
    const [editableKeys, setEditableRowKeys] = useState([]);
    const [scaleManList, setScaleManList] = useState([]);
    const [loading, setLoading] = useState(false);
    let { isModalVisible, setIsModalVisible } = useContext(CountContext);

    // const waitTime = (time) => {
    //     return new Promise((resolve) => {
    //         setTimeout(() => {
    //             resolve(true);
    //         }, time);
    //     });
    // };

    const columns = [
        {
            title: '经纪人',
            dataIndex: 'salesmanName',
            editable: (text, record, index) => {
                console.log(index);
                return index >= scaleManList.length;
            },
            formItemProps: (form, { rowIndex }) => {
                return {
                    rules: rowIndex > 2 ? [{ required: true, message: '此项为必填项' }] : [],
                };
            },
        },
        {
            title: '类型',
            dataIndex: 'salesmanType',
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
            ],
        },
    ];

    const handleShowClick = () => {
        props.showModal(false);
        setIsModalVisible(true);
    };

    //查询所有经济人
    const getAllSalesmanAjax = async () => {
        setLoading(true);
        const res = await getAllSalesman({
            pageNum: 1,
            pageSize: 40,
        });
        if (res.code == 1001) {
            setScaleManList([...res?.data.list] || '');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (props.visible) {
            getAllSalesmanAjax();
        }
    }, [props.visible]);

    return (
        <div className="container">
            <Modal
                title={
                    <>
                        <LeftOutlined onClick={handleShowClick} style={{ marginRight: 8 }} />
                        <span>经纪人管理</span>
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
                    scroll={{ y: 500 }}
                    columns={columns}
                    value={scaleManList}
                    // onChange={setDataSource}
                    editable={{
                        type: 'multiple',
                        editableKeys,
                        onSave: async (rowKey, data, row) => {
                            console.log(rowKey, data, row);
                            //编辑时保存
                            if (data.salesmanId) {
                                data.index = undefined;
                                data.createTime = undefined;
                                data.updateTime = undefined;
                                await updateSalesman(data);
                                getAllSalesmanAjax();
                            } else {
                                //新增时保存
                                data.index = undefined;
                                await addSalesman(data);
                                getAllSalesmanAjax();
                            }
                        },
                        onChange: setEditableRowKeys,
                        actionRender: (row, config, dom) => [dom.save, dom.cancel],
                    }}
                    bordered
                />
            </Modal>
        </div>
    );
};

export default ModalEonomyManage;
