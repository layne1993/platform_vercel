import { Card, Row, Col, Descriptions, Space, Modal, Tabs, Anchor, Form, Input, Select, DatePicker, Radio, Checkbox, Statistic, Button, notification, Spin, Empty, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import type { FC } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { connect, history, useParams } from 'umi';
import { CALL_METHOD, LIFE_STATUS } from '@/utils/publicData';
import { listToMap, getPermission } from '@/utils/utils';
import styles from './style.less';
import FromElement from './components/FormElement/FormElement';
import UpdateRecord from './components/UpdateRecord/UpdateRecord';
import NodeInfo from './components/NodeInfo/NodeInfo';
import OnlineDisk from '@/pages/components/MXOnlineDisk/OnlineDisk';
import moment from 'moment';
const { Link } = Anchor;
const DATE_FORMAT = 'YYYY-MM-DD: HH:mm:ss';
import ExpressInformationTracking from '@/pages/components/ExpressInformationTracking';

const openNotification = (type, message, description, placement, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const formItemLayout = {
    labelCol: {
        xs: { span: 8 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 }
    }
};

interface FlowDetailProps {
    formLoading: boolean,
    dispatch: any,
    updateTitleLoading: boolean,
    nodeInfoSaveLoading: boolean,
    match: any
}

interface nodeParams {
    lifecycleElementList: any[],
    handlerList: any[],
    cutOffTime: string,
    remindNotifier: number,
    remindModel: string,
    auditOpinion: string

}

const { authEdit, authExport } = getPermission(40100);

const ProductLifeCycleInfoDetail: FC<FlowDetailProps> = (props) => {
    const { formLoading, dispatch, updateTitleLoading, nodeInfoSaveLoading, match } = props;
    const { processId } = match.params;
    const [form] = Form.useForm();
    const [formModal] = Form.useForm();
    const [baseInfo, setBaseInfo] = useState<any>({});                                          // 基本信息
    const [nodeList, setNodeList] = useState<any[]>([]); //                                     // 节点list
    const [processTitle, setProcessTitle] = useState<string>(null);                             //流程标题
    const [updateTitleFlag, setUpdateTitleFlag] = useState<boolean>(false);                     // 修改模态框标题
    const [nodeElementDetail, setNodeElementDetail] = useState<any>({});                        // 节点详情
    const [tabActiveKey, setTabActiveKey] = useState<string>(null);                             // tab 选中的key
    const [currentNodeId, setCurrentNodeId] = useState<number | string>(null);                   // 当前节点id
    const [managerUserList, setManagerUserList] = useState<any[]>([]);                           // 处理人下拉list
    const [isSave, setIsSave] = useState<number>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    const [nodeNumList, setNodeNumList] = useState<any[]>([]);

    const queryLifeCycleNodeListByReject = () => {
        if (currentNodeId) {
            dispatch({
                type: 'PRODUCTLIFECYCLEINFO_DETAIL/queryLifeCycleNodeListByReject',
                payload: {
                    lifecycleFlowId: +processId,
                    lifecycleNodeDataId: currentNodeId
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        setNodeNumList(res.data || []);
                    } else {
                        const warningText = res.message || res.data || '查询失败';
                        openNotification('error', `提示（代码：${res.code}）`, warningText, 'topRight');
                    }
                }
            });
        }
    };

    useEffect(queryLifeCycleNodeListByReject, [currentNodeId]);
    // 设置表单
    const setFormFiledsValues = (obj: nodeParams) => {
        const arr = obj.lifecycleElementList;
        let formKeyValues = {};
        arr.map((item) => {
            if (item.type === 'datePicker' && item.fieldValue) {
                formKeyValues[item.fieldName] = moment(item.fieldValue * 1);
            } else if (item.type === 'rangePicker') {
                if (item.fieldValue) {
                    let rangeDate = item.fieldValue.split('#');
                    formKeyValues[item.fieldName] = [moment(rangeDate[0] * 1), moment(rangeDate[1] * 1)];
                } else {
                    formKeyValues[item.fieldName] = undefined;
                }
            } else if (item.type === 'selectMultiple') {
                formKeyValues[item.fieldName] = item.fieldValue ? JSON.parse(item.fieldValue) : undefined;
            } else if (item.type === 'checkbox') {
                formKeyValues[item.fieldName] = item.fieldValue ? JSON.parse(item.fieldValue) : undefined;
            } else {
                formKeyValues[item.fieldName] = item.fieldValue;
            }

        });
        formKeyValues['handlerList'] = obj.handlerList;
        formKeyValues['cutOffTime'] = obj.cutOffTime && moment(obj.cutOffTime);
        formKeyValues['remindNotifier'] = obj.remindNotifier;
        formKeyValues['remindModel'] = obj.remindModel ? JSON.parse(obj.remindModel) : [];
        formKeyValues['auditOpinion'] = obj.auditOpinion;
        console.log(formKeyValues)
        // return;
        form.setFieldsValue(formKeyValues);
    };

    /**
     * @description 查询节点详情
     */
    const queryLifeCycleNodeDetail = (nodeId: string | number) => {
        // if (!(processId && !nodeId)) return;
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/queryLifeCycleNodeDetail',
            payload: {
                lifecycleFlowId: +processId,
                lifecycleNodeDataId: nodeId
            },
            callback: (res) => {
                const { code, data = {} } = res;
                if (code === 1008) {
                    setNodeElementDetail(data);
                    setFormFiledsValues(data);
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description tab change事件
     * @param val
     */
    const tabClick = (val) => {
        setTabActiveKey(val);
        setCurrentNodeId(val);
        queryLifeCycleNodeDetail(val);
    };


    /**
     * @description 查询基本信息
     */
    const queryBasicInformation = () => {
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/queryBasicInformation',
            payload: {
                lifecycleFlowId: +processId
            },
            callback: (res) => {
                const { code, data = {} } = res;
                if (code === 1008) {
                    setProcessTitle(data.processTitle);
                    setBaseInfo(data);
                    tabClick(data.lifecycleNodeDataId + '');
                    // queryLifeCycleNodeDetail(data.lifecycleNodeDataId);
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 查询节点list
     */
    const queryLifeCycleNodeList = () => {
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/queryLifeCycleNodeList',
            payload: {
                lifecycleFlowId: +processId
            },
            callback: (res) => {
                const { code, data = [] } = res;
                if (code === 1008) {
                    setNodeList(data);
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };


    /**
     * @description 获取表单 包装请求参数
     */
    const getFormFiledValues = (formValues = {}) => {
        const arr = Array.from(nodeElementDetail.lifecycleElementList);
        arr.map((item: { [key: string]: any }) => {
            item.fieldValue = formValues[item.fieldName];

            if (item.type === 'datePicker' && formValues[item.fieldName]) {
                item.fieldValue = moment(formValues[item.fieldName]).valueOf();
            }

            if (item.type === 'rangePicker' && formValues[item.fieldName]) {
                const rangeData = `${moment(formValues[item.fieldName][0]).valueOf()}#${moment(formValues[item.fieldName][1]).valueOf()}`;
                item.fieldValue = rangeData;
            }

            if (item.type === 'selectMultiple' && formValues[item.fieldName]) {
                item.fieldValue = JSON.stringify(formValues[item.fieldName]);
            }

            if (item.type === 'checkbox' && formValues[item.fieldName]) {
                item.fieldValue = JSON.stringify(formValues[item.fieldName]);
            }
        });
        return arr;
    };

    /**
     * @description 获取客户下一个节点 若为最后一个节点则返回最后一个节点
     * @param nodeId 当前节点id
     * @returns 下一个节点id
     */
    const getNextNodeId = (nodeId: number | string) => {
        let nextId: number = +nodeId;
        let nodeTotal: number = nodeList.length;
        nodeList.map((item, index) => {
            if (item.lifecycleNodeDataId == nodeId && index < nodeTotal - 1) {
                nextId = nodeList[index + 1].lifecycleNodeDataId;
            }
        });
        return nextId;
    };


    const _toggle = () => {
        setIsModalVisible((o) => !o);
    };

    /**
     * @description 保存生命周期流程节点信息
     */
    const saveProcessNodeInfo = (type: string, id: number | string) => {

        const values = form.getFieldsValue();

        const elementList = getFormFiledValues(values);
        let auditStatus = null;
        let rejectLifecycleNodeDataId = null;

        if (type === 'save') {   // 临时保存
            setIsSave(0);
            auditStatus = 0;
        } else if (type === 'examine') {    // 审核
            setIsSave(1);
            auditStatus = 1;
        } else if (type === 'reject') {      // 驳回
            setIsSave(2);
            rejectLifecycleNodeDataId = id;
            auditStatus = 2;
        }
        let tips = type === 'reject' ? '驳回' : '保存';
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/saveProcessNodeInfo',
            payload: {
                lifecycleFlowId: +processId,
                lifecycleNodeDataId: currentNodeId,
                elementList,
                handlerList: values.handlerList,
                cutOffTime: values.cutOffTime && moment(values.cutOffTime).valueOf(),
                remindNotifier: values.remindNotifier,
                remindModel: values.remindModel && JSON.stringify(values.remindModel),
                auditStatus,
                auditOpinion: values.auditOpinion,
                rejectLifecycleNodeDataId
            },
            callback: (res) => {
                const { code, data = [] } = res;
                if (code === 1008) {
                    openNotification('success', '提示', `${tips}成功`, 'topRight');
                    queryBasicInformation();
                    queryLifeCycleNodeList();
                    if(type === 'reject') {
                        _toggle();
                    }
                } else {
                    const warningText = res.message || res.data || `${tips}失败！`;
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };


    /**
     * @description 获取处理人下拉list
     */
    const getManagerUser = () => {
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/selectAllUser',
            payload: {
                pageSize: 99999,
                pageNo: 1
            },
            callback: ({ code, data }) => {
                if (code === 1008 && data) {
                    setManagerUserList(data.list || []);
                }
            }
        });
    };

    useEffect(getManagerUser, []);
    useEffect(queryBasicInformation, []);
    useEffect(queryLifeCycleNodeList, []);
    // useEffect(queryLifeCycleNodeDetail, []);


    /**
     * @description 保存生命周期流程节点信息
     */
    const updateProcessTitle = () => {
        if (!processTitle) return openNotification('warning', '提示', '流程标题不能为空！', 'topRight');
        dispatch({
            type: 'PRODUCTLIFECYCLEINFO_DETAIL/updateProcessTitle',
            payload: {
                lifecycleFlowId: +processId,
                processTitle
            },
            callback: (res) => {
                const { code, data = [] } = res;
                if (code === 1008) {
                    queryBasicInformation();
                    openNotification('success', '提示', '修改成功！', 'topRight');
                    setUpdateTitleFlag(false);
                } else {
                    const warningText = res.message || res.data || '修改失败！';
                    openNotification('warning', `提示(代码：${res.code})`, warningText, 'topRight');
                }
            }
        });
    };



    //  取消
    const cancel = () => {
        history.goBack();
    };

    /**
     * @description: Tab页签渲染
     * @param {*} item 页签对应的数据
     */
    const TabRender = (item) => {
        return (
            <div className={styles.tabBox} style={{ textAlign: 'left', maxWidth: 200 }}>
                <p>{item.nodeName}</p>
                <p>创建时间：{item.startDate ? moment(item.startDate).format(DATE_FORMAT) : '--'}</p>
                <p title={item.handlerName}>处理人： {item.handlerName || '--'}</p>
            </div>
        );
    };

    /**
     * @description 节点信息
     */
    const NodeInfoItem = () => {
        return (
            <>
                <Row>
                    <Col span={12}>
                        <Form.Item
                            label="节点默认处理人"
                            extra="可多选"
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                placeholder="请选择"
                                style={{ maxWidth: 400 }}
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {[].map((item, index) => (
                                    <Select.Option value={item.value} key={index}>
                                        {item.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="节点截止时间（空则不提醒）"
                            extra="到达此时间未结束，将进行提醒"
                        >
                            <DatePicker showTime />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="截止后通知人员"
                        >
                            <Radio.Group>
                                <Radio value={1}>节点处理人</Radio>
                                <Radio value={2}>全流程处理人</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="通知方式"
                        >
                            <Checkbox.Group style={{ width: '100%' }}>
                                {
                                    CALL_METHOD.map((item) => (
                                        <Checkbox key={item.value} value={item.value}>{item.label}</Checkbox>
                                    ))
                                }
                            </Checkbox.Group>
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    };

    /**
     * 获取处理人名称
     * @param arr
     * @returns
     */
    const getHandleName = (arr: any[] = []) => {
        let names = [];
        arr.map((item) => names.push(item.managerUserName));
        return names.join('、');
    };

    /**
     * @description 设置可编辑节点
     */
    const getEditableNode = ({ sequence, isDelete }) => {
        if (baseInfo.sequence) {
            const [maxEditableNodeSequence] = baseInfo.sequence.split('/');
            return sequence > maxEditableNodeSequence * 1;
        } else {
            return isDelete === 1;
        }
    };


    const _handleOk = () => {
        const fields = formModal.getFieldsValue();
        const { rejectLifecycleNodeDataId } = fields;
        saveProcessNodeInfo('reject', rejectLifecycleNodeDataId);

    };

    return (
        <PageHeaderWrapper>
            <div className={styles.productLifeDetail}>
                <Card
                    title="基本信息"
                    className={styles.cardBox}
                    id="base-info"

                >
                    <Descriptions title="">
                        <Descriptions.Item label="流程标题">
                            {baseInfo.processTitle}
                            {/* {authEdit && <a style={{ marginLeft: 15 }} onClick={() => setUpdateTitleFlag(true)}>修改名称</a>} */}
                        </Descriptions.Item>
                        <Descriptions.Item label="编号">{baseInfo.serialNumber || '--'}</Descriptions.Item>
                        <Descriptions.Item label="模板名称">{baseInfo.templateName || '--'}</Descriptions.Item>
                        <Descriptions.Item label="状态">{baseInfo.flowStatus ? listToMap(LIFE_STATUS)[baseInfo.flowStatus] : '--'}</Descriptions.Item>
                        <Descriptions.Item label="关联产品">{baseInfo.productFullName || '--'}</Descriptions.Item>
                        <Descriptions.Item label="节点序号">{baseInfo.sequence || '--'}</Descriptions.Item>
                        <Descriptions.Item label="当前节名称">{baseInfo.nodeName || '--'}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card
                    title="流程节点信息"
                    className={styles.cardBox}
                    id="node-info"
                >
                    <Tabs
                        tabPosition="left"
                        activeKey={tabActiveKey}
                        onChange={tabClick}
                    >
                        {
                            Array.isArray(nodeList)
                            && nodeList.map((item, index) => {
                                return (
                                    <Tabs.TabPane
                                        key={item.lifecycleNodeDataId}
                                        tab={TabRender(item)}
                                        disabled={getEditableNode(item)}
                                    >

                                        <Form
                                            form={form}
                                            layout="vertical"
                                            {...formItemLayout}
                                            scrollToFirstError
                                        // onFinish={saveProcessNodeInfo}
                                        >
                                            <Spin spinning={formLoading}>
                                                <h2>
                                                    <strong>产品信息</strong>
                                                    {/* <a onClick={() => history.push(`/product/list/details/${baseInfo.productId}`)} style={{ fontSize: 16, marginLeft: 15 }}>点击跳转产品详情页，维护更多信息</a> */}
                                                </h2>
                                                <Row>
                                                    {nodeElementDetail.lifecycleElementList && nodeElementDetail.lifecycleElementList.map((item, index) => (
                                                        <Col key={index} span={12}>{FromElement(item)}</Col>
                                                    ))}
                                                </Row>
                                                {nodeElementDetail.lifecycleElementList && nodeElementDetail.lifecycleElementList.length === 0 && <Row justify="center"><Empty /></Row>}
                                                {/* {NodeInfoItem()} */}
                                                <h2><strong>节点信息</strong></h2>
                                                <NodeInfo nodeHandler={managerUserList} />
                                                {/* <Row>
                                                <Col span={12}>
                                                    <Form.Item
                                                        label="节点默认处理人"
                                                    >
                                                        <Input disabled placeholder={getHandleName(nodeElementDetail.handlerList)} />
                                                    </Form.Item>
                                                </Col>
                                            </Row> */}
                                                <h2><strong>步骤修改记录</strong></h2>
                                                <Row>
                                                    <Col span={12}>
                                                        <Statistic title="修改人员" value={nodeElementDetail.updateUserName || '--'} />
                                                    </Col>
                                                    <Col span={12}>
                                                        <Statistic title="修改时间" value={nodeElementDetail.updateTime ? moment(nodeElementDetail.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'} />
                                                    </Col>
                                                </Row>
                                                <Row justify="center" style={{ marginTop: 30 }}>

                                                    <Space>
                                                        {
                                                            authEdit &&
                                                            <Button
                                                                type="primary"
                                                                htmlType="submit"
                                                                onClick={() => saveProcessNodeInfo('save', '')}
                                                                disabled={nodeElementDetail.chmod === 0}
                                                                loading={isSave===0 && nodeInfoSaveLoading}
                                                            >
                                                                临时保存
                                                            </Button>
                                                        }
                                                        {
                                                            authEdit &&
                                                            <Button
                                                                type="primary"
                                                                disabled={nodeElementDetail.chmod === 0}
                                                                onClick={_toggle}
                                                            >
                                                                不同意，驳回
                                                            </Button>
                                                        }
                                                        {
                                                            authEdit &&
                                                            <Button
                                                                type="primary"
                                                                onClick={() => saveProcessNodeInfo('examine', '')}
                                                                loading={isSave===1 && nodeInfoSaveLoading}
                                                                disabled={nodeElementDetail.chmod === 0}
                                                            >
                                                                {nodeList.length === (index + 1) ? '同意，保存' : '同意，下一步'}
                                                            </Button>

                                                        }
                                                        <Button onClick={cancel}>取消</Button>
                                                    </Space>
                                                </Row>
                                            </Spin>
                                        </Form>

                                    </Tabs.TabPane>);
                            })
                        }
                    </Tabs>
                </Card>
                {/*>*/}
                <ExpressInformationTracking
                    code={40100} // 权限code
                    source={1} // 生命周期或者打新流程
                    sourceId={processId}
                    actionId={baseInfo.lifecycleNodeDataId}
                    id={'package-info'}
                />
                {/*    <img src={packageImg} style={{ maxHeight: '100%', maxWidth: '100%' }} alt="" />*/}
                {/*</Card>*/}
                <Card
                    title="共享信息与文件网盘"
                    className={styles.cardBox}
                    id="file-info"
                >
                    {/* <img src={fileImg} style={{ maxHeight: '100%', maxWidth: '100%' }} alt="" /> */}
                    <OnlineDisk
                        source={1} // 生命周期或者打新流程
                        sourceId={processId}
                        actionId={baseInfo.lifecycleNodeDataId}
                        authEdit={authEdit}
                        authExport={authExport}
                    />
                </Card>
                <UpdateRecord data={baseInfo.recordList || []} />
                <Anchor className={styles.AnchorBox}>
                    <Link href="#base-info" title="基本信息" />
                    <Link href="#node-info" title="流程节点信息" />
                    <Link href="#package-info" title="快递信息跟踪" />
                    <Link href="#file-info" title="共享信息与文件网盘" />
                    <Link href="#edit-info" title="操作记录" />
                </Anchor>
                <Modal
                    title="流程驳回"
                    visible={isModalVisible}
                    onCancel={_toggle}
                    width={400}
                    onOk={_handleOk}

                >
                    <Form
                        form={formModal}
                    >
                        <Form.Item
                            name="rejectLifecycleNodeDataId"
                        >
                            <Select
                                placeholder="请选择"
                                style={{ width: 350 }}
                                allowClear
                            >

                                {
                                    Array.isArray(nodeNumList) &&
                                    nodeNumList.map((item) => {
                                        return (
                                            <Select.Option value={item.lifecycleNodeDataId} key={item.lifecycleNodeDataId}>
                                                {item.nodeName}
                                            </Select.Option>
                                        );
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Form>
                </Modal>
                <Modal >

                </Modal>
            </div>
        </PageHeaderWrapper >
    );

};

export default connect(({ PRODUCTLIFECYCLEINFO_DETAIL, loading }) => ({
    PRODUCTLIFECYCLEINFO_DETAIL,
    nodeInfoSaveLoading: loading.effects['PRODUCTLIFECYCLEINFO_DETAIL/saveProcessNodeInfo'],
    updateTitleLoading: loading.effects['PRODUCTLIFECYCLEINFO_DETAIL/updateProcessTitle'],
    formLoading: loading.effects['PRODUCTLIFECYCLEINFO_DETAIL/queryLifeCycleNodeDetail']
}))(ProductLifeCycleInfoDetail);
