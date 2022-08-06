/**
 * 份额确认书, 报表模板模块
 */
import React, { useState, useEffect } from 'react';
import {
    Form,
    Tabs,
    Input,
    notification,
    Collapse,
    message,
    Row,
    Button,
    Spin
} from 'antd';
import {connect, history } from 'umi';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import request from '@/utils/rest';
import {getCookie} from '@/utils/utils';
import moment from 'moment';
import Header from '../header/index';
import _styles from './styles.less';

const { TabPane } = Tabs;
const { Panel } = Collapse;

const formLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { set } from 'lodash';

const controls = [
    'bold', 'italic', 'underline', 'text-color', 'link', 'separator'
];

const defaultTxt = '<p>尊敬的【客户名称】</p><p><br/>您好，感谢您认/申购【产品全称】，您的认/申购资金已划入基金托管户，基金管理人与基金托管人现将该认购资金按基金合同约定，确认您认购的份额如下：</p>';


const reportTemplate = (props) =>{
    const { imgUrl, dispatch, loading = false, jsonKey, btnLoading, COMFIRMATION_REPORT_TEMPLATE, defaultParams } = props;
    const { templateInfo, headerInfo } = COMFIRMATION_REPORT_TEMPLATE;
    const [templateName, setTemplateName] = useState(defaultParams.title);
    const [customizeTxt, setCustomize] = useState(BraftEditor.createEditorState(defaultParams.summary));



    /**
     * @description: 将富文本转换为html格式
     * @param {*} val
     */
    const submitContent = (val) => {
        console.log(val, 'setCustomize');
        // 在编辑器获得焦点时按下ctrl+s会执行此方法
        // 编辑器内容提交到服务端之前，可直接调用editorState.toHTML()来获取HTML格式的内容
        return val.toHTML();
    };

    /**
     * @description 获取模板信息
     */
    const getTemplate = () => {
        dispatch({
            type: 'COMFIRMATION_REPORT_TEMPLATE/getTemplate',
            payload: {},
            callback: ({code, data, message}) => {
                if (code === 1008) {
                    try {
                        if (data && data.length > 0) {
                            const templateInfo = data[0];
                            const customizeInfo = templateInfo[jsonKey] ? JSON.parse(templateInfo[jsonKey]) : {};
                            setTemplateName(customizeInfo.title);
                            setCustomize(BraftEditor.createEditorState(customizeInfo.summary));
                            dispatch({
                                type: 'COMFIRMATION_REPORT_TEMPLATE/setHeaderInfo',
                                payload: {
                                    ...customizeInfo
                                }
                            });
                            dispatch({
                                type: 'COMFIRMATION_REPORT_TEMPLATE/setTmplateInfo',
                                payload: {
                                    ...templateInfo
                                }
                            });
                        }

                    } catch (error) {
                        console.log(error);
                    }

                } else {
                    const warningText = message || data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    useEffect(getTemplate, []);

    const saveTemplate = () => {
        if (!templateName) {
            message.warning('模板名称不能为空!');
            return;
        }

        if (customizeTxt.isEmpty()) {
            message.warning('自定义内容不能为空!');
            return;
        }

        // console.log(customizeTxt.toHTML(), 'ggs');

        dispatch({
            type: 'COMFIRMATION_REPORT_TEMPLATE/update',
            payload: {
                ...templateInfo,
                [jsonKey]: JSON.stringify({
                    ...headerInfo,
                    title: templateName,
                    summary: customizeTxt.toHTML()
                })
            },
            callback: ({code, data, message}) => {
                if (code === 1008) {
                    openNotification(
                        'success',
                        `提示（代码：${code}）`,
                        '保存成功',
                        'topRight',
                    );
                    getTemplate();
                } else {
                    const warningText = message || data || '查询失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（代码：${code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };



    return (
        <div className={_styles.templateBox}>
            <Spin spinning={loading}>
                <Header/>
                <div className={_styles.titleBox}><Input placeholder="请输入" value={templateName} onChange={(e) =>setTemplateName(e.target.value)} /></div>
                <div style={{ height: 250 }}>
                    <BraftEditor
                        value={customizeTxt}
                        style={{ border: '1px solid #d9d9d9' }}
                        onChange={setCustomize}
                        onSave={submitContent}
                        controls={controls}
                        contentStyle={{ height: 200 }}
                    />
                </div>
                {/* <div style={{height: 500, backgroundImage: `url(${imgUrl})`}}></div> */}
                <img style={{ width: '100%' }} src={imgUrl} alt="" />
                <p>专此确认</p>
                <p style={{textAlign:'end'}}>【管理人名称】</p>
                <p style={{textAlign:'end'}}>（盖章）</p>
                <p style={{ textAlign: 'end' }}>【生成日期】</p>
                <div className={_styles.otherInfo}>
                    <div className={_styles.otherItem} >
                        <div>公司联系电话：<span>【公司联系电话】</span></div>
                        <div>传真：<span>【传真】</span></div>
                        <div>网址：<span>【公司网址】</span></div>
                    </div>
                    <div className={_styles.otherItem}>
                        <div>公司地址：<span>【公司地址】</span></div>
                        <div>邮箱：<span>【公司联系邮箱】</span></div>
                    </div>
                    <a className={_styles.aLink} onClick={()=> history.push('/settings/company')}>补充公司信息</a>
                </div>
                <Row justify="center"> <Button type="primary" loading={btnLoading} onClick={saveTemplate}>保存</Button></Row>
            </Spin>
        </div>
    );

};

export default connect(({ COMFIRMATION_REPORT_TEMPLATE, loading }) => ({
    COMFIRMATION_REPORT_TEMPLATE,
    loading: loading.effects['COMFIRMATION_REPORT_TEMPLATE/getTemplate'],
    btnLoading: loading.effects['COMFIRMATION_REPORT_TEMPLATE/update']
}))(reportTemplate);


reportTemplate.defaultProps = {
    params: {},
    closeModal: () => { },
    loading: false,
    btnLoading: false
};
