import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Dropdown,Row,Col,Form,Modal,message ,Space,Menu,Popconfirm} from 'antd';
import moment from 'moment';

import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';
import { DownOutlined } from '@ant-design/icons';

import MXTable from '@/pages/components/MXTable';
import AddPersonModal from './components/AddPersonModal'
import InputPersonModal from './components/InputPersonModal'

import {
    getAllSeller,
    delSeller,
    exportSelect,
    exportSelectAll
} from './services'
import {exportFileBlob} from '@/utils/fileBlob'

import styles from './index.less';

const { confirm } = Modal;

const defaultSearch = {
    productName:'',
    createDate:'',
    valuationDate:'',
}

const Valuation: React.FC<{}> = (props) => {
    const [form] = Form.useForm();

    const [searchParams, setsearchParams] = useState<object>(defaultSearch);
    const [inputVisible, setinputVisible] = useState(false);
    const [visible, setvisible] = useState(false);
    const [addOrEdit, setaddOrEdit] = useState('add');
    const [loading, setloading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<any>([{name:12}]);
    const [total, settotal] = useState<number>(0);
    const [currentPeople, setCurrentPeople] = useState({});
    const [pageData, setpageData] = useState<any>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10,
        sortFiled:'',
        sortRule:''
    });
    const [selectedRowKeys, setselectedRowKeys] = useState<any>([]);

    const tableColumns = [
        {
            title: '销售人员姓名',
            dataIndex: 'salesmanName',
            align: 'center',
            width: 100
        },
        {
            title: '销售人员身份证',
            dataIndex: 'salesmanNum',
            align: 'center',
            // render: (text) => moment(text).format('YYYY-MM-DD'),
            width: 120
        },
        {
            title: '所属组织',
            dataIndex: 'organization',
            align: 'center',
            // render: (text,record) => (<div onClick={()=>onNameClick(record)} className={styles.tableBtn}>{text}</div>),
            width: 120
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            width: 100
        },
        {
            title: '最近修改时间',
            dataIndex: 'updateTime',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <div>{record.updateTime==null?"无":record.updateTime}</div>
            ),
        },
        {
            title: '最近修改人',
            dataIndex: 'updateBy',
            align: 'center',
            width: 100,
            render: (text, record) => (
                <div>{record.updateBy==null?"无":record.updateBy}</div>
            ),
        },
        {
          title: '操作',
          key: 'action',
          dataIndex: '',
          align: 'center',
          fixed:'right',
          width: 120,
          render: (text, record) => (
            <Space size="middle">
              <div className={styles.tableBtn} onClick={()=>onTableEdit(record)}>编辑</div>
              <Popconfirm title="是否确定删除该数据？" onConfirm={() => del(record)}>
                  <div className={styles.tableBtn} >删除</div>
			  </Popconfirm>
            </Space>
          ),
        },
    ];

    // 上传估值表
    const onAddPerson = ()=>{
        setaddOrEdit('add')
        setvisible(true)
        setCurrentPeople({})
    }

    // 批量导入
    const onInput =async ()=>{
        setinputVisible(true)
        // const res = await exportParseCatalogDataList({
        //     fileType:'product',
        //     exportIds:selectedRowKeys
        // })
        // exportFileBlob(res,'估值表数据文件.xls')
    }

    // 编辑
    const  onTableEdit =async (record)=>{
        setaddOrEdit('edit')
        setvisible(true)
        console.log(record);
        
        setCurrentPeople(record)
    }

    //编辑成功
    const editSuccess=(e)=>{
        setvisible(false)
        getAllSellPeople()
        if(e=='add'){
            message.success('新增成功');
        }else{
            message.success('编辑成功');
        }
    }

    // 导出估值表源文件
    const onExportSourceFile =async (e)=>{
        if(e =='select'){
            const res:any = await exportSelect(
                selectedRowKeys
             )
             exportFileBlob(res.data,'销售人员信息.xls')
        }else{
            const res:any = await exportSelectAll()
             exportFileBlob(res.data,'销售人员信息.xls')
        }
    }

    //批量上传成功后关闭弹窗
    const allSuccess = ()=>{
        console.log('2');
        
        setinputVisible(false);
    }

    // table 删除
    const onTableDel = async(record)=>{
        confirm({
            title:'',
            content:'确认删除吗?',
            onOk (){
                del(record)
            },
            onCancel(){
      
            }
        })
    }
    const del = async(record)=>{
        let post:any={}
        post.reportSalesmanId = record.reportSalesmanId
        setloading(true);
        const res:any = await delSeller(post);
        if (+res.code === 1001) {
            getAllSellPeople();
            message.success('删除成功');
        }else{
            message.success('删除失败');
        }
        setloading(false);
    }

    // 查询
    const onSearch =  () => {
        form.validateFields().then(async(values) => {
            console.log(values,'values')
            let post:any={}
            if(values.templateName!==''){
                post.salesmanName = values.templateName
            }
            if(values.createDate!==''){
                post.salesmanNum = values.createDate
            }
            if(values.valuationDate!==''){
                post.organization = values.valuationDate
            }
            // post.salesmanNum = values.createDate
            // post.organization = values.valuationDate
            setloading(true);
            const res:any = await getAllSeller(post);
            if (+res.code === 1001) {
                setdataSource(res.data.list);
                settotal(res.data.total);
            }
            setloading(false);
        })
    };

    // 重置
    const onRest = () => {
        setsearchParams(defaultSearch);
        // getParseCatalogDataListAjax(defaultSearch);
        form.resetFields()
        getAllSellPeople()
    };

    const onTableSelectChange=(values)=>{
        console.log(values);
        
        setselectedRowKeys([...values])
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onTableSelectChange
    };

    const onTableChange = (p, e, s) => {
        const { current, pageSize } = p;

        const {field,order} = s
        pageData.sortFiled = field
        pageData.sortRule = order  === 'descend' ? 0 : (order  === 'ascend' ? 1 : -1 )

        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setpageData({ ...pageData });
        // getParseCatalogDataListAjax(searchParams);
    };

    useEffect(() => {
        getAllSellPeople();
    }, []);

    const getAllSellPeople = async () => {
        setloading(true);
        const res:any = await getAllSeller({});
        if (+res.code === 1001) {
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        if(+res.code ===1001010001){
            history.push('/exception/invalid');
        }
        setloading(false);
    };

    return (
      <PageHeaderWrapper title="销售人员管理">
        <Card>
        <div className={styles.container}>
            <Form form={form} layout="horizontal">
            <Row>
                <Col span={8}>
                <Form.Item
                    label="销售人员姓名"
                    name="templateName"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item
                    label="销售人员身份证"
                    name="createDate"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item
                    label="所属组织"
                    name="valuationDate"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>
            </Row>     
            </Form>
            </div>

            <div className={styles.searchBar}>
            <div>
            <Button className={styles.btnBox} type="primary" onClick={onAddPerson}>
                新建销售人员
            </Button>
            <Button className={styles.btnBox} type="primary" onClick={onInput}>
                批量导入
            </Button>
            <Dropdown
            className={styles.btnBox}
                overlay={<Menu>
                    <Menu.Item
                        key="1"
                        disabled={selectedRowKeys.length === 0}
                        onClick={() => onExportSourceFile('select')}
                    >
                        导出选中
                    </Menu.Item>
                    <Menu.Item
                        key="0"
                        onClick={() => onExportSourceFile('all')}
                    >
                        导出全部
                    </Menu.Item>
                </Menu>}
            >
                <Button >
                    &nbsp;&nbsp;批量导出
                    <DownOutlined/>
                </Button>
            </Dropdown>
            </div>
            <div>
            <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                查询
            </Button>
            <Button className={styles.btnBox} onClick={onRest}>
                重置
            </Button>
            </div>
            </div>

            <MXTable
            loading={loading}
            rowSelection={rowSelection}
            columns={tableColumns}
            dataSource={dataSource}
            rowKey="reportSalesmanId"
            total={total}
            pageNum={pageData.pageNum}
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            onChange={(p, e, s)=>onTableChange(p, e, s)}
            />
        </Card>

        {/* 新增销售人员 */}
        <AddPersonModal
        visible={visible}
        addOrEdit={addOrEdit}
        editSuccess={editSuccess}
        currentPeople={currentPeople}
        onCancel={()=>{
            setvisible(false)
        }}
        />

        {/* 销售人员导入 */}
        <InputPersonModal
        visible={inputVisible}
        allSuccess={allSuccess}
        onCancel={()=>{
            setinputVisible(false)
            getAllSellPeople()
        }}
        />
        
      </PageHeaderWrapper>
    );
};

export default Valuation;
