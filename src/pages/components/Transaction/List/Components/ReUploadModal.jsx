/*
 * @description: 批量上传失败重新上传客户
 * @Author: tangsc
 * @Date: 2021-05-14 09:55:13
 */

import React, { useState } from 'react';
import { connect } from 'umi';
import styles from './ReUploadModal.less';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Upload, Alert, Row, Col, Typography, Space, Button, notification } from 'antd';
import { getCookie, fileExport } from '@/utils/utils';

const { Text } = Typography;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const ReUploadModal = (props) => {

    const { isModalVisible, onCancel, uploadFailKey } = props;

    const [fileList, setFileList] = useState([]);

    const _beforeUpload = (file) => {
        if (file.name) {
            let files = file.name.split('.');
            let fileType = files[files.length - 1];
            let isExcel = (fileType === 'xls' || fileType === 'xlsx');
            if (!isExcel) {
                openNotification('warning', '提示', '请上传Excel格式文件', 'topRight');
                return false;
            }
            return true;
        }
    };

    const _onRemove = () => {
        setFileList([]);
    };

    const _handleFileChange = (info) => {
        setFileList(info.fileList);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    const _downLoadFile = () => {
        fileExport({
            method: 'get',
            url: '/trade/exportCustomers',
            data: {
                key: uploadFailKey
            }
        });
    };

    return (
        <Modal
            width="800px"
            className={styles.reUploadContainer}
            title="批量上传"
            centered
            maskClosable={false}
            visible={isModalVisible}
            onCancel={onCancel}
            onOk={onCancel}
            // footer={null}
        >
            <Alert
                message={'导入失败！需要首先维护客户基本信息，请确认或补充以下信息。'}
                type="warning"
                showIcon
                closable
            />
            <Row gutter={[8, 0]}>
                <Col span={6} className={styles.colLabel}>
                    <Text>
                        1.新客户名单：
                    </Text>
                </Col>
                <Col>
                    <Space direction="vertical">
                        <a onClick={_downLoadFile}>
                            点击下载判断为新客户的名单
                        </a>
                        <Text className={styles.tips}>
                            下载后请维护好excel文件
                        </Text>
                    </Space>

                </Col>
            </Row>
            <Row gutter={[8, 0]}>
                <Col span={6} className={styles.colLabel}>
                    <Text>
                        2.上传文件：
                    </Text>
                </Col>
                <Col>
                    <Upload
                        name="file"
                        accept=".xls, .xlsx"
                        action={`${BASE_PATH.adminUrl}/customer/batchUpload`}
                        headers={{
                            tokenId: getCookie('vipAdminToken')
                        }}
                        // data={{
                        //     sourceId: '',
                        //     source: 22,
                        //     codeType: 163
                        // }}
                        fileList={fileList}
                        beforeUpload={_beforeUpload}
                        onRemove={_onRemove}
                        onChange={_handleFileChange}
                    // onPreview={!isEmpty(fileList) ? _filePreView : false}
                    >
                        <Button><UploadOutlined /> 上传文件</Button>
                    </Upload>
                </Col>
            </Row>
        </Modal>
    );
};

export default connect(({ RunningList }) => ({
    RunningList
}))(ReUploadModal);