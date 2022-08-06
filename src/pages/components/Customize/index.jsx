
import React, { useState, useEffect } from 'react';
import { Select, AutoComplete, Form, DatePicker, Button, Space } from 'antd';
import request from '@/utils/rest';
import moment from 'moment';
import styles from './index.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;

const dateFormat = 'YYYY-MM-DD HH:mm:ss';






const CustomSelect = (props) => {
    // console.log(props);
    // const [productList, setProductList] = useState([]);
    const [completevalue, setCompletevalue] = useState([]);
    const [dataList, setDataList] = useState([]);
    const { submitValue, displayName, source } = props;
    const getProductList = () => {
        return new Promise((resolve, reject) => {
            let formData = new window.FormData();
            request.postJSON('/product/queryByProductName', formData).then((res) => {
                if (res && res.code === 1008) {
                    if (source === 1) {
                        setDataList(res.data);
                    }

                }
                resolve(res);
            });

        });
    };
    const getCustomerList = () => {
        return new Promise((resolve, reject) => {
            let formData = new window.FormData();
            request.postJSON('/customer/queryByCustomerName', formData).then((res) => {
                if (res && res.code === 1008) {
                    if (source === 2) {
                        setDataList(res.data);
                    }
                }
                resolve(res);
            });

        });
    };
    useEffect(() => {
        getProductList();
        getCustomerList();
    }, [1]);




    // const onSearch = (searchText) => {
    //     console.log(searchText)
    // };

    // const onSelect = (selectData) => {
    //     setCompletevalue(selectData)
    // };

    const handleChange = (dataValue) => {
        setCompletevalue(dataValue);
    };


    return (
        <Form.Item name={submitValue}>
            <AutoComplete
                value={completevalue}
                filterOption={(input, option) =>
                    option.children &&
                    option.children.toString()
                        .toLowerCase()
                        .indexOf(input.toString().toLowerCase()) >= 0
                }
                placeholder="请选择或输入"
                allowClear
                dropdownMatchSelectWidth
                notFoundContent="暂无数据"
                onChange={handleChange}
                {
                    ...props
                }
            >
                {
                    dataList.map((item, index) => (
                        <AutoComplete.Option key={item[submitValue]} value={item[submitValue]}>
                            {item[displayName]}
                        </AutoComplete.Option>
                    ))
                }
            </AutoComplete>
        </Form.Item>
    );

};

const CustomPicker = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const pickerChange = (date, dateString) => {
        // console.log(date, dateString);
    };
    const pickerOnBlur = (date, dateString) => {
        setIsOpen(!isOpen);
        // console.log(date, dateString, '222222222222222');
    };
    const pickerOnfocus = () => {
        setIsOpen(!isOpen);
    };
    const onOpenChange = (open) => {
        // console.log(open);
    };
    return (
        <DatePicker format={'YYYY/MM/DD'} onOpenChange={onOpenChange} onChange={pickerChange} />
    );
};


const MultipleSelect = (props) => {

    const { setUp, value, label, type, formLabel, mode, params, isOptionLabelProp, extra, optionLabel, rules, formItemLayout = {} } = props;

    const [dataList, setDataList] = useState([]);

    const [selectProps, setSelectProps] = useState({});

    const getProductList = () => {
        return new Promise((resolve, reject) => {
            let formData = new window.FormData();
            request.postJSON('/product/queryByProductName', formData).then((res) => {
                if (res && res.code === 1008) {
                    if (type === 1) {
                        setDataList(res.data);
                    }

                }
                resolve(res);
            });

        }).catch((err) => {
            console.log('error', err);
        });
    };
    const getCustomerList = () => {
        return new Promise((resolve, reject) => {
            let formData = new window.FormData();
            request.postJSON('/customer/queryByCustomerName', formData).then((res) => {
                if (res && res.code === 1008) {
                    if (type === 2) {
                        setDataList(res.data);
                    }
                }
                resolve(res);
            });

        }).catch((err) => {
            console.log('error', err);
        });
    };

    const _search = () => {
        getProductList();
        getCustomerList();
    };

    useEffect(() => {
        _search();
    }, [1]);

    useEffect(() => {
        if (isOptionLabelProp) {
            setSelectProps({
                optionLabelProp: 'label'
            });
        }
    }, [isOptionLabelProp]);

    // const setUp = (value)=>{
    //     alert(1)
    //     console.log(value)
    // }


    return (
        <FormItem
            label={formLabel}
            name={params}
            className={styles.container}
            {...formItemLayout}
            rules={rules}
            extra={extra}
        >
            <Select
                placeholder="请选择"
                showSearch
                filterOption={(input, option) =>
                    option.children && option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                }
                notFoundContent="暂无数据"
                mode={mode}
                allowClear
                onFocus={_search}
                onChange={setUp}
                {...selectProps}
            >
                {
                    Array.isArray(dataList) &&
                    dataList.map((item, i) => {
                        return (
                            <Select.Option  label={item[optionLabel]} key={i} value={item[value]}>{item[label]}</Select.Option>
                        );
                    })
                }
            </Select>
        </FormItem>
    );

};


const CustomRangePicker = (props) => {

    // console.log(props)

    const [timeInterval, setTimeInterval] = useState([]);
    const { name, label, assignment, param, formItemLayout={} } = props;
    // console.log(assignment)
    // 获取时间节点
    const getTime = (date) => {
        let time = [];
        // 当传入为空时，返回空
        if (date === '') {
            time = ['', ''];
        }
        const endDate = moment().format('YYYY-MM-DD HH:mm:ss');

        let startDate = '';

        switch (date) {
            case '今天': startDate = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'); break;
            case '本周': startDate = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss'); break;
            case '本月': startDate = moment().startOf('month').format('YYYY-MM-DD HH:mm:ss'); break;
            case '近一周': startDate = moment().subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'); break;
            case '近一月': startDate = moment().subtract(1, 'months').format('YYYY-MM-DD HH:mm:ss'); break;
            default: break;
        }
        time = [moment(startDate, dateFormat), moment(endDate, dateFormat)];
        setTimeInterval(time);
        // console.log(time);
        assignment.current.setFieldsValue({
            [name]: time
        });
    };

    // useEffect(() => {

    // }, []);
    // const timeChange = (e)=>{
    //     console.log(e)
    // }
    return (
        <Form.Item label={label} name={name} {...formItemLayout} {...param}>
            <RangePicker  value={timeInterval} showTime={{ defaultValue: [moment().startOf('day'), moment().endOf('day')] }} renderExtraFooter={() => <Space>
                <Button type="primary" size="small" onClick={() => getTime('今天')}>今天</Button>
                <Button type="primary" size="small" onClick={() => getTime('本周')}>本周</Button>
                <Button type="primary" size="small" onClick={() => getTime('本月')}>本月</Button>
                <Button type="primary" size="small" onClick={() => getTime('近一周')}>近一周</Button>
                <Button type="primary" size="small" onClick={() => getTime('近一月')}>近一月</Button>
            </Space>} style={{ width: '100%' }} format={dateFormat}
            />
        </Form.Item>

    );

};


export { CustomSelect, CustomPicker, MultipleSelect, CustomRangePicker };



CustomSelect.defaultProps = {
    submitValue: 'productId', //传给后端的value,
    displayName: 'productName', //显示的name
    source: 1  //默认为1 产品列表 为2 是客户列表
};

CustomPicker.defaultProps = {

};

MultipleSelect.defaultProps = {
    label: '',                  // 显示的name,
    formLabel: '',              // formItem的label名称
    value: '',                  // 选中option的value值 产品id、客户id
    mode: '',                   // 单选、多选
    params: '',                 // 传给后端的选中列表,
    type: 1,                    // 默认为1 产品列表 为2 是客户列表
    isOptionLabelProp: false,   // 是否自定义展示回填内容
    optionLabel: '',             // 配置回填内容，与optionLabelProp配套适用
    setUp:()=>{}
};

CustomRangePicker.defaultProps = {
    name: '',
    label: ''
};
