import { Button, Alert, Select, Upload, DatePicker, Form, Spin, notification, Modal, Radio, Input } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';
import { XWFileType, XWFileAuthority, StampLocationEnumeration } from '@/utils/publicData';
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
            file: {},
            powerInfo: {},
            isNeedOverprint:false
        };

        this.searchFormRef = React.createRef();
    }


    onFinish = (values) => {
        const { dispatch, onCancel } = this.props;
        const { fileInfomation, attachmentsId } = this.state;
        const { publishTime, file, ...tempObj } = values;
        let tempTime = (publishTime && new Date(`${moment(publishTime).format()}`).getTime()) || undefined;
        const obj = {
            ...fileInfomation,
            ...tempObj,
            attachmentsId,
            publishTime: tempTime
        };
        const formData = new FormData();
        for (let i in obj) {
            obj[i] && formData.append(i, obj[i]);
        }
        formData.append('file', this.state.file);
        dispatch({
            type: 'productNoticeBatch/productFileUpload',
            payload: formData,
            callback: (res) => {
                if (res && res.code === 1008) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                    this.props.Interfacesearch();
                    onCancel();
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // // 监听上传成功或失败
    // handleFileChange = (e) => {
    //     this.setState({
    //         fileList: [e.file]
    //     });
    //     const { file } = e;
    //     if (file.status === 'uploading' || file.status === 'removed') {
    //         return;
    //     }
    //     if (file.status === 'done') {
    //         this.setState({
    //             fileList: [file]
    //         });
    //     }
    // }

    // 文件预览
    filePreView = (file) => {
        window.open(file.url);
    }
    beforeUpload = (file, fileList) => {
        this.setState({ file, fileList });
        return false;
    }
    onRemove = () => {
        this.setState({ fileList: [], file: {} });
    }

    onFieldsChange =  (values) => {
        if (values[0] && values[0].name.toString() === 'isNeedOverprint') {
            if (values[0].value === 1) {
                this.setState({
                    isNeedOverprint:true
                })
            } else {
                this.setState({
                    isNeedOverprint:false
                })
            }
        }
    };
    render() {

        const { loading, modalVisible, onCancel } = this.props;
        const { fileList, isNeedOverprint} = this.state;
        const des = <div>
            <div>ZIP压缩包文件，文件名必须为：【产品全称名称】-季报报告-【20210624】.doc、docx或者PDF文件</div>
            <div>公告名称为：产品全称名称-季报报告-20210624</div>
            <div>对应产品为：【产品全称名称】，用第一个-的前面的所有文字，不满足规则会使用默认数据</div>
            <div>对应披露日期为：【20210624】，用最后一个-的后面的所有文字，不满足规则会使用默认数据</div>
        </div>;
        return (
            <Modal
                width="800px"
                title="批量新增"
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >

                <Spin spinning={loading ? true : false}>
                    <Alert
                        description={des}
                        message="批量上传，产品名称、披露日期、文件名称解析规则："
                        type="warning"
                        showIcon
                        style={{ marginBottom: 10 }}
                    />
                    <Form
                        ref={this.searchFormRef}
                        onFinish={this.onFinish}
                        onFieldsChange={this.onFieldsChange}
                        initialValues={{
                            fileAuthority: [3],
                            isNeedOverprint:0
                        }}
                    >
                        {
                            this.props.showProduct ?
                                (<MultipleSelect
                                    params="productId"
                                    value="productId"
                                    label="productName"
                                    formLabel="默认产品"
                                    formItemLayout={formItemLayout}
                                    extra="当文件名称无法解析出产品名称时的默认值。如不填写，出现无法解析时将提醒您；如填写，出现无法解析就用这个默认值"
                                />) : null
                        }
                        <FormItem
                            {...formItemLayout}
                            label="默认披露日期"
                            name="publishTime"
                            extra="当文件名称无法解析出披露日期时的默认值。如不填写，出现无法解析时将提醒您；如填写，出现无法解析就用这个默认值"
                        >
                            <DatePicker placeholder="请选择披露时间" style={{ width: '100%' }} format={dateFormat} showTime={{ format: 'HH:mm' }} />
                        </FormItem>
{/*
                        <FormItem
                            {...formItemLayout}
                            label="是否需要加盖印章"
                            name="isNeedOverprint"
                        >
                            <Radio.Group>
                                <Radio value={1}>需要</Radio>
                                <Radio value={0}>不需要</Radio>
                            </Radio.Group>
                        </FormItem>
                        {
                            isNeedOverprint && <>
                                <FormItem
                                    {...formItemLayout}
                                    label="盖章关键字"
                                    name="sealKeyword"
                                    rules={[
                                        { required: true, message: '请输入盖章关键字' }
                                    ]}
                                >
                                    <Input allowClear placeholder="请输入盖章关键字" />
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="用印位置"
                                    name="printingPosition"
                                    rules={[
                                        { required: true, message: '请选择用印位置' }
                                    ]}
                                >
                                    <Select placeholder="请选择" mode="multiple" allowClear>
                                        {
                                            StampLocationEnumeration.map((item) => {
                                                return (
                                                    <Option key={getRandomKey(5)} value={item.value}>{item.label}</Option>
                                                );
                                            })
                                        }
                                    </Select>
                                </FormItem>


                            </>
                        } */}

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
                            label="文件上传"
                            name="file"
                            rules={[
                                {
                                    required: !(fileList.length > 0),
                                    message: '请上传文件'
                                }
                            ]}
                            extra="请上传ZIP文件"
                        >
                            <Upload
                                name="file"
                                headers={{
                                    tokenId: getCookie('vipAdminToken')
                                }}
                                accept=".zip"
                                beforeUpload={this.beforeUpload}
                                fileList={fileList}
                                onRemove={this.onRemove}
                                showUploadList={this.props.authExport}
                                // beforeUpload={this.beforeUpload}
                                // onPreview={this.filePreView}
                                // onChange={this.handleFileChange}
                                disabled={!this.props.authEdit}
                            >
                                <Button disabled={!this.props.authEdit}>
                                    <UploadOutlined /> 上传文件
                                </Button>
                            </Upload>
                        </FormItem>
                        <FormItem
                            {...submitFormLayout}
                            style={{
                                marginTop: 32
                            }}
                        >
                            {
                                this.props.authEdit &&
                                <Button
                                    // disabled={fileInfomation.startStatus === 1}
                                    type="primary" htmlType="submit"
                                    loading={loading}
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
                    </Form>
                </Spin>

            </Modal>
        );
    }
}

export default connect(({ productNoticeBatch, loading }) => ({
    productNoticeBatch,
    loading: loading.effects['productNoticeBatch/productFileUpload']
}))(FileInfo);
