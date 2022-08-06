const advancedOperation1 = [
    {
        key: 'op1',
        type: '订购关系生效',
        name: '曲丽丽',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '-'
    },
    {
        key: 'op2',
        type: '财务复审',
        name: '付小小',
        status: 'reject',
        updatedAt: '2017-10-03  19:23:12',
        memo: '不通过原因'
    },
    {
        key: 'op3',
        type: '部门初审',
        name: '周毛毛',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '-'
    },
    {
        key: 'op4',
        type: '提交订单',
        name: '林东东',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '很棒'
    },
    {
        key: 'op5',
        type: '创建订单',
        name: '汗牙牙',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '-'
    }
];
const advancedOperation2 = [
    {
        key: 'op1',
        type: '订购关系生效',
        name: '曲丽丽',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '-'
    }
];
const advancedOperation3 = [
    {
        key: 'op1',
        type: '创建订单',
        name: '汗牙牙',
        status: 'agree',
        updatedAt: '2017-10-03  19:23:12',
        memo: '-'
    }
];
const getProfileAdvancedData = {
    advancedOperation1,
    advancedOperation2,
    advancedOperation3
};
function getList(req, res, u, b) {
    let url = u;

    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        // eslint-disable-next-line prefer-destructuring
        url = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;
    const dataList = [];
    for (let i = 0; i < 120; i += 1) {
        dataList.push({
            displayNo: i,
            productCode: (i + 5),
            productFullName: (`产品全称${i}`),
            productAbbreviation: (`产品全称${i}`),
            placementStatus: Math.floor(Math.random() * 10) % 4,
            riskLevel: Math.floor(Math.random() * 10) % 4,
            publicState: Math.floor(Math.random() * 10) % 4,
            openingPeriod: (`开放期描述${i}`),
            nextOpeningPeriod: new Date(`2020-04-${Math.floor(Math.random() * 30) + 1}`),
            customers: Math.floor(Math.random() * 10) % 4,
            agreements: Math.floor(Math.random() * 10) % 4,
            deletedState: Math.floor(Math.random() * 10) % 4,
            OnShelfStatus: Math.floor(Math.random() * 10) % 4
        });
    }

    const result = {
        code: 1008,
        data: dataList
        // list: dataList,
        // pagination: {
        //   total: dataList.length,
        // },
    };
    return res.json(result);
}
function listData(req, res, u, b) {
    let url = u;

    if (!url || Object.prototype.toString.call(url) !== '[object String]') {
        // eslint-disable-next-line prefer-destructuring
        url = req.url;
    }

    const body = (b && b.body) || req.body;
    const { method, name, desc, key } = body;
    const dataList = [];
    for (let i = 0; i < 120; i += 1) {
        dataList.push({
            id: i,
            customerName: '张三',
            customerCategory: 1,
            ZCInvestorsType: 1,
            nameStatus: 1,
            riskLevel: 1,
            customerPrincipal: 1,
            totalAmount: Math.floor(Math.random() * 10 + 1) * 1000
            // productCode: (i+5),
            // productFullName:(`产品全称${i}`),
            // productAbbreviation:(`产品全称${i}`),
            // placementStatus: Math.floor(Math.random() * 10) % 4,
            // riskLevel: Math.floor(Math.random() * 10) % 4,
            // publicState:  Math.floor(Math.random() * 10) % 4,
            // openingPeriod:(`开放期描述${i}`),
            // nextOpeningPeriod: new Date(`2020-04-${Math.floor(Math.random() * 30) + 1}`),
            // customers: Math.floor(Math.random() * 10) % 4,
            // agreements:Math.floor(Math.random() * 10) % 4,
            // deletedState:Math.floor(Math.random() * 10) % 4,
            // OnShelfStatus: Math.floor(Math.random() * 10) % 4,
        });
    }

    const result = {
        code: 1008,
        data: dataList
        // list: dataList,
        // pagination: {
        //   total: dataList.length,
        // },
    };
    return res.json(result);
}
export default {
    'GET  /api/profile/advanced': getProfileAdvancedData,
    'POST /api/getdetailList1': getList,
    'POST /api/listData': listData
};
