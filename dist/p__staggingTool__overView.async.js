(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[84],{"4scX":function(e,t,a){"use strict";a.r(t);a("IzEo");var n=a("bx4M"),r=(a("Znn+"),a("ZTPi")),o=a("q1tI"),c=a.n(o),i=a("Hx5s"),l=(a("g9YV"),a("wCAj")),s=(a("OaEy"),a("2fM7")),d=(a("T2oS"),a("W9HT")),g=(a("iQDF"),a("+eQT")),p=a("oBTY"),u=(a("miYZ"),a("tsqr")),m=a("tJVT"),v=(a("sRBo"),a("kaz8")),f=a("9kvl"),y=a("5bA4"),h=a("UESt"),w=a("wd/R"),b=a.n(w),E=a("9/5/"),x=a.n(E),O=a("7hA3"),k=a.n(O),D=function(e){var t=e.title,a=void 0===t?"":t,n=e.onChangeDate;if("step"===a)return c.a.createElement("div",{className:k.a.theadIconWrapper,style:{justifyContent:"flex-end"}},c.a.createElement("div",{className:k.a.theadIconBox,onClick:function(){return n("prev")}},c.a.createElement(y["a"],null)));if("right"===a)return c.a.createElement("div",{className:k.a.theadIconWrapper,style:{justifyContent:"flex-start"}},c.a.createElement("div",{className:k.a.theadIconBox,onClick:function(){return n("next")}},c.a.createElement(h["a"],null)));var r=b()().format("YYYY-MM-DD");return c.a.createElement("div",{className:"".concat(k.a.thead," ").concat(a===r?k.a.today:"")},a)},C=function(e){var t=e.step,a=e.stepList,n=e.onChange,r=a.find((function(e){return e.step===t}));if(!r)return c.a.createElement(c.a.Fragment,null);var o=r.text,i=r.isAvailable;return c.a.createElement("div",{className:"".concat(k.a.stepCell," ").concat(i?k.a.available:"")},c.a.createElement(v["a"],{checked:!0,onChange:n}),c.a.createElement("div",{className:k.a.stepText},o))},I=function(e){var t=e.data,a={1:"#6D93FF",2:"#FB560A",3:"#9B9B9B"},n={1:"#ff3f3f",2:"#fdc753",3:"#3d7fff"},r=function(e){f["c"].push({pathname:"/staggingTool/overView/stock/".concat(e.code)})};return c.a.createElement("div",{className:k.a.tableCell},t.map((function(e,t){return c.a.createElement("div",{key:t,className:k.a.tableCellItem},c.a.createElement("span",{style:{color:a[e.apply]||"",cursor:"pointer"},onClick:function(){return r(e)}},"".concat(e.code," [").concat(e.name,"]")),0===e.haveOfflineApply&&c.a.createElement("span",null,"\u4ec5\u7f51\u4e0a"),c.a.createElement("span",{style:{display:"inline-block",width:"8px",height:"8px",borderRadius:"4px",backgroundColor:n[e.stepStatus]||""}}))})))},Y=function(e){var t=e.dispatch,a=e.calendarLoading,n=e.isSearch,r=e.staggingOverview,i=r.searchOptions,y=r.stepList,h=r.baseDate,w=r.calendarData,E=Object(o["useState"])([]),O=Object(m["a"])(E,2),Y=O[0],B=O[1],T=Object(o["useState"])([]),j=Object(m["a"])(T,2),M=j[0],N=j[1],S=Object(o["useCallback"])((function(e){var a=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t({type:"staggingOverview/updateStepList",payload:{step:e,checked:a}})}),[t]),L=Object(o["useCallback"])((function(e){var a;switch(e){case"prev":a=b()(h).add(-5,"d");break;case"next":a=b()(h).add(5,"d");break;default:a=e;break}t({type:"staggingOverview/updateModelData",payload:{baseDate:a.format("YYYY-MM-DD")}})}),[h,t]),F=Object(o["useMemo"])((function(){var e=function(e){t({type:"staggingOverview/updateModelData",payload:{searchOptions:[]}}),t({type:"staggingOverview/getStockByKeyword",payload:{keyword:e}})};return x()(e,800)}),[t]),A=Object(o["useCallback"])((function(e){if(e){var a=e.apply;if(3===a)return void u["default"].info("\u8be5\u6807\u7684\u4e0d\u80fd\u6253\u65b0\uff01");f["c"].push({pathname:"/staggingTool/overView/stock/".concat(e.value)})}t({type:"staggingOverview/updateModelData",payload:{searchOptions:[]}})}),[t]);return Object(o["useEffect"])((function(){var e=Object(p["a"])(Array(5)).map((function(e,t){return{date:b()().add(t-2,"d").format("YYYY-MM-DD")}}));t({type:"staggingOverview/updateModelData",payload:{calendarData:e}})}),[t]),Object(o["useEffect"])((function(){t({type:"staggingOverview/getCalendarData",payload:{baseDate:h}})}),[h,t]),Object(o["useEffect"])((function(){var e=[{title:c.a.createElement(D,{title:"step",onChangeDate:L}),width:100,align:"center",dataIndex:"step",render:function(e){return c.a.createElement(C,{step:e,stepList:y,onChange:function(){return S(e)}})}}],t=[];w.forEach((function(a,n){var r=a.date,o=a.items1,i=void 0===o?[]:o,l=a.items2,s=void 0===l?[]:l,d=a.items3,g=void 0===d?[]:d,p=a.items4,u=void 0===p?[]:p,m=a.items5,v=void 0===m?[]:m,f=a.items6,y=void 0===f?[]:f,h=a.items7,w=void 0===h?[]:h;e.push({title:c.a.createElement(D,{title:b()(r).format("YYYY-MM-DD"),onChangeDate:L}),align:"center",dataIndex:"date".concat(n+1),render:function(e){return c.a.createElement(I,{data:e})}}),0===n?t.push({step:"step1",date1:i},{step:"step2",date1:s},{step:"step3",date1:g},{step:"step4",date1:u},{step:"step5",date1:v},{step:"step6",date1:y},{step:"step7",date1:w}):(t[0]["date".concat(n+1)]=i,t[1]["date".concat(n+1)]=s,t[2]["date".concat(n+1)]=g,t[3]["date".concat(n+1)]=u,t[4]["date".concat(n+1)]=v,t[5]["date".concat(n+1)]=y,t[6]["date".concat(n+1)]=w)})),e.push({title:function(){return c.a.createElement(D,{title:"right",onChangeDate:L})},width:60,align:"center",dataIndex:"right",render:function(){return""}}),B(e),N(t.filter((function(e){var t=y.find((function(t){return t.step===e.step}));return t.checked})))}),[w,L,S,y]),c.a.createElement("div",{className:k.a.staggingCalendar},c.a.createElement("div",{className:k.a.stepBox},"IPO\u6b65\u9aa4\u663e\u793a\uff08\u591a\u9009\uff09\uff1a",y.map((function(e){return c.a.createElement(v["a"],{key:e.step,checked:e.checked,onChange:function(t){return S(e.step,t.target.checked)}},e.text)}))),c.a.createElement("div",{className:k.a.actionbar},c.a.createElement("div",{className:k.a.legend},c.a.createElement("div",{className:k.a.legendItem,style:{color:"#6D93FF"}},c.a.createElement("div",{className:k.a.legandTag,style:{backgroundColor:"#6D93FF"}}),"\u53c2\u4e0e\u4e2d"),c.a.createElement("div",{className:k.a.legendItem,style:{color:"#FB560A"}},c.a.createElement("div",{className:k.a.legandTag,style:{backgroundColor:"#FB560A"}}),"\u53ef\u53c2\u4e0e"),c.a.createElement("div",{className:k.a.legendItem,style:{color:"#9B9B9B"}},c.a.createElement("div",{className:k.a.legandTag,style:{backgroundColor:"#9B9B9B"}}),"\u672a\u53c2\u4e0e")),c.a.createElement("div",{className:k.a.datePicker},"\u67e5\u770b\uff1a",c.a.createElement(g["a"],{style:{width:"200px"},onChange:L})),c.a.createElement("div",{className:k.a.searchForm},"\u6807\u7684\u67e5\u8be2\uff1a",c.a.createElement(s["a"],{allowClear:!0,labelInValue:!0,showSearch:!0,showArrow:!1,placeholder:"\u8bf7\u8f93\u5165\u6807\u7684",style:{width:"200px"},filterOption:!1,notFoundContent:n?c.a.createElement(d["a"],{size:"small"}):"\u6682\u65e0\u6570\u636e",options:i,onSearch:F,onChange:A}))),c.a.createElement(l["a"],{loading:a,pagination:!1,rowKey:function(e){return e.step},columns:Y,dataSource:M}))},B=Object(f["b"])((function(e){var t=e.staggingOverview,a=e.loading;return{isSearch:a.effects["staggingOverview/getStockByKeyword"],calendarLoading:a.effects["staggingOverview/getCalendarData"],staggingOverview:t}}))(Y),T=(a("/zsF"),a("PArb")),j=(a("+L6B"),a("2/Rp")),M=(a("5NDa"),a("5rEg")),N=a("9og8"),S=(a("y8nQ"),a("Vl3Y")),L=a("WmNS"),F=a.n(L),A=a("2XLT"),U=a("sOU6"),V=a.n(U),q=s["a"].Option,z=[{type:1,text:"\u5e02\u503c\u5224\u65ad"},{type:2,text:"\u6750\u6599\u63d0\u4ea4"},{type:3,text:"\u8be2\u4ef7"},{type:4,text:"\u8be2\u4ef7\u590d\u6838"},{type:5,text:"\u53d1\u884c\u516c\u544a"},{type:6,text:"\u7533\u8d2d"},{type:7,text:"\u7533\u8d2d\u590d\u6838"},{type:8,text:"\u516c\u5e03\u4e2d\u7b7e"},{type:9,text:"\u7f34\u6b3e\u65e5"},{type:10,text:"\u4e0a\u5e02"}],K=function(e){var t=e.dispatch,a=e.isSearch,n=e.staggingOverview,r=n.searchOptions,i=n.selectedDate,l=S["a"].useForm(),p=Object(m["a"])(l,1),v=p[0],f=Object(o["useState"])([]),y=Object(m["a"])(f,2),h=y[0],w=y[1],E=Object(o["useMemo"])((function(){var e=function(e){t({type:"staggingOverview/updateModelData",payload:{searchOptions:[]}}),t({type:"staggingOverview/getStockByKeyword",payload:{keyword:e}})};return x()(e,800)}),[t]),O=Object(o["useCallback"])(Object(N["a"])(F.a.mark((function e(){var a,n,o,c,l,s,d,g,p;return F.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return a=v.getFieldsValue(),n=a.stock,o=a.processType,c=a.remarks,l=a.managerUserId,s=a.endTime,d=n.value,g=r.find((function(e){return e.value===d})).securityAbbr,e.next=6,t({type:"staggingOverview/createTodo",payload:{secuCode:d,securityAbbr:g,remarks:c,processType:o,managerUserId:l,endTime:b()(s).format("YYYY-MM-DD")}});case 6:p=e.sent,1008===p.code?(u["default"].success("\u6dfb\u52a0\u5f85\u529e\u6210\u529f"),t({type:"staggingOverview/getTodoListByDate",payload:{date:i}})):u["default"].error(p.message);case 8:case"end":return e.stop()}}),e)}))),[t,v,r,i]);return Object(o["useEffect"])((function(){t({type:"accountInfo/querySelectAllUser",payload:{pageSize:9999999},callback:function(e){1008===e.code&&e.data&&w(e.data.list||[])}})}),[t]),c.a.createElement(S["a"],{form:v,name:"create_todo_form",layout:"inline",onFinish:O},c.a.createElement(S["a"].Item,{name:"stock",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u6807\u7684"}]},c.a.createElement(s["a"],{allowClear:!0,labelInValue:!0,showSearch:!0,showArrow:!1,placeholder:"\u8bf7\u9009\u62e9\u6807\u7684",style:{width:"200px"},filterOption:!1,notFoundContent:a?c.a.createElement(d["a"],{size:"small"}):null,options:r.filter((function(e){return 3!==e.apply})),onSearch:E})),c.a.createElement(S["a"].Item,{name:"processType",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u4e8b\u9879"}]},c.a.createElement(s["a"],{style:{width:130},placeholder:"\u8bf7\u9009\u62e9\u4e8b\u9879"},z.map((function(e,t){return c.a.createElement(q,{key:t,value:e.type},e.text)})))),c.a.createElement(S["a"].Item,{name:"remarks",rules:[{required:!0,message:"\u8bf7\u8f93\u5165\u5907\u6ce8"}]},c.a.createElement(M["a"],{style:{width:300},placeholder:"\u8bf7\u8f93\u5165\u5907\u6ce8"})),c.a.createElement(S["a"].Item,{name:"managerUserId",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u901a\u77e5\u4eba"}]},c.a.createElement(s["a"],{showSearch:!0,style:{width:130},placeholder:"\u8bf7\u9009\u62e9\u901a\u77e5\u4eba",optionFilterProp:"children",filterOption:function(e,t){return t.children.toLowerCase().indexOf(e.toLowerCase())>=0}},h.map((function(e,t){return c.a.createElement(q,{key:t,value:e.managerUserId},e.userName)})))),c.a.createElement(S["a"].Item,{name:"endTime",rules:[{required:!0,message:"\u8bf7\u9009\u62e9\u622a\u6b62\u65f6\u95f4"}]},c.a.createElement(g["a"],null)),c.a.createElement(S["a"].Item,null,c.a.createElement(j["a"],{type:"primary",htmlType:"submit"},"\u589e\u52a0\u5f85\u529e")))},P=Object(f["b"])((function(e){var t=e.staggingOverview,a=e.loading;return{isSearch:a.effects["staggingOverview/getStockByKeyword"],staggingOverview:t}}))(K),W=function(e){var t=e.dispatch,a=e.tableLoading,n=e.createLoading,r=e.updateLoading,i=e.staggingOverview,s=i.todoBaseDate,d=i.selectedDate,v=i.todoDateList,y=i.todoList,h=Object(o["useState"])(!1),w=Object(m["a"])(h,2),E=w[0],x=w[1],O=function(e){t({type:"staggingOverview/updateModelData",payload:{selectedDate:e}})},k=Object(o["useCallback"])((function(e){x(!1),t({type:"staggingOverview/updateModelData",payload:{selectedDate:e.format("YYYY-MM-DD"),todoBaseDate:e.format("YYYY-MM-DD")}})}),[t]),D=Object(o["useCallback"])(function(){var e=Object(N["a"])(F.a.mark((function e(a){var n;return F.a.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,t({type:"staggingOverview/updateTodo",payload:{id:a.id}});case 2:n=e.sent,1008===n.code?(u["default"].success("\u5904\u7406\u6210\u529f"),t({type:"updateModelData",payload:{todoList:Object(p["a"])(y).map((function(e){return e.id===a.id&&(e.handleStatus=1),e}))}})):u["default"].error(n.message);case 4:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),[t,y]),C=function(e){var t=e.secuCode;f["c"].push({pathname:"/staggingTool/overView/stock/".concat(t)})},I=[{title:"\u6807\u7684\u540d\u79f0",align:"center",dataIndex:"securityAbbr"},{title:"\u4e8b\u9879\u540d\u79f0",align:"center",dataIndex:"processType",render:function(e){return z.find((function(t){return t.type===e})).text}},{title:"\u622a\u6b62\u65f6\u95f4",align:"center",dataIndex:"endTime",render:function(e){return b()(e).format("YYYY-MM-DD")}},{title:"\u4e8b\u9879\u6765\u6e90",align:"center",dataIndex:"sourceName"},{title:"\u901a\u77e5\u4eba",align:"center",dataIndex:"managerUserName"},{title:"\u5907\u6ce8",align:"center",dataIndex:"remarks"},{title:"\u5904\u7406",align:"center",dataIndex:"handleStatus",width:200,render:function(e,t){return 0===e?c.a.createElement(c.a.Fragment,null,c.a.createElement("span",{className:V.a.isActive,onClick:function(){return D(t)}},"\u6807\u4e3a\u5df2\u5904\u7406 \u221a"),c.a.createElement(T["a"],{type:"vertical"}),c.a.createElement("span",{className:V.a.isActive,onClick:function(){return C(t)}},"\u53bb\u5904\u7406 -\u203a")):c.a.createElement(c.a.Fragment,null,c.a.createElement("span",null,"\u5df2\u5904\u7406 \u221a"),c.a.createElement(T["a"],{type:"vertical"}),c.a.createElement("span",null,"\u53bb\u5904\u7406 -\u203a"))}}];return Object(o["useEffect"])((function(){var e=Object(p["a"])(Array(5)).map((function(e,t){return{date:b()(s).add(t-2,"d").format("YYYY-MM-DD")}}));t({type:"staggingOverview/updateModelData",payload:{todoDateList:e}})}),[t,s]),Object(o["useEffect"])((function(){t({type:"staggingOverview/getTodoListByDate",payload:{date:d}})}),[t,d]),c.a.createElement("div",{className:V.a.todoList},c.a.createElement("div",{className:V.a.calendar},c.a.createElement("div",{style:{position:"relative",marginBottom:"12px"}},c.a.createElement(A["a"],{className:V.a.calendarIcon,style:{cursor:"pointer"},onClick:function(){return x(!E)}}),c.a.createElement(g["a"],{open:E,format:"YYYY-MM-DD",style:{position:"absolute",top:"10px",left:0,right:0,visibility:"hidden"},onChange:k})),c.a.createElement("ul",null,v.map((function(e,t){return c.a.createElement("li",{key:e.date,className:e.date===d?V.a.active:"",onClick:function(){return O(e.date)}},e.date)})))),c.a.createElement("div",{className:V.a.tableBox},c.a.createElement(l["a"],{rowKey:"id",loading:a||n||r,scroll:{y:260},columns:I,dataSource:y,pagination:!1}),c.a.createElement(P,null)))},R=Object(f["b"])((function(e){var t=e.staggingOverview,a=e.loading;return{tableLoading:a.effects["staggingOverview/getTodoListByDate"],createLoading:a.effects["staggingOverview/createTodo"],updateLoading:a.effects["staggingOverview/updateTodo"],staggingOverview:t}}))(W),J=r["a"].TabPane,Q=[{key:1,tab:"\u6253\u65b0\u65e5\u5386",component:B},{key:2,tab:"\u5f53\u65e5\u5f85\u529e",component:R}],Z=function(){return c.a.createElement(i["a"],null,c.a.createElement(n["a"],null,c.a.createElement(r["a"],null,Q.map((function(e){return c.a.createElement(J,{tab:e.tab,key:e.key},c.a.createElement(e.component,null))})))))};t["default"]=Z},"7hA3":function(e,t,a){e.exports={staggingCalendar:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-staggingCalendar",theadIconWrapper:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-theadIconWrapper",theadIconBox:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-theadIconBox",thead:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-thead",today:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-today",tableCell:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-tableCell",tableCellItem:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-tableCellItem",stepCell:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-stepCell",available:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-available",stepText:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-stepText",stepBox:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-stepBox",actionbar:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-actionbar",legend:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-legend",legendItem:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-legendItem",legandTag:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-legandTag",searchForm:"antd-pro-pages-stagging-tool-over-view-components-calendar-index-searchForm"}},sOU6:function(e,t,a){e.exports={todoList:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-todoList",calendar:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-calendar",active:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-active",calendarIcon:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-calendarIcon",tableBox:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-tableBox",isActive:"antd-pro-pages-stagging-tool-over-view-components-todo-list-index-isActive"}}}]);