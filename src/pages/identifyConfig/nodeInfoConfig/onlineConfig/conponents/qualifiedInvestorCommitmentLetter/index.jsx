/*
 * @Descripttion: 合格投资者承诺函
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-09-02 15:25:27
 */
import React, { useState, useEffect } from 'react';
import { Card, notification, Button, Row, Space, Col, Checkbox, Radio, Input } from 'antd';
import { connect, FormattedMessage, history } from 'umi';


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


const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60300'] || { };



const QualifiedInvestorCommitmentLetter = (props) => {
    const { loading, dispatch } = props;
    const [identifyFlowDynamicTextId, setIdentifyFlowDynamicTextId] = useState(undefined); // 模板id
    const [commitmentLetter, setCommitmentLetter] = useState(); //承诺函
    const [checkedList, setCheckList] = useState([]);
    const [radio, setRadio] = useState(0);
    const [validTimePeriod, setValidTimePeriod] = useState(36);




    /**
     * @description 获取节点信息
     */
    const getNodeInfo = () => {


        dispatch({
            type: 'NODE_INFO_CONFIG/selectIdentifyFlowText',
            callback: (res) => {
                const { code, data, message } = res;
                if (code === 1008) {
                    if (data.promiseBookConformSetting && Array.isArray(JSON.parse(data.promiseBookConformSetting))) {
                        const newArr = [];
                        JSON.parse(data.promiseBookConformSetting).map((item) => item.checked && newArr.push(item.customerType));
                        // console.log(newArr)
                        setCheckList(newArr);
                    }
                    setIdentifyFlowDynamicTextId(data.identifyFlowDynamicTextId);
                    setCommitmentLetter(BraftEditor.createEditorState(data.commitmentLetter));
                    if (data.validTimePeriod === -1) {
                        setRadio(-1);
                    } else {
                        setRadio(0);
                        setValidTimePeriod(data.validTimePeriod);
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
        if (commitmentLetter.isEmpty()) {
            openNotification('warning', '', '合格投资者承诺函文本内容不能为空', 'topRight');
            return;
        }
        const promiseBookConformSettingArr = [];
        if (checkedList.indexOf(1) !== -1) {
            promiseBookConformSettingArr.push({
                customerType: 1,
                checked: true
            });
        } else {
            promiseBookConformSettingArr.push({
                customerType: 1,
                checked: false
            });
        }
        if (checkedList.indexOf(2) !== -1) {
            promiseBookConformSettingArr.push({
                customerType: 2,
                checked: true
            });
        } else {
            promiseBookConformSettingArr.push({
                customerType: 2,
                checked: false
            });
        }
        if (checkedList.indexOf(3) !== -1) {
            promiseBookConformSettingArr.push({
                customerType: 3,
                checked: true
            });
        } else {
            promiseBookConformSettingArr.push({
                customerType: 3,
                checked: false
            });
        }
        dispatch({
            type: 'NODE_INFO_CONFIG/saveIdentifyFlowText',
            payload: {
                identifyFlowDynamicTextId,
                commitmentLetter: commitmentLetter.toHTML(),
                promiseBookConformSetting: JSON.stringify(promiseBookConformSettingArr),
                validTimePeriod: radio === 0 ? validTimePeriod : -1
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


    // 富文本change事件
    const handleEditorChange = (val) => {
        setCommitmentLetter(val);
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

    const checkedListonChange = (checkedValues) => {
        console.log('checked = ', checkedValues);
        setCheckList(checkedValues);
    };

    const brforeSetValidTimePeriod = (e) => {
        let val = e.target.value;
        if (val < 0) {
            val = 0;
        }

        setValidTimePeriod(val);
    };



    return (
        <>
            <Row>
                <span>合格投资者认定有效期：</span>
                <Radio.Group onChange={(e) => setRadio(e.target.value)} value={radio}>
                    <Radio value={-1}>长期有效</Radio>
                    <Radio value={0}>有效期</Radio>
                </Radio.Group>
                {radio === 0 && <Input style={{ width: 100 }} value={validTimePeriod} onChange={brforeSetValidTimePeriod} type="number" min={0} suffix="月" />}
            </Row>
            <Card title="合格投资者承诺函文本：">
                <Row>
                    <Col span={24}>
                        <h4 style={{ fontWeight: 700 }}>豁免设置（不走本步骤）</h4>
                    </Col>
                </Row>
                <Row style={{ margin: '20px 0' }}>
                    <Col span={6}>豁免本步骤的投资者：</Col>
                    <Col span={18}>
                        <Checkbox.Group value={checkedList} onChange={checkedListonChange}>
                            <Checkbox value={1}>自然人</Checkbox>
                            <Checkbox value={2}>机构类</Checkbox>
                            <Checkbox value={3}>产品类</Checkbox>
                        </Checkbox.Group>
                    </Col>
                </Row>
                <BraftEditor
                    value={commitmentLetter}
                    style={{ border: '1px solid #d9d9d9' }}
                    onChange={(value) => handleEditorChange(value, 1)}
                    onSave={submitContent}
                    // readOnly={isPublish}
                    controls={[]}
                />
                <Row justify="center" style={{ marginTop: '50px' }}>
                    <Space>
                        {
                            authEdit && <Button type="primary" loading={loading} onClick={onFinish}>保存</Button>
                        }

                    </Space>
                </Row>
            </Card>
        </>
    );
};

export default connect(({ NODE_INFO_CONFIG, loading }) => ({
    NODE_INFO_CONFIG,
    loading: loading.effects['NODE_INFO_CONFIG/saveIdentifyFlowText']
}))(QualifiedInvestorCommitmentLetter);


QualifiedInvestorCommitmentLetter.defaultProps = {
    data: { },
    params: { }
};
