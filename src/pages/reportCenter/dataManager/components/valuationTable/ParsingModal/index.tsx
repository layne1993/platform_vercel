import React, { useEffect, useState } from 'react';
import { Select, Button, Modal, notification, Spin, message } from 'antd';

import UploadProgress from '../../UploadProgress';
import TableList from '../TableList';

import {getValuationTableList, parseValuationTable, deteleValuationTable} from '../../../service';

import { getCookie } from '@/utils/utils';

import styles from './index.less';

interface propsTs{
    visible:boolean,
    handleCancel?:any
}

const openNotification = (type, message, description, placement?, duration = 3) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

const ParsingModal: React.FC<propsTs> = (props) => {
    const { visible, handleCancel } = props;

    const [loading, setloading] = useState<boolean>(false);
    const [parseLoading, setparseLoading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<array>([{productname:'测试赛'}]);
    const [total, settotal] = useState<number>(0);
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

    const [pageData, setpageData] = useState<object>({
    // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    });

    // 上传完成回调
    const callback = ({ status, messageO }) => {
        console.log(status, 'status');
        if (status === 'success') {
            message.success('上传估值表成功');
            getValuationTableListAjax();
        } else {
            openNotification(
                'warning',
                '提示',
                messageO,
                'topRight',
            );
        }
    };

    const callbackCancel = ()=>{
        getValuationTableListAjax();
    }

    const onTableChange = (data)=>{
        console.log(data, 'data值为');
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setpageData({...pageData});
        getValuationTableListAjax();
    };

    const onSelectChange = (ids)=>{
        setselectedRowKeys([...ids]);
    };

    const onParseClick =async ()=>{
        setparseLoading(true);
        const res = await parseValuationTable({fileIds:JSON.stringify(selectedRowKeys)});
        if(+res.code===1001){
            res.data.forEach((item)=>{
                item.flag ? message.success(item.msg) : message.warning(item.msg);
            });
            
            getValuationTableListAjax()
        }else{
            message.warning('解析失败, 请检查模板')
        }
        setparseLoading(false);
    };

    const onDelClick =async ()=>{
        Modal.confirm({
            title: '',
            content: '确认删除吗',
            okText: '确认',
            cancelText: '取消',
            onOk:async ()=>{
                const res = await deteleValuationTable({fileIds:JSON.stringify(selectedRowKeys)});
                if(+res.code===1001){
                    getValuationTableListAjax();
                    message.success('删除成功');
                }
            }
        });
    };

    const getValuationTableListAjax = async ()=>{
        setloading(true);
        const res = await getValuationTableList({
            ...pageData

        });
        if(+res.code===1001){
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        setloading(false);
        console.log(res, 'res');
    };

    useEffect(() => {
        visible && getValuationTableListAjax();
    }, [visible]);

    return (
        <Modal visible={visible} width="920px" title="估值表解析管理" onCancel={()=>{!parseLoading && handleCancel();}} footer={null}>
            <Spin tip="解析中" spinning={parseLoading}>
                <div className={styles.container}>
                    <div className={styles.controlBar}>
                        {/* <div className={styles.searchWrap}>
                        解析状态：
                        <Select defaultValue="0" style={{ width: 180 }}>
                            <Select.Option value="0">全部</Select.Option>
                            <Select.Option value="1">未解析</Select.Option>
                            <Select.Option value="2">解析成功</Select.Option>
                            <Select.Option value="3">解析失败</Select.Option>
                        </Select>
                        <Button type="primary" className={styles.searchBtn}>
                            查询
                        </Button>
                    </div> */}
                        <div className={styles.btns}>
                            <UploadProgress
                                params={{
                                    userId: getCookie('managerUserId'),
                                    userName:getCookie('userName'),
                                    fileType:'product'
                                }}
                                url={'/mvt/valuationTable/checkAndUpload'}
                                uploadProps={{
                                    multiple: true,
                                    accept: ".xlsx,.xls"
                                }}
                                callback={callback}
                                callbackCancel={callbackCancel}

                            >
                                <Button type="primary" className={styles.controlBtn}>
                            上传估值表
                                </Button>
                            </UploadProgress>
                            <Button type="primary" disabled={!selectedRowKeys.length} onClick={onParseClick} className={styles.controlBtn}>
                            解析
                            </Button>
                            <Button onClick={onDelClick}>删除</Button>
                        </div>
                    </div>
                </div>

                <TableList loading={loading} onChange={onTableChange} onSelectChange={onSelectChange} dataSource={dataSource} total={total}></TableList>
            </Spin>
        </Modal>
    );
};

export default ParsingModal;
