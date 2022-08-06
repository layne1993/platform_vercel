import React, { PureComponent } from 'react';
import { Card, Col, Row, Calendar, Spin, Radio, Empty, Badge, Checkbox, notification } from 'antd';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';
import styles from './index.less';
import { getRandomKey } from '@/utils/utils';
import { connect } from 'umi';
import Day from './day';
import Week from './week';
import Month from './month';
import { borderColorEnum, bgColorEnum } from './data';

const radioOptions = [
    {
        label: '当日',
        value: 1
    },
    {
        label: '当周',
        value: 2
    },
    {
        label: '当月',
        value: 3
    }
];

const checkBoxList = [
    {
        code: '1011,1012',
        codeName: '投资者证件提醒',
        borderColor: '#F6F30A',
        bgColor: '#FAFAD4'
    },
    {
        code: '1021,1022',
        codeName: '投资者风险提醒',
        borderColor: '#70B606',
        bgColor: '#E9F7D3'
    },
    {
        code: '1081',
        codeName: '产品预警提醒',
        borderColor: '#D91F1C',
        bgColor: '#FBDCDB'
    },
    {
        code: '1031,1032',
        codeName: '投资者合格投资者认定提醒',
        borderColor: '#F59924',
        bgColor: '#FFEBD2'
    },
    {
        code: '1041,1042',
        codeName: '投资者生日提醒',
        borderColor: '#807FFF',
        bgColor: '#E0DFFF'
    },
    {
        code: '1051,1052',
        codeName: '产品固定开放期提醒',
        borderColor: '#0AEEF0',
        bgColor: '#D8FFFF'
    },
    {
        code: '1061,1062',
        codeName: '产品临时开放期提醒',
        borderColor: '#B8751C',
        bgColor: '#FFEFDA'
    },
    {
        code: '1071',
        codeName: '产品信披提前通知提醒',
        borderColor: '#ED808D',
        bgColor: '#FFE5E8'
    },
    {
        code: '1091',
        codeName: '自定义提醒',
        borderColor: '#028080',
        bgColor: '#D2E8E8'
    }
];


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


@connect(({ panel, loading }) => ({
    panel,
    loading: loading.effects['panel/queryReminders']
}))
class ReminderCalendar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            // 提醒日历数组
            markDateList: [],
            selectedValue: '',
            index: 0,
            // 当前时间
            currentDate: moment().valueOf(),
            radioValue: 1,
            dateType: 1,             // 查询日期类型 1:当日,2:当周, 3:当月
            reminderList: [],        // 提醒列表
            badgeList: [],           // 当月所有提醒列表
            update: 0,
            // 提醒事件类型
            remindType: this.getItemStroage('panel_remindType') || ['1011,1012', '1021,1022', '1081', '1031,1032', '1041,1042', '1051,1052', '1061,1062', '1071', '1091']
        };
    }

    // static getDerivedStateFromProps(nextProps, prevState){
    //     console.log(nextProps, prevState);
    //     //该方法内禁止访问this
    //     if(nextProps.update !== prevState.update){
    //         alert(1)
    //     //通过对比nextProps和prevState，返回一个用于更新状态的对象
    //         this._search();
    //         this._queryIsNeedAudit();
    //     }
    //     //不需要更新状态，返回null
    //     return null;
    // }

    componentDidMount() {
        this.getRemindersList();
        this._queryIsNeedAudit();
    }
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.update !== this.state.update) {
            this.setState({
                update: nextProps.update
            });
            this.getRemindersList();
            this._queryIsNeedAudit();
        }
    }

    // 获取缓存信息
    getItemStroage = (key) => {
        let itemStrData = localStorage.getItem(key);
        let itemData = null;
        try {
            itemData = JSON.parse(itemStrData);
        } catch (error) {
            console.log('解析错误');
            itemData = null;
        }

        console.log('kkk');
        return itemData;
    }


    // componentDidUpdate(prevProps){
    //     console.log(prevProps.update)
    //     if(prevProps.update!==this.state.update){
    //         this.setState({
    //             update:prevProps.update
    //         });
    //         this._search();
    //         this._queryIsNeedAudit();
    //     }
    // }




    /**
     * @description: 提醒日历数据查询
     * @param {*}
     */
    getRemindersList = () => {
        const { currentDate, dateType, remindType } = this.state;
        const { dispatch } = this.props;

        // 转换成时间戳
        dispatch({
            type: 'panel/queryReminders',
            payload: {
                pageNum: 1,
                pageSize: 99999,
                dateType,
                currentDate: currentDate,
                remindType: remindType.join(',')
            },
            callback: ({ code, data, message }) => {
                if (code === 1008) {
                    this.setState({
                        reminderList: data || []
                    });
                } else {
                    const txt = message || data || '查询失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });

        dispatch({
            type: 'panel/queryReminders',
            payload: {
                dateType: 3,             // 获取当月所有的提醒，渲染日历上的badge
                currentDate,
                pageNum: 1,
                pageSize: 99999,
                remindType: ['1011,1012', '1021,1022', '1081', '1031,1032', '1041,1042', '1051,1052', '1061,1062', '1071', '1091'].join(',')
            },
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        badgeList: res.data || []
                    });
                }
            }
        });
    }

    /**
     * @description: tab切换
     * @param {Object} e
     */
    _changeTabs = (e) => {
        this.setState({
            radioValue: e.target.value,
            dateType: e.target.value
        }, () => {
            this.getRemindersList();
        });
    }


    /**
     * @description: 点击选择日期回调
     * @param {*} 时间值
     */
    onSelect = (value) => {
        const { dateType } = this.state;
        this.setState({
            currentDate: moment(value).valueOf()
        }, () => {
            // if (dateType === 1) {
            this.getRemindersList();
            // }
        });
    };

    /**
     * @description: 日期面板变化回调 月份
     * @param {*} 时间值
     */
    onPanelChange = (value) => {
        this.setState({
            currentDate: moment(value).valueOf(),
            dateType: 3
        }, () => {
            this.getRemindersList();
        });
    }
    /**
     * @description: 自定义渲染日期单元格
     * @param {*}
     */
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className={styles.eventMessage}>
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} />
                    </li>
                ))}
            </ul>
        );
    };

    // 日历日期下面添加消息提醒
    getListData = (value) => {
        const {
            badgeList
        } = this.state;
        const remindList = [];
        !isEmpty(badgeList) &&
            badgeList.forEach((item) => {
                if (item.date && value.format('YYYY-MM-DD') === moment(item.date).format('YYYY-MM-DD')) {
                    remindList.push({ type: 'warning', content: 3 });
                }
            });

        return remindList;
    };

    /**
     * @description: 查询是否需要审核
     * @param {*}
     */
    _queryIsNeedAudit = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'panel/queryIsNeedAudit',
            payload: {

            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    sessionStorage.setItem('needAudit', res.data.isApplyNeedCheck);
                    sessionStorage.setItem('isNeedCheck', res.data.isAssetNeedCheck);
                }
            }
        });
    }

    checkboxChange = (val) => {
        console.log(val, 'checkboxChange');
        localStorage.setItem('panel_remindType', JSON.stringify(val));
        this.setState({
            remindType: val
        }, () => {
            this.getRemindersList();
        });
    }


    render() {
        const { radioValue, reminderList, currentDate, remindType } = this.state;
        const { loading } = this.props;

        return (
            <Card
                title={
                    <span className={styles.cardTitle}>提醒日历</span>
                }
                // loading={loading}
                bordered={false}
                bodyStyle={{
                    padding: 0
                }}
                className={styles.cardBox}
            >
                <div className={styles.calendarWrapper}>
                    <Row>
                        <Col span={6}>
                            <div className={styles.calendar}>
                                <Calendar
                                    value={moment(currentDate)}
                                    fullscreen={false}
                                    dateCellRender={this.dateCellRender}
                                    onPanelChange={this.onPanelChange}
                                    onSelect={this.onSelect}
                                />
                                <Checkbox.Group value={remindType} className={styles.checkbox} onChange={this.checkboxChange}>
                                    <div>
                                        <Checkbox className={styles.checkbox1} value="1011,1012">
                                            <p className={styles.checkLabel}>投资者证件提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox2} value="1021,1022">
                                            <p className={styles.checkLabel}>投资者风测提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox3} value="1081">
                                            <p className={styles.checkLabel}>产品预警提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox4} value="1031,1032">
                                            <p className={styles.checkLabel}>合格投资者认定提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox5} value="1041,1042">
                                            <p className={styles.checkLabel}>投资者生日提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox6} value="1051,1052">
                                            <p className={styles.checkLabel}>产品固定开放期提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox7} value="1061,1062">
                                            <p className={styles.checkLabel}>产品临时开放期提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox8} value="1071">
                                            <p className={styles.checkLabel}>产品信披提前通知提醒</p>
                                        </Checkbox>
                                    </div>
                                    <div>
                                        <Checkbox className={styles.checkbox9} value="1091">
                                            <p className={styles.checkLabel}>自定义提醒</p>
                                        </Checkbox>
                                    </div>
                                </Checkbox.Group>
                            </div>
                        </Col>
                        <Col span={18}>
                            <div className={styles.rightTabs}>
                                <Radio.Group
                                    style={{ width: '100%' }}
                                    options={radioOptions}
                                    onChange={this._changeTabs}
                                    value={radioValue}
                                    optionType="button"
                                    buttonStyle="solid"
                                />

                                <div className={styles.contentWrapper}>

                                    <Spin spinning={loading}>
                                        {
                                            isEmpty(reminderList) ?
                                                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                                                :
                                                <>
                                                    {radioValue === 1 &&
                                                        <Day
                                                            date={currentDate}
                                                            data={reminderList}
                                                            borderColorEnum={borderColorEnum}
                                                            bgColorEnum={bgColorEnum}
                                                            onSuccess={this.getRemindersList}
                                                            addSuccess={this.getRemindersList}
                                                        />}
                                                    {radioValue === 2 &&
                                                        <Week
                                                            date={currentDate}
                                                            data={reminderList}
                                                            borderColorEnum={borderColorEnum}
                                                            bgColorEnum={bgColorEnum}
                                                            onSuccess={this.getRemindersList}
                                                            addSuccess={this.getRemindersList}
                                                        />}
                                                    {radioValue === 3 &&
                                                        <Month
                                                            date={currentDate}
                                                            data={reminderList}
                                                            borderColorEnum={borderColorEnum}
                                                            bgColorEnum={bgColorEnum}
                                                            onSuccess={this.getRemindersList}
                                                            addSuccess={this.getRemindersList}
                                                            onSelect={this.onSelect}
                                                        />}
                                                </>

                                        }
                                    </Spin>


                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Card>
        );
    }
}
export default ReminderCalendar;
