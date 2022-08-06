import { Card, Result, Descriptions } from 'antd';
import { connect } from 'umi';
import React, { useState, useEffect } from 'react';
import { formatSeconds } from '@/utils/utils';
import moment from 'moment';
import styles from '../style.less';

const Step4 = (props) => {
    const { params, dispatch } = props;
    const [infomation, setInfomation] = useState({});
    useEffect(() => {
        dispatch({
            type: 'applyPurchase/getBaseInfo',
            payload: { ...params, codeValue: 3040 },
            callback: (res) => {
                if (res.code === 1008) {
                    setInfomation(res.data);
                }
            }
        });

    }, [1]);
    let time;
    if (infomation.createTime && infomation.updateTime) {
        // let time = infomation.updateTime - infomation.createTime;
        time = formatSeconds((new Date(infomation.updateTime) - new Date(infomation.createTime)) / 1000).data;
    }
    const subTitle = (
        <Descriptions column={1} style={{position:'absolute', left:'50%', marginLeft:'-100px'}}>
            <Descriptions.Item label="投资者名称">{infomation.customerName}</Descriptions.Item>
            <Descriptions.Item label="产品名称">{infomation.productName}</Descriptions.Item>
            <Descriptions.Item label="发起时间">{infomation.createTime && moment(infomation.createTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
            <Descriptions.Item label="耗时">{time || '--'}</Descriptions.Item>
            <Descriptions.Item label="完成时间">{infomation.updateTime && moment(infomation.updateTime).format('YYYY/MM/DD HH:mm:ss')}</Descriptions.Item>
        </Descriptions>
    );
    return (
        <Card bordered={false} style={{background:'#fff', height:'50vh'}}>
            <Result
                className={styles.step11Content}
                status="success"
                title={<h3>完成</h3>}
                subTitle={subTitle}
            />
        </Card>
    );
};

export default connect(({ applyPurchase }) => ({
    applyPurchase,
    infomation: applyPurchase.infomation
}))(Step4);