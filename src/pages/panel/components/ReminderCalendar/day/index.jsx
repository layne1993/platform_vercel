import React from 'react';
import { Button, Row, Col, Popconfirm } from 'antd';
import _styles from './styles.less';
import Add from './../add';
import moment from 'moment';
import delete_icon from '@/assets/delete.svg';
import Delete from './../delete';

const Day = (props) => {
    const {date, data, borderColorEnum, bgColorEnum, addSuccess } = props;

    const dateList = data.length > 0 && data[0].reminderRspList || [];
    return (
        <div className={_styles.dayWarp}>
            <div className={_styles.dayDate}>{moment(date).format('YYYY年MM月DD日')}{moment(date).format('dddd')}</div>
            <div className={_styles.contentWarp}>
                {Array.isArray(dateList) && dateList.map((item) => (
                    <div key={item.id} className={_styles.itemWarp} style={{borderLeftColor: borderColorEnum[item.remindType], backgroundColor: bgColorEnum[item.remindType]}}>
                        <p style={{ lineHeight: '30px' }}>{item.remindTypeName}</p>
                        <p style={{ fontSize: 13, color: '#989797' }}>{item.content}</p>
                        {item.remindType === 1091 &&
                            <div className={_styles.deleteBox}>
                                <Delete id={item.id} onSuccess={props.onSuccess}/>
                            </div>
                        }
                    </div>
                ))}

            </div>

            <div className={_styles.add}>
                <Add addSuccess={props.addSuccess}/>
            </div>
        </div>
    );
};


export default Day;
