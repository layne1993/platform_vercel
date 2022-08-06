/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-11-10 18:02:26
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import {
    Form,
    Row,
    Col,
    Input,
    Button,
    Table,
    Select,
    Space,
    DatePicker,
    Statistic,
    notification,
    Popconfirm,
    Dropdown,
    Menu
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { paginationPropsback, customerCategoryOptions } from '@/utils/publicData';
import BatchUpload from './../component/batchUpload';
import BatchUpload2 from './../component/batchUpload2';
import Autogeneration from './../component/autogeneration';
import SingleUpload from './../component/singleUpload';
import BuyRecord from './../component/buyRecord';
import { MultipleSelect } from '@/pages/components/Customize';
import MXTable from '@/pages/components/MXTable';
import Build from './../component/newBuild';
import moment from 'moment';
import { getCookie, getUrl, fileExport } from '@/utils/utils';

const DATE_FORMAT = 'YYYY-MM-DD';

const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


class List extends PureComponent {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
        pageData: {
            pageNum: 1,
            pageSize: 20,
            sortType: 'desc',
            sortFiled: 'publishDate'
        },
        dataSource: {},
        powerInfo: {},
        productList: [],
        recordList: [], // 详情
        batchUploadFlag: false,
        buildFlag: false,
        batchUploadFlag2: false, //按产品上传模态框
        autogenerationFlag: false,  // 自动生成模板
        singleUploadFlag: false, // 单独上传弹框
        recordFlag: false // 关联认申赎记录弹框
    };

    componentDidMount() {
        this.getData();
        this.setColumns();
        this.getProductList();

    }

    searchFormRef = React.createRef();

    setColumns = () => {
        const { params = {} } = this.props;
        if (params.customerId) {
            this.columns.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 200,
                ellipsis: true,
                render: (txt) => (txt ? txt : '--')
            });
        } else if (params.productId) {
            this.columns.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 200,
                ellipsis: true,
                render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
            });
            this.columns.unshift(
                {
                    title: '份额类别',
                    dataIndex: 'parentProductId',
                    width: 100,
                    fixed: 'left',
                    render: (val, record) => <div style={{ width: 80 }}>{val && record.productName || '--'}</div>
                }
            );

        } else {
            this.columns.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 200,
                ellipsis: true,
                render: (txt) => (txt ? txt : '--')
            });
            this.columns.unshift({
                title: '客户名称',
                dataIndex: 'customerName',
                width: 200,
                ellipsis: true,
                render: (txt) => (txt ? txt : '--')
            });
        }



    }

    columns = [
        {
            title: '对应认申赎记录',
            dataIndex: 'isConfirmFile',
            width: 150,
            ellipsis: true,
            render: (txt) => (txt ? '有' : '无')
        },
        {
            title: '文件名称',
            dataIndex: 'fileName',
            width: 150,
            ellipsis: true,
            render: (txt) => (txt ? txt : '--')
        },
        {
            title: '文件时间',
            dataIndex: 'fileDate',
            width: 100,
            ellipsis: true,
            sorter: true,
            render: (txt) => (txt ? moment(txt).format(DATE_FORMAT) : '--')
        },
        {
            title: '发布时间',
            dataIndex: 'publishDate',
            width: 100,
            ellipsis: true,
            sorter: true,
            render: (txt) => (txt ? moment(txt).format('YYYY-MM-DD') : '--')
        },
        {
            title: '操作',
            width: 200,
            render: (record) => (
                <Space>
                    {this.props.authEdit && <Popconfirm title="确定删除？" onConfirm={() => this.doDelete(record.confirmFileId)}><a>删除</a></Popconfirm>}
                    <a onClick={() => this.setRecord(record)}>关联认申赎信息</a>
                    {this.props.authExport && record.attachment && <a href={getUrl(record.attachment)} download={record.documentName} target="_blank">下载</a>}
                </Space>
            )
        }
    ];



    /**
     * 产品名称list
     */
    getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'MANAGE_CONFIRMLIST/queryByProductList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({ productList: res.data || [] });
                }
            }
        });
    };

    // 请求数据
    getData = () => {
        const { dispatch, params } = this.props;
        const { pageData } = this.state;
        const formData = this.searchFormRef.current.getFieldsValue();
        dispatch({
            type: 'MANAGE_CONFIRMLIST/getListData',
            payload: {
                ...params,
                ...formData,
                ...pageData,
                fileDate: formData.fileDate ? moment(formData.fileDate).valueOf() : undefined,
                sortType: pageData.sortType && (pageData.sortType === 'ascend' && 'asc' || 'desc') || undefined,
                sortFiled: pageData.sortFiled || undefined
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                } else {
                    this.setState({ dataSource: res.data || {} });
                }
            }
        });
    };

    /**
   * 关联认申赎记录
   * @param { record } 详情数据
   */
    setRecord = (record) => {
        this.setState({
            record,
            recordFlag: true
        });
    }

    /**
   * 搜索
   * @param {过滤字段} vals
   */
    onFinish = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.getData();
    };

    resetSearch = () => {
        this.searchFormRef.current.resetFields();
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.getData();
    };

    // 表格复选框change事件
    onSelectChange = (selectedRowKeys, selectedRows) => {
        this.setState({
            selectedRowKeys,
            selectedRows
        });
    };


    // 删除
    doDelete = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'MANAGE_CONFIRMLIST/deleteConfirmFile',
            payload: { confirmFileIds: id },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '删除成功！', 'topRight');
                    this.setState({ selectedRowKeys: [] });
                    this.getData();
                } else {
                    const warningText = res.message || res.data || '删除失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    batchDelete = () => {
        const { selectedRowKeys } = this.state;
        let ids = selectedRowKeys.join(',');
        this.doDelete(ids);
    }

    /**
     * @description 发布
     */
    publish = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'MANAGE_CONFIRMLIST/publish',
            payload: { confirmFileId: id },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提示', '发布成功', 'topRight');
                    this.closeBuildModal();
                    this.getData();
                } else {
                    const warningText = res.message || res.data || '发布失败';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    /**
     * @description 新建
     */
    build = () => {
        this.setState({
            buildFlag: true
        });
    }

    /**
     * @description 关闭新建模态框
     */
    closeBuildModal = () => {
        this.setState({ buildFlag: false });
    }


    // 批量上传
    batchUpload = () => {
        this.setState({ batchUploadFlag: true });
    };

    batchUpload2 = () => {
        this.setState({ batchUploadFlag2: true });
    }

    /**
     * @description 批量上传成功
     */
    batchUploadSuccess = () => {
        this.closeModal();
        this.getData();
    }

    // 批量下载
    batchDownload = (ids) => {
        const { params = {} } = this.props;
        const formData = this.searchFormRef.current.getFieldsValue();
        const { pageData } = this.state;
        fileExport({
            method: 'post',
            url: '/confirmFile/download',
            data: {
                ...params,
                ...formData,
                fileDate: formData.fileDate && moment(formData.fileDate).valueOf(),
                confirmFileIds: ids,
                ...pageData
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
        //   if(params.customerId) {
        //       window.location.href = `${BASE_PATH.adminUrl}${'/confirmFile/download'}?confirmFileIds=${ids}&customerId=${params.customerId}&tokenId=${getCookie('vipAdminToken')}`;
        //   } else {
        //       window.location.href = `${BASE_PATH.adminUrl}${'/confirmFile/download'}?confirmFileIds=${ids}&tokenId=${getCookie('vipAdminToken')}`;
        //   }

    };

    // 关闭批量上传模态框
    closeModal = () => {
        this.setState({ batchUploadFlag: false, batchUploadFlag2: false });
    };


    setAutogenerationFlag = (flag) => {
        this.setState({ autogenerationFlag: flag });
    }

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;

        if (s.order) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.pageData.sortType = s.order;
        }
        if (s.field) {
            // eslint-disable-next-line react/no-direct-mutation-state
            this.state.pageData.sortFiled = s.field;
        }


        this.getData();
    }

    // 单个上传
    setSingleUpload = () => {
        this.setState({ singleUploadFlag: true });
    }

    // 表单渲染
    formRender = (params) => {
        if (params.productId) {
            return (
                <Row gutter={[8, 0]}>
                    <Col span={6}>
                        {/* <MultipleSelect
                            params="customerId"
                            value="customerId"
                            label="customerName"
                            type={2}
                            formLabel="客户名称"
                        /> */}
                        <Form.Item label="客户名称" name="customerName">
                            <Input placeholder="请输入客户名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="文件名称" name="fileName">
                            <Input placeholder="请输入文件名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="文件时间" name="fileDate">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>搜索</Button>
                            <Button onClick={this.resetSearch} style={{ marginRight: 8 }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
            );
        } else if (params.customerId) {
            return (
                <Row gutter={[8, 0]}>
                    <Col span={6}>
                        <MultipleSelect
                            params="productIds"
                            value="productId"
                            label="productName"
                            mode="multiple"
                            formLabel="产品名称"
                        />
                        {/* <Form.Item label="产品名称" name="productName">
                            <Input allowClear placeholder="请输入产品名称" />
                        </Form.Item> */}
                    </Col>
                    <Col span={6}>
                        <Form.Item label="文件名称" name="fileName">
                            <Input placeholder="请输入文件名称" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item label="文件时间" name="fileDate">
                            <DatePicker style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>搜索</Button>
                            <Button onClick={this.resetSearch} style={{ marginRight: 8 }}>重置</Button>
                        </Form.Item>
                    </Col>
                </Row>
            );
        } else {
            return (
                <>
                    <Row gutter={[8, 0]}>
                        <Col span={6}>
                            <MultipleSelect
                                params="productIds"
                                value="productId"
                                label="productName"
                                mode="multiple"
                                formLabel="产品名称"
                            />
                            {/* <Form.Item label="产品名称" name="productName">
                                <Input allowClear placeholder="请输入产品名称"/>
                            </Form.Item> */}
                        </Col>
                        <Col span={6}>
                            <Form.Item label="客户名称" name="customerName">
                                <Input placeholder="请输入客户名称" allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={6}>
                            <Form.Item label="文件名称" name="fileName">
                                <Input placeholder="请输入文件名称" allowClear />
                            </Form.Item>
                        </Col>

                        <Col span={6} style={{ textAlign: 'right' }}>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>搜索</Button>
                                <Button onClick={this.resetSearch} style={{ marginRight: 8 }}>重置</Button>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={[8, 0]}>
                        <Col span={6}>
                            <Form.Item label="文件时间" name="fileDate">
                                <DatePicker style={{ width: '100%' }} />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="对应认申赎记录" name="isConfirmFile">
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
                    </Row>
                </>
            );
        }
    }

    render() {
        const { dataSource, pageData, selectedRowKeys, record, batchUploadFlag, batchUploadFlag2, autogenerationFlag, singleUploadFlag, recordFlag } = this.state;
        const { loading, params, deleteLoading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange
        };
        return (
            <div>
                <Row gutter={[20, 20]}>
                    <Col span={4}>
                        <Statistic title="份额确认书数量" value={dataSource.total || '--'} suffix={'个'} />
                    </Col>
                </Row>
                <Form ref={this.searchFormRef} onFinish={this.onFinish}>
                    {this.formRender(params)}
                </Form>
                <Row justify="space-between">
                    <Space>
                        {/* {this.props.authEdit && <Button type="primary" onClick={this.batchUpload}>按模板上传</Button>} */}
                        {/* {this.props.authEdit && <Button type="primary" onClick={this.batchUpload2}>按产品上传</Button>} */}
                        {this.props.authEdit && <Button type="primary" onClick={this.setSingleUpload}>单个上传</Button>}
                        {this.props.authEdit && <Button type="primary" onClick={this.batchUpload2}>批量上传</Button>}
                        {this.props.authExport && (
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={() => this.batchDownload(selectedRowKeys)}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={() => this.batchDownload(undefined)}
                                    >
                                        导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button >
                                    &nbsp;&nbsp;批量导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        )}
                        {/* {this.props.authExport && <Button type="primary" onClick={this.batchDownload} disabled={selectedRowKeys.length === 0}>批量下载</Button>} */}
                        {this.props.authEdit && <Button loading={deleteLoading} type="primary" onClick={this.batchDelete} disabled={selectedRowKeys.length === 0} >批量删除</Button>}
                    </Space>
                    <Space size={20}>
                        <Link to={'/infoDisclosure/setting'}>投资者个人中心份额确认书提示文字配置</Link>
                        <a onClick={() => this.setAutogenerationFlag(true)}>份额确认书自动生成</a>
                    </Space>
                </Row>
                <MXTable
                    loading={loading}
                    rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={dataSource.list || []}
                    rowKey="confirmFileId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    sticky
                    total={dataSource.total}
                    pageNum={pageData.pageNum}
                    onChange={this._tableChange}
                />

                {/* {buildFlag && <Build flag={buildFlag} closeModal={this.closeBuildModal} onOk={this.publish} params={params} />} */}
                {batchUploadFlag && (<BatchUpload multiple={false} url="/confirmFile/upload" modalFlag={batchUploadFlag} title="批量上传" closeModal={this.closeModal} params={{ ...params, type: 0 }} onOk={this.batchUploadSuccess} />)}
                {batchUploadFlag2 && (<BatchUpload2 multiple={false} url="/confirmFile/upload" modalFlag={batchUploadFlag2} title="批量上传" closeModal={this.closeModal} params={{ ...params, type: 0 }} onOk={this.batchUploadSuccess} />)}
                {
                    autogenerationFlag &&
                    <Autogeneration
                        params={params}
                        flag={autogenerationFlag}
                        closeModal={() => this.setAutogenerationFlag(false)}
                        onSuccess={() => {
                            this.resetSearch();
                            this.setAutogenerationFlag(false);
                        }}
                    />
                }
                {
                    singleUploadFlag && (
                        <SingleUpload
                            visible={singleUploadFlag}
                            onClose={
                                () => this.setState({ singleUploadFlag: false })
                            }
                        />
                    )
                }
                {
                    recordFlag && (
                        <BuyRecord
                            visible={recordFlag}
                            onClose={
                                () => this.setState({ recordFlag: false })
                            }
                            data={record}
                            tableSearch={this.getData}
                        />
                    )
                }
            </div>
        );
    }

}

export default connect(({ MANAGE_CONFIRMLIST, loading }) => ({
    MANAGE_CONFIRMLIST,
    loading: loading.effects['MANAGE_CONFIRMLIST/getListData'],
    deleteLoading: loading.effects['MANAGE_CONFIRMLIST/deleteConfirmFile']
}))(List);


List.defaultProps = {
    params: {}
};
