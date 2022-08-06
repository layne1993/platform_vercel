import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Select, Button, message } from 'antd';
import styles from './index.less';
import { queryCustomerSelect } from '../../../service';

const { Option } = Select;

interface IProps {
    visible: boolean;
    editFlag: string;
    modalData: any;
    onOk: (params: any) => void;
    onCancel: () => void;
}

const RelationModal: React.FC<IProps> = (props) => {
    const { visible, editFlag, modalData, onOk, onCancel } = props;

    const [mainDataSource, setMainDataSource] = useState([]);
    const [childDataSource, setChildDataSource] = useState([]);
    const [mainCardNumber, setMainCardNumber] = useState('');
    const [childCardNumbers, setChildCardNumbers] = useState([]);
    const [newChildCard, setNewChildCard] = useState('');

    const onSelectMainCard = (val) => {
        if (childCardNumbers.includes(val)) {
            message.error('客户存在重复，请重新选择');
        } else {
            setMainCardNumber(val);
        }
    };

    const handleDel = (val) => {
        const newData = [...childCardNumbers];
        const index = newData.findIndex((item) => item === val);
        newData.splice(index, 1);
        setChildCardNumbers(newData);
    };

    const onSelectChildCard = (val, idx) => {
        const newData = [...childCardNumbers];
        newData.splice(idx, 1, val);
        setChildCardNumbers(newData);
    };

    const onCreateChild = (val) => {
        const newData = [...childCardNumbers];
        if (newData.includes(val) || mainCardNumber === val) {
            message.error('客户存在重复，请重新选择');
        } else {
            newData.push(val);
        }
        setChildCardNumbers(newData);
        setNewChildCard('');
    };

    const getMainCustomerData = async (params) => {
        const res = await queryCustomerSelect(params);
        if (+res.code === 1001) {
            let dataSource = res.data.filter(item => item.selectKey);
            setMainDataSource(dataSource);
            if (params.mainCardNumber) {
                setMainCardNumber(params.mainCardNumber);
            }
        }
    };
    const getChildCustomerData = async (params) => {
        const res = await queryCustomerSelect(params);
        if (+res.code === 1001) {
            let dataSource = res.data.filter(item => item.selectKey);
            setChildDataSource(dataSource);
            if (params.childCustomerArray) {
                setChildCardNumbers(params.childCustomerArray);
            }
        }
    };

    const handleOk = () => {
        if (mainCardNumber && childCardNumbers.length) {
            onOk({
                mainCardNumber,
                childCardNumbers: JSON.stringify(childCardNumbers)
            });
        } else {
            message.error('主客户和子客户均不能为空');
        }
    };

    useEffect(() => {
        if (visible) {
            if (editFlag === 'create') {
                getMainCustomerData({
                    mainChildFlag: 'main',
                    addEditFlag: 'add'
                });
                getChildCustomerData({
                    mainChildFlag: 'child',
                    addEditFlag: 'add'
                });
                setMainCardNumber('');
                setChildCardNumbers([]);
            } else {
                const { mainCardNumber, childCustomerArray } = modalData;
                getMainCustomerData({
                    mainChildFlag: 'main',
                    addEditFlag: 'edit',
                    mainCardNumber
                });
                getChildCustomerData({
                    mainChildFlag: 'child',
                    addEditFlag: 'edit',
                    mainCardNumber,
                    childCustomerArray
                });
            }
        }
    }, [visible, editFlag]);

    return (
        <Modal
            visible={visible}
            width="666px"
            title="新增客户关联关系"
            onCancel={onCancel}
            onOk={handleOk}
        >
            <Row gutter={16} className={styles.container}>
                <Col span={9} className={styles.content}>
                    <span className={styles.title}>主客户：</span>
                    <Select
                        value={mainCardNumber}
                        showSearch
                        className={styles.inputBox}
                        onChange={onSelectMainCard}
                        disabled={editFlag === 'edit'}
                        placeholder="请选择主客户"
                        allowClear
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.indexOf(input) >= 0
                        }
                    >
                        {mainDataSource.map((item) => (
                            <Option value={item.selectKey} key={item.selectKey}>{item.selectValue}</Option>
                        ))}
                    </Select>
                </Col>
                <Col span={15} className={styles.content}>
                    <span className={styles.title}>子客户：</span>
                    {childCardNumbers.map((item, index) => (
                        <div className={styles.childBar} key={index}>
                            <Select
                                value={item}
                                showSearch
                                allowClear
                                className={styles.inputBox}
                                onChange={(val) => onSelectChildCard(val, index)}
                                placeholder="请选择子客户"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.indexOf(input) >= 0
                                }
                            >
                                {childDataSource.map((item) => (
                                    <Option value={item.selectKey} key={item.selectKey}>{item.selectValue}</Option>
                                ))}
                            </Select>
                            <Button
                                type="danger"
                                style={{ marginLeft: 12 }}
                                onClick={() => handleDel(item)}
                            >删除</Button>
                        </div>
                    ))}
                    <div className={styles.newChildBar}>
                        <Select
                            allowClear
                            showSearch
                            value={newChildCard}
                            className={styles.inputBox}
                            onChange={onCreateChild}
                            placeholder="请选择子客户"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.indexOf(input) >= 0
                            }
                        >
                            {childDataSource.map((item) => (
                                <Option value={item.selectKey} key={item.selectKey}>{item.selectValue}</Option>
                            ))}
                        </Select>
                    </div>
                </Col>
            </Row>
        </Modal>
    );
};

export default RelationModal;
