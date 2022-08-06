/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-14 13:16:42
 * @LastEditTime: 2021-10-08 14:53:43
 */
const proSettings = {
    // test
    navTheme: 'light',
    // 拂晓蓝
    primaryColor: '#3D7FFF',
    layout: 'side',
    contentWidth: 'Fluid',
    fixedHeader: true,
    fixSiderbar: true,
    colorWeak: false,
    menu: {
        locale: true,
    },
    title: '财富管理中心',
    pwa: false,
    iconfontUrl: '',
    // dev 为本地
    dev: {
        baseUrl: '/vipmanager/', //
        adminUrl: '/vip-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 2,
    },
    shjiu: {
        // 申九
        baseUrl: '/shjiumanager/', //
        adminUrl: '/shjiu-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    qingli: {
        // 青骊
        baseUrl: '/qinglimanager/', //
        adminUrl: '/qingli-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    zho: {
        baseUrl: '/zhomanager/', //
        adminUrl: '/zho-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    jk: {
        baseUrl: '/jkmanager/', //
        adminUrl: '/jk-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    mshi: {
        // 鸣石
        baseUrl: '/mshimanager/', //
        adminUrl: '/mshi-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
        NoRiskDisable: 1,
    },
    mh: {
        // 明宏
        baseUrl: '/mhmanager/', //
        adminUrl: '/mh-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 2, // 1普通 2 AI
        },
        isSaas: 1,
    },
    hd: {
        // 鸿道
        baseUrl: '/hdmanager/', //
        adminUrl: '/hd-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 0, // 1普通 2 AI  // 无双录
        },
        isSaas: 1,
        // qiankunURL: '//testfunds.suncapital.com.cn:8000/vipstaggingmanager/'
        qiankunURL: '//hdfunds.suncapital.com.cn:8000/vipstaggingmanager/',
    },
    xw: {
        // 鸣石
        baseUrl: '/xwmanager/', //
        adminUrl: '/xw-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    ly: {
        // 林园投资
        baseUrl: '/lymanager/', //
        adminUrl: '/ly-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    jhl: {
        // 进化论
        baseUrl: '/jhlmanager/', //
        adminUrl: '/jhl-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        config: {
            CustomerStatus: '客户状态',
        },
        isSaas: 1,
    },
    vip: {
        // vip
        baseUrl: '/vipmanager/', //
        adminUrl: '/vip-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 2, // 1普通 2 AI
        },
        isSaas: 2,
    },
    vipsit: {
        // vip
        baseUrl: '/sitvipmanager/', //
        adminUrl: '/vip-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 2, // 1普通 2 AI
        },
        isSaas: 2,
    },
    prod: {
        baseUrl: '/xwmanager',
        adminUrl: '/simu/xw-manager',
        ASSSET_DOMIAN: 'RESOURCE_PATH',
    },
    ningq: {
        baseUrl: '/ningqmanager/', //
        adminUrl: '/ningq-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    ws: {
        baseUrl: '/wsmanager/', //
        adminUrl: '/ws-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
    fe: {
        baseUrl: '/femanager/', //
        adminUrl: '/fe-manager', // 接口最顶级路径   具体后端定,
        ASSSET_DOMIAN: 'RESOURCE_PATH',
        AI: {
            AI_type: 1, // 1普通 2 AI
        },
        isSaas: 1,
    },
};
export default proSettings;
