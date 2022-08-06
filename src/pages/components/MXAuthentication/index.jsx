/*
 * @description: 实名信息
 * @Author: yezi
 * @Date: 2020-10-28 10:50:48
 */
import React, { Component, Fragment } from 'react';
import { Select, Button, Radio, DatePicker, Row, Form, Col, Menu, Space, message, Modal, notification, Input, Dropdown } from 'antd';
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import { XWnameStatus, realNameIsEffectived, realNameMode, XWUseStatus } from '@/utils/publicData';
import { getCookie, listToMap, getUrl, getPermission, fileExport } from '@/utils/utils';
import request from '@/utils/rest';
import { connect, FormattedMessage, history } from 'umi';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import AuthenticationConfig from './components/authenticationConfig';
import Check from './components/check';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';




const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
class Authentication extends Component {
    state = {
        selectValue: null, // 保存select选择的value值
        selectedRowKeys: [], // 选中table行的key值
        loading: false, // loading状态
        dataSource: {},
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        modalFlag: false,
        checkFlag: false,
        fileList: [],
        rowInfo: {},
        attachmentsId: undefined
    };

    componentDidMount() {
        this.getListData({...this.state.pageData});

    }

    formRef = React.createRef();


    // Table的列
    columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName'
        },
        {
            title: '实名状态',
            dataIndex: 'realnameState',
            render: (val) => listToMap(XWnameStatus)[val]
        },
        {
            title: '实名有效性',
            dataIndex: 'isEffectived',
            render: (val) => listToMap(realNameIsEffectived)[val]
        },
        {
            title: '实名方式',
            dataIndex: 'mode',
            render: (val) => listToMap(realNameMode)[val]
        },
        {
            title: '实名完成时间',
            dataIndex: 'finishTime',
            render: (val) => val && moment(val).format(DATE_FORMAT) || '--'
        },
        {
            title: '操作',
            dataIndex: '',
            render: (record) => {
                return (
                    <Space>
                        {(record.auditResult || record.realnameState === 3 || record.hasAuthorizationLetters ===1) &&
                            <a onClick={() => this.setState({checkFlag: true, rowInfo: record})}>{record.realnameState === 3? '审核' : '查看'}</a>
                        }
                    </Space>
                );
            }
        }
    ];



    /**
     * @description 获取list数据
     */
    getListData = (filterParams = {}) => {
        // return;
        const { dispatch, params } = this.props;

        dispatch({
            type: 'INVESTOR_AUTHENTICATION/realNameList',
            payload: { ...params, ...filterParams, sortType: 'desc' },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
                if (res.data && res.data) {
                    this.setState({
                        dataSource: res.data || []
                    });
                }
                this.setState({
                    pageData:filterParams
                });
            }
        });
    }

    // 重置
    reset = () => {
        const { pageData } = this.state;
        this.setState({ pageData: { ...pageData, pageNum: 1 }});
        this.formRef.current.resetFields();
        this.getListData({ ...pageData, ...this.getformParams(), pageNum: 1 });

    }

    /**
     * @description 完成时间
     * @param {} date
     */
    doneDateChange = (date) => {
        if (date) {
            this.formRef.current.setFieldsValue({
                riskLimitDate: moment(date).add(3, 'years')
            });
        }
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
     * @description 批量下载
     */
    _batchDownload = () => {
        const { selectedRowKeys } = this.state;
        const { params = {} } = this.props;
        if (selectedRowKeys.length === 0) {
            message.warning('请选择需要下载的数据！');
            return;
        }
    }

    /**
     * @description 下载全部
     */
    downloadAll = () => {
        const { params } = this.props;
        fileExport({
            method: 'post',
            url: '/riskRecord/downloadAll',
            data: {
                ...params
            },
            callback: ({ status, message ='导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    }


    getformParams = () => {
        let formParams = this.formRef.current.getFieldsValue();
        return formParams;
    }


    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        const pageData = {
            pageNum: p.current,
            pageSize: p.pageSize
        };
        this.setState({pageData});
        this.getListData({...pageData, ...this.getformParams() });
    }




    /**
     * @description 模态框操作
     * @param {*} flag true /false
     */
    modalCancel = (flag) => {
        this.setState({
            modalFlag: flag
        });
    }

    checkModalFlag = (falg) => {
        this.setState({ checkFlag: falg });
    }

    checkOnOk = () => {
        this.checkModalFlag(false);
        this.getListData({...this.state.pageData, ...this.getformParams()});
    }

    render() {
        const { selectedRowKeys, dataSource, pageData, modalFlag, checkFlag, rowInfo } = this.state;
        const { loading, updateing, createing, params = {} } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };


        return (
            <div >
                <Form onFinish={(values) => this.getListData({ ...pageData, ...values, pageNum:1})} ref={this.formRef}>
                    <Row gutter={[8, 0]}>
                        {!params.customerId &&
                            <Col span={8}>
                                <Form.Item label="客户名称" name="customerName">
                                    <Input placeholder="请输入" allowClear />
                                </Form.Item>
                            </Col>
                        }
                        <Col span={8}>
                            <Form.Item label="实名状态" name="realnameState">
                                <Select placeholder="请选择" allowClear>
                                    {XWnameStatus.map((item) => {
                                        return (
                                            <Select.Option key={item.value} value={item.value}>
                                                {item.label}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={()=> this.reset()}>重置</Button>
                            </Space>
                        </Col>
                    </Row>
                </Form>
                <Row justify="end">
                    <Space>
                        {/* {
                            this.props.authExport && <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={this._batchDownload}>批量下载</Button>
                        } */}
                        {/* {this.props.authExport &&
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={this._batchDownload}
                                    >
                                        导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={this.downloadAll}
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
                        } */}
                    </Space>
                    <Space>
                        {
                            // this.props.authEdit &&
                            !params.customerId &&
                            <Button type="primary" onClick={() => this.modalCancel(true)}>实名配置</Button>
                        }
                    </Space>
                </Row>
                <div >

                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSource.list}
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        onChange={this._tableChange}
                        rowKey="customerRealnameId"
                    />
                </div>

                {
                    modalFlag &&
                    <AuthenticationConfig
                        flag={modalFlag}
                        closeModal={() => this.modalCancel(false)}
                    />
                }

                {
                    checkFlag &&
                    <Check
                        params={rowInfo}
                        flag={checkFlag}
                        closeModal={() => this.checkModalFlag(false)}
                        onOk={this.checkOnOk}
                    />
                }
            </div>
        );
    }
}

export default connect(({ INVESTOR_AUTHENTICATION, loading }) => ({
    INVESTOR_AUTHENTICATION,
    loading: loading.effects['INVESTOR_AUTHENTICATION/realNameList']
}))(Authentication);


Authentication.defaultProps = {
    params: {}
};
