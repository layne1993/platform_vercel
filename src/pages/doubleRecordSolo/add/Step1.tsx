import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Button, Spin } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import type { Dispatch } from 'umi';
import { cloneDeep } from 'lodash';

interface DoubleRecordSoloAddStep1 {
    dispatch: Dispatch;
    loading: boolean;
    changeStepCurrent(val: number): void;
    closeModal(): void;
    changeStep1Data(val: any): void;
}
const { Option } = Select;
const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 }
};
const Step1: React.FC<DoubleRecordSoloAddStep1> = (props) => {
    let time = null;
    const [form] = Form.useForm();
    const [productFullNameList, setProductFullNameList] = useState<any[]>([]);
    const onFinish = (val) => {
        let obj = cloneDeep(val);
        if (obj.doubleRecordTime) {
            obj.doubleRecordTime = moment(obj.doubleRecordTime).format('x');
        }
        props.changeStep1Data(val);
        props.changeStepCurrent(1);
    };

    const handleSearch = (productFullName) => {
        const { dispatch } = props;
        clearTimeout(time);
        time = setTimeout(() => {
            dispatch({
                type: 'doubleRecordSolo/getProductFullName',
                payload: { productFullName },
                callback(data: any) {
                    setProductFullNameList(data.data || []);
                }
            });
        }, 500);
    };

    return (
        <div
            style={{
                margin: '0 auto'
            }}
        >
            <Form {...layout} onFinish={onFinish} form={form}>
                <Form.Item label="产品全称" rules={[{ required: true }]} name={'productIdList'}>
                    <Select
                        mode={'multiple'}
                        showSearch
                        placeholder={'请输入全称或简称'}
                        defaultActiveFirstOption={false}
                        showArrow={false}
                        filterOption={false}
                        onSearch={handleSearch}
                        allowClear
                        notFoundContent={props.loading ? <Spin size="small" /> : null}
                        style={{ width: '70%' }}
                    >
                        {productFullNameList.map((item) => (
                            <Option value={item.productId} key={item.productId}>
                                {item.productFullName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="设置双录日期" name={'doubleRecordTime'}>
                    <DatePicker style={{ width: '70%' }} />
                </Form.Item>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}
                >
                    <Button
                        style={{
                            marginRight: 16
                        }}
                        onClick={props.closeModal}
                    >
                        取消
                    </Button>
                    <Button type={'primary'} htmlType={'submit'}>
                        下一步
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default connect(({ loading }) => ({
    loading: loading.effects['doubleRecordSolo/getProductFullName']
}))(Step1);
