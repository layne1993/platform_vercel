/*
 * @description: 提示信息
 * @Author: tangsc
 * @Date: 2021-03-29 14:37:47
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { Card, Modal } from 'antd';
import styles from '../index.less';
import { ExclamationCircleOutlined, CloseOutlined } from '@ant-design/icons';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';

const { confirm } = Modal;

const TipsConfig = (props) => {

    const { dispatch, createReportForm = {} } = props;

    const { customFormData = {}, isShowa } = createReportForm;

    const { importantNote } = customFormData;


    const [tipsValues, setTipsValues] = useState(BraftEditor.createEditorState(importantNote));


    /**
     * @description: 删除模块
     */
    const _deleteModule = () => {
        confirm({
            title: '请您确认是否删除该模块?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'createReportForm/updateState',
                    payload: {
                        isImportantNote: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    const _handleEditorChange = (value) => {
        setTipsValues(value);
        dispatch({
            type: 'createReportForm/updateState',
            payload: {
                tipsInfo: value
            }
        });
    };

    useEffect(() => {
        setTipsValues(BraftEditor.createEditorState(importantNote));
    }, [customFormData]);

    return (
        <Card className={styles.tipsConfigBox}>
            <BraftEditor
                value={tipsValues}
                onChange={_handleEditorChange}
                // onSave={_submitContent}
                controls={[]}
            />
            {
                isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
            }
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(TipsConfig);















