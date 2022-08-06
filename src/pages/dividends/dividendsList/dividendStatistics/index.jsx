/*
 * @description: 产品分红-列表
 * @Author: tangsc
 * @Date: 2020-10-29 18:02:27
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import {
    Button,
    Row,
    Col,
    Form,
    Select,
    DatePicker,
    notification} from 'antd';
import {
    XWDividendType
} from '@/utils/publicData';
import MXTable from '@/pages/components/MXTable';
import { listToMap, numTransform2 } from '@/utils/utils';
import styles from './index.less';
import moment from 'moment';
import { MultipleSelect } from '@/pages/components/Customize';


const FormItem = Form.Item;
const { Option } = Select;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';



// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class DividendStatistics extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            pageNum: 1,
            pageSize: 20
        },
        dataSource: [],
        formData: {},
        productList: []
    };

    componentDidMount() {
        this.getDividendsList();
        // this.getFrom();
        // this.getproductList();
        this._setColums();
    }



    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [

        {
            title: '分红确认日',
            dataIndex: 'confirmDate',
            width: 100,
            render: (val) => <span>{(val && moment(val).format(dateFormat)) || '--'}</span>
        },
        {
            title: '分红类型',
            dataIndex: 'dividendType',
            width: 80,
            render: (val) => listToMap(XWDividendType)[val]
        },
        {
            title: '分红比数',
            dataIndex: 'dividendNum',
            width: 80,
            render: (val) => <span>{val || '--'}</span>
        },

        {
            title: '投资者数量',
            dataIndex: 'customerNum',
            width: 120,
            // sorter: true,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '实发现金',
            dataIndex: 'actualMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '红利总金额',
            dataIndex: 'tradeMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },

        {
            title: '再投资金额',
            dataIndex: 'secondMoney',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '再投资份额',
            dataIndex: 'secondShare',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '再投资净值',
            dataIndex: 'secondNetValue',
            width: 90
        },
        {
            title: '再投资费用',
            dataIndex: 'secondFee',
            width: 120,
            render: (val) => numTransform2(val)
        },
        {
            title: '业绩提成',
            dataIndex: 'pushMoney',
            width: 100,
            render: (val) => numTransform2(val)
        },
        {
            title: '数据来源',
            dataIndex: 'sourceTypeStr',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '操作',
            width: 100,
            render: (_, record) => <a onClick={()=>this.props.viewDetails(record)}>查看详情</a>
        }
    ];

    /**
     * @description: 设置表头列
     * @param {*}
     */
    _setColums = () => {
        const { params = {} } = this.props;
        if (!params.productId) {
            this.columns.unshift({
                title: '产品名称',
                dataIndex: 'productName',
                width: 150,
                // fixed: 'left',
                render: (val, record) => <Link to={`/product/list/details/${record.productId}`}>{val}</Link> || '--'
            });
        }
    };


    /**
     * 获取类别数据
     */
    getDividendsList = () => {
        const { dispatch, params } = this.props;
        const formData = this.formRef.current.getFieldsValue();
        const { pageData } = this.state;
        dispatch({
            type: 'DIVIDENDS_LIST/StatisticsList',
            payload: {
                ...params,
                ...formData,
                ...pageData,
                confirmDate: formData.confirmDate && moment(formData.confirmDate).valueOf()
            },
            callback: (res) => {
                if (res.code === 1008) {
                    // const { list } = res.data || {};
                    this.setState({
                        dataSource: res.data || {}
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {

        this.getDividendsList();
    };

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = 1;
        this.formRef.current.resetFields();
        this.getDividendsList();
    };

    /**
     * @description: Table的CheckBox change事件
     * @param {Array} selectedRowKeys
     */
    _onSelectChange = (selectedRowKeys) => {
        this.setState({
            selectedRowKeys
        });
    };



    /**
     * @description: 表格变化
     */
    _tableChange = (p) => {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageNum = p.current;
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.pageData.pageSize = p.pageSize;
        this.getDividendsList();
    };

    render() {
        const {
            pageData,
            selectedRowKeys,
            dataSource        } = this.state;
        const { loading, params } = this.props;
        const rowSelection = {
            selectedRowKeys,
            onChange: this._onSelectChange
        };

        return (


            <div className={styles.filter}>
                <Form
                    name="basic"
                    onFinish={this._onFinish}
                    ref={this.formRef}
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    autoComplete="off"
                >
                    <Row gutter={[8, 0]}>
                        <Col span={20}>
                            <Row>

                                {!params.productId && (
                                    <Col span={8}>
                                        <MultipleSelect
                                            params="productIdList"
                                            value="productId"
                                            label="productName"
                                            mode="multiple"
                                            formLabel="产品名称"
                                        />
                                    </Col>
                                )}

                                <Col span={8}>
                                    <FormItem label="分红确认日" name="confirmDate">
                                        <DatePicker style={{ width: '100%' }} />
                                    </FormItem>
                                </Col>

                                <Col span={8}>
                                    <FormItem label="分红类型" name="dividendType">
                                        <Select placeholder="请选择" allowClear>
                                            {XWDividendType.map((item, index) => {
                                                return (
                                                    <Option key={index} value={item.value}>
                                                        {item.label}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </FormItem>
                                </Col>

                            </Row>
                        </Col>

                        <Col span={4} className={styles.btnGroup}>
                            <Button type="primary" htmlType="submit">
                                查询
                            </Button>
                            <Button onClick={this._reset}>重置</Button>
                        </Col>
                    </Row>
                </Form>
                <MXTable
                    loading={loading}
                    // rowSelection={rowSelection}
                    columns={this.columns}
                    dataSource={dataSource.list}
                    rowKey="dividendRecordId"
                    scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                    sticky
                    total={dataSource.total}
                    pageNum={pageData.pageNum}
                    onChange={this._tableChange}
                />
            </div>

        );
    }
}
export default connect(({ DIVIDENDS_LIST, loading }) => ({
    DIVIDENDS_LIST,
    loading: loading.effects['DIVIDENDS_LIST/StatisticsList']
}))(DividendStatistics);

DividendStatistics.defaultProps = {
    params: {}
};
