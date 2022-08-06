/*
 * @description: Logo配置
 * @Author: tangsc
 * @Date: 2021-03-29 14:22:14
 */
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from '../index.less';
import { Card, Typography, Modal, Row, Col, Input, Upload, notification } from 'antd';
import { reportFormLogo } from '@/utils/staticResources';
import { SketchPicker } from 'react-color';
import {
    EditOutlined,
    PlusOutlined,
    CloseOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { isEmpty } from 'lodash';
import { getCookie } from '@/utils/utils';
import moment from 'moment';

const { Text, Title } = Typography;
const { confirm } = Modal;
// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const Logo = (props) => {
    const { dispatch, createReportForm } = props;
    const {
        baseInfo,
        isShowa,
        customFormData = {},
        time,
        isNetValueInfo,
        productName
    } = createReportForm;

    // 报表编辑弹窗信息 标题、logo、主题色、文字颜色
    const [editInfo, setEditInfo] = useState({
        headline: '报表标题',
        logoUrl: reportFormLogo,
        color: '#E4E4E4',
        textColor: '#000000'
    });

    // 控制报表信息编辑弹窗显示隐藏
    const [show, setShow] = useState(false);

    // 控制背景颜色选择器显示隐藏
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    // 控制文字颜色选择器显示隐藏
    const [wordColorPicker, setWordColorPicker] = useState(false);

    // 上传文件id
    const [attachmentsId, setAttachmentsId] = useState(0);

    // 打开/关闭编辑弹窗
    const _toggle = () => {
        // 每次打开时重置为已保存的信息
        if (show === false) {
            setEditInfo({
                ...baseInfo
            });
        } else {
            setDisplayColorPicker(false);
            setWordColorPicker(false);
        }
        setShow((o) => !o);
    };

    // 设置报表标题
    const _titleChange = (e) => {
        // debounce(() => {
        setEditInfo({
            ...editInfo,
            headline: e.target.value
        });
        // }, 500);
    };

    /**
     * @description: 颜色选择器change事件
     * @param {Object} c
     * @param {String} type
     */
    const _handleChange = (c, type) => {
        if (type === 'bg') {
            setEditInfo({
                ...editInfo,
                color: c.hex
            });
        } else {
            setEditInfo({
                ...editInfo,
                textColor: c.hex
            });
        }
    };

    /**
     * @description: 点击显示、关闭颜色选择器
     * @param {String} type bg:背景颜色 word：文字颜色
     */
    const _handleClick = (type) => {
        if (type === 'bg') {
            setDisplayColorPicker((o) => !o);
            setWordColorPicker(false);
        } else {
            setWordColorPicker((o) => !o);
            setDisplayColorPicker(false);
        }
    };

    /**
     * @description: 报表信息编辑保存
     * @param {*}
     */
    const _handleOk = () => {
        dispatch({
            type: 'createReportForm/updateState',
            payload: {
                baseInfo: {
                    ...editInfo
                },
                attachmentsId: attachmentsId
            }
        });
        _toggle();
    };

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
                        isNetValueInfo: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    // const _handleFileChange = (e) => {
    //     console.log(e);
    //     const { file } = e;
    //     if (file.status === 'uploading' || file.status === 'removed') {
    //         return;
    //     }
    //     if (file.status === 'done') {
    //         if (file.response.code === 1008) {
    //             openNotification('success', '提醒', '上传成功');
    //         } else {

    //             openNotification('warning', '提醒', '上传失败');
    //         }
    //     }
    // };

    const imageToBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // console.log('file 转 base64结果：' + typeof reader.result);
            setEditInfo({
                ...editInfo,
                logoUrl: reader.result
            });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const _handleFileChange = (info) => {
        console.log('info', info);
        if (info.file.status === 'uploading') {
            return;
        }
        if (info.file.status === 'done') {
            if (info.file.response.code === 1008) {
                openNotification('success', '提醒', '上传成功');
                const { data = {} } = info.file.response;
                imageToBase64(info.file.originFileObj);
                setAttachmentsId(data.attachmentsId);
            } else {
                openNotification('warning', '提醒', '上传失败');
            }
        }
    };

    // 上传按钮
    const uploadButton = (
        <div className={styles.uploadBtn}>
            <PlusOutlined />
            <div style={{ marginTop: 4 }}>上传</div>
        </div>
    );
    console.log(customFormData);
    return (
        <Card className={styles.logoBox}>
            <div className={styles.titleWrapper} style={{ background: baseInfo.color }}>
                <h2 style={{ color: baseInfo.textColor }}>{baseInfo.headline}</h2>
                <div className={styles.baseInfo}>
                    <img src={baseInfo.logoUrl || reportFormLogo} />
                    <div className={styles.extraBox} style={{ color: baseInfo.textColor }}>
                        <h3 style={{ color: baseInfo.textColor }}>
                            {customFormData.productFullName || ''}
                        </h3>
                        <p>
                            {!isEmpty(customFormData)
                                ? `报表日期：${moment(customFormData.startDate).format(
                                    dateFormat,
                                )}-${moment(customFormData.endDate).format(dateFormat)}`
                                : ''}
                        </p>
                    </div>
                </div>
                {isShowa && <EditOutlined onClick={_toggle} className={styles.operateIcon} />}
            </div>
            {isNetValueInfo && (
                <div className={styles.content}>
                    <Row justify="space-around">
                        <Col>
                            <Title level={3}>{customFormData.netValueInfo.netValue || '--'}</Title>
                            <Text>单位净值</Text>
                        </Col>
                        <Col>
                            <Title level={3}>
                                {customFormData.netValueInfo.changepercent || '--'}
                            </Title>
                            <Text>成立以来总收益率</Text>
                        </Col>
                        <Col>
                            {customFormData.netValueInfo.standardName && (
                                <>
                                    {' '}
                                    <Title level={3}>
                                        {customFormData.netValueInfo.standard || '--'}
                                    </Title>
                                    <Text>成立以来{customFormData.netValueInfo.standardName}收益率</Text>{' '}
                                </>
                            )}
                        </Col>
                    </Row>
                    {isShowa && (
                        <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
                    )}
                </div>
            )}

            <Modal
                title="报表信息编辑"
                visible={show}
                onCancel={_toggle}
                onOk={_handleOk}
                okText="确定"
                cancelText="取消"
                width={400}
                // bodyStyle={{ height: '80vh' }}
                className={styles.logoModal}
            >
                <Row>
                    <Col span={24}>
                        <Text>报表标题：</Text>
                        <Input
                            placeholder="请输入"
                            onChange={_titleChange}
                            value={editInfo.headline}
                        />
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Text>上传LOGO：</Text>
                        <Upload
                            headers={{
                                tokenId: getCookie('vipAdminToken')
                            }}
                            // fileList={fileList}
                            // beforeUpload={_beforeUpload}
                            onChange={_handleFileChange}
                            // onRemove={_onRemove}
                            accept=".jpg,.png,.jpeg"
                            action={`${BASE_PATH.adminUrl}/report/uploadLogo`}
                            showUploadList={false}
                        >
                            {editInfo.logoUrl ? (
                                <img
                                    src={editInfo.logoUrl}
                                    alt="avatar"
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Text>主颜色：</Text>
                        <div className={styles.swatch} onClick={() => _handleClick('bg')}>
                            <div
                                className={styles.colorDiv}
                                style={{ background: editInfo.color }}
                            ></div>
                        </div>
                        {displayColorPicker ? (
                            <div className={styles.popover}>
                                <SketchPicker
                                    color={editInfo.color}
                                    onChange={(c) => _handleChange(c, 'bg')}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Text>文字颜色：</Text>
                        <div className={styles.swatch} onClick={() => _handleClick('word')}>
                            <div
                                className={styles.colorDiv}
                                style={{ background: editInfo.textColor }}
                            ></div>
                        </div>
                        {wordColorPicker ? (
                            <div className={styles.popover}>
                                <SketchPicker
                                    color={editInfo.textColor}
                                    onChange={(c) => _handleChange(c, 'word')}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </Modal>
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(Logo);
