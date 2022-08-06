import { LogoutOutlined, SettingOutlined, UserOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Modal, Button } from 'antd';
import React from 'react';
import { history, connect } from 'umi';
import HeaderDropdown from '../HeaderDropdown';
import ChangePassword from '@/pages/accountSettings/account/password';
import styles from './index.less';
import { clearCookie, getCookie } from '@/utils/utils';

class AvatarDropdown extends React.Component {
    state = {
        visible: false
    };

    handleCancel = (e) => {
        // console.log(e);
        this.setState({
            visible: false
        });
    };
    onMenuClick = (event) => {
        const { key } = event;

        if (key === 'logout') {
            const { dispatch } = this.props;
            if (dispatch) {
                dispatch({
                    type: 'LOGIN/logout',
                    callback: (res) => {
                        if (res.code === 1008) {
                            sessionStorage.removeItem('tokenId');
                            clearCookie();
                            history.replace({
                                pathname: '/user/login'
                            });
                        }
                    }
                });
            }

            return;
        }

        if (key === 'changePassword') {
            // const { dispatch } = this.props;
            this.setState({
                visible: true
            });
            // if (dispatch) {
            //     dispatch({
            //         type: 'login/logout',
            //     });
            // }

            return;
        }

        // history.push(`/account/${key}`);
    };

    render() {
        const {
            currentUser = {
                avatar: '',
                name: ''
            }
            // menu,
        } = this.props;
        const menuHeaderDropdown = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
                <Menu.Item key="changePassword">
                    <EditOutlined />
                    修改密码
                </Menu.Item>
                <Menu.Item key="logout">
                    <LogoutOutlined />
                    退出登录
                </Menu.Item>
            </Menu>
        );
        return (
            <div>
                <Modal
                    title="修改密码"
                    width={700}
                    visible={this.state.visible}
                    closable={false}
                    footer={
                        <Button type="primary" onClick={this.handleCancel}>
                            取消
                        </Button>
                    }
                // onOk={this.handleOk}
                // onCancel={this.handleCancel}
                >
                    <ChangePassword />
                </Modal>

                <HeaderDropdown overlay={menuHeaderDropdown}>
                    <span className={`${styles.action} ${styles.account}`}>
                        {/* <Avatar
                            size="small"
                            className={styles.avatar}
                            src={currentUser.avatar}
                            alt="avatar"
                        /> */}
                        <span>{getCookie('companyName')}-</span>
                        <span className={`${styles.name} anticon`}>{getCookie('userName') || 'U'}</span>
                    </span>
                </HeaderDropdown>
            </div>
        );
    }
}

export default connect(({ user }) => ({
    currentUser: user.currentUser
}))(AvatarDropdown);
