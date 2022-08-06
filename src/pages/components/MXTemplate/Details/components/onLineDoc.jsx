import React, { useEffect, useState } from 'react';
import { Checkbox, Row, Col, Button, Space, notification } from 'antd';
import styles from '../style.less';
import { getCookie } from '@/utils/utils';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css';
import { connect } from '@/.umi/plugin-dva/exports';



const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message, description, placement, duration: duration || 3
    });
};

const OnLineDoc = (props) => {

    const { baseInfo, dispatch, docType, loading, sealLoading } = props;

    const [sealValues, setsealValues] = useState(['【基金管理人章】', '【管理人法定代表人章/授权代表章】', '【个人投资者章】', '【机构/产品投资者章】']);

    const [onLineDocInfo, setOnLineDocInfo] = useState(BraftEditor.createEditorState(null));

    const _handleChange = (e) => {
        setsealValues(e);
    };

    const _handleEditorChange = (editorState) => {
        setOnLineDocInfo(editorState);
    };

    const submitContent = (val) => {
        return val.toHTML();
    };

    const _save = (type) => {
        const publishStatus = type === 1 ? 0 : 1;
        dispatch({
            type: 'templateDetails/newAddTemplate',
            payload: {
                ...baseInfo,
                richText: submitContent(onLineDocInfo),
                sealChoice: sealValues,
                templateType: docType,
                publishStatus
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
    };

    const _downLoadFile = () => {
        window.location.href = `${window.location.origin}${BASE_PATH.adminUrl}/product/document/downloadWildcard?tokenId=${getCookie('vipAdminToken')}`;
    };

    useEffect(() => {
        let tempValue = null;
        const { richText, sealChoice } = baseInfo;
        if (richText) tempValue = BraftEditor.createEditorState(richText);
        setOnLineDocInfo(tempValue);
        if (Array.isArray(sealChoice)) setsealValues(sealChoice);
    }, []);

    return (
        <div className={styles.onLineDocContainer}>
            <Row className={styles.uploadStyle}>
                <Col span={24}>
                    <span>印章选择：</span>
                    <Checkbox.Group
                        value={sealValues}
                        onChange={_handleChange}
                        disabled={baseInfo.publishStatus === 1}
                    >
                        <Checkbox value="【基金管理人章】">基金管理人章</Checkbox>
                        <Checkbox value="【管理人法定代表人章/授权代表章】">管理人法定代表人章/授权代表章</Checkbox><br />
                        <Checkbox value="【个人投资者章】" disabled>个人投资者章</Checkbox>
                        <Checkbox value="【机构/产品投资者章】" disabled>机构/产品投资者章</Checkbox>
                        <Checkbox value="【机构/产品投资者法定代表人章/授权代表章】">机构/产品投资者法定代表人章/授权代表章</Checkbox>
                    </Checkbox.Group>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <p>
                        <span>在线文档编辑：</span>
                        <span className={styles.details} onClick={_downLoadFile}>点击查看支持通配符信息</span>
                    </p>
                    <BraftEditor
                        value={onLineDocInfo}
                        onChange={_handleEditorChange}
                        onSave={submitContent}
                        controls={[]}
                    />
                </Col>
            </Row>
            <Row justify="center" style={{ marginTop: 20 }}>
                <Col>
                    <Space>
                        <Button type="primary" onClick={() => _save(1)} loading={loading} disabled={baseInfo.publishStatus === 1}>保存</Button>
                        <Button type="primary" onClick={() => _save(2)} loading={loading} disabled={baseInfo.publishStatus === 1}>保存并发布</Button>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default connect(({ templateDetails, loading }) => ({
    templateDetails,
    loading: loading.effects['templateDetails/newAddTemplate'],
    sealLoading: loading.effects['templateDetails/managerSign']
}))(OnLineDoc);