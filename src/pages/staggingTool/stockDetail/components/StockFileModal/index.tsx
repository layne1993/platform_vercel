import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Modal, Button, Row, Col } from 'antd';
import ZipIcon from '@/assets/stagging/zip.svg';
import { getCookie } from '@/utils/utils';
import axios from 'axios';
import _styles from './index.less';

const materialList = [
    {
        label: '承诺函'
    },
    {
        label: '关联方信息表'
    },
    {
        label: '资产规模汇总表'
    },
    {
        label: '出资方信息表'
    }
];

const StockFileModal = (props) => {
    const {
        id: stockId,
        isVisible,
        onCancel,
        onConfirm,
        submitLoading,
        staggingStockDetail
    } = props;
    const { IPOMaterialList, newIPOMaterialList } = staggingStockDetail;
    const [mList, setMList] = useState([]);

    const handleDownloadAll = useCallback(async () => {
        const res = await axios({
            url: `${BASE_PATH.adminUrl}/staggingnew/apply/downloadMaterialPackage`,
            data: { secuCode: stockId },
            method: 'post',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json; application/octet-stream',
                'tokenId': getCookie('vipAdminToken') || ''
            }
        });
        try {
            let fileName = res.headers['content-disposition'].split(';')[1].split('filename*=utf-8\'\'')[1];
            fileName = decodeURIComponent(fileName);
            const blob = new Blob([res.data]);
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
            onConfirm();
        } catch (error) {
            message.error('生成文件失败');
        }
    }, [onConfirm, stockId]);

    const handleDownload = useCallback((item) => {
        // const type = index + 1;
        // const item = IPOMaterialList.find((i) => i.type === type);
        if (!item || !item.fileUrl) {
            message.info('材料不存在');
            return;
        }
        const { fileUrl } = item;
        window.open(fileUrl);
    }, [IPOMaterialList]);

    useEffect(() => {
        const list = [];
        [...Array(4)].map((item, index) => {
            const file = IPOMaterialList.find((i) => i.type === index + 1);
            const { fileName = '', fileUrl = '' } = file || {};
            list.push({
                fileUrl,
                fileName
            });
        });
        setMList(list);
    }, [IPOMaterialList]);


    const getBtn = () => {
        const list = [];
        Array.isArray(newIPOMaterialList) && newIPOMaterialList.map((item) => {
            if (item.code !== -2) {
                list.push(item);
            }
        });
        if (list.length > 0) {
            return (<Button
                key="submit"
                type="primary"
                size="large"
                loading={submitLoading}
                onClick={handleDownloadAll}
            >
                生成文件
            </Button>);
        } else {
            return (
                <Button
                    key="submit"
                    type="primary"
                    size="large"
                    disabled
                >
                    无承销商模板
                </Button>
            );
        }
    };

    return (
        <Modal
            className={_styles.stepInfoModal}
            visible={isVisible}
            width="70%"
            destroyOnClose
            onCancel={onCancel}
            footer={[
                getBtn()
            ]}
        >
            <Row justify="center">
                {IPOMaterialList.map((item, index) => (
                    (item.code === 1 || item.code === 2 || (item.code === 0 && item.hints.length > 0)) &&
                    <Col key={index} span={4}>
                        <div className={_styles.item}>
                            <div className={_styles.label}>{item.typeName}：</div>
                            <div className={_styles.right}>
                                <div className={_styles.iconBox} onClick={() => handleDownload(item)}>
                                    <img src={ZipIcon} />
                                </div>
                                <p>{item.fileName}</p>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Modal>
    );
};

export default connect(({ staggingStockDetail, loading }) => ({
    submitLoading: loading.effects['staggingStockDetail/downloadAllMeterials'],
    staggingStockDetail
}))(StockFileModal);
