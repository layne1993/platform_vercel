import React, { useEffect, useState } from 'react';
import { Card,Button,Modal,Pagination } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

import styles from './index.less'

import {getModelReportType} from '../../service'

interface porpsTs {

}

const baseURL = `${BASE_PATH.adminUrl}/mrp_analysis`

const LibrayList: React.FC<porpsTs> = props => {
  const [title, settitle] = useState<string>('');
  const [loading, setloading] = useState<boolean>(false);
  const [activeArr, setactiveArr] = useState<array>([]);
  const [visiblePre, setvisiblePre] = useState<boolean>(false);
  const [urlImg, seturlImg] = useState<string>('');
  const [total, settotal] = useState<number>(10);
  const [category, setcategory] = useState<string>(0);
  const [templateArr,settemplateArr] = useState<array>([])
  const [pageData,setpageData] = useState<object>({
    pageNum:1,
    pageSize:7
  })

  const onTopMouseEnter = (index) => {
    dealActive()
    activeArr[index] = true
    setactiveArr([...activeArr])
  };

  const onTopMouseLeave = ()=>{
    dealActive()
  }

  const dealActive = ()=>{
    activeArr.forEach((item,index)=>{
      activeArr[index] = false
    })
    setactiveArr([...activeArr])
  }

  const onPreviewClick = (path)=>{
    setvisiblePre(true)
    seturlImg(path)
  }

  const onGenerateClick = (item)=>{
    history.push({
      pathname:'/reportCenter/library/list/generateReport',
      query:{
        type:item.category,
        name:item.type
      }
    })
  }

  useEffect(() => {
    const type = props.location.query ? props.location.query.type :0
    const title = props.location.query ? props.location.query.name :''
    settitle(title)
    setcategory(type)
  }, []);

  useEffect(()=>{
    getModelReportTypeAjax()
  },[category])

  const getModelReportTypeAjax =async ()=>{
    setloading(true)
    const res = await getModelReportType({category,...pageData})
    console.log(res,'res')
    settemplateArr([...res.data.list])
    const arr = []
    templateArr.forEach((item,index)=>{
      arr[index] = false
    })
    setactiveArr([...arr])
    settotal(res.data.total)
    setloading(false)
  }

  const onPaginatChange = (p)=>{
    pageData.pageNum = p
    setpageData({...pageData})
    getModelReportTypeAjax()
  }

  return (
    <PageHeaderWrapper title={title}>
      <Card loading={loading}>
        <div className={styles.listBox}>
          {templateArr.length ? templateArr.map((item,index)=>(
            <div className={styles.itemBox} key={index}>
            <div className={styles.itemTopBox} onMouseEnter={()=>onTopMouseEnter(index)} onMouseLeave={()=>onTopMouseLeave()}>
              <img className={styles.imgTop} src={`${baseURL}/${item.path}`} alt="" />
              {activeArr[index] && <div className={styles.preBtn}>
                <Button type="primary" onClick={()=>onPreviewClick(item.path)}>预览</Button>
                <Button className={styles.reportBtn} onClick={()=>onGenerateClick(item)}>生成报告</Button>
              </div>}
            </div>
            <div className={styles.itemBottomBox}>
              {item.name}
            </div>
          </div>
          )): <div className={styles.imgBox}>
            <img className={styles.imgNoBox} src={require('@/pages/reportCenter/assets/no_data.png')}/>
            <p className={styles.noText}>暂无数据</p>
          </div>
          }
        </div>

        <div className={styles.paginatBox}>
          {total ? <Pagination defaultCurrent={1} current={pageData.pageNum} total={total} pageSize={7} onChange={onPaginatChange}/> : ''}
        </div>
      </Card>

      <Modal
      visible={visiblePre}
      width={700}
      onCancel={()=>setvisiblePre(false)}
      footer={null}
      >
        {visiblePre && <div  className={styles.preBox}>
          <img className={styles.preImg} src={`${baseURL}/${urlImg}`} alt="" />
        </div>}
      </Modal>
    </PageHeaderWrapper>
  );
};

export default LibrayList;
