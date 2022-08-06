/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-16 19:46:07
 * @LastEditTime: 2021-01-09 13:34:44
 */
import { notification } from 'antd';
import {
    XWcustomerCategoryOptions,
    XWDocumentType,
    XWGender,
    XWcertificateType,
    XWInvestorsType,
    PROFESSION,
    PRODUCT_CARD
} from '@/utils/publicData';

// 自然人客户基本信息
export const CUSTOMERSMESSAGE = [
    {
        label: '客户类别',
        name: 'customerType',
        placeholder: '请选择客户类别',
        Required: true,
        type: 'select',
        message: '请选择客户类别',
        value: XWcustomerCategoryOptions,
        change: 1
    },
    {
        label: '客户名称',
        name: 'customerName',
        placeholder: '请录入客户名称',
        Required: true,
        message: '请输入客户名称',
        type: 'input'
    },
    {
        label: '登录手机号码',
        name: 'loginMobile',
        placeholder: '请录入登录手机号码',
        Required: false,
        message: '请输入登录手机号码',
        type: 'input'
    },
    {
        label: '客户类型',
        name: 'investorType',
        placeholder: '请选择客户类型',
        Required: false,
        message: '请选择客户类型',
        type: 'select',
        value: XWInvestorsType
    },
    {
        label: '客户经理',
        name: 'managerUserIds',
        placeholder: '请选择客户经理',
        Required: false,
        type: 'select',
        mode: 'multiple',
        dataSources: 1 // 应该接口查询数据
    },
    {
        label: '证件类型',
        name: 'cardType',
        placeholder: '请选择证件类型',
        Required: true,
        type: 'select',
        value: XWDocumentType
    },
    {
        label: '证件号码',
        name: 'cardNumber',
        placeholder: '请输入证件号码',
        Required: true,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'cardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'cardValidEndTime',
        name: 'cardLongTime'
    },
    {
        label: '性别',
        name: 'personSex',
        placeholder: '请选择性别',
        Required: false,
        type: 'select',
        value: XWGender
    },
    {
        label: '生日',
        name: 'personBirthday',
        placeholder: '请输入客户生日',
        Required: false,
        type: 'datepicker'
    },
    {
        type: 'inputNumber',
        labelObj: {
            label: '年龄',
            name: 'age'
        },
        valueObj: {
            placeholder: '请输入年龄',
            min: 0,
            max: 150,
            style: {width: '150px'}
        }
    },
    {
        label: '职业',
        name: 'personProfession',
        placeholder: '请选择客户职业',
        Required: false,
        type: 'select',
        value: PROFESSION
    },
    {
        label: '联系地址',
        name: 'personAddress',
        placeholder: '请输入联系地址',
        Required: false,
        type: 'input'
    },
    {
        label: '国籍',
        name: 'nationality',
        placeholder: '请输入城市',
        Required: false,
        type: 'input'
    },
    {
        label: '联系邮箱',
        name: 'personEmail',
        placeholder: '请输入联系邮箱',
        Required: false,
        type: 'input'
    }
];

// 机构客户
export const MECHANISMCUSTOMER = [
    {
        label: '客户类别',
        name: 'customerType',
        placeholder: '请选择客户类别',
        Required: true,
        type: 'select',
        message: '请选择客户类别',
        value: XWcustomerCategoryOptions,
        change: 1
    },
    {
        label: '客户名称',
        name: 'customerName',
        placeholder: '请录入客户名称',
        Required: true,
        message: '请输入客户名称',
        type: 'input'
    },
    {
        label: '登录手机号码',
        name: 'loginMobile',
        placeholder: '请录入',
        Required: false,
        message: '请输入登录手机号码',
        type: 'input'
    },
    {
        label: '客户类型',
        name: 'investorType',
        placeholder: '请选择客户类型',
        Required: false,
        message: '请选择客户类型',
        type: 'select',
        value: XWInvestorsType
    },
    {
        label: '客户经理',
        name: 'managerUserIds',
        placeholder: '请选择客户经理',
        Required: false,
        type: 'select',
        mode: 'multiple',
        dataSources: 1 // 应该接口查询数据
    },
    {
        label: '证件类型',
        name: 'companyCardType',
        placeholder: '请选择证件类型',
        Required: true,
        type: 'select',
        value: XWcertificateType
    },
    {
        label: '证件号码',
        name: 'companyCardNumber',
        placeholder: '请输入证件号码',
        Required: true,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'companyCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'companyCardValidEndTime',
        name: 'companyIsCardLongTime'
    },
    {
        label: '经营范围',
        name: 'businessScope',
        placeholder: '请输入经营范围',
        Required: false,
        type: 'TextArea'
    },
    {
        label: '注册国家/地区',
        name: 'registerArea',
        placeholder: '请输入注册国家/地区',
        Required: false,
        type: 'input'
    },
    {
        label: '注册地址',
        name: 'registerAddress',
        placeholder: '请输入注册地址',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'businessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },
    {
        label: '注册资金',
        name: 'registerMoney',
        placeholder: '请输入注册资金',
        Required: false,
        type: 'input'
    },
    {
        label: '实际控制人',
        name: 'controlPerson',
        placeholder: '请输入实际控制人',
        Required: false,
        type: 'input'
    },
    {
        label: '联系邮箱',
        name: 'companyEmail',
        placeholder: '请输入联系邮箱',
        Required: false,
        type: 'input'
    },

    // 法人信息
    {
        name: '法人信息',
        type: 'title'
    },
    {
        label: '控股股东或实际控制人',
        name: 'controllingShareholder',
        placeholder: '请输入控股股东或实际控制人',
        Required: false,
        type: 'input'
    },
    {
        label: '法人姓名',
        name: 'legalPersonFullName',
        placeholder: '请输入法人姓名',
        Required: false,
        type: 'input'
    },
    {
        label: '性别',
        name: 'legalPersonSex',
        placeholder: '请选择性别',
        Required: false,
        type: 'select',
        value: XWGender
    },
    {
        type: 'inputNumber',
        labelObj: {
            label: '年龄',
            name: 'legalPersonAge'
        },
        valueObj: {
            placeholder: '请输入年龄',
            min: 0,
            max: 150,
            style: {width: '150px'}
        }
    },
    {
        label: '证件类型',
        name: 'legalPersonCardType',
        placeholder: '请选择证件类型',
        Required: false,
        type: 'select',
        value: XWDocumentType
    },
    {
        label: '证件号码',
        name: 'legalPersonCardNumber',
        placeholder: '请输入证件号码',
        Required: false,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'legalPersonCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'legalPersonCardValidEndTime',
        name: 'legalPersonIsCardLongTime'
    },
    {
        label: '职务',
        name: 'legalPersonDuty',
        placeholder: '请输入职务',
        Required: false,
        type: 'input'
    },
    {
        label: '电子邮箱',
        name: 'legalPersonEmail',
        placeholder: '请输入电子邮箱',
        Required: false,
        type: 'input'
    },
    {
        label: '手机号码',
        name: 'legalPersonMobile',
        placeholder: '请输入手机号码',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'legalPersonBusinessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },

    // 授权代表信
    {
        name: '授权代表信息',
        type: 'title'
    },
    {
        label: '姓名',
        name: 'authorizedRepresentativeFullName',
        placeholder: '请输入姓名',
        Required: false,
        type: 'input'
    },
    {
        label: '性别',
        name: 'authorizedRepresentativeSex',
        placeholder: '请选择性别',
        Required: false,
        type: 'select',
        value: XWGender
    },
    {
        type: 'inputNumber',
        labelObj: {
            label: '年龄',
            name: 'authorizedRepresentativeAge'
        },
        valueObj: {
            placeholder: '请输入年龄',
            min: 0,
            max: 150,
            style: {width: '150px'}
        }
    },
    {
        label: '职务',
        name: 'authorizedRepresentativeDuty',
        placeholder: '请输入客户职务',
        Required: false,
        type: 'input'
    },
    {
        label: '证件类型',
        name: 'authorizedRepresentativeCardType',
        placeholder: '请选择证件类型',
        Required: false,
        type: 'select',
        value: XWDocumentType
    },
    {
        label: '证件号码',
        name: 'authorizedRepresentativeCardNumber',
        placeholder: '请输入证件号码',
        Required: false,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'authorizedRepresentativeCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'authorizedRepresentativeCardValidEndTime',
        name: 'authorizedRepresentativeIsCardLongTime'
    },
    {
        label: '电子邮箱',
        name: 'authorizedRepresentativeEmail',
        placeholder: '请输入电子邮箱',
        Required: false,
        type: 'input'
    },
    {
        label: '手机号码',
        name: 'authorizedRepresentativeMobile',
        placeholder: '请输入手机号码',
        Required: false,
        type: 'input'
    },
    {
        label: '办公邮编',
        name: 'authorizedRepresentativeWorkEmail',
        placeholder: '请输入办公邮编',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'authorizedRepresentativeBusinessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },
    {
        label: '与该机构关系',
        name: 'authorizedRepresentativeRelation',
        placeholder: '请输入与该机构关系',
        Required: false,
        type: 'input'
    }
];

// 产品客户
export const PRODUCTCUSTOMER = [
    {
        label: '客户类别',
        name: 'customerType',
        placeholder: '请选择客户类别',
        Required: true,
        type: 'select',
        message: '请选择客户类别',
        value: XWcustomerCategoryOptions,
        change: 1
    },
    {
        label: '客户名称',
        name: 'customerName',
        placeholder: '请录入客户名称',
        Required: true,
        message: '请输入客户名称',
        type: 'input'
    },
    {
        label: '登录手机号码',
        name: 'loginMobile',
        placeholder: '请录入登录手机号码',
        Required: false,
        message: '请输入登录手机号码',
        type: 'input'
    },
    {
        label: '客户经理',
        name: 'managerUserIds',
        placeholder: '请选择客户经理',
        Required: false,
        type: 'select',
        mode: 'multiple',
        dataSources: 1 // 应该接口查询数据
    },
    {
        label: '产品规模',
        name: 'productScale',
        placeholder: '请输入产品规模',
        Required: false,
        type: 'input',
        value: XWcertificateType
    },
    {
        label: '证件类型 ',
        name: 'productCardType',
        placeholder: '请选择证件类型 ',
        Required: true,
        type: 'select',
        value: PRODUCT_CARD
    },
    {
        label: '证件号码',
        name: 'productCardNumber',
        placeholder: '请输入证件号码',
        Required: true,
        type: 'input'
    },
    {
        label: '备案机构',
        name: 'archivalOrganization',
        placeholder: '请输入备案机构',
        Required: false,
        type: 'input'
    },
    {
        label: '备案时间',
        name: 'registerDate',
        placeholder: '请输入备案时间',
        Required: false,
        type: 'datepicker'
    },
    {
        label: '产品策略',
        name: 'strategy',
        placeholder: '请输入产品策略',
        Required: false,
        type: 'input'
    },
    {
        label: '成立时间',
        name: 'setDate',
        placeholder: '请输入成立时间',
        Required: false,
        type: 'datepicker'
    },
    {
        label: '产品存续期',
        name: 'duration',
        placeholder: '请输入产品存续期',
        Required: false,
        type: 'input'
    },
    {
        label: '产品托管人',
        name: 'trustee',
        placeholder: '请输入产品托管人',
        Required: false,
        type: 'input'
    },
    {
        label: '联系邮箱',
        name: 'productEmail',
        placeholder: '请输入联系邮箱',
        Required: false,
        type: 'input'
    },

    // 机构信息
    {
        name: '机构信息',
        type: 'title'
    },
    {
        label: '管理人名称',
        name: 'custodian',
        placeholder: '请输入管理人名称',
        Required: false,
        type: 'input'
    },
    {
        label: '证件类型',
        name: 'companyCardType',
        placeholder: '请选择证件类型',
        Required: false,
        type: 'select',
        value: XWcertificateType
    },
    {
        label: '证件号码',
        name: 'companyCardNumber',
        placeholder: '请输入证件号码',
        Required: false,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'companyCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'companyCardValidEndTime',
        name: 'companyIsCardLongTime'
    },
    {
        label: '经营范围',
        name: 'businessScope',
        placeholder: '请输入经营范围',
        Required: false,
        type: 'TextArea'
    },
    {
        label: '注册国家/地区',
        name: 'registerArea',
        placeholder: '请输入注册国家/地区',
        Required: false,
        type: 'input'
    },
    {
        label: '注册地址',
        name: 'registerAddress',
        placeholder: '请输入注册地址',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'businessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },
    {
        label: '注册资金',
        name: 'registerMoney',
        placeholder: '请输入注册资金',
        Required: false,
        type: 'input'
    },
    {
        label: '实际控制人',
        name: 'controlPerson',
        placeholder: '请输入实际控制人',
        Required: false,
        type: 'input'
    },

    // 法人信息
    {
        name: '法人信息',
        type: 'title'
    },
    {
        label: '控股股东或实际控制人',
        name: 'controllingShareholder',
        placeholder: '请输入控股股东或实际控制人',
        Required: false,
        type: 'input'
    },
    {
        label: '法人姓名',
        name: 'legalPersonFullName',
        placeholder: '请输入法人姓名',
        Required: false,
        type: 'input'
    },
    {
        label: '性别',
        name: 'legalPersonSex',
        placeholder: '请选择性别',
        Required: false,
        type: 'select',
        value: XWGender
    },
    {
        type: 'inputNumber',
        labelObj: {
            label: '年龄',
            name: 'legalPersonAge'
        },
        valueObj: {
            placeholder: '请输入年龄',
            min: 0,
            max: 150,
            style: {width: '150px'}
        }
    },
    {
        label: '证件类型',
        name: 'legalPersonCardType',
        placeholder: '请选择证件类型',
        Required: false,
        type: 'select',
        value: XWDocumentType
    },
    {
        label: '证件号码',
        name: 'legalPersonCardNumber',
        placeholder: '请输入证件号码',
        Required: false,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'legalPersonCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'legalPersonCardValidEndTime',
        name: 'legalPersonIsCardLongTime'
    },
    {
        label: '职务',
        name: 'legalPersonDuty',
        placeholder: '请输入客户职务',
        Required: false,
        type: 'input'
    },
    {
        label: '电子邮箱',
        name: 'legalPersonEmail',
        placeholder: '请选择电子邮箱',
        Required: false,
        type: 'input',
        value: XWDocumentType
    },
    {
        label: '手机号码',
        name: 'legalPersonMobile',
        placeholder: '请输入手机号码',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'legalPersonBusinessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },

    // 授权代表信息
    {
        name: ' 授权代表信息',
        type: 'title'
    },
    {
        label: '姓名',
        name: 'authorizedRepresentativeFullName',
        placeholder: '请输入姓名',
        Required: false,
        type: 'input'
    },
    {
        label: '性别',
        name: 'authorizedRepresentativeSex',
        placeholder: '请选择性别',
        Required: false,
        type: 'select',
        value: XWGender
    },
    {
        type: 'inputNumber',
        labelObj: {
            label: '年龄',
            name: 'authorizedRepresentativeAge'
        },
        valueObj: {
            placeholder: '请输入年龄',
            min: 0,
            max: 150,
            style: {width: '150px'}
        }
    },
    {
        label: '职务',
        name: 'authorizedRepresentativeDuty',
        placeholder: '请输入客户职务',
        Required: false,
        type: 'input'
    },
    {
        label: '证件类型',
        name: 'authorizedRepresentativeCardType',
        placeholder: '请选择证件类型',
        Required: false,
        type: 'select',
        value: XWDocumentType
    },
    {
        label: '证件号码',
        name: 'authorizedRepresentativeCardNumber',
        placeholder: '请输入证件号码',
        Required: false,
        type: 'input'
    },
    {
        label: '证件有效期',
        name: 'authorizedRepresentativeCardValidEndTime',
        placeholder: '请选择',
        Required: false,
        type: 'rangePicker'
    },
    {
        type: 'checkbox',
        checkName: 'authorizedRepresentativeCardValidEndTime',
        name: 'authorizedRepresentativeIsCardLongTime'
    },
    {
        label: '电子邮箱',
        name: 'authorizedRepresentativeEmail',
        placeholder: '请输入电子邮箱',
        Required: false,
        type: 'input'
    },
    {
        label: '手机号码',
        name: 'authorizedRepresentativeMobile',
        placeholder: '请输入手机号码',
        Required: false,
        type: 'input'
    },
    {
        label: '办公邮编',
        name: 'authorizedRepresentativeWorkEmail',
        placeholder: '请输入办公邮编',
        Required: false,
        type: 'input'
    },
    {
        label: '办公地址',
        name: 'authorizedRepresentativeBusinessAddress',
        placeholder: '请输入办公地址',
        Required: false,
        type: 'input'
    },
    {
        label: '与该机构关系',
        name: 'authorizedRepresentativeRelation',
        placeholder: '请输入与该机构关系',
        Required: false,
        type: 'input'
    }
];

// 表格布局
export const formItemLayout = {
    labelCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 8
        }
    },
    wrapperCol: {
        xs: {
            span: 24
        },
        sm: {
            span: 16
        }
    }
};

export const submitFormLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 10,
            offset: 12
        }
    }
};

// 信息提示
export const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};

// 自然人不可编辑字段
export const CUSTOMERDISABLEDFIELDS = {
    customerType: true,
    customerName: true,
    cardType: true,
    cardNumber: true,
    nationality: true
};


// 机构不可编辑字段
export const MECHANISMDISABLEDFIELDS = {
    customerType: true,
    customerName: true,
    companyCardType: true,
    companyCardNumber: true,
    legalPersonFullName: true,
    legalPersonCardType: true,
    legalPersonCardNumber: true,
    authorizedRepresentativeFullName: true,
    authorizedRepresentativeCardType: true,
    authorizedRepresentativeCardNumber: true
};


// 自然人不可编辑字段
export const PRODUCTDISABLEDFIELDS = {
    customerType: true,
    customerName: true,
    custodian: true,
    companyCardType: true,
    companyCardNumber: true,
    legalPersonFullName: true,
    legalPersonCardType: true,
    legalPersonCardNumber: true,
    authorizedRepresentativeFullName: true,
    authorizedRepresentativeCardType: true,
    authorizedRepresentativeCardNumber: true
};

