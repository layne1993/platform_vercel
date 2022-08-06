import { Avatar, Button, Card, Col, List, Skeleton, Row, Statistic, Typography, Spin, Anchor  } from 'antd';
import React, { Component, Suspense } from 'react';
import { Link, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { getCookie, formatSeconds } from '@/utils/utils';
import styles from './style.less';
import ReminderCalendar from './components/ReminderCalendar';
import DataStatistics from './components/DataStatistics';
import panelImg from '@/assets/panelImg.png';
import newIcon from '@/assets/newIcon.svg';


const SalesCard = React.lazy(() => import('./components/SalesCard'));
// const tabsHeader = [{ key:'0', tab:'全部' }, { key:'1', tab:'待处理流程' }, { key:'2', tab:'通知提醒' }];
const { Text, Paragraph } = Typography;
// console.log(Typography,Text)
const PageHeaderContent = ({ data }) => {
    // console.log(data)
    let toPage = '';
    let flowName = '';
    if (data) {
        switch (data.processType) {
            case 1:
                flowName = '认购签约流程';
                toPage = `/raisingInfo/processManagement/productProcessList/productProcessDetails/${data.processId}`;
                break;
            case 2:
                flowName = '申购签约流程';
                toPage = `/raisingInfo/processManagement/productProcessList/ApplyPurchase/${data.processId}`;
                break;
            case 3:
                flowName = '赎回签约流程';
                toPage = `/raisingInfo/processManagement/productProcessList/productProcessDetails/${data.processId}`;
                break;
            case 4:
                flowName = '资产证明流程';
                toPage = `/raisingInfo/processManagement/productProcessList/productProcessDetails/${data.processId}`;
                break;
            case 5:
                flowName = '合格投资者线上认定流程';
                toPage = `/operation/processManagement/investorsProcessList/online/${data.processId}`;
                break;
            case 6:
                flowName = '合格投资者线下认定流程';
                toPage = `/operation/processManagement/investorsProcessList/offline/${data.processId}`;
                break;
            default:
                break;
        }
    }

    const getDateNode = () => {
        var dateHours = new Date().getHours();
        var dateNode = '';
        if (dateHours >= 0 && dateHours < 6) {
            dateNode = '工作狂人';
        } else if (dateHours >= 6 && dateHours < 12) {
            dateNode = '上午好';
        } else if (dateHours >= 12 && dateHours < 18) {
            dateNode = '下午好';
        } else if (dateHours >= 18 && dateHours < 20) {
            dateNode = '晚上好';
        } else {
            dateNode = '夜深了';
        }
        return dateNode;
    };

    return (
        <div className={styles.pageHeaderContent}>
            <div className={styles.avatar}>
                <Avatar size="large" src={panelImg}>
                    {getCookie('userName') || 'U'}
                </Avatar>
            </div>
            <div className={styles.content}>
                <div className={styles.contentTitle}>
                    {getDateNode()}，{getCookie('userName') || '尊敬的用户'}
                    ，祝你开心工作每一天
                </div>
                {data ? (
                    <div>
                        <span className={styles.contentNote}>
                            NOTE: 投资者{data.customerName}的[{flowName}]待审核，
                        </span>
                        <Link to={toPage}>点击前往处理</Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

class Workplace extends Component {

    constructor(props) {
        super(props);
        // this.reminderCalendarRef = React.createRef();
    }
    state = {
        // firstLoading: true,
        isMore: true,
        nextPage: 1,
        activities: [],
        currentVersion: null,
        processesNum: 0,
        tradeTimes: [], // 产品签约次数
        activeTabKey: '0',
        noticeList: [], // 通知提醒数据
        update:0
    };


    componentDidMount() {
        const { dispatch } = this.props;
        // dispatch({
        //     type: 'panel/init'
        // });
        // dispatch({
        //     type: 'panel/queryServer'
        // });
        this.getSysSetting();
        this.getResourcePath();
        // 查询产品签约次数
        this.queryTradeTimes();
        this.pendingProcessesAndNotification(0);
    }


    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'panel/clear'
        });
    }



    // 刷新页面

    RefreshPage = ()=>{

        const {update} = this.state;
        this.getSysSetting();
        this.getResourcePath();
        // 查询产品签约次数
        this.queryTradeTimes();
        this.pendingProcessesAndNotification(0);
        this.setState({
            update:update+1
        });
    }

    /**
     * 获取系统配置
     */
    getSysSetting = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getSysSetting'
        });
    };

    /**
     * 获取资源路径
     */
    getResourcePath = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'global/getResourcePath'
        });
    };

    // 查询产品签约次数
    queryTradeTimes = (period) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'panel/queryTradeTimes',
            payload: {
                period: period || 3
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        tradeTimes: res.data.tradeTimes
                    });
                }
            }
        });
    };

    // 标记为已读
    readed = (values = {}) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'panel/isReadTrue',
            payload: {
                ...values
            },
            callback: ({ code }) => {
                if (code === 1008) {
                    let { noticeList } = this.state;
                    let newNoticeList = [...noticeList];
                    newNoticeList.map((item) => {
                        if (item.processId === values.processId) {
                            item.isRead = 1;
                        }
                    });
                    this.setState({
                        noticeList: newNoticeList
                    });
                }
            }
        });
    };

    // 查询流程
    pendingProcessesAndNotification = (type) => {
        const { dispatch } = this.props;
        let { isMore, nextPage, noticeList } = this.state;
        dispatch({
            type: 'panel/pendingProcessesAndNotification',
            payload: {
                type: type
            },
            callback: ({ code, data = {} }) => {
                if (code === 1008) {
                    const pendingProcessList = data.pendingProcessList || [];
                    if (Array.isArray(pendingProcessList) && pendingProcessList.length > 0) {
                        noticeList = [...pendingProcessList];
                    } else {
                        isMore = false;
                    }
                    this.setState({
                        noticeInfo: data,
                        isMore,
                        nextPage,
                        noticeList,
                        processesNum: data.pendingNum || 0
                    });
                }
            }
        });
    };

    handleLoadMore = () => {
        const { nextPage } = this.state;
        this.getList(nextPage, 5);
    };

    renderActivities = (item) => {
        const pageTo =
            (item.processType === 1 &&
                `/raisingInfo/processManagement/productProcessList/productProcessDetails/${item.processId}`) ||
            (item.processType === 2 &&
                `/raisingInfo/processManagement/productProcessList/ApplyPurchase/${item.processId}`) ||
            (item.processType === 3 &&
                `/raisingInfo/processManagement/productProcessList/Redeming/${item.processId}`) ||
            (item.processType === 4 && '/investor/assetsProve') ||
            (item.processType === 5 &&
                `/operation/processManagement/investorsProcessList/online/${item.processId}`) ||
            (item.processType === 6 &&
                `/operation/processManagement/investorsProcessList/offline/${item.processId}`) ||
            (item.processType === 7 &&
                `/productLifeCycleInfo/list/processDetails/${item.processId}`) ||
            (item.processType === 8 && '/raisingInfo/reservation') ||
            '/panel';

        return (
            <List.Item style={{position: 'relative'}} key={item.processId} onClick={() => this.readed(item)}>
                {item.isRead === 0 && <img style={{position: 'absolute', top: '10px', right:'10px', width:'40px'}} src={newIcon} />}
                {item.types === 1 &&
                    <Link to={pageTo} style={{ width: '100%' }}>
                        <Text style={{ display: 'flex', width: '100%' }}>
                            <span style={{ color: '#3D7FFF' }}>{item.processName}</span>&nbsp;
                            <span style={{ marginLeft: 15 }}>{item.productName}</span>
                        </Text>
                        <Paragraph className={styles.paragraph}>
                            {(item.processType === 7 && (
                                <>
                                    <span>
                                        {item.processTitle}到{item.nodeName}步骤，到期时间是
                                        {moment(item.processStartDate).format('YYYY/MM/DD')}
                                    </span>
                                    <p style={{ marginBottom: 0 }}>请尽快处理</p>
                                </>
                            )) ||
                                (item.processType === 4 && (
                                    <>
                                        <p style={{ marginBottom: 0 }}>
                                            {moment(item.processStartDate).format('YYYY/MM/DD')}
                                            {item.customerName}提交了资产证明,请尽快处理
                                        </p>
                                    </>
                                ))}
                            {(item.processType === 5 || item.processType === 6) && (
                                <>
                                    <span>
                                        {item.customerName}于
                                        {moment(item.processStartDate).format('YYYY/MM/DD')}{' '}
                                        发起合格投资者{item.processType === 5 ? '线上' : '线下'}
                                        认定流程
                                    </span>
                                    &nbsp;
                                </>
                            )}

                            {item.processType === 8 && (
                                <>
                                    <span>
                                        {' '}
                                        <span>产品预约</span>{' '}
                                        <span style={{ color: 'grey' }}>{item.customerName},</span>{' '}
                                        <span>产品名称：{item.productName}</span>
                                    </span>
                                    &nbsp;
                                </>
                            )}

                            {item.processName === '产品签约'
                                ? `${item.customerName}于${moment(item.processStartDate).format(
                                    'YYYY/MM/DD',
                                )}发起${
                                    (item.processType === 1 && '认购') ||
                                      (item.processType === 2 && '申购') ||
                                      (item.processType === 3 && '赎回')
                                } 产品名称：${item.productName}`
                                : ' '}
                        </Paragraph>
                    </Link>
                }

                {item.types === 2 && (
                    <a style={{ width: '100%' }}>
                        <Text
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%'
                            }}
                        >
                            <span style={{ color: '#3D7FFF' }}>{item.noteName}</span>&nbsp;
                            {/* <span style={{ color: '#aaaaaa' }}>{item.customerName}</span> */}
                        </Text>
                        <Paragraph className={styles.paragraph}>
                            <span>{item.content}</span>
                        </Paragraph>
                    </a>
                )}
            </List.Item>
        );
    };

    changeNoticeTab = (key) => {
        this.setState({ activeTabKey: key });
        this.pendingProcessesAndNotification(key);
    };

    renderActiveTabContent = () => {
        const { activitiesLoading } = this.props;
        const { noticeList } = this.state;
        return (
            <List
                loading={activitiesLoading}
                renderItem={(item) => this.renderActivities(item)}
                dataSource={noticeList}
                className={styles.activitiesList}
                size="large"
            />
        );
    };

    refreshVersion = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'panel/refresh',
            payload: {},
            callback: (response) => {
                if (response.code === 1008) {
                    this.setState({
                        currentVersion: response.data
                    });
                }
            }
        });
    };

    ExtraContent = (data) => {
        return (
            <div className={styles.extraContent}>
                <Anchor affix={false}>
                    <Anchor.Link  href="#components-ReminderCalendar" title={
                        <div className={styles.statItem}>
                            <Statistic
                                title="待处理项"
                                value={data || 0}
                                valueStyle={{ color: '#FB560A' }}
                                suffix="条"
                            />

                        </div>
                    }
                    />
                </Anchor>
                <Button style={{marginLeft:20}} type="primary"  onClick={this.RefreshPage}>刷新页面</Button>

            </div>
        );
    };

    render() {
        const {
            signData,
            loading,
            loadingNotice
        } = this.props;
        const {
            activities,
            currentVersion,
            processesNum,
            tradeTimes,
            noticeInfo = {},
            update
        } = this.state;
        const activeFirst = activities.length > 0 ? activities[0] : null;
        const tabsHeader = [
            {
                key: '0',
                tab: (
                    <span style={{ position: 'relative' }}>
                        全部
                        {(noticeInfo.pendingFlowNew > 0 || noticeInfo.notificationNew > 0) && (
                            <img
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-45px',
                                    width: '40px',
                                    zIndex: 1
                                }}
                                src={newIcon}
                            />
                        )}
                    </span>
                )
            },
            {
                key: '1',
                tab: (
                    <span style={{ position: 'relative' }}>
                        待处理流程
                        {noticeInfo.pendingFlowNew > 0 && (
                            <img
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-45px',
                                    width: '40px',
                                    zIndex: 1
                                }}
                                src={newIcon}
                            />
                        )}
                    </span>
                )
            },
            {
                key: '2',
                tab: (
                    <span style={{ position: 'relative' }}>
                        通知提醒
                        {noticeInfo.notificationNew > 0 && (
                            <img
                                style={{
                                    position: 'absolute',
                                    top: '-20px',
                                    right: '-45px',
                                    width: '40px',
                                    zIndex: 1
                                }}
                                src={newIcon}
                            />
                        )}
                    </span>
                )
            }
        ];
        return (
            <PageHeaderWrapper
                title={false}
                // breadcrumb={{
                //     routes: [
                //         {
                //             path: '/',
                //             breadcrumbName: '首页'
                //         }
                //     ],
                //     itemRender: (route) => <span>{route.breadcrumbName}</span>
                // }}
                content={<PageHeaderContent data={activeFirst} />}
                extraContent={this.ExtraContent(processesNum, currentVersion)}
                className={styles.pageWrapper}
                // extraContent={<ExtraContent data={headInfo} version={currentVersion} />}
            >
                {/* <div className={styles.colorBar}></div> */}
                <Row gutter={24}>
                    <Col xl={24} lg={24} md={24} sm={24} xs={24} style={{ marginBottom: 24 }}>
                        <DataStatistics
                            title={<span className={styles.cardTitle}>数据统计</span>}
                            update={update}
                        />
                    </Col>
                </Row>

                <Row gutter={24}>
                    <ReminderCalendar update={update}/>
                </Row>


                <Row gutter={24} style={{marginTop: '20px'}}>
                    <Col span={16}>
                        <Suspense fallback={<Skeleton paragraph={{ rows: 4 }} active />}>
                            <SalesCard
                                title={<span className={styles.cardTitle}>产品交易次数</span>}
                                salesData={signData}
                                loading={loading}
                                tradeTimes={tradeTimes}
                                queryTradeTimes={this.queryTradeTimes}
                            />
                        </Suspense>
                    </Col>
                    <Col xl={8} lg={24} md={24} sm={24} xs={24}>

                        <Card
                            bodyStyle={{
                                padding: 0
                            }}
                            bordered={false}
                            className={styles.activeCard}
                            // title={<span className={styles.cardTitle}>待处理流程</span>}
                            tabList={tabsHeader}
                            onTabChange={this.changeNoticeTab}
                        >
                            <Spin spinning={loadingNotice}> <div id="components-ReminderCalendar">{this.renderActiveTabContent()}</div></Spin>
                        </Card>

                    </Col>
                </Row>
            </PageHeaderWrapper>
        );
    }
}

export default connect(({ panel: { headInfo, signData, identifyData }, loading }) => ({
    headInfo,
    signData,
    identifyData,
    loading: loading.effects['panel/queryTradeTimes'],
    loading1: loading.effects['panel/fetchIdentifyData'],
    activitiesLoading: loading.effects['panel/fetchFlowList'],
    loadingNotice: loading.effects['panel/pendingProcessesAndNotification']
}))(Workplace);
