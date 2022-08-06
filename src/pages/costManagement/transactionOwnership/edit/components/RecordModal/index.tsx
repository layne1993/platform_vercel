import React, { useState, useEffect } from "react";
import { Modal } from 'antd';
import MXTable from '@/pages/components/MXTable';
import moment from 'moment';
import { getTradeHisotry } from '../../../../services';

const RecordModal: React.FC<{}> = props => {
	const { visible, onCancel } = props;

	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1
	});

	const tableColumns = [
		{
			title: '操作时间',
			dataIndex: 'updateTime',
			align: 'center',
			render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : null}</span>
		},
		{
			title: '操作人',
			dataIndex: 'userName',
			align: 'center',
		},
		{
			title: '操作内容',
			dataIndex: 'content',
			align: 'center',
		},
	];

	const onTableChange = data => {
		const { current } = data;
		pageData.pageNum = current;
		setPageData({ ...pageData });
		getDataTableList();
	};

	const getDataTableList = async () => {
		setLoading(true);
		const res = await getTradeHisotry({
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (visible) {
			getDataTableList();
		}
	}, [visible]);

	return (
		<Modal title="产品交易归属修改记录" visible={visible} width={1200} footer={null} onCancel={onCancel}>
			<MXTable
				loading={loading}
				columns={tableColumns}
				dataSource={dataSource}
				rowKey="key"
				total={total}
				pageNum={pageData.pageNum}
				onChange={onTableChange}
			/>
		</Modal>
	)
}

export default RecordModal;
