/*
 * @Author: your name
 * @Date: 2021-08-11 18:59:04
 * @LastEditTime: 2021-08-18 17:52:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\src\pages\risk\situationChecklist\index.tsx
 */
import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Card, Modal, Button, Space, Form, notification, Row, Col, Input, Select, Dropdown, Menu} from 'antd';
import MXTable from '@/pages/components/MXTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {XWCertificatesType} from  '@/utils/publicData';
import { MultipleSelect, CustomRangePicker } from '@/pages/components/Customize';
import { isEmpty } from 'lodash';
import { getRandomKey, dataMasking, fileExport } from '@/utils/utils';
import moment from 'moment';
import {Link} from 'umi';
import {
    DownOutlined
} from '@ant-design/icons';
import _styles from './index.less';
const DATE_FORMAT = 'YYYY-MM-DD HH:mm';
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


const SituationChecklist = (props) => {
    const { dispatch } = props;
    const [dataSource, setDataSource] = useState<any>({}); // 表格数据
    const [form] = Form.useForm();
    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    // 保存所有客户列表
    const [customerList, setCustomerList] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 当前选中数据

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys)=>setSelectedRowKeys(selectedRowKeys)
    };



    const columns = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            width: 150,
            // fixed: 'left',
            render: (val, record) => <Link to={`/product/list/details/${record.productId}`}>{val}</Link> || '--'
        },
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 100,
            // fixed: 'left',
            render: (val, record) => <Link to={`/investor/customerInfo/investordetails/${record.customerId}`}>{val}</Link> || '--'
        },
        {
            title: '认/申购时间',
            dataIndex: 'updateTime',
            width: 200,
            render: (val) => val ? moment(val).format(DATE_FORMAT) : '--'
        },
        {
            title: '合格投资者承诺函',
            dataIndex: 'updateTime1',
            width: 200,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '投资者信息表',
            dataIndex: 'updateTime1',
            width: 200,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '投资者身份证明类型',
            dataIndex: 'cardType',
            width: 80,
            render: (val) => {
                let obj = XWCertificatesType.find((item) => {
                    return item.value === val;
                });
                return (obj && obj.label) || '--';
            }
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 200,
            render: (txt) => txt ? dataMasking(txt) : '--'
        },
        {
            title: '投资者资产证明',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '投资经验证明',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '基金评级',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '投资者分类',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '普通投资者特别提示',
            dataIndex: 'updateTime12',
            width: 200,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '投资者分级(风险测评)',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '适当性匹配',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val || '--'
        },
        {
            title: '不匹配通知及警示',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '购买R5产品特别提示',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '风险揭示书',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        },
        {
            title: '销售回访',
            dataIndex: 'updateTime12',
            width: 100,
            render: (val) => val===1 ? '有' : '无'
        }
    ];


    // 获取表格数据
    const tableSearch = () => {
        const { dispatch, match } = props;
        const { params = {} } = match || {};
        const values = form.getFieldsValue();
        dispatch({
            type:'confirmAnnouncementSettings/queryNoticeDetail',
            payload:{
                ...values,
                ...pageData,
                contraintNoticeId: params.id
            },
            callback:(res)=>{
                if(res.code === 1008){
                    const { list = [], total } = res.data || {};
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
            customerName:'',
            cardNumber: '',
            confirmType: null
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
    const _downloadAll = () => {
        // const { pageData, sortFiled, sortType, searchParams, enableStatistic } = this.state;
        const { productId } = props;
        const tempObj = {};
        // if (!!sortType) {
        // tempObj.sortFiled = sortFiled;
        // tempObj.sortType = sortType;
        // }

        fileExport({
            method: 'post',
            url: '/net/allExport',
            data: {
                productId: productId ? Number(productId) : undefined,
                // pageNum: pageData.current || 1,
                // pageSize: pageData.pageSize || 20,
                // enableStatistic,
                ...tempObj
                // ...searchParams
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



    return (
        <PageHeaderWrapper title="投资者协会账号开通表">
            <Card>
                <div className={_styles.SituationChecklist}>
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
                                    params="customerId"
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
                                <Form.Item name="isCommitmentLetter" label={'合格投资者承诺函有无'}>
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isCommitmentLetter" label={'投资者信息表有无'}>
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="ProofType" label="投资者身份证明类型">
                                    <Select  allowClear placeholder="请选择">
                                        {
                                            XWCertificatesType.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="证件号码" name="cardNumber">
                                    <Input allowClear placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isAssetCertificate" label="投资者资产证明有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isInvestmentExperience" label="投资经验证明有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isHotTip" label="普通投资者特别提示有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isAppropriateness" label="适当性匹配">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isMismatchAlert" label="不匹配通知及警示有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="R5HotTip" label="购买R5产品特别提示有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isRiskDisclosure" label="风险揭示书有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item name="isSalesReturnVisit" label="销售回访有无">
                                    <Select placeholder="请选择">
                                        <Option value={1}>有</Option>
                                        <Option value={0}>无</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6} >
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
                    <Dropdown
                        overlay={<Menu>
                            <Menu.Item
                                key="1"
                                disabled={selectedRowKeys.length === 0}
                                onClick={_downloadAll}
                            >
                                导出选中
                            </Menu.Item>
                            <Menu.Item
                                key="0"
                                onClick={_downloadAll}
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

export default connect(({ SituationChecklist, loading }) => ({
    loading:loading.effects['SituationChecklist/queryNoticeDetail']
}))(SituationChecklist);
