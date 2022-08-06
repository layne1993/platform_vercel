import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Modal, Space, Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StockInfo from './components/StockInfo';
import StepDetail from './components/StepDetail';
import ProductInfo from './components/ProductInfo';
import ProductModal from './components/ProductModal';
import StockFileModal from './components/StockFileModal';

const StockDetail = (props) => {
    const { dispatch, match: { params }, staggingStockDetail } = props;
    const { id } = params;
    const [productModalIsVisible, toggleProductModalIsVisible] = useState(false);
    const [stockFileModalIsVisible, toggleStockFileModalIsVisible] = useState(false);
    const [warningModalIsVisible, toggleWarningModalIsVisible] = useState(false);
    const [warningList, setWarningList] = useState([]);

    // 标的打新的状态
    // 1=>参与中 2=>可参与 3=>未参与
    const [applyStatus, setApplyStatus] = useState(3);

    const getCanApplyProduct = useCallback(() => {
        dispatch({
            type: 'staggingStockDetail/getCanApplyProductList',
            payload: {
                secuCode: id
            }
        });
    }, [dispatch, id]);

    const getApplyStatus = useCallback(async () => {
        const res = await dispatch({
            type: 'staggingStockDetail/queryApplyBySecuCode',
            payload: {
                code: id
            }
        });
        if (res.code === 1008) {
            setApplyStatus(res.data);
            // if (res.data !== 2) return;
            // toggleProductModalIsVisible(true);
            // getCanApplyProduct();
        }
    }, [dispatch, getCanApplyProduct, id]);

    const handleGenerateFile = useCallback((list = []) => {
        toggleProductModalIsVisible(false);
        toggleStockFileModalIsVisible(true);

        // 生成文件
        dispatch({
            type: 'staggingStockDetail/getStaggingMaterials',
            payload: {
                secuCode: id
            }
        });

        const warningList = [];
        list.forEach((item) => {
            if (item.code !== 2 && item.code !== -2) {
                warningList.push(...item.hints);
            }
        });
        if (warningList.length > 0) {
            setTimeout(() => {
                toggleWarningModalIsVisible(true);
                setWarningList(warningList);
            }, 100);
        }

        getApplyStatus();
        getCanApplyProduct();
    }, [dispatch, getApplyStatus, getCanApplyProduct, id]);

    const handleDownloadAllFile = useCallback(() => {
        toggleStockFileModalIsVisible(false);
    }, []);

    const tipRemark = () => {
        const { stockDetail } = staggingStockDetail;
        if (stockDetail.remark) {
            Modal.info({
                title: '提示',
                okText: '确定',
                content: (
                    <div>
                        <p>{stockDetail.remark}</p>
                    </div>
                )
            });
        }
    };

    const handleJoin = useCallback(() => {
        toggleProductModalIsVisible(true);
        getCanApplyProduct();
    }, [getCanApplyProduct]);

    useEffect(() => {
        getApplyStatus();
    }, [getApplyStatus]);

    return (
        <PageHeaderWrapper>
            <Space direction="vertical" style={{ width: '100%' }}>
                <StockInfo id={id}></StockInfo>
                <StepDetail id={id} applyStatus={applyStatus}></StepDetail>
                {applyStatus === 1 && (
                    <ProductInfo id={id} onReChoose={() => { handleJoin(); tipRemark(); }}></ProductInfo>
                )}
                {applyStatus === 2 && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                        <Button style={{ display: 'flex' }} type="primary" size="large" onClick={() => { handleJoin(); tipRemark(); }}>选择参与打新产品</Button>
                    </div>
                )}
            </Space>

            <ProductModal
                id={id}
                isVisible={productModalIsVisible}
                onCancel={() => toggleProductModalIsVisible(false)}
                onConfirm={handleGenerateFile}
            ></ProductModal>
            <StockFileModal
                id={id}
                isVisible={stockFileModalIsVisible}
                onCancel={() => toggleStockFileModalIsVisible(false)}
                onConfirm={handleDownloadAllFile}
            ></StockFileModal>

            <Modal
                title="提示"
                visible={warningModalIsVisible}
                destroyOnClose
                onCancel={() => toggleWarningModalIsVisible(false)}
                onOk={() => toggleWarningModalIsVisible(false)}
            >
                <ul style={{ padding: 0 }}>
                    {warningList.map((item, index) => (
                        <li key={index} style={{ marginBottom: '12px' }}>{item}</li>
                    ))}
                </ul>
            </Modal>

        </PageHeaderWrapper>
    );
};

export default connect(({ staggingStockDetail }) => ({
    staggingStockDetail
}))(StockDetail);
