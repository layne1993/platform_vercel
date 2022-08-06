
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import styles from './styles.less';
import { Card, Typography, Modal, Row, Col, Input, Upload, notification, message } from 'antd';

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
import Button from 'antd/es/button';
import { reportFormLogo } from '@/utils/staticResources';

const { Text, Title } = Typography;
const { confirm } = Modal;
// 设置日期格式
const dateFormat = 'YYYY/MM/DD';

const MAX_FILE_SIZE = 1024 * 1024 * 1;

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const Header = (props) => {
    const { dispatch, COMFIRMATION_REPORT_TEMPLATE } = props;
    const { headerInfo } = COMFIRMATION_REPORT_TEMPLATE;

    // 报表编辑弹窗信息 标题、logo、主题色、文字颜色
    const [editInfo, setEditInfo] = useState(headerInfo);

    // useEffect(() => {setEditInfo(editInfo);}, [headerInfo]);


    // 控制报表信息编辑弹窗显示隐藏
    const [show, setShow] = useState(false);

    // 控制背景颜色选择器显示隐藏
    const [displayColorPicker, setDisplayColorPicker] = useState(false);

    // 控制文字颜色选择器显示隐藏
    const [wordColorPicker, setWordColorPicker] = useState(false);


    // 打开/关闭编辑弹窗
    const _toggle = () => {
        // 每次打开时重置为已保存的信息
        if (show === false) {
            setEditInfo({
                ...headerInfo
            });
        } else {
            setDisplayColorPicker(false);
            setWordColorPicker(false);
        }
        setShow((o) => !o);
    };


    /**
     * @description: 颜色选择器change事件
     * @param {Object} c
     * @param {String} type
     */
    const _handleChange = (c, type) => {
        const color = `rgba(${c.rgb.r},${c.rgb.g},${c.rgb.b},${c.rgb.a})`;
        if (type === 'bg') {
            setEditInfo({
                ...editInfo,
                headerBgColor: color
            });
        } else {
            setEditInfo({
                ...editInfo,
                headerTextColor: color
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
            type: 'COMFIRMATION_REPORT_TEMPLATE/setHeaderInfo',
            payload: {
                ...editInfo
            }
        });
        _toggle();
    };

    const imageToBase64 = (file) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            setEditInfo({
                ...editInfo,
                logoImg: reader.result
            });
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    const _beforeUpload = async (file) => {
        if (file.size > MAX_FILE_SIZE) {
            message.error('上传图片不能超过1M');
            return;
        }
        imageToBase64(file);
    };


    return (
        <div className={styles.headerBox} style={{ background: headerInfo.headerBgColor }}>
            <div className={styles.editicon}>
                <EditOutlined onClick={_toggle} className={styles.operateIcon} />
            </div>
            <div className={styles.logoBox}>
                <img src={headerInfo.logoImg || reportFormLogo} alt="暂无logo" />
                <span className={styles.sign} style={{color: headerInfo.headerTextColor}}>【管理人名称】</span>

            </div>

            <Modal
                title="报表信息编辑"
                visible={show}
                onCancel={_toggle}
                onOk={_handleOk}
                okText="确定"
                cancelText="取消"
                width={400}
                className={styles.logoModal}
                maskClosable={false}
            >
                <Row>
                    <Col span={24}>
                        <Text>上传LOGO：</Text>
                        <Upload
                            headers={{
                                tokenId: getCookie('vipAdminToken')
                            }}
                            // fileList={fileList}
                            beforeUpload={_beforeUpload}
                            accept=".jpg,.png,.jpeg"
                            action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                            showUploadList={false}
                        >
                            {editInfo.logoImg ? (
                                <img
                                    src={editInfo.logoImg}
                                    alt="avatar"
                                    style={{ width: '100%' }}
                                />
                            ) : (
                                <Button><PlusOutlined /></Button>
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
                                style={{ backgroundColor: editInfo.headerBgColor }}
                            ></div>
                        </div>
                        {displayColorPicker ? (
                            <div className={styles.popover}>
                                <SketchPicker
                                    color={editInfo.headerBgColor}
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
                                style={{ background: editInfo.headerTextColor }}
                            ></div>
                        </div>
                        {wordColorPicker ? (
                            <div className={styles.popover}>
                                <SketchPicker
                                    color={editInfo.headerTextColor}
                                    onChange={(c) => _handleChange(c, 'word')}
                                />
                            </div>
                        ) : null}
                    </Col>
                </Row>
            </Modal>
        </div>
    );
};

export default connect(({ COMFIRMATION_REPORT_TEMPLATE }) => ({
    COMFIRMATION_REPORT_TEMPLATE
}))(Header);
