// 风险问卷题目设置-自然人
const initIssueArr1 = [
    {
        titleText: '您的主要收入来源是',
        titleValue: 1,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '无固定收入',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '工资、劳务报酬',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '生产经营所得',
                check: false,
                optionValue: 3
            },
            {
                score: '7',
                optionText: '利息、股息、转让等金融性资产收入',
                check: false,
                optionValue: 4
            },
            {
                score: '8',
                optionText: '出租、出售房地产等非金融性资产收入',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '您的家庭可支配年收入为（折合人民币）？',
        titleValue: 2,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '50 万元以下',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '50—100 万元',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '100—500 万元',
                check: false,
                optionValue: 3
            },
            {
                score: '7',
                optionText: '500—1000 万元',
                check: false,
                optionValue: 4
            },
            {
                score: '8',
                optionText: '1000 万元以上',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '在您每年的家庭可支配收入中，可用于金融投资（储蓄 存款除外）的比例为？',
        titleValue: 3,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '小于 10%',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '10%至 25%',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '25%至 50%',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '大于 50%',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '您是否有尚未清偿的数额较大的债务，如有，其性质是',
        titleValue: 4,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '有，住房抵押贷款等长期定额债务',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '有，信用卡欠款、消费信贷等短期信用债务',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '有，亲戚朋友借款',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '没有',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '您的投资知识可描述为：',
        titleValue: 5,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '有限：基本没有金融产品方面的知识',
                check: false,
                optionValue: 1
            },
            {
                score: '4',
                optionText: '一般：对金融产品及其相关风险具有基本的知识和理解',
                check: false,
                optionValue: 2
            },
            {
                score: '8',
                optionText: '丰富：对金融产品及其相关风险具有丰富的知识和理解',
                check: false,
                optionValue: 3
            }
        ]
    },
    {
        titleText: '您的投资经验可描述为：',
        titleValue: 6,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '除银行储蓄外，基本没有其他投资经验',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '购买过债券、保险等理财产品',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '参与过股票、产品等产品的交易',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '参与过权证、期货、期权等产品的交易',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '您有多少年投资产品、股票、信托、私募证券或金融衍生产品等风险投资品的经验？',
        titleValue: 7,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '没有经验',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '少于 2 年',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '2 至 5 年',
                check: false,
                optionValue: 3
            },
            {
                score: '7',
                optionText: '5 至 10 年',
                check: false,
                optionValue: 4
            },
            {
                score: '8',
                optionText: '10 年以上',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '您计划的投资期限是多久？',
        titleValue: 8,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '1 年以下',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '1 至 3 年',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '3 至 5 年',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '5 年以上',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '您打算重点投资于哪些种类的投资品种？',
        titleValue: 9,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '债券、货币市场产品、债券产品等固定收益类投资品种',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '股票、混合型产品、股票型产品等权益类投资品种',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '期货、期权等金融衍生品',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '其他产品或者服务',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '以下哪项描述最符合您的投资态度？',
        titleValue: 10,
        multipleChoice: false,
        maxScore: '8',
        options: [
            {
                score: '1',
                optionText: '厌恶风险，不希望本金损失，希望获得稳定回报',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '保守投资，不希望本金损失，愿意承担一定幅度的收益 波动',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '寻求资金的较高收益和成长性，愿意为此承担有限本金 损失',
                check: false,
                optionValue: 3
            },
            {
                score: '8',
                optionText: '希望赚取高回报，愿意为此承担较大本金损失',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText:
            '假设有两种投资：投资 A 预期获得 10%的收益，可能承 担的损失非常小；投资 B 预期获得30%的收益，但可能承担 较大亏损。您会怎么支配您的投资：',
        titleValue: 11,
        multipleChoice: false,
        maxScore: '10',
        options: [
            {
                score: '1',
                optionText: '全部投资于收益较小且风险较小的 A',
                check: false,
                optionValue: 1
            },
            {
                score: '5',
                optionText: '同时投资于 A 和 B，但大部分资金投资于收益较小且风 险较小的 A',
                check: false,
                optionValue: 2
            },
            {
                score: '8',
                optionText: '同时投资于 A 和 B，但大部分资金投资于收益较大且风 险较大的 B',
                check: false,
                optionValue: 3
            },
            {
                score: '10',
                optionText: '全部投资于收益较大且风险较大的 B',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '您认为自己能承受的最大投资损失是多少？',
        titleValue: 12,
        multipleChoice: false,
        maxScore: '10',
        options: [
            {
                score: '1',
                optionText: '10%以内',
                check: false,
                optionValue: 1
            },
            {
                score: '5',
                optionText: '10%-30%',
                check: false,
                optionValue: 2
            },
            {
                score: '8',
                optionText: '30%-50%',
                check: false,
                optionValue: 3
            },
            {
                score: '10',
                optionText: '超过 50%',
                check: false,
                optionValue: 4
            }
        ]
    }
];

// 风险问卷题目设置-机构
const initIssueArr2 = [
    {
        titleText: '贵单位的性质',
        titleValue: 1,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '5',
                optionText: '国有企事业单位',
                check: false,
                optionValue: 1
            },
            {
                score: '1',
                optionText: '非上市民营企业',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '外资企业',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '上市公司',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位的净资产规模为：',
        titleValue: 2,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '0',
                optionText: '500 万元以下',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '500 万元-2000 万元',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: ' 2000 万元-1 亿元',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '超过 1 亿元',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位年营业收入为：',
        titleValue: 3,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '0',
                optionText: '500 万元以下',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '500 万元-2000 万元',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: ' 2000 万元-1 亿元',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '超过 1 亿元',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位证券账户资产为：',
        titleValue: 4,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '0',
                optionText: '300 万元以内',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '300 万元-1000 万元',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '1000 万元-3000 万元',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '超过 3000 万元',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位是否有尚未清偿的数额较大的债务？如有，主要 是：',
        titleValue: 5,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '3',
                optionText: '银行贷款',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '公司债券或企业债券',
                check: false,
                optionValue: 2
            },
            {
                score: '2',
                optionText: '通过担保公司等中介机构募集的借款',
                check: false,
                optionValue: 3
            },
            {
                score: '1',
                optionText: '民间借贷',
                check: false,
                optionValue: 4
            },
            {
                score: '5',
                optionText: '没有数额较大的债务',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '对于金融产品投资工作，贵单位打算配置怎样的人员力量：',
        titleValue: 6,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '0',
                optionText: '一名兼职人员（包括负责人自行决策）',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '一名专职人员',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '多名兼职或专职人员，相互之间分工不明确',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '多名兼职或专职人员，相互之间有明确分工',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位所配置的负责金融产品投资工作的人员是否符合 以下情况：',
        titleValue: 7,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '2',
                optionText: '现在或此前曾从事金融、经济或财会等与金融产品投资 相关的工作超过两年',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '已取得金融、经济或财会等与金融产品投资相关专业学士 以上学位',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText:
                    '取得证券从业资格、期货从业资格、注册会计师证书（CPA） 或注册金融分析师证书（CFA）中的一项及以上',
                check: false,
                optionValue: 3
            },
            {
                score: '1',
                optionText: '本单位所配置的人员不符合以上任何一项描述',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位是否建立了金融产品投资相关的管理制度：',
        titleValue: 8,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '0',
                optionText: '没有。因为要保证操作的灵活性',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '已建立。包括了分工和授权的要求，但未包括投资风险控 制的规则',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '已建立。包括了分工与授权、风险控制等一系列与金融产 品投资有关的规则',
                check: false,
                optionValue: 3
            }
        ]
    },
    {
        titleText: '贵单位的投资经验可以被概括为：',
        titleValue: 9,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: '有限：除银行活期账户和定期存款外，基本没有其他投 资经验',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText:
                    '一般：除银行活期账户和定期存款外，购买过产品、保 险等理财产品，但还需要进一步的指导',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText:
                    '丰富：本单位具有相当投资经验，参与过股票、产品等 产品的交易，并倾向于自己做出投资决策',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText:
                    '非常丰富：本单位对于投资非常有经验，参与过权证、 期货或创业板等高风险产品的交易',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText:
            '有一位投资者一个月内做了 15 笔交易（同一品种买卖 各一次算一笔），贵单位认为这样的交易频率',
        titleValue: 10,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: '太高了',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '偏高',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '正常',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '偏低',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '过去一年时间内，您购买的不同金融产品（含同一类型 的不同金融产品）的数量是：',
        titleValue: 11,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: '5 个以下',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '6 至 10 个',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '11 至 15 个',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '16 个以上',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '以下金融产品，贵单位投资经验在两年以上的有：',
        titleValue: 12,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: '银行存款',
                check: false,
                optionValue: 1
            },
            {
                score: '2',
                optionText: '债券、货币市场产品、债券型产品或其它固定收益类产品',
                check: false,
                optionValue: 2
            },
            {
                score: '3',
                optionText: '股票、混合型产品、偏股型产品、股票型产品等权益类投 资品种',
                check: false,
                optionValue: 3
            },
            {
                score: '4',
                optionText: '期货、融资融券',
                check: false,
                optionValue: 4
            },
            {
                score: '5',
                optionText: '复杂金融产品或其他产品',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText:
            '如果贵单位曾经从事过金融产品投资，在交易较为活跃 的月份，平均月交易额大概是多少：',
        titleValue: 13,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: ' 100 万元以内',
                check: false,
                optionValue: 1
            },
            {
                score: '2',
                optionText: '100 万元-300 万元',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '300 万元-1000 万元',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '1000 万元以上',
                check: false,
                optionValue: 4
            },
            {
                score: '1',
                optionText: '从未投资过金融产品',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '贵单位用于证券投资的大部分资金不会用作其它用途的 时间段为：',
        titleValue: 14,
        multipleChoice: false,
        maxScore: '5',
        options: [
            {
                score: '1',
                optionText: '短期——0 到 1 年',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '中期——1 到 5 年',
                check: false,
                optionValue: 2
            },
            {
                score: '5',
                optionText: '长期——5 年以上',
                check: false,
                optionValue: 3
            }
        ]
    },
    {
        titleText: '贵单位进行投资时的首要目标是：',
        titleValue: 15,
        multipleChoice: false,
        maxScore: '6',
        options: [
            {
                score: '1',
                optionText: '资产保值，我不愿意承担任何投资风险',
                check: false,
                optionValue: 1
            },
            {
                score: '2',
                optionText: '尽可能保证本金安全，不在乎收益率比较低',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '产生较多的收益，可以承担一定的投资风险',
                check: false,
                optionValue: 3
            },
            {
                score: '6',
                optionText: '实现资产大幅增长，愿意承担很大的投资风险',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText: '贵单位打算重点投资于哪个种类的投资品种？',
        titleValue: 16,
        multipleChoice: false,
        maxScore: '6',
        options: [
            {
                score: '2',
                optionText: '债券、货币市场产品、债券产品等固定收益类投资品种',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '股票、混合型产品、偏股型产品、股票型产品等权益类投 资品种',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '期货、融资融券',
                check: false,
                optionValue: 3
            },
            {
                score: '6',
                optionText: '复杂金融产品',
                check: false,
                optionValue: 4
            },
            {
                score: '1',
                optionText: '其他产品',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '贵单位认为自己能承受的最大投资损失是多少？',
        titleValue: 17,
        multipleChoice: false,
        maxScore: '6',
        options: [
            {
                score: '1',
                optionText: '10%以内',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '10%-30%',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '30%-50%',
                check: false,
                optionValue: 3
            },
            {
                score: '6',
                optionText: '超过 50%',
                check: false,
                optionValue: 4
            }
        ]
    },
    {
        titleText:
            '假设有两种不同的投资：投资 A 预期获得 5%的收益， 有可能承担非常小的损失；投资 B 预期获得 20%的收益，但 有可能面临 25%甚至更高的亏损。您将您的投资资产分配为：',
        titleValue: 18,
        multipleChoice: false,
        maxScore: '6',
        options: [
            {
                score: '1',
                optionText: '全部投资于 A',
                check: false,
                optionValue: 1
            },
            {
                score: '3',
                optionText: '大部分投资于 A',
                check: false,
                optionValue: 2
            },
            {
                score: '4',
                optionText: '两种投资各一半',
                check: false,
                optionValue: 3
            },
            {
                score: '5',
                optionText: '大部分投资于 B',
                check: false,
                optionValue: 4
            },
            {
                score: '6',
                optionText: '全部投资于 B',
                check: false,
                optionValue: 5
            }
        ]
    },
    {
        titleText: '贵单位参与金融产品投资的主要目的是什么：',
        titleValue: 19,
        multipleChoice: false,
        maxScore: '6',
        options: [
            {
                score: '3',
                optionText: '闲置资金保值增值',
                check: false,
                optionValue: 1
            },
            {
                score: '5',
                optionText: '获取主营业务以外的投资收益',
                check: false,
                optionValue: 2
            },
            {
                score: '6',
                optionText: '现货套期保值、对冲主营业务风险',
                check: false,
                optionValue: 3
            },
            {
                score: '1',
                optionText: '减持已持有的股票',
                check: false,
                optionValue: 4
            }
        ]
    }
];

// 自然人
const initRiskLevel1 = [
    {
        riskText: 'C1',
        minScore: '12',
        maxScore: '20',
        productRiskText: 'R1',
        productRiskValue: '1',
        riskValue: '1'
    },
    {
        riskText: 'C2',
        minScore: '21',
        maxScore: '36',
        productRiskText: 'R2',
        productRiskValue: '2',
        riskValue: '2'
    },
    {
        riskText: 'C3',
        minScore: '37',
        maxScore: '53',
        productRiskText: 'R3',
        productRiskValue: '3',
        riskValue: '3'
    },
    {
        riskText: 'C4',
        minScore: '54',
        maxScore: '82',
        productRiskText: 'R4',
        productRiskValue: '4',
        riskValue: '4'
    },
    {
        riskText: 'C5',
        minScore: '83',
        maxScore: '100',
        productRiskText: 'R5',
        productRiskValue: '5',
        riskValue: '5'
    }
];

// 机构
const initRiskLevel2 = [
    {
        riskText: 'C1',
        minScore: '14',
        maxScore: '20',
        productRiskText: 'R1',
        productRiskValue: '1',
        riskValue: '1'
    },
    {
        riskText: 'C2',
        minScore: '21',
        maxScore: '36',
        productRiskText: 'R2',
        productRiskValue: '2',
        riskValue: '2'
    },
    {
        riskText: 'C3',
        minScore: '37',
        maxScore: '53',
        productRiskText: 'R3',
        productRiskValue: '3',
        riskValue: '3'
    },
    {
        riskText: 'C4',
        minScore: '54',
        maxScore: '82',
        productRiskText: 'R4',
        productRiskValue: '4',
        riskValue: '4'
    },
    {
        riskText: 'C5',
        minScore: '83',
        maxScore: '100',
        productRiskText: 'R5',
        productRiskValue: '5',
        riskValue: '5'
    }
];

// 合格投资者确认项
const initSureJsonObject = {
    titleText: '首先，本人确认是以下情况之一的合格投资者：',
    options: [
        {
            optionValue: 1,
            optionText: '金融资产不低于300 万元（金融资产包括银行存款、股票、债券、产品份额、资产管理计划、银行理财产品、信托计划、保险产品、期货权益等）'
        },
        {
            optionValue: 2,
            optionText: '最近三年个人年均收入不低于50万元'
        },
        {
            optionValue: 3,
            optionText: '投资于所管理私募产品的私募产品管理人的从业人员'
        }
    ]
};

// 机构投资者确认项
const initSureJsonObject2 = {
    titleText: '首先，本机构确认是以下情况之一的合格投资者：',
    options: [
        {
            optionValue: 1,
            optionText: '净资产不低于1000 万元的单位'
        },
        {
            optionValue: 2,
            optionText: '社会保障产品、企业年金等养老产品，慈善产品等社会公益产品'
        },
        {
            optionValue: 3,
            optionText: '依法设立并在产品业协会备案的投资计划'
        },
        {
            optionValue: 4,
            optionText: '投资于所管理私募产品的私募产品管理人'
        }
    ]
};
// 基本信息
const initBaseData = {
    riskTime: '3',
    maxScore: '100',
    versionNumber: ''
};

// 风险提示
const riskTips =
    '<p>风险提示：产品投资需承担各类风险，本金可能遭受损失。同时，还要考虑市场风险、信用风险、流动风险、操作风险等各类投资风险。您在产品认购过程中应当注意核对自己的风险识别和风险承受能力，选择与自己风险识别能力和风险承受能力相匹配的私募产品。</p>';
// 风险测评结果确认书
const initBookContent =
    '<p>      结合您/贵机构填写的《风险测评问卷》以及其它相关信息我司，对您的风险承受能力进行了综合评估，现得到评估结果如下： 您/贵机构的测评分数为：【客户测评分数】 ，风险承受为：【客户风险等级】 。</p><p>       我司在此郑重提醒，我司向您/贵机构销售的产品或提供的服务将以您的风险承受能力等级和投资品种、期限为础，若您/贵机构提供的信息发生任何重大变化，您/贵机构应当及时以书面方式通知我司。我司建议您/贵机构审慎评判自身风险承受能力、结合自身投资行为，认真填写投资品种、期限，并做出审慎的投资判断。</p><p></p><p>声明： 本人已如实填写《私募产品投资者风险测评问卷》，并了解了自己的风险承受类型和适合购买的产品类型。</p>';
export {
    initIssueArr1,
    initRiskLevel1,
    initSureJsonObject,
    initSureJsonObject2,
    initBaseData,
    riskTips,
    initBookContent,
    initIssueArr2,
    initRiskLevel2
};
