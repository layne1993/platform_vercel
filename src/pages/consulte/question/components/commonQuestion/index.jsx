import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'umi';
import { Form, Row, Col, Select, Input, Button, notification, Popconfirm, Modal  } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import { getPermission, getCookie } from '@/utils/utils';
import SubjectModel from './subjectModel';
import EditModal from './edit';
import _styles from './styles.less';

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

const initPageData = {
    pageNum:1,
    pageSize:20
};

const contentTypeList = ['文本', '文件或图片'];

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

function CommonQuestion(props){

    const { consulteQuestion:{ questionTypes } } = props;
    const { authEdit } = getPermission('80100');

    const questionTypesMap = useMemo(()=>{
        const map = new Map();
        questionTypes.forEach((item)=>{
            map.set(item.codeValue, item.codeText);
        });
        return map;
    }, [questionTypes]);

    const columns = [
        {
            title:'问题',
            dataIndex:'problem',
            // align:'center',
            width:700,
            render(data){
                return data || '--';
            }
        },
        {
            title:'问题类型',
            dataIndex:'problemId',
            align:'center',
            width:420,
            render(data){
                return questionTypesMap.get(data) || '全部问题';
            }
        },
        {
            title:'内容类型',
            dataIndex:'contentType',
            width:120,
            align:'center',
            render(data){
                return contentTypeList[data] || '--';
            }
        },
        // {
        //   title:'关键字',
        //   dataIndex:'keywords',
        //   width:120,
        //   align:'center',
        //   render(data){
        //     return data || '--'
        //   }
        // },
        {
            title:'操作',
            align:'center',
            width:140,
            render(data){
                if(!authEdit){
                    return null;
                }
                return <div className={_styles.operationBox}>
                    <span onClick={() => editClick(data.onlineServiceId)}>编辑</span>
                    <Popconfirm
                        placement="topLeft"
                        title={'您确定删除该条数据吗？'}
                        onConfirm={() => deleteQuestionDetail(data.onlineServiceId)}
                    >
                        <span>删除</span>
                    </Popconfirm>
                </div>;

            }
        }
    ];

    const [form] = Form.useForm();
    const [dataSource, setDataSource] = useState({}); // 表格数据
    const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
    const [selectedRowKeys, setSelectRowKeys] = useState([]); // 当前选中的表格数据
    const [editVisible, setEditVisible] = useState(false); // 新建修改框
    const [questionDetailId, setQuestionDetailId] = useState(''); // 问题详情数据id
    const [batchUploadModalFlag, setBatchUploadModalFlag] = useState(false); // 批量上传展示

    const onSelectChange = (selectedRowKeys) => {
        setSelectRowKeys(selectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };

    // 新建数据
    const newBuildClick = () => {
        setQuestionDetailId('');
        setEditVisible(true);
    };

    // 编辑数据
    const editClick = (id) => {
        setQuestionDetailId(id);
        setEditVisible(true);
    };

    // 获取表格数据
    const tableSearch = () => {
        const { dispatch } = props;
        const values = form.getFieldsValue();
        dispatch({
            type:'consulteQuestion/getQuestionSettingTableData',
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


    // 删除表格数据
    const deleteQuestionDetail = (id, callback = null) => {
        const { dispatch } = props;
        dispatch({
            type:'consulteQuestion/deleteQuestionDetail',
            payload:{
                onlineServiceId:id
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

    // 批量删除
    const batchDelete = () => {
        confirm({
            title:'请您确定是否全部删除',
            icon: <ExclamationCircleOutlined />,
            content: '删除后该问题信息会删除',
            okText: '确认',
            cancelText: '取消',
            onOk:()=>{
                const ids = selectedRowKeys.join(',');
                deleteQuestionDetail(ids, ()=>setSelectRowKeys([]));
            }
        });
    };

    // 获取问题类型
    const getQuestionType = (callback = null) => {
        const { dispatch } = props;
        dispatch({
            type:'consulteQuestion/getQuestionType',
            payload:{},
            callback
        });
    };

    // 条件查询
    const onFinish = (values) => {
        setPageData(initPageData);
        tableSearch();
    };

    // 重置
    const onReset = () => {
        form.setFieldsValue({
            problem:'',
            problemId:null
        });
        tableSearch();
    };

    const closeModal = () => {
        setBatchUploadModalFlag(false);
        tableSearch();
    };

    useEffect(()=>{
        const { consulteQuestion:{ questionTypes } } = props;
        // 初次渲染表格
        tableSearch();
        // 存在问题类型缓存则取缓存
        if(!(Array.isArray(questionTypes) && questionTypes.length)){
            getQuestionType();
        }
    }, []);

    useEffect(()=>{
        tableSearch();
    }, [pageData]);

    return <div className={_styles.commonQuestion}>
        {batchUploadModalFlag && (
            <BatchUpload
                modalFlag={batchUploadModalFlag}
                closeModal={closeModal}
                templateMsg="披露规则模板下载"
                templateUrl={`/onlineService/import/template?tokenId=${getCookie(
                    'vipAdminToken',
                )}`}
                // params={{ productId: productId ? Number(productId) : undefined }}
                onOk={closeModal}
                url="/onlineService/import"
            />
        )}
        <Form {...layout} form={form} onFinish={onFinish}>
            <Row gutter={24} >
                <Col span={8}>
                    <Form.Item label="问题:" name="problem">
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>
                <Col span={8} className={_styles.questionType}>
                    <Form.Item label="问题类型:" name="problemId">
                        <Select placeholder="请选择"
                            showSearch
                            loading={Boolean(props.questionTypeLoading)}
                            allowClear
                            filterOption={(input, option) =>  option.children.indexOf(input) >= 0}
                        >
                            {
                                questionTypes.map((item)=><Option value={item.codeValue} key={item.codeValue} >
                                    {item.codeText}
                                </Option>)
                            }
                        </Select>
                    </Form.Item>
                    {
                        authEdit &&
                        <SubjectModel
                            getQuestionType={getQuestionType}
                        />
                    }
                </Col>
                {/* <Col span={8}>
          <Form.Item label="关键字:" name="keyword">
            <Select placeholder="请选择">
              <Option value="demo">demo</Option>
            </Select>
          </Form.Item>
        </Col> */}
            </Row>
            <Row gutter={24}>
                <Col span={24}>
                    <div className={_styles.btns}>
                        <Button type="primary" htmlType="submit" >
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
                    <Button
                        onClick={batchDelete}
                        style={{ marginLeft: '10px' }}
                    >
                        批量删除
                    </Button>
                    <Button
                        style={{ marginLeft: '10px' }}
                        onClick={() => setBatchUploadModalFlag(true)}
                        type="primary"
                    >
                        批量上传
                    </Button>
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
                rowSelection={rowSelection}
                rowKey="onlineServiceId"
            />
        </div>
        {
            editVisible &&
            <EditModal
                visible={editVisible}
                setVisible={setEditVisible}
                tableSearch={tableSearch}
                id={questionDetailId}
            />
        }
    </div>;
}

export default connect(({ consulteQuestion, loading })=>({
    consulteQuestion,
    loading:loading.effects['consulteQuestion/getQuestionSettingTableData'],
    questionTypeLoading:loading.effects['consulteQuestion/getQuestionType']
}))(CommonQuestion);
