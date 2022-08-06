import React, { useEffect, useState } from 'react';
import {Card} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { selectLogs } from '../../service';

const DownRecord: React.FC<{}> = props => {
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
			title: '公司名称',
			dataIndex: 'companyName',
			align: 'center',
		},
		{
			title: '用户名',
			dataIndex: 'userName',
			align: 'center',
		},
		{
			title: '操作时间',
			dataIndex: 'operatingTime',
			align: 'center',
		},
    {
			title: '操作类型',
			dataIndex: 'operation',
			align: 'center',
		}
	];

	const onTableChange = data => {
		const { current, pageSize } = data;
    pageData.pageNum = current;
    pageData.pageSize = pageSize;
		setPageData({ ...pageData });
		getselectLogs();
	};

	const getselectLogs = async () => {
		setLoading(true);
		const res = await selectLogs({
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	useEffect(() => {
		getselectLogs();
	}, []);

	return (
		<PageHeaderWrapper title={'下载记录'}>
		<Card>
		<div className={styles.container}>
			<MXTable
				loading={loading}
				columns={tableColumns}
				dataSource={dataSource}
				rowKey="operatingTime"
				total={total}
				pageNum={pageData.pageNum}
				onChange={onTableChange}
			/>
		</div>
		</Card>
		</PageHeaderWrapper>
	);
};

export default DownRecord;
