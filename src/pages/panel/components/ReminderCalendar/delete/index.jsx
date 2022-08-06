import React, { useState, useEffect } from 'react';
import { notification, Popconfirm, Modal } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'umi';
import delete_icon from '@/assets/delete.svg';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};



const Delete = (props) => {
    const { loading, size, type, dispatch, id, onSuccess } = props;




    const doDelete = () => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined />,
            content: '确定删除?',
            onOk: () => {
                dispatch({
                    type: 'panel/deleteRemind',
                    payload: {
                        remindId: id
                    },
                    callback: ({ code, data = [], message }) => {
                        if (code === 1008) {
                            const txt = message || data || '删除成功！';
                            openNotification('success', '提醒', txt);
                            onSuccess(id);
                        } else {
                            const txt = message || data || '删除失败！';
                            openNotification('error', '提醒', txt);
                        }
                    }
                });
            }
        });

    };


    return (
        <img style={{ cursor: 'pointer' }} onClick={(e) => {e.stopPropagation(); doDelete(); }} src={delete_icon} alt="" />
    );

};


Delete.defaultProps = {
    onSuccess: () => {}
};

Delete.propTypes = {
};


export default connect(({ panel, loading }) => ({
    loading: loading.effects['panel/deleteRemind']
}))(Delete);
