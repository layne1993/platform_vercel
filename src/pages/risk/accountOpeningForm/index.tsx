/*
 * @Author: your name
 * @Date: 2021-08-11 18:59:04
 * @LastEditTime: 2021-09-08 13:57:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\risk\AccountOpeningForm\index.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Card, Modal, Button, Space, Form, notification, Row, Col, Input, Select, Dropdown, Menu, Tooltip} from 'antd';
import MXTable from '@/pages/components/MXTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {XWCertificatesType} from  '@/utils/publicData';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import { isEmpty } from 'lodash';
import {fileExport } from '@/utils/utils';
import moment from 'moment';
import {Link} from 'umi';
import {
    DownOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import _styles from './index.less';
const DATE_FORMAT = 'YYYY-MM-DD';
const layout = {
    labelCol: { span: 24 },
    wrapperCol: { span: 24 }
};
const { Option } = Select;
const initPageData = {
    pageNum: 1,
    pageSize: 20
};


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const AccountOpeningForm = (props) => {
    const { dispatch } = props;
    const [dataSource, setDataSource] = useState<any>({}); // 表格数据
    const [form] = Form.useForm();
    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 当前选中数据

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys)=>setSelectedRowKeys(selectedRowKeys)
    };



    const columns = [
        {
            title: '投资者账号',
            dataIndex: 'customerAccount',
            width: 150,
            // fixed: 'left',
            render: (val)=> val || '--'
        },
        {
            title: '投资者名称',
            dataIndex: 'customerName',
            width: 100,
            // fixed: 'left',
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '投资者类型',
            dataIndex: 'customerType',
            width: 100,
            render(data) {
                // if (data === 1) return '个人';
                // if (data === 2) return '机构';
                // if (data === 3) return '产品';
                return data || '--';
            }
        },
        {
            title: '有效证件类型',
            dataIndex: 'cardType',
            width: 150,
            render: (val) => {
                let obj = XWCertificatesType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '其他证件类型',
            dataIndex: 'otherCardType',
            width: 150,
            render: (val) => {
                let obj = XWCertificatesType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '有效证件号码',
            dataIndex: 'cardNumber',
            width: 120,
            render: (txt) => txt ? txt : '--'
        },
        {
            title: '手机号',
            dataIndex: 'mobile',
            width: 100,
            render: (txt) => txt ?txt : '--'
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            width: 100,
            render: (txt) => txt ? txt : '--'
        },
        {
            title: '状态',
            dataIndex: 'forbidden',
            width: 100,
            render: (txt) => txt ===0 && '启用' || txt===1 && '禁用' || '--'
        },
        {
            title: '产品S码',
            dataIndex: 'fundRecordNumber',
            width: 100,
            render: (txt) => txt ? txt : '--'
        },
        {
            title:<Tooltip title="认申购时间 = MAX（投资者持有所有产品，最后【认购、申购、非交易过户转入】交易类型的时间）">
                认/申赎时间
                <QuestionCircleOutlined />
            </Tooltip>,
            dataIndex: 'tradeApplyTime',
            width: 200,
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--'
        },
        {
            title: '操作',
            width: 100,
            render(_, data) {
                return (
                    <div>
                        <Link to={`/investor/customerInfo/investordetails/${data.customerId}`}>编辑</Link>
                    </div>
                );
            }
        }

    ];




    // 获取表格数据
    const tableSearch = () => {
        const { dispatch, match } = props;
        const values = form.getFieldsValue();
        const {updateDate} = values;
        dispatch({
            type:'risk/investorSuitableList',
            payload:{
                ...values,
                tradeApplyTimeStart:updateDate&& updateDate[0],
                tradeApplyTimeEnd:updateDate&& updateDate[1],
                ...pageData
            },
            callback:(res)=>{
                if(res){
                    const { list = [], total } = res || {};
                    setDataSource({
                        list, total
                    });
                }else{
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '获取数据失败!'}`, 'topRight');
                }
            }
        });
    };

    const onFinish = () => {
        setPageData(initPageData);
        tableSearch();
    };

    // 重置
    const onReset = () => {
        form.setFieldsValue({
            productIds:undefined,
            customerIds:undefined,
            updateDate:undefined,
            isExportMobile:undefined

        });
        tableSearch();
    };

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        const pageData = {
            pageNum: p.current,
            pageSize: p.pageSize
        };
        setPageData(pageData);
        setSelectedRowKeys([]);
    };
    const formRef = React.createRef();
    // 导出全部
    const _downloadAll = (mode) => {
        const values = form.getFieldsValue();
        const {isExportMobile} = values;
        fileExport({
            method: 'post',
            url: '/customer/exportInvestorSuitable',
            data: {
                customerIds:mode===0 &&selectedRowKeys || undefined,
                mode,
                investorSuitableListReq:{
                    isExportMobile
                }
            },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    };

    useEffect(() => {
        tableSearch();
    }, [pageData]);



    return (
        <PageHeaderWrapper title="基协投资者账号自动导出">
            <Card>
                <div className={_styles.AccountOpeningForm}>
                    <Form {...layout} form={form} ref={formRef} onFinish={onFinish}>
                        <Row gutter={24}>
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

                                <MultipleSelect
                                    params="customerIds"
                                    value="customerId"
                                    mode="multiple"
                                    label="customerName"
                                    type={2}
                                    formLabel="投资者名称"
                                />
                            </Col>
                            <Col span={6}>
                                <CustomRangePicker assignment={formRef} label={'认申购确认时间'} name="updateDate" />
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isExportMobile" label="是否导出手机号">
                                    <Select placeholder="请选择">
                                        <Option value={1}>是</Option>
                                        <Option value={0}>否</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6} offset={18}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
                                        查询
                                    </Button>
                                    <Button htmlType="button" onClick={onReset}>
                                        重置
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <Row>
                        <Col span={4}>
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={()=>_downloadAll(0)}
                                    >
                                导出选中
                                    </Menu.Item>
                                    <Menu.Item
                                        key="0"
                                        onClick={()=>_downloadAll(1)}
                                    >
                                导出全部
                                    </Menu.Item>
                                </Menu>}
                            >
                                <Button type="primary">
                                    &nbsp;&nbsp;批量导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </Col>
                        <Col span={18}>
                        导出时不会导出认申购时间，如需批量维护代销客户邮箱，<Link to={'/investor/customerInfo'}>点击前往客户列表，先筛选渠道，再使用批量维护功能</Link>
                        </Col>
                    </Row>

                    <MXTable
                        loading={Boolean(props.loading)}
                        columns={columns}
                        dataSource={dataSource.list || []}
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        scroll={{ x: '100%' }}
                        sticky
                        onChange={(p, e, s) => _tableChange(p, e, s)}
                        rowSelection={rowSelection}
                        rowKey="customerId"
                    />
                </div>
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ risk, loading }) => ({
    loading:loading.effects['risk/investorSuitableList']
}))(AccountOpeningForm);
