import { Modal, Button ,Radio  } from 'antd';
import React, { Component } from 'react';
import styles from './style.less';

class Insert extends Component {

    constructor(props) {
        super(props);
        this.state = {
           value:0,
           Radio:[
               {name:'产品运营情况总览',code:'YWFX_0001'},
               {name:'持有人总览',code:'YWFX_0002'},
               {name:'网上直销客户情况',code:'YWFX_0003'},
               {name:'客户份额',code:'YWFX_0004'},
               {name:'客户TOP10',code:'YWFX_0005'},
               {name:'管理规模',code:'YWFX_0006'},
               {name:'收益分布区间',code:'YWFX_0007'},
               {name:'资产配置情况',code:'YWFX_0008'},
               {name:'重仓资产情况',code:'YWFX_0009'},
               {name:'总仓TOP10',code:'YWFX_0010'},
               {name:'收益表现情况',code:'YWFX_0011'},
               {name:'运营情况表格',code:'YWFX_0012'},
            //    {name:'产品运营日历',code:'YWFX_0013'},
               {name:'销售分布情况',code:'YWFX_0014'},
            ],
            All:[
                {name:'产品运营情况总览',code:'YWFX_0001'},
                {name:'持有人总览',code:'YWFX_0002'},
                {name:'网上直销客户情况',code:'YWFX_0003'},
                {name:'客户份额',code:'YWFX_0004'},
                {name:'客户TOP10',code:'YWFX_0005'},
                {name:'管理规模',code:'YWFX_0006'},
                {name:'收益分布区间',code:'YWFX_0007'},
                {name:'资产配置情况',code:'YWFX_0008'},
                {name:'重仓资产情况',code:'YWFX_0009'},
                {name:'总仓TOP10',code:'YWFX_0010'},
                {name:'收益表现情况',code:'YWFX_0011'},
                {name:'运营情况表格',code:'YWFX_0012'},
                // {name:'产品运营日历',code:'YWFX_0013'},
                {name:'销售分布情况',code:'YWFX_0014'},
             ],
            check:'',//已选中的组件
            showRdio:[]
        };
    }
    

    componentDidMount() {
        this.initRadio()
    }
    componentWillReceiveProps(){
        this.initRadio()
    }
    initRadio =  () =>{
        let receiveArr = this.props.allComponents
        let all = [
            {name:'产品运营情况总览',code:'YWFX_0001'},
            {name:'持有人总览',code:'YWFX_0002'},
            {name:'网上直销客户情况',code:'YWFX_0003'},
            {name:'客户份额',code:'YWFX_0004'},
            {name:'客户TOP10',code:'YWFX_0005'},
            {name:'管理规模',code:'YWFX_0006'},
            {name:'收益分布区间',code:'YWFX_0007'},
            {name:'资产配置情况',code:'YWFX_0008'},
            {name:'重仓资产情况',code:'YWFX_0009'},
            {name:'总仓TOP10',code:'YWFX_0010'},
            {name:'收益表现情况',code:'YWFX_0011'},
            {name:'运营情况表格',code:'YWFX_0012'},
            // {name:'产品运营日历',code:'YWFX_0013'},
            {name:'销售分布情况',code:'YWFX_0014'},
         ]
        let a =   this.filteRadio(all,receiveArr)
        this.setState({
            Radio : a
        })
    }
    filteRadio = (a,b)=>{
        for(var i=0;i<b.length;i++){
           for(var j=0;j<a.length;j++){
               if(b[i]==a[j].code){
                a.splice(j,1)
                j=j-1
               }
           }
        }
        return a 
    }
    handleChange = (value)=> {
        let val =JSON.parse(JSON.stringify(value))
        this.setState({
            check:val.target.value
        })
    }
    handleOk = (value)=> {
        //当前组件id
        let id = ""
        for(let i=0;i<this.state.All.length;i++){
            if(this.state.All[i].name==this.props.currentComponent){
                id = this.state.All[i].code
            }
        }
        console.log("id"+id);
        //构造所有要添加的id
        let postArr=[]
        postArr = this.props.allComponents.concat()
        let k = 0
        for(let j=0;j<postArr.length;j++){
            if(id==postArr[j]){
                k = j
            }
        }
        console.log('postArr'+postArr);
        postArr.splice(k,0,this.state.check)
        //触发父组件方法调插入组件接口
        this.props.insertNow(postArr)
    }
    handleCancel = (value)=> {
        this.setState({
            check:""
        })
      this.props.cancel()

    }

    render() {
        const isShow = this.props.isShow;
        return (
               <div>
                   <Modal title="插入组件" visible={isShow} onOk={this.handleOk} onCancel={this.handleCancel}>
                        <Radio.Group onChange={this.handleChange} value={this.state.check}>
                            {
                                this.state.Radio.map((item)=>{
                                    return <Radio style={{marginBottom:10}} key={item.code} value={item.code}>{item.name}</Radio>
                                })
                            }
                        </Radio.Group>
                    </Modal>
                  
               </div>
              
        );
    }
}

export default Insert;
