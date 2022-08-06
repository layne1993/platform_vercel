/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-29 13:24:58
 * @LastEditTime: 2021-11-12 13:58:27
 */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Modal, Steps, Input, notification, Spin } from 'antd';
import { connect } from 'umi';
import type { Dispatch } from 'umi';
import _styles from './styles.less';
import Step1 from './../step1/Step1';
import Step2 from './../step2/Step2';


const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


interface newSignFLowProps {
    flag: boolean,
    cancel: () => void,
    dispatch: Dispatch,
    success: () => void,
    loading: boolean
}


const newSignFLow: FC<newSignFLowProps> = (props) => {
    const { flag, cancel, dispatch, success, loading } = props;
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [checkProduct, setCheckProduct] = useState<number[]>([]);                        // 产品table选中行
    const [checkCustomer, setCheckCustomer] = useState<number[]>([]);
    const [productId, setProductId] = useState<any>(undefined);                       // 客户table选中行

    const steps = [
        {
            title: '选择需要签署的协议',
            render: <Input key={1} />
        },
        {
            title: '选择需要签署的客户',
            render: <Input key={2} />
        }
    ];



    const getStyleDisplay = (step) => {
        if (currentStep === step) return 'block';
        return 'none';
    };

    /**
     * @description 下一步
     */
    const next = (ids) => {
        // if (checkProduct.length === 0) {
        //     openNotification('warning', '提醒', '请先选择一个产品！');
        //     return;
        // }
        setCurrentStep(currentStep + 1);
        setCheckProduct(ids);

    };

    const productChange = (id) => {
        console.log(id);
        setProductId(id);
    };

    /**
     * @description 新建
     */
    const newSeparateSign = (productIds, customerIds) => {
        dispatch({
            type: 'SEPARATEAGREEMENT/newSeparateSign',
            payload: {
                documentIds: productIds,
                customerId: customerIds
                // productId: productId
            },
            callback: ({ code, data, message }: any) => {
                if (code === 1008) {
                    success();
                    openNotification('success', '提醒', '新建成功');
                } else {
                    const txt = message || data || '新建失败！';
                    openNotification('error', '提醒', txt);
                }
            }
        });
    };

    const onOk = (values) => {
        newSeparateSign(checkProduct, values);
    };


    return (
        <Modal
            visible={flag}
            footer={null}
            onCancel={cancel}
            title=""
            width={'80%'}
            bodyStyle={{ maxHeight: 800, padding: '30px 50px' }}
            className={_styles.newSignFlowWarp}
        >



            <Steps current={currentStep} className={_styles.steps} style={{ height: 50, width: '50%', marginTop: 20, marginBottom: 15, marginLeft: '25%' }}>
                {steps.map((item) => (
                    <Steps.Step key={item.title} title={item.title} />
                ))}
            </Steps>
            {/* <div style={{ display: getStyleDisplay(0) }} >
                {currentStep === 0 && <Step1 cancel={cancel} onOk={setCheckProduct} />}
            </div> */}
            <Spin spinning={loading}>
                {currentStep === 0 && <Step1 cancel={cancel} onOk={next} productChange={productChange} />}

                {/* <div style={{ display: getStyleDisplay(1) }} >
                <Step2 cancel={cancel} onOk={onOk} />
            </div> */}

                {currentStep === 1 && <Step2 cancel={cancel} onOk={onOk} />}
            </Spin>
        </Modal>
    );
};


export default connect(({ loading }) => ({
    loading: loading.effects['SEPARATEAGREEMENT/newSeparateSign'],
    customerLoading: loading.effects['SEPARATEAGREEMENT/getCustomerList']
}))(newSignFLow);

newSignFLow.defaultProps = {
    flag: false,
    cancel: () => { },
    success: () => { },
    loading: false
};
