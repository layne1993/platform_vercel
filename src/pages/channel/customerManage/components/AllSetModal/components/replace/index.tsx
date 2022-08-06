import React, { useEffect, useState } from 'react';
import { message,Form,Divider,Row,Col,Input,Button ,Space,Table,DatePicker} from 'antd';
import moment from 'moment';
import styles from './index.less'

interface propsTs{
    seller:{
      salesmanName?:'',
      reportSalesmanId?:''
    };
    cancelReplace?:any,
    customer?:any,
    type?:any,
    selectedRowKeys?:any,
    replaceSuccess?:any,
    setSuccess?:any
}

import {
  replaceSeller,
  replaceAllSeller,
} from '../../../../services'

const Replace: React.FC<propsTs> = props => {
  const {cancelReplace,seller,customer,type,selectedRowKeys,replaceSuccess,setSuccess} = props

  const [date, setDate] = useState('');


  // 设置日期格式
  const dateFormat = 'YYYY-MM-DD';
  // 选择日期控件
  const onChange=(data,dateString)=> {
    console.log(dateString);
    console.log(data);
    
    setDate(dateString)
    
  }


  const confirmChange=async()=>{
      if(date==""){
        message.warning('请选择日期后再替换');
        return false
      }
      if(type=="one"){//单个替换
        let post:any={}
        post.customerId = customer.customerId
        post.reportSalesmanId = seller.reportSalesmanId
        post.replaceTime = date
        console.log(post);
        const res:any = await replaceSeller(post)
        if (+res.code === 1001) {
          replaceSuccess('客户归属替换成功')
          setSuccess()
        }
      }else{//批量替换
        let post:any=[]
        for(let i=0;i<selectedRowKeys.length;i++){
          let item:any={}
          item.customerId = selectedRowKeys[i].toString()
          item.reportSalesmanId = seller.reportSalesmanId
          item.replaceTime = date
          post.push(item)
        }

        console.log(post);
        const res:any = await replaceAllSeller(post)
        console.log(res);
        if (+res.code === 1001) {
          replaceSuccess('批量替换成功')
          setSuccess()
        }else{
          message.error("批量替换失败");
        }
      }

  }
 const disabledDate = (current: any) => {
    // 不能选今天之后的日期
    return current > moment();
 }

  useEffect(() => {
  }, []);


  return (
    <div className={styles.rep}>
      <ul>
          <li>
              <div className={styles.left}>将归属销售替换为：</div><div className={styles.right}>{seller.salesmanName}</div>
          </li>
          <li>
              <div className={styles.left}>选择替换日期：</div>
              <div className={styles.right}>
                <DatePicker onChange={onChange} disabledDate={disabledDate}   format={dateFormat}/>
              </div>
          </li>
      </ul>
      <div className={styles.bottom}>
      <Button onClick={cancelReplace} style={{marginRight:"20px"}}>返回</Button>
      <Button type="primary" onClick={()=>{confirmChange()}}>确认替换</Button>

      </div>
    </div>
  );
};

export default Replace;
