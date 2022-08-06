/*
 * @description: 文件信息
 * @Author: tangsc
 * @Date: 2020-11-02 10:45:29
 */
import { Button, Form, Row, Input, Select, Col, Dropdown, notification, DatePicker, Modal, Menu, Space, Tooltip } from 'antd';
import { connect, history } from 'umi';
import React, { Fragment, Component } from 'react';
import { getCookie, exportFile, fileExport } from '@/utils/utils';
import { FILE_TYPE, XWFileAuthority } from '@/utils/publicData';
import moment from 'moment';
import styles from '../details/components/styles/Tab3.less';
import { ExclamationCircleOutlined, PlusOutlined, DownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { MultipleSelect } from '@/pages/components/Customize';
import MXTable from '@/pages/components/MXTable';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import MXAnnouncement from '@/pages/components/MXAnnouncement';
import FileInfoDetails from '../fileInfo';
import BatchAdd from './batchAdd';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message, description, placement, duration: duration || 3
    });
};
const { Option } = Select;
const FormItem = Form.Item;
const { confirm } = Modal;
const { authEdit, authExport } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['30103'] || {};
// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm:ss';

class Tab3 extends Component {
    state = {
        datasources: {},
        powerInfo: {},
        pageData: {
            pageNum: 1,
            pageSize: 20
        },
        selectedRowKeys: [],                 // 选中table行的key值
        isModalVisible: false,               // 控制新增净值弹窗显示隐藏
        isAddOrEdit: 'add',                  // 判断新增或者编辑
        productFileId: 0,                     // 文件id
        announcementModalFlag: false,         // 模板模态框flag
        batchVisible: false, // 批量上传
        productId: ''
    };

    componentDidMount() {
        this.Interfacesearch();
    }

    searchFormRef = React.createRef();

    columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            render: (val, record) => <a onClick={() => history.push(`/product/list/details/${record.productId}`)}>{val || '--'}</a>,
            width: 100
        },
        {
            title: '文件名称',
            dataIndex: 'documentName',
            render: (val, record) => <a onClick={() => this._handleEdit(record)}>{val || '--'}</a>,
            width: 100
        },
        {
            title: <span><Tooltip placement="top" title={'默认会读取母基金的所有文件'}><InfoCircleOutlined /></Tooltip>&nbsp;母基金文件</span>,
            dataIndex: 'isParentFund',
            render: (val) => <span>{val || '--'}</span>,
            width: 110
        },
        {
            title: '文件类型',
            dataIndex: 'documentType',
            render: (val) => <span>{val && FILE_TYPE.find((item) => (item.value === val)).label || '--'}</span>,
            width: 120
        },
        {
            title: '文件权限',
            dataIndex: 'fileAuthority',
            width: 150,
            render: (val) => {
                if (!isEmpty(val)) {
                    let renderText = '';
                    val.forEach((item) => {
                        renderText = `${renderText}${XWFileAuthority[item - 1].label}，`;
                    });
                    return <span>{renderText.substring(0, renderText.length - 1) || '--'}</span>;
                }
            }
            // width:120,
        },
        // {
        //     title: '发布状态',
        //     dataIndex: 'startStatus',
        //     render: (val) => <span>{val === 0 && '未发布' || val === 1 && '已发布' || '--'}</span>
        //     // width:100,
        // },
        {
            title: '发布人',
            dataIndex: 'userName',
            render: (val) => <span>{val || '--'}</span>,
            width: 100
        },
        {
            title: '发布时间',
            dataIndex: 'publishTime',
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>,
            width: 120
        },
        {
            title: '操作',
            width: 100,
            render: (_, record) => {
                return (
                    <Fragment>
                        {
                            authEdit &&
                            <div>
                                <a onClick={() => this._handleEdit(record)}>查看</a>
                                <a style={{ marginLeft: 8 }} onClick={() => this.deleteFile(record.productFileId)}>删除</a>
                                {record.attachment && (record.attachment.signUrl ? <a href={`${record.attachment.signUrl}`} download={record.documentName} target="_blank">&nbsp;&nbsp;下载</a> : <a href={`${record.attachment.baseUrl}`} download={record.documentName} target="_blank">&nbsp;&nbsp;下载</a>)}
                            </div>
                        }

                    </Fragment>
                );
            }
        }
    ];

    _handleDownload = (url) => {
        exportFile(url);
    }

    deleteFile = (id) => {
        const { dispatch } = this.props;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该文件信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'productNotice/deleteProductFile',
                    payload: {
                        productFileId: id
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this.Interfacesearch();
                        } else {
                            const warningText = res.message || res.data || '查询失败！';
                            openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
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
     * @description 查询数据
     */
    Interfacesearch = () => {
        // alert(2)
        const { dispatch, params } = this.props;
        const { pageData } = this.state;
        const fromData = this.searchFormRef.current.getFieldsValue();
        dispatch({
            type: 'productNotice/getProductFile',
            payload: {
                ...fromData,
                publishTime: fromData.publishTime && moment(fromData.publishTime).valueOf(),
                ...pageData
            },
            callback: (res) => {

                if (res.code === 1008 && res.data) {
                    this.setState({
                        datasources: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }

    // 重置搜索
    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.Interfacesearch();
    }

    // 搜索
    handerSearch = () => {
        this.Interfacesearch();
    }

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        console.log(p, e, s);
        // eslint-disable-next-line react/no-direct-mutation-state
        // this.state.pageData.pageNum = p.current;
        // this.state.pageData.pageSize = p.pageSize;

        this.setState({
            pageData: {
                pageNum: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this.Interfacesearch();
        });


    }


    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys, selectRows) => {
        console.log(selectedRowKeys, selectRows);
        this.setState({
            selectedRowKeys
        });
    };

    /**
     * @description: 清空已勾选
     */
    _cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: []
        });
    };


    /**
     * @description: 批量导出产品信息
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/productFile/download?productFileIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
    }


    // 导出全部
    _downloadAll = () => {
        const { pageData } = this.state;
        const fromData = this.searchFormRef.current.getFieldsValue();

        fileExport({
            method: 'post',
            url: '/productFile/allExport',
            data: {
                ...fromData,
                publishTime: fromData.publishTime && moment(fromData.publishTime).valueOf(),
                ...pageData
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '下载成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '下载失败！');
                }
            }
        });
    }

    /**
     * @description: 文件编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            productFileId: record.productFileId,
            isModalVisible: true,
            productId: record.productId
        });
    }


    /**
     * @description: 新增文件
     */
    _onAdd = () => {
        this.setState({
            productId:'',
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };

    /**
     * @description: 批量上传
     */
    batchAdd = () => {
        this.setState({ batchVisible: true });
    };

    /**
     * @description: 关闭新增、编辑文件弹窗
     * @param {*}
     */
    _handleClose = () => {
        this.setState({ isModalVisible: false });
    }

    /**
     * @description: 关闭新增、编辑文件弹窗
     * @param {*}
     */
    batchClose = () => {
        this.setState({ batchVisible: false });
    }

    renderForm = () => {
        const { powerInfo, selectedRowKeys } = this.state;
        return (
            <Form
                hideRequiredMark
                style={{
                    marginTop: 8
                }}
                ref={this.searchFormRef}
                onFinish={this.handerSearch}
            >
                <Row gutter={[20, 0]}>

                    <Col span={6}>
                        <FormItem
                            label="文件名称"
                            name="documentName"
                        >
                            <Input placeholder="请输入文件名称" autoComplete="off" />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            label="发布时间"
                            name="publishTime"
                        >
                            <DatePicker style={{ width: '100%' }} />
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <MultipleSelect
                            params="productIds"
                            value="productId"
                            label="productName"
                            mode="multiple"
                            formLabel="产品名称"
                        />
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <FormItem>
                            <Button type="primary" htmlType="submit" loading={false}>
                                查询
                            </Button>

                            <Button style={{ marginLeft: 8 }} onClick={this.resetSearch}>
                                重置
                            </Button>
                        </FormItem>
                    </Col>
                </Row>
                <Row justify="space-between">
                    <Space>
                        {
                            authEdit &&
                            <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                新建
                            </Button>
                        }
                        {
                            authEdit &&
                            <Button type="primary" onClick={this.batchAdd}>
                                批量上传
                            </Button>
                        }
                        {
                            authExport &&
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={this._export}
                                    >
                                        下载选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={this._downloadAll}
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
                            // <Button onClick={this._export} disabled={isEmpty(selectedRowKeys)}>
                            //     批量下载
                            // </Button>
                        }
                        {
                            authEdit &&
                        <a onClick={() => this.announcementModalSwitch(true)}>自动生成公告文件</a>
                        }
                    </Space>


                </Row>
            </Form>
        );
    }

    // 模板模态框
    announcementModalSwitch = (flag) => {
        this.setState({
            announcementModalFlag: flag
        });
    }

    render() {
        const { loading, params } = this.props;
        const { datasources, productId, pageData, selectedRowKeys, isModalVisible, isAddOrEdit, productFileId, announcementModalFlag, batchVisible } = this.state;

        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <PageHeaderWrapper title="产品公告文件">
                <div className={styles.container}>
                    <div style={{ marginTop: 20, marginBottom: 20 }}>{this.renderForm()}</div>
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={datasources && datasources.list}
                        total={datasources.pageNum && datasources.total}
                        pageNum={pageData.pageNum}
                        rowKey={(record) => record.productFileId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        sticky
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    />
                    {
                        isModalVisible &&
                    <FileInfoDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        productFileId={productFileId}
                        operateType={isAddOrEdit}
                        authEdit={authEdit}
                        authExport={authExport}
                        productId={productId}
                        Interfacesearch={this.Interfacesearch}
                        showProduct
                    />
                    }

                    {
                        announcementModalFlag && <MXAnnouncement disabled="1" params={params} modalFlag={announcementModalFlag} closeModal={() => this.announcementModalSwitch(false)} updatelist={() => this.Interfacesearch()} />
                    }
                    {
                        batchVisible && (
                            <BatchAdd
                                modalVisible={batchVisible}
                                onCancel={this.batchClose}
                                productFileId={productFileId}
                                authEdit={authEdit}
                                authExport={authExport}
                                showProduct
                                Interfacesearch={this.Interfacesearch}
                            />)
                    }
                </div>
            </PageHeaderWrapper>
        );
    }

}

export default connect(({ loading }) => ({
    loading: loading.effects['productNotice/getProductFile']
}))(Tab3);
