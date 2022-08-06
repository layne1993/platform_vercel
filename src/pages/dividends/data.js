/*
 * @Descripttion:
 * @version:
 * @Author: yezi
 * @Date: 2020-11-21 12:28:37
 * @LastEditTime: 2020-11-21 15:33:48
 */

import {XWDividendType} from '@/utils/publicData';
import {Select, DatePicker} from 'antd';

// 现金分红 -- 新建
export const CASH_DIVIDEND = [
    {
        type: 'selct',
        name: '',
        label: '',
        rules: [],
        placeholder: '请选择'
    }
];



// form表达 ---客户
export const FORM_CUSTOMER = [
    {
        type: 'select',
        name: 'dividendType',
        label: '分红类型',
        rules: [],
        placeholder: '请选择',
        options: XWDividendType
    },
    {
        type: 'input',
        name: 'productName',
        label: '产品名称',
        rules: [],
        placeholder: '请输入'
    },
    {
        type: 'datePicker',
        name: 'registerDate',
        label: '分红登记日',
        rules: [],
        placeholder: '请选择'
    },
    {
        type: 'datePicker',
        name: 'confirmDate',
        label: '分红确认日',
        rules: [],
        placeholder: '请选择'
    },
    {
        type: 'datePicker',
        name: 'againDate',
        label: '再投资日',
        rules: [],
        placeholder: '请选择'
    }
];


// form表达 ---全部
export const FORM_ALL = [
    {
        type: 'select',
        name: 'dividendType',
        label: '分红类型',
        rules: [],
        placeholder: '请选择',
        options: XWDividendType
    },
    {
        type: 'input',
        name: 'customerName',
        label: '客户名称',
        rules: [],
        placeholder: '请输入'
    },
    {
        type: 'input',
        name: 'productName',
        label: '产品名称',
        rules: [],
        placeholder: '请输入'
    },
    {
        type: 'datePicker',
        name: 'registerDate',
        label: '分红登记日',
        rules: [],
        placeholder: '请选择'
    },
    {
        type: 'datePicker',
        name: 'confirmDate',
        label: '分红确认日',
        rules: [],
        placeholder: '请选择'
    }
];


// form表达 ---产品
export const FORM_PRODUCT = [
    {
        type: 'select',
        name: 'dividendType',
        label: '分红类型',
        rules: [],
        placeholder: '请选择',
        options: XWDividendType
    },
    {
        type: 'input',
        name: 'customerName',
        label: '客户名称',
        rules: [],
        placeholder: '请输入'
    },
    {
        type: 'datePicker',
        name: 'registerDate',
        label: '分红登记日',
        rules: [],
        placeholder: '请选择'
    },
    {
        type: 'datePicker',
        name: 'confirmDate',
        label: '分红确认日',
        rules: [],
        placeholder: '请选择'
    }
];
