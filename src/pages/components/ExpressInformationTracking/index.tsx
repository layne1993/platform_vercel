import React, {useEffect, useRef, useState} from 'react';
import {Card, Input, Form, Button, Row, Col, Modal, Badge, notification} from 'antd';
import MXTable from '@/pages/components/MXTable';
import {Dispatch} from 'umi';
import ModalPage from './ModalPage';
import {connect} from 'dva';
import { getPermission } from '@/utils/utils';
import styles from './styles.less';
import moment from 'moment';
import {cloneDeep} from 'lodash';

const {confirm} = Modal;

interface ExpressInformationTrackingPro {
    dispatch:Dispatch;
    source: number | string; // 来源 1：生命周期 2：打新
    sourceId: number | string;
    actionId: number | string;
    loading: boolean;
    loading2: boolean;
    loading3:boolean;
    loading4:boolean;
    loading5:boolean;
    loading6:boolean;
    code: number;
    id: string; // 最外层id
}

const initPageData = {
    // 当前的分页数据
    pageNum: 1,
    pageSize: 20
};

const openNotification = (type, message) => {
    notification[type]({
        message
    });
};

const ExpressInformationTracking:React.FC<ExpressInformationTrackingPro> = (props) => {
    const {
        dispatch,
        source,
        loading,
        loading2,
        code,
        loading3,
        loading4,
        loading5,
        loading6,
        sourceId
    } = props;
    const { authEdit, authExport } = getPermission(code);
    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState<any>({});
    const [pageData, changePageData] = useState<{pageNum: number;pageSize:number}>(initPageData);
    const [showModal, changeShowModal] = useState<boolean>(false);
    const formRef: React.MutableRefObject<any> = useRef();
    // const [stepVal, changeStepVal] = useState<string | number>('');
    const [tabRowData, setTabRowData] = useState<any>({});
    const getDataSource = () => {
        const {trackingNumber} = form.getFieldsValue();
        dispatch({
            type: 'expressInformationTracking/queryList',
            payload: {
                ...pageData,
                source,
                sourceId,
                trackingNumber
            },
            callback(res:any) {
                if(res.code === 1008) {
                    setDataSource(res.data);
                } else {
                    openNotification('error', res.message);
                }
            }
        });
    };
    const _tableChange = (p) => {
        changePageData({
            ...pageData,
            pageNum: p.current,
            pageSize: p.pageSize
        });
    };
    const changeModalStatus:(status:boolean) => void = (status:boolean) => {
        changeShowModal(status);
    };

    const getModalData = (data) => data;

    const modalSubmit = () => {
        formRef.current
            .validateFields()
            .then((data) => {
                let source,
                    sourceId,
                    actionId;
                source = tabRowData?.source || props.source;
                sourceId = tabRowData?.sourceId || props.sourceId;
                actionId = tabRowData?.actionId || props.actionId;
                const newData = cloneDeep(data);
                const payload = {
                    source,
                    sourceId,
                    actionId,
                    trackingNumber:newData.trackingNumber,
                    expressDocumentId: tabRowData.expressDocumentId,
                    trackingCompany:newData.trackingCompanyInfo?.label,
                    trackingCompanyCode:newData.trackingCompanyInfo?.value,
                    remark: newData.remark,
                    sharedNetWorkFileIds: newData.sharedNetWorkFileIds,
                    status: newData.expressDocumentLogsInfo?.state,
                    expressDocumentLogs:newData.expressDocumentLogsInfo?.data || []
                };
                dispatch({
                    type: 'expressInformationTracking/saveExpressDocument',
                    payload,
                    callback(res:any) {
                        if(res.code!== 1008) return openNotification('error', res.message);
                        getDataSource();
                        changeShowModal(false);
                        openNotification('success', '创建成功');
                    }
                });
            })
            .catch((err) => console.log(err));
    };
    const onFinish = (val) => {
        changePageData({pageNum:1, pageSize:20});
        getDataSource();
    };
    const changeShowModalStatus = (data? ) => {
        if(data) {
            // 编辑
            setTabRowData(data);
            changeShowModal(true);
        } else {
            // 新建
            setTabRowData({});
            changeShowModal(true);
        }

    };
    const deleteRow = (expressDocumentId) => {
        confirm({
            title: '是否确定删除该信息',
            onOk:() => {
                expressDocumentId && dispatch({
                    type: 'expressInformationTracking/deleteExpressDocumentBatch',
                    payload: {
                        expressDocumentIds: expressDocumentId
                    },
                    callback(res:any) {
                        if(res.code !== 1008) return openNotification('error', res.message);
                        openNotification('success', '删除成功');
                        getDataSource();
                    }
                });
            }
        });

    };
    const columns = [
        {
            title: '步骤',
            dataIndex: 'codeText',
            align: 'center',
            width: 100,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            width: 100,
            render(data) {
                if (data === 0) return <Badge status="error" text={<span style={{color: '#FF0000'}}>无单号</span>} />;
                if (data === 1) return <Badge color={'yellow'} text="在途" />;
                if (data === 2) return <Badge color={'yellow'} text="揽收" />;
                if (data === 3) return <Badge color={'yellow'} text="疑难" />;
                if (data === 4) return <Badge status={'success'} text="签收" />;
                if (data === 5) return <Badge color={'yellow'} text="退签" />;
                if (data === 6) return <Badge color={'yellow'} text="派件" />;
                if (data === 7) return <Badge color={'yellow'} text="退回" />;
                if (data === 8) return <Badge color={'yellow'} text="转单" />;
                if (data === 11) return <Badge color={'yellow'} text="待清关" />;
                if (data === 12) return <Badge color={'yellow'} text="清关中" />;
                if (data === 13) return <Badge color={'yellow'} text="已清关" />;
                if (data === 14) return <Badge color={'yellow'} text="清关异常" />;
                if (data === 15) return <Badge color={'yellow'} text="收件人拒签" />;
                return '--';
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 100,
            sorter:(a, b) => a.createTime - b.createTime,
            render(data) {
                return (data && moment(data).format('YYYY/MM/DD')) || '--';
            }
        },
        {
            title: '快递单号',
            dataIndex: 'trackingNumber',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '快递节点',
            dataIndex: 'expressContent',
            align: 'center',
            width: 200,
            render(data) {
                return data || '--';
            }
        },
        // {
        //     title: '发件人',
        //     dataIndex: 'sender',
        //     align: 'center',
        //     width: 100,
        //     render(data) {
        //         return data || '--';
        //     }
        // },
        // {
        //     title: '收件人',
        //     dataIndex: 'receiver',
        //     align: 'center',
        //     width: 100,
        //     render(data) {
        //         return data || '--';
        //     }
        // },
        {
            title: '关联文件',
            dataIndex: 'fileName',
            align: 'center',
            render(data) {
                if(!data) return '--';
                const renderList = data.split('/');
                return (
                    <ul style={{textAlign: 'left'}}>
                        {
                            renderList.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))
                        }
                    </ul>
                );
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            width: 100,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '操作',
            align: 'center',
            render(data) {
                return (
                    <div className={styles.operationBox} style={{display: code ? (authEdit ? '' : 'none') : ''}}>
                        <span onClick={() => changeShowModalStatus(data)}>编辑</span>
                        <span onClick={() => deleteRow(data.expressDocumentId)}>删除</span>
                    </div>
                );
            }
        }
    ];
    useEffect(() => {
        getDataSource();
    }, [pageData.pageNum, pageData.pageSize]);
    return (
        <Card title={'快递信息跟踪'} id={props.id}>
            <Modal
                closable={false}
                visible={showModal}
                maskClosable={false}
                onCancel={() => changeModalStatus(false)}
                destroyOnClose
                width={'60%'}
                title={'快递跟踪'}
                onOk={modalSubmit}
                confirmLoading={loading3 || loading4 || loading5 || loading6}
            >
                <ModalPage
                    expressDocumentId={tabRowData?.expressDocumentId}
                    formRef={formRef}
                    sourceId={tabRowData.sourceId || props.sourceId}
                    actionId={tabRowData.actionId || props.actionId}
                    getModalData={getModalData}
                />
            </Modal>
            <Form form={form} onFinish={onFinish}>
                <Row justify="space-between">
                    <Col span={12}>
                        <Button style={{display: code ? (authEdit ? '' : 'none') : ''}} type="primary" className={styles.addBtn} onClick={() => changeShowModalStatus()}>创建快递跟踪</Button>
                    </Col>
                    <Col span={12}>
                        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                            <Col span={20}>
                                <Form.Item label={'快递单号'} name={'trackingNumber'}>
                                    <Input placeholder={'请输入'} />
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Button type="primary" htmlType="submit">查询</Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Form>
            <div className={styles.table}>
                <MXTable
                    loading={loading || loading2}
                    columns={columns}
                    dataSource={dataSource.list || []}
                    total={dataSource.total}
                    pageNum={pageData.pageNum}
                    scroll={{x: '100%'}}
                    sticky
                    onChange={(p) => _tableChange(p)}
                    rowKey="id"
                    rowSelection={null}
                    bordered
                />
            </div>
        </Card>
    );
};

export default connect(({loading})=>({
    loading: loading.effects['expressInformationTracking/queryList'],
    loading2: loading.effects['expressInformationTracking/deleteExpressDocumentBatch'],
    loading3: loading.effects['expressInformationTracking/getExpressDocumentDetail'],
    loading4: loading.effects['expressInformationTracking/saveExpressDocument'],
    loading5: loading.effects['expressInformationTracking/autoTrackingCompany'],
    loading6: loading.effects['expressInformationTracking/queryTrackingMessage']
}))(ExpressInformationTracking);
