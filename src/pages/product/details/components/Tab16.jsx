import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Row, Col, Select, Input, Button, notification, Popconfirm, Modal } from 'antd';
import moment from 'moment';
import { PlusOutlined, ExclamationCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import { getPermission, listToMap } from '@/utils/utils';
import { accountTypeList } from '@/utils/publicData';
import AccountNewBuild from './accountNewBuild';
import _styles from './styles/Tab16.less';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

const initPageData = {
    pageNum:1,
    pageSize:20
};

const { Option } = Select;
const { confirm } = Modal;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

function Tab16(props){

    const { params, authEdit } = props;

    const [form] = Form.useForm();
    const [accountForm] = Form.useForm();
    const [dataSource, setDataSource] = useState({}); // 表格数据
    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [editVisible, setEditVisible] = useState(false); // 新建修改框
    const [accountId, setAccountId] = useState(''); // 问题详情数据id

    // 编辑数据
    const editClick = (id) => {
        setAccountId(id);
        setEditVisible(true);
    };

    // 获取表格数据
    const tableSearch = () => {
        const { dispatch } = props;
        const values = form.getFieldsValue();
        dispatch({
            type:'productDetails/getProductAccountList',
            payload:{
                ...values,
                ...pageData,
                productId:params.productId
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

    // 删除表格数据
    const deleteQuestionDetail = (id, callback = null) => {
        const { dispatch } = props;
        dispatch({
            type:'productDetails/deleteProductAccountList',
            payload:{
                accountId:id
            },
            callback:(res)=>{
                if(res.code === 1008){
                    openNotification('success', '提示', '删除成功');
                    tableSearch(); // 更新数据
                    if(callback) callback();
                }else{
                    openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '删除失败！'}`, 'topRight');
                }
            }
        });
    };

    const columns = [
        {
            title:'账户类型',
            dataIndex:'type',
            // align:'center',
            width:140,
            render(data){
                return data && listToMap(accountTypeList)[data] || '--';
            }
        },
        {
            title:'开具机构',
            dataIndex:'openOrganization',
            align:'center',
            width:140,
            render(data){
                return data || '--';
            }
        },
        {
            title:'资金账户',
            dataIndex:'account',
            align:'center',
            width:140,
            render(data){
                return data || '--';
            }
        },

        {
            title:'开具时间',
            dataIndex:'openTime',
            align:'center',
            width:140,
            render(data){
                return data && moment(data).format('YYYY-MM-DD') || '--';
            }
        },
        {
            title:'开具人',
            dataIndex:'openUserName',
            align:'center',
            width:140,
            render(data){
                return data || '--';
            }
        },
        {
            title:'详细营业部',
            dataIndex:'salesDepartment',
            width:120,
            align:'center',
            render(data){
                return data || '--';
            }
        },
        {
            title:'备注',
            dataIndex:'description',
            width:120,
            align:'center',
            render(data){
                return data || '--';
            }
        },
        {
            title:'操作',
            align:'center',
            width:140,
            render(data){
                if(!authEdit){
                    return null;
                }
                return <div className={_styles.operationBox}>
                    <span onClick={() => editClick(data.accountId)}>编辑</span>
                    <Popconfirm
                        placement="topLeft"
                        title={'您确定删除该条数据吗？'}
                        onConfirm={() => deleteQuestionDetail(data.accountId)}
                    >
                        <span>删除</span>
                    </Popconfirm>
                </div>;

            }
        }
    ];

    // 新建数据
    const newBuildClick = () => {
        setAccountId('');
        setEditVisible(true);
    };

    // 分页排序等
    const _tableChange = (p, e, s) => {
        setPageData({
            ...pageData,
            pageNum:p.current,
            pageSize:p.pageSize
        });
    };

    // 条件查询
    const onFinish = (values) => {
        tableSearch();
    };

    // 证券获取详情
    const getAccountDetail = () => {
        const { dispatch } = props;
        dispatch({
            type: 'productDetails/getSecuritiesAccountList',
            payload: { productId:params.productId },
            callback: (res) => {
                if (res.code === 1008) {
                    const { data = {} } = res;
                    accountForm.setFieldsValue({
                        ...data
                    });
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        `${res.message ? res.message : '获取数据失败!'}`,
                        'topRight',
                    );
                }
            }
        });
    };

    // 证券保存
    const onAccountFinish = () => {
        const { validateFields } = accountForm;
        validateFields().then((values) => {
            const { dispatch } = props;
            dispatch({
                type: 'productDetails/setSecuritiesAccountList',
                payload: {
                    ...values,
                    productId:params.productId
                },
                callback: (res) => {
                    const { code = '', message = '' } = res;
                    if (code === 1008) {
                        openNotification('success', '提示', '保存成功');
                    } else {
                        openNotification(
                            'warning',
                            `提示（代码：${code}）`,
                            `${message ? message : '保存失败！'}`,
                            'topRight',
                        );
                    }
                }
            });
        });
    };

    // 重置
    const onReset = () => {
        form.setFieldsValue({
            type:[],
            openOrganization: '',
            account:''
        });
        tableSearch();
    };

    useEffect(()=>{
        tableSearch();
    }, [pageData]);

    useEffect(() => {
        getAccountDetail();
    }, []);

    return <div className={_styles.Tab16}>
        <h3>证券账户信息</h3>
        <Form {...layout} form={accountForm} onFinish={onAccountFinish}>
            <Row gutter={24} >
                <Col span={10}>
                    <Form.Item label="配售对象证券账户号（沪市）:"
                        name="shanghaiStockExchangeAccount"
                        rules={[{ required: 'true' }]}
                        labelCol={{ span:12 }}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={10} >
                    <Form.Item label="配售对象证券账户号（深市）:"
                        name="shenzhenStockExchangeAccount"
                        rules={[{ required: 'true' }]}
                        labelCol={{ span:12 }}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <div className={_styles.btns}>
                        {authEdit &&
                            <Button htmlType="submit"
                                className={_styles.raestBtn}
                                type="primary"
                                loading={Boolean(props.loadingSaveAcount)}
                            >
                            保存
                            </Button>
                        }
                    </div>
                </Col>
            </Row>
        </Form>

        <h3>其他账户信息</h3>
        <Form {...layout} form={form} onFinish={onFinish}>
            <Row gutter={24} >
                <Col span={6}>
                    <Form.Item label="账户类型:" name="type">
                        <Select placeholder="请选择" allowClear  mode="multiple">
                            {
                                accountTypeList.map((item)=><Option value={item.value} key={item.value} >
                                    {item.label}
                                </Option>)
                            }
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="开具机构:" name="openOrganization">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="资金账户:" name="account">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <div className={_styles.btns}>
                        <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
                  查询
                        </Button>
                        <Button htmlType="button" className={_styles.raestBtn} onClick={onReset}>
                  重置
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
        <div>
            {
                !!authEdit && <div>
                    <Button type="primary" style={{marginRight:'5px'}} icon={<PlusOutlined />} onClick={newBuildClick}>新建</Button>
                </div>
            }
            <MXTable
                loading={Boolean(props.loading)}
                columns={columns}
                dataSource={dataSource.list || []}
                total={dataSource.total}
                pageNum={pageData.pageNum}
                scroll={{x: '100%'}}
                sticky
                onChange={(p, e, s) => _tableChange(p, e, s)}
                rowSelection={null}
            />
        </div>
        {
            editVisible &&
            <AccountNewBuild
                visible={editVisible}
                setVisible={setEditVisible}
                tableSearch={tableSearch}
                accountId={accountId}
                productId={params.productId}
            />
        }
    </div>;
}

export default connect(({ consulteQuestion, loading })=>({
    consulteQuestion,
    loading: loading.effects['productDetails/getProductAccountList'],
    loadingSaveAcount:loading.effects['productDetails/setSecuritiesAccountList']
}))(Tab16);
