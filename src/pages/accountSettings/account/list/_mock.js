function postListData(req, res, u, b) {
    let url = u;

    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
        url = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;
    const dataList = [];
    for (let i = 0; i < 23; i += 1) {
        dataList.push({
            id: `${i+1}`,
            accountName: i%2===0 ? '刘凯' : '张彦劼',
            account: i%2===0 ? `liukai${i+1}@simu800.com` : `zyj${i+1}@simu800.com`,
            XWAccountType: i%2,
            accountStatus: i%2,
            createTime: new Date(`2020-03-${Math.floor(Math.random() * 30) + 1}`).getTime(),
            updateTime: new Date(`2020-04-${Math.floor(Math.random() * 30) + 1}`).getTime()
        });
    }

    const result = {
        code: 1008,
        data: dataList
    };
    setTimeout(() => {
        return res.json(result);
    }, 2000);
}

export default {
    'POST  /api/geAccountList': postListData
};
