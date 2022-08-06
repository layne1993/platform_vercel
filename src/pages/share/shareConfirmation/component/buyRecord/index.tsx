import React, { useState, useEffect } from 'react'
import { connect } from 'umi'
import type { Dispatch, Loading } from 'umi'
import { Row, Col, Modal, notification } from 'antd'
import moment from 'moment'
import MXTable from '@/pages/components/MXTable';;
import { XWTransactionType } from '@/utils/publicData';
import { listToMap } from '@/utils/utils'
import _styles from './styles.less'

const initPageData = {
  pageNum: 1,
  pageSize: 20
};

const tradeTypeMap = listToMap(XWTransactionType)

const sourceTypeMap = {
  1: '系统录入',
  2: '批量导入',
  3: '托管'
}


const openNotification = (type, message, description, placement, duration?) => {
  notification[type || 'info']({
    top: 30,
    message,
    description,
    placement,
    duration: duration || 3
  });
};


interface defaultProps {
  dispatch: Dispatch;
  loading: boolean;
  loadingSubmit: boolean;
  visible: boolean; // 弹出框展示
  onClose: () => null; // 关闭回调
  data: any; // 详情
  tableSearch: () => void;
}

const BuyRecord: React.FC<defaultProps> = (props: defaultProps) => {

  const columns = [
    {
      title: '份额类别',
      dataIndex: 'parentProductId',
      width:100,
      fixed: 'left',
      render: (val, record) => <div style={{ width: 80 }}>{val && record.productName || '--'}</div>
    },
    {
      title: '客户名称',
      dataIndex: 'customerName',
      align: 'center',
      width: 200,
      render(val) {
        return val || '--';
      }
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 120,
      align: 'center',
      render(val) {
        return val || '--';
      }
    },
    {
      title: '证件号码',
      dataIndex: 'cardNumber',
      width: 120,
      align: 'center',
      render(val) {
        return val || '--';
      }
    },
    {
      title: '交易类型',
      dataIndex: 'tradeType',
      width: 120,
      align: 'center',
      render(val) {
        return val && tradeTypeMap[val] || '--';
      }
    },
    {
      title: '申请日期',
      dataIndex: 'tradeApplyTime',
      width: 120,
      align: 'center',
      render(val) {
        return val && moment(val).format('YYYY-MM-DD') || '--';
      }
    },
    {
      title: '确认金额',
      dataIndex: 'tradeMoney',
      width: 120,
      align: 'center',
      render(val) {
        return val || '--';
      }
    },
    {
      title: '确认份额',
      dataIndex: 'tradeShare',
      width: 120,
      align: 'center',
      render(val) {
        return val || '--';
      }
    },
    {
      title: '交易净值',
      dataIndex: 'tradeNetValue',
      width: 120,
      align: 'center',
      render(val) {
        return val || '--';
      }
    },
    {
      title: '数据来源',
      dataIndex: 'sourceType',
      width: 120,
      align: 'center',
      render(val) {
        return val && sourceTypeMap[val] || '--';
      }
    },
    {
      title: '有无份额确认书',
      dataIndex: 'isConfirmFile',
      width: 120,
      align: 'center',
      render(val) {
        return val ? '有' : '无';
      }
    },
    {
      title: '操作',
      align: 'center',
      width: 200,
      render(data) {
        if (data.isConfirmFile) {
          return <span>关联</span>
        }
        if (data.tradeRecordId === tradeRecordId) {
          return <span style={{ color: '#ff4d4f' }}>已选择</span>
        }
        return <a onClick={() => relation(data)}>关联</a>
      }
    }
  ];
  const { visible, onClose, loading, data, loadingSubmit } = props

  const [pageData, setPageData] = useState(initPageData); // 表格page及pageSize
  const [dataSource, setDataSource] = useState<any>({}); // 表格数据
  const [tradeRecordId, setTradeRecordId] = useState<number | null>(null) // 当前选中id

  // 获取表格数据
  const tableSearch = () => {
    const { dispatch } = props;
    dispatch({
      type: 'MANAGE_CONFIRMLIST/recordQuery',
      payload: {
        ...pageData,
        customerId: data.customerId,
        productId: data.productId
      },
      callback: (res) => {
        if (res.code === 1008) {
          const { list = [], total } = res.data || {};
          setDataSource({
            list, total
          });
        } else {
          openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '获取数据失败!'}`, 'topRight');
        }
      }
    });
  };

  // 分页排序等
  const _tableChange = (p, e, s) => {
    setPageData({
      ...pageData,
      pageNum: p.current,
      pageSize: p.pageSize
    });
  };

  useEffect(() => {
    tableSearch()
  }, [pageData])

  // 关联
  const relation = (data) => {
    setTradeRecordId(data.tradeRecordId || null)
  }

  const onOk = () => {
    if (!tradeRecordId) {
      openNotification('warning', '提示', '请选择交易记录进行关联', 'topRight');
      return
    }
    const { dispatch, tableSearch: propsTableSearch } = props
    dispatch({
      type: 'MANAGE_CONFIRMLIST/recordFileUpload',
      payload: {
        tradeRecordId,
        confirmFiles: [{
          confirmFileId: data.confirmFileId || null,
          attachmentId: null
        }]
      },
      callback: (res) => {
        if (res.code === 1008) {
          onClose()
          propsTableSearch()
          openNotification('warning', '提示', '关联成功', 'topRight');
        } else {
          openNotification('warning', `提示（代码：${res.code}）`, `${res.message ? res.message : '获取数据失败!'}`, 'topRight');
        }
      }
    });
  }


  useEffect(() => {
    tableSearch()
  }, [])

  useEffect(() => {
    setTradeRecordId(data.tradeRecordId || null)
  }, [data])

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      wrapClassName={_styles.buyRecord}
      onOk={onOk}
      confirmLoading={loadingSubmit}
    >
      <div>
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <h3>关联认申赎记录</h3>
          </Col>
          <Col span={24}>
            <p>
              请为:{data.customerName || ''}，
              产品:{data.productName || ''}，
              文件:{data.fileName || ''}
              关联对应的交易记录信息
            </p>
          </Col>
        </Row>
        <MXTable
          loading={loading}
          // rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource.list || []}
          rowKey="confirmFileId"
          scroll={{ x: '100%', scrollToFirstRowOnChange: true, y: 400 }}
          sticky
          total={dataSource.total}
          pageNum={pageData.pageNum}
          onChange={_tableChange}

        />
      </div >
    </Modal>
  )
}

export default connect(({ loading }) => ({
  loading: loading.effects['MANAGE_CONFIRMLIST/recordQuery'],
  loadingSubmit: loading.effects['MANAGE_CONFIRMLIST/recordFileUpload']
}))(BuyRecord)