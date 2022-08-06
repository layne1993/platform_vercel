import React, { useState, useEffect, useCallback } from 'react';
import { message, Modal, Table, Button, Select, Divider } from 'antd';
import { getSubInvestorList, updatePrivateMoney, deleteInvestorLvel } from '../../service';
const { Option } = Select;

const InvestorList = (props) => {
    const {
        layer,
        bizKey,
        productId,
        amountTypeList,
        joinTypeList,
        refreshList,
        isVisible,
        onCancel,
        onCreateOrEdit,
        onMaintain,
        onDelete
    } = props;
    const [tableLoading, setTableLoading] = useState(false);
    const [subInvestorList, setSubInvestorList] = useState([]);

    const getSubList = useCallback(async () => {
        const res: any = await getSubInvestorList({
            parentId: bizKey,
            productId
        });
        if (res && res.code === 1008) {
            setSubInvestorList(res.data);
        }
    }, [bizKey, productId]);

    const handleDelete = useCallback((row) => {
        const { id } = row;
        Modal.confirm({
            title: '是否删除该出资方？',
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const res: any = await deleteInvestorLvel({
                    id
                });
                console.log(res);
                if (res.code === 1008) {
                    message.success('删除成功');
                    getSubList();
                    onDelete();
                } else {
                    message.error(res.msg || '删除失败');
                }
            }
        });
    }, [getSubList]);

    // const handleChangePrivateMoney = useCallback(async (row, key, value) => {
    //     const { productId, level, id, isPrivateMoney, investAmountType, lpInvestType } = row;
    //     setTableLoading(true);
    //     const params = {
    //         productId,
    //         bizKey: `${level}-${id}`,
    //         isPrivateMoney,
    //         lpInvestType,
    //         investAmountType
    //     };
    //     params[key] = value;
    //     const res: any = await updatePrivateMoney(params);

    //     setTableLoading(false);
    //     if (res.code === 1008) {
    //         setSubInvestorList(subInvestorList.map((item) => {
    //             if (item.level === level && item.id === id) item[key] = value;
    //             return item;
    //         }));
    //     }
    // }, [subInvestorList]);

    const columns: any = [
        {
            title: '出资方名称',
            dataIndex: 'lpName',
            align: 'center',
            width: 100,
            fixed: 'left'
        },
        {
            title: '是否为自有资金',
            dataIndex: 'isPrivateMoney',
            align: 'center',
            width: 80,
            fixed: 'left',
            render: (val, row) => {
                return val === 1 ? '是' : '否';
                // if (!row.productId) return <></>;
                // return (
                //     <Select defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'isPrivateMoney', value)}>
                //         <Select.Option value={1}>是</Select.Option>
                //         <Select.Option value={0}>否</Select.Option>
                //     </Select>
                // );
            }
        },
        // {
        //     title: '资金类型',
        //     dataIndex: 'investAmountType',
        //     align: 'center',
        //     width: 180,
        //     render: (val, row) => {
        //         if (!row.productId) return <></>;
        //         return (
        //             <Select defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'investAmountType', value)}>
        //                 {amountTypeList.map((item, index) => (
        //                     <Option key={index} value={item.value}>{item.label}</Option>
        //                 ))}
        //             </Select>
        //         );
        //     }
        // },
        // {
        //     title: '参与类型',
        //     dataIndex: 'lpInvestType',
        //     align: 'center',
        //     width: 200,
        //     render: (val, row) => {
        //         if (!row.productId) return <></>;
        //         return (
        //             <Select defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'lpInvestType', value)}>
        //                 {joinTypeList.map((item, index) => (
        //                     <Option key={index} value={item.value}>{item.label}</Option>
        //                 ))}
        //             </Select>
        //         );
        //     }
        // },
        {
            title: '为配售对象的第几层出资方',
            dataIndex: 'level',
            width: 100,
            align: 'center'
        },
        {
            title: '出资方身份证明号码（组织机构代码证号/身份证号）',
            dataIndex: 'cardNumber',
            width: 200,
            align: 'center'
        },
        {
            title: '出资份额',
            dataIndex: 'amount',
            width: 100,
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 200,
            fixed: 'right',
            render: (val, row) => {
                const { isPrivateMoney } = row;
                return (
                    <>
                        {isPrivateMoney === 0 && <span style={{ color: '#3D7FFF', cursor: 'pointer' }} onClick={() => onMaintain(row)}>维护{row.level + 1}层出资方</span>}
                        {isPrivateMoney === 0 && <Divider type="vertical"></Divider>}
                        {row.isSysData === '0' &&
                            <>
                                <span style={{ color: '#3D7FFF', cursor: 'pointer' }} onClick={() => onCreateOrEdit(row)}>编辑</span>
                                <Divider type="vertical"></Divider>
                                <span style={{ color: '#3D7FFF', cursor: 'pointer' }} onClick={() => handleDelete(row)}>删除</span>
                            </>
                        }
                    </>
                );
            }
        }
    ];

    useEffect(() => {
        getSubList();
    }, [getSubList]);

    useEffect(() => {
        if (refreshList) getSubList();
    }, [getSubList, refreshList]);

    return (
        <Modal
            title={`请维护第${layer}层出资方`}
            width={'80%'}
            visible={isVisible}
            onCancel={onCancel}
            footer={false}
        >
            <Table
                style={{ marginBottom: '40px' }}
                columns={columns}
                dataSource={subInvestorList}
                loading={tableLoading}
                pagination={false}
                scroll={{ x: '100%' }}
                rowKey="id"
            />
            <Button
                type="primary"
                style={{ float: 'right', marginTop: '-20px' }}
                onClick={() => onCreateOrEdit()}
            >
                新增出资方
            </Button>
        </Modal>
    );
};

export default InvestorList;
