(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[21],{VFRD:function(e,t,a){"use strict";a.r(t);a("IzEo");var n=a("bx4M"),r=(a("g9YV"),a("wCAj")),o=(a("DYRE"),a("zeV3")),i=(a("+L6B"),a("2/Rp")),l=a("k1fw"),c=a("fWQN"),s=a("mtLc"),u=a("yKVA"),d=a("879j"),p=(a("/xke"),a("TeRw")),m=(a("OaEy"),a("2fM7")),g=(a("y8nQ"),a("Vl3Y")),f=a("q1tI"),b=a.n(f),y=a("55Ip"),h=a("9kvl"),E=a("Hx5s"),D=a("FRQA"),S=a("nT/m"),I=a("xvlK"),R=a("sVoS"),O=a.n(R),w=(a("LvDl"),a("+n12")),C=a("wd/R"),_=a.n(C),v=(g["a"].Item,m["a"].Option,function(e,t,a,n,r){p["default"][e||"info"]({message:t,description:a,placement:n,duration:r||3})}),N=function(e){Object(u["a"])(a,e);var t=Object(d["a"])(a);function a(){var e;Object(c["a"])(this,a);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return e=t.call.apply(t,[this].concat(r)),e.state={pageData:{pageNum:1,pageSize:20},dataSource:{}},e.formRef=b.a.createRef(),e.columns=[{title:"\u53cc\u5f55\u7c7b\u578b",dataIndex:"doubleType",render:function(e){return e?Object(w["x"])(S["p"])[e]:"--"}},{title:"\u7cfb\u7edf\u53cc\u5f55\u7248\u672c\u53f7",dataIndex:"versionNumber",width:130},{title:"\u6a21\u677f\u540d\u79f0",dataIndex:"templateName"},{title:"\u6a21\u677f\u72b6\u6001",dataIndex:"isLatestVersion",render:function(e,t){return 1===e&&1===t.publishStatus?"\u6709\u6548":"\u5931\u6548"}},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"createTime",render:function(e){return e?_()(e).format("YYYY/MM/DD HH:mm"):"--"}},{title:"\u521b\u5efa\u4eba",dataIndex:"userName",render:function(e){return e||"--"}},{title:"\u53d1\u5e03\u72b6\u6001",dataIndex:"publishStatus",render:function(e){return 0===e?"\u7f16\u8f91\u4e2d":"\u5df2\u53d1\u5e03"}},{title:"\u64cd\u4f5c",render:function(e,t){return b.a.createElement(f["Fragment"],null,2===t.doubleType?b.a.createElement(y["a"],{to:"/raisingInfo/doubleRecordConfig/aiMindDetails/".concat(t.sysWordId)},1===t.publishStatus?"\u67e5\u770b":"\u7f16\u8f91"):b.a.createElement(y["a"],{to:"/raisingInfo/doubleRecordConfig/generalDoubleDetails/".concat(t.sysWordId)},1===t.publishStatus?"\u67e5\u770b":"\u7f16\u8f91"))}}],e._onFinish=function(){e.setState({selectedRowKeys:[],pageData:Object(l["a"])(Object(l["a"])({},e.state.pageData),{},{pageNum:1})},(function(){e._search()}))},e._search=function(){var t=e.state.pageData,a=e.props.dispatch;a({type:"DOUBLE_RECORD/templateList",payload:Object(l["a"])(Object(l["a"])({},t),{},{sortFiled:"updateTime",sortType:"desc"}),callback:function(t){if(1008===t.code)e.setState({dataSource:t.data||{}});else{var a=t.message||t.data||"\u67e5\u8be2\u5931\u8d25\uff01";v("warning","\u63d0\u793a\uff08\u4ee3\u7801\uff1a".concat(t.code,"\uff09"),a,"topRight")}}})},e._reset=function(){e.formRef.current.resetFields(),e.state.pageData.pageNum=1,e.setState({selectedRowKeys:[]}),e._search()},e._tableChange=function(t,a,n){e.state.pageData.pageNum=t.current,e.state.pageData.pageSize=t.pageSize,e._search()},e._onAdd=function(e){1===e&&h["c"].push({pathname:"/raisingInfo/doubleRecordConfig/generalDoubleDetails/".concat(0)}),2===e&&h["c"].push({pathname:"/raisingInfo/doubleRecordConfig/aiMindDetails/".concat(0)})},e.rowClassName=function(e){return 1===e.isLatestVersion&&1===e.publishStatus?O.a.rowStyle:null},e}return Object(s["a"])(a,[{key:"componentDidMount",value:function(){this._search()}},{key:"render",value:function(){var e=this,t=this.state,a=t.pageData,l=t.dataSource,c=this.props.loading,s=sessionStorage.getItem("defaultDoubleCheckType"),u=sessionStorage.getItem("PERMISSION")&&JSON.parse(sessionStorage.getItem("PERMISSION"))["60200"]||{},d=u.authEdit;return b.a.createElement(E["a"],{title:"\u53cc\u5f55\u6a21\u677f\u914d\u7f6e\u5217\u8868"},b.a.createElement(D["a"],null,b.a.createElement(n["a"],{extra:b.a.createElement(i["a"],{type:"primary",onClick:this._search},"\u5237\u65b0\u9875\u9762")},b.a.createElement("div",{className:O.a.container},b.a.createElement("div",{className:O.a.dataTable},b.a.createElement("div",{className:O.a.operationBtn},"1"===s&&d&&b.a.createElement(i["a"],{type:"primary",icon:b.a.createElement(I["a"],null),onClick:function(){return e._onAdd(1)}},"\u65b0\u5efa\u666e\u901a\u53cc\u5f55"),"2"===s&&d&&b.a.createElement(i["a"],{type:"primary",icon:b.a.createElement(I["a"],null),onClick:function(){return e._onAdd(2)}},"\u65b0\u5efaAI\u53cc\u5f55"),"3"===s&&d&&b.a.createElement(o["b"],null,b.a.createElement(i["a"],{type:"primary",icon:b.a.createElement(I["a"],null),onClick:function(){return e._onAdd(1)}},"\u65b0\u5efa\u666e\u901a\u53cc\u5f55"),b.a.createElement(i["a"],{type:"primary",icon:b.a.createElement(I["a"],null),onClick:function(){return e._onAdd(2)}},"\u65b0\u5efaAI\u53cc\u5f55")),b.a.createElement("span",{className:O.a.note},"\u6ce8\uff1a\u540c\u4e00\u65f6\u95f4\u4ec5\u6709\u4e00\u4e2a\u8bdd\u672f\u751f\u6548")),b.a.createElement(r["a"],{loading:c,columns:this.columns,rowKey:"sysWordId",dataSource:l.list||[],scroll:{x:"100%",scrollToFirstRowOnChange:!0},pagination:Object(S["Sb"])(l.total,a.pageNum),onChange:function(t,a,n){return e._tableChange(t,a,n)}}))))))}}]),a}(f["PureComponent"]);t["default"]=Object(h["b"])((function(e){var t=e.DOUBLE_RECORD,a=e.loading;return{DOUBLE_RECORD:t,loading:a.effects["DOUBLE_RECORD/templateList"]}}))(N)},sVoS:function(e,t,a){e.exports={container:"antd-pro-pages-double-record-config-list-style-container",filter:"antd-pro-pages-double-record-config-list-style-filter",btnGroup:"antd-pro-pages-double-record-config-list-style-btnGroup",dataTable:"antd-pro-pages-double-record-config-list-style-dataTable",rowStyle:"antd-pro-pages-double-record-config-list-style-rowStyle",operationBtn:"antd-pro-pages-double-record-config-list-style-operationBtn",note:"antd-pro-pages-double-record-config-list-style-note"}}}]);