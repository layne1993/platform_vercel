import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import type { Dispatch, Loading } from 'umi';
import { Row, Col, Form, Modal, Input, Select, Button, notification } from 'antd';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { MultipleSelect } from '@/pages/components/Customize';
import { XWTransactionType } from '@/utils/publicData';
import { listToMap } from '@/utils/utils';
import File from './file';
import _styles from './styles.less';

const { Option } = Select;

const tradeTypeMap = listToMap(XWTransactionType);

const initPageData = {
    pageNum: 1,
    pageSize: 20
};

const sourceTypeMap = {
    1: '系统录入',
    2: '批量导入',
    3: '托管'
};


const openNotification = (type, message, description, placement, duration?) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


interface defaultProps {
  dispatch: Dispatch;
  loading: boolean;
  visible: boolean; // 弹出框展示
  onClose: () => null; // 关闭回调
}

const SingleUpload: React.FC<defaultProps> = (props: defaultProps) => {

    const columns = [
        {
            title: '份额类别',
            dataIndex: 'parentProductId',
            width:100,
            fixed: 'left',
            render: (val, record) => <div style={{ width: 80 }}>{val && record.productName || '--'}</div>
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            align: 'center',
            width: 200,
            render(val) {
                return val || '--';
            }
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 120,
            align: 'center',
            render(val) {
                return val || '--';
            }
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            align: 'center',
            render(val) {
                return val || '--';
            }
        },
        {
            title: '交易类型',
            dataIndex: 'tradeType',
            width: 120,
            align: 'center',
            render(val) {
                return val && tradeTypeMap[val] || '--';
            }
        },
        {
            title: '申请日期',
            dataIndex: 'tradeApplyTime',
            width: 120,
            align: 'center',
            render(val) {
                return val && moment(val).format('YYYY-MM-DD') || '--';
            }
        },
        {
            title: '确认金额',
            dataIndex: 'tradeMoney',
            width: 120,
            align: 'center',
            render(val) {
                return val || '--';
            }
        },
        {
            title: '确认份额',
            dataIndex: 'tradeShare',
            width: 120,
            align: 'center',
            render(val) {
                return val || '--';
            }
        },
        {
            title: '交易净值',
            dataIndex: 'tradeNetValue',
            width: 120,
            align: 'center',
            render(val) {
                return val || '--';
            }
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 120,
            align: 'center',
            render(val) {
                return val && sourceTypeMap[val] || '--';
            }
        },
        {
            title: '有无份额确认书',
            dataIndex: 'isConfirmFile',
            width: 120,
            align: 'center',
            render(val) {
                return val ? '有' : '无';
            }
        },
        {
            title: '操作',
            align: 'center',
            width: 200,
            render(data) {
                const str = data.isConfirmFile ? '修改份额确认书' : '上传份额确认书';

                return <div onClick={() => openFileUpload(data)}>
                    <a>{str}</a>
                </div>;
            }
        }
    ];
    const { visible, onClose, loading } = props;

    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [dataSource, setDataSource] = useState<any>({}); // 表格数据
    const [fileVisible, setFileVisible] = useState<boolean>(false); // 上传文件框
    const [fileData, setFileData] = useState<any>({}); // 设置文件上传当前数据

    const [form] = Form.useForm();

    // 获取表格数据
    const tableSearch = () => {
        const { dispatch } = props;
        const values = form.getFieldsValue();
        dispatch({
            type: 'MANAGE_CONFIRMLIST/recordQuery',
            payload: {
                ...values,
                ...pageData
            },
            callback: (res) => {
                if (res.code === 1008) {
                    const { list = [], total } = res.data || {};
                    setDataSource({
                        list, total
                    });
                } else {
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '获取数据失败!'}`, 'topRight');
                }
            }
        });
    };

    // 上传文件
    const openFileUpload = (data) => {
        setFileData(data);
        setFileVisible(true);
    };

    // 分页排序等
    const _tableChange = (p, e, s) => {
        setPageData({
            ...pageData,
            pageNum: p.current,
            pageSize: p.pageSize
        });
    };

    useEffect(() => {
        tableSearch();
    }, [pageData]);

    const onFinish = () => {
        setPageData(initPageData);
        tableSearch();
    };

    // 重置
    const onReset = () => {
        form.setFieldsValue({
            customerName: '',
            productIds: [],
            cardNumber: '',
            isConfirmFile: null

        });
        tableSearch();
    };

    useEffect(() => {
        tableSearch();
    }, []);

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            wrapClassName={_styles.singleUpload}
            footer={[]}
        >
            <div>
                <Row gutter={[20, 20]}>
                    <Col span={24}>
                        <h3>上传投资者份额确认书</h3>
                    </Col>
                </Row>
                <Form form={form} onFinish={onFinish}>
                    <Row gutter={[8, 0]}>

                        <Col span={8}>
                            <Form.Item label="客户名称" name="customerName">
                                <Input placeholder="请输入客户名称" allowClear />
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
                            <Form.Item label="证件号码" name="cardNumber">
                                <Input placeholder="请输入证件号码" allowClear />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item label="份额确认书" name="isConfirmFile">
                                <Select placeholder="请选择" allowClear>
                                    <Option key={1} value={1}>
                    有
                                    </Option>
                                    <Option key={0} value={0}>
                    无
                                    </Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                        </Col>
                        <Col span={8} style={{ textAlign: 'right' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>搜索</Button>
                                <Button onClick={onReset} style={{ marginRight: 8 }}>重置</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
                <MXTable
                    loading={loading}
                    // rowSelection={rowSelection}
                    columns={columns}
                    dataSource={dataSource.list || []}
                    rowKey="confirmFileId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: 400 }}
                    sticky
                    total={dataSource.total}
                    pageNum={pageData.pageNum}
                    onChange={_tableChange}

                />
                {
                    fileVisible && (
                        <File
                            visible={fileVisible}
                            onClose={() => setFileVisible(false)}
                            tableSearch={tableSearch}
                            data={fileData}
                            title="上传投资者份额确认书"
                        />
                    )
                }
            </div >
        </Modal>
    );
};

export default connect(({ loading }): { loading: Loading } => ({
    loading: loading.effects['MANAGE_CONFIRMLIST/recordQuery']
}))(SingleUpload);
