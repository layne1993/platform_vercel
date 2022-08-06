/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-06 10:54:47
 * @LastEditTime: 2021-09-06 10:29:51
 */
import React, { PureComponent } from 'react';
import { connect, Link } from 'umi';
import {
    Row,
    Input,
    Button,
    Select,
    notification,
    Space,
    message,
    Modal,
    Tooltip,
    Popconfirm
} from 'antd';
import lodash from 'lodash';
import { PlusSquareOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import { PLACEHOLDER } from '@/utils/publicData';
import _styles from './styles.less';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class CrateTemplate extends PureComponent {
    constructor(props) {
        super(props);
        // this.templateNameChange = lodash.debounce(this.templateNameChange, 300);
        // this.productChange = lodash.debounce(this.productChange, 300);
    }
    state = {
        templateName: undefined,
        productIds: [],
        productList: [],
        fields: [undefined]
    };

    componentDidMount() {
        this.getProductList();
        const { params } = this.props;
        if (params.confirmFileTemplateId) {
            this.getDetail();
        }
    }

    // 获取产品列表
    getProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/productList',
            callback: (res) => {
                if (res.code === 1008) {
                    this.setState({
                        productList: res.data
                    });
                }
            }

        });
    }

    // 新建
    create = (enableStatus = 1) => {
        const { dispatch, params } = this.props;
        const { fields, templateName } = this.state;
        if (!templateName) {
            message.warning('模板名称不能为空！');
            return;
        }

        //   if(productIds.length === 0) {
        //       message.warning('匹配产品不能为空');
        //       return;
        //   }

        if (fields.length === 0) {
            message.warning('模板标题不能为空');
            return;
        }

        let str = this.getPreviewStr(fields);
        if (str && !str.includes('文件名称') || (!str.includes('产品名称') && !str.includes('托管机构内部产品代码')) || !str.includes('客户名称') || !str.includes('日期')) {
            message.warning('份额确认书标题应包含“文件名称、产品名称或托管机构内部产品代码、客户名称、日期”四个字段');
            return;
        }

        let titleFormat = fields.filter((item) => item);

        let url = params.confirmFileTemplateId ? 'COMFIRMATION_TEMPLATE/edit' : 'COMFIRMATION_TEMPLATE/create';

        dispatch({
            type: url,
            payload: { ...params, templateName, titleFormat, enableStatus },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', `提示（代码：${res.code}）`, '保存成功', 'topRight');
                    this.props.onOk();
                } else {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }

        });
    }


    // 查询详情
    getDetail = () => {
        const { dispatch, params } = this.props;
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/detail',
            payload: { confirmFileTemplateId: params.confirmFileTemplateId },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    this.setState({
                        ...data,
                        fields: data.titleFormat
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }

        });
    }

    // 选择框添加
    add = () => {
        const { fields } = this.state;
        let newFields = [...fields];
        newFields.push(undefined);
        this.setState({ fields: newFields });
    };

    // 模板名称change
    templateNameChange = (e) => {
        this.setState({ templateName: e.target.value });
    }

    // change 事件
    onChange = (value, index) => {
        const { fields } = this.state;
        const newFields = [...fields];
        newFields[index] = value;
        this.setState({ fields: newFields });
    };

    // 产品change事件
    productChange = (val) => {
        this.setState({ productIds: val });
    }

    /**
     *  标题模板预览
     * @param {arr type Array} arr
     */
    getPreviewStr = (arr = []) => {
        let str = '';
        if (arr.length === 0) return str;
        arr.map((item) => {
            if (item) {
                str = str + item;
            }
        });
        return str;
    };

    onClose = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }

    }

    render() {
        const { templateName, fields = [] } = this.state;
        const { loading, modalFlag } = this.props;
        // const {
        //   MANAGE_confirm_createTemplate: { listData = {} },
        // } = this.props;

        return (
            <Modal
                title={templateName ? '编辑模板' : '添加模板'}
                visible={modalFlag}
                footer={null}
                width={1200}
                onCancel={this.onClose}
                maskClosable={false}
            >


                <div>
                    <p
                        className={_styles.titleP}
                    >
                        <span>请输入模板名称</span>
                        <Tooltip title={<div>
                            <p>填写规则：</p>
                            <p>1、设置该份额确认书模板名称，名称可以随意设置，比如模板1、中信托管模板等等。份额确认书模板可以复用。</p>
                            <p>2、设置份额确认书标题规则匹配到对应的客户-产品下。份额确认书标题应包含“文件名称、产品名称、客户名称、日期”四个字段，每种字段中间用特殊符号间隔开。下拉选择特殊符号。如果标题内有不想读取的字段，则用“占位”来填充。实例说明见页面下方。</p>
                        </div>
                        }
                        >
                            <QuestionCircleTwoTone />
                        </Tooltip>
                    </p>
                    <div>
                        <Space>
                            <Input value={templateName} style={{ width: 500 }} onChange={this.templateNameChange} placeholder="请输入模板名称" allowClear />
                            {/* <Select
                              value={productIds}
                              mode="multiple"
                              style={{ width: 500, marginRight: 15 }}
                              placeholder="请选择产品"
                              allowClear
                              filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              }
                              onChange={(val, option) => this.productChange(val)}
                          >
                              {
                                  productList.map((item, index) => {
                                      return <Select.Option
                                          key={index}
                                          value={item.productId}
                                      >{item.productName}</Select.Option>;
                                  })
                              }
                          </Select> */}
                        </Space>
                    </div>
                    <p className={_styles.titleP}>请填写份额确认书模板标题</p>
                    <Row >
                        {fields.map((item, index) => {
                            return (
                                <Select
                                    key={index}
                                    value={fields[index]}
                                    style={{ width: 140, marginRight: 15, marginBottom: 10 }}
                                    placeholder="请选择"
                                    allowClear
                                    onChange={(val, option) => this.onChange(val, index)}
                                >
                                    {PLACEHOLDER.map((item, index) => (
                                        <Select.Option key={index} value={item.value}>
                                            {item.label}
                                        </Select.Option>
                                    ))}
                                </Select>
                            );
                        })}

                        <PlusSquareOutlined
                            style={{ fontSize: 20, color: '#1890ff', lineHeight: '35px' }}
                            onClick={this.add}
                        />
                    </Row>
                    <p className={_styles.titleP}>预览</p>
                    <div className={_styles.titlePreview} >{this.getPreviewStr(fields)}</div>
                    <p className={_styles.titleP}>匹配产品</p>
                    {/* <p className={_styles.titleP}>创建信息记录</p>
              <div className={_styles.record}>
                  <p> <span>创建人员：</span></p>
                  <p> <span>创建时间：</span></p>
              </div> */}
                    <div className={_styles.btnBox}>
                        <Button type="primary" style={{ marginRight: 15 }} onClick={() => this.create(1)} loading={loading} > 保存</Button>
                        {/* <Button type="primary" style={{marginRight: 15}} onClick={()=> this.create(1)} loading={loading}> 发布</Button> */}
                        <Button style={{ marginRight: 15 }} onClick={this.onClose} > 取消</Button>
                    </div>
                    <div className={_styles.explain}>
                        <p>实例说明</p>
                        <p>例如1：份额确认书文件名称是：《投资者交易确认函19【产品成立】_【SLU066】易私慕一号私募证券投资产品_张三_20200907》，不想要【】内的文字，希望文件名称：投资者交易确认函19；产品名称：易私慕一号私募证券投资产品配置如下：</p>
                        <div>
                            <Select style={{ marginRight: 5 }} disabled placeholder="文件名称" size="small"> </Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="【" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="占位" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="】" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="_" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="【" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="占位" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="】" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="_" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="产品名称" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="客户名称" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="_" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="日期" size="small"></Select>
                        </div>
                        <p>此时读取出文件名称：投资者交易确认函19；产品名称：易私慕一号私募证券投资产品</p>
                        <p>例如2：份额确认书文件名称是：《易私慕一号私募证券投资产品-申购确认单-20200907-李四-330201199109010909》，配置如下：</p>
                        <div>
                            <Select style={{ marginRight: 5 }} disabled placeholder="产品名称" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="-" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="文件名称" size="small"> </Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="-" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="日期" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="-" size="small"></Select>
                            <Select style={{ marginRight: 5 }} disabled placeholder="客户名称" size="small"></Select>
                        </div>
                        <p>此时读取出文件名称：申购确认单；产品名称：易私慕一号私募证券投资产品</p>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default connect(({ loading }) => ({
    loading: loading.effects['COMFIRMATION_TEMPLATE/create', 'COMFIRMATION_TEMPLATE/edit']
}))(CrateTemplate);
