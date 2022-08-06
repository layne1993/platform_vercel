import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Form, Input, Select, DatePicker, Table, message, Statistic } from 'antd';
import styles from './index.less';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { queryFeeDevideTableAjax, queryFeeDevideListAjax, exportFeeDevide } from "../../services";
import { exportFileBlob } from '@/utils/fileBlob'

const { Option } = Select;
const { RangePicker } = DatePicker;

const TransactionOwnershipEdit: React.FC<{}> = props => {
	const [currentId, setCurrentId] = useState('');
	const [searchParams, setSearchParams] = useState<object>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1
	});
	const [totalData, setTotalData] = useState({});

	const tableColumns = [
		{
			title: '管理费生成日期',
			dataIndex: 'productOperationDate',
			align: 'center',
			render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
		},
		{
			title: '分成对象',
			dataIndex: 'divideObject',
			align: 'center',
		},
		{
			title: '所属销售渠道',
			dataIndex: 'channelName',
			align: 'center',
		},
		{
			title: '所属销售人员',
			dataIndex: 'salesmanName',
			align: 'center',
		},
		{
			title: '累计分成',
			dataIndex: 'sumManageFeedivide',
			align: 'center',
		},
		{
			title: '累计占比',
			dataIndex: 'sumProportion',
			align: 'center',
		},
		{
			title: '当季分成',
			dataIndex: 'quarterSumManageFeedivide',
			align: 'center',
		},
		{
			title: '当季占比',
			dataIndex: 'quarterProportion',
			align: 'center',
		},
		{
			title: '当日分成',
			dataIndex: 'todayManageFeedivide',
			align: 'center',
		},
		{
			title: '当日占比',
			dataIndex: 'todayProportion',
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
		searchParams.foundingDateStart = dateStr[0];
		searchParams.foundingDateEnd = dateStr[1];
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

	const onExport = async () => {
		const res: any = await exportFeeDevide({
			productId: currentId
		})
		exportFileBlob(res.data, '管理费分成测算.xls')
	};

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getDataTableList(currentId);
	};

	const getPageTotalData = async id => {
		const res = await queryFeeDevideListAjax({
			productId: id
		});
		if (+res.code === 1001) {
			setTotalData(res.data);
		}
	}

	const getDataTableList = async id => {
		let obj = {};
		for (let key in searchParams) {
			if (searchParams[key] || searchParams[key] === 0) {
				obj[key] = searchParams[key];
			}
		}
		setLoading(true);
		const res = await queryFeeDevideTableAjax({
			...obj,
			...pageData,
			productId: id
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	const handleFresh = () => {
		getPageTotalData(currentId);
		getDataTableList(currentId);
	}

	useEffect(() => {
		const { id } = props.match.params;
		setCurrentId(id);
		getPageTotalData(id);
		getDataTableList(id);
	}, []);

	return (
		<PageHeaderWrapper title={'产品管理费分成测算'}>
			<Card>
				<div className={styles.boxItem}>
					<div className={styles.topTitle}>
						<div className={styles.title}>
							产品名称 - 募集状态
						</div>
						<div className={styles.searchBar} style={{ justifyContent: 'space-between', paddingRight: 120 }}>
							<Statistic title="累计管理费" value={totalData?.sumManageFee ?? 0} />
							<Statistic title="累计管理费分成" value={totalData?.sumManageFeedivide ?? 0} />
							<Statistic title="累计销售渠道管理费分成" value={totalData?.channelManagementFeeDivide ?? 0} />
							<Statistic title="累计销售人员管理费分成" value={totalData?.salesmanManagementFeeDivide ?? 0} />
							<Statistic title="当季管理费分成" value={totalData?.quarterDivided ?? 0} />
						</div>
						<div className={styles.searchBar} style={{ justifyContent: 'space-between', paddingRight: 120 }}>
							<Statistic title="分成渠道" value={totalData?.channelNum ?? 0} suffix="个" />
							<Statistic title="分成销售" value={totalData?.salesmanNum ?? 0} suffix="人" />
							<Statistic title="查询结果-管理费分成" value={totalData?.conditionFeeDivide ?? 0} />
							<Statistic title="查询结果-分成渠道" value={totalData?.conditionChannelNum ?? 0} suffix="个" />
							<Statistic title="查询结果-分成销售" value={totalData?.conditionSalesmanNum ?? 0} suffix="人" />
						</div>
						<div className={styles.searchBar}>
							管理费日期：
							<RangePicker
								className={styles.inputBox}
								value={[
									searchParams.foundingDateStart ? moment(searchParams.foundingDateStart) : null,
									searchParams.foundingDateEnd ? moment(searchParams.foundingDateEnd) : null
								]}
								onChange={onRangeChange}
								style={{ marginRight: 40, width: 260 }}
							/>
							分成对象类型：
							<Select
								className={styles.inputBox}
								value={searchParams.divideType}
								onChange={val => onSelectChange(val, 'divideType')}
								placeholder="请选择"
								style={{ marginRight: 40 }}
								allowClear
							>
								<Option value={1}>销售渠道</Option>
								<Option value={2}>销售人员</Option>
							</Select>
							销售渠道名称：
							<Input
								className={styles.inputBox}
								value={searchParams.channelName}
								onChange={e => onInputChange(e, 'channelName')}
								placeholder="请选择名称"
								style={{ marginRight: 40 }}
							/>
							销售渠道编码：
							<Input
								className={styles.inputBox}
								value={searchParams.channelId}
								onChange={e => onInputChange(e, 'channelId')}
								placeholder="请选择名称"
								style={{ marginRight: 40 }}
							/>
						</div>
						<div className={styles.searchBar}>
							销售人员名称：
							<Input
								className={styles.inputBox}
								value={searchParams.salesmanName}
								onChange={e => onInputChange(e, 'salesmanName')}
								placeholder="请选择名称"
								style={{ marginRight: 40 }}
							/>
							销售人员身份证：
							<Input
								className={styles.inputBox}
								value={searchParams.salesmanNum}
								onChange={e => onInputChange(e, 'salesmanNum')}
								placeholder="请选择名称"
								style={{ marginRight: 40 }}
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