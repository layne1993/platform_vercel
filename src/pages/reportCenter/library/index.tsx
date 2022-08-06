import React, { useEffect, useState } from 'react';
import { Card,Button } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { history } from 'umi';

import {getModelReports} from '../service'

import styles from './index.less'

import list1 from '../assets/list_1.png'
import list2 from '../assets/list_2.png'
import list3 from '../assets/list_3.png'
import list4 from '../assets/list_4.png'
import list5 from '../assets/list_5.png'
import list6 from '../assets/list_6.png'

const imgArr = [
  list1,list2,list3,list4,list5,list6
]

const colorArr = [
  '#CFE6FF','#FFDDCC','#C3D3FF','#CFE6FF','#FFDEDE','#C3D3FF'
]


const Libray: React.FC<{}> = props => {
  const [list, setlist] = useState<array>([]);

  const onItemClick = (item) => {

    history.push({
      pathname:'/reportCenter/library/list',
      query:{
        type:item.category,
        name:item.type
      }
    })
  };

  const onGenerateClick = ()=>{
    history.push({
      pathname: `/reportCenter/library/month`,
    });
  }

  useEffect(() => {
    getModelReportsAjax()
  }, []);

  const getModelReportsAjax =async ()=>{
    const res = await getModelReports()
    console.log(res,'res')
    if(+res.code === 1001){
      setlist(res.data.list)
    }
  }

  return (
    <PageHeaderWrapper title="报告库">
      <Card>
        {/* <Button style={{marginBottom:20}} type="primary" onClick={onGenerateClick}>生成月报</Button> */}
        <div className={styles.reportBox}>
          {list.map((item,index)=>(
            <div className={styles.itemOne} style={{background:index<5 ?`url(${imgArr[index]}) repeat 245px 154px`:`url(${list1}) repeat 245px 154px`}} onClick={()=>onItemClick(item)}>
            <p className={styles.title}>{item.type}</p>
            <p className={styles.content} style={{color:colorArr[index]}}>共
              <span className={styles.number}> {item.number} </span>
              套模板
            </p>
            </div>
          ))}
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default Libray;
