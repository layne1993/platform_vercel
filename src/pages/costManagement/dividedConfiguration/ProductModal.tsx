import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Table, message } from 'antd';
import styles from './edit/index.less';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { getManagerCostDivideListAjax, costDivideListDeleteAjax,copyProduct, costDivideListExportExcelAjax, getDivideProducts, costDivideListUpdateAjax, costDivideListAddAjax } from "../services";
import MXTable from '@/pages/components/MXTable';
const { Option } = Select;
const { confirm } = Modal;

interface propsTs{
  visible?:boolean,
  onCancel?:any,
  selectedRowKeys?:any,
  successPost?:any
}

const ProductModal: React.FC<propsTs> = props => {
  const { visible, onCancel, selectedRowKeys,successPost } = props;
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState('');
  const [tableData, setTableData] = useState([]);
  const [divideObject, setDivideObject] = useState<string>('')
  const [channelName, setChannelName] = useState<string>('')
  const [salesmanName, setSalesmanName] = useState<string>('')
  const [divideRate, setDivideRate] = useState<string>('')
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectOptions, setSelectOptions] = useState<any>([{productId:"",productName:""}])
  const [otherProductId, setOtherProductId] = useState<any>()
  const [pageData, setPageData] = useState<any>({
    // 当前的分页数据
    pageNum: 1
  });


  const isEditing = record => {
    // return record.id === editingKey || record.isCreate;
    return false;
  };

  const tableColumns = [
    {
      title: '分成对象',
      dataIndex: 'divideObject',
      editable: true,
      align: 'center',
      width: 120,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={text}
            onChange={val => setDivideObject(val)}
            style={{ width: 100 }}
          >
            <Option value={1}>销售渠道</Option>
            <Option value={2}>销售人员</Option>
          </Select>
        ) : (
            <span>{text}</span>
          )
      }
    },
    {
      title: '对应销售渠道',
      dataIndex: 'channelName',
      editable: true,
      align: 'center',
      width: 120,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={text}
            onChange={val => setChannelName(val)}
            style={{ width: 100 }}
          >
            <Option value={1}>销售渠道</Option>
            <Option value={2}>销售人员</Option>
          </Select>
        ) : (
            record.channelName==null?'无':<span>{text}</span>
          )
      }
    },
    {
      title: '对应销售人员',
      dataIndex: 'salesmanName',
      editable: true,
      align: 'center',
      width: 120,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Select
            value={text}
            onChange={val => setSalesmanName(val)}
            style={{ width: 100 }}
          >
            <Option value={1}>销售渠道</Option>
            <Option value={2}>销售人员</Option>
          </Select>
        ) : (
          record.salesmanName==null?'无':<span>{text}</span>
          )
      }
    },
    {
      title: '分成费率',
      dataIndex: 'divideRate',
      editable: true,
      align: 'center',
      width: 120,
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Input
            value={text}
            type="number"
            min={0}
            max={100}
            suffix="%"
            onChange={e => setDivideRate(e.target.value)}
            style={{ width: 100 }}
          />
        ) : (
            <span>{text}</span>
          )
      }
    },
    {
      title: '最近修改时间',
      dataIndex: 'updateTime',
      editable: true,
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          null
        ) : (
            <span>{text}</span>
          )
      }
    },
    {
      title: '最近修改人',
      dataIndex: 'userName',
      editable: true,
      align: 'center',
      render: (text, record) => {
        const editable = isEditing(record);
        return editable ? (
          null
        ) : (
            <span>{text}</span>
          )
      }
    },
    // {
    // 	title: '操作',
    // 	dataIndex: 'operator',
    // 	align: 'center',
    // 	width: 140,
    // 	render: (text, record) => {
    // 		const editable = isEditing(record);
    // 		return editable ? (
    // 			<>
    // 				<span className={styles.linkBtn} onClick={() => handleSave(record)}>
    // 					保存
    // 				</span>
    // 				<span className={styles.linkBtn} onClick={() => handleCancel()} style={{ margin: 0 }}>
    // 					取消
    // 				</span>
    // 			</>
    // 		) : (
    // 			<>
    // 				<span className={styles.linkBtn} onClick={() => handleEdit(record)}>
    // 					编辑
    // 				</span>
    // 				<span className={styles.delBtn} onClick={() => handleDelete(record)}>
    // 					删除
    // 				</span>
    // 			</>
    // 		);
    // 	}
    // }
  ];

  const handleChangeSelect = () => { };

  const handleChangeInput = () => { };

  const handleSave = async (record) => {
    if (record.isCreate) {
      const res:any = await costDivideListAddAjax({
        channelName,
        divideObject,
        salesmanName,
        divideRate
      })
      if (+res.code === 1001) {
        getManagementList();
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    } else {
      const res:any = await costDivideListUpdateAjax({
        divideId: record.divideId,
        channelName,
        divideObject,
        salesmanName,
        divideRate
      })
      if (+res.code === 1001) {
        getManagementList();
        message.success(res.message)
      } else {
        message.error(res.message)
      }
    }
  };

  const getManagementList = () => {

  }

  const handleCancel = (record) => {
    if (record.isCreate) {
      let tableDataNew = tableData;
      tableDataNew.shift();
      setTableData(JSON.parse(JSON.stringify(tableDataNew)))
    } else {
      setEditingKey('')
    }
  };

  const onTableChange = data => {
    const { current } = data;
    pageData.pageNum = current;
    setPageData({ ...pageData });
  };

  const handleEdit = (record) => {
    setEditingKey(record.id)
    setChannelName(record.channelName)
    setDivideObject(record.divideObject)
    setSalesmanName(record.salesmanName)
    setDivideRate(record.divideRate)
  };

  const handleDelete = (record) => {
    let divideIds = [];
    divideIds.push(record.divideId);
    costDivideListDelete(divideIds);
  };
  const costDivideListDelete = async (divideIds) => {
    const res:any = await costDivideListDeleteAjax({ divideIds })
    if (+res.code === 1001) {
      // getManagementCostDivide();
      message.success(res.message)
    } else {
      message.error(res.message)
    }
  };
  // const handleCreate = () => {
  //   setChannelName(record.channelName)
  //   setDivideObject(record.divideObject)
  //   setSalesmanName(record.salesmanName)
  //   setDivideRate(record.divideRate)
  //   let addtable = {
  //     isCreate: true
  //   };
  //   let tableDataNew = tableData;
  //   tableDataNew.unshift(addtable);
  //   setTableData(JSON.parse(JSON.stringify(tableDataNew)));
  // };

  const getListAjax = async (e) => {
    setLoading(true)
    const res:any = await getManagerCostDivideListAjax({
      ...pageData,
      productId: e
    });
    if (+res.code === 1001) {
      setTableData(res.data.list)
      setTotal(res.data.total);
    }
    setLoading(false)
  }

  const handleSubmit = () => {
    confirm({
      title: '确认复制管理费分成配置吗？完成后产品配置将全部清空',
      // content: 'Some descriptions',
      async onOk() {
        let arr:any=[]
        for(let i=0;i<selectedRowKeys.length;i++){
          arr.push(selectedRowKeys[i].productId)
        }      
        let post:any={}
        post.chooseProductIds = arr
        post.otherProductId = otherProductId

        console.log(post);
        const res: any = await copyProduct(post)
        console.log(res);
        if (+res.code === 1001) {
          successPost()
        }else{
          message.error('复制失败')
        }
        
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onSelectChange=(value)=>{
   console.log(value);
   setOtherProductId(value)
   getListAjax(value)
  }

  const getSelect=async()=>{
    const res:any = await getDivideProducts({
      ...pageData
    });
    console.log(res);
    
    if (+res.code === 1001) {
      setSelectOptions(res.data.list)
    }
  }

  useEffect(() => {
    getSelect();
  }, []);

  return (
    <Modal
      visible={visible}
      width={1200}
      title="复制其他产品配置"
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <div className={styles.modalContainer}>
        {selectedRowKeys?.length > 0 && <div className={styles.top}>
          <div><ExclamationCircleOutlined style={{ marginRight: 6, color: '#ffe49a' }} />请注意！</div>
          <div>
            <div style={{ display: 'flex', 'flexWrap': 'wrap' }}>将同时为以下产品设置管理费分成信息：
					{selectedRowKeys.map((items, indexs) => (
              <div className={styles.item}>
                {items.productName}
                {(selectedRowKeys.length - indexs > 1) ? <span>、</span> : ''}
              </div>
            ))}
            </div></div></div>}
        <div className={styles.header}>
          <div>
            选择被复制产品
						<Select onChange={onSelectChange} style={{width:"200px",marginLeft:"30px"}}>
              {
                selectOptions.map((items)=>{
                   return items==null?'':<Option value={items.productId} >{items.productName}</Option>
                })
              }
            </Select>
          </div>
          {/* <Button type="primary" onClick={handleCreate}>新增</Button> */}
        </div>
        <MXTable
          loading={loading}
          columns={tableColumns}
          dataSource={tableData}
          total={total}
          pageNum={pageData.pageNum}
          onChange={onTableChange}
        />
        {/* <Table
					rowKey="id"
					size="middle"
					bordered
					columns={tableColumns}
					dataSource={tableData}
					pagination={false}
				/> */}
      </div>
    </Modal>
  )
};

export default ProductModal;
