import { Spin } from 'antd';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { Component } from 'react';
import request from '@/utils/rest';
import styles from './style.less';

import Insert from '../components/insert/InsertIndex'
import PageConponents from '../components/pageConponents/index'


class GeneralManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            com:[],
            isShow:false,
            currentComponent:'',
            loading:false,
            show:true,
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
       this.setState({
          
       })
       let that = this
            that.setState({
                show:false,
                currentComponent:value,
                isShow:true
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
            roleType:"manager"
        }
       let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/deleteModules',post);
       console.log(res);
       this.getAllComponent()
       this.setState({
            loading:false
        })
    }
    //获取当前组件信息
    getAllComponent =async()=>{
        this.setState({
            loading:true
        })
        let post={
            roleType:"manager"
        }
       let res = await request.postJSON('/mrp_analysis/simuAnalysisModule/getRoleModules',post);
       let arr=[]
       if(res.message=="成功"){
           for(let i=0;i<res.data.length;i++){
               arr.push(res.data[i].moduletype)
           }
           console.log(arr);
           //删除后更新数据，貌似这一步更新arr没有生效
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
       console.log(this.state.com);
    }
    insertNow=async(e)=>{
        this.setState({
            isShow:false,
            loading:true
         })
       let post={
            moduleTypes:e,
            roleType:"manager"
        }
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
            <PageHeaderWrapper title="总经理报告">
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

export default GeneralManager;
