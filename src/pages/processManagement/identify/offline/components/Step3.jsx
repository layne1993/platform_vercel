import { Card, Result, Descriptions } from 'antd';
import { connect } from 'umi';
import React, {useState, useEffect} from 'react';
import moment from 'moment';
import { formatSeconds } from '@/utils/utils';

const Step3 = (props) => {
    const {params} = props;
    const [data, setData] = useState({});

    /**
     * @description 当参数不为零时 获取认定流程数据
     */
    const getFlowInfo = () => {
        const {dispatch, codeValue} = props;
        dispatch({
            type: 'IDENTIFYFLOW_OFFLINE/getDetail',
            payload: {identifyFlowId: params.identifyFlowId, codeValue},
            callback: (res) => {
                if(res.code === 1008) {
                    setData(res.data || {});
                }
            }
        });

    };

    useEffect(()=> {
        if(params.identifyFlowId !== '0') {
            getFlowInfo();
        }
    }, []);
    const subTitle = (
        <Descriptions column={1} style={{position:'absolute', left:'50%', marginLeft:'-100px'}}>
            <Descriptions.Item label="投资者名称">{data.customerName}</Descriptions.Item>
            <Descriptions.Item label="发起时间">
                {data.createTime && moment(data.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item label="耗时">
                {formatSeconds((new Date(data.updateTime).getTime() - new Date(data.createTime).getTime()) / 1000).data}
            </Descriptions.Item>
            <Descriptions.Item label="完成时间">
                {data.updateTime && moment(data.updateTime).format('YYYY-MM-DD HH:mm:ss')}
            </Descriptions.Item>
        </Descriptions>
    );
    return (
        <Card bordered={false} style={{height:'80vh'}}>
            {/* <Spin spinning={loading}> */}
            <Result
                status={data.checkStatus === 1 ? 'success' : 'error'}
                title={
                    <>
                        <h3>合格投资者认定完成</h3>
                        <h5>
                            根据提供材料，该客户{data.checkStatus === 1 ? null : '不'}满足
                            {data.investorType === 1 ? '普通' : '专业'}投资者要求
                        </h5>
                    </>
                }
                subTitle={subTitle}
            />
            {/* </Spin> */}
        </Card>
    );
};

export default connect(({ IDENTIFYFLOW_OFFLINE }) => ({
    IDENTIFYFLOW_OFFLINE,
    data: IDENTIFYFLOW_OFFLINE.flowData
}))(Step3);

Step3.defaultProps = {
    data: {}
};
