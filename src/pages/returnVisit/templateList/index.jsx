import React, {useState, useEffect} from 'react';
import { PageHeaderWrapper} from '@ant-design/pro-layout';
import { Button, Card, Spin} from 'antd';
import MXTable from '@/pages/components/MXTable';
import { connect} from 'dva';
import moment from 'moment';
import { history } from 'umi';
import styles from './styles.less';
const TemplateList = (props) => {
    const columns = [
        {
            title: '回访单类型',
            dataIndex: 'askType',
            align: 'center',
            render(data) {
                if(data === 0)  return '募集回访';
                if(data === 1)  return '适当性回访';
                return '--';
            }
        },
        {
            title: '回访单版本号',
            dataIndex: 'versionNumber',
            align: 'center'
        },
        {
            title: '模板状态',
            dataIndex: 'isDelete',
            align: 'center',
            render(data) {
                if(data === 0) return '生效';
                if(data === 1) return '失效';
            }
        },
        {
            title: '发布状态',
            dataIndex: 'publishStatus',
            align: 'center',
            render(data) {
                if(data === 0) return '编辑';
                if(data === 1) return '已发布';
            }
        },
        {
            title: '创建人',
            dataIndex: 'managerUserName',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            align: 'center',
            sorter: (a, b) => a.createTime - b.createTime,
            render(data) {
                return data ? moment(data).format('YYYY-MM-DD') : '--';
            }
        },
        {
            title: '操作',
            align: 'center',
            render(data) {
                return (
                    <span
                        className={styles.operation}
                        onClick={(e) => editOrViewTemplate(data)}
                    >
                        {data.publishStatus ? '查看' : '编辑'}
                    </span>
                );
            }
        }
    ];
    const initPageData = {
        // 当前的分页数据
        pageNum: 1,
        pageSize: 20
    };
    const [dataSource, setDataSource] = useState({});
    const [pageData, changePageData] = useState(initPageData);
    const _tableChange = (p, e, s) => {
        changePageData({
            ...pageData,
            pageNum:p.current,
            pageSize: p.pageSize
        });
    };
    const editOrViewTemplate = (data) => {
        history.push(`/returnVisit/template/${data.publishStatus ? 'view' : 'edit'}/${data.riskaskId}`);
    };

    const addTemplate = (askType) => {
        history.push({
            pathname: `/returnVisit/template/edit?askType=${askType}`
        });

    };

    useEffect(()=>{
        const {dispatch} = props;
        dispatch({
            type: 'returnVisitList/getTemplateList',
            payload: pageData,
            callback(res) {
                setDataSource(res);
            }
        });
    }, [pageData.pageNum, pageData.pageSize]);
    return (
        <PageHeaderWrapper title="电子回访单模板列表">
            <Spin spinning={Boolean(props.loading)}>
                <Card>
                    <div className={styles.btnG}>
                        <Button
                            onClick={(e)=>addTemplate(1)}
                            type="primary"
                            className={styles.firstBtn}
                        >
                            新建募集回访单模板
                        </Button>
                        <Button
                            onClick={(e)=>addTemplate(2)}
                            type="primary"
                        >
                            新建适当性回访单模板
                        </Button>
                    </div>
                    <MXTable
                        columns={columns}
                        dataSource={dataSource.data || []}
                        total={dataSource.total}
                        pageNum={pageData.pageNum}
                        rowKey="riskaskId"
                        scroll={{x: '100%', }}
                        onChange={(p, e, s) => _tableChange(p, e, s)}
                        rowSelection={null}
                        // loading={props.loading}
                    />
                </Card>
            </Spin>
        </PageHeaderWrapper>
    );
};

export default connect(({loading}) => ({
    loading: loading.effects['returnVisitList/getTemplateList']
}))(TemplateList);
