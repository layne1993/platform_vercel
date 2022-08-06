/*
 * @description: 基本要素card
 * @Author: tangsc
 * @Date: 2021-03-12 14:47:12
 */
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, Input, Radio, Row, Col, Space, Tooltip, notification } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import styles from '../styles/BaseInfoCard.less';
import { isEmpty } from 'lodash';
import { getRandomKey } from '@/utils/utils';
import { connect, history } from 'umi';
import moment from 'moment';
import copyTemplate from '@/assets/copyTemplate.svg';

// 定义表单Item
const FormItem = Form.Item;

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm:ss';


// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const BaseInfoCard = (props) => {

    const { dispatch, productTemplate, loading, templateId, queryData, queryHistory } = props;
    const { templateName, templateStatuis, editHistory, relatedProducts } = productTemplate;

    const [showMore, setShowMOre] = useState(false);

    // 创建表单实例
    const formRef = useRef();

    /**
     * @description: 表单提交事件
     * @param {Object} values
     */
    const _onFinish = (values) => {
        dispatch({
            type: 'productTemplate/updateTemplatStatus',
            payload: {
                lifecycleTemplateId: Number(templateId) !== 0 ? templateId : undefined,
                ...values
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    history.push( `/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/${res.data.lifecycleTemplateId}`);
                    queryData(res.data.lifecycleTemplateId);
                    queryHistory(res.data.lifecycleTemplateId);
                    openNotification('success', '提示', '保存成功', 'topRight');

                } else {
                    const warningText = res.message || res.data || '保存失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description:  Input框失焦事件
     * @param {Object} e
     */
    const _handleBlur = (e) => {
        dispatch({
            type: 'productTemplate/updateState',
            payload: {
                templateName: e.target.value
            }
        });
    };

    // 设置初始化模板名称、模板状态
    useEffect(() => {
        formRef.current.setFieldsValue({
            templateName,
            templateStatuis,
            relatedProducts
        });
    }, [templateName, templateStatuis, relatedProducts]);

    /**
     * @description: 点击显示更多
     * @param {*}
     */
    const _showMore = () => {
        setShowMOre((o) => !o);
    };

    /**
     * @description: 复制为新模板
     * @param {*}
     */
    const _copyNewTemplate = () => {
        dispatch({
            type: 'productTemplate/copyLifeCycleTemplate',
            payload: {
                lifecycleTemplateId: templateId
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    history.replace({
                        pathname: `/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/${res.data}`
                    });
                    queryData(res.data);
                    queryHistory(res.data);
                    openNotification('success', '提示', '复制新模板成功', 'topRight');
                } else {
                    const warningText = res.message || res.data || '复制新模板失败';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    return (
        <Card
            className={styles.baseInfoCardWrapper}
            title="基本信息"
            extra={
                props.authEdit && Number(templateId) !== 0 &&
                <Tooltip placement="top" title={'复制为新模板'}>
                    <img src={copyTemplate} style={{ width: 20, cursor: 'pointer' }} onClick={_copyNewTemplate} />
                </Tooltip>

                // <Button type="primary" onClick={_copyNewTemplate}>复制为新模板</Button>
            }
        >
            <Form
                name="basic"
                onFinish={_onFinish}
                ref={formRef}
                autoComplete="off"
                initialValues={{
                    relatedProducts: 1,
                    templateStatuis: 1
                }}
            >
                <Row gutter={[8, 0]}>
                    <Col span={8}>
                        <FormItem label="模板名称" name="templateName">
                            <Input placeholder="请输入" onBlur={_handleBlur} />
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label="与产品关联"
                            name="relatedProducts"
                            rules={[
                                {required: true, message: '请选择'}
                            ]}
                            // tooltip={{
                            //     title: '发布后该模板不可修改，如果需要修改请将状态改为编辑中再进行修改；修改后的模板只对新建流程生效',
                            //     icon: <InfoCircleOutlined />
                            // }}
                        >
                            <Radio.Group>
                                <Radio value={0}>否</Radio>
                                <Radio value={1}>是</Radio>
                            </Radio.Group>
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            label="模板状态"
                            name="templateStatuis"
                            tooltip={{
                                title: '发布后该模板不可修改，如果需要修改请将状态改为编辑中再进行修改；修改后的模板只对新建流程生效',
                                icon: <InfoCircleOutlined />
                            }}
                        >
                            <Radio.Group>
                                <Radio value={1}>编辑中</Radio>
                                <Radio value={2}>发布</Radio>
                                <Radio value={3}>禁用</Radio>
                            </Radio.Group>
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={[8, 0]} justify="center">
                    <Col>
                        {
                            props.authEdit &&
                            <Button type="primary" htmlType="submit" loading={loading}>
                                保存模板基本信息
                            </Button>
                        }

                    </Col>
                </Row>

                {
                    !isEmpty(editHistory) &&
                    <Card title="操作记录" className={styles.editInfo}>
                        {
                            (showMore ? editHistory : editHistory.slice(0, 2)).map((item) => {
                                return (
                                    <Space key={getRandomKey(5)}>
                                        <p>
                                            {
                                                item.moduleType === 1 &&
                                                <span>{item.operationType === 1 ? '模板创建人：' : '模板修改人：'}{item.managerUserName || '--'}</span>
                                            }
                                            {
                                                item.moduleType === 2 &&
                                                <span>{item.operationType === 1 ? '流程节点创建人：' : '流程节点修改人：'}{item.managerUserName || '--'}</span>
                                            }
                                            <span>
                                                {item.operationType === 1 ? '创建时间：' : '修改时间：'}
                                                {item.operationType === 1 ?
                                                    moment(item.createTime).format(dateFormat)
                                                    : moment(item.updateTime).format(dateFormat)}
                                            </span>
                                        </p>
                                    </Space>
                                );
                            })
                        }
                    </Card>
                }
                {
                    !isEmpty(editHistory) &&
                    <span className={styles.showMore} onClick={_showMore}>{showMore ? '隐藏' : '更多'}</span>
                }

            </Form>
        </Card>
    );
};

export default connect(({ productTemplate, loading }) => ({
    productTemplate,
    loading: loading.effects['productTemplate/updateTemplatStatus']
}))(BaseInfoCard);
