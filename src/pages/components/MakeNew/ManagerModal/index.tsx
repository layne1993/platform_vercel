import React, { useEffect } from 'react';
import { connect } from 'umi';
import type { Dispatch, Loading } from 'umi';
import { Modal, Form, Input, Select, Row, Col, notification, InputNumber } from 'antd';
import { stagManagerList } from '@/utils/publicData';
import PageLoading from '../PageLoading';
import _styles from './styles.less';

/*
 * @Descripttion: 管理人信息新建
 * @Author: yjc
 * @Date: 2021-04-15 15:51:44
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-06-17 13:15:45
 */

interface DefaultProps {
  dispatch: Dispatch;
  loadingGetData: boolean;
  loadingUpdate: boolean;
  id?: number;
  modalFlag: boolean; // 模态框visible
  onClose: () => any; // 关闭函数
  onOk: () => any; // 成功回调
}

const { Option } = Select;

const openNotification = (type, message, description, placement?, duration?) => {
    notification[type || 'info']({
        top: 30,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
};

const ManagerMaintain: React.FC<DefaultProps> = (props: DefaultProps) => {

    const { modalFlag = false, onClose = () => null, onOk = () => null, dispatch, loadingUpdate, loadingGetData, id } = props;
    const [form] = Form.useForm();

    useEffect(() => {
        if (id) {
            dispatch({
                type: 'makeNewMaintain/getManagerDetail',
                payload: {
                    relatedPartyId: id
                },
                callback: (res: any) => {
                    if (res.code === 1008) {
                        const { relatedPartyId, ...params } = res.data || {};
                        form.setFieldsValue({
                            ...params
                        });
                    }
                }
            });
        }
    }, []);

    // 保存
    const onFinish = () => {
        const { validateFields } = form;
        validateFields().then((values) => {
            const { dispatch } = props;
            // 将富文本编译器内容转换为html
            dispatch({
                type: 'makeNewMaintain/saveManagerDetail',
                payload: {
                    ...values,
                    relatedPartyId: id || null
                },
                callback: (res) => {
                    const { code = '', message = '' } = res;
                    if (code === 1008) {
                        openNotification('success', '提示', '保存成功');
                        onOk();
                    } else {
                        openNotification(
                            'warning',
                            `提示（代码：${code}）`,
                            `${message ? message : '保存失败！'}`,
                            'topRight',
                        );
                    }
                }
            });
        });
    };

    return (
        <Modal
            maskClosable={false}
            title="管理人数据维护"
            visible={modalFlag}
            onCancel={onClose}
            onOk={onFinish}
            confirmLoading={loadingUpdate || loadingGetData}
            wrapClassName={_styles.maintain}
        >
            <PageLoading loading={loadingUpdate || loadingGetData}>
                <Form form={form} {...layout} onFinish={onFinish}>
                    <Form.Item
                        label="类型:"
                        name="type"
                        rules={[{ required: true, message: '请选择类型!' }]}
                    >
                        <Select placeholder="请选择" allowClear>
                            {stagManagerList.map((item) => (
                                <Option value={item.value} key={item.value}>
                                    {item.label}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="序号:"
                        name="sort"
                        rules={[
                            { required: true, message: '请输入序号!' },
                            { type: 'number', min: 0 }
                        ]}
                        style={{ marginBottom: 5 }}
                    >
                        <InputNumber />
                    </Form.Item>

                    <Row gutter={24} style={{ marginBottom: 12 }}>
                        <Col span={8}>
                        </Col>
                        <Col span={16}>
                            <span className={_styles.tips}>
                请输入序号，前序编号与类别相关。如序号与已有序号相同，将排在已有序号之前，希望排在最前，请填1
                            </span>
                        </Col>
                    </Row>
                    <Form.Item
                        label="工商登记名称或自然人姓名:"
                        name="name"
                        rules={[{ required: true, message: '请输入工商登记名称或自然人姓名' }]}
                    >
                        <Input placeholder="请输入名称" />
                    </Form.Item>
                    <Form.Item
                        label="证件号码:"
                        name="cardNumber"
                        rules={[
                            { required: true, message: '请输入序号!' }
                        ]}
                        style={{ marginBottom: 5 }}
                    >
                        <Input placeholder="请输入证件号码" />
                    </Form.Item>

                    <Row gutter={24} style={{ marginBottom: 12 }}>
                        <Col span={8}>
                        </Col>
                        <Col span={16}>
                            <span className={_styles.tips}>
                请输入组织机构代码或统一社会信用代码或身份证号
                            </span>
                        </Col>
                    </Row>
                </Form>
            </PageLoading>
        </Modal>
    );
};

export default connect(({ loading }: { loading: Loading }) => ({
    loadingGetData: loading.effects['makeNewMaintain/getManagerDetail'],
    loadingUpdate: loading.effects['makeNewMaintain/saveManagerDetail']
}))(ManagerMaintain);
