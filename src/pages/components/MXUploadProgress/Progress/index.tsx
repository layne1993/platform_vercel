/*
 * @Descripttion: 进度条
 * @version:
 * @Author: yezi
 * @Date: 2021-04-22 16:26:25
 * @LastEditTime: 2021-08-16 14:21:30
 */

import React, { useState, useEffect } from 'react';
import type { FC } from 'react';
import { Progress } from 'antd';
import axios from 'axios';
import request from '@/utils/rest';
import { getCookie } from '@/utils/utils';
import _styles from './styles.less';

enum Status {
    Normal = 'normal',
    Active = 'active',
    Exception = 'exception',
    Success = 'success'
}

const ProgressBar: FC<any> = (props) => {
    const { params, file, callback, url } = props;
    const [percent, setPercent] = useState<number>(0);
    const [status, setStatus] = useState<Status>(Status.Normal);

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
        formData.append('file', file);
        if (file.webkitRelativePath) {
            let pathArr = file.webkitRelativePath.split('/');
            pathArr.pop();
            formData.append('pathUrl', pathArr.join('/'));
        }
        let res = await request.postMultipart(url, formData, { onUploadProgress: onUploadProgress });
        if (res.code === 1008) {
            setStatus(Status.Success);
            callback(file);
        } else {
            setStatus(Status.Exception);
        }
    };

    useEffect(() => { doUpload(); }, []);


    return (
        <div className={_styles.progressWarp}>
            <Progress percent={percent} status={status} />
            <p>{file.webkitRelativePath ? file.webkitRelativePath : file.name}</p>
        </div>
    );
};


export default ProgressBar;
