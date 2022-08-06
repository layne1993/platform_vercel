import { Link } from 'umi';
import { Result, Button, Modal } from 'antd';
import { clearCookie } from '@/utils/utils';
import { WarningOutlined } from '@ant-design/icons';
import React from 'react';

const clearInfo = ()=>{
    clearCookie();
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = `//${window.location.host}${BASE_PATH.baseUrl}user/login`;
};

export default () => (
    <Modal
        visible
        width={400}
        closable={false}
        footer={<Button onClick={clearInfo} type="primary" >确定</Button>}
    >
        <div style={{
            margin:'0 auto',
            textAlign:'center'
        }}
        >
            <WarningOutlined style={{ fontSize: '46px', color: '#08c' }}/>
            <p style={{marginTop:'20px',fontSize:16}}>登录状态已失效,请重新登录！</p>
        </div>
        {/* <Result
            status="warning"
            title="登录状态已失效,请重新登录"
        /> */}
    </Modal>
);
