import { Button, Statistic, Form, Row, Col, Input, Select, Radio, notification, Card } from 'antd';
import React, { Component } from 'react';
import {
    XWTemplateType,
    XWEnableStatus,
    XWReleaseStatus,
    XWTrusteeParticipation,
    XWdeleteState,
    SignedBy
} from '@/utils/publicData';
import { getRandomKey, getParams } from '@/utils/utils';
import { connect, FormattedMessage, history } from 'umi';
import moment from 'moment';
import styles from '../style.less';
import { isEmpty } from 'lodash';

const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const authority = window.localStorage.getItem('antd-pro-authority');

const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 6
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        },
        md: {
            span: 12
        }
    }
};
const submitFormLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 10,
            offset: 7
        }
    }
};

class TemplateBaseInfo extends Component {
    // searchProduct = debounce(productName => {
    //     this.searchList(productName)
    // }, 300)
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            baseInfo: {},
            showRecord: false,
            productList: [],
            disableEditing: false,
            powerInfo: {},
            documentList: [], //已配协议列表
            isShow: false
        };
    }

    componentDidMount() {
        const { params } = this.props;
        const { proId, productId, lackType } = getParams();
        console.log(proId);
        // 查询所有产品列表
        this.searchList();
        if (params.id !== '0') {
            this.handleSearch(params.id);   // 查询详情
            this.onProductChange(productId);
            this.setState({
                isShow: true
            });
        } else {
            if (!!proId) {      // 产品模块->新建产品->自动设置产品名称 -> 设置协议类型
                this.setValues(proId, lackType);
                this.onProductChange(proId);
                this.setState({
                    isShow: true
                });
            }
        }
    }
    handleSearch = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'templateDetails/getTemplateInfo',
            payload: {
                documentId: id
            },
            callback: (res) => {
                const baseInfo = res.data;
                if (res.code === 1008 && res.data && Object.keys(baseInfo).length > 0) {
                    dispatch({
                        type: 'templateDetails/updateState',
                        payload: {
                            lackDocumentType: res.data.lackDocumentType,
                            documentType: res.data.documentType
                        }
                    });
                    this.setState({
                        baseInfo,
                        showRecord: true,
                        disableEditing: baseInfo.publishStatus === 1
                    });
                    setTimeout(() => {
                        if (this.formRef.current) {
                            this.formRef.current.setFieldsValue({
                                ...baseInfo,
                                associated: baseInfo.relateDocumentId ? 1 : 0
                            });
                        }
                    }, 200);
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    }

    searchList = () => {
        const { dispatch } = this.props;
        const { baseInfo } = this.state;
        dispatch({
            type: 'global/getAllProduct',
            payload: {
                // documentCode: baseInfo.documentCode
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        productList: res.data
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    saveBaseInfo = (values) => {
        const { baseInfo } = this.state;
        const { dispatch, handleChange } = this.props;
        // const { productId, ...tempObj } = values;
        // let addEditParams = {};

        // addEditParams.productId = (!!productId && productId.split(',')[0]) || undefined;
        // addEditParams.productName = (!!productId && productId.split(',')[1]) || undefined;
        const { documentList, ...parmas } = values;
        dispatch({
            type: 'templateDetails/newAddTemplate',
            payload: {
                documentId: baseInfo.documentId,
                ...parmas
                // ...addEditParams,
                // ...tempObj
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    const { data } = res;
                    if (this.formRef.current) {
                        this.formRef.current.setFieldsValue({
                            ...res.data,
                            productId: res.data.productId ? res.data.productId : undefined
                        });
                    }

                    this.setState({
                        baseInfo: data,
                        showRecord: true,
                        disableEditing: data.publishStatus === 1
                    });
                    dispatch({
                        type: 'templateDetails/updateState',
                        payload: {
                            lackDocumentType: data.lackDocumentType,
                            documentType: data.documentType
                        }
                    });
                    const { type } = getParams();
                    if (type === 'productTab') {
                        history.replace(
                            `/product/list/details/${res.data.productId}/template/${res.data.documentId}?productId=${res.data.productId}&type=${type}`,
                        );
                    } else {
                        history.replace(
                            `/raisingInfo/template/templateList/detail/${res.data.documentId}?productId=${res.data.productId}`,
                        );
                    }
                    openNotification('success', '保存成功', res.message, 'topRight');
                    // this.handleSearch(res.data.documentId);
                    handleChange('tab2');
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    filterPerson = (inputValue, option) => option.props.children.includes(inputValue);


    // 查询已配协议
    onProductChange = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'templateDetails/getAllocatedProtocol',
            payload: {
                productId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        documentList: res.data.documentList
                    });
                    if (this.formRef.current) {
                        this.formRef.current.setFieldsValue({
                            documentName: res.data.documentName,
                            documentType: res.data.documentType
                        });
                    }
                }
            }
        });
    }

    // 产品名称change事件
    onChange = (id) => {
        this.setState({
            isShow: true
        });
        this.onProductChange(id);
    }

    setValues = (id, type) => {
        this.formRef.current.setFieldsValue({
            productId: Number(id),
            documentType: !!type ? Number(type) : undefined
        });
    }

    render() {
        const { loading } = this.props;
        const {
            powerInfo,
            baseInfo,
            showRecord,
            productList,
            disableEditing,
            documentList,
            isShow
        } = this.state;

        return (
            <div>
                {/* {showRecord ? (
                    <div style={{ textAlign: 'center', paddingBottom: 20 }}>
                        <Row>
                            <Col span={6}>
                                <Statistic
                                    title="协议启用状态"
                                    value={
                                        ((baseInfo.startStatus || baseInfo.startStatus === 0) &&
                                            (baseInfo.startStatus === 0 ? '未启用' : '启用中')) ||
                                        '--'
                                    }
                                    valueStyle={{ fontSize: 24 }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="协议发布状态"
                                    value={
                                        baseInfo.publishStatus || baseInfo.publishStatus === 0
                                            ? XWReleaseStatus.find((item) => item.value === baseInfo.publishStatus).label
                                            : '--'
                                    }
                                    valueStyle={{ fontSize: 24 }}
                                />
                            </Col>
                            <Col span={6}>
                                <Statistic
                                    title="对应产品"
                                    value={
                                        (productList.find((item) => item.productId === baseInfo.productId) &&
                                            productList.find((item) => item.productId === baseInfo.productId).productName) ||
                                        '--'
                                    }
                                    valueStyle={{ fontSize: 24 }}
                                />
                            </Col>
                            <Col span={6}>
                                {' '}
                                <Statistic
                                    title="签署客户数"
                                    value={baseInfo.signCustomerNum || '--'}
                                    suffix="个"
                                    valueStyle={{ fontSize: 24 }}
                                />
                            </Col>
                        </Row>
                    </div>
                ) : null} */}
                <Form
                    hideRequiredMark
                    scrollToFirstError
                    className={styles.stepForm}
                    ref={this.formRef}
                    onFinish={this.saveBaseInfo}
                    initialValues={{
                        trusteeStatus: 0,
                        startStatus: 0,
                        publishStatus: 0,
                        isDelete: 0,
                        associated: 0,
                        documentList: documentList
                    }}
                >
                    <Card title="基础信息" bordered={false}>
                        <FormItem
                            {...formItemLayout}
                            label="产品名称"
                            name="productId"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入对应产品名称'
                                }
                            ]}
                        >
                            <Select
                                placeholder="请输入名称搜索..."
                                // onSearch={this.searchProduct}
                                showSearch
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={this.filterPerson}
                                notFoundContent={null}
                                allowClear
                                disabled={disableEditing}
                                onChange={this.onChange}
                            >
                                {productList.map((item) => (
                                    <Option key={getRandomKey(6)} value={item.productId} >
                                        {item.productName}
                                    </Option>
                                ))}
                            </Select>
                            {/* <Input placeholder="请输入对应产品名称" /> */}
                        </FormItem>
                        {
                            isShow &&
                            <FormItem
                                {...formItemLayout}
                                label="已配协议"
                                name="documentList"
                            >

                                <div className={styles.documentListWrapper}>
                                    {
                                        !isEmpty(documentList) ?
                                            documentList.map((item) => {
                                                return (
                                                    <p key={getRandomKey(4)}>{item}</p>
                                                );
                                            })
                                            : '无'
                                    }
                                </div>
                            </FormItem>
                        }

                        <FormItem
                            {...formItemLayout}
                            label="投资者端协议签署序号"
                            name="orderId"
                            extra="同产品序号从1开始累加，可改为指定序号，指定序号会导致重新排序"
                        >
                            <Input autoComplete="off" type="number" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="协议编号"
                            name="documentCode"
                            extra="请自行输入，按照贵司当前编号形式"
                            rules={[
                                {
                                    required: false,
                                    message: '请输入协议编号'
                                }
                            ]}
                        >
                            <Input placeholder="请输入协议编号" autoComplete="off" />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="协议名称"
                            name="documentName"
                            rules={[
                                {
                                    required: true,
                                    message: '请输入协议名称'
                                }
                            ]}
                        >
                            <Input placeholder="请输入协议名称" autoComplete="off" />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="协议类型"
                            name="documentType"
                            rules={[
                                {
                                    required: true,
                                    message: '请选择协议类型'
                                }
                            ]}
                        >
                            <Select placeholder="请选择" disabled={disableEditing} allowClear>
                                {XWTemplateType.map((item) => (
                                    <Option key={getRandomKey(6)} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="协议版本"
                            name="documentVersion"
                            rules={[
                                {
                                    required: false,
                                    message: '请选择协议版本'
                                }
                            ]}
                            extra="请自行输入，按照贵司版本习惯"
                        >
                            <Input placeholder="请输入协议版本" autoComplete="off" />
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="托管方参与"
                            name="trusteeStatus"
                            extra="托管参与的仅查看，不可编辑，本地自行上传的文档则为托管方不参与"
                        >
                            <Radio.Group disabled={disableEditing}>
                                {XWTrusteeParticipation.map((item) => (
                                    <Radio key={getRandomKey(6)} value={item.value}>
                                        {item.label}
                                    </Radio>
                                ))}
                            </Radio.Group>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="签署对象"
                            name="investorType"
                        >
                            <Select placeholder="请选择" disabled={disableEditing} allowClear>
                                {SignedBy.map((item) => (
                                    <Option key={getRandomKey(6)} value={item.value}>
                                        {item.label}
                                    </Option>
                                ))}
                            </Select>
                        </FormItem>
                        {/* <FormItem
                            {...formItemLayout}
                            label="启用状态"
                            name="startStatus"
                            extra="启用的协议，投资者签约时需要进行签署"
                        >
                            <Radio.Group disabled={disableEditing}>
                                {XWEnableStatus.map(
                                    (item) =>
                                        item.value !== 2 && (
                                            <Radio key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Radio>
                                        ),
                                )}
                            </Radio.Group>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="发布状态"
                            name="publishStatus"
                            extra="发布后，有任何投资者使用后，就不可以再次编辑"
                        >
                            <Radio.Group disabled={disableEditing}>
                                {XWReleaseStatus.map(
                                    (item) =>
                                        item.value !== 2 && (
                                            <Radio key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Radio>
                                        ),
                                )}
                            </Radio.Group>
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="删除状态"
                            name="isDelete"
                            extra="因拥有签署信息，所以为软删除"
                        >
                            <Radio.Group>
                                {XWdeleteState.map(
                                    (item) =>
                                        item.value !== 2 && (
                                            <Radio key={getRandomKey(6)} value={item.value}>
                                                {item.label}
                                            </Radio>
                                        ),
                                )}
                            </Radio.Group>
                        </FormItem> */}
                    </Card>
                    {showRecord ? (
                        <Card title="修改信息记录" bordered={false}>
                            <FormItem {...formItemLayout} label="最后修改人员" extra="每次修改均记录修改人员信息">
                                <Input placeholder="请输入最后修改人员" disabled value={baseInfo.userName} autoComplete="off" />
                            </FormItem>

                            <FormItem {...formItemLayout} label="最后修改时间">
                                <Input
                                    placeholder="请输入最后修改时间"
                                    disabled
                                    autoComplete="off"
                                    value={
                                        baseInfo.updateTime
                                            ? moment(baseInfo.updateTime).format('YYYY/MM/DD HH:mm')
                                            : '--'
                                    }
                                />
                            </FormItem>
                        </Card>
                    ) : null}

                    <FormItem
                        {...submitFormLayout}
                        style={{
                            marginTop: 32
                        }}
                    >
                        {
                            this.props.authEdit &&
                            <Button
                                // disabled={!powerInfo.isEdit}
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                保存，下一步
                            </Button>
                        }
                    </FormItem>
                </Form>
            </div>
        );
    }
}

export default connect(({ templateDetails, loading }) => ({
    templateDetails,
    loading: loading.effects['templateDetails/newAddTemplate']
}))(TemplateBaseInfo);
