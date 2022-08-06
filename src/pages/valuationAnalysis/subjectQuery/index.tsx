import React, { useEffect, useState } from 'react';
import { Input, Button, Card, Form, DatePicker, Row,Col,Modal,message } from 'antd';
import moment from 'moment';
import MXTable from '@/pages/components/MXTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {history} from 'umi'

import {getParseDetailDataList,exportParseDetailDataList,deleteDetail} from './services'
import {exportFileBlob} from '@/utils/fileBlob'

import styles from './index.less';

const { confirm } = Modal;

const defaultSearch = {
    productName:'',
    subjectName:'',
    createDate:'',
    valuationDate:'',
    subjectCode:'',
    sortFiled: 'createDate',
    sortRule: 0
}

const Valuation: React.FC<{}> = (props) => {
    const [form] = Form.useForm();

    const [searchParams, setsearchParams] = useState<object>(JSON.parse(JSON.stringify(defaultSearch)));
    const [parseVisiable, setParseVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [loading, setloading] = useState<boolean>(false);
    const [dataSource, setdataSource] = useState<array>([]);
    const [total, settotal] = useState<number>(0);
    const [pageData, setpageData] = useState<object>({
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    });
    const [selectedRowKeys, setselectedRowKeys] = useState<array>([]);

    const tableColumns = [
        {
            title: '估值日期',
            dataIndex: 'valuationDate',
            align: 'center',
            width: 120
        },
        {
            title: '产品名称',
            dataIndex: 'fundName',
            align: 'center',
            render: (text,record) => (<div onClick={()=>onNameClick(record)} className={styles.tableBtn}>{text}</div>),
            width: 120
        },
        {
            title: '科目代码',
            dataIndex: 'subjectCode',
            align: 'center',
            width: 120
        },
        {
            title: '科目名称',
            dataIndex: 'subjectName',
            align: 'center',
            width: 120
        },
        {
            title: '币种',
            dataIndex: 'currency',
            align: 'center',
            width: 100
        },
        {
            title: '汇率',
            dataIndex: 'exchangeRate',
            align: 'center',
            width: 100
        },
        {
            title: '数量',
            dataIndex: 'number',
            align: 'center',
            width: 100
        },
        {
            title: '单位成本',
            dataIndex: 'perCost',
            align: 'center',
            width: 120
        },
        {
            title: '成本/原币',
            dataIndex: 'costOrigin',
            align: 'center',
            width: 120
        },
        {
            title: '成本/本币',
            dataIndex: 'costLocal',
            align: 'center',
            width: 120
        },
        {
            title: '成本占比',
            dataIndex: 'costProportion',
            align: 'center',
            width: 120
        },
        {
            title: '行情/市价',
            dataIndex: 'quotation',
            align: 'center',
            width: 100
        },
        {
            title: '市值/原币',
            dataIndex: 'quotationOrigin',
            align: 'center',
            width: 120
        },
        {
            title: '市值/本币',
            dataIndex: 'quotationLocal',
            align: 'center',
            width: 120
        },
        {
            title: '市值占比',
            dataIndex: 'quotationProportion',
            align: 'center',
            width: 120
        },
        {
            title: '增值/原币',
            dataIndex: 'valuationIncrOrigin',
            align: 'center',
            width: 120
        },
        {
            title: '增值/本币',
            dataIndex: 'valuationIncrLocal',
            align: 'center',
            width: 120
        },
        {
            title: '停牌信息',
            dataIndex: 'tradingSuspension',
            align: 'center',
            width: 120
        },
        {
            title: '权益信息',
            dataIndex: 'equityInfo',
            align: 'center',
            width: 120
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            align: 'center',
            // sorter: true,
            width: 120
        },
        {
            title: '操作',
            dataIndex: '',
            align: 'center',
            fixed:'right',
            render:(text,record)=>(<div className={styles.tableBtn} onClick={()=>onDelClick(record)}>删除</div>),
            width: 120
        },
    ];

    const onSearch = async () => {
        form.validateFields().then((values) => {
            console.log(values,'values')
            values.createDate = values.createDate ? moment(values.createDate).format("YYYY-MM-DD") : ''
            values.valuationDate = values.valuationDate ? moment(values.valuationDate).format("YYYY-MM-DD") : ''
            setsearchParams(values)
            getParseDetailDataListAjax(values)
        })

    };

    const onExport =async ()=>{
        const res = await exportParseDetailDataList({
            fileType:'product',
            exportIds:selectedRowKeys
        })
        exportFileBlob(res,'科目查询文件.xls')
    }

    const onRest = () => {
        form.resetFields();
        setsearchParams(JSON.parse(JSON.stringify(defaultSearch)));
        getParseDetailDataListAjax(JSON.parse(JSON.stringify(defaultSearch)));
    };

    // 基金名称跳转
    const onNameClick = (record)=>{
        history.replace({
            pathname: '/valuationAnalysis/valuationQuery/valuationDetail',
            query: {
                id:record.fileId
            }
        })
    }

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
        getParseDetailDataListAjax(searchParams);
    };

    // 删除
    const onDel = () => {
        confirm({
            title:'',
            content:'确认删除吗?',
            onOk(){
                deleteDetailAjax(selectedRowKeys)
                setselectedRowKeys([])
            },
            onCancel(){

            }
          })
    };

    const onDelClick = (record)=>{
        confirm({
            title:'',
            content:'确认删除吗?',
            onOk(){
              deleteDetailAjax([record.id])
            },
            onCancel(){

            }
        })
    }

    const deleteDetailAjax =async (detailIds)=>{
        const res = await deleteDetail({
            detailIds
        })
        if(+res.code === 1001){
            message.success('删除成功')
            getParseDetailDataListAjax(searchParams);
          }
    }

    useEffect(() => {
        getParseDetailDataListAjax(searchParams);
    }, []);

    const getParseDetailDataListAjax = async (params) => {
        setloading(true);
        const res = await getParseDetailDataList({
            ...params,
            ...pageData,
            "fileType":"product",
            sortFiled: 'createDate',
            sortRule: 0
        });
        if (+res.code === 1001) {
            setdataSource(res.data.list);
            settotal(res.data.total);
        }
        setloading(false);
    };

    return (
      <PageHeaderWrapper title="科目查询">
        <Card>
        <div className={styles.container}>
        <Form form={form} layout="horizontal">
            <Row>
                <Col span={8}>
                <Form.Item
                    label="产品名称"
                    name="productName"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item
                    label="科目名称"
                    name="subjectName"
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item
                    label="创建时间"
                    name="createDate"
                    style={{marginLeft:10}}
                >
                    <DatePicker style={{ width: '100%' }}/>
                </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={8}>
                <Form.Item
                    label="估值日期"
                    name="valuationDate"
                    style={{marginLeft:10}}
                >
                    <DatePicker style={{ width: '100%' }}/>
                </Form.Item>
                </Col>

                <Col span={8}>
                <Form.Item
                    label="科目代码"
                    name="subjectCode"
                    initialValue={''}
                    style={{marginLeft:10}}
                >
                    <Input/>
                </Form.Item>
                </Col>
            </Row>
            </Form>

            <div className={styles.btnBox}>
                <div></div>
                <div className={styles.rightBtn}>
                    <Button  disabled={!selectedRowKeys.length} className={styles.btnBox} type="primary" onClick={onExport}>
                        下载导出
                    </Button>
                    <Button disabled={!selectedRowKeys.length} className={styles.btnBox} danger onClick={onDel}>
                        删除
                    </Button>
                    <Button className={styles.btnBox} type="primary" onClick={onSearch}>
                        查询
                    </Button>
                    <Button className={styles.btnBox} onClick={onRest}>
                        重置
                    </Button>
                </div>
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
            scroll={{ x: '100%', scrollToFirstRowOnChange: true }}
        />
        </div>
        </Card>
      </PageHeaderWrapper>
    );
};

export default Valuation;
