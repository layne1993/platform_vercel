import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
    Form,
    Select,
    DatePicker,
    Row,
    Col,
    Input,
    Button,
    Card,
    Modal,
    notification,
    Dropdown,
    Menu
} from 'antd';
import MXTable from '@/pages/components/MXTable';
import AddPage from '../add/index';
import moment from 'moment';
import { connect } from 'dva';
import { cloneDeep } from 'lodash';
import ExaminePage from '../examinePage/index';
import { fileExport, getPermission } from '@/utils/utils';
import type { Dispatch } from 'umi';
import styles from './styles.less';
import { DownOutlined } from '@ant-design/icons';
import { MultipleSelect } from '@/pages/components/Customize';

const { Option } = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

type DispatchConfig = {
    type: string;
    callback?: (res: any) => void;
    payload?: { [name: string]: any };
};

type DoubleRecordSoloList = {
    dispatch: Dispatch;
    loading: boolean;
};

type ColumnsType = {
    title: string;
    dataIndex?: string;
    fixed?: string;
    align?: string;
    width?: number;
    render?: (data: any, rowData: any, index: any) => string | React.ReactNode;
    sorter?: (a?: any, b?: any) => number;
};

const openNotificationWithIcon = (type, message) => {
    notification[type]({
        message
    });
};

const { confirm } = Modal;

const List: React.FC<DoubleRecordSoloList> = (props) => {
    const { authEdit, authExport } = getPermission(20400);
    const { dispatch } = props;
    const [form] = Form.useForm();
    // 保存赛选条件
    const [formData, setFormData] = useState<any>({});
    // table数据
    const [tableData, setTableData] = useState<any>({});
    const [selectedRowKeys, setSelectRowKeys] = useState([]);
    // 新建单独说双录流程模态框
    const [showModal, changeShowModal] = useState<boolean>(false);
    // 双录审核Modal
    const [showModal2, changeShowModal2] = useState<boolean>(false);
    // pageSize
    const [pageSize, changePageSize] = useState<number>(20);
    // pageNum
    const [pageNum, changePageNum] = useState<number>(1);
    // 点击审核存储id Modal使用
    const [
        terminationAnddoubleRecordAloneId,
        setTerminationAnddoubleRecordAloneId
    ] = useState<number>();
    const onFinish = (val) => {
        changePageSize(20);
        changePageNum(1);
        let obj = cloneDeep(val);
        if (val.doubleRecordTime) {
            obj.doubleRecordTime = moment(val.doubleRecordTime).format('x');
        }
        setFormData(obj);
    };
    const onReset = () => {
        form.resetFields();
        setFormData({});
        changePageNum(1);
        setSelectRowKeys([]);
    };

    // table 勾选
    const onSelectChange = (selectedRowKeys) => {
        setSelectRowKeys(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        getCheckboxProps(record) {
            // console.log(record);
            return {
                disabled: !(record.doubleType && (record.doubleType > 0))
            };
        }
    };
    const closeModal = () => {
        changeShowModal(false);
    };
    const _tableChange = (p) => {
        changePageSize(p.pageSize);
        changePageNum(p.current);
    };
    // 终止
    const termination = (id) => {
        confirm({
            title: '该客户还未完成双录，是否中止此流程',
            onOk() {
                const { dispatch } = props;
                return new Promise((resolve, reject) => {
                    dispatch({
                        type: 'doubleRecordSolo/termination',
                        payload: id,
                        callback(res: any) {
                            if (res.code !== 1008) {
                                reject();
                                openNotificationWithIcon('error', res.message || '接口出错');
                                return;
                            }
                            resolve();
                            quertTableData();
                            openNotificationWithIcon('success', '终止成功');
                        }
                    });
                });
            }
        });
    };
    // 审核
    const getCheckTypeInfo = (id) => {
        setTerminationAnddoubleRecordAloneId(id);
        changeShowModal2(true);
    };
    // 单个下载
    const downLoad = (id) => {
        fileExport({
            method: 'post',
            url: '/manager/DoubleRecordAlone/downloadZip',
            data: { doubleRecordAloneIdList: [].concat(id) },
            headers: {},
            callback: (data) => {
                if (data.status === 'error') {
                    notification.error({
                        message: data.message
                    });
                }
                if (data.status === 'success') {
                    notification.success({
                        message: '下载成功'
                    });
                }
            }
        });
    };
    // 导出全部
    const _downloadAll = () => {

        fileExport({
            method: 'post',
            url: '/manager/DoubleRecordAlone/allExport',
            data: {
                ...formData,
                pageSize,
                pageNum
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    notification.success({
                        message: '下载成功'
                    });
                }
                if (status === 'error') {
                    notification.error({
                        message: '下载失败'
                    });
                }
            }
        });
    };
    // 删除
    const deleteAlone = (id) => {
        confirm({
            title: '是否删除该客户双录',
            onOk() {
                const { dispatch } = props;
                return new Promise((resolve, reject) => {
                    dispatch({
                        type: 'doubleRecordSolo/deleteAlone',
                        payload: id,
                        callback(res: any) {
                            if (res.code !== 1008) {
                                reject();
                                openNotificationWithIcon('error', res.message || '接口出错');
                                return;
                            }
                            resolve();
                            quertTableData();
                            openNotificationWithIcon('success', '删除成功');
                        }
                    });
                });
            }
        });
    };
    const columns: ColumnsType[] = [
        {
            title: '客户名称',
            width: 100,
            dataIndex: 'customerName',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (val) => val || '--'
        },
        {
            title: '产品全称',
            dataIndex: 'productFullName',
            width: 100,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '双录进度',
            dataIndex: 'doubleType',
            width: 100,
            align: 'center',
            render(data) {
                if (data === 0) return '未完成';
                if (data === 1) return '待审核';
                if (data === 2) return '已完成';
                return '--';
            }
        },
        {
            title: '双录日期',
            dataIndex: 'doubleRecordTime',
            align: 'center',
            width: 150,
            sorter: (a, b) => a.doubleRecordTime - b.doubleRecordTime,
            render(data) {
                return (data && moment(data).format('YYYY/MM/DD')) || '--';
            }
        },
        {
            title: '完成时间',
            dataIndex: 'completionTime',
            width: 150,
            sorter: (a, b) => a.completionTime - b.completionTime,
            align: 'center',
            render(data) {
                return (data && moment(data).format('YYYY/MM/DD')) || '--';
            }
        },
        {
            title: '双录类型',
            dataIndex: 'doubleCheckType',
            align: 'center',
            width: 150,
            render(data) {
                if (data === 1) return '普通';
                if (data === 2) return '智能';
                return '--';
            }
        },
        {
            title: '操作人员',
            dataIndex: 'userName',
            align: 'center',
            width:120,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '操作',
            align: 'center',
            width:100,
            render(data) {
                if (data.doubleType === 0)
                    return (
                        <span
                            className={styles.spanStyle}
                            onClick={(e) => termination(data.doubleRecordAloneId)}
                            style={{
                                display: authEdit ? '' : 'none'
                            }}
                        >
                            终止
                        </span>
                    );
                if (data.doubleType === 1)
                    return (
                        <div>
                            <span
                                className={`${styles.spanStyle} ${styles.audit}`}
                                onClick={(e) => getCheckTypeInfo(data.doubleRecordAloneId)}
                                style={{
                                    display: authEdit ? '' : 'none'
                                }}
                            >
                                审核
                            </span>
                            <span
                                className={styles.spanStyle}
                                onClick={(e) => deleteAlone(data.doubleRecordAloneId)}
                                style={{
                                    display: authEdit ? '' : 'none'
                                }}
                            >
                                删除
                            </span>
                        </div>
                    );
                if (data.doubleType === 2)
                    return (
                        <div>
                            <span
                                className={styles.spanStyle}
                                onClick={(e) => downLoad(data.doubleRecordAloneId)}
                                style={{
                                    display: authExport ? '' : 'none'
                                }}
                            >
                                下载
                            </span>
                            <span
                                className={styles.spanStyle}
                                onClick={(e) => deleteAlone(data.doubleRecordAloneId)}
                                style={{
                                    display: authEdit ? '' : 'none'
                                }}
                            >
                                删除
                            </span>
                        </div>
                    );
            }
        }
    ];
    const quertTableData = () => {
        const { dispatch } = props;
        dispatch({
            type: 'doubleRecordSolo/getDoubleRecordList',
            payload: {
                ...formData,
                pageSize,
                pageNum
            },
            callback(res) {
                if (res.code !== 1008) {
                    openNotificationWithIcon('error', res.message || '接口出错');
                    return;
                }
                setTableData(res.data);
            }
        });
    };
    useEffect(() => {
        const { dispatch } = props;
        dispatch({
            type: 'doubleRecordSolo/getDoubleRecordList',
            payload: {
                ...formData,
                pageSize,
                pageNum
            },
            callback(res) {
                if (res.code !== 1008) {
                    openNotificationWithIcon('error', res.message || '接口出错');
                    return;
                }
                setTableData(res.data);
            }
        });
    }, [pageSize, pageNum, formData]);
    return (
        <PageHeaderWrapper title="双录列表">
            <Modal
                visible={showModal}
                destroyOnClose
                footer={null}
                width={'80%'}
                onCancel={(e) => changeShowModal(false)}
                bodyStyle={{ maxHeight: 800, overflow: 'auto' }}
                maskClosable={false}
            >
                <AddPage closeModal={closeModal} quertTableData={quertTableData} />
            </Modal>
            <Modal
                title={'双录审核'}
                visible={showModal2}
                destroyOnClose
                footer={null}
                width={'80%'}
                onCancel={(e) => changeShowModal2(false)}
                bodyStyle={{ maxHeight: 800, overflow: 'auto' }}
                maskClosable={false}
            >
                <ExaminePage
                    doubleRecordAloneId={terminationAnddoubleRecordAloneId}
                    quertTableData={quertTableData}
                    changeShowModal2={changeShowModal2}
                />
            </Modal>
            <Card>
                <Form {...layout} form={form} onFinish={onFinish}>
                    <Row
                        gutter={24}
                        style={{
                            width: '100%'
                        }}
                    >
                        <Col span={8}>
                            <Form.Item name="customerName" label="客户名称">
                                <Input placeholder={'请输入'} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <MultipleSelect
                                params="productIds"
                                value="productId"
                                label="productName"
                                mode="multiple"
                                formLabel="产品名称"
                            />
                        </Col>
                        <Col span={8}>
                            <Form.Item name="doubleType" label="双录进度">
                                <Select placeholder="请选择" allowClear>
                                    <Option value={0}>未完成</Option>
                                    <Option value={1}>待审核</Option>
                                    <Option value={2}>已完成</Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row
                        gutter={24}
                        style={{
                            width: '100%'
                        }}
                    >
                        <Col span={8}>
                            <Form.Item name="doubleRecordTime" label="双录时间">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Form.Item label="证件号码" name="cardNumber">
                                <Input placeholder="请输入" autoComplete="off" allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <div className={styles.btnBox}>
                                <Button
                                    htmlType="button"
                                    onClick={onReset}
                                    className={styles.raestBtn}
                                >
                                    重置
                                </Button>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
                <div className={styles.btnGroup}>
                    <Button
                        type="primary"
                        className={styles.addBtn}
                        onClick={(e) => {
                            changeShowModal(true);
                        }}
                        style={{
                            display: authEdit ? '' : 'none'
                        }}
                    >
                        新建单独双录流程
                    </Button>
                    {/* <Button
                        disabled={!selectedRowKeys.length}
                        onClick={(e) => downLoad(selectedRowKeys)}
                        style={{
                            display: authExport ? '' : 'none'
                        }}
                    >
                        批量下载
                    </Button> */}
                    {
                        authExport &&
                        <Dropdown
                            overlay={<Menu>
                                <Menu.Item
                                    key="1"
                                    disabled={selectedRowKeys.length === 0}
                                    onClick={(e) => downLoad(selectedRowKeys)}
                                >
                                    下载选中
                                </Menu.Item>
                                <Menu.Item
                                    key="0"
                                    onClick={_downloadAll}
                                >
                                    下载全部
                                </Menu.Item>
                            </Menu>}
                        >
                            <Button >
                                &nbsp;&nbsp;批量下载
                                <DownOutlined />
                            </Button>
                        </Dropdown>
                    }

                </div>
                <MXTable
                    loading={Boolean(props.loading)}
                    columns={columns}
                    dataSource={tableData.list || []}
                    total={tableData.total}
                    pageNum={pageNum}
                    scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                    sticky
                    onChange={(p) => _tableChange(p)}
                    rowSelection={rowSelection}
                    rowKey="doubleRecordAloneId"
                    showColumnsConfig={false}
                />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['doubleRecordSolo/getDoubleRecordList']
}))(List);
