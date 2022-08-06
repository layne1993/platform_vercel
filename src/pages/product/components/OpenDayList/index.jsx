/*
 * @description: 开放日列表
 * @Author: tangsc
 * @Date: 2020-10-21 16:24:43
 */
import React, { PureComponent, Fragment } from 'react';
import { history, connect } from 'umi';
import { Button, Row, Col, Form, Select, Table, Alert, Modal, notification, Input, Switch, Tooltip } from 'antd';
import {
    XWcustomerCategoryOptions,
    paginationPropsback,
    XWOpenDayStatus,
    XWEnabledStatus,
    XWUseStatus,
    XWOpenDayObject,
    XWOpenDayStatus1
} from '@/utils/publicData';
import { DownOutlined, UpOutlined, PlusOutlined, InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getRandomKey, getCookie, isNumber } from '@/utils/utils';
import OpenDayDetails from '../../openDayDetails';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import { MultipleSelect } from '@/pages/components/Customize';
import { isEmpty } from 'lodash';
import axios from 'axios';

const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;


// 月频天数
const monthDay = [];
for (let i = 1; i <= 31; i++) {
    monthDay.push({
        label: `${i}号`,
        value: i
    });
}

const weekDay = ['--', '周一', '周二', '周三', '周四', '周五', '周六', '周日'];

// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ openDayList, loading }) => ({
    openDayList,
    loading: loading.effects['openDayList/getOpenDayList']
}))
class OpenDayList extends PureComponent {
    state = {
        isShow: false, // 控制显示隐藏
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
        isModalVisible: false,               // 控制新增净值弹窗显示隐藏
        isAddOrEdit: 'add',                  // 判断新增或者编辑
        productDayId: 0                      // 开放日id
    };

    componentDidMount() {
        const { productId } = this.props;
        this._setColums();
        if (productId !== '0') {
            this._search();
        }
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'openDayList/updateState',
            payload: {
                openInfoList: [],
                openList: []
            }
        });
    }

    // 刷新开放日

    updateOpenDay = ()=>{
        const {dispatch, productId} = this.props;
        dispatch({
            type:'netValue/refreshProductOpenDay',
            payload:{
                productId
            },
            callback:(res)=>{
                if (res.code === 1008) {
                    openNotification('success', '提示', '刷新成功', 'topRight');
                    this._search();
                    this.setState({
                        selectedRowKeys: []
                    });
                } else {
                    const warningText = res.message || res.data || '刷新失败！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
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
            title: '开放日类型',
            dataIndex: 'openType',
            width: 120,
            render: (val) => {
                let obj = XWOpenDayStatus.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        // {
        //     title: '启用状态',
        //     dataIndex: 'startStatus',
        //     width: 100,
        //     render: (val) => {
        //         let obj = XWEnabledStatus.find((item) => {
        //             return item.value === val;
        //         });
        //         return (obj && obj.label) || '--';
        //     }
        // },
        {
            title: '开放日状态',
            dataIndex: 'openDayStatus',
            width: 90,
            render: (val) => {
                let obj = XWOpenDayStatus1.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日对象',
            dataIndex: 'openScope',
            width: 90,
            render: (val) => {
                let obj = XWOpenDayObject.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '开放日时间',
            dataIndex: 'openDay',
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
                    return <span>{val === 1 ? '往后顺延' : val === 2 ? '往前顺延' : '不顺延'}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '支持交易类型',
            dataIndex: 'tradeTypes',
            width: 120,
            render: (val) => {
                let text = [];
                if (isEmpty(val)) {
                    return <span>--</span>;
                } else {
                    val.forEach((item) => {
                        if (item === 1) {
                            text.push('认申购');
                        } else if (item === 2) {
                            text.push('赎回');
                        }
                    });
                    return <span>{text.join('，')}</span>;
                }
            }
        },
        {
            title: <span><Tooltip placement="top" title={'面板菜单内，提醒日历会做相应提醒；同时短信提醒设置该开放日规则的管理员'}><InfoCircleOutlined /></Tooltip>&nbsp;通知规则</span>,
            dataIndex: 'noticeRule',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预约规则',
            dataIndex: 'bookingRuleDay',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '认申购签约规则',
            dataIndex: 'signingRules',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '赎回签约规则',
            dataIndex: 'redemptionRules',
            width: 150,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预设购买人数',
            dataIndex: 'peopleNumber',
            width: 130,
            sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预设购买金额',
            dataIndex: 'productScale',
            width: 130,
            sorter: true,
            render: (val) => <span>{val ? `${val}万` : '--'}</span>
        },
        {
            title: '启用状态',
            dataIndex: 'startStatus',
            width: 130,
            // sorter: true,
            render: (val) => <span>{val ? '已启用' : '未启用'}</span>
        },
        {
            title: '操作',
            dataIndex: 'age',
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
                                    style={{ color: record.startStatus === 0 ? '#3D7FFF' : '#999999', cursor:'pointer' }}
                                    onClick={record.startStatus === 0 ? () => this._handleDelete(record) : null}
                                >
                                    删除
                                </span>
                            </div>
                        }
                    </div>
                );
            }
        },
        {
            title: <span><Tooltip placement="top" title={'设置本条开放日规则是否启用'}><InfoCircleOutlined /></Tooltip>&nbsp;是否启用</span>,
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
     * @description: 开关控制签约有效性
     * @param {*} record
     */
    _onChange = (record) => {

        const { dispatch } = this.props;
        const { startStatus, bookingRule, noticeRule, ...params } = record;
        let _this = this;
        let tempObj = {};

        // if (frequencyStatus === 0) {
        //     // 按周
        //     tempObj.weekStart = weekDay.findIndex((value, index, arr) => value === (openingDayTime && openingDayTime.split(' ~ ')[0]));
        //     tempObj.weekEnd = weekDay.findIndex((value, index, arr) => value === (openingDayTime && openingDayTime.split(' ~ ')[1]));

        // } else {
        //     // 按月
        //     tempObj.openStartDate = (openingDayTime && new Date(`${openingDayTime.split(' ~ ')[0]}T00:00:00`,).getTime()) || undefined;
        //     tempObj.openEndDate = (openingDayTime && new Date(`${openingDayTime.split(' ~ ')[1]}T23:59:59`,).getTime()) || undefined;

        // }
        if (bookingRule === '当天') {
            tempObj.bookingRule = 0;
        } else {
            tempObj.bookingRule = (bookingRule && bookingRule.replace(/[^0-9]/ig, '')) || undefined;
        }

        if (noticeRule === '当天') {
            tempObj.noticeRule = 0;
        } else {
            tempObj.noticeRule = (noticeRule && noticeRule.replace(/[^0-9]/ig, '')) || undefined;
        }
        tempObj.startStatus = startStatus === 1 ? 0 : 1;

        confirm({
            title: '请您确认是否修改该条开放日状态?',
            icon: <ExclamationCircleOutlined />,
            content: '启用后该条开放日规则生效,禁用后该开放日规则失效',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'openDayDetails/setStatus',
                    payload: {
                        productDayId: record.productDayId,
                        startStatus: tempObj.startStatus
                        // ...tempObj,
                        // ...params
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '配置成功', 'topRight');
                            _this._search();
                        } else {
                            const warningText = res.message || res.data || '配置失败！';
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
            selectedRowKeys: [],
            pageData: {
                // 当前的分页数据
                ...this.state.pageData,
                current: 1
                // pageSize: 20
            }
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
            type: 'openDayList/getOpenDayList',
            payload: {
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            }
        });
    }

    /**
     * @description: 点击显示隐藏
     */
    _handleShowMore = () => {
        const { isShow } = this.state;
        this.setState({
            isShow: !isShow
        });
    };

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
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
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
     * @description: 新增开放日（路由跳转）
     */
    _onAdd = () => {
        const { productId } = this.props;
        if (!!productId) {
            history.push({
                pathname: `/product/openDay/openDayDetails/${0}?proId=${productId}`
            });
        } else {
            history.push({
                pathname: `/product/openDay/openDayDetails/${0}`
            });
        }
    };

    /**
     * @description: 编辑开放日信息
     * @param {Object}record
     */
    _handleEdit = (record) => {
        const { productId } = this.props;
        if (!!productId) {
            history.push({
                pathname: `/product/openDay/openDayDetails/${record.productDayId}?proId=${productId}`
            });
        } else {
            history.push({
                pathname: `/product/openDay/openDayDetails/${record.productDayId}`
            });
        }

    }


    /**
     * @description: 删除开放日信息
     * @param {*}
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除该条开放日记录?',
            icon: <ExclamationCircleOutlined />,
            // content: '删除后该净值信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'openDayList/deleteOpenDay',
                    payload: {
                        productDayId: record.productDayId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.productDayId;
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
     * @description: 批量导出开放日信息
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/net/export?productNetvalueIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
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
     * @description: 编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            productDayId: record.productDayId,
            isModalVisible: true
        });
    }


    /**
     * @description: 新增开放日
     */
    _onAdd = () => {
        this.setState({
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };
    6
    /**
     * @description: 关闭新增、编辑开放日弹窗
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
        this._postDownload('/productDay/export', selectedRowKeys);
    }


    // post 方式下载
    _postDownload = (url, data) => {
        axios({
            url: `${BASE_PATH.adminUrl}${url}`,
            data: {
                productDayIds: data
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
        const { isShow, pageData, selectedRowKeys, batchUploadModalFlag, isModalVisible, productDayId, isAddOrEdit } = this.state;
        const { openDayList: { openList = [], openInfoList = [] }, loading, productId } = this.props;
        console.log(694, openInfoList);
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <FormItem label="开放日类型" name="openType">
                                    <Select placeholder="请选择"  allowClear>
                                        {XWOpenDayStatus.map((item) => {
                                            return (
                                                <Option key={getRandomKey(5)} value={item.value}>
                                                    {item.label}
                                                </Option>
                                            );
                                        })}
                                    </Select>
                                </FormItem>
                            </Col>
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
                            {
                                !productId &&
                                <Col span={6}></Col>
                            }

                            {
                                productId &&
                                <Col span={6}>
                                    <FormItem label="开放日状态" name="openDayStatus">
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                XWOpenDayStatus1.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }
                            {
                                productId &&
                                <Col span={6}>
                                    <FormItem label="开放日对象" name="openScope">
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                XWOpenDayObject.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                            }

                            <Col span={6} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                                {
                                    !productId &&
                                    <span className={styles.showMore} onClick={this._handleShowMore}>
                                        {isShow ? '隐藏' : '展开'}
                                        {isShow ? <UpOutlined /> : <DownOutlined />}
                                    </span>
                                }

                            </Col>
                        </Row>
                        {
                            !productId &&
                            <Row gutter={[8, 0]} style={{ display: isShow ? '' : 'none' }}>
                                <Col span={6}>
                                    <FormItem label="开放日状态" name="openDayStatus">
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                XWOpenDayStatus1.map((item) => {
                                                    return (
                                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                    );
                                                })
                                            }
                                        </Select>
                                    </FormItem>
                                </Col>
                                <Col span={6}>
                                    <FormItem label="开放日对象" name="openScope">
                                        <Select placeholder="请选择"  allowClear>
                                            {
                                                XWOpenDayObject.map((item) => {
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
                        {
                            productId && <Button type="primary" onClick={this.updateOpenDay}>刷新本产品开放日起算日期</Button>
                        }
                    </div>
                    {/* {!isEmpty(selectedRowKeys) && (
                        <Alert
                            message={
                                <Fragment>
                                    已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                                    <a onClick={this._cleanSelectedKeys} style={{ marginLeft: 24 }}>
                                        清空
                                    </a>
                                </Fragment>
                            }
                            type="info"
                            showIcon
                        />
                    )} */}
                    {/* <Table
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={this.columns}
                        dataSource={openInfoList && openInfoList.list}
                        rowKey={(record) => record.productDayId}
                        scroll={{ x: '100%',y:500,scrollToFirstRowOnChange:true }}
                        // sticky
                        pagination={paginationPropsback(
                            openInfoList && openInfoList.total,
                            pageData.current
                        )}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                    /> */}
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={openInfoList && openInfoList.list}
                        total={openInfoList && openInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.productDayId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                    />
                </div>
                {
                    batchUploadModalFlag &&
                    <BatchUpload
                        modalFlag={batchUploadModalFlag}
                        closeModal={this.closeModal}
                        templateMsg="开放日模板下载"
                        onOk={this.closeModal}
                        templateUrl={`/productDay/import/template?tokenId=${getCookie('vipAdminToken')}`}
                        params={{ productId: productId ? Number(productId) : undefined }}
                        url="/productDay/import"
                    />
                }
                {
                    isModalVisible &&
                    <OpenDayDetails
                        modalVisible={isModalVisible}
                        onCancel={this._handleClose}
                        productDayId={productDayId}
                        operateType={isAddOrEdit}
                        proId={productId}
                        authEdit={this.props.authEdit}
                        authExport={this.props.authExport}
                    />
                }
            </div>
        );
    }
}
export default OpenDayList;
