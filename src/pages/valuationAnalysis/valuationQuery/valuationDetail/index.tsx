import React, { useEffect, useState } from 'react';
import { Card,Row,Col } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import {editParseCatalogData} from '../services'

import styles from './index.less'

const valuationDetail: React.FC<{}> = props => {
  const [detailObj,setdetailObj] = useState<object>({})

  const editParseCatalogDataAjax = async () => {
    const res = await editParseCatalogData({
      fileId:props.location.query.id
    })
    if(+res.code===1001){
      setdetailObj(res.data)
    }
  };

  useEffect(() => {
    editParseCatalogDataAjax()
  }, []);

  return (
    <div>
      <PageHeaderWrapper title={`基金名称: ${detailObj?.fundName}`}>
        <Card title="基本信息">
        <Row>
            <Col span={8}>
              <span className={styles.labelBoxTemplate}>估值日期：</span>
              <span className={styles.textBox}>{detailObj?.valuationDate}</span>
            </Col>

            <Col span={8}>
              <span className={styles.labelBoxTemplate}>创建时间：</span>
              <span className={styles.textBox}>{detailObj?.createDate}</span>
            </Col>

            <Col span={8}>
              <span className={styles.labelBoxTemplate}>产品名称：</span>
              <span className={styles.textBox}>{detailObj?.fundName}</span>
            </Col>
            </Row>

            <Row>
            <Col span={8}>
              <span className={styles.labelBoxTemplate}>数据来源：</span>
              <span className={styles.textBox}>{detailObj?.source}</span>
            </Col>

            <Col span={8}>
              <span className={styles.labelBoxTemplate}>昨日净值：</span>
              <span className={styles.textBox}>{detailObj?.yesterdayNetValue}</span>
            </Col>

            <Col span={8}>
              <span className={styles.labelBoxTemplate}>累计净值：</span>
              <span className={styles.textBox}>{detailObj?.accumulatedNetValue}</span>
            </Col>
            </Row>

            <Row>
            <Col span={8}>
              <span className={styles.labelBoxTemplate}>今日净值：</span>
              <span className={styles.textBox}>{detailObj?.netValue}</span>
            </Col>

            <Col span={8}>
              <span className={styles.labelBoxTemplate}>文件附件：</span>
              <span className={styles.textBox}>基金产品数量</span>
            </Col>
            </Row>

            <Card title="要素数据（从估值表中解析出的原始数据）" headStyle={{background:'#fafafa'}}>
            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>期初单位净值：</span>
                <span className={styles.textBox}>{detailObj?.beginNetValue}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>单位净值：</span>
                <span className={styles.textBox}>{detailObj?.netValue}</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>昨日净值：</span>
                <span className={styles.textBox}>{detailObj?.yesterdayNetValue}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>累计净值：</span>
                <span className={styles.textBox}>{detailObj?.accumulatedNetValue}</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>累计派现金额：</span>
                <span className={styles.textBox}>{detailObj?.accumulatedSendCash}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>日净值增长率：</span>
                <span className={styles.textBox}>{detailObj?.netValueRate}%</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>本期净值增长率：</span>
                <span className={styles.textBox}>{detailObj?.currentNetValueRate}%</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>累计净值增长率：</span>
                <span className={styles.textBox}>{detailObj?.accumulatedNetValueRate}%</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>实现收益：</span>
                <span className={styles.textBox}>{detailObj?.realizedProfit	}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>可分配收益：</span>
                <span className={styles.textBox}>{detailObj?.distributeProfit}</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>单位可分配收益：</span>
                <span className={styles.textBox}>{detailObj?.perDistributeProfit}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>待抵扣负金融商品转让税：</span>
                <span className={styles.textBox}>{detailObj?.fundTransferTax}</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>待抵扣负估值增值暂估税：</span>
                <span className={styles.textBox}>{detailObj?.valuationTax}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>现金类占净值比：</span>
                <span className={styles.textBox}>{detailObj?.cashProportion}</span>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>资产规模(万)：</span>
                <span className={styles.textBox}>{(detailObj?.assets/10000).toFixed(2)}</span>
              </Col>
            </Row>
            </Card>

            <Card title="衍生数据" headStyle={{background:'#fafafa'}}>
            <Row>
              <Col span={12}>
                <span className={styles.labelBoxTemplate}>沪市股票市值(万)：</span>
                <span className={styles.textBox}>{(detailObj?.hsStockQuotation/10000).toFixed(2)}</span>
              </Col>

              <Col span={12}>
                <span className={styles.labelBoxTemplate}>深市股票市值(万)：</span>
                <span className={styles.textBox}>{(detailObj?.ssStockQuotation/10000).toFixed(2)}</span>
              </Col>
            </Row>
            </Card>
        </Card>
      </PageHeaderWrapper>
    </div>
  );
};

export default valuationDetail;
