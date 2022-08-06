import React, { Component } from 'react';
import { Modal, Table, Button, Radio } from 'antd';
import { moduleTypeData, moduleCustomerTypeData } from '@/utils/publicData';
//选择模板列表组件
class ModuleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            moduleTitle: '', //模板标题
            selectedRowKeys: []
        };
    }
    static getDerivedStateFromProps(nextProps, prevState){
        const { moduleCustomerType } = nextProps;
        const { moduleTitle } = prevState;
        let tempArr = moduleTitle?moduleTitle.split('--'):[];
        //当客户类型不同的时候, 使用props中的客户类型
        if(moduleCustomerType && moduleTitle && !(tempArr.includes(moduleCustomerType))){
            return {
                moduleTitle:`${tempArr[0]}--${moduleCustomerType}`
            };
        }
        // 否则，对于state不进行任何操作
        return null;
    }
  columns = [
      {
          title: '模板标题名称',
          width: 150,
          dataIndex: 'moduleTitle',
          render: (text) => text
      },
      {
          title: '操作',
          width: 60,
          dataIndex: 'operate',
          render: (text, record) => (
              <span
                  style={{ color: '#1890ff', cursor: 'pointer' }}
                  onClick={() => this.handleChooseModule(record)}
              >
          使用
              </span>
          )
      }
  ];
  renderData = (customerType) => [
      {
          id: 'KFkglwe2',
          key: 'birthday',
          moduleTitle: `${moduleTypeData.birthday}--${moduleCustomerTypeData[customerType]}`
      }
      //   {
      //       id: 'Lngslwe2',
      //       key: 'risk',
      //       moduleTitle: `${moduleTypeData.risk}--${moduleCustomerTypeData[customerType]}`
      //   }
      //   {
      //       id: 'GLCklwe2',
      //       key: 'certificate',
      //       moduleTitle: `${moduleTypeData.certificate}--${moduleCustomerTypeData[customerType]}`
      //   }
  ];

  /**
   * @description 当点击使用模板时
   * @param record {obj}
   */
  handleChooseModule = (record) => {
      this.setState({
          moduleTitle: record.moduleTitle,
          selectedRowKeys: [record.id],
          moduleKey: record.key
      });
  };

  /**
   * @description table勾选的onChange事件
   * @param selectedRowKeys {array}
   * @param selectedRows {array}
   */
  handleOnChange = (selectedRowKeys, selectedRows) => {
      this.setState({
          moduleTitle: selectedRows[0].moduleTitle,
          selectedRowKeys,
          moduleKey: selectedRows[0].key
      });
  };
  render() {
      const { modalVisible, handleModalVisible, customerType  } = this.props;
      const { moduleTitle, selectedRowKeys, moduleKey } = this.state;
      return (
          <Modal
              visible={!!modalVisible}
              title="请选择模板"
              width={600}
              maskClosable={false}
              footer={[
                  <Button
                      key="cancel"
                      type="primary"
                      onClick={() => handleModalVisible(moduleTitle, false, moduleKey)}
                  >
            确定
                  </Button>
              ]}
              onCancel={() => handleModalVisible(undefined, false)}
          >
              <Table
                  columns={this.columns}
                  dataSource={this.renderData(customerType)}
                  rowKey={(record) => record.id}
                  pagination={false}
                  rowSelection={{
                      onChange: this.handleOnChange,
                      selectedRowKeys,
                      type: 'radio'
                  }}
              />
          </Modal>
      );
  }
}
export default ModuleList;
