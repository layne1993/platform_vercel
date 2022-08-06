import React, { useEffect, useState } from 'react';
import { Table,Modal } from 'antd';
import MXTable from '@/pages/components/MXTable';
import  moment from 'moment'

import styles from './index.less'
interface propsTs {
  dataSource:array,
  total:number,
  loading:boolean,
  onChange:any
}

const AuthAdd: React.FC<propsTs> = props => {
  const [visible, setvisible] = useState<boolean>(false);
  const [pageData,setpageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1,
    pageSize: 1
  })

  const {dataSource,total,loading,onChange} = props

  const columns = [
    {
      title: '产品名称',
      dataIndex: 'productname',
      align: 'center',
      width: 130,
      fixed:'left',
      // render: (text: string, record: object) => (
      //   <div className={styles.name} onClick={(record)=>onDetailClick(record)}>{record?.productname}</div>
      // )
    },
    {
      title: '产品代码',
      dataIndex: 'productcode',
      align: 'center',
      width: 130,
    },
    {
      title: '产品份额余额',
      dataIndex: 'productportion',
      align: 'center',
      width: 150
    },
    {
      title: '高水位净值日期',
      dataIndex: 'highstanddate',
      align: 'center',
      width: 160,
      render:item=>(
        moment(item).format('YYYY-MM-DD')
      )
    },
    {
      title: '业绩报酬计算方法',
      dataIndex: 'rewardcalctype',
      align: 'center',
      width: 180,
    },
    {
      title: '业绩比较基准',
      dataIndex: 'rewardcomparison',
      align: 'center',
      width: 130
    },
    {
      title: '当日净值',
      dataIndex: 'currentequity',
      align: 'center',
      width: 130
    },
    {
      title: '当日累计净值',
      dataIndex: 'currentaccumulatedequity',
      align: 'center',
      width: 150
    },
    {
      title: '当日应计提业绩报酬金额',
      dataIndex: 'currentreword',
      align: 'center',
      width: 190
    },
    {
      title: '累计应计提业绩报酬',
      dataIndex: 'accumulatedequity',
      align: 'center',
      width: 180
    },
    {
      title: '实际已计提业绩报酬',
      dataIndex: 'realityequity',
      align: 'center',
      width: 190
    },
    // {
    //   title: '操作',
    //   dataIndex: '',
    //   align: 'center',
    //   width: 150,
    //   fixed:'right',
    //   render:(text: string, record: object) => (
    //     <div className={styles.name} onClick={(record)=>onDetailClick(record)}>详情</div>
    //   )
    // },
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
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
          total={total}
          pageNum={pageData.pageNum}
          onChange={tableChange}
        />

      <Modal
      title="详情"
      visible={visible}
      width={920}
      onCancel={()=>setvisible(false)}
      footer={null}>
        <div className={styles.itemBox}>
          <div className={styles.leftText}>客户姓名</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>产品名称</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>基金代码</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>份额确认时间</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>份额确认时间</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>份额获取时累计净值</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>份额获取方式</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>份额余额</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>高水位净值</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>高水位净值日期</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>业绩报酬计算方法</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>业绩比较基准</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>当日净值</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>当日累计净值</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>当日应计提业绩报酬金额</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>该份额扣除业绩报酬后净值</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>客户逐笔收益率</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>理财师/渠道分成比例</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>理财师/渠道分成金额</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>客户实际总收益</div>
          <div className={styles.rightText}></div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.leftText}>客户加权收益率</div>
          <div className={styles.rightText}></div>
        </div>

      </Modal>
    </div>
  );
};

export default AuthAdd;
