import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Row, Col, Button, Radio, Input, Select, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import { saveDataInfo, getDataDetail, getTemplateSource, saveDataRule } from '../service';

const { Option } = Select;
const { TextArea } = Input;
const DataSourceQueryEdit: React.FC<{}> = (props) => {
    const [form] = Form.useForm();
    const [editType, setEditType] = useState('');
    const [editId, setEditId] = useState('');
    const [dataRules, setDataRules] = useState([]);
    const [newRule, setNewRule] = useState({});
    const [templateSource, setTemplateSource] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [saveLoading, setsaveLoading] = useState(false);
    const [ruleLoading, setruleLoading] = useState(false);

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 14 }
    };

    const initialFormValues = {
        sourceType: 0,
        status: 1,
        emailType: 0
    };

    const handleSaveInfo = async () => {
        const values = await form.validateFields();
        setsaveLoading(true);
        for (let key in values) {
            if (values[key] === undefined) {
                delete values[key];
            }
            if (key === 'createTime' || key === 'updateTime') {
                delete values[key];
            }
        }
        dispatchSaveInfo(values);
    };

    const dispatchSaveInfo = async (data) => {
        const res = await saveDataInfo(data);
        if (+res.code === 1001) {
            message.success('保存成功');
            setsaveLoading(false);
            history.push('/valuationAnalysis/dataSourceQuery');
        }else{
            message.warning(res.message);
            setsaveLoading(false);
        }
    };

    const dispatchDataDetail = async (id) => {
        const res = await getDataDetail({ id });
        if (+res.code === 1001) {
            let values = res.data?.dataSource || {};
            if (values.createTime) values.createTime = moment(values.createTime).format('YYYY-MM-DD HH:mm:ss');
            if (values.updateTime) values.updateTime = moment(values.updateTime).format('YYYY-MM-DD HH:mm:ss');
            form.setFieldsValue(values);
            setDataRules(res.data?.dataSourceRules || []);
        }
    };

    const dispatchTemplateSource = async () => {
        const res = await getTemplateSource();
        if (+res.code === 1001) {
            setTemplateSource(res.data);
        }
    };

    const handleEditRule = () => {
        setIsEdit(true);
    };

    const handleChangeNewSubject = (e) => {
        newRule.subjectKeyWord = e.target.value;
        setNewRule({ ...newRule });
    };

    const handleChangeNewfrom = (e) => {
        newRule.fromKeyWord = e.target.value;
        setNewRule({ ...newRule });
    };

    const handleChangeNewTemp = (val) => {
        newRule.templateId = val;
        setNewRule({ ...newRule });
    };

    const handleInsert = () => {
        const newData = [...dataRules];
        newData.push({ ...newRule });
        setDataRules(newData);
        setNewRule({});
    };

    const handleChangeSubject = (e, index) => {
        let val = e.target.value;
        const newData = [...dataRules];
        let item = newData[index];
        newData.splice(index, 1, { ...item, subjectKeyWord: val });
        setDataRules(newData);
    };

    const handleChangeFromKey = (e, index) => {
        let val = e.target.value;
        const newData = [...dataRules];
        let item = newData[index];
        newData.splice(index, 1, { ...item, fromKeyWord: val });
        setDataRules(newData);
    };

    const handleChangeTemplate = (val, index) => {
        const newData = [...dataRules];
        let item = newData[index];
        newData.splice(index, 1, { ...item, templateId: val });
        setDataRules(newData);
    };

    const handleDel = (index) => {
        const newData = [...dataRules];
        newData.splice(index, 1);
        setDataRules(newData);
    };

    const handleSaveRule = async () => {
        if (dataRules.length === 0 && Object.keys(newRule).length === 0) {
            message.warning('请添加设置');
            return;
        }
        if (newRule.subjectKeyWord) {
            dataRules.push({ ...newRule });
        }

        setruleLoading(true);

        // 判断 dataRulkes 里面每一项是否都填了
        const flag = dataRules.every((item)=>{
            return item.subjectKeyWord&&item.fromKeyWord&&item.templateId;
        });
        if(!flag){
            message.warning('请检查必填项');
            return;
        }

        dataRules.forEach((item, index) => {
            item.order = index + 1;
        });
        const params = {
            dataSourceId: editId,
            entityList: dataRules
        };
        const res = await saveDataRule(params);
        if (+res.code === 1001) {
            message.success('保存成功');
            setIsEdit(false);
        }else{
            message.warning(res.message);
        }
        setruleLoading(false);
    };

    useEffect(() => {
        const { type } = props.location.query;
        setEditType(type);
        if (type === 'edit') {
            setIsEdit(true);
        } else {
            setIsEdit(false);
        }
        const { id } = props.match.params;
        setEditId(id);
        if (id) {
            dispatchDataDetail(id);
        } else {
            form.setFieldsValue({});
        }
        dispatchTemplateSource();
    }, []);

    return (
        <PageHeaderWrapper title={'数据源详情'}>
            <Card>
                <Form form={form} {...layout} initialValues={initialFormValues}>
                    <div className={styles.boxItem}>
                        <div className={styles.topTitle}>
                            <span>基本信息</span>
                            {editType === 'edit' && <Button type="primary" loading={saveLoading} onClick={handleSaveInfo}>保存</Button>}
                        </div>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={8}>
                                <Form.Item name="id" label="编号">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="sourceType" label="类型" rules={[{ required: true }]}>
                                    <Select disabled={editType !== 'edit'}>
                                        <Option value={0}>邮箱</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="sourceName" label="数据源名称" rules={[{ required: true }]}>
                                    <Input disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={8}>
                                <Form.Item name="status" label="状态" rules={[{ required: true }]}>
                                    <Radio.Group disabled={editType !== 'edit'}>
                                        <Radio value={1}>启用</Radio>
                                        <Radio value={0}>禁用</Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item name="remark" label="备注" rules={[{ required: true }]}>
                                    <TextArea rows={3} placeholder="请输入备注" disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={styles.topTitle}>数据源配置  <div style={{color:'red',marginRight:'30%'}}>已知腾讯企业邮箱、网易（163）邮箱必须手动开启邮箱服务器，并使用授权密码登录。</div></div>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={12}>
                                <Form.Item name="emailAccount" label="收件邮箱账号" rules={[{ required: true }]}>
                                    <Input disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="emailPassword" label="收件邮箱密码" rules={[{ required: true }]}>
                                    <Input.Password disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={12}>
                                <Form.Item name="emailUrl" label="邮箱服务器" rules={[{ required: true }]}>
                                    <Input disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="emailType" label="邮箱类型" rules={[{ required: true }]}>
                                    <Select disabled={editType !== 'edit'}>
                                        <Option value={0}>pop3</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <div className={styles.topTitle}>修改信息</div>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={12}>
                                <Form.Item name="createBy" label="创建人" rules={[{ required: true }]}>
                                    <Input disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="createTime" label="创建时间">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={24} className={styles.wrap}>
                            <Col span={12}>
                                <Form.Item name="updateBy" label="修改人" rules={[{ required: true }]}>
                                    <Input disabled={editType !== 'edit'} />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="updateTime" label="修改时间">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                </Form>
                {editId != 0 ? (
                    <div className={styles.boxItem}>
                        <div className={styles.topTitle}>
                            <span>匹配规则设置</span>
                            {isEdit ? (
                                <Button type="primary" loading={ruleLoading} onClick={handleSaveRule}>保存</Button>
                            ) : (
                                <Button type="primary" onClick={handleEditRule}>编辑</Button>
                            )}
                        </div>
                        {dataRules.map((item, index) => (
                            <Row gutter={24} className={styles.rowItem} key={index}>
                                <Col span={8} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>邮件名称关键词：
                                    <Input
                                        style={{ width: 280 }}
                                        value={item.subjectKeyWord}
                                        onChange={(e) => handleChangeSubject(e, index)}
                                        disabled={!isEdit}
                                    />
                                </Col>
                                <Col span={7} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>发件人关键词：
                                    <Input
                                        style={{ width: 280 }}
                                        value={item.fromKeyWord}
                                        onChange={(e) => handleChangeFromKey(e, index)}
                                        disabled={!isEdit}
                                    />
                                </Col>
                                <Col span={7} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>对应模板：
                                    <Select
                                        style={{ width: 280 }}
                                        value={item.templateId}
                                        onChange={(val) => handleChangeTemplate(val, index)}
                                        disabled={!isEdit}
                                    >
                                        {templateSource.map((temp) => (
                                            <Option value={temp.templateId} key={temp.templateId}>{temp.templateName}</Option>
                                        ))}
                                    </Select>
                                </Col>
                                {isEdit && (
                                    <Col span={2}>
                                        <span className={styles.delBtn} onClick={() => handleDel(index)}>删除</span>
                                    </Col>
                                )}
                            </Row>
                        ))}
                        {isEdit && (
                            <Row gutter={24} className={styles.rowItem}>
                                <Col span={8} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>邮件名称关键词：
                                    <Input style={{ width: 280 }} value={newRule.subjectKeyWord} onChange={handleChangeNewSubject} />
                                </Col>
                                <Col span={7} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>发件人关键词：
                                    <Input style={{ width: 280 }} value={newRule.fromKeyWord} onChange={handleChangeNewfrom} />
                                </Col>
                                <Col span={7} className={styles.colItem}>
                                    <span style={{color:'#ff4d4f', marginRight:4}}>*</span>对应模板：
                                    <Select style={{ width: 280 }} value={newRule.templateId} onChange={handleChangeNewTemp}>
                                        {templateSource.map((temp) => (
                                            <Option value={temp.templateId} key={temp.templateId}>{temp.templateName}</Option>
                                        ))}
                                    </Select>
                                </Col>
                                <Col span={2}>
                                    <span className={styles.editBtn} onClick={handleInsert}>插入</span>
                                </Col>
                            </Row>
                        )}
                    </div>
                ) : null}
            </Card>
        </PageHeaderWrapper>
    );
};

export default DataSourceQueryEdit;
