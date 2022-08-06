/*
 * @description: 普通双录
 * @Author: tangsc
 * @Date: 2020-12-01 16:35:35
 */
import React, { PureComponent } from 'react';
import { Form, Card, Radio, Input, Row, Col, Space, Button, notification, Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from './Tab1.less';
import { connect, history } from 'umi';
import { isEmpty } from 'lodash';
import { getCookie } from '@/utils/utils';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { TextArea } = Input;
const { confirm } = Modal;

const formLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 24
        }
    }
};
// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

@connect(({ PRODUCT_DOUBLE, loading }) => ({
    PRODUCT_DOUBLE,
    loading: loading.effects['PRODUCT_DOUBLE/crateOrUpdateTemplate']
}))
class Tab1 extends PureComponent {
    state = {
        radioValue: 0,
        autoType: 1,               // 是否自动同步：0否；1是
        maxVersion: '',            // 最大版本号
        isSave: false,             // 保存时的按钮loading
        isPublishLoading: false,   // 发布按钮loading
        isRadioChange: false,      // 是否自动更新双录信息从 否设置为是时 为true 从而显示操作按钮
        // 创建一个空的editorState作为初始值
        personalMatching: BraftEditor.createEditorState(null),
        personalNoMatching: BraftEditor.createEditorState(null),
        organizationMatching: BraftEditor.createEditorState(null),
        organizationNoMatching: BraftEditor.createEditorState(null)
    };

    componentDidMount() {
        const { templateCode, params, dispatch } = this.props;
        const { productId } = params;
        let queryName = '';
        if (templateCode === '0') {
            dispatch({
                type: 'PRODUCT_DOUBLE/editIngTemplateInfo',
                payload: {
                    productId,
                    doubleType: 1
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        if (res.data.autoType === 1) {
                            queryName = 'lastTotalTemplateInfo';
                        } else {
                            queryName = 'editIngTemplateInfo';
                        }
                        this._searchTemplate(queryName);

                    }
                }
            });
        } else {
            queryName = 'templateInfo';
            this._searchTemplate(queryName);

        }
        this._searchVersion();
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'PRODUCT_DOUBLE/setTemplateCode',
            payload: {
                templateCode: undefined
            }
        });
    }
    // 表单实例对象
    formRef = React.createRef();



    /**
     * @description: 将富文本转换为html格式
     * @param {*} val
     */
    submitContent = (val) => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        return val.toHTML();
    }


    /**
     * @description: 保存富文本
     * @param {*} editorState
     * @param {*} type 1:个人投资者风险匹配  2: 个人投资者风险不匹配  3:机构投资者风险匹配  4:机构投资者风险匹配
     */
    handleEditorChange = (editorState, type) => {
        if (type === 1) {
            this.setState({ personalMatching: editorState });
        } else if (type === 2) {
            this.setState({ personalNoMatching: editorState });
        } else if (type === 3) {
            this.setState({ organizationMatching: editorState });
        } else if (type === 4) {
            this.setState({ organizationNoMatching: editorState });
        }
    }

    /**
     * @description:查询版本号
     */
    _searchVersion = () => {
        const { dispatch, params } = this.props;
        const { productId } = params;
        // 获取版本号
        dispatch({
            type: 'PRODUCT_DOUBLE/maxVersion',
            payload: {
                doubleType: '1',
                productId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        maxVersion: res.data
                    });
                }
            }
        });
    }

    /**
     * @description: 查询模板信息
     */
    _searchTemplate = (queryName, type) => {
        const { dispatch, params, templateCode } = this.props;
        const { productId } = params;
        const { autoType } = this.state;
        dispatch({
            type: `PRODUCT_DOUBLE/${queryName}`,
            payload: {
                templateCode: queryName === 'templateInfo' ? templateCode : undefined,
                doubleType: 1,
                productId
            },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008 && res.data) {
                    if (type !== 'isRadio') {
                        this.setState({
                            autoType: data.autoType
                        });
                    }
                    this.setState({
                        organizationMatching: !isEmpty(data.organizationMatching) && BraftEditor.createEditorState(data.organizationMatching[0].questionContent),
                        organizationNoMatching: !isEmpty(data.organizationNoMatching) && BraftEditor.createEditorState(data.organizationNoMatching[0].questionContent),
                        personalMatching: !isEmpty(data.personalMatching) && BraftEditor.createEditorState(data.personalMatching[0].questionContent),
                        personalNoMatching: !isEmpty(data.personalNoMatching) && BraftEditor.createEditorState(data.personalNoMatching[0].questionContent)
                    });
                    this.formRef.current.setFieldsValue({
                        templateName: data.productTemplateName,
                        sysTemplateName: data.sysTemplateName,
                        autoType: type !== 'isRadio' ? data.autoType : autoType
                    });

                }
            }
        });
    }

    /**
     * @description: 保存、发布
     * @param {*}
     */
    _onSave = (status) => {
        const { autoType, maxVersion, organizationMatching, organizationNoMatching, personalMatching, personalNoMatching } = this.state;

        const { params } = this.props;
        const { productId } = params;
        const _this = this;

        let organMatch = [];
        let organNoMatch = [];
        let perMatch = [];
        let perNopMatch = [];
        if (this.submitContent(personalMatching) === '<p></p>') {
            openNotification('warning', '提示', '个人投资者风险匹配话术信息不能为空', 'topRight');
            return;
        } else if (this.submitContent(personalNoMatching) === '<p></p>') {
            openNotification('warning', '提示', '个人投资者风险不匹配话术信息不能为空', 'topRight');
            return;
        } else if (this.submitContent(organizationMatching) === '<p></p>') {
            openNotification('warning', '提示', '机构投资者风险匹配话术信息不能为空', 'topRight');
            return;
        } else if (this.submitContent(organizationNoMatching) === '<p></p>') {
            openNotification('warning', '提示', '机构投资者风险不匹配话术信息不能为空', 'topRight');
            return;
        }
        organMatch.push({
            questionContent: this.submitContent(organizationMatching),
            answerContent: '是'
        });
        organNoMatch.push({
            questionContent: this.submitContent(organizationNoMatching),
            answerContent: '是'
        });
        perMatch.push({
            questionContent: this.submitContent(personalMatching),
            answerContent: '是'
        });
        perNopMatch.push({
            questionContent: this.submitContent(personalNoMatching),
            answerContent: '是'
        });
        let tips = '';
        if (status === '0') {
            tips = '保存';
            this.setState({ isSave: true });
        } else {
            tips = '发布';
            this.setState({ isPublishLoading: true });
        }
        let tempObj = {
            personalMatching: perMatch,
            personalNoMatching: perNopMatch,
            organizationMatching: organMatch,
            organizationNoMatching: organNoMatch,
            doubleType: '1',
            publishStatus: status,
            riskType: '1',
            version: maxVersion,
            productId,
            autoType
        };
        if (autoType === 0) {
            confirm({
                title: '双录模板使用单产品自定义模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击保存后，该双录内容不会根据系统双录模板变更，仅对该产品产品签约生效，请您确认是否保存。保存后请点击发布，该模板发布后生效。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this._handleSave(tips, tempObj, 'editIngTemplateInfo');
                },
                onCancel() {
                }
            });
        } else if (autoType === 1) {
            confirm({
                title: '双录模板使用系统双录模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击保存后，该产品产品的双录模板根据系统双录模板自动变更，请您确认是否保存。保存后请点击发布，该模板发布后生效。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this._handleSave(tips, tempObj, 'lastTotalTemplateInfo');
                },
                onCancel() {
                }
            });
        }
    }

    /**
     * @description: 模板保存接口
     * @param {*}
     */
    _handleSave = (tips, params, type) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'PRODUCT_DOUBLE/crateOrUpdateTemplate',
            payload: {
                ...params
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    openNotification('success', '提示', `${tips}成功`, 'topRight');
                    if (tips === '发布') {
                        this._handleGoBack();
                        this.setState({ isPublishLoading: false });
                    } else {
                        this.setState({ isSave: false });
                        this._searchTemplate(type);
                    }
                } else {
                    const warningText = res.message || res.data || `${tips}失败`;
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }

    /**
     * @description: 切换自动跟新双录radio
     * @param {*}
     */
    _onRadioValue = (e) => {
        const { dispatch, params } = this.props;
        const { productId } = params;
        this._searchVersion();
        const _this = this;
        if (e.target.value === 1) {
            confirm({
                title: '双录模板修改为系统模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击确认，该产品产品双录内容变更为系统双录模板，原编辑内容会被新的系统双录内容覆盖，请确认。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        autoType: 1,
                        isRadioChange: true
                    }, () => {
                        // dispatch({
                        //     type: 'PRODUCT_DOUBLE/updateProductAutoType',
                        //     payload: {
                        //         productId,
                        //         ordinaryAutoType: e.target.value
                        //     }
                        // }).then(() => {
                        _this._searchTemplate('lastTotalTemplateInfo', 'isRadio');
                        // });

                    });
                },
                onCancel() {
                    _this.setState({ autoType: 0, isRadioChange: false });
                    _this.formRef.current.setFieldsValue({ autoType: 0 });
                }
            });
        } else if (e.target.value === 0) {
            confirm({
                title: '双录模板修改为自定义模板',
                icon: <ExclamationCircleOutlined />,
                content: '点击确认，该产品产品双录内容可以自行修改，不根据系统模板变化，仅对该产品产品签约生效。原编辑内容会被新的系统双录内容覆盖，请确认。',
                okText: '确认',
                cancelText: '取消',
                onOk() {
                    _this.setState({
                        autoType: 0
                    }, () => {
                        // dispatch({
                        //     type: 'PRODUCT_DOUBLE/updateProductAutoType',
                        //     payload: {
                        //         productId,
                        //         ordinaryAutoType: e.target.value
                        //     }
                        // }).then(() => {
                        _this._searchTemplate('editIngTemplateInfo', 'isRadio');
                        // });
                    });
                },
                onCancel() {
                    _this.setState({ autoType: 1 });
                    _this.formRef.current.setFieldsValue({ autoType: 1 });
                }
            });
        }

    }

    _handleGoBack = () => {
        if (this.props.setTab) this.props.setTab({ doubleType: '0', productTemplateId: '0' });
    }


    // 下载
    templateDownload = () => {
        window.location.href = `${BASE_PATH.adminUrl}${'/attachments/downloadFile'}?source=${105}&codeType=${1100}&tokenId=${getCookie('vipAdminToken')}`;
    };

    render() {
        const { isSave, isPublishLoading, isRadioChange, autoType, personalMatching, personalNoMatching, organizationMatching, organizationNoMatching } = this.state;
        const { loading, authEdit, authExport } = this.props;


        return (
            <div className={styles.container}>
                <Form
                    onFinish={this._onFinish}
                    autoComplete="off"
                    ref={this.formRef}
                    initialValues={{
                        autoType: 1
                    }}
                >
                    <Card title="基本信息">
                        <Form.Item
                            name="autoType"
                            labelCol={{ span: 8 }}
                            label="是否自动更新双录信息"
                            extra={<div>
                                <p>选择“是”，该产品产品双录话术模板根据系统双录模板自动更新，在本页面不可以修改内容；</p>
                                <p>选择“否”，单独修改本产品双录内容，该模板不会根据系统双录模板变更，仅对该产品产品签约生效</p>
                            </div>}
                        >
                            <Radio.Group onChange={this._onRadioValue} disabled={!authEdit}>
                                <Radio value={1}>是</Radio>
                                <Radio value={0}>否</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item
                            name="sysTemplateName"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 8 }}
                            label="系统双录版本号"
                            extra="版本名称自动生成，每次自动加1"
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item
                            name="templateName"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 8 }}
                            label="产品双录版本号"
                            extra="该产品产品双录模板变更都会自动更新版本号；无论是根据系统模板自动更新或者您手动修改了双录模板内容，产品双录版本号自动加1"
                        >
                            <Input disabled />
                        </Form.Item>
                    </Card>
                    <Card
                        title={<p>话术信息 {authExport && <a onClick={this.templateDownload} >点击查看支持通配符信息</a>}</p>}
                        // extra={<a href="#">点击查看支持通配符信息</a>}
                        className={styles.scriptInformation}
                    >
                        <Row>
                            <Col span={11}>
                                {/* <Form.Item name="personalMatching" label="个人投资者风险匹配" {...formLayout}>
                                    <TextArea disabled={autoType === 1} />
                                </Form.Item> */}
                                <p>个人投资者风险匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={personalMatching}
                                        onChange={(value) => this.handleEditorChange(value, 1)}
                                        onSave={this.submitContent}
                                        readOnly={autoType === 1}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                            <Col span={11}>
                                {/* <Form.Item name="personalNoMatching" label="个人投资者风险不匹配" {...formLayout}>
                                    <TextArea disabled={autoType === 1} />
                                </Form.Item> */}
                                <p>个人投资者风险不匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={personalNoMatching}
                                        onChange={(value) => this.handleEditorChange(value, 2)}
                                        onSave={this.submitContent}
                                        readOnly={autoType === 1}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}>
                                {/* <Form.Item name="organizationMatching" label="机构投资者风险匹配" {...formLayout}>
                                    <TextArea disabled={autoType === 1} />
                                </Form.Item> */}
                                <p style={{ marginTop: 14 }}>机构投资者风险匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={organizationMatching}
                                        onChange={(value) => this.handleEditorChange(value, 3)}
                                        onSave={this.submitContent}
                                        readOnly={autoType === 1}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                            <Col span={11}>
                                {/* <Form.Item name="organizationNoMatching" label="机构投资者风险不匹配" {...formLayout}>
                                    <TextArea disabled={autoType === 1} />
                                </Form.Item> */}
                                <p style={{ marginTop: 14 }}>机构投资者风险不匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={organizationNoMatching}
                                        onChange={(value) => this.handleEditorChange(value, 4)}
                                        onSave={this.submitContent}
                                        readOnly={autoType === 1}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Form.Item
                        // {...submitFormLayout}
                        wrapperCol={24}
                        style={{
                            marginTop: 32,
                            textAlign: 'center'
                        }}
                    >
                        {
                            authEdit &&
                            <Space>
                                {
                                    // autoType === 0 &&
                                    (isRadioChange || autoType === 0) &&
                                    <Button onClick={this._handleGoBack}>
                                        取消
                                    </Button>
                                }
                                {
                                    autoType === 0 &&
                                    <Button
                                        type="primary"
                                        onClick={() => this._onSave('0')}
                                        loading={loading && isSave}
                                    >
                                        保存
                                    </Button>
                                }
                                {
                                    (isRadioChange || autoType === 0) &&
                                    <Button
                                        type="primary"
                                        onClick={() => this._onSave('1')}
                                        loading={loading && isPublishLoading}
                                    >
                                        发布
                                    </Button>
                                }

                                {/* <span className={styles.note}>保存后允许再次编辑，发布后不可以编辑</span> */}
                            </Space>
                        }
                    </Form.Item>
                </Form>
            </div >
        );
    }
}
export default Tab1;
