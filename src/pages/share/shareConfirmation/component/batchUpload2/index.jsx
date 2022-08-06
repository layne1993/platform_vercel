/*
 * @Descripttion: 拖拽上传模态框
 * @version:
 * @Author: yezi
 * @Date: 2020-11-09 10:40:47
 * @LastEditTime: 2021-11-08 16:29:03
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { Modal, Upload, Button, notification, Select, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import request from '@/utils/rest';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const BatchUpload = (props) => {
    const {
        dispatch,
        url,
        params,
        modalFlag,
        title,
        tipMsg,
        multiple,
        accept,
        fileFormat,
        templateMsg,
        templateUrl
    } = props;
    const [file, setFile] = useState(null);
    const [fileList, setFileList] = useState([]);
    // const [productList, setProductList] = useState([]);
    const [confirmFileTemplateId, setConfirmFileTemplateId] = useState('');
    const [loading, setLoading] = useState(false);
    const [rules, setRules] = useState([]);
    const [ruleStr, setRuleStr] = useState('');

    /**
     * 关闭模态框
     */
    const closeModal = () => {
        if (props.closeModal) {
            props.closeModal();
        }
    };

    // 获取产品列表
    const getProductList = () => {
        // dispatch({
        //     type: 'COMFIRMATION_TEMPLATE/productList',
        //     callback: (res) => {
        //         if (res.code === 1008) {
        //             setProductList(res.data);
        //         }
        //     }
        // });
        dispatch({
            type: 'COMFIRMATION_TEMPLATE/getListData',
            payload: {
                pageNum: 1,
                pageSize: 100000,
                sortFiled: 'createTime',
                sortType: 'desc',
                enableStatus: '1'
            },
            callback: (res) => {
                if (res.code === 1008) {
                    const { list } = res.data;
                    setRules(list || []);
                }
            }
        });
    };

    useEffect(getProductList, []);


    /**
     * 选择文件
     * @param {*} file
     * @param {*} fileList
     */
    const beforeUpload = (file, fileList) => {

        setFile(file);
        setFileList(fileList);
        return false;
    };

    /**
     * @description 移除文件
     * @param {*} file
     */
    const onRemove = (file) => {
        setFileList([]);
        return true;
    };

    /**
     * 上传成功回调
     */
    const success = () => {
        if (props.onOk) {
            props.onOk();
        }
    };

    /**
     * @description 文件上传
     * @param {} file
     */
    const doUpload = async () => {
        if (!confirmFileTemplateId) {
            return message.warning('请选择模板！');
        }
        let formData = new window.FormData();
        formData.append('file', file);
        const {productId, ...others} = params || {};
        if (others) {
            for (let key in others) {
                formData.append(key, others[key]);
            }
        }
        formData.append('confirmFileTemplateId', confirmFileTemplateId);
        setLoading(true);
        let res = await request.postMultipart(url, formData);
        setLoading(false);
        if (res.code === 1008) {
            openNotification('success', '提醒', '上传成功');
            success();
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
    };

    // 模板选择
    const setRule = (e) => {
        setConfirmFileTemplateId(e);
        const arr = rules.filter((item) => {
            return item.confirmFileTemplateId === e;
        });
        const str = arr[0] && arr[0].titleFormat && arr[0].titleFormat.join('') || '';
        setRuleStr(str);
    };

    const uploadProps = {
        name: 'file',
        multiple,
        accept,
        fileList: fileList,
        headers: {
            tokenId: getCookie('vipAdminToken')
        },
        action: `${BASE_PATH.adminUrl}${url}`,
        beforeUpload: beforeUpload,
        onRemove: onRemove
    };

    return (
        <Modal
            maskClosable={false}
            title={title}
            visible={modalFlag}
            onCancel={closeModal}
            footer={[
                <Button key="cancel" onClick={closeModal}>关闭</Button>,
                <Button loading={loading} key="sure" type="primary" disabled={fileList.length === 0} onClick={doUpload}>确定</Button>
            ]}
        >
            <p> <span>请选择模板：</span>
                <Select
                    value={confirmFileTemplateId}
                    //  mode="multiple"
                    style={{ width: 300, marginRight: 15 }}
                    placeholder="请选择模板"
                    onChange={setRule}
                    showSearch
                    allowClear
                    filterOption={(input, option) =>
                        option.children &&
                        option.children.toString()
                            .toLowerCase()
                            .indexOf(input.toString().toLowerCase()) >= 0
                    }
                >
                    {
                        rules.map((item, index) => {
                            return <Select.Option key={index} value={item.confirmFileTemplateId}>{item.templateName}</Select.Option>;
                        })
                    }
                </Select>
            </p>
            <div>
                <p>当前规则有（请务必确保文件以如下方式命名，如单个投资者重名的，请单个上传）：</p>
                {
                    ruleStr || rules.length && '请选择模板' || (
                        <p>未检测到启用中模板，请先配置模板</p>
                    )
                }
            </div>

            <Upload.Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">{tipMsg}</p>
                <p className="ant-upload-hint">{fileFormat}</p>
                {/* <p className="ant-upload-hint">仅支持上传一个压缩包</p> */}
            </Upload.Dragger>
            {templateUrl && <div style={{ marginTop: 15 }}>
                <a href={`${BASE_PATH.adminUrl}${templateUrl}`} >{templateMsg}</a>
            </div>}

        </Modal>
    );

};


export default connect(({ loading }) => ({
    loading: loading.effects['COMFIRMATION_TEMPLATE/create', 'COMFIRMATION_TEMPLATE/edit']
}))(BatchUpload);

BatchUpload.defaultProps = {
    title: '文件上传',
    modalFlag: false,
    tipMsg: '点击将压缩包或PDF文件拖拽到这里上传',
    params: {}, // 上传参数
    url: '', // 上传接口
    multiple: true, //当个上传多个上传
    fileFormat: '支持扩展名类型：zip,rar,pdf', // 文件格式提示
    accept: undefined, // 文件格式
    closeModal: () => { }, // 关闭模态框回调
    onOk: () => { }, // 点击模态框确定按钮回调
    templateMsg: '模块下载', // 模板名称
    templateUrl: null // 模板地址
};
