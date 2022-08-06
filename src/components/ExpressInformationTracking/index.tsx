import React, {useEffect, useRef, useState} from 'react';
import {Card, Input, Form, Button, Row, Col, Modal, Badge, notification} from 'antd';
import MXTable from '@/pages/components/MXTable';
import {Dispatch} from 'umi';
import ModalPage from './ModalPage';
import {connect} from 'dva';
import styles from './styles.less';
import moment from 'moment';

interface ExpressInformationTrackingPro {
    dispatch:Dispatch;
    source: number | string; // 来源 1：生命周期 2：打新
    sourceId: number | string;
    actionId: number | string;
    loading: boolean;
    loading2: boolean;
    propsToStepVal: string | number
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
    const {dispatch, source, loading, propsToStepVal} = props;
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
                console.log(source);
                dispatch({
                    type: 'expressInformationTracking/saveExpressDocument',
                    payload: {
                        ...data,
                        source,
                        sourceId,
                        actionId
                    },
                    callback(res:any) {
                        if(res.code!== 1008) return openNotification('error', res.message);
                        getDataSource();
                        changeShowModal(false);
                    }
                });
            })
            .catch((err) => console.log(err));
    };
    const onFinish = (val) => {
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
            changeShowModal(false);
        }

    };
    const deleteRow = ({expressDocumentIds}) => {
        expressDocumentIds && dispatch({
            type: 'expressInformationTracking/deleteExpressDocumentBatch',
            payload: {
                expressDocumentIds
            },
            callback(res:any) {
                if(res.code !== 1008) return openNotification('error', res.message);
                openNotification('success', '删除成功');
                getDataSource();
            }
        });
    };
    const columns = [
        {
            title: '步骤',
            dataIndex: 'codeText',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            render(data) {
                if (data === 1) return <Badge status="default" text="无单号" />;
                if (data === 2) return <Badge status="processing" text="快递中" />;
                if (data === 3) return <Badge status="error" text={<span style={{color: '#FF0000'}}>无单号</span>} />;
                return '--';
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            render(data) {
                return (data && moment(data).format('YYYY-MM-DD')) || '--';
            }
        },
        {
            title: '快递单号',
            dataIndex: 'expressContent',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '快递节点',
            dataIndex: 'step',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '发件人',
            dataIndex: 'sender',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '收件人',
            dataIndex: 'receiver',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '关联文件',
            dataIndex: 'fileName',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '操作',
            align: 'center',
            render(data) {
                return (
                    <div className={styles.operationBox}>
                        <span onClick={() => changeShowModalStatus(data)}>编辑</span>
                        <span onClick={() => deleteRow(data.expressDocumentIds)}>删除</span>
                    </div>
                );
            }
        }
    ];
    useEffect(() => {
        getDataSource();
    }, [pageData.pageNum, pageData.pageSize]);
    return (
        <Card title={'快递信息跟踪'}>
            <Modal closable={false} visible={showModal} maskClosable={false} onCancel={() => changeModalStatus(false)} destroyOnClose width={'60%'} title={'快递跟踪'} onOk={modalSubmit}>
                <ModalPage expressDocumentId={tabRowData?.expressDocumentId} formRef={formRef} stepVal={propsToStepVal} />
            </Modal>
            <Form form={form} onFinish={onFinish}>
                <Row>
                    <Col span={8}>
                        <Button type="primary" className={styles.addBtn} onClick={() => changeShowModalStatus('add')}>创建快递跟踪</Button>
                    </Col>
                    <Col span={16} className={styles.box}>
                        <Button type="primary" htmlType="submit">查询</Button>
                        <div style={{width: 400, marginRight: 16}}>
                            <Form.Item label={'快递单号'} name={'trackingNumber'}>
                                <Input placeholder={'请输入'} />
                            </Form.Item>
                        </div>
                    </Col>
                </Row>
            </Form>
            <MXTable
                loading={loading}
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
        </Card>
    );
};

export default connect(({loading})=>({
    loading: loading.effects['expressInformationTracking/queryList'],
    loading2: loading.effects['expressInformationTracking/deleteExpressDocumentBatch']
}))(ExpressInformationTracking);
