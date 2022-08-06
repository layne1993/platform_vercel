import { ConsoleSqlOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, Row, Col, Input, Select, notification, Upload, Modal } from 'antd';
import React, { Component } from 'react';
import { connect, Link, history } from 'umi';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getRandomKey, getCookie } from '@/utils/utils';
import { XWAccountType, AccountStatus, RoleType } from '@/utils/publicData';
import StandardTable from './components/StandardTable';

import {CustomPicker} from '@/pages/components/Customize';


import BatchUpload from '@/pages/components/batchUpload';
import styles from './style.less';

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

class AccountTableList extends Component {
    state = {
        dataList: {},
        powerInfo: {},
        showAlert: false,
        batchUploadModalFlag: false
    };

    searchFormRef = React.createRef();

    columns = [
        {
            title: '账号姓名',
            dataIndex: 'userName'
        },
        {
            title: '登录手机号',
            dataIndex: 'mobile',
            render: (val) => val || '--'
        },
        {
            title: '登录账号',
            dataIndex: 'email'
        },
        // {
        //   title: '账号类型',
        //   dataIndex: 'roleType',
        //   render: val => {
        //     const obj = RoleType.filter(item => item.value === Number(val));
        //     const text = obj.length > 0 ? obj[0].label : '--';
        //     return text;
        //   },
        // },
        {
            title: '岗位',
            dataIndex: 'positionStatus',
            render: (val) => {
                const arr = JSON.parse(val || '[]');
                // console.log(arr);
                let renderText = '';
                arr.forEach((item) => {
                    XWAccountType.forEach((item2) => {
                        // 别改成全等， 后端返回的是Number类型
                        if(item2.value == item) renderText+=(item2.label + ',');
                    });
                });
                return renderText.slice(0, -1) || '--';
                // const obj = XWAccountType.filter((item) => item.value === val);
                // const text = obj.length > 0 ? obj[0].label : '--';
                // return text;
            }
        },
        {
            title: '账号状态',
            dataIndex: 'isDelete',
            render: (val) => {
                const obj = AccountStatus.filter((item) => item.value === Number(val));
                return obj.length > 0 ? (
                    <span style={{ color: `${obj[0].value === 1 ? 'red' : ''}` }}>
                        {obj[0].label}
                    </span>
                ) : (
                    '--'
                );
            }
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            sorter: (a, b) => a.createTime - b.createTime,
            render: (time) => (time ? moment(time).format('YYYY/MM/DD HH:mm') : '--')
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            sorter: (a, b) => a.updateTime - b.updateTime,
            render: (time) => (time ? moment(time).format('YYYY/MM/DD HH:mm') : '--')
        },
        {
            title: '操作',
            render: (_, record) => (
                // console.log(JSON.parse(record.positionStatus).indexOf(0))
                <>
                    <Link
                        // disabled={!this.state.powerInfo.isEdit}
                        to={`/settings/account/edit/${record.managerUserId}`}
                    >
                        查看
                    </Link>
                    {
                        this.state.authEdit && record.positionStatus && JSON.parse(record.positionStatus).indexOf(0) ===-1 && <a
                            style={{ marginLeft: 8 }}
                            onClick={() =>
                                this.setState({ showAlert: true, accountId: record.managerUserId })
                            }
                        >
                        删除
                        </a> || null
                    }

                </>
            )
        }
    ];

    componentDidMount() {
        this.handelSearch();
        const { authEdit } =
        (sessionStorage.getItem('PERMISSION') &&
            JSON.parse(sessionStorage.getItem('PERMISSION'))['121000']) ||
        {};
        this.setState({
            authEdit
        });
        // this.getAuthority();
    }

    handelSearch = (values, pagination) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'accountList/queryList',
            payload: {
                ...values,
                ...pagination
            },
            callback: (res) => {
                if (res.code === 1008) {
                    const dataList = res.data || [];
                    this.setState({
                        dataList
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };
    handleTableChange = (pagination, filters, sorter, ...rest) => {
        const values = this.searchFormRef.current.getFieldsValue()
        // console.log(pagination, filters, sorter, ...rest);
        this.handelSearch(
            values,
            {
                pageNum: pagination.current,
                pageSize: pagination.pageSize,
                sortFiled: sorter && sorter.field,
                sortType:
                    (sorter && sorter.order === 'ascend' && 'asc') ||
                    (sorter && sorter.order === 'descend' && 'desc') ||
                    ''
            },
        );
    };


    //  查询
    onFinish = (values) => {
        this.handelSearch(values);
    };

    //  重置表单
    onReset = () => {
        this.searchFormRef.current.resetFields();
        this.handelSearch();
    };

    handleNew = () => {
        // window.location.href = `edit/${Math.floor(Math.random() * 1000)}`
        history.push('/settings/account/edit/0');
    };

    uploadFile = (e) => {
        const { file } = e;
        if (file.status === 'done') {
            if (file.response && file.response.code === 1008) {
                this.handelSearch();
                openNotification(
                    'success',
                    '上传成功',
                    file.response && file.response.message,
                    'topRight',
                );
            } else {
                openNotification(
                    'error',
                    '上传失败',
                    file.response && file.response.message,
                    'topRight',
                );
            }
        }
        // console.log(file);
    };

    renderForm() {
        const { powerInfo } = this.state;
        const props = {
            name: 'file',
            action: `${BASE_PATH.adminUrl}/manager/managerUser/import`,
            headers: {
                tokenId: getCookie('vipAdminToken')
            },
            accept: '.xlsx, .xls',
            showUploadList: false,
            onChange: this.uploadFile
            // beforeUpload:this.backBeforeUpload
        };

        const { authEdit } =
            (sessionStorage.getItem('PERMISSION') &&
                JSON.parse(sessionStorage.getItem('PERMISSION'))['121000']) ||
            {};
        return (
            <Form ref={this.searchFormRef} name="accountSearchForm" onFinish={this.onFinish}>
                <Row gutter={8}>
                    <Col span={6}>
                        <Form.Item name="userName" label="账号姓名">
                            {/* <CustomPicker/> */}
                            <Input placeholder="请输入账号姓名" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="email" label="登录邮箱">
                            <Input placeholder="请输入登录邮箱" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="isDelete" label="账号状态">
                            <Select placeholder="请选择" allowClear>
                                {AccountStatus.map((item) => (
                                    <Option value={item.value} key={getRandomKey(6)}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6} className={styles.formBtn}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                查询
                            </Button>
                            <Button htmlType="button" onClick={this.onReset}>
                                重置
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={16}>
                        {authEdit && (
                            <Button
                                // disabled={!powerInfo.isEdit}
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={this.handleNew}
                            >
                                新建
                            </Button>
                        )}
                        {authEdit && (
                            <Button
                                type="primary"
                                onClick={() =>
                                    this.setState({
                                        batchUploadModalFlag: true
                                    })
                                }
                                style={{ marginLeft: 12 }}
                            >
                                批量上传
                            </Button>
                        )}
                        {/* {authEdit && (
                            <Button
                                href={`${window.location.origin}${
                                    BASE_PATH.adminUrl
                                }/manager/managerUser/import/template?tokenId=${getCookie(
                                    'vipAdminToken',
                                )}`}
                                type="primary"
                                style={{ marginLeft: 12 }}
                            >
                                下载模板
                            </Button>
                        )} */}
                    </Col>
                </Row>
            </Form>
        );
    }

    handleOk = () => {
        const { dispatch } = this.props;
        const { accountId } = this.state;
        dispatch({
            type: 'accountList/DeleteAccount',
            payload: {
                managerUserId: accountId
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.handelSearch();
                    openNotification('success', '删除成功', res.message, 'topRight');
                } else {
                    openNotification('error', '删除失败', res.message, 'topRight');
                }
                this.setState({
                    showAlert: false,
                    accountId: null
                });
            }
        });
    };

    handleCancel = () => {
        this.setState({
            showAlert: false,
            accountId: null
        });
    };

    closeModal = () => {
        this.setState(
            {
                batchUploadModalFlag: false
            },
            () => {
                this.handelSearch();
                // this._search();
            },
        );
    };

    render() {
        const { dataList, showAlert, batchUploadModalFlag } = this.state;
        const { loading } = this.props;
        return (
            <PageHeaderWrapper title="账号列表">
                <Card bordered={false} className={styles.accountListForm}>
                    {batchUploadModalFlag && (
                        <BatchUpload
                            modalFlag={batchUploadModalFlag}
                            closeModal={this.closeModal}
                            templateMsg="账号批量上传模板下载"
                            templateUrl={`/manager/managerUser/import/template?tokenId=${getCookie(
                                'vipAdminToken',
                            )}`}
                            // params={{ productId: productId ? Number(productId) : undefined }}
                            onOk={this.closeModal}
                            url="/manager/managerUser/import"
                        />
                    )}
                    <Modal visible={showAlert} onOk={this.handleOk} onCancel={this.handleCancel}>
                        确定删除该账号？
                    </Modal>
                    <div className={styles.searchForm}>{this.renderForm()}</div>
                    <StandardTable
                        onChange={this.handleTableChange}
                        loading={loading}
                        data={dataList}
                        pagination={{
                            current: dataList.pageNum,
                            pageSize: dataList.pageSize,
                            total: dataList.total,
                            allPage: dataList.pages
                        }}
                        columns={this.columns}
                    />
                </Card>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ accountList, loading }) => ({
    accountList,
    loading: loading.effects['accountList/queryList']
}))(AccountTableList);
