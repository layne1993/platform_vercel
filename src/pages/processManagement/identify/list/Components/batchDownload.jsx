/*
 * @Descripttion: 拖拽上传模态框
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 10:40:47
 * @LastEditTime: 2021-09-29 14:43:48
 */
import React, { useState } from 'react';
import { Modal, Space, Button, notification, Row } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getCookie, fileExport } from '@/utils/utils';
import request from '@/utils/rest';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const BatchUpload = (props) => {
    const { modalFlag, ids, params, isAll } = props;
    // console.log(props);

    /**
     * 关闭模态框
     */
    const closeModal = () => {
        if (props.closeModal) {
            props.closeModal();
        }
    };

    /**
     * @description 批量下载
     */
    const _batchDownload = (type) => {
        if (isAll === 1) {
            let idsStr = ids.join(',');
            if (params.customerId) {
                window.location.href = `${BASE_PATH.adminUrl}${'/identify/flow/downloadIdentifyFlowId'}?identifyFlowIds=${idsStr}&downloadType=${type}&customerId=${params.customerId}&tokenId=${getCookie('vipAdminToken')}`;
            } else {
                window.location.href = `${BASE_PATH.adminUrl}${'/identify/flow/downloadIdentifyFlowId'}?identifyFlowIds=${idsStr}&downloadType=${type}&tokenId=${getCookie('vipAdminToken')}`;
            }
        }
        if (isAll === 2) {
            fileExport({
                method: 'post',
                url: '/identify/flow/downloadIdentifyFlowIdAll',
                data: {
                    downloadType: type,
                    ...params
                },
                callback: ({ status, message = '导出失败！' }) => {
                    if (status === 'success') {
                        openNotification('success', '提醒', '导出成功');
                    }
                    if (status === 'error') {
                        openNotification('error', '提醒', message);
                    }
                }
            });
        }

        closeModal();
    };


    return (
        <Modal
            title="认定材料下载方式"
            visible={modalFlag}
            onCancel={closeModal}
            footer={null}
        >
            <Row justify="center">
                <Space>
                    <Button type="primary" onClick={() => _batchDownload(1)}>按文档名称下载</Button>
                    <Button type="primary" onClick={() => _batchDownload(2)}>按投资人名称下载</Button>
                </Space>
            </Row>
        </Modal>
    );

};

export default BatchUpload;

BatchUpload.defaultProps = {
    modalFlag: false,
    ids: [],
    params: {},
    // isAll: 1,
    closeModal: () => { } // 关闭模态框回调
};
