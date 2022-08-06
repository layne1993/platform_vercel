import React, {useState, useEffect, useCallback} from 'react';
import {GridContent, PageHeaderWrapper} from '@ant-design/pro-layout';
import {Card, Col, Row, Form, Input, Select, DatePicker, Button, Modal, Menu, Dropdown, notification} from 'antd';
import ModalPage from '@/pages/risk/list/components/ModalPage';
import MXTable from '@/pages/components/MXTable';
import {connect} from 'dva';
import styles from './styles.less';
import moment from 'moment';
import {downloadFile, getPermission, fileExport} from '@/utils/utils';

const {Option} = Select;
// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const RiskList = (props) => {
    const layout = {
        labelCol: {span: 8},
        wrapperCol: {span: 16}
    };
    const initPageData = {
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    };
    const { authEdit, authExport } = getPermission(50100);
    const [form] = Form.useForm();
    const [pageData, changePageData] = useState(initPageData);
    const [modalIsShow, changeModalIsShow] = useState(false);
    const [formData, setFormData] = useState({});
    const [dataSource, setDataSource] = useState({});
    const [selectedRowKeys, setSelectRowKeys] = useState([]);
    const changeModalIsShow2 = useCallback(changeModalIsShow, []);
    const [riskRecordId, setRiskRecordId] = useState({});
    const [isEdit, setEdit] = useState(false);
    const [loading2, changeLoading2] = useState(false);
    const [askType, setAskType] = useState('');
    const [riskTypeSelect, setRiskTypeSelect] = useState([]);

    const _tableChange = (p) => {
        changePageData({
            ...pageData,
            pageNum: p.current,
            pageSize: p.pageSize
        });
    };
    const download = (riskRecordIds) => {
        if(riskRecordIds instanceof  Array) {
            if(!riskRecordIds.length) return;
            riskRecordIds=riskRecordIds.join(',');
        }
        changeLoading2(true);
        downloadFile('/riskRecord/download', {riskRecordIds})
            .then(() => {
                changeLoading2(false);
            });
    };
    // table 勾选
    const onSelectChange = (selectedRowKeys) => {
        setSelectRowKeys(selectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    const onReset = () => {
        form.resetFields();
        setFormData({});
        changePageData({
            ...pageData,
            pageNum: 1
        });
    };

    const onFinish = (values) => {
        const riskAndAskType = values.riskType && values.riskType.split('-');
        const data = {
            ...values,
            riskLimitDate: values.riskLimitDate?.format('x'),
            askType: riskAndAskType && riskAndAskType[0],
            riskType: riskAndAskType && riskAndAskType[1]
        };
        setFormData(data);
        changePageData({
            ...pageData,
            pageNum: 1
        });
    };

    const editClick = (data) => {
        setAskType(data.askType);
        setEdit(true);
        setRiskRecordId(data.riskRecordId);
        changeModalIsShow(true);
    };

    const upDataParentData = () => {
        // 请求数据
        const {dispatch} = props;
        dispatch({
            type: 'risk/queryRiskList',
            payload: {
                ...formData,
                ...pageData
            },
            callback(res) {
                setDataSource(res);
            }
        });
    };
    const columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            align: 'center',
            width: 200,
            fixed: 'left',
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
            title: '客户类型',
            dataIndex: 'customerType',
            align: 'center',
            width: 100,
            render(data) {
                if (data === 1) return '个人';
                if (data === 2) return '机构';
                if (data === 3) return '产品';
                return '--';
            }
        },
        {
            title: '投资者分值',
            dataIndex: 'score',
            align: 'center',
            width: 100,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '风险等级',
            dataIndex: 'riskType',
            align: 'center',
            width: 100,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '问卷版本',
            dataIndex: 'versionNumber',
            align: 'center',
            width: 100,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '星级',
            dataIndex: 'riskStarRating',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '问卷有效性',
            dataIndex: 'usableStatus',
            align: 'center',
            width: 100,
            render(data) {
                if (data === 0) return '有效';
                if (data === 1) return '无效';
                return '--';
            }
        },
        {
            title: '完成时间',
            dataIndex: 'riskDate',
            align: 'center',
            render(data) {
                return data ? moment(data).format('YYYY-MM-DD') : '--';
            },
            sorter: (a, b) => a.riskDate - b.riskDate,
            width: 100

        },
        {
            title: '问卷到期时间',
            dataIndex: 'riskLimitDate',
            align: 'center',
            render(data) {
                return data ? moment(data).format('YYYY-MM-DD') : '--';
            },
            sorter: (a, b) => a.riskLimitDate - b.riskLimitDate,
            width: 130
        },
        {
            title: '问卷用印状态',
            dataIndex: 'isUseSeal',
            align: 'center',
            width: 110,
            render(data) {
                if (data === 0) return '没有用印';
                if (data === 1) return '已用印';
                return '--';
            }
        },
        {
            title: '问卷来源',
            dataIndex: 'sourceType',
            align: 'center',
            width: 100,
            render(data) {
                if (data === 1) return '线上填写';
                if (data === 2) return '后台创建';
                if (data === 3) return '电子合同签约';
                if (data === 4) return '非电子合同签约';
                return '--';
            }
        },
        {
            title: '操作',
            align: 'center',
            width: 100,
            render(data) {
                return (
                    <div className={styles.operationBox}>
                        {
                            authEdit ? (
                                <span
                                    onClick={() => editClick(data)}
                                    style={{
                                        display: authEdit ? 'unset' : 'none'
                                    }}
                                >
                            编辑
                                </span>
                            ) : '--'
                        }
                        {
                            data.attachment &&                         <span
                                onClick={() => download(data.riskRecordId)}
                                style={{
                                    display: authExport ? 'unset' : 'none'
                                }}
                            >
                            下载
                            </span>
                        }

                    </div>
                );
            }
        }
    ];
    const downloadAll = () => {
        const data = form.getFieldsValue();
        fileExport({
            method: 'post',
            url: '/riskRecord/downloadAll',
            data,
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    };
    const menu = (
        <Menu>
            <Menu.Item key="0" disabled={!selectedRowKeys.length}>
                <span onClick={(e)=>download(selectedRowKeys)}>导出选中</span>
            </Menu.Item>
            <Menu.Item key="1">
                <span onClick={() => downloadAll()}>导出全部</span>
            </Menu.Item>
        </Menu>
    );

    useEffect(()=>{
        const {dispatch} = props;
        dispatch({
            type: 'risk/queryRiskLevel',
            payload: {askType: ''},
            callback(res) {
                setRiskTypeSelect(res);
            }
        });
    }, []);

    useEffect(() => {
        // 请求数据
        const {dispatch} = props;
        dispatch({
            type: 'risk/queryRiskList',
            payload: {
                ...formData,
                ...pageData
            },
            callback(res) {
                setDataSource(res);
                setSelectRowKeys([]);
            }
        });
    }, [formData, pageData.pageSize, pageData.pageNum]);
    return (
        <PageHeaderWrapper title="风险测评问卷列表">
            <GridContent>
                <Modal
                    visible={modalIsShow}
                    footer={null}
                    onCancel={() => changeModalIsShow(false)}
                    width="80%"
                    maskClosable={false}
                    destroyOnClose
                >
                    <ModalPage
                        closeModal={changeModalIsShow2}
                        riskRecordId={riskRecordId}
                        isEdit={isEdit}
                        upDataParentData={upDataParentData}
                        askType={askType}
                    />
                </Modal>
                <Card>
                    <Form {...layout} form={form} onFinish={onFinish}>
                        <Row gutter={24} style={{
                            width: '100%'
                        }}
                        >
                            <Col span={8}>
                                <Form.Item
                                    name="customerName"
                                    label="客户名称"
                                >
                                    <Input placeholder="请输入"/>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="customerType"
                                    label="客户类型"
                                >
                                    <Select placeholder="请选择" allowClear>
                                        <Option value={1}>个人</Option>
                                        <Option value={2}>机构</Option>
                                        <Option value={3}>产品</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="riskType"
                                    label="风险等级"
                                >
                                    <Select placeholder="请选择" allowClear>
                                        {
                                            riskTypeSelect.map((item)=> (
                                                <Option value={item.type} key={item.type}>{item.text || '--'}</Option>
                                            ))
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{
                            width: '100%'
                        }}
                        >
                            <Col span={8}>
                                <Form.Item
                                    name="usableStatus"
                                    label="问卷有效性"
                                >
                                    <Select placeholder="请选择" allowClear>
                                        <Option value={0}>有效</Option>
                                        <Option value={1}>无效</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="isUseSeal"
                                    label="问卷用印状态"
                                >
                                    <Select placeholder="请选择" allowClear>
                                        <Option value={0}>没有用印</Option>
                                        <Option value={1}>已用印</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    name="sourceType"
                                    label="问卷来源"
                                >
                                    <Select placeholder="请选择" allowClear>
                                        <Option value={1}>线上填写</Option>
                                        <Option value={2}>后台创建</Option>
                                        <Option value={3}>电子合同签约</Option>
                                        <Option value={4}>非电子合同签约</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} style={{
                            width: '100%'
                        }}
                        >
                            <Col span={8}>
                                <Form.Item name="riskLimitDate" label="问卷到期时间">
                                    <DatePicker style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item label="证件号码" name="cardNumber">
                                    <Input placeholder="请输入" autoComplete="off"  allowClear/>
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <div className={styles.btnBox}>
                                    <Button htmlType="button" onClick={onReset} className={styles.raestBtn}>
                                        重置
                                    </Button>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                    <div className={styles.btnGroup} style={{
                        display: authExport ? 'unset' : 'none'
                    }}
                    >
                        {/*<Button*/}
                        {/*    type='primary'*/}
                        {/*    className={styles.addBtn}*/}
                        {/*    onClick={e => {*/}
                        {/*        changeModalIsShow(true);*/}
                        {/*        setEdit(false)*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    ＋*/}
                        {/*    新建*/}
                        {/*</Button>*/}
                        <Dropdown overlay={menu} trigger={['click']}>
                            <Button
                                loading={Boolean(loading2)}
                            >
                                批量导出
                            </Button>
                        </Dropdown>
                    </div>
                    <div className={styles.table}>
                        <MXTable
                            loading={Boolean(props.loading) || Boolean(loading2)}
                            columns={columns}
                            dataSource={dataSource.list || []}
                            total={dataSource.total}
                            pageNum={pageData.pageNum}
                            scroll={{x: '100%'}}
                            sticky
                            onChange={(p, e, s) => _tableChange(p, e, s)}
                            rowSelection={rowSelection}
                            rowKey="riskRecordId"
                        />
                    </div>

                </Card>
            </GridContent>
        </PageHeaderWrapper>
    );
};
export default connect(({risk, loading}) => ({
    risk,
    loading: loading.effects['risk/queryRiskList']
}))(RiskList);
