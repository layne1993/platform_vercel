(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[52],{ApYx:function(e,a,t){"use strict";t.r(a);t("T2oS");var n=t("W9HT"),c=t("0Owb"),l=(t("+L6B"),t("2/Rp")),o=(t("ozfa"),t("MJZm")),r=(t("14J3"),t("BMrR")),i=(t("jCWc"),t("kPKH")),d=(t("DYRE"),t("zeV3")),s=(t("qVdP"),t("jsC+")),u=(t("lUTK"),t("BvKs")),m=(t("2qtc"),t("kLXV")),p=t("oBTY"),f=(t("y8nQ"),t("Vl3Y")),b=t("tJVT"),E=t("k1fw"),k=(t("/xke"),t("TeRw")),N=(t("5NDa"),t("5rEg")),O=t("q1tI"),j=t.n(O),y=t("Hx5s"),g=t("9kvl"),v=t("RCxd"),I=t("xvlK"),h=t("FrMl"),x=t("+n12"),C=t("xWGa"),S=t.n(C),T=t("wd/R"),w=t.n(T),D=t("q/5X"),F=t.n(D),K=t("ZYLO"),L=t.n(K),R=t("1zlZ"),B=t.n(R),W=t("wRhG"),P=t.n(W),V=t("Y2kK"),Y=t.n(V),A=N["a"].Search,q={labelCol:{xs:{span:6},sm:{span:6}},wrapperCol:{xs:{span:16},sm:{span:16}}},H=function(e,a,t,n){var c=arguments.length>4&&void 0!==arguments[4]?arguments[4]:3;k["default"][e||"info"]({message:a,description:t,placement:n,duration:c||3})},J=function e(a){if(!Array.isArray(a))return[];var t=[];return a.map((function(a){t.push(Object(E["a"])(Object(E["a"])({},a),{},{icon:!a.isLeaf&&j.a.createElement("img",{src:F.a}),title:a.isLeaf?a.fileName:a.nodeName,key:a.isLeaf?a.sharedNetWorkFileId:a.nodeId,id:a.isLeaf?a.sharedNetWorkFileId:a.nodeId,children:a.children&&e(a.children)}))})),t},M=function e(a,t,n){return a.map((function(a){return a.id===t?Object(E["a"])(Object(E["a"])({},a),{},{children:n}):a.children?Object(E["a"])(Object(E["a"])({},a),{},{icon:j.a.createElement("img",{src:F.a}),children:e(a.children,t,n)}):a}))},U={title:void 0,key:0,id:"0",parentNodeId:0},z=function(e){U=e},G=Object(x["o"])(40100),Z=G.authEdit,X=(G.authExport,function(e){var a=e.loading,t=e.addNetWorkDiskLoading,k=e.updateFileNameLoading,g=e.searchLoading,x=e.dispatch,C=(e.params,f["a"].useForm()),T=Object(b["a"])(C,1),D=T[0],F=Object(O["useState"])([]),K=Object(b["a"])(F,2),R=K[0],W=K[1],V=Object(O["useState"])(void 0),G=Object(b["a"])(V,2),X=G[0],Q=G[1],$=Object(O["useState"])(!1),_=Object(b["a"])($,2),ee=_[0],ae=_[1],te=Object(O["useState"])(!0),ne=Object(b["a"])(te,2),ce=ne[0],le=ne[1],oe=Object(O["useState"])(!1),re=Object(b["a"])(oe,2),ie=re[0],de=re[1],se=Object(O["useState"])([]),ue=Object(b["a"])(se,2),me=ue[0],pe=ue[1],fe=Object(O["useState"])(!1),be=Object(b["a"])(fe,2),Ee=(be[0],be[1]),ke=Object(O["useState"])([]),Ne=Object(b["a"])(ke,2),Oe=Ne[0],je=Ne[1],ye=Object(O["useState"])([]),ge=Object(b["a"])(ye,2),ve=ge[0],Ie=ge[1],he=Object(O["useState"])([]),xe=Object(b["a"])(he,2),Ce=xe[0],Se=xe[1];Object(O["useEffect"])((function(){z({title:void 0,key:0,id:"0",parentNodeId:0})}),[]);var Te=function(){x({type:"DISKCENTER/selectAllNetwork",payload:{nodeId:null},callback:function(e){var a=e.code,t=e.data;1008===a?W(J(t)):H("error","\u63d0\u9192","\u67e5\u8be2\u5931\u8d25\uff01")}})};Object(O["useEffect"])(Te,[]);var we=function(e){return console.log(e,"loadData-------------------"),new Promise((function(a){var t={};t=1===e.level?{source:e.id}:{nodeId:e.id},x({type:"DISKCENTER/getTreeData",payload:Object(E["a"])({},t),callback:function(t){var n=t.code,c=t.data,l=t.message;if(1008===n)W((function(a){return M(a,e.id,J(c))}));else{var o=l||c||"\u67e5\u8be2\u5931\u8d25\uff01";H("error","\u63d0\u9192",o)}a()}})}))},De=function(){ae(!1),le(!0),de(!1),D.setFieldsValue({folderName:void 0,fileName:void 0})},Fe=function(e,a){var t=a.node,n=Object(p["a"])(ve),c=Object(p["a"])(e);if(Ce.length>e.length){var l=Ce.indexOf(t.key);-1!==l?(n=ve.filter((function(e,a){return a<l})),c=Object(p["a"])(n)):(n=ve.filter((function(a){return e.includes(a)})),c=Object(p["a"])(n))}Se(c),Ie(n)},Ke=function(e){var a=Object(E["a"])(Object(E["a"])({},U),{},{nodeId:ie?void 0:U.nodeId,parentNodeId:ie?U.id:U.parentNodeId,nodeName:e});1===a.level&&(a.parentNodeId=a.source||0),x({type:"DISKCENTER/addNetWorkDisk",payload:Object(E["a"])({},a),callback:function(e){var a=e.code,t=e.message;if(1008===a)H("success","\u63d0\u9192","\u64cd\u4f5c\u6210\u529f"),De(),Fe(Ce,U.key),1===U.level?we(Object(E["a"])({},U)):0===U.parentNodeId?we(Object(E["a"])(Object(E["a"])({},U),{},{level:1,id:0})):we(ie?Object(E["a"])(Object(E["a"])({},U),{},{id:U.id}):Object(E["a"])(Object(E["a"])({},U),{},{id:U.parentNodeId}));else{var n=t||"\u64cd\u4f5c\u5931\u8d25\uff01";H("error","\u63d0\u9192",n)}}})},Le=function(e){x({type:"DISKCENTER/updateFileName",payload:{sharedNetWorkFileId:U.id,fileName:e},callback:function(e){var a=e.code,t=e.message;if(1008===a)De(),we(Object(E["a"])(Object(E["a"])({},U),{},{id:U.parentNodeId})),H("success","\u63d0\u9192","\u4fee\u6539\u6210\u529f");else{var n=t||"\u64cd\u4f5c\u5931\u8d25\uff01";H("error","\u63d0\u9192",n)}}})},Re=function(e){x({type:"DISKCENTER/deleteFile",payload:{sharedNetWorkFileId:e},callback:function(e){var a=e.code,t=(e.data,e.message);if(1008===a)we(Object(E["a"])(Object(E["a"])({},U),{},{id:U.parentNodeId})),H("success","\u63d0\u9192","\u5220\u9664\u6210\u529f");else{var n=t||"\u5220\u9664\u5931\u8d25\uff01";H("error","\u63d0\u9192",n)}}})},Be=function(e){x({type:"DISKCENTER/deleteFolder",payload:{nodeId:e},callback:function(e){var a=e.code,t=(e.data,e.message);if(1008===a)0===U.parentNodeId&&0===U.source?we(Object(E["a"])(Object(E["a"])({},U),{},{level:1,id:0})):we(Object(E["a"])(Object(E["a"])({},U),{},{id:U.parentNodeId})),H("success","\u63d0\u9192","\u5220\u9664\u6210\u529f\uff01");else{var n=t||"\u5220\u9664\u5931\u8d25\uff01";H("error","\u63d0\u9192",n)}}})},We=function(e,a){z(Object(E["a"])({},e)),a.stopPropagation(),e.isLeaf?m["a"].confirm({title:"\u5220\u9664\uff1f",icon:j.a.createElement(v["a"],null),content:"\u786e\u5b9a\u5220\u9664\uff1f",okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onOk:function(){return Re(e.id)}}):m["a"].confirm({title:"\u5220\u9664\uff1f",icon:j.a.createElement(v["a"],null),content:"\u786e\u5b9a\u5220\u9664\uff1f",okText:"\u786e\u8ba4",cancelText:"\u53d6\u6d88",onOk:function(){return Be(e.id)}})},Pe=function(){ae(!0),le(!1),D.setFieldsValue({folderName:void 0})},Ve=function(e,a){z(e),a.stopPropagation(),e.isLeaf?D.setFieldsValue({fileName:e.title}):(le(!1),D.setFieldsValue({folderName:e.title})),ae(!0)},Ye=function(e,a){console.log(a.node,"node"),Q(e),z(a.node||{})},Ae=function(e){je(e),Ee(!0)},qe=function(e){e=e&&e.trim(),e?x({type:"DISKCENTER/diskSearch",payload:{fileName:e},callback:function(e){var a=e.code,t=e.data,n=e.message;if(1008===a)pe(J(t.jsonArray)||[]),Ae(t.list),0===t.jsonArray.length&&H("warning","\u63d0\u9192","\u6ca1\u6709\u76f8\u5173\u7684\u6587\u4ef6\u4fe1\u606f\uff01");else{var c=n||t||"\u67e5\u8be2\u5931\u8d25\uff01";H("error","\u63d0\u9192",c)}}}):pe([])},He=function(){D.validateFields().then((function(e){var a=D.getFieldsValue();a.folderName&&Ke(a.folderName),a.fileName&&Le(a.fileName),ae(!1)}))},Je=function(e,a){z(e),a.stopPropagation()},Me=function(e){e.domEvent&&e.domEvent.stopPropagation(),"3"===e.key&&(ae(!0),le(!1),de(!0))},Ue=function(e,a){window.open(e),a.stopPropagation()},ze=function(e){var a=e.status,t=e.message;console.log(U,"onSuccessonSuccessonSuccess----------------"),"success"===a?we(U):H("warning","\u63d0\u793a",t,"topRight")},Ge=function(e){Ie(e)},Ze=function(e){return j.a.createElement("span",{key:e.key},j.a.createElement("div",{className:S.a.titleBox},j.a.createElement("div",{className:S.a.leftBox},j.a.createElement("p",{style:{marginBottom:0}},e.title),e.isLeaf&&j.a.createElement("span",null,e.operateUserName&&j.a.createElement("span",null,e.operateUserName,"\uff0c"),e.updateTime&&w()(e.updateTime).format("YYYY/MM/DD HH:mm"))),Z&&X&&X[0]===e.key&&0===e.source&&j.a.createElement(d["b"],{className:S.a.extra},1!==e.level&&j.a.createElement("span",{title:"\u5220\u9664",onClick:function(a){return We(e,a)},className:S.a.optionBtn},j.a.createElement("img",{src:B.a}),"\u5220\u9664"),1!==e.level&&j.a.createElement("span",{title:"\u4fee\u6539\u540d\u79f0",onClick:function(a){return Ve(e,a)},className:S.a.optionBtn},j.a.createElement("img",{src:L.a}),"\u7f16\u8f91"),e.isLeaf&&j.a.createElement("span",{title:"\u4e0b\u8f7d",onClick:function(a){return Ue(e.url,a)},className:S.a.optionBtn},j.a.createElement("img",{src:Y.a}),"\u4e0b\u8f7d"),!e.isLeaf&&j.a.createElement(s["a"],{overlay:j.a.createElement(u["a"],{onClick:Me},1!==e.level&&j.a.createElement(u["a"].Item,{key:1},j.a.createElement(h["a"],{params:Object(E["a"])(Object(E["a"])({},U),{},{actionId:U.actionId?U.actionId:U.sourceId,nodeId:U.id}),url:"/shareNetworkFile/addNetWorkFile",uploadProps:{multiple:!0},callback:ze},"\u4e0a\u4f20\u6587\u4ef6")),j.a.createElement(u["a"].Item,{key:2},j.a.createElement(h["a"],{params:Object(E["a"])(Object(E["a"])({},U),{},{actionId:U.actionId?U.actionId:U.sourceId,nodeId:U.id}),url:"/shareNetworkFile/moreFileUpload",uploadProps:{directory:!0},callback:ze},"\u4e0a\u4f20\u6587\u4ef6\u5939")),j.a.createElement(u["a"].Item,{key:3},"\u65b0\u5efa\u6587\u4ef6\u5939"))},j.a.createElement("span",{title:"\u4e0a\u4f20\u64cd\u4f5c",className:S.a.optionBtn,style:{color:"#746d6d"},onClick:function(a){return Je(e,a)}},j.a.createElement("img",{src:P.a})," \u4e0a\u4f20")))))};return j.a.createElement(y["a"],null,j.a.createElement(n["a"],{spinning:a},j.a.createElement("div",{className:S.a.diskCenterWarp},R.length>0&&j.a.createElement(r["a"],{style:{marginBottom:20}},j.a.createElement(i["a"],{span:12},j.a.createElement(A,{loading:g,placeholder:"\u8bf7\u8f93\u5165\u6807\u9898\uff0c\u6216\u5185\u5bb9\uff08\u652f\u6301word\u3001excel\u3001pdf\u3001txt\uff09",onSearch:qe,allowClear:!0}))),j.a.createElement(r["a"],null,j.a.createElement(i["a"],{span:24},me.length>0?j.a.createElement(o["a"].DirectoryTree,{showLine:!0,showIcon:!0,blockNode:!0,treeData:me,titleRender:Ze,checkedKeys:X,onSelect:Ye,expandedKeys:Oe,onExpand:Ae}):j.a.createElement("div",{style:{display:0===me.length?"block":"none"}},j.a.createElement(o["a"].DirectoryTree,{showLine:!0,showIcon:!0,blockNode:!0,treeData:R,titleRender:Ze,checkedKeys:X,onSelect:Ye,loadData:we,expandedKeys:Ce,onExpand:Fe,loadedKeys:ve,onLoad:Ge})))),j.a.createElement(m["a"],{title:"\u7f51\u76d8\u4fe1\u606f\u7ef4\u62a4",visible:ee,onCancel:De,maskClosable:!1,width:"40%",destroyOnClose:!0,footer:[j.a.createElement(l["a"],{key:"back",onClick:De},"\u53d6\u6d88"),j.a.createElement(l["a"],{key:"submit",type:"primary",htmlType:"submit",loading:t||k,onClick:He},"\u786e\u5b9a")]},j.a.createElement(f["a"],Object(c["a"])({},q,{form:D,onFinish:He}),ce&&j.a.createElement(f["a"].Item,{label:"\u6587\u4ef6\u540d\u79f0",name:"fileName",rules:[{required:!0,message:"\u8bf7\u8f93\u5165"}]},j.a.createElement(N["a"],{placeholder:"\u8bf7\u8f93\u5165"})),!ce&&j.a.createElement(f["a"].Item,{label:"\u6587\u4ef6\u5939\u540d\u79f0",name:"folderName",rules:[{required:!0,message:"\u8bf7\u8f93\u5165"}]},j.a.createElement(N["a"],{placeholder:"\u8bf7\u8f93\u5165"})))),Z&&0===R.length&&j.a.createElement(r["a"],{justify:"center"},j.a.createElement(l["a"],{icon:j.a.createElement(I["a"],null),onClick:Pe},"\u65b0\u5efa\u6587\u4ef6\u5939")))))});a["default"]=Object(g["b"])((function(e){var a=e.loading;return{loading:a.effects["DISKCENTER/selectAllNetwork"],searchLoading:a.effects["DISKCENTER/diskSearch"],addNetWorkDiskLoading:a.effects["DISKCENTER/addNetWorkDisk"],updateFileNameLoading:a.effects["DISKCENTER/updateFileName"]}}))(X)},xWGa:function(e,a,t){e.exports={diskCenterWarp:"antd-pro-pages-product-life-cycle-disk-center-styles-diskCenterWarp",nodeTitle:"antd-pro-pages-product-life-cycle-disk-center-styles-nodeTitle",extra:"antd-pro-pages-product-life-cycle-disk-center-styles-extra",titleBox:"antd-pro-pages-product-life-cycle-disk-center-styles-titleBox",leftBox:"antd-pro-pages-product-life-cycle-disk-center-styles-leftBox",optionBtn:"antd-pro-pages-product-life-cycle-disk-center-styles-optionBtn"}}}]);