import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
    Form,
    Row,
    Col,
    Input,
    DatePicker,
    Select,
    Checkbox,
    Divider,
    Button,
    Space,
    Table,
    Tag
} from 'antd';
import styles from './index.less';
import {
    selectProductsInfo,
    getChannels,
    getAllSalesman,
    selectCustomersInfo,
    createExcel,
    feeListqurry,
    downLoad,
    deleteList
} from '../../service';
import { SearchOutlined } from '@ant-design/icons';
import { exportFileBlob } from '@/utils/fileBlob';

const { RangePicker } = DatePicker;

const CreateCost = () => {
    const [productList, setProductList] = useState([]); //产品名称
    const [channelList, setChannelList] = useState([]); //渠道名称
    const [saleManList, setSaleManList] = useState([]); //经纪人
    const [customerNameList, setCustomerNameList] = useState([]); //客户名称
    const [flagChannel, setFlagChannel] = useState(true); //控制表单校验规则是否生效
    const [flagSaleMan, setFlagSaleMan] = useState(true);
    const [dataSource, setDataSource] = useState([]); //表格数据
    const [loading, setLoading] = useState(false);
    const [BtnLoading, setBtnLoading] = useState(false);
    const [inputText, setInputText] = useState(null);
    const [isDisable, setIsDisable] = useState(false);

    const option = [
        {
            label: '管理费',
            value: 1
        },
        {
            label: '申购费',
            value: 2
        },
        {
            label: '业绩报酬',
            value: 3
        }
    ];

    const [form] = Form.useForm();

    const layout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 16 }
    };
    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 }
    };

    //查询产品信息接口
    const selectProductsInfoAjax = async () => {
        const res = await selectProductsInfo({});
        if (res.code == 1001) {
            setProductList([...res.data.list] || '');
        }
    };

    //查询渠道名称接口
    const getChannelsAjax = async () => {
        const res = await getChannels({});
        if (res.code == 1001) {
            setChannelList([...res.data.list] || '');
        }
    };

    //查询经济人名称
    const getAllSalesmanAjax = async () => {
        const res = await getAllSalesman({});
        if (res.code == 1001) {
            setSaleManList([...res.data.list] || '');
        }
    };

    //查询客户名称
    const selectCustomersInfoAjax = async () => {
        const res = await selectCustomersInfo({});
        if (res.code == 1001) {
            setCustomerNameList([...res.data.list] || '');
        }
    };

    //生成列表
    const createExcelAjax = async (params) => {
        setIsDisable(true);
        setBtnLoading(true);
        const res = await createExcel(params);
        feeListqurryAjax();
        setBtnLoading(false);
        setIsDisable(false);
    };

    //生成表单
    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log(values);
            values.feeType = JSON.stringify(values.feeType);
            if (values.date) {
                values.date = [
                    values.date[0].format('YYYY-MM-DD'),
                    values.date[1].format('YYYY-MM-DD')
                ];
                values.startDate = values.date[0];
                values.endDate = values.date[1];
            }
            const { date, ...paramsValue } = values;
            paramsValue.channelId = values.channelId || '';
            paramsValue.customerIds = values.customerIds || [];
            paramsValue.productIds = values.productIds || [];
            createExcelAjax(paramsValue);
        });
    };

    //查询列表
    const feeListqurryAjax = async (params) => {
        setLoading(true);
        const res = await feeListqurry(params);
        if (res.code == 1001) {
            setDataSource(res.data || '');
        }
        setLoading(false);
    };

    //点击回车
    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            const value = {
                batchName: e.target.value
            };
            feeListqurryAjax(value);
        }
    };

    //重置
    const handleReset = () => {
        form.resetFields();
        setFlagSaleMan(true);
        setFlagChannel(true);
        feeListqurryAjax();
    };

    //下载接口
    const downLoadAjax = async (params) => {
        const res = await downLoad(params);
        exportFileBlob(res.data, '批次列表文件.xlsx');
    };

    //删除接口
    const deleteListAjax = async (params) => {
        const res = await deleteList({
            id: params
        });
    };

    //点击下载
    const handleUpload = (record) => {
        console.log(record);
        const val = {
            fileUrl: record.fileUrl,
            batchName: record.batchName
        };
        downLoadAjax(val);
    };

    //点击删除
    const handleDelete = (record) => {
        deleteListAjax(record.id);
        feeListqurryAjax();
    };

    const channelSelect = (e) => {
        if (e) {
            setFlagSaleMan(false);
        } else {
            setFlagSaleMan(true);
        }
        console.log(e);
    };

    const saleManSelect = (e) => {
        if (e) {
            setFlagChannel(false);
        } else {
            setFlagChannel(true);
        }
        console.log(e);
    };

    const searchClick = () => {
        const val = {
            batchName: inputText
        };
        feeListqurryAjax(val);
    };

    useEffect(() => {
        selectProductsInfoAjax();
        getChannelsAjax();
        getAllSalesmanAjax();
        selectCustomersInfoAjax();
        feeListqurryAjax();
    }, []);

    const columns = [
        {
            title: '生成批次名称',
            dataIndex: 'batchName',
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '费用统计起止日期',
            dataIndex: 'startDateAndEndDate',
            width: '150px',
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            ellipsis: true,
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            ellipsis: true,
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '经纪人',
            dataIndex: 'salesmanName',
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '渠道类型',
            dataIndex: 'channelType',
            render: (val) => {
                if (val == 0) {
                    return '直销';
                }
                if (val == 1) {
                    return '代销';
                }
                if (val == 2) {
                    return '综销';
                } else {
                    return '--';
                }
            }
        },
        {
            title: '渠道名称',
            dataIndex: 'channelName',
            render: (val) => {
                return val || '--';
            }
        },
        {
            title: '生成日期',
            dataIndex: 'createTime',
            render: (val) => {
                return val ? moment(val).format('YYYY-MM-DD') : '--';
            }
        },
        {
            title: '费用类型',
            dataIndex: 'feeType',
            width: '220px',
            render: (tags) => (
                <>
                    {JSON.parse(tags).map((tag) => {
                        if (tag == 1) {
                            return <Tag color="blue">{'管理费'}</Tag>;
                        }
                        if (tag == 2) {
                            return <Tag color="blue">{'申购费'}</Tag>;
                        }
                        if (tag == 3) {
                            return <Tag color="blue">{'业绩报酬'}</Tag>;
                        }
                    })}
                </>
            )
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (val) =>
                val == 2 ? (
                    <div>
                        <div className={styles.success}></div>
                        <span style={{ marginLeft: '20px' }}>生成成功</span>
                    </div>
                ) : (
                    <div>
                        <div className={styles.defeat}></div>
                        <span style={{ marginLeft: '20px' }}>生成失败</span>
                    </div>
                )
        },
        {
            title: '操作',
            render: (val, record, index) =>
                record.status == 2 ? (
                    <Space>
                        <a onClick={() => handleUpload(record)}>下载</a>
                    </Space>
                ) : (
                    <Space>
                        <a onClick={() => handleDelete(record)}>删除</a>
                    </Space>
                )
        }
    ];

    return (
        <div className={styles.container}>
            <div className={styles.title}>生成费用表</div>
            <Form {...layout} form={form}>
                <Row>
                    <Col span={10}>
                        <Form.Item
                            label="生成批次名称"
                            name="batchName"
                            rules={[{ required: 'true', message: '请填写生成批次名称' }]}
                        >
                            <Input placeholder="请输入"></Input>
                        </Form.Item>
                        <Form.Item label="产品名称" name="productIds">
                            <Select
                                placeholder="请选择"
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : ''
                                }
                            >
                                {productList.map((item) => (
                                    <Select.Option key={item.productId} value={item.productId}>
                                        {item.productFullName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="经纪人"
                            name="salesmanId"
                            rules={
                                flagSaleMan
                                    ? [
                                        {
                                            required: true,
                                            message: '渠道名称和经纪人名称至少且只能选择一个'
                                        }
                                    ]
                                    : ''
                            }
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                onChange={saleManSelect}
                                disabled={!flagSaleMan ? true : false}
                            >
                                {saleManList.map((item) => (
                                    <Select.Option key={item.salesmanId} value={item.salesmanId}>
                                        {item.salesmanName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="生成包含类型"
                            name="feeType"
                            rules={[{ required: true, message: '请至少选择一个类型' }]}
                        >
                            <Checkbox.Group options={option} defaultValue={option}></Checkbox.Group>
                        </Form.Item>
                    </Col>
                    <Col span={10}>
                        <Form.Item label="费用统计日期" name="date">
                            <RangePicker style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="渠道名称"
                            name="channelId"
                            rules={
                                flagChannel
                                    ? [
                                        {
                                            required: true,
                                            message: '渠道名称和经纪人名称至少且只能选择一个'
                                        }
                                    ]
                                    : ''
                            }
                        >
                            <Select
                                allowClear
                                placeholder="请选择"
                                onChange={channelSelect}
                                disabled={!flagChannel ? true : false}
                            >
                                {channelList.map((item) => (
                                    <Select.Option key={item.channelId} value={item.channelId}>
                                        {item.channelName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="客户名称" name="customerIds">
                            <Select
                                placeholder="请选择"
                                mode="multiple"
                                showSearch
                                filterOption={(input, option) =>
                                    option ? option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0 : ''
                                }
                            >
                                {customerNameList.map((item) => (
                                    <Select.Option key={item.customerId} value={item.customerId}>
                                        {item.customerName}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <Button
                onClick={handleSubmit}
                type="primary"
                style={{ marginRight: '16px', marginLeft: 163 }}
                loading={BtnLoading}
            >
                生成表单
            </Button>
            <Button onClick={handleReset}>重置</Button>
            <Divider />
            <Row style={{ marginBottom: 16 }}>
                <Col span={16}>生成批次列表记录</Col>
                <Col span={8}>
                    <Input
                        onKeyDown={(e) => {
                            handleKeyDown(e);
                        }}
                        disabled={isDisable}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="请输入生成批次报告名称查询"
                        suffix={<SearchOutlined onClick={searchClick} />}
                    ></Input>
                </Col>
            </Row>
            <Table columns={columns} dataSource={dataSource} loading={loading} bordered />
        </div>
    );
};

export default CreateCost;
