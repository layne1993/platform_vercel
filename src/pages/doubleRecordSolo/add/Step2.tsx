import React, { useEffect, useState } from 'react';
import { Form, Row, Col, Select, Input, Button, Spin, Alert, notification } from 'antd';
import MXTable from '@/pages/components/MXTable';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import styles from './styles.less';
import { MultipleSelect } from '@/pages/components/Customize';


type dispatchConfig = {
    type: string;
    callback(any): void;
    payload: any;
};

interface DoubleRecordSoloAddStep2 {
    dispatch: Dispatch;
    closeModal(): void;
    step1Data: any;
    loading: boolean;
    loading2: boolean;
    quertTableData(): void;
}

const { Option } = Select;

const columns: any[] = [
    {
        title: '客户名称',
        dataIndex: 'customerName',
        align: 'center',
        fixed: 'left',
        render(data) {
            return data || '--';
        }
    },
    {
        title: '证件号码',
        dataIndex: 'cardNumber',
        align: 'center',
        render(data) {
            return data || '--';
        }
    },
    {
        title: '客户类别',
        dataIndex: 'customerType',
        width: 150,
        align: 'center',
        render(data) {
            if (data === 1) return '个人 ';
            if (data === 2) return '机构 ';
            if (data === 3) return '产品';
            return '--';
        }
    },
    {
        title: '客户类型',
        dataIndex: 'investorType',
        align: 'center',
        width: 150,
        render(data) {
            if (data === 1) return '普通投资者';
            if (data === 2) return '专业投资者';
            if (data === 3) return '特殊合格投资者';
            return '--';
        }
    },
    {
        title: BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级',
        dataIndex: 'customerLevel',
        align: 'center',
        width: 150,
        render(data) {
            if (data === 1) return '注册客户';
            if (data === 2) return '合格投资者客户';
            if (data === 3) return '持有客户';
            if (data === 4) return '历史持有客户';
            return '--';
        }
    },
    {
        title: '持有产品',
        dataIndex: 'productFullName',
        align: 'center',
        render(data) {
            return data || '--';
        }
    }
];

const openNotificationWithIcon = (type, message) => {
    notification[type]({
        message
    });
};

const Step2: React.FC<DoubleRecordSoloAddStep2> = (props) => {
    const [form] = Form.useForm();
    const [tableData, setTableData] = useState<any>({});
    const [selectedRowKeys, setSelectRowKeys] = useState<string[]>([]);
    const [formData, setFormData] = useState<any>({});
    // pageSize
    const [pageSize, changePageSize] = useState<number>(20);
    // pageNum
    const [pageNum, changePageNum] = useState<number>(1);
    const _tableChange = (p, e, s) => {
        changePageSize(p.pageSize);
        changePageNum(p.current);
    };
    const onReset = () => {
        form.resetFields();
        changePageNum(1);
        setFormData({});
        setSelectRowKeys([]);
    };
    const onFinish = (val) => {
        setFormData(val);
    };
    // table 勾选
    const onSelectChange = (selectedRowKeys) => {
        setSelectRowKeys(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const aleartRender = () => {
        return (
            <div>
                已经选择<span className={styles.spanStyle}>{selectedRowKeys.length} &nbsp;</span>项
                <span
                    className={styles.spanStyle}
                    onClick={(e) => selectedRowKeys.length && setSelectRowKeys([])}
                >
                    清空
                </span>
            </div>
        );
    };
    const btnClick = () => {
        const { dispatch, closeModal } = props;
        dispatch({
            type: 'doubleRecordSolo/saveDoubleRecordCustomer',
            payload: {
                ...props.step1Data,
                customerIdList: selectedRowKeys
            },
            callback(res) {
                if (res.code === 1008) {
                    openNotificationWithIcon('success', res.message || '新增成功');
                    closeModal();
                    props.quertTableData();
                } else {
                    openNotificationWithIcon('error', res.message || '接口出错');
                }
            }
        });
    };
    useEffect(() => {
        const { dispatch } = props;
        dispatch({
            type: 'doubleRecordSolo/getDoubleRecordCustomer',
            payload: {
                ...formData,
                pageSize,
                pageNum
            },
            callback(res) {
                if (res.code === 1008) {
                    setTableData(res.data);
                } else {
                    openNotificationWithIcon('error', res.message || '接口出错');
                }
            }
        });
    }, [pageSize, pageNum, formData]);
    return (
        <>
            <div
                style={{
                    width: '70%',
                    margin: '0 auto'
                }}
            >
                <Form form={form} onReset={onReset} onFinish={onFinish}>
                    <Row gutter={24}>
                        <Col span={12}>
                            {/* <MultipleSelect
                                params="customerId"
                                value="customerId"
                                label="customerBrief"
                                type={2}
                                formLabel="客户名称"
                                isOptionLabelProp
                                optionLabel="customerName"
                            /> */}
                            <Form.Item name={'customerName'} label="客户名称">
                                <Input placeholder={'请输入'} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'cardNumber'} label="证件号码">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name={'customerType'} label="客户类别">
                                <Select allowClear>
                                    <Option value={1}>个人</Option>
                                    <Option value={2}>机构</Option>
                                    <Option value={3}>产品</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'investorType'} label="客户类型">
                                <Select allowClear>
                                    <Option value={1}>普通投资者</Option>
                                    <Option value={2}>专业投资者</Option>
                                    <Option value={3}>特殊合格投资者</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={12}>
                            <Form.Item name={'customerLevel'} label={BASE_PATH.config && BASE_PATH.config.CustomerStatus || '客户等级'}>
                                <Select allowClear>
                                    <Option value={1}>注册客户</Option>
                                    <Option value={2}>合格投资者客户</Option>
                                    <Option value={3}>持有客户</Option>
                                    <Option value={4}>历史持有客户</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name={'productFullName'} label="持有产品">
                                <Input placeholder={'请输入'} />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col span={24}>
                            <div
                                style={{
                                    textAlign: 'right'
                                }}
                            >
                                <Button
                                    type={'primary'}
                                    htmlType={'submit'}
                                    style={{ marginRight: 8 }}
                                >
                                    查询
                                </Button>
                                <Button htmlType={'reset'}>重置</Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
            <div style={{ paddingTop: 16 }}>
                <Alert message={aleartRender()} type="info" />
                <MXTable
                    loading={Boolean(props.loading)}
                    columns={columns}
                    dataSource={tableData.list || []}
                    total={tableData.total}
                    pageNum={pageNum}
                    scroll={{ x: '100%', y: 300 }}
                    onChange={(p, e, s) => _tableChange(p, e, s)}
                    rowSelection={rowSelection}
                    rowKey="customerId"
                    showColumnsConfig={false}
                />
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        type={'primary'}
                        style={{ marginRight: 16 }}
                        onClick={btnClick}
                        loading={Boolean(props.loading2)}
                    >
                        确定
                    </Button>
                    <Button onClick={props.closeModal}>取消</Button>
                </div>
            </div>
        </>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['doubleRecordSolo/getDoubleRecordCustomer'],
    loading2: loading.effects['doubleRecordSolo/saveDoubleRecordCustomer']
}))(Step2);
