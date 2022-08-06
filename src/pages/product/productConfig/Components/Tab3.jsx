/*
 * @description:银行卡变更材料维护
 * @Author: tangsc
 * @Date: 2020-12-23 16:47:09
 */
import React, { PureComponent } from 'react';
import styles from './styles/Tab3.less';
import { connect } from 'umi';
import { Button, Space, Modal, notification } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { isEmpty } from 'lodash';
import AddOrEditFileModal from './AddOrEditFileModal';
import { getCookie, downloadFile } from '@/utils/utils';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';
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
@connect(({ productConfig, loading }) => ({
    productConfig,
    loading: loading.effects['productConfig/query']
}))
class Tab3 extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        sortFiled: '',                 // 排序字段
        sortType: '',                  // 排序类型：asc-升序；desc-降序
        isModalVisible: false,         // 控制新增弹窗显示隐藏
        isAddOrEdit: 'add',            // 判断新增或者编辑
        bankCardList: [],              // 银行卡材料列表
        attachmentsId: 0               // 当前材料id
    };
    componentDidMount() {
        this._search();
    }

    // Table的列
    columns = [
        {
            title: '托管机构名称',
            dataIndex: 'trusteeshipName',
            fixed: 'left',
            width: 100,
            render: (val, record) => <span className="details" onClick={() => this._handleEdit(record)}>{val || '--'}</span>
        },
        {
            title: '对应产品',
            dataIndex: 'productNames',
            width: 80,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '银行卡变更材料',
            dataIndex: 'fileName',
            width: 120,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            width: 120,
            sorter: true,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 100,
            render: (text, record) => {
                return (
                    <div>
                        {
                            this.props.authEdit &&
                            <Space>
                                <span className="details" onClick={() => this._handleEdit(record)}>编辑 </span>
                                <span className="details" onClick={() => this._handleDelete(record)}>删除</span>
                            </Space >
                        }
                    </div >
                );
            }
        }

    ];


    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch } = this.props;

        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'productConfig/query',
            payload: {
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        bankCardList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        applyInfoList: []
                    });
                }
            }
        });
    }


    /**
     * @description: 变更材料编辑
     * @param {*}
     */
    _handleEdit = (record) => {
        this.setState({
            isAddOrEdit: 'edit',
            attachmentsId: record.attachmentsId,
            isModalVisible: true
        });
    }

    /**
     * @description: 删除产品
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'productConfig/deleteFile',
                    payload: {
                        attachmentsId: record.attachmentsId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            let selectArr = selectedRowKeys.filter((item) => {
                                return item !== record.attachmentsId;
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
     * @description: 清空已勾选
     */
    _cleanSelectedKeys = () => {
        this.setState({
            selectedRowKeys: []
        });
    };


    /**
     * @description: 新增变更材料
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
     * @description: 批量导出净值信息
     */
    _export = () => {
        const { selectedRowKeys } = this.state;
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/changeTheMaterial/download?attachmentsIds=${selectedRowKeys.toString()}&tokenId=${getCookie('vipAdminToken')}`;
    }

    render() {
        const { selectedRowKeys, isModalVisible, isAddOrEdit, bankCardList, pageData, attachmentsId } = this.state;
        const { loading } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };


        return (
            <div className={styles.container}>
                <Card>
                    <div className={styles.filter}>
                        <div className={styles.filterLeft}>
                            <Space>
                                {
                                    this.props.authEdit &&
                                    <Button type="primary" icon={<PlusOutlined />} onClick={this._onAdd}>
                                        新建
                                    </Button>
                                }
                                {
                                    this.props.authExport &&
                                    <Button onClick={this._export} disabled={isEmpty(selectedRowKeys)}>批量下载</Button>
                                }

                            </Space>
                        </div>
                    </div>
                    <div className={styles.dataTable}>
                        <MXTable
                            loading={loading}
                            columns={this.columns}
                            dataSource={bankCardList && bankCardList.list}
                            rowKey={(record) => record.attachmentsId}
                            rowSelection={rowSelection}
                            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                            total={bankCardList && bankCardList.total}
                            pageNum={pageData.current}
                            onChange={(p, e, s) => this._tableChange(p, e, s)}
                        />
                    </div>
                    {
                        isModalVisible &&
                        <AddOrEditFileModal
                            modalVisible={isModalVisible}
                            onCancel={this._handleClose}
                            attachmentsId={attachmentsId}
                            type={isAddOrEdit}
                            authEdit={this.props.authEdit}
                            authExport={this.props.authExport}
                        // productId={productId}
                        />
                    }
                </Card>
            </div>

        );
    }
}
export default Tab3;
