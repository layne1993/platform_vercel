import {
    Button,
    Form,
    Input,
    Table,
    Row,
    Col,
    DatePicker,
    notification,
    Upload,
    Modal,
    Spin
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import { paginationPropsback } from '@/utils/publicData';
import { getCookie } from '@/utils/utils';
import defaultSettings from '../../../../../../config/defaultSettings';
import styles from '../style.less';


const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class TemplateSignInfo extends Component {
    state = {
        datasources: {},
        selectedRowKeys: '',
        showModal: false,
        current: 1
    };

    rowSelectionT = {
        preserveSelectedRowKeys: true,
        onChange: (selectedRowKeys) => {
            this.setState({
                selectedRowKeys: `${selectedRowKeys}`
            });
        }
        // getCheckboxProps: record => ({
        //   disabled: record.name === 'Disabled User',
        //   // Column configuration not to be checked
        //   name: record.name,
        // }),
    };

    columns = [
        {
            title: '签署流程编号',
            dataIndex: 'flowId',
            width: 100,
            render: (val, record) => <Link to={record.flowType === 1 ? `/manager/sign/process/${record.flowId}` : `/manager/sign/supplement/${record.flowId}`}>{val || '--'}</Link>

        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 80,
            ellipsis: true,
            render: (val, record) => <Link to={record.flowType === 1 ? `/manager/sign/process/${record.flowId}` : `/manager/sign/supplement/${record.flowId}`}>{val || '--'}</Link>
        },
        {
            title: '协议类型',
            width: 70,
            dataIndex: 'flowType',
            render: (val) => <span>{val && (val === 1 ? '产品合同' : '补充协议') || '--'}</span>
        },
        {
            title: '协议模板名称',
            dataIndex: 'documentName',
            width: 100,
            ellipsis: true,
            render: (val, record) => <Link to={record.flowType === 1 ? `/manager/sign/process/${record.flowId}` : `/manager/sign/supplement/${record.flowId}`}>{val || '--'}</Link>
        },
        {
            title: '投资者类型',
            dataIndex: 'investorType',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '投资者名称',
            dataIndex: 'investorName',
            width: 80,
            ellipsis: true,
            render: (val, record) => <Link to={record.flowType === 1 ? `/manager/sign/process/${record.flowId}` : `/manager/sign/supplement/${record.flowId}`}>{val || '--'}</Link>
        },
        {
            title: '证件类型',
            dataIndex: 'cardType',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 85,
            ellipsis: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '签署时间',
            dataIndex: 'updateTime',
            width: 110,
            sorter: true,
            render: (val) => <span>{val && moment(val).format('YYYY/MM/DD HH:mm:ss')}</span>
        },
        {
            title: '操作',
            render: (_, record) => <Fragment>
                <a style={{ paddingRight: 8 }} onClick={() => this.downloadDocument(record.documentId)}>下载</a>
                <Link to={record.flowType === 1 ? `/manager/sign/process/${record.flowId}` : `/manager/sign/supplement/${record.flowId}`}>详情</Link>
            </Fragment>
        }
    ];

    componentDidMount() {
        const { params } = this.props;
        if (params.documentCode !== '0') {
            this.SearchMethod();
        }
    }

    SearchMethod = (values, pageNum, pageSize) => {
        const { dispatch, params } = this.props;
        let parameter = {};
        if (values) {
            parameter = {
                pageNum,
                pageSize,
                investorName: values.investorName && (values.investorName).trim(),
                startDate: values.SigningTime && values.SigningTime[0] || null,
                endDate: values.SigningTime && values.SigningTime[1] || null
            };
        }
        dispatch({
            type: 'global/SigningInfoList',
            payload: {
                documentCode: params,
                ...parameter
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        datasources: res
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    // 重置
    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        this.SearchMethod();
        this.setState({
            current: 1,
            formValues: {}
        });
    }

    // 搜索
    handerSearch = (values) => {
        this.SearchMethod(values);
        this.setState({
            formValues: { ...values },
            current: 1
        });
    }

    // 页码改变
    pageNumChange = (current, size) => {
        const { formValues } = this.state;
        this.SearchMethod(formValues, current, size);
        this.setState({
            current
        });
    }

    pageSizeChange = (page, pageSize) => {
        const { formValues } = this.state;
        this.SearchMethod(formValues, page, pageSize);
        this.setState({
            current: page
        });
    }

    // 下载文档
    downloadDocument = (id) => {
        const { selectedRowKeys } = this.state;
        if (id === 0) {
            if (selectedRowKeys === '') {
                return openNotification('warning', '提示', '请勾选下载项', 'topRight');
            }
            window.location.href = `${window.location.origin}${defaultSettings.adminUrl}/attachment/downloadFlow?documentId=${selectedRowKeys}&t=${Date.now()}&flowType=true&companyCode=${getCookie('companyCode')}&customerId=${getCookie('userId')}`;

        } else {
            /* 单个下载 */
            window.location.href = `${window.location.origin}${defaultSettings.adminUrl}/attachment/downloadFlow?documentId=${id}&t=${Date.now()}&flowType=true&companyCode=${getCookie('companyCode')}&customerId=${getCookie('userId')}`;
        }
    }

    // 监听上传成功或失败
    handleFileChange = (e) => {
        this.setState({
            showModal: true
        });
        // console.log(e)
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                this.setState({
                    showModal: false
                });
                openNotification('success', '提醒', '上传成功');

                this.SearchMethod();
            } else {
                this.setState({
                    showModal: false
                });
                openNotification('warning', '提醒', '上传失败');
            }
        }
    }



    render() {
        const { datasources, showModal, current } = this.state;
        const { loading } = this.props;
        return (
            <Fragment>
                <Modal
                    visible={showModal}
                    footer={null}
                    closable={false}
                    centered
                    width={200}
                >
                    文件上传中...
                    <Spin spinning size="large" />
                </Modal>
                <Form
                    hideRequiredMark
                    onFinish={this.handerSearch}
                >
                    <Row gutter={[8, 0]}>
                        <Col span={8} >
                            <FormItem
                                label="投资者名称"
                                name="investorName"
                            >
                                <Input placeholder="请输入投资者名称" />

                            </FormItem>
                        </Col>
                        <Col span={12} >
                            <FormItem
                                label="签署时间"
                                name="SigningTime"
                            >
                                <RangePicker />
                            </FormItem>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={12}>
                            <Button type="primary" onClick={() => this.downloadDocument(0)} style={{ marginRight: 8 }}>批量下载文档</Button>
                            <Upload
                                name="file"
                                action={`${defaultSettings.adminUrl}/product/upLoadProductListExcel`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                showUploadList={false}
                                accept=".xlsx, .xls"
                                // beforeUpload={this.beforeUpload}
                                onChange={this.handleFileChange}
                            >
                                <a>
                                    手动批量上传协议线下签署记录
                                </a>
                            </Upload>
                        </Col>
                        <Col span={12}>
                            <FormItem className={styles.formBtn}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>

                                <Button style={{ marginLeft: 8 }} type="primary">
                                    重置
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>

                <Table
                    // actionRef={actionRef}
                    rowKey="documentId"
                    pagination={paginationPropsback(datasources.total, current, this.pageNumChange, this.pageSizeChange)}
                    columns={this.columns}
                    dataSource={datasources.data}
                    loading={loading}
                    rowSelection={this.rowSelectionT}
                />
            </Fragment>
        );
    }
}

export default connect(({ global, loading }) => ({
    global,
    loading: loading.effects['global/SigningInfoList']
}))(TemplateSignInfo);
