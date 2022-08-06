import React, { Component } from 'react';
import BraftEditor from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import 'braft-editor/dist/index.css';
import moment from 'moment';
import { connect, Link, history } from 'umi';
import { UploadOutlined, MessageOutlined, MailOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { moduleListData, moduleTypeData, moduleCustomerTypeData, XWAccountType } from '@/utils/publicData';
import {
    Card,
    Button,
    Form,
    Row,
    Col,
    Checkbox,
    Radio,
    DatePicker,
    Input,
    Select,
    Divider,
    notification,
    TimePicker,
    Upload,
    Modal,
    Spin,
    Space,
    InputNumber,
    message
} from 'antd';
import ModuleList from './components/ModuleList';
import { getRandomKey, getElementToPageTop } from '@/utils/utils';
import { multipartUpload } from './utils/ossUtils';
import CustomerList from './components/CustomerList';
import AdministratorList from './components/AdministratorList';
import Mailbox from '../components/Mailbox';
import SMSModal from './components/SMSModal';
import styles from './style.less';
import { getCookie, getPermission } from '@/utils/utils';
import { isArguments, cloneDeep, isEmpty } from 'lodash';
const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const { authEdit, authExport } = getPermission(75000);

// 通知类型的评率
const NOTIFYFREQUENCY = [
    {
        label: '按月发送',
        value: '2'
    },
    {
        label: '按周发送',
        value: '1'
    },
    {
        label: '按日发送',
        value: '0'
    }
];

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

function setModalTop() {
    const mediaBtn = document.querySelector('.media.button');
    setTimeout(() => {
        const mediaModal = document.querySelector('.bf-modal-content');
        if (mediaModal) {
            if (window.location.hostname === 'localhost') return;
            const modalTop = getElementToPageTop(mediaBtn) - 240;
            mediaModal.style.top = `${modalTop}px`;
        }
    }, 200);
}
@connect(({ tempForm, loading }) => ({
    tempForm,
    loading: loading.effects['tempForm/getTemplateForm'],
    submitting: loading.effects['tempForm/submitTemplateForm'],
    lsitLoading: loading.effects['tempForm/getCustomerList'],
    emailLoading: loading.effects['tempForm/getEmailForm'],
    emailSubmitting: loading.effects['tempForm/submitEmailForm'],
    moduleLoding: loading.effects['tempForm/getNoticeTemplate'],
    getAdminLoading: loading.effects['tempForm/getAdminUserList']
}))
class TemplateForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkAll: [],
            tmepList: [],
            productList: [],
            modalVisible: false,
            smsModalVisible: false,
            mailboxVisible: false,
            timeSelectFlag: false,
            isUseMessageProduct: false,
            isUseEmailProduct: false,
            frequencyType: '1',
            frequencyList: [],
            mailboxTop: '',
            modalTop: '',
            focusKey: null,
            marketingServiceCode: 0,
            serviceTool: [1, 2],
            sendType: 2,
            children: [],
            productChildren: [],
            riskStyleChildren: [],
            customerAllList: [],
            emailType: 2,
            emailSetting: {
                emailSettingStatus: 1, //  0:未设置过, 1:使用自定义邮箱, 2:使用易私募邮箱
                userName: '', //  邮箱登录账号
                password: '', //  邮箱登录密码
                host: '', //  邮箱服务器
                type: '' //  邮箱类型
            },
            submitData: {},
            fileList: [],
            modalFLag: false,
            isContinue: false,
            modalMsg: '',
            uploadIdList: [], //上传文件id列表
            permissions: [], //用户权限code列表
            customerType: 1, //用来区分客户类型 1为普通用户, 0为管理员
            moduleType: 2, //用来区分模板类型 1为内置模板, 2为自定义模板
            editorState: BraftEditor.createEditorState(null), //BraftEditor的默认值
            adminUserList: [],
            isAsPost: false, //选择管理人是否按岗位划分
            isChooseAll: false, //营销服务对象是否选择所有人
            noticeTemplateType: 0, //通知模板类型
            positionStatus: '', //岗位类型 0客户经理 1产品经理 2运营
            allAdminUserList: [], //所有的管理人列表
            moduleKey: '', //模板名称类型
            moduleCustomerType: '',
            productDisabled:false,
            productEmailDisabled:false
        };
        this.myAdministratorList = null;
    }
    // static getDerivedStateFromProps(nextProps, prevState) {
    //   console.log('nextProps', nextProps, prevState);
    // }
    componentDidMount() {
        const {
            dispatch,
            match: { params }
        } = this.props;
        const { children, productChildren, riskStyleChildren } = this.state;
        const { setFieldsValue, resetFields } = this.searchFormRef.current;
        const setFieldsValueEmail = this.searchFormEmailRef.current.setFieldsValue;
        let { marketingServiceCode } = this.state;
        const mediaBtn = document.querySelector('.media.button');

        if (mediaBtn) {
            mediaBtn.addEventListener('click', setModalTop);
        }
        if(params.templateCode === '0'){
            dispatch({
                type:'tempForm/clearData'
            });
        }
        // 查询通配符列表
        dispatch({
            type: 'tempForm/getMarketingWildcardList',
            payload: {},
            callback: (res1) => {
                if (res1.code === 1008) {
                    const tmepList = res1.data || [];
                    this.setState({ tmepList });
                }
            }
        });
        //  查询现持有产品列表
        dispatch({
            type: 'tempForm/getProductList',
            // payload: { companyCode: 1111 },
            callback: (res1) => {
                if (res1.code === 1008) {
                    const productList = res1.data || [];
                    productList.map((item) =>
                        productChildren.push(
                            <Option
                                key={item.ProductCode}
                                title={item.ProductName}
                                value={item.ProductCode}
                            >
                                {item.ProductName}
                            </Option>,
                        ),
                    );
                    this.setState({
                        productChildren,
                        productList
                    });
                }
            }
        });

        //获取管理员列表
        dispatch({
            type: 'tempForm/getAdminUserList',
            payload: {},
            callback: (res) => {
                const { data = {}, code } = res;
                if (code === 1008) {
                    this.setState({
                        adminUserList: data.list || []
                    });
                }
            }
        });
        //  查询风险等级列表
        dispatch({
            type: 'tempForm/getRiskStyleList',
            payload: { customerState: 0 },
            callback: (res1) => {
                if (res1.code === 1008) {
                    const riskStyleList = res1.data || [];
                    riskStyleList.map((item) =>
                        riskStyleChildren.push(
                            <Option
                                key={getRandomKey(7)}
                                title={item.riskStyleName}
                                value={item.riskStyleName || '--'}
                            >
                                {item.riskStyleName || '--'}
                            </Option>,
                        ),
                    );
                    this.setState({
                        riskStyleChildren
                    });
                }
            }
        });
        //这里是新建的时候, templateCode的值为0
        if (params.templateCode && params.templateCode === '0') {
            this.getAllCustomerList();
        }
        //当查看短信邮件通知时， type值为1 和 2
        if (params.templateCode && params.templateCode !== '0' && params.type !== '3') {
            marketingServiceCode = params.templateCode;
            let serviceType = params.serviceType;
            //  查询全部营销服务对象列表
            dispatch({
                type: 'tempForm/getTemplateForm',
                payload: {
                    marketingServiceCode,
                    serviceType
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        const { data } = res;
                        const serviceTool = [];
                        const { emailServiceJson = {}, messageServiceJson = {} } = data;
                        if (data.isUseMessage) {
                            serviceTool.push(1);
                        }
                        if (data.isUseEmail) {
                            serviceTool.push(2);
                        }
                        let dateObj = JSON.parse(data.noticeTimeSetting);
                        console.log(messageServiceJson);

                        //这里由于时两个Form表单， 要解构对应的api方法使用
                        setFieldsValue({
                            marketingServiceName: messageServiceJson
                                ? messageServiceJson.marketingServiceName
                                : emailServiceJson.marketingServiceName,

                            // customerList:
                            //   data.customerList === 'all'
                            //     ? ['all']
                            //     : this.transfromCustomerList(data.customerListStr),
                            serviceTool,
                            noticeType: data.noticeType,
                            noticeTime: data.noticeTime ? moment(data.noticeTime) : null,
                            notifyFrequency: !!dateObj ? String(dateObj.frequence) : '',
                            triggerDate: !!dateObj ? dateObj.day : '',
                            triggerTime:
                                !!dateObj && dateObj.time ? moment(dateObj.time, 'HH:mm:ss') : null,
                            advanceDay: String(data.advanceDay) ? data.advanceDay : 1,
                            advanceTime: data.noticeTime
                                ? moment(data.noticeTime)
                                : moment(110000, 'HH:mm:ss'),
                            marketingServiceObject: String(data.marketingServiceObject)
                                ? data.marketingServiceObject
                                : 1,
                            customerPost: data.positionStatus
                                ? 2
                                : data.marketingServiceObject === 0 &&
                                  data.customerListStr === 'all'
                                    ? 3
                                    : data.marketingServiceObject === 1 &&
                                  data.customerListStr === 'all'
                                        ? 2
                                        : 1
                        });

                        this.setState({
                            productDisabled:messageServiceJson && messageServiceJson.productSelectedAll === 1 || messageServiceJson && messageServiceJson.productSelectedAll && messageServiceJson.productSelectedAll.toString() === '1',
                            productEmailDisabled:emailServiceJson && emailServiceJson.productSelectedAll === 1 || emailServiceJson && emailServiceJson.productSelectedAll && emailServiceJson.productSelectedAll.toString() === '1'
                        });

                        if (data.marketingServiceObject === 1) {
                            this.getAllCustomerList().then(() => {
                                setFieldsValue({
                                    customerList:
                                        data.customerListStr === 'all'
                                            ? ['all']
                                            : this.transfromCustomerList(data.customerListStr)
                                });
                            });
                        } else if (data.positionStatus) {
                            let arr = [];
                            XWAccountType.map((item) => (
                                arr.push(<Option value={item.value} key={item.key}>
                                    {item.label}
                                </Option>)
                            ));
                            this.setState({
                                children: arr,
                                positionStatus: data.positionStatus ? data.positionStatus : ''
                            });
                            setFieldsValue({
                                customerList: data.positionStatus
                                    ? data.positionStatus.split(',')
                                    : ''
                            });
                        } else {
                            this.getAllAdmin().then(() => {
                                setFieldsValue({
                                    customerList:
                                        data.customerListStr === 'all'
                                            ? ['all']
                                            : this.transfromCustomerList(data.customerListStr)
                                });
                            });
                        }
                        setFieldsValueEmail({
                            productSelectedAll:messageServiceJson && messageServiceJson.productSelectedAll === 1 ? ['1'] : [],
                            productEmailSelectedAll:emailServiceJson && emailServiceJson.productSelectedAll === 1 ? ['1'] : [],
                            otherEmail: emailServiceJson ? emailServiceJson.otherEmail : '',
                            emailSubject: emailServiceJson ? emailServiceJson.subject : '',
                            emailContent: BraftEditor.createEditorState(
                                emailServiceJson ? emailServiceJson.content : '',
                            ),
                            msgContent: messageServiceJson ? messageServiceJson.content : '',
                            otherMobile: messageServiceJson ? messageServiceJson.otherMobile : '',
                            messageProductName: messageServiceJson
                                ? this.transfromCustomerList(messageServiceJson.product)
                                : [],
                            mailProductName: emailServiceJson
                                ? this.transfromCustomerList(emailServiceJson.product)
                                : []
                        });
                        // if (data.isUseWechat) {
                        //   serviceTool.push(0);
                        // };

                        const isUseMessageProduct =
                            data.messageServiceJson &&
                            this.getIsHasKeyWildcard(data.messageServiceJson.content, 2);
                        const isUseEmailProduct =
                            (data.emailServiceJson &&
                                this.getIsHasKeyWildcard(data.emailServiceJson.subject, 3)) ||
                            (data.emailServiceJson &&
                                this.getIsHasKeyWildcard(data.emailServiceJson.content, 3));
                        this.setState({
                            marketingServiceCode,
                            serviceTool,
                            sendType: data.noticeType,
                            isUseEmailProduct,
                            isUseMessageProduct,
                            timeSelectFlag: true,
                            checkAll: data.customerList === 'all' ? ['all'] : [],
                            fileList: data.attachmentList
                                ? this.setFileList(data.attachmentList)
                                : this.setFileList('[]'),
                            customerType: String(data.marketingServiceObject)
                                ? data.marketingServiceObject
                                : 1,
                            isAsPost: data.positionStatus ? true : false,
                            moduleKey:
                                data.noticeTemplateType === 0
                                    ? ''
                                    : data.noticeTemplateType === 1
                                        ? 'birthday'
                                        : data.noticeTemplateType === 2
                                            ? 'risk'
                                            : 'certificate',
                            noticeTemplateType: data.noticeTemplateType || 0,
                            isChooseAll: data.customerListStr === 'all' ? true : false,
                            moduleType: data.noticeType === 4 ? 1 : undefined
                        });
                        const noticeSetting = JSON.parse(data.noticeTimeSetting);
                        !!noticeSetting &&
                            this.notifyFrequencyChange(String(noticeSetting.frequence), 1);
                    } else {
                        openNotification('error', `失败（${res.code}）`, res.message, 'topRight');
                    }
                }
            });
        }
        //当点击查看通知模板时， 区分值时type值为3
        if (params.templateCode && params.templateCode !== '0' && params.type === '3') {
            marketingServiceCode = params.templateCode;
            dispatch({
                type: 'tempForm/getNoticeTemplate',
                payload: {
                    marketingServiceCode
                },
                callback: (res) => {
                    if (res.code === 1008) {
                        const { data } = res;
                        const serviceTool = [];
                        const dtaJson = data[0];
                        // console.log('dtaJson', dtaJson);
                        // if (dtaJson.isUseWechat) {
                        //   serviceTool.push(0);
                        // };
                        if (dtaJson.isUseMessage) {
                            serviceTool.push(1);
                        }
                        if (dtaJson.isUseEmail) {
                            serviceTool.push(2);
                        }
                        // const wechatServiceJson = dtaJson.wechatServiceJson ? JSON.parse(dtaJson.wechatServiceJson) : {};
                        const messageServiceJson = dtaJson.messageServiceJson
                            ? JSON.parse(dtaJson.messageServiceJson)
                            : {};
                        const emailServiceJson = dtaJson.emailServiceJson
                            ? JSON.parse(dtaJson.emailServiceJson)
                            : {};
                        let dateObj = JSON.parse(dtaJson.noticeTimeSetting);
                        setFieldsValue({
                            marketingServiceName: dtaJson.marketingServiceName || '',
                            // customerList: dtaJson.positionStatus
                            //   ? this.transfromCustomerList(dtaJson.positionStatus)
                            //   : dtaJson.customerList === 'all'
                            //   ? ['all']
                            //   : this.transfromCustomerList(dtaJson.customerList),
                            serviceTool,
                            noticeType: dtaJson.noticeType,
                            noticeTime: dtaJson.noticeTime ? moment(dtaJson.noticeTime) : null,
                            notifyFrequency: String(dateObj.frequence),
                            triggerDate: dateObj.triggerDate,
                            advanceDay: String(dtaJson.advanceDay) ? dtaJson.advanceDay : 1,
                            advanceTime: dtaJson.noticeTimeSetting
                                ? moment(JSON.parse(dtaJson.noticeTimeSetting).time, 'HH:mm:ss')
                                : moment(110000, 'HH:mm:ss'),
                            marketingServiceObject: String(dtaJson.marketingServiceObject)
                                ? dtaJson.marketingServiceObject
                                : 1,
                            customerPost: dtaJson.positionStatus
                                ? 2
                                : dtaJson.marketingServiceObject === 0 &&
                                  dtaJson.customerList === 'all'
                                    ? 3
                                    : dtaJson.marketingServiceObject === 1 &&
                                  dtaJson.customerList === 'all'
                                        ? 2
                                        : 1
                        });
                        if (dtaJson.marketingServiceObject === 1) {
                            this.getAllCustomerList().then(() => {
                                setFieldsValue({
                                    customerList:
                                        dtaJson.customerList === 'all'
                                            ? ['all']
                                            : this.transfromCustomerList(dtaJson.customerList)
                                });
                            });
                        } else if (dtaJson.positionStatus) {
                            let arr = [];
                            XWAccountType.map((item) => (
                                arr.push(<Option value={item.value} key={item.key}>
                                    {item.label}
                                </Option>)
                            ));
                            this.setState({
                                children: arr,
                                positionStatus: dtaJson.positionStatus
                                    ? dtaJson.positionStatus
                                    : ''
                            });
                            setFieldsValue({
                                customerList: dtaJson.positionStatus
                                    ? dtaJson.positionStatus.split(',')
                                    : ''
                            });
                        } else {
                            this.getAllAdmin().then(() => {
                                setFieldsValue({
                                    customerList:
                                        dtaJson.customerList === 'all'
                                            ? ['all']
                                            : this.transfromCustomerList(dtaJson.customerList)
                                });
                            });
                        }

                        setFieldsValueEmail({
                            msgContent: messageServiceJson ? messageServiceJson.content : '',
                            otherMobile: messageServiceJson ? messageServiceJson.otherMobile : '',
                            otherEmail: emailServiceJson ? emailServiceJson.otherEmail : '',
                            emailSubject: emailServiceJson ? emailServiceJson.subject : '',
                            emailContent: BraftEditor.createEditorState(
                                emailServiceJson ? emailServiceJson.content : '',
                            ),
                            messageProductName: messageServiceJson
                                ? this.transfromCustomerList(messageServiceJson.product)
                                : [],
                            mailProductName: emailServiceJson
                                ? this.transfromCustomerList(emailServiceJson.product)
                                : []
                        });
                        const isUseMessageProduct = this.getIsHasKeyWildcard(
                            messageServiceJson.content,
                            2,
                        );
                        const isUseEmailProduct =
                            this.getIsHasKeyWildcard(emailServiceJson.subject, 3) ||
                            this.getIsHasKeyWildcard(emailServiceJson.content, 3);
                        this.setState({
                            marketingServiceCode,
                            serviceTool,
                            sendType: dtaJson.noticeType,
                            moduleType: dtaJson.noticeType === 4 ? 1 : undefined,
                            timeSelectFlag: true,
                            isUseEmailProduct,
                            isUseMessageProduct,
                            checkAll: dtaJson.customerList === 'all' ? ['all'] : [],
                            fileList: this.setFileList(
                                dtaJson.attachmentList ? dtaJson.attachmentList : '[]',
                            ),
                            customerType: String(dtaJson.marketingServiceObject)
                                ? dtaJson.marketingServiceObject
                                : 1,
                            isAsPost: dtaJson.positionStatus ? true : false,
                            moduleKey:
                                dtaJson.noticeTemplateType === 0
                                    ? ''
                                    : dtaJson.noticeTemplateType === 1
                                        ? 'birthday'
                                        : dtaJson.noticeTemplateType === 2
                                            ? 'risk'
                                            : 'certificate',
                            noticeTemplateType: dtaJson.noticeTemplateType || 0,
                            isChooseAll: dtaJson.customerList === 'all' ? true : false
                        });
                        const noticeSetting =
                            dtaJson.noticeTimeSetting && JSON.parse(dtaJson.noticeTimeSetting);
                        this.notifyFrequencyChange(String(noticeSetting.frequence), 1);
                        // setFields({''})
                    } else {
                        openNotification('error', `失败（${res.code}）`, res.message, 'topRight');
                    }
                }
            });
        }
    }

    componentWillUnmount() {
        const mediaBtn = document.querySelector('.media.button');
        if (mediaBtn) {
            mediaBtn.removeEventListener('click', setModalTop);
        }
        const { dispatch } = this.props;
        dispatch({
            type: 'tempForm/clearData'
        });
    }

    // componentDidUpdate(){
    //     const {tempForm, match:{params}, dispatch} = this.props;
    //     if(params.templateCode === '0' && !tempForm.marketingServiceName){

    //     }
    // }

    // static getDerivedStateFromProps(nextProps) {
    //     const {tempForm, match:{params}, dispatch} = nextProps;
    //     if(params.templateCode === '0' && !tempForm.marketingServiceName){
    //         dispatch({
    //             type: 'tempForm/clearData'
    //         });
    //     }
    //     console.log(nextProps);
    //     // clean state
    //     // if (nextProps.selectedRows.length === 0) {
    //     //     const needTotalList = initTotalList(nextProps.columns);
    //     //     return {
    //     //         selectedRowKeys: [],
    //     //         needTotalList
    //     //     };
    //     // }
    //     // return null;
    // }

    searchFormRef = React.createRef();
    searchFormEmailRef = React.createRef();

    /**
     * @description 获取所有的客户列表
     */
    getAllCustomerList = () => {
        const { dispatch } = this.props;
        const { children } = this.state;
        return dispatch({
            type: 'tempForm/getCustomerList',
            payload: { sourceType: -1 },
            callback: (res1) => {
                if (res1.code === 1008) {
                    const { data = [] } = res1;
                    data.map((item) =>
                        children.push(
                            <Option key={item.CustomerCode} value={item.CustomerCode}>
                                {item.CustomerName}
                            </Option>,
                        ),
                    );
                    children.unshift(
                        <Option key="all" value="all">
                            全部
                        </Option>,
                    );
                    this.setState({
                        children,
                        customerAllList: data
                    });
                } else {
                    const warningText =
                        res1.message || res1.data || '营销服务对象列表获取失败，请刷新页面重试！';
                    openNotification(
                        'warning',
                        `提示（错误代码：${res1.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    // 获取管理员list
    getAllAdmin = () => {
        const { dispatch } = this.props;
        let children = [];
        //获取管理员列表
        return dispatch({
            type: 'tempForm/getAdminUserList',
            payload: { pageSize: 99999, pageNo: 1 },
            callback: (res) => {
                const { data = {}, code } = res;
                if (code === 1008) {
                    this.setState({
                        adminUserList: data.list || [],
                        allAdminUserList: data.list || []
                    });
                    let list = data.list;
                    Array.isArray(list) &&
                        list.map((item) =>
                            children.push(
                                <Option key={item.id} value={item.id}>
                                    {item.userName}
                                </Option>,
                            ),
                        );
                    children.unshift(
                        <Option key="all" value="all">
                            全部
                        </Option>,
                    );
                    this.setState({
                        children
                    });
                }
            }
        });
    };
    /**
     * @description 将字符串转为数组供select使用
     * @param str {string}: 需要转换的字符串
     * @return {array} 返回转换后的数组
     */
    transfromCustomerList = (str) => {
        if (/,/.test(str)) {
            let tempArr = str.split(',');
            let res = tempArr.map((item) => Number(item));
            return res;
        } else if (str === 'all') {
            return ['all'];
        } else {
            return [Number(str)];
        }
    };
    // 获取是否包含关键key
    // eslint-disable-next-line react/sort-comp

    getIsHasKeyWildcard = (str, type) => {
        let wildcardFlag;
        if (
            str &&
            (str.indexOf('productFullName') > -1 ||
                str.indexOf('netValue') > -1 ||
                str.indexOf('AcumulateNetValue') > -1)
        ) {
            if (type === 2) {
                wildcardFlag = true;
            } else if (type === 3) {
                wildcardFlag = true;
            }
        } else {
            wildcardFlag = false;
        }
        return wildcardFlag;
    };
    onToolChange = (serviceTool) => {
        this.setState({
            serviceTool
        });
    };
    handleModalVisible = (flag, rowKeys, type) => {
        //   console.log(type, 'ttt');
        if (type === 1) {
            this.setState({
                modalVisible: !!flag
            });
            //隐藏弹框时不调用接口
            !!flag && this.getAllCustomerList();
        } else if (type === 0) {
            this.setState({
                administratorListVisible: !!flag
            });
            //隐藏弹框时不调用接口
            !!flag && this.getAllAdmin();
            //这里type为3直接写死
        } else if (type === 2) {
            this.setState({
                administratorListVisible: !!flag
            });
            let arr = [];
            XWAccountType.map((item) => (
                arr.push(<Option value={item.value} key={item.key}>
                    {item.label}
                </Option>)
            ));
            this.setState({
                children: arr,
                positionStatus: rowKeys ? rowKeys.join(',') : ''
            });
        }
        if (rowKeys) {
            const { setFieldsValue } = this.searchFormRef.current;
            setFieldsValue({ customerList: rowKeys });
            this.setState({ checkAll: [] });
        }
    };

    checkAll = (e) => {
        const { setFieldsValue } = this.searchFormRef.current;
        if (e && e.length === 1) {
            setFieldsValue({ customerList: ['all'] });
            this.setState({ checkAll: ['all'] });
        } else {
            setFieldsValue({ customerList: [] });
            this.setState({ checkAll: [] });
        }
    };

    handleSMSVisible = (flag) => {
        let { modalTop } = this.state;
        if (flag) {
            const el = document.getElementById('msgContent');
            if (window.location.hostname !== 'localhost') modalTop = getElementToPageTop(el) - 185;
        }
        this.setState({
            smsModalVisible: !!flag,
            modalTop
        });
    };

    onSendChange = (e) => {
        this.setState({
            sendType: e.target.value
        });
        if (e.target.value !== '0') {
            this.setState({
                timeSelectFlag: false
            });
        }
    };

    notifyFrequencyChange = (val, from) => {
        let list = [];
        if (val === '1') {
            list = [
                {
                    label: '周一',
                    value: 1
                },
                {
                    label: '周二',
                    value: 2
                },
                {
                    label: '周三',
                    value: 3
                },
                {
                    label: '周四',
                    value: 4
                },
                {
                    label: '周五',
                    value: 5
                },
                {
                    label: '周六',
                    value: 6
                },
                {
                    label: '周日',
                    value: 7
                }
            ];
        } else if (val === '2') {
            for (let i = 0; i < 31; i += 1) {
                list.push({
                    label: `${i + 1}号`,
                    value: i + 1
                });
            }
        } else {
            this.setState({
                timeSelectFlag: true
            });
        }
        this.setState({
            frequencyType: val,
            frequencyList: list
        });
        const { setFieldsValue } = this.searchFormRef.current;
        if (from !== 1) {
            setFieldsValue({ triggerDate: undefined });
        }
    };

    // 当 通知频率为星期或者月时 出发通知的日期
    setTriggerDate = (val) => {
        if (val) {
            this.setState({
                timeSelectFlag: true
            });
        }
    };

    //  获取焦点时，设置输入框id
    focusAction = (e) => {
        const field = e.target.id;
        //   console.log(e, 'fff', field);
        this.setState({ focusKey: field });
    };

    // 失去焦点, focusKey置空
    blurAction = (e) => {
        const target = e.relatedTarget;
        if (target) {
            // 点击通配符按钮, 不置空
            if (target.id.indexOf('customer_name') > -1) return;
        }
        this.setState({ focusKey: '' });
    };

    // 短信失去焦点
    messageBlur = (e) => {
        const target = e.relatedTarget;
        if (target) {
            // 点击通配符按钮, 不置空
            if (target.id.indexOf('messageBtn') > -1) return;
        }
        this.setState({ focusKey: '' });
    };

    // 邮箱失去焦点
    mailBlur = (e) => {
        const target = e.relatedTarget;
        if (target) {
            // 点击通配符按钮, 不置空
            if (target.id.indexOf('mailBtn') > -1) return;
        }
        this.setState({ focusKey: '' });
    };

    mailFocus = () => {
        this.setState({ focusKey: 'emailContent' });
    };

    // 插入通配符
    insertAction = (obj, type) => {
        const { moduleType } = this.state;
        const val = obj.wildcard;
        const productType = obj.type;
        const { focusKey } = this.state;
        //   console.log('obj', obj, 'type:', type, 'focusKey:', focusKey);
        // console.log('obj', focusKey);
        if (focusKey) {
            if (focusKey !== 'emailContent') {
                const { getFieldValue, setFieldsValue } = this.searchFormEmailRef.current;
                const value = `${getFieldValue(focusKey) || ''}${val} `;
                setFieldsValue({ [focusKey]: value });
            } else if (type === 3) {
                const { getFieldValue, setFieldsValue } = this.searchFormEmailRef.current;
                const value = ContentUtils.insertText(getFieldValue('emailContent'), val);
                setFieldsValue({ [focusKey]: value });
            }

            if (type === 1) {
                if (focusKey === 'wechatSubject') {
                    this.subject.focus();
                } else if (focusKey === 'wechatContent') {
                    // this.content.focus();
                }
            } else if (type === 2) {
                if (productType && productType === 2) {
                    this.setState({ isUseMessageProduct: true });
                }
                if (focusKey === 'msgContent') {
                    // this.messageEle.focus();
                }
            } else if (type === 3) {
                if (productType && productType === 2) {
                    this.setState({ isUseEmailProduct: true });
                }
                if (focusKey === 'emailSubject') {
                    this.mailTitle.focus();
                } else if (focusKey === 'emailContent') {
                    // this.mailContent.focus();
                }
            }
        }
    };

    // 回去选中的 产品名称
    getChecktedProductCode = (arr = []) => {
        let str;
        if (arr.includes('all')) {
            str = 'all';
        } else {
            str = arr.join(',');
        }
        if (!str) {
            str = undefined;
        }

        return str;
    };

    // 获取邮件附件
    getAnnexInfo = (arr = []) => {
        const res = [];
        arr.map((item) => res.push({ attachmentUrl: item.url, attachmentName: item.name }));
        return res;
    };

    msgContentChange = (e) => {
        const val = e.target.value || '';
        //   console.log('val', val);
        if (
            (val && val.indexOf('productFullName') > -1) ||
            val.indexOf('netValue') > -1 ||
            val.indexOf('AcumulateNetValue') > -1
        ) {
            this.setState({ isUseMessageProduct: true });
        } else {
            this.setState({ isUseMessageProduct: false });
        }
    };

    emailTitleChange = (e) => {
        const val = e.target.value || '';
        const { getFieldValue } = this.searchFormEmailRef.current;
        const emialContent = getFieldValue('emailContent')
            ? getFieldValue('emailContent').toHTML()
            : '';
        if (
            (val && val.indexOf('productFullName') > -1) ||
            val.indexOf('netValue') > -1 ||
            val.indexOf('AcumulateNetValue') > -1
        ) {
            this.setState({ isUseEmailProduct: true });
        } else if (
            emialContent.indexOf('productFullName') < 0 &&
            emialContent.indexOf('netValue') < 0 &&
            emialContent.indexOf('AcumulateNetValue') < 0
        ) {
            this.setState({ isUseEmailProduct: false });
        }
    };

    emailContentChange = (e) => {
        const val = e.toHTML();
        if (this.searchFormEmailRef && this.searchFormEmailRef.current) {
            const { getFieldValue } = this.searchFormEmailRef.current;
            const emailSubject = getFieldValue('emailSubject') || '';
            if (
                (val && val.indexOf('productFullName') > -1) ||
                val.indexOf('netValue') > -1 ||
                val.indexOf('AcumulateNetValue') > -1
            ) {
                this.setState({ isUseEmailProduct: true });
            } else if (
                emailSubject.indexOf('productFullName') < 0 &&
                emailSubject.indexOf('netValue') < 0 &&
                emailSubject.indexOf('AcumulateNetValue') < 0
            ) {
                this.setState({ isUseEmailProduct: false });
            }
        }
    };

    getCheckBoxValue = (val) => {
        let str;
        if (val) {
            str = val.length === 0 ? '0' : val[0];
        } else {
            str = '0';
        }
        return str;
    };

    setFileList = (arr = []) => {
        let res;
        let tempIdList = [];
        let tempArr = JSON.parse(arr);
        if (Array.isArray(tempArr)) {
            tempArr.map((item) => {
                tempIdList.push(item.attachmentId);
            });
            this.setState({
                uploadIdList: tempIdList
            });
            res = tempArr.map((item) => ({
                name: item.attachmentName,
                url: item.attachmenUrl,
                uid: item.attachmentId,
                status:'done'
                // response: {
                //     data: {
                //         id: item.attachmentId
                //     }
                // }
            }));
        } else {
            tempArr.map((item) => {
                tempIdList.push(item.attachmentId);
            });
            this.setState({
                uploadIdList: tempIdList
            });
            res = JSON.parse(tempArr).map((item) => ({
                name: item.attachmentName,
                url: item.attachmentUrl,
                uid: getRandomKey(3),
                response: {
                    data: {
                        id: item.attachmentId
                    }
                }
            }));
        }
        return res;
    };

    /**
     * @description 保存按钮调用方法
     * @param {*} e
     * @param {*} isContinue
     */
    handleSubmit = (e, isContinue) => {
        // eslint-disable-next-line no-unused-expressions
        e && e.preventDefault();
        const {
            dispatch,
            tempForm: { marketingServiceCode }
        } = this.props;
        const { setFields, validateFields, scrollToField } = this.searchFormRef.current;
        const validateEmailFields = this.searchFormEmailRef.current.validateFields;
        const { fileList, uploadIdList, positionStatus, isAsPost } = this.state;
        // if (!this.isTip('all', '0', 'all', '0', false)) return
        validateEmailFields()
            .then()
            .catch((err) => {
                //   console.log('err', err);
            });
        validateFields()
            .then((values) => {
                console.log(values);
                let valuesObj = { ...values };
                validateEmailFields()
                    .then((emailValues) => {
                        valuesObj = { ...valuesObj, ...emailValues };
                        if (valuesObj.noticeTime) {
                            const timestamp = valuesObj.noticeTime.valueOf();
                            if (timestamp < Date.now()) {
                                setFields({
                                    noticeTime: {
                                        value: valuesObj.noticeTime,
                                        errors: [new Error('该时间已过时，请选择有效的时间')]
                                    }
                                });
                                this.scrollAction('noticeTime');
                                return;
                            }
                        }
                        const paramsObj = { ...valuesObj };
                        const isUseWechat = valuesObj.serviceTool.indexOf(0) > -1 ? 1 : 0;
                        const isUseMessage = valuesObj.serviceTool.indexOf(1) > -1 ? 1 : 0;
                        const isUseEmail = valuesObj.serviceTool.indexOf(2) > -1 ? 1 : 0;
                        const customerList = valuesObj.customerList
                            ? valuesObj.customerList.toString()
                            : valuesObj.customerList;
                        const noticeTime = valuesObj.noticeTime
                            ? valuesObj.noticeTime.format('YYYY-MM-DD HH:mm:ss')
                            : valuesObj.noticeTime;
                        const triggerTime = valuesObj.triggerTime
                            ? valuesObj.triggerTime.format('HH:mm:ss')
                            : null;
                        const advanceTime = valuesObj.advanceTime
                            ? valuesObj.advanceTime.format('HH:mm:ss')
                            : null;
                        const wechatServiceJson = {
                            // otherWeixinID: values.otherWechatList ? values.otherWechatList.toString() : values.otherWechatList,    //  其他关注客户
                            contentJson: {
                                subject: valuesObj.wechatSubject, //  主题
                                content: valuesObj.wechatContent, //  内容
                                url: valuesObj.url //  卡片链接
                            },
                            product: this.getChecktedProductCode(valuesObj.wechartProductName),
                            onlyHolder: this.getCheckBoxValue(valuesObj.wechartIsAll)
                        };
                        const otherMobile = valuesObj.otherMobile
                            ? valuesObj.otherMobile.replace(/\r\n|\s+|，/g, ',')
                            : '';

                        const messageServiceJson = {
                            otherMobile, //  其他手机号,以逗号分隔
                            content: valuesObj.msgContent, //  短信正文
                            product: this.getChecktedProductCode(valuesObj.messageProductName),
                            onlyHolder: this.getCheckBoxValue(valuesObj.messageIsAll),
                            productSelectedAll:valuesObj.productSelectedAll && this.getCheckBoxValue(valuesObj.productSelectedAll)
                        };
                        const otherEmail = valuesObj.otherEmail
                            ? valuesObj.otherEmail.replace(/\r\n|\s+|，/g, ',')
                            : '';
                        const emailContent = valuesObj.emailContent
                            ? valuesObj.emailContent.toHTML()
                            : '';
                        const emailServiceJson = {
                            otherEmail, //  其他邮箱, 以逗号分隔
                            subject: valuesObj.emailSubject, //  邮件标题
                            content: emailContent, //  邮件正文
                            product: this.getChecktedProductCode(valuesObj.mailProductName),
                            onlyHolder: this.getCheckBoxValue(valuesObj.mailIsAll),
                            isSendNetValue: valuesObj.isNetWorth,
                            attachmentList: this.getAnnexInfo(fileList),
                            productSelectedAll:valuesObj.productEmailSelectedAll && this.getCheckBoxValue(valuesObj.productEmailSelectedAll)

                        };
                        delete paramsObj.emailContent;
                        delete paramsObj.serviceTool;
                        delete paramsObj.mailProductName;
                        delete paramsObj.mailIsAll;
                        const payload = {
                            ...paramsObj,
                            marketingServiceCode,
                            isUseWechat,
                            isUseMessage,
                            isUseEmail,
                            customerList: !!isAsPost ? undefined : customerList,
                            noticeTime,
                            wechatServiceJson,
                            messageServiceJson,
                            emailServiceJson,
                            noticeTimeSetting: {
                                frequence: valuesObj.notifyFrequency,
                                day: valuesObj.triggerDate,
                                time: triggerTime || advanceTime
                            },
                            attachments: isEmpty(uploadIdList) ? undefined : uploadIdList.join(','),
                            noticeTemplateType: this.state.noticeTemplateType,
                            positionStatus,
                            advanceTime: undefined,
                            messageIsAll:undefined
                        };
                        if (
                            !this.isTip(
                                this.getChecktedProductCode(valuesObj.messageProductName),
                                this.getCheckBoxValue(valuesObj.messageIsAll),
                                this.getChecktedProductCode(valuesObj.mailProductName),
                                this.getCheckBoxValue(valuesObj.mailIsAll),
                                isContinue,
                            )
                        )
                            return;
                        if (isUseEmail === 1) {
                            // 获取邮箱配置信息
                            dispatch({
                                type: 'tempForm/getEmailForm',
                                payload: {},
                                callback: (res) => {
                                    if (res.code === 1008) {
                                        const { data = {} } = res;
                                        if (data && data.emailSettingStatus === 0) {
                                            //  emailSettingStatus为0时，打开邮箱配置弹窗
                                            this.setState({ submitData: payload });
                                            this.handleMailBoxVisible(true);
                                        } else {
                                            this.saveTemplateForm(payload, marketingServiceCode);
                                        }
                                    } else {
                                        const warningText =
                                            res.message || res.data || '获取邮箱配置信息失败！';
                                        openNotification(
                                            'warning',
                                            `提示（错误代码：${res.code}）`,
                                            warningText,
                                            'bottomRight',
                                        );
                                        this.saveTemplateForm(payload, marketingServiceCode);
                                    }
                                }
                            });
                        } else {
                            this.saveTemplateForm(payload, marketingServiceCode);
                        }
                    })
                    .catch((err) => {
                        //   console.log('err', err);
                    });

                // 选择了全部产品，但未勾选只对该产品持有人发送
            })
            .catch((error) => {
                if (window.location.hostname === 'localhost') return;
                //  滚动到第一个必填的未填项
                const keyArr = Object.keys(error);
                scrollToField(keyArr[0]);
            });
    };

    isTip = (msg, msgAll, email, emailAll, isContinue) => {
        let modalFLag = false;
        let str = '您的';
        let resFlag = true;
        if (msg !== 'all' && email !== 'all') {
            return true;
        }
        if (isContinue) {
            return true;
        }

        if (msg === 'all' && msgAll === '1' && email === 'all' && emailAll === '1') {
            return true;
        }

        if (msg === 'all' && msgAll === '0') {
            modalFLag = true;
            resFlag = false;
            str += '短信';
        }

        if (msg === 'all' && msgAll === '0' && email === 'all' && emailAll === '0') {
            modalFLag = true;
            str += '、邮箱';
            resFlag = false;
        } else if (email === 'all' && emailAll === '0') {
            str += '邮箱';
            resFlag = false;
            modalFLag = true;
        }
        let modalTop;
        if (modalFLag) {
            const el = document.getElementById('saveTemp');
            modalTop = getElementToPageTop(el) - 500;
        }

        str +=
            '服务营销通知选择了全部产品，但未勾选只对该产品持有人发送，可能会向持有人同时发送大量数据，是否确认并继续保存？';
        this.setState({ modalFLag, modalMsg: str, modalTop });
        return resFlag;
    };

    scrollAction = (id) => {
        const el = document.getElementById(id);
        const scrollY = getElementToPageTop(el) - 87;
        window.parent.scrollTo(0, scrollY);
    };

    // 保存营销服务通知
    saveTemplateForm = (payload, marketingServiceCode) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'tempForm/submitTemplateForm',
            payload,
            callback: (res) => {
                if (res.code === 1008) {
                    if (marketingServiceCode === 0 || marketingServiceCode === '0') {
                        // window.parent.location.hash = `saleService/list`;
                        //   history.push('/manager/marketServices/saleService');
                        history.goBack();
                    } else {
                        // openNotification('success', '保存成功', res.message, 'bottomRight');
                        //   history.push('/manager/marketServices/saleService');
                        history.goBack();
                    }
                } else if(res.code === 1036) {
                    Modal.error({
                        title: '敏感词提醒',
                        content: res.message,
                        okText: '继续'
                    });
                } else {
                    openNotification('error', '保存失败', res.message, 'bottomRight');
                }
            }
        });
    };

    // 邮箱编辑弹窗开关
    handleMailBoxVisible = (flag) => {
        let { mailboxTop } = this.state;
        if (flag) {
            const el = document.getElementById('saveTemp');
            if (window.location.hostname !== 'localhost')
                mailboxTop = getElementToPageTop(el) - 500;
        }
        this.setState({
            mailboxTop,
            mailboxVisible: !!flag
        });
    };

    onEmailChange = (e) => {
        this.setState({
            emailType: e.target.value
        });
    };

    //  保存邮箱配置
    handleEmailSubmit = (payload) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'tempForm/submitEmailForm',
            payload,
            callback: (res) => {
                if (res.code === 1008) {
                    this.handleMailBoxVisible(false);
                    const { submitData } = this.state;
                    this.saveTemplateForm(submitData, submitData.marketingServiceCode || 0);
                } else {
                    const warningText = res.message || res.data || '保存邮箱信息失败，请稍后再试！';
                    openNotification(
                        'warning',
                        `提示（错误代码：${res.code}）`,
                        warningText,
                        'topRight',
                    );
                }
            }
        });
    };

    inspectionTime = (rule, value, callback) => {
        const { getFieldValue } = this.searchFormRef.current;
        let advanceDay = getFieldValue('advanceDay');
        if (advanceDay !== 0 && advanceDay) {
            return Promise.resolve();
        }
        if (value) {
            const timestamp = value.valueOf();
            if (timestamp < Date.now()) {
                return Promise.reject('该时间已过时，请选择有效的时间');
            }

            return Promise.resolve();
        }
        return Promise.resolve();
    };

    beforeUpload = () => {
        return false; // return false 手动上传
    };

    handleUploadChange = (info) => {
        const { uid, size, status, name } = info.file;
        //   console.log(info, 'info');
        this.setState({
            fileList: info.fileList
        });
        if (size > 1024 * 1024 * 100) {
            message.error(`附件（${name}）大小超过了100M，请上传小于100M的文件！`);
        } else if (status === 'removed') {
            this.handleRemoveFile(info.file);
        } else if (status === 'done') {
            console.log(info, 'done');
            const {
                response: { data, code }
            } = info.file;
            const { fileList } = this.state;
            console.log(fileList);
            if (code && code === 1008) {
                let tempIdList = cloneDeep(this.state.uploadIdList);
                tempIdList.push(data.attachmentsId);
                // fileList.splice()
                fileList.push({
                    name: `${data.fileName}${data.fileType}`,
                    url: data.baseUrl,
                    uid: data.attachmentsId,
                    status: 'done'
                });
                // let newArr = []
                fileList.map((item, index) => {
                    if (item.response) {
                        // newArr.push(item)
                        fileList.splice(index, 1);
                    }
                });
                this.setState({
                    fileList: fileList,
                    uploadIdList: tempIdList
                });
            } else {
                fileList.map((item, index) => {
                    if (item.response) {
                        fileList.splice(index, 1);
                    }
                });
                this.setState({
                    fileList: fileList
                });
                openNotification('warning', '提醒', '上传失败');
            }
        }
        //   console.log(info.fileList)
        //   const {fileList} = this.state;
        //   this.setState({
        //     fileList: fileList.shift()
        //   })
    };

    // 模糊查询产品
    filterProduct = (inputValue, option) => option.props.children.includes(inputValue);

    //  删除附件
    handleRemoveFile = (file = {}) => {
        console.log('file', file, this.state, 'state');
        //   return;
        const { dispatch } = this.props;
        //   const {
        //       response: { data }
        //   } = file;
        let tempIdList = cloneDeep(this.state.uploadIdList);
        let index = tempIdList.findIndex((item) => item === file.uid);
        tempIdList.splice(index, 1);
        let { fileList } = this.state;
        let tempFileList = fileList.filter((item) => item.uid !== file.uid);
        //调用公共方法删除文件
        //   dispatch({
        //       type: 'tempForm/deleteFile',
        //       payload: {
        //           id: file.uid
        //       }
        //   });
        this.setState({
            fileList: tempFileList,
            uploadIdList: tempIdList
        });
    };
    /**
     * @description 设置客户类型
     * @param e {obj} 事件对象
     */
    handleCustomerChange = (e) => {
        //这里当切换客户类型之后， 将对象select清空
        const { setFieldsValue } = this.searchFormRef.current;
        const { moduleKey } = this.state;
        if (this.myAdministratorList.cleanSelectedKeys) {
            this.myAdministratorList.cleanSelectedKeys();
        }
        !!moduleKey && this.handleFillForm(e.target.value, moduleKey);
        if (moduleKey) {
            let moduleName = `${moduleTypeData[moduleKey]}--${
                moduleCustomerTypeData[e.target.value]
            }`;
            setFieldsValue({
                marketingServiceName: moduleName
            });
            this.setState({
                moduleCustomerType: moduleCustomerTypeData[e.target.value]
            });
        }
        //当切换客户类型时, 设置几个默认值, 清空对象列表, 将岗位都设置为按人员, 清空通知模板
        setFieldsValue({ customerList: [], customerPost: 1 });
        this.setState({
            customerType: e.target.value,
            isAsPost: false,
            //切换用户取消全选
            isChooseAll: false
        });
    };
    /**
     * @description 将对应的模板内容填充到文本中
     * @param value {number} 客户类型
     * @param moduleKey {number} 对应的模板列表的类型
     */
    handleFillForm = (value, moduleKey) => {
        let moduleData = {};
        if (value === 1) {
            moduleData = moduleListData['customer'];
        } else if (value === 0) {
            moduleData = moduleListData['admin'];
        }
        const { setFieldsValue, getFieldValue } = this.searchFormEmailRef.current;
        const messageValue = moduleKey ? moduleData[moduleKey] : '';
        const emailValue = moduleKey
            ? ContentUtils.insertText(this.state.editorState, moduleData[moduleKey])
            : ContentUtils.clear(this.state.editorState);
        setFieldsValue({
            msgContent: messageValue,
            emailContent: emailValue
        });
        this.setState({
            // moduleType: value === 'custom' ? 2 : 1,
            noticeTemplateType: moduleKey === 'birthday' ? 1 : moduleKey === 'risk' ? 2 : 3
        });
    };

    /**
     * @description 选择内置模板还是, 自定义模板
     * @param customerType {number} 客户类型, 普通客户或管理员
     * @param moduleType {number} 内置模板或自定义
     */
    handleChooseModule = (customerType, moduleType) => {
        // this.setState({
        //   noticeTemplateType: 0,
        // });
        if (moduleType === 1) {
            //选择内置模板
            this.setState({
                moduleListVisible: true
            });
        } else if (moduleType === 2) {
            //选择自定义模板
            const { setFieldsValue } = this.searchFormRef.current;
            this.handleFillForm(this.state.customerType, undefined);
            //设置系列默认值
            this.setState({
                sendType: 2,
                moduleType: 2,
                moduleKey: '',
                noticeTemplateType: 0
            });
            setFieldsValue({
                marketingServiceName: '',
                noticeType: 2
            });
        }
    };
    /**
     * @description 当选择完模板后, 点击确认
     * @param value {string} 模板名称
     * @param visible {boolean} 模态框的visible值
     * @param moduleKey {number} 表示模板的类型 生日, 问卷, 证件等
     */
    handleUseModule = (value, visible, moduleKey) => {
        if (!value) {
            this.setState({
                moduleListVisible: !!visible
            });
            return;
        }
        //将模板内容填入文本中
        this.handleFillForm(this.state.customerType, moduleKey);
        const { setFieldsValue } = this.searchFormRef.current;
        this.setState({
            moduleListVisible: !!visible,
            moduleType: 1,
            //类似发送方式
            sendType: 4,
            //模板名称类型
            moduleKey
        });
        setFieldsValue({
            marketingServiceName: value,
            //发送方式
            noticeType: 4
        });
    };

    /**
     * @description 根据不同的类型的服务对象 按不同的人员类型选择
     * @param
     */
    handlePostType = (value) => {
        const { customerType } = this.state;
        const { setFieldsValue } = this.searchFormRef.current;
        if (customerType === 1) {
            if (value === 1) {
                this.setState({
                    isChooseAll: false
                });
                setFieldsValue({
                    customerList: []
                });
            }
            //当选择客户, 并且全部客户的时候
            if (value === 2) {
                this.checkAll(['all']);
                this.setState({
                    isChooseAll: true
                });
            }
        } else if (customerType === 0) {
            //当选择为管理人时, 并且选择按岗位
            if (value === 2 || value === 1) {
                this.setState({
                    isAsPost: value === 2 ? true : false,
                    isChooseAll: false
                });
                setFieldsValue({
                    customerList: []
                });
                //当选择为按人员的时候, 清空岗位的state值
                value === 1 &&
                    this.myAdministratorList.setState({
                        selectedRowKeys: []
                    });
            } else if (value === 3) {
                //当选择为管理人时, 并勾选全部管理人时
                this.checkAll(['all']);
                this.setState({
                    isChooseAll: true
                });
            }
        }
    };

    handleFilterAdminList = (data = {}) => {
        console.log(data, 'handleFilterAdminList');
        const { positionStatus, isDelete } = data;
        const { allAdminUserList } = this.state;
        let list = cloneDeep(allAdminUserList);

        if (positionStatus) {
            list = list.filter((item) => item.positionStatus === positionStatus);
        }

        if (isDelete) {
            list = list.filter((item) => item.isDelete === isDelete);
        }


        this.setState({
            adminUserList: list
        });
    };

    // 选中全部产品

    productSelectedAllChange = (e, source)=>{
        // const { setFieldsValue } = this.searchFormEmailRef.current;

        // const {productList} = this.state;
        // let newArr = [];
        // productList.map((item)=>newArr.push(item.ProductCode));
        if(source===1){
            this.setState({
                productEmailDisabled:e.length===1
            });
        }else{
            this.setState({
                productDisabled:e.length===1
            });
        }

    }
    render() {
        const {
            loading,
            submitting,
            lsitLoading,
            emailLoading,
            emailSubmitting,
            moduleLoding,
            getAdminLoading,
            tempForm: {
                marketingServiceName,
                status,
                notifyFrequency,
                triggerDate,
                triggerTime,
                noticeType,
                noticeTime,
                noticeStatus,
                wechatServiceJson,
                wechartProductName,
                wechartIsAll, // 微信模块的是否只对该产品持有人发送
                messageProductName,
                messageIsAll,
                mailProductName,
                mailIsAll,
                isNetWorth,
                messageServiceJson = {},
                emailServiceJson,
                customerList
            },
            match: { params }
        } = this.props;
        console.log(marketingServiceName);
        const wechatData = wechatServiceJson.contentJson || {};
        let selectCustomerList = [];
        if (params.templateCode && params.templateCode !== '0' && params.type === '3') {
            if (customerList.length === 0) {
                selectCustomerList = [];
            } else {
                selectCustomerList = customerList.includes('all')
                    ? ['all']
                    : customerList
                        .toString()
                        .split(',')
                        .map((item) => Number(item));
            }
        } else if (Array.isArray(customerList)) {
            selectCustomerList = customerList.includes('all')
                ? ['all']
                : customerList.map((item) => item.CustomerCode);
        }

        const disabled = noticeStatus === 1;
        const {
            modalVisible,
            smsModalVisible,
            mailboxVisible,
            modalTop,
            mailboxTop,
            customerAllList = [],
            productChildren,
            riskStyleChildren,
            serviceTool = [],
            sendType,
            emailType,
            emailSetting,
            frequencyType,
            frequencyList = [],
            timeSelectFlag,
            children,
            productList,
            tmepList = [],
            fileList,
            isUseMessageProduct,
            isUseEmailProduct,
            checkAll,
            modalFLag,
            modalMsg,
            marketingServiceCode,
            customerType,
            administratorListVisible,
            permissions,
            moduleType,
            moduleListVisible,
            adminUserList,
            isAsPost,
            isChooseAll,
            moduleCustomerType,
            productDisabled,
            productEmailDisabled
        } = this.state;
        const methods = {
            handleModalVisible: this.handleModalVisible
        };
        const mailMethods = {
            handleModalVisible: this.handleMailBoxVisible,
            onEmailChange: this.onEmailChange,
            handleEmailSubmit: this.handleEmailSubmit
        };
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 7 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
                md: { span: 11 }
            }
        };
        const formItemLayout1 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 }
            }
        };

        const formItemLayout2 = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 18 }
            }
        };
        const serviceTargetLayout = {
            wrapperCol: {
                span: 8
            }
        };
        const submitFormLayout = {
            wrapperCol: {
                xs: { span: 24, offset: 0 },
                sm: { span: 10, offset: 7 }
            }
        };
        const uploadProps = {
            multiple: true,
            onChange: this.handleUploadChange,
            // beforeUpload: this.beforeUpload,
            data: {
                source: sendType === 3 ? 15 : 16, // 15 邮件通知频率发送 // 16 邮件通知非频率发送
                sourceId: marketingServiceCode === 0 ? 0 : marketingServiceCode,
                codeType: 140 //这里是写死的type
            }
        };
        const excludeControls = ['blockquote', 'code'];
        let mediaItems = localStorage.getItem('braftEditorMediaItems');
        mediaItems = mediaItems ? JSON.parse(mediaItems) : [];
        return (
            <PageHeaderWrapper>
                <Spin spinning={!!moduleLoding || !!lsitLoading || !!getAdminLoading || !!loading}>
                    <div className={styles.templateInfo}>
                        <Card
                            title="基本信息"
                            // loading={loading}
                            className={styles.card}
                            bordered={false}
                        >
                            <Form
                                {...formItemLayout}
                                style={{ marginTop: 8 }}
                                ref={this.searchFormRef}
                            >
                                <Row>
                                    {/* <Col span={6}>
                          <Checkbox value={0}>微信</Checkbox>
                        </Col> */}
                                    <Col span={24}>
                                        <FormItem
                                            label="服务营销工具"
                                            extra="（可选一个或多个工具，不同的工具需要配置不同的内容）"
                                            name={'serviceTool'}
                                            initialValue={serviceTool}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择服务营销工具'
                                                }
                                            ]}
                                        >
                                            <Checkbox.Group
                                                style={{ width: '100%' }}
                                                disabled={disabled}
                                                onChange={this.onToolChange}
                                            >
                                                <Checkbox value={1}>短信</Checkbox>
                                                <Checkbox value={2}>邮件</Checkbox>
                                            </Checkbox.Group>
                                        </FormItem>
                                    </Col>
                                    <Col span={6}>{/* <Checkbox value={2} >邮件</Checkbox> */}</Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label={'选择类型'}
                                            name={'marketingServiceObject'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择营销服务类型'
                                                }
                                            ]}
                                            initialValue={1}
                                        >
                                            <Radio.Group onChange={this.handleCustomerChange}>
                                                <Radio value={1}>客户</Radio>
                                                <Radio value={0}>管理人</Radio>
                                            </Radio.Group>
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24} className={styles.serviceTargetType}>
                                        <FormItem
                                            // 这里用空格站位
                                            label={' '}
                                            style={{ width: '100%', position: 'absolute' }}
                                            labelCol={{ span: 7 }}
                                            wrapperCol={{ span: 2 }}
                                            initialValue={1}
                                            name={'customerPost'}
                                        >
                                            {/* <Select value={customerType} onChange={this.handleCustomerChange}>
                      <Option value={1}>客户</Option>
                      <Option value={2}>管理员</Option>
                    </Select> */}
                                            {customerType === 1 ? (
                                                <Select onChange={this.handlePostType}  allowClear>
                                                    <Option value={1}>按人员</Option>
                                                    <Option value={2}>全部客户</Option>
                                                </Select>
                                            ) : (
                                                <Select onChange={this.handlePostType}  allowClear>
                                                    <Option value={1}>按人员</Option>
                                                    <Option value={2}>按岗位</Option>
                                                    <Option value={3}>全部管理人</Option>
                                                </Select>
                                            )}
                                        </FormItem>
                                        <FormItem
                                            label="营销服务对象"
                                            extra="（含持有及注册客户列表客户）"
                                            name={'customerList'}
                                            // initialValue={selectCustomerList || ''}
                                            {...serviceTargetLayout}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择营销服务对象',
                                                    type: 'array'
                                                }
                                            ]}
                                        >
                                            <Select
                                                mode="multiple"
                                                allowClear
                                                disabled
                                                maxTagCount={10}
                                                placeholder="请点击右侧按钮选择营销服务对象"
                                            >
                                                {children}
                                            </Select>
                                        </FormItem>
                                    </Col>
                                    <Col span={2} className={styles.serviceTarget}>
                                        {!!isAsPost ? (
                                            <Button
                                                type="primary"
                                                size="small"
                                                disabled={disabled || isChooseAll}
                                                onClick={() =>
                                                    this.handleModalVisible(true, undefined, 2)
                                                }
                                            >
                                                选择岗位
                                            </Button>
                                        ) : (
                                            <Button
                                                type="primary"
                                                size="small"
                                                disabled={disabled || isChooseAll}
                                                onClick={() =>
                                                    this.handleModalVisible(
                                                        true,
                                                        undefined,
                                                        customerType,
                                                    )
                                                }
                                            >
                                                选择客户
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={24}>
                                        <FormItem
                                            label="通知模板"
                                            // initialValue={marketingServiceName}
                                            name={'marketingServiceName'}
                                            {...serviceTargetLayout}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '输入通知模板'
                                                }
                                            ]}
                                        >
                                            <Input
                                                disabled={disabled || moduleType === 1}
                                                placeholder="输入通知模板"
                                            />
                                        </FormItem>
                                    </Col>
                                    {(sendType === 2 || moduleType === 1) && (
                                        <Col span={4} className={styles.noticeModule}>
                                            <Space>
                                                <Button
                                                    type="primary"
                                                    size="small"
                                                    disabled={disabled}
                                                    onClick={() => this.handleChooseModule(customerType, 1)}
                                                >
                                                    选择已有模板
                                                </Button>
                                                {moduleType === 1 && (
                                                    <Button
                                                        type="primary"
                                                        size="small"
                                                        disabled={disabled}
                                                        onClick={() =>
                                                            this.handleChooseModule(customerType, 2)
                                                        }
                                                    >
                                                        重置模板
                                                    </Button>
                                                )}
                                            </Space>
                                        </Col>
                                    )}
                                </Row>
                                <FormItem
                                    label="发送方式"
                                    initialValue={noticeType}
                                    name={'noticeType'}
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择发送方式'
                                        }
                                    ]}
                                >
                                    <Radio.Group onChange={this.onSendChange} disabled={disabled}>
                                        {params.templateCode === '0' && moduleType === 2 ? (
                                            <>
                                                <Radio value={1}>立即发送</Radio>
                                                <Radio value={2}>定时发送</Radio>
                                                <Radio value={3}>按频率发送</Radio>
                                            </>
                                        ) : null}
                                        {moduleType === 1 ? (
                                            <>
                                                <Radio value={1} disabled={moduleType === 1}>
                                                    立即发送
                                                </Radio>
                                                <Radio value={2} disabled={moduleType === 1}>
                                                    定时发送
                                                </Radio>
                                                <Radio value={3} disabled={moduleType === 1}>
                                                    按频率发送
                                                </Radio>
                                                <Radio value={4}>按提醒日期发送</Radio>
                                            </>
                                        ) : null}
                                        {params.templateCode !== '0' &&
                                        sendType !== 3 &&
                                        moduleType !== 1 ? (
                                                <>
                                                    <Radio value={1}>立即发送</Radio>
                                                    <Radio value={2}>定时发送</Radio>
                                                </>
                                            ) : null}
                                        {params.templateCode !== '0' &&
                                        sendType === 3 &&
                                        moduleType !== 1 ? (
                                            
                                                 <Radio value={3}>按频率发送</Radio>
                                            ) : null}
                                    </Radio.Group>
                                </FormItem>
                                {sendType === 2 || sendType === '2' ? (
                                    <FormItem
                                        label={<span />}
                                        className={styles.timeInput}
                                        name={'noticeTime'}
                                        // initialValue={noticeTime ? moment(noticeTime) : null}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择发送时间',
                                                type: 'object'
                                            },
                                            {
                                                validator: this.inspectionTime.bind(this)
                                            }
                                        ]}
                                    >
                                        <DatePicker
                                            showTime
                                            disabled={disabled}
                                            format="YYYY-MM-DD HH:mm:ss"
                                            placeholder="请选择发送时间"
                                        />
                                    </FormItem>
                                ) : null}
                                {sendType === 3 || sendType === '3' ? (
                                    <Row className={styles.notifyFrequency}>
                                        <Col span={7}></Col>
                                        <FormItem
                                            name={'notifyFrequency'}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: '请选择发送频率'
                                                }
                                            ]}
                                        >
                                            <Select
                                                placeholder="请选择发送频率"
                                                onChange={this.notifyFrequencyChange}
                                                disabled={disabled}
                                                allowClear
                                            >
                                                {NOTIFYFREQUENCY.map((item) => {
                                                    return (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    );
                                                })}
                                            </Select>
                                        </FormItem>
                                        {frequencyType === '1' || frequencyType === '2' ? (
                                            <FormItem
                                                // label={'triggerDate'}
                                                name={'triggerDate'}
                                                // initialValue={triggerDate}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请选择通知日期'
                                                    }
                                                ]}
                                            >
                                                <Select
                                                    placeholder="请选择通知日期"
                                                    onChange={this.setTriggerDate}
                                                    disabled={disabled}
                                                    allowClear
                                                >
                                                    {frequencyList.map((item) => (
                                                        <Option key={item.value} value={item.value}>
                                                            {item.label}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormItem>
                                        ) : null}
                                        {frequencyType === '1' ||
                                        frequencyType === '2' ||
                                        frequencyType === '0' ||
                                        timeSelectFlag ? (
                                                <FormItem
                                                    name={'triggerTime'}
                                                    // initialValue={
                                                    //     triggerTime
                                                    //         ? moment(triggerTime, 'HH:mm:ss')
                                                    //         : null
                                                    // }
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择通知时间',
                                                            type: 'object'
                                                        }
                                                    ]}
                                                >
                                                    <TimePicker format="HH:mm:ss" disabled={disabled} />
                                                </FormItem>
                                            ) : null}
                                    </Row>
                                ) : null}
                                {moduleType === 1 && sendType === 4 ? (
                                    // {/* {sendType === 2 ? ( */}
                                    <Row className={styles.notifyFrequency}>
                                        <Col span={24}>
                                            <FormItem label={'请选择提醒时间'}>
                                                <span style={{ lineHeight: '30px', marginRight:10 }}>提前</span>
                                                <FormItem
                                                    extra={<div>(如果需要当日发送, 请填写0)</div>}
                                                    name={'advanceDay'}
                                                    initialValue={1}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请填写提醒时间',
                                                            type: 'number'
                                                        }
                                                    ]}
                                                    style={{ display: 'inline-block' }}
                                                >
                                                    <InputNumber
                                                        min={0}
                                                        style={{ width: '150px' }}
                                                    />
                                                </FormItem>
                                                <span style={{ lineHeight: '30px', marginRight:10 }}>天</span>
                                                <FormItem
                                                    name={'advanceTime'}
                                                    // initialValue={moment(110000, 'HH:mm:ss')}
                                                    style={{ display: 'inline-block' }}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请选择通知时间',
                                                            type: 'object'
                                                        },
                                                        {
                                                            validator: this.inspectionTime.bind(
                                                                this,
                                                            )
                                                        }
                                                    ]}
                                                >
                                                    <TimePicker></TimePicker>
                                                </FormItem>
                                            </FormItem>
                                        </Col>
                                    </Row>
                                ) : null}
                                {sendType === 3 || sendType === 4 ? (
                                    <FormItem
                                        label="通知状态"
                                        help="你可在以下输入框中选择通配符，如选择客户名称，您发送出去的内容将带上客户名称"
                                        name={'status'}
                                        initialValue={status}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择通知状态'
                                            }
                                        ]}
                                    >
                                        <Select  allowClear>
                                            <Option value={1}>启用</Option>
                                            <Option value={0}>禁用</Option>
                                        </Select>
                                    </FormItem>
                                ) : null}
                            </Form>
                        </Card>
                        <Card
                            title="工具内容"
                            // loading={loading}
                            className={styles.card}
                            bordered={false}
                        >
                            <Form
                                {...formItemLayout1}
                                onSubmit={(e) => this.handleSubmit(e, false)}
                                ref={this.searchFormEmailRef}
                            >
                                {serviceTool.indexOf(0) > -1 ? (
                                    <>
                                        <Row>
                                            <Col span={4}>
                                                <div
                                                    className={styles.toolIcon}
                                                    style={{ height: 260 }}
                                                >
                                                    <div>
                                                        <WechatOutlined
                                                            style={{
                                                                fontSize: 60,
                                                                color: '#C3C6CF'
                                                            }}
                                                        />
                                                    </div>
                                                    <span>微信</span>
                                                </div>
                                            </Col>
                                            <Col span={20}>
                                                <FormItem
                                                    label="选择通配符"
                                                    help="你可在主题及内容中选择通配符，选择后将自动匹配客户名称"
                                                >
                                                    {tmepList.map((item, index) => {
                                                        return (
                                                            <Button
                                                                key={item.keyword}
                                                                type="primary"
                                                                style={{ marginRight: 10,marginBottom:10 }}
                                                                size="small"
                                                                id={`'customer_name'${index}`}
                                                                disabled={disabled}
                                                                onClick={() =>
                                                                    this.insertAction(item, 1)
                                                                }
                                                            >
                                                                {item.name}
                                                            </Button>
                                                        );
                                                    })}
                                                </FormItem>
                                                <FormItem
                                                    label="主题"
                                                    name={'wechatSubject'}
                                                    initialValue={wechatData.subject || ''}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请录入微信卡片主题'
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        placeholder="请录入微信卡片主题"
                                                        ref={(i) => {
                                                            this.subject = i;
                                                        }}
                                                        disabled={disabled}
                                                        onFocus={this.focusAction}
                                                        onBlur={this.blurAction}
                                                    />
                                                </FormItem>
                                                <FormItem
                                                    label="内容"
                                                    name={'wechatContent'}
                                                    initialValue={wechatData.content || ''}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请录入微信卡片内容'
                                                        }
                                                    ]}
                                                >
                                                    <TextArea
                                                        disabled={disabled}
                                                        style={{ minHeight: 32 }}
                                                        rows={4}
                                                        ref={(i) => {
                                                            this.content = i;
                                                        }}
                                                        onFocus={this.focusAction}
                                                        onBlur={this.blurAction}
                                                        placeholder="请录入微信卡片内容"
                                                    />
                                                    ,
                                                </FormItem>
                                                <FormItem
                                                    label="卡片链接"
                                                    name={'url'}
                                                    initialValue={wechatData.url || ''}
                                                    rules={[
                                                        {
                                                            message: '请录入卡片链接'
                                                        }
                                                    ]}
                                                >
                                                    <Input
                                                        disabled={disabled}
                                                        placeholder="请录入卡片链接"
                                                    />
                                                </FormItem>

                                                <Row gutter={16}>
                                                    <Col span={20}>
                                                        <FormItem
                                                            label="选择产品"
                                                            help="选择“产品简称”通配符后必选产品，可选择多个产品，发送多条信息"
                                                            name={'wechartProductName'}
                                                            rules={[
                                                                {
                                                                    required: true,
                                                                    message: '请选择产品，可搜索'
                                                                }
                                                            ]}
                                                        >
                                                            <Select
                                                                placeholder="请选择产品，可搜索"
                                                                showSearch
                                                                mode="multiple"
                                                                allowClear
                                                                filterOption={this.filterProduct}
                                                                onChange={this.setTriggerDate}
                                                                disabled={disabled}
                                                            >
                                                                <Option value="all">全部</Option>
                                                                {productList.map((item) => {
                                                                    return (
                                                                        <Option
                                                                            key={item.ProductCode}
                                                                            value={item.ProductCode}
                                                                        >
                                                                            {item.ProductName}
                                                                        </Option>
                                                                    );
                                                                })}
                                                            </Select>
                                                        </FormItem>
                                                    </Col>
                                                    <Col span={4}>
                                                        <FormItem
                                                            name={'wechartIsAll'}
                                                            initialValue={wechartIsAll}
                                                        >
                                                            <Checkbox.Group disabled={disabled}>
                                                                <Checkbox
                                                                    value="1"
                                                                    className={
                                                                        styles.checkboxStyles
                                                                    }
                                                                >
                                                                    只对该产品持有人发送
                                                                </Checkbox>
                                                            </Checkbox.Group>
                                                        </FormItem>

                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Divider />
                                    </>
                                ) : null}
                                {serviceTool.indexOf(1) > -1 ? (
                                    <>
                                        <Row gutter={16}>
                                            <Col span={4}>
                                                <div
                                                    className={styles.toolIcon}
                                                    style={{ height: 260 }}
                                                >
                                                    <div>
                                                        <MessageOutlined
                                                            style={{
                                                                fontSize: 60,
                                                                color: '#C3C6CF'
                                                            }}
                                                        />
                                                    </div>
                                                    <span>短信</span>
                                                </div>
                                            </Col>
                                            <Col span={20}>
                                                {customerType === 1 && (
                                                    <FormItem
                                                        label="其他号码"
                                                        help="（您可以录入非持有及注册客户列表外的手机号）"
                                                        name={'otherMobile'}
                                                        rules={[
                                                            {
                                                                message: '请录入手机号'
                                                            }
                                                        ]}
                                                    >
                                                        <TextArea
                                                            disabled={disabled}
                                                            style={{ minHeight: 32 }}
                                                            placeholder="请录入手机号"
                                                            rows={4}
                                                            ref={(i) => {
                                                                this.messageEle = i;
                                                            }}
                                                        />
                                                    </FormItem>
                                                )}
                                                <FormItem
                                                    label="选择通配符"
                                                    help="你可在主题及内容中选择通配符，选择后将自动匹配客户名称"
                                                >
                                                    {tmepList.map((item, index) => {
                                                        if (customerType === 1) {
                                                            return (
                                                                item.keyword !== 'userName' && (
                                                                    <Button
                                                                        key={item.keyword}
                                                                        type="primary"
                                                                        style={{ marginRight: 10 ,marginBottom:10}}
                                                                        size="small"
                                                                        id={`messageBtn${index}`}
                                                                        disabled={disabled}
                                                                        onClick={() =>
                                                                            this.insertAction(
                                                                                item,
                                                                                2,
                                                                            )
                                                                        }
                                                                    >
                                                                        {item.name}
                                                                    </Button>
                                                                )
                                                            );
                                                        } else if (
                                                            customerType === 0 &&
                                                            moduleType === 2
                                                        ) {
                                                            return (
                                                                item.keyword === 'userName' && (
                                                                    <Button
                                                                        key={item.keyword}
                                                                        type="primary"
                                                                        style={{ marginRight: 10,marginBottom:10 }}
                                                                        size="small"
                                                                        id={`messageBtn${index}`}
                                                                        disabled={disabled}
                                                                        onClick={() =>
                                                                            this.insertAction(
                                                                                item,
                                                                                2,
                                                                            )
                                                                        }
                                                                    >
                                                                        {item.name}
                                                                    </Button>
                                                                )
                                                            );
                                                        } else if (
                                                            customerType === 0 &&
                                                            moduleType === 1
                                                        ) {
                                                            return (
                                                                item.keyword !==
                                                                    'productFullName' && (
                                                                    <Button
                                                                        key={item.keyword}
                                                                        type="primary"
                                                                        style={{ marginRight: 10,marginBottom:10 }}
                                                                        size="small"
                                                                        id={`messageBtn${index}`}
                                                                        disabled={disabled}
                                                                        onClick={() =>
                                                                            this.insertAction(
                                                                                item,
                                                                                2,
                                                                            )
                                                                        }
                                                                    >
                                                                        {item.name}
                                                                    </Button>
                                                                )
                                                            );
                                                        }
                                                    })}
                                                </FormItem>
                                                <FormItem
                                                    label="短信正文"
                                                    extra="（因短信供应商对敏感词汇的限制，某些词汇（如：证券，股票，提币，充值，投资、公众号等）可能会被拦截，无法到达投资者）"
                                                    name={'msgContent'}
                                                    // initialValue={messageServiceJson.content || ''}
                                                    initialValue={''}
                                                    rules={[
                                                        {
                                                            required: true,
                                                            message: '请输入短信正文'
                                                        }
                                                    ]}
                                                >
                                                    <TextArea
                                                        disabled={disabled || moduleType === 1}
                                                        style={{ minHeight: 32 }}
                                                        placeholder="请输入短信正文"
                                                        rows={4}
                                                        onFocus={this.focusAction}
                                                        onBlur={this.messageBlur}
                                                        onChange={this.msgContentChange}
                                                    />
                                                </FormItem>
                                                <Col span={4}>
                                                    {/* <Button disabled={disabled} onClick={() => this.handleSMSVisible(true)}>短信样例</Button> */}
                                                </Col>
                                                {isUseMessageProduct && customerType === 1 ? (
                                                    <Row>
                                                        <Col span={24}>
                                                            <FormItem
                                                                label="选择产品"
                                                                help="选择“产品简称”通配符后必选产品，可选择多个产品，发送多条信息"
                                                                name={'messageProductName'}
                                                                initialValue={messageProductName}

                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message:
                                                                            '请选择产品，可搜索'
                                                                    }
                                                                ]}
                                                            >
                                                                <Select
                                                                    placeholder="请选择产品，可搜索"
                                                                    mode="multiple"
                                                                    showSearch
                                                                    filterOption={
                                                                        this.filterProduct
                                                                    }
                                                                    allowClear
                                                                    onChange={this.setTriggerDate}
                                                                    disabled={disabled || productDisabled}
                                                                >
                                                                    {/* <Option value="all">
                                                                        全部
                                                                    </Option> */}
                                                                    {productList.map((item) => {
                                                                        return (
                                                                            <Option
                                                                                key={
                                                                                    item.ProductCode
                                                                                }
                                                                                value={
                                                                                    item.ProductCode
                                                                                }
                                                                            >
                                                                                {item.ProductName}
                                                                            </Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col
                                                            style={{
                                                                position: 'absolute',
                                                                left: '70%'
                                                            }}
                                                        >
                                                            <FormItem
                                                                name={'messageIsAll'}
                                                                initialValue={messageIsAll}
                                                            >
                                                                <Checkbox.Group disabled={disabled}>
                                                                    <Checkbox
                                                                        value="1"
                                                                        className={
                                                                            styles.checkboxStyles
                                                                        }
                                                                    >
                                                                        只对该产品持有人发送
                                                                    </Checkbox>
                                                                </Checkbox.Group>
                                                            </FormItem>

                                                            <FormItem
                                                                name={'productSelectedAll'}
                                                                // initialValue={emailServiceJson.productSelectedAll}
                                                            >
                                                                <Checkbox.Group onChange={this.productSelectedAllChange} disabled={disabled}>
                                                                    <Checkbox
                                                                        value="1"
                                                                        className={
                                                                            styles.checkboxStyles
                                                                        }
                                                                    >
                                                                        选择全部产品
                                                                    </Checkbox>
                                                                </Checkbox.Group>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                ) : null}
                                            </Col>
                                        </Row>
                                        <Divider />
                                    </>
                                ) : null}
                                {serviceTool.indexOf(2) > -1 ? (
                                    <Row gutter={16}>
                                        <Col span={4}>
                                            <div
                                                className={styles.toolIcon}
                                                style={{ height: 300 }}
                                            >
                                                <div>
                                                    <MailOutlined
                                                        style={{ fontSize: 60, color: '#C3C6CF' }}
                                                    />
                                                </div>
                                                <span>邮件</span>
                                            </div>
                                        </Col>
                                        <Col span={20}>
                                            {customerType === 1 && (
                                                <FormItem
                                                    label="其他邮箱"
                                                    help="（您可以录入非持有及注册客户列表外的邮箱地址）"
                                                    name={'otherEmail'}
                                                    // initialValue={emailServiceJson.otherEmail || ''}
                                                    rules={[
                                                        {
                                                            message: '请录入邮箱地址'
                                                        }
                                                    ]}
                                                >
                                                    <TextArea
                                                        disabled={disabled}
                                                        style={{ minHeight: 32 }}
                                                        placeholder="请录入邮箱地址"
                                                        rows={4}
                                                    />
                                                </FormItem>
                                            )}
                                            <FormItem
                                                label="选择通配符"
                                                help="你可在主题及内容中选择通配符，选择后将自动匹配客户名称"
                                            >
                                                {tmepList.map((item, index) => {
                                                    if (customerType === 1) {
                                                        return (
                                                            item.keyword !== 'userName' && (
                                                                <Button
                                                                    key={item.keyword}
                                                                    type="primary"
                                                                    style={{ marginRight: 10,marginBottom:10 }}
                                                                    size="small"
                                                                    id={`messageBtn${index}`}
                                                                    disabled={disabled}
                                                                    onClick={() =>
                                                                        this.insertAction(item, 3)
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </Button>
                                                            )
                                                        );
                                                    } else if (
                                                        customerType === 0 &&
                                                        moduleType === 2
                                                    ) {
                                                        return (
                                                            item.keyword === 'userName' && (
                                                                <Button
                                                                    key={item.keyword}
                                                                    type="primary"
                                                                    style={{ marginRight: 10 ,marginBottom:10}}
                                                                    size="small"
                                                                    id={`messageBtn${index}`}
                                                                    disabled={disabled}
                                                                    onClick={() =>
                                                                        this.insertAction(item, 3)
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </Button>
                                                            )
                                                        );
                                                    } else if (
                                                        customerType === 0 &&
                                                        moduleType === 1
                                                    ) {
                                                        return (
                                                            item.keyword !== 'productFullName' && (
                                                                <Button
                                                                    key={item.keyword}
                                                                    type="primary"
                                                                    style={{ marginRight: 10,marginBottom:10 }}
                                                                    size="small"
                                                                    id={`messageBtn${index}`}
                                                                    disabled={disabled}
                                                                    onClick={() =>
                                                                        this.insertAction(item, 3)
                                                                    }
                                                                >
                                                                    {item.name}
                                                                </Button>
                                                            )
                                                        );
                                                    }
                                                })}
                                            </FormItem>
                                            <FormItem
                                                label="邮件标题"
                                                name={'emailSubject'}
                                                // initialValue={emailServiceJson.subject || ''}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message: '请输入名称'
                                                    }
                                                ]}
                                            >
                                                <Input
                                                    disabled={disabled}
                                                    ref={(i) => {
                                                        this.mailTitle = i;
                                                    }}
                                                    onChange={this.emailTitleChange}
                                                    onFocus={this.focusAction}
                                                    onBlur={this.mailBlur}
                                                    placeholder="请输入名称"
                                                />
                                            </FormItem>
                                            <FormItem
                                                label="邮件正文"
                                                {...formItemLayout2}
                                                name={'emailContent'}
                                                // initialValue={BraftEditor.createEditorState(emailServiceJson.content || '')}
                                                validateTrigger={'onBlur'}
                                                rules={[
                                                    {
                                                        required: true,
                                                        validator: (rule, value) => {
                                                            if (value && value.isEmpty() || !value) {
                                                                return Promise.reject(
                                                                    '请输入邮件正文',
                                                                );
                                                            } else {
                                                                return Promise.resolve();
                                                            }
                                                        }
                                                    }
                                                ]}
                                            >
                                                {/* <div id="emailContent" /> */}
                                                <BraftEditor
                                                    className={styles.myEditor}
                                                    readOnly={disabled || moduleType === 1}
                                                    media={{
                                                        items: mediaItems,
                                                        uploadFn: multipartUpload
                                                    }}
                                                    excludeControls={excludeControls}
                                                    contentClassName={
                                                        moduleType === 1 ? styles.test : ''
                                                    }
                                                    onFocus={this.mailFocus}
                                                    onBlur={this.mailContentBlur}
                                                    ref={(i) => {
                                                        this.mailContent = i;
                                                    }}
                                                    onChange={this.emailContentChange}
                                                />
                                            </FormItem>
                                            <FormItem label="邮件附件">
                                                <Upload
                                                    disabled={disabled}
                                                    name="file"
                                                    action={`${BASE_PATH.adminUrl}/attachments/uploadFile`}
                                                    headers={{
                                                        tokenId: getCookie('vipAdminToken')
                                                    }}
                                                    fileList={fileList}
                                                    {...uploadProps}
                                                    onRemove={this.handleRemoveFile}
                                                >
                                                    <Button disabled={disabled}>
                                                        <UploadOutlined />
                                                        点击上传
                                                    </Button>
                                                </Upload>
                                            </FormItem>
                                            {isUseEmailProduct && customerType === 1 ? (
                                                <>
                                                    <Row>
                                                        <Col span={24}>
                                                            <FormItem
                                                                label="选择产品"
                                                                help="选择“产品简称”通配符后必选产品，可选择多个产品，发送多条信息"
                                                                name={'mailProductName'}
                                                                initialValue={mailProductName}
                                                                rules={[
                                                                    {
                                                                        required: true,
                                                                        message:
                                                                            '请选择产品，可搜索'
                                                                    }
                                                                ]}
                                                            >
                                                                <Select
                                                                    placeholder="请选择产品，可搜索"
                                                                    mode="multiple"
                                                                    showSearch
                                                                    filterOption={
                                                                        this.filterProduct
                                                                    }
                                                                    allowClear
                                                                    onChange={this.setTriggerDate}
                                                                    disabled={disabled || productEmailDisabled}
                                                                >
                                                                    {/* <Option value="all">
                                                                        全部
                                                                    </Option> */}
                                                                    {productList.map((item) => {
                                                                        return (
                                                                            <Option
                                                                                key={
                                                                                    item.ProductCode
                                                                                }
                                                                                value={
                                                                                    item.ProductCode
                                                                                }
                                                                            >
                                                                                {item.ProductName}
                                                                            </Option>
                                                                        );
                                                                    })}
                                                                </Select>
                                                            </FormItem>
                                                        </Col>
                                                        <Col
                                                            style={{
                                                                position: 'absolute',
                                                                left: '70%'
                                                            }}
                                                        >
                                                            <FormItem
                                                                name={'mailIsAll'}
                                                                initialValue={mailIsAll}
                                                            >
                                                                <Checkbox.Group disabled={disabled}>
                                                                    <Checkbox
                                                                        value="1"
                                                                        className={
                                                                            styles.checkboxStyles
                                                                        }
                                                                    >
                                                                        只对该产品持有人发送
                                                                    </Checkbox>
                                                                </Checkbox.Group>
                                                            </FormItem>
                                                            <FormItem
                                                                name={'productEmailSelectedAll'}
                                                            >
                                                                <Checkbox.Group onChange={(e)=>this.productSelectedAllChange(e, 1)} disabled={disabled}>
                                                                    <Checkbox
                                                                        value="1"
                                                                        className={
                                                                            styles.checkboxStyles
                                                                        }
                                                                    >
                                                                        选择全部产品
                                                                    </Checkbox>
                                                                </Checkbox.Group>
                                                            </FormItem>
                                                        </Col>
                                                    </Row>
                                                </>
                                            ) : null}
                                        </Col>
                                    </Row>
                                ) : null}
                                <FormItem
                                    {...submitFormLayout}
                                    style={{ marginTop: 32, textAlign: 'center'}}
                                >
                                    {
                                        authEdit &&
                                        <Button
                                            id="saveTemp"
                                            type="primary"
                                            htmlType="submit"
                                            disabled={disabled}
                                            loading={submitting || emailLoading}
                                            onClick={(e) => this.handleSubmit(e, false)}
                                        >
                                        保存
                                        </Button>
                                    }

                                </FormItem>
                            </Form>
                        </Card>
                        <Modal
                            title="提醒"
                            // style={{ top: modalTop }}
                            visible={modalFLag}
                            onOk={() => {
                                this.handleSubmit(false, true);
                                this.setState({ modalFLag: false });
                            }}
                            onCancel={() => this.setState({ modalFLag: false })}
                        >
                            <p>{modalMsg}</p>
                        </Modal>
                        {modalVisible &&
                            <CustomerList
                                {...methods}
                                // loading={lsitLoading}
                                data={customerAllList}
                                selectCustomerList={selectCustomerList || []}
                                modalVisible={modalVisible}
                                productChildren={productChildren}
                                riskStyleChildren={riskStyleChildren}
                                ref={(self) => (this.myCustomerList = self)}
                            />
                        }

                        <AdministratorList
                            {...methods}
                            administratorListVisible={administratorListVisible}
                            ref={(self) => (this.myAdministratorList = self)}
                            data={adminUserList}
                            isAsPost={isAsPost}
                            filterData={this.handleFilterAdminList}
                        />
                        <SMSModal
                            modalVisible={smsModalVisible}
                            top={modalTop}
                            handleModalVisible={this.handleSMSVisible}
                        />
                        <Mailbox
                            {...mailMethods}
                            modalVisible={mailboxVisible}
                            // top={mailboxTop}
                            submitting={emailSubmitting}
                            // radioType={emailType}
                            settings={emailSetting}
                        />
                        <ModuleList
                            modalVisible={moduleListVisible}
                            handleModalVisible={this.handleUseModule}
                            customerType={customerType}
                            moduleCustomerType={moduleCustomerType}
                        />
                    </div>
                </Spin>
            </PageHeaderWrapper>
        );
    }
}
export default TemplateForm;
