import React, { useState, Fragment } from 'react';
import { Steps } from 'antd';
import Step1 from './Step1';
import Step2 from './Step2';
const { Step } = Steps;
const Add = (props) => {
    const [stepCurrent, changeStepCurrent] = useState<number>(0);
    const [step1Data, changeStep1Data] = useState<any>({});
    return (
        <Fragment>
            <div
                style={{
                    paddingBottom: 20,
                    width: '45%',
                    margin: '0 auto'
                }}
            >
                <Steps current={stepCurrent}>
                    <Step title="选择产品" />
                    <Step title="选择客户" />
                </Steps>
            </div>
            {stepCurrent === 0 ? (
                <Step1
                    changeStepCurrent={changeStepCurrent}
                    closeModal={props.closeModal}
                    changeStep1Data={changeStep1Data}
                />
            ) : null}
            {stepCurrent === 1 ? (
                <Step2
                    step1Data={step1Data}
                    closeModal={props.closeModal}
                    quertTableData={props.quertTableData}
                />
            ) : null}
        </Fragment>
    );
};

export default Add;
