import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input, Select, Table, message } from 'antd';
import styles from './index.less';
import { getManagerCostDivideListAjax, costDivideListDeleteAjax, costDivideListExportExcelAjax, getDivideProducts, costDivideListUpdateAjax, costDivideListAddAjax, getCopyOtherProduct } from "../../services";
import MXTable from '@/pages/components/MXTable';
const { Option } = Select;
const { confirm } = Modal;
const ProductModal: React.FC<{}> = props => {
	const { visible, onCancel, selectedRowKeys } = props;
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState('');
	const [selectProductId, setSelectProductId] = useState('');
	const [tableData, setTableData] = useState([]);
	const [divideProducts, setDivideProducts] = useState<array>([]);
	const [divideObject, setDivideObject] = useState<string>('')
	const [channelName, setChannelName] = useState<string>('')
	const [salesmanName, setSalesmanName] = useState<string>('')
	const [divideRate, setDivideRate] = useState<string>('')
	const [total, setTotal] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(false);
	const [pageData, setPageData] = useState<object>({
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
					<span>{text}</span>
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
					<span>{text}</span>
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

	const handleSave = async(record) => {
		if (record.isCreate) {
			const res = await costDivideListAddAjax({
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
			const res = await costDivideListUpdateAjax({
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
		getListAjax();
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
		const res = await costDivideListDeleteAjax({ divideIds })
		if (+res.code === 1001) {
			// getManagementCostDivide();
			message.success(res.message)
		} else {
			message.error(res.message)
		}
	};
	const handleCreate = () => {
		setChannelName(record.channelName)
		setDivideObject(record.divideObject)
		setSalesmanName(record.salesmanName)
		setDivideRate(record.divideRate)
		let addtable = {
			isCreate: true
		};
		let tableDataNew = tableData;
		tableDataNew.unshift(addtable);
		setTableData(JSON.parse(JSON.stringify(tableDataNew)));
	};

	const getListAjax = async () => { 
		setLoading(true)
		const res = await getManagerCostDivideListAjax({
			...pageData,
			productId: selectProductId
		});
		if (+res.code === 1001) { 
			setTableData(res.data.list)
			setTotal(res.data.total);
		}
		setLoading(false)
	}

	const getDivideProductsAjax = async () => {
		setLoading(true)
		const res = await getDivideProducts({
		});
		if (+res.code === 1001) {
			setDivideProducts(res.data.list)
		}
		setLoading(false)
	}

	const getCopyOtherProductAjax = async () => { 
		let chooseProductIds = props.productId
		chooseProductIds = +chooseProductIds
		const res = await getCopyOtherProduct({
			otherProductId: selectProductId,
			chooseProductIds: [chooseProductIds]
		})
		if (+res.code === 1001) {
			message.success(res.message)
			onCancel();
		} else { 
			message.error(res.message)
		}
	}

	const handleSubmit = () => { 
		confirm({
			title: '确认复制管理费分成配置吗？完成后产品配置将全部清空',
			// content: 'Some descriptions',
			onOk() {
				getCopyOtherProductAjax();
			},
			onCancel() {
				console.log('Cancel');
			},
		});
	}; 

	useEffect(() => {
		getListAjax();
	}, [selectProductId]);

	useEffect(() => {
		getDivideProductsAjax();
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
				{selectedRowKeys?.length > 0 && <div >
					<div>请注意！</div>
					<div>
						<div style={{display:'flex'}}>将同时为以下产品设置管理费成分信息：
					{selectedRowKeys.map((items, indexs) => (
						<div >
							{items}
							{(selectedRowKeys.length-indexs>1) ? <span>、</span>:''}
						</div>
					))}
						</div></div></div>}
				<div className={styles.header}>
					<div style={{paddingBottom:24}}>
						选择被复制产品
						<Select style={{ width: 300 }} onChange={val => setSelectProductId(val)}>
							{divideProducts.map((item) => (
								<Option value={item?.productId} key={item?.productId}>{item?.productName}</Option>
							))}
						{/* <Select >
							<Option>ss</Option> */}
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
