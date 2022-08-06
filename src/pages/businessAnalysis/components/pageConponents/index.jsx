import { Card,Popconfirm } from 'antd';

import React, { Component } from 'react';
import styles from './style.less';

import OperateView from '../operateView/OperateView'
import HolderView from '../holderView/HolderView'
import CustomerSell from '../customerSell/CustomerSell'
import CustomerShare from '../customerShare/CustomerShare'
import CustomerTop10 from '../customerTop10/CustomerTop10'
import ManageScale from '../manageScale/index'
import IncomeRange from '../incomeRange/IncomeRange'
import AssetAllocation from '../assetAllocation/AssetAllo'
import HeavyAsset from '../heavyAsset/HeavyAsset'
import AllTop10 from '../allTop10/AllTop10'
import IncomeShow from '../incomeShow/IncomeShow'
import OperateStatus from '../operateStatus/index'
import OperateCanlendar from '../operateCalendar/index'
import SellDistribute from '../sellDistribute/SellDistribute'

class   PageConponents extends Component {
    constructor(props) {
        super(props);
        this.state={

        }
    }
    showInsert = (value) =>{

        this.props.showInsert(value)
     }
     //删除组件接口
     deleteComponent =(e)=>{
         this.props.delete(e)
     }

    render() {
        const AllComponents = this.props.com
        return (
               <div>
                   {
                       AllComponents.map((item)=>{
                       switch (item) {
                        case 'YWFX_0001':
                            return <OperateView key={item} showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0002':
                            return <HolderView key={item} showInsert={this.showInsert} delete={this.deleteComponent} />;
                        case 'YWFX_0003':
                            return <CustomerSell key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0004':
                            return <CustomerShare key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0005':
                            return <CustomerTop10 key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0006':
                            return <ManageScale key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0007':
                            return <IncomeRange key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0008':
                            return <AssetAllocation key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0009':
                            return <HeavyAsset key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0010':
                            return <AllTop10 key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0011':
                            return <IncomeShow key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0012':
                            return <OperateStatus key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0013':
                            return <OperateCanlendar key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                        case 'YWFX_0014':
                            return <SellDistribute key={item}  showInsert={this.showInsert} delete={this.deleteComponent}/>;
                       }

                       })
                   }



               </div>

        );
    }
}

export default  PageConponents;
