import React, { useEffect, useState } from 'react';
import { Modal,Upload,Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import styles from './index.less'
import {exportFile} from '@/utils/file'
import {exportFileBlob} from '@/utils/fileBlob'
import UploadOwn from '../uploapOwn';
import {
  downUploadMode
} from '../../services'

const {Dragger} = Upload

interface propsTs{
  visible:boolean,
  onCancel?:any,
  onOk?:any,
  allSuccess?:any
}

const InputPersonModal: React.FC<propsTs> = props => {
  const {visible,onCancel,allSuccess,onOk} = props

  const beforeUpload = (file, fileList) => {

  }

  const handleUpload = (options)=>{
    console.log(options,'上传的options值为')
  }

  const propsUpload = {
    action:`${BASE_PATH.adminUrl}/signConfirm/import`,
    showUploadList:false,
		beforeUpload:beforeUpload,
		customRequest:handleUpload,
 
  }
  /**
     * @description: 监听上传成功或者失败
     */
  const handleFileChange = (e) => {
     console.log(e)
    const { file } = e;
    if (file.status === 'uploading' || file.status === 'removed') {
        return;
    }
    if (file.status === 'done') {
        if (file.response.code === 1008) {
            
        } else {
           
        }
    }
};

  const downloadF =async()=>{
    // const res = await downUploadMode()
    // exportFileBlob(res,'上传模板.xls')
  }

 

  useEffect(() => {
  }, []);

  return (
    <div>
      {/* <Modal
      title="文件上传"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}>
        <Dragger 
        {...propsUpload}
        name="file"
        headers={{
          tokenId: getCookie('vipAdminToken')
         }}
         onChange={()=>handleFileChange}
         className={styles.dragBox }>
          <InboxOutlined/>
          <h3>点击选择导入文件，或直接将文件拖入此区域</h3>
          <h5>选中后请勿修改源文件, 以免上传失败</h5>
        </Dragger>

        <div  className={styles.tableBtn} onClick={downloadF}>下载模板</div>
        
      </Modal> */}
      <UploadOwn
            modalFlag={visible}
            closeModal={onCancel}
            // params={params}
            allSuccess={allSuccess}
            onOk={onCancel}
            url="/mrp_analysis/salesman/import"
        />
    </div>
  );
};

export default InputPersonModal;
