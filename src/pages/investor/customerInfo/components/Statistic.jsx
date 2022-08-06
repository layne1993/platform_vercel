import React from 'react';
import { Row, Col, Statistic, Tooltip } from 'antd';
import { QuestionCircleOutlined} from '@ant-design/icons';
import styles from './qualifiedInvestor.less';
import cny from '@/assets/cny.svg';
import usd from '@/assets/usd.svg';
import hkd from '@/assets/hkd.svg';

const valueRender = (val) => {
    if(val=== '') return '--';
    if(val=== null) return '--';
    return val;
};



const StatisticOverView = (props) => {
    const {holdTotalAmountDTO = {}, holdingEarningsDTO = {}, netPurchaseAmountDTO= {}, totalInvestmentAmountDTO = {}} = props.data || {};
    const currencyValueCheck = (currency) => {
        if(
            (holdTotalAmountDTO[currency] === '' || holdTotalAmountDTO[currency] === null) &&
            (holdingEarningsDTO[currency] === '' || holdingEarningsDTO[currency] === null) &&
            (netPurchaseAmountDTO[currency] === '' || netPurchaseAmountDTO[currency]=== null) &&
            (totalInvestmentAmountDTO[currency] === '' || totalInvestmentAmountDTO[currency]=== null)
        ) return false;
        return true;
    };
    return (
        <>
            {
                currencyValueCheck('cny') &&
                <Row>
                    <Col span={4} style={{display: 'flex'}}>
                        <div>
                            <img src={cny} alt=""/>
                        </div>
                        <div>
                            <p className={styles.currencyTitle}>人民币(CNY)</p>
                            <p className={styles.currencyTitle}>产品统计：</p>
                        </div>
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="有过交易信息的金额均计算在内">投资总金额(CNY)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(totalInvestmentAmountDTO.cny)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="统计有交易记录且持有份额不为0的总金额">披露总金额(CNY)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(holdTotalAmountDTO.cny)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic title="总成本(CNY)" value={valueRender(netPurchaseAmountDTO.cny)} />
                    </Col>
                    <Col span={5}>
                        <Statistic title="披露总收益(CNY)" value={valueRender(holdingEarningsDTO.cny)} />
                    </Col>
                </Row>
            }
            {
                currencyValueCheck('usd') &&
                <Row>
                    <Col span={4} style={{display: 'flex'}}>
                        <div>
                            <img src={usd} alt=""/>
                        </div>
                        <div>
                            <p className={styles.currencyTitle}>美元(USD)</p>
                            <p className={styles.currencyTitle}>产品统计：</p>
                        </div>
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="有过交易信息的金额均计算在内">投资总金额(USD)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(totalInvestmentAmountDTO.usd)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="统计有交易记录且持有份额不为0的总金额">披露总金额(USD)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(holdTotalAmountDTO.usd)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic title="总成本(USD)" value={valueRender(netPurchaseAmountDTO.usd)} />
                    </Col>
                    <Col span={5}>
                        <Statistic title="披露总收益(USD)" value={valueRender(holdingEarningsDTO.usd)} />
                    </Col>
                </Row>
            }

            {
                currencyValueCheck('hkd')  && <Row>
                    <Col span={4} style={{display: 'flex'}}>
                        <div>
                            <img src={hkd} alt=""/>
                        </div>
                        <div>
                            <p className={styles.currencyTitle}>港元(HKD)</p>
                            <p className={styles.currencyTitle}>产品统计：</p>
                        </div>
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="有过交易信息的金额均计算在内">投资总金额(HKD)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(totalInvestmentAmountDTO.hkd)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic
                            title={<Tooltip title="统计有交易记录且持有份额不为0的总金额">披露总金额(HKD)<QuestionCircleOutlined /></Tooltip>}
                            value={valueRender(holdTotalAmountDTO.hkd)}
                        />
                    </Col>
                    <Col span={5}>
                        <Statistic title="总成本(HKD)" value={valueRender(netPurchaseAmountDTO.hkd)} />
                    </Col>
                    <Col span={5}>
                        <Statistic title="披露总收益(HKD)" value={valueRender(holdingEarningsDTO.hkd)} />
                    </Col>
                </Row>
            }

        </>
    );
};

export default StatisticOverView;

// Statistic.defaultProps ={
//     data: {
//         holdTotalAmountDTO: {
//             cny: null,
//             usd: null,
//             hkd: null
//         },
//         holdingEarningsDTO: {
//             cny: null,
//             usd: null,
//             hkd: null
//         },
//         netPurchaseAmountDTO: {
//             cny: null,
//             usd: null,
//             hkd: null
//         },
//         totalInvestmentAmountDTO: {
//             cny: null,
//             usd: null,
//             hkd: null
//         }

//     }
// };
