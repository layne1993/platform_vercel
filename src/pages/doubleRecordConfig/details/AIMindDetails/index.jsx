import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input, Card, Tabs, Radio, Row, Col, notification, Modal, Table, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import _styles from './styles.less';
import { getCookie } from '@/utils/utils';

const { TabPane } = Tabs;


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const formItemLayout1 = {
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
            span: 18
        }
    }
};

const columns = [
    {
        title: '产品名称',
        dataIndex: 'productFullName'
    }
];


const AIMindDetails = (props) => {
    const { dispatch, match: { params }, saveLoading } = props;
    // eslint-disable-next-line no-undef
    const { authEdit, authExport } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60200'] || {};
    const [form] = Form.useForm();
    const [radioValue, setRadioValue] = useState('1');
    const [modalFlag, setModalFlag] = useState(false);
    const [productList, setProductList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);

    const initForm = () => {
        form.setFieldsValue({
            organizationMatching: [{ answerContent: '是', questionContent: '' }],
            organizationNoMatching: [{ answerContent: '是', questionContent: '' }],
            personalMatching: [{ answerContent: '是', questionContent: '' }],
            personalNoMatching: [{ answerContent: '是', questionContent: '' }]
        });
    };


    /**
     * @description 返回
     */
    const cancel = () => {
        history.goBack();
    };

    /**
     * @description 获取版本号
     */
    const getTemplateVersion = () => {
        dispatch({
            type: 'DOUBLE_RECORD/maxVersion',
            payload: { doubleType: '2' },
            callback: (res) => {
                if (res.code === 1008) {
                    form.setFieldsValue({ version: res.data });
                }
            }
        });
    };


    /**
     * @description 获取模板信息
     */
    const getTemplateInfo = () => {
        dispatch({
            type: 'DOUBLE_RECORD/templateInfo',
            payload: { templateCode: params.id, doubleType: 2 },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {

                    if (data.template && data.template.publishStatus === 1) {
                        setIsEdit(true);
                    }

                    form.setFieldsValue({
                        organizationMatching: data.organizationMatching,
                        organizationNoMatching: data.organizationNoMatching,
                        personalMatching: data.personalMatching,
                        personalNoMatching: data.personalNoMatching,
                        version: data.template && data.template.versionNumber
                    });
                }
            }
        });
    };

    /**
     * @description 获取模板信息
     */
    const getEditIngTemplateInfo = () => {
        dispatch({
            type: 'DOUBLE_RECORD/editIngTemplateInfo',
            payload: { doubleType: 2 },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    if (data.template === null) {
                        getTemplateVersion();
                        initForm();
                    } else {
                        form.setFieldsValue({
                            organizationMatching: data.organizationMatching,
                            organizationNoMatching: data.organizationNoMatching,
                            personalMatching: data.personalMatching,
                            personalNoMatching: data.personalNoMatching,
                            version: data.template && data.template.versionNumber
                        });
                    }
                }
            }
        });
    };


    /**
     * @description 创建或者修改版本
     */
    const crateOrUpdateTemplate = (publishStatus) => {
        const formData = form.getFieldsValue();
        dispatch({
            type: 'DOUBLE_RECORD/crateOrUpdateTemplate',
            payload: { ...formData, publishStatus, doubleType: '2', riskType: '1' },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提醒', `${publishStatus ===0 && '创建' || '发布'}成功！`);
                    console.log(res)
                    history.push({
                        pathname: `/raisingInfo/doubleRecordConfig/aiMindDetails/${res.data.sysWordId}`
                    });
                    // if (publishStatus === 1) {
                    //     // cancel();
                    // }
                } else {
                    let msg = res.message || '创建失败！';
                    openNotification('error', '提醒', msg);
                }
            }
        });
    };


    /**
     * @description 获取受影响的产品
     */
    const getInfluenceProductList = () => {
        dispatch({
            type: 'DOUBLE_RECORD/influenceProductList',
            payload: { doubleType: 2 },
            callback: (res) => {
                const { data = [], code, message } = res;
                if (code === 1008) {
                    if (data.length) {
                        setProductList(data);
                        setModalFlag(true);
                    } else {
                        crateOrUpdateTemplate(1);
                    }
                } else {
                    let msg = message || '获取受影响的产品失败！';
                    openNotification('error', '提醒', msg);
                }
            }
        });
    };




    /**
     * @description id 为0时表示新建;新建时获取版本号
     */
    if (params.id === '0') {
        useEffect(getEditIngTemplateInfo, []);
    } else {
        getTemplateInfo();
    }


    /**
     * @description 保存或者创建
     * @param {*} type 1 发布 0 保存
     */
    const onsubmit = (type) => {

        form.validateFields().then((values) => {
            const formData = form.getFieldsValue();

            if (!formData.personalMatching) {
                return openNotification('error', '提醒', '个人风险匹配话术不能为空！');
            }

            if (!formData.personalNoMatching) {
                return openNotification('error', '提醒', '个人不风险匹配话术不能为空！');
            }

            if (!formData.organizationMatching) {
                return openNotification('error', '提醒', '机构风险匹配话术不能为空！');
            }

            if (!formData.organizationNoMatching) {
                return openNotification('error', '提醒', '机构风险不匹配话术不能为空！');
            }

            if (type === 0) {
                crateOrUpdateTemplate(type);
            } else {
                getInfluenceProductList();
            }
        }).catch((errorInfo) => {
            // console.log(errorInfo, 'errorInfo');
        });


    };


    /**
     * @description 添加输入框
     */
    const addItem = (type, i) => {
        const list = form.getFieldValue(type);
        list.splice(i, 0, { answerContent: '是', questionContent: '' });
        form.setFieldsValue({ type: list });
    };

    // 下载
    const templateDownload = () => {
        window.location.href = `${BASE_PATH.adminUrl}${'/attachments/downloadFile'}?source=${105}&codeType=${1100}&tokenId=${getCookie('vipAdminToken')}`;
    };


    return (
        <PageHeaderWrapper title="双录详情">
            <div className={_styles.doubleBaseForm}>
                <Form form={form} autoComplete="off">
                    <Card title="基本信息">
                        <Form.Item name="version" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} label="版本名称" extra="系统双录版本号自动生成，每次自动加1">
                            <Input disabled />
                        </Form.Item>
                    </Card>
                    <Card title={<p>话术信息{authExport && <a onClick={templateDownload} >点击查看支持通配符信息</a>}</p>} className={_styles.questionCard}>

                        <Collapse defaultActiveKey={'1'} >
                            <Collapse.Panel header="风险匹配情况（个人）版" key="1" forceRender>
                                <Form.List name="personalMatching">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, i) => (
                                                <Row gutter={8} key={i}>

                                                    <Col span={22}>
                                                        <Form.Item
                                                            {...formItemLayout1}
                                                            label={`问题${i + 1}`}
                                                            extra={'要求回答:是'}
                                                            {...field}
                                                            name={[field.name, 'questionContent']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    whitespace: true,
                                                                    message: '请输入问题'
                                                                }
                                                            ]}
                                                        >
                                                            <Input disabled={isEdit} />
                                                        </Form.Item>
                                                    </Col>
                                                    {!isEdit &&
                                                        <Col span={2}>
                                                            <span
                                                                className={_styles.addIcon}
                                                                title="在此问题后面添加一个问题"
                                                                onClick={() => {
                                                                    addItem('personalMatching', i + 1);
                                                                }}
                                                            >
                                                                <PlusOutlined />
                                                            </span>
                                                            {fields.length > 1 ? (
                                                                <span className={_styles.delIcon} onClick={() => remove(field.name)}>
                                                                    <CloseOutlined />
                                                                </span>
                                                            ) : null}
                                                        </Col>
                                                    }
                                                </Row>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Collapse.Panel>
                            <Collapse.Panel header="风险不匹配情况（个人）" key="2" forceRender>
                                <Form.List name="personalNoMatching">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, i) => (
                                                <Row gutter={8} key={i}>

                                                    <Col span={22}>
                                                        <Form.Item
                                                            {...formItemLayout1}
                                                            label={`问题${i + 1}`}
                                                            extra={'要求回答:是'}
                                                            {...field}
                                                            name={[field.name, 'questionContent']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    whitespace: true,
                                                                    message: '请输入问题'
                                                                }
                                                            ]}
                                                        >
                                                            <Input disabled={isEdit} />
                                                        </Form.Item>
                                                    </Col>

                                                    {!isEdit &&
                                                        <Col span={2}>
                                                            <span
                                                                className={_styles.addIcon}
                                                                title="在此问题后面添加一个问题"
                                                                onClick={() => {
                                                                    addItem('personalNoMatching', i + 1);
                                                                }}
                                                            >
                                                                <PlusOutlined />
                                                            </span>
                                                            {fields.length > 1 ? (
                                                                <span className={_styles.delIcon} onClick={() => remove(field.name)}>
                                                                    <CloseOutlined />
                                                                </span>
                                                            ) : null}
                                                        </Col>
                                                    }
                                                </Row>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Collapse.Panel>
                            <Collapse.Panel header="风险匹配情况（机构）版" key="3" forceRender>
                                <Form.List name="organizationMatching">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, i) => (
                                                <Row gutter={8} key={i}>

                                                    <Col span={22}>
                                                        <Form.Item
                                                            {...formItemLayout1}
                                                            label={`问题${i + 1}`}
                                                            extra={'要求回答:是'}
                                                            {...field}
                                                            name={[field.name, 'questionContent']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    whitespace: true,
                                                                    message: '请输入问题'
                                                                }
                                                            ]}
                                                        >
                                                            <Input disabled={isEdit} />
                                                        </Form.Item>
                                                    </Col>

                                                    {!isEdit &&
                                                        <Col span={2}>
                                                            <span
                                                                className={_styles.addIcon}
                                                                title="在此问题后面添加一个问题"
                                                                onClick={() => {
                                                                    addItem('organizationMatching', i + 1);
                                                                }}
                                                            >
                                                                <PlusOutlined />
                                                            </span>
                                                            {fields.length > 1 ? (
                                                                <span className={_styles.delIcon} onClick={() => remove(field.name)}>
                                                                    <CloseOutlined />
                                                                </span>
                                                            ) : null}
                                                        </Col>
                                                    }
                                                </Row>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Collapse.Panel>
                            <Collapse.Panel header="风险不匹配情况（机构）" key="4" forceRender>
                                <Form.List name="organizationNoMatching">
                                    {(fields, { add, remove }) => (
                                        <>
                                            {fields.map((field, i) => (
                                                <Row gutter={8} key={i}>

                                                    <Col span={22}>
                                                        <Form.Item
                                                            {...formItemLayout1}
                                                            label={`问题${i + 1}`}
                                                            extra={'要求回答:是'}
                                                            {...field}
                                                            name={[field.name, 'questionContent']}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    whitespace: true,
                                                                    message: '请输入问题'
                                                                }
                                                            ]}
                                                        >
                                                            <Input disabled={isEdit} />
                                                        </Form.Item>
                                                    </Col>

                                                    {!isEdit &&
                                                        <Col span={2}>
                                                            <span
                                                                className={_styles.addIcon}
                                                                title="在此问题后面添加一个问题"
                                                                onClick={() => {
                                                                    addItem('organizationNoMatching', i + 1);
                                                                }}
                                                            >
                                                                <PlusOutlined />
                                                            </span>
                                                            {fields.length > 1 ? (
                                                                <span className={_styles.delIcon} onClick={() => remove(field.name)}>
                                                                    <CloseOutlined />
                                                                </span>
                                                            ) : null}
                                                        </Col>
                                                    }
                                                </Row>
                                            ))}
                                        </>
                                    )}
                                </Form.List>
                            </Collapse.Panel>
                        </Collapse>
                    </Card>

                    {(!isEdit && authEdit) &&
                        <Row justify="center" align="middle" style={{ height: '50px' }} >
                            <Space>
                                <Button onClick={cancel} > 取消 </Button>
                                <Button type="primary" htmlType="submit" onClick={() => onsubmit(0)} loading={saveLoading}>保存</Button>
                                <Button type="primary" htmlType="submit" onClick={() => onsubmit(1)} loading={saveLoading}>发布</Button>
                            </Space>
                        </Row>
                    }
                </Form>

                <Modal
                    title="系统双录模板修改"
                    visible={modalFlag}
                    onCancel={() => setModalFlag(false)}
                    maskClosable={false}
                    width={800}
                    footer={[
                        <Button key="back" onClick={() => setModalFlag(false)} > 取消</Button>,
                        <Button key="submit" type="primary" onClick={() => crateOrUpdateTemplate(1)} loading={saveLoading}>保存</Button>
                    ]}
                >
                    <p>点击保存后，系统双录模板内容会变更为新内容，使用该模板的产品产品双录模板将一起更新，请您确认是否保存。</p>
                    <Table columns={columns} rowKey="productId" dataSource={productList} scroll={{ x: '100%', y: 240 }} />
                </Modal>
            </div>
        </PageHeaderWrapper>
    );

};


export default connect(({ DOUBLE_RECORD, loading }) => ({
    DOUBLE_RECORD,
    loading: loading.effects['DOUBLE_RECORD/maxVersion', 'DOUBLE_RECORD/templateInfo', 'DOUBLE_RECORD/influenceProductList', 'DOUBLE_RECORD/crateOrUpdateTemplate'],
    saveLoading: loading.effects['DOUBLE_RECORD/crateOrUpdateTemplate']
}))(AIMindDetails);
