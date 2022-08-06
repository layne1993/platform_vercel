import React, { PureComponent } from 'react';
import { Card, Col, Row, Calendar, Table,Popconfirm, Tooltip, Spin, Badge } from 'antd';
import moment from 'moment';
import { cloneDeep, isEmpty } from 'lodash';
import styles from './style.less';
import { getRandomKey } from '@/utils/utils';
import { connect } from 'umi';
import request from '@/utils/rest';

const radioOptions = [
    {
        label: '当日',
        value: 1
    },
    {
        label: '当月',
        value: 2
    }
];
@connect(({ panel, loading }) => ({
    panel,
    loading: loading.effects['panel/queryReminders']
}))
class OperateCalendar extends PureComponent {
    state = {
        // 提醒日历数组
        markDateList: [],
        selectedValue: '',
        index: 0,
        loading:false,
        // 当前时间
        currentDate: moment(new Date()),
        radioValue: 1,
        dateType: 1,             // 查询日期类型 1:当日,2:当月
        reminderList: [],        // 提醒列表
        badgeList: [],            // 当月所有提醒列表
        columns:[{
            title: '',
            dataIndex: 'age',
            key: 'age',
            align: 'center'
          }, {
            title: '开放总数',
            dataIndex: 'openDetail',
            key: 'openDetail',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.openDetailProducts}>{text}</Tooltip>
          }, {
            title: '开放申购',
            dataIndex: 'openApplyDetail',
            key: 'openApplyDetail',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.openApplyDetailProducts}>{text}</Tooltip>
          }, {
            title: '开放赎回',
            dataIndex: 'openRedeemDetail',
            key: 'openRedeemDetail',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.openRedeemDetailProducts}>{text}</Tooltip>
          }, {
            title: '有交易总数',
            dataIndex: 'tradeDetailNum',
            key: 'tradeDetailNum',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.tradeDetailProducts}>{text}</Tooltip>
          }, {
            title: '有申购总数',
            dataIndex: 'applyDetail',
            key: 'applyDetail',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.applyDetailProducts}>{text}</Tooltip>
          }, {
            title: '有赎回总数',
            dataIndex: 'redeemDetail',
            key: 'redeemDetail',
            align: 'center',
            render: (text,record) => <Tooltip placement="topLeft" title={record.redeemDetailProducts}>{text}</Tooltip>
          }],
        data :[{
        key: '1',
        name: '年初',
        age: '本日开放产品',
        tradeDetailNum:0,
        tradeDetailProducts:0,
        applyDetail:0,
        openRedeemDetail:0,
        openApplyDetail:0,
        openDetail:0,
        redeemDetail:0
        }, {
        key: '2',
        name: '最新',
        age: '本周开放产品',
        tradeDetailNum:0,
        tradeDetailProducts:0,
        applyDetail:0,
        openRedeemDetail:0,
        openApplyDetail:0,
        openDetail:0,
        redeemDetail:0
        }, {
        key: '3',
        name: '年初',
        age: '本月开放产品',
        tradeDetailNum:0,
        tradeDetailProducts:0,
        applyDetail:0,
        openRedeemDetail:0,
        openApplyDetail:0,
        openDetail:0,
        redeemDetail:0
        }]
    };

    componentDidMount() {
        this._search();
        this.getTable()
    }
    Insert = ()=>{
      this.props.showInsert('提醒日历');
    }

    confirm =(e)=> {
      this.props.delete('YWFX_0013')
    }
    
    cancel = (e) => {

    }
    getTable = async(date) =>{
        this.setState({
            loading:true
        })
          if(date==undefined){
            date = this.dateChange(new Date())
          }
          let res = res = await request.postJSON(`/mrp_analysis/simuAnalysis/productOperateStat?date=${date}`);
        let item=[{key: '1',name: '年初',age: '本日开放产品',tradeDetailNum:0,tradeDetailProducts:0,
                    applyDetail:0,
                    openRedeemDetail:0,
                    openApplyDetail:0,
                    openDetail:0,tradeDetailProducts:"暂无"},
                  {key: '2',name: '最新',age: '本周开放产品',tradeDetailNum:0,tradeDetailProducts:0,
                  applyDetail:0,
                  openRedeemDetail:0,
                  openApplyDetail:0,
                  openDetail:0,
                  tradeDetailProducts:[]},
                  {key: '3',name: '年初',age: '本月开放产品',tradeDetailNum:0,tradeDetailProducts:0,
                  applyDetail:0,
                  openRedeemDetail:0,
                  openApplyDetail:0,
                  openDetail:0,tradeDetailProducts:[]}]
       if(res.data){
        this.setState({
            loading:false
        })
        console.log(res);
            
            let tradeDetailNum = 0
            let tradeDetailProducts =0

            let applyDetail = 0
            let applyDetailProducts = ''

            let openRedeemDetail=0
            let openRedeemDetailProducts = ''

            let openApplyDetail=0
            let openApplyDetailProducts=''

            let openDetail=0
            let openDetailProducts = ''
            
            let redeemDetail = 0
            let redeemDetailProducts = ''
            if(res.data.dayDetail.tradeDetail!==null){
                item[0].tradeDetailNum =res.data.dayDetail.tradeDetail.num
                tradeDetailNum = res.data.dayDetail.tradeDetail.num
                tradeDetailProducts =this.concatString(res.data.dayDetail.tradeDetail.products)
                if(res.data.dayDetail.tradeDetail.num==0){
                    tradeDetailProducts = 0
                }
            }
            if(res.data.dayDetail.applyDetail!==null){
                applyDetail= res.data.dayDetail.applyDetail.num
                applyDetailProducts = this.concatString(res.data.dayDetail.applyDetail.products)
                if(res.data.dayDetail.applyDetail.num==0){
                    applyDetail = 0
                }
            }
            if(res.data.dayDetail.openRedeemDetail!==null){
                openRedeemDetail =  res.data.dayDetail.openRedeemDetail.num
                openRedeemDetailProducts =  this.concatString(res.data.dayDetail.openRedeemDetail.products)
                if(res.data.dayDetail.openRedeemDetail.num==0){
                    openRedeemDetail = 0
                }
            }
            if(res.data.dayDetail.openApplyDetail!==null){
                openApplyDetail =  res.data.dayDetail.openApplyDetail.num
                openApplyDetailProducts =  this.concatString(res.data.dayDetail.openApplyDetail.products)
                if(res.data.dayDetail.openApplyDetail.num==0){
                    openApplyDetail = 0
                }
            }
            if(res.data.dayDetail.openDetail!==null){
                openDetail = res.data.dayDetail.openDetail.num
                openDetailProducts =  this.concatString(res.data.dayDetail.openDetail.products)
                if(res.data.dayDetail.openDetail.num==0){
                    openDetail = 0
                }
            }
            if(res.data.dayDetail.redeemDetail!==null){
                redeemDetail =  res.data.dayDetail.redeemDetail.num
                redeemDetailProducts =  this.concatString(res.data.dayDetail.redeemDetail.products)
                if(res.data.dayDetail.redeemDetail.num==0){
                    redeemDetail = 0
                }
            }
            item[0].tradeDetailNum = tradeDetailNum
            item[0].tradeDetailProducts = tradeDetailProducts

            item[0].applyDetail = applyDetail
            item[0].applyDetailProducts = applyDetailProducts

            item[0].openRedeemDetail = openRedeemDetail
            item[0].openRedeemDetailProducts = openRedeemDetailProducts

            item[0].openApplyDetail = openApplyDetail
            item[0].openApplyDetailProducts = openApplyDetailProducts

            item[0].openDetail = openDetail
            item[0].openDetailProducts = openDetailProducts

            item[0].redeemDetail = redeemDetail
            item[0].redeemDetailProducts = redeemDetailProducts
            //-----------
            let tradeDetailNum1 = 0
            let tradeDetailProducts1 =0

            let applyDetail1 = 0
            let applyDetailProducts1 = ''

            let openRedeemDetail1=0
            let openRedeemDetailProducts1 = ''

            let openApplyDetail1=0
            let openApplyDetailProducts1=''

            let openDetail1=0
            let openDetailProducts1 = ''
            
            let redeemDetail1 = 0
            let redeemDetailProducts1 = ''
            if(res.data.weekDetail.tradeDetail!==null){
                tradeDetailNum1 = res.data.weekDetail.tradeDetail.num
                tradeDetailProducts1 =this.concatString(res.data.weekDetail.tradeDetail.products)
                if(res.data.weekDetail.tradeDetail.num==0){
                    tradeDetailProducts1 = 0
                }
            }
            if(res.data.weekDetail.applyDetail!==null){
                applyDetail1 = res.data.weekDetail.applyDetail.num
                applyDetailProducts1 = this.concatString(res.data.weekDetail.applyDetail.products)
                if(res.data.weekDetail.applyDetail.num==0){
                    applyDetail1 = 0
                }
            }
            if(res.data.weekDetail.openRedeemDetail!==null){
                openRedeemDetail1 =  res.data.weekDetail.openRedeemDetail.num
                openRedeemDetailProducts1 =  this.concatString(res.data.weekDetail.openRedeemDetail.products)
                if(res.data.weekDetail.openRedeemDetail.num==0){
                    openRedeemDetail1 = 0
                }
            }
            if(res.data.weekDetail.openApplyDetail!==null){
                openApplyDetail1 =  res.data.weekDetail.openApplyDetail.num
                openApplyDetailProducts1 =  this.concatString(res.data.weekDetail.openApplyDetail.products)
                if(res.data.weekDetail.openApplyDetail.num==0){
                    openApplyDetail1 = 0
                }
            }
            if(res.data.weekDetail.openDetail!==null){
                openDetail1 = res.data.weekDetail.openDetail.num
                openDetailProducts1 =  this.concatString(res.data.weekDetail.openDetail.products)
                if(res.data.weekDetail.openDetail.num==0){
                    openDetail1 = 0
                }
            }
            if(res.data.weekDetail.redeemDetail!==null){
                redeemDetail1 =  res.data.weekDetail.redeemDetail.num
                redeemDetailProducts1 =  this.concatString(res.data.weekDetail.redeemDetail.products)
                if(res.data.weekDetail.redeemDetail.num==0){
                    redeemDetail1 = 0
                }
            }
            
            item[1].tradeDetailNum = tradeDetailNum1
            item[1].tradeDetailProducts = tradeDetailProducts1

            item[1].applyDetail = applyDetail1
            item[1].applyDetailProducts = applyDetailProducts1

            item[1].openRedeemDetail = openRedeemDetail1
            item[1].openRedeemDetailProducts = openRedeemDetailProducts1

            item[1].openApplyDetail = openApplyDetail1
            item[1].openApplyDetailProducts = openApplyDetailProducts1

            item[1].openDetail = openDetail1
            item[1].openDetailProducts = openDetailProducts1

            item[1].redeemDetail = redeemDetail1
            item[1].redeemDetailProducts = redeemDetailProducts1
            //-----------
            let tradeDetailNum2 = 0
            let tradeDetailProducts2 =0

            let applyDetail2 = 0
            let applyDetailProducts2 = ''

            let openRedeemDetail2=0
            let openRedeemDetailProducts2 = ''

            let openApplyDetail2=0
            let openApplyDetailProducts2=''

            let openDetail2=0
            let openDetailProducts2 = ''
            
            let redeemDetail2 = 0
            let redeemDetailProducts2 = ''
            if(res.data.monthDetail.tradeDetail!==null){
                tradeDetailNum2 = res.data.monthDetail.tradeDetail.num
                tradeDetailProducts2 =this.concatString(res.data.monthDetail.tradeDetail.products)
                if(res.data.monthDetail.tradeDetail.num==0){
                    tradeDetailProducts2 = 0
                }
            }
            if(res.data.monthDetail.applyDetail!==null){
                applyDetail2 = res.data.monthDetail.applyDetail.num
                applyDetailProducts2 = this.concatString(res.data.monthDetail.applyDetail.products)
                if(res.data.monthDetail.applyDetail.num==0){
                    applyDetail2 = 0
                }
            }
            if(res.data.monthDetail.openRedeemDetail!==null){
                openRedeemDetail2 =  res.data.monthDetail.openRedeemDetail.num
                openRedeemDetailProducts2 =  this.concatString(res.data.monthDetail.openRedeemDetail.products)
                if(res.data.monthDetail.openRedeemDetail.num==0){
                    openRedeemDetail2 = 0
                }
            }
            if(res.data.monthDetail.openApplyDetail!==null){
                openApplyDetail2 =  res.data.monthDetail.openApplyDetail.num
                openApplyDetailProducts2 =  this.concatString(res.data.monthDetail.openApplyDetail.products)
                if(res.data.monthDetail.openApplyDetail.num==0){
                    openApplyDetail2 = 0
                }
            }
            if(res.data.monthDetail.openDetail!==null){
                openDetail2 = res.data.monthDetail.openDetail.num
                openDetailProducts2 =  this.concatString(res.data.monthDetail.openDetail.products)
                if(res.data.monthDetail.openDetail.num==0){
                    openDetail2 = 0
                }
            }
            if(res.data.monthDetail.redeemDetail!==null){
                redeemDetail2 =  res.data.monthDetail.redeemDetail.num
                redeemDetailProducts2 =  this.concatString(res.data.monthDetail.redeemDetail.products)
                if(res.data.monthDetail.redeemDetail.num==0){
                    redeemDetail2 = 0
                }
            }
            
            item[2].tradeDetailNum = tradeDetailNum2
            item[2].tradeDetailProducts = tradeDetailProducts2

            item[2].applyDetail = applyDetail2
            item[2].applyDetailProducts = applyDetailProducts2

            item[2].openRedeemDetail = openRedeemDetail2
            item[2].openRedeemDetailProducts = openRedeemDetailProducts2

            item[2].openApplyDetail = openApplyDetail2
            item[2].openApplyDetailProducts = openApplyDetailProducts2

            item[2].openDetail = openDetail2
            item[2].openDetailProducts = openDetailProducts2

            item[2].redeemDetail = redeemDetail2
            item[2].redeemDetailProducts = redeemDetailProducts2
            this.setState({
                data:item,
            })
       }
    }

    concatString(e){
        let arr = e.map(item=>{
            return item.codeText
        })
        let allString = ''
        for(let i=0;i<arr.length;i++){
            if(arr.length==1){
                allString= allString+ arr[i]
            }else{
                allString= allString+ arr[i]+','
            }
        }
        return allString;
    }
    initItem(){
        
    }

    /**
     * @description: 提醒日历数据查询
     * @param {*}
     */
    _search = () => {
        const { currentDate, dateType } = this.state;
        const { dispatch } = this.props;

        // 转换成时间戳
        let setDate = (currentDate && new Date(`${moment(currentDate).format('YYYY-MM-DD')}`,).getTime()) || undefined;
    }

    /**
     * @description: tab切换
     * @param {Object} e
     */
    _changeTabs = (e) => {
        this.setState({
            radioValue: e.target.value,
            dateType: e.target.value
        }, () => {
            this._search();
        });
    }


    /**
     * @description: 点击选择日期回调
     * @param {*} 时间值
     */
    onSelect = async(value) => {
       let date =  this.dateChange(value._d)
       console.log(date);
       this.getTable(date)
    };
    dateChange(d){
            const newDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
            return newDate;
    
    }

    /**
     * @description: 日期面板变化回调
     * @param {*} 时间值
     */
    onPanelChange = (value) => {
        this.setState({
            currentDate: value
        }, () => {
            this._search();
        });
    }
    /**
     * @description: 自定义渲染日期单元格
     * @param {*}
     */
    dateCellRender = (value) => {
        const listData = this.getListData(value);
        return (
            <ul className={styles.eventMessage}>
                {listData.map((item) => (
                    <li key={item.content}>
                        <Badge status={item.type} />
                    </li>
                ))}
            </ul>
        );
    };

    // 日历日期下面添加消息提醒
    getListData = (value) => {
        const {
            badgeList
        } = this.state;
        const noticeDayList = [];
        !isEmpty(badgeList) &&
            badgeList.forEach((item) => {
                const noticeDay = moment(item.remindDate).format('YYYY-MM-DD');
                if (!noticeDayList.includes(noticeDay)) {
                    noticeDayList.push(noticeDay);
                }
            });
        if (noticeDayList.includes(value.format('YYYY-MM-DD'))) {
            return [{ type: 'warning', content: 3 }];
        } else {
            return [];
        }

    };

    render() {
        const { radioValue, reminderList } = this.state;
        const { loading } = this.props;

        return (
            <Card
                title={
                    <span className={styles.cardTitle}>提醒日历</span>
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
                // loading={loading}
                bordered={false}
                bodyStyle={{
                    padding: 0
                }}
            >
                <div className={styles.calendarWrapper}>
                <Spin spinning={this.state.loading}>
                    <Row>
                        <Col span={11}>
                            <div className={styles.calendar}>
                                <Calendar
                                    fullscreen={false}
                                    dateCellRender={this.dateCellRender}
                                    onPanelChange={this.onPanelChange}
                                    onSelect={this.onSelect}
                                />
                            </div>
                        </Col>
                        <Col span={13}>
                           <div className={styles.table}>
                             <Table columns={this.state.columns} dataSource={this.state.data} pagination={ false } />
                           </div>
                        </Col>
                    </Row>
                    </Spin>
                </div>
            </Card>
        );
    }
}
export default OperateCalendar;
