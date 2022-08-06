import { Spin } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import { connect } from 'umi';
import styles from './style.less';
import request from '@/utils/rest';
import Insert from '../components/insert/InsertIndex';
import PageConponents from '../components/pageConponents/index';


class InvestManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            com:['YWFX_0001', 'YWFX_0007', 'YWFX_0008', 'YWFX_0009', 'YWFX_0010', 'YWFX_0011'],
            isShow:false,
            currentComponent:'',
            loading:false,
            show:true
        };
    }

    componentDidMount() {
        this.getAllComponent();
    }
    cancel =()=>{
        let that = this;
        that.setState({
            show:false,
            isShow:false
        }, function(){
            setTimeout(function(){
                that.setState({
                    show:true
                });
            }, 100);
        });
    }
   showInsert = (value) =>{
       //value为子组件的标识名字
       let that = this;
       that.setState({
           show:false,
           isShow:true,
           currentComponent:value
       }, function(){
           setTimeout(function(){
               that.setState({
                   show:true
               });
           }, 100);
       });
   }
    //删除组件接口
    deleteComponent =async(e)=>{
        let post={
            moduleTypes:[e],
            roleType:'investmanager'
        };
        let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/deleteModules', post);
        console.log(res);
        this.getAllComponent();
    }
   //获取当前组件信息
   getAllComponent =async()=>{
       this.setState({
           loading:true
       });
       let post={
           roleType:'investmanager'
       };
       let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/getRoleModules', post);
       let arr=[];
       if(res.message=='成功'){
           for(let i=0;i<res.data.length;i++){
               arr.push(res.data[i].moduletype);
           }
           let that = this;
           that.setState({
               show:false,
               com:arr,
               loading:false
           }, function(){
               setTimeout(function(){
                   that.setState({
                       show:true
                   });
               }, 100);
           });
       }
   }
   insertNow=async(e)=>{
       this.setState({
           isShow:false
       });
       let post={
           moduleTypes:e,
           roleType:'investmanager'
       };
       let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/addModules', post);
       if(res.message=='成功'){
           this.getAllComponent();
       }

   }


   render() {

       return (
           <PageHeaderWrapper title="投资经理报告">
               <GridContent className={styles.tabsCard}>
                   <Spin spinning={this.state.loading}>
                       {
                           this.state.show?<PageConponents com={this.state.com} showInsert={this.showInsert} delete={this.deleteComponent}></PageConponents>:''

                       }
                       <Insert
                           isShow={this.state.isShow}
                           cancel={this.cancel}
                           allComponents={this.state.com}
                           insertNow={this.insertNow}
                           currentComponent={this.state.currentComponent}
                       />
                   </Spin>
               </GridContent>
           </PageHeaderWrapper>
       );
   }
}

export default InvestManager;
