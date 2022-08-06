import { Button, Card, Select, Upload, DatePicker, Form, Input, notification, Modal } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import moment from 'moment';
import { XWFileType, XWFileAuthority } from '@/utils/publicData';
import { getCookie, getRandomKey } from '@/utils/utils';
import { connect, history } from 'umi';
import { MultipleSelect } from '@/pages/components/Customize';


import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
const FormItem = Form.Item;
const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 7
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        },
        md: {
            span: 10
        }
    }
};

const submitFormLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 10,
            offset: 8
        }
    }
};

// 设置日期格式
const dateFormat = 'YYYY/MM/DD HH:mm';

class FileInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileInfomation: {},
            attachmentsId: '',
            fileList: [],
            save: '',
            powerInfo: {}
        };

        this.searchFormRef = React.createRef();
    }



    componentDidMount() {
        const { dispatch, operateType, productFileId } = this.props;
        if (operateType === 'edit') {
            dispatch({
                type: 'newFileInfo/productFileDetail',
                payload: {
                    productFileId: Number(productFileId)
                },
                callback: (res) => {
                    if (res.code === 1008 && res.data) {
                        const { fileList } = this.state;
                        if (res.data.attachment && res.data.attachment.documentJsonObject) {
                            fileList.push({
                                uid: res.data.attachment && res.data.attachment.attachmentsId,
                                status: 'done',
                                name: res.data.documentName,
                                url: res.data.attachment && res.data.attachment.signUrl || '',
                                fileUrl: res.data.attachment && res.data.attachment.signUrl || ''
                            });
                        } else {
                            fileList.push({
                                uid: res.data.attachment && res.data.attachment.attachmentsId,
                                status: 'done',
                                name: res.data.documentName,
                                url: res.data.attachment && res.data.attachment.baseUrl || '',
                                fileUrl: res.data.attachment && res.data.attachment.baseUrl || ''
                            });
                        }

                        this.setState({
                            fileInfomation: res.data,
                            attachmentsId: res.data.attachment && res.data.attachment.attachmentsId,
                            fileList
                        });
                        this.searchFormRef.current.setFieldsValue({
                            documentName: res.data.documentName,
                            documentType: res.data.documentType,
                            fileAuthority: res.data.fileAuthority,
                            publishTime: res.data.publishTime && moment(res.data.publishTime),
                            file:fileList
                        });
                    }
                }
            });
        }
    }


    // onFinishFailed = errorInfo => {
    //   // console.log('Failed:', errorInfo);
    // };

    onFinish = (values) => {
        // console.log(values)
        // console.log(moment(values.publishTime).startOf('data'))

        // return
        const { dispatch, operateType, proId, onCancel, showProduct } = this.props;
        const { save, fileInfomation, attachmentsId, fileList } = this.state;
        const { publishTime, ...tempObj } = values;
        if (!fileList.length) {
            openNotification('warning', '提示', '请上传文件');
            return null;
        }
        let queryName = '';
        if (operateType === 'add') {
            queryName = 'addProductFile';
        } else {
            queryName = 'editProductFile';
        }
        let tempTime = (publishTime && new Date(`${moment(publishTime).format()}`).getTime()) || undefined;
        dispatch({
            type: `newFileInfo/${queryName}`,
            payload: {
                productId: proId,
                ...fileInfomation,
                ...tempObj,
                startStatus: save,
                attachmentsId,
                publishTime: tempTime

            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    this.setState({
                        fileInfomation: res.data
                    });
                    openNotification('success', `${save === 1 ? '发布' : '保存'}成功`, res.message, 'topRight');
                    if (showProduct) {
                        this.props.Interfacesearch();
                    }
                    onCancel();
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // // 监听上传成功或失败
    handleFileChange = (e) => {
        this.setState({
            fileList: e.fileList
        });
        const { file } = e;
        // console.log(file)
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                this.setState({
                    attachmentsId: file.response.data.attachmentsId,
                    fileList: [{
                        uid: file.response.data.attachmentsId,
                        status: 'done',
                        name: file.response.data.fileName,
                        url: `${file.response.data.baseUrl}`
                    }]
                });
                this.searchFormRef.current.setFieldsValue({ documentName: file.response.data.fileName });
            } else {
                this.setState({
                    fileList: e.fileList.slice(0, 1)
                });

                openNotification('warning', '提醒', '上传失败');
            }
        }
    }

    // 文件预览
    filePreView = (file) => {
        window.open(file.url);
    }



    render() {
        const { editLoading, sublimtLoading, operateType, modalVisible, onCancel, productFileId, productId } = this.props;
        const { fileInfomation, attachmentsId, fileList, save } = this.state;

        return (
            <Modal
                width="800px"
                title={operateType === 'edit' ? '编辑文件' : '新增文件'}
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >


                <Form
                    ref={this.searchFormRef}
                    // hideRequiredMarkss
                    onFinish={this.onFinish}
                    // onFinishFailed={this.onFinishFailed}
                    initialValues={{
                        fileAuthority: [3],
                        productId,
                        documentType: 3
                    }}
                >
                    <FormItem
                        {...formItemLayout}
                        label="文件上传"
                        name="file"
                        rules={[
                            {
                                required: true,
                                message: '请上传文件'
                            }
                        ]}
                        extra="建议PDF、图片等手机能打开的格式"
                    >
                        <Upload
                            name="file"
                            action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                            headers={{
                                tokenId: getCookie('vipAdminToken')
                            }}
                            fileList={fileList}
                            showUploadList={this.props.authExport}
                            data={{
                                source: 6,
                                sourceId: productFileId || '',
                                codeType: 120,
                                id: fileInfomation.attachment && fileInfomation.attachment.attachmentsId || attachmentsId || ''
                            }}
                            // beforeUpload={this.beforeUpload}
                            onPreview={this.filePreView}
                            onChange={this.handleFileChange}
                            disabled={!this.props.authEdit}
                        >
                            <Button disabled={!this.props.authEdit}>
                                <UploadOutlined /> 上传文件
                            </Button>
                        </Upload>
                    </FormItem>
                    {
                        this.props.showProduct ?
                            (<MultipleSelect
                                params="productId"
                                value="productId"
                                label="productName"
                                formLabel="产品名称"
                                formItemLayout={formItemLayout}
                                rules={[
                                    {
                                        required: true,
                                        message: '请选择产品'
                                    }
                                ]}
                            />) : null
                    }

                    <FormItem
                        {...formItemLayout}
                        label="文件标题"
                        name="documentName"
                        rules={[
                            {
                                required: true,
                                message: '请输入文件名称'
                            }
                        ]}
                    >
                        <Input placeholder="请输入文件名称" autoComplete="off" />
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="文件类型"
                        name="documentType"
                        rules={[
                            {
                                required: true,
                                message: '请选择文件类型'
                            }
                        ]}
                        extra="文件类型有募集文件、签约文件、披露文件"
                    >
                        <Select placeholder="请选择文件类型" allowClear>
                            {
                                XWFileType.map((item, index) => <Option key={index} value={item.value}>{item.label}</Option>)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文件权限"
                        name="fileAuthority"
                        rules={[
                            {
                                required: true,
                                message: '请选择文件权限'
                            }
                        ]}
                        extra="文件权限有：持有人可见，合规投资者可见，风险测评客户可见"
                    >
                        <Select placeholder="请选择" mode="multiple" allowClear>
                            {
                                XWFileAuthority.map((item) => {
                                    return (
                                        <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                    );
                                })
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="发布时间"
                        name="publishTime"
                        rules={[
                            {
                                required: true,
                                message: '请选择发布时间'
                            }
                        ]}
                    >
                        <DatePicker placeholder="请选择发布时间" style={{ width: '100%' }} format={dateFormat} showTime={{ format: 'HH:mm' }} />
                    </FormItem>

                    <FormItem
                        {...submitFormLayout}
                        style={{
                            marginTop: 32
                        }}
                    >
                        {/* <Button disabled={fileInfomation.startStatus === 1 || !powerInfo.isEdit} type="primary" htmlType="submit" loading={sublimtLoading && save === 0} onClick={() => { this.setState({ save: 0 }); }}>
                                保存
                            </Button> */}
                        {
                            this.props.authEdit &&
                            <Button
                                // disabled={fileInfomation.startStatus === 1}
                                type="primary" htmlType="submit"
                                loading={(sublimtLoading || editLoading) && save === 1}
                                onClick={() => { this.setState({ save: 1 }); }}
                                style={{ marginLeft: 8, marginRight: 8 }}
                            >
                                确定
                            </Button>
                        }
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                    </FormItem>


                    {/* <Card title="文件信息" bordered={false}>
                        <FormItem
                            {...formItemLayout}
                            label="文件上传"
                            name="file"
                            rules={[
                                {
                                    required: !(fileList.length > 0),
                                    message: '请上传文件'
                                }
                            ]}
                            extra="点击文件预览"
                        >
                            <Upload
                                name="file"
                                action={`${BASE_PATH.adminUrl}/attachment/uploadFile`}
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                fileList={fileList}
                                // showUploadList={false}
                                data={{
                                    source: 6,
                                    sourceId: params.id || '',
                                    codeType: 120,
                                    id: fileInfomation.attachmentsId || attachmentsId || ''
                                }}
                                // beforeUpload={this.beforeUpload}
                                onPreview={this.filePreView}
                                onChange={this.handleFileChange}
                            >
                                <Button>
                                    <UploadOutlined /> 上传文件
                                </Button>
                            </Upload>
                        </FormItem>
                    </Card>

                    <Card title="修改信息记录" >
                        <FormItem
                            {...formItemLayout}
                            label="最后修改人员"
                            extra="每次修改均记录修改人员信息"
                        >
                            <Input placeholder="请输入最后修改人员" disabled value={fileInfomation.userName} />
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="最后修改时间"
                        >
                            <Input placeholder="请输入最后修改时间" disabled value={fileInfomation.updateTime ? moment(fileInfomation.updateTime).format('YYYY/MM/DD HH:mm:ss') : '--'} />
                        </FormItem>

                        <FormItem
                            {...submitFormLayout}
                            style={{
                                marginTop: 32
                            }}
                        >
                            <Button disabled={fileInfomation.startStatus === 1 || !powerInfo.isEdit} type="primary" htmlType="submit" loading={sublimtLoading && save === 0} onClick={() => { this.setState({ save: 0 }); }}>
                                保存
                            </Button>
                            <Button disabled={fileInfomation.startStatus === 1 || !powerInfo.isEdit} type="primary" htmlType="submit" loading={sublimtLoading && save === 1} onClick={() => { this.setState({ save: 1 }); }} style={{ marginLeft: 8, marginRight: 8 }}>
                                发布
                            </Button>
                            <Button onClick={this.goback}>
                                取消
                            </Button>
                        </FormItem>
                    </Card> */}
                </Form>
            </Modal>
        );
    }
}

export default connect(({ newFileInfo, loading }) => ({
    newFileInfo,
    sublimtLoading: loading.effects['newFileInfo/addProductFile'],
    loading: loading.effects['newFileInfo/queryProductDetail'],
    editLoading: loading.effects['newFileInfo/editProductFile']
}))(FileInfo);
