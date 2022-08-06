import { Card,Popconfirm ,Table } from 'antd';

import React, { Component } from 'react';
import addIcon from '@/assets/addIcon.png';
 import styles from './style.less';
 import LineChart from '../lineChart/LineChart'

 import zichan from '@/assets/businessAnalysis/zichan.png'
 import gupiao from '@/assets/businessAnalysis/gupiao.png'
 import zhaijuan from '@/assets/businessAnalysis/zhaijuan.png'
 import jijin from '@/assets/businessAnalysis/jijin.png'



class AllTop10 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns:[ {
                title: '资产名称',
                dataIndex: 'age',
                key: 'age',
                align: 'center'
              }, {
                title: '市值/持仓',
                dataIndex: 'address',
                key: 'address',
                align: 'center'
              }, {
                title: '占比',
                dataIndex: 'addressss',
                key: 'addressss',
                align: 'center'
              }],
              data :[{
                key: '1',
                name: '年初',
                age: 1,
                address: '1000000',
                addressss: '10%',
              }, {
                key: '2',
                name: '最新',
                age: 2,
                address: '6500304',
                addressss: '19%',
              }, {
                key: '3',
                name: '年初',
                age: 3,
                address: '43000000',
                addressss: '39%',
              },{
                key: '4',
                name: '年初',
                age: 4,
                address: '5600000',
                addressss: '11%',
              }]
        };
    }

    componentDidMount() {

    }
    Insert = ()=>{
        this.props.showInsert('总仓TOP10');
    }

    confirm =(e)=> {
        this.props.delete('YWFX_0010')
    }
    
    cancel = (e) => {

    }

    render() {
        return (
               <Card
                    bordered={false}
                    title={
                        <span className={styles.cardTitle}>总仓TOP10（敬请期待）</span>
                    }
                    extra={<div>
                        <span onClick={this.Insert} style={{color:'#3D7FFF',cursor:'pointer'}}>插入</span>
                        <Popconfirm
                            title="是否确认删除该组件?"
                            onConfirm={this.confirm}
                            onCancel={this.cancel}
                            okText="是"
                            cancelText="否"
                        >
                            <span style={{color:'#3D7FFF',cursor:'pointer',marginLeft:10}}>删除</span>
                        </Popconfirm>
                        </div>}
                    style={{marginBottom:20,marginLeft:'1%',marginRight:'3%'}}
                >
                 {/* <div style={{textAlign:'center',margin:'auto',}}>
                        敬请期待...
                 </div>  */}
                <div className={styles.wait}>
                <div className={styles.Top}>
                    <div className={styles.item}>
                          <div className={styles.title}>
                              <img src={zichan} alt="" />
                              资产
                          </div>
                          <div className={styles.table}>
                          <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                          </div>
                    </div>
                    <div className={styles.item}>
                          <div className={styles.title} style={{backgroundColor:'#9EBFFF'}}>
                              <img src={gupiao} alt="" />
                              股票
                          </div>
                          <div className={styles.table}>
                          <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                          </div>
                    </div>
                    <div className={styles.item}>
                          <div className={styles.title} style={{backgroundColor:'#9580FF'}}>
                              <img src={zhaijuan} alt="" />
                              债卷
                          </div>
                          <div className={styles.table}>
                          <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                          </div>
                    </div>
                    <div className={styles.item}>
                          <div className={styles.title} style={{backgroundColor:'#B1A2FE'}}>
                              <img src={jijin} alt="" />
                              基金
                          </div>
                          <div className={styles.table}>
                          <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                          </div>
                    </div>
                

                </div>
                </div>
                </Card>
              
        );
    }
}

export default AllTop10;
