import React, { Fragment, useState, useRef, useEffect } from 'react';
import { Button, Alert, Table, Modal, message, notification } from 'antd';
import { cloneDeep } from 'lodash';
import MXTable from '@/pages/components/MXTable';
import { connect } from 'dva';
import SaveTem from './SaveTem';
import styles from './styles.less';
import moment from 'moment';
import { getPermission } from '@/utils/utils';
import needDisposeColumns from '../../needDisposeColumns';

const openNotificationWithIcon = (type, message) => {
    notification[type]({
        message
    });
};

const TableContent: React.FC<TableContentPro> = (props) => {
    const { authEdit, authExport } = getPermission(90100);
    const [showModal, changeShowModal] = useState<boolean>(false);
    const temFormRef: React.MutableRefObject<any> = useRef();
    const [columns, setColumns] = useState<any[]>();
    const [templateName, setTemplateName] = useState<string | undefined>('');

    const saveTem = () => {
        const formData = cloneDeep(props.formRef.current.getFieldsValue());
        const { dispatch } = props;
        // 如果选择模板则为更新模板
        temFormRef.current
            .validateFields()
            .then((data) => {
                if (formData.timeArr) {
                    formData.startDate = moment(formData.timeArr[0]).format('YYYY-MM-DD');
                    formData.endDate = moment(formData.timeArr[1]).format('YYYY-MM-DD');
                }
                if (formData.time) {
                    formData.startDate = formData.endDate = moment(formData.time).format(
                        'YYYY-MM-DD',
                    );
                }
                delete formData.productIds;
                delete formData.timeArr;
                delete formData.time;
                formData.standardCodes =
                    formData.standardCodes && formData.standardCodes.map((item) => item.value);
                dispatch({
                    type: 'customMetricsTable/saveTemplate',
                    payload: {
                        ...formData,
                        ...data,
                        targets: props.customMetricsSelectTree.checkedKeys
                    },
                    callback(res) {
                        if (res.code === 1008) {
                            openNotificationWithIcon('success', '保存成功');
                            changeShowModal(false);
                            // 请求模板数据
                            dispatch({
                                type: 'queryForm/queryTempList',
                                payload: { templateType: formData.templateType, pageNum: 0 }
                            });
                        } else {
                            openNotificationWithIcon('error', res.message);
                        }
                    }
                });
            })
            .catch((err) => console.log(err));
    };

    const deleteTempalte = () => {
        const formData = cloneDeep(props.formRef.current.getFieldsValue());
        if (formData.productTargetTemplateId === undefined) {
            message.error('请先选择模板');
        } else {
            Modal.confirm({
                title: '是否删除该模板',
                onOk() {
                    return new Promise((resolve, reject) => {
                        const { dispatch } = props;
                        dispatch({
                            type: 'customMetricsTable/deleteTem',
                            payload: { productTargetTemplateId: formData.productTargetTemplateId },
                            callback(res) {
                                if (res.code === 1008) {
                                    openNotificationWithIcon('success', '删除成功');
                                    props.formRef.current.setFieldsValue({
                                        productTargetTemplateId: undefined
                                    });
                                    // 请求模板数据
                                    dispatch({
                                        type: 'queryForm/queryTempList',
                                        payload: {
                                            templateType: formData.templateType,
                                            pageNum: 0
                                        }
                                    });
                                    resolve();
                                } else {
                                    openNotificationWithIcon('error', res.message);
                                    reject();
                                }
                            }
                        });
                    });
                }
            });
        }
    };

    const _tableChange = (p, e, s) => {
        const { dispatch } = props;
        const { pageNumber, pageSize } = props.customMetricsTable;
        if (pageNumber !== p.current) {
            dispatch({
                type: 'customMetricsTable/changePageNumber',
                pageNumber: p.current
            });
        }
        if (pageSize !== p.pageSize) {
            dispatch({
                type: 'customMetricsTable/changePageSize',
                pageSize: p.pageSize
            });
        }
    };

    const openModal = () => {
        const formData = cloneDeep(props.formRef.current.getFieldsValue());
        const nowData = props.queryForm.templateArr.find(
            (item) => item.productTargetTemplateId === formData.productTargetTemplateId,
        );
        changeShowModal(true);
        setTemplateName(nowData?.templateName);
    };

    const tableExport = () => {
        const { dispatch } = props;
        // 点击确定的时候保存targets 和 表单数据，因为Table的数据点击的时候查询，导出的为查询时的参数
        const formData = props.queryForm.formData;
        const targets = props.queryForm.checkedArrUseExportAndQueryTableList;
        if (!Object.keys(formData).length || !targets.length) return;
        dispatch({
            type: 'customMetricsTable/exportTemplate',
            payload: { ...formData, targets },
            callback(response) {
                let fileName = response.headers['content-disposition']
                    .split(';')[1]
                    .split('filename*=utf-8\'\'')[1];
                fileName = decodeURIComponent(fileName);
                let blob = response.data;
                let downloadElement = document.createElement('a');
                let href = window.URL.createObjectURL(blob);
                downloadElement.href = href;
                downloadElement.download = fileName;
                document.body.appendChild(downloadElement);
                downloadElement.click();
                document.body.removeChild(downloadElement);
                window.URL.revokeObjectURL(href);
            },
            errorCallback(errMessage) {
                openNotificationWithIcon('error', errMessage);
            }
        });
    };

    // useEffect(() => {
    //     const { customMetricsSelectTree } = props;
    //     const columns = customMetricsSelectTree.checkedOrgArr.map((item) => ({
    //         title: item.targetName,
    //         dataIndex: item.targetCode,
    //         width: 200,
    //         align: 'center',
    //         render: (e) => e || '--',
    //     }));
    //     setColumns(columns);
    // }, [props.customMetricsSelectTree.checkedOrgArr]);

    useEffect(() => {
        const formData = props.queryForm.formData;
        if (formData.productIds) {
            // 请求数据
            const { dispatch } = props;
            dispatch({
                type: 'customMetricsTable/queryTableList',
                payload: {
                    ...formData,
                    pageNum: props.customMetricsTable.pageNumber,
                    pageSize: props.customMetricsTable.pageSize,
                    targets: props.queryForm.checkedArrUseExportAndQueryTableList
                },
                callback() {
                    const {
                        customMetricsSelectTree: { checkedOrgArr }
                    } = props;
                    let columns = [];
                    for (let i = 0; i < checkedOrgArr.length; i++) {
                        if(!checkedOrgArr[i].isLeafNode) {
                            continue;
                        }
                        columns.push({
                            title: checkedOrgArr[i].fullName  || checkedOrgArr[i].targetName,
                            dataIndex: checkedOrgArr[i].targetCode,
                            width: 200,
                            align: 'center',
                            render: (e) => e || '--'
                        });
                        if (formData.standardCodes && formData.standardCodes.length) {
                            if (
                                needDisposeColumns.find(
                                    (item) => item === checkedOrgArr[i].targetCode,
                                )
                            ) {
                                // 添加相关比较基准列
                                // 遍历选中的比较
                                console.log(
                                    props.queryForm.standardCodes,
                                    '处理比较基准列',
                                );
                                (
                                    props.queryForm.standardCodes || []
                                ).forEach((item) => {
                                    let key = checkedOrgArr[i].targetCode;
                                    key = key[0].toUpperCase() + key.slice(1);
                                    columns.push({
                                        title: checkedOrgArr[i].fullName && `${item.label}${checkedOrgArr[i].fullName}` || `${item.label}${checkedOrgArr[i].targetName}`,
                                        dataIndex: `standard${key}${item.value}`,
                                        width: 200,
                                        align: 'center',
                                        render: (e) => e || '--'
                                    });
                                });
                            }
                        }
                    }

                    dispatch({
                        type: 'customMetricsTable/saveColumns',
                        columns
                    });
                }
            });
        }
    }, [props.customMetricsTable.pageNumber, props.customMetricsTable.pageSize]);
    const newDataSource = () => {
        const data = cloneDeep(props.customMetricsTable.tableData.list) || [];
        data.forEach((item) => {
            item.standards &&
                item.standards.forEach((item2) => {
                    for (let i in item2) {
                        item[i + item2.standardCode] = item2[i];
                    }
                });
        });
        return data;
    };
    return (
        <Fragment>
            <Modal
                visible={showModal}
                title="保存成指标模板"
                onOk={saveTem}
                onCancel={(e) => changeShowModal(false)}
                destroyOnClose
                confirmLoading={props.loading2}
            >
                <SaveTem forwardRef={temFormRef} templateName={templateName} />
            </Modal>
            <div className={styles.box}>
                <div
                    style={{
                        display: authEdit ? 'unset' : 'none'
                    }}
                >
                    <Button
                        type={'primary'}
                        onClick={(e) => openModal()}
                        disabled={!props.customMetricsSelectTree.checkedKeys.length}
                    >
                        保存模板
                    </Button>
                    <Button
                        type={'primary'}
                        className={styles.btn}
                        onClick={deleteTempalte}
                        loading={props.loading3}
                    >
                        删除模板
                    </Button>
                </div>

                <div
                    style={{
                        display: authExport ? 'unset' : 'none'
                    }}
                >
                    <Button
                        type={'primary'}
                        onClick={tableExport}
                        disabled={!(props.customMetricsTable.tableData.list || []).length}
                        loading={Boolean(props.loading4)}
                    >
                        导出
                    </Button>
                </div>
            </div>
            <div>
                <MXTable
                    loading={props.loading}
                    columns={
                        (props.customMetricsTable.tableData.list || []).length
                            ? props.customMetricsTable.columns
                            : []
                    }
                    dataSource={
                        (props.customMetricsTable.tableData.list &&
                            props.customMetricsTable.tableData.list.length &&
                            newDataSource()) ||
                        []
                    }
                    total={props.customMetricsTable.tableData.total || 0}
                    pageNum={props.customMetricsTable.pageNumber}
                    scroll={{ x: '100%', y: 500, scrollToFirstRowOnChange: true }}
                    sticky
                    onChange={(p, e, s) => _tableChange(p, e, s)}
                    rowKey="uniqueKey"
                    rowSelection={null}
                    bordered
                />
            </div>
        </Fragment>
    );
};

export default connect(({ customMetricsSelectTree, customMetricsTable, queryForm, loading }) => ({
    customMetricsSelectTree,
    customMetricsTable,
    queryForm,
    loading: loading.effects['customMetricsTable/queryTableList'],
    loading2: loading.effects['customMetricsTable/saveTemplate'],
    loading3: loading.effects['customMetricsTable/deleteTem'],
    loading4: loading.effects['customMetricsTable/exportTemplate']
}))(TableContent);
