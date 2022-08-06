import React, { useEffect, useState } from 'react';
import { Input, Button, Table } from 'antd';
import moment from 'moment';
import styles from './index.less';
import ParsingModal from './ParsingModal';
import SettingModal from './SettingModal';
import MXTable from '@/pages/components/MXTable';

import {getValuationTableCountParsedList} from '../../service'

const Valuation: React.FC<{}> = (props) => {
    const [searchParams, setsearchParams] = useState<object>({});
    const [parseVisiable, setParseVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setloading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<array>([]);
    const [total, settotal] = useState<number>(0);
    const [pageData, setpageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 10,
    });
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

    const tableColumns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center',
            width: 80,
        },
        {
            title: '产品名称',
            dataIndex: 'fundName',
            align: 'center',
        },
        {
            title: '产品代码',
            dataIndex: 'fundCode',
            align: 'center',
        },
        {
            title: '最新估值表日期',
            dataIndex: 'newValuationDate',
            align: 'center',
            render: (text) => moment(text).format('YYYY-MM-DD'),
        },
        {
            title: '估值表数量',
            dataIndex: 'valuationTableNum',
            align: 'center',
        },
    ];

    const onInputChange = (value) => {
        searchParams.fundCodeName = value.target.value
        setsearchParams({...searchParams});
    };

    const onSearch = async () => {
        getValuationTableCountParsedListAjax();
    };

    const onRest = () => {
        searchParams.fundCodeName = ''
        setsearchParams({...searchParams});
        getValuationTableCountParsedListAjax();
    };

    const valuationManager = () => {
        setParseVisible(true);
    };

    const modalSetting = () => {
        setVisible(true);
    };

    const onDel = () => {

    };

    const onTableSelectChange=(values)=>{
        setselectedRowKeys([...values])
      }

    const rowSelection = {
        selectedRowKeys,
        onChange: onTableSelectChange
      };

    const onTableChange = (data) => {
        console.log(data, 'data值为');
        const { current, pageSize } = data;
        pageData.pageNum = current;
        pageData.pageSize = pageSize;
        setpageData({ ...pageData });
        getValuationTableCountParsedListAjax();
    };

    const onParseHandleCancel=()=>{
        setParseVisible(false)
        getValuationTableCountParsedListAjax();
    }

    useEffect(() => {
        // getProductRewardAjax()
        getValuationTableCountParsedListAjax();
    }, []);

    const getValuationTableCountParsedListAjax = async () => {
        setloading(true);
        const res = await getValuationTableCountParsedList({
            ...searchParams,
            ...pageData,
        });
        if (+res.code === 1001) {
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        setloading(false);
        // console.log(res, 'res');
    };

    return (
        <div className={styles.container}>
            <div className={styles.searchBar}>
                {/* <div className={styles.searchBox}> */}
                    产品搜索：
                    <Input
                        className={styles.inputBox}
                        value={searchParams.fundCodeName}
                        onChange={onInputChange}
                        placeholder="请输入产品名称或代码"
                    />
                    <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                        查询
                    </Button>
                    <Button className={styles.btnBox} onClick={onRest}>
                        重置
                    </Button>
                {/* </div> */}
                {/* <div className={styles.handleBtns}> */}
                    <Button className={styles.btnBox} type="primary" onClick={valuationManager}>
                        估值表解析管理
                    </Button>
                    <Button className={styles.btnBox} type="primary" onClick={modalSetting}>
                        模板关联设置
                    </Button>
                    {/* <Button className={styles.btnBox}  disabled={!selectedRowKeys.length} onClick={onDel}>
                        删除
                    </Button> */}
                {/* </div> */}
            </div>

            <MXTable
          loading={loading}
          rowSelection={rowSelection}
          columns={tableColumns}
          dataSource={dataSource}
          rowKey="fileId"
          total={total}
          pageNum={pageData.pageNum}
          onChange={onTableChange}
        />

            <ParsingModal visible={parseVisiable} handleCancel={onParseHandleCancel} />
            <SettingModal visible={visible} handleCancel={() => setVisible(false)} />
        </div>
    );
};

export default Valuation;
