import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Spin, Card } from 'antd';
import moment from 'moment';
import _styles from './index.less';

const formItemList = [
    [
        {
            fieldName: 'publishSubject',
            label: '发行主体',
            tips: '点击跳转IPO首页',
            isLink: 1,
            linkKey: 'issuersUrl',
            isSingleRow: false
        },
        {
            fieldName: 'issueStartDate',
            label: '发行日期',
            isSingleRow: false
        }
    ],
    [
        {
            fieldName: 'preparedListExchange',
            label: '上市场所',
            tips: '点击跳转交易所首页',
            isLink: 1,
            linkKey: 'preparedListExchangeUrl',
            isSingleRow: false
        },
        {
            fieldName: 'leadUnderwriter',
            label: '保荐机构',
            tips: '点击跳转保荐机构材料提交页面',
            isLink: 1,
            linkKey: 'website',
            isSingleRow: false
        }
    ],
    [
        {
            fieldName: 'telephone',
            label: '联系方式',
            isSingleRow: true
        }
    ],
    [
        {
            fieldName: 'coleadUnderwriter',
            label: '副主承',
            isSingleRow: true
        }
    ],
    [
        {
            fieldName: 'applyMaxLP',
            label: '申购上限',
            isSingleRow: false
        },
        {
            fieldName: 'applyUnitLP',
            label: '最小申购规模',
            isSingleRow: false
        }
    ],
    [
        {
            fieldName: 'industry',
            label: '所属行业',
            isSingleRow: false
        },
        {
            fieldName: 'applyCodeOnline',
            label: '申购代码',
            isSingleRow: false
        }
    ],
    [
        {
            fieldName: 'offlineApplyPlan',
            label: '发行规模',
            isSingleRow: false
        },
        {
            fieldName: 'minProgressivePricePI',
            label: '申购级差',
            isSingleRow: false
        }
    ],
    [
        {
            fieldName: 'offLineSXZCGMDate',
            label: '产品规模日期',
            isSingleRow: false
        }
    ]
];

const StockInfo = (props) => {
    const { id, dispatch, formLoading, staggingStockDetail } = props;
    const { stockDetail } = staggingStockDetail;
    const [formData, setFormData] = useState({});

    const handleClickLink = useCallback((item) => {
        const { isLink, linkKey } = item;
        if (!isLink) return;
        if (!stockDetail[linkKey]) {
            message.info('链接不存在');
            return;
        }
        window.open(stockDetail[linkKey]);
    }, [stockDetail]);

    useEffect(() => {
        dispatch({
            type: 'staggingStockDetail/getStockDetail',
            payload: { secuCode: id }
        });

        return () => {
            dispatch({
                type: 'staggingStockDetail/updateModelData',
                payload: { stockDetail: {} }
            });
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (!stockDetail || stockDetail.secuCode !== id) return;
        const obj = {};

        formItemList.forEach((item) => {
            item.forEach((subItem) => {
                const { fieldName } = subItem;
                if (fieldName === 'publishSubject') {
                    const { secuCode, securityAbbr } = stockDetail;
                    obj[fieldName] = `${secuCode}[${securityAbbr}]`;
                } else if (fieldName === 'telephone') {
                    const { email, tel } = stockDetail;
                    obj[fieldName] = `联系方式：${tel || ''}；邮箱：${email || ''}`;
                } else if (fieldName === 'priceRange') {
                    const { issueVolCeiling, issueVolFloor } = stockDetail;
                    obj[fieldName] = `${issueVolFloor || 0}-${issueVolCeiling || 0}`;
                } else if (fieldName === 'issueStartDate' || fieldName === 'offLineSXZCGMDate') {
                    const val = stockDetail[fieldName];
                    obj[fieldName] = val ? moment(val).format('YYYY-MM-DD') : '';
                } else {
                    obj[fieldName] = stockDetail[fieldName];
                }
            });
        });

        setFormData(obj);
    }, [id, stockDetail]);

    return (
        <Card title="标的信息" className={_styles.stockInfo}>
            <Spin spinning={formLoading}>
                {formItemList.map((item, index) => (
                    <div key={index} className={`${_styles.rowItem} ${item[0].isSingleRow ? _styles.singleRow : ''}`}>
                        {item.map((subItem, subIndex) => (
                            <div key={subIndex} className={_styles.colItem}>
                                <div className={_styles.label}>{subItem.label}：</div>
                                <div className={_styles.right}>
                                    <div
                                        className={`${_styles.input} ${subItem.isLink === 1 ? _styles.linkInput : ''}`}
                                        onClick={() => handleClickLink(subItem)}
                                    >
                                        {formData[subItem.fieldName]}
                                    </div>
                                    {subItem.tips && <p className={_styles.tips}>{subItem.tips}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </Spin>
        </Card>
    );
};

export default connect(({ staggingStockDetail, loading }) => ({
    formLoading: loading.effects['staggingStockDetail/getStockDetail'],
    staggingStockDetail
}))(StockInfo);
