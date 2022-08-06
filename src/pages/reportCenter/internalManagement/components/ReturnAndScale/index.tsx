import React, { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import TableModal from './TableModal';
import { getRelationShipTableList, exportInverstment } from '../../../service';
import { exportFileBlob } from '@/utils/fileBlob'

const ReturnAndScale: React.FC<{}> = props => {
	const [customerName, setCustomerName] = useState('');
	const [modalData, setModalData] = useState({});
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1,
		pageSize: 20,
	});
	const [visible, setVisible] = useState<boolean>(false);
	const [exportLoading, setExportLoading] = useState(false);

	const handleShowModal = data => {
		setVisible(true);
		setModalData(data);
	}

	const tableColumns = [
		{
			title: '姓名',
			dataIndex: 'customerName',
			align: 'center',
			render: (text, record) => <a onClick={() => handleShowModal(record)}>{text}</a>
		},
		{
			title: '投资产品数量',
			dataIndex: 'productNum',
			align: 'center'
		},
		{
			title: '持有产品份额',
			dataIndex: 'latestHolding',
			align: 'center'
		},
		{
			title: '累计净投资总额',
			dataIndex: 'totalInvestment',
			align: 'center'
		},
		{
			title: '当前净资产',
			dataIndex: 'netAssets',
			align: 'center'
		},
		{
			title: '当前绝对收益',
			dataIndex: 'absoluteReturn',
			align: 'center'
		},
		{
			title: '当前绝对收益率',
			dataIndex: 'absoluteRateOfReturn',
			align: 'center'
		},
		{
			title: '当前年化收益率',
			dataIndex: 'annualizedRateOfReturn',
			align: 'center'
		},
		// {
		// 	title: 'IRR内涵收益率',
		// 	dataIndex: 'IRRRate',
		// 	align: 'center'
		// },
		// {
		// 	title: '对内涵收益率进行年化',
		// 	dataIndex: 'annualizedIRRRate',
		// 	align: 'center'
		// }
	];

	const onInputChange = e => {
		setCustomerName(e.target.value);
	};

	const onSearch = () => {
		getReturnAndScaleListAjax();
	};

	const onTableChange = data => {
		const { current, pageSize } = data;
		pageData.pageNum = current;
		pageData.pageSize = pageSize;
		setPageData({ ...pageData });
		getReturnAndScaleListAjax();
	};

	const getReturnAndScaleListAjax = async () => {
		setLoading(true);
		const res = await getRelationShipTableList({
			customerName: customerName,
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	const handleExport = async () => {
		setExportLoading(true);
		const res = await exportInverstment({ customerName, ...pageData })
		console.log(res, 'res值为')
		res?.data && exportFileBlob(res?.data, '客户资产规模排序收益表.xlsx')
		setExportLoading(false);
	}
	useEffect(() => {
		getReturnAndScaleListAjax();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.searchBar}>
				客户名称：
				<Input
					className={styles.inputBox}
					value={customerName}
					onChange={onInputChange}
					placeholder="客户名称"
					style={{ marginRight: 16 }}
				/>
				<Button className={styles.btnBox} type="primary" onClick={onSearch}>
					查询
				</Button>
				<Button className={styles.btnBox} onClick={handleExport} loading={exportLoading}>
					导出
				</Button>
			</div>
			<MXTable
				loading={loading}
				columns={tableColumns}
				dataSource={dataSource}
				rowKey="mainCardNumber"
				total={total}
				pageNum={pageData.pageNum}
				onChange={onTableChange}
				defaultPageSize={10}
			/>
			<TableModal visible={visible} modalData={modalData} onCancel={() => setVisible(false)} />
		</div>
	)
}

export default ReturnAndScale;

