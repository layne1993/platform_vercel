import React, { useEffect, useState } from 'react';
import { Input, Select, Button, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { getManagerListAjax, getSelectSalesman } from '../services';
import ProductModal from './ProductModal';
import RateModal from '../transactionOwnership/edit/components/RateModal';

const DividedConfiguration: React.FC<{}> = (props) => {
  const [visibleProduct, setVisibleProduct] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<any>([]);
  const [selectSalesman, setSelectSalesman] = useState<any>([]);
  const [total, setTotal] = useState<number>(0);
  const [pageData, setPageData] = useState<any>({
    // 当前的分页数据
      pageNum: 1
    });
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [rateVisible, setRateVisible] = useState(false);
  const [currentId, setCurrentId] = useState('');

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
        align: 'center'
      },
      {
        title: '管理费率',
        dataIndex: 'manageRate',
        align: 'center',
        render: (text, record) => {
          if (text) {
            return text + '%';
          } else {
            return '';
          }
        }
      },
      {
        title: '销售人员分成',
        dataIndex: 'salesManNum',
        align: 'center',
        render: (text, record) => text + '条'
      },
      {
        title: '渠道分成',
        dataIndex: 'channelNum',
        align: 'center',
        render: (text, record) => text + '条'
      },
      {
        title: '最近修改时间',
        dataIndex: 'createTime',
        align: 'center',
        render: (text) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      },
      {
        title: '最近修改人',
        dataIndex: 'userName',
        align: 'center'
      },
      {
        title: '操作',
        align: 'center',
        render(text, record) {
          return (
            <>
              {record.manageRate ? <span className={styles.editBtn} onClick={() => onEdit(record)}>编辑</span> :
                <span className={styles.delBtn} onClick={() => onSetManager(record)}>配置管理费</span>}
            </>
          );
        }
      }
    ];

  const handleLink = (record) => {
    let recordData = JSON.stringify(record);
    history.push(`/costManagement/dividedConfiguration/edit/${record.productId}?record=${recordData}&type=show`);
  };

  const onEdit = (record) => {
    let recordData = JSON.stringify(record);
    history.push(`/costManagement/dividedConfiguration/edit/${record.productId}?record=${recordData}&type=edit`);
  };

  const onSetManager = (record) => {
    setCurrentId(record.productId);
    setRateVisible(true);
  };

  const onInputChange = (e) => {
    searchParams.sourceName = e.target.value;
    setSearchParams({ ...searchParams });
  };

  const onSelectChange = (val) => {
    searchParams.type = val;
    setSearchParams({ ...searchParams });
  };

  const onSearch = () => {
    getManagerList();
  };

  const onRest = () => {
    searchParams.sourceName = '';
    searchParams.type = '';
    setSearchParams({ ...searchParams });
    getManagerList();
  };

  const setConfiguration = () => {
    if (selectedRowKeys.length > 0) {
          setVisibleProduct(true);
        } else {
        message.info('请选择产品');
      }
    };

  const onTableSelectChange = (values) => {
    console.log(values);

      setSelectedRowKeys([...values]);
    };

  const rowSelection = {
    selectedRowKeys,
    onChange: onTableSelectChange
  };

  const onTableChange = (data) => {
    const { current } = data;
    pageData.pageNum = current;
      setPageData({ ...pageData });
      getManagerList();
    };

  const getSelectSalesmanAjax = async () => {
      const res: any = await getSelectSalesman({
      });
      if (+res.code === 1001) {
        setSelectSalesman(res.data.list);
      }
    };

  const getManagerList = async () => {
    setLoading(true);
      const res: any = await getManagerListAjax({
        ...searchParams,
        ...pageData
      });
      if (+res.code === 1001) {
        setDataSource(res.data.list);
        setTotal(res.data.total);
      }
      setLoading(false);
    };

  const successPost = () => {
    setVisibleProduct(false);
    message.success('复制成功');
  };

  const handleSubmit = () => {
    setRateVisible(false);
    getManagerList();
    };

  useEffect(() => {
    getManagerList();
    getSelectSalesmanAjax();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        产品名称：
          <Input
            className={styles.inputBox}
            value={searchParams.sourceName}
            onChange={onInputChange}
            placeholder="请输入名称"
            style={{ marginRight: 16 }}
          />
        管理费配置情况：
          <Select
            className={styles.inputBox}
            value={searchParams.type}
            onChange={onSelectChange}
            placeholder="请选择"
          >
            {selectSalesman.map((item) => (
              <Option value={item.reportSalesmanId} key={item.reportSalesmanId}>{item.salesmanName}</Option>
            ))}
          </Select>
          <Button className={styles.btnBox} type="primary" onClick={onSearch}>
          查询
          </Button>
          <Button className={styles.btnBox} onClick={onRest}>
          重置
          </Button>
        </div>
        <div className={styles.searchBar}>
          <Button className={styles.btnBox} type="primary" onClick={setConfiguration}>
          批量引用管理费分成配置
          </Button>
        </div>
        <MXTable
          loading={loading}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={dataSource}
          rowKey={(record) => record}
          total={total}
          pageNum={pageData.pageNum}
          onChange={onTableChange}
        />
        <ProductModal selectedRowKeys={selectedRowKeys} successPost={successPost} onCancel={() => {
          setVisibleProduct(false);
        }} visible={visibleProduct}
        />
        <RateModal visible={rateVisible} title="配置管理费率" productId={currentId} onCancel={() => setRateVisible(false)} onSubmit={handleSubmit} />
      </div>
    );
};

export default DividedConfiguration;
