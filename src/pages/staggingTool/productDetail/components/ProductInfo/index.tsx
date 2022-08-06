import React, { useState, useEffect, useCallback } from 'react';
import { history } from 'umi';
import { Select, Divider, Spin, Row, Col, Input, Button, message, Upload, notification, Space } from 'antd';
import {
    getStaggingProductBaseInfo,
    saveStaggingProductBaseInfo,
    allImport
} from '../../service';
import _styles from './index.less';
import { fileExport } from '@/utils/utils';
import qs from 'qs';

const openNotification = (type?: string, message?: string, description?: string, placement?: any, duration?: any) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement: placement || 'topRight',
        duration: duration || 3
    });
};


const ProductInfoForm = ({ id }) => {
    const [basicInfo, setBasicInfo] = useState<any>({ });
    const [infoLoading, setInfoLoading] = useState(false);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleChange = (value) => {
        let obj = JSON.parse(JSON.stringify(basicInfo));
        obj.canApplyNewShare = value *= 1;
        setBasicInfo(obj);
    };
    const handleChangeMarket = (value) => {
        let obj = JSON.parse(JSON.stringify(basicInfo));
        obj.lpInvestType = value *= 1;
        setBasicInfo(obj);
    };

    const jumpInvestor = () => {
        history.push({
            pathname: '/investor/shareInfoAdmin/share/shareInfo'
        });
    };
    //获取打新基本信息
    const getBasicInfo = useCallback(async () => {
        setInfoLoading(true);
        const res: any = await getStaggingProductBaseInfo(id, '');
        if (res && res.code == 1008) {
            let obj = JSON.parse(JSON.stringify(res.data));
            setBasicInfo(obj);
            setInfoLoading(false);
        }
    }, [id]);
    //保存打新基本信息
    const saveInfo = async () => {
        let post: any = { };
        post.shanghaiStockExchangeAccount = basicInfo.shanghaiStockExchangeAccount;
        post.shenzhenStockExchangeAccount = basicInfo.shenzhenStockExchangeAccount;
        post.productSacCode = basicInfo.productSacCode;
        post.productSacName = basicInfo.productSacName;
        post.canApplyNewShare = basicInfo.canApplyNewShare;
        post.lpInvestType = basicInfo.lpInvestType;
        if (post.shanghaiStockExchangeAccount == null) { post.shanghaiStockExchangeAccount = ''; }
        if (post.shenzhenStockExchangeAccount == null) { post.shenzhenStockExchangeAccount = ''; }
        if (post.productSacCode == null) { post.productSacCode = ''; }
        if (post.productSacName == null) { post.productSacName = ''; }
        post.productId = id;
        let res: any = await saveStaggingProductBaseInfo(post);
        if (res.code == 1008) {
            message.success('保存成功');
            getBasicInfo();
        }
    };

    useEffect(() => {
        getBasicInfo();
    }, [getBasicInfo]);

    /**
     * @description 文件上传
     * @param {} file
     */
    const beforeUpload = async (file) => {
        // console.log(file, '')
        // return
        // if (file.type === '.xlsx' || file.type === '.xls') {
        //     return true;
        // } else {
        //     openNotification('warning', '仅仅支持excel上传');
        //     return false;
        // }
        setUploading(true);
        let formData = new window.FormData();
        console.log(file);
        formData.append('file', file);
        formData.append('productId', id);
        // console.log('params', params);
        let res: any = await allImport(formData);
        if (res.code === 1008) {
            openNotification('success', '提醒', '上传成功');
        } else {
            openNotification(
                'warning',
                `提示（代码：${res.code}）`,
                res.message || '上传失败！',
                'topRight',
            );
        }
        setUploading(false);
    };

    /**
     * @description 批量下载
     */
    const batchDownload = () => {
        fileExport({
            method: 'post',
            url: '/staggingnew/allExport',
            data: { productId: id },
            callback: ({ status }) => {
                if (status === 'success') {
                    openNotification('success', '提醒', '导出成功');
                }
                if (status === 'error') {
                    openNotification('error', '提醒', '导出失败！');
                }
            }
        });
    };

    return (
        <div className={_styles.productInfo}>
            <Spin spinning={infoLoading}>
                <div className={_styles.title}>
                    打新所需基本信息
                </div>
                <Divider style={{ margin: '12px 0' }} />
                <div className={_styles.basicInfo}>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col span={8}>
                            <p>配售对象证券账户号（沪市）</p>
                            <Input style={{ width: '80%' }} value={basicInfo.shanghaiStockExchangeAccount}
                                onChange={({ target: { value } }) => {
                                    let obj = JSON.parse(JSON.stringify(basicInfo));
                                    obj.shanghaiStockExchangeAccount = value;
                                    setBasicInfo(obj);
                                }} placeholder="请输入"
                            />
                        </Col>
                        <Col span={8}>
                            <p>配售对象证券账户号（深市）</p>
                            <Input style={{ width: '80%' }} value={basicInfo.shenzhenStockExchangeAccount}
                                onChange={({ target: { value } }) => {
                                    let obj = JSON.parse(JSON.stringify(basicInfo));
                                    obj.shenzhenStockExchangeAccount = value;
                                    setBasicInfo(obj);
                                }} placeholder="请输入"
                            />
                        </Col>
                        <Col span={8}>
                            <p>配售对象证券业协会备案编号</p>
                            <Input style={{ width: '80%' }} value={basicInfo.productSacCode}
                                onChange={({ target: { value } }) => {
                                    let obj = JSON.parse(JSON.stringify(basicInfo));
                                    obj.productSacCode = value;
                                    setBasicInfo(obj);
                                }} placeholder="请输入"
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: '20px' }}>
                        <Col span={8}>
                            <p>配售对象名称</p>
                            <Input
                                style={{ width: '80%' }}
                                value={basicInfo.productSacName}
                                placeholder="请输入"
                                onChange={({ target: { value } }) => {
                                    let obj = JSON.parse(JSON.stringify(basicInfo));
                                    obj.productSacName = value;
                                    setBasicInfo(obj);
                                }}
                            />
                        </Col>
                        <Col span={8}>
                            <p>是否具有配售对象资质</p>
                            <Select value={basicInfo.canApplyNewShare == 1 ? '是' : '否'} style={{ width: '80%' }} onChange={handleChange}>
                                <Select.Option value="1">是</Select.Option>
                                <Select.Option value="0">否</Select.Option>
                            </Select>
                        </Col>
                        <Col span={8}>
                            <p>参与市场</p>
                            <Select placeholder="请选择" value={basicInfo.lpInvestType || 1} style={{ width: '80%' }} onChange={handleChangeMarket}>
                                <Select.Option value={1}>沪市</Select.Option>
                                <Select.Option value={2}>深市</Select.Option>
                                <Select.Option value={3}>沪市深市</Select.Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24} style={{ textAlign: 'center', marginBottom: '30px' }}>
                            <Button type="primary" onClick={saveInfo}>保存</Button>
                        </Col>
                    </Row>
                </div>
                <div className={_styles.title} >
                    出资方基本信息表
                </div>
                <Row justify="space-between">
                    <div className={_styles.tip}>
                        <span className={_styles.left}>
                            投资者的出资比例，从投资者的份额余额自动获取，如需维护投资者的份额余额
                        </span>
                        <span className={_styles.right} onClick={jumpInvestor}>
                            点击跳转
                        </span>
                    </div>
                    <Space>
                        <Upload
                            accept=".xlsx,.xls"
                            beforeUpload={beforeUpload}
                            fileList={[]}
                        >
                            <Button type="primary" loading={uploading}>批量上传</Button>
                        </Upload>

                        <Button onClick={batchDownload}>导出全部</Button>
                    </Space>
                </Row>
            </Spin>
        </div>
    );
};

export default ProductInfoForm;
