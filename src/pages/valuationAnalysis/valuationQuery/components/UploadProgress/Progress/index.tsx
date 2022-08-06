/*
 * @Descripttion: 进度条
 * @version:
 * @Author: yezi
 * @Date: 2021-04-22 16:26:25
 * @LastEditTime: 2021-04-26 18:06:56
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Progress,Modal,Table, message } from 'antd';
import axios from 'axios';
import request from '@/utils/restReport';
import { getCookie } from '@/utils/utils';
import _styles from './styles.less';

enum Status {
    Normal = "normal",
    Active = "active",
    Exception = "exception",
    Success = "success"
}

const ProgressBar: FC<any> = (props) => {
    const { params, file, callback,callbackFail,callbackSuccessMsg, url, key } = props;
    const [percent, setPercent] = useState<number>(0);
    const [status, setStatus] = useState<Status>(Status.Normal);
    const [visibleObj, setvisibleObj] = useState<object>({});
    const [dataSourceObj, setdataSourceObj] = useState<object>({});
    
    const columns = [
        {
            title: '文件名称',
            dataIndex: 'fundName',
            align: 'center'
        },
        {
            title: '估值表日期',
            dataIndex: 'valuationDate',
            align: 'center'
        },
    ]

    // console.log(params, 'params', file);

    const onUploadProgress = (res) => {
        setPercent(+((res.loaded / res.total) * 100).toFixed(2));
    };

    /**
     * @description 文件上传
     */
    const doUpload = async () => {

        const formData = new window.FormData();
        if (params) {
            for (let key in params) {
                formData.append(key, params[key]);
            }
        }
        formData.append('valuationTableFile', file);
        if (file.webkitRelativePath) {
            let pathArr = file.webkitRelativePath.split('/');
            pathArr.pop();
            formData.append('pathUrl', pathArr.join('/'));
        }
        let res = await request.postMultipart(url, formData, { onUploadProgress: onUploadProgress },{
            'companyCode':getCookie('companyCode'),
            dataSource:'simu'
        });
        console.log(res,'res')

        const {code,data} = res
        if (+data.code === 1001) {
            setStatus(Status.Success);
            callback(file);
            callbackSuccessMsg(data.data)
        } else {
            setStatus(Status.Exception);
            callbackFail(data.data)
        }
    };

    const onCancel =()=>{
        visibleObj[key] = false
        setvisibleObj({...visibleObj})
    }

    // 覆盖上传
    const onOk =async ()=>{
        const formData = new window.FormData();
        if (params) {
            for (let key in params) {
                formData.append(key, params[key]);
            }
        }
        formData.append('valuationTableFiles', file);
        if (file.webkitRelativePath) {
            let pathArr = file.webkitRelativePath.split('/');
            pathArr.pop();
            formData.append('pathUrl', pathArr.join('/'));
        }
        const res = await request.postMultipart('/mvt/valuationTableImport/coverValuationTable', formData, { onUploadProgress: onUploadProgress },{
            'companyCode':getCookie('companyCode')
        });
        const {code} = res.data
        if (+code === 1001) {
            setStatus(Status.Success);
            callback(file);
        }
        visibleObj[key] = false
        setvisibleObj({...visibleObj})
    }

    useEffect(() => { doUpload(); }, []);

    return (
        <div>
        <div className={_styles.progressWarp}>
            <Progress percent={percent} status={status} />
            <p>{file.webkitRelativePath ? file.webkitRelativePath : file.name}</p>
        </div>

        <Modal
        title="提示"
        okText="覆盖"
        visible={visibleObj[key]}
        onCancel={onCancel}
        onOk={onOk}
        >
            文件已存在，请选择是否覆盖原文件？
            <br/>原文件内容：
            <Table columns={columns} dataSource={dataSourceObj[key]} />
        </Modal>
        </div>
    );
};


export default ProgressBar;
