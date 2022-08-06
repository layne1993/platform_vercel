/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-18 11:20:10
 * @LastEditTime: 2021-03-18 11:29:04
 */
import React from 'react';
import type { FC } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { ExclamationCircleTwoTone, ExclamationCircleOutlined } from '@ant-design/icons';
import _styles from './styles.less';

interface NoticesProps {
    data: any[]
}


const Ntices: FC<NoticesProps> = (props) => {

    const { data } = props;

    return (
        <Row gutter={16}>
            <Col span={18}>
                <Card className={_styles.headCardBox}>
                    {data.map((item: any, index: number) => (
                        <p className={_styles.ptxt} key={index}>
                            <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                            <span>A产品产品设立，刘凯：</span>
                            <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                            <span>2020/09/21/ 08:50</span>
                        </p>
                    ))}
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p className={_styles.ptxt}>
                        <ExclamationCircleTwoTone style={{ fontSize: '18px', marginRight: 15 }} />
                        <span>A产品产品设立，刘凯：</span>
                        <span style={{ color: 'gray' }}>描述存放在流程信息中的一段描述信息</span>，
                        <span>2020/09/21/ 08:50</span>
                    </p>
                    <p><ExclamationCircleOutlined style={{ fontSize: '18px' }} /></p>
                </Card>
            </Col>
            <Col span={6}>
                <Card title="流程情况" className={_styles.headCardBox}>
                    <Row justify="space-around">
                        <Statistic title="待处理任务" value={5} suffix="条" />
                        <Statistic title="等待最长时间" value={30} suffix="H" />
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default Ntices;
