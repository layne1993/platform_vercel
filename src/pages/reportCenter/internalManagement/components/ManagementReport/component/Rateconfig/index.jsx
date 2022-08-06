import React, { useEffect, useState } from 'react';
import { Button, Space, Table, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ModalAdd from './ModalAdd';
import { getAllProductFeeRate, deleteProductFeeRate } from '../../service';

const RateConfig = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const clickShowModal = () => {
        setIsModalVisible(true);
    };

    //查询所有产品费率配置
    const getAllProductFeeRateAjax = async () => {
        setLoading(true);
        const res = await getAllProductFeeRate({});
        if (res.code == 1001) {
            setDataSource([...res.data.list] || '');
        }
        setLoading(false);
    };

    //删除产品费率配置接口
    const deleteProductFeeRateAjax = async (param) => {
        const res = await deleteProductFeeRate({
            feeRateId: param
        });
        if (res.code == 1001) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
    };

    //表单删除
    const handleDelete = async (record) => {
        await deleteProductFeeRateAjax(record.feeRateId);
        getAllProductFeeRateAjax();
    };

    useEffect(() => {
        getAllProductFeeRateAjax();
    }, [isModalVisible]);

    const columns = [
        {
            title: '产品名称',
            dataIndex: 'productFullName',
            width: '100px',
            ellipsis: true
        },
        {
            title: '备案编号',
            dataIndex: 'fundRecordNumber',
            width: '100px'
        },
        {
            title: '认购费率',
            dataIndex: 'subscriptionRate',
            width: '100px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '申购费率',
            dataIndex: 'repeatSubscriptionRate',
            width: '100px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '赎回费率',
            dataIndex: 'redemptionRate',
            width: '100px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '管理费率',
            dataIndex: 'managementFeeRate',
            width: '100px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '业绩报酬率',
            dataIndex: 'performanceRewardRate',
            width: '120px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '税率',
            dataIndex: 'taxRate',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '认购费提成比例',
            dataIndex: 'subscriptionRoyaltyRate',
            width: '150px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '申购费提成比例',
            dataIndex: 'repeatSubscriptionRoyaltyRate',
            width: '150px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '赎回费提成比例',
            dataIndex: 'redemptionRoyaltyRate',
            width: '150px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '管理费提成比例',
            dataIndex: 'managementFeeRoyaltyRate',
            width: '150px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '业绩报酬提成比例',
            dataIndex: 'performanceRewardRoyaltyRate',
            width: '150px',
            render: (val) => (val ? val + '%' : '--')
        },
        {
            title: '渠道类型',
            dataIndex: 'channelTypeName'
        },
        {
            title: '渠道名称',
            dataIndex: 'channelName'
        },
        {
            title: '经纪人类型',
            dataIndex: 'salesmanType',
            width: '100px'
        },
        {
            title: '经纪人',
            dataIndex: 'salesmanName'
        },
        {
            title: '操作',
            render: (val, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗"
                        okText="是"
                        cancelText="否"
                        onConfirm={() => handleDelete(record)}
                    >
                        <a href="#">删除</a>
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div>
            <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{ marginRight: 16, marginBottom: 16 }}
                onClick={clickShowModal}
            >
                新建
            </Button>
            {/* <Button icon={<UploadOutlined />} type="primary" style={{ marginBottom: 16 }} onClick={clickUpload}>
                批量上传
            </Button> */}
            <Table
                columns={columns}
                dataSource={dataSource}
                scroll={{ x: 2000 }}
                loading={loading}
                bordered
            />
            <ModalAdd visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} />
        </div>
    );
};

export default RateConfig;
