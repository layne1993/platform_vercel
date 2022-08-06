/*
 * @description: 风控信息列表
 * @Author: tangsc
 * @Date: 2020-11-02 17:51:03
 */
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { Button, Row, Col, Form, Select, Input, DatePicker, notification, Modal } from 'antd';
import {
    warningStatusList,
    warningTypeList
} from '@/utils/publicData';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './index.less';
import { getRandomKey, isNumber } from '@/utils/utils';
import moment from 'moment';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import MXTable from '@/pages/components/MXTable';

// 设置日期格式
const dateFormat = 'YYYY/MM/DD';


const FormItem = Form.Item;
const { Option } = Select;
const { confirm } = Modal;


// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
@connect(({ riskControlList, loading }) => ({
    riskControlList,
    loading: loading.effects['riskControlList/getRiskControlInfo']
}))
class RiskControlList extends PureComponent {
    state = {
        selectedRowKeys: [], // 选中table行的key值
        pageData: {
            // 当前的分页数据
            current: 1,
            pageSize: 20
        },
        searchParams: {},              // 查询参数
        sortFiled: '',                 // 排序字段
        sortType: '',                  // 排序类型：asc-升序；desc-降序
        riskInfoList: []               // 风控列表
    };


    componentDidMount() {
        this._search();
        // this._setColums();
    }

    // 表单实例对象
    formRef = React.createRef();

    // Table的列
    columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 120,
            fixed: 'left',
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预警线',
            dataIndex: 'warnLine',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '止损线',
            dataIndex: 'stopLine',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '预警提示线',
            dataIndex: 'warnLineAlarmValve',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '止损提示线',
            dataIndex: 'stopLineAlarmValve',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '警示类型',
            dataIndex: 'warningType',
            width: 100,
            render: (val) => {
                let obj = warningTypeList.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '警示状态',
            dataIndex: 'warningStatus',
            width: 100,
            render: (val) => {
                let obj = warningStatusList.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '警示开始时间',
            dataIndex: 'warningStart',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '警示净值',
            dataIndex: 'warningNetValue',
            width: 100,
            render: (val) => <span>{val || '--'}</span>
        },
        {
            title: '警示结束时间',
            dataIndex: 'warningEnd',
            width: 120,
            render: (val) => <span>{val && moment(val).format(dateFormat) || '--'}</span>
        },
        {
            title: '警示停留时间',
            dataIndex: 'warningStandingTime',
            width: 120,
            render: (val) => {
                if (isNumber(val)) {
                    return <span>{`${val}天`}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        },
        {
            title: '操作',
            dataIndex: 'operate',
            // fixed: 'right',
            width: 80,
            render: (text, record) => {
                return (
                    <div>
                        {
                            this.props.authEdit &&
                            <span className="details" onClick={() => this._handleDelete(record)}>删除</span>
                        }
                    </div>
                );
            }
        }
    ];

    /**
     * @description: 设置表头列
     * @param {*}
     */
    // _setColums = () => {
    //     const { productId } = this.props;
    //     if (!productId) {
    //         this.columns.unshift(
    //             {
    //                 title: '产品名称',
    //                 dataIndex: 'productName',
    //                 width: 120,
    //                 fixed: 'left',
    //                 render: (val) => <span>{val || '--'}</span>
    //             });
    //     }
    // }

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    _onFinish = (values) => {
        const { warningTime, ...params } = values;
        const tempObj = {};
        // 转换成时间戳
        tempObj.startTime = (warningTime && new Date(moment(warningTime[0]).format()).getTime()) || undefined;
        tempObj.endTime = (warningTime && new Date(moment(warningTime[1]).format()).getTime()) || undefined;
        this.setState({
            searchParams: {
                ...params,
                ...tempObj
            },
            selectedRowKeys:[],
            pageData: {
                // 当前的分页数据
                current: 1
                // pageSize: 20
            }
        }, () => {
            this._search();
        });
    };


    /**
     * @description: 列表查询
     */
    _search = () => {

        const { pageData, sortFiled, sortType, searchParams } = this.state;
        const { dispatch } = this.props;
        const tempObj = {};
        if (!!sortType) {
            tempObj.sortFiled = sortFiled;
            tempObj.sortType = sortType;
        }

        dispatch({
            type: 'riskControlList/getRiskControlInfo',
            payload: {
                pageNum: pageData.current || 1,
                pageSize: pageData.pageSize || 20,
                ...tempObj,
                ...searchParams
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        riskInfoList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        riskInfoList: []
                    });
                }
            }
        });
    }

    /**
     * @description:重置过滤条件
     */
    _reset = () => {
        this.formRef.current.resetFields();
        this.setState({
            searchParams: {},
            selectedRowKeys:[]
        }, () => {
            this._search();
        });
    };

    // /**
    //  * @description: Table的CheckBox change事件
    //  * @param {Array} selectedRowKeys
    //  */
    // _onSelectChange = (selectedRowKeys) => {
    //     this.setState({
    //         selectedRowKeys
    //     });
    // };

    /**
     * @description: 表格变化
     */
    _tableChange = (p, e, s) => {
        this.setState({
            sortFiled: s.field,
            sortType: !!s.order ? s.order === 'ascend' ? 'asc' : 'desc' : undefined,
            pageData: {
                current: p.current,
                pageSize: p.pageSize
            }
        }, () => {
            this._search();
        });
    }


    /**
     * @description: 删除风控信息
     */
    _handleDelete = (record) => {
        const { dispatch } = this.props;
        // const { selectedRowKeys } = this.state;
        const _this = this;
        confirm({
            title: '请您确认是否删除此条风控信息?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'riskControlList/deleteRiskControlInfo',
                    payload: {
                        riskInfoId: record.riskInfoId
                    },
                    callback: (res) => {
                        if (res.code === 1008) {
                            openNotification('success', '提示', '删除成功', 'topRight');
                            _this._search();
                            // let selectArr = selectedRowKeys.filter((item) => {
                            //     return item !== record.productNetvalueId;
                            // });
                            // _this.setState({
                            //     selectedRowKeys: selectArr
                            // });
                        } else {
                            const warningText = res.message || res.data || '删除失败！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }

    render() {
        const { pageData, selectedRowKeys, riskInfoList } = this.state;
        const { loading } = this.props;
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this._onSelectChange
        // };

        return (
            <div className={styles.container}>
                <div className={styles.filter}>
                    <Form name="basic" onFinish={this._onFinish} ref={this.formRef}>
                        <Row gutter={[8, 0]}>
                            <Col span={6}>
                                <MultipleSelect
                                    params="productIds"
                                    value="productId"
                                    label="productName"
                                    mode="multiple"
                                    formLabel="产品名称"
                                />
                            </Col>
                            <Col span={6}>
                                <FormItem label="警示类型" name="warningType">
                                    <Select placeholder="请选择"  allowClear>
                                        {
                                            warningTypeList.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>
                            </Col>

                            <Col span={8}>
                                <CustomRangePicker assignment={this.formRef} name="warningTime" label="警示时间" />
                                {/* <FormItem label="警示时间" name="warningTime">
                                    <RangePicker style={{ width: '100%' }} format={dateFormat} />
                                </FormItem> */}
                            </Col>
                            <Col span={4} className={styles.btnGroup}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button onClick={this._reset}>重置</Button>
                            </Col>
                        </Row>
                    </Form>
                </div>
                <div className={styles.dataTable}>
                    <MXTable
                        loading={loading}
                        columns={this.columns}
                        dataSource={riskInfoList && riskInfoList.list}
                        total={riskInfoList && riskInfoList.total}
                        pageNum={pageData.current}
                        rowKey={(record) => record.riskInfoId}
                        onChange={(p, e, s) => this._tableChange(p, e, s)}
                        rowSelection={null}
                        scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
                        sticky
                    />
                </div>
            </div>
        );
    }
}
export default RiskControlList;
