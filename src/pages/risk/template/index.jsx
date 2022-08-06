import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Input, Collapse, Radio, message, Button, Spin, InputNumber, Modal, Checkbox, Space } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { history } from 'umi';
import BraftEditor from 'braft-editor';
import {
    initIssueArr1,
    initRiskLevel1,
    initSureJsonObject,
    initSureJsonObject2,
    initBaseData,
    riskTips,
    initBookContent,
    initIssueArr2,
    initRiskLevel2
} from './initData';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import styles from './styles.less';
import { connect } from 'dva';
import { isEmpty } from 'lodash';
import { downloadFile, getPermission } from '@/utils/utils';
import { cloneDeep } from 'lodash';
import EditStarModal from './Components/EditStarModal';

const { confirm } = Modal;
const { Panel } = Collapse;

const Template = (props) => {

    const { authEdit } = getPermission(50200);
    const optionsInputChange = (e, index) => {
        sureJsonObject.options[index].optionText = e.target.value;
        changeSureJsonObject({ ...sureJsonObject });
    };
    const titleTextChange = (e) => {
        changeSureJsonObject({
            ...sureJsonObject,
            titleText: e.target.value
        });
    };
    const addOptions = (index, type) => {
        if (type === 'add') {
            sureJsonObject.options.splice(index + 1, 0, {
                optionText: ''
            });
            sureJsonObject.options.forEach((item, index) => {
                item.optionValue = index + 1;
            });
            changeSureJsonObject({ ...sureJsonObject });
            return;
        }
        if (sureJsonObject.options.length === 1) return;
        sureJsonObject.options.splice(index, 1);
        sureJsonObject.options.forEach((item, index) => {
            item.optionValue = index + 1;
        });
        changeSureJsonObject({ ...sureJsonObject });
    };
    const [sureJsonObject, changeSureJsonObject] = useState({});
    const [scoreJsonArray, changeScoreJsonArray] = useState([]);
    const [abilityJsonArray, changeAbilityJsonArray] = useState([]);
    const [scoreVale, setScoreVale] = useState('');
    const [isView, changeType] = useState(false);
    // 风险提示设置 和 风险测评结果确认书 数据
    const [braftEditorData, setBraftEditorData] = useState({});
    // 操作信息
    const [operationInfo, setOperationInfo] = useState({});
    // 基本信息
    const [baseData, setBaseData] = useState({});

    const [isModalVisible, setIsModalVisible] = useState(false);

    const [partFourItem, setPartFourItem] = useState({});

    // 删除风险问卷题目
    const headerDel = (index, e) => {
        e.stopPropagation();
        confirm({
            title: '是否确定删除该问题',
            onOk: () => {
                scoreJsonArray.splice(index, 1);
                changeScoreJsonArray([...scoreJsonArray]);
            }
        });

    };

    // 问题渲染头部
    const headerRender = (index) => (
        <div style={{
            display: 'flex',
            justifyContent: 'space-between'
        }}
        >
            <span>{`问题${index + 1}`}</span>
            {
                scoreJsonArray.length > 1 && authEdit && !isView ? (
                    <span
                        style={{
                            cursor: 'pointer',
                            color: '#1890ff'
                        }}
                        onClick={(e) => headerDel(index, e)}
                    >
                        删除
                    </span>
                ) : null
            }

        </div>
    );

    // 问题渲染
    const issueRender = () => {
        return scoreJsonArray.map((item, index) => (
            <div key={index}>
                <Collapse>
                    <Panel header={headerRender(index)} key={index}>
                        <div className={styles.configBox2}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingBottom: 16
                                }}
                            >
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: 450,
                                        paddingRight: 20
                                    }}
                                >
                                    <span style={{ width: 80, textAlign: 'right' }}>
                                        问题{index + 1}：
                                    </span>
                                    <Input
                                        disabled={isView}
                                        value={item.titleText}
                                        onInput={(e) =>
                                            issueContentChange(index, 'titleText', e.target.value)
                                        }
                                    />
                                </div>
                                <div>
                                    <span>最大分数：</span>
                                    <Input
                                        type={'number'}
                                        disabled={isView}
                                        value={item.maxScore}
                                        onInput={(e) =>
                                            issueContentChange(index, 'maxScore', e.target.value)
                                        }
                                        style={{
                                            marginRight: 50,
                                            width: 80
                                        }}
                                        onBlur={() => maxScoreBlur(item)}
                                    />
                                </div>
                                <div>
                                    <span>选项类型：</span>
                                    <Radio.Group
                                        disabled={isView}
                                        value={item.multipleChoice}
                                        style={{
                                            marginRight: 50,
                                            textAlign: 'left'
                                        }}
                                        onChange={(e) =>
                                            issueContentChange(
                                                index,
                                                'multipleChoice',
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <Radio value={false}>单选</Radio>
                                        <Radio value>多选</Radio>
                                    </Radio.Group>
                                </div>
                            </div>
                            {(item.options || []).map((optionItem, optionIndex) => (
                                <div className={styles.item} key={optionIndex}>
                                    <span>选项{optionIndex + 1}：</span>
                                    <Input
                                        disabled={isView}
                                        value={optionItem.optionText}
                                        onInput={(e) =>
                                            issueOption(
                                                index,
                                                optionIndex,
                                                'optionText',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <div className={styles.score}>
                                        <span>分值：</span>
                                        <Input
                                            type="number"
                                            disabled={isView}
                                            value={optionItem.score}
                                            onChange={(e) =>
                                                issueOption(
                                                    index,
                                                    optionIndex,
                                                    'score',
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={() => scoreBlur(item, optionItem)}
                                        />
                                    </div>
                                    <div
                                        className={styles.iconG}
                                        style={{
                                            visibility: isView ? 'hidden' : 'unset'
                                        }}
                                    >
                                        <PlusCircleOutlined
                                            style={{
                                                fontSize: 20,
                                                paddingRight: 5,
                                                paddingLeft: 5,
                                                color: '#1890ff'
                                            }}
                                            onClick={() => {
                                                issueAddOptions(index, optionIndex, 'add');
                                            }}
                                        />
                                        <MinusCircleOutlined
                                            style={{
                                                fontSize: 20,
                                                color: '#ff4d4f'
                                            }}
                                            onClick={() => {
                                                issueAddOptions(index, optionIndex, 'remove');
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Panel>
                </Collapse>
            </div>
        ));
    };

    // 新增问题
    const addIssue = () => {
        scoreJsonArray.push({
            titleText: '问题',
            multipleChoice: false,
            options: [
                {
                    score: '0',
                    optionText: '',
                    check: false
                }
            ]
        });
        changeScoreJsonArray([...scoreJsonArray]);
    };

    // 问题内容修改
    const issueContentChange = (index, key, val) => {
        if (key === 'maxScore') {
            val = Number(val) < 0 ? 0 : val;
        }
        val = typeof val === 'boolean' ? val : String(val);
        scoreJsonArray[index][key] = val;
        changeScoreJsonArray([...scoreJsonArray]);
    };

    // 问题选项修改
    const issueOption = (parentIndex, currentIndex, key, val) => {
        if (key === 'score') {
            val = Number(val) < 0 ? 0 : val;
        }
        scoreJsonArray[parentIndex].options[currentIndex][key] = val;
        changeScoreJsonArray([...scoreJsonArray]);
    };

    // 最大数值失焦事件
    const maxScoreBlur = (item) => {
        // 如果是0的情况
        // const num = item.options.reduce((pre, memo) => {
        //     return pre + Number((memo.score || 0))
        // }, 0)
        // if (!num) return
        // 修改
        const result = item.options.every((optionsItem) => {
            return Number(optionsItem.score || 0) <= Number(item.maxScore);
        });
        if (item.maxScore && !result) {
            item.maxScore = '';
            changeScoreJsonArray([...scoreJsonArray]);
            message.error('任一个选项分数必小于最大分');
        }
    };

    // 分值失焦事件
    const scoreBlur = (parentItem, item) => {
        if (parentItem.maxScore && item.score && +parentItem.maxScore < +item.score) {
            item.score = '';
            changeScoreJsonArray([...scoreJsonArray]);
            message.error('任一个选项分数必小于最大分');
        }
    };

    // 问卷题目添加删除选项
    const issueAddOptions = (parentIndex, currentIndex, type) => {
        if (type === 'add') {
            (scoreJsonArray[parentIndex].options || []).splice(currentIndex + 1, 0, {
                score: '0',
                optionText: '',
                check: false
            });
            scoreJsonArray.forEach((item, index) => {
                item.titleValue = index + 1;
                item.options.forEach((item2, index2) => {
                    item2.optionValue = index2 + 1;
                });
            });
            return changeScoreJsonArray([...scoreJsonArray]);
        }
        if ((scoreJsonArray[parentIndex].options || []).length === 1) return;
        (scoreJsonArray[parentIndex].options || []).splice(currentIndex, 1);
        scoreJsonArray.forEach((item, index) => {
            item.titleValue = index + 1;
            item.options.forEach((item2, index2) => {
                item2.optionValue = index2 + 1;
            });
        });
        return changeScoreJsonArray([...scoreJsonArray]);
    };

    // 能力设定
    const risklevelItemChange = (index, key, val) => {
        if (key === 'minScore' || key === 'maxScore') {
            val = Number(val) < 0 ? 0 : val;
        }
        abilityJsonArray[index][key] = val;
        changeAbilityJsonArray([...abilityJsonArray]);
    };

    // 增删风险等级
    const addRiskLevel = (index, type) => {
        if (type === 'add') {
            abilityJsonArray.splice(index + 1, 0, {
                riskText: '',
                minScore: '',
                maxScore: '',
                productRiskText: '',
                productRiskValue: '',
                riskValue: ''
            });
            abilityJsonArray.forEach((item, index) => {
                item.productRiskValue = String(index + 1);
                item.riskValue = String(index + 1);
            });
            changeAbilityJsonArray([...abilityJsonArray]);
            return;
        }
        if (abilityJsonArray.length === 1) return;
        abilityJsonArray.splice(index, 1);
        changeAbilityJsonArray([...abilityJsonArray]);
    };

    // 修改baseData
    const baseDataChange = (val, key) => {
        if (key === 'isRiskLongTime') {
            setBaseData({
                ...baseData,
                isRiskLongTime: val ? 1 : 0
            });
            return;
        }
        val = Number(val) < 0 ? 0 : val;
        setBaseData({
            ...baseData,
            [key]: String(val)
        });
    };

    const validator = () => {
        // 基本信息校验
        for (let key in baseData) {
            if (baseData[key] !== 0 && !baseData[key]) {
                message.error('基本信息内容不能为空');
                return false;
            }
        }

        // 合规配置风险提示设置
        if (braftEditorData.content === '' || braftEditorData.content === '<p></p>') {
            message.error('风险提示设置不能为空');
            return false;
        }
        if (typeof braftEditorData.content === 'object') {
            if (
                braftEditorData.content.toHTML() === '' ||
                braftEditorData.content.toHTML() === '<p></p>'
            ) {
                message.error('风险提示设置不能为空');
                return false;
            }
        }

        // 合规配置 合格投资者确认项校验
        if (!sureJsonObject.titleText) {
            message.error('合格投资者确认项不能为空');
            return false;
        }
        if (!sureJsonObject.options.every((item) => item.optionText)) {
            message.error('合格投资者确认项不能为空');
            return false;
        }
        // 风险问卷题目校验
        for (let item of scoreJsonArray) {
            if (!String(item.maxScore) || !item.titleText) {
                message.error('风险问卷题目不能为空');
                return false;
            }
            if (!item.options.every((i) => i.optionText && String(i.score))) {
                message.error('风险问卷题目选项不能为空');
                return false;
            }
        }
        // 投资者风险承受能力设定校验
        // if (!scoreVale) {
        //     message.error('合格投资者最低分值不能为空')
        //     return false
        // }
        for (let item of abilityJsonArray) {
            for (let key in item) {
                if (!item[key]) {
                    message.error('风险等级相关内容不能为空');
                    return false;
                }
            }
        }
        //  处理投资者风险承受能力风险等级1 最小分值逻辑，最小峰值 <= 问卷题目最小分值相加
        // 获取问卷最小分值
        const minScoreArrTotal = scoreJsonArray
            .map((item) => {
                let childScore = item.options.map((item2) => +item2.score);
                return Math.min(...childScore);
            })
            .reduce((pre, item) => pre + item, 0);
        if (minScoreArrTotal < Number(abilityJsonArray[0].minScore)) {
            message.error('风险等级1的最小分值不能大于问卷题目选项最小值总和');
            return;
        }

        if (
            String(abilityJsonArray[abilityJsonArray.length - 1].maxScore) !==
            String(baseData.maxScore)
        ) {
            message.error('风险等级最后一选项应该与该问卷总分相等');
            return false;
        }

        if (braftEditorData.bookContent === '' || braftEditorData.bookContent === '<p></p>') {
            message.error('风险测评结果确认书不能为空');
            return false;
        }
        if (typeof braftEditorData.bookContent === 'object') {
            if (
                braftEditorData.bookContent.toHTML() === '' ||
                braftEditorData.bookContent.toHTML() === '<p></p>'
            ) {
                message.error('风险测评结果确认书不能为空');
                return false;
            }
        }
        // 校验每项问题最大分值和是否<=投资者风险承受能力设定最后一项最大分值
        // 获取最大分值总分
        const maxScore = scoreJsonArray.reduce((pre, item) => pre + Number(item.maxScore), 0);
        // 获取投资者风险承受能力设定最后一项最大分值
        const lastAbilityJsonArrayMaxScore = abilityJsonArray[abilityJsonArray.length - 1]?.maxScore;
        const lastAbilityJsonArrayMinScore = abilityJsonArray[abilityJsonArray.length - 1]?.minScore;
        if (maxScore !== Number(lastAbilityJsonArrayMaxScore)) {
            message.error('每道问题的最大分值总和必须等于问卷总分数，请核实分数后再保存！');
            return false;
        }
        if (maxScore < Number(lastAbilityJsonArrayMinScore)) {
            message.error('风险问卷问题总分之和不在风险等级5区间内，请修改！');
            return false;
        }
        return true;
    };

    // 保存
    const submit = (type) => {
        // 校验是否全部填写
        const success = validator();
        const {
            dispatch,
            location,
            match: {
                params: { id }
            }
        } = props;
        const {
            query: { askType }
        } = location;
        if (success) {
            const content =
                typeof braftEditorData.content === 'string'
                    ? braftEditorData.content
                    : braftEditorData.content.toHTML();
            const bookContent =
                typeof braftEditorData.bookContent === 'string'
                    ? braftEditorData.bookContent
                    : braftEditorData.bookContent.toHTML();
            const versionNumber = baseData.versionNumber.split('-')[1];
            const payload = {
                ...baseData,
                askType,
                versionNumber,
                bookContent,
                content,
                sureJson: JSON.stringify(sureJsonObject),
                scoreJson: JSON.stringify(scoreJsonArray),
                abilityJson: JSON.stringify(abilityJsonArray),
                publishStatus: type === 'save' ? 0 : 1
            };
            // 编辑
            if (id !== '0') {
                dispatch({
                    type: 'risk/updateRiskAsk',
                    payload: {
                        ...payload,
                        riskaskId: id
                    },
                    callback(res) {
                        if (res.code === 1008) {
                            if (type !== 'save') {
                                message.success('发布成功');
                                history.push({
                                    pathname: '/risk/templateList'
                                });
                                return;
                            }
                            message.success('保存成功');
                        } else {
                            message.error(res.message);
                        }
                    }
                });
                return;
            }
            // 创建新的模板
            dispatch({
                type: 'risk/createRiskAsk',
                payload,
                callback(res) {
                    if (res.code === 1008) {
                        if (type !== 'save') {
                            message.success('发布成功');
                            history.push({
                                pathname: '/risk/templateList'
                            });
                        } else {
                            message.success('保存成功');
                            history.push({
                                pathname: `/risk/templateList/template/edit/${res.data.riskaskId}`,
                                query: {
                                    askType: res.data.askType,
                                    showOperation: true
                                }
                            });
                        }
                    } else {
                        message.error(res.message);
                    }
                }
            });
        }
    };

    // 下载通配符
    const downLoadWildcard = () => {
        downloadFile('/attachments/downloadFile', { source: 105, codeType: 1200 });
    };

    // 设置是编辑态还是查看态
    useEffect(() => {
        const { params } = props?.match;
        const { location } = props;
        const { query } = location;
        if (params.type === 'view') {
            // 查看，不可编辑
            changeType(true);
        }
        // if (String(query.askType) === '1') {
        //     setScoreVale('12')
        // }
        // if (String(query.askType) === '2') {
        //     setScoreVale('14')
        // }
    }, []);

    // 回显数据
    useEffect(() => {
        const {
            match: {
                params: { id }
            },
            dispatch,
            location: {
                query: { askType }
            }
        } = props;
        if (id === '0') {
            // if (String(askType) === '1') {
            //     // 自然人
            //     changeScoreJsonArray(cloneDeep(initIssueArr1));
            //     changeAbilityJsonArray(cloneDeep(initRiskLevel1));
            //     changeSureJsonObject(cloneDeep(initSureJsonObject));
            // }
            // if (String(askType) === '2') {
            //     // 机构
            //     changeScoreJsonArray(cloneDeep(initIssueArr2));
            //     changeAbilityJsonArray(cloneDeep(initRiskLevel2));
            //     changeSureJsonObject(cloneDeep(initSureJsonObject2));
            // }
            // 创建--后期请求接口,当前使用前端默认值
            // setBaseData(cloneDeep(initBaseData));
            // setBraftEditorData({
            //     content: BraftEditor.createEditorState(riskTips),
            //     bookContent: BraftEditor.createEditorState(initBookContent)
            // });
            dispatch({
                type: 'risk/queryQuestionnaires',
                payload: { askType },
                callback: (res) => {
                    if (res.code !== 1008) return;
                    changeScoreJsonArray(JSON.parse(res.data.scoreJson));
                    changeAbilityJsonArray(JSON.parse(res.data.abilityJson));
                    changeSureJsonObject(JSON.parse(res.data.sureJson));
                    // setBaseData({ riskTime: res.data?.riskTime, maxScore: res.data?.maxScore, versionNumber:''});
                    // console.log(baseData, '2222');
                    setBraftEditorData({
                        content: BraftEditor.createEditorState(res.data?.content),
                        bookContent: BraftEditor.createEditorState(res.data?.bookContent)
                    });
                    dispatch({
                        type: 'risk/queryVersionNumber',
                        payload: { askType },
                        callback(versionNumber) {
                            setBaseData({ riskTime: res.data?.riskTime, maxScore: res.data?.maxScore, versionNumber, isRiskLongTime: res.isRiskLongTime || 0 });
                        }
                    });
                }
            });
            return;
        }
        dispatch({
            type: 'risk/queryRiskAskDetail',
            payload: { riskaskId: id },
            callback(res) {
                const abilityJson = JSON.parse(res.abilityJson) || {};
                const sureJson = res.sureJson ? JSON.parse(res.sureJson) : {};
                const scoreJson = res.scoreJson ? JSON.parse(res.scoreJson) : [];
                setBaseData({
                    riskTime: res.riskTime,
                    maxScore: res.maxScore,
                    versionNumber: res.versionNumber,
                    isRiskLongTime: res.isRiskLongTime || 0
                });
                setBraftEditorData({
                    content: BraftEditor.createEditorState(res.content),
                    bookContent: BraftEditor.createEditorState(res.bookContent)
                });
                changeSureJsonObject(sureJson);
                changeScoreJsonArray(scoreJson);
                changeAbilityJsonArray(abilityJson || []);
                // setScoreVale(abilityJson?.scoreVale)
                setOperationInfo({
                    managerUserName: res.managerUserName,
                    updateTime: res.updateTime
                });
            }
        });
    }, []);


    // 查询版本号
    // useEffect(() => {
    //     let time;
    //     const { location, dispatch } = props;
    //     const { query } = location;
    //     if (query.askType) {
    //
    //     }
    //     return () => {
    //         clearTimeout(time);
    //     };
    // }, []);

    // useEffect(()=>{
    //     return () => {
    //         changeSureJsonObject({});
    //         changeScoreJsonArray([]);
    //         changeAbilityJsonArray([]);
    //         setBraftEditorData({});
    //         setOperationInfo({});
    //         setBaseData({})
    //     }
    // },[])


    const toggle = (item) => {
        setIsModalVisible((o) => !o);
        if (isModalVisible) {
            setPartFourItem({});
        } else {
            setPartFourItem(item);
        }
    };

    const handleOk = (values) => {
        const tempArr = cloneDeep(abilityJsonArray);
        setIsModalVisible(false);
        tempArr.forEach((item) => {
            if (item.riskText === values.riskText) {
                item.starList = values.starList;
            }

        });
        changeAbilityJsonArray(tempArr);

    };

    const _copyNewTemplate = () => {
        const {
            match: {
                params: { id }
            },
            dispatch,
            location: {
                query: { askType, showOperation }
            }
        } = props;
        dispatch({
            type: 'risk/queryVersionNumber',
            payload: { askType },
            callback(versionNumber) {
                confirm({
                    title: `新问卷的版本号是${versionNumber}?`,
                    onOk: () => {
                        dispatch({
                            type: 'risk/copySave',
                            payload: {
                                riskaskId: id,
                                askType
                            },
                            callback: (res) => {
                                if (res.code === 1008) {
                                    history.push({
                                        pathname: `/risk/templateList/template/edit/${res.data.riskaskId}`,
                                        query: {
                                            askType: askType,
                                            showOperation
                                        }
                                    });
                                    message.success('复制成功');
                                } else {
                                    message.error(res.message);
                                }
                            }
                        });
                    }
                });
            }
        });
    };

    return (
        <PageHeaderWrapper title="风险测评问卷模板">
            <Spin
                spinning={
                    Boolean(props.loading1) || Boolean(props.loading2) || Boolean(props.loading3) || Boolean(props.loading4) || Boolean(props.loading5)
                }
            >
                <Card title="基本信息" className={styles.card}>
                    <div className={styles.box}>
                        <div className={styles.item}>
                            <span>版本号：</span>
                            <div>
                                <Input
                                    className={styles.itemInput}
                                    disabled
                                    value={baseData.versionNumber}
                                />
                                <span>版本号自动生成，每次自动加1</span>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span>风险调查问卷失效时间：</span>
                            <div>
                                <div>
                                    <Space>
                                        <Input
                                            type="number"
                                            className={styles.itemInput}
                                            suffix="月"
                                            disabled={isView}
                                            value={baseData.riskTime}
                                            onChange={(e) => baseDataChange(e.target.value, 'riskTime')}
                                        />
                                        <Checkbox
                                            onChange={(e) => baseDataChange(e.target.checked * 1, 'isRiskLongTime')}
                                            checked={!!baseData?.isRiskLongTime}
                                        >
                                            长期有效
                                        </Checkbox>
                                    </Space>
                                </div>
                                <span>
                                    注：失效后会提示投资人重新填写问卷；该时间自然人和机构问卷通用
                                </span>
                            </div>
                        </div>
                        <div className={styles.item}>
                            <span>问卷总分数：</span>
                            <div>
                                <div>
                                    <Input
                                        type="number"
                                        className={styles.itemInput}
                                        suffix="分"
                                        disabled={isView}
                                        value={baseData.maxScore}
                                        onChange={(e) => baseDataChange(e.target.value, 'maxScore')}
                                    />
                                </div>
                                <span>注：每道题目最高分相加不高于总分数</span>
                            </div>
                        </div>
                        {
                            Number(props.match.params.id) !== 0 &&
                            <Button type="primary" style={{ width: 200 }} onClick={_copyNewTemplate} loading={props.copyLoading}>复制本套问卷并编辑</Button>
                        }
                    </div>
                </Card>
                <Card
                    title={
                        <div className={styles.cardTitle}>
                            合规配置 <span onClick={downLoadWildcard}>点击查看支持通配符信息</span>{' '}
                        </div>
                    }
                    className={styles.card}
                >
                    <div className={styles.config}>
                        <div className={styles.item}>
                            <p>1、风险提示设置：（本人同意以下提示）</p>
                            <div>
                                <BraftEditor
                                    value={braftEditorData.content}
                                    readOnly={isView}
                                    controls={[]}
                                    contentStyle={{
                                        height: 200
                                    }}
                                    onChange={(e) => {
                                        setBraftEditorData({
                                            ...braftEditorData,
                                            content: e.toHTML()
                                        });
                                    }}
                                    style={{
                                        marginLeft: 22,
                                        border: '1px solid #000'
                                    }}
                                />
                            </div>
                        </div>
                        <div className={styles.item}>
                            <p>2、合格投资者确认项</p>
                            <div className={styles.configBox}>
                                <div className={styles.item}>
                                    <span>标题：</span>
                                    <Input
                                        style={{
                                            marginRight: 50
                                        }}
                                        value={sureJsonObject.titleText}
                                        onInput={(e) => titleTextChange(e)}
                                        disabled={isView}
                                    />
                                </div>
                                {(sureJsonObject.options || []).map((item, index) => (
                                    <div className={styles.item} key={index}>
                                        <span>选项{index + 1}：</span>
                                        <Input
                                            value={item.optionText}
                                            onInput={(e) => optionsInputChange(e, index)}
                                            disabled={isView}
                                        />
                                        <div
                                            className={styles.iconG}
                                            style={{
                                                visibility: isView ? 'hidden' : 'unset'
                                            }}
                                        >
                                            <PlusCircleOutlined
                                                style={{
                                                    fontSize: 20,
                                                    paddingRight: 5,
                                                    paddingLeft: 5,
                                                    color: '#1890ff'
                                                }}
                                                onClick={() => {
                                                    addOptions(index, 'add');
                                                }}
                                            />
                                            <MinusCircleOutlined
                                                style={{
                                                    fontSize: 20,
                                                    color: '#ff4d4f'
                                                }}
                                                onClick={() => {
                                                    addOptions(index, 'remove');
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.item}>
                            <p>3、风险问卷题目设置</p>
                            {issueRender()}
                            {isView ? null : (
                                <div className={styles.issue} onClick={() => addIssue()}>
                                    +新增问题
                                </div>
                            )}
                        </div>
                        <div className={styles.item}>
                            <p>4、投资者风险承受能力设定</p>
                            {/*<div className={styles.part4Title}>*/}
                            {/*    <span>合格投资者最低分值为</span>*/}
                            {/*    <Input*/}
                            {/*        value={scoreVale}*/}
                            {/*        onInput={e => setScoreVale(e.target.value)}*/}
                            {/*        style={{width: 100, margin: '0 8px'}}*/}
                            {/*        disabled={isView}*/}
                            {/*    />*/}
                            {/*    <span>备注:低于该分值的客户无法注册</span>*/}
                            {/*</div>*/}
                            {abilityJsonArray.map((item, index) => (
                                <div className={styles.part4Content} key={index}>
                                    <div className={styles.part4ContentItem}>
                                        <span>风险等级{index + 1}：</span>
                                        <Input
                                            // disabled={isView}
                                            disabled
                                            style={{ width: 100 }}
                                            value={item.riskText}
                                            onInput={(e) =>
                                                risklevelItemChange(
                                                    index,
                                                    'riskText',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.part4ContentItem}>
                                        <span>最小分值：</span>
                                        <Input
                                            type="number"
                                            disabled={isView}
                                            style={{ width: 100 }}
                                            value={item.minScore}
                                            onChange={(e) =>
                                                risklevelItemChange(
                                                    index,
                                                    'minScore',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.part4ContentItem}>
                                        <span>最大分值：</span>
                                        <Input
                                            type="number"
                                            disabled={isView}
                                            style={{ width: 100 }}
                                            value={item.maxScore}
                                            onChange={(e) =>
                                                risklevelItemChange(
                                                    index,
                                                    'maxScore',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className={styles.part4ContentItem}>
                                        <span>匹配产品等级：</span>
                                        <Input
                                            // disabled={isView}
                                            disabled
                                            style={{ width: 100 }}
                                            value={item.productRiskText}
                                            onInput={(e) =>
                                                risklevelItemChange(
                                                    index,
                                                    'productRiskText',
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                    <div
                                        className={styles.part4ContentItem}
                                        style={{
                                            visibility: isView ? 'hidden' : 'unset',
                                            display: 'none'
                                        }}
                                    >
                                        <PlusCircleOutlined
                                            style={{
                                                fontSize: 20,
                                                paddingRight: 5,
                                                paddingLeft: 5,
                                                color: '#1890ff'
                                            }}
                                            onClick={() => {
                                                addRiskLevel(index, 'add');
                                            }}
                                        />
                                        <MinusCircleOutlined
                                            style={{
                                                fontSize: 20,
                                                color: '#ff4d4f'
                                            }}
                                            onClick={() => {
                                                addRiskLevel(index, 'remove');
                                            }}
                                        />
                                    </div>
                                    <div className={styles.part4ContentItem}>
                                        <span className={styles.editStar} onClick={() => toggle(item)}>编辑星级</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.item}>
                            <p>5、风险测评结果确认书</p>
                            <div>
                                <BraftEditor
                                    value={braftEditorData.bookContent}
                                    readOnly={isView}
                                    controls={[]}
                                    onChange={(e) => {
                                        setBraftEditorData({
                                            ...braftEditorData,
                                            bookContent: e.toHTML()
                                        });
                                    }}
                                    contentStyle={{
                                        height: 200
                                    }}
                                    style={{
                                        marginLeft: 22,
                                        border: '1px solid #000'
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </Card>
                {props.location.query.showOperation ? (
                    <Card title="信息记录" className={styles.card}>
                        <div>
                            <span>操作人员：</span>
                            <Input
                                style={{ width: 400 }}
                                disabled
                                value={operationInfo.managerUserName}
                            />
                        </div>
                        <span
                            style={{
                                paddingLeft: 70,
                                color: 'rgb(136,136,136)',
                                paddingTop: 8,
                                paddingBottom: 8
                            }}
                        >
                            每次修改均记录修改人员信息
                        </span>
                        <div>
                            <span>操作时间：</span>
                            <Input
                                style={{ width: 400 }}
                                disabled
                                value={
                                    operationInfo.updateTime
                                        ? moment(operationInfo.updateTime).format(
                                            'YYYY-MM-DD HH:mm:ss',
                                        )
                                        : ''
                                }
                            />
                        </div>
                    </Card>
                ) : null}
                {isView ? null : (
                    <div
                        className={styles.btnGBox}
                        style={{
                            display: authEdit ? '' : 'none'
                        }}
                    >
                        <div>
                            <Button>取消</Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    submit('save');
                                }}
                            >
                                保存
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => {
                                    submit('PUSH');
                                }}
                            >
                                发布
                            </Button>
                        </div>
                        <span>保存后允许再次编辑，发布后不可以编辑</span>
                    </div>
                )}
            </Spin>
            <EditStarModal
                isModalVisible={isModalVisible}
                record={partFourItem}
                onCancel={toggle}
                onOk={handleOk}
            />
        </PageHeaderWrapper>
    );
};

export default connect(({ risk, loading }) => ({
    risk,
    loading1: loading.effects['risk/createRiskAsk'],
    loading2: loading.effects['risk/queryRiskAskDetail'],
    loading3: loading.effects['risk/updateRiskAsk'],
    loading4: loading.effects['risk/queryVersionNumber'],
    loading5: loading.effects['risk/queryQuestionnaires'],
    copyLoading: loading.effects['risk/copySave']
}))(Template);
