/*
 * @description: 标题和内容配置
 * @Author: tangsc
 * @Date: 2021-03-29 14:37:01
 */
import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'umi';
import { Input, Form, Space, Modal } from 'antd';
import styles from '../index.less';
import { CloseOutlined, FolderAddOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { isEmpty } from 'lodash-es';

const FormItem = Form.Item;
const { TextArea } = Input;
const { confirm } = Modal;

const TitleAndTextConfig = (props) => {

    const { formRef, createReportForm, dispatch } = props;

    const { isShowa, customFormData = {}, isText } = createReportForm;

    const { reportTemplateModules = [] } = customFormData;

    const [form] = Form.useForm();
    // const [personalMatching, setPersonalMatching] = useState(BraftEditor.createEditorState('<p>温柔温柔12</p>')); // 创建一个空的editorState作为初始值

    /**
     * @description: 删除当前节点
     * @param {*} index 节点顺序
     */
    const _removeItem = (index) => {
        confirm({
            title: '请您确认是否删除该模块?',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                let list = form.getFieldValue('titleAndContent');
                list.splice(index, 1);
                form.setFieldsValue({
                    titleAndContent: list
                });
                if (isEmpty(list)) {
                    dispatch({
                        type: 'createReportForm/updateState',
                        payload: {
                            isText: false
                        }
                    });
                }
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    useEffect(() => {
        if (!isEmpty(reportTemplateModules)) {
            let tempArr = [];
            reportTemplateModules.forEach((item) => {
                tempArr.push({
                    title: BraftEditor.createEditorState(item.headlineInfo),
                    content: BraftEditor.createEditorState(item.content)
                });
            });
            form.setFieldsValue({
                titleAndContent: tempArr
            });
        } else {
            if (isText) {
                form.setFieldsValue({
                    titleAndContent: [{ title: BraftEditor.createEditorState(''), content: BraftEditor.createEditorState('') }]
                });
            }
        }

    }, [customFormData]);

    return (
        <Fragment>
            <div className={styles.titleAndTextBox}>
                <Form
                    ref={formRef}
                    name="setTitle"
                    form={form}
                    autoComplete="off"
                >
                    <Form.List name="titleAndContent">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map((field, i) => (
                                    <Space key={field.key}>

                                        <FormItem
                                            className="titleEditor"
                                            {...field}
                                            // label={`标题${i + 1}`}
                                            name={[field.name, 'title']}
                                        >
                                            <BraftEditor controls={[]} placeholder="请输入标题" />
                                        </FormItem>
                                        <FormItem
                                            {...field}
                                            name={[field.name, 'content']}
                                            className={styles.tradingDay}
                                        >
                                            <BraftEditor
                                                // value={personalMatching}
                                                // onChange={(value) => this.handleEditorChange(value, 1)}
                                                // onSave={this.submitContent}
                                                // readOnly={isPublish}
                                                controls={[]}
                                            />
                                        </FormItem>
                                        {
                                            isShowa && <FolderAddOutlined className={styles.operateIcon_add} onClick={() => { add(); }} />
                                        }
                                        {
                                            isShowa && <CloseOutlined className={styles.operateIcon} onClick={() => _removeItem(i)} />
                                        }
                                    </Space>
                                ))}
                            </>
                        )}
                    </Form.List>
                </Form>
            </div>
        </Fragment>


    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(TitleAndTextConfig);