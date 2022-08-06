import React from 'react';
import { Redirect, connect } from 'umi';
// import { stringify } from 'querystring';
import md5 from 'js-md5';
import CryptoJS from 'crypto-js';
import { notification } from 'antd';
import { setAuthority } from '@/utils/authority';
import {Modal} from 'antd';
import {
    getToken,
    getQueryString,
    setCookie,
    menuAuthTransform,
    authTransform
} from '@/utils/utils';

window.addEventListener(
    'popstate',
    function (e) {
        document.title = '财富管理中心';
    },
    false,
);

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        top: 165,
        message,
        description,
        placement,
        duration: duration || 3
    });
};

class SecurityLayout extends React.Component {
    state = {
        accountList:[],
        modalVisible:false
    };


    componentDidMount() {
        // const key = CryptoJS.enc.Utf8.parse('0123456789abcdef'); //十六位十六进制数作为密钥
        // const iv = CryptoJS.enc.Utf8.parse('0123456789abcdef'); //十六位十六进制数作为密钥偏移量

        // // Encrypt(msg) {
        // let srcs = CryptoJS.enc.Utf8.parse('{"username":"admin@meix.com","password":"Admin123456","companyCode":"2251"}');
        // let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        // encrypted.ciphertext.toString().toUpperCase();

        // console.log(encrypted.ciphertext.toString().toUpperCase())


        //   const secret = getQueryString('secret');
        //   console.log(secret)
        //   if(secret){
        //       console.log(this.Decrypt(secret));
        //   }
    }

    //解密方法
    Decrypt = (msg) => {
        const key = CryptoJS.enc.Utf8.parse('0123456789abcdef'); //十六位十六进制数作为密钥
        const iv = CryptoJS.enc.Utf8.parse('0123456789abcdef'); //十六位十六进制数作为密钥偏移量
        let encryptedHexStr = CryptoJS.enc.Hex.parse(msg);
        let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        let decrypt = CryptoJS.AES.decrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        const param = decryptedStr.toString();
        if(param){
            this.doLogin(JSON.parse(param), { fromWebsite: true });
        }
        // console.log(param)

    };

    // options.fromWebsite 该字段判断，是否从官网过来的登录信息
    // 如果是官网的登录信息，密码本来就是密文，不用再次加密
    doLogin = (param, options = {}) => {
        const { dispatch } = this.props;
        for (let key in param) {
            param[key] = (typeof param[key] === 'string' && param[key].trim()) || param[key];
        }
        const { username, password, companyCode } = param
        dispatch({
            type: 'LOGIN/login',
            payload: {
                email: username,
                password: password && (options.fromWebsite ? password : md5(password)),
                companyCode: companyCode,
                loginType: 1
            },
            callback: (res) => {
                if (res.code === 1008) {
                    // console.log(res, 'ggg');
                    let {
                        token,
                        account,
                        userName,
                        companyCode,
                        managerUserId,
                        email,
                        companyName,
                        menuAuths = []
                    } = res.data || {};
                    // eslint-disable-next-line no-undef
                    sessionStorage.setItem('tokenId', token);
                    setCookie('vipAdminToken', token);
                    setCookie('account', account);
                    setCookie('userName', userName);
                    setCookie('companyCode', companyCode);
                    setCookie('managerUserId', managerUserId);
                    setCookie('email', email);
                    setCookie('companyName', companyName);
                    // eslint-disable-next-line no-undef
                    localStorage.setItem('email', email);
                    // eslint-disable-next-line no-undef
                    let permissionList = {};
                    menuAuths.map((item) => {
                        permissionList[item.menuCode] = authTransform(item);
                    });
                    let menuList = menuAuthTransform(menuAuths);
                    setAuthority(menuList);
                    // eslint-disable-next-line no-undef
                    sessionStorage.setItem('PERMISSION', JSON.stringify(permissionList));
                    location.reload()

                } else {
                    let msg = res.message || '账号或密码错误';
                    openNotification('warning', '提示', msg, 'topRight');
                    window.location.href = '/user'
                }
            }
        });
    };


    render() {
        //   const { isReady } = this.state;
        const { children } = this.props; // You can replace it to your authentication rule (such as check token exists)
        // 你可以把它替换成你自己的登录认证规则（比如判断 token 是否存在）
        const isLogin = getToken();

        // const isLogin = true;
        const secret = getQueryString('secret');

        if (secret && Boolean(!isLogin)) {
            this.Decrypt(secret);
            return null;
        } else {
            if (!isLogin) {
                return <Redirect to="/user" />;
            }

        }
        return children;
    }
}

export default connect(({ user }) => ({
    currentUser: user.currentUser
    // loading: loading.models.user,
}))(SecurityLayout);
