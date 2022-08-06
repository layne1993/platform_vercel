import React, { useEffect, useState } from 'react';
import { Modal,Form,Divider,Row,Col,Input,Button ,Space,Table} from 'antd';

import styles from './index.less'
import Replace from './components/replace/index'
import { divide } from '@umijs/deps/compiled/lodash';

import {
  getAllSeller,
  getCustomer
} from '../../services'


interface propsTs{
  visible:boolean,
  onCancel?:any,
  onOk?:any,
  AllOrOne?:any,
  currentCustomer?:any,
  selectedRowKeys?:any,
  replaceSuccess?:any,
}

const AddPersonModal: React.FC<propsTs> = props => {
  const {visible,onCancel,onOk,AllOrOne,currentCustomer,selectedRowKeys,replaceSuccess} = props

  const [showReplace, setShowReplace] = useState(false);

  const [form] = Form.useForm();

  const [chooseSeller, setChooseSeller] = useState({});

  const [sellerList, setSellerList] = useState([]);
  const [custoList, setCustoList] = useState([]); //所有客户
  const [type, setType] = useState('all'); //替换类型  all为批量替换  one为单个替换

  // 查询
  const onSearch = async () => {
    form.validateFields().then(async(values) => {
        console.log(values,'values')
        let post:any={}
        if(values.salesmanName!==''){
          post.salesmanName = values.salesmanName
      }
      if(values.salesmanNum!==''){
          post.salesmanNum = values.salesmanNum
      }
      if(values.organization!==''){
          post.organization = values.organization
      }
        const res:any = await getAllSeller(post);
        if (+res.code === 1001) {
          setSellerList(res.data.list);
        }
    })
  };

  const setSuccess=()=>{
    setShowReplace(false)
  }

  const replaceSeller= (e)=>{
      setShowReplace(true)
      setChooseSeller(e)
      setType('one')
  }
  const replaceSeller2= (e)=>{
    setShowReplace(true)
    setChooseSeller(e)
    setType('all')
}

  const cancelReplace=()=>{
    setShowReplace(false)
  }


  const getAllSellerD=async()=>{

    const res:any = await getAllSeller();
    if (+res.code === 1001) {
      setSellerList(res.data.list);
    }
  }
  const getCustomerPeo = async()=>{
    const res:any = await getCustomer();
    if (+res.code === 1001) {
      let arr=[]
      for(let i=0;i<res.data.list.length;i++){
        for(let j=0;j<selectedRowKeys.length;j++){
          if(res.data.list[i].customerId == selectedRowKeys[j]){
            arr.push(res.data.list[i])
          }
        }
      }
      
      setCustoList(arr);
    }
  }

  useEffect(() => {
    getAllSellerD()
     getCustomerPeo()
  }, [AllOrOne,selectedRowKeys]);
  const columns = [
    {
      title: '销售姓名',
      dataIndex: 'salesmanName',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '销售身份证',
      dataIndex: 'salesmanNum',
      key: 'age',
    },
    {
      title: '所属组织',
      dataIndex: 'organization',
      key: 'address',
    },
    {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          {
            AllOrOne==='all'?<a onClick={()=>{replaceSeller2(record)}}>批量替换所属销售</a>:<a onClick={()=>{replaceSeller(record)}}>替换所属销售</a>
          }
        </Space>
      ),
    },
  ];


  return (
    <div>
      <Modal
      width={700}
      title={AllOrOne==='all'?'批量设置所属销售':"客户所属销售"}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      footer={
        [] // 设置footer为空，去掉 取消 确定默认按钮
      }

      >
         <div className={styles.customerList}>
            {
              AllOrOne=='all'
              ?<ul>
              {
                custoList.map((item)=>{
                  return  <li><span className={styles.left}>客户名称：{item.customerName}</span>
                  <span className={styles.right}>所属销售：{item.salesmanName==null?'无':item.salesmanName}-{item.salesmanNum==null?'无':item.salesmanNum}-{item.organization}</span></li>
                })
              }
            </ul>
            :<ul>
              <li><span className={styles.left}>客户名称：{currentCustomer.customerName}</span>
                  <span className={styles.right}>所属销售：{currentCustomer.salesmanName==null?'无':currentCustomer.salesmanName}-{currentCustomer.salesmanNum==null?'无':currentCustomer.salesmanNum}-{currentCustomer.organization}</span></li>
            </ul>
            }
         </div>
         <Divider />
         {
           showReplace
           ?<Replace type={type} setSuccess={setSuccess} replaceSuccess={replaceSuccess} selectedRowKeys={selectedRowKeys}  seller={chooseSeller} customer={currentCustomer} cancelReplace={cancelReplace}/>
           : <div>
             <Form  form={form} layout="horizontal">
           <Row>
               <Col span={7}>
                 <div style={{marginLeft:"10px"}}>销售姓名：</div>
               <Form.Item
                   
                   name="salesmanName"
                   initialValue={''}
                   style={{marginLeft:10}}
               >
                   <Input/>
               </Form.Item>
               </Col>

               <Col span={7}>
               <div style={{marginLeft:"10px"}}>销售人员身份证：</div>
               <Form.Item
                   label=""
                   name="salesmanNum"
                   initialValue={''}
                   style={{marginLeft:10}}
               >
                   <Input/>
               </Form.Item>
               </Col>

               <Col span={7}>
               <div style={{marginLeft:"10px"}}>所属组织：</div>
               <Form.Item
                   label=""
                   name="organization"
                   initialValue={''}
                   style={{marginLeft:10}}
               >
                   <Input/>
               </Form.Item>
               </Col>
               <Col span={3} style={{textAlign:"center",marginTop:'20px'}}>
               <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                 查询
               </Button>
               </Col>
           </Row>     
        </Form>
        <div className={styles.sellList}>
          <Table columns={columns} dataSource={sellerList} pagination={false} scroll={{ y: 180 }}/>
        </div>
           </div>
         }
         
      </Modal>
    </div>
  );
};

export default AddPersonModal;
