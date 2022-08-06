/*
 * @description: 基本信息
 * @Author: tangsc
 * @Date: 2021-03-12 09:54:39
 */
import React, { useEffect } from 'react';
import { notification } from 'antd';
import { connect } from 'umi';
import BaseInfoCard from './Tab1Components/BaseInfoCard';
import ProcessNodeInfo from './Tab1Components/ProcessNodeInfo';
import styles from './styles/Tab1.less';
import { getPermission } from '@/utils/utils';


// 提示信息
const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const Tab1 = (props) => {

    const { dispatch, params } = props;
    const { templateId } = params;


    // 组件卸载时数据处理
    const _unmount = () => {
        dispatch({
            type: 'productTemplate/updateState',
            payload: {
                lifecycleNodeList: [],
                templateName: '',
                templateStatuis: 1,
                currentNode: {},
                editHistory: [],
                relatedProducts: 0
            }
        });
    };

    /**
     * @description: 编辑数据查询
     * @param {*}
     */
    const query = (id) => {
        dispatch({
            type: 'productTemplate/querylifeCycleTemplate',
            payload: {
                lifecycleTemplateId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    dispatch({
                        type: 'productTemplate/updateState',
                        payload: {
                            templateName: res.data.templateName,
                            templateStatuis: res.data.templateStatuis,
                            lifecycleNodeList: res.data.lifecycleNodeList,
                            currentNode: res.data.lifeCycleNodeRsp,
                            relatedProducts: res.data.relatedProducts
                        }
                    });
                } else {
                    const warningText = res.message || res.data || '查询失败！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');

                }
            }
        });
    };

    /**
     * @description: 查询模板修改记录
     * @param {*}
     */
    const queryHistory = (id) => {
        dispatch({
            type: 'productTemplate/queryChangeInformation',
            payload: {
                lifecycleTemplateId: id
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    dispatch({
                        type: 'productTemplate/updateState',
                        payload: {
                            editHistory: res.data
                        }
                    });
                }
            }
        });
    };

    useEffect(() => {

        if (Number(templateId) !== 0) {
            // 编辑数据查询
            query(templateId);
            // 查询模板修改记录
            queryHistory(templateId);
        }
        return _unmount;
    }, []);

    return (
        <div className={styles.container}>
            <BaseInfoCard
                templateId={templateId}
                queryData={query}
                queryHistory={queryHistory}
                {...getPermission(40400)}
            />
            <ProcessNodeInfo
                templateId={templateId}
                queryData={query}
                queryHistory={queryHistory}
                {...getPermission(40400)}
            />
        </div>
    );
};

export default connect(({ productTemplate }) => ({
    productTemplate
}))(Tab1);
