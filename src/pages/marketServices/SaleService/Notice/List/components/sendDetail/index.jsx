import React, { useState, useEffect } from 'react';
import { Modal, Table, Radio, Row, notification } from 'antd';
import { connect } from 'umi';
import { paginationPropsback, MESSAGE_SEND_STATUS } from '@/utils/publicData';
import {listToMap} from '@/utils/utils';
import moment from 'moment';

const openNotification = (type, message, description, placement, duration) => {
    notification[type || 'info']({
        message,
        description,
        placement,
        duration: duration || 3
    });
};


const SendDetail = (props) => {

    const {loading, flag, onCancel, dispatch, params } = props;
    const [data, setData] = useState([]);
    const [pageData, setPageData] = useState({ pageSize: 20, pageNum: 1 });
    const [radio, setRadio] = useState(2);




    /**
     * @description 获取明细
     *
     */
    const getList = () => {
        dispatch({
            type: 'tempList/getMarketingSendDetailList',
            payload: {...params, ...pageData, status:radio},
            callback: (res) => {
                if(res.code === 1008){
                    setData(res.data || []);
                }
            }
        });

    };

    useEffect(getList, [radio, pageData]);

    /**
     * @description 重新发送
     * @param {*} data
     */
    const resend = (data) => {
        dispatch({
            type: 'tempList/resendMarketingNotice',
            payload: {...data},
            callback: ({code, message = '发送失败！'}) => {
                if(code === 1008){
                    openNotification('success', '成功', '发送成功', 'topRight');
                } else {
                    openNotification('error', '成功', message, 'topRight');
                }
            }
        });

    };

    /**
    * @description: 表格变化
    */
    const _tableChange = (p, e, s) => {
        setPageData({ pageNum: p.current, pageSize: p.pageSize });
    };

    const columns = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 80
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '手机号码',
            dataIndex: 'object',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '发送情况',
            dataIndex: 'status',
            width: 80,
            render: (val) => listToMap(MESSAGE_SEND_STATUS)[val]
        },
        {
            title: '发送时间',
            dataIndex: 'exactTime',
            width: 80,
            render: (val) => val ? moment(val).format('YYYY/MM/DD') : '--'
        },
        {
            title: `${radio === 1 ? '成功' : '失败'}原因`,
            dataIndex: 'comment',
            width: 120
        }
    ];

    const columns1 = [
        {
            title: '客户名称',
            dataIndex: 'customerName',
            width: 80
        },
        {
            title: '证件号码',
            dataIndex: 'cardNumber',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '手机号码',
            dataIndex: 'object',
            width: 80,
            render: (val) => val || '--'
        },
        {
            title: '发送情况',
            dataIndex: 'status',
            width: 80,
            render: (val) => listToMap(MESSAGE_SEND_STATUS)[val]
        },
        {
            title: '发送时间',
            dataIndex: 'exactTime',
            width: 80,
            render: (val) => val ? moment(val).format('YYYY/MM/DD') : '--'
        },
        {
            title: '失败原因',
            dataIndex: 'comment',
            width: 120
        },
        {
            title: '操作',
            dataIndex: '',
            width: 80,
            render: (record) => {
                let node = null;
                if (record.status === 2) {
                    node = <a onClick={() => resend(record)}>重新发送</a>;
                } else if (record.status === 0) {
                    node = <span style={{color: 'gray'}}>重新发送</span>;
                }
                return node;
            }
        }
    ];


    return (
        <Modal
            title={<p style={{display: 'flex', justifyContent: 'space-between', paddingRight: 30, marginBottom: 0}}><span>发送明细</span>, <a target="_blank" href="http://www.5c.com.cn/code/">错误原因查询</a></p>}
            visible={flag}
            width={800}
            onCancel={onCancel}
            footer={null}
        >
            <Row style={{marginBottom: 15}}>
                <strong>发送情况：</strong>
                <Radio.Group onChange={(e)=> setRadio(e.target.value)} value={radio}>
                    {MESSAGE_SEND_STATUS.map((item, index) => (<Radio key={index} value={item.value}>{item.label}</Radio>) )}
                </Radio.Group>
            </Row>
            <Table
                loading={loading}
                rowKey={(record, index) => index}
                columns={radio !== 1 ? columns1: columns}
                dataSource={data.list || []}
                pagination={paginationPropsback(
                    data.total,
                    pageData.pageNum
                )}
                scroll={{x: '100%', y: 500}}
                onChange={_tableChange}
            />
        </Modal>
    );
};

export default connect(({ SIGN_REDEMING, loading }) => ({
    SIGN_REDEMING,
    loading: loading.effects['tempList/getMarketingSendDetailList']
}))(SendDetail);

SendDetail.defaultProps = {
    loading: false,
    flag: false,
    onCancel: () => { },
    params: {}
};
