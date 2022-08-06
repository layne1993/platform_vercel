/*
 * @Descripttion: 专业投资者告知书
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-07-12 09:40:43
 */
import React, { useState, useEffect } from 'react';
import { Card, notification, Button, Row, Space, Checkbox, Collapse, Col } from 'antd';
import { connect, FormattedMessage, history } from 'umi';
import lodash, { isArray } from 'lodash';

const { Panel } = Collapse;

// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';




const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60300'] || {};




const professionalInvestorNotice = (props) => {
    const { loading, dispatch } = props;
    const [identifyFlowDynamicTextId, setIdentifyFlowDynamicTextId] = useState(undefined); // 模板id
    const [formData, setFormData] = useState(
        [
            {
                title: '模板1',
                notificationBox: BraftEditor.createEditorState(null),
                checked: true,
                confirmationBar: BraftEditor.createEditorState(null)
            },
            {
                title: '模板2',
                notificationBox: BraftEditor.createEditorState(null),
                checked: false
            }
        ]
    );

    const [checkedList, setCheckList] = useState([]);



    /**
     * @description 获取节点信息
     */
    const getNodeInfo = () => {
        dispatch({
            type: 'NODE_INFO_CONFIG/selectIdentifyFlowText',
            callback: (res) => {
                const {code, data, message } = res;
                // console.log(data)
                if(code === 1008){
                    setIdentifyFlowDynamicTextId(data.identifyFlowDynamicTextId);
                    if(data.bookAffirmSetting && Array.isArray(JSON.parse(data.bookAffirmSetting))){
                        const newArr = [];
                        JSON.parse(data.bookAffirmSetting).map((item)=> item.checked && newArr.push(item.customerType));
                        // console.log(newArr)
                        setCheckList(newArr);
                    }
                    try {
                        const notification = JSON.parse(data.notification);
                        setFormData([
                            {
                                notificationBox: BraftEditor.createEditorState(notification[0]['notificationBox']),
                                checked: notification[0].checked,
                                confirmationBar: BraftEditor.createEditorState(notification[0]['confirmationBar'])
                            },
                            {
                                notificationBox: BraftEditor.createEditorState(notification[1]['notificationBox']),
                                checked: notification[1].checked
                            }
                        ]);
                    } catch (error) {
                        // console.log(error);
                    }

                } else {
                    openNotification('warning', `提示（代码：${code}）`, `${message ? message : '查询失败！'}`, 'topRight');
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
        // console.log(checkedList);
        // console.log(checkedList.indexOf('0'))
        // return;
        const bookAffirmSettingArr = [];
        if(checkedList.indexOf(1)!==-1){
            bookAffirmSettingArr.push({
                customerType:1,
                checked:true
            });
        }else{
            bookAffirmSettingArr.push({
                customerType:1,
                checked:false
            });
        }
        if(checkedList.indexOf(2)!==-1){
            bookAffirmSettingArr.push({
                customerType:2,
                checked:true
            });
        }else{
            bookAffirmSettingArr.push({
                customerType:2,
                checked:false
            });
        }
        if(checkedList.indexOf(3)!==-1){
            bookAffirmSettingArr.push({
                customerType:3,
                checked:true
            });
        }else{
            bookAffirmSettingArr.push({
                customerType:3,
                checked:false
            });
        }

        const checkedArr = [];
        const required = [];
        const formDataArr = [];
        formData.map((item, index) => {
            if(item.checked) {
                checkedArr.push({
                    checked: item.checked,
                    index
                });
                if(item.notificationBox.isEmpty()){
                    required.push(index);
                }
                // eslint-disable-next-line no-prototype-builtins
                if(item.hasOwnProperty('confirmationBar') && item.confirmationBar.isEmpty()){
                    required.push(index);
                }
            }

            const obj = {...item};

            obj.notificationBox = obj.notificationBox.toHTML();

            // eslint-disable-next-line no-prototype-builtins
            if(obj.hasOwnProperty('confirmationBar') ){
                obj.confirmationBar = obj.confirmationBar.toHTML();
            }
            formDataArr.push(obj);
        });

        if(checkedArr.length === 0) {
            openNotification('warning', '', '请选择模板！', 'topRight');
            return;
        }


        if(required.length > 0) {
            openNotification('warning', '', '选中的模板内容不能为空', 'topRight');
            return;
        }


        dispatch({
            type: 'NODE_INFO_CONFIG/saveIdentifyFlowText',
            payload: {
                identifyFlowDynamicTextId,
                notification: JSON.stringify(formDataArr),
                bookAffirmSetting: JSON.stringify(bookAffirmSettingArr)
            },
            callback: (res) => {
                if (res.code === 1008) {
                    getNodeInfo();
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };


    // 富文本编辑器 保存
    const handleEditorChange = (val, index, key) => {
        const newFormData = Array.from(formData);
        newFormData[index][key] = val;
        setFormData(newFormData);
    };

    // 选择模板
    const setChecked = (e, index, otherIndex) => {
        const newFormData = Array.from(formData);
        newFormData[index]['checked'] = e.target.checked;
        if(newFormData[otherIndex]['checked']) {
            newFormData[otherIndex]['checked'] = false;
        }
        setFormData(newFormData);
    };

    /**
     * @description: 将富文本转换为html格式
     * @param {*} val
     */
    const submitContent = (val) => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        return val;
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
            <Collapse defaultActiveKey={['1']} expandIconPosition="right">
                <Panel
                    header={<Checkbox checked={formData[0].checked} onChange={(val) => setChecked(val, 0, 1)} >模板1</Checkbox>}
                    key="1"
                    forceRender
                >
                    <h2 style={{textAlign: 'center'}}>专业投资者告知及确认书</h2>
                    <p>《募集机构告知栏》文本：</p>
                    <BraftEditor
                        value={formData[0] && formData[0].notificationBox}
                        style={{border: '1px solid #d9d9d9'}}
                        onChange={(value) => handleEditorChange(value, 0, 'notificationBox')}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{height: 200}}
                    />
                    <p style={{lineHeight:'50px'}}>募集机构签章：</p>
                    <p>《投资者确认栏》文本：</p>
                    <BraftEditor
                        value={formData[0] && formData[0].confirmationBar}
                        style={{border: '1px solid #d9d9d9'}}
                        onChange={(value) => handleEditorChange(value, 0, 'confirmationBar')}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{height: 200}}
                    />
                    <p style={{lineHeight:'50px'}}>个人投资者/机构投资者机构签章：</p>
                </Panel>
                <Panel
                    header={<Checkbox checked={formData[1].checked} onChange={(val) => setChecked(val, 1, 0)}>模板2</Checkbox>}
                    key="2"
                    forceRender
                >
                    <h2 style={{textAlign: 'center'}}>专业投资者确认书</h2>
                    <p>《募集机构告知栏》文本：</p>
                    <BraftEditor
                        value={formData[1] && formData[1].notificationBox}
                        style={{border: '1px solid #d9d9d9'}}
                        onChange={(value) => handleEditorChange(value, 1, 'notificationBox')}
                        onSave={submitContent}
                        // readOnly={isPublish}
                        controls={[]}
                        contentStyle={{height: 200}}
                    />

                    <Row justify="space-around" style={{lineHeight:'50px'}}> <span>募集机构签章：</span> <span>个人投资者/机构投资者机构签章：</span> </Row>
                </Panel>
            </Collapse>
            <Row justify="center" style={{marginTop: '50px'}}>
                <Space>
                    {
                        authEdit &&  <Button type="primary" loading={loading} onClick={onFinish}>保存</Button>
                    }

                </Space>
            </Row>
        </>

    );
};

export default connect(({ NODE_INFO_CONFIG, loading }) => ({
    NODE_INFO_CONFIG,
    loading: loading.effects['NODE_INFO_CONFIG/saveIdentifyFlowText']
}))(professionalInvestorNotice);

professionalInvestorNotice.defaultProps = {
    data: {},
    params: {}
};
