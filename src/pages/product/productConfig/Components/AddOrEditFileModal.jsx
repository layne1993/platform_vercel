import { Button, Select, Upload, Form, notification, Modal } from 'antd';
import React, { Component } from 'react';
import { getRandomKey } from '@/utils/utils';
import { connect } from 'umi';
import { isEmpty } from 'lodash';
import { UploadOutlined } from '@ant-design/icons';
import request from '@/utils/rest';

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
class AddOrEditFileModal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
            companyList: [],
            file: {},
            trusteeshipCode: '', // 托管机构code
            // attachmentsId: '',   // 文件唯一id
            loading: false

        };

        this.searchFormRef = React.createRef();
    }
    componentDidMount() {
        this._queryCompanyList();
    }


    /**
     * @description: 查询所有托管公司
     */
    _queryCompanyList = () => {
        const { attachmentsId, type, dispatch } = this.props;
        dispatch({
            type: 'productConfig/queryCompany',
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.setState({
                        companyList: res.data
                    });
                }
            }
        }).then(() => {
            if (type === 'edit') {
                this._editSearch(attachmentsId);
            }
        });
    }

    // onFinishFailed = errorInfo => {
    //   // console.log('Failed:', errorInfo);
    // };

    onFinish = () => {
        const { type } = this.props;
        this.doUpload(type);


    };

    // 文件预览
    filePreView = (file) => {
        window.open(file.url);
    }


    beforeUpload = (file, fileList) => {
        this.setState({
            file,
            fileList
        });
        return false;
    }


    /**
     * @description 移除文件
     * @param {*}
     */
    onRemove = (file) => {
        this.setState({
            fileList: []
        });
        return true;
    };


    /**
     * @description 文件上传
     * @param {} file
     */
    doUpload = async () => {
        const { file, trusteeshipCode, fileList } = this.state;
        const { type, onCancel, attachmentsId } = this.props;
        this.setState({
            loading: true
        });
        let formData = new window.FormData();
        if (!isEmpty(file)) formData.append('file', file);
        formData.append('trusteeshipCode', trusteeshipCode);
        if (type === 'edit' && attachmentsId) formData.append('attachmentsId', attachmentsId);
        let res = await request.postMultipart('/changeTheMaterial/uploadFile', formData);
        if (res.code === 1008) {
            openNotification('success', '提醒', `${type === 'add' ? '新增' : '编辑'}成功`);
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || `${type === 'add' ? '新增' : '编辑'}失败`,
                'topRight',
            );
        }
        this.setState({
            loading: false
        });
        onCancel();
    };


    /**
     * @description: 编辑时数据获取
     * @param {*}
     */
    _editSearch = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'productConfig/queryEditaFile',
            payload: {
                attachmentsId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    const { data } = res;
                    let tempArr = [];
                    tempArr.push({
                        uid: data.attachmentsId,
                        status: 'done',
                        name: data.fileName
                    });
                    this.setState({
                        fileList: tempArr,
                        trusteeshipCode: data.trusteeshipCode
                    });
                    if (this.searchFormRef.current) {
                        this.searchFormRef.current.setFieldsValue({
                            trusteeshipCode: data.trusteeshipCode
                        });
                    }
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    this.setState({
                        applyInfoList: []
                    });
                }
            }
        });
    }

    /**
     * @description: 托管机构change事件
     * @param {*}
     */
    handleChange = (e) => {
        this.setState({
            trusteeshipCode: e
        });
    }

    /**
     * @description: 自定义校验
     * @param {*} rule
     * @param {*} value
     * @param {*} callback
     */
    uploadFile = (rule, value, callback) => {
        if (!isEmpty(value)) {
            callback();
            return;
        }
        callback('请上传文件');
        return;
    }

    render() {

        const { type, modalVisible, onCancel } = this.props;
        const { fileList, companyList, loading } = this.state;

        return (
            <Modal
                width="800px"
                title={type === 'edit' ? '编辑银行卡变更材料' : '新增银行卡变更材料'}
                centered
                maskClosable={false}
                visible={modalVisible}
                onCancel={onCancel}
                footer={null}
            >
                <Form
                    ref={this.searchFormRef}
                    onFinish={this.onFinish}
                >
                    <FormItem
                        {...formItemLayout}
                        label="托管机构"
                        name="trusteeshipCode"
                        rules={[
                            {
                                required: true,
                                message: '请选择托管机构'
                            }
                        ]}
                    >
                        <Select placeholder="请选择"
                            showSearch
                            defaultActiveFirstOption={false}
                            allowClear
                            filterOption={this._filterPerson}
                            notFoundContent={null}
                            onChange={this.handleChange}
                            disabled={type === 'edit'}
                        >
                            {
                                !isEmpty(companyList) &&
                                companyList.map((item) => <Option key={item.trusteeshipCode} value={item.trusteeshipCode}>{item.trusteeshipName}</Option>)
                            }
                        </Select>
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="文件上传"
                        name="file"
                        rules={[
                            {
                                required: true,
                                message: '请选择上传文件'
                            }
                            // {
                            //     validator: this.uploadFile
                            // }
                        ]}
                        extra="建议PDF、图片、压缩包格式文件"
                    >
                        <div key={getRandomKey(3)}>
                            <Upload
                                name="file"
                                fileList={fileList}
                                beforeUpload={this.beforeUpload}
                                onChange={this.handleFileChange}
                                onRemove={this.onRemove}
                            >
                                <Button disabled={!this.props.authEdit}>
                                    <UploadOutlined /> 上传文件
                                </Button>
                            </Upload>
                        </div>
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
                                type="primary" htmlType="submit"
                                loading={loading}
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
            </Modal>
        );
    }
}

export default connect(({ productConfig, loading }) => ({
    productConfig,
    sublimtLoading: loading.effects['productConfig/addFile']
}))(AddOrEditFileModal);
