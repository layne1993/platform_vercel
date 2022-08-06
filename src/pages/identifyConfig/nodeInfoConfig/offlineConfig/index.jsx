import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Form, Row, Button, Checkbox, Spin, notification } from 'antd';


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const OfflineConf = (props) => {
    const { dispatch, loading, submitLoading } = props;
    const [form] = Form.useForm();

    const offlineIdentifyConfig = () => {
        dispatch({
            type: 'OFFLINE_CONFIG/offlineIdentifyConfig',
            callback: (res) => {
                const {code, data} = res;
                if (code === 1008) {
                    form.setFieldsValue({
                        investorType: data
                    });
                }
            }
        });
    };

    useEffect(() => {
        offlineIdentifyConfig();
    }, []);

    const onFinish = (values) => {
        dispatch({
            type: 'OFFLINE_CONFIG/offlineIdentifyConfigUpdate',
            payload: values.investorType,
            callback: ({code, data, message}) => {
                if (code === 1008) {
                    offlineIdentifyConfig();
                    openNotification('success', '提醒', '保存成功', 'topRight');
                } else {
                    const  txt = message || data || '保存失败';
                    openNotification('warning', `提示（代码：${code}）`, txt, 'topRight');
                }
            }
        });
    };

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                onFinish={onFinish}
            >
                <Form.Item
                    label="允许投资者端使用线下提交方式提交认定流程和材料"
                    name="investorType"
                    rules={[{ required: true, message: '请选择！' }]}
                    extra="默认仅VIP投资者允许，客户是否VIP可在客户信息管理中进行设置"
                >
                    <Checkbox.Group>
                        <Checkbox value={1}>自然人投资者</Checkbox>
                        <Checkbox value={2}>机构投资者</Checkbox>
                        <Checkbox value={3}>产品投资者</Checkbox>
                        <Checkbox value={4}>VIP投资者</Checkbox>
                    </Checkbox.Group>
                </Form.Item>

                <Row justify="center" style={{marginTop: 50, marginBottom: 50}}>
                    <Button type="primary" htmlType="submit" loading={submitLoading}>
                        保存
                    </Button>
                </Row>
            </Form>
        </Spin>
    );
};


export default connect(({ OFFLINE_CONFIG, loading }) => ({
    OFFLINE_CONFIG,
    loading: loading.effects['OFFLINE_CONFIG/offlineIdentifyConfig'],
    submitLoading: loading.effects['OFFLINE_CONFIG/OFFLINE_CONFIG/offlineIdentifyConfigUpdate']
}))(OfflineConf);
