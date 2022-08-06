import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { message, Card, Row, Col, Space, Button, Result } from 'antd';
import { StockOutlined, RightOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import axios from 'axios';
import ZipIcon from '@/assets/stagging/zip.svg';
import _styles from './index.less';

import moment from 'moment';

const materialList = [
    {
        label: '承诺函'
    },
    {
        label: '关联方信息表'
    },
    {
        label: '资产规模汇总表'
    },
    {
        label: '出资方信息表'
    }
];

const stepMap = {
    1: '1、主承平台材料提交',
    2: '2、询价提交',
    3: '3、发行公告',
    4: '4、发行/申购',
    5: '5、公布中签',
    6: '6、获配/缴款',
    7: '7、上市'
};
const availableMap = {
    1: true,
    2: true,
    3: false,
    4: true,
    5: false,
    6: true,
    7: false
};

const StepDetail = (props) => {
    const { id, applyStatus, dispatch, staggingStockDetail } = props;
    const { IPOMaterialList, stockDetail } = staggingStockDetail;
    // 标的打新的状态
    const [stepList, setStepList] = useState([]);
    const [step, setStep] = useState(0);
    const [actualStep, setActualStep] = useState(0);
    const [stepStatus, setStepStatus] = useState(0);
    const [stepTitle, setStepTitle] = useState('');
    const [mList, setMList] = useState([]);
    const [actionList, setActionList] = useState([]);
    const [currentAction, setCurrentAction] = useState({
        id: 1,
        color: '#ff3f3f',
        text: '待提交'
    });
    const [showActionDropdown, toggleActionDropdown] = useState(false);

    const fetchData = useCallback(async () => {
        const res = await dispatch({
            type: 'staggingStockDetail/getStockIPOStepDetail',
            payload: {
                secuCode: id
            }
        });

        if (res.code !== 1008) return;
        const { step = 1, stepInfos = [] } = res.data || {};
        const stepList = stepInfos.map((item) => {
            const { startDate, endDate, step: s } = item;
            let startDateT = startDate ? moment(startDate).format('MM/DD') : '';
            let endDateT = endDate ? moment(endDate).format('MM/DD') : '';
            return {
                ...item,
                date: startDateT ? `${startDateT}${(endDateT && startDateT !== endDateT) ? `-${endDateT}` : ''}` : '---',
                title: stepMap[s],
                available: availableMap[s]
            };
        });
        setActualStep(step || 1);
        setStep(step === 8 ? 1 : (step || 1));
        setStepList(stepList);
    }, [dispatch, id]);

    const handleDownload = useCallback((item) => {
        // const type = index + 1;
        // const item = IPOMaterialList.find((i) => i.type === type);
        if (!item || !item.fileUrl) {
            message.info('材料不存在');
            return;
        }
        const { fileUrl } = item;
        window.open(fileUrl);
    }, [IPOMaterialList]);

    const handleReGenerateFile = useCallback(async () => {
        const r = await dispatch({
            type: 'staggingStockDetail/reGenAllAttachments',
            payload: {
                secuCode: id
            }
        });
        if (r.code !== 1008) {
            message.error(r.message);
            return;
        }

        const res = await axios({
            url: `${BASE_PATH.adminUrl}/staggingnew/apply/downloadMaterialPackage`,
            data: { secuCode: id },
            method: 'post',
            responseType: 'blob',
            headers: {
                'Content-Type': 'application/json; application/octet-stream',
                'tokenId': getCookie('vipAdminToken') || ''
            }
        });
        try {
            let fileName = res.headers['content-disposition'].split(';')[1].split('filename*=utf-8\'\'')[1];
            fileName = decodeURIComponent(fileName);
            const blob = new Blob([res.data]);
            const downloadElement = document.createElement('a');
            const href = window.URL.createObjectURL(blob);
            downloadElement.href = href;
            downloadElement.download = fileName;
            document.body.appendChild(downloadElement);
            downloadElement.click();
            document.body.removeChild(downloadElement);
            window.URL.revokeObjectURL(href);
        } catch (error) {
            message.error('生成文件失败');
        }
    }, [dispatch, id]);

    const handleOpenSite = useCallback(() => {
        const { website } = stockDetail;
        if (!website) {
            message.info('承销商网址不存在！');
            return;
        }
        window.open(website);
    }, [stockDetail]);

    const handleCompleteStep = useCallback(async (step, stepStatus) => {
        toggleActionDropdown(false);
        const res = await dispatch({
            type: 'staggingStockDetail/finishCurrentIPOStep',
            payload: {
                secuCode: id,
                step,
                stepStatus
            }
        });

        if (res.code === 1008) {
            setStepList(stepList.map((item) => {
                if (item.step === step) item.stepStatus = stepStatus;
                return item;
            }));
        }
    }, [dispatch, id, stepList]);

    useEffect(() => {
        if (stepList.length === 0) return;
        const { title, stepStatus } = stepList[step - 1];
        const actionList = [{
            id: 1,
            color: '#ff3f3f',
            text: '待提交'
        }, {
            id: 2,
            color: '#fdc753',
            text: '已提交'
        }, {
            id: 3,
            color: '#3d7fff',
            text: '已完成'
        }];
        toggleActionDropdown(false);
        setStepTitle(title);
        setStepStatus(stepStatus);
        setCurrentAction(actionList.find((a) => a.id === stepStatus));
        setActionList(actionList.filter((a) => a.id !== stepStatus));
    }, [step, stepList]);

    useEffect(() => {
        fetchData();
    }, [dispatch, fetchData]);

    useEffect(() => {
        dispatch({
            type: 'staggingStockDetail/getStaggingMaterials',
            payload: {
                secuCode: id
            }
        });
    }, [dispatch, id]);

    useEffect(() => {
        const list = [];
        [...Array(4)].map((item, index) => {
            const file = IPOMaterialList.find((i) => i.type === index + 1);
            const { fileName = '', fileUrl = '' } = file || {};
            list.push({
                fileUrl,
                fileName
            });
        });
        setMList(list);
    }, [IPOMaterialList]);

    return (
        <Card title="参与信息" className={_styles.stepCard}>
            <div className={_styles.stepBox}>
                {stepList.map((item, index) => (
                    <>
                        <div key={item.step} className={`${_styles.stepItemWrapper} ${step === index + 1 ? _styles.active : ''} `}>
                            <div
                                className={`${_styles.stepItem} ${step === index + 1 ? _styles.active : ''} ${item.available ? _styles.available : ''}`}
                                onClick={() => setStep(index + 1)}
                            >
                                <div className={_styles.date}>{item.date}</div>
                                <div className={_styles.title}>{item.title}</div>
                            </div>
                        </div>
                        {index !== 6 && <RightOutlined />}
                    </>
                ))}
            </div>
            {step >= 1 && applyStatus === 1 && (
                <div className={_styles.stepDetail}>
                    <div className={_styles.header}>
                        <div className={_styles.title}>{stepTitle}</div>
                        {[1, 2, 4, 6].includes(step) && stepStatus !== 0 && actualStep >= step && (
                            <div className={_styles.rightBox}>
                                <Button
                                    style={{
                                        color: '#fff',
                                        backgroundColor: currentAction.color,
                                        border: 'none'
                                    }}
                                    onClick={() => toggleActionDropdown(!showActionDropdown)}
                                >
                                    {currentAction.text}
                                </Button>
                                {showActionDropdown && (
                                    <div className={_styles.dropdown}>
                                        {actionList.map((item, index) => (
                                            <Button
                                                key={index}
                                                style={{
                                                    color: '#fff',
                                                    backgroundColor: item.color,
                                                    border: 'none'
                                                }}
                                                onClick={() => handleCompleteStep(step, item.id)}
                                            >
                                                {item.text}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {step === 1 && (
                        <>
                            <Row justify="center">
                                {IPOMaterialList.map((item, index) => (
                                    (item.code === 1 || item.code === 2 || (item.code === 0 && item.hints.length > 0)) &&
                                    <Col key={index} span={4}>
                                        <div className={_styles.item}>
                                            <div className={_styles.label}>{item.typeName}：</div>
                                            <div className={_styles.right}>
                                                <div className={_styles.iconBox} onClick={() => handleDownload(item)}>
                                                    <img src={ZipIcon} />
                                                </div>
                                                <p>{item.fileName}</p>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            <Space style={{ justifyContent: 'center', width: '100%', marginTop: '40px' }}>
                                <Button type="primary" onClick={handleReGenerateFile}>重新生成文件</Button>
                                <Button type="primary" onClick={handleOpenSite}>上传承销商</Button>
                            </Space>
                        </>
                    )}
                    {step > 1 && (
                        <Result
                            icon={<StockOutlined />}
                            title="敬请期待！"
                        />
                    )}
                </div>
            )}
        </Card>
    );
};

export default connect(({ staggingStockDetail }) => ({
    staggingStockDetail
}))(StepDetail);
