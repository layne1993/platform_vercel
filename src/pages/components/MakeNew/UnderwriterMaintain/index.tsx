import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import type { Dispatch, Loading } from 'umi';
import { Modal, Alert, Form, Input, Select, DatePicker, Upload, Button, Row, Col, notification } from 'antd';
import type { UploadFile } from 'antd/lib/upload/interface';
import moment from 'moment';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';
import PageLoading from '../PageLoading';
import _styles from './styles.less';

/*
 * @Descripttion: 承销商数据维护
 * @Author: yjc
 * @Date: 2021-04-15 15:51:44
 * @LastEditors: yjc
 * @LastEditTime: 2021-04-21 13:15:53
 */

interface DefaultProps {
    dispatch: Dispatch;
    loadingRelated: boolean;
    loadingGetData: boolean;
    loadingUpdate: boolean;
    makeNewMaintain: any;
    id?: number; // 编辑传入id,新建不传
    modalFlag: boolean; // 模态框visible
    authEdit?: boolean; // 是否能编辑
    authExport?: boolean; // 是否能导出
    onClose: () => any; // 关闭函数
    onOk: () => any; // 成功回调
}

const { Option } = Select;

const openNotification = (type, message, description, placement?, duration?) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};

const templateUrl = '/stagging/underwriter/getMaterialTemplate';

const UnderwriterMaintain: React.FC<DefaultProps> = (props: DefaultProps) => {

    const { modalFlag = false, onClose = () => null, onOk = () => null, dispatch, authEdit = true, authExport = true,
        loadingRelated, loadingUpdate, loadingGetData, id } = props;
    const { makeNewMaintain: { relatedList, investorList, assetList } } = props;
    const [form] = Form.useForm();

    const [fileList, setFileList] = useState<Array<UploadFile>>([]); // 上传文件

    /**
   * @descripttion: 材料-获取模板
   * @param {1 关联方模板 | 2 出资方模板 | 3 资产规模模板 } type
   * @return { void }
   */
    const getTemplate = (type: 1 | 2 | 3) => {
        dispatch({
            type: 'makeNewMaintain/getUnderwriterTemplate',
            payload: {
                type
            }
        });
    };

    useEffect(() => {
        if (!relatedList.length || !investorList.length) {
            [1, 2, 3].forEach((item: 1 | 2 | 3) => {
                getTemplate(item);
            });
        }
        if (id) {
            dispatch({
                type: 'makeNewMaintain/getUnderwriterMaintain',
                payload: {
                    underwriterId: id
                },
                callback: (res: any) => {
                    if (res.code === 1008) {
                        const { underwriterId,
                            commitmentLetterIssueTime,
                            commitmentLetterId,
                            commitmentLetterFileUrl,
                            commitmentLetterFileName,
                            ...params
                        } = res.data || {};
                        const attachmentList: any = [{
                            uid: commitmentLetterId,
                            name: commitmentLetterFileName,
                            url: commitmentLetterFileUrl,
                            status: 'done'
                        }];
                        form.setFieldsValue({
                            ...params,
                            commitmentLetterIssueTime: commitmentLetterIssueTime && moment(commitmentLetterIssueTime) || null,
                            fileList: attachmentList
                        });
                        setFileList(attachmentList);
                    }
                }
            });
        }
    }, []);

    // 上传图片方法
    const uploadFileChange = async ({ file, fileList }) => {
        if (file.status === 'uploading' || file.status === 'removed') {
            setFileList(fileList);
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                const flieObj = file.response.data || {};
                openNotification('success', '提醒', '上传成功');
                const fl: any = [
                    {
                        uid: flieObj.attachmentsId,
                        name: flieObj.fileName,
                        url: flieObj.baseUrl,
                        status: 'done'
                    }
                ];
                setFileList(fl);
                form.setFieldsValue({ fileList: fl });
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    // 删除文件
    const deleteFile = async (e) => {
        // let res: any = await request.get('/attachments/deleteFile', { attachmentsId: e.uid });
        let fileList = form.getFieldValue('fileList') || [];
        let arr = [];
        // if (res.code === 1008) {
        arr = fileList.filter((item) => item.uid !== e.uid);
        if (arr.length === 0) {
            form.setFieldsValue({ fileList: [] });
        } else {
            form.setFieldsValue({ fileList: arr });
        }
        setFileList(arr);
        // }
    };

    // 保存
    const onFinish = () => {
        const { validateFields } = form;
        validateFields().then((values) => {
            const { dispatch } = props;
            // 将富文本编译器内容转换为html
            const { commitmentLetterIssueTime, fileList, ...params } = values;
            const time = commitmentLetterIssueTime.valueOf();
            const commitmentLetterId = Array.isArray(fileList) && fileList[0].uid || '';
            dispatch({
                type: 'makeNewMaintain/saveUnderwriterMaintain',
                payload: {
                    ...params,
                    underwriterId: id || null,
                    commitmentLetterIssueTime: time,
                    commitmentLetterId: commitmentLetterId
                },
                callback: (res) => {
                    const { code = '', message = '' } = res;
                    if (code === 1008) {
                        openNotification('success', '提示', '保存成功');
                        onOk();
                    } else {
                        openNotification(
                            'warning',
                            `提示（代码：${code}）`,
                            `${message ? message : '保存失败！'}`,
                            'topRight',
                        );
                    }
                }
            });
        });
    };

    return (
        <Modal
            maskClosable={false}
            title="承销商数据维护"
            visible={modalFlag}
            onCancel={onClose}
            onOk={onFinish}
            confirmLoading={loadingUpdate || loadingGetData}
            okButtonProps={{ disabled: !authEdit }}
            width={500}
            // wrapClassName={_styles.maintain}
            footer={null}
        >
            如需创建承销商，请将承销商提供的模板zip发送到ipo@meix.com；预计4小时内创建完毕，紧急联系电话 400－633－4449
        </Modal>
    );
};

export default connect(({ makeNewMaintain, loading }: { loading: Loading, makeNewMaintain: any }) => ({
    makeNewMaintain,
    loadingRelated: loading.effects['makeNewMaintain/getUnderwriterTemplate'],
    loadingGetData: loading.effects['makeNewMaintain/getUnderwriterMaintain'],
    loadingUpdate: loading.effects['makeNewMaintain/saveUnderwriterMaintain']
}))(UnderwriterMaintain);
