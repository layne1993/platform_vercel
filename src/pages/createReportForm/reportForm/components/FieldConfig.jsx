/*
 * @description: 字段展示配置
 * @Author: tangsc
 * @Date: 2021-03-29 14:32:55
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import styles from '../index.less';
import { Card, Row, Col, Modal, Transfer, Button } from 'antd';
import { CloseOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { cloneDeep, isEmpty } from 'lodash';
import { profitRateType } from '@/utils/publicData';
import { getRandomKey } from '@/utils/utils';

const { confirm } = Modal;

const FieldConfig = (props) => {

    const { dispatch, createReportForm } = props;
    const { isShowa, customFormData = {} } = createReportForm;
    const { performanceRangeShows = [], historicalIncomes = [] } = customFormData;

    // 数据展示穿梭框是否显示
    const [isShowShuttleBox, setIsShowShuttleBox] = useState(false);
    // 穿梭框数据源
    const [dataSource, setDataSource] = useState([]);
    // 目标框数组
    const [targetKeys, setTargetKeys] = useState([]);
    // 穿梭框选中项
    const [selectedKeys, setSelectedKeys] = useState([]);
    // 收益率
    const [profitList, setProfitList] = useState([]);
    // 本产品
    const [currentProductList, setCurrentProductList] = useState([]);
    // 比较基准
    const [standardList, setStandardList] = useState([]);
    // 比较基准名称
    const [standardName, setStandardName] = useState('');

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
                        isHistoricalIncomes: false
                    }
                });
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    };

    /**
     * @description:  打开/关闭穿梭框
     */
    const _toggle = () => {
        setIsShowShuttleBox((o) => !o);
    };


    /**
     * @description: 选项在两栏之间转移时的回调函数
     * @param {Array} nextTargetKeys 目标数
     * @param {String} direction 移动方向
     * @param {Array} moveKeys 移动的数组
     */
    const _onfieldsChange = (nextTargetKeys, direction, moveKeys) => {
        let tempArr = cloneDeep(performanceRangeShows);
        Array.isArray(nextTargetKeys) &&
            nextTargetKeys.forEach((item) => {
                tempArr.forEach((innerItem) => {
                    if (innerItem.type === item) {
                        innerItem.enableShow = 1;
                    }
                });
            });
        dispatch({
            type: 'createReportForm/updateState',
            payload: {
                periods: tempArr
            }
        });
        setTargetKeys(nextTargetKeys);
    };


    /**
     * @description: 选中项发生改变时的回调函数
     * @param {Array} sourceSelectedKeys 左边框选中的key数组
     * @param {Array} targetSelectedKeys 目标框选中的key数组
     */
    const _onSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        setSelectedKeys([...sourceSelectedKeys, ...targetSelectedKeys]);
    };

    const _dataSort = (targetArr) => {
        let profitArr = [];
        let currentProductArr = [];
        let standardArr = [];
        let typeArr = [];
        let tempName = '';
        targetArr.forEach((item) => {
            performanceRangeShows.forEach((innerItem) => {
                if (item === innerItem.type) {
                    typeArr.push(item);
                    // profitArr.push(profitRateType[item]);
                    // currentProductArr.push(innerItem.standard);
                    // standardArr.push(innerItem.standard);
                }
            });
        });
        Array.isArray(typeArr) && Array.isArray(historicalIncomes) &&
            typeArr.forEach((item) => {
                historicalIncomes.forEach((innerItem) => {
                    if (item === innerItem.type) {
                        profitArr.push(profitRateType[item]);
                        currentProductArr.push(innerItem.changepercent);
                        standardArr.push(innerItem.standard ? innerItem.standard : '--');
                        tempName = innerItem.standardName ? innerItem.standardName : '--';
                    }
                });
            });
        setProfitList(profitArr);
        setCurrentProductList(currentProductArr);
        setStandardList(standardArr);
        setStandardName(tempName);
    };


    const _handelOk = () => {
        _dataSort(targetKeys);
        _toggle();
    };

    useEffect(() => {
        let tempArr = [];
        let targetArr = [];

        if (!isEmpty(performanceRangeShows)) {
            performanceRangeShows.forEach((item) => {
                tempArr.push({
                    key: item.type,
                    fieldName: item.fieldName,
                    enableShow: item.enableShow
                });
            });

            targetArr = tempArr.filter((item) => item.enableShow === 1).map((item) => item.key);
            _dataSort(targetArr);
            setDataSource(tempArr);
            setTargetKeys(targetArr);

        }

    }, [customFormData]);

    return (
        <Card className={styles.fieldConfigBox}>
            <Row>
                <Col span={8}>
                    <h3><strong>收益率</strong></h3>
                    {
                        !isEmpty(profitList) &&
                        profitList.map((item) => {
                            return <p key={getRandomKey(3)}>{item}</p>;
                        })
                    }
                </Col>
                <Col span={8}>
                    <h3><strong>本产品</strong></h3>
                    {
                        !isEmpty(currentProductList) &&
                        currentProductList.map((item) => {
                            return <p key={getRandomKey(3)}>{item}</p>;
                        })
                    }
                </Col>
                <Col span={8}>
                    <h3><strong>{standardName}</strong></h3>
                    {
                        !isEmpty(standardList) &&
                        standardList.map((item) => {
                            return <p key={getRandomKey(3)}>{item}</p>;
                        })
                    }
                </Col>
            </Row>
            {
                isShowa && <EditOutlined className={styles.operateIcon_edit} onClick={_toggle} />
            }
            {
                isShowa && <CloseOutlined className={styles.operateIcon} onClick={_deleteModule} />
            }
            <div>
                <Modal
                    className={styles.fieldsModalWrapper}
                    title="数据展示配置"
                    width={600}
                    centered
                    maskClosable={false}
                    visible={isShowShuttleBox}
                    onCancel={_toggle}
                    footer={
                        [
                            <Button key="next" type="primary" className="modalButton" onClick={_handelOk}>
                                确定
                            </Button>,
                            <Button key="cancel" className="modalButton" onClick={_toggle}>
                                取消
                            </Button>
                        ]
                    }
                >
                    <Transfer
                        dataSource={dataSource}
                        titles={['未展示要素', '已展示要素']}
                        targetKeys={targetKeys}
                        selectedKeys={selectedKeys}
                        onChange={_onfieldsChange}
                        onSelectChange={_onSelectChange}
                        render={(item) => item.fieldName}
                    />
                </Modal>
            </div>
        </Card>
    );
};

export default connect(({ createReportForm }) => ({
    createReportForm
}))(FieldConfig);