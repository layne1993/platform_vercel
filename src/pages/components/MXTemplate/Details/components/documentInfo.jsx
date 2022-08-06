import {
    Button, Card, Form, Input, Row, Col, Upload, Alert, notification, Spin, Modal, Affix, Radio
} from 'antd';
import React, { Component, Fragment } from 'react';
import { connect, history } from 'umi';
import { Rnd } from 'react-rnd';
import { UploadOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import managerCommon from '@/assets/managerCommon.png';
import managerPrivate from '@/assets/managerPrivate.png';
import mechanismCommon from '@/assets/mechanismCommon.png';
import mechanismPrivate from '@/assets/mechanismPrivate.png';
import naturalPerson from '@/assets/naturalPerson.png';
import moment from 'moment';
import { getCookie, getParams } from '@/utils/utils';
import styles from '../style.less';
import OnLineDoc from './onLineDoc';

const FormItem = Form.Item;
const { confirm } = Modal;
const Enable = {
    bottom: false,
    bottomLeft: false,
    bottomRight: false,
    left: false,
    right: false,
    top: false,
    topLeft: false,
    topRight: false
};

const authority = window.localStorage.getItem('antd-pro-authority');


const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message, description, placement, duration: duration || 3
    });
};



const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 7
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 12
        },
        md: {
            span: 10
        }
    }
};


class templateDocumentInfo extends Component {
    state = {
        signInfos: [], // 操作的数据
        confirmed: [], // 章的数据
        originImgsPath: '',
        pdfPageNums: 0,
        pageNum: 1,
        cutSize: '',
        showForceBox: false, // 显示出放阅读区
        managerC: false,
        managerP: false,
        preson: false,
        mechanismC: false,
        mechanismP: false, // 点击放置之后禁用掉按钮
        textChapter:false,
        sealNum: [0, 0, 0, 0, 0, 0, 0],
        showModal: false, // 上传文件的loading
        showWait: false,
        forcedReading: {}, // 生成一条强制阅读信息
        showCof: false,
        Code: '',
        powerInfo: {},
        count: 60,
        liked: true,
        originSignInfo: [],      // 查询详情时用印列表
        imgUrl: null,  //图片的地址
        docType: 1,
        confirmTxtModal:false, //确认文字模态框
        confirmInpVal:''       //确认文字模态框input输入框值
    };

    componentDidMount() {
        const { baseInfo: { documentJsonObject, templateType } } = this.props;
        let documentInfo = {};
        if (documentJsonObject) {
            documentInfo = JSON.parse(documentJsonObject);
        }
        const signInfos = documentInfo.signInfo || [];
        // console.log(documentInfo.signInfo)
        let tempArr = signInfos.filter((item) => {
            return Number(item.signType) !== 10 && Number(item.signType) !== 11;
        });

        this.setState({
            signInfos: tempArr,
            originSignInfo: documentInfo.signInfo && [].concat(documentInfo.signInfo),
            originImgsPath: `${documentInfo.originImgsPath}` || '',
            pdfPageNums: documentInfo.pdfPageNums || '',
            cutSize: documentInfo.cutSize || '',
            showWait: documentJsonObject,
            originUrlPdf: `${documentInfo.signUrlPdf || documentInfo.originUrlPdf}` || '',
            docType: templateType ? templateType : 1
        });
        // console.log(baseInfo.pdfPageNums)
        this.calculationSeal(tempArr);
        // if (authority.indexOf(312) !== -1) {
        //     this.  ();
        // }
        this.getPdfUrl();
    }

    getPdfUrl = (page) => {
        const { dispatch, baseInfo } = this.props;
        console.log(baseInfo);
        if (baseInfo.documentId) {
            dispatch({
                type: 'templateDetails/getPdfUrl',
                payload: { documentId: baseInfo.documentId, page: page || 1 },
                callback: (res) => {
                    if (res.code === 1008) {
                        this.setState({
                            imgUrl: res.data
                        });
                        console.log(res.data);
                    }
                }
            });
        }
    }

    /**
     * @description: 倒计时
     * @param {*}
     */
    countDown() {
        const { count } = this.state;
        if (count === 1) {
            this.setState({
                count: 60,
                liked: true
            });
        } else {
            this.setState({
                count: count - 1,
                liked: false
            });
            setTimeout(this.countDown.bind(this), 1000);
        }
    }




    sealChapter = (parameter) => {
        const { sealNum } = this.state;
        if (parameter === 1 && sealNum[1] === 0) {
            openNotification('warning', '提醒', '您还未设置管理人公章');
            return false;
        }
        if (parameter === 2 && sealNum[2] === 0) {
            openNotification('warning', '提醒', '您还未设置管理人私章');
            return false;
        }
        if (parameter === 1) {
            openNotification('warning', '提醒', '请先读取公章');
            return false;
        }
        if (parameter === 2) {
            openNotification('warning', '提醒', '请先读取私章');
            return false;
        }
        this.sealAction(parameter);
        return true;
    }

    //  获取密钥
    sealAction = (cusType) => {
        const { dispatch, baseInfo } = this.props;
        const signCert = this.infoContent;
        const params = {};
        params.sealType = cusType;
        params.signCert = signCert;
        dispatch({
            type: 'templateDetails/getManagerSignContract',
            payload: {
                productDocumentId: baseInfo.id,
                ...params,
                documentJsonObject: baseInfo.documentJsonObject
            }, callback: (res) => {
                if (res.code === 1008) {
                    const resJson = res.data;
                    this.sealContractAction(cusType, resJson);
                } else {
                    const warningText = res.message || res.data || '用印失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });

    }

    //  盖章
    sealContractAction = (type, resJson) => {
        const { dispatch, baseInfo } = this.props;
        const { signatureAttr } = resJson;
        // console.log(signatureAttr);
        try {
            const signature = this.CryptoAgent.SignHashMsgPKCS7Detached(signatureAttr, 'SHA-256');
            if (!signature) {
                this.getLasstErrorDesc(type);
            }
            dispatch({
                type: 'templateDetails/managerContractSign',
                payload: {
                    ...resJson,
                    signatureAttr: signature,
                    documentJsonObject: baseInfo.documentJsonObject
                }, callback: (res) => {
                    if (res.code === 1008) {
                        openNotification('success', '提醒', '已成功用印');
                        const { data: { documentJsonObject } } = res;
                        let documentInfo;
                        if (documentJsonObject) {
                            documentInfo = JSON.parse(documentJsonObject);
                        }

                        const signInfos = documentInfo.signInfo || [];
                        let tempArr = signInfos.filter((item) => {
                            return Number(item.signType) !== 10 && Number(item.signType) !== 11;
                        });
                        this.setState({
                            signInfos: tempArr,
                            originImgsPath: `${documentInfo.originImgsPath}` || '',
                            pdfPageNums: documentInfo.pdfPageNums || '',
                            cutSize: documentInfo.cutSize || ''
                        });
                    } else {
                        const warningText = res.message || res.data || '用印失败，请稍后再试！';
                        openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                    }
                }
            });
            // console.log(signature)
        } catch (err) {
            // console.log(err)
        }
    }

    // 图片上一页
    onPrev = () => {
        const { pageNum } = this.state;
        if (Number(pageNum) === 1) return;
        this.setState({
            pageNum: pageNum - 1
        });
        this.getPdfUrl(pageNum - 1);
    };

    // 图片下一页
    onNext = () => {
        const { pageNum, pdfPageNums } = this.state;
        if (Number(pageNum) === Number(pdfPageNums)) return;
        this.setState({
            pageNum: Number(pageNum) + 1
        });
        this.getPdfUrl(Number(pageNum) + 1);
    };

    nextConfim = () => {
        const { signInfos, pageNum } = this.state;
        let nextPage = 0;
        signInfos.sort((a, b) => Number(a.pageNum) - Number(b.pageNum));
        for (let i = 0; i < signInfos.length; i++) {
            const item = signInfos[i];
            if (item.pageNum > pageNum) {
                nextPage = Number(item.pageNum);
                break;
            }
        }
        if (nextPage === 0) {
            nextPage = signInfos.length > 0 ? Number(signInfos[0].pageNum) : pageNum;
        }
        if (nextPage) {
            this.getPdfUrl(Number(nextPage));
        }
        this.setNowPage(nextPage);

    }

    setNowPage = (page) => {
        this.setState({
            pageNum: page
        });
    }

    // 获取托管段文件
    readHosting = () => {
        openNotification('warning', '提醒', '托管端暂无拟定文件');
    }

    // 保存按钮
    saveSealInfo = () => {
        const { sealNum, signInfos, docType } = this.state;
        const { dispatch, baseInfo, baseInfo: { documentJsonObject = '{}' } } = this.props;
        const documentInfo = JSON.parse(documentJsonObject);
        // console.log(documentInfo)
        documentInfo.signInfo = signInfos;
        // if (sealNum[0] === 0) {
        //   return openNotification('warning', '提醒', '您还未设置强制阅读区域')
        // }
        if (sealNum[1] > 0 && !baseInfo.officialSignStatus) {
            return openNotification('warning', '提醒', '您设置了管理人公章,但未用印');
        }
        if (sealNum[2] > 0 && !baseInfo.personalSignStatus) {
            return openNotification('warning', '提醒', '您设置了管理人私章,但未用印');
        }
        // if (sealNum[3] === 0) {
        //   return openNotification('warning', '提醒', '您还未设置自然人投资者章')
        // }
        // if (sealNum[4] === 0) {
        //   return openNotification('warning', '提醒', '您还未设置机构投资者公章')
        // }
        // if (sealNum[5] === 0) {
        //   return openNotification('warning', '提醒', '您还未设置机构投资者私章')
        // }

        dispatch({
            type: 'templateDetails/newAddTemplate',
            payload: {
                ...baseInfo,
                documentJsonObject: JSON.stringify(documentInfo),
                templateType: docType,
                publishStatus: 0
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {
                    openNotification('success', '保存成功', res.message, 'topRight');
                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
        return true;
    }

    // 显示出强制阅读区域
    discharge = () => {
        this.setState({
            showForceBox: true
        });
    }

    // 记录强制阅读区域拖动终止信息
    handleStop = (e, d) => {
        const { forcedReading } = this.state;
        forcedReading.positionLeft = d.x;
        forcedReading.positionTop = 842 - d.y;
        forcedReading.width = forcedReading.width || 400;
        forcedReading.height = forcedReading.height || 100;
        this.setState({
            forcedReading
        });
    }

    // 记录强制阅读区域缩放终止信息
    handleResizeStop = (e, direction, ref, delta, position) => {
        const { forcedReading } = this.state;
        forcedReading.positionLeft = position.x;
        forcedReading.positionTop = 842 - position.y;
        forcedReading.width = ref.offsetWidth;
        forcedReading.height = ref.offsetHeight;
        this.setState({
            forcedReading
        });
    }

    // 确定放置强制阅读区域
    finalized = (e) => {
        if (e) {
            const { pageNum, forcedReading, signInfos } = this.state;
            forcedReading.pageNum = pageNum;
            forcedReading.signType = '13';
            forcedReading.signContent = '强制阅读区域';
            forcedReading.investerType = '';
            signInfos.push(forcedReading);
            this.calculationSeal(signInfos);
            this.setState({
                signInfos
            });
        }
        this.setState({
            showForceBox: false,
            forcedReading: {}
        });
    }

    // 生成章的信息
    releaseChapter = (signType, investerType) => {
        const { confirmed } = this.state;
        if (signType === '1') {
            confirmed.push({ signType: '1', investerType: '', width: 80, height: 80, signContent: '管理人公章'});
            this.setState({
                managerC: true
            });
        } else if (signType === '2') {
            confirmed.push({ signType: '2', investerType: '', width: 80, height: 80, signContent: '管理人私章' });
            this.setState({
                managerP: true
            });
        } else if (signType === '3') {
            if (investerType === '1') {
                confirmed.push({ signType: '3', investerType: '1', width: 80, height: 80, signContent: '自然人投资自者章' });
                this.setState({
                    preson: true
                });
            } else {
                confirmed.push({ signType: '3', investerType: '2', width: 80, height: 80, signContent: '机构投资者公章' });
                this.setState({
                    mechanismC: true
                });
            }
        } else if (signType === '4') {
            confirmed.push({ signType: '4', investerType: '1', width: 80, height: 80, signContent: '机构投资者私章' });
            this.setState({
                mechanismP: true
            });
        } else if (signType === '14') {
            confirmed.push({ signType: '14', investerType: '', width: 'auto', height: 'auto', signContent: this.state.confirmInpVal });
            this.setState({
                textChapter: true
            });
        }
        this.setState({
            confirmed
        });
    }

    //  放章确定 或者取消
    confirmationSeal = (yn, index, item) => {
        // console.log(yn,index,item)
        // return;
        const { signInfos, confirmed } = this.state;
        const { dispatch, baseInfo: { documentJsonObject = '{}' } } = this.props;
        const documentInfo = JSON.parse(documentJsonObject);
        if (item.signType === '1') {
            this.setState({
                managerC: false
            });
        } else if (item.signType === '2') {
            this.setState({
                managerP: false
            });
        } else if (item.signType === '3') {
            if (item.investerType === '1') {
                this.setState({
                    preson: false
                });
            } else {
                this.setState({
                    mechanismC: false
                });
            }
        } else if (item.signType === '4') {
            this.setState({
                mechanismP: false
            });
        }else if(item.signType === '14'){
            this.setState({
                textChapter: false
            });

        }
        if (yn) {
            signInfos.push(item);
        }
        this.setState({
            signInfos
        });
        documentInfo.signInfo = signInfos;
        dispatch({
            type: 'templateDetails/saveUploadFile',
            payload: { data: documentInfo }
        });
        confirmed.splice(index, 1, null);
        this.calculationSeal(signInfos);
    }

    // 放章记录坐标
    handleSealStop = (e, d, info) => {
        const { confirmed, pageNum } = this.state;
        // confirmed.map((itemT) => (itemT.signType === info.signType && itemT.investerType === info.investerType ?
        //   (itemT.positionLeft = d.x, itemT.positionTop = 842 - d.y, itemT.pageNum = pageNum) : null))
        confirmed.map((itemT) => {
            if (itemT && (itemT.signType === info.signType && itemT.investerType === info.investerType)) {
                itemT.positionLeft = d.x;
                itemT.positionTop = 842 - d.y;
                itemT.pageNum = pageNum;
            }
            return itemT;
        });
        this.setState({
            confirmed
        });
    }

    // 删除这个章
    deletealready = (e) => {
        const { signInfos } = this.state;
        signInfos.splice(e, 1);
        this.calculationSeal(signInfos);
        this.setState({
            signInfos
        });
    }

    // 计算盖章个数
    calculationSeal = (signInfos) => {
        const sealNum = [0, 0, 0, 0, 0, 0, 0];
        // console.log(signInfos)
        signInfos.map((item) => {
            if (item.signType === '13') {
                sealNum[0] += 1;
            }
            if (item.signType === '1') {
                sealNum[1] += 1;
            }
            if (item.signType === '2') {
                sealNum[2] += 1;
            }
            if (item.signType === '3' && item.investerType === '1') {
                sealNum[3] += 1;
            }
            if (item.signType === '3' && item.investerType === '2') {
                sealNum[4] += 1;
            }
            if (item.signType === '4' && item.investerType === '1') {
                sealNum[5] += 1;
            }
            if(item.signType === '14'){
                sealNum[6] += 1;
            }
            return true;
        });
        this.setState({ sealNum });
    }

    // 监听上传成功或失败
    handleFileChange = (e) => {
        const { dispatch } = this.props;
        this.setState({
            showModal: true
        });
        // console.log(e)
        const { file } = e;
        if (file.status === 'uploading' || file.status === 'removed') {
            return;
        }
        if (file.status === 'done') {
            if (file.response.code === 1008) {
                this.setState({
                    showModal: false
                });
                openNotification('success', '提醒', '上传成功');
                let tempArr = file.response.data.signInfos && file.response.data.signInfos.filter((item) => {
                    return Number(item.signType) !== 10 && Number(item.signType) !== 11;
                });
                this.setState({
                    originImgsPath: `${file.response.data.originImgsPath}` || '',
                    pdfPageNums: file.response.data.pdfPageNums || '',
                    cutSize: file.response.data.cutSize || '',
                    signInfos: tempArr || [],
                    showWait: true,
                    pageNum: 1,
                    sealNum: [0, 0, 0, 0, 0, 0, 0]
                });
                dispatch({
                    type: 'templateDetails/saveUploadFile',
                    payload: { data: file.response.data, delete: 1 }
                });
                this.getPdfUrl();
            } else {
                this.setState({
                    showModal: false
                });
                openNotification('warning', '提醒', '上传失败');
            }
        }
    }

    // input 跳转页码
    PageJump = (e) => {
        const { pdfPageNums } = this.state;
        const val = Number(e.target.value);

        if (val > 0 && val <= Number(pdfPageNums)) {
            this.setState({
                pageNum: e.target.value
            });
            this.getPdfUrl(e.target.value);
        }
    }



    // 尾页
    lastPage = (e) => {
        const { pdfPageNums } = this.state;
        this.setState({
            pageNum: pdfPageNums
        });
        this.getPdfUrl(pdfPageNums);
    }

    ContractSeal = () => {
        const { Code, codeInfo, signInfos, pageNum } = this.state;
        const { dispatch, baseInfo, baseInfo: { documentJsonObject = '{}' }, templateDetails: { documentType } } = this.props;
        const documentInfo = JSON.parse(documentJsonObject);
        // console.log(documentInfo)
        documentInfo.signInfo = signInfos;
        if (!Code) {
            openNotification('warning', '提醒', '请输入验证码');
            return false;
        }
        dispatch({
            type: 'templateDetails/managerSign',
            payload: {
                checkCode: Code,
                // checkCode: '419651',
                // projectCode: 'V-16150087587601689',
                documentId: baseInfo.documentId,
                projectCode: codeInfo && codeInfo.projectCode,
                documentJsonObject: JSON.stringify(documentInfo)
            },
            callback: (res) => {
                if (res && res.code === 1008 && res.data) {

                    const documentJsonObject1 = res.data.documentJsonObject;
                    let documentInfo1 = [];
                    if (documentJsonObject1) {
                        documentInfo1 = JSON.parse(documentJsonObject1);
                    }

                    const signInfos1 = documentInfo1.signInfo || [];
                    this.setState({
                        showCof: false,
                        signInfos: signInfos1,
                        originSignInfo: documentInfo1.signInfo && [].concat(documentInfo1.signInfo),
                        originImgsPath: `${documentInfo1.originImgsPath}` || '',
                        pdfPageNums: documentInfo1.pdfPageNums || '',
                        cutSize: documentInfo1.cutSize || ''
                    });
                    this.getPdfUrl(pageNum);
                    openNotification('success', '用印成功', res.message, 'topRight');
                    this.getPdfUrl(pageNum);
                    // 创建产品合同或者风险揭示书成功不需要再强制同时创建产品合同和风险揭示书
                    // if ((res.data.documentType === 3 && res.data.lackDocumentType === 1) || (res.data.documentType === 1 && res.data.lackDocumentType === 3)) {// 只有在创建产品合同或者风险揭示书的时候弹窗
                    //     this.tipsModal(res.data.productId, res.data.lackDocumentType, res.data.productName);
                    // }

                } else {
                    const warningText = res.message || res.data || '保存失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
        return true;
    }

    tipsModal = (id, lackDocumentType, productName) => {
        const { baseInfo, handleChange } = this.props;
        let tips = '';
        let content = '';
        // 缺少的文档类型 1:产品合同,2:补充协议,3:风险揭示书,4:产品说明书
        if (lackDocumentType === 3) {
            tips = `“${productName}产品合同”已经创建完毕`; content = '该产品还需要创建“风险揭示书”才可以使用电子合同签约，请点击确认创建';
        }
        if (lackDocumentType === 1) {
            tips = `“${productName}风险揭示书”已经创建完毕`; content = '该产品还需要创建“产品合同”才可以使用电子合同签约，请点击确认创建';
        }
        confirm({
            title: tips,
            icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
            content: content,
            okText: '确认',
            cancelText: '取消',
            onOk() {
                const { type } = getParams();
                if (type === 'productTab') {
                    history.replace(
                        `/product/list/details/${id}/template/0?proId=${id}&type=${type}&lackType=${lackDocumentType}`,
                    );
                } else {
                    history.replace(
                        `/raisingInfo/template/templateList/detail/0?proId=${id}&lackType=${lackDocumentType}`,
                    );
                }
                // history.replace(
                //     `/template/detail/0?proId=${id}&lackType=${lackDocumentType}`,
                // );
                handleChange('tab1');
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
        //“产品名风险揭示书”已经创建完毕
        //该产品还需要创建“产品合同”才可以使用电子合同签约，请点击确认创建揭示书
    }
    getCode = () => {
        const { Code, liked } = this.state;
        const { dispatch } = this.props;
        if (!liked) {
            return;
        }
        dispatch({
            type: 'templateDetails/sendCfcaSignMobileCode',
            payload: Code,
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    this.countDown();
                    this.setState({
                        codeInfo: res.data
                    });
                    openNotification('success', '提示', '获取验证码成功', 'topRight');
                } else {
                    const warningText = res.message || res.data || '获取验证码失败，请稍后再试！';
                    openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                }
            }
        });
        // alert('没接口')
        return true;
    }

    mangerSeal = () => {

        const { sealNum, pageNum } = this.state;
        // console.log('sealNum', sealNum);
        if (sealNum[1] === 0 && sealNum[2] === 0) {
            return openNotification('warning', '提醒', '请设置管理人章后再用印');
        }

        this.setState({ showCof: true });

        return true;
    }

    // 强制发布
    mandatoryRelease = () => {
        const { signInfos, docType } = this.state;
        const { dispatch, baseInfo, baseInfo: { documentJsonObject = '{}' } } = this.props;
        const documentInfo = JSON.parse(documentJsonObject);
        documentInfo.signInfo = signInfos;

        confirm({
            title: '请确认是否强制发布?',
            icon: <ExclamationCircleOutlined />,
            content: '强制发布，不判断任何用印信息是否完备，请谨慎使用！',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'templateDetails/newAddTemplate',
                    payload: {
                        ...baseInfo,
                        documentJsonObject: JSON.stringify(documentInfo),
                        templateType: docType,
                        mandatoryRelease: 1
                    },
                    callback: (res) => {
                        if (res && res.code === 1008 && res.data) {
                            openNotification('success', '强制发布成功', res.message, 'topRight');
                        } else {
                            const warningText = res.message || res.data || '强制发布失败，请稍后再试！';
                            openNotification('warning', `提示（代码：${res.code}）`, warningText, 'topRight');
                        }
                    }
                });
            },
            onCancel() {
                // console.log('Cancel');
            }
        });
    }
    // 下载当前文档

    // downLoadFile = ()=>{
    //   const {originUrlPdf} = this.state;
    //   window.location.href=originUrlPdf
    // }

    docTypeChange = (e) => {
        this.setState({
            docType: e.target.value
        });
    }

    //显示确认文字模态框
    showTxtModal = () => {
        this.setState({
            confirmTxtModal:true
        });
    }
    TxtBoxHandleOk = () => {
        this.setState({
            confirmTxtModal:false
        });
        this.releaseChapter('14', '');
    }
    TxtBoxHandleCancel = () => {
        this.setState({
            confirmTxtModal:false
        });
    }
    fillBtnHandle = (event) => {
        this.setState({
            confirmInpVal:event.currentTarget.value
        });
    }

    render() {
        const { docType, imgUrl, originUrlPdf, powerInfo, showCof, forcedReading, showWait, showModal, sealNum, signInfos, pageNum, originImgsPath, cutSize, pdfPageNums, showForceBox, managerC, managerP, mechanismC, mechanismP, textChapter, preson, confirmed, liked, count, originSignInfo } = this.state;
        const { baseInfo, Submitt, codeLoading, sealLoading } = this.props;
        const parameter = {
            attachmentsId: baseInfo.attachmentsId || '',
            documentId: baseInfo.documentId || '',
            codeType: baseInfo.documentType === 1 && 112 || baseInfo.documentType === 2 && 113 || baseInfo.documentType === 3 && 111 || baseInfo.documentType === 4 && 107 || baseInfo.documentType === 5 && 149
        };
        if (baseInfo.attachmentsId) {
            parameter.attachmentsId = baseInfo.attachmentsId;
        }
        console.log(confirmed);
        return (
            <Fragment>
                <Modal
                    title="提示"
                    visible={this.state.confirmTxtModal}
                    onOk={this.TxtBoxHandleOk}
                    onCancel={this.TxtBoxHandleCancel}
                    okButtonProps={{ disabled: this.state.confirmInpVal ? false : true }}
                >
                    <p>请输入需要投资者在文档中确认的文字</p>
                    <p>
                        <Button onClick={this.fillBtnHandle} value="阅读" type="primary" style={{ marginRight: 8 }}>填充为：阅读</Button>
                        <Button onClick={this.fillBtnHandle} value="知晓" type="primary">填充为：知晓</Button>
                    </p>
                    <p>
                        <Input
                            placeholder="不能为空"
                            value={this.state.confirmInpVal}
                            onChange={(e) => {
                                this.setState({
                                    confirmInpVal:e.currentTarget.value
                                });
                            }}
                        />
                    </p>
                    <p>必填，例如：阅读，知晓，我已同意之类的话语</p>
                </Modal>
                <Modal
                    visible={showModal}
                    footer={null}
                    closable={false}
                    centered
                    width={200}
                    keyboard={false}
                    maskClosable={false}
                >
                    文件上传中...
                    <Spin spinning size="large" />
                </Modal>

                <Modal
                    bodyStyle={{
                        height: 350,
                        textAlign: 'center'
                    }}
                    visible={showCof}
                    footer={null}
                    keyboard={false}
                    maskClosable={false}
                    onCancel={() => (this.setState({ showCof: false }))}
                    className={styles.sealModal}
                >
                    <h3>用印信息</h3>
                    <div style={{ marginTop: 40 }}>
                        <h4 style={{ textAlign: 'left', marginBottom: 20 }}>请填写验证码<span></span></h4>
                        <Input
                            className={styles.inputHeight}
                            style={{ width: 280 }}
                            addonAfter={
                                <Button
                                    type="link"
                                    loading={codeLoading}
                                    onClick={this.getCode}
                                    disabled={!liked}
                                >
                                    {
                                        liked ? '获取验证码' : `${count} 秒后重发`
                                    }

                                </Button>}
                            onChange={(e) => (this.setState({ Code: e.target.value }))}
                        />
                    </div>
                    {/* <h4 style={{ textAlign: 'left', marginTop: 10 }}>当前场景设置的管理人章：</h4> */}
                    {/* <div className={styles.sealWrapper}>
                        <div className={styles.sealName} title="dddddd">公章名称:默认章</div>
                        <div className={styles.sealName} title="eeeeee">私章名称:默认章</div>
                    </div> */}
                    <Button loading={sealLoading} onClick={this.ContractSeal} type="primary" style={{ marginTop: 50 }}>合同用印</Button>
                </Modal>
                <Row className={styles.uploadStyle}>
                    <Col span={18}>
                        <span>文档维护：</span>
                        <Radio.Group onChange={this.docTypeChange} value={docType} disabled={baseInfo.publishStatus === 1 || baseInfo.publishStatus === 0}>
                            <Radio value={1}>文件上传</Radio>
                            <Radio value={2}>在线文档</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                {
                    docType === 1 ?
                        <Row>
                            <Col span={18}>
                                <div className={styles.uploadStyle}>
                                    {
                                        this.props.authEdit &&
                                        '上传协议文件：'
                                    }
                                    <Upload
                                        name="file"
                                        action={`${BASE_PATH.adminUrl}/product/document/uploadDocumentFile`}
                                        headers={{
                                            tokenId: getCookie('vipAdminToken')
                                        }}
                                        showUploadList={false}
                                        accept=".pdf"
                                        data={parameter}
                                        // beforeUpload={this.beforeUpload}
                                        onChange={this.handleFileChange}
                                    >
                                        {/* <Button disabled={Object.keys(baseInfo).length < 1 || !powerInfo.isEdit}> */}
                                        {
                                            this.props.authEdit &&
                                            <Button disabled={Object.keys(baseInfo).length < 1}>
                                                <UploadOutlined /> 上传文件
                                            </Button>
                                        }
                                    </Upload>
                                    {
                                        this.props.authEdit &&
                                        <p className={styles.uploadStyleP}>支持扩展名：.pdf</p>
                                    }

                                </div>

                                {
                                    showWait ? <>
                                        <div className={styles.fileInfo}>
                                            <div className={styles.fileImg} id="fileInfoBox">
                                                {
                                                    showForceBox ?
                                                        <Rnd
                                                            default={{
                                                                x: 100,
                                                                y: 100,
                                                                width: 400,
                                                                height: 100
                                                            }}
                                                            minWidth={50}
                                                            minHeight={20}
                                                            bounds="#fileInfoBox"
                                                            style={{ border: '2px dashed #93B4FB', zIndex: 99 }}
                                                            onDragStop={(e, d) => { this.handleStop(e, d); }}
                                                            onResize={(e, direction, ref, delta, position) => { this.handleResizeStop(e, direction, ref, delta, position); }}
                                                        >
                                                            <div className={styles.deleteOkBox} style={{ top: forcedReading.height || 100 }}>
                                                                <button type="button" onClick={() => this.finalized(1)}>确定</button>
                                                                <button type="button" onClick={() => this.finalized(0)}>删除</button>
                                                            </div>
                                                        </Rnd> : null
                                                }
                                                {
                                                    confirmed.map((item, index) =>
                                                        item && <Rnd
                                                            key={index}
                                                            default={{
                                                                x: 200,
                                                                y: 200,
                                                                width: item.signType === '3' ? item.width + 110 : item.width,
                                                                height: item.height
                                                            }}
                                                            enableResizing={Enable}
                                                            bounds="#fileInfoBox"
                                                            style={{ zIndex: 99}}
                                                            onDragStop={(e, d) => { this.handleSealStop(e, d, item); }}
                                                        >
                                                            <div style={{ position: 'relative' }}>
                                                                {
                                                                    item.signType !== '14' ?
                                                                        <Fragment>
                                                                            <div style={{position: 'absolute', width: item.width, height: item.height, zIndex: 999}}/>
                                                                            <img src={item.signType === '1' ? managerCommon : item.signType === '2' ? managerPrivate : item.signType === '3' && item.investerType === '1' ? naturalPerson : item.signType === '3' && item.investerType === '2' ? mechanismCommon : item.signType === '4' ? mechanismPrivate : null} style={{width: item.width, height: item.height, border: '1px dashed #ccc'}} alt="" />
                                                                        </Fragment> :
                                                                        <span style={{minWidth:80, border: '1px dashed #ccc', color:'#ED1C24', fontWeight:'bold',  display:'block' }}>{item.signContent}</span>
                                                                }
                                                            </div>

                                                            <div className={styles.sealdeleteOkBox}>
                                                                <button type="button" onClick={() => this.confirmationSeal(1, index, item)}>确定</button>
                                                                <button type="button" onClick={() => this.confirmationSeal(0, index, item)}>删除</button>
                                                            </div>
                                                            {
                                                                item.signType === '3' && <div style={{position:'absolute', bottom:0, left:item.width, fontSize:12, width:110, border:'1px solid red'}}>签署时间:xxxx-xx-xx</div>
                                                            }

                                                        </Rnd>)
                                                }
                                                <img width={595} height={842} src={imgUrl} alt="" />
                                            </div>
                                            {
                                                signInfos.map((item, i) => (
                                                    item.pageNum == pageNum ? (
                                                        item.signType === '13' ? <div key={i} style={{ position: 'absolute', width: Number(item.width), height: Number(item.height), top: (842 - item.positionTop), left: (item.positionLeft), border: '2px dashed #93b4fb' }}><a className={styles.Deleted} style={{ top: Number(item.height) - 3 }} onClick={() => this.deletealready(i, item.signType, item.investerType)}>删除</a></div>
                                                            : item.signType === '1' && baseInfo.officialSignStatus ? null
                                                                : item.signType === '2' && baseInfo.personalSignStatus ? null
                                                                    : item.signType === '14' ? <div key={i} style={{ position: 'absolute', top: (842 - item.positionTop), left: (item.positionLeft), border: '1px dashed #ccc', minWidth: 80, color:'#ED1C24', fontWeight:'bold'}} >{item.signContent}<a className={styles.Deleted} style={{ top: 22 }} onClick={() => this.deletealready(i, item.signType, item.investerType)}>删除</a></div>
                                                                        : <div key={i} style={{ position: 'absolute', top: (842 - item.positionTop), left: (item.positionLeft-4), border: '1px dashed #ccc', width: item.width, height: item.height }} ><img style={{ width: Number(item.width), height: Number(item.height) }} src={item.signType === '1' ? managerCommon : item.signType === '2' ? managerPrivate : item.signType === '3' && item.investerType === '1' ? naturalPerson : item.signType === '3' && item.investerType === '2' ? mechanismCommon : mechanismPrivate} /><a className={styles.Deleted} style={{ top: Number(item.height) }} onClick={() => this.deletealready(i, item.signType, item.investerType)}>删除</a>{item.signType === '3' && <div style={{position:'absolute', bottom:0, left:item.width && Number(item.width) || 80, fontSize:12, width:110, border:'1px solid red'}}>签署时间:xxxx-xx-xx</div>}</div>

                                                    ) : null
                                                ))
                                            }
                                            <div className={styles.btn}>
                                                <Button type="primary" disabled={pageNum == 1} onClick={this.onPrev}>
                                                    上一页
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    disabled={pageNum == pdfPageNums}
                                                    onClick={this.onNext}
                                                >
                                                    下一页
                                                </Button>
                                                <Button
                                                    type="primary"
                                                    onClick={this.nextConfim}
                                                    className={styles.nextConfim}
                                                >
                                                    <span>下一确认项{pageNum}/{pdfPageNums}</span>
                                                </Button>

                                                <Button
                                                    type="primary"
                                                    disabled={pageNum == pdfPageNums}
                                                    onClick={this.lastPage}
                                                >
                                                    尾页
                                                </Button>


                                                <div style={{ width: 35, textAlign: 'center', paddingLeft: 7 }}>
                                                    第
                                                    <Input onBlur={this.PageJump} style={{ marginTop: 5, marginBottom: 5 }} />
                                            页
                                                </div>

                                            </div>
                                        </div>
                                        <Alert
                                            description={
                                                <div>
                                                    <p>1、强制阅读区域：{sealNum[0]}处</p>
                                                    <p>2、管理人用印：公章{sealNum[1]}处、私章{sealNum[2]}处</p>
                                                    <p>3、自然人投资者用印：{sealNum[3]}处</p>
                                                    <p>4、机构投资者用印：公章{sealNum[4]}处、私章{sealNum[5]}处</p>
                                                    {
                                                        baseInfo.documentType == 1 ? <p>5、确认文字章：{sealNum[6]}处</p>:null
                                                    }

                                                </div>
                                            }
                                            type="info"
                                            showIcon
                                            className={styles.promptInfo}
                                        />
                                        <Form
                                            hideRequiredMark
                                            scrollToFirstError
                                            className={styles.stepForm}
                                        >
                                            <Card title="修改信息记录" bordered={false}>
                                                <FormItem
                                                    {...formItemLayout}
                                                    label="最后修改人员"
                                                    extra="每次修改均记录修改人员信息"
                                                >
                                                    <Input placeholder="请输入最后修改人员" disabled value={baseInfo.userName} />
                                                </FormItem>

                                                <FormItem
                                                    {...formItemLayout}
                                                    label="最后修改时间"
                                                >
                                                    <Input placeholder="请输入最后修改时间" disabled value={baseInfo.updateTime ? moment(baseInfo.updateTime).format('YYYY/MM/DD HH:mm') : '--'} />
                                                </FormItem>
                                            </Card>
                                            {
                                                this.props.authEdit &&
                                                <FormItem label=" " colon={false} className={styles.operateBtn}>
                                                    <Button type="primary"
                                                        // disabled={!powerInfo.isEdit}
                                                        disabled={baseInfo.publishStatus === 1}
                                                        style={{ marginRight: 10, marginLeft: 10 }}
                                                        onClick={this.saveSealInfo}
                                                        loading={Submitt}
                                                    >
                                                        保 存
                                                    </Button>
                                                    <Button
                                                        type="primary"
                                                        // disabled={!powerInfo.isEdit}
                                                        disabled={baseInfo.publishStatus === 1}
                                                        onClick={this.mangerSeal}
                                                    >
                                                        用印
                                                    </Button>
                                                    <span className={styles.sealTips}>用印后该协议生效</span>
                                                    <Button
                                                        danger
                                                        disabled={baseInfo.publishStatus === 1}
                                                        onClick={this.mandatoryRelease}
                                                    >
                                                        强制发布
                                                    </Button>
                                                    {
                                                        powerInfo.isExport ? <Button type="primary" style={{ marginLeft: 10 }}><a style={{ color: '#fff' }} href={originUrlPdf} download="模板" target="_blank">下载文档</a></Button> : null
                                                    }
                                                    {/* <Button style={{ marginLeft: 12 }} type="primary" onClick={this.goback}>
                                                返回
                                                </Button> */}
                                                </FormItem>
                                            }
                                        </Form>
                                    </>
                                        :
                                        <div className={styles.nofiles}>
                                            {
                                                Object.keys(baseInfo).length < 1 ? '请先填写基本信息并保存...' : '请上传文件...'
                                            }
                                        </div>
                                }
                            </Col>

                            {
                                showWait ? <Col span={6}>
                                    <Affix className={styles.borderstyle}>
                                        <Card bordered={false} title={<h4>配置模板信息:</h4>} className={styles.dashedButton}>
                                            <div>
                                                <Button onClick={this.discharge} disabled={showForceBox}>强制阅读区域</Button>
                                                <p>使用数：{sealNum[0]}</p>
                                            </div>
                                            <div className={styles.positionStyle}>
                                                <div style={{ marginRight: 8 }}>
                                                    <Button onClick={() => this.releaseChapter('1', '')} disabled={managerC || baseInfo.officialSignStatus}>管理人公章</Button>
                                                    <p>使用数：{sealNum[1]}</p>
                                                </div>
                                                <div>
                                                    <Button onClick={() => this.releaseChapter('2', '')} disabled={managerP || baseInfo.personalSignStatus}>管理人私章</Button>
                                                    <p>使用数：{sealNum[2]}</p>
                                                </div>
                                            </div>
                                            <div style={{ marginTop: 8 }}>
                                                <Button onClick={() => this.releaseChapter('3', '1')} disabled={preson}>自然人投资者章</Button>
                                                <p>使用数：{sealNum[3]}</p>
                                            </div>

                                            <div className={styles.positionStyle}>
                                                <div style={{ marginRight: 8 }}>
                                                    <Button onClick={() => this.releaseChapter('3', '2')} disabled={mechanismC}>机构投资者公章</Button>
                                                    <p>使用数：{sealNum[4]}</p>
                                                </div>
                                                <div>
                                                    <Button onClick={() => this.releaseChapter('4', '1')} disabled={mechanismP}>机构投资者私章</Button>
                                                    <p>使用数：{sealNum[5]}</p>
                                                </div>
                                            </div>
                                            {
                                                baseInfo.documentType == 1 ?<div className={styles.positionStyle}>
                                                    <div>
                                                        <Button onClick={this.showTxtModal} disabled={textChapter}>确认文字章</Button>
                                                        <p>使用数：{sealNum[6]}</p>
                                                    </div>
                                                </div>:null
                                            }
                                        </Card>
                                    </Affix >
                                </Col> : null
                            }
                        </Row>
                        :
                        <OnLineDoc
                            baseInfo={baseInfo}
                            docType={docType}
                        />
                }

            </Fragment >
        );
    }
}

export default connect(({ templateDetails, loading }) => ({
    templateDetails,
    baseInfo: templateDetails.baseInfo,
    Submitt: loading.effects['templateDetails/newAddTemplate'],
    loading: loading.effects['templateDetails/getTemplateInfo'],
    codeLoading: loading.effects['templateDetails/sendCfcaSignMobileCode'],
    sealLoading: loading.effects['templateDetails/managerSign']
}))(templateDocumentInfo);
