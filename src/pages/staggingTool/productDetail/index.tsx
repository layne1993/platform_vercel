import React, { useState, useEffect, useCallback } from 'react';
import { Card, Select, Table } from 'antd';
import InvestorList from './components/InvestorList';
import EditInvestor from './components/EditInvestor';
import ProductInfoForm from './components/ProductInfo';
import _styles from './index.less';
import { listToMap } from '@/utils/utils';
import {
    getCardTypeList,
    getAmountTypeList,
    getJoinTypeList,
    getInvestorByPid,
    updatePrivateMoney
} from './service';
const { Option } = Select;

const productSacTypeList = [
    { label: '基金公司或其资产管理子公司一对多专户理财产品', value: '1' },
    { label: '私募基金', value: '2' },
    { label: '证券公司集合资产管理计划', value: '3' }
];
const productSacTypeListObj = listToMap(productSacTypeList);

const isPrivateMoneyList = [
    { label: '是', value: 1 },
    { label: '否', value: 0 }
];

const isPrivateMoneyListObj = listToMap(isPrivateMoneyList);

const ProductMaintenance = ({ match: { params } }) => {
    const { id } = params;
    const [cardTypeList, setCardTypeList] = useState([]);
    const [amountTypeList, setAmountTypeList] = useState([]);
    const [joinTypeList, setJoinTypeList] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [editData, setEditData] = useState({});

    const [layer, setLayer] = useState(1);
    const [bizKey, setBizKey] = useState(null);
    const [productId, setProductId] = useState(null);
    const [refreshList, setRefreshList] = useState(false);

    const [modalIsVisible, toggleModalIsVisible] = useState(false);
    const [editModalIsVisible, toggleEditModalIsVisible] = useState(false);
    const [investorList, setInvestorList] = useState([]);
    const [loading, setLoading] = useState(false);

    const getList = useCallback(async () => {
        setLoading(true);
        const res: any = await getInvestorByPid(id);
        setLoading(false);
        if (res && res.code == 1008) {
            setInvestorList(res.data);
        }
    }, [id]);

    const handleChangePrivateMoney = useCallback(async (row, key, value) => {
        const { productId, bizKey, isPrivateMoney, lpInvestType, investAmountType, lpName, productSacType } = row;
        setLoading(true);
        const params = {
            productId,
            bizKey,
            isPrivateMoney,
            lpInvestType,
            investAmountType,
            lpName,
            buyConfigType: productSacType
        };
        params[key] = value;

        const res: any = await updatePrivateMoney(params);

        setLoading(false);
        if (res.code === 1008) {
            setInvestorList(investorList.map((item) => {
                if (item.bizKey === bizKey) item[key] = value;
                return item;
            }));
        }
    }, [investorList]);

    // 维护多层出资方
    const handleMaintainInvestor = useCallback(({ level, id, cardNumber, bizKey, productId }) => {
        toggleModalIsVisible(true);
        setLayer(level + 1);
        setBizKey(bizKey || `${level}-${cardNumber}`);
        setProductId(productId);
    }, []);

    // 编辑 & 新建出资方
    const handleCreateOrEditInvestor = useCallback((row) => {
        toggleEditModalIsVisible(true);
        if (row) {
            setEditData(row);
            setIsEdit(true);
        } else {
            setEditData({});
            setIsEdit(false);
        }
    }, []);

    const onRefreshList = useCallback(() => {
        toggleEditModalIsVisible(false);
        setRefreshList(true);
        setRefreshList(false);
        getList();
    }, [getList]);

    const columns: any = [
        {
            title: '产品名称',
            dataIndex: 'productName',
            align: 'center',
            fixed: 'left',
            width: 200
        },
        {
            title: '配售对象类型',
            dataIndex: 'productSacType',
            align: 'center',
            width: 200,
            render: (val, row) => {
                if (row.isSysData === '1') {
                    return (
                        <Select style={{ width: 150 }} defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'buyConfigType', value)}>
                            {productSacTypeList.map((item) => (
                                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                            ))}
                        </Select>
                    );
                }
                if (!row.productId) return <></>;
                // if (row.level !== 1) return val === 1 ? '是' : '否';
                return productSacTypeListObj[val];

            }
        },
        {
            title: '序号',
            dataIndex: 'sortNo',
            align: 'center',
            width: 80
        },
        {
            title: '出资方名称',
            dataIndex: 'lpName',
            align: 'center',
            width: 150
        },
        {
            title: '是否为自有资金',
            dataIndex: 'isPrivateMoney',
            align: 'center',
            width: 100,
            render: (val, row) => {
                if (row.isSysData === '1') {
                    return (
                        <Select defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'isPrivateMoney', value)}>
                            {isPrivateMoneyList.map((item) => (
                                <Select.Option key={item.value} value={item.value}>{item.label}</Select.Option>
                            ))}
                        </Select>
                    );
                }
                if (!row.productId) return <></>;
                // if (row.level !== 1) return val === 1 ? '是' : '否';
                return isPrivateMoneyListObj[val];
            }
        },
        {
            title: '资金类型',
            dataIndex: 'investAmountType',
            align: 'center',
            width: 200,
            render: (val, row) => {
                if (row.isSysData === '1') {
                    return (
                        <Select style={{ width: '160px' }} defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'investAmountType', value)}>
                            {amountTypeList.map((item, index) => (
                                <Option key={index} value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    );
                }
                if (!row.productId) return <></>;
                // if (row.level !== 1) {
                //     const item = amountTypeList.find((i) => i.value === val);
                //     return item ? item.label : '';
                // }
                return listToMap(amountTypeList)[val] || '';
            }
        },
        {
            title: '参与类型',
            dataIndex: 'lpInvestType',
            align: 'center',
            width: 200,
            render: (val, row) => {
                if (row.isSysData === '1') {
                    return (
                        <Select style={{ width: '120px' }} defaultValue={val} onChange={(value) => handleChangePrivateMoney(row, 'lpInvestType', value)}>
                            {joinTypeList.map((item, index) => (
                                <Option key={index} value={item.value}>{item.label}</Option>
                            ))}
                        </Select>
                    );
                }
                if (!row.productId) return <></>;
                // if (row.level !== 1) {
                //     const item = joinTypeList.find((i) => i.value === val);
                //     return item ? item.label : '';
                // }
                return listToMap(joinTypeList)[val] || '';
            }
        },
        {
            title: '为配售对象的第几层出资方',
            dataIndex: 'level',
            width: 200,
            align: 'center'
        },
        {
            title: '出资方身份证明号码（组织机构代码证号/身份证号）',
            dataIndex: 'cardNumber',
            width: 200,
            align: 'center'
        },
        {
            title: '出资比例（%）方式一',
            dataIndex: 'ratio1Percent',
            align: 'center',
            width: 200
        },
        {
            title: '出资比例（%）方式二',
            dataIndex: 'ratio2Percent',
            align: 'center',
            width: 200
        },
        {
            title: '出资份额',
            dataIndex: 'tradeShare',
            align: 'center',
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 180,
            fixed: 'right',
            render: (val, row) => {
                if (row.productId && row.isPrivateMoney === 0) {
                    return <span onClick={() => handleMaintainInvestor(row)} style={{ color: '#3D7FFF', cursor: 'pointer' }}>{`维护${row.level + 1}层出资方`}</span>;
                } else {
                    return <span>--</span>;
                }
            }
        }
    ];

    useEffect(() => {
        const fetchData = async () => {
            const res: any = await getCardTypeList({});
            if (res.code === 1008) {
                const list = res.data || [];
                setCardTypeList(list.map((item) => ({ label: item.codeText, value: item.codeValue })));
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res: any = await getAmountTypeList({});
            if (res.code === 1008) {
                const list = res.data || [];
                setAmountTypeList(list.map((item) => ({ label: item.codeText, value: item.codeValue })));
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const res: any = await getJoinTypeList({});
            if (res.code === 1008) {
                const list = res.data || [];
                setJoinTypeList(list.map((item) => ({ label: item.codeText, value: item.codeValue })));
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        getList();
    }, [getList]);

    return (
        <Card className={_styles.productWrapper}>
            <ProductInfoForm id={id}></ProductInfoForm>

            <Table
                columns={columns}
                dataSource={investorList}
                rowKey={(row, index) => index}
                style={{ marginBottom: '40px' }}
                loading={loading}
                pagination={false}
                scroll={{ x: '100%' }}
            />

            <InvestorList
                layer={layer}
                bizKey={bizKey}
                productId={productId}
                amountTypeList={amountTypeList}
                joinTypeList={joinTypeList}
                isVisible={modalIsVisible}
                refreshList={refreshList}
                onCreateOrEdit={handleCreateOrEditInvestor}
                onMaintain={handleMaintainInvestor}
                onCancel={() => toggleModalIsVisible(false)}
                onDelete={() => getList()}
            />

            <EditInvestor
                layer={layer}
                bizKey={bizKey}
                productId={productId}
                cardTypeList={cardTypeList}
                amountTypeList={amountTypeList}
                joinTypeList={joinTypeList}
                isVisible={editModalIsVisible}
                isEdit={isEdit}
                editData={editData}
                onConfirm={onRefreshList}
                onCancel={() => toggleEditModalIsVisible(false)}
            />
        </Card>
    );
};

export default ProductMaintenance;
