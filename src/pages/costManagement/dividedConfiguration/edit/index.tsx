import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input, Select, Dropdown, message, Popconfirm,Menu } from 'antd';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { exportFileBlob } from '@/utils/fileBlob'
import ProductModal from './ProductModal';
import { getManagerCostDivideListAjax, costDivideListDeleteAjax, getSelectByCondition, costDivideListExportExcelAjax, costDivideListUpdateAjax, costDivideListAddAjax, getSelectSalesman, getChannelsAll } from "../../services";
import { DownOutlined } from '@ant-design/icons';
const { Option } = Select;

const DividedConfigurationDetail: React.FC<{}> = props => {
	const [form] = Form.useForm(); 
	const [total, setTotal] = useState<number>(0);
	const [recordData, setRecordData] = useState<any>({}); 
	const [titleData, setTitleData] = useState<any>({}); 
	const [titleDataMoney, setTitleDataMoney] = useState<any>(''); 
	const [visibleProduct, setVisibleProduct] = useState<boolean>(false)
	const [editingKey, setEditingKey] = useState('');
	const [tableData, setTableData] = useState([]);
	const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
	const [productId, setProductId] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(false);
	const [channelsAll, setChannelsAll] = useState<any>([]);
	const [selectSalesman, setSelectSalesman] = useState<boolean>(false);
	const [pageData, setPageData] = useState<any>({
		// 当前的分页数据
		pageNum: 1
	});
	const [divideObject, setDivideObject] = useState<any>('')
	const [channelName, setChannelName] = useState<string>('')
	const [salesmanName, setSalesmanName] = useState<string>('')
	const [divideRate, setDivideRate] = useState<string>('')

 	const isEditing = record => {
		return record.id === editingKey || record.isCreate;
	};


	const tableColumns = [
		{
			title: '分成对象',
			dataIndex: 'divideObject',
			editable: true,
			align: 'center',
			width: 240,
			render: (text, record) => {
				const editable = isEditing(record);
				return editable ? (
					// <Input
					// 	defaultValue={text}
					// 	onChange={e => setDivideObject(e.target.value)}
					// 	style={{ width: 220 }}
					// />
					<Select
						defaultValue={text}
						onChange={val => setDivideObject(val)}
						style={{ width: 220 }}
					>
						<Option value={1} key={2}>销售人员</Option>
						<Option value={2} key={1}>销售渠道</Option>
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
			width: 200,
			render: (text, record) => {
				const editable = isEditing(record);
				return editable ? (
					<Select
						defaultValue={text}
						onChange={val => setChannelName(val)}
						style={{ width: 220 }}
					>
						{channelsAll.map((item) => (
							<Option value={item.channelId} key={item.channelId}>{item.channelName}</Option>
						))}
					</Select>
				) : (
					<span>{text}</span>
				)
			}
		},
		{
			title: '对应销售人员',
			dataIndex: 'salesmanName',
			editable: true,
			align: 'center',
			width: 200,
			render: (text, record) => {
				const editable = isEditing(record);
				return editable ? (
					<Select
						defaultValue={text}
						onChange={val => setSalesmanName(val)}
						style={{ width: 220 }}
					>
						{selectSalesman.map((item) => (
							<Option value={item.reportSalesmanId} key={item.reportSalesmanId}>{item.salesmanName}</Option>
						))}
					</Select>
				) : (
					<span>{text}</span>
				)
			}
		},
		{
			title: '分成费率',
			dataIndex: 'divideRate',
			editable: true,
			align: 'center',
			width: 240,
			render: (text, record) => {
				const editable = isEditing(record);
				return editable ? (
					<Input
						defaultValue={text}
						type="number"
						min={0}
						max={100}
						suffix="%"
						onChange={e => setDivideRate(e.target.value)}
						style={{ width: 220 }}
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
			width: 240,
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
			width: 200,
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
			title: '操作',
			dataIndex: 'operator',
			align: 'center',
			width: 240,
			render: (text, record) => {
				const editable = isEditing(record);
				return editable ? (
					<>
						<span className={styles.linkBtn} onClick={() => handleSave(record)}>
							保存
						</span>
						<span className={styles.linkBtn} onClick={() => handleCancel(record)} style={{ margin: 0 }}>
							取消
						</span>
					</>
				) : (
					<>
						<span className={styles.linkBtn} onClick={() => handleEdit(record)}>
							编辑
						</span>
							<Popconfirm title="是否确定删除该数据？" onConfirm={() => handleDelete(record)}>
								<span className={styles.delBtn}>删除</span>
							</Popconfirm>

					</>
				);
			}
		}
	];

	const handleChangeSelect = (record,) => {
	 };

	const handleChangeInput = () => { };

	const handleSave = async (record) => {
		if (!divideObject) {
			message.error('请选择分成对象');
			return;
		}
		if (!channelName) {
			message.error('请选择对应渠道');
			return;
		}
		if (!salesmanName) {
			message.error('请选择销售人员');
			return;
		}
		if ( divideRate == '' || divideRate == null || divideRate == undefined) {
			message.error('分成费率必填切不能为0');
			return;
		}
		if (record.isCreate) {
			const divideObjectType = (divideObject == 2) ? '销售人员' : '销售渠道';
			const res:any = await costDivideListAddAjax({
				channelId:channelName,
				divideObject: divideObjectType,
				divideType: divideObject,
				reportSalesmanId: salesmanName,
				divideRate,
				productId: props.match.params.id
			})
			if (+res.code === 1001) {
				getManagementCostDivide();
				message.success(res.message);
			} else {
				message.error(res.message)
			}
		} else { 
			const divideObjectType = (divideObject == 2) ? '销售人员' : '销售渠道';
			const res:any = await costDivideListUpdateAjax({
				divideId: record.divideId,
				channelId: channelName,
				divideObject: divideObjectType,
				divideType: divideObject,
				reportSalesmanId: salesmanName,
				divideRate,
				productId: props.match.params.id
			})
			if (+res.code === 1001) {
				getManagementCostDivide();
				message.success(res.message);
				setEditingKey('');
			} else {
				message.error(res.message)
			}
		}
	};

	const handleCancel = (record) => { 
		if (record.isCreate) {
			let tableDataNew = tableData;
			tableDataNew.shift();
			setTableData(JSON.parse(JSON.stringify(tableDataNew)))
		} else {
			setEditingKey('')
		}
	};

	const handleEdit = (record) => {
		if (tableData[0].isCreate) {
			let tableDataNew = tableData;
			tableDataNew.shift();
			setTableData(JSON.parse(JSON.stringify(tableDataNew)))
		}
		setEditingKey(record.id)
		setChannelName(record.channelId)
		let divideObjectType:any = (record.divideObject =='销售人员')?1:2
		setDivideObject(divideObjectType)
		setSalesmanName(record.reportSalesmanId)
		setDivideRate(record.divideRate)
	 };

	const handleDelete = (record) => {
		let divideIds = [];
		divideIds.push(record.divideId);
		costDivideListDelete(divideIds);
	 };

	const costDivideListDelete = async(divideIds) => {
		const res:any = await costDivideListDeleteAjax({ divideIds })
		if (+res.code === 1001) {
			getManagementCostDivide();
			message.success(res.message)
		} else { 
			message.error(res.message)
		}
	};
	
	const costDivideListExportExcel = async (divideIds) => {
		const res:any = await costDivideListExportExcelAjax({ divideIds, productId })
		exportFileBlob(res.data, '管理费分成配置详情.xls')
		// if (+res.code === 1001) {
		// 	message.success(res.message)
		// 	exportFileBlob(res.data, '管理费分成配置详情.xls')
		// } else {
		// 	message.error(res.message)
		// }
	};

	const handleCreate = () => {
		setEditingKey('')
		setChannelName('')
		setDivideObject('')
		setSalesmanName('')
		setDivideRate('')
		let addtable = {
			isCreate: true
		};
		let tableDataNew = tableData;
		tableDataNew.unshift(addtable);
		setTableData(JSON.parse(JSON.stringify(tableDataNew)));
	 };

	const handleOpenModal = () => {
		setVisibleProduct(true)
	 };

	const handleDeleteAll = () => {
		console.log('selectedRowKeysselectedRowKeys', selectedRowKeys)
		costDivideListDelete(selectedRowKeys);
	 };

	const handleExport = () => { 
		costDivideListExportExcel(selectedRowKeys)
	};
	const handleExportAll = async() => { 
		const res:any = await costDivideListExportExcelAjax()
		exportFileBlob(res.data, '管理费分成配置详情.xls')
	};

	const onTableSelectChange = (values) => {
		setSelectedRowKeys([...values])
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onTableSelectChange
	}

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getManagementCostDivide();
	};

	const getManagementCostDivide = async () => {
		setLoading(true);
		const res:any = await getManagerCostDivideListAjax({
			...pageData,
			productId: +props.match.params.id
		});
		if (+res.code === 1001) {
			setTableData(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};
	const getChannelsAllAjax = async () => {
		const res:any = await getChannelsAll({
		});
		if (+res.code === 1001) {
			setChannelsAll(res.data.list)
		}
	};
	const getSelectSalesmanAjax = async () => {
		const res:any = await getSelectSalesman({
		});
		if (+res.code === 1001) {
			setSelectSalesman(res.data.list)
		}
	};

	const getSelectByConditionAjax = async (e) => {
		const res:any = await getSelectByCondition({
			productId:e
		});
		if (+res.code === 1001 && res.data.list.length>0) {
			setTitleData(res.data.list[0]);
			let money = res.data.list[0]?.manageRate;
			setTitleDataMoney((money * 100).toFixed(2))
		}
	};

	useEffect(() => {
		setProductId(props.match.params.id);
		getManagementCostDivide();
		getChannelsAllAjax();
		getSelectSalesmanAjax();
		setRecordData(JSON.parse(props.location.query.record))
		getSelectByConditionAjax(props.match.params.id);
	}, []); 

	return (
		<PageHeaderWrapper title={'管理费分成配置详情'}>
			<Card>
				<div className={styles.boxItem}>
					<div className={styles.topTitle}>
						<div className={styles.title}>{recordData.productName}</div>
						<div className={styles.toolBar}>
							<span>管理费：{titleDataMoney ? titleDataMoney+'%' : '~~'}&nbsp;&nbsp;生效时间：{titleData?.startTime || '~~'}至{titleData?.endTime || '~~'}</span>
							<div className={styles.btnWrap}>
								<Button
									type="primary"
									className={styles.btn}
									onClick={handleOpenModal}
								>复制其他产品配置</Button>
								<Button
									type="primary"
									className={styles.btn}
									onClick={handleCreate}
								>新增分成</Button>
								{/* <Button
									className={styles.btn}
									onClick={handleExport}
								>批量导出</Button> */}
								<Dropdown
								className={styles.btnBox}
									overlay={<Menu>
										<Menu.Item
											key="1"
											disabled={selectedRowKeys.length === 0}
											onClick={() => handleExport()}
										>
											导出选中
										</Menu.Item>
										<Menu.Item
											key="0"
											onClick={() => handleExportAll()}
										>
											导出全部
										</Menu.Item>
									</Menu>}
								>
									<Button >
										&nbsp;&nbsp;批量导出
										<DownOutlined/>
									</Button>
								</Dropdown>
								<Button
									type="danger"
									onClick={handleDeleteAll}
								>批量删除</Button>
							</div>
						</div>
					</div>
					<div className={styles.wrap}>
						<MXTable
							loading={loading}
							rowSelection={rowSelection}
							columns={tableColumns}
							dataSource={tableData}
							rowKey="divideId"
							total={total}
							pageNum={pageData.pageNum}
							onChange={onTableChange}
							scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
						/>
						{/* <Table
							loading={loading}
							rowKey="id"
							size="middle"
							bordered
							rowSelection={rowSelection}
							columns={tableColumns}
							dataSource={tableData}
							pagination={false}
						/> */}
					</div>
				</div>
				<ProductModal productId={productId} onCancel={() => { 
					setVisibleProduct(false)
				}} visible={visibleProduct} />
			</Card>
		</PageHeaderWrapper>
	)
};

export default DividedConfigurationDetail;