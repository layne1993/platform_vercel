/*
 * @Author: your name
 * @Date: 2021-06-24 10:06:57
 * @LastEditTime: 2022-01-05 09:46:34
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vip-manager\config\proxy.js
 */

export default {
    dev: {
        '/vip-manager': {
            // target: 'http://fuck.cn.utools.club/',
            // target: 'https://wuhdevfunds.simu800.com:8090/', // 武汉测试地址
            // target: 'https://dev.meix.com/',
            target: 'https://vipsitfunds.simu800.com/',
            // target: 'https://wuhdevfunds.simu800.com:8090/',
            // target: 'http://172.16.10.101:9037',
            // target: 'http://n6w1af4.nat.ipyingshe.com',
            // target: 'http://mock.simu800.com/mock/146/',
            // target :'http://192.168.10.160:9037',
            // target :'http://n6w1af4.nat.ipyingshe.com/', // 骏骏测试地址
            // n6w1af4.nat.ipyingshe.comhttp://n6w1af4.nat.ipyingshe.com/
            changeOrigin: true,
            pathRewrite: {
                //  '^/xw-manager': '',
                '^/': '',
                // '^/vip-manager': '',
            },
        },
    },
    vip: {
        '/vip-manager': {
            //   target: 'http://fuck.cn.utools.club/',
            target: 'https://vipfunds.simu800.com/',
            // target: 'https://dev.meix.com/',
            // target: 'http://mock.simu800.com/mock/146/',
            changeOrigin: true,
            pathRewrite: {
                // '^/vip-manager': '',
                '^/': '',
            },
        },
    },
};
