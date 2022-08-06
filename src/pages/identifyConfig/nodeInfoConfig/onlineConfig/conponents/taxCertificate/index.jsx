/*
 * @Descripttion: 税收证明
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-07-12 09:41:13
 */
import React, { useState, useEffect } from 'react';
import { Card, notification, Button, Row, Space, Checkbox, Collapse, Col } from 'antd';
import { connect, FormattedMessage, history } from 'umi';

const { Panel } = Collapse;

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

import { form_data } from './formData';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const { authEdit } =
    (sessionStorage.getItem('PERMISSION') &&
        JSON.parse(sessionStorage.getItem('PERMISSION'))['60300']) ||
    {};

const taxCertificate = (props) => {
    const { loading, dispatch } = props;
    const [taxCertificate, setTaxCertificate] = useState('1'); // 选中的模板
    const [identifyFlowDynamicTextId, setIdentifyFlowDynamicTextId] = useState(undefined); // 模板id
    const [checkedList, setCheckList] = useState([]);
    /**
     * @description 获取产品节点信息
     */
    const getNodeInfo = () => {
        dispatch({
            type: 'NODE_INFO_CONFIG/selectIdentifyFlowText',
            callback: (res) => {
                const { code, data, message } = res;
                if (code === 1008) {
                    if(data.taxBookConformSetting && Array.isArray(JSON.parse(data.taxBookConformSetting))){
                        const newArr = [];
                        JSON.parse(data.taxBookConformSetting).map((item)=> item.checked && newArr.push(item.customerType));
                        // console.log(newArr)
                        setCheckList(newArr);
                    }
                    setIdentifyFlowDynamicTextId(data.identifyFlowDynamicTextId);
                    setTaxCertificate(data.taxCertificate);
                } else {
                    openNotification(
                        'warning',
                        `提示（代码：${code}）`,
                        `${message ? message : '查询失败！'}`,
                        'topRight',
                    );
                }
            }
        });
    };

    useEffect(getNodeInfo, []);

    /**
     * @description 提交
     * @param {*} values
     */
    const onFinish = () => {
        if (!taxCertificate) {
            openNotification('warning', '', '请选择模板！', 'topRight');
            return;
        }
        const taxBookConformSettingArr = [];
        if(checkedList.indexOf(1)!==-1){
            taxBookConformSettingArr.push({
                customerType:1,
                checked:true
            });
        }else{
            taxBookConformSettingArr.push({
                customerType:1,
                checked:false
            });
        }
        if(checkedList.indexOf(2)!==-1){
            taxBookConformSettingArr.push({
                customerType:2,
                checked:true
            });
        }else{
            taxBookConformSettingArr.push({
                customerType:2,
                checked:false
            });
        }
        if(checkedList.indexOf(3)!==-1){
            taxBookConformSettingArr.push({
                customerType:3,
                checked:true
            });
        }else{
            taxBookConformSettingArr.push({
                customerType:3,
                checked:false
            });
        }
        dispatch({
            type: 'NODE_INFO_CONFIG/saveIdentifyFlowText',
            payload: {
                identifyFlowDynamicTextId,
                taxCertificate,
                taxBookConformSetting:JSON.stringify(taxBookConformSettingArr)
            },
            callback: (res) => {
                if (res.code === 1008) {
                    getNodeInfo();
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    // 富文本编辑器change事件
    const handleEditorChange = (val) => {};

    /**
     * @description: 将富文本转换为html格式
     * @param {*} val
     */
    const submitContent = (val) => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        return val.toHTML();
    };

    /**
     * @description 选择模板
     * @param {*} e
     * @param {*} val
     */
    const setChecked = (e, val) => {
        if (e.target.checked) {
            setTaxCertificate(val);
        } else {
            setTaxCertificate(undefined);
        }
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

            <p>请在您想要的模板前面打钩启用</p>
            <Collapse defaultActiveKey={['1']} expandIconPosition={'right'}>
                <Panel
                    header={
                        <Checkbox
                            checked={taxCertificate === '1'}
                            onChange={(e) => setChecked(e, '1')}
                        >
                            模板1
                        </Checkbox>
                    }
                    key="1"
                >
                    <h3>《税收证明文件》文本：</h3>
                    <BraftEditor
                        value={BraftEditor.createEditorState(form_data[0].taxCertificate)}
                        style={{ border: '1px solid #d9d9d9' }}
                        onChange={(value) => handleEditorChange(value, 1)}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{ height: 200 }}
                        readOnly
                    />
                    <h3>附加说明文本：</h3>
                    <BraftEditor
                        value={
                            form_data[0] && BraftEditor.createEditorState(form_data[0].explanation)
                        }
                        style={{ border: '1px solid #d9d9d9' }}
                        onChange={(value) => handleEditorChange(value, 1)}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{ height: 200 }}
                        readOnly
                    />
                </Panel>
                <Panel
                    header={
                        <Checkbox
                            checked={taxCertificate === '2'}
                            onChange={(e) => setChecked(e, '2')}
                        >
                            模板2
                        </Checkbox>
                    }
                    key="2"
                >
                    <h3>《税收证明文件》文本：</h3>
                    <BraftEditor
                        value={
                            form_data[1] &&
                            BraftEditor.createEditorState(form_data[1].taxCertificate)
                        }
                        style={{ border: '1px solid #d9d9d9' }}
                        onChange={(value) => handleEditorChange(value, 1)}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{ height: 200 }}
                        readOnly
                    />
                    <h3>附加说明文本：</h3>
                    <BraftEditor
                        value={
                            form_data[1] && BraftEditor.createEditorState(form_data[1].explanation)
                        }
                        style={{ border: '1px solid #d9d9d9' }}
                        onChange={(value) => handleEditorChange(value, 1)}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{ height: 200 }}
                        readOnly
                    />
                </Panel>
            </Collapse>
            ,
            <Row justify="center" style={{ marginTop: '50px' }}>
                <Space>
                    {authEdit && (
                        <Button type="primary" loading={loading} onClick={onFinish}>
                            保存
                        </Button>
                    )}
                </Space>
            </Row>
        </>
    );
};

export default connect(({ NODE_INFO_CONFIG, loading }) => ({
    NODE_INFO_CONFIG,
    loading: loading.effects['NODE_INFO_CONFIG/saveIdentifyFlowText']
}))(taxCertificate);

taxCertificate.defaultProps = {
    data: {},
    params: {}
};
