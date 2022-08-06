import React, { useEffect, useState, useRef } from 'react';
import { Input, DatePicker, Button, message } from 'antd';
import { history } from 'umi';
import moment from 'moment';
import styles from './index.less';
import MXTable from '@/pages/components/MXTable';
import { getDataTableList, doParse, delDataTable } from "./service";

const { RangePicker } = DatePicker;
const sourceType = ['邮箱'];

const RelationShip: React.FC<{}> = props => {
    const [searchParams, setSearchParams] = useState<object>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [dataSource, setDataSource] = useState<array>([]);
    const [total, setTotal] = useState<number>(0);
    const [pageData, setPageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState<array>([]);
    const [isClickPost, setIsClickPost] = useState(false);
    const [time, setTime] = useState(120);
    let timeChange = useRef<any>(null);

    const tableColumns = [
        {
            title: '数据源编号',
            dataIndex: 'id',
            align: 'center',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center'
        },
        {
            title: '数据源名称',
            dataIndex: 'sourceName',
            align: 'center',
            render: (text, record) => <a href="#" onClick={() => handleLink(record)}>{text}</a>
        },
        {
            title: '源类型',
            dataIndex: 'sourceType',
            align: 'center',
            render: text => <span>{sourceType[text]}</span>
        },
        {
            title: '今日数据',
            dataIndex: 'todayData',
            align: 'center',
        },
        {
            title: '本周数据',
            dataIndex: 'weekDate',
            align: 'center',
        },
        {
            title: '备注',
            dataIndex: 'remark',
            align: 'center',
        },
        {
            title: '操作',
            align: 'center',
            render(data) {
                return (
                    <>
                        <span className={styles.editBtn} onClick={() => onEdit(data)}>编辑</span>
                        <span className={styles.delBtn} onClick={() => onDel(data)}>删除</span>
                    </>
                );
            }
        }
    ];

    const handleLink = record => {
        history.push(`/valuationAnalysis/dataSourceQuery/edit/${record.id}?type=show`);
    };

    const onEdit = async data => {
        history.push(`/valuationAnalysis/dataSourceQuery/edit/${data.id}?type=edit`);
    };

    const onDel = async data => {
        const res = await delDataTable(data.id);
        if (+res.code === 1001) {
            message.success('删除成功');
            getDataTableListAjax();
        } else {
            message.error(res.message);
        }
    };

    const onInputChange = e => {
        searchParams.sourceName = e.target.value;
        setSearchParams({ ...searchParams });
    };

    const onRangeChange = (date, dateStr) => {
        searchParams.startTime = dateStr[0];
        searchParams.endTime = dateStr[1];
        setSearchParams({ ...searchParams });
    };

    const onSearch = () => {
        getDataTableListAjax();
    };

    const onRest = () => {
        searchParams.sourceName = '';
        searchParams.startTime = '';
        searchParams.endTime = '';
        setSearchParams({ ...searchParams });
        getDataTableListAjax();
    };

    const onCreate = () => {
        history.push('/valuationAnalysis/dataSourceQuery/edit/0?type=edit');
    };

    const onPost = async () => {
        // if (!sessionStorage.getItem('dateParser')) {
        //     let date = new Date();
        //     sessionStorage.setItem('dateParser', Date.parse(date));
        // } else {
        //     let dateParser = sessionStorage.getItem('dateParser');
        //     let nowDate = new Date();
        //     console.info(dateParser, Date.parse(nowDate) - dateParser, 'oooooo')
        //     if (Date.parse(nowDate) - dateParser < 120000) {
        //         let time = parseInt((Date.parse(nowDate) - dateParser) / 1000);
        //         message.warning(`数据解析中，预计${120 - time}s完成`);
        //         return;
        //     } else {
        //         sessionStorage.setItem('dateParser', Date.parse(nowDate));
        //         console.info('trerer');
        //     }
        // }
        try {
            const res = await doParse();
            let date = new Date();
            sessionStorage.setItem('dateParser', Date.parse(date));
            timeChange.current = setInterval(() => setTime(t => --t), 1000);
        } catch (err) {
            message.warning(`数据解析失败`);
            setIsClickPost(false);
        }
    };

    useEffect(() => {
        console.info('ddddddd000', time);
        if (time > 0 && time < 120) {
            console.info('ddddddd');
            setIsClickPost(true);
        } else if (time != 120) {
            setTime(120);
            clearInterval(timeChange.current);
            setIsClickPost(false);
        }
    }, [time]);

    useEffect(() => {
        clearInterval(timeChange.current);
        if (sessionStorage.getItem('dateParser')) {
            let dateParser = sessionStorage.getItem('dateParser');
            let nowDate = new Date();
            let timer = Date.parse(nowDate) - dateParser;
            console.info('这里0', Date.parse(nowDate) - dateParser)
            if (timer < 120000) {
                console.info('这里', Date.parse(nowDate) - dateParser)
                let time = parseInt(timer / 1000);
                setTime(120 - time);
                timeChange.current = setInterval(() => setTime(t => --t), 1000);
            }
        }
        return () => clearInterval(timeChange.current);
    }, []);

    const onTableSelectChange = (values) => {
        setSelectedRowKeys([...values])
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: onTableSelectChange
    };

    const onTableChange = data => {
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setPageData({ ...pageData });
        getDataTableListAjax();
    };

    const getDataTableListAjax = async () => {
        setLoading(true);
        const res = await getDataTableList({
            ...searchParams,
            ...pageData
        });
        if (+res.code === 1001) {
            setDataSource(res.data.list);
            setTotal(res.data.total);
        }
        setLoading(false);
    };

    useEffect(() => {
        getDataTableListAjax();
    }, []);

    history.block((location, action) => {
        getDataTableListAjax();
    })

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                数据源名称：
                <Input
                    className={styles.inputBox}
                    value={searchParams.sourceName}
                    onChange={onInputChange}
                    placeholder="请选择名称"
                    style={{ marginRight: 16 }}
                />
                创建时间：
                <RangePicker
                    className={styles.inputBox}
                    value={[
                        searchParams.startTime ? moment(searchParams.startTime) : null,
                        searchParams.endTime ? moment(searchParams.endTime) : null
                    ]}
                    onChange={onRangeChange}
                />
                <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                    查询
                </Button>
                <Button className={styles.btnBox} onClick={onRest}>
                    重置
                </Button>
            </div>
            <div className={styles.searchBar}>
                {
                    !isClickPost ? <Button className={styles.btnBox} type="primary" onClick={onPost}>
                        手动触发数据解析
                    </Button> :
                        <Button className={styles.btnBox} type="primary" disabled>
                            数据解析中，预计{time}秒完成
                        </Button>
                }
                <Button className={styles.btnBox} type="primary" onClick={onCreate}>
                    新增
                </Button>
            </div>
            <MXTable
                loading={loading}
                rowSelection={rowSelection}
                columns={tableColumns}
                dataSource={dataSource}
                rowKey="id"
                total={total}
                pageNum={pageData.pageNum}
                onChange={onTableChange}
            />
        </div>
    );
};

export default RelationShip;
