import React, { useEffect, useState } from 'react';
import { Input, Button, Table, message, Modal, DatePicker  } from 'antd';
import moment from 'moment';
import { getCookie } from '@/utils/utils';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { exportFile } from '@/utils/file'
import { getValuationTablequeryListByMenu, getValuationTablDeteleByMenu, getValuationTablImportByMenu } from '../../service'
import UploadFile from '../UploadFile'

const AssetsClassification: React.FC<{}> = (props) => {
  const [searchParams, setsearchParams] = useState<object>({});
  const [parseVisiable, setParseVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [visibleDelect, setVisibleDelect] = useState(false);
  const [loading, setloading] = useState<boolean>(false);
  const [dataSource, setdataSource] = useState<array>([]);
  const [total, settotal] = useState<number>(0);
  const [fileInput, setFileInput] = useState<any>()
  const [dataDateInput, setDataDateInput] = useState<string>('')
  const [dataDateDateDelect, setDataDateDateDelect] = useState<string>('')
  const [pageData, setpageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1,
    pageSize: 10,
    menuName:'assets'
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
      title: '最新估值表日期',
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
    setDataDateInput('')
    setVisible(true)
  };


  const onDelete = async () => {
    setDataDateDateDelect('')
    setVisibleDelect(true)
  };

  const onDel = () => {

  };
  const onDownTem = () => {
    console.log(BASE_PATH.baseUrl,'BASE_PATH.baseUrl')
    console.log(BASE_PATH.adminUrl,'${BASE_PATH.adminUrl}')
    let params = {
      // url: `http://localhost:8000/vip-manager/mrp_analysis/dataManager/downloadTemplateByMenu?menuName=assets`,
      url:`${BASE_PATH.adminUrl}/mrp_analysis/dataManager/downloadTemplateByMenu?menuName=assets`,
      data:{ menuName: 'assets'},
      fileNames: '大类资产模板',
      req: 'get',
      tokenId: getCookie('vipAdminToken') || ''
    }
    exportFile(params)
  }

  const onTableSelectChange = (values) => {
    setselectedRowKeys([...values])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange
  };

  const onTableChange = (data) => {
    console.log(data, 'data值为');
    const { current, pageSize } = data;
    pageData.pageNum = current;
    pageData.pageSize = pageSize;
    setpageData({ ...pageData });
    getValuationTablequeryListByMenuAjax();
  };
  const onFileSuccess = () => {

  }
  const customRequest = (res) => { 
    setFileInput(res)
  }
  const onChangeDate = (date, dateString) => { 
    setDataDateInput(dateString)
  }
  const onChangeDateDelect = (date, dateString) => {
    setDataDateDateDelect(dateString)
  }
  const onDelectOk = async () => {
    if (!dataDateDateDelect) {
      message.warning('请选择数据日期')
      return
    }
    const mainCardNumbers = { productCodes: JSON.stringify(selectedRowKeys), menuName: 'assets', dataDate: dataDateDateDelect };
    const res = await getValuationTablDeteleByMenu({ ...mainCardNumbers });
    if (+res.code === 1001) {
      setVisibleDelect(false)
      message.success(res.data.msg);
      getValuationTablequeryListByMenuAjax();
    } else { 
      message.error(res.data.msg);
    }
  }
  const onExportOk = async () => {
    if (!dataDateInput) {
      message.warning('请选择数据日期')
      return
    }
    if (!fileInput) {
      message.warning('请选择导入文件')
      return
    }
    const formData = new FormData();
    formData.append('file', fileInput)
    formData.append('menuName', 'assets')
    formData.append('dataDate', dataDateInput)

    const res = await getValuationTablImportByMenu(formData)
    if (res.code == 1001) {
      message.success('导入成功')
      getValuationTablequeryListByMenuAjax();
      setVisible(false)
    } else { 
      message.error(res.data.msg)
    }
  }
  const onParseHandleCancel = () => {
    setParseVisible(false)
    getValuationTablequeryListByMenuAjax();
  }

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

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        {/* <div className={styles.searchBox}> */}
                    产品搜索：
                    <Input
          className={styles.inputBox}
          value={searchParams.fundCodeName}
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
        <Button className={styles.btnBox} disabled={!selectedRowKeys.length} type="primary" onClick={onDelete}>
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
          multiple={true}
          type={'primary'}
          showUploadListFlag={true}
          customRequest={customRequest}
          maxNum={1}
          fileType={['xls', 'xlsx']}
          onsuccess={(res: any) => onFileSuccess(res)}
        />
        <div className={styles.dateBox}>
          数据日期：<DatePicker format={'YYYY-MM-DD'} onChange={(date: moment, dateString: string) => { onChangeDate(date, dateString) }} />
        </div>
      </Modal>}
      <Modal
        title="日期选择"
        width={700}
        visible={visibleDelect}
        onCancel={() => {
          setVisibleDelect(false);
        }}
        onOk={onDelectOk}
      >
        <div className={styles.dateBox}>
          数据日期：<DatePicker format={'YYYY-MM-DD'} onChange={(date: moment, dateString: string) => { onChangeDateDelect(date, dateString) }} />
        </div>
      </Modal>
    </div>
  );
};

export default AssetsClassification;
