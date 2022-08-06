const statusMap = ['processing', 'success', 'error'];
const status = ['未发送', '已完成', '异常'];
const weekChinese = {
    1: '每周一',
    2: '每周二',
    3: '每周三',
    4: '每周四',
    5: '每周五',
    6: '每周六',
    7: '每周日'
};
import React, { Component, Fragment } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { connect, Link, history } from 'umi';
import moment from 'moment';
import {getPermission} from '@/utils/utils';
import { Card, Button, Popconfirm, notification, Tabs, Badge, Tooltip, Space } from 'antd';
import StandardTable from './components/StandardTable';
import SendDetail from './components/sendDetail';
import Mailbox from '../components/Mailbox';
import styles from './style.less';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { QuestionCircleOutlined } from '@ant-design/icons';
const { TabPane } = Tabs;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const { authEdit, authExport } = getPermission(75000);
@connect(({ tempList, loading }) => ({
    tempList,
    loading: loading.effects['tempList/getWechatList'],
    loading1: loading.effects['tempList/getMessageList'],
    loading2: loading.effects['tempList/getEMailList'],
    loading3: loading.effects['tempList/deletList'],
    loading4: loading.effects['tempList/getTemplateList'],
    emailLoading: loading.effects['tempList/getEmailForm'],
    submitting: loading.effects['tempList/submitEmailForm']
}))
class TableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false, //邮箱编辑弹框的visible值
            selectedRows: [], //微信选中列表
            selectedRows1: [], //短信选中的列表
            selectedRows2: [], //邮件选中列表
            selectedRows3: [], //模板选中列表
            emailType: 1,
            emailSetting: {
                emailSettingStatus: 1, //  0:未设置过, 1:使用自定义邮箱, 2:使用易私募邮箱
                userName: '', //  邮箱登录账号
                password: '', //  邮箱登录密码
                host: '', //  邮箱服务器
                type: '' //  邮箱类型
            },
            permissions: [], //用户操作权限
            tabKey: 1,
            rowInfo: {},
            sendDetailFlag: false //发送明细模态框
        };
    }

    componentDidMount() {
        this.RefreshPage()

    }

    RefreshPage = ()=>{
        const { dispatch } = this.props;
        Promise.all([
            //获取短信列表
            dispatch({
                type: 'tempList/getMessageList',
                payload: {}
            }),
            //获取邮箱列表
            dispatch({
                type: 'tempList/getEMailList',
                payload: {}
            }),
            //获取模板列表
            dispatch({
                type: 'tempList/getTemplateList',
                payload: {}
            })
        ])
            .then((res) => {})
            .catch((err) => {
                // console.log('err', err);
            });
    }

    columns = [
        {
            title: '通知模板名称',
            width: 200,
            dataIndex: 'marketingServiceName',
            ellipsis: true,
            render: (text, record) => (
                <a
                    onClick={() =>
                        this.previewTemplate(record.marketingServiceCode, this.state.tabKey)
                    }
                >
                    {text}
                </a>
            )
        },
        {
            title: '主题',
            width: 140,
            dataIndex: 'subject',
            ellipsis: true,
            render: (text) => text
        },
        {
            title: '发送客户数',
            dataIndex: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (val) => (val === 0 ? '--' : `${val}个`),
            width: 140
            // needTotal: true,
        },
        {
            title: '发送时间/频率',
            dataIndex: 'noticeTime',
            sorter: (a, b) => a.noticeTime - b.noticeTime,
            render: (val) => <span>{moment(val).format('YYYY/MM/DD HH:mm:ss')}</span>,
            width: 140
        },
        {
            title: '发送状态',
            width: 120,
            dataIndex: 'noticeStatus',
            sorter: (a, b) => a.noticeStatus - b.noticeStatus,
            render(val, record) {
                const i = Number(val);
                const nowTime = new Date().getTime();
                let text = status[i];
                if (i === 0) {
                    // 发送存在延迟，noticeStatus为0，根据发送时间判断发送状态
                    text = nowTime >= record.noticeTime ? '发送中' : text;
                }
                return <Badge status={statusMap[i]} text={text} />;
            }
        },
        // {
        //   title: '打开人数',
        //   dataIndex: 'openAmount',
        //   sorter: (a, b) => a.openAmount - b.openAmount,
        //   render: val => val ? `${val}个` : '--',
        // },
        {
            title: '成功发送条数',
            width: 130,
            dataIndex: 'successAmount',
            sorter: (a, b) => a.successAmount - b.successAmount,
            render: (val) => (val ? `${val}个` : '--')
        },
        {
            title: '失败发送条数',
            dataIndex: 'failAmount',
            sorter: (a, b) => a.failAmount - b.failAmount,
            render: (val) => (val ? `${val}个` : '--'),
            width:130
        },
        // {
        //   title: '操作',
        //   width: 60,
        //   render: (text, record) => (
        //     <Fragment>
        //       <a onClick={() => this.previewTemplate(record.marketingServiceCode, 1)}>
        //         {record.noticeStatus === 0 ? '编辑' : '详情'}
        //       </a>
        //     </Fragment>
        //   ),
        // },
        {
            title: '操作',
            width: 120,
            render: (text, record) => (
                <Space>
                    <a
                        onClick={() =>
                            this.previewTemplate(record.marketingServiceCode, this.state.tabKey)
                        }
                    >
                        {record.noticeStatus === 0 ? '编辑' : '详情'}
                    </a>
                    <a onClick={()=> {this.setState({sendDetailFlag: true, rowInfo: record});}}>发送详情</a>
                </Space>
            )
        }
    ];

    columns0 = this.columns.filter((item) => item.dataIndex !== 'openAmount');

    columns1 = this.columns.filter(
        (item) => ['subject', 'openAmount', 'successAmount'].indexOf(item.dataIndex) === -1,
    );

    columns2 = this.columns.filter((item) => item.dataIndex !== 'openAmount');

    columns3 = [
        {
            title: '通知模板名称',
            width: 200,
            dataIndex: 'marketingServiceName',
            ellipsis: true,
            render: (text, record) => (
                <a onClick={() => this.previewTemplate(record.marketingServiceCode, 3)}>{text}</a>
            )
        },
        {
            title: '营销服务对象分类',
            width: 200,
            dataIndex: 'marketingServiceObject',
            render: (value) => (value === 1 ? '客户' : '管理人')
        },
        {
            title: '通知工具',
            width: 80,
            dataIndex: '',
            render: (data) => this.getFrequencyStr(data)
        },
        // {
        //   title: '发送频率',
        //   width: 140,
        //   dataIndex: 'noticeTimeSetting',
        //   render: (item) => {
        //     const record = JSON.parse(item);
        //     let val = '';
        //     if (record.frequence === 0 || record.frequence === '0') val = '每天';
        //     if (record.frequence === 1 || record.frequence === '1') val = weekChinese[record.day];
        //     if (record.frequence === 2 || record.frequence === '2') val = `每月${record.day}号`;
        //     return val;
        //   },
        //   // needTotal: true,
        // },
        // {
        //   title: '发送日期',
        //   width: 140,
        //   dataIndex: 'sendDate',
        //   render: (val) => moment(val).format('YYYY/MM/DD:HH:mm:ss'),
        // },
        {
            title: '发送日期',
            dataIndex: 'advanceDay',
            width: 100,
            render: (val, record) => {
                const frequenceData = record.noticeTimeSetting
                    ? JSON.parse(record.noticeTimeSetting)
                    : {};
                let text = '';
                if (String(frequenceData.frequence) === '0') text = '每天';
                if (String(frequenceData.frequence) === '1') text = weekChinese[frequenceData.day];
                if (String(frequenceData.frequence) === '2') text = `每月${frequenceData.day}号`;
                if (val === 0) {
                    return '当日';
                } else if (!val) {
                    return text;
                } else {
                    return `提前${val}日`;
                }
            }
        },
        {
            title: '发送时间',
            dataIndex: 'sendTime',
            width: 100,
            render: (val, record) => {
                if (record.noticeTimeSetting) {
                    return JSON.parse(record.noticeTimeSetting).time;
                }
            }
        },

        {
            title: '创建人',
            dataIndex: 'userName',
            width: 80,
            render: (val) => val
        },
        {
            title: '模板更新时间',
            width: 200,
            dataIndex: 'updateTime',
            render: (val) => moment(val).format('YYYY/MM/DD:HH:mm:ss')
        },
        {
            title: '模板状态',
            width: 80,
            dataIndex: 'status',
            render: (val) => (val === 0 ? '禁用' : '启用')
        },
        {
            title: '操作',
            width: 60,
            render: (text, record) => {
                return (
                    <Fragment>
                        {
                            authEdit ? (<a onClick={() => this.previewTemplate(record.marketingServiceCode, 3)}>编辑</a>) : '--'
                        }
                    </Fragment>
                );
            }
        }
    ];

    /**
     * @description 将通知工具拼接城字符串
     * @param obj {obj} 包含各种通知工具的对象
     * @return str {string} 以','拼接后的字符串
     */
    getFrequencyStr = (obj = {}) => {
        let tempArr = [];
        if (obj.isUseWechat === 1) {
            tempArr.push('微信');
        }
        if (obj.isUseMessage === 1) {
            tempArr.push('短信');
        }
        if (obj.isUseEmail === 1) {
            tempArr.push('邮箱');
        }
        let str = tempArr.join(',');
        return str;
    };

    getList = (types, payload) => {
        const { dispatch } = this.props;
        let arr = types;
        if (!types) {
            arr = [0, 1, 2];
        }

        //  获取微信卡片模板列表
        if (arr.indexOf(0) > -1) {
            dispatch({
                type: 'tempList/getWechatList',
                payload
            });
        }
        //  获取短信模板列表
        if (arr.indexOf(1) > -1) {
            dispatch({
                type: 'tempList/getMessageList',
                payload
            });
        }
        //  获取邮件模板列表
        if (arr.indexOf(2) > -1) {
            dispatch({
                type: 'tempList/getEMailList',
                payload
            });
        }
        //  获取模板列表
        if (arr.indexOf(3) > -1) {
            dispatch({
                type: 'tempList/getTemplateList',
                payload
            });
        }
    };

    handleStandardTableChange = (type, pagination) => {
        const params = {
            current: pagination.current,
            pageSize: pagination.pageSize
        };
        this.getList([type], params);
    };

    //  跳转创建或详情页
    previewTemplate = (code, type) => {
        const { hostname } = window.location;
        history.push(`saleService/template/${code}/${type}`);
        // if (hostname === 'localhost') {
        //   // 本地环境
        //   history.push(`saleService/template/${code}/${type}`);
        // } else {
        //   window.parent.location.hash = `saleService/template/${code}/${type}`;
        // }
    };

    //  批量删除列表
    handleRemoveClick = (type, rows) => {
        const { dispatch } = this.props;

        if (rows.length === 0) return;
        const marketingServiceCodeList = rows.map((row) => row.marketingServiceCode).toString();
        dispatch({
            type: 'tempList/deletList',
            payload: {
                marketingServiceCodeList
            },
            callback: (res) => {
                if (res.code === 1008) {
                    const selectedRowsKey = `selectedRows${type || ''}`;
                    this.setState({
                        [selectedRowsKey]: []
                    });
                    const params = {
                        current: 1,
                        pageSize: 10
                    };
                    this.getList([type || 0], params);
                } else {
                    const warningText = res.message || res.data || '操作失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（错误代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    // 列表选中项
    handleSelectRows = (type, rows) => {
        //   console.log(type, rows);
        const selectedRowsKey = `selectedRows${type}`;
        this.setState({
            [selectedRowsKey]: rows
        });
    };

    //  确认批量删除
    deleteConfirm = (type) => {
        const { selectedRows, selectedRows1, selectedRows2, selectedRows3 } = this.state;
        let deleteRows = [...selectedRows];
        if (type === 1) {
            deleteRows = selectedRows1;
        }
        if (type === 2) {
            deleteRows = selectedRows2;
        }
        if (type === 3) {
            deleteRows = selectedRows3;
        }
        this.handleRemoveClick(type, deleteRows);
    };

    //  获取邮箱配置信息
    getEmailAction = () => {
        const { dispatch } = this.props;
        const { emailSetting } = this.state;
        this.handleModalVisible(true);
        dispatch({
            type: 'tempList/getEmailForm',
            payload: {},
            callback: (res) => {
                if (res.code === 1008) {
                    const { data = {} } = res;
                    this.setState({
                        emailType: data ? data.emailSettingStatus : 1,
                        emailSetting: { ...emailSetting, ...data }
                    });
                } else {
                    const warningText =
                        res.message || res.data || '获取邮箱配置信息失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（错误代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
                this.handleModalVisible(true);
            }
        });
    };

    //  邮箱编辑弹窗开关
    handleModalVisible = (flag) => {
        this.setState({
            modalVisible: !!flag
        });
    };

    onEmailChange = (e) => {
        this.setState({
            emailType: e.target.value
        });
    };

    //  保存邮箱配置
    handleEmailSubmit = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'tempList/submitEmailForm',
            payload,
            callback: (res) => {
                if (res.code === 1008) {
                    this.handleModalVisible(false);
                } else {
                    const warningText = res.message || res.data || '保存邮箱信息失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（错误代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };
    handleTabChange = (value) => {
        this.setState({
            tabKey: value === 'message' ? 1 : value === 'email' ? 2 : 3
        });
    };
    render() {
        const {
            submitting,
            emailLoading,
            tempList: { weChatList, messageList = [], emailList, tempList },
            loading,
            loading1,
            loading2,
            loading3,
            loading4
        } = this.props;
        const {
            selectedRows,
            selectedRows1,
            selectedRows2,
            selectedRows3,
            modalVisible,
            emailSetting,
            emailType,
            mailboxTop,
            permissions,
            sendDetailFlag,
            rowInfo,
            tabKey
        } = this.state;
        const methods = {
            handleModalVisible: this.handleModalVisible,
            onEmailChange: this.onEmailChange,
            //编辑邮箱弹框点击确认
            handleEmailSubmit: this.handleEmailSubmit
        };
        return (
            <PageHeaderWrapper  extra={<Button type="primary" onClick={this.RefreshPage}>刷新页面</Button>}>
                <div>
                    <Card bordered={false} className={styles.tabCard}>
                        <div className={styles.tableList}>
                            <Tabs
                                // tabBarExtraContent={}
                                size="large"
                                tabBarStyle={{ marginBottom: 24 }}
                                onChange={this.handleTabChange}
                            >
                                {/* <TabPane
                tab={`微信卡片(${weChatList.list.length}个)`}
                key="weChat"
              >
                <div className={styles.tableListOperator}>
                  <Button icon="plus" type="primary" onClick={() => this.previewTemplate(0, 1)}>
                    新建
                  </Button>
                  <span>
                    <Popconfirm
                      placement="bottom"
                      disabled={selectedRows.length === 0}
                      title={`您确定要删除选中的${selectedRows.length}个模板吗？`}
                      onConfirm={() => this.deleteConfirm()}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="primary" loading={loading3} disabled={selectedRows.length === 0}>批量删除</Button>
                    </Popconfirm>
                  </span>
                </div>
                <StandardTable
                  rowKey='marketingServiceCode'
                  selectedRows={selectedRows}
                  loading={loading}
                  data={weChatList}
                  columns={this.columns0}
                  onSelectRow={rows => this.handleSelectRows('', rows)}
                // onChange={ pagination => this.handleStandardTableChange(0, pagination)}
                />
              </TabPane> */}
                                <TabPane tab={`短信(${messageList.list.length}个)`} key="message">
                                    <div className={styles.tableListOperator} style={{
                                        display: authEdit? '' : 'none'
                                    }}
                                    >
                                        <Button
                                            icon={<PlusOutlined />}
                                            type="primary"
                                            onClick={() => this.previewTemplate(0, 2)}
                                        >
                                            新建
                                        </Button>
                                        <span>
                                            <Popconfirm
                                                placement="bottom"
                                                disabled={selectedRows1.length === 0}
                                                title={`您确定要删除选中的${selectedRows1.length}个模板吗？`}
                                                onConfirm={() => this.deleteConfirm(1)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button
                                                    type="primary"
                                                    loading={loading3}
                                                    disabled={selectedRows1.length === 0}
                                                >
                                                    批量删除
                                                </Button>
                                            </Popconfirm>
                                        </span>
                                    </div>
                                    <StandardTable
                                        rowKey="marketingServiceCode"
                                        selectedRows={selectedRows1}
                                        loading={loading1}
                                        data={messageList}
                                        columns={this.columns1}
                                        onSelectRow={(rows) => this.handleSelectRows(1, rows)}
                                        onChange={(pagination) =>
                                            this.handleStandardTableChange(1, pagination)
                                        }
                                    />
                                </TabPane>
                                <TabPane tab={`邮箱(${emailList.list.length}个)`} key="email">
                                    <div className={styles.tableListOperator} style={{
                                        display: authEdit? '' : 'none'
                                    }}
                                    >
                                        <Button
                                            icon={<PlusOutlined />}
                                            type="primary"
                                            onClick={() => this.previewTemplate(0, 3)}
                                        >
                                            新建
                                        </Button>
                                        <span>
                                            <Popconfirm
                                                placement="bottom"
                                                disabled={selectedRows2.length === 0}
                                                title={`您确定要删除选中的${selectedRows2.length}个模板吗？`}
                                                onConfirm={() => this.deleteConfirm(2)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button
                                                    type="primary"
                                                    // loading={loading3}
                                                    disabled={selectedRows2.length === 0}
                                                >
                                                    批量删除
                                                </Button>
                                            </Popconfirm>
                                        </span>
                                        <Tooltip
                                            title="配置用于给投资者发送邮件的邮箱，可修改"
                                            placement="topLeft"
                                        >
                                            <Button
                                                type="primary"
                                                loading={emailLoading}
                                                onClick={this.getEmailAction}
                                            >
                                                邮箱编辑
                                                <QuestionCircleOutlined />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <StandardTable
                                        rowKey="marketingServiceCode"
                                        selectedRows={selectedRows2}
                                        loading={loading2}
                                        data={emailList}
                                        columns={this.columns2}
                                        onSelectRow={(rows) => this.handleSelectRows(2, rows)}
                                        onChange={(pagination) =>
                                            this.handleStandardTableChange(2, pagination)
                                        }
                                    />
                                </TabPane>
                                <TabPane
                                    tab={`通知模版(${tempList.list.length}个)`}
                                    key="template "
                                >
                                    <div className={styles.tableListOperator} style={{
                                        display: authEdit? '' : 'none'
                                    }}
                                    >
                                        {/* <Button
                                          icon={<PlusOutlined />}
                                          type="primary"
                                          onClick={() => this.previewTemplate(0, 4)}
                                      >
                      新建
                                      </Button> */}
                                        <span>
                                            <Popconfirm
                                                placement="bottom"
                                                disabled={selectedRows3.length === 0}
                                                title={`您确定要删除选中的${selectedRows3.length}个模板吗？`}
                                                onConfirm={() => this.deleteConfirm(3)}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button
                                                    type="primary"
                                                    loading={loading3}
                                                    disabled={selectedRows3.length === 0}
                                                >
                                                    批量删除
                                                </Button>
                                            </Popconfirm>
                                        </span>
                                    </div>
                                    <StandardTable
                                        rowKey="marketingServiceCode"
                                        selectedRows={selectedRows3}
                                        loading={loading4}
                                        data={tempList}
                                        columns={this.columns3}
                                        onSelectRow={(rows) => this.handleSelectRows(3, rows)}
                                        onChange={(pagination) =>
                                            this.handleStandardTableChange(2, pagination)
                                        }
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    </Card>
                    {modalVisible && (
                        <Mailbox
                            {...methods}
                            modalVisible={modalVisible}
                            top={50}
                            submitting={submitting || false}
                            radioType={emailType}
                            settings={emailSetting}
                            loading={emailLoading}
                        />
                    )}
                </div>
                {
                    sendDetailFlag &&
                    <SendDetail flag={sendDetailFlag} params={{...rowInfo, authEdit, serviceType: tabKey}} onCancel={()=> this.setState({sendDetailFlag: false, rowInfo: {}})}/>
                }
            </PageHeaderWrapper>
        );
    }
}
export default TableList;
