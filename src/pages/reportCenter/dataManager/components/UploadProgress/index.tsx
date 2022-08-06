/*
 * @Descripttion: 进度条
 * @version:
 * @Author: yezi
 * @Date: 2021-04-22 16:26:25
 * @LastEditTime: 2021-08-16 13:36:59
 */

import React, { useState } from 'react';
import type { FC } from 'react';
import { Upload, Modal } from 'antd';
import Progress from './Progress';
import axios from 'axios';
import { getToken } from '@/utils/utils';
import lodash from 'lodash';

const maxNum = 3;

let queueFileList = [];

let uploadDone = false;

const MAX_FILE_SIZE = 1024 * 1024 * 100;

const UploadProgress: FC<any> = (props) => {
    const { uploadProps, params, url, children, onSuccess } = props;
    // const [queue, setQueue] = useState<any[]>([]);                                                    // 上传的队列
    const [uploadingQueue, setUploadingQueue] = useState<any[]>([]);                                  // 上传的队列
    const [progress, setProgress] = useState<any[]>([]);                                              // 进度条列表
    const [flag, setFlag] = useState<boolean>(false);                                                 // 进度模态框


    let uploadQueue;

    const onCancel = () => {
        setFlag(false);
        setUploadingQueue([]);
        setProgress([]);
        queueFileList = [];
        uploadDone = false;
        props.callbackCancel();
    };

    const callback = (file) => {
        let arr = [];
        if (uploadingQueue.length > 0) {
            uploadingQueue.map((item) => {
                if (item.uid !== file.uid) {
                    arr.push(item);
                }
            });
        }

        // return arr;
        uploadQueue(queueFileList, arr);
    };

    uploadQueue = (queue, uploadingQueue) => {

        console.log(queue, 'queue------------------');
        console.log(uploadingQueue, 'uploadingQueue------------------');
        let processing = [];
        if (uploadingQueue.length < maxNum && queue.length > 0) {
            if (queue.length > maxNum) {
                processing = queue.splice(0, maxNum - uploadingQueue.length);
            } else {
                processing = [...queue];
                queue = [];
            }
        }

        processing.map((item) => {
            progress.push(<Progress key={item.uid} file={item} params={params} callback={callback} url={url} />);
        });

        queueFileList = queue;
        setUploadingQueue(processing);
        setProgress(progress);
        if (processing.length === 0 && !uploadDone) {
            props.callback({ status: 'success', message: '上传成功' });
            uploadDone = true;
            setProgress([]);
            setFlag(false)
        }
    };


    /**
     * @description 文件上传
     */
    const doUpload = (file, fileList) => {
        let moreMaxSize = false;
        if (Array.isArray(fileList)) {
            fileList.map((item) => {
                console.log(item, 'item');
                if (item.size > MAX_FILE_SIZE) {
                    moreMaxSize = true;
                }
            });
            console.log(moreMaxSize, 'moreMaxSize');
            if (moreMaxSize) {
                onCancel();
                props.callback({ status: 'error', message: '请上传小于100M的文件' });
            } else {
                uploadQueue(fileList, uploadingQueue);
                setFlag(true);
            }
        }
    };


    const upload_debounce = lodash.debounce(doUpload, 100);

    return (
        <>
            <Upload
                customRequest={true}
                fileList={[]}
                beforeUpload={upload_debounce}
                {...uploadProps}
            >
                {children}
            </Upload>
            <Modal
                title="文件上传"
                visible={flag}
                footer={null}
                width={600}
                onCancel={onCancel}
            // style={{ height: 350 }}
            >
                <div style={{ minHeight: 300, maxHeight: 400, overflow: 'auto' }}>
                    {progress.map((item) => item)}
                </div>
            </Modal>
        </>

    );
};


export default UploadProgress;
