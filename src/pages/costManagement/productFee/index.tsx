import React, { useEffect, useState } from 'react';
import { Input, DatePicker, Select, Button, message, Statistic, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { exportFileBlob } from '@/utils/fileBlob';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { queryFeeListHeaderAjax, queryFeeListAjax, exportFeeBySelect, exportFeeByAll } from "../services";

const { RangePicker } = DatePicker;
const { Option } = Select;

const tradeTypeSource = [
  {
    value: 1,
    label: '首发募集'
  },
  {
    value: 2,
    label: '募集中'
  },
  {
    value: 3,
    label: '存续中'
  },
  {
    value: 4,
    label: '封闭期'
  },
  {
    value: 5,
    label: '已结束'
  },
  {
    value: 6,
    label: '清盘'
  }
];

const ProductFee: React.FC<{}> = props => {
  const [visible, setvisible] = useState(false);
  const [AllOrOne, setAllOrOne] = useState('all');
  const [searchParams, setSearchParams] = useState<object>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<array>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageData, setPageData] = useState<object>({
    // 当前的分页数据
    pageNum: 1
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<array>([]);
  const [totalData, setTotalData] = useState({});

  const tableColumns = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      align: 'center'
    },
    {
      title: '资产净值（元）',
      dataIndex: 'netAssetValue',
      align: 'center',
    },
    {
      title: '当前管理费率',
      dataIndex: 'manageFeeRate',
      align: 'center',
    },
    {
      title: '本季管理费（元）',
      dataIndex: 'quarterSumManageFee',
      align: 'center',
    },
    {
      title: '累计管理费（元）',
      dataIndex: 'sumManageFee',
      align: 'center',
    },
    {
      title: '本季管理费分成（元）',
      dataIndex: 'quarterDivided',
      align: 'center',
    },
    {
      title: '累计管理费分成（元）',
      dataIndex: 'sumDivided',
      align: 'center',
    },
    {
      title: '产品状态',
      dataIndex: 'productStatus',
      align: 'center',
      render: text => {
        let tradeItem = tradeTypeSource.find(item => item.value === text);
        if (tradeItem) {
          return <span>{tradeItem.label}</span>
        } else {
          return <span>未配置</span>
        }
      }
    },
    {
      title: '投资者数',
      dataIndex: 'investorsNum',
      align: 'center',
    },
    {
      title: '累计涨跌幅',
      dataIndex: 'sumChange',
      align: 'center',
    },
    {
      title: '产品成立日',
      dataIndex: 'productOperationDate',
      align: 'center',
      render: text => <span>{text ? moment(text).format('YYYY-MM-DD') : ''}</span>
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render(data) {
        return (
          <>
            <span className={styles.editBtn} onClick={() => onDetail(data)}>管理费明细</span>
            <span className={styles.editBtn} onClick={() => onDevide(data)}>管理费分成 </span>
          </>
        );
      }
    }
  ];

  const onDetail = record => {
    window.sessionStorage.setItem('productFee', JSON.stringify(record));
    history.push(`/costManagement/productFee/detail/${record.productId}`);
  };

  const onDevide = record => {
    history.push(`/costManagement/productFee/devide/${record.productId}`);
  };

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
    getDataTableList();
  };

  const onRest = () => {
    for (let key in searchParams) {
      searchParams[key] = '';
    }
    setSearchParams({ ...searchParams });
    getDataTableList();
  };

  // 批量设置客户归属
  const onSetCustomerSet = () => {
    setAllOrOne('all')
    setvisible(true)
  }

  const onExportSourceFile = async (e) => {
    if (e == "select") {
      const params = { list: selectedRowKeys.join(',') };
      const res = await exportFeeBySelect(
        params
      )
      exportFileBlob(res.data, '产品管理费.xls')
    } else {
      const res = await exportFeeByAll()
      exportFileBlob(res.data, '产品管理费.xls')
    }
  }


  const onExport = async () => {
    if (selectedRowKeys.length) {
      const res = await exportFeeBySelect(params);

    } else {
      message.error('请先勾选数据');
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
    const { current } = data;
    pageData.pageNum = current;
    setPageData({ ...pageData });
    getDataTableList();
  };

  const getTableHeader = async () => {
    const res = await queryFeeListHeaderAjax({
      ...searchParams
    });
    if (+res.code === 1001) {
      setTotalData(res.data);
    }
  };

  const getDataTableList = async () => {
    let obj = {};
    for (let key in searchParams) {
      if (searchParams[key] !== '') {
        obj[key] = searchParams[key];
      }
    }
    setLoading(true);
    const res = await queryFeeListAjax({
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
    getTableHeader();
    getDataTableList();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Statistic title="累计管理费" value={totalData?.allSumManageFee} />
        <Statistic title="累计管理费分成" value={totalData?.allSumDivided} />
        <Statistic title="本季度管理费" value={totalData?.allQuarterManageFeeSum} />
        <Statistic title="本季度管理费分成" value={totalData?.allQuarterDivided} />
        <Statistic title="查询结果-总累计管理费" value={totalData?.allSumManageFee} />
        <Statistic title="查询结果-本季管理费" value={totalData?.allQuarterManageFeeSum} />
      </div>
      <div className={styles.searchBar}>
        产品名称：
        <Input
          className={styles.inputBox}
          value={searchParams.productName}
          onChange={e => onInputChange(e, 'productName')}
          placeholder="请选择名称"
          style={{ marginRight: 16 }}
        />
        募集状态：
        <Select
          className={styles.inputBox}
          value={searchParams.productStatus}
          onChange={val => onSelectChange(val, 'productStatus')}
          placeholder="请选择"
          style={{ marginRight: 16 }}
          allowClear
        >
          <Option value={1}>首发募集</Option>
          <Option value={2}>募集中</Option>
          <Option value={3}>存续中</Option>
          <Option value={4}>封闭期</Option>
          <Option value={5}>已结束</Option>
          <Option value={6}>清盘</Option>
          <Option value={null}>未配置</Option>
        </Select>
        管理费率：
        <Input
          className={styles.inputBox}
          value={searchParams.manageFeeRate}
          onChange={e => onInputChange(e, 'manageFeeRate')}
          placeholder="请选择名称"
          style={{ marginRight: 16 }}
        />
        成立日：
        <RangePicker
          className={styles.inputBox}
          value={[
            searchParams.foundingDateStart ? moment(searchParams.foundingDateStart) : null,
            searchParams.foundingDateEnd ? moment(searchParams.foundingDateEnd) : null
          ]}
          onChange={onRangeChange}
        />
        <Button className={styles.btnBox} type="primary" onClick={onSearch}>
          查询
        </Button>
        <Button className={styles.btnBox} onClick={onRest}>
          重置
        </Button>
      </div>
      <div className={styles.searchBar}>
        <Dropdown
          className={styles.btnBox}
          overlay={<Menu>
            <Menu.Item
              key="1"
              disabled={selectedRowKeys.length === 0}
              onClick={() => onExportSourceFile('select')}
            >
              导出选中
            </Menu.Item>
            <Menu.Item
              key="0"
              onClick={() => onExportSourceFile('all')}
            >
              导出全部
            </Menu.Item>
          </Menu>}
        >
          <Button >
            &nbsp;&nbsp;批量导出
            <DownOutlined />
          </Button>
        </Dropdown>
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

export default ProductFee;
