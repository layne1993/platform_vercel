import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input, Select, DatePicker, Table, message, Statistic } from 'antd';
import styles from './index.less';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { exportFileBlob } from '@/utils/fileBlob';
import { queryFeeDetailHeaderAjax, queryFeeDetailListAjax, exportFeeDetailByAll } from "../../services";

const { Option } = Select;
const { RangePicker } = DatePicker;
const customTypeSource = [
	{
		value: 1,
		label: '个人'
	},
	{
		value: 2,
		label: '机构'
	},
	{
		value: 3,
		label: '产品'
	}
];
const TransactionOwnershipEdit: React.FC<{}> = props => {
	const [currentId, setCurrentId] = useState('');
	const [currentParams, setCurrentParams] = useState('');
	const [searchParams, setSearchParams] = useState<object>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1,
	});
	const [totalData, setTotalData] = useState({});

	const tableColumns = [
		{
			title: '管理费生成日期',
			dataIndex: 'generatedDate',
			align: 'center',
			render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
		},
		{
			title: '客户名称',
			dataIndex: 'customerName',
			align: 'center',
		},
		{
			title: '累计管理费',
			dataIndex: 'sumCusManageFee',
			align: 'center'
		},
		{
			title: '累计占比',
			dataIndex: 'sumProportion',
			align: 'center',
		},
		{
			title: '当季管理费',
			dataIndex: 'quarterCusManageFee',
			align: 'center',
		},
		{
			title: '当季占比',
			dataIndex: 'quarterProportion',
			align: 'center',
		},
		{
			title: '当日管理费',
			dataIndex: 'toDayManageFee',
			align: 'center',
		},
		{
			title: '当日占比',
			dataIndex: 'toDayProportion',
			align: 'center',
		},
		{
			title: '客户类别',
			dataIndex: 'customerType',
			align: 'center',
			render: text => {
				let tradeItem = customTypeSource.find(item => item.value == text);
				if (tradeItem) {
					return <span>{tradeItem.label}</span>
				} else {
					return <span></span>
				}
			}
		},
		{
			title: '证件号码',
			dataIndex: 'cardNumber',
			align: 'center',
		},
		{
			title: '所属销售人员',
			dataIndex: 'salesmanName',
			align: 'center',
		}
	];

	const onInputChange = (e, type) => {
		searchParams[type] = e.target.value;
		setSearchParams({ ...searchParams });
	};

	const onSelectChange = (val, type) => {
		searchParams[type] = val;
		setSearchParams({ ...searchParams });
	};

	const onRangeChange = (date, dateStr) => {
		searchParams.manageFeeDateStart = dateStr[0];
		searchParams.manageFeeDateEnd = dateStr[1];
		setSearchParams({ ...searchParams });
	};

	const onExport = async () => {
		const res = await exportFeeDetailByAll({ ...currentParams });
		exportFileBlob(res.data, '管理费明细测算.xls')
	};

	const onSearch = () => {
		getDataTableList(currentParams);
	};

	const onRest = () => {
		for (let key in searchParams) {
			searchParams[key] = '';
		}
		setSearchParams({ ...searchParams });
		getDataTableList(currentParams);
	};

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getDataTableList(currentParams);
	};

	const getTableHeader = async productShare => {
		const res = await queryFeeDetailHeaderAjax({
			...searchParams,
			productShare
		});
		if (+res.code === 1001) {
			setTotalData(res.data);
		}
	};

	const getDataTableList = async currentParams => {
		let obj = {};
		for (let key in searchParams) {
			if (searchParams[key] || searchParams[key] === 0) {
				obj[key] = searchParams[key];
			}
		}
		setLoading(true);
		const res = await queryFeeDetailListAjax({
			...obj,
			...pageData,
			...currentParams
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	const handleFresh = () => {
		getTableHeader(currentParams.productShare);
		getDataTableList(currentParams);
	}

	useEffect(() => {
		const { id } = props.match.params;
		const recordStr = window.sessionStorage.getItem('productFee');
		const recordData = recordStr ? JSON.parse(recordStr) : {};
		let params = {
			productId: id,
			manageFeeRate: recordData.manageFeeRate,
			netAssetValue: recordData.netAssetValue,
			productShare: recordData.productShare,
			sumManageFee: recordData.sumManageFee,
			quarterSumManageFee: recordData.quarterSumManageFee,
			productName: recordData.productName
		}
		setCurrentParams(params);
		setCurrentId(id);
		getTableHeader(recordData.productShare);
		getDataTableList(params);
	}, []);

	return (
		<PageHeaderWrapper title={'产品管理费明细测算'}>
			<Card>
				<div className={styles.boxItem}>
					<div className={styles.topTitle}>
						<div className={styles.title}>
							{currentParams?.productName}
							<span className={styles.tip}>( {`管理费率 ${currentParams?.manageFeeRate}  -  成立日 至 清算日`} )</span>
						</div>
						<div className={styles.searchBar} style={{ justifyContent: 'space-between', paddingRight: 120 }}>
							<Statistic title="份额占比总和" value={totalData?.shareRate} />
							<Statistic title="累计管理费" value={totalData?.allSumManageFee} />
							<Statistic title="当季管理费" value={totalData?.allQuarterManageFeeSum} />
							<Statistic title="查询结果-总管理费" value={totalData?.totalManagementFee} />
						</div>
						<div className={styles.searchBar}>
							管理费日期：
							<RangePicker
								className={styles.inputBox}
								value={[
									searchParams.manageFeeDateStart ? moment(searchParams.manageFeeDateStart) : null,
									searchParams.manageFeeDateEnd ? moment(searchParams.manageFeeDateEnd) : null
								]}
								onChange={onRangeChange}
								style={{ marginRight: 16, width: 260 }}
							/>
							客户类型：
							<Select
								className={styles.inputBox}
								value={searchParams.customerType}
								onChange={val => onSelectChange(val, 'customerType')}
								placeholder="请选择"
								style={{ marginRight: 16 }}
								allowClear
							>
								<Option value={1}>个人</Option>
								<Option value={2}>机构</Option>
								<Option value={3}>产品</Option>
							</Select>
							客户名称：
							<Input
								className={styles.inputBox}
								value={searchParams.customerName}
								onChange={e => onInputChange(e, 'customerName')}
								placeholder="请选择名称"
								style={{ marginRight: 16 }}
							/>
							销售人员名称：
							<Input
								className={styles.inputBox}
								value={searchParams.salesmanName}
								onChange={e => onInputChange(e, 'salesmanName')}
								placeholder="请选择名称"
								style={{ marginRight: 16 }}
							/>
							销售人员身份证：
							<Input
								className={styles.inputBox}
								value={searchParams.salesmanNum}
								onChange={e => onInputChange(e, 'salesmanNum')}
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
							<span className={styles.titleTip}>数据生成时间： {moment().format('YYYY-MM-DD HH:mm:ss')}</span>
							<Button className={styles.btnBox} type="primary" onClick={handleFresh}>
								重新测算管理费
							</Button>
							<Button className={styles.btnBox} onClick={onExport}>
								导出
							</Button>
						</div>
						<MXTable
							loading={loading}
							columns={tableColumns}
							dataSource={dataSource}
							rowKey="key"
							total={total}
							pageNum={pageData.pageNum}
							onChange={onTableChange}
						/>
					</div>
				</div>
			</Card>
		</PageHeaderWrapper>
	)
};

export default TransactionOwnershipEdit;