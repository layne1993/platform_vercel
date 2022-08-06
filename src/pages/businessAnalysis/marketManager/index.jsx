import { Spin } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import request from '@/utils/rest';
import Insert from '../components/insert/InsertIndex'
import PageConponents from '../components/pageConponents/index'

class MarketManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            com:["YWFX_0001","YWFX_0002","YWFX_0003","YWFX_0004","YWFX_0005","YWFX_0007","YWFX_0011","YWFX_0013","YWFX_0014"],
            isShow:false,
            currentComponent:'',
            loading:false,
            show:false//对图表进行重新渲染，否则会有刷新背景图填充的bug
        };
    }

    componentDidMount() {
        this.getAllComponent()
    }
    cancel =()=>{
      let that = this
      that.setState({
            show:false,
            isShow:false
      },function(){
            setTimeout(function(){
               that.setState({
                  show:true
               })
            },100)
      })
     
    }
     showInsert = (value) =>{
         //value为子组件的标识名字
         let that = this
         that.setState({
            show:false,
            isShow:true,
            currentComponent:value
         },function(){
            setTimeout(function(){
               that.setState({
                     show:true
               })
            },100)
         })
      }
    //删除组件接口
    deleteComponent =async(e)=>{
        let post={
           moduleTypes:[e],
           roleType:"marketmanager"
       }
      let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/deleteModules',post);
      console.log(res);
      this.getAllComponent()
     }
     //获取当前组件信息
     getAllComponent =async()=>{
        this.setState({
              loading:true
        })
        let post={
              roleType:"marketmanager"
        }
        let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/getRoleModules',post);
        let arr=[]
        if(res.message=="成功"){
           for(let i=0;i<res.data.length;i++){
                 arr.push(res.data[i].moduletype)
           }
           let that = this
            that.setState({
               show:false,
               com:arr,
                 loading:false
            },function(){
               setTimeout(function(){
                  that.setState({
                        show:true
                  })
               },100)
            })
        }
     }
     insertNow=async(e)=>{
        this.setState({
              isShow:false,
              loading:true
           })
        let post={
              moduleTypes:e,
              roleType:"marketmanager"
        }
        console.log(post);
        let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/addModules',post);
        if(res.message=="成功"){
              this.getAllComponent()
              this.setState({
                 loading:false
              })
        }
        
     }


    render() {
 
        return (
            <PageHeaderWrapper title="市场经理报告">
               <GridContent className={styles.tabsCard}>
               <Spin spinning={this.state.loading}>
                  {
                     this.state.show?<PageConponents com={this.state.com} showInsert={this.showInsert} delete={this.deleteComponent}></PageConponents>:''
                  }
                  <Insert 
                        isShow={this.state.isShow} 
                        cancel={this.cancel} 
                        allComponents={this.state.com}
                        insertNow = {this.insertNow}
                        currentComponent={this.state.currentComponent}/>
                        </Spin>
                </GridContent>
            </PageHeaderWrapper>
        );
    }
}

export default MarketManage;
