import React, { useState, useEffect } from 'react';
import { Button, Modal, Tooltip } from 'antd';
import _styles from './styles.less';
import Add from './../add';
import Item from './../item';
import moment from 'moment';

const colorEnum = {
    1: '#FFFF00',
    2: '#FFFF00',
    3: '#FFFF00',
    4: '#FFFF00',
    5: '#FFFF00',
    7: '#FFFF00',
    8: '#FFFF00'
};

const WEEKDAYS = [
    {
        label: '周一',
        day: '11',
        content: []
    },
    {
        label: '周二',
        day: '11',
        content: []
    },
    {
        label: '周三',
        day: '11',
        content: []
    },
    {
        label: '周四',
        day: '11'
    },
    {
        label: '周五',
        day: '11'
    },
    {
        label: '周六',
        day: '11'
    },
    {
        label: '周日',
        day: '11'
    }
];

const DATE_FORMAT = 'YYYY-MM-DD';

const Day = (props) => {

    const { date, data, borderColorEnum, bgColorEnum } = props;
    const [weekDays, setWeeekDays] = useState(WEEKDAYS);
    /**
     * @description 数据格式转换
     */
    const getData = (date) => {
        let weekOfDay = moment(date).format('E'); // 指定日期的周的第几天
        const WEEKDAYS = [
            {
                label: '周一',
                day: moment(date).subtract(weekOfDay - 1, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 1, 'days').format(DATE_FORMAT),
                content: []
            },
            {
                label: '周二',
                day: moment(date).subtract(weekOfDay - 2, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 2, 'days').format(DATE_FORMAT),
                content: []
            },
            {
                label: '周三',
                day: moment(date).subtract(weekOfDay - 3, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 3, 'days').format(DATE_FORMAT),
                content: []
            },
            {
                label: '周四',
                day: moment(date).subtract(weekOfDay - 4, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 4, 'days').format(DATE_FORMAT)
            },
            {
                label: '周五',
                day: moment(date).subtract(weekOfDay - 5, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 5, 'days').format(DATE_FORMAT)
            },
            {
                label: '周六',
                day: moment(date).subtract(weekOfDay - 6, 'days').format('DD'),
                date: moment(date).subtract(weekOfDay - 6, 'days').format(DATE_FORMAT)
            },
            {
                label: '周日',
                day: moment(date).add(7 - weekOfDay, 'days').format('DD'),
                date: moment(date).add(7 - weekOfDay, 'days').format(DATE_FORMAT)
            }
        ];

        WEEKDAYS.map((item) => {
            data.map((it) => {
                if (moment(it.date).format(DATE_FORMAT) === item.date) {
                    item['content'] = it.reminderRspList;
                }
            });
        });
        // console.log(WEEKDAYS, 'WEEKDAYS');
        setWeeekDays(WEEKDAYS);
    };

    useEffect(() => {
        getData(date);
    }, [date, data]);
    console.log(weekDays)
    return (
        <div className={_styles.weekWarp}>
            <div className={_styles.weekHead}>
                {
                    weekDays.map((item, index) => (
                        <div key={index} className={_styles.weekDay}>
                            <p className={_styles.week}>{item.label}({item.day})</p>
                        </div>
                    ))
                }
            </div>
            <div className={_styles.weekBody}>
                {
                    weekDays.map((item, index) => (
                        <div key={item.id} className={_styles.dayContent}>
                            {
                                Array.isArray(item.content) && item.content.map((it, i) => (
                                    // <div key={`item-${it.id}`} className={_styles.itemContent} style={{borderLeftColor: borderColorEnum[it.remindType], backgroundColor: bgColorEnum[it.remindType]}}>
                                    //     <Tooltip
                                    //         color="white"
                                    //         placement="right"
                                    //         title={<div className={_styles.tip} >
                                    //             <p className={_styles.tipTitle} style={{borderLeftColor: borderColorEnum[it.remindType], backgroundColor: bgColorEnum[it.remindType]}}>{it.remindTypeName}</p>
                                    //             <p className={_styles.tipContent} style={{ color: 'grey', marginBottom: 0 }}>{it.content}</p>
                                    //         </div>}
                                    //     >
                                    //         <p style={{marginBottom: '0px'}} >{it.remindTypeName}</p>
                                    //     </Tooltip>
                                    //     {/* <p style={{marginBottom: 0}}>{it.remindTypeName}</p> */}
                                    // </div>
                                    <Item key={it.id} data={it} marginBottom={5} onSuccess={props.onSuccess} />
                                ))
                            }
                            <Add type="ghost" timestamp={moment(item.date).valueOf()} addSuccess={props.addSuccess} />
                        </div>
                    ))
                }

            </div>
        </div>
    );
};


export default Day;
