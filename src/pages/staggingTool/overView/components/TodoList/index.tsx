import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { message, Table, Form, Input, Select, Button, DatePicker, Divider, Spin } from 'antd';
import { connect, history } from 'umi';
import moment from 'moment';
import { CalendarOutlined } from '@ant-design/icons';
import debounce from 'lodash.debounce';
import _styles from './index.less';
const { Option } = Select;

const processTypeList = [
    { type: 1, text: '市值判断' },
    { type: 2, text: '材料提交' },
    { type: 3, text: '询价' },
    { type: 4, text: '询价复核' },
    { type: 5, text: '发行公告' },
    { type: 6, text: '申购' },
    { type: 7, text: '申购复核' },
    { type: 8, text: '公布中签' },
    { type: 9, text: '缴款日' },
    { type: 10, text: '上市' }
];

const TodoForm = (props) => {
    const { dispatch, isSearch, staggingOverview } = props;
    const { searchOptions, selectedDate } = staggingOverview;
    const [form] = Form.useForm();
    const [employeeList, setEmployeeList] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            dispatch({
                type: 'staggingOverview/updateModelData',
                payload: {
                    searchOptions: []
                }
            });
            dispatch({
                type: 'staggingOverview/getStockByKeyword',
                payload: {
                    keyword: value
                }
            });
        };

        return debounce(loadOptions, 800);
    }, [dispatch]);

    const handleSubmitTodo = useCallback(async () => {
        const values = form.getFieldsValue();
        const { stock, processType, remarks, managerUserId, endTime } = values;
        const { value } = stock;
        const label = searchOptions.find((i) => i.value === value).securityAbbr;
        const res = await dispatch({
            type: 'staggingOverview/createTodo',
            payload: {
                secuCode: value,
                securityAbbr: label,
                remarks,
                processType,
                managerUserId,
                endTime: moment(endTime).format('YYYY-MM-DD')
            }
        });

        if (res.code === 1008) {
            message.success('添加待办成功');
            dispatch({
                type: 'staggingOverview/getTodoListByDate',
                payload: { date: selectedDate }
            });
        } else {
            message.error(res.message);
        }
    }, [dispatch, form, searchOptions, selectedDate]);

    useEffect(() => {
        dispatch({
            type: 'accountInfo/querySelectAllUser',
            payload: {
                pageSize: 9999999
            },
            callback: (res) => {
                if (res.code === 1008 && res.data) {
                    setEmployeeList(res.data.list || []);
                }
            }
        });
    }, [dispatch]);

    return (
        <Form form={form} name="create_todo_form" layout="inline" onFinish={handleSubmitTodo}>
            <Form.Item
                name="stock"
                rules={[{ required: true, message: '请选择标的' }]}
            >
                <Select
                    allowClear
                    labelInValue
                    showSearch
                    showArrow={false}
                    placeholder="请选择标的"
                    style={{ width: '200px' }}
                    filterOption={false}
                    notFoundContent={isSearch ? <Spin size="small" /> : null}
                    options={searchOptions.filter((item) => item.apply !== 3)}
                    onSearch={debounceFetcher}
                />
            </Form.Item>
            <Form.Item
                name="processType"
                rules={[{ required: true, message: '请选择事项' }]}
            >
                <Select
                    style={{ width: 130 }}
                    placeholder="请选择事项"
                >
                    {processTypeList.map((item, index) => (
                        <Option
                            key={index}
                            value={item.type}
                        >
                            {item.text}
                        </Option>
                    ))}
                </Select>
            </Form.Item>
            <Form.Item
                name="remarks"
                rules={[{ required: true, message: '请输入备注' }]}
            >
                <Input style={{ width: 300 }} placeholder="请输入备注" />
            </Form.Item>
            <Form.Item
                name="managerUserId"
                rules={[{ required: true, message: '请选择通知人' }]}
            >
                <Select
                    showSearch
                    style={{ width: 130 }}
                    placeholder="请选择通知人"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        employeeList.map((item, index) => (
                            <Option key={index} value={item.managerUserId}>{item.userName}</Option>
                        ))
                    }
                </Select>
            </Form.Item>
            <Form.Item
                name="endTime"
                rules={[{ required: true, message: '请选择截止时间' }]}
            >
                <DatePicker />
            </Form.Item>
            <Form.Item>
                <Button
                    type="primary"
                    htmlType="submit"
                >
                    增加待办
                </Button>
            </Form.Item>
        </Form>
    );
};

const CreateTodoForm = connect(({ staggingOverview, loading }) => ({
    isSearch: loading.effects['staggingOverview/getStockByKeyword'],
    staggingOverview
}))(TodoForm);

const TodoList = (props) => {
    const { dispatch, tableLoading, createLoading, updateLoading, staggingOverview } = props;
    const { todoBaseDate, selectedDate, todoDateList, todoList } = staggingOverview;
    const [isOpen, setIsOpen] = useState(false);

    const handleChangeDate = (date) => {
        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: { selectedDate: date }
        });
    };

    const handleChooseDate = useCallback((date) => {
        setIsOpen(false);
        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: {
                selectedDate: date.format('YYYY-MM-DD'),
                todoBaseDate: date.format('YYYY-MM-DD')
            }
        });
    }, [dispatch]);

    const handleUpdateTodo = useCallback(async (row) => {
        const res = await dispatch({
            type: 'staggingOverview/updateTodo',
            payload: {
                id: row.id
            }
        });

        if (res.code === 1008) {
            message.success('处理成功');
            dispatch({
                type: 'updateModelData',
                payload: {
                    todoList: [...todoList].map((item) => {
                        if (item.id === row.id) item.handleStatus = 1;
                        return item;
                    })
                }
            });
        } else {
            message.error(res.message);
        }
    }, [dispatch, todoList]);

    const handleResolve = (item) => {
        const { secuCode } = item;
        history.push({
            pathname: `/staggingTool/overView/stock/${secuCode}`
        });
    };

    const columns: any[] = [
        {
            title: '标的名称',
            align: 'center',
            dataIndex: 'securityAbbr'
        },
        {
            title: '事项名称',
            align: 'center',
            dataIndex: 'processType',
            render: (val) => processTypeList.find((item) => item.type === val).text
        },
        {
            title: '截止时间',
            align: 'center',
            dataIndex: 'endTime',
            render: (val) => moment(val).format('YYYY-MM-DD')
        },
        {
            title: '事项来源',
            align: 'center',
            dataIndex: 'sourceName'
        },
        {
            title: '通知人',
            align: 'center',
            dataIndex: 'managerUserName'
        },
        {
            title: '备注',
            align: 'center',
            dataIndex: 'remarks'
        },
        {
            title: '处理',
            align: 'center',
            dataIndex: 'handleStatus',
            width: 200,
            render: (val, row) => {
                if (val === 0) {
                    return <>
                        <span className={_styles.isActive} onClick={() => handleUpdateTodo(row)}>标为已处理 &radic;</span>
                        <Divider type="vertical" />
                        <span className={_styles.isActive} onClick={() => handleResolve(row)}>去处理 -&rsaquo;</span>
                    </>;
                }

                return <>
                    <span>已处理 &radic;</span>
                    <Divider type="vertical" />
                    <span>去处理 -&rsaquo;</span>
                </>;
            }
        }
    ];

    // 初始化日期
    useEffect(() => {
        const todoDateList = [...Array(5)].map((item, index) => {
            return {
                date: moment(todoBaseDate).add(index - 2, 'd').format('YYYY-MM-DD')
            };
        });
        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: { todoDateList }
        });
    }, [dispatch, todoBaseDate]);

    // 切换日期，获取待办列表
    useEffect(() => {
        dispatch({
            type: 'staggingOverview/getTodoListByDate',
            payload: { date: selectedDate }
        });
    }, [dispatch, selectedDate]);

    return (
        <div className={_styles.todoList}>
            <div className={_styles.calendar}>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <CalendarOutlined className={_styles.calendarIcon} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)} />
                    <DatePicker
                        open={isOpen}
                        format="YYYY-MM-DD"
                        style={{ position: 'absolute', top: '10px', left: 0, right: 0, visibility: 'hidden' }}
                        onChange={handleChooseDate}
                    ></DatePicker>
                </div>
                <ul>
                    {todoDateList.map((item, index) => (
                        <li
                            key={item.date}
                            className={item.date === selectedDate ? _styles.active : ''}
                            onClick={() => handleChangeDate(item.date)}
                        >
                            {item.date}
                        </li>
                    ))}
                </ul>
            </div>
            <div className={_styles.tableBox}>
                <Table
                    rowKey="id"
                    loading={tableLoading || createLoading || updateLoading}
                    scroll={{ y: 260 }}
                    columns={columns}
                    dataSource={todoList}
                    pagination={false}
                ></Table>
                <CreateTodoForm></CreateTodoForm>
            </div>
        </div>
    );
};

export default connect(({ staggingOverview, loading }) => ({
    tableLoading: loading.effects['staggingOverview/getTodoListByDate'],
    createLoading: loading.effects['staggingOverview/createTodo'],
    updateLoading: loading.effects['staggingOverview/updateTodo'],
    staggingOverview
}))(TodoList);
