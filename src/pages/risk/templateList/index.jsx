import React, { useState, useEffect, useForm } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Radio, Row, Col, notification, Input, Form } from 'antd';
import MXTable from '@/pages/components/MXTable';
import { connect } from 'dva';
import moment from 'moment';
import { history } from 'umi';
import { getPermission, getRandomKey } from '@/utils/utils';
import styles from './styles.less';

const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: { span: 4 },
        sm: { span: 4 }
    },
    wrapperCol: {
        xs: { span: 8 },
        sm: { span: 12 }
    }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const TemplateList = (props) => {
    const { authEdit } = getPermission(50200);
    const riskQuestMap = [
        {
            label: '产品类投资者',
            name: 'productNeedRisk',
            key: getRandomKey(4),
            defaultValue: 0
        },
        {
            label: '自然人类投资者',
            name: 'peopleNeedRisk',
            key: getRandomKey(4),
            defaultValue: 1
        },
        {
            label: '机构类投资者',
            name: 'institutionsNeedRisk',
            key: getRandomKey(4),
            defaultValue: 1
        },
        {
            label: 'vip类投资者',
            name: 'vipNeedRisk',
            key: getRandomKey(4),
            defaultValue: 1
        }
    ];
    const columns = [
        {
            title: '问卷类型',
            dataIndex: 'askType',
            align: 'center',
            render(data) {
                if (data === 1) return '个人风险测评问卷';
                if (data === 2 || data === 3) return '公司风险测评问卷';
                return '--';
            }
        },
        {
            title: '问卷版本',
            dataIndex: 'versionNumber',
            align: 'center'
        },
        {
            title: '模板状态',
            dataIndex: 'isDelete',
            align: 'center',
            render(data) {
                if (data === 0) return '生效';
                if (data === 1) return '失效';
            }
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            align: 'center',
            render(data) {
                if (data === 0) return '编辑';
                if (data === 1) return '已发布';
            }
        },
        {
            title: '创建人',
            dataIndex: 'managerUserName',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            sorter: (a, b) => a.createTime - b.createTime,
            render(data) {
                return moment(data).format('YYYY-MM-DD');
            }
        },
        {
            title: '操作',
            align: 'center',
            render(data) {
                if (data.publishStatus) {
                    return (
                        <span
                            className={styles.operation}
                            onClick={(e) => editOrViewTemplate(data)}
                        >
                            查看
                        </span>
                    );
                } else {
                    return (
                        <div>
                            {authEdit ? (
                                <span
                                    style={{
                                        display: authEdit ? 'unset' : 'none'
                                    }}
                                    className={styles.operation}
                                    onClick={(e) => editOrViewTemplate(data)}
                                >
                                    编辑
                                </span>
                            ) : (
                                '--'
                            )}
                        </div>
                    );
                }
            }
        }
    ];
    const initPageData = {
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    };
    const [dataSource, setDataSource] = useState({});
    const [pageData, changePageData] = useState(initPageData);
    const [showTxt, setShowTxt] = useState(false);
    // const [showMessage, setShowMessage] = useState(false);
    const [form] = Form.useForm();
    const _tableChange = (p, e, s) => {
        changePageData({
            ...pageData,
            pageNum: p.current,
            pageSize: p.pageSize
        });
    };
    const editOrViewTemplate = (data) => {
        history.push({
            pathname: `/risk/templateList/template/${data.publishStatus ? 'view' : 'edit'}/${data.riskaskId
                }`,
            query: {
                askType: data.askType,
                showOperation: true
            }
        });
    };

    const addTemplate = (askType) => {
        // history.push(`/risk/templateList/template/edit?askType=${askType}&showOperation=false`)
        history.push({
            pathname: `/risk/templateList/template/edit/${0}`,
            query: {
                askType,
                showOperation: false
            }
        });
    };
    const RefreshPage = () => {
        const { dispatch } = props;
        dispatch({
            type: 'risk/getRiskQuestionnaireTemList',
            payload: pageData,
            callback(res) {
                // res.data.forEach((item,index)=>{
                //     item.riskaskId = index
                // })
                setDataSource(res);
            }
        });
    };
    useEffect(() => {
        RefreshPage();
    }, [pageData.pageNum, pageData.pageSize]);
    const getRiskAskSettingDetail = () => {
        const { dispatch } = props;
        dispatch({
            type: 'risk/riskAskSettingDetail',
            callback(res) {
                setShowTxt(res.needMessage === 1);
                // setShowMessage(res.vipNeedRisk ===1);
                riskQuestMap.map((item, index) => {
                    if (res) {
                        if (res[item.name] === null || res[item.name] === undefined) {
                            res[item.name] = riskQuestMap[index].defaultValue;
                        }
                    } else {
                        res = {};
                        res[item.name] = riskQuestMap[index].defaultValue;
                    }
                });
                form.setFieldsValue({ ...res });

            }
        });
    };

    useEffect(() => {
        getRiskAskSettingDetail();
    }, []);

    const saveIsRiskAssessment = (values) => {
        const { dispatch } = props;
        dispatch({
            type: 'risk/riskAskSettingUpdate',
            payload: {
                ...values,
                vipNeedRisk: values.vipNeedRisk === undefined ? 0 : values.vipNeedRisk,
                needMessage: values.needMessage === undefined ? 0 : values.needMessage,
                noticeContent: values.noticeContent === undefined ? '' : values.noticeContent
            },
            callback(res) {
                console.log(res);
                if (res.code === 1008) {
                    openNotification('success', '提醒', '保存成功');
                } else {
                    openNotification('error', '提醒', res.message || '保存失败！');
                    getRiskAskSettingDetail();
                }
            }
        });
    };

    const updatePage = () => {
        getRiskAskSettingDetail();
        RefreshPage();
    };
    const onFormChange = (values) => {
        if (values[0] && values[0].name.toString() === 'needMessage') {
            if (values[0].value === 1) {
                setShowTxt(true);
            } else {
                setShowTxt(false);
            }
        }
        // if (values[0] && values[0].name.toString() === 'vipNeedRisk') {
        //     if (values[0].value === 1) {
        //         setShowMessage(true);
        //     } else {
        //         form.setFieldsValue({ needMessage:0 });
        //         setShowMessage(false);
        //     }
        // }
    };
    return (
        <PageHeaderWrapper
            title="风险测评问卷模板列表"
            extra={
                <Button type="primary" onClick={updatePage}>
                    刷新页面
                </Button>
            }
        >
            <Card title="投资者风险测评问卷使用配置" style={{ marginBottom: 20 }}>
                <Form
                    form={form}
                    onFieldsChange={onFormChange}
                    {...formItemLayout}
                    onFinish={saveIsRiskAssessment}
                >
                    {
                        riskQuestMap.map((item, index) => {
                            return (
                                <FormItem
                                    name={item.name}
                                    key={item.key}
                                    label={item.label}
                                    initialValues={item.defaultValue}
                                    rules={[
                                        {
                                            // required: managerUserId === null,
                                            required: true,
                                            message: '请选择'
                                        }
                                    ]}
                                >
                                    <Radio.Group>
                                        <Radio value={1}>需要进行风险测评</Radio>
                                        <Radio value={0}>不需要进行风险测评，默认为C5</Radio>
                                    </Radio.Group>
                                </FormItem>
                            );
                        })
                    }
                    <FormItem
                        label="风测完成后短信通知"
                        name="needMessage"
                        rules={[
                            {
                                // required: managerUserId === null,
                                required: true,
                                message: '请选择'
                            }
                        ]}
                    >
                        <Radio.Group>
                            <Radio value={0}>不通知</Radio>
                            <Radio value={1}>通知</Radio>
                        </Radio.Group>
                    </FormItem>
                    {showTxt && (
                        <FormItem
                            rules={[
                                {
                                    // required: managerUserId === null,
                                    required: true,
                                    message: '请输入'
                                }
                            ]}
                            label=" "
                            colon={false}
                            name="noticeContent"
                        >
                            <TextArea autoSize={{ minRows: 4 }} placeholder="请输入" maxLength="140" showCount />
                        </FormItem>
                    )}



                    <Row>
                        <Col offset={20} span={4}>
                            <FormItem>
                                <Button type="primary" htmlType="submit">
                                    保存
                                </Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>

            <Card title="问卷配置列表">
                <div
                    className={styles.btnG}
                    style={{
                        display: authEdit ? 'unset' : 'none'
                    }}
                >
                    <Button
                        onClick={(e) => addTemplate(1)}
                        type="primary"
                        className={styles.firstBtn}
                    >
                        新建自然人问卷模板
                    </Button>
                    <Button onClick={(e) => addTemplate(2)} type="primary">
                        新建机构问卷模板
                    </Button>
                </div>
                <MXTable
                    columns={columns}
                    dataSource={dataSource.data || []}
                    total={dataSource.total}
                    pageNum={pageData.pageNum}
                    rowKey="riskaskId"
                    scroll={{ x: '100%' }}
                    onChange={(p, e, s) => _tableChange(p, e, s)}
                    rowSelection={null}
                    loading={props.loading}
                />
            </Card>
        </PageHeaderWrapper>
    );
};

export default connect(({ risk, loading }) => ({
    risk,
    loading: loading.effects['risk/getRiskQuestionnaireTemList']
}))(TemplateList);
