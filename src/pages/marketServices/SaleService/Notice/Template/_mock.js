/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2021-01-14 16:13:22
 * @LastEditTime: 2021-01-18 13:56:18
 */
const resJson = (data) => ({
    code: 1008,
    data
});
const info = {
    'marketingServiceCode': 0,
    'isUseWechat': 1,
    'isUseMessage': 1,
    'isUseEmail': 1,
    'customerList': [
        { 'customerCode': 1231231112,
            'customerName': '张彦劼'
        }, {
            'customerCode': 1231231113,
            'customerName': '李晓明'
        }
    ],
    'marketingServiceName': '这是一个通知标签',
    'noticeType': 2,
    'noticeTime': '2020-03-12 11:00:00',
    'wechatServiceJson': {
        'otherWechatList': [{
            'nickName': 'AAA',
            'weixinID': 'asdqweq'
        }, {
            'nickName': 'BBBB',
            'weixinID': 'asdqwdaseq'
        }],
        'subject': '你好你好',
        'content': '你真的很好',
        'url': 'http://www.baidu.com'
    },
    'messageServiceJson': {
        'otherMobile': '13333333333,112222222222,131231313213',
        'content': '你好你好'
    },
    'emailServiceJson': {
        'otherEmail': '123@qq.com,223@qq.com,333@qq.com,444@qq.com',
        'subject': '你好你好',
        'content': '你真的很好'
    }
};

export default {
    'POST  /api/getMarketingServiceInfo': (req, res) => {
        setTimeout(() => res.send(resJson(info)), 1000);
    }
};
