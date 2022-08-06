import React, { useEffect, useState, createContext } from 'react';
import { Button, Space, Table, Popconfirm, message, Row, Col, Input, Select } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ModalIncrease from './ModalAdd';
import { getCookie } from '@/utils/utils';
import { getAllCustomerSale, deleteSalesman } from '../../service';
export const CountContext = createContext();
import BatchUpload from '@/pages/components/batchUpload';
import { exportFile } from '@/utils/file';

const { Option } = Select;
const EconomyConfig = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [batchUploadModalFlag, setbatchUploadModalFlag] = useState(false);
    const [pageData, setpageData] = useState({
        pageNum: 1,
        pageSize: 10,
    });
    const [total, settotal] = useState(0);
    const [searchParams, setsearchParams] = useState({});

    //删除操作
    const handleClick = async (record) => {
        console.log(record.customerSaleId);
        await deleteSalesmanAjax(record.customerSaleId);
        getAllCustomerSaleAjax();
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const clickAdd = () => {
        setIsModalVisible(true);
    };

    //查询客户关联渠道
    const getAllCustomerSaleAjax = async () => {
        setLoading(true);
        const res = await getAllCustomerSale({ ...pageData, ...searchParams });
        if (res.code == 1001) {
            setpageData({ ...pageData });
            settotal(res.data?.total);
            setDataSource([...res?.data.list] || '');
        }
        setLoading(false);
    };

    const handleChangePage = (current, size) => {
        pageData.pageNum = current;
        pageData.pageSize = size;
        getAllCustomerSaleAjax();
    };

    //删除客户关联渠道
    const deleteSalesmanAjax = async (params) => {
        setLoading(true);
        const res = await deleteSalesman({
            customerSaleId: params,
        });
        if (res.code == 1001) {
            message.success(res.message);
        } else {
            message.error(res.message);
        }
        setLoading(false);
    };

    const columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
        },
        {
            title: '经纪人',
            dataIndex: 'salesmanName',
        },
        {
            title: '经纪人类型',
            dataIndex: 'salesmanType',
        },
        {
            title: '渠道类型',
            dataIndex: 'channelTypeName',
        },
        {
            title: '渠道名称',
            dataIndex: 'channelName',
        },
        {
            title: '新增日期',
            dataIndex: 'updateTime',
        },
        {
            title: '操作',
            render: (text, record) => (
                <Space>
                    <Popconfirm
                        title="确定要删除吗?"
                        onConfirm={() => handleClick(record)}
                        okText="是"
                        cancelText="否"
                    >
                        <a>删除</a>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleUpload = () => {
        setbatchUploadModalFlag(true);
    };

    const closeModal = () => {
        setbatchUploadModalFlag(false);
    };

    const handleDownload = async () => {
        let params = {
            url: `${BASE_PATH.adminUrl}/mrp_analysis/hdCustomerSale/downloadTemplate`,
            // https://vipdevfunds.simu800.com/
            fileNames: '批量导入模板',
            req: 'get',
            tokenId: getCookie('vipAdminToken') || '',
        };
        exportFile(params);
    };

    useEffect(() => {
        if (!batchUploadModalFlag) onRest();
    }, [batchUploadModalFlag]);

    useEffect(() => {
        if (isModalVisible) onRest();
    }, [isModalVisible]);

    const onSearchChange = (value, type) => {
        searchParams[type] = value;
        setsearchParams({ ...searchParams });
    };

    // 查询
    const onSearch = () => {
        getAllCustomerSaleAjax();
    };

    // 重置
    const onRest = () => {
        for (let key in searchParams) {
            delete searchParams[key];
        }
        setsearchParams({});
        getAllCustomerSaleAjax();
    };

    return (
        <div>
            <Row style={{ marginBottom: 16 }}>
                <Col span={8}>
                    客户名称：
                    <Input
                        style={{ marginRight: 16, marginBottom: 16, width: '60%' }}
                        placeholder="请输入客户名称"
                        onChange={(e) => onSearchChange(e.target.value, 'customerName')}
                        value={searchParams.customerName}
                    />
                </Col>
                <Col span={8}>
                    经纪人：
                    <Input
                        style={{ marginRight: 16, marginBottom: 16, width: '60%' }}
                        placeholder="请输入经纪人"
                        onChange={(e) => onSearchChange(e.target.value, 'salesmanName')}
                        value={searchParams.salesmanName}
                    />
                </Col>
                <Col span={8}>
                    渠道类型：
                    <Select
                        style={{ marginRight: 16, marginBottom: 16, width: '60%' }}
                        placeholder="请选择类型"
                        onChange={(val) => onSearchChange(val, 'channelType')}
                        value={searchParams.channelType}
                    >
                        <Option value={0}>直销</Option>
                        <Option value={1}>代销</Option>
                        <Option value={2}>合作方</Option>
                    </Select>
                </Col>
                <Col span={8}>
                    渠道名称：
                    <Input
                        style={{ marginRight: 16, width: '60%' }}
                        placeholder="请选择渠道名称"
                        onChange={(e) => onSearchChange(e.target.value, 'channelName')}
                        value={searchParams.channelName}
                    />
                </Col>
                <Col span={8}>
                    <Button style={{ marginRight: 16 }} type="primary" onClick={onSearch}>
                        查询
                    </Button>
                    <Button onClick={onRest}>重置</Button>
                </Col>
            </Row>
            <Button
                icon={<PlusOutlined />}
                type="primary"
                style={{ marginRight: 16, marginBottom: 16 }}
                onClick={clickAdd}
            >
                新建
            </Button>
            <Button
                icon={<UploadOutlined />}
                type="primary"
                style={{ marginBottom: 16 }}
                onClick={handleUpload}
            >
                批量上传
            </Button>
            <Table
                columns={columns}
                dataSource={dataSource}
                loading={loading}
                bordered
                pagination={{
                    total,
                    pageSize: pageData.pageSize,
                    current: pageData.pageNum,
                    onChange: handleChangePage,
                }}
            />
            <CountContext.Provider value={{ isModalVisible, setIsModalVisible }}>
                <ModalIncrease
                    visible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    isModalShow={(data) => setIsModalVisible(data)}
                />
            </CountContext.Provider>
            {batchUploadModalFlag && (
                <BatchUpload
                    accept=".xlsx,.xls"
                    fileFormat=".xls, .xlsx"
                    modalFlag={batchUploadModalFlag}
                    closeModal={closeModal}
                    templateMsg="模板下载"
                    templateUrl={<a onClick={handleDownload}>模板下载</a>}
                    onOk={closeModal}
                    url="/mrp_analysis/hdCustomerSale/exportExcel"
                />
            )}
        </div>
    );
};

export default EconomyConfig;
