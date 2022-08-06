import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Row, Col, Input, Select, Button, notification, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import MXTable from '@/pages/components/MXTable';
import { getCookie, fileExport } from '@/utils/utils';
import _styles from './styles.less';
import { useEffect } from 'react';

const { Option } = Select;

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

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


function ConfirmationDocument(props) {

    const columns = [
        {
            title: '客户姓名',
            dataIndex: 'customerName',
            // align:'center',
            width: 210,
            render(data, p) {
                return (
                    <a onClick={()=>toCustomerDetail(p)}>
                        {data}
                    </a>
                ) || '--';
            }
        },
        {
            title: '客户身份证',
            dataIndex: 'cardNumber',
            align: 'center',
            width: 320,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '阅读状态',
            dataIndex: 'confirmType',
            width: 120,
            align: 'center',
            render(data) {
                return data?'已确认':'未确认';
            }
        },
        {
            title: '阅读时间',
            dataIndex: 'readTime',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '确认已阅读时间',
            dataIndex: 'createTime',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        }
        // {
        //     title:'操作',
        //     align:'center',
        //     width:140,
        //     render(data){
        //         if(!authEdit){
        //             return null;
        //         }
        //         return <div className={_styles.operationBox}>
        //             <span onClick={() => editClick(data.onlineServiceId)}>编辑</span>
        //             <Popconfirm
        //                 placement="topLeft"
        //                 title={'您确定删除该条数据吗？'}
        //                 onConfirm={() => deleteQuestionDetail(data.onlineServiceId)}
        //             >
        //                 <span>删除</span>
        //             </Popconfirm>
        //         </div>;

        //     }
        // }
    ];

    const confirmInformation = sessionStorage.getItem('confirmInformation') || '{}';
    const confirmInformationData = JSON.parse(confirmInformation);

    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [dataSource, setDataSource] = useState({}); // 表格数据
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 当前选中数据

    const [form] = Form.useForm();

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys)=>setSelectedRowKeys(selectedRowKeys)
    };


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

    // 分页排序等
    const _tableChange = (p, e, s) => {
        setPageData({
            ...pageData,
            pageNum:p.current,
            pageSize:p.pageSize
        });
    };

    const onFinish = () => {
        setPageData(initPageData);
        tableSearch();
    };

    // 跳转客户详情
    const toCustomerDetail = (data) => {
        history.push(`/investor/customerInfo/investordetails/${data.customerId}`);
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
     * @description 批量下载
     */
    const _batchDownload = () => {
        const { match } = props;
        const { params = {} } = match || {};
        fileExport({
            method: 'post',
            url: '/contraintNotice/allExport',
            data: {
                exportAll:false,
                contraintNoticeId: params.id,
                applyIds:selectedRowKeys
            },
            callback: ({ status, message ='导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    };

    // 导出全部
    const _downloadAll = () => {
        const { match } = props;
        const { params = {} } = match || {};
        const formData = form.getFieldsValue();
        fileExport({
            method: 'post',
            url: '/contraintNotice/allExport',
            data: {
                ...formData,
                exportAll:true,
                contraintNoticeId: params.id
            },
            callback: ({ status, message ='导出失败！' }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', message);
                }
            }
        });
    };

    useEffect(() => {
        tableSearch();
    }, [pageData]);

    return <PageHeaderWrapper title="强制确认文件">
        <GridContent>
            <Card>
                <div className={_styles.confirmationDocument}>
                    <h1>{confirmInformationData.noticeName || '--'}</h1>
                    <div className={_styles.documentTips}>
                        <p>强制阅读{confirmInformationData.readTime || '--'}s</p>
                        <p>已确认{confirmInformationData.confirmCount || '--'}人</p>
                        <p>未确认{confirmInformationData.noConfirmCount || '--'}人</p>
                    </div>
                    <Form {...layout} form={form} onFinish={onFinish}>
                        <Row gutter={24} >
                            <Col span={6}>
                                <Form.Item label="客户名称:" name="customerName">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item label="客户身份证:" name="cardNumber">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={6} className={_styles.questionType}>
                                <Form.Item label="确认状态:" name="confirmType">
                                    <Select placeholder="请选择"
                                        allowClear
                                    >
                                        <Option value={0}>未确认</Option>
                                        <Option value={1}>已确认</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={6}
                                className={_styles.btns}
                            >
                                <Button type="primary" htmlType="submit" >
                                            查询
                                </Button>
                                <Button htmlType="button" className={_styles.resetBtn} onClick={onReset}>
                                    重置
                                </Button>

                            </Col>
                        </Row>
                    </Form>
                    <div>
                        <div>
                            <Dropdown
                                overlay={<Menu>
                                    <Menu.Item
                                        key="1"
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={_batchDownload}
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
                                <Button >
                                        &nbsp;&nbsp;批量导出
                                    <DownOutlined />
                                </Button>
                            </Dropdown>
                        </div>
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
                </div>
            </Card>
        </GridContent>

    </PageHeaderWrapper>;

}

export default connect(({ loading }) => ({
    loading:loading.effects['confirmAnnouncementSettings/queryNoticeDetail']
}))(ConfirmationDocument);
