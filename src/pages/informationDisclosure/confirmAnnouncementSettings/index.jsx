import React, { useState } from 'react';
import { connect, history } from 'umi';
import { Card, Form, Row, Col, Input, Select, Button, notification, Popconfirm } from 'antd';
import { PageHeaderWrapper, GridContent } from '@ant-design/pro-layout';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import AddNew from './addNew';
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

const isDeleteMap = {
    0: '有效',
    1: '无效'
};

const noticePersonMap = {
    1: '所有人',
    2: '特定对象'
};

const noticeTypMap = {
    1: '文字公告',
    2: '文件公告'
};

function ConfirmationDocument(props) {

    const columns = [
        {
            title: '公告名称',
            dataIndex: 'noticeName',
            // align:'center',
            width: 210,
            render(data) {
                return data || '--';
            }
        },
        {
            title: '生效状态',
            dataIndex: 'isDelete',
            align: 'center',
            width: 320,
            render(data) {
                return data && isDeleteMap[data] || '有效';
            }
        },
        {
            title: '公告类型',
            dataIndex: 'noticeType',
            width: 120,
            align: 'center',
            render(data) {
                return data && noticeTypMap[data] || '--';
            }
        },
        {
            title: '强制阅读时间',
            dataIndex: 'readTime',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '确认对象',
            dataIndex: 'noticePerson',
            width: 120,
            align: 'center',
            render(data) {
                return data && noticePersonMap[data] || '--';
            }
        },
        {
            title: '已确认',
            dataIndex: 'confirmCount',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '未确认',
            dataIndex: 'noConfirmCount',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title: '最近修改时间',
            dataIndex: 'updateTime',
            width: 120,
            align: 'center',
            render(data) {
                return data&& moment(data).format('YYYY-MM-DD')  || '--';
            }
        },
        {
            title: '修改人',
            dataIndex: 'operateUserName',
            width: 120,
            align: 'center',
            render(data) {
                return data || '--';
            }
        },
        {
            title:'操作',
            align:'center',
            width:200,
            render(data){
                // if(!authEdit){
                //     return null;
                // }
                return <div className={_styles.operationBox}>
                    <span onClick={() => goDetail(data)}>确认明细</span>
                    <span onClick={() => editClick(data)}>编辑</span>
                    <span onClick={() => updateNoticeStatus(data)}>
                        {data.isDelete?'设为有效':'设为无效'}
                    </span>
                </div>;

            }
        }
    ];
    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [dataSource, setDataSource] = useState({}); // 表格数据
    const [contraintNoticeId, setContraintNoticeId] = useState(null); // 点击编辑时id
    const [contraintNoticeData, setContraintNoticeData] = useState({}); // 设置类型
    const [editVisible, setEditVisible] = useState(false); // 编辑框展示

    const [form] = Form.useForm();


    // 获取表格数据
    const tableSearch = () => {
        const { dispatch } = props;
        const values = form.getFieldsValue();
        dispatch({
            type:'confirmAnnouncementSettings/getTableData',
            payload:{
                ...values,
                ...pageData
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

    // 重置
    const onReset = () => {
        form.setFieldsValue({
            noticeName:'',
            isDelete:null
        });
        tableSearch();
    };

    // 新建
    const newBuildClick = () => {
        setContraintNoticeId('');
        setContraintNoticeData({});
        setEditVisible(true);
    };

    // 跳转
    const goDetail = (data = {}) => {
        if(!data.contraintNoticeId) return;
        const str = JSON.stringify({
            noticeName: data.noticeName || '',
            readTime: data.readTime || 0,
            noConfirmCount: data.noConfirmCount || 0,
            confirmCount: data.confirmCount || 0
        });
        sessionStorage.setItem('confirmInformation', str);
        history.push(`/infoDisclosure/confirmAnnouncementSettings/confirmationDocument/${data.contraintNoticeId}`);
    };

    // 编辑
    const editClick = (data) => {
        setContraintNoticeId(data.contraintNoticeId);
        setContraintNoticeData(data);
        setEditVisible(true);
    };

    // 设置有无效
    const updateNoticeStatus = (data) => {
        const { dispatch } = props;
        dispatch({
            type:'confirmAnnouncementSettings/updateNoticeStatus',
            payload:{
                contraintNoticeId: data.contraintNoticeId,
                isDelete: Number(!data.isDelete)
            },
            callback:(res)=>{
                if(res.code === 1008){
                    tableSearch();
                }else{
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '设置失败!'}`, 'topRight');
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
                    <Form {...layout} form={form} onFinish={onFinish}>
                        <Row gutter={24} >
                            <Col span={6}>
                                <Form.Item label="公告名称:" name="noticeName">
                                    <Input placeholder="请输入" />
                                </Form.Item>
                            </Col>
                            <Col span={6} className={_styles.questionType}>
                                <Form.Item label="生效状态:" name="isDelete">
                                    <Select placeholder="请选择"
                                        allowClear
                                    >
                                        <Option value={0}>有效</Option>
                                        <Option value={1}>无效</Option>
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
                            <Button
                                type="primary"
                                onClick={newBuildClick}
                            >
                                新建强制确认公告
                            </Button>
                        </div>
                        <MXTable
                            loading={Boolean(props.loading) || Boolean(props.loadingSet)}
                            columns={columns}
                            dataSource={dataSource.list || []}
                            total={dataSource.total}
                            pageNum={pageData.pageNum}
                            scroll={{ x: '100%' }}
                            sticky
                            onChange={(p, e, s) => _tableChange(p, e, s)}
                            // rowSelection={rowSelection}
                            rowKey="onlineServiceId"
                        />
                    </div>
                    {
                        editVisible && (
                            <AddNew
                                visible={editVisible}
                                setVisible={setEditVisible}
                                tableSearch={tableSearch}
                                id={contraintNoticeId}
                                data={contraintNoticeData}
                            />
                        )

                    }
                </div>
            </Card>
        </GridContent>

    </PageHeaderWrapper>;

}

export default connect(({ loading }) => ({
    loading: loading.effects['confirmAnnouncementSettings/getTableData'],
    loadingSet: loading.effects['confirmAnnouncementSettings/updateNoticeStatus']
}))(ConfirmationDocument);
