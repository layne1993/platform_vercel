import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Card, Modal, Button, Space } from 'antd';
import MXTable from '@/pages/components/MXTable';
import EditModal from './components/EditModal';
import _styles from './index.less';

const UnderwriterMaintenance = (props) => {
    const { dispatch, tableLoading, submitLoading, staggingUnderwriter } = props;
    const { underwriterPageNum, underwriterPageSize, underwriterList, underwriterTotal } = staggingUnderwriter;

    const [createModalIsVisible, toggleCreateModal] = useState(false);
    const [editModalIsVisible, toggleEditModal] = useState(false);
    const [editData, setEditData] = useState({});

    const onEdit = useCallback((row) => {
        const { underwriterId, underwriterName, account, password } = row;
        setEditData({
            underwriterId,
            underwriterName,
            account,
            password,
            password1: password
        });
        toggleEditModal(true);
    }, []);

    const columns = [{
        title: '承销商名称',
        dataIndex: 'underwriterName',
        align: 'left'
    }, {
        title: '承销商账号',
        dataIndex: 'account',
        align: 'left'
    }, {
        title: '操作',
        align: 'center',
        width: 300,
        render: (val, row) => {
            return (
                <div className={_styles.operationBox}>
                    <span onClick={() => onEdit(row)}>编辑</span>
                </div>
            );
        }
    }];

    const onChangePage = (p) => {
        dispatch({
            type: 'staggingUnderwriter/updateModelData',
            payload: {
                underwriterPageNum: p.current,
                underwriterPageSize: p.pageSize
            }
        });
    };

    const handleSubmit = useCallback(async (formData) => {
        const res = await dispatch({
            type: 'staggingUnderwriter/updateUnderwriter',
            payload: formData
        });
        if (res.code === 1008) {
            message.success('编辑成功');
            toggleEditModal(false);
            dispatch({
                type: 'staggingUnderwriter/getUnderwriterList',
                payload: {
                    pageNum: underwriterPageNum,
                    pageSize: underwriterPageSize
                }
            });
        } else {
            message.error(res.message);
        }
    }, [dispatch, underwriterPageNum, underwriterPageSize]);

    useEffect(() => {
        const fetchData = () => {
            dispatch({
                type: 'staggingUnderwriter/getUnderwriterList',
                payload: {
                    pageNum: underwriterPageNum,
                    pageSize: underwriterPageSize
                }
            });
        };
        fetchData();
    }, [dispatch, underwriterPageNum, underwriterPageSize]);

    return (
        <div className={_styles.underwriterWrapper}>
            <Modal
                centered
                destroyOnClose
                maskClosable={false}
                visible={createModalIsVisible}
                width={400}
                title="承销商数据创建"
                onCancel={() => toggleCreateModal(false)}
                onOk={() => toggleCreateModal(false)}
            >
                <p>
                    如需创建承销商，请将承销商提供的模板zip发送到ipo@meix.com；预计4小时内创建完毕，紧急联系电话 400－633－4449
                </p>
            </Modal>

            <EditModal
                isVisible={editModalIsVisible}
                submitLoading={submitLoading}
                formData={editData}
                onCancel={() => toggleEditModal(false)}
                onConfirm={handleSubmit}
            />

            <Space style={{ marginBottom: '20px' }}>
                <Button
                    type="primary"
                    onClick={() => toggleCreateModal(true)}
                >
                    + 新建
                </Button>
            </Space>
            <MXTable
                loading={tableLoading}
                columns={columns}
                dataSource={underwriterList}
                total={underwriterTotal}
                pageNum={underwriterPageNum}
                scroll={{ x: '100%' }}
                sticky
                onChange={onChangePage}
                rowKey="underwriterId"
                rowSelection={null}
            />
        </div>
    );
};

export default connect(({ staggingUnderwriter, loading }) => ({
    tableLoading: loading.effects['staggingUnderwriter/getUnderwriterList'],
    submitLoading: loading.effects['staggingUnderwriter/updateUnderwriter'],
    staggingUnderwriter
}))(UnderwriterMaintenance);
