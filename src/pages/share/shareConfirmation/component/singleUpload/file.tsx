import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import { Modal, Form, Upload, Col, Row, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';

const openNotification = (type, message, description, placement?, duration?) => {
    notification[type || 'info']({
        top: 165,

        message,

        description,

        placement,

        duration: duration || 3
    });
};

interface defaultProps {
  dispatch: Dispatch;
  loading: boolean;
  visible: boolean; // 上传文件框
  onClose: () => void; // 关闭回调
  tableSearch: () => void; // 更新列表
  data: any; // 当前数据信息
}

const File: React.FC<defaultProps> = (props: defaultProps) => {

    const { visible, onClose, data = {}, loading } = props;

    const [list, setList] = useState<any>([]); // 文件

    // const [showModal, setShowModal] = useState<boolean>(false);

    // 上传图片方法
    const uploadFileChange = async ({ file, fileList }) => {
        if (file.status === 'uploading' || file.status === 'removed') {
            setList(fileList);
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                const flieObj = file.response.data || {};
                openNotification('success', '提醒', '上传成功');
                const fl = {
                    uid: flieObj.attachmentsId,
                    name: flieObj.fileName,
                    url: flieObj.baseUrl,
                    status: 'done'
                };
                const reallyFileList = Array.isArray(list) && list.filter((item) => {
                    return item?.status === 'done' || false;
                }) || [];
                setList([fl, ...reallyFileList]);
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    // 删除文件
    const deleteFile = async (e) => {
        let res = await request.post('/trade/deleteConfirmFileLink', {tradeRecordId:data.tradeRecordId || undefined, confirmFileId:e.confirmFileId || undefined});
        let fileList;
        if (Array.isArray(list)) {
            fileList = list;
        } else {
            fileList = list.fileList || [];
        }
        let arr = [];
        if (res.code === 1008) {
            openNotification('success', '提醒', res.message || '删除成功');
            arr = fileList.filter((item) => item.uid !== e.uid);
            setList(arr);
        }else{
            openNotification('warning', '提醒', '删除失败');
        }
    };

    const confirmDelete = (e)=>{
        Modal.confirm({
            content:'确认删除该文件???',
            onOk:()=>deleteFile(e)
        });
        return false;
    };

    const onOk = () => {
        const { dispatch, tableSearch } = props;
        if (Array.isArray(list) && !list.length) {
            openNotification('warning', '提醒', '请上传文件');
            return;
        }
        const confirmFiles = list.map((item) => ({
            attachmentId: item.uid,
            confirmFileId: item.confirmFileId || null
        }));
        dispatch({
            type: 'MANAGE_CONFIRMLIST/recordFileUpload',
            payload: {
                tradeRecordId: data.tradeRecordId || null,
                confirmFiles
            },
            callback: (res: any) => {
                if (res.code === 1008) {
                    onClose();
                    tableSearch();
                } else {
                    openNotification('warning', '提醒', '提交失败');
                }
            }
        });
    };

    useEffect(() => {
        if (!data.tradeRecordId) return;
        const { dispatch } = props;
        dispatch({
            type: 'MANAGE_CONFIRMLIST/recordQueryFile',
            payload: {
                tradeRecordId: data.tradeRecordId || null
            },
            callback: (res: any) => {
                if (res.code === 1008) {
                    const { data } = res;
                    const fileList = Array.isArray(data) && data.map((item) => ({
                        uid: item.attachmentsId,
                        confirmFileId: item.confirmFileId,
                        name: item.fileName,
                        url: item.fileUrl,
                        status: 'done'
                    })) || [];
                    setList(fileList);
                } else {
                    openNotification('warning', '提醒', '获取失败');
                }
            }
        });
    }, []);

    return <Modal
        title={
            data.isConfirmFile ? '修改份额确认书' : '上传份额确认书'
        }
        visible={visible}
        onOk={onOk}
        onCancel={onClose}
        confirmLoading={loading}
    >
        <Form
            name="basic"
            initialValues={{
                sourceType: 1
            }}
        >
            <Row gutter={[8, 0]}>
                <Col span={24}>
                    <Form.Item
                        label="文件上传"
                        name="fileList"
                        extra="支持多个文件,文件类型：PDF"
                    >
                        <Upload
                            action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                            headers={{
                                tokenId: getCookie('vipAdminToken')
                            }}
                            accept=".pdf"
                            data={{
                                sourceId: '',
                                source: 6,
                                codeType: 134
                            }}
                            fileList={list}
                            onChange={uploadFileChange}
                            onRemove={confirmDelete}
                            // maxCount={1}
                        >
                            <Button
                                icon={<UploadOutlined />}
                                size="middle"
                            >
                上传
                            </Button>
                        </Upload>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
        {/* <Modal
            visible={showModal}
            onCancel={()=>()=>isDetele(false)}
            onOk={()=>isDetele(true)}
        >

        </Modal> */}
    </Modal>;
};

export default connect(({ loading }) => ({
    loading: loading.effects['MANAGE_CONFIRMLIST/recordFileUpload']
}))(File);
