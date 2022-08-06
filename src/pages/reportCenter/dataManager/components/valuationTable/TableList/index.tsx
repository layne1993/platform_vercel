import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import MXTable from '@/pages/components/MXTable';

import styles from './index.less'
interface propsTs {
  dataSource:array,
  total:number,
  loading:boolean,
  onChange?:any,
  onSelectChange?:any
}

const statusObj = {
  0:'未解析',
  1:'已解析',
  2:'解析失败'
}

const AuthAdd: React.FC<propsTs> = props => {
  const [visible, setvisible] = useState<boolean>(false);
  const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);
  const [pageData,setpageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1,
    pageSize: 10
  })

  const {dataSource,total,loading,onChange,onSelectChange} = props

  const onTableSelectChange=(values)=>{
    setselectedRowKeys([...values])
    onSelectChange(values)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange
  };

 

  const columns = [
    {
      title: '文件名称',
      dataIndex: 'fileName',
      align: 'center',
      width: '20%'
    },
    {
      title: '估值表日期',
      dataIndex: 'valuationDate',
      align: 'center',
      width: '20%'
    },
    {
      title: '解析模板',
      dataIndex: 'parseTemplateName',
      align: 'center',
      width: '20%'
    },
    {
      title: '解析状态',
      dataIndex: 'parseState',
      align: 'center',
      render:(text,record)=>(<div>{statusObj[text]}</div>)
    },
    {
      title: '失败原因',
      dataIndex: 'parseFailureReason',
      align: 'center',
      render:(text,record)=>(<div>{text}</div>)
    },
  ]

  const onDetailClick= (row)=>{
    setvisible(true)
  }

  const tableChange = (p, e, s)=>{
    console.log(p,'p值为')
    pageData.pageNum = p.current;
    pageData.pageSize = p.pageSize;
    setpageData({...pageData})
    console.log(pageData,'pageData值为')
    onChange(pageData)
  }

  useEffect(() => {
  }, []);

  return (
    <div className={styles.internalManagementTable}>
        <MXTable
          loading={loading}
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="fileId"
          total={total}
          pageNum={pageData.pageNum}
          onChange={tableChange}
        />
    </div>
  );
};

export default AuthAdd;
