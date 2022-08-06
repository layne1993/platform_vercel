import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';
import WarningTable from './components/WarningTable';
import ReturnAndScale from './components/ReturnAndScale';
import SingleProduct from './components/SingleProduct';
import MultiProductIndex from './components/Multiproduct';
import ManagementReport from './components/ManagementReport';
import RateConfig from './components/ManagementReport/component/Rateconfig';
import EconomyConfig from './components/ManagementReport/component/EconomyConfig';
import CreateCost from './components/ManagementReport/component/CreateCost';

import styles from './index.less';

const InternalManagement: React.FC<{}> = (props) => {
    const [typeList, settypeList] = useState<array>([]);

    const [typeListNone, settypeListNone] = useState<array>([
        // { name: '客户虚拟计提净值计算表', id: '3' },
        // { name: '产品规模变动表', id: '4' },
        // { name: '费用计算表', id: '5' },
        // { name: '税收计算表', id: '6' },
        // { name: '交易量统计表', id: '7' },
        // { name: '头寸管理及预测表', id: '8' },
        // { name: '合规指标计算表', id: '9' },
        // { name: '产品绩效评估表', id: '10' },
        // { name: '客户持仓收益表', id: '11' },
        // { name: '尽职调查表', id: '12' }
    ]);
    const [selectId, setSelectId] = useState('2');

    const handleClickMenu = (id) => {
        setSelectId(id);
    };

    const renderComponent = () => {
        switch (selectId) {
            case '1':
                return <WarningTable />;
            case '2':
                return <ReturnAndScale />;
            case '3':
                return <SingleProduct />;
            case '4':
                return <MultiProductIndex />;
            case '5':
                return <ManagementReport changId={(info) => setSelectId(info)} />;
            case '6':
                return <RateConfig />;
            case '7':
                return <EconomyConfig />;
            case '8':
                return <CreateCost />;
        }
    };

    // 2021、9、22 鸿道添加多产品和单产品
    useEffect(() => {
        console.info(BASE_PATH);
        if (BASE_PATH.baseUrl.includes('hdmanager') || BASE_PATH.baseUrl.includes('vipmanager')) {
            settypeList([
                { name: '客户资产规模排序及收益一览表', id: '2' },
                { name: '单一产品业绩指标', id: '3' },
                { name: '多产品业绩指标', id: '4' },
                { name: '费用管理报表', id: '5' },
            ]);
        } else {
            settypeList([{ name: '客户资产规模排序及收益一览表', id: '2' }]);
        }
    }, []);

    return (
        <PageHeaderWrapper title="内部管理表">
            <Card className={styles.manageCard}>
                <div className={styles.manageBox}>
                    <div className={styles.manageLeft}>
                        <div className={styles.manageTopBox}>
                            <img
                                className={styles.mangageIcon}
                                src={require('@/pages/reportCenter/assets/mangageIcon.svg')}
                                alt=""
                            />
                            管理类型
                        </div>

                        {typeList.map((item, index) => (
                            <div
                                className={`${styles.manageBottomBox} ${
                                    selectId === item.id ? styles.actived : ''
                                }`}
                                key={item.id}
                                onClick={() => handleClickMenu(item.id)}
                                title={item.name}
                            >
                                {item.name}
                            </div>
                        ))}
                        {typeListNone.map((item, index) => (
                            <div className={styles.manageBottomBoxNone} title={item.name}>
                                {item.name}
                            </div>
                        ))}
                    </div>

                    <div className={styles.manageRight}>{renderComponent()}</div>
                </div>
            </Card>
        </PageHeaderWrapper>
    );
};

export default InternalManagement;
