import React from 'react';
import { Button, Modal, Tooltip, Calendar } from 'antd';
import _styles from './styles.less';
import Add from './../add';
import Item from './../item';
import More from './../moreData';
import moment from 'moment';


const DATE_FORMAT = 'YYYY-MM-DD';

const Month = (props) => {

    const { data, date, onSelect } = props;
    // 获取日期的数据
    const getDateList = (date) => {
        let dateList = [];
        data.map((item) => {
            if (moment(date).format(DATE_FORMAT) === moment(item.date).format(DATE_FORMAT)) {
                dateList = [...item.reminderRspList];
            }
        });

        return dateList;
    };



    const dateCellRender = (value) => {
        const arr = getDateList(value);
        return (
            <div className={_styles.cellRender}>
                <p className={_styles.date}>{moment(value).date()}</p>
                <div className={_styles.dayContent}>
                    {Array.isArray(arr) && arr.slice(0, 2).map((item, index) => (
                        // <Tooltip
                        //     key={index}
                        //     color="white"
                        //     placement="right"
                        //     title={<div className={_styles.tip} >
                        //         <p className={_styles.tipTitle} style={{borderLeftColor: borderColorEnum[item.remindType], backgroundColor: bgColorEnum[item.remindType]}}>{item?.remindTypeName}</p>
                        //         <p className={_styles.tipContent} style={{ color: 'grey', marginBottom: 0 }}>{item.content}</p>
                        //     </div>}
                        // >
                        //     <p className={_styles.itemContent} style={{borderLeftColor: borderColorEnum[item.remindType], backgroundColor: bgColorEnum[item.remindType]}}>
                        //         {item.remindTypeName}
                        //     </p>
                        // </Tooltip>
                        <Item
                            key={item.id}
                            data={item}
                            borderWidth={2}
                            marginBottom={3}
                            onSuccess={props.onSuccess}
                        />
                    ))}
                </div>
                {arr.length > 2 && <More data={arr} timestamp={moment(value).valueOf()} addSuccess={props.addSuccess} />}
                {arr.length < 3 && (moment(value).valueOf() > moment(date).startOf('month') && moment(value).valueOf() < moment(date).endOf('month')) &&
                    <div className={_styles.addBox}>
                        <Add size="small" type="ghost" timestamp={moment(value).valueOf()} addSuccess={props.addSuccess} />
                    </div>
                }
            </div>
        );
    };


    return (
        <div className={_styles.monthWarp}>
            <Calendar
                headerRender={() => null}
                mode="month"
                dateFullCellRender={dateCellRender}
                value={moment(date)}
                onSelect={onSelect}
            />
        </div>
    );
};


export default Month;
