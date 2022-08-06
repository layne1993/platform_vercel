/*
 * @Descripttion: 节点2 证明材料可自定义相关材料文件
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-07-12 09:35:47
 */
import React, { useState, useEffect } from 'react';
import { Card, Input, Upload, notification, Button, Checkbox, Tabs, Row, Col, Space, Collapse, Modal  } from 'antd';
import { connect, FormattedMessage, history } from 'umi';
import { UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {getCookie} from '@/utils/utils';
import request from '@/utils/rest';



const { TabPane } = Tabs;
const { Panel } = Collapse;
const { TextArea } = Input;


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const persion = {
    general: [
        {
            title: '金融资产（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 111
        }
    ],
    professional: [
        {
            title: '金融资产（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 111
        },
        {
            title: '投资经历：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 112
        }
    ]
};

// 机构
const company = {
    general_company: [
        {
            title: '金融资产（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 151
        },
        {
            title: '营业执照（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 114
        },
        {
            title: '法定代表人证明书（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 115
        },
        {
            title: '法人身份证件（盖章）：',
            remark: '',
            fileUrl: '',
            checked: false,
            disabled: false,
            codeType: 152
        },
        {
            title: '开户许可证（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 118
        }
    ],
    general_legalAuthority: [
        {
            title: '授权委托书（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 116
        },
        {
            title: '经办人身份证复印件：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 117
        }
    ],
    professional_company: [
        {
            title: '金融资产（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 151
        },
        {
            title: '投资经历：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 153
        },
        {
            title: '营业执照(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 114
        },
        {
            title: '法定代表人证明书(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 115
        },
        {
            title: '法人身份证件（盖章）：',
            remark: '',
            fileUrl: '',
            checked: false,
            disabled: false,
            codeType: 152
        },
        {
            title: '开户许可证：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 118
        }
    ],
    professional_legalAuthority: [
        {
            title: '授权委托书(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 116
        },
        {
            title: '经办人身份证复印件：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 117
        }
    ],
    professionalCompany_company: [
        {
            title: '证明材料：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 113
        },
        {
            title: '营业执照(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 114
        },
        {
            title: '法定代表人证明书(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 115
        },
        {
            title: '法人身份证件（盖章）：',
            remark: '',
            fileUrl: '',
            checked: false,
            disabled: false,
            codeType: 152
        },
        {
            title: '开户许可证：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 118
        }
    ],
    professionalCompany_legalAuthority: [
        {
            title: '授权委托书(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 116
        },
        {
            title: '经办人身份证复印件：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 117
        }
    ]
};

// 产品投资者
const product = {
    professional: [
        {
            title: '备案函(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 119
        },
        {
            title: '营业执照(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: true,
            codeType: 114
        },
        {
            title: '托管账户开户证明（盖章）：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 118
        }
    ],
    legalAuthority: [
        {
            title: '授权委托书(盖章)：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 116
        },
        {
            title: '经办人身份证复印件：',
            remark: '',
            fileUrl: '',
            checked: true,
            disabled: false,
            codeType: 117
        }
    ]
};

const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60300'] || {};

const evidence = (props) => {
    const { loading, dispatch } = props;
    const [identifyFlowDynamicTextId, setIdentifyFlowDynamicTextId] = useState(undefined); // 模板id
    const [personCorrelativeMaterial, setPersonCorrelativeMaterial] = useState(persion); //个人客户证明材料
    const [companyCorrelativeMaterial, setCompanyCorrelativeMaterial] = useState(company); //机构客户证明材料
    const [productCorrelativeMaterial, setProductCorrelativeMaterial] = useState(product); //产品客户证明材料
    const [checkedList, setCheckList] = useState([]);


    /**
     * @description 获取产品节点信息
     */
    const getNodeInfo = () => {
        const {dispatch} = props;
        dispatch({
            type: 'NODE_INFO_CONFIG/selectIdentifyFlowText',
            callback: (res) => {
                const {code, data} = res;
                if(code === 1008){
                    if(data.materialsCommitSetting && Array.isArray(JSON.parse(data.materialsCommitSetting))){
                        const newArr = [];
                        JSON.parse(data.materialsCommitSetting).map((item)=> item.checked && newArr.push(item.customerType));
                        // console.log(newArr)
                        setCheckList(newArr)
                    }
                    setIdentifyFlowDynamicTextId(data.identifyFlowDynamicTextId);
                    try {
                        setPersonCorrelativeMaterial(JSON.parse(data.personCorrelativeMaterial));
                        setCompanyCorrelativeMaterial(JSON.parse(data.companyCorrelativeMaterial));
                        setProductCorrelativeMaterial(JSON.parse(data.productCorrelativeMaterial));
                    } catch (error) {
                        // console.log(error);
                    }

                }
            }
        });
    };

    useEffect(getNodeInfo, [1]);


    /**
     * @description 提交
     * @param {*} values
     */
    const onFinish = (data, key) => {
        const materialsCommitSettingArr = [];
        if(checkedList.indexOf(1)!==-1){
            materialsCommitSettingArr.push({
                customerType:1,
                checked:true
            });
        }else{
            materialsCommitSettingArr.push({
                customerType:1,
                checked:false
            });
        }
        if(checkedList.indexOf(2)!==-1){
            materialsCommitSettingArr.push({
                customerType:2,
                checked:true
            });
        }else{
            materialsCommitSettingArr.push({
                customerType:2,
                checked:false
            });
        }
        if(checkedList.indexOf(3)!==-1){
            materialsCommitSettingArr.push({
                customerType:3,
                checked:true
            });
        }else{
            materialsCommitSettingArr.push({
                customerType:3,
                checked:false
            });
        }
        dispatch({
            type: 'NODE_INFO_CONFIG/saveIdentifyFlowText',
            payload: {
                identifyFlowDynamicTextId,
                [key]: JSON.stringify(data),
                materialsCommitSetting:JSON.stringify(materialsCommitSettingArr)
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    getNodeInfo();
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    /**
     * @description 必填字段校验
     * @param {*} data
     */
    const qequiredCheck = (data = {}) => {
        let illegalFields = [];
        for(let key in data) {
            Array.isArray(data[key]) && data[key].map((item, index) => {
                if(item.checked && !item.title) {
                    illegalFields.push({
                        codeType: item.codeType,
                        index
                    });
                }
            });
        }
        if(illegalFields.length > 0) return false;
        return true;
    };

    // 保存前提示
    const onsubmitPre = (formData = {}, key) => {
        if(!qequiredCheck(formData)) {
            openNotification('warning', '提醒', '上传标题不能为空');
            return;
        }
        Modal.confirm({
            title: '合格投资者认定模板修改',
            icon: <ExclamationCircleOutlined />,
            content: '点击保存后，合格投资者认定材料会更新为您修改后的材料，请确认无误后保存！',
            okText: '确认',
            cancelText: '取消',
            onOk: () => onFinish(formData, key)
        });
    };


    //checkbox 选择框
    const checkBoxChange = (e, index, type, data, callback) => {
        const newData = {...data};
        newData[type][index].checked = e.target.checked;
        callback(newData);
    };

    // title input change事件
    const inputOnChange = (e, index, type, data, callback) => {
        const newData = {...data};
        newData[type][index].title = e.target.value;
        callback(newData);
    };

    // textarea change事件
    const textAreaOnChange = (e, index, type, data, callback) => {
        const newData = {...data};
        newData[type][index].remark = e.target.value;
        callback(newData);
    };

    const beforeUpload = async (file, index, type, data, callback) => {
        // setLoading(true)
        const formData = new window.FormData();
        formData.append('source', 14);
        formData.append('codeType', 150);
        formData.append('sourceId', identifyFlowDynamicTextId);
        formData.append('file', file);
        let res = await request.postMultipart('/attachments/uploadFile', formData);
        if (res.code === 1008 && res.data) {
            const newData = {...data};
            newData[type][index].attachmentsId = res.data.attachmentsId;
            newData[type][index].fileUrl = res.data.fileUrl;
            newData[type][index].previewUrl = res.data.baseUrl;
            newData[type][index].fileName = '材料模板';
            callback(newData);
            openNotification('success', '提醒', '上传成功');
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
        // setLoading(false);
        return false;
    };

    //预览拦截
    const onPreview = (file) => {
        if(file.previewUrl) {
            window.open(file.previewUrl);
        } else {
            window.open(file.url);
        }

    };

    // 删除
    const onRemove = (e, index, type, data, callback) => {
        const newData = {...data};
        newData[type][index].attachmentsId = null;
        newData[type][index].fileUrl = null;
        newData[type][index].fileName = '';
        callback(newData);

    };

    // 每项材料
    const evidenceItem = (item = {}, index, type, data, callback) => {
        let fileList = [];
        if(item.attachmentsId) {
            fileList.push({
                uid: item.attachmentsId,
                name: item.fileName,
                url: item.fileUrl,
                previewUrl: item.previewUrl,
                status: 'done'
            });
        }



        return (
            <Row gutter={[10, 10]} key={`${type}-${index}`} style={{borderBottom: 'solid 1px #e6e6e6'}}>
                <Col span={1}>
                    <Checkbox disabled={item.disabled} checked={item.checked} onChange={(e) => checkBoxChange(e, index, type, data, callback)}/>
                </Col>
                <Col span={23}>
                    <Row gutter={[10, 10]}>
                        <Col span={4}>上传标题：</Col>
                        <Col span={12} > <Input placeholder="金融资产（盖章）：" value={item.title} onChange={(e) => inputOnChange(e, index, type, data, callback)} /> </Col>
                        {[116, 117].includes(item.codeType) && <Col offset={4} span={12}><span style={{color:'gray'}}>若是授权代表进行合格投资者认定操作，则展示该步骤</span></Col>}
                    </Row>
                    <Row gutter={[10, 10]}>
                        <Col span={4}>内容备注：</Col>
                        <Col span={12}>
                            <TextArea rows={4} value={item.remark} onChange={(e) => textAreaOnChange(e, index, type, data, callback)}/>
                        </Col>
                    </Row>
                    <Row gutter={[10, 10]}>
                        <Col span={4}>材料模板：</Col>
                        <Col span={12}>
                            <Upload
                                // action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                // headers={{
                                //     tokenId: getCookie('vipAdminToken')
                                // }}
                                fileList={fileList}
                                // defaultFileList={fileList}
                                showUploadList={{
                                    showRemoveIcon: true,
                                    showDownloadIcon: false,
                                    showPreviewIcon: false
                                }}
                                // data={{
                                //     source: 14,
                                //     codeType: 150,
                                //     sourceId: identifyFlowDynamicTextId
                                // }}
                                onPreview={onPreview}
                                onRemove={(e) => onRemove(e, index, type, data, callback)}
                                beforeUpload={(e) => beforeUpload(e, index, type, data, callback)}
                            >
                                <Button icon={<UploadOutlined />}>上传文件</Button>
                            </Upload> <span style={{color: 'gray'}}>建议PDF格式，上传后客户可以自行下载模板填写好上传。如该材料无需使用模板，则无需上传</span> </Col>
                    </Row>
                </Col>

            </Row>
        );
    };
    const checkedListonChange = (checkedValues)=> {
        console.log('checked = ', checkedValues);
        setCheckList(checkedValues);
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <h4 style={{fontWeight:700}}>豁免设置（不走本步骤）</h4>
                </Col>
            </Row>
            <Row style={{margin:'20px 0'}}>
                <Col span={6}>豁免本步骤的投资者：</Col>
                <Col span={18}>
                    <Checkbox.Group value={checkedList} onChange={checkedListonChange}>
                        <Checkbox value={1}>自然人</Checkbox>
                        <Checkbox value={2}>机构类</Checkbox>
                        <Checkbox value={3}>产品类</Checkbox>
                    </Checkbox.Group>
                </Col>
            </Row>
            <Tabs defaultActiveKey="1">
                <TabPane tab="自然人投资者" key="1">
                    <Card title="普通投资者证明材料">
                        {
                            personCorrelativeMaterial.general && personCorrelativeMaterial.general.map((item, index) => evidenceItem(item, index, 'general', personCorrelativeMaterial, setPersonCorrelativeMaterial))
                        }
                    </Card>
                    <Card title="专业投资者证明材料">
                        {
                            personCorrelativeMaterial.professional && personCorrelativeMaterial.professional.map((item, index) => evidenceItem(item, index, 'professional', personCorrelativeMaterial, setPersonCorrelativeMaterial))
                        }
                    </Card>
                    <Row justify="center" style={{marginTop: '50px'}}>
                        <Space>
                            {
                                authEdit && <Button type="primary" loading={loading} onClick={() => onsubmitPre(personCorrelativeMaterial, 'personCorrelativeMaterial')}>保存</Button>
                            }
                        </Space>
                    </Row>
                </TabPane>
                <TabPane tab="机构投资者" key="2" >
                    <Collapse defaultActiveKey={['1']} expandIconPosition="right" >
                        <Panel header="普通投资者证明材料" key="1">
                            <h2 style={{textAlign:'center'}}>机构信息</h2>
                            {
                                companyCorrelativeMaterial.general_company && companyCorrelativeMaterial.general_company.map((item, index) => evidenceItem(item, index, 'general_company', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                            <h2 style={{textAlign:'center'}}>授权代表人信息</h2>
                            {
                                companyCorrelativeMaterial.general_legalAuthority && companyCorrelativeMaterial.general_legalAuthority.map((item, index) => evidenceItem(item, index, 'general_legalAuthority', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                        </Panel>
                        <Panel header="专业投资者证明材料" key="2" forceRender>
                            <h2 style={{textAlign:'center'}}>机构信息</h2>
                            {
                                companyCorrelativeMaterial.professional_company && companyCorrelativeMaterial.professional_company.map((item, index) => evidenceItem(item, index, 'professional_company', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                            <h2 style={{textAlign:'center'}}>授权代表人信息</h2>
                            {
                                companyCorrelativeMaterial.professional_legalAuthority && companyCorrelativeMaterial.professional_legalAuthority.map((item, index) => evidenceItem(item, index, 'professional_legalAuthority', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                        </Panel>
                        <Panel header="专业投资者证明材料（专业投资机构）" key="3" forceRender>
                            <h2 style={{textAlign:'center'}}>机构信息</h2>
                            {
                                companyCorrelativeMaterial.professionalCompany_company && companyCorrelativeMaterial.professionalCompany_company.map((item, index) => evidenceItem(item, index, 'professionalCompany_company', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                            <h2 style={{textAlign:'center'}}>授权代表人信息</h2>
                            {
                                companyCorrelativeMaterial.professionalCompany_legalAuthority && companyCorrelativeMaterial.professionalCompany_legalAuthority.map((item, index) => evidenceItem(item, index, 'professionalCompany_legalAuthority', companyCorrelativeMaterial, setCompanyCorrelativeMaterial))
                            }
                        </Panel>
                    </Collapse>
                    <Row justify="center" style={{marginTop: '50px'}}>
                        <Space>
                            {
                                authEdit && <Button type="primary" loading={loading} onClick={() => onsubmitPre(companyCorrelativeMaterial, 'companyCorrelativeMaterial')}>保存</Button>
                            }

                        </Space>
                    </Row>
                </TabPane>
                <TabPane tab="产品投资者" key="3" forceRender>
                    <Card title="专业产品投资者证明材料">
                        <h2 style={{textAlign:'center'}}>产品信息</h2>
                        {
                            productCorrelativeMaterial.professional && productCorrelativeMaterial.professional.map((item, index) => evidenceItem(item, index, 'professional', productCorrelativeMaterial, setProductCorrelativeMaterial))
                        }
                        <h2 style={{textAlign:'center'}}>授权代表人信息</h2>
                        {
                            productCorrelativeMaterial.legalAuthority && productCorrelativeMaterial.legalAuthority.map((item, index) => evidenceItem(item, index, 'legalAuthority', productCorrelativeMaterial, setProductCorrelativeMaterial))
                        }
                    </Card>
                    <Row justify="center" style={{marginTop: '50px'}}>
                        <Space>
                            {
                                authEdit && <Button type="primary" loading={loading} onClick={() => onsubmitPre(productCorrelativeMaterial, 'productCorrelativeMaterial')}>保存</Button>
                            }

                        </Space>
                    </Row>
                </TabPane>
            </Tabs>
        </>
    );
};

export default connect(({ NODE_INFO_CONFIG, loading }) => ({
    NODE_INFO_CONFIG,
    loading: loading.effects['NODE_INFO_CONFIG/saveIdentifyFlowText']
}))(evidence);


evidence.defaultProps = {
    data: {},
    params: {}
};
