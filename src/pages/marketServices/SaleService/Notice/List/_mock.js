const resJson = (data) => ({
    code: 1008,
    data
});
const list = [{
    'companyCode': '22424',
    'marketingServiceCode': '2242422424',
    'marketingServiceName': '净值更新提醒',
    'subject': '某某产品净值更新啦',
    'totalAmount': 10,
    'noticeTime': '2020.03.04 11:00:00',
    'noticeStatus': '1',
    'openAmount': 5,
    'failAmount': 5
}, {
    'companyCode': '22424',
    'marketingServiceCode': '33333223232323',
    'marketingServiceName': '产品公告更新提醒',
    'subject': '某某产品公告更新啦',
    'totalAmount': 10,
    'noticeTime': '2020.03.04 11:00:00',
    'noticeStatus': '1',
    'openAmount': 5,
    'failAmount': 5
}];

export default {
    'POST  /api/getWechatNoticeList': (req, res) => {
        const arr = [];
        for (let index = 0; index < 100; index++) {
            const obj = {
                'companyCode': '22424',
                'marketingServiceCode': `22424${index}`,
                'marketingServiceName': index%2===0?'净值更新提醒净值更新提醒':'产品公告更新提醒产品公告更新提醒',
                'subject': index%2===0?'某某产品净值更新啦某某产品净值更新啦':'某某产品公告更新啦某某产品净值更新啦',
                'totalAmount': Math.floor(Math.random() * (100 - 10)) + 10,
                // "noticeTime": "2020.03.04 11:00:00",
                'noticeTime': new Date().getTime(),
                'noticeStatus': Math.floor(Math.random() * 3),
                'openAmount': 5,
                'failAmount': 5
            };
            arr.push(obj);
        }
        setTimeout(() => res.send(resJson(arr)), 2000);
    }
};
