/*
 * @description: 普通双录
 * @Author: tangsc
 * @Date: 2020-12-01 16:35:35
 */
import React, { PureComponent } from 'react';
import { Form, Card, Modal, Input, Row, Col, Space, Button, notification, Table } from 'antd';
import styles from './Tab1.less';
import { connect, history } from 'umi';
import { isEmpty } from 'lodash';
import { getCookie } from '@/utils/utils';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { TextArea } = Input;

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

const columns = [
    {
        title: '产品名称',
        dataIndex: 'productFullName'
    }
];

@connect(({ DOUBLE_RECORD, loading }) => ({
    DOUBLE_RECORD,
    loading: loading.effects['DOUBLE_RECORD/crateOrUpdateTemplate']
}))
class Tab1 extends PureComponent {
    state = {
        radioValue: 0,
        isPublish: false,        // 是否发布
        modalFlag: false,
        productList: [],
        isSave: false,
        isPublishLoading: false,
        // 创建一个空的editorState作为初始值
        personalMatching: BraftEditor.createEditorState(null),
        personalNoMatching: BraftEditor.createEditorState(null),
        organizationMatching: BraftEditor.createEditorState(null),
        organizationNoMatching: BraftEditor.createEditorState(null)
    };

    componentDidMount() {
        const { params } = this.props;
        if (params.id === '0') {
            this._searchTemplate('add');
        } else {
            this._searchTemplate('edit', params.id);
        }
    }

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

    // 表单实例对象
    formRef = React.createRef();

    /**
     * @description:查询版本号
     */
    _searchVersion = () => {
        const { dispatch } = this.props;
        // 获取版本号
        dispatch({
            type: 'DOUBLE_RECORD/maxVersion',
            payload: {
                doubleType: '1'
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.formRef.current.setFieldsValue({ version: res.data });
                }
            }
        });
    }


    /**
     * @description 获取受影响的产品
     */
    getInfluenceProductList = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'DOUBLE_RECORD/influenceProductList',
            payload: { doubleType: 1 },
            callback: (res) => {
                const { data = [], code, message } = res;
                if (code === 1008) {
                    if (data.length) {
                        this.setState({
                            productList: data,
                            modalFlag: true
                        });
                    } else {
                        this._onSave('1');
                    }
                } else {
                    let msg = message || '获取受影响的产品失败！';
                    openNotification('error', '提醒', msg);
                }
            }
        });
    };

    /**
     * @description: 查询模板信息
     * @param {*} id
     */
    _searchTemplate = (type, id) => {
        const { dispatch } = this.props;
        let queryName = '';
        if (type === 'edit') {
            queryName = 'templateInfo';
        } else {
            queryName = 'editIngTemplateInfo';
        }
        dispatch({
            type: `DOUBLE_RECORD/${queryName}`,
            payload: {
                templateCode: type === 'edit' ? id : undefined,
                doubleType: 1
            },
            callback: (res) => {
                const { data, code } = res;
                if (code === 1008 && res.data) {
                    if (data.template) {
                        if (data.template.publishStatus === 1) {
                            this.setState({
                                isPublish: true
                            });
                        }
                        this.setState({
                            organizationMatching: !isEmpty(data.organizationMatching) && BraftEditor.createEditorState(data.organizationMatching[0].questionContent),
                            organizationNoMatching: !isEmpty(data.organizationNoMatching) && BraftEditor.createEditorState(data.organizationNoMatching[0].questionContent),
                            personalMatching: !isEmpty(data.personalMatching) && BraftEditor.createEditorState(data.personalMatching[0].questionContent),
                            personalNoMatching: !isEmpty(data.personalNoMatching) && BraftEditor.createEditorState(data.personalNoMatching[0].questionContent)
                        });
                        this.formRef.current.setFieldsValue({
                            version: data.template && data.template.versionNumber
                        });
                    } else {
                        this._searchVersion();
                    }
                }
            }
        });
    }

    /**
     * @description: 保存、发布
     * @param {*}
     */
    _onSave = (status) => {
        let values = this.formRef.current.getFieldsValue();
        const { version } = values;
        const { organizationMatching, organizationNoMatching, personalMatching, personalNoMatching } = this.state;
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
        const { dispatch } = this.props;
        dispatch({
            type: 'DOUBLE_RECORD/crateOrUpdateTemplate',
            payload: {
                personalMatching: perMatch,
                personalNoMatching: perNopMatch,
                organizationMatching: organMatch,
                organizationNoMatching: organNoMatch,
                doubleType: '1',
                publishStatus: status,
                riskType: '1',
                version
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    openNotification('success', '提示', `${tips}成功`, 'topRight');
                    if (status === '1') {
                        this.setState({ isPublishLoading: false });
                        history.push({
                            pathname: `/raisingInfo/doubleRecordConfig/generalDoubleDetails/${res.data.sysWordId}`
                        });
                        this.closeModal();
                    } else if (status === '0') {
                        this.setState({ isSave: false });
                        history.push({
                            pathname: `/raisingInfo/doubleRecordConfig/generalDoubleDetails/${res.data.sysWordId}`
                        });
                        this.closeModal();
                    }
                } else {
                    const warningText = res.message || res.data || `${tips}失败`;
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    }

    _onRadioValue = (e) => {
        this.setState({
            radioValue: e.target.value
        });
    }

    /**
     * @description: 返回列表页
     */
    _handleGoBack = () => {
        history.goBack();
    }

    /**
     * @description: 关闭弹窗
     * @param {*}
     */
    closeModal = () => {
        this.setState({
            modalFlag: false
        });
    }

    // 下载
    templateDownload = () => {
        window.location.href = `${BASE_PATH.adminUrl}${'/attachments/downloadFile'}?source=${105}&codeType=${1100}&tokenId=${getCookie('vipAdminToken')}`;
    };

    render() {
        const { isPublishLoading, isSave, isPublish, modalFlag, productList, personalMatching, personalNoMatching, organizationMatching, organizationNoMatching } = this.state;
        const { loading } = this.props;
        // eslint-disable-next-line no-undef
        const { authEdit, authExport } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60200'] || {};
        return (
            <div className={styles.container}>
                <Form
                    onFinish={this._onFinish}
                    autoComplete="off"
                    ref={this.formRef}
                    initialValues={{
                        isUpdate: 0
                    }}
                >
                    <Card title="基本信息">
                        <Form.Item
                            name="version"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 8 }}
                            label="系统双录版本号"
                            extra="版本名称自动生成，每次自动加1"
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
                                <p>个人投资者风险匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={personalMatching}
                                        onChange={(value) => this.handleEditorChange(value, 1)}
                                        onSave={this.submitContent}
                                        readOnly={isPublish}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                            <Col span={11}>
                                <p>个人投资者风险不匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={personalNoMatching}
                                        onChange={(value) => this.handleEditorChange(value, 2)}
                                        onSave={this.submitContent}
                                        readOnly={isPublish}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={11}>
                                <p style={{ marginTop: 14 }}>机构投资者风险匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={organizationMatching}
                                        onChange={(value) => this.handleEditorChange(value, 3)}
                                        onSave={this.submitContent}
                                        readOnly={isPublish}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                            <Col span={11}>
                                <p style={{ marginTop: 14 }}>机构投资者风险不匹配：</p>
                                <div>
                                    <BraftEditor
                                        value={organizationNoMatching}
                                        onChange={(value) => this.handleEditorChange(value, 4)}
                                        onSave={this.submitContent}
                                        readOnly={isPublish}
                                        controls={[]}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                    {
                        (!isPublish && authEdit) &&
                        <Form.Item
                            wrapperCol={24}
                            style={{
                                marginTop: 32,
                                textAlign: 'center'
                            }}
                        >
                            <Space>
                                <Button onClick={this._handleGoBack}>
                                    取消
                                </Button>
                                <Button
                                    type="primary"
                                    loading={loading && isSave}
                                    onClick={() => this._onSave('0')}
                                >
                                    保存
                                </Button>
                                <Button
                                    type="primary"
                                    loading={loading && isPublishLoading && !modalFlag}
                                    onClick={() => this.getInfluenceProductList()}
                                >
                                    发布
                                </Button>
                                <span className={styles.note}>保存后允许再次编辑，发布后不可以编辑</span>
                            </Space>
                        </Form.Item>
                    }
                </Form>
                <Modal
                    title="系统双录模板修改"
                    visible={modalFlag}
                    onCancel={this.closeModal}
                    maskClosable={false}
                    footer={[
                        <Button key="back" onClick={this.closeModal} > 取消</Button>,
                        <Button key="submit" type="primary" onClick={() => this._onSave('1')} loading={loading}>保存</Button>
                    ]}
                >
                    <p>点击保存后，系统双录模板内容会变更为新内容，使用该模板的产品产品双录模板将一起更新，请您确认是否保存。</p>
                    <Table columns={columns} rowKey="productId" dataSource={productList} scroll={{ x: '100%', y: 240 }} />
                </Modal>
            </div >
        );
    }
}
export default Tab1;
