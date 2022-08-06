import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

import lodash from 'lodash';

interface propsTs {
  type?: any;
  multiple?: any;
  onsuccess?: any;
  showUploadListFlag?: any;
  url?:string,
  customRequest?:any,
  maxNum?:number,
  fileType?:array
}

const MAX_FILE_SIZE = 1024 * 1024 * 100;

const UploadFile: React.FC<propsTs> = props => {
  const { onsuccess, type, multiple, showUploadListFlag,url, customRequest ,maxNum,fileType} = props;

  const [filelists, setfilelists] = useState<array>([]); 

  /**
     * @description 文件上传
     */
 const doUpload = (file, fileList) => {
  let moreMaxSize = false;
  let fileTypeFlag = false

  // 判断文件数量
  if(filelists>maxNum){
    message.warning(`文件最多上传${maxNum}个`)
    return
  }

  if (Array.isArray(fileList)) {
      fileList.map((item) => {
          if (item.size > MAX_FILE_SIZE) {
              moreMaxSize = true;
          }

         const nameArr = item.name.split('.')
         const fileTypeT = nameArr[nameArr.length-1]
         if(!fileType.includes(fileTypeT)){
            fileTypeFlag = true
         }
      });

      if (moreMaxSize) {
        message.warning('请上传小于100M的文件')
        return false 
      }
      if(fileTypeFlag){
        message.warning(`请上传${fileType.join(',')}文件`)
        return false 
      }

      filelists.push(...fileList)
      setfilelists(filelists)
      maxNum===1 ? customRequest(filelists[0]) : customRequest(filelists)
      
    }
  };

  const upload_debounce = lodash.debounce(doUpload, 100);

  const handleUpload = (options: any) => {
  };

  const onRemove = (file: any) => {
    let indexUid = 0
    const { uid, url } = file;
    const fileArr = []
    filelists?.forEach((item,index) => {
      if(item.uid !== uid) fileArr.push(item)
      if(item.uid === uid) indexUid = index
    });
    setfilelists(fileArr)
    // removeFile && removeFile(url,indexUid);
    maxNum===1 ? customRequest(fileArr[0]) : customRequest(fileArr)
  };

  const uoloadprops = {
    name: 'file',
    multiple: multiple || false,
    // action: `${window.location.origin}${url}`,
    headers: {},
    showUploadList: showUploadListFlag,
    beforeUpload:upload_debounce,
    customRequest:handleUpload,
    onRemove:onRemove,
    fileList:filelists
  };

  useEffect(()=>{
    setfilelists([])
  },[])

  return (
    <div>
      <Upload {...uoloadprops}>
        <Button icon={<UploadOutlined />} type={type}>
          上传附件
        </Button>
      </Upload>
    </div>
  );
};
export default UploadFile;
