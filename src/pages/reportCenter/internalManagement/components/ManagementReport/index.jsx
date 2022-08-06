import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Input, DatePicker, Button, Radio, Table, Select } from 'antd';
import { SettingOutlined, DownloadOutlined, createFromIconfontCN } from '@ant-design/icons';
import {
    tradeRecordFee,
    shareRecordFee,
    exportTradeRecordFee,
    exportShareRecordFee
} from './service';
import moment from 'moment';
import { exportFileBlob } from '@/utils/fileBlob';
import MXTable from '@/pages/components/MXTable';
import styles from './index.less';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_2951786_us3omrrnrdp.js'
    // scriptUrl的值是从阿里图标库中复制过来的，每次添加了图标都要重新复制新的链接
});

const { RangePicker } = DatePicker;

const columns = [
    {
        title: '客户名称',
        dataIndex: 'customerName',
        ellipsis: true
    },
    {
        title: '证件号码',
        dataIndex: 'cardNumber'
    },
    {
        title: '产品名称',
        dataIndex: 'productFullName',
        ellipsis: true
    },
    {
        title: '交易账号',
        dataIndex: 'tradeAccount',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '交易类型',
        dataIndex: 'tradeTypeName',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '申请日期',
        dataIndex: 'tradeApplyTime',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '确认日期',
        dataIndex: 'tradeTime',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '确认金额',
        dataIndex: 'tradeMoney',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '确认份额',
        dataIndex: 'tradeShare',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '交易净值',
        dataIndex: 'tradeNetValue',
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
        title: '渠道名称',
        dataIndex: 'channelName',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '渠道类型',
        dataIndex: 'channelTypeName',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '业绩报酬',
        dataIndex: 'reward',
        render: (val) => (val ? (val == -1 ? '净值数据不全' : val) : '--')
    },
    {
        title: '业绩报酬率',
        dataIndex: 'performanceRewardRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '申购费',
        dataIndex: 'tradeFare',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '申购费率',
        dataIndex: 'repeatSubscriptionRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '业绩报酬提成比例',
        dataIndex: 'performanceRewardRoyaltyRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '业绩报酬提成',
        dataIndex: 'rewardRoyalty',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '申购费提成比例',
        dataIndex: 'repeatSubscriptionRoyaltyRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '申购费提成',
        dataIndex: 'repeatSubscriptionRoyalty',
        render: (val) => {
            return val || '--';
        }
    }
];

const columsSecond = [
    {
        title: '客户名称',
        dataIndex: 'customerName',
        ellipsis: true,
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '证件号码',
        dataIndex: 'cardNumber',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '产品名称',
        dataIndex: 'productFullName',
        ellipsis: true,
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '份额更新日期',
        dataIndex: 'shareDate',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '更新份额',
        dataIndex: 'tradeShare',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '可用份额',
        dataIndex: 'usableShare',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '当前单位净值',
        dataIndex: 'netValue',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '净值日期',
        dataIndex: 'netDate',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '客户经理',
        dataIndex: 'salesmanName',
        render: (val) => {
            return val || '--';
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
        title: '渠道类型',
        dataIndex: 'channelTypeName',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '管理费率',
        dataIndex: 'managementFeeRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '累计管理费',
        dataIndex: 'managementFee',
        render: (val) => {
            return val || '--';
        }
    },
    {
        title: '管理费提成比例',
        dataIndex: 'managementFeeRoyaltyRate',
        render: (val) => (val ? val + '%' : '--')
    },
    {
        title: '管理费提成',
        dataIndex: 'managementFeeRoyalty',
        render: (val) => {
            return val || '--';
        }
    }
];

const initPageData = {
    // 当前的分页数据
    pageNum: 1,
    pageSize: 20
};

const ManagementReport = (props) => {
    const [flagFirstTab, setFlagFirstTab] = useState(true);
    const [flagSecondTab, setFlagSecondTab] = useState(false);
    const [firstTableList, setFirstTableList] = useState([]);
    const [secondTableList, setSecondTableList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [BtnLoading, setBtnLoading] = useState(false);
    const [pageData, setPageData] = useState({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    });
    const [total, setTotal] = useState(0);
    const [totalLast, setTotalLast] = useState(0);

    const [form] = Form.useForm();
    const formItemLayout = {
        labelCol: { span: 8 },
        wrapperCol: { span: 18 }
    };

    //重置
    const handleReset = () => {
        form.resetFields();
        form.setFieldsValue({
            channelType: ''
        });
        if (flagFirstTab) {
            tradeRecordFeeAjax();
        }
        if (flagSecondTab) {
            shareRecordFeeAjax();
        }
    };

    //费率配置
    const rateConfig = () => {
        props.changId('6');
    };

    //渠道配置
    const clickEconomy = () => {
        props.changId('7');
    };

    //生成费用
    const clickCost = () => {
        props.changId('8');
    };

    //认申赎明细
    const handleClickFirstTab = () => {
        setFlagFirstTab(true);
        setFlagSecondTab(false);
    };

    //份额余额明细
    const handleClickSecondTab = () => {
        setFlagFirstTab(false);
        setFlagSecondTab(true);
    };

    //认申赎明细列表接口
    const tradeRecordFeeAjax = async (params) => {
        setLoading(true);
        const res = await tradeRecordFee({
            ...pageData,
            ...params
        });
        if (res.code == 1001) {
            setFirstTableList([...res.data.list] || '');
            setTotal(res.data.total);
        }
        setLoading(false);
    };

    //份额余额明细列表接口
    const shareRecordFeeAjax = async (params) => {
        setLoading(true);
        const res = await shareRecordFee({
            ...pageData,
            ...params
        });
        if (res.code == 1001) {
            setSecondTableList([...res.data.list] || '');
            setTotalLast(res.data.total);
        }
        setLoading(false);
    };

    const dateTransform = (values) => {
        if (values.tradeApplyTime) {
            values.tradeApplyTime = [
                values.tradeApplyTime[0].format('YYYY-MM-DD'),
                values.tradeApplyTime[1].format('YYYY-MM-DD')
            ];
        }
        if (values.tradeTime) {
            values.tradeTime = [
                values.tradeTime[0].format('YYYY-MM-DD'),
                values.tradeTime[1].format('YYYY-MM-DD')
            ];
        }

        values.tradeApplyTimeStart = values.tradeApplyTime ? values.tradeApplyTime[0] : '';
        values.tradeApplyTimeEnd = values.tradeApplyTime ? values.tradeApplyTime[1] : '';
        values.tradeTimeStart = values.tradeTime ? values.tradeTime[0] : '';
        values.tradeTimeEnd = values.tradeTime ? values.tradeTime[1] : '';
        const { tradeApplyTime, tradeTime, ...paramsValue } = values;
        return paramsValue;
    };

    const updatetransform = (values) => {
        if (values.shareDate) {
            values.shareDate = [
                values.shareDate[0].format('YYYY-MM-DD'),
                values.shareDate[1].format('YYYY-MM-DD')
            ];
        }
        values.shareDateStart = values.shareDate ? values.shareDate[0] : '';
        values.shareDateEnd = values.shareDate ? values.shareDate[1] : '';
        const { shareDate, ...paramsValue } = values;
        return paramsValue;
    };

    //点击查询列表
    const handleSearch = () => {
        if (flagFirstTab) {
            form.validateFields().then((values) => {
                const dataInfo = dateTransform(values);
                tradeRecordFeeAjax(dataInfo);
            });
        }
        if (flagSecondTab) {
            form.validateFields().then((values) => {
                // const dataInfo = updatetransform(values);
                shareRecordFeeAjax(values);
            });
        }
    };

    //认申赎明细导出Excel接口
    const exportTradeRecordFeeAjax = async (params) => {
        setBtnLoading(true);
        const res = await exportTradeRecordFee(params);
        res && exportFileBlob(res.data, '认申赎明细列表文件.xlsx');
        setBtnLoading(false);
    };

    //份额余额明细导出Excel接口
    const exportShareRecordFeeAjax = async (params) => {
        setBtnLoading(true);
        const res = await exportShareRecordFee(params);
        res && exportFileBlob(res.data, '份额余额明细列表文件.xlsx');
        setBtnLoading(false);
    };

    //导出Excel
    const handleExport = () => {
        if (flagFirstTab) {
            form.validateFields().then((values) => {
                const dataInfo = dateTransform(values);
                exportTradeRecordFeeAjax(dataInfo);
            });
        }
        if (flagSecondTab) {
            form.validateFields().then((values) => {
                const dataInfo = updatetransform(values);
                exportShareRecordFeeAjax(dataInfo);
            });
        }
    };

    const onTableChange = (data) => {
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setPageData({ ...pageData });
        form.validateFields().then((values) => {
            const dataInfo = dateTransform(values);
            tradeRecordFeeAjax(dataInfo);
        });
    };

    const onSecondTableChange = (data) => {
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setPageData({ ...pageData });
        form.validateFields().then((values) => {
            const dataInfo = dateTransform(values);
            shareRecordFeeAjax(dataInfo);
        });
    };

    useEffect(() => {
        form.resetFields();
        form.setFieldsValue({
            channelType: ''
        });
    }, [flagFirstTab, flagSecondTab]);

    useEffect(() => {
        tradeRecordFeeAjax();
    }, [flagFirstTab]);

    useEffect(() => {
        shareRecordFeeAjax();
    }, [flagSecondTab]);

    return (
        <div>
            <Form form={form} initialValues={{}} {...formItemLayout}>
                <Row>
                    <Col span={8}>
                        <Form.Item label="产品名称" name="productFullName">
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="渠道类型" name="channelType" initialValue={0}>
                            <Select allowClear>
                                <Select.Option key={0} value={0}>
                                    直销
                                </Select.Option>
                                <Select.Option key={1} value={1}>
                                    代销
                                </Select.Option>
                                <Select.Option key={2} value={2}>
                                    综销
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col span={8}>
                        <Form.Item label="经纪人" name="salesmanName">
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="客户名称" name="customerName">
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="渠道名称" name="channelName">
                            <Input placeholder="请输入" />
                        </Form.Item>
                    </Col>

                    <Col span={8} style={{ textAlign: 'right' }}>
                        <Button type="primary" onClick={handleSearch}>
                            查询
                        </Button>
                        <Button style={{ marginLeft: 16 }} onClick={handleReset}>
                            重置
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button.Group>
                            <Button
                                icon={<SettingOutlined />}
                                type="primary"
                                style={{ marginRight: 16 }}
                                onClick={rateConfig}
                                className={styles.btnBox}
                            >
                                费率配置
                            </Button>
                            <Button
                                icon={<SettingOutlined />}
                                type="primary"
                                style={{ marginRight: 16 }}
                                onClick={clickEconomy}
                                className={styles.btnBox}
                            >
                                经纪人渠道配置
                            </Button>
                            <Button
                                icon={
                                    <IconFont type="icon-shengcheng" style={{ color: 'white' }} />
                                }
                                type="primary"
                                style={{ marginRight: 16 }}
                                onClick={clickCost}
                                className={styles.btnBox}
                            >
                                生成费用表
                            </Button>
                            <Button
                                icon={<DownloadOutlined />}
                                type="primary"
                                style={{ marginRight: 16 }}
                                onClick={handleExport}
                                loading={BtnLoading}
                                className={styles.btnBox}
                            >
                                导出Excel
                            </Button>
                        </Button.Group>
                    </Col>
                </Row>
                <Row style={{ marginTop: 16 }}>
                    <Col span={18}>
                        <Radio.Group defaultValue={0}>
                            <Radio.Button value={0} onClick={handleClickFirstTab}>
                                认申赎明细
                            </Radio.Button>
                            <Radio.Button value={1} onClick={handleClickSecondTab}>
                                份额余额明细
                            </Radio.Button>
                        </Radio.Group>
                    </Col>
                    {flagFirstTab && (
                        <>
                            {/* <Col span={6} style={{ textAlign: 'right' }}>
                                <Form.Item label="申请日期" name="tradeApplyTime">
                                    <RangePicker />
                                </Form.Item>
                            </Col> */}
                            <Col span={6} style={{ textAlign: 'right' }}>
                                <Form.Item label="确认日期" name="tradeTime">
                                    <RangePicker />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    {/* {flagSecondTab && (
                        <>
                            <Col span={6}>
                                <Form.Item label="份额更新日期" name="shareDate">
                                    <RangePicker />
                                </Form.Item>
                            </Col>
                        </>
                    )} */}
                </Row>
            </Form>
            {flagFirstTab && (
                <MXTable
                    total={total}
                    pageNum={pageData.pageNum}
                    onChange={onTableChange}
                    columns={columns}
                    dataSource={firstTableList}
                    scroll={{ x: 3000 }}
                    bordered
                    loading={loading}
                ></MXTable>
            )}
            {flagSecondTab && (
                <MXTable
                    style={{ marginTop: 24 }}
                    total={totalLast}
                    pageNum={pageData.pageNum}
                    onChange={onSecondTableChange}
                    columns={columsSecond}
                    dataSource={secondTableList}
                    scroll={{ x: 2000 }}
                    bordered
                    loading={loading}
                ></MXTable>
            )}
        </div>
    );
};

export default ManagementReport;
