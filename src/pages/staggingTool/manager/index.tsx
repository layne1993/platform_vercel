import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'umi';
import { Modal, message, Card, Divider, Button, Space } from 'antd';
import { CloudUploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { getCookie } from '@/utils/utils';
import MXTable from '@/pages/components/MXTable';
import BatchUpload from '@/pages/components/batchUpload';
import CreateOrEditModal from './components/CreateOrEditModal';
import _styles from './index.less';
import moment from 'moment';

const cardTypeMap = {
    1: '中国居民身份证',
    2: '港澳居民来往内地通行证',
    3: '台湾居民来往大陆通行证',
    4: '护照',
    5: '外国人永久居留身份证',
    6: '统一社会信用代码',
    7: '组织机构代码',
    8: '投资业务许可证',
    9: '境外机构注册号',
    10: '营业执照',
    11: '其他'
};
const managerTypeMap = {
    0: '0.未知',
    1: '1.对本机构实施控制或间接控制、持有5%的股东、共同控制或施加重大影响的机构和个人（含董监高）',
    2: '2.本机构的董事、监事、高级管理人员或执行合伙人',
    3: '3.本机构控股股东控制的其他机构（子公司）',
    4: '4.本机构控制、间接实施控制、共同控制或实施重大影响的机构（本投资者的控股子公司）',
    5: '5.除4外，本机构持有5%以上股份的机构（子公司）',
    6: '6.其他可能导致配售存在不当行为或存在不正当利益输送的其他自然人、法人和组织',
    7: '7.持有本投资者5%以上股份的股东情况',
    8: '8.本投资者的控股股东情况',
    9: '9.对本机构能够直接或间接实施控制、共同控制或施加重大影响的公司或个人',
    10: '10.法定代表人',
    11: '11.负责人',
    12: '12.授权办理业务人员',
    13: '13.本公司法人股东',
    14: '14.本公司自然人股东、实际控制人、董监高、和其他员工',
    15: '15.上述14条关联人关系密切的家庭成员，包括配偶、子女及其配偶、父母及配偶的父母、兄弟姐妹及其配偶、配偶的兄弟姐妹、子女配偶的父母',
    16: '16.本公司/本人控制或参股的公司，包含本公司为实际控制人的公司、本公司持有5%以上（含5%）股份的公司',
    17: '17.机构投资者实际控制人',
    18: '18.机构投资者控股股东控制的其他子公司和机构投资者的控股子公司、机构投资者能够实施重大影响的其他公司'

};

const ManagerMaintenance = (props) => {
    const { dispatch, tableLoading, staggingManager } = props;
    const { managerPageNum, managerPageSzie, managerList, managerTotal } = staggingManager;
    const [createModalIsVisible, toggleCreateModal] = useState(false);
    const [uploadModalIsVisible, toggleUploadModal] = useState(false);
    const [editData, setEditData] = useState({});

    const getManagerList = useCallback(() => {
        dispatch({
            type: 'staggingManager/getManagerList',
            payload: {
                pageNum: managerPageNum,
                pageSize: managerPageSzie
            }
        });
    }, [dispatch, managerPageNum, managerPageSzie]);

    const onEdit = useCallback((row) => {
        const { id, type, sort, name, cardNumber, cardType, holdAPost, validityOfCertificateStartDate: startDate, validityOfCertificateEndDate: endDate, isLongTerm } = row;
        setEditData({
            id,
            type,
            sort,
            name,
            cardNumber,
            cardType,
            holdAPost,
            isLongTerm: isLongTerm === 1,
            validityDate: startDate ? [moment(startDate), moment(endDate)] : []
        });
        console.log(row);
        toggleCreateModal(true);
    }, []);

    const onDelete = useCallback((row) => {
        Modal.confirm({
            title: '是否删除该管理人？',
            icon: <ExclamationCircleOutlined />,
            okText: '确认',
            cancelText: '取消',
            onOk: async () => {
                const res = await dispatch({
                    type: 'staggingManager/deleteManager',
                    payload: {
                        id: row.id
                    }
                });

                if (res.code === 1008) {
                    message.success('删除成功');
                    if (managerPageNum === 1) {
                        getManagerList();
                    } else {
                        dispatch({
                            type: 'staggingManager/updateModelData',
                            payload: {
                                managerPageNum: 1
                            }
                        });
                    }
                } else {
                    message.error(res.message);
                }
            }
        });
    }, [dispatch, getManagerList, managerPageNum]);

    const columns = [{
        title: '类型',
        dataIndex: 'type',
        align: 'center',
        width: 200,
        fixed: 'left',
        render: (val) => managerTypeMap[val]
    }, {
        title: '序号',
        dataIndex: 'sort',
        align: 'center',
        width: 100,
        fixed: 'left',
        render: (val, row) => `${row.type}.${val}`
    }, {
        title: '工商登记名称或自然人姓名',
        dataIndex: 'name',
        align: 'center',
        width: 200
    }, {
        title: '证件类型',
        dataIndex: 'cardType',
        align: 'center',
        render: (val) => cardTypeMap[val],
        width: 150
    }, {
        title: '组织机构代码或统一社会信用代码或身份证号',
        dataIndex: 'cardNumber',
        align: 'center',
        width: 200
    }, {
        title: '证件有效期',
        dataIndex: 'validityDate',
        align: 'center',
        width: 200,
        render: (val, row) => {
            const { validityOfCertificateStartDate: startDate, validityOfCertificateEndDate: endDate } = row;
            return startDate ? `${moment(startDate).format('YYYY-MM-DD')}至${moment(endDate).format('YYYY-MM-DD')}` : '';
        }
    }, {
        title: '担任职务',
        dataIndex: 'holdAPost',
        align: 'center',
        width: 150
    }, {
        title: '操作',
        align: 'center',
        width: 200,
        fixed: 'right',
        render: (val, row) => {
            return (
                <div className={_styles.operationBox}>
                    <span onClick={() => onEdit(row)}>编辑</span>
                    <Divider type="vertical"></Divider>
                    <span onClick={() => onDelete(row)}>删除</span>
                </div>
            );
        }
    }];

    const onChangePage = (p) => {
        dispatch({
            type: 'staggingManager/updateModelData',
            payload: {
                managerPageNum: p.current,
                managerPageSzie: p.pageSize
            }
        });
    };

    const handleCreate = () => {
        toggleCreateModal(true);
        setEditData({
            type: 1,
            sort: '',
            name: '',
            cardNumber: ''
        });
    };

    const onUploadSuccess = useCallback(() => {

    }, []);

    const handleSubmit = useCallback(async (formData) => {
        const isEdit = !!formData.id;
        let res;
        if (isEdit) {
            res = await dispatch({
                type: 'staggingManager/updateManager',
                payload: formData
            });
        } else {
            res = await dispatch({
                type: 'staggingManager/createManager',
                payload: formData
            });
        }
        if (res.code === 1008) {
            message.success(isEdit ? '编辑成功' : '添加成功');
            toggleCreateModal(false);
            getManagerList();
        } else {
            message.error(res.message);
        }
    }, [dispatch, getManagerList]);

    useEffect(() => {
        getManagerList();
    }, [dispatch, getManagerList]);

    return (
        <div className={_styles.managerWrapper}>
            <CreateOrEditModal
                isVisible={createModalIsVisible}
                formData={editData}
                onCancel={() => toggleCreateModal(false)}
                onConfirm={handleSubmit}
            />

            {/* @TODO templateUrl params url 待确定 */}
            {/* <BatchUpload
                accept={'.xlsx, .xls'}
                modalFlag={uploadModalIsVisible}
                closeModal={() => toggleUploadModal(false)}
                templateMsg="管理人模板下载"
                onOk={onUploadSuccess}
                templateUrl={`/disclosureDay/import/template?tokenId=${getCookie('vipAdminToken')}`}
                params={{}}
                url="/disclosureDay/import"
            /> */}

            <Space style={{ marginBottom: '20px' }}>
                <Button
                    type="primary"
                    onClick={handleCreate}
                >
                    + 新建
                </Button>
                {/* <Button
                    type="primary"
                    icon={<CloudUploadOutlined />}
                    onClick={() => toggleUploadModal(true)}
                >
                    批量上传
                </Button> */}
            </Space>
            <MXTable
                loading={tableLoading}
                columns={columns}
                dataSource={managerList}
                total={managerTotal}
                pageNum={managerPageNum}
                scroll={{ x: '100%' }}
                sticky
                onChange={onChangePage}
                rowKey="id"
                rowSelection={null}
            />
        </div>
    );
};

export default connect(({ staggingManager, loading }) => ({
    tableLoading: loading.effects['staggingManager/getManagerList'],
    staggingManager
}))(ManagerMaintenance);
