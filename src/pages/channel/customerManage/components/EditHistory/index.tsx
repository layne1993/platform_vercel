import React, { useEffect, useState } from 'react';
import { Modal,Upload,Table } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import styles from './index.less'
import {
  getChange,
} from '../../services'

const {Dragger} = Upload

interface propsTs{
  visible:boolean,
  onCancel?:any,
  onOk?:any
}

const InputPersonModal: React.FC<propsTs> = props => {
  const {visible,onCancel,onOk} = props


  const [changeList, setChangeList] = useState([]);

  const beforeUpload = (file, fileList) => {

  }

  const handleUpload = (options)=>{
    console.log(options,'上传的options值为')
  }


  const columns = [
    {
      title: '操作时间',
      dataIndex: 'operatingTime',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '操作人',
      dataIndex: 'operator',
      key: 'age',
    },
    {
      title: '操作内容',
      dataIndex: 'operationContent',
      key: 'address',
      width:600,
    }
  ];


  const getChangeHistory =async()=>{
        const res:any = await getChange();
        console.log(res);
        
        if (+res.code === 1001) {
          setChangeList(res.data)
        }

  }

  useEffect(() => {
    getChangeHistory()
  }, []);

  return (
    <div>
      <Modal
      title="修改记录查询"
      visible={visible}
      onCancel={onCancel}
      width={1000}
      footer={
        [] // 设置footer为空，去掉 取消 确定默认按钮
      }
      onOk={onOk}
      >
         <Table columns={columns} dataSource={changeList} pagination={false} scroll={{ y: 280 }} />
      </Modal>
    </div>
  );
};

export default InputPersonModal;
