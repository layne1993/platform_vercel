/*
 * @description: 临时协议模板编辑
 * @Author:
 * @Date: 2021-3-3
 */
import React, {Component} from 'react';
import styles from './styles/Tab2.less';
import {Card, Result, Spin} from 'antd';
import {connect} from 'umi';
import dva from 'dva';

@connect(({loading}) => ({
    loading: loading.effects['productDetails/queryToken']
}))
class Tab15 extends Component {
    state = {
        productCode: '',
        token: '',
        message: '',
        queryEnd: false,
        delayLoading: true
    };

    time = null;

    componentDidMount() {
        const {dispatch, params: {productId}} = this.props;
        // 请求token
        dispatch({
            type: 'productDetails/queryToken',
            payload: {productId},
            callback: ({data, message}) => {
                if (data) {
                    this.setState({
                        productCode: data.productCode,
                        token: data.token,
                        queryEnd: true
                    });
                } else {
                    this.setState({
                        message,
                        queryEnd: true
                    });
                }
                this.time = setTimeout(() => this.setState({delayLoading: false}), 5000);
            }
        });
    }

    componentWillUnmount() {
        clearTimeout(this.time);
    }

    // componentWillUnmount (){
    //     alert(1)
    //     const SaasDom = document.getElementById('oldSassIframe').contents().find('.containers');
    //     SaasDom.style.display = "none"
    //     console.log(SaasDom)
    //     // ("#testIframe").contents().find("#changeBtn")
    // }

    render() {
        const {loading} = this.props;
        const {productCode, token, message, queryEnd} = this.state;
        const goUrl = encodeURIComponent(`${window.location.origin}/manager/views/index_xw.html?v=2.9.9-1614935408297#page/2/${productCode}/productType/0`);
        if (productCode && token && queryEnd) {
            return (
                <Spin spinning={Boolean(loading)}>
                    <Spin spinning={this.state.delayLoading}>
                        <div>
                            <Card>
                                <iframe
                                    id="iframe"
                                    name="demo"
                                    width="100%"
                                    height="2000px"
                                    src={`${window.location.origin}/sign/jump/jump?token=${token}&goUrl=${goUrl}`}
                                    // src={`https://sit.simu800.com/sign/jump/jump?token=${token}&goUrl=${goUrl}`}
                                    frameBorder="0"
                                />
                            </Card>
                        </div>
                    </Spin>
                </Spin>
            );
        }
        if (queryEnd) {
            return (
                <Spin spinning={Boolean(loading)}>
                    <div className={styles.container} style={{
                        marginTop: 16
                    }}
                    >
                        <Card style={{
                            backgroundColor: 'white'
                        }}
                        >
                            <Result
                                status="error"
                                title={message}
                            />
                        </Card>
                    </div>
                </Spin>
            );
        }
        return <Spin spinning={Boolean(loading)}>
            <div className={styles.container}><Card></Card></div>
        </Spin>;
    }
}

export default Tab15;
