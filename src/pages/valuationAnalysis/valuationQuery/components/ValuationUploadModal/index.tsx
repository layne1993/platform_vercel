import React, { useState,useEffect } from 'react';
import { Modal,Card,message,notification,Button,Select, Row, Col, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

import MXTable from '@/pages/components/MXTable';
import UploadProgress from '../UploadProgress';

import { getCookie } from '@/utils/utils';
import {getTemplateList,getParseCatalogDataList,valuationTableDelete} from '../../services'

import styles from './index.less'

const { Option } = Select
const { confirm } = Modal;
interface propsTs {
  visible?:boolean,
  onCancel?:any
}

const defaultSearch = {
  productName:'',
  createDate:'',
  valuationDate:'',
  fileType:'product',
  sortFiled:'',
  sortRule:''
}

const ValuationUploadModal: React.FC<propsTs> = props => {
  const [form] = Form.useForm();

  const {visible,onCancel} = props

  const [loading, setloading] = useState<boolean>(false);
    const [templateList, settemplateList] = useState<array>([]); // 模板下拉
    const [templateValue,settemplateValue] = useState<any>('') // 模板id
    const [dataSource, setdataSource] = useState<array>([{name:12}]);
    const [total, settotal] = useState<number>(0);
    const [pageData, setpageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10,
    });
    const [searchParams, setsearchParams] = useState<object>(defaultSearch);
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);
    const [productArr,setproductArr] = useState<array>([])
    const [parseSuccessTotal,setparseSuccessTotal] = useState<array>([])
    const [parseFail,setparseFail] = useState<array>([])

  const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
  };

  const tableColumns = [
    {
        title: '估值表日期',
        dataIndex: 'valuationDate',
        align: 'center',
        width: 100
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      align: 'center',
      render: (text) => moment(text).format('YYYY-MM-DD'),
      width: 120
    },
    {
      title: '产品名称',
      dataIndex: 'fundName',
      align: 'center',
      render: (text,record) => (<div>{text}</div>),
      width: 120
    },
    {
      title: '单位净值',
      dataIndex: 'netValue',
      align: 'center',
      width: 100
    },
    {
      title: '昨日净值',
      dataIndex: 'yesterdayNetValue',
      align: 'center',
      width: 100
    },
    {
      title: '累计净值',
      dataIndex: 'accumulatedNetValue',
      align: 'center',
      width: 100
    },
    {
      title: '来源类型',
      dataIndex: 'source',
      align: 'center',
      width: 100
    },
    {
      title: '期初净值',
      dataIndex: 'beginNetValue',
      align: 'center',
      width: 100
    },
    {
      title: '沪市股票市值(万)',
      dataIndex: 'hsStockQuotation',
      align: 'center',
      width: 120
    },
    {
      title: '深市股票市值(万)',
      dataIndex: 'ssStockQuotation',
      align: 'center',
      width: 120
    },
    {
      title: '资产规模(万)',
      dataIndex: 'assets',
      align: 'center',
      width: 120
    },
    {
      title: '日净值增长率',
      dataIndex: 'netValueRate',
      align: 'center',
      width: 120
    },
    {
      title: '本期净值增长率',
      dataIndex: 'currentNetValueRate',
      align: 'center',
      width: 120
    },
    {
      title: '累计净值增长率',
      dataIndex: 'accumulatedNetValueRate',
      align: 'center',
      width: 120
    },
  ]

  // 上传完成回调
  const callback = ({ status, messageO }) => {
    console.log(status, 'status');
    if (status === 'success') {
        // message.success('上传估值表成功');

        // getValuationTableListAjax();
    } else {
        openNotification(
            'warning',
            '提示',
            messageO,
            'topRight',
        );
    }
  };

  // 上传成功信息
  const callbackSuccessMsg = (arrT)=>{
    let arr = productArr
    let arrName = parseFail
    let arrTotal = parseSuccessTotal
    arrT.forEach(item=>{
      if(item.flag){
        arr.push(item.fundName)
        arrTotal.push(1)
        message.success(item.msg)
      }else{
        const {msg,fileName} = item
        openNotification(
          'warning',
          '提示',
          msg,
          'topRight',
        );
        arrName.push(fileName)
      }
    })
    setparseSuccessTotal(arrTotal)
    setparseFail(arrName)
    arr = new Set(arr)
    setproductArr([...arr])
  }

  // 上传失败
  const callbackFail = (arr)=>{

  }

  const onTableSelectChange=(values)=>{
    setselectedRowKeys([...values])
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange
  };

  const onDel = ()=>{
    const _this = this
    confirm({
      title:'',
      content:'确认删除吗?',
      onOk(){
        valuationTableDeleteAjax()
      },
      onCancel(){

      }
    })
  }

  const valuationTableDeleteAjax =async ()=>{
    const res = await valuationTableDelete({
      fileIds:JSON.stringify(selectedRowKeys)
    })
    if(+res.code === 1001){
      message.success('删除成功')
    }
  }

  const onSearch = ()=>{
    form.validateFields().then((values) => {
      console.log(values,'values')
      values.createDate = moment(values.createDate).format("YYYY-MM-DD")
      values.valuationDate = moment(values.valuationDate).format("YYYY-MM-DD")
      setsearchParams(values)
      getParseCatalogDataListAjax(values);
  })
  }

  const onRest = ()=>{
    setsearchParams(defaultSearch);
    getParseCatalogDataListAjax(defaultSearch);
  }

  const getTemplateListAjax =async ()=>{
    const res = await getTemplateList()
    console.log(res)
    if(+res.code === 1001){
      settemplateList(res.data)
      res.data.length && settemplateValue(res.data[0].templateId)
    }
  }

  const onTableChange = (data) => {
    console.log(data, 'data值为');
    const { current, pageSize } = data;
    pageData.pageNum = current;
    pageData.pageSize = pageSize;
    setpageData({ ...pageData });
  };

  // 模板下拉
  const onTemplateChange = (value)=>{
    settemplateValue(value)
  }

  const getParseCatalogDataListAjax = async (params) => {
    setloading(true);
    const res = await getParseCatalogDataList({
        ...params,
        ...pageData,
    });
    if (+res.code === 1001) {
        setdataSource(res.data.list);
        settotal(res.data.total);
    }
    setloading(false);
};

  const onUploadClick=()=>{
    setproductArr([])
    setparseSuccessTotal([])
    setparseFail([])
  }

  useEffect(() => {
    if(visible){
      getTemplateListAjax()
      getParseCatalogDataListAjax(searchParams);
    }
  }, [visible]);

  return (
    <div>
      <Modal
      width={900}
      visible={visible}
      onCancel={onCancel}
      footer={null}>
        <Card title="基本信息" style={{marginTop:20}}>
        <div className={styles.basicBox}>
          <div className={styles.labelBox}>上传估值表：</div>

        <div>
        <UploadProgress
        params={{
            userId: getCookie('managerUserId'),
            userName:getCookie('userName'),
            fileType:'product',
            templateId:templateValue
        }}
        url={'/mvt/valuationTable/uploadAndParse'}
        uploadProps={{
            multiple: true
        }}
        callback={callback}
        callbackFail={callbackFail}
        callbackSuccessMsg={callbackSuccessMsg}
      >
        <Button type="primary" className={styles.controlBtn} onClick={onUploadClick}>
          上传估值表
        </Button>
      </UploadProgress>
      <div className={styles.uploadInfo}>单个文件支持：.xls .xlsx；多个文件支持：.rar .zip .7z</div>
      </div>
      </div>

      <div className={styles.basicBoxTemplate}>
        <div className={styles.labelBox}>对应模板：</div>
        <Select style={{width:200}} value={templateValue} onChange={onTemplateChange}>
          {templateList.map(item=>(<Option value={item.templateId} key={item.templateId}>{item.templateName}</Option>))}
        </Select>
      </div>
      </Card>

        <Card style={{marginTop:20}}>
          <Card title="信息" headStyle={{background:'#fafafa'}}>
            <Row>
            <Col span={12}>
              <span className={styles.labelBoxTemplate}>基金产品数量：</span>
              <span className={styles.textBox}>{productArr.length}</span>
            </Col>

            <Col span={12}>
              <span className={styles.labelBoxTemplate}>解析成功数量：</span>
              <span className={styles.textBox}>{parseSuccessTotal.length}</span>
            </Col>
            </Row>

            <Row>
            <Col span={24}>
              <span className={styles.labelBoxTemplate}>解析失败文件：</span>
              <span className={styles.textBox}>{parseFail.join(',') || '--'}</span>
            </Col>
            </Row>
          </Card>
        </Card>

        {/* <Card style={{marginTop:20}}>
        <Form form={form} layout="horizontal">
          <Row>
            <Col span={8}>
            <Form.Item
              label="产品名称"
              name="templateName"
              initialValue={''}
              style={{marginLeft:10}}
            >
                    <Input/>
                </Form.Item>
            </Col>

            <Col span={8}>
            <Form.Item
              label="创建时间"
              name="createDate"
              style={{marginLeft:10}}
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
            </Col>

            <Col span={8}>
            <Form.Item
              label="净值日期"
              name="valuationDate"
              style={{marginLeft:10}}
            >
              <DatePicker style={{ width: '100%' }}/>
            </Form.Item>
            </Col>
          </Row>

          <div>
          <Button disabled={!selectedRowKeys.length} className={styles.btnBox} danger onClick={onDel}>
                删除
            </Button>
            <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                查询
            </Button>
            <Button className={styles.btnBox} onClick={onRest}>
                重置
            </Button>
          </div>

          <MXTable
            loading={loading}
            rowSelection={rowSelection}
            columns={tableColumns}
            dataSource={dataSource}
            rowKey="fileId"
            total={total}
            pageNum={pageData.pageNum}
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
            onChange={onTableChange}
            />
        </Form>
        </Card> */}
      </Modal>
    </div>
  );
};

export default ValuationUploadModal;
