import { Button, Col, Form, Input, InputNumber, message, Radio, Row, Select, Space } from 'antd'
import TextArea from 'antd/lib/input/TextArea';
import React from 'react'
const { Option } = Select;

const ProductInfoEdit: React.FC<any> = (props) => {
    const { form, handleCancel } = props
    const formItemLayout = {
        labelCol: {
            xs: { span: 10 },
            sm: { span: 10 }
        },
        wrapperCol: {
            xs: { span: 12 },
            sm: { span: 12 }
        }
    };
    const onFinish = () => {
        //
    }
    const cancel = () => {
        handleCancel()
    }
    const changeValues = (rule ,value , callback)=> {
        　　const { setFieldsValue } = form ;
        　　let newArr ;
        　　if (value.length > 2){
        　　　　newArr = [].concat(value.slice(0,1), value.slice(-1) ) ;
        　　　　setFieldsValue({
        　　　　"quantitativeAuxiliaryStrategy" : newArr ,
        　　　　})
                message.warning('最多选择两项')
        　　　　callback('最多选择两项')
        　　} else {
        　　　　newArr = value ;
        　　　　callback()
        　　}
        }
    return (
        <div>
            <Form
                form={form}
                {...formItemLayout}
                onFinish={onFinish}
            >
                {/* equityRunReportId唯一id */}
                <Form.Item
                    label="基金名称"
                    name="productId"
                    style={{ display: 'none' }}
                >
                </Form.Item>

                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="基金名称"
                            name="productFullName"
                        >
                            <Input style={{ width: '90%' }} disabled placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="基金编码"
                            name="fundRecordNumber"
                        >
                            <Input style={{ width: '90%' }} disabled placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="中登公司一码通账户"
                            name="accountZhongdengCompany"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入中登公司一码通账户'
                                },
                                {
                                    len: 12,
                                    message: '长度需12个字符',
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="期货保证金监控中心账户"
                            name="futuresMarginmonitoringcenter"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入期货保证金监控中心账户'
                                },
                                {
                                    len: 8,
                                    message: '长度需8个字符',
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label="是否量化产品"
                            name="quantitativeProduct"
                            labelCol={{ span: 5, offset: 0 }}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择'
                                }
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={'1'}>是</Radio>
                                <Radio value={'0'}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="量化主策略"
                            name="quantitativeMasterStrategy"
                            extra={<p style={{ width:'80%' }}>单项选择：A-指数增强策略,B-市场中性策略,C-多空灵活策略,D-量化多头策略,E-期货CTA策略,F-参与新股发行策略,G-量化套利策略,H-日内回转策略,I-其他</p>}
                        >
                            <TextArea maxLength={500} showCount placeholder="请输入" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="量化辅策略"
                            name="quantitativeAuxiliaryStrategy"
                            extra={<p style={{ width:'80%' }}>多项选择,最多可选两项：A-指数增强策略,B-市场中性策略,C-多空灵活策略,D-量化多头策略,E-期货CTA策略,F-参与新股发行策略,G-量化套利策略,H-日内回转策略,I-其他</p>}
                        >
                            <TextArea maxLength={500} showCount placeholder="请输入" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="当期量化主策略是否发生调整"
                            name="quantitativeMasterStrategyChange"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择'
                                }
                            ]}
                        >
                            <Radio.Group>
                                <Radio value={'1'}>是</Radio>
                                <Radio value={'0'}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    {/* <Col span={12}>
                        <Form.Item
                            label="基金规模 (元)"
                            name="feeNetValue"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入基金规模'
                                }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col> */}
                    {/* <Col span={12}>
                        <Form.Item
                            label="基金总资产(元)"
                            name="totalValue"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入基金总资产'
                                }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col> */}
                    {/* <Col span={12}>
                        <Form.Item
                            label="基金单位净值"
                            name="netValue"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入基金单位净值'
                                }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '90%' }} type='number' placeholder="请输入" />
                        </Form.Item>
                    </Col> */}
                    {/* <Col span={12}>
                        <Form.Item
                            label="基金单位累计净值"
                            name="acumulateNetValue"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入基金单位累计净值'
                                }
                            ]}
                        >
                            <InputNumber min={0} style={{ width: '90%' }} type='number' placeholder="请输入" />
                        </Form.Item>
                    </Col> */}
                    <Col span={12}>
                        <Form.Item
                            label="当期净值最大回撤(%)"
                            name="maximumRetreat"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入当期净值最大回撤'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="股票投资金额 (元)"
                            name="amountInvestedInStocks"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入股票投资金额'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="日均持有股票数量"
                            name="numberShares"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入日均持有股票数量'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="日均股票成交金额（单边）"
                            name="stockTransactionAmount"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入日均股票成交金额（单边）'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="日均股票换手率(%)（单边）"
                            name="turnoverRate"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入日均股票换手率（单边）'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="期货及衍生品交易保证金(元)"
                            name="marginForDerivativesTrading"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入期货及衍生品交易保证金'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="股指期货交易保证金(元)"
                            name="marginForStockIndexFuturesTrading"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入股指期货交易保证金'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="场外衍生品交易保证金(元)"
                            name="marginForOtcDerivativesTrading"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入场外衍生品交易保证金'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="场外衍生品合约价值(元)"
                            name="valueOfOtcDerivativesContracts"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入场外衍生品合约价值'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="融资余额(元)"
                            name="balanceOfFinancing"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入融资余额'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="融券余额(元)"
                            name="securitiesBalances"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入融券余额'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="账户最高申报速率"
                            name="maximumRateOfDeclaration"
                            extra={<p style={{ width:'80%' }}>单项选择:A-每秒申报笔数500笔及以上,B-每秒申报笔数300笔至499笔,C-每秒申报笔数100笔至299笔,D-每秒申报笔数100笔以下</p>}
                        >
                            <TextArea maxLength={500} showCount placeholder="请输入" allowClear />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="当期申购总金额(元)"
                            name="subscriptionAmountTotal"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入当期申购总金额'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="当期赎回总金额(元)"
                            name="redemptionAmountTotal"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入当期赎回总金额'
                                }
                            ]}
                        >
                            <Input style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="当期发生巨额赎回次数"
                            name="mumberOfLargeRedemptions"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入当期发生巨额赎回次数'
                                }
                            ]}
                        >
                            <Input  style={{ width: '90%' }} placeholder="请输入" />
                        </Form.Item>
                    </Col>
                    <Col span={24} >
                        <Form.Item
                            label="巨额赎回情况说明"
                            name="hugeRedemptionNotes"
                            labelCol={{ span: 5, offset: 0 }}
                        >
                            <TextArea maxLength={500} showCount placeholder="请输入" allowClear />
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row justify={'end'} style={{ paddingLeft: '42px' }}>
          <Col>
            <Form.Item>
              <Space>
                <Button htmlType='submit' type='primary'>
                  提交
                  </Button>
                <Button onClick={() => cancel()}>
                  取消
                  </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row> */}
            </Form>
        </div>
    )
}

export default ProductInfoEdit

