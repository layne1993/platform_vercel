/*
 * @description: 回访单设置列表
 * @Author: tangsc
 * @Date: 2021-02-01 16:03:02
 */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Button, Row, Col, Form, Select, Input, Tooltip, DatePicker, Card, Space, Modal, notification } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import BatchUpload from '@/pages/components/batchUpload';
import styles from './index.less';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { getCookie, getRandomKey } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import {CustomSelect} from '@/pages/components/Customize';
import { XWnumriskLevel, XWFundRiskLevel } from '@/utils/publicData';
import AddModal from './components/AddModal';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

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

@connect(({ netValue, loading }) => ({
    netValue,
    loading: loading.effects['returnVisitList/getNetValueDetails']
}))
class ReturnVisitList extends PureComponent {
    state = {
        batchUploadModalFlag: false,
        isModalVisible: false,
        visitList: {}, // 回访单里列表
        selectedRowKeys: [],                // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        }
    }

    componentDidMount() {
        this._search();
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '回访单类型',
            dataIndex: 'returnType',
            width: 100,
            fixed: 'left',
            render(data) {
                if(data === 0) return '募集回访';
                if(data === 1) return '适当性回访';
            }
        },
        {
            title: '回访单版本',
            dataIndex: 'versionNumber',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '客户风险等级',
            dataIndex: 'riskType',
            width: 120,
            render: (val) => (val && 'C' + val) || '--'
        },
        {
            title: '产品产品',
            dataIndex: 'productName',
            width: 200,
            render: (val) => val || '--'
        },
        {
            title: '产品风险等级',
            dataIndex: 'productriskType',
            width: 100,
            render: (val) => (val && 'R' + val) || '--'
        },
        {
            title: '是否匹配',
            dataIndex: 'matching',
            width: 80,
            render: (val) => {
                if(val === 0) return '匹配';
                if(val === 1) return '不匹配';
            }
        },
        {
            title: '冷静期开始时间',
            dataIndex: 'coolingPeriodTime',
            width: 120,
            sorter: (a, b) => a.coolingPeriodTime - b.coolingPeriodTime,
            render: (val) => (val && moment(val).format(dateFormat)) || '--'
        },
        {
            title: '操作人员',
            dataIndex: 'managerUserName',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '发起时间',
            dataIndex: 'initiateTime',
            width: 120,
            sorter: (a, b) => a.initiateTime - b.initiateTime,
            render: (val) => (val && moment(val).format(dateFormat)) || '--'
        },
        {
            title: '完成时间',
            dataIndex: 'completeTime',
            width: 120,
            sorter: (a, b) => a.completeTime - b.completeTime,
            render: (val) => (val && moment(val).format(dateFormat)) || '--'
        },
        {
            title: '来源',
            dataIndex: 'source',
            width: 100,
            render: (val) => {
                if(val === 0) return '电子合同签约';
                if(val === 1) return '非电子合同签约';
                if(val === 2) return '后台创建';
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            width: 100,
            render: (text, record) => {
                // eslint-disable-next-line no-undef
                const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['20200'] || {};
                return (
                    <div>
                        {
                            authEdit &&
                            <Space>
                                <span className="details">下载 </span>
                                <span className="details" onClick={() => this._handleDelete(record)}>删除</span>
                            </Space >
                        }
                    </div >
                );
            }
        }
    ];


    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { netDate, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.netDate = (netDate && new Date(`${moment(netDate).format().split('T')[0]}T00:00:00`,).getTime()) || undefined;
        this.setState({
            searchParams: {
                ...params,
                ...tempObj
            }
        }, () => {
            this._search();
        });

    };

    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;
        const { dispatch, productId } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'returnVisitList/getNetValueDetails',
            payload: {
                productId: productId ? Number(productId) : undefined,
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                enableStatistic,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                this.setState({
                    visitList: res
                });
            }
        });
    }

    /**
     * @description: 删除回访
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该回访信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'returnVisitList/deleteNetValue',
                    payload: {
                        productNetvalueIds: record.productNetvalueId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.productNetvalueId;
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
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {}
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
     * @description: 新增回访
     */
    _onAdd = () => {
        this.setState({
            isModalVisible: true,
            isAddOrEdit: 'add'
        });
    };

    /**
     * @description: 关闭新增弹窗
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
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        const {pageData: {current, pageSize}} = this.state;
        this.setState({
            pageData: {
                current: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            if(current !== this.state.pageData.current || pageSize !== this.state.pageData.pageSize) {
                this._search();
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
     * @description: 批量导出回访信息
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/net/export?productNetvalueIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
    }

    /**
      * @description: 批量删除
      * @param {*}
      */
    _batchDelete = () => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            content: '删除后选中的净值信息会全部删除',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'netValue/deleteNetValue',
                    payload: {
                        productNetvalueIds: selectedRowKeys.toString()
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            _this.setState({
                                selectedRowKeys: []
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
    render() {
        const {
            pageData,
            selectedRowKeys,
            batchUploadModalFlag,
            isModalVisible,
            isAddOrEdit,
            productNetvalueId,
            visitList
        } = this.state;
        const { loading, productId } = this.props;

        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        // eslint-disable-next-line no-undef
        const { authEdit, authExport } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['20200'] || {};

        return (
            <PageHeaderWrapper title="回访单列表">
                <Card>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                                <Row gutter={[8, 0]}>
                                    <Col span={6}>
                                        <FormItem label="客户名称" name="customerName">
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="产品名称" name="productName">
                                            <CustomSelect submitValue="productName" displayName="productName"/>
                                            {/* <Input placeholder="请输入" autoComplete="off" /> */}
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="客户风险等级" name="netDate">
                                            <Select  allowClear placeholder="请选择">
                                                {
                                                    XWnumriskLevel.map((item) => {
                                                        return (
                                                            <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6} className={styles.queryBtn}>
                                        <Space>
                                            <Button type="primary" htmlType="submit">
                                                查询
                                            </Button>
                                            <Button onClick={this._reset}>重置</Button>
                                        </Space>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={6}>
                                        <FormItem label="回访单类型" name="netDate1">
                                            <Select  allowClear placeholder="请选择">
                                                {
                                                    XWnumriskLevel.map((item) => {
                                                        return (
                                                            <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="产品风险等级" name="riskType">
                                            <Select  allowClear placeholder="请选择">
                                                {
                                                    XWFundRiskLevel.map((item) => {
                                                        return (
                                                            <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                        );
                                                    })
                                                }
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="是否匹配" name="riskType2">
                                            <Select  allowClear placeholder="请选择">
                                                <Option value={1}>是</Option>
                                                <Option value={2}>否</Option>
                                            </Select>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row gutter={[8, 0]}>
                                    <Col span={6}>
                                        <FormItem label="操作人员" name="netDate12">
                                            <Input placeholder="请输入" autoComplete="off" />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="发起日期" name="date1">
                                            <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>
                                        <FormItem label="完成日期" name="date12">
                                            <DatePicker style={{ width: '100%' }} format={dateFormat} />
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                        <div className={styles.filter}>
                            <div className={styles.btnGroup}>
                                <div>
                                    {
                                        authEdit &&
                                        <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                            新建
                                        </Button>
                                    }
                                    {
                                        authEdit &&
                                        <Button type="primary" onClick={this._batchUpload}>批量上传</Button>
                                    }
                                    {
                                        authExport &&
                                        <Button onClick={this._export} type="primary" disabled={isEmpty(selectedRowKeys)}>批量下载</Button>
                                    }
                                    {
                                        authExport &&
                                        <Button onClick={() => this._batchDelete()} type="primary" disabled={isEmpty(selectedRowKeys)}>批量删除</Button>
                                    }
                                </div>
                            </div>

                        </div>
                        <div className={styles.dataTable}>

                            <MXTable
                                loading={Boolean(loading)}
                                columns={this.columns}
                                dataSource={visitList && visitList.data}
                                total={visitList && visitList.total}
                                pageNum={pageData.current}
                                rowKey="returnSingleId"
                                onChange={(p, e, s) => this._tableChange(p, e, s)}
                                rowSelection={rowSelection}
                                scroll={{ x: '100%', scrollToFirstRowOnChange:true }}
                            />
                        </div>
                        {
                            batchUploadModalFlag &&
                            <BatchUpload
                                tipMsg={'点击将表格拖拽到这里上传'}
                                modalFlag={batchUploadModalFlag}
                                closeModal={this.closeModal}
                                templateMsg="回访模板下载"
                                templateUrl="/returnSingle/import/template"
                                params={{ productId: productId ? Number(productId) : undefined }}
                                onOk={this.closeModal}
                                url="/returnSingle/import"
                            />
                        }
                        {
                            isModalVisible &&
                            <AddModal
                                modalVisible={isModalVisible}
                                onCancel={this._handleClose}
                                productNetvalueId={productNetvalueId}
                                type={isAddOrEdit}
                                productId={productId}
                            />
                        }
                    </div >
                </Card>
            </PageHeaderWrapper>

        );
    }
}
export default ReturnVisitList;
