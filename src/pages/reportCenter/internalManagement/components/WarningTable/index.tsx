import React, { useEffect, useState } from 'react';
import { Card, Input, Button } from 'antd';

import TableList from './TableList/index';

import { getProductReward, getProductRewardByName } from '../../../service';

import styles from './index.less';

const InternalManagement: React.FC<{}> = (props) => {
	const [condition, setcondition] = useState<string>('');
	const [loading, setloading] = useState<boolean>(false);
	const [dataSource, setdataSource] = useState<array>([]);
	const [total, settotal] = useState<number>(0);

	const [pageData, setpageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1,
		pageSize: 20
	});

	const onInputChange = (value) => {
		setcondition(value.target.value);
	};

	const onSearch = async () => {
		getProductRewardByNameAjax();
	};

	const onRest = () => {
		setcondition('');
		getProductRewardByNameAjax();
	};

	const onTableChange = (data) => {
		console.log(data, 'data值为')
		const { current, pageSize } = data;
		pageData.pageNum = current;
		pageData.pageSize = pageSize;
		setpageData({ ...pageData });
		getProductRewardByNameAjax();
	};

	useEffect(() => {
		// getProductRewardAjax()
		getProductRewardByNameAjax();
	}, []);

	const getProductRewardByNameAjax = async () => {
		setloading(true);
		const res = await getProductRewardByName({
			nameOrCode: condition,
			...pageData
		});
		if (+res.code === 1001) {
			setdataSource(res.data.list);
			settotal(res.data.total);
		}
		setloading(false);
		console.log(res, 'res');
	};

	return (
		<div className={styles.container}>
			<div className={styles.searchBox}>
				产品搜索：
				<Input className={styles.inputBox} value={condition} onChange={onInputChange} placeholder="请输入产品名称或代码" />
				<Button className={styles.btnBox} type="primary" onClick={onSearch}>查询</Button>
				<Button className={styles.btnBox} onClick={onRest}>重置</Button>
			</div>

			<TableList loading={loading} onChange={onTableChange} dataSource={dataSource} total={total}></TableList>
		</div>
	);
};

export default InternalManagement;
