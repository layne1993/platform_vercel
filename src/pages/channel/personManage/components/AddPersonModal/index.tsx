import React, { useEffect, useState } from 'react';
import { Modal,Form,message,Col,Input } from 'antd';
import {history} from 'umi';
import styles from './index.less'

import {
  addSeller,
  editSeller
} from '../../services'

interface propsTs{
  visible:boolean,
  onCancel?:any,
  addOrEdit?:any,
  editSuccess?:any,
  currentPeople?:any
}



const AddPersonModal: React.FC<propsTs> = props => {
  const {visible,onCancel,addOrEdit,editSuccess,currentPeople} = props

  const [form] = Form.useForm();

  const [showRed, setShowRed] = useState(false);//提交验证身份证已存在时为true

const onChange=()=>{
  setShowRed(false)
  
}
  const onOk=  () =>{
    if(addOrEdit=="add"){
      form.validateFields().then(async(values) => {
          console.log(values,'values')
          let post:any={}
          post.salesmanName = values.templateName
          post.salesmanNum = values.createDate
          post.organization = values.valuationDate
          const res:any = await addSeller(post);
          if (+res.code === 1001) {
            editSuccess('add')
            setShowRed(false)
            form.resetFields()
          }
          if(+res.code ===1001020009){
            setShowRed(true)
          }
          if(+res.code ===1001010001){
            message.error('添加失败')
            history.push('/exception/invalid');
          }
      })
    }else{
      form.validateFields().then(async(values) => {
          console.log(values,'values')
          let post:any={}
          post.salesmanName = values.templateName
          post.salesmanNum = values.createDate
          post.organization = values.valuationDate
          post.reportSalesmanId = currentPeople.reportSalesmanId
          const res:any = await editSeller(post);
          if (+res.code === 1001) {
            editSuccess('edit')
          }
          if(+res.code ===1001020009){
            setShowRed(true)
          }
          if(+res.code ===1001010001){
            message.error('添加失败')
            history.push('/exception/invalid');
          }
      })
    }
  }
  const init=()=>{
    form.resetFields()
    setShowRed(false)
  }
  useEffect(() => {
    init()
  }, [currentPeople]);

  return (
    <div>
      {
        visible? <Modal
        width={700}
        title={addOrEdit==='add'?'新建销售人员':"编辑销售人员"}
        visible={true}
        onCancel={onCancel}
        onOk={onOk}>
          <Form form={form} layout="horizontal" className={styles.formBox} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
            <Form.Item
                label="销售人员姓名："
                name="templateName"
                labelCol={{ style: { width: 215 } }}
                initialValue={currentPeople.salesmanName}
                rules={[{ required: true, message: '请输入销售人员姓名!' }, {max: 20,message: '最多可输入20个字符',}]}
                style={{marginLeft:10}}
            >
                <Input/>
            </Form.Item>
  
            <Form.Item
                label="销售人员身份证（唯一标识）："
                name="createDate"
                initialValue={currentPeople.salesmanNum}
                labelCol={{ style: { width: 220 } }}
                rules={[{ required: true, message: '请输入销售人员身份证号!' }, {
                  required: true,
                  pattern:/^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|30|31)|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}([0-9]|x|X)$/,
                  message: '请输入正确格式的身份证号'
                },]}
                style={{marginLeft:5}}
            >
                <Input onChange={onChange}/>
                
            </Form.Item>
            {
              showRed?<div className={styles.card}>您填写的身份证已被占用！</div>:''
            }
            <Form.Item
                label="所属组织："
                name="valuationDate"
                labelCol={{ style: { width: 215 } }}
                initialValue={currentPeople.organization}
                rules={[{max: 40,message: '最多可输入40个字符',}]}
                style={{marginLeft:10}}
            >
                <Input/>
            </Form.Item>  
              </Form>
        </Modal>
  :''  
      }
       </div>
  );
};

export default AddPersonModal;
