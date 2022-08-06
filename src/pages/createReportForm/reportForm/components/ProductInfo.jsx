/*
 * @description: 产品信息配置
 * @Author: tangsc
 * @Date: 2021-03-29 14:40:21
 */
import React from 'react';
import { connect } from 'umi';
import styles from '../index.less';
import moment from 'moment';
import { Card, Typography, Row, Col, Modal } from 'antd';
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const { confirm } = Modal;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const ProductInfo = (props) => {

    const { dispatch, createReportForm } = props;
    const { isShowa, customFormData = {} } = createReportForm;
    const { productInfo = {} } = customFormData;

    /**
     * @description: 删除模块
     */
    const _deleteModule = () => {
        confirm({
            title: '请您确认是否删除该模块?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'createReportForm/updateState',
                    payload: {
                        isProductInfo: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    return (
        <Card>
            <div className={styles.productInfoBox}>
                <div className={styles.leftWrapper}>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Title level={5}>期初单位净值</Title>
                            <Text type="danger" strong>{productInfo.netValueOfBeginning || '--'}</Text>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>期初累计净值</Title>
                            <Text type="danger" strong>{productInfo.cumulateNetValueOfBeginning || '--'}</Text>
                        </Col>
                    </Row>
                    <Row gutter={[16, 16]}>
                        <Col span={12}>
                            <Title level={5}>期末单位净值</Title>
                            <Text type="danger" strong>{productInfo.netValueOfEnd || '--'}</Text>
                        </Col>
                        <Col span={12}>
                            <Title level={5}>期末累计净值</Title>
                            <Text type="danger" strong>{productInfo.cumulateNetValueOfEnd || '--'}</Text>
                        </Col>
                    </Row>
                </div>
                <div className={styles.mipddleWrapper}>
                    <p>产品名称：{productInfo.productFullName || '--'}</p>
                    <p>管理人：{productInfo.custodian || '--'}</p>
                    <p>托管人：{productInfo.trusteeshipName || '--'}</p>
                    <p>基金经理：{productInfo.saleUserName || '--'}</p>
                </div>
                <div className={styles.rightWrapper}>
                    <p>成立时间：{(productInfo.setDate && moment(productInfo.setDate).format(dateFormat)) || '--'}</p>
                    <p>开放日说明：{productInfo.openDate || '--'}</p>
                    <p>赎回申请说明：{productInfo.redeemApply || '--'}</p>
                    {/* <p>封闭期说明：{productInfo.blockTechnique || '--'}</p> */}
                    <p>备案编码：{productInfo.fundRecordNumber || '--'}</p>
                </div>
                {
                    isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
                }
            </div>
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(ProductInfo);