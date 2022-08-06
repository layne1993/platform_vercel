import { uploadEmailAttachment } from '../service';
import { getCookie } from '@/utils/utils';

const OSS = require('ali-oss');

export async function multipartUpload(param) {
    // console.log('param', param)
    const { id, file } = param;
    const { name, type } = file;
    const fileSuffix = (name.substr(name.lastIndexOf('.') + 1)).toLowerCase();
    // const source ='10'
    const formData = new FormData();
    formData.append('file', file);
    formData.append('source', 10);
    formData.append('sourceId', 0);
    formData.append('codeType', 124);
    uploadEmailAttachment(formData);
    // const pdfOriginOssKey = `http://filedev.simu800.com/tsign/${getCookie('companyCode')}/file/${id}/${name}`;
    uploadEmailAttachment({fileType: type, fileSuffix }).then((response) => {
        // 上传文件
        if (response.code !== 1008) {
            // 上传发生错误时调用param.error
            param.error({
                msg: '上传失败，请稍后重试！'
            });
            return;
        }
        const stsData = response.data;
        // const fileKey = stsData.FileKey;
        const fileKey = `braftEditor/${getCookie('companyCode')}/file/${id}.${fileSuffix}`;
        const ossOrigin = stsData.FileOssUrl.substring(0, stsData.FileOssUrl.lastIndexOf('/') + 1);
        //  等保问题
        let urlRequest = stsData.Endpoint;
        if(window.location.protocol==='https:'){
            urlRequest = urlRequest.replace('http', 'https');
        }
        const client = new OSS({
            accessKeyId: stsData.AccessKeyId,
            accessKeySecret: stsData.AccessKeySecret,
            stsToken: stsData.SecurityToken,
            endpoint: urlRequest,
            bucket: stsData.BucketName
        });
        client.multipartUpload(fileKey, file, {
            progress (percentage) {
                // 上传进度发生变化时调用param.progress
                param.progress(Math.round(percentage*100));
                return  (done) => {
                    done();
                };
            }
        }).then((result) => {
            const { res } = result;
            if(res.statusCode===200) {
                // 上传成功
                // const reqFileUrl = result.res.requestUrls[0].split("?")[0];
                let resData = {};
                const fileUrl = ossOrigin + fileKey;
                if(param.uploadType==='file') {
                    resData = {
                        uid: id,
                        name,
                        status: 'done',
                        url: fileUrl
                    };
                    let fileList = localStorage.getItem('braftEditorFileItems');
                    fileList = fileList ? JSON.parse(fileList) : [];
                    fileList.push(resData);
                    localStorage.setItem('braftEditorFileItems', JSON.stringify(fileList));
                } else {
                    resData = {
                        url: fileUrl,
                        meta: {
                            id,
                            title: name,
                            alt: name,
                            loop: true, // 指定音视频是否循环播放
                            autoPlay: false, // 指定音视频是否自动播放
                            controls: true // 指定音视频是否显示控制栏
                            // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                        }
                    };
                    let mediaItems = localStorage.getItem('braftEditorMediaItems');
                    mediaItems = mediaItems ? JSON.parse(mediaItems) : [];
                    mediaItems.push({
                        id,
                        type: type.split('/')[0].toUpperCase(),
                        url: fileUrl
                    });
                    localStorage.setItem('braftEditorMediaItems', JSON.stringify(mediaItems));
                }
                // 上传成功后调用param.success并传入上传后的文件地址
                param.success(resData);
            }
        });
    });
}
