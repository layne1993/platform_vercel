import React, { useEffect, useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { getTradeProducts } from "../services";

const OwnerShip: React.FC<{}> = props => {
  const [searchParams, setSearchParams] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<array>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageData, setPageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<array>([]);

  const tableColumns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      align: 'center',
      render: (text, record) => <a href="#" onClick={() => handleLink(record)}>{text}</a>
    },
    {
      title: '产品状态',
      dataIndex: 'codeText',
      align: 'center',
    },
    {
      title: '交易记录数',
      dataIndex: 'tradeRecordNum',
      align: 'center',
    },
    {
      title: '交易客户数',
      dataIndex: 'customerNum',
      align: 'center',
    },
    {
      title: '销售人数',
      dataIndex: 'salesManNum',
      align: 'center',
    },
    {
      title: '销售渠道数',
      dataIndex: 'channelNum',
      align: 'center',
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
          <span className={styles.editBtn} onClick={() => onEdit(data)}>交易归属维护</span>
        );
      }
    }
  ];

  const handleLink = record => {
    history.push(`/costManagement/transactionOwnership/edit/${record.productId}?productName=${record.productName}`);
  };

  const onEdit = async data => {
    history.push(`/costManagement/transactionOwnership/edit/${data.productId}?productName=${data.productName}`);
  };

  const onInputChange = (e, type) => {
    searchParams[type] = e.target.value;
    setSearchParams({ ...searchParams });
  };

  const onSelectChange = (val, type) => {
    searchParams[type] = val;
    setSearchParams({ ...searchParams });
  };

  const onSearch = () => {
    getShipList();
  };

  const onRest = () => {
    for (let key in searchParams) {
      searchParams[key] = '';
    }
    setSearchParams({ ...searchParams });
    getShipList();
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
    getShipList();
  };

  const getShipList = async () => {
    let obj = {};
    for (let key in searchParams) {
      if (searchParams[key] !== '') {
        obj[key] = searchParams[key];
      }
    }
    setLoading(true);
    const res = await getTradeProducts({
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
    getShipList();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        产品名称：
        <Input
          className={styles.inputBox}
          value={searchParams.productName}
          onChange={e => onInputChange(e, 'productName')}
          placeholder="请输入名称"
        />
        产品状态：
        <Select
          className={styles.inputBox}
          value={searchParams.productStatus}
          onChange={val => onSelectChange(val, 'productStatus')}
          placeholder="请选择"
        >
          <Option value={1}>首发募集</Option>
          <Option value={2}>募集中</Option>
          <Option value={3}>存续中</Option>
          <Option value={4}>封闭期</Option>
          <Option value={5}>已结束</Option>
          <Option value={6}>清盘</Option>
          <Option value={null}>未配置</Option>
        </Select>
        {/* 客户名称：
        <Input
          className={styles.inputBox}
          value={searchParams.sourceName}
          onChange={onInputChange}
          placeholder="请输入名称"
        />
      </div>
      <div className={styles.searchBar}>
        销售人员：
        <Input
          className={styles.inputBox}
          value={searchParams.userName}
          onChange={onInputChange}
          placeholder="请输入名称"
        />
        销售渠道：
        <Select
          className={styles.inputBox}
          value={searchParams.type}
          onChange={onSelectChange}
          placeholder="请选择"
        >
          <Option value={1}>渠道1</Option>
        </Select> */}
        <Button className={styles.btnBox} type="primary" onClick={onSearch}>
          查询
        </Button>
        <Button className={styles.btnBox} onClick={onRest}>
          重置
        </Button>
      </div>
      <MXTable
        loading={loading}
        rowSelection={rowSelection}
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="productId"
        total={total}
        pageNum={pageData.pageNum}
        onChange={onTableChange}
      />
    </div>
  );
};

export default OwnerShip;
