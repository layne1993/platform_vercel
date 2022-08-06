import React, { Component, Fragment } from 'react';
import { Modal, Table, Form, Select, Row, Col, Button, Alert, Space, Checkbox } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
import { XWAccountType, AccountStatus, RoleType } from '@/utils/publicData';
import { getRandomKey, isNumber, listToMap } from '@/utils/utils';
import styles from './style.less';
/**
 * 选择管理人弹框
 */
class AdministratorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedRowKeys: [], //表格选中行的key值
            dataList:[]
        };
    }
  searchFormRef = React.createRef();

  // static getDerivedStateFromProps(nextProps, prevState){
  //   const { isAsPost } = nextProps
  //   console.log('isAsPost', isAsPost)
  //   if(isAsPost){
  //     return {
  //       kk:'11'
  //     }
  //   }
  //   return null
  // }
  columns = [
      {
          title: '管理员名称',
          width: 120,
          dataIndex: 'userName',
          ellipsis: true,
          render: (text) => text
      },
      {
          title: '手机号',
          width: 120,
          dataIndex: 'mobile',
          ellipsis: true,
          render: (text) => text
      },
      {
          title: '邮箱',
          width: 180,
          dataIndex: 'email',
          ellipsis: true,
          render: (text) => text
      },
      {
          title: '岗位',
          width: 100,
          dataIndex: 'positionStatus',
          ellipsis: true,
          render: (val) => isNumber(val) ? listToMap(XWAccountType)[val] : '--'
      },
      {
          title: '账号状态',
          dataIndex: 'isDelete',
          width: 90,
          ellipsis: true,
          render: (text) => {
              const obj = AccountStatus.filter((item) => item.value === Number(text));
              return obj.length > 0 ? (
                  <span style={{ color: `${obj[0].value === 1 ? 'red' : ''}` }}>{obj[0].label}</span>
              ) : (
                  '--'
              );
          }
      }
  ];
  /**
   * @description 勾选管理员列表
   * @param selectedRowKeys {array} 所有选中的行的key值
   * @param selectedRows {array} 所有选中的行
   */
  onChange = (selectedRowKeys, selectedRows) => {
      this.setState({
          selectedRowKeys
      });
  };
  /**
   * @description 点击清空， 清空勾选状态
   */
  cleanSelectedKeys = () => {
      this.setState({
          selectedRowKeys: []
      });
  };

  /**
   * @description 选择管理人时, 按岗位选择
   * @param value {array} 多选框的value值
   */
  handleChoosePost = (value) => {
      this.setState({
          selectedRowKeys: value
      });
  };
  /**
   * 搜索人员
   */
  handleSearch = () => {
      const { getFieldsValue } = this.searchFormRef.current;
      let searchData = getFieldsValue();
      const { filterData } = this.props;
      filterData(searchData);
  }

  /**
   * 点击重置按钮
   */
  handleReset = () => {
      const { resetFields, getFieldsValue } = this.searchFormRef.current;
      const { filterData } = this.props;
      resetFields();
      filterData();
  }

  render() {
      const {
          administratorListVisible,
          handleModalVisible,
          data,
          isAsPost,
          ...modalProps
      } = this.props;
      const { selectedRowKeys } = this.state;
      //管理人, 手动选择人员
      const adminNode = (
          <>
              <Form layout="inline" style={{ marginBottom: '20px' }} ref={this.searchFormRef}>
                  <Row style={{ width: '100%' }}>
                      <Col span={8}>
                          <FormItem name="positionStatus" label="岗位">
                              <Select  allowClear>
                                  {XWAccountType.map((item) => (
                                      <Option value={item.value} key={item.label}>{item.label}</Option>
                                  ))}
                              </Select>
                          </FormItem>
                      </Col>
                      <Col span={8}>
                          <FormItem name="isDelete" label="账号状态">
                              <Select  allowClear>
                                  <Option value={'0'} key={getRandomKey(4)}>启用中</Option>
                                  <Option value={'1'} key={getRandomKey(4)}>暂停</Option>
                              </Select>
                          </FormItem>
                      </Col>
                      <Space>
                          <Button type="primary" onClick={this.handleSearch}>查询</Button>
                          <Button onClick={this.handleReset}>重置</Button>
                      </Space>
                  </Row>
              </Form>
              <Alert
                  message={
                      <Fragment>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                          <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                清空
                          </a>
                      </Fragment>
                  }
                  type="info"
                  showIcon
              />
              <Table
                  columns={this.columns}
                  rowSelection={{
                      onChange: this.onChange,
                      selectedRowKeys,
                      preserveSelectedRowKeys: true
                  }}
                  scroll={{ x: '100%', y: 500 }}
                  pagination={{
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400', '500', '1000', '999999']
                  }}
                  dataSource={data}
                  rowKey="id"
              />
          </>
      );

      //管理人, 按岗位选择人员
      const isAsPostNode = (
          <div style={{textAlign:'center'}}>
              <h2>请选择需要发送消息的岗位</h2>
              <Checkbox.Group onChange={this.handleChoosePost} defaultValue={[]}>
                  {
                      XWAccountType.map((item) => (
                          <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>
                      ))
                  }
              </Checkbox.Group>
          </div>
      );
      return (
          <Modal
              visible={administratorListVisible}
              style={{ top: 20 }}
              bodyStyle={{ padding: '12px 15px 0px' }}
              {...modalProps}
              title={'请选择管理人'}
              width={800}
              onCancel={() => handleModalVisible(false, undefined, 0)}
              maskClosable={false}
              wrapClassName={styles.administratorList}
              footer={
                  <Button
                      key="cancel"
                      type="primary"
                      // 按岗位和人员区分type
                      onClick={() => handleModalVisible(false, selectedRowKeys, !!isAsPost ? 2 : 0)}
                  >
                    确定
                  </Button>
              }
          >
              {!!isAsPost ? isAsPostNode : adminNode}
          </Modal>
      );
  }
}
export default AdministratorList;
