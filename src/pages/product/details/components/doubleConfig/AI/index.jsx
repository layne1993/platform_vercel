import React, { useState, useEffect } from 'react';
import { connect, history } from 'umi';
import { CloseOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Space, Form, Input, Card, Tabs, Radio, Row, Col, notification, Modal, Table, Collapse } from 'antd';
import _styles from './styles.less';
import {getCookie} from '@/utils/utils';

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




const AI = (props) => {
    const { dispatch, params, templateCode, authEdit, authExport } = props;
    const [form] = Form.useForm();
    const [num, setNum] = useState(0);
    const [autoType, setRadioValue] = useState('1');
    const [version, setVersion] = useState(undefined);
    const [isFirst, setIsFirst] = useState(true);
    // eslint-disable-next-line no-undef
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
        if (props.setTab) {
            props.setTab({ doubleType: '0', productTemplateId: '0' });
        }
    };

    /**
     * @description 获取版本号
     */
    const getTemplateVersion = () => {
        dispatch({
            type: 'PRODUCT_DOUBLE/maxVersion',
            payload: { doubleType: '2', ...params },
            callback: (res) => {
                if (res.code === 1008) {
                    setVersion(res.data);
                }
            }
        });
    };



    /**
     * @description 获取模板信息
     */
    const getTemplateInfo = () => {
        dispatch({
            type: 'PRODUCT_DOUBLE/templateInfo',
            payload: { templateCode: templateCode, doubleType: 2, ...params },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {

                    setRadioValue(data.autoType + '');

                    form.setFieldsValue({
                        organizationMatching: data.organizationMatching,
                        organizationNoMatching: data.organizationNoMatching,
                        personalMatching: data.personalMatching,
                        personalNoMatching: data.personalNoMatching,
                        productVersion: data.template && data.template.templateName,
                        sysTemplateName: data.sysTemplateName
                    });
                }
            }
        });
    };


    /**
     * @description 获取最新模板信息
     */
    const getLastTotalTemplateInfo = () => {
        dispatch({
            type: 'PRODUCT_DOUBLE/lastTotalTemplateInfo',
            payload: { doubleType: 2, ...params },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {

                    form.setFieldsValue({
                        organizationMatching: data.organizationMatching,
                        organizationNoMatching: data.organizationNoMatching,
                        personalMatching: data.personalMatching,
                        personalNoMatching: data.personalNoMatching,
                        productVersion: data.sysTemplate && data.sysTemplate.templateName,
                        sysTemplateName: data.sysTemplateName
                    });
                }
            }
        });
    };

    /**
     * @description 获取编辑中模板信息
     */
    const getEditIngTemplateInfo = () => {
        dispatch({
            type: 'PRODUCT_DOUBLE/editIngTemplateInfo',
            payload: { doubleType: 2, ...params },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008) {
                    if (data.template === null) {
                        initForm();
                    } else if (data.autoType == '1') {
                        getLastTotalTemplateInfo();
                    } else {
                        if (num === 0) {
                            setRadioValue(data.autoType + '');
                            setNum(num + 1);
                        }

                        form.setFieldsValue({
                            organizationMatching: data.organizationMatching,
                            organizationNoMatching: data.organizationNoMatching,
                            personalMatching: data.personalMatching,
                            personalNoMatching: data.personalNoMatching,
                            productVersion: data.template && data.template.templateName,
                            sysTemplateName: data.template && data.template.templateName
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
            type: 'PRODUCT_DOUBLE/crateOrUpdateTemplate',
            payload: { autoType, version, ...formData, publishStatus, doubleType: '2', riskType: '1', ...params },
            callback: (res) => {
                if (res.code === 1008) {
                    openNotification('success', '提醒', '创建成功！');
                    if (publishStatus === 1) {
                        cancel();
                    }
                } else {
                    let msg = res.message || '创建失败！';
                    openNotification('error', '提醒', msg);
                }
            }
        });
    };

    /**
     * @description 修改启用的模板
     */
    const changeTemplateSource = () => {
        dispatch({
            type: 'PRODUCT_DOUBLE/updateProductAutoType',
            payload: { aiAutoType: 1, ...params },
            callback: (res) => {
                if (res.code === 1008) {
                    getLastTotalTemplateInfo();
                    openNotification('success', '提醒', '修改成功');
                    setRadioValue('1');
                } else {
                    let msg = res.message || '修改失败！';
                    openNotification('error', '提醒', msg);
                }
            }
        });
    };


    useEffect(getTemplateVersion, []);

    /**
     * @description id 为0时表示新建;新建时获取版本号
     */
    if (templateCode === '0') {
        useEffect(getEditIngTemplateInfo, []);
    } else {
        useEffect(getTemplateInfo, []);
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
                if (autoType === '1') {
                    Modal.confirm({
                        title: '双录模板使用系统双录模板',
                        icon: <ExclamationCircleOutlined />,
                        content: '点击保存后，该产品产品的双录模板根据系统双录模板自动变更，请您确认是否保存。保存后请点击发布，该模板发布后生效。',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            crateOrUpdateTemplate(1);
                        }
                    });
                } else {
                    Modal.confirm({
                        title: '双录模板使用单产品自定义模板',
                        icon: <ExclamationCircleOutlined />,
                        content: '点击保存后，该双录内容不会根据系统双录模板变更，仅对该产品产品签约生效，请您确认是否保存。保存后请点击发布，该模板发布后生效。',
                        okText: '确认',
                        cancelText: '取消',
                        onOk: () => {
                            crateOrUpdateTemplate(1);
                        }
                    });

                }
            }
        }).catch((errorInfo) => {
            // console.log(errorInfo);
        });


    };

    /**
     * @description 切换 是否自动更新双录信息 提示框
     * @param {*} e
     */
    const setRadioValueBefore = (e) => {
        const val = e.target.value;
        if (val === '1') {
            Modal.confirm({
                title: '双录模板修改为系统模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击确认，该产品产品双录内容变更为系统双录模板，原编辑内容会被新的系统双录内容覆盖，请确认。',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    getTemplateVersion();
                    setRadioValue('1');
                    getLastTotalTemplateInfo();
                    setIsFirst(false);
                }
            });

        }

        if (val === '0') {
            Modal.confirm({
                title: '双录模板修改为自定义模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击确认，该产品产品双录内容可以自行修改，不根据系统模板变化，仅对该产品产品签约生效。原编辑内容会被新的系统双录内容覆盖，请确认。',
                okText: '确认',
                cancelText: '取消',
                onOk: () => {
                    getTemplateVersion();
                    setRadioValue('0');
                    getEditIngTemplateInfo();
                }
            });

        }
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

    const isEdit = autoType === '1';

    // console.log(autoType, isFirst, 'ppp');

    return (
        <div className={_styles.doubleBaseForm}>
            <Form form={form} autoComplete="off">
                <Card title="基本信息" style={{ backgroundColor: 'white' }}>
                    <Form.Item
                        labelCol={{ span: 8 }}
                        label="是否自动更新双录信息"
                        extra={<div>
                            <p>选择“是”，该产品产品双录话术模板根据系统双录模板自动更新，在本页面不可以修改内容；</p>
                            <p>选择“否”，单独修改本产品双录内容，该模板不会根据系统双录模板变更，仅对该产品产品签约生效</p>
                        </div>}
                    >
                        <Radio.Group onChange={setRadioValueBefore} value={autoType} disabled={!authEdit}>
                            <Radio value={'1'}>是</Radio>
                            <Radio value={'0'}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="sysTemplateName" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} label="系统双录版本号" extra="同步系统双录模板版本号；若选择“是”，此处根据系统双录模板版本号变更；若选择“否”自定义改本产品产品模板，系统双录版本号不作修改">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item name="productVersion" labelCol={{ span: 8 }} wrapperCol={{ span: 8 }} label="产品双录版本号" extra="该产品产品双录模板变更都会自动更新版本号；无论是根据系统模板自动更新或者您手动修改了双录模板内容，产品双录版本号自动加1">
                        <Input disabled />
                    </Form.Item>
                </Card>
                <Card title={<p>话术信息 {authExport && <a onClick={templateDownload} >点击查看支持通配符信息</a>}</p>} className={_styles.questionCard} style={{ backgroundColor: 'white' }}>

                    {/* <Tabs tabPosition={'left'}>
                        <TabPane tab="个人版" key="1" forceRender>
                            <Tabs>
                                <TabPane tab="风险匹配情况（个人）版" key="1" forceRender>
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
                                </TabPane>
                                <TabPane tab="风险不匹配情况（个人）" key="2" forceRender>
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
                                </TabPane>
                            </Tabs>
                        </TabPane>
                        <TabPane tab="机构版" key="2" forceRender>
                            <Tabs>
                                <TabPane tab="风险匹配情况（机构）版" key="1" forceRender>
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
                                </TabPane>
                                <TabPane tab="风险不匹配情况（机构）" key="2" forceRender>
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
                                </TabPane>
                            </Tabs>
                        </TabPane>
                    </Tabs> */}

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
                                                        <Input disabled={isEdit}/>
                                                    </Form.Item>
                                                </Col>
                                                {!isEdit &&
                                                            <Col span={2}>
                                                                <span
                                                                    className={_styles.addIcon}
                                                                    title="在此问题后面添加一个问题"
                                                                    onClick={() => {
                                                                        addItem( 'personalMatching', i + 1);
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
                                                        <Input disabled={isEdit}/>
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
                                                        <Input disabled={isEdit}/>
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
                                                        <Input disabled={isEdit}/>
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

                <Row justify="center" align="middle" style={{ height: '50px' }} >
                    {
                        authEdit &&
                        <Space>
                            <Button onClick={cancel} > 取消 </Button>
                            {autoType === '0' && <Button type="primary" htmlType="submit" onClick={() => onsubmit(0)} >保存</Button>}
                            {(autoType === '0' || !isFirst) && <Button type="primary" htmlType="submit" onClick={() => onsubmit(1)} >发布</Button>}
                        </Space>
                    }
                </Row>



            </Form>

        </div>
    );

};


export default connect(({ PRODUCT_DOUBLE, loading }) => ({
    PRODUCT_DOUBLE,
    // templateCode: PRODUCT_DOUBLE.templateCode,
    loading: loading.effects['PRODUCT_DOUBLE/maxVersion',
    'PRODUCT_DOUBLE/templateInfo',
    'PRODUCT_DOUBLE/influenceProductList',
    'PRODUCT_DOUBLE/crateOrUpdateTemplate',
    'PRODUCT_DOUBLE/editIngTemplateInfo',
    'PRODUCT_DOUBLE/lastTotalTemplateInfo',
    'PRODUCT_DOUBLE/updateProductAutoType'
    ]
}))(AI);
