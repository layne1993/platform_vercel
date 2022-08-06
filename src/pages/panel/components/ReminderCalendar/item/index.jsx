import React, { useState, useEffect } from 'react';
import { Tooltip} from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import moment from 'moment';
import _styles from './styles.less';
import { borderColorEnum, bgColorEnum } from './../data';
import Delete from './../delete';



const Item = (props) => {
    const { data, onSuccess, borderWidth, marginBottom } = props;

    return (
        <>
            <Tooltip
                color="white"
                placement="right"
                title={<div className={_styles.tip} >
                    <p className={_styles.tipTitle} style={{borderLeftColor: borderColorEnum[data.remindType], backgroundColor: bgColorEnum[data.remindType]}}>{data?.remindTypeName}</p>
                    <p className={_styles.tipContent} style={{ color: 'grey', marginBottom: 0 }}>{data.content}</p>
                    {
                        data.remindType === 1091 &&
                        <div className={_styles.deleteBox}>
                            <Delete id={data.id} onSuccess={onSuccess}/>
                        </div>
                    }

                </div>}
            >
                <p
                    className={_styles.itemContent}
                    style={{
                        borderLeftColor: borderColorEnum[data.remindType],
                        backgroundColor: bgColorEnum[data.remindType],
                        borderWidth: borderWidth,
                        marginBottom: marginBottom,
                        minHeight: '20px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                >
                    {data.content}
                </p>
            </Tooltip>

        </>
    );

};



export default Item;
