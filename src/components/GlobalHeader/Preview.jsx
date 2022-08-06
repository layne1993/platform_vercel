import { Button, Modal } from 'antd';
// import { QuestionCircleOutlined } from '@ant-design/icons';
import QrCode from 'qrcode.react';
import React, { useState } from 'react';
import { connect } from 'umi';

// import HeaderSearch from '../HeaderSearch';
// import SelectLang from '../SelectLang';
import styles from './index.less';

// const ENVTagColor = {
//   dev: 'orange',
//   test: 'green',
//   pre: '#87d068',
// };
{
    /* <QrCode
id="qrCode"
value={`${previewUrl}?${time}`}
size={200} // 二维码的大小
fgColor="#000000" // 二维码的颜色
style={{ margin: 'auto' }}
/> */
}

const Preview = (props) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [investor, setInvestor] = useState('');
    const URL = window.location.href;
    const {dispatch} = props;
    if(isModalVisible){
        dispatch({
            type: 'global/getCompanyUid',
            callback: (res) => {
                if (res.code === 1008) {
                    console.log(document.domain)
                    if(document.domain === 'localhost'){
                        setInvestor(`https://vipdevfunds.simu800.com/vipmobile/login?companyCode=${res.data}`);
                    }else{
                        setInvestor(`https://${document.domain}/vipmobile/login?companyCode=${res.data}`);
                    }
                }
            }
        });
    }

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    return (
        <div>
            <Modal
                title={<h4 style={{fontWeight:700, textAlign:'center'}}>手机微信扫描查看投资者端页面</h4>}
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                centered
                footer={null}
                width={400}
                maskClosable={false}
            >
                <div style={{ height: 440, display: 'flex', flexDirection:'column' }}>
                    <QrCode
                        id="qrCode"
                        value={investor}
                        size={300} // 二维码的大小
                        fgColor="#000000" // 二维码的颜色
                        style={{ margin: 'auto' }}
                    />
                    <a style={{margin:'0 26px'}} href={investor} target="_blank" rel="noopener noreferrer">{investor}</a>
                </div>
            </Modal>
            <Button type="primary" onClick={showModal}>
                投资者端地址
            </Button>
        </div>
    );
};

// export default Preview;

// export default connect(({ settings }) => ({
//   theme: settings.navTheme,
//   layout: settings.layout,
// }))(GlobalHeaderRight);

export default connect(({ global }) => ({
}))(Preview);
