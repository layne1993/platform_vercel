import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';

class SMSModal extends PureComponent {
    // static defaultProps = {
    //   handleModalVisible: () => {},
    // };

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    renderFooter = () => {
        const { handleModalVisible } = this.props;
        return [
            <div key="smsCancel" style={{width: '100%', textAlign: 'center' }}>
                <Button type="primary" onClick={() => handleModalVisible(false)}>
            确定
                </Button>
            </div>
        ];
    };

    render() {
        const { modalVisible, top, handleModalVisible } = this.props;

        return (
            <Modal
                width={520}
                style={{ top }}
                bodyStyle={{ padding: '12px 15px 0px' }}
                destroyOnClose
                title="短信样例"
                visible={modalVisible}
                footer={this.renderFooter()}
                onCancel={() => handleModalVisible(false)}
            >
                <h4>样例一（净值更新提醒）：</h4>
                <p>Some contents...</p>
                <h4>样例二（产品公告提醒）：</h4>
                <p>Some contents...</p>
            </Modal>
        );
    }
}

export default SMSModal;