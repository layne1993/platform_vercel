/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-03-18 11:20:10
 * @LastEditTime: 2021-05-20 16:41:22
 */
import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Card } from 'antd';
import _styles from './styles.less';
import moment from 'moment';

interface UpdateRecordProps {
    data: any[]
}


const UpdateRecord: FC<UpdateRecordProps> = (props) => {

    const { data } = props;
    const [showList, setShowList] = useState<any[]>([]);

    // 初始化数据
    const initList = () => {
        setShowList(data.slice(0, 2));
    };

    useEffect(initList, [props]);

    // 展示更多
    const showMore = () => {
        setShowList(data);
    };

    return (
        <Card
            title="操作记录"
            className={_styles.editInfo}
            id="edit-info"
        >
            {
                Array.isArray(showList) &&
                showList.map((item, index) => {
                    return (
                        <p key={index} className={_styles.editInfoItem}>
                            <span><span>{index === 0 ? '创建人' : '修改人'}</span>：{item.managerUserName || '--'}</span>
                            <span>创建时间：{item.updateTime ? moment(item.updateTime).format('YYYY-MM-DD HH:mm:ss') : '--'}</span>
                        </p>
                    );
                })
            }
            {showList.length !== data.length && <span className={_styles.showMore} onClick={showMore}>更多</span>}
        </Card>
    );
};

export default UpdateRecord;
