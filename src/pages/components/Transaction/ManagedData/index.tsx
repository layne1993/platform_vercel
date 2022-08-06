import React, { useEffect, useState } from 'react';
import { Select, Form, Button, notification, Spin } from 'antd';
import { connect } from 'dva';
const { Option } = Select;
const map = {
    netValue: '/data/netValue', // 托管净值数据
    dividendRecord: '/data/dividendRecord', // 托管分红数据
    transactionManaged: '/trade/transactionManaged', // 托管交易数据
    hosting: '/shareRecord/hosting' // 托管份额数据
};
const ManagedData: React.FC<managerdDataPro> = (props) => {
    const [form] = Form.useForm();
    const [listArr, setListArr] = useState<any[]>([]);
    const onFinish = (values: any) => {
        const { type, dispatch } = props;
        // console.log(values);
        dispatch({
            type: 'global/updateData',
            path: map[type],
            payload: values,
            callback(response) {
                if (response.code !== 1008) {
                    notification.error({
                        message: response.message
                    });
                    return;
                }
                notification.success({
                    message: '更新成功'
                });
                props.changeModal(false);
                props.updateTable();
            }
        });
    };

    useEffect(() => {
        const { dispatch } = props;
        // 请求托管数据
        dispatch({
            type: 'global/queryManagedData',
            callback(response) {
                if (response.code !== 1008) {
                    notification.error({
                        message: response.message
                    });
                    return;
                }
                setListArr(response.data || []);
                form.setFieldsValue({
                    pbCompanyCodes: response.data.map((item) => item.pbCompanyCode)
                });
            }
        });
    }, []);
    return (
        <Spin spinning={Boolean(props.loading)}>
            <Spin spinning={Boolean(props.loading2)} tip="托管数据同步中，请等待">
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="选择托管"
                        name="pbCompanyCodes"
                        rules={[{ required: true, message: '请选择托管' }]}
                    >
                        <Select mode="multiple" allowClear>
                            {listArr.map((item) => (
                                <Option value={item.pbCompanyCode} key={item.pbCompanyCode}>
                                    {item.pbCompanyName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <p>备注：1、华泰托管有请求限制，9:00-15:30不能调用；请在非交易时间读取数据</p>
                    <p>2、国信托管每次调用间隔需&gt;10分钟，请至少间隔10分钟读取数据</p>
                    <p>3、其他托管每次调用间隔需&gt;1秒钟，请至少间隔1秒钟读取数据</p>
                    <p>4、默认仅获取7天内数据，如需获取历史所有数据请联系易私慕客服</p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            style={{ marginRight: 16 }}
                            onClick={(e) => props.changeModal(false)}
                        >
                            取消
                        </Button>
                        <Button type={'primary'} htmlType={'submit'}>
                            确认
                        </Button>
                    </div>
                </Form>
            </Spin>
        </Spin>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['global/queryManagedData'],
    loading2: loading.effects['global/updateData']
}))(ManagedData);
