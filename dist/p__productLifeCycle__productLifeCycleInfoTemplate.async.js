(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[57],{"8ie1":function(e,t,a){e.exports={container:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-container",filter:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-filter",rowWrapper:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-rowWrapper",btnGroup:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-btnGroup",dataTable:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-dataTable",operationBtn:"antd-pro-pages-product-life-cycle-product-life-cycle-info-template-style-operationBtn"}},SW41:function(e,t,a){"use strict";a.r(t);a("IzEo");var n=a("bx4M"),c=(a("14J3"),a("BMrR")),l=(a("+L6B"),a("2/Rp")),r=(a("jCWc"),a("kPKH")),i=(a("5NDa"),a("5rEg")),o=a("k1fw"),s=(a("DYRE"),a("zeV3")),p=a("fWQN"),d=a("mtLc"),u=a("tS8v"),m=a("yKVA"),f=a("879j"),y=(a("/xke"),a("TeRw")),h=(a("2qtc"),a("kLXV")),g=(a("y8nQ"),a("Vl3Y")),b=a("q1tI"),w=a.n(b),T=a("9kvl"),E=a("nT/m"),C=a("Hx5s"),I=a("FRQA"),v=a("8ie1"),k=a.n(v),N=a("wd/R"),_=a.n(N),R=a("tQHx"),S=a("RCxd"),L=a("+n12"),x="YYYY/MM/DD HH:mm:ss",D=g["a"].Item,O=h["a"].confirm,j=function(e,t,a,n,c){y["default"][e||"info"]({message:t,description:a,placement:n,duration:c||3})},P=function(e){Object(m["a"])(a,e);var t=Object(f["a"])(a);function a(){var e;Object(p["a"])(this,a);for(var n=arguments.length,c=new Array(n),l=0;l<n;l++)c[l]=arguments[l];return e=t.call.apply(t,[this].concat(c)),e.state={selectedRowKeys:[],pageData:{current:1,pageSize:20},searchParams:{},sortFiled:"",sortType:""},e.formRef=w.a.createRef(),e.columns=[{title:"\u6a21\u677f\u540d\u79f0",dataIndex:"templateName",fixed:"left",width:120,render:function(t,a){return w.a.createElement("span",{className:"details",onClick:function(){return e._handleDetails(a)}},t||"--")}},{title:"\u72b6\u6001",dataIndex:"templateStatuis",width:100,render:function(e){var t=E["ac"].find((function(t){return t.value===e}));return t&&t.label||"--"}},{title:"\u4f7f\u7528\u6b21\u6570",dataIndex:"numberOfUse",width:80,render:function(e){return w.a.createElement("span",null,e)}},{title:"\u521b\u5efa\u4eba",dataIndex:"managerUserName",width:100,render:function(e){return w.a.createElement("span",null,e||"--")}},{title:"\u521b\u5efa\u65f6\u95f4",dataIndex:"createTime",width:120,sorter:!0,render:function(e){return w.a.createElement("span",null,e&&_()(e).format(x)||"--")}},{title:"\u64cd\u4f5c",dataIndex:"operate",width:80,render:function(t,a){var n=Object(L["o"])(40400),c=n.authEdit;return w.a.createElement(s["b"],null,w.a.createElement("span",{className:"details",onClick:function(){return e._handleDetails(a)}},2!==a.templateStatuis?"\u7f16\u8f91":"\u67e5\u770b"," "),c&&2===a.templateStatuis&&w.a.createElement("span",{className:"details",onClick:function(){return e._setDisable(3,a)}},"\u7981\u7528"),c&&3===a.templateStatuis&&w.a.createElement("span",{className:"details",onClick:function(){return e._setDisable(2,a)}},"\u542f\u7528"))}}],e._handleDetails=function(e){T["c"].push({pathname:"/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/".concat(e.lifecycleTemplateId)})},e._addTemplate=function(){T["c"].push({pathname:"/productLifeCycleInfo/productLifeCycleInfoTemplate/newProductLifeCycleInfoTemplate/0"})},e._onFinish=function(t){e.setState({searchParams:Object(o["a"])({},t),selectedRowKeys:[],pageData:{current:1}},(function(){e._search()}))},e._search=function(){var t=e.state,a=t.pageData,n=t.sortFiled,c=t.sortType,l=t.searchParams,r=e.props.dispatch,i={};c&&(i.sortFiled=n,i.sortType=c),r({type:"newProductLifeCycleInfoTemplate/querylifeCycleTemplateList",payload:Object(o["a"])(Object(o["a"])({pageNum:a.current||1,pageSize:a.pageSize||20},i),l),callback:function(t){if(1008===t.code&&t.data)e.setState({templateList:t.data});else{var a=t.message||t.data||"\u67e5\u8be2\u5931\u8d25\uff01";j("warning","\u63d0\u793a\uff08\u4ee3\u7801\uff1a".concat(t.code,"\uff09"),a,"topRight")}}})},e._reset=function(){e.formRef.current.resetFields(),e.setState({searchParams:{},selectedRowKeys:[]},(function(){e._search()}))},e._tableChange=function(t,a,n){e.setState({sortFiled:n.field,sortType:n.order?"ascend"===n.order?"asc":"desc":void 0,pageData:{current:t.current,pageSize:t.pageSize}},(function(){e._search()}))},e._setDisable=function(t,a){var n=e.props.dispatch,c=Object(u["a"])(e),l=2===t?"\u542f\u7528":"\u7981\u7528";O({title:"\u8bf7\u60a8\u786e\u8ba4\u662f\u5426".concat(l,"\u5f53\u524d\u8282\u70b9?"),icon:w.a.createElement(S["a"],null),okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onOk:function(){n({type:"productTemplate/updateTemplatStatus",payload:{templateStatuis:t,templateName:a.templateName,lifecycleTemplateId:a.lifecycleTemplateId},callback:function(e){if(1008===e.code&&e.data)j("success","\u63d0\u793a","\u8bbe\u7f6e\u6210\u529f","topRight"),c._search();else{var t=e.message||e.data||"\u8bbe\u7f6e\u5931\u8d25\uff01";j("warning","\u63d0\u793a\uff08\u4ee3\u7801\uff1a".concat(e.code,"\uff09"),t,"topRight")}}})},onCancel:function(){}})},e}return Object(d["a"])(a,[{key:"componentDidMount",value:function(){this._search()}},{key:"render",value:function(){var e=this,t=this.state,a=t.pageData,o=t.templateList,s=this.props.loading,p=Object(L["o"])(40400),d=p.authEdit;return w.a.createElement(C["a"],{title:"\u6a21\u677f\u5217\u8868"},w.a.createElement(I["a"],{className:k.a.tabsCard},w.a.createElement(n["a"],{bordered:!1},w.a.createElement("div",{className:k.a.container},w.a.createElement("div",{className:k.a.filter},w.a.createElement(g["a"],{name:"basic",onFinish:this._onFinish,ref:this.formRef,labelCol:{span:8}},w.a.createElement(c["a"],{gutter:[8,0],className:k.a.rowWrapper},w.a.createElement(r["a"],{span:6},w.a.createElement(D,{label:"\u6a21\u677f\u540d\u79f0",name:"templateName"},w.a.createElement(i["a"],{placeholder:"\u8bf7\u8f93\u5165",autoComplete:"off"}))),w.a.createElement(r["a"],{span:6,className:k.a.btnGroup},w.a.createElement(l["a"],{type:"primary",htmlType:"submit"},"\u67e5\u8be2"),w.a.createElement(l["a"],{onClick:this._reset},"\u91cd\u7f6e"))))),w.a.createElement("div",{className:k.a.dataTable},w.a.createElement("div",{className:k.a.operationBtn},d&&w.a.createElement(l["a"],{type:"primary",onClick:this._addTemplate},"\u521b\u5efa\u6d41\u7a0b\u6a21\u677f")),w.a.createElement(R["a"],{loading:s,columns:this.columns,dataSource:o&&o.list,total:o&&o.total,pageNum:a.current,rowKey:function(e){return e.lifecycleTemplateId},onChange:function(t,a,n){return e._tableChange(t,a,n)},scroll:{x:"100%",scrollToFirstRowOnChange:!0},sticky:!0}))))))}}]),a}(b["Component"]);t["default"]=Object(T["b"])((function(e){var t=e.newProductLifeCycleInfoTemplate,a=e.loading;return{newProductLifeCycleInfoTemplate:t,loading:a.effects["newProductLifeCycleInfoTemplate/querylifeCycleTemplateList"]}}))(P)}}]);