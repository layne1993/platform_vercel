import React, { useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card } from 'antd';

import ValuationTable from './components/valuationTable';
import RelationShip from './components/RelationShip';
import AssetsClassification from './components/assetsClassification';
import IndustryClassification from './components/IndustryClassification';

import styles from './index.less';

const InternalManagement: React.FC<{}> = (props) => {
    const [typeList, settypeList] = useState<array>([
        { name: '估值表管理', id: '1' },
        { name: '客户关联关系设定', id: '2' },
        { name: '大类资产明细管理', id: '3' },
        { name: '行业分类管理', id: '4' },
    ]);

    const [typeListNone, settypeListNone] = useState<array>([
        { name: '风格分类管理', id: '5' },
    ]);
    const [selectType, setSelectType] = useState('1');

    const handleClickMenu = id => {
        setSelectType(id);
    }

    const renderComponent = () => {
        switch (selectType) {
            case '1':
                return <ValuationTable />;
            case '2':
                return <RelationShip />;
            case '3':
                return <AssetsClassification />
            case '4':
                return <IndustryClassification />
        }
    };

    return (
        <PageHeaderWrapper title="数据管理">
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
                                className={`${styles.manageBottomBox} ${selectType === item.id ? styles.actived : ''}`}
                                key={item.id}
                                onClick={() => handleClickMenu(item.id)}
                            >{item.name}</div>
                        ))}
                        {typeListNone.map((item, index) => (
                            <div className={styles.manageBottomBoxNone}>{item.name}</div>
                        ))}
                    </div>

                    <div className={styles.manageRight}>{renderComponent()}</div>
                </div>
            </Card>
        </PageHeaderWrapper>
    );
};

export default InternalManagement;
