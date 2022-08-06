/*
 * @description: 信披列表
 * @Author: tangsc
 * @Date: 2021-01-20 15:53:57
 */
import React, { PureComponent } from 'react';
import { PlusOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import { MultipleSelect } from '@/pages/components/Customize';
import DisclosureDetails from '../Details';
import { Button, Row, Col, Form, Select, Modal, notification, Input, Tooltip } from 'antd';
import {
    DisclosureTypeList,
    XWEnabledStatus,
    DisclosureDayStatusList
} from '@/utils/publicData';
import { connect } from 'umi';
import { getRandomKey, getCookie, isNumber } from '@/utils/utils';
import { isEmpty } from 'lodash';
import axios from 'axios';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

@connect(({ disclosureList, loading }) => ({
    disclosureList,
    loading: loading.effects['disclosureList/queryDisclosureDay']
}))
class DisclosureList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {},                    // 查询参数
        sortFiled: '',                       // 排序字段
        sortType: '',                        // 排序类型：asc-升序；desc-降序
        batchUploadModalFlag: false,         // 控制批量上传modal显示隐藏
        isModalVisible: false,               // 控制新增信披弹窗显示隐藏
        isAddOrEdit: 'add',                  // 判断新增或者编辑
        disclosureInfoList: [],              // 信披列表
        productDisclosureDayId: 0
    };

    componentDidMount() {
        const { productId } = this.props;
        this._setColums();
        if (productId !== '0') {
            this._search();
        }
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        // {
        //     title: '产品名称',
        //     dataIndex: 'productName',
        //     width: 120,
        //     fixed: 'left',
        //     render: (val, record) => <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
        // },
        {
            title: '信披文件类型',
            dataIndex: 'disclosureType',
            width: 120,
            render: (val) => {
                let obj = DisclosureTypeList.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '信披状态',
            dataIndex: 'disclosureDayStatus',
            width: 80,
            render: (val) => {
                let obj = DisclosureDayStatusList.find((item) => {
                    return item.value === val;
                });
                return <span style={val===2 && {color:'red'} || null}>{obj && obj.label}</span> || '--';
            }
        },
        {
            title: '信披时间',
            dataIndex: 'disclosureDay',
            width: 160,
            render: (val) => {
                if (!!val) {
                    return <span title={val}>{val.length > 11 ? val.slice(0, 12) + '...' : val}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '是否顺延',
            dataIndex: 'postpone',
            width: 80,
            render: (val) => {
                if (isNumber(val)) {
                    return <span>{val === 0 ? '不顺延' : '顺延'}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '通知规则',
            dataIndex: 'noticeRule',
            width: 100,
            render: (val) => {
                if (isNumber(val)) {
                    return <span>{val === 0 ? '当天' : `提前${val}天`}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '备注',
            dataIndex: 'remark',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: <span><Tooltip placement="top" title={'设置该披露规则是否启用'}><InfoCircleOutlined /></Tooltip>&nbsp;是否启用</span>,
            dataIndex: 'startStatus',
            width: 120,
            render: (val, record) => {
                return (
                    <div>
                        {
                            this.props.authEdit &&
                            <span
                                style={{ color: '#3D7FFF', cursor: 'pointer' }}
                                onClick={() => this._onChange(record)}
                            >
                                {val === 1 ? '不启用' : '启用'}
                            </span>
                        }
                    </div>

                );
            }
        },
        {
            title: '操作',
            // fixed: 'right',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {
                            this.props.authEdit &&
                            <div>
                                <span className="details" onClick={() => this._handleEdit(record)}>编辑 </span>
                                <span
                                    className={record.startStatus === 0 ? 'details' : ''}
                                    style={{ color: record.startStatus === 0 ? '#3D7FFF' : '#999999' }}
                                    onClick={record.startStatus === 0 ? () => this._handleDelete(record) : null}
                                >
                                    删除
                                </span>
                            </div>
                        }
                    </div>
                );
            }
        }
    ];


    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { productId } = this.props;
        if (!productId) {
            this.columns.unshift(
                {
                    title: '产品名称',
                    dataIndex: 'productName',
                    width: 120,
                    fixed: 'left',
                    render: (val, record) => <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
                });
        }
    }

    /**
     * @description: 开关披露规则有效性
     * @param {*} record
     */
    _onChange = (record) => {

        const { dispatch } = this.props;
        const { startStatus, ...params } = record;
        let _this = this;
        let tempObj = {};

        // tempObj.noticeRule = (noticeRule && noticeRule.replace(/[^0-9]/ig, '')) || undefined;
        tempObj.startStatus = startStatus === 1 ? 0 : 1;

        confirm({
            title: '请您确认是否修改该条披露规则的状态?',
            icon: <ExclamationCircleOutlined />,
            content: '启用后该条披露规则生效,禁用后该披露规则失效',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'disclosureDetails/editDisclosureDay',
                    payload: {
                        ...tempObj,
                        ...params
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '设置成功', 'topRight');
                            _this._search();
                        } else {
                            const warningText = res.message || res.data || '设置失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                            _this._search();
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
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        this.setState({
            searchParams: {
                ...values
            },
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                current: 1,
                // pageSize: 20
            },
            selectedRowKeys:[],
        }, () => {
            this._search();
        });
    };


    /**
     * @description: 列表查询
     * @param {Object} items 查询参数
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch, productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'disclosureList/queryDisclosureDay',
            payload: {
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        disclosureInfoList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
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
            selectedRowKeys:[],
        }, () => {
            this._search();
        });
    };

    /**
     * @description: 删除信披日信息
     * @param {*}
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除该条披露规则?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'disclosureList/deleteDisclosureDay',
                    payload: {
                        productDisclosureDayId: record.productDisclosureDayId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.productDisclosureDayId;
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
     * @description: 批量上传 打开模态框
     */
    _batchUpload = () => {
        this.setState({ batchUploadModalFlag: true });
    }


    /**
     * @description: 关闭上传模态框
     */
    closeModal = () => {
        this.setState({
            batchUploadModalFlag: false
        }, () => {
            this._search();
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
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState({
            sortFiled: s.field,
            sortType: !!s.order ? s.order === 'ascend' ? 'asc' : 'desc' : undefined,
            pageData: {
                current: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }


    /**
     * @description: 披露规则编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            productDisclosureDayId: record.productDisclosureDayId,
            isModalVisible: true
        });
    }


    /**
     * @description: 新增披露规则
     */
    _onAdd = () => {
        this.setState({
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };


    /**
     * @description: 关闭新增、编辑弹窗
     * @param {*}
     */
    _handleClose = () => {
        this.setState({
            isModalVisible: false
        }, () => {
            this._search();
        });
    }


    /**
     * @description: 批量导出开放日信息
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        this._postDownload('/disclosureDay/export', selectedRowKeys);
    }


    // post 方式下载
    _postDownload = (url, data) => {
        axios({
            url: `${BASE_PATH.adminUrl}${url}`,
            data: {
                productDisclosureDayIds: data
            },
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
            // eslint-disable-next-line no-undef
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

    render() {

        const { pageData, selectedRowKeys, batchUploadModalFlag, isModalVisible, disclosureInfoList, isAddOrEdit, productDisclosureDayId } = this.state;
        const { loading, productId } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };
        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef} labelCol={{ span: 8 }}>
                        <Row gutter={[8, 0]}>
                            {
                                !productId &&
                                    <Col span={6}>
                                        <MultipleSelect
                                            params="productIds"
                                            value="productId"
                                            label="productName"
                                            mode="multiple"
                                            formLabel="产品名称"
                                        />
                                    </Col>
                            }

                            <Col span={8}>
                                <FormItem label="信披文件类型" name="disclosureType">
                                    <Select placeholder="请选择" allowClear>
                                        {
                                            DisclosureTypeList.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="信披状态" name="disclosureDayStatus">
                                    <Select placeholder="请选择" allowClear>
                                        {
                                            DisclosureDayStatusList.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>
                            {
                                productId &&
                                <Col span={6}>
                                    <FormItem label="启用状态" name="startStatus">
                                        <Select placeholder="请选择" allowClear>
                                            {
                                                XWEnabledStatus.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            <Col span={4} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                            </Col>
                        </Row>
                        {
                            !productId &&
                            <Row gutter={[8, 0]}>
                                <Col span={6}>
                                    <FormItem label="启用状态" name="startStatus">
                                        <Select placeholder="请选择" allowClear>
                                            {
                                                XWEnabledStatus.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            </Row>
                        }

                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <div className={styles.operationBtn}>
                        {
                            this.props.authEdit &&
                            <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                新建
                            </Button>
                        }
                        {
                            this.props.authExport &&
                            <Button type="primary" disabled={isEmpty(selectedRowKeys)} onClick={this._export}>批量导出</Button>
                        }
                        {
                            this.props.authEdit &&
                            <Button type="primary" onClick={this._batchUpload}>批量上传</Button>
                        }
                    </div>
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={disclosureInfoList && disclosureInfoList.list}
                        total={disclosureInfoList && disclosureInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.productDisclosureDayId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    />
                </div>
                {
                    batchUploadModalFlag &&
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        closeModal={this.closeModal}
                        templateMsg="披露规则模板下载"
                        onOk={this.closeModal}
                        templateUrl={`/disclosureDay/import/template?tokenId=${getCookie('vipAdminToken')}`}
                        // params={}
                        url="/disclosureDay/import"
                    />
                }
                {
                    isModalVisible &&
                    <DisclosureDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        productDisclosureDayId={productDisclosureDayId}
                        operateType={isAddOrEdit}
                        proId={productId}
                    />
                }
            </div>
        );
    }
}
export default DisclosureList;
