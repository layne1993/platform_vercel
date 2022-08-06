import { Card, Upload, Form, Select, DatePicker, notification, Button } from 'antd';
import { connect, FormattedMessage, history } from 'umi';
import React, { useState, useEffect } from 'react';
import { XWInvestorsType } from '@/utils/publicData';
import { getRandomKey, getCookie, getParams } from '@/utils/utils';
import moment from 'moment';
import { PlusOutlined } from '@ant-design/icons';
import request from '@/utils/rest';

const FormItem = Form.Item;
const { Option } = Select;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};
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
            offset: 7
        }
    }
};




const Step1 = (props) => {
    const { loading, params } = props;
    const [form] = Form.useForm();
    const [fileList, setfileList] = useState([]);
    const [investorList, setInvestorList] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [data, setData] = useState({});


    /**
     * 初始化表单
     */
    const initFormData = (data) => {
        let fileList = [];
        if (data.materialAttachments) {
            const arr = data.materialAttachments['130'] || [];
            arr.map((item, index) => {
                fileList.push({
                    uid: item.attachmentsId || index,
                    name: item.documentName,
                    url: item.documentUrl,
                    status: 'done'
                });
            });
            setfileList(fileList);
        }
        if(data.identifyFlowId) {
            form.setFieldsValue({
                customerId: data.customerId,
                investorType: data.investorType,
                identifyTime: data.identifyTime && moment(data.identifyTime),
                fileList
            });
            setIsEdit(data.flowStatus === 2);
        }
    };

    /**
     * @description 获取投资者list
     */
    const getInvestorList = () => {
        const {dispatch} = props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/getInvestorList',
            callback: (res) => {
                if(res.code === 1008){
                    setInvestorList(res.data || []);
                    let urlParams = getParams();
                    if(urlParams && urlParams.customerId) {
                        form.setFieldsValue({
                            customerId: urlParams.customerId * 1
                        });
                    }
                }
            }
        });
    };

    /**
     * @description 当参数不为零时 获取认定流程数据
     */
    const getFlowInfo = () => {
        const {dispatch, codeValue} = props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/getDetail',
            payload: {identifyFlowId: params.identifyFlowId, codeValue},
            callback: (res) => {
                if(res.code === 1008) {
                    setData(res.data || {});
                    initFormData(res.data || {});
                }else{
                    openNotification(
                        'warning',
                        `提示（代码：${res.code}）`,
                        res.message || '查询失败！',
                        'topRight',
                    );
                }
            }
        });

    };

    useEffect(()=> {
        if(params.identifyFlowId !== '0') {
            getFlowInfo();
        }
    }, []);
    useEffect(getInvestorList, []);


    /**
     * @description 删除文件
     * @param {*} id
     */
    const deleteFile = async (e) => {
        let res = await request.get('/attachments/deleteFile', { attachmentsId: e.uid });
        let fileList = form.getFieldValue('fileList') || [];
        let arr = [];
        if(res.code === 1008) {
            arr = fileList.filter((item) => item.uid !== e.uid);
            if(arr.length === 0) {
                form.setFieldsValue({fileList: undefined});
            }else {
                form.setFieldsValue({fileList: arr});
            }

            setfileList(arr);
        }
    };

    const beforeUpload = async (file) => {
        // setLoading(true)
        const formData = new window.FormData();
        formData.append('source', 2);
        formData.append('codeType', 130);
        formData.append('sourceId', '');
        formData.append('file', file);
        let res = await request.postMultipart('/attachments/uploadFile', formData);
        const {code, data} = res;
        if (code === 1008 && data) {
            fileList.push({
                uid: data.attachmentsId,
                name: data.fileName,
                url: data.baseUrl,
                status: 'done'
            });
            setfileList(fileList);
            // form.setFieldsValue({fileList:  fileList});
            openNotification('success', '提醒', '上传成功');
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
        // setLoading(false);
        return false;
    };

    /**
     * @description 提交
     * @param {*} values
     */
    const onFinish = (values) => {
        // if(values.fileList.length === 0) {
        //     openNotification('warning', '提示', '您还未上传认定材料', 'topRight');
        // }
        const { dispatch, params } = props;
        let userInfo = investorList.find((item) => item.customerId === values.customerId) || {};
        let ids = fileList.map((item) => (item.uid));
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/saveIdentifyOffline',
            payload: {
                ...values,
                fileList: undefined,
                customerType: userInfo.customerType,
                identifyFlowId: params.identifyFlowId !== '0' ? params.identifyFlowId : undefined,
                customerName: userInfo.customerName,
                attachmentsIds: ids,
                identifyTime: values.identifyTime && moment(values.identifyTime).valueOf()
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    // processInfo.checkStatus = values.checkStatus;
                    props.calllback(res.data.identifyFlowId);
                    history.replace({pathname: `/operation/processManagement/investorsProcessList/offline/${res.data.identifyFlowId}`});
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存信息失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    // 下载
    const dowloadfile = (e) => {
        // console.log(e)
        if (e.url) {
            window.open(e.url);
        } else {
            window.open(`${getCookie('LinkUrl')}${e.response.data.fileUrl}`);
        }
    };


    return (
        <Card bordered={false}>
            <Form scrollToFirstError name="detail" form={form} onFinish={onFinish}>
                <FormItem
                    {...formItemLayout}
                    label="客户名称"
                    name="customerId"
                    rules={[
                        {
                            required: true,
                            message: '请选择投资者'
                        }
                    ]}
                >
                    <Select
                        disabled={isEdit}
                        placeholder="请选择投资者"
                        style={{ width: 300 }}
                        showSearch
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        optionLabelProp="label"
                    >
                        {investorList.map((item) => (
                            <Option key={getRandomKey(4)} value={item.customerId} label={item.customerName}>
                                {item.customerBrief}
                            </Option>
                        ))}
                    </Select>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="投资者类型"
                    name="investorType"
                    rules={[
                        {
                            required: true,
                            message: '请选择投资者类型'
                        }
                    ]}
                >
                    <Select
                        disabled={isEdit}
                        placeholder="请选择投资者类型"
                        style={{ width: 300 }}
                        allowClear
                    >
                        {XWInvestorsType.map((itemO) => (
                            <Option key={getRandomKey(4)} value={itemO.value}>
                                {itemO.label}
                            </Option>
                        ))}
                    </Select>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="合格投资者认定时间"
                    name="identifyTime"
                    rules={[
                        {
                            required: true,
                            message: '请选择合格投资者认定时间'
                        }
                    ]}
                >
                    <DatePicker  disabled={isEdit} style={{ width: 300 }} />
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="认定材料上传"
                    // name="fileList"
                    extra="支持压缩包，PDF、word等主流文件格式，上传的文件鼠标点击可下载查阅"
                    rules={[
                        {
                            required: false,
                            message: '请上传认定材料'
                        }
                    ]}
                >
                    <Upload
                        name="file"
                        action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                        headers={{
                            tokenId: getCookie('vipAdminToken')
                        }}
                        fileList={fileList}
                        showUploadList={{
                            showRemoveIcon: true,
                            showDownloadIcon: true,
                            showPreviewIcon: false
                        }}
                        listType="picture-card"
                        data={{
                            source: 2,
                            codeType: 130,
                            sourceId: ''
                        }}
                        disabled={isEdit}
                        onRemove={deleteFile}
                        onDownload={dowloadfile}
                        beforeUpload={beforeUpload}
                    >
                        <div>
                            <PlusOutlined />
                            <div className="ant-upload-text">上传</div>
                        </div>
                    </Upload>
                </FormItem>
                <FormItem
                    {...submitFormLayout}
                    style={{
                        marginTop: 32
                    }}
                >
                    {!isEdit &&
                     <Button
                         type="primary"
                         htmlType="submit"
                         loading={loading}
                         disabled={isEdit}
                     >
                         <FormattedMessage id="formandbasic-form.form.save" />
                     </Button>}

                </FormItem>
            </Form>
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_OFFLINE, loading }) => ({
    IDENTIFYFLOW_OFFLINE,
    data: IDENTIFYFLOW_OFFLINE.flowData,
    loading: loading.effects['IDENTIFYFLOW_OFFLINE/saveIdentifyOffline']
}))(Step1);


Step1.defaultProps = {
    data: {}
};
