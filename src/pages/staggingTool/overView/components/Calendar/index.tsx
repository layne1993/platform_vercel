import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { message, Table, Spin, Checkbox, Select, DatePicker } from 'antd';
import { connect, history } from 'umi';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';
import debounce from 'lodash.debounce';

import _styles from './index.less';

// 渲染表头
const RenderTableTitle = ({title = '', onChangeDate }) => {
    if (title === 'step') {
        return (
            <div className={_styles.theadIconWrapper} style={{ justifyContent: 'flex-end' }}>
                <div
                    className={_styles.theadIconBox}
                    onClick={() => onChangeDate('prev')}
                >
                    <LeftOutlined />
                </div>
            </div>
        );
    }

    if (title === 'right') {
        return (
            <div className={_styles.theadIconWrapper} style={{ justifyContent: 'flex-start' }}>
                <div
                    className={_styles.theadIconBox}
                    onClick={() => onChangeDate('next')}
                >
                    <RightOutlined />
                </div>
            </div>
        );
    }

    const today = moment().format('YYYY-MM-DD');
    return <div className={`${_styles.thead} ${title === today ? _styles.today : ''}`}>{title}</div>;
};

// 渲染表格第一列
const RenderTableStep = ({ step, stepList, onChange }) => {
    const currStep = stepList.find((item) => item.step === step);
    if (!currStep) return <></>;

    const { text, isAvailable } = currStep;
    return (
        <div className={`${_styles.stepCell} ${ isAvailable ? _styles.available : ''}`}>
            <Checkbox checked onChange={onChange}></Checkbox>
            <div className={_styles.stepText}>{text}</div>
        </div>
    );
};

// 渲染表格
const RenderTableCell = ({ data }) => {
    const colorMap = {
        1: '#6D93FF',
        2: '#FB560A',
        3: '#9B9B9B'
    };

    // stepStatus 为 1，2，3时，才有颜色标识
    const dotColors = {
        1: '#ff3f3f',
        2: '#fdc753',
        3: '#3d7fff'
    };
    const handleNavigate = (item) => { 
        // console.log(item)
        // return;
        history.push({
           
            pathname: `/staggingTool/overView/stock/${item.code}`
        });
    };

    return (
        <div className={_styles.tableCell}>
            {data.map((item, index) => (
                <div key={index} className={_styles.tableCellItem}>
                    <span
                        style={{ color: colorMap[item.apply] || '', cursor: 'pointer' }}
                        onClick={() => handleNavigate(item)}
                    >
                        {`${item.code} [${item.name}]`}
                    </span>
                    {item.haveOfflineApply === 0 && <span>仅网上</span>}
                    <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '4px', backgroundColor: dotColors[item.stepStatus] || '' }}></span>
                </div>
            ))}
        </div>
    );
};

const Calendar = (props) => {
    const { dispatch, calendarLoading, isSearch, staggingOverview } = props;
    const { searchOptions, stepList, baseDate, calendarData } = staggingOverview;
    const [columns, setColumns] = useState([]);
    const [tableData, setTableData] = useState([]);

    // 切换打新步骤选择
    const handleToggleCheck = useCallback((step, checked = false) => {
        dispatch({
            type: 'staggingOverview/updateStepList',
            payload: {
                step,
                checked
            }
        });
    }, [dispatch]);

    const handleChangeDate = useCallback((type) => {
        let date;
        switch (type) {
            case 'prev':
                date = moment(baseDate).add(-5, 'd');
                break;
            case 'next':
                date = moment(baseDate).add(5, 'd');
                break;
            default:
                date = type;
                break;
        }

        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: { baseDate: date.format('YYYY-MM-DD') }
        });
    }, [baseDate, dispatch]);

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

    const handleChooseStock = useCallback((item) => {
        if (item) {
            const { apply } = item;
            if (apply === 3) {
                message.info('该标的不能打新！');
                return;
            }
            history.push({
                pathname: `/staggingTool/overView/stock/${item.value}`
            });
        }
        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: {
                searchOptions: []
            }
        });
    }, [dispatch]);

    // 初始化数据
    useEffect(() => {
        const calendarData = [...Array(5)].map((item, index) => {
            return {
                date: moment().add(index - 2, 'd').format('YYYY-MM-DD')
            };
        });
        dispatch({
            type: 'staggingOverview/updateModelData',
            payload: { calendarData }
        });
    }, [dispatch]);

    // 获取数据
    useEffect(() => {
        dispatch({
            type: 'staggingOverview/getCalendarData',
            payload: { baseDate }
        });
    }, [baseDate, dispatch]);

    // 解析表头 & 表格数据
    useEffect(() => {
        const columns: any[] = [{
            title: <RenderTableTitle title="step" onChangeDate={handleChangeDate} />,
            width: 100,
            align: 'center',
            dataIndex: 'step',
            render: (val) => {
                return (
                    <RenderTableStep
                        step={val}
                        stepList={stepList}
                        onChange={() => handleToggleCheck(val)}
                    />
                );
            }
        }];
        const tableData = [];
        calendarData.forEach((item, i) => {
            const { date, items1 = [], items2 = [], items3 = [], items4 = [], items5 = [], items6 = [], items7 = [] } = item;
            columns.push({
                title: <RenderTableTitle title={moment(date).format('YYYY-MM-DD')} onChangeDate={handleChangeDate} />,
                align: 'center',
                dataIndex: `date${i + 1}`,
                render: (val) => <RenderTableCell data={val} />
            });
            if (i === 0) {
                tableData.push(
                    { step: 'step1', date1: items1 },
                    { step: 'step2', date1: items2 },
                    { step: 'step3', date1: items3 },
                    { step: 'step4', date1: items4 },
                    { step: 'step5', date1: items5 },
                    { step: 'step6', date1: items6 },
                    { step: 'step7', date1: items7 },
                );
            } else {
                tableData[0][`date${i + 1}`] = items1;
                tableData[1][`date${i + 1}`] = items2;
                tableData[2][`date${i + 1}`] = items3;
                tableData[3][`date${i + 1}`] = items4;
                tableData[4][`date${i + 1}`] = items5;
                tableData[5][`date${i + 1}`] = items6;
                tableData[6][`date${i + 1}`] = items7;
            }
        });
        columns.push({
            title: () => <RenderTableTitle title="right" onChangeDate={handleChangeDate} />,
            width: 60,
            align: 'center',
            dataIndex: 'right',
            render: () => ''
        });

        setColumns(columns);
        setTableData(tableData.filter((item) => {
            const step = stepList.find((subItem) => subItem.step === item.step);
            return step.checked;
        }));
    }, [calendarData, handleChangeDate, handleToggleCheck, stepList]);

    return (
        <div className={_styles.staggingCalendar}>
            <div className={_styles.stepBox}>
                IPO步骤显示（多选）：
                {stepList.map((item) => (
                    <Checkbox
                        key={item.step}
                        checked={item.checked}
                        onChange={(e) => handleToggleCheck(item.step, e.target.checked)}
                    >
                        {item.text}
                    </Checkbox>
                ))}
            </div>
            <div className={_styles.actionbar}>
                <div className={_styles.legend}>
                    <div className={_styles.legendItem} style={{ color: '#6D93FF' }}>
                        <div className={_styles.legandTag} style={{ backgroundColor: '#6D93FF' }}></div>参与中
                    </div>
                    <div className={_styles.legendItem} style={{ color: '#FB560A' }}>
                        <div className={_styles.legandTag} style={{ backgroundColor: '#FB560A' }}></div>可参与
                    </div>
                    <div className={_styles.legendItem} style={{ color: '#9B9B9B' }}>
                        <div className={_styles.legandTag} style={{ backgroundColor: '#9B9B9B' }}></div>未参与
                    </div>
                </div>
                <div className={_styles.datePicker}>
                    查看：
                    <DatePicker
                        style={{ width: '200px' }}
                        onChange={handleChangeDate}
                    ></DatePicker>
                </div>
                <div className={_styles.searchForm}>
                    标的查询：
                    <Select
                        allowClear
                        labelInValue
                        showSearch
                        showArrow={false}
                        placeholder="请输入标的"
                        style={{ width: '200px' }}
                        filterOption={false}
                        notFoundContent={isSearch ? <Spin size="small" /> : '暂无数据'}
                        options={searchOptions}
                        onSearch={debounceFetcher}
                        onChange={handleChooseStock}
                    />
                </div>
            </div>
            <Table
                loading={calendarLoading}
                pagination={false}
                rowKey={(row) => row.step}
                columns={columns}
                dataSource={tableData}
            ></Table>
        </div>
    );
};

export default connect(({ staggingOverview, loading }) => ({
    isSearch: loading.effects['staggingOverview/getStockByKeyword'],
    calendarLoading: loading.effects['staggingOverview/getCalendarData'],
    staggingOverview
}))(Calendar);
