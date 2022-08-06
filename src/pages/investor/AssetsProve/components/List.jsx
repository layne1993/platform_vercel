/*
 * @description: 资产证明管理-列表
 * @Author: tangsc
 * @Date: 2020-10-21 16:24:43
 */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Button, Space, notification, Modal, Row, Col, Form, Select, Input, DatePicker } from 'antd';
import { XWCertificatesType, ApplicationProgress, ApplicationSource } from '@/utils/publicData';
import styles from './List.less';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { getCookie, getRandomKey } from '@/utils/utils';
import { MultipleSelect } from '@/pages/components/Customize';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddModal from './AddModal';
import axios from 'axios';
import qs from 'qs';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;
const { TextArea } = Input;
// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class List extends PureComponent {
    state = {
        loading: false, // loading状态
        selectedRowKeys: [], // 选中table行的key值
        exportVisible: false, //批量下载弹窗
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        searchParams: {},              // 查询参数
        sortFiled: '',                 // 排序字段
        sortType: '',                  // 排序类型：asc-升序；desc-降序
        assetProveList: [],            // 资产证明列表数据
        isModalVisible: false,         // 控制新增弹窗显示隐藏
        assetsCertificationId: 0,      // 资产证明id
        isExamineModal: false,         // 控制资产证明审核弹窗显示隐藏
        isNeedCheck: 0,                 // 是否需要审核 0：否 1：是
        test: []
    };

    componentDidMount() {
        this._search();
        this._setColums();
        // 查询是否需要审核
        this._queryProductSetting();
    }

    // 表单实例对象
    formRef = React.createRef();
    examineFormRef = React.createRef();

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { params = {} } = this.props;
        if (!params.customerId) {
            this.columns1.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 100,
                render: (val) => <span>{val || '--'}</span>
            });
            this.columns2.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 100,
                render: (val) => <span>{val || '--'}</span>
            });
        }
    }

    // Table的列
    columns1 = [
        {
            title: '证件类型',
            dataIndex: 'cardType',
            width: 80,
            render: (val) => {
                let obj = XWCertificatesType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '申请产品',
            dataIndex: 'productNames',
            width: 120,
            render: (text, record) => {
                let value = '--';
                if (!!text) {
                    let str = text.substr(1);
                    value = str.substring(0, str.length - 1);
                }
                return value;
            }
        },
        {
            title: '申请日期',
            dataIndex: 'commitTime',
            width: 150,
            render: (val) => (val ? moment(val).format(dateFormat) : '--')
        },
        {
            title: '文件',
            dataIndex: 'fileDownload',
            // fixed: 'right',
            width: 200,
            render: (text, record) => {
                return this.props.authExport &&
                    <Space>
                        <a onClick={() => this._downLoad(1, record.assetsCertificationId)}>用印文件下载</a>
                        <a onClick={() => this._downLoad(2, record.assetsCertificationId)}>未用印文件下载 </a>
                    </Space >;

            }
        },
        {
            title: '资产证明来源',
            dataIndex: 'source',
            width: 110,
            render: (val) => {
                let obj = ApplicationSource.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作人员',
            dataIndex: 'checkPerson',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '申请进度',
            dataIndex: 'checkState',
            width: 100,
            render: (val) => {
                let obj = ApplicationProgress.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 120,
            render: (text, record) => {
                return this.props.authEdit && <Space>
                    {
                        record.isNeedCheck === 1 &&
                        record.checkState === 0 &&
                        <a onClick={() => this._examine(record.assetsCertificationId)} style={{ color: 'red' }}>审核</a>
                    }
                    <a onClick={() => this._delete(record.assetsCertificationId)}>删除 </a>
                </Space >;

            }
        }
    ];

    // Table的列
    columns2 = [
        {
            title: '证件类型',
            dataIndex: 'cardType',
            width: 80,
            render: (val) => {
                let obj = XWCertificatesType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '申请产品',
            dataIndex: 'productNames',
            width: 120,
            render: (text, record) => {
                let value = '--';
                if (!!text) {
                    let str = text.substr(1);
                    value = str.substring(0, str.length - 1);
                }
                return value;
            }
        },
        {
            title: '申请日期',
            dataIndex: 'commitTime',
            width: 150,
            render: (val) => (val ? moment(val).format(dateFormat) : '--')
        },
        {
            title: '文件',
            dataIndex: 'fileDownload',
            // fixed: 'right',
            width: 200,
            render: (text, record) => {
                return this.props.authExport &&
                    <Space>
                        <a onClick={() => this._downLoad(1, record.assetsCertificationId)}>用印文件下载</a>
                        <a onClick={() => this._downLoad(2, record.assetsCertificationId)}>未用印文件下载 </a>
                    </Space >;
            }
        },
        {
            title: '资产证明来源',
            dataIndex: 'source',
            width: 110,
            render: (val) => {
                let obj = ApplicationSource.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '操作人员',
            dataIndex: 'checkPerson',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        }
    ];


    _queryProductSetting = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/queryProductSetting',
            payload: {},
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        isNeedCheck: res.data.isAssetNeedCheck,
                        test: res.data.isAssetNeedCheck === 1 ? this.columns1 : this.columns2
                    });
                }
            }
        });
    }


    /**
     * @description: 点击审核按钮
     * @param {Number} id
     */
    _examine = (id) => {
        this.setState({
            assetsCertificationId: id,
            isExamineModal: true
        });
    }

    /**
     * @description: 删除单条资产证明
     * @param {Number} id
     */
    _delete = (id) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '是否删除该客户申请的资产证明?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后，后台和投资者端都没有该条申请信息，请您确认是否删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'INVESTOR_ASSETSPROVE/deleteAssetProve',
                    payload: {
                        assetsCertificationId: id
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== id;
                            });
                            _this.setState({
                                selectedRowKeys: selectArr
                            });
                        } else {
                            const warningText = res.message || res.data || '删除失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { commitTime, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.commitTime = (commitTime && new Date(`${moment(commitTime).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        this.setState({
            searchParams: {
                ...params,
                ...tempObj
            },
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                pageNum: 1
                // pageSize: 20
            }
        }, () => {
            this._search();
        });
    };

    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch, params = {} } = this.props;

        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'INVESTOR_ASSETSPROVE/listData',
            payload: {
                customerId: !!params.customerId ? Number(params.customerId) : undefined,
                pageNum: pageData.pageNum || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        assetProveList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        signList: [],
                        signInfoList: []
                    });
                }
            }
        });
    }


    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {},
            selectedRowKeys: []
        }, () => {
            this._search();
        });
    };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {

        this.setState({
            sortFiled: s.field,
            sortType: !!s.order ? s.order === 'ascend' ? 'asc' : 'desc' : undefined,
            pageData: {
                pageNum: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }

    /**
     * @description: 下载用印文件
     * @param {*} type:1 下载已用印文件 2：未用印
     */
    _downLoad = (type, id) => {
        let url = '';
        if (type === 1) {
            url = '/assetProve/download/sealed';
        } else if (type === 2) {
            url = '/assetProve/download/unsealed';
        }
        this.postDownload(url, { assetsCertificationId: id });
    }

    // post 方式下载
    postDownload = (url, data) => {
        axios({
            url: `${BASE_PATH.adminUrl}${url}?${qs.stringify({ ...data })}`,
            method: 'post',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json; application/octet-stream',
                'tokenId': getCookie('vipAdminToken') || ''
            }
        }).then((response) => {
            // console.log('response', response);
            let fileName = response.headers['content-disposition'].split(';')[1].split('filename*=utf-8\'\'')[1];
            fileName = decodeURIComponent(fileName);
            let blob = new Blob([response.data]);
            let downloadElement = document.createElement('a');
            let href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
        }).catch(function (error) {
            openNotification('warning', '提示', '下载失败', 'topRight');
        });
    }

    // 批量下载弹窗
    _exportModal = () => {
        this.setState({
            exportVisible: true
        });
    }

    /**
     * @description: 关闭批量下载弹窗
     * @param {*}
     */
    _onCancel = () => {
        this.setState({
            exportVisible: false
        });
    }

    /**
     * @description: 批量下载
     * @param {Number} type: 1: 已用印 2：未用印
     */
    _downloadFile = (type) => {
        const { selectedRowKeys } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/assetProve/batchDownload?assetsCertificationIds=${selectedRowKeys.toString()}&isSealed=${type}&tokenId=${getCookie('vipAdminToken')}`;
        // this._onCancel();
    }


    // 打开关闭新增弹窗
    toggle = () => {
        this.setState({
            isModalVisible: !this.state.isModalVisible
        }, () => {
            this._search();
        });
    }


    /**
     * @description: 新增弹窗onok事件
     * @param {Object} params
     */
    handleOk = (params) => {
        console.log('params', params);
    }

    /**
     * @description: 关闭资产证明审核弹窗
     * @param {*}
     */
    _onClose = () => {
        this.setState({
            assetsCertificationId: 0,
            isExamineModal: false
        });
    }


    /**
     * @description: 审核按钮
     * @param {*}
     */
    _onOk = (status) => {
        const { assetsCertificationId } = this.state;
        const fields = this.examineFormRef.current.getFieldsValue();
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_ASSETSPROVE/check',
            payload: {
                assetsCertificationId,
                checkState: status,
                ...fields
            },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '操作成功', 'topRight');
                    this._onClose();
                    this._search();
                } else {
                    const warningText = res.message || res.data || '操作失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    render() {
        const { pageData, selectedRowKeys, assetProveList, exportVisible, isModalVisible, isExamineModal, isNeedCheck } = this.state;
        const { params, loading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange,
            getCheckboxProps: (record) => ({
                disabled: record.name === 'Disabled User',
                name: record.name
            })
        };

        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef} autoComplete="off">
                        <Row gutter={[8, 0]}>
                            {
                                !params.customerId &&
                                <Col span={6}>
                                    <FormItem label="客户名称" name="customerName">
                                        <Input placeholder="请输入" />
                                    </FormItem>
                                </Col>
                            }
                            <Col span={6} >
                                <FormItem label="证件号码" name="cardNumber">
                                    <Input placeholder="请输入" />
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <MultipleSelect
                                    params="productIds"
                                    value="productId"
                                    label="productName"
                                    mode="multiple"
                                    formLabel="申请产品"
                                />
                            </Col>
                            {
                                params.customerId &&
                                <Col span={6}>
                                    <FormItem label="申请时间" name="commitTime">
                                        <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>

                            }
                            <Col span={6} className={styles.btnGroup}>
                                <Space align="end">
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button onClick={this._reset}>重置</Button>
                                </Space>
                            </Col>
                        </Row>
                        <Row gutter={[8, 0]}>
                            {
                                isNeedCheck === 1 &&
                                <Col span={6}>
                                    <FormItem label="申请进度" name="checkState">
                                        <Select placeholder="请选择" allowClear>
                                            {
                                                ApplicationProgress.map((item) => (
                                                    <Option key={getRandomKey(6)} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                ))
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            <Col span={6}>
                                <FormItem label="资产证明来源" name="source">
                                    <Select placeholder="请选择" allowClear>
                                        {
                                            ApplicationSource.map((item) => (
                                                <Option key={getRandomKey(6)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            ))
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                !params.customerId &&
                                <Col span={6}>
                                    <FormItem label="申请时间" name="commitTime">
                                        <DatePicker format="YYYY/MM/DD" style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>

                            }

                        </Row>
                    </Form>
                </div>
                <div className={styles.operationBtn}>
                    <Space>
                        {
                            // authEdit &&
                            <Button type="primary" icon={<PlusOutlined />} onClick={this.toggle}>
                                新建
                            </Button>
                        }
                        {params.customerId && this.props.authExport &&
                            <div className={styles.filter}>
                                <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={() => this._exportModal()}>批量下载</Button>
                            </div >
                        }
                    </Space>
                </div>
                <Modal
                    title="批量下载"
                    className={styles.exportModal}
                    visible={exportVisible}
                    onCancel={this._onCancel}
                    footer={null}
                    centered
                    maskClosable={false}
                >
                    <Space>
                        <Button type="primary" onClick={() => this._downloadFile(1)}>用印文件下载</Button>
                        <Button type="primary" onClick={() => this._downloadFile(0)}>未用印文件下载</Button>
                    </Space>
                </Modal>
                <div className={styles.dataTable}>
                    <MXTable
                        loading={loading}
                        columns={this.state.test}
                        dataSource={assetProveList.list || []}
                        total={assetProveList.total}
                        pageNum={pageData.pageNum}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        rowKey={(record) => record.assetsCertificationId}
                    />

                </div>
                {
                    isModalVisible &&
                    <AddModal
                        onCancel={this.toggle}
                        isModalVisible
                        onOk={this.handleOk}
                        params={params}
                    />
                }
                {
                    isExamineModal &&
                    <Modal
                        className={styles.assetProveExamineModal}
                        width={500}
                        title="资产证明审核"
                        centered
                        maskClosable={false}
                        visible={isExamineModal}
                        // visible
                        onCancel={this._onClose}
                        footer={
                            [

                                <Button key="cancel" className="modalButton" onClick={this._onClose}>
                                    取消
                                </Button>,
                                <Button key="next" className="modalButton" onClick={() => this._onOk(2)}>
                                    审核不通过
                                </Button>,
                                <Button key="next" type="primary" className="modalButton" onClick={() => this._onOk(1)}>
                                    审核通过
                                </Button>
                            ]
                        }
                    >
                        <Row className={styles.fileDownloadRow}>
                            <Col span={6}><span>资产证明文件：</span></Col>
                            <Col span={18}><span className={styles.downloadFileSpan} onClick={() => this._downLoad(1, this.state.assetsCertificationId)}>用印文件下载</span></Col>
                        </Row>
                        <Form
                            name="examine"
                            ref={this.examineFormRef}
                            autoComplete="off"
                        >

                            <FormItem
                                label="审核不通过反馈"
                                name="remark"
                            >
                                <TextArea placeholder="请输入反馈意见" />
                            </FormItem>
                        </Form>
                    </Modal>
                }
            </div >
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['INVESTOR_ASSETSPROVE/listData']
}))(List);

List.defaultProps = {
    params: {}
};
