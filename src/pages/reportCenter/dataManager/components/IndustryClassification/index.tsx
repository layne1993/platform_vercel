import React, { useEffect, useState } from 'react';
import { Input, Button, Modal, DatePicker, message  } from 'antd';

import MXTable from '@/pages/components/MXTable';
import UploadFile from '../UploadFile'

import moment from 'moment';

import {exportFile} from '@/utils/file'
import { getCookie } from '@/utils/utils';

import styles from './index.less';

import { getValuationTablequeryListByMenu, getValuationTablImportByMenu,getValuationTablDeteleByMenu } from '../../service'

const IndustryClassification: React.FC<{}> = (props) => {
  const [searchParams, setsearchParams] = useState<object>({});
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState<boolean>(false);
  const [dataSource, setdataSource] = useState<array>([]);
  const [total, settotal] = useState<number>(0);
  const [dataDate, setdataDate] = useState<string>('');
  const [file, setfile] = useState<object>({});
  const [visibleDelect, setvisibleDelect] = useState<boolean>(false);
  const [delDate, setdelDate] = useState<string>('');
  
  const [pageData, setpageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1,
    pageSize: 10,
    menuName: 'industry'
  });
  const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

  const tableColumns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      align: 'center',
    },
    {
      title: '产品代码',
      dataIndex: 'productCode',
      align: 'center',
    },
    {
      title: '最近数据日期',
      dataIndex: 'maxDataDate',
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD'),
    },
    {
      title: '文件数量',
      dataIndex: 'fileNum',
      align: 'center',
    },
  ];

  const onInputChange = (value) => {
    searchParams.productCodeName = value.target.value
    setsearchParams({ ...searchParams });
  };

  const onSearch = async () => {
    getValuationTablequeryListByMenuAjax();
  };

  const onRest = () => {
    searchParams.productCodeName = ''
    setsearchParams({ ...searchParams });
    getValuationTablequeryListByMenuAjax();
  };

  const valuationManager = () => {
    setVisible(true);
  };

  const onDel = () => {
    setvisibleDelect(true)
  };

  const onTableSelectChange = (values) => {
    setselectedRowKeys([...values])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange
  };

  const onTableChange = (data) => {
    const { current, pageSize } = data;
    pageData.pageNum = current;
    pageData.pageSize = pageSize;
    setpageData({ ...pageData });
    getValuationTablequeryListByMenuAjax();
  };

  useEffect(() => {
    // getProductRewardAjax()
    getValuationTablequeryListByMenuAjax();
  }, []);

  const getValuationTablequeryListByMenuAjax = async () => {
    setloading(true);
    const res = await getValuationTablequeryListByMenu({
      ...searchParams,
      ...pageData,
    });
    if (+res.code === 1001) {
      setdataSource(res.data.list);
      settotal(res.data.total);
    }
    setloading(false);
    // console.log(res, 'res');
  };

  const onExportOk =async ()=>{
    if (!Object.keys(file).length) {
      message.warning('请上传文件')
      return
    }

    if(!dataDate){
      message.warning('请选择数据日期')
      return
    }

    const formData = new FormData();
    formData.append('file',file)
    formData.append('menuName','industry')
    formData.append('dataDate',dataDate)

    const res = await getValuationTablImportByMenu(formData)
    if(+res.code===1001){
      message.success(res.data.msg)
      setVisible(false)
      getValuationTablequeryListByMenuAjax();
    }else{
      message.error(res.data.msg);
    }
  }

  const customRequest = (options)=>{
    console.log(options,'options')
    setfile(options)
  }

   // 导入日期变化
   const onDateChange = (date)=>{
    setdataDate(moment(date).format('YYYY-MM-DD'))
  }

  // 模板下载
  const onDownTem = ()=>{
    let params = {
      url: `${BASE_PATH.adminUrl}/mrp_analysis/dataManager/downloadTemplateByMenu?menuName=industry`,
      // url: `http://localhost:8000/vip-manager/mrp_analysis/dataManager/downloadTemplateByMenu?menuName=industry`,
      // https://vipdevfunds.simu800.com/
      fileNames: '行业分类模板',
      req: 'get',
      tokenId: getCookie('vipAdminToken') || ''
    }
    exportFile(params)
  }

  const onDelectOk =async ()=>{
    if(!delDate){
      message.warning('请选择数据日期')
      return
    }

    const res = await getValuationTablDeteleByMenu({
      menuName:'industry',
      dataDate:delDate,
      productCodes:JSON.stringify(selectedRowKeys)
    })
    if (+res.code === 1001) {
      setvisibleDelect(false)
      message.success(res.data.msg);
      getValuationTablequeryListByMenuAjax();
    } else { 
      message.error(res.data.msg);
    }
  }

  const onChangeDateDelect = (date)=>{
    setdelDate(moment(date).format('YYYY-MM-DD'))
  }

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
          产品搜索：
          <Input
          className={styles.inputBox}
          value={searchParams.productCodeName}
          onChange={onInputChange}
          placeholder="请输入产品名称或代码"
        />
        <Button className={styles.btnBox} type="primary" onClick={onSearch}>
          查询
        </Button>
        <Button className={styles.btnBox} onClick={onRest}>
          重置
        </Button>
      </div>
      <div>
        <Button className={styles.btnBox} type="primary" onClick={valuationManager}>
          导入
        </Button>
        <Button className={styles.btnBox} type="primary" onClick={onDownTem}>
          下载导模板
        </Button>
        <Button className={styles.btnBox} disabled={!selectedRowKeys.length} type="primary" onClick={onDel}>
          删除
        </Button></div>

      <MXTable
        loading={loading}
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="productCode"
        total={total}
        pageNum={pageData.pageNum}
        onChange={onTableChange}
      />

        {visible && <Modal
          title="数据导入"
          width={700}
          visible={visible}
          onCancel={() => {
            setVisible(false);
          }}
          onOk={onExportOk}
        >
          <UploadFile
            multiple={false}
            type={'primary'}
            showUploadListFlag={true}
            maxNum={1}
            fileType={['xls','xlsx']}
            customRequest={customRequest}
            />

            <div className={styles.dateBox}>
              数据日期：<DatePicker  onChange={onDateChange}></DatePicker>
            </div>
        </Modal>}

        {visibleDelect &&<Modal
        title="日期选择"
        width={700}
        visible={visibleDelect}
        onCancel={() => {
          setvisibleDelect(false);
        }}
        onOk={onDelectOk}
      >
        <div className={styles.dateBox}>
          数据日期：<DatePicker format={'YYYY-MM-DD'} onChange={onChangeDateDelect } />
        </div>
      </Modal>}

    </div>
  );
};

export default IndustryClassification;
