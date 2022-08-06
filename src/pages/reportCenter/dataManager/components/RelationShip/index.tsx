import React, { useEffect, useState } from 'react';
import { Input, Button, message } from 'antd';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import RelationModal from './RelationModal';
import {
	getRelationShipTableList,
	saveCustomerCorrelation,
	editCustomerRelation,
	deteleCustomerRelation
} from '../../service';

const RelationShip: React.FC<{}> = props => {
	const [searchParams, setSearchParams] = useState<object>({});
	const [loading, setLoading] = useState<boolean>(false);
	const [dataSource, setDataSource] = useState<array>([]);
	const [total, setTotal] = useState<number>(0);
	const [pageData, setPageData] = useState<object>({
		// 当前的分页数据
		pageNum: 1,
		pageSize: 10,
	});
	const [selectedRowKeys, setSelectedRowKeys] = useState<array>([]);
	const [editFlag, setEditFlag] = useState('create');
	const [relationVisible, setRelationVisible] = useState(false);
	const [modalData, setModalData] = useState({});

	const tableColumns = [
		{
			title: '主客户名称',
			dataIndex: 'mainCustomerName',
			align: 'center',
		},
		{
			title: '客户证件号',
			dataIndex: 'mainCardNumber',
			align: 'center',
		},
		{
			title: '子账户数量',
			dataIndex: 'childCustomerNum',
			align: 'center',
		},
		{
			title: '操作',
			align: 'center',
			render(data) {
				return (
					<Button
						type="link"
						onClick={() => onEdit(data)}
					>
						编辑
					</Button>
				);
			}
		}
	];

	const onEdit = async data => {
		const res = await editCustomerRelation({ mainCardNumber: data.mainCardNumber });
		if (+res.code === 1001) {
			setModalData({
				mainCardNumber: res.data.mainCardNumber,
				childCustomerArray: res.data.childCustomerArray
			});
			setEditFlag('edit');
			setRelationVisible(true);
		}
	};

	const onInputChange = e => {
		searchParams['customerName'] = e.target.value;
		searchParams['mainCardNumber'] = e.target.value;
		setSearchParams({ ...searchParams });
	};

	const onSearch = () => {
		getRelationShipTableListAjax();
	};

	const onRest = () => {
		searchParams.customerName = '';
		searchParams.mainCardNumber = '';
		setSearchParams({ ...searchParams });
		getRelationShipTableListAjax();
	};

	const onCreate = () => {
		setEditFlag('create');
		setRelationVisible(true);
	};

	const onDelete = async () => {
		const mainCardNumbers = JSON.stringify(selectedRowKeys);
		const res = await deteleCustomerRelation({ mainCardNumbers });
		if (+res.code === 1001) {
			message.success(res.data.msg);
			getRelationShipTableListAjax();
		}
	};

	const onTableSelectChange = (values) => {
		setSelectedRowKeys([...values])
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onTableSelectChange
	};

	const onTableChange = data => {
		const { current, pageSize } = data;
    pageData.pageNum = current;
    pageData.pageSize = pageSize;
		setPageData({ ...pageData });
		getRelationShipTableListAjax();
	};

	const getRelationShipTableListAjax = async () => {
		setLoading(true);
		const res = await getRelationShipTableList({
			...searchParams,
			...pageData
		});
		if (+res.code === 1001) {
			setDataSource(res.data.list);
			setTotal(res.data.total);
		}
		setLoading(false);
	};

	const handleOK = async params => {
		const res = await saveCustomerCorrelation(params);
		if (+res.code === 1001) {
			message.success(res.data.msg);
			setRelationVisible(false);
			getRelationShipTableListAjax();
		}
	};

	useEffect(() => {
		getRelationShipTableListAjax();
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.searchBar}>
				客户搜索：
				<Input
					className={styles.inputBox}
					value={searchParams.customerName}
					onChange={onInputChange}
					placeholder="输入客户名称或证件号"
					style={{ marginRight: 16 }}
				/>
				{/* 产品搜索：
				<Input
					className={styles.inputBox}
					value={searchParams.mainCardNumber}
					onChange={e => onInputChange(e, 'mainCardNumber')}
					placeholder="客户证件号"
				/> */}
				<Button className={styles.btnBox} type="primary" onClick={onSearch}>
					查询
				</Button>
				<Button className={styles.btnBox} onClick={onRest}>
					重置
				</Button>
			</div>
			<div className={styles.searchBar}>
				<Button className={styles.btnBox} type="primary" onClick={onCreate}>
					新增关联
				</Button>
				<Button
					className={styles.btnBox}
					type="danger"
					disabled={!selectedRowKeys.length}
					onClick={onDelete}
				>
					删除
				</Button>
			</div>
			<MXTable
				loading={loading}
				rowSelection={rowSelection}
				columns={tableColumns}
				dataSource={dataSource}
				rowKey="mainCardNumber"
				total={total}
				pageNum={pageData.pageNum}
				onChange={onTableChange}
			/>
			<RelationModal
				visible={relationVisible}
				editFlag={editFlag}
				modalData={modalData}
				onOk={handleOK}
				onCancel={() => setRelationVisible(false)} />
		</div>
	);
};

export default RelationShip;
