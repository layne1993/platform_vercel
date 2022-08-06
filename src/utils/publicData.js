// 希瓦

// 个人证件类型
export const XWDocumentType = [
    { value: 1, label: '身份证' },
    { value: 2, label: '户口本' },
    { value: 3, label: '外国人永久居留身份证' },
    { value: 4, label: '护照' },
    { value: 5, label: '士兵证' },
    { value: 6, label: '港澳通行证' },
    { value: 7, label: '台胞证' },
    { value: 12, label: '其他' },
    { value: 14, label: '军官证' },
    { value: 15, label: '外籍护照' },
    { value: 16, label: '文职证' },
    { value: 17, label: '警官证' }
];

// 机构证件类型类型
export const XWcertificateType = [
    { value: 8, label: '营业执照' },
    { value: 9, label: '组织机构代码证' },
    { value: 10, label: '基金会' },
    { value: 11, label: '行政机关' },
    { value: 12, label: '其它' },
    { value: 13, label: '产品备案编号/登记证书' },
    { value: 18, label: '社会团体' },
    { value: 19, label: '军队' },
    { value: 20, label: '武警' },
    { value: 21, label: '下属机构' },
    { value: 22, label: '批文' }
];

// 产品证件类型
export const PRODUCT_CARD = [
    { value: 8, label: '营业执照' },
    { value: 13, label: '产品备案编号/登记证书' },
    { value: 22, label: '批文' },
    { value: 12, label: '其他' }
];

// 证件类型
export const XWCertificatesType = [
    { value: 1, label: '身份证' },
    { value: 2, label: '户口本' },
    { value: 3, label: '外国人永久居留身份证' },
    { value: 4, label: '护照' },
    { value: 5, label: '士兵证' },
    { value: 6, label: '港澳通行证' },
    { value: 7, label: '台胞证' },
    { value: 8, label: '营业执照' },
    { value: 9, label: '组织机构代码证' },
    { value: 10, label: '基金会' },
    { value: 11, label: '行政机关' },
    { value: 12, label: '其它' },
    { value: 13, label: '产品备案编号/登记证书' },
    { value: 14, label: '军官证' },
    { value: 15, label: '外籍护照' },
    { value: 16, label: '文职证' },
    { value: 17, label: '警官证' },
    { value: 18, label: '社会团体' },
    { value: 19, label: '军队' },
    { value: 20, label: '武警' },
    { value: 21, label: '下属机构' },
    { value: 22, label: '批文' }
];

// 客户风险等级
export const XWnumriskLevel = [
    { value: 1, label: 'C1' },
    { value: 2, label: 'C2' },
    { value: 3, label: 'C3' },
    { value: 4, label: 'C4' },
    { value: 5, label: 'C5' }
];

// 客户类别
export const XWcustomerCategoryOptions = [
    {
        value: 1,
        label: '自然人客户'
    },
    {
        value: 2,
        label: '机构客户'
    },
    {
        value: 3,
        label: '产品客户'
    }
];

// 分页方法
export const paginationPropsback = (total, current) => ({
    showSizeChanger: true,
    showQuickJumper: true,
    total,
    current: current || 1,
    showTotal: (_, range) => `共 ${total} 条记录 第${range[0]} - ${range[1]} 条`,
    defaultPageSize: 20,
    pageSizeOptions: ['10', '20', '50', '100', '200', '300', '400', '500', '1000', '999999']
});

// 投资者类型
export const XWInvestorsType = [
    { value: 2, label: '专业投资者' }, // 当前只有自然人
    { value: 1, label: '普通投资者' },
    { value: 3, label: '特殊合格投资者' }
];

// 实名状态
export const XWnameStatus = [
    { value: 0, label: '未实名' },
    { value: 1, label: '已实名' },
    { value: 2, label: '实名中' },
    { value: 3, label: '待审核' },
    { value: 4, label: '审核不通过' }
];

// 审核状态
export const XWAuditStatus = [
    { value: 2, label: '审核失败' },
    { value: 0, label: '未审核' },
    { value: 1, label: '审核通过' }
];

export const XWIdentification = [
    { value: 0, label: '待认定' },
    { value: 1, label: '线上' },
    { value: 2, label: '线下' }
];

// 性别
export const XWGender = [
    { value: '男', label: '男' },
    { value: '女', label: '女' }
];



// 产品状态
export const XWFundStatus = [
    { value: 1, label: '首发募集' },
    { value: 2, label: '募集中' },
    { value: 3, label: '存续中' },
    { value: 4, label: '封闭期' },
    { value: 5, label: '已结束' },
    { value: 6, label: '清盘' }
];

// 问卷来源
export const ORGIN_FROM = [
    { value: 1, label: '线上' },
    { value: 2, label: '线下' }
];

// 产品状态颜色
export const XWFundStatusBadgeList = ['green', 'blue', 'volcano', 'gold', 'purple', 'cyan'];

//  交易类型
export const XWTransactionType = [
    { value: 1, label: '首次购买' },
    { value: 2, label: '追加申购' },
    { value: 3, label: '赎回' },
    { value: 4, label: '强制调增' },
    { value: 5, label: '强制调减' },
    { value: 6, label: '非交易过户转出' },
    { value: 7, label: '非交易过户转入' },
    { value: 8, label: '产品成立' },
    { value: 9, label: '业绩提成返还' },
    { value: 10, label: '业绩提成' }
];

//  合格投资者状态
export const XWQFIIStatus = [
    {
        label: '认定成功',
        value: 4
    },
    {
        label: '认定失败',
        value: 3
    },
    {
        label: '认定中',
        value: 2
    },
    {
        label: '未认定',
        value: 1
    }
];

// 产品策略
export const XWStrategyFund = [
    { value: 1, label: '专项产品' },
    { value: 2, label: '定向组合产品' },
    { value: 3, label: '标准组合产品' },
    { value: 4, label: '多项目组合产品' }
];

// 文件权限
export const XWFileAuthority = [
    { value: 1, label: '风险匹配可见' },
    { value: 2, label: '合格投资者可见' },
    { value: 3, label: '仅持有人可见' },
    { value: 4, label: '所有人可见' }
];

// 用印位置 下拉
export const StampLocationEnumeration= [
    { value: 1, label: '首页' },
    { value: 2, label: '最后一页' },
    { value: 3, label: '第一个匹配页' },
    { value: 4, label: '每个匹配页' },
    { value: 5, label: '最后一个匹配页' }
];

// 签约状态
export const XWSigningstatus = [
    {
        label: '签约完成',
        value: 2
    },
    {
        label: '签约中',
        value: 1
    }
    // {
    //     label: '已预约',
    //     value: 0
    // }
];

//  账号状态 || 客户等级
export const XWCustomerLevel = [
    {
        label: '普通客户',
        value: 1
    },
    {
        label: '合格投资者客户',
        value: 2
    },
    {
        label: '持有客户',
        value: 3
    },
    {
        label: '历史持有客户',
        value: 4
    },
    {
        label: 'VIP客户',
        value: 5
    }
];

//  账号状态 || 客户等级
export const XWCustomerLevel2 = [
    {
        label: '普通客户',
        value: 1
    },
    {
        label: '合格投资者客户',
        value: 2
    },
    {
        label: '持有客户',
        value: 3
    },
    {
        label: '历史持有客户',
        value: 4
    },
    // {
    //     label: 'VIP客户',
    //     value: 5
    // }
];

//  账号状态
export const AccountStatus = [
    {
        label: '启用中',
        value: 0
    },
    {
        label: '暂停',
        value: 1
    }
];

// 协议类型
export const XWAgreementType = [
    { value: 1, label: '产品合同' },
    { value: 2, label: '补充协议' },
    { value: 3, label: '风险揭示书' }
];

//  账号类型
export const XWAccountType = [
    {
        label: '管理员',
        value: '0'
    },
    {
        label: '客户经理',
        value: '1'
    },
    {
        label: '投资经理',
        value: '2'
    },
    {
        label: '运营',
        value: '3'
    },
    {
        label: '项目经理',
        value: '4'
    }
];

// 资产情况
export const XWInvestorAssets = [
    { value: 0, label: '金融资产不低于500万元人民币，或者最近3年个人年均收入不低于50万元人民币' },
    { value: 1, label: '金融资产不低于300万元人民币，或者最近3年个人年均收入不低于50万元人民币' },
    { value: 2, label: '不满足上述资产情况' }
];

// 机构情况
export const XWOrganization = [
    { value: 0, label: '净资产不低于1000 万元的单位' },
    {
        value: 1,
        label:
            '符合经有关金融监管部门批准设立的金融机构，包括证券公司、期货公司、 产品管理公司及其子公司、商业银行、保险公司、信托公司、财务公司等；经行业协会备案或者登记的证券公司子公司、期货公司子公司、私募产品管理人； 或上述机构面向投资者发行的理财产品，包括但不限于证券公司资产管理产品、产品管理公司及其子公司产品、期货公司资产管理产品、银行理财产品、保险产品、信托产品、经行业协会备案的私募产品；或社会保障产品、企业年金等养老产品，慈善产品等社会公益产品，合格境外机构投资者（QFII）、人民币合格境外机构投资者（RQFII）；或同时符合下列条件的法人或者其他组织：最近 1 年末净资产不低于 2000 万元；最近 1 年末金融资产不低于 1000 万元；具有 2 年以上证券、产品、期货、黄金、外汇等投资经历。'
    },
    {
        value: 2,
        label:
            '社会保障产品、企业年金等养老产品，慈善产品等社会公益产品；依法设立并在产品业协会备案的投资计划；中国证监会规定的其他投资者。'
    }
];

// 个人资产情况
export const XWPersonalExperience = [
    { value: 0, label: '具有2年以上投资经历' },
    { value: 1, label: '以上均不满足' }
];

// 通知方式
export const XWNotificationMethod = [
    { value: 0, label: '短信' },
    { value: 1, label: '邮件' }
];

// 双录方式
export const DoubleType = [
    { value: 1, label: '人人' },
    { value: 2, label: 'AI双录' }
];

// 分红类型
export const XWDividendType = [
    {
        label: '现金分红',
        value: 1
    },
    {
        label: '红利再投',
        value: 2
    }
];

// 币种选择
export const XWCurrency = [
    {
        label: '人民币',
        value: '人民币'
    },
    {
        label: '美元',
        value: '美元'
    },
    {
        label: '港币',
        value: '港币'
    }
];

// 开放日状态
export const XWOpenDayStatus = [
    {
        label: '临时开放日',
        value: 0
    },
    {
        label: '固定开放日',
        value: 1
    }
];

// 开放日对象
export const XWOpenDayObject = [
    {
        label: '持有人',
        value: 0
    },
    {
        label: '所有人',
        value: 1
    }
];

// // 通知规则
// export const XWNotificationRules = [
//     {
//         label: '持有人',
//         value: 1
//     },
//     {
//         label: '所有人',
//         value: 2
//     }
// ]

// // 签约规则
// export const XWSigningRules = [
//     {
//         label: '持有人',
//         value: 1
//     },
//     {
//         label: '所有人',
//         value: 2
//     }
// ]

// 文件类型
export const XWFileType = [
    {
        label: '募集文件',
        value: 1
    },
    {
        label: '签约文件',
        value: 2
    },
    {
        label: '披露文件',
        value: 3
    }
];

// 发布状态

export const XWReleaseStatus = [
    {
        label: '废除中',
        value: 3
    },
    {
        label: '已废除',
        value: 2
    },
    {
        label: '已发布',
        value: 1
    },
    {
        label: '编辑中',
        value: 0
    }
];

// 模板协议类型
export const XWTemplateType = [
    { value: 1, label: '产品合同' },
    { value: 2, label: '补充协议' },
    { value: 3, label: '风险揭示书' },
    { value: 5, label: '其他' }
    // { value: 4, label: '产品说明书' }
];

// 模板发布状态
export const XWTReleaseStatus = [
    { value: 2, label: '所有' },
    { value: 1, label: '已发布' },
    { value: 0, label: '编辑中' }
];

// 模板启用状态
export const XWEnableStatus = [
    { value: 2, label: '所有' },
    { value: 1, label: '启用' },
    { value: 0, label: '未启用' }
];

//  模板删除状态
export const XWdeleteState = [
    { value: 0, label: '未删除' },
    { value: 1, label: '已删除' },
    { value: 2, label: '所有' }
];

// 比较基准
export const XWBenchmark = [
    { value: 0, label: '无' },
    { value: 1, label: '上证指数' },
    { value: 46, label: '上证50' },
    { value: 4075, label: '中小板指' },
    { value: 4978, label: '中证500' },
    { value: 11089, label: '创业板指' },
    { value: 3145, label: '沪深300' },
    { value: 39144, label: '中证1000' },
    { value: 6641, label: '中证国债' },
    { value: 11784, label: '中证50债' },
    { value: 36, label: '国债指数' },
    { value: 6455, label: '中证全债' },
    { value: 14110, label: '中证全指' },
    { value: 1001098, label: '恒生指数' },
    { value: 5392, label: '申万-房地产' },
    { value: 32624, label: '申万-通信' },
    { value: 5389, label: '申万-医药生物' },
    { value: 32619, label: '申万-机械设备' },
    { value: 14116, label: '中证全指医药' },
    { value: 8883, label: '中证工业' },
    { value: 8894, label: '中证信息' },
    { value: 9438, label: '中证内地地产' },
    { value: 19297, label: '中证可转换债券指数' },
    { value: 303968, label: '科创50' },
    { value: 51839, label: '中证新能' },
    { value: 53000, label: '工业4.0' }
];

// 预约状态
export const XWReservationStatus = [
    { value: 1, label: '开放' },
    { value: 0, label: '不开放' }
];

// 购买状态
export const XWPurchaseStatus = [
    { value: 1, label: '可认申购' },
    { value: 2, label: '可赎回' }
    // { value: 3, label: '可认申赎' },
    // { value: 4, label: '无' },
    // { value: 5, label: '已设置开放日规则', isDisabled: true }
];

// 上架状态
export const XWShelfStatus = [
    { value: 1, label: '已上架' },
    { value: 0, label: '未上架' }
];

// 产品风险等级
export const XWFundRiskLevel = [
    { value: 1, label: 'R1' },
    { value: 2, label: 'R2' },
    { value: 3, label: 'R3' },
    { value: 4, label: 'R4' },
    { value: 5, label: 'R5' }
];

// 产品权限
export const XWFundAuthority = [
    { value: 1, label: '风险匹配客户' },
    { value: 2, label: '合格投资者' },
    { value: 3, label: '持有人' },
    { value: 4, label: '所有人' }
];

// 产品是否置顶
export const XWIsFundTop = [
    { value: 1, label: '置顶' },
    { value: 0, label: '不置顶' }
];

// 产品策略
export const XWProductStrategy = [
    { value: 1, label: '专项产品' },
    { value: 2, label: '定向组合产品' },
    { value: 3, label: '标准组合产品' },
    { value: 4, label: '多项目组合产品' }
];

// 开放日启用状态
export const XWEnabledStatus = [
    { value: 1, label: '启用' },
    { value: 0, label: '不启用' }
];

// 开放日启用状态
export const XWUseStatus = [
    { value: 0, label: '有效' },
    { value: 1, label: '无效' }
];

// 预约类型
export const XWAppointmentType = [
    { value: 1, label: '首次购买' },
    { value: 2, label: '追加申购' },
    { value: 3, label: '赎回' }
];

// 预约状态
export const XWAppointmentStatus = [
    { value: 0, label: '审核中' },
    { value: 1, label: '预约成功' },
    { value: 2, label: '预约失败' }
];

// 占位符list 份额确认书使用
export const PLACEHOLDER = [
    {
        value: '文件名称',
        label: '文件名称'
    },
    {
        value: '产品名称',
        label: '产品名称'
    },
    {
        value: '客户名称',
        label: '客户名称'
    },
    {
        value: '托管机构内部产品代码',
        label: '托管机构内部产品代码'
    },
    {
        value: '日期',
        label: '日期'
    },
    {
        value: '占位',
        label: '占位'
    },
    {
        value: '【',
        label: '【'
    },
    {
        value: '】',
        label: '】'
    },
    {
        value: '-',
        label: '-'
    },
    {
        value: '_',
        label: '_'
    },
    {
        value: '（',
        label: '）'
    },
    {
        value: '：',
        label: '：'
    },
    {
        value: '{',
        label: '}'
    },
    {
        value: '，',
        label: '，'
    },
    {
        value: '、',
        label: '、'
    },
    {
        value: '。',
        label: '。'
    },
    {
        value: '客户证件号码',
        label: '客户证件号码'
    }
];

// 流水状态

export const XWFlowState = [
    { value: 0, label: '金额未确认' },
    { value: 1, label: '金额已确认,已开启冷静期' },
    { value: 2, label: '金额已确认,冷静期已结束' }
];

// 流水状态

export const XWFlowState2 = [
    { value: 0, label: '金额未确认' },
    { value: 1, label: '金额已确认' },
    { value: 2, label: '已关闭' }
];

// 托管方参与
export const XWTrusteeParticipation = [
    {
        label: '参与',
        value: 1
    },
    {
        label: '不参与',
        value: 0
    }
];

// 数据来源
export const XWSourceType = [
    { value: 1, label: '系统录入' },
    { value: 2, label: '系统录入' },
    { value: 3, label: '托管下行' },
    { value: 4, label: '自动计算' }
];

// 产品系列
export const XWProductType = [
    { value: 1, label: '系列一' },
    { value: 2, label: '系列二' },
    { value: 3, label: '系列三' },
    { value: 4, label: '系列四' },
    { value: 5, label: '系列五' },
    { value: 6, label: '系列六' },
    { value: 7, label: '系列七' }
];

// 消息提醒
export const XWMessageAlert = [
    { value: 0, label: '未发送' },
    { value: 1, label: '已发送' },
    { value: 2, label: '异常' }
];

// 消息提醒
export const XWTradeType = [
    { value: 1, label: '首次购买' },
    { value: 2, label: '追加申购' },
    { value: 3, label: '赎回' }
];

// 签约有效性
export const XWIsDelete = [
    { value: 0, label: '有效' },
    { value: 1, label: '无效' }
];

// 合格投资者有效性
export const IsDelete = [
    { value: 0, label: '未废除' },
    { value: 1, label: '已废除' }
];

export const XWOpenDayStatus1 = [
    { value: 0, label: '未启用' },
    { value: 1, label: '通知期' },
    { value: 2, label: '预约期' },
    { value: 3, label: '签约期' },
    { value: 4, label: '开放中' },
    { value: 5, label: '等待期' },
    { value: 6, label: '已结束' }
];

export const currency = [{ value: '人民币', label: '人民币' }];

// 银行卡状态
export const BANK_STATUS = [
    { value: 0, label: '冻结' },
    { value: 1, label: '有效' },
    { value: 2, label: '变更中' }
];

// 税收类型
export const STATEMENT_STATUS = [
    { value: 1, label: '仅为中国税收居民' },
    { value: 2, label: '仅为非居民' },
    { value: 3, label: '即是中国税收居民又是其他国家(地区)税收居民)' }
];



// 双录类型
export const DOUBLE_RECORD_TYPE = [
    {
        value: '1',
        label: '普通'
    },
    {
        value: '2',
        label: '智能'
    }
];

// 份额确认书模板状态
export const COMFIRMATION_TEMPLATE_STATUS = [
    {
        value: '0',
        label: '禁用中'
    },
    {
        value: '1',
        label: '启用中'
    }
];

// 认购流程
export const signSubscriptionStep = [
    {
        value: '2010',
        label: '风险告知书已确认'
    },
    {
        value: '2020',
        label: '风险揭示书已确认'
    },
    {
        value: '2030',
        label: '合同协议已确认'
    },
    {
        value: '2040',
        label: '认申购单已确认'
    },
    {
        value: '2050',
        label: '双录已完成'
    },
    {
        value: '2060',
        label: '用印已完成'
    },
    {
        value: '2070',
        label: '平台审核'
    },
    {
        value: '2080',
        label: '汇款证明已提交/打款确权'
    },
    {
        value: '2090',
        label: '冷静期结束'
    },
    {
        value: '2100',
        label: '客户回访'
    },
    {
        value: '2105',
        label: '二次审核'
    },
    {
        value: '2110',
        label: '签约完成'
    }
];

// 申购流程
export const signApplyStep = [
    {
        value: '3010',
        label: '认申购单已提交'
    },
    {
        value: '3020',
        label: '平台审核'
    },
    {
        value: '3030',
        label: '托管确权'
    },
    {
        value: '3032',
        label: '冷静期'
    },
    {
        value: '3035',
        label: '回访'
    },
    {
        value: '3037',
        label: '二次审核'
    },
    {
        value: '3040',
        label: '签约完成'
    }
];

// 赎回流程
export const redeming = [
    {
        value: '4010',
        label: '赎回申请表已提交'
    },
    {
        value: '4020',
        label: '平台审核'
    },
    {
        value: '4040',
        label: '签约完成'
    }
];

// 签约类型
export const XWsignType = [
    {
        value: '1',
        label: '是'
    },
    {
        value: '2',
        label: '否(需线下签)'
    },
    {
        value: '3',
        label: '在线赎回签约'
    }
];

// 无效来源
export const XWInvalidSource = [
    {
        value: '1',
        label: '管理人终止'
    },
    {
        value: '2',
        label: '客户终止'
    }
];

// 职业
export const PROFESSION = [
    {
        value: 1,
        label: '高级管理'
    },
    {
        value: 2,
        label: '董事长'
    },
    {
        value: 3,
        label: '行政'
    },
    {
        value: 4,
        label: '房地产'
    },
    {
        value: 5,
        label: '医生'
    },
    {
        value: 6,
        label: '教师'
    },
    {
        value: 7,
        label: '律师'
    },
    {
        value: 8,
        label: '公务员'
    },
    {
        value: 9,
        label: '科研人员'
    },
    {
        value: 10,
        label: '媒体行业'
    },
    {
        value: 11,
        label: ' IT人员'
    },
    {
        value: 12,
        label: '计算机行业'
    },
    {
        value: 13,
        label: '其他'
    }
];

// 认定进度code
export const PROGRESS_CODE = [
    { value: 1010, label: '填写基本信息完成' },
    { value: 1020, label: '专业投资者告知书已确认' },
    { value: 1030, label: '税收文件证明已提交' },
    { value: 1040, label: '证明材料已提交' },
    { value: 1050, label: '合格投资者承诺函已确认' },
    { value: 1060, label: '统一用印已完成' },
    { value: 1070, label: '管理人审核完成' },
    { value: 1080, label: '认定完成' }
];

export const emailHost = [
    {
        key: 'FGU7PBET',
        label: 'pop.exmail.qq.com-qq企业邮箱',
        value: 'pop.exmail.qq.com'
    },
    {
        key: 'T1VUZd0v',
        label: 'imap.exmail.qq.com-qq企业邮箱',
        value: 'imap.exmail.qq.com'
    },
    {
        key: 'ReXVqGWA',
        label: 'pop.126.com-126邮箱',
        value: 'pop.126.com'
    },
    {
        key: 'Nh71mRLg',
        label: 'imap.126.com-126邮箱',
        value: 'imap.126.com'
    },
    {
        key: 'orkhXBYD',
        label: 'pop.163.com-163邮箱',
        value: 'pop.163.com'
    },
    {
        key: 'Yue4ye2C',
        label: 'imap.163.com-163邮箱',
        value: 'imap.163.com'
    },
    {
        key: 'VeSefgvo',
        label: 'pop.qq.com-qq邮箱',
        value: 'pop.qq.com'
    },
    {
        key: 'CV4Q2Ng4',
        label: 'imap.qq.com-qq邮箱',
        value: 'imap.qq.com'
    },
    {
        key: 'pEUG4dIt',
        label: 'pop3.aliyun.com-阿里邮箱',
        value: 'pop3.aliyun.com'
    },
    {
        key: 'uABEPKyU',
        label: 'imap.aliyun.com-阿里邮箱',
        value: 'imap.aliyun.com'
    },
    {
        key: 'T7Ao96Xq',
        label: 'pop3.mxhichina.com-阿里邮箱',
        value: 'pop3.mxhichina.com'
    },
    {
        key: '9Cky7LNz',
        label: 'smtp.sina.net-新浪邮箱',
        value: 'smtp.sina.net'
    }
];

export const emailProtocol = [
    {
        key: 'LKMqI2RI',
        label: 'pop3',
        value: 'pop3'
    },
    {
        key: 'GAqsdFlx',
        label: 'imap',
        value: 'imap'
    },
    {
        key: 'GAqsdFf',
        label: 'smtp',
        value: 'smtp'
    }
];

export const moduleTypeData = {
    birthday: '生日祝福提醒模板',
    risk: '风险评测问卷到期提醒模板'
    // certificate: '证件到期提醒模板'
};

export const moduleCustomerTypeData = {
    1: '客户',
    0: '管理人'
};

// 营销服务模块使用
export const moduleListData = {
    customer: {
        birthday: '尊敬的#{{customerName}}, 祝您生日快乐!',
        risk:
            '尊敬的#{{customerName}}, 您的风险测评问卷将于#{{riskLimitDate}}到期, 根据私募产品业协会的要求, 请您重新测评风险问卷!',
        certificate:
            '尊敬的#{{customerName}}, 您的客户身份证件将于#{{cardValidEndTime}}到期, 请您及时更新证件!'
    },
    admin: {
        birthday: '尊敬的#{{userName}}, 您的客户#{{customerName}}的生日为#{{birthday}}, 请关注！',
        risk:
            '尊敬的#{{userName}}, 您的客户#{{customerName}}的风险评测问卷将于#{{riskLimitDate}}到期,请关注!',
        certificate:
            '尊敬的#{{userName}}, 您的客户#{{customerName}}的证件将于#{{cardValidEndTime}}到期, 请关注!'
    }
};

// 公告类型 产品模板再用
export const ANNOUNCEMENT_TYPE = [
    {
        label: '临时开放日公告',
        value: 1
    },
    {
        label: '巨额赎回公告',
        value: 2
    },
    {
        label: '产品成立公告',
        value: 3
    }
];

// 使用用章 产品模板再用
export const IS_SEAL = [
    {
        label: '是',
        value: 1
    },
    {
        label: '否',
        value: 0
    }
];

// 产品文件类型 产品模板再用
export const FILE_TYPE = [
    {
        label: '募集文件',
        value: 1
    },
    {
        label: '签约文件',
        value: 2
    },
    {
        label: '披露文件',
        value: 3
    }
];

// 产品文件权限 产品模板再用
export const FILE_PERMISSION = [
    {
        label: '风险测评客户可见',
        value: 1
    },
    {
        label: '合规投资者可见',
        value: 2
    },
    {
        label: '仅持有人可见',
        value: 3
    },
    {
        label: '所有人可见',
        value: 4
    }
];
// 信披文件类型
export const DisclosureTypeList = [
    {
        value: 1,
        label: '公告'
    },
    {
        value: 2,
        label: '周报'
    },
    {
        value: 3,
        label: '月报'
    },
    {
        value: 4,
        label: '季报'
    },
    {
        value: 5,
        label: '半年报'
    },
    {
        value: 6,
        label: '年报'
    }
];

// 信披文件类型
export const DisclosureDayStatusList = [
    {
        value: 0,
        label: '未启用'
    },
    {
        value: 1,
        label: '通知期'
    },
    {
        value: 2,
        label: '披露期'
    },
    {
        value: 3,
        label: '等待期'
    },
    {
        value: 4,
        label: '已结束'
    }
];

// 客户来源
export const CUSTOMER_SOURCE = [
    {
        value: 1,
        label: '注册'
    },
    {
        value: 2,
        label: '批量导入'
    },
    {
        value: 3,
        label: '托管'
    },
    {
        value: 4,
        label: '管理员录入'
    }
];

// 微信实名状态
export const weChatBindState = [
    {
        value: 0,
        label: '未绑定'
    },
    {
        value: 1,
        label: '已绑定'
    }
];

// 警示类型
export const warningTypeList = [
    {
        value: 1,
        label: '预警线'
    },
    {
        value: 2,
        label: '止损线'
    }
];

// 警示状态
export const warningStatusList = [
    {
        value: 1,
        label: '警示中'
    },
    {
        value: 2,
        label: '已结束'
    }
];

// 进程中
export const LIFE_STATUS = [
    {
        value: 1,
        label: '进行中'
    },
    {
        value: 2,
        label: '延期'
    },
    {
        value: 3,
        label: '成功'
    }
];

/**
 * @description 系统通知
 */
export const CALL_METHOD = [
    {
        value: 1,
        label: '邮件'
    },
    {
        value: 2,
        label: '短信'
    },
    {
        value: 3,
        label: '面板'
    }
];

// 产品模板状态
export const templateStatus = [
    {
        value: 1,
        label: '编辑中'
    },
    {
        value: 2,
        label: '发布'
    },
    {
        value: 3,
        label: '禁用'
    }
];

// formItem各种类型
export const formItemType = {
    input: '输入框',
    select: '单选下拉框',
    selectMultiple: '多选下拉框',
    inputNumber: '数字输入框',
    datePicker: '单日期框',
    rangePicker: '日期范围',
    timePicker: '时间选择框',
    textArea: '文本域',
    radio: '单选框',
    checkbox: '多选框'
};

// 签署进度 类型枚举
export const SIGNINGPROCESS = [
    { label: '已删除', value: 0 },
    { label: '未完成', value: 1 },
    { label: '已完成', value: 2 }
];


// 产品性质
export const productNatureList = [
    { label: '私募证券投资基金', value: 1 },
    { label: '资管计划', value: 2 },
    { label: '信托计划', value: 3 }
];

// 收益率
export const profitRateType = {
    0: '近一周',
    1: '近一个月',
    2: '近三月',
    3: '近半年',
    4: '近一年',
    5: '近三年',
    6: '今年以来',
    7: '成立以来',
    8: '年化波动率',
    9: '最大回撤',
    10: '夏普比率'
};

// 分红修改状态
export const DIVIDEND_STATUS = [
    { label: '未开启', value: 0 },
    { label: '待修改', value: 1 },
    { label: '已修改', value: 2 },
    { label: '未修改', value: 3 }
];

// 产品接口
export const productMixInfo = [
    { label: ' 普通产品', value: 1 },
    { label: '优先+劣后，结构化', value: 2 },
    { label: '优先+夹层+劣后，结构化', value: 3 },
    { label: '普通+安全垫', value: 4 }
];

// 打新

// 管理人类型
export const stagManagerList = [
    { label: '实际控制方', value: 1 },
    { label: '董监高', value: 2 },
    { label: '股东关联机构', value: 3 },
    { label: '控制机构', value: 4 },
    { label: '控制机构外持股5%以上机构', value: 5 },
    { label: '其他可能利益关联方', value: 6 }
];

// 出资方状态 0-申报中 1-申报成功 2-申报未成功
export const applyResultInfo = [
    { label: ' 申报中', value: 0 },
    { label: '申报成功', value: 1 },
    { label: '申报未成功', value: 2 }
];

// 账户类型
export const accountTypeList = [
    { label: '资金账户', value: 1 },
    { label: '银行账户', value: 2 },
    { label: '期货账户', value: 3 }
];


// message 发送状态
export const MESSAGE_SEND_STATUS = [
    { label: '发送失败', value: 2 },
    { label: '发送成功', value: 1 },
    { label: '发送中', value: 0 },
    { label: '全部', value: undefined }
];

// 份额类型
export const ShareType = [
    { label: '单一份额', value: 1 },
    { label: '优先级和次级', value: 2 },
    { label: '同级多种份额', value: 3 }
];

// 份额类别
export const ShareCategory = [
    { label: '基础份额', value: 1 },
    { label: 'A', value: 2 },
    { label: 'B', value: 3 },
    { label: 'C', value: 4 },
    { label: 'D', value: 5 },
    { label: 'E', value: 6 }
];

// 架构类别
export const ArchitectureCategory = [
    { label: '平层结构', value: 1 },
    { label: '分级结构', value: 2 }
];

// 备案状态
export const RecordStatus = [
    { label: '已备案', value: 1 },
    { label: '未备案', value: 0 }
];

// 业务模式
export const BusinessModel = [
    { label: '仅募集', value: 1 },
    { label: '募集后部分投资', value: 2 },
    { label: '募集后全投资', value: 3 }
];

// 持有人属性
export const PropertyHolder = [
    { label: '一对一', value: 1 },
    { label: '小集合', value: 2 },
    { label: '大集合', value: 3 }
];

// 业绩报酬计提时点
export const WithdrawalPoint = [
    { label: '分红日', value: 1 },
    { label: '赎回日', value: 2 },
    { label: '基金清算日', value: 3 },
    { label: '固定时点', value: 4 },
    { label: '合同终止', value: 5 },
    {label:'每年12月的最后一个交易日', value:6}
];

// 产品类型
export const FundsType = [
    { label: '混合型', value: 1 },
    { label: '股票型', value: 2 },
    { label: '指数型', value: 3 },
    { label: '债券型', value: 4 }
];

// 产品运作方式
export const OperationType = [
    { label: '封闭式', value: 1 },
    { label: '开放式', value: 2 }
];

// 预约来源
export const AppointmentSource = [
    { label: '客户发起', value: 2 },
    { label: '后台创建', value: 1 }
];

// 预约状态
export const AppointmentProgress = [
    { label: '审核中', value: 0 },
    { label: '预约成功', value: 1 },
    { label: '预约失败', value: 2 },
    { label: '已取消', value: 3 }
];

// 申请进度
export const ApplicationProgress = [
    { label: '待审核', value: 0 },
    { label: '已完成', value: 1 },
    { label: '审核不通过', value: 2 },
    { label: '已取消', value: 3 }
];

// 资产证明来源
export const ApplicationSource = [
    { label: '客户发起', value: 1 },
    { label: '后台创建', value: 2 }
];


// 标的板块
export const stockIpoType = [
    { label: '上交所', value: 1 },
    { label: '深交所', value: 2 },
    { label: '科创板', value: 3 }
];

// ipo状态
export const ipoStatus = [
    { label: '未开始', value: 1 },
    { label: '进行中', value: 2 },
    { label: '完成', value: 3 }
];

// 实名的有效性
export const realNameIsEffectived = [
    { value: 1, label: '有效' },
    { value: 2, label: '无效' }
];

// 实名的有效性
export const realNameMode = [
    { value: 1, label: '线上' },
    { value: 2, label: '线下' }
];

// 打新 是否仅网上 1 是 2 否
export const staggingOnlyOnline = [
    { value: 1, label: '是' },
    { value: 2, label: '否' }
];

// 打新 是否仅网上 1 是 2 否
export const IpoNodeStatus = [
    { value: 0, label: '不可操作' },
    { value: 1, label: '待办' },
    { value: 2, label: '完成' }
];

// 签署对象
export const SignedBy = [
    { value: 0, label: '全部客户' },
    { value: 1, label: '普通投资者' },
    { value: 2, label: '专业投资者' },
    { value: 3, label: '特殊投资者' }
];

// 渠道类型
export const CHANNELTYPE = [
    { value: '1', label: '直销' },
    { value: '2', label: '代销' }
];

// 问卷状态
export const ISUSESEAl = [
    { value: 0, label: '未用印' },
    { value: 1, label: '已用印' }
];

// 客户份额状态
export const CUSTOMERSHARETYPE = [
    { value: 1, label: '份额余额>0' },
    { value: 0, label: '份额余额=0' }
];

// 交易流程类型
export const TEADE_FLOW_TYPE = {
    '1': '首次购买',
    '2': '追加申购',
    '3': '赎回'
};
// 中国基金业协会投资者类型
export const CONSTASSOCIATIONINVESTORS = [
    { value: 1, label: '自然人（非员工跟投）' },
    { value: 2, label: '自然人（员工跟投）' },
    { value: 3, label: '境内法人机构(公司等)' },
    { value: 4, label: '境内非法人机构(一般合伙企业等)' },
    { value: 5, label: '本产品管理人跟投' },
    { value: 6, label: '私募基金产品' },
    { value: 7, label: '证券公司及其子公司资产管理计划' },
    { value: 8, label: '基金公司及其子公司资产管理计划' },
    { value: 9, label: '期货公司及其子公司资产管理计划' },
    { value: 10, label: '信托计划' },
    { value: 11, label: '商业银行理财产品' },
    { value: 12, label: '保险资产管理计划' },
    { value: 13, label: '慈善基金、捐赠基金等社会公益基金' },
    { value: 14, label: '养老基金' },
    { value: 15, label: '社会保障基金' },
    { value: 16, label: '企业年金' },
    { value: 17, label: '政府类引导基金' },
    { value: 18, label: '财政直接出资' },
    { value: 19, label: '境外资金（QFII、RQFII等）' },
    { value: 20, label: '境外机构' }
];

// 风险测评状态
export const RISK_EFFECTIVE_STATUS = [
    { label: '到期', value: 0 },
    { label: '未到期', value: 1 }
];

//  统一交易类型
export const tradeType = [
    { value: 1, label: '认购' },
    { value: 2, label: '申购' },
    { value: 3, label: '赎回' },
    { value: 4, label: '强制调增' },
    { value: 5, label: '强制调减' },
    { value: 6, label: '非交易过户转出' },
    { value: 7, label: '非交易过户转入' },
    { value: 8, label: '产品成立' },
    { value: 9, label: '业绩提成返还' },
    { value: 10, label: '业绩提成' }
];
