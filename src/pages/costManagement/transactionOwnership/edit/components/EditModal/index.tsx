import React, { useState, useEffect } from "react";
import { Modal, Select, message } from 'antd';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import styles from './index.less';
import { getTradeCustomers, getChannelList, getSalemanList, updateTradeData } from '../../../../services';

const { Option } = Select;

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

const EditModal: React.FC<{}> = props => {
	const { visible, productId, productName, editParams, onCancel, onSunbmit } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1
	});
	const [channelSource, setChannelSource] = useState<array>([]);
	const [salesmanSource, setSalesmanSource] = useState<array>([]);
	const [newChannel, setNewChannel] = useState({});
	const [newSalesman, setNewSalesman] = useState({});

	const tableColumns = [
		{
			title: '客户名称',
			dataIndex: 'customerName',
			align: 'center'
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
		}
	];

	const handleSubmit = () => {
		if (newChannel.newChannelId || newSalesman.newSalesmanId) {
			let oldParams;
			if (editParams.importantIdsParams?.length) {
				oldParams = { ...editParams };
			} else {
				oldParams = {
					productId: editParams.productId,
					importantIdsParams: [
						{
							customerId: editParams.customerId,
							tradeRecordId: editParams.tradeRecordId,
							tradeLocationId: editParams.tradeLocationId
						}
					]
				}
			}
			let params = { ...newSalesman, ...newChannel, ...oldParams, productName };
			handleUpdate(params);
		} else {
			message.error('请选择数据');
		}
	};

	const handleUpdate = async data => {
		const res = await updateTradeData(data);
		if (+res.code === 1001) {
			message.success('修改成功');
			onSunbmit();
		} else {
			message.error('修改失败');
		}
		setNewSalesman({});
		setNewChannel({});
	};

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getDataTableList();
	};

	const getDataTableList = async () => {
		setLoading(true);
		const res = await getTradeCustomers({
			...pageData,
			...editParams
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	const getChannelSource = async () => {
		const res = await getChannelList();
		if (+res.code === 1001) {
			setChannelSource(res.data.list);
		}
	};

	const getSalemanSource = async () => {
		const res = await getSalemanList();
		if (+res.code === 1001) {
			setSalesmanSource(res.data.list);
		}
	};

	const handleChangeChannel = (val, option) => {
		setNewChannel({
			newChannelName: option.children,
			newChannelId: val
		});
	}

	const handleChangeSalesman = (val, option) => {
		setNewSalesman({
			newSalesmanName: option.children,
			newSalesmanId: val
		});
	}

	useEffect(() => {
		if (visible) {
			getDataTableList();
			getChannelSource();
			getSalemanSource();
		}
	}, [visible]);

	return (
		<Modal title="修改交易归属" visible={visible} width={1200} onOk={handleSubmit} onCancel={onCancel}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.item}>
						销售渠道修改为：
						<Select value={newChannel?.newChannelId} className={styles.selectBox} onChange={handleChangeChannel}>
							{channelSource.map(item => <Option value={item.channelId} key={item.channelId}>{item.channelName}</Option>)}
						</Select>
					</div>
					<div className={styles.item}>
						销售人员修改为：
						<Select value={newSalesman?.newSalesmanId} className={styles.selectBox} onChange={handleChangeSalesman}>
							{salesmanSource.map(item => <Option value={item.reportSalesmanId} key={item.reportSalesmanId}>{item.salesmanName}</Option>)}
						</Select>
					</div>
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
		</Modal>
	)
};

export default EditModal;
