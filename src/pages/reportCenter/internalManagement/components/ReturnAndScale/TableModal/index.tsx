import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { getModalListById } from '../../../../service';

const TableModal: React.FC<{}> = props => {
	const { visible, modalData, onCancel } = props;

	const [modalDataId, setModalDataId] = useState('');
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1,
		pageSize: 10,
	});

	const tableColumns = [
		{
			title: '产品名称',
			dataIndex: 'productName',
			align: 'center'
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
	]

	const onTableChange = data => {
		const { current, pageSize } = data;
		pageData.pageNum = current;
		pageData.pageSize = pageSize;
		setPageData({ ...pageData });
		getModalListAjax(modalDataId);
	}

	const getModalListAjax = async id => {
		setLoading(true);
		const res = await getModalListById({
			customerId: id,
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (visible && modalData?.customerId) {
			setModalDataId(modalData.customerId);
			getModalListAjax(modalData.customerId);
		}
	}, [visible, modalData]);

	return (
		<Modal
			visible={visible}
			width="1200px"
			title={`${modalData?.customerName}资产一览表`}
			onCancel={onCancel}
			footer={null}
			bodyStyle={{ padding: 0 }}
		>
			<div className={styles.container}>
				<MXTable
					loading={loading}
					columns={tableColumns}
					dataSource={dataSource}
					rowKey="mainCardNumber"
					total={total}
					pageNum={pageData.pageNum}
					onChange={onTableChange}
				/>
			</div>
		</Modal>
	)
}

export default TableModal;
