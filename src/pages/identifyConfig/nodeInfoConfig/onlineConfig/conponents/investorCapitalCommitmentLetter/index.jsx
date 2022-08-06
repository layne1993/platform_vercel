/*
 * @Descripttion: 客户资金来源合法性及资产合格承诺
 * @version:
 * @Author: yezi
 * @Date: 2021-02-19 16:31:44
 * @LastEditTime: 2021-04-26 10:36:49
 */
import React, { useState, useEffect } from 'react';
import { Card, notification, Button, Row, Space  } from 'antd';
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


const { authEdit } = sessionStorage.getItem('PERMISSION') && JSON.parse(sessionStorage.getItem('PERMISSION'))['60300'] || {};



const investorCapitalCommitmentLetter = (props) => {
    const { loading, dispatch, modalFlag } = props;
    const [tt1, setTemplateType] = useState();




    /**
     * @description 获取产品list
     */
    const queryByProductName = () => {
        const {dispatch} = props;
        dispatch({
            type: 'PRODUCT_ANNOUNCEMENT/queryByProductName',
            callback: (res) => {
                if(res.code === 1008){
                    // console.log();
                }
            }
        });
    };

    useEffect(queryByProductName, []);

    /**
      * @description 关闭模态框
      */
    const closeModal = () => {
        props.closeModal();
    };

    /**
     * @description 提交
     * @param {*} values
     */
    const onFinish = (values) => {
        // console.log(values, 'values');
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/saveIdentifyOffline',
            payload: {
                ...values
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    closeModal();
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };


    const handleEditorChange = () => {

    };

    /**
     * @description: 将富文本转换为html格式
     * @param {*} val
     */
    const submitContent = (val) => {
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        return val.toHTML();
    };




    return (

        <Card title="客户资金来源合法性及资产合格承诺书文本：">
            <BraftEditor
                value={tt1}
                style={{border: '1px solid #d9d9d9'}}
                onChange={(value) => handleEditorChange(value, 1)}
                onSave={submitContent}
                // readOnly={isPublish}
                controls={[]}
            />
            <Row justify="center" style={{marginTop: '50px'}}>
                <Space> <Button>取消</Button> {
                    authEdit && <Button type="primary">保存</Button>
                } </Space>
            </Row>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_OFFLINE, loading }) => ({
    IDENTIFYFLOW_OFFLINE,
    data: IDENTIFYFLOW_OFFLINE.flowData,
    loading: loading.effects['PRODUCT_ANNOUNCEMENT/saveIdentifyOffline']
}))(investorCapitalCommitmentLetter);


investorCapitalCommitmentLetter.defaultProps = {
    data: {},
    modalFlag: false,
    params: {},
    closeModal: () => {}
};
