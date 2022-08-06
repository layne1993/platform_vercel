/*
 * @description:风险测评信息
 * @Author: tangsc
 * @Date: 2020-10-28 10:50:48
 */
import React, { Component, Fragment } from 'react';
import { Select, Button, InputNumber, DatePicker, Row, Form, Col, Menu, Space, message, Modal, notification, Upload, Dropdown } from 'antd';
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import { paginationPropsback, XWnumriskLevel, ORGIN_FROM, XWUseStatus, ISUSESEAl } from '@/utils/publicData';
import { getCookie, listToMap, getUrl, getPermission, fileExport } from '@/utils/utils';
import request from '@/utils/rest';
import { connect, FormattedMessage, history } from 'umi';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';

const DATE_FORMAT = 'YYYY-MM-DD HH:mm';

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 10
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 14
        },
        md: {
            span: 14
        }
    }
};

const formItemLayout1 = {
    labelCol: {
        xs: {
            span: 8
        },
        sm: {
            span: 3
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 14
        },
        md: {
            span: 14
        }
    }
};



const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
class RiskAssessment extends Component {
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
        detailFlag: false,
        fileList: [],
        riskInfo: {},
        attachmentsId: undefined
    };

    componentDidMount() {
        this.getRiskListData();

    }

    formRef = React.createRef();


    // Table的列
    columns = [
        // {
        //     title: '问卷版本',
        //     dataIndex: 'versionNumber'
        // },
        {
            title: '投资者分值',
            dataIndex: 'score'
        },
        {
            title: '风险等级',
            dataIndex: 'riskType'
            // render: (val) => listToMap(XWnumriskLevel)[val]
        },
        {
            title: '星级',
            dataIndex: 'riskStarRating',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '完成时间',
            dataIndex: 'riskDate',
            render: (val) => val && moment(val).format(DATE_FORMAT)
        },
        {
            title: '问卷有效性',
            dataIndex: 'usableStatus',
            render: (val) => listToMap(XWUseStatus)[val]
        },
        {
            title: '问卷到期时间',
            dataIndex: 'riskLimitDate',
            render: (val) => val && moment(val).format(DATE_FORMAT)
        },
        {
            title: '问卷来源',
            dataIndex: 'sourceType',
            render: (val) => listToMap(ORGIN_FROM)[val]
        },
        {
            title: '问卷用印状态',
            dataIndex: 'isUseSeal',
            render: (val) => val  ? '已用印': '未用印'
        },
        {
            title: '操作',
            dataIndex: '',
            render: (record) => {
                return (
                    <Space>
                        <a onClick={() => this.getRiskDetail(record)}>{this.props.authEdit ? '编辑' : '查看'}</a>
                        {(this.props.authExport && record.attachment) && <a href={getUrl(record.attachment)} download={record.documentName} target="_blank">下载</a>}
                    </Space>
                );
            }
        }
    ];



    /**
     * @description 获取风险测评list数据
     */
    getRiskListData = () => {
        const { dispatch, params } = this.props;
        const { pageData } = this.state;
        dispatch({
            type: 'INVESTOR_DETAIL/getRiskListData',
            payload: { ...pageData, customerId: params.customerId * 1, sortType: 'desc' },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
                if (res.data && res.data) {
                    this.setState({
                        dataSource: res.data
                    });
                }
            }
        });
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
        // const {dispatch} = this.props;
        // dispatch({
        //     type: 'INVESTOR_DETAIL/batchDownload',
        //     payload: {riskRecordIds: selectedRowKeys}
        // });
        let ids = selectedRowKeys.join(',');
        window.location.href = `${BASE_PATH.adminUrl}${'/riskRecord/download'}?riskRecordIds=${ids}&customerId=${params.customerId}&tokenId=${getCookie('vipAdminToken')}`;
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




    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getRiskListData();
    }


    /**
     * @description 风险测评新建
     */
    createRiskRecord = (values) => {
        const { dispatch, params } = this.props;
        const { attachmentsId } = this.state;
        const fromData = this.formRef.current.getFieldsValue();
        dispatch({
            type: 'INVESTOR_DETAIL/riskRecordCreate',
            payload: {
                ...fromData,
                riskDate: fromData.riskDate && moment(fromData.riskDate).valueOf(),
                riskLimitDate: fromData.riskLimitDate && moment(fromData.riskLimitDate).valueOf(),
                customerId: params.customerId * 1,
                attachmentsId: attachmentsId
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '新建失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                } else {
                    openNotification('success', `提示（代码：${res.code}）`, '创建成功', 'topRight');
                    this.getRiskListData();
                    this.modalCancel(false);
                }

            }
        });
    }


    // 完成
    onFinish = () => {
        const { riskInfo } = this.state;
        if (riskInfo.riskRecordId) {
            this.riskRecordEdit();
        } else {
            this.createRiskRecord();
        }
    }

    /**
     * @description 获取问卷详情
     * @param {*} record
     */
    getRiskDetail = (record) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'INVESTOR_DETAIL/riskRecordDetail',
            payload: { riskRecordId: record.riskRecordId },
            callback: (res) => {
                if (res.code === 1008) {
                    let data = res.data || {};
                    this.modalCancel(true);
                    if (this.formRef) {
                        this.formRef.current.setFieldsValue({
                            ...data,
                            attachmentsId: [],
                            riskDate: data.riskDate && moment(data.riskDate),
                            riskLimitDate: data.riskLimitDate && moment(data.riskLimitDate)
                        });
                    }
                    this.setState({
                        fileList: [{
                            uid: data.attachmentsId,
                            name: '测评问卷',
                            url: data.baseUrl,
                            status: 'done'
                        }],
                        riskInfo: data,
                        attachmentsId: data.attachmentsId
                    });
                } else {
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message || '获取详情失败！'}`, 'topRight');
                }
            }
        });
    }


    /**
     * @description 风险测评编辑
     */
    riskRecordEdit = () => {
        const { dispatch } = this.props;
        const { riskInfo, attachmentsId} = this.state;
        const fromData = this.formRef.current.getFieldsValue();
        dispatch({
            type: 'INVESTOR_DETAIL/riskRecordEdit',
            payload: {
                ...riskInfo,
                ...fromData,
                attachmentsId,
                riskDate: fromData.riskDate && moment(fromData.riskDate).valueOf(),
                riskLimitDate: fromData.riskLimitDate && moment(fromData.riskLimitDate).valueOf()
            },
            callback: (res) => {
                if (res.code !== 1008) {
                    const warningText = res.message || res.data || '编辑失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                } else {
                    openNotification('success', `提示（代码：${res.code}）`, '编辑成功', 'topRight');
                    this.getRiskListData();
                    this.modalCancel(false);
                }

            }
        });
    }

    /**
     * @description 反面照
     * @param {} file
     */
      beforeUpload = async (file) =>{
          const formData = new window.FormData();
          formData.append('source', 4);
          formData.append('codeType', 107);
          formData.append('sourceId', '');
          formData.append('file', file);
          let res = await request.postMultipart('/customer/uploadIdentifyCard', formData);
          const {code, data} = res;
          if (code === 1008 && data) {
              this.setState({
                  attachmentsId: data.attachmentsId,
                  fileList: [{
                      uid: data.attachmentsId,
                      name: data.fileName,
                      url: data.baseUrl,
                      status: 'done'
                  }]
              });
              openNotification('success', '提醒', '上传成功');
          } else {
              openNotification(
                  'warning',
                  `提示（代码：${res.code}）`,
                  res.message || '上传失败！',
                  'topRight',
              );
          }
          // setLoading(false);
          return false;
      };


    /**
     * 监听上传成功或失败
     * @param {*} e
     */
    handleFileChange = (e) => {
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                const data = file.response.data || {};
                this.setState({
                    attachmentsId: data.attachmentsId,
                    fileList: [{
                        uid: data.attachmentsId,
                        name: data.fileName,
                        url: data.baseUrl,
                        status: 'done'
                    }]
                });
            } else {
                // this.setState({
                //   fileList: e.fileList.slice(0, 1)
                // })

                openNotification(
                    'warning',
                    `提示（代码：${file.response.code}）`,
                    file.response.message || '上传失败！',
                    'topRight',
                );
            }
        }
    };

    /**
     * @description 模态框操作
     * @param {*} flag true /false
     */
    modalCancel = (flag) => {
        this.setState({
            modalFlag: flag,
            fileList: []
        });
        if (!flag && this.formRef) {
            this.formRef.current.resetFields();
            this.setState({
                attachmentsId: undefined,
                riskInfo: {}
            });
        }
    }

    detailModalFlag = (falg) => {
        this.setState({ detailFlag: falg });
    }
    RefreshPage = ()=>{
        this.getRiskListData();
    }

    render() {
        const { selectedRowKeys, dataSource, pageData, modalFlag, detailFlag, fileList } = this.state;
        const { loading, updateing, createing } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        const normFile = (e) => {

            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        };


        return (
            <div >
                <div >
                    <Space>
                        {
                            this.props.authEdit && <Button type="primary" onClick={() => this.modalCancel(true)}>新建</Button>
                        }
                        {/* {
                            this.props.authExport && <Button type="primary" disabled={selectedRowKeys.length === 0} onClick={this._batchDownload}>批量下载</Button>
                        } */}
                        {this.props.authExport &&
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
                        }
                        <Button onClick={this.RefreshPage} type="primary">刷新页面</Button>
                    </Space>
                </div>
                <div >

                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={dataSource.list}
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        onChange={this._tableChange}
                        rowKey="riskRecordId"
                    />
                </div>

                <Modal
                    title="风险测评问卷信息"
                    visible={modalFlag}
                    width={1000}
                    onCancel={() => this.modalCancel(false)}
                    footer={null}
                    maskClosable={false}
                >
                    <Form
                        ref={this.formRef}
                        onFinish={this.onFinish}
                        initialValues={{
                            sourceType: 2
                        }}
                    >
                        <Row gutter={[20, 0]} >
                            <Col span={8}>
                                <Form.Item
                                    label="问卷来源"
                                    name="sourceType"
                                    rules={[{
                                        required: true,
                                        message: '请选择问卷来源'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <Select disabled>
                                        {
                                            ORGIN_FROM.map((item) => {
                                                return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="问卷状态"
                                    name="usableStatus"
                                    rules={[{
                                        required: true,
                                        message: '请选择问卷状态'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <Select  allowClear>
                                        {
                                            XWUseStatus.map((item) => {
                                                return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="完成时间"
                                    name="riskDate"
                                    {...formItemLayout}
                                >
                                    <DatePicker onChange={this.doneDateChange} />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="风险等级"
                                    name="riskType"
                                    rules={[{
                                        required: true,
                                        message: '请选择风险等级'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <Select  allowClear>
                                        {
                                            XWnumriskLevel.map((item) => {
                                                return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="问卷分数"
                                    name="score"
                                    rules={[{
                                        required: false,
                                        message: '请填写分数'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <InputNumber min={0} max={100} />
                                </Form.Item>
                            </Col>

                            <Col span={8}>
                                <Form.Item
                                    label="问卷到期时间"
                                    name="riskLimitDate"
                                    rules={[{
                                        required: false,
                                        message: '请选择问卷到期时间'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <DatePicker />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="问卷用印状态"
                                    name="isUseSeal"
                                    rules={[{
                                        required: true,
                                        message: '请选择'
                                    }]}
                                    {...formItemLayout}
                                >
                                    <Select  allowClear>
                                        {
                                            ISUSESEAl.map((item) => {
                                                return <Select.Option key={item.value} value={item.value}> {item.label}</Select.Option>;
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item
                                    label="测评问卷"
                                    // name="attachmentsId"
                                    // valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    {...formItemLayout}
                                >
                                    <Upload
                                        // listType="picture"
                                        // style={{ display: 'inline-block' }}
                                        name="file"
                                        fileList={fileList}
                                        showUploadList={{
                                            showRemoveIcon: false,
                                            showDownloadIcon: false,
                                            showPreviewIcon: false
                                        }}
                                        // disabled={isEdit}
                                        // onRemove={removeFile}
                                        beforeUpload={this.beforeUpload}
                                    >
                                        <Button icon={<UploadOutlined />} disabled={!this.props.authEdit}></Button>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row justify="center"> <Space><Button onClick={() => this.modalCancel(false)}> 取消</Button> {this.props.authEdit && <Button type="primary" htmlType="submit" loading={createing || updateing} >确定</Button>}</Space>  </Row>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default connect(({ INVESTOR_DETAIL, loading }) => ({
    INVESTOR_DETAIL,
    loading: loading.effects['INVESTOR_DETAIL/getRiskListData'],
    createing: loading.effects['INVESTOR_DETAIL/riskRecordCreate'],
    updateing: loading.effects['INVESTOR_DETAIL/riskRecordEdit']
}))(RiskAssessment);
