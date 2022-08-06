import React, { useEffect, useState } from 'react';
import { Select, Input, Button, Table, Modal, message, Form } from 'antd';

import MXTable from '@/pages/components/MXTable';

import { getValuationTableProTempList, getTemplateList, updateProTemp, addUpdateProduct, getProductById, delProductById } from '../../../service';

import styles from './index.less';

const {Option} = Select;

interface porpsTs{
    visible:boolean,
    handleCancel?:any
}

const ParsingModal: React.FC<porpsTs> = (props) => {
    const [form] = Form.useForm();
    const { visible, handleCancel } = props;

    const [associatVisible, setassociatVisible] = useState<boolean>(false);
    const [createVisible, setCreateVisible] = useState<boolean>(false);
    const [createModalData, setCreateModalData] = useState<object>({});
    const [loading, setloading] = useState<boolean>(false);
    const [total, settotal] = useState<number>(0);

    const [templateList, settemplateList] = useState<array>([]); // 模板列表
    const [templateId, settemplateId] = useState<string>(''); // 关联模板id

    const [dataSource, setdataSource] = useState<array>([]);
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

    const [searchParams, setsearchParams] = useState<obejct>({
        fundCodeName:'',
        templateId:''
    }); // 关联模板弹窗 搜索参数


    const [pageData, setpageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10
    });

    const columns = [
        {
            title: '产品名称',
            dataIndex: 'fundName',
            align: 'center'
        },
        {
            title: '产品代码',
            dataIndex: 'fundCode',
            align: 'center'
        },
        {
            title: '关联模板',
            dataIndex: 'templateName',
            align: 'center'
        },
        {
            title: '操作',
            align: 'center',
            render: data => {
                return (
                    <>
                        <span className={styles.editBtn} onClick={() => handleEdit(data)}>编辑</span>
                        <span className={styles.delBtn} onClick={() => handleDel(data)}>删除</span>
                    </>
                )
            }
        }
    ];

    const tableChange = (p, e, s)=>{
        console.log(p, 'p值为');
        pageData.pageNum = p.current;
        pageData.pageSize = p.pageSize;
        setpageData({...pageData});
        console.log(pageData, 'pageData值为');
        getValuationTableProTempListAjax();
    };

    const onTableSelectChange=(values)=>{
        setselectedRowKeys([...values]);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onTableSelectChange
    };

    const onInputChange = (e) => {
        searchParams.fundCodeName = e.target.value;
        setsearchParams({...searchParams});
    };

    const onSelectChange = (value)=>{
        searchParams.templateId = value;
        setsearchParams({...searchParams});
    };

    const onSearch = () => {
        getValuationTableProTempListAjax();
    };

    const onReset = () => {
        searchParams.fundCodeName = '';
        searchParams.templateId = '';
        setsearchParams({...searchParams});
        getValuationTableProTempListAjax();
    };

    const onCreate = () => {
        setCreateVisible(true);
    };

    const onDel = async () => {
        const res = await delProductById({ ids: selectedRowKeys });
        if (+res.code === 1001) {
            message.success('删除成功');
            getValuationTableProTempListAjax();
        }
    }

    const handleEdit = async data => {
        const res = await getProductById({ id: data.id });
        if (+res.code === 1001) {
            setCreateVisible(true);
            setCreateModalData(res.data);
        }
    }

    const handleDel = async data => {
        const res = await delProductById({ ids: [data.id] });
        if (+res.code === 1001) {
            message.success('删除成功');
            getValuationTableProTempListAjax();
        }
    }

    const handleCreateOk = async () => {
        const values = await form.validateFields();
        let params;
        if (createModalData.id) {
            params = { ...values, id: createModalData.id };
        } else {
            params = { ...values };
        }
        dispatchSave(params);
    };

    const handleCreateCancel = () => {
        setCreateVisible(false);
        setCreateModalData({});
    }

    const dispatchSave = async params => {
        const res = await addUpdateProduct({ ...params });
        if (+res.code === 1001) {
            if (res.data.flag) {
                message.success(res.data.msg);
                getValuationTableProTempListAjax();
                handleCreateCancel();
            } else {
                message.error(res.data.msg);
            }
        }
    }

    // 模板关联
    const onAssociatClick=()=>{
        setassociatVisible(true);
    };

    const handleAssociatCancel = ()=>{
        setassociatVisible(false);
    };

    const handleAssociatOk = ()=>{
        updateProTempAjax();
    };

    // 模板关联弹窗
    const onTemplateChange = (value)=>{
        settemplateId(value);
    };

    const getValuationTableProTempListAjax =async ()=>{
        setloading(true);
        const res = await getValuationTableProTempList({
            ...pageData,
            ...searchParams
        });
        if(+res.code===1001){
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        setloading(false);

    };

    const getTemplateListAjax = async ()=>{
        const res = await getTemplateList();
        if(+res.code===1001){
            settemplateList([...res.data]);
        }
    };

    // 模板关联
    const updateProTempAjax = async ()=>{
        const res = await updateProTemp({
            proTempIds:JSON.stringify(selectedRowKeys),
            templateId
        });
        if(+res.code === 1001){
            message.success('模板关联成功');
            getValuationTableProTempListAjax();
            setassociatVisible(false);
        }
    };

    useEffect(()=>{
        console.log(visible,'visible变化执行')
        if(visible){
            getTemplateListAjax();
            getValuationTableProTempListAjax();
        }
    }, [visible]);


    useEffect(() => {
        if (createVisible) {
            form.setFieldsValue({
                fundName: createModalData?.fundName ?? '',
                fundCode: createModalData?.fundCode ?? '',
                parseTemplateId: createModalData?.parseTemplateId ?? ''
            });
        } else {
            form.resetFields();
        }
    }, [createVisible, createModalData]);

    return (
        <div>
            <Modal
                visible={visible}
                width="920px"
                title="模板关联设置"
                footer={null}
                onCancel={handleCancel}
            >
                <div className={styles.container}>
                    <div className={styles.controlBar}>
                    产品：
                        <Input
                            className={styles.inputBox}
                            value={searchParams.fundCodeName}
                            onChange={onInputChange}
                            placeholder="请输入产品名称或代码"
                        />
                    模板：
                        <Select  allowClear defaultValue="0" className={styles.inputBox} onChange={onSelectChange} value={searchParams.templateId}>
                            {
                                templateList.map((item, index)=>(<Option value={item.templateId}>{item.templateName}</Option>))
                            }
                        </Select>
                        <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                        查询
                        </Button>
                        <Button className={styles.btnBox} onClick={onReset}>
                        重置
                        </Button>
                    </div>
                    <Button className={styles.btnBox} type="primary" onClick={onCreate}>
                        新增
                    </Button>
                    <Button className={styles.btnBox} type="danger" onClick={onDel} disabled={!selectedRowKeys.length}>
                        删除
                    </Button>
                    {/* <Button type="primary" disabled={!selectedRowKeys.length} style={{ marginBottom: 24 }} onClick={onAssociatClick}>
                    模板关联
                    </Button> */}
                    <MXTable
                        loading={loading}
                        rowSelection={rowSelection}
                        columns={columns}
                        dataSource={dataSource}
                        rowKey="id"
                        total={total}
                        pageNum={pageData.pageNum}
                        onChange={tableChange}
                    />
                    <Modal
                        visible={createVisible}
                        title="新增产品关联"
                        width={360}
                        forceRender
                        onCancel={handleCreateCancel}
                        onOk={handleCreateOk}
                    >
                        <div className={styles.createContainer}>
                            <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} form={form} name="create-form">
                                <Form.Item name="fundName" label="产品名称" rules={[{ required: true }]}>
                                    <Input placeholder="请输入" />
                                </Form.Item>
                                <Form.Item name="fundCode" label="产品代码" rules={
                                    [
                                        {
                                            required: true,
                                            message: '请输入产品代码'
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || /[0-9A-Za-z]{6}/.test(value)) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('只能输入6位数字或字母'));
                                            },
                                        }),
                                    ]
                                }>
                                    <Input placeholder="请输入" />
                                </Form.Item>
                                <Form.Item name="parseTemplateId" label="关联模板" rules={[{ required: true }]}>
                                    <Select>
                                        {
                                            templateList.map((item, index) => (<Option value={item.templateId}>{item.templateName}</Option>))
                                        }
                                    </Select>
                                </Form.Item>
                            </Form>
                        </div>
                    </Modal>
                </div>
            </Modal>

            <Modal
                visible={associatVisible}
                title="模板关联设置"
                onCancel={handleAssociatCancel}
                onOk={handleAssociatOk}
            >
                <Select
                    allowClear
                    showSearch
                    onChange={onTemplateChange}
                    style={{width:360}}
                >
                    {
                        templateList.map((item, index)=>(<Option value={item.templateId}>{item.templateName}</Option>))
                    }
                </Select>
            </Modal>
        </div>
    );
};

export default ParsingModal;
