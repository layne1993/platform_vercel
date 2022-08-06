import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Dropdown,Row,Col,Form,Modal,Space,message,Menu } from 'antd';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history, Link } from 'umi';

import MXTable from '@/pages/components/MXTable';
import AllSetModal from './components/AllSetModal'
import EditHistory from './components/EditHistory'
import { DownOutlined } from '@ant-design/icons';
import {
    getCustomer,
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
    const [AllOrOne, setAllOrOne] = useState('all');
    const [loading, setloading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<any>([{name:12}]);
    const [total, settotal] = useState<number>(0);
    const [pageData, setpageData] = useState<any>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10,
        sortFiled:'',
        sortRule:''
    });
    const [selectedRowKeys, setselectedRowKeys] = useState<any>([]);
    const [currentCustomer, setCurrentCustomer] = useState({});
    const [allSelect, setAllSelect] = useState([]);//用于导出全部 ['1','2',...]
    const tableColumns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            align: 'center',
            width: 100,
            render: (val, record) =>
                    (
                        <Link target = "_blank" to={`/investor/customerInfo/investordetails/${record.customerId}`}>
                            {val}
                        </Link>
                    ) || '--'
        },
        {
            title: '所属销售姓名',
            dataIndex: 'salesmanName',
            align: 'center',
            // render: (text) => moment(text).format('YYYY-MM-DD'),
            width: 120,
            render: (text, record) => (
                <div>{record.salesmanName==null?"无":record.salesmanName}</div>
            ),
        },
        {
            title: '所属销售身份证',
            dataIndex: 'salesmanNum',
            align: 'center',
            width: 120,
            render: (text, record) => (
                <div>{record.salesmanNum==null?"无":record.salesmanNum}</div>
            ),
        },
        {
            title: '所属组织',
            dataIndex: 'organization',
            align: 'center',
            width: 100
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
              <a onClick={()=>onTableEdit(record)}>编辑</a>
            </Space>
          ),
        },
    ];

    // 批量设置客户归属
    const onSetCustomerSet = ()=>{
        setAllOrOne('all')
        setvisible(true)
        
    }

    // 修改记录查询
    const onEditHistory =async ()=>{
        setinputVisible(true)
        // const res = await exportParseCatalogDataList({
        //     fileType:'product',
        //     exportIds:selectedRowKeys
        // })
        // exportFileBlob(res,'估值表数据文件.xls')
    }

    // 表格尾部导出估值表文件
    const  onTableEdit =async (record)=>{
        
        setAllOrOne('one')
        setCurrentCustomer(record)
        setvisible(true)
    }

    // 导出估值表源文件
    const onExportSourceFile =async (e)=>{
        if(e=="select"){
            const res:any = await exportSelect(
                selectedRowKeys
             )
             exportFileBlob(res.data,'销售人员信息.xls')
        }else{
            const res:any = await exportSelectAll()
             exportFileBlob(res.data,'销售人员信息.xls')
        }
    }

    // 查询
    const onSearch = async () => {
        form.validateFields().then(async(values) => {
            console.log(values,'values')
            let post:any={}
            if(values.customerName!==''){
                post.customerName = values.customerName
            }
            if(values.salesmanName!==''){
                post.salesmanName = values.salesmanName
            }
            if(values.salesmanNum!==''){
                post.salesmanNum = values.salesmanNum
            }
            if(values.organization!==''){
                post.organization = values.organization
            }
            setloading(true);
            const res:any = await getCustomer(post);
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
        getCustomerAll(searchParams)
        form.resetFields()
        setselectedRowKeys([])
    };

    const onTableSelectChange=(values)=>{
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
        getCustomerAll(searchParams);
    };

    useEffect(() => {
        getCustomerAll(searchParams);
    }, []);

    const getCustomerAll = async (params) => {
        setloading(true);
        const res:any = await getCustomer({});
        if (+res.code === 1001) {
            setdataSource(res.data.list);
            settotal(res.data.total);
            console.log(dataSource);
            
        }
        if(+res.code ===1001010001){
            history.push('/exception/invalid');
        }
        setloading(false);
    };
    const replaceSuccess=(e)=>{
       setvisible(false)
       getCustomerAll('')
       setselectedRowKeys([])
       message.success(e);
    }

    return (
      <PageHeaderWrapper title="客户归属管理">
        <Card>
        <div className={styles.container}>
            <Form form={form} layout="horizontal">
            <Row>
                <Col span={6}>
                <Form.Item
                    label="客户名称"
                    name="customerName"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={6}>
                <Form.Item
                    label="销售姓名"
                    name="salesmanName"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={6}>
                <Form.Item
                    label="销售身份证"
                    name="salesmanNum"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={6}>
                <Form.Item
                    label="所属组织"
                    name="organization"
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
            <Button disabled={selectedRowKeys.length === 0} className={styles.btnBox} type="primary" onClick={onSetCustomerSet}>
            批量设置客户归属
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
            <Button className={styles.btnBox} type="primary" onClick={onEditHistory}>
                修改记录查询
            </Button>
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
            rowKey="customerId"
            total={total}
            pageNum={pageData.pageNum}
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            onChange={(p, e, s)=>onTableChange(p, e, s)}
            />
        </Card>

        {/* 批量设置客户归属 */}
        <AllSetModal
        visible={visible}
        AllOrOne={AllOrOne}
        currentCustomer={currentCustomer}
        selectedRowKeys={selectedRowKeys}
        replaceSuccess={replaceSuccess}
        onCancel={()=>{
            setvisible(false)
            getCustomer(searchParams);
        }}
        />

        {/* 修改记录 */}
        <EditHistory
        visible={inputVisible}
        onCancel={()=>{
            setinputVisible(false)
            getCustomer(searchParams);
        }}
        />
        
      </PageHeaderWrapper>
    );
};

export default Valuation;
