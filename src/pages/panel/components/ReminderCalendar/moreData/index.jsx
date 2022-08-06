import React, { useState, useEffect } from 'react';
import { Modal, Upload, Button, notification, message, Input, Form, Select, Card, Row, Col, InputNumber, Checkbox, Space } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import _styles from './styles.less';
import Add from './../add';
import { borderColorEnum, bgColorEnum } from './../data';
import Delete from './../delete';

const MoreData = (props) => {
    const { loading, data, timestamp } = props;
    const [flag, setFlag] = useState(false);
    const [dataList, setDataList] = useState([]);

    useEffect(() => {
        setDataList(data);
    }, [data]);

    // 删除成功处理
    const onSuccess = (id) => {
        const newArr = dataList.filter((item) => item.id !== id);
        setDataList(newArr);
    };

    return (
        <>

            {flag &&
            <Modal
                visible={flag}
                onCancel={(e) => { e.stopPropagation(); setFlag(false); }}
                maskClosable={false}
                width={500}
                bodyStyle={{
                    height: '490px',
                    overflowY: 'hidden',
                    paddingTop: '50px'
                }}
                footer={null}
            >
                <div className={_styles.contentWarp}>
                    {
                        Array.isArray(dataList) && dataList.map((item) => (
                            <div key={item.id} className={_styles.itemWarp} style={{borderLeftColor: borderColorEnum[item.remindType], backgroundColor: bgColorEnum[item.remindType]}}>
                                <p className={_styles.title}>{item.remindTypeName}</p>
                                <p>{item.content}</p>
                                {
                                    item.remindType === 1091 && <div className={_styles.deleteBox}><Delete id={item.id} onSuccess={onSuccess}/></div>
                                }
                            </div>
                        ))
                    }
                </div>
                <div className={_styles.addBox}>
                    <Add timestamp={timestamp} addSuccess={props.addSuccess} />
                </div>
            </Modal>

            }
            <p className={_styles.otherMessage} onClick={(e) => { e.stopPropagation(); setFlag(true); }}>还有{data.length - 2}项···</p>
        </>
    );

};



export default MoreData;
