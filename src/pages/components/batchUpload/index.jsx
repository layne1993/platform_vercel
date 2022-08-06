/*
 * @Descripttion: 拖拽上传模态框
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 10:40:47
 * @LastEditTime: 2021-05-20 17:12:13
 */
import React, { useState } from 'react';
import { Modal, Upload, Button, notification, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';
import PropTypes from 'prop-types';

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
    const {
        url,
        params,
        modalFlag,
        title,
        tipMsg,
        multiple,
        accept,
        fileFormat,
        templateMsg,
        templateUrl,
        callback,
        closeModal,
        failCallback
    } = props;
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [loading, setLoading] = useState(false);

    /**
     * 关闭模态框
     */
    const onCancel = () => {
        if (closeModal && typeof closeModal === 'function') closeModal();
    };

    /**
     * 选择文件
     * @param {*} file
     * @param {*} fileList
     */
    const beforeUpload = (file, fileList) => {
        console.log(file);
        setFile(file);
        setFileList(fileList);
        return false;
    };

    /**
     * @description 移除文件
     * @param {*} file
     */
    const onRemove = (file) => {
        setFileList([]);
        return true;
    };

    /**
     * 上传成功回调
     */
    const success = () => {
        if (props.onOk) {
            props.onOk();
        }
    };

    /**
     * @description 文件上传
     * @param {} file
     */
    const doUpload = async () => {
        setLoading(true);
        let formData = new window.FormData();
        console.log(file);
        formData.append('file', file);
        // console.log('params', params);
        if (params) {
            for (let key in params) {
                params[key] && formData.append(key, params[key]);
            }
        }
        let res = await request.postMultipart(url, formData);
        if (res.code === 1008) {
            if (res.data && !res.data.success) {
                openNotification('warning', '提醒', '上传失败！');
                if (failCallback && typeof failCallback === 'function') failCallback(res); // 认申赎确认信息 客户重新上传
            } else {
                openNotification('success', '提醒', '上传成功');
                success();
                if (callback && typeof callback === 'function') callback(res);
            }
        } else if (res.code == 1001) {
            failCallback();
            openNotification(
                'success',
                `提示（代码：${res.code}）`,
                res.message || '上传成功！',
                'topRight',
            );
        } else {
            failCallback();
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
        setLoading(false);
    };

    const uploadProps = {
        name: 'file',
        multiple,
        accept,
        fileList: fileList,
        headers: {
            tokenId: getCookie('vipAdminToken')
        },
        action: `${BASE_PATH.adminUrl}${url}`,
        beforeUpload: beforeUpload,
        onRemove: onRemove
    };

    return (
        <Modal
            maskClosable={false}
            title={title}
            visible={modalFlag}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={closeModal}>
                    关闭
                </Button>,
                <Button
                    key="sure"
                    type="primary"
                    disabled={fileList.length === 0}
                    onClick={doUpload}
                    loading={loading}
                >
                    确定
                </Button>
            ]}
        >
            <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">{tipMsg}</p>
                <p className="ant-upload-hint">{fileFormat}</p>
                <p className="ant-upload-hint">选中后请勿修改源文件,以免上传失败</p>
            </Upload.Dragger>
            {templateUrl && (
                <div style={{ marginTop: 15 }}>
                    {React.isValidElement(templateUrl) ? (
                        templateUrl
                    ) : (
                        <a href={`${BASE_PATH.adminUrl}${templateUrl}`}>{templateMsg}</a>
                    )}
                </div>
            )}
            {!templateUrl && templateMsg && (
                <div style={{ marginTop: 15 }}>
                    <span>{templateMsg}</span>
                </div>
            )}
        </Modal>
    );
};

export default BatchUpload;

BatchUpload.defaultProps = {
    title: '文件上传',
    modalFlag: false,
    tipMsg: '将上传文件拖拽到这里',
    params: {}, // 上传参数
    url: '', // 上传接口
    multiple: true, //当个上传多个上传
    fileFormat: '', // 文件格式提示
    accept: undefined, // 文件格式
    closeModal: () => { }, // 关闭模态框回调
    onOk: () => { }, // 点击模态框确定按钮回调
    templateMsg: '模板下载', // 模板名称
    templateUrl: null, // 模板地址
    callback: () => { }, // 上传成功回调
    failCallback: () => { } // 上传失败回调
};

BatchUpload.propTypes = {
    url: PropTypes.string.isRequired,
    modalFlag: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    title: PropTypes.string,
    fileFormat: PropTypes.string,
    accept: PropTypes.string,
    templateMsg: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    templateUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    multiple: PropTypes.bool,
    tipMsg: PropTypes.string,
    onOk: PropTypes.func,
    callback: PropTypes.func,
    params: PropTypes.object,
    failCallback: PropTypes.func
};
