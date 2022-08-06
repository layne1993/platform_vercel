import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input, Select, DatePicker, Table, message } from 'antd';
import styles from './index.less';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import EditModal from './components/EditModal';
import { getTradeCustomers } from "../../services";
import RecordModal from './components/RecordModal';
import RateModal from './components/RateModal';

const { Option } = Select;
const { RangePicker } = DatePicker;

const tradeTypeSource = [
	{
		value: 1,
		label: '认购'
	},
	{
		value: 2,
		label: '申购'
	},
	{
		value: 3,
		label: '赎回'
	},
	{
		value: 4,
		label: '强制调增'
	},
	{
		value: 5,
		label: '强制调减'
	},
	{
		value: 6,
		label: '非交易过户转出'
	},
	{
		value: 7,
		label: '非交易过户转入'
	},
	{
		value: 8,
		label: '基金成立'
	},
	{
		value: 9,
		label: '业绩计提'
	}
];
const TransactionOwnershipEdit: React.FC<{}> = props => {
	const [currentId, setCurrentId] = useState<string>('');
	const [currentName, setCurrentName] = useState<string>('');
	const [searchParams, setSearchParams] = useState<object>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState<array>([]);
	const [recordVisible, setRecordVisible] = useState<boolean>(false);
	const [editVisible, setEditVisible] = useState<boolean>(false);
	const [rateVisible, setRateVisible] = useState<boolean>(false);
	const [editParams, setEditParams] = useState({});

	const tableColumns = [
		{
			title: '客户名称',
			dataIndex: 'customerName',
			align: 'center',
		},
		{
			title: '交易类型',
			dataIndex: 'tradeType',
			align: 'center',
			render: text => {
				let tradeItem = tradeTypeSource.find(item => item.value === text);
				if (tradeItem) {
					return <span>{tradeItem.label}</span>
				} else {
					return <span></span>
				}
			}
		},
		{
			title: '确认日期',
			dataIndex: 'tradeTime',
			align: 'center',
			render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>
		},
		{
			title: '确认金额',
			dataIndex: 'tradeMoney',
			align: 'center',
		},
		{
			title: '确认份额',
			dataIndex: 'tradeShare',
			align: 'center',
		},
		{
			title: '销售渠道',
			dataIndex: 'channelName',
			align: 'center',
			render: (text, record) => <span>{text ? `${text}-${record.channelId}` : ''}</span>
		},
		{
			title: '销售人员',
			dataIndex: 'salesmanName',
			align: 'center',
			render: (text, record) => <span>{text ? `${text}-尾号${record.salesmanNum.substring(record.salesmanNum.length - 4)}` : ''}</span>
		},
		{
			title: '最近修改时间',
			dataIndex: 'updateTime',
			align: 'center',
			render: text => <span>{text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : null}</span>
		},
		{
			title: '最近修改人',
			dataIndex: 'userName',
			align: 'center',
		},
		{
			title: '操作',
			align: 'center',
			render(data) {
				return (
					<span className={styles.editBtn} onClick={() => onEdit(data)}>修改销售归属</span>
				);
			}
		}
	];

	const onEdit = data => {
		let params = {
			productId: currentId,
			customerId: data.customerId,
			tradeRecordId: data.tradeRecordId,
			tradeLocationId: data.tradeLocationId
		}
		setEditParams(params);
		setEditVisible(true);
	};

	const onRecordModal = () => {
		setRecordVisible(true);
	};

	const onEditModalByTotal = () => {
		if (selectedRowKeys.length) {
			let params = {
				productId: currentId,
				importantIdsParams: []
			}
			for (let val of selectedRowKeys) {
				let obj = dataSource.find(item => item.tradeRecordId === val);
				let paramObj = {
					tradeRecordId: val,
					customerId: obj.customerId,
					tradeLocationId: obj.tradeLocationId,
				};
				params.importantIdsParams.push(paramObj);
			}
			setEditParams(params);
			setEditVisible(true);
		} else {
			message.error('请先选择数据')
		}
	};

	const handleEditSubmit = () => {
		setEditVisible(false);
		getDataTableList(currentId);
	}

	const onRateModal = () => {
		setRateVisible(true);
	};

	const onInputChange = (e, type) => {
		searchParams[type] = e.target.value;
		setSearchParams({ ...searchParams });
	};

	const onSelectChange = (val, type) => {
		searchParams[type] = val;
		setSearchParams({ ...searchParams });
	};

	const onRangeChange = (date, dateStr) => {
		searchParams.startTime = dateStr[0];
		searchParams.endTime = dateStr[1];
		setSearchParams({ ...searchParams });
	};

	const onSearch = () => {
		getDataTableList(currentId);
	};

	const onRest = () => {
		for (let key in searchParams) {
			searchParams[key] = '';
		}
		setSearchParams({ ...searchParams });
		getDataTableList(currentId);
	};

	const onTableSelectChange = (values) => {
		setSelectedRowKeys([...values])
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onTableSelectChange
	};

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getDataTableList(currentId);
	};

	const getDataTableList = async (id) => {
		let obj = {};
		for (let key in searchParams) {
			if (searchParams[key] || searchParams[key] === 0) {
				obj[key] = searchParams[key];
			}
		}
		setLoading(true);
		const res = await getTradeCustomers({
			productId: id,
			...obj,
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	useEffect(() => {
		const { id } = props.match.params;
		const { productName } = props.location.query;
		setCurrentId(id);
		setCurrentName(productName);
		getDataTableList(id);
	}, []);

	return (
		<PageHeaderWrapper title={'交易归属详情'}>
			<Card>
				<div className={styles.boxItem}>
					<div className={styles.topTitle}>
						<div className={styles.title}>{currentName}</div>
						<div className={styles.searchBar}>
							客户名称：
							<Input
								className={styles.inputBox}
								value={searchParams.customerName}
								onChange={e => onInputChange(e, 'customerName')}
								placeholder="请选择名称"
								style={{ marginRight: 16 }}
							/>
							交易类型：
							<Select
								className={styles.inputBox}
								value={searchParams.tradeType}
								onChange={val => onSelectChange(val, 'tradeType')}
								placeholder="请选择"
								style={{ marginRight: 16 }}
							>
								{tradeTypeSource.map(item => <Option value={item.value} key={item.value}>{item.label}</Option>)}
							</Select>
							确认日期：
							<RangePicker
								className={styles.inputBox}
								value={[
									searchParams.startTime ? moment(searchParams.startTime) : null,
									searchParams.endTime ? moment(searchParams.endTime) : null
								]}
								onChange={onRangeChange}
								style={{ marginRight: 16, width: 260 }}
							/>
							销售渠道：
							<Input
								className={styles.inputBox}
								value={searchParams.channelName}
								onChange={e => onInputChange(e, 'channelName')}
								placeholder="请选择名称"
								style={{ marginRight: 16 }}
							/>
							销售人员：
							<Input
								className={styles.inputBox}
								value={searchParams.salesmanName}
								onChange={e => onInputChange(e, 'salesmanName')}
								placeholder="请选择名称"
								style={{ marginRight: 16 }}
							/>
							<Button className={styles.btnBox} type="primary" onClick={onSearch}>
								查询
							</Button>
							<Button className={styles.btnBox} onClick={onRest}>
								重置
							</Button>
						</div>
						<div className={styles.searchBar}>
							<span className={styles.titleTip}>人工维护归属<b>{total}</b>条</span>
							<Button className={styles.btnBox} type="primary" onClick={onRecordModal}>
								修改记录查询
							</Button>
							<Button className={styles.btnBox} type="primary" onClick={onEditModalByTotal} disabled={!selectedRowKeys.length}>
								批量修改销售归属
							</Button>
							<Button className={styles.btnBox} type="primary" onClick={onRateModal}>
								修改管理费率
							</Button>
						</div>
						<MXTable
							loading={loading}
							rowSelection={rowSelection}
							columns={tableColumns}
							dataSource={dataSource}
							rowKey="tradeRecordId"
							total={total}
							pageNum={pageData.pageNum}
							onChange={onTableChange}
						/>
					</div>
				</div>
				<RateModal visible={rateVisible} productId={currentId} onCancel={() => setRateVisible(false)} onSubmit={() => setRateVisible(false)} />
				<EditModal
					visible={editVisible}
					productId={currentId}
					productName={currentName}
					editParams={editParams}
					onSunbmit={handleEditSubmit}
					onCancel={() => setEditVisible(false)}
				/>
				<RecordModal visible={recordVisible} onCancel={() => setRecordVisible(false)} />
			</Card>
		</PageHeaderWrapper>
	)
};

export default TransactionOwnershipEdit;