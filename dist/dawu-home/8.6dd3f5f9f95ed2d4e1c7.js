(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{"648H":function(e,n,t){"use strict";var o=t("CcnG"),r=t("nPNc"),c=t("s/lM"),i=t("+J3Q"),a=t("LvDl"),s=t("5tJd"),u=function(){function e(){this.filterStr="",this.selectedResourceIdChange=new o.n,this.selectedResourceIdsChange=new o.n,this.resourceIds=new Set,this.fileGroup=s.b.createWithRoot("ROOT"),this.rootFileId="ROOT"}return e.prototype.ngOnChanges=function(e){e.resources&&this.onResourcesChanges(this.resources),e.selectedResourceId&&!this.selectedResourceIds&&(this.resourceIds=this.selectedResourceId?new Set([this.selectedResourceId]):new Set),e.selectedResourceIds&&this.selectedResourceIds&&(this.resourceIds=new Set(this.selectedResourceIds))},e.prototype.onResourcesChanges=function(e){var n=Object(a.map)(e,(function(e){return Object.assign(new s.a,{id:e.id,label:e.label||e.id})}));this.fileGroup.setRootChildren(n)},e.prototype.onSelectedFileIdsChange=function(e){this.isMultiSelect&&this.selectedResourceIdsChange.emit(e);var n=Array.from(e||[])[0];this.selectedResourceIdChange.emit(n)},e}(),l=o.qb({encapsulation:0,styles:[["[_nghost-%COMP%]{height:100%;width:100%}[_nghost-%COMP%]   dwu-file-explorer[_ngcontent-%COMP%]{display:flex;height:100%;width:100%}"]],data:{}});function d(e){return o.Nb(0,[(e()(),o.sb(0,0,null,null,2,"dwu-file-explorer",[],null,[[null,"filesByIdChange"],[null,"closedFileIdsChange"],[null,"selectedFileIdsChange"]],(function(e,n,t){var o=!0,r=e.component;return"filesByIdChange"===n&&(o=!1!==(r.fileGroup.filesById=t)&&o),"closedFileIdsChange"===n&&(o=!1!==r.fileGroup.setClosedFileIds(t)&&o),"selectedFileIdsChange"===n&&(o=!1!==r.onSelectedFileIdsChange(t)&&o),o}),r.b,r.a)),o.Ib(512,null,c.c,c.c,[[2,c.d]]),o.rb(2,4898816,null,0,i.a,[c.c,o.k],{rootFileId:[0,"rootFileId"],fuzzFilterString:[1,"fuzzFilterString"],filesById:[2,"filesById"],closedFileIds:[3,"closedFileIds"],selectedFileIds:[4,"selectedFileIds"],perfMode:[5,"perfMode"],multiFileSelect:[6,"multiFileSelect"]},{filesByIdChange:"filesByIdChange",closedFileIdsChange:"closedFileIdsChange",selectedFileIdsChange:"selectedFileIdsChange"})],(function(e,n){var t=n.component;e(n,2,0,t.fileGroup.rootFileId,t.filterStr,t.fileGroup.filesById,t.fileGroup.closedFileIds,t.resourceIds,!0,t.isMultiSelect)}),null)}var g=t("Ip0R");t("Jtcz"),t("yGQT"),t.d(n,"a",(function(){return b})),t.d(n,"b",(function(){return f}));var b=o.qb({encapsulation:0,styles:[["[_nghost-%COMP%]{height:100%;width:100%}"]],data:{}});function f(e){return o.Nb(0,[(e()(),o.sb(0,0,null,null,2,"dwu-resource-selector",[["class","file-explorer"]],null,[[null,"selectedResourceIdChange"],[null,"selectedResourceIdsChange"]],(function(e,n,t){var o=!0,r=e.component;return"selectedResourceIdChange"===n&&(o=!1!==r.onSelectedImageSourceIdChange(t)&&o),"selectedResourceIdsChange"===n&&(o=!1!==r.onSelectedResourceIdsChange(t)&&o),o}),d,l)),o.rb(1,573440,null,0,u,[],{resources:[0,"resources"],filterStr:[1,"filterStr"],selectedResourceId:[2,"selectedResourceId"],isMultiSelect:[3,"isMultiSelect"],selectedResourceIds:[4,"selectedResourceIds"]},{selectedResourceIdChange:"selectedResourceIdChange",selectedResourceIdsChange:"selectedResourceIdsChange"}),o.Fb(131072,g.b,[o.h])],(function(e,n){var t=n.component;e(n,1,0,o.Mb(n,1,0,o.Db(n,2).transform(t.resourceList$)),t.filterStr,t.selectedResourceId,t.isMultiSelect,t.selectedResourceIds)}),null)}},"8oDX":function(e,n,t){"use strict";t.r(n);var o=t("CcnG"),r=function(){return function(){}}(),c=t("Vxrp"),i=t("pMnS"),a=t("l0ih"),s=t("iUGO"),u=t("yGQT"),l=t("ZYCi"),d=t("6+7j"),g=t("sjqh"),b=t("648H"),f=t("Jtcz"),O=t("Ip0R"),h=t("YZbJ"),p=t("ssbT"),C=function(){function e(e,n,t){var o=this;this.store=e,this.router=n,this.activatedRoute=t,this.filterStr="",this.leftSideExpanded=!1,this.imageSourcesConfig={path:"imageSources"},this.user$=this.store.pipe(Object(u.B)(h.d)),this.selectedImageSourceId$=this.store.pipe(Object(u.B)(p.f)),this.loadInUrlState(this.router.url),this.sub=this.router.events.subscribe((function(e){e instanceof l.d&&o.loadInUrlState(e.url)}))}return e.prototype.onSelectedImageSourceIdChange=function(e){var n=this.router.createUrlTree([e],{relativeTo:this.activatedRoute});this.store.dispatch(p.a.navigateToImageSourceView({payload:n.toString()}))},e.prototype.loadInUrlState=function(e){var n=e.split("/"),t=n.indexOf("image-sources"),o=t+1,r=n[t+2];this.store.dispatch(p.a.setSelectedImageSourceId({payload:"intro"===n[o]?void 0:n[o]})),this.store.dispatch(p.a.setImageSourceViewTab({payload:r}))},e}(),_=o.qb({encapsulation:0,styles:[["[_nghost-%COMP%]{display:block;height:100%;width:100%}@media screen and (max-width:750px){[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]{flex-direction:column}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]{box-shadow:2px 2px 4px 0 #9d9b99;flex:0 0 auto;height:13.25rem;width:100%;max-width:none;transition:height 50ms}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side.expanded[_ngcontent-%COMP%]{height:75%}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]{background-color:#3f4038;color:#fcfcf9;position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:3.5rem;height:1rem;border:1px solid #8a9a5b;border-radius:5px 5px 0 0;text-align:center;display:flex;justify-content:center;cursor:pointer}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#4b5320;color:#fcfcf9}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]   .expander-icon[_ngcontent-%COMP%]{font-size:16px}[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]   .expander-icon.flipped[_ngcontent-%COMP%]{transform:rotate(180deg)}}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]{flex-direction:column}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]{box-shadow:2px 2px 4px 0 #9d9b99;flex:0 0 auto;height:13.25rem;width:100%;max-width:none;transition:height 50ms}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side.expanded[_ngcontent-%COMP%]{height:75%}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]{background-color:#3f4038;color:#fcfcf9;position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:3.5rem;height:1rem;border:1px solid #8a9a5b;border-radius:5px 5px 0 0;text-align:center;display:flex;justify-content:center;cursor:pointer}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#4b5320;color:#fcfcf9}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]   .expander-icon[_ngcontent-%COMP%]{font-size:16px}.narrow-mode[_nghost-%COMP%]   div.page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]   .expander-icon.flipped[_ngcontent-%COMP%]{transform:rotate(180deg)}[_nghost-%COMP%]   .page-container[_ngcontent-%COMP%]{height:100%;width:100%;display:flex}[_nghost-%COMP%]   .page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]{position:relative;flex:1 1 0;overflow:hidden;max-width:27.5%;min-width:20rem}[_nghost-%COMP%]   .page-container[_ngcontent-%COMP%]   .left-side[_ngcontent-%COMP%]   .expander[_ngcontent-%COMP%]{display:none}[_nghost-%COMP%]   .page-container[_ngcontent-%COMP%]   .right-side[_ngcontent-%COMP%]{flex:1 1 0;overflow:auto;position:relative}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]{background-color:#ddd9cf;display:flex;flex-direction:column}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .explorer-title[_ngcontent-%COMP%]{text-align:center;font-size:1.25rem;padding-top:.5rem}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]{flex:0 0 auto;display:flex;align-items:center}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .wide-button-container[_ngcontent-%COMP%]{flex:1 1 0}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]{background-color:#eae6da;min-width:2rem;padding:.25rem .5rem;font-size:1rem;cursor:pointer;text-align:center;outline:0;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#bac39f}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .control-button.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .control-button[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .wide-button[_ngcontent-%COMP%]{flex:1 1 0;background-color:#eae6da;min-width:2rem;padding:.25rem .5rem;font-size:1rem;cursor:pointer;text-align:center;outline:0;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .wide-button[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#bac39f}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .wide-button.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .wide-button[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .icon-button[_ngcontent-%COMP%]{flex:0 0 auto;background-color:#eae6da;min-width:2rem;padding:.25rem .5rem;font-size:1rem;cursor:pointer;text-align:center;outline:0;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none;height:26px;display:flex;align-items:center}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .icon-button[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#bac39f}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .icon-button.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .icon-button[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .control-buttons[_ngcontent-%COMP%]   .icon-button[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%]{font-size:1rem}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .file-explorer[_ngcontent-%COMP%]{flex:1 1 0}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .view-tab[_ngcontent-%COMP%]{background-color:#eae6da;min-width:2rem;padding:.25rem 1rem;font-size:1rem;cursor:pointer;text-align:center;outline:0;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .view-tab[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#bac39f}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .view-tab.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   .left-side[_ngcontent-%COMP%]   .view-tab[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}"]],data:{}});function m(e){return o.Nb(0,[(e()(),o.sb(0,0,null,null,21,"div",[["class","page-container"]],null,null,null,null,null)),(e()(),o.sb(1,0,null,null,17,"div",[["class","left-side"]],[[2,"expanded",null]],null,null,null,null)),(e()(),o.sb(2,0,null,null,11,"div",[["class","control-buttons"]],null,null,null,null,null)),(e()(),o.sb(3,0,null,null,1,"dwu-resource-create-button",[["class","wide-button-container"]],null,null,null,a.b,a.a)),o.rb(4,49152,null,0,s.a,[u.n],{resourceConfig:[0,"resourceConfig"],buttonLabel:[1,"buttonLabel"]},null),(e()(),o.sb(5,0,null,null,8,"div",[["class","icon-button"]],null,[[null,"click"]],(function(e,n,t){var r=!0;return"click"===n&&(r=!1!==o.Db(e,6).onClick()&&r),r}),null,null)),o.rb(6,16384,[[1,4]],0,l.m,[l.l,l.a,[8,null],o.D,o.k],{routerLink:[0,"routerLink"]},null),o.Eb(7,1),o.rb(8,1720320,null,2,l.n,[l.l,o.k,o.D,[2,l.m],[2,l.o]],{routerLinkActive:[0,"routerLinkActive"]},null),o.Jb(603979776,1,{links:1}),o.Jb(603979776,2,{linksWithHrefs:1}),o.Eb(11,1),(e()(),o.sb(12,0,null,null,1,"span",[["class","material-icons"]],null,null,null,null,null)),(e()(),o.Lb(-1,null,["help"])),(e()(),o.sb(14,0,null,null,1,"dwu-search-input",[],null,[[null,"searchTextChange"]],(function(e,n,t){var o=!0;return"searchTextChange"===n&&(o=!1!==(e.component.filterStr=t)&&o),o}),d.b,d.a)),o.rb(15,49152,null,0,g.a,[],{searchText:[0,"searchText"],placeholder:[1,"placeholder"]},{searchTextChange:"searchTextChange"}),(e()(),o.sb(16,0,null,null,2,"dwu-resource-list-view",[],null,[[null,"selectedResourceIdChange"]],(function(e,n,t){var o=!0;return"selectedResourceIdChange"===n&&(o=!1!==e.component.onSelectedImageSourceIdChange(t)&&o),o}),b.b,b.a)),o.rb(17,704512,null,0,f.a,[u.n],{resourceConfig:[0,"resourceConfig"],filterStr:[1,"filterStr"],selectedResourceId:[2,"selectedResourceId"]},{selectedResourceIdChange:"selectedResourceIdChange"}),o.Fb(131072,O.b,[o.h]),(e()(),o.sb(19,0,null,null,2,"div",[["class","right-side"]],null,null,null,null,null)),(e()(),o.sb(20,16777216,null,null,1,"router-outlet",[],null,null,null,null,null)),o.rb(21,212992,null,0,l.q,[l.b,o.O,o.j,[8,null],o.h],null,null)],(function(e,n){var t=n.component;e(n,4,0,t.imageSourcesConfig,"+ New Source");var r=e(n,7,0,"intro");e(n,6,0,r);var c=e(n,11,0,"active");e(n,8,0,c),e(n,15,0,t.filterStr,"search.."),e(n,17,0,t.imageSourcesConfig,t.filterStr,o.Mb(n,17,2,o.Db(n,18).transform(t.selectedImageSourceId$))),e(n,21,0)}),(function(e,n){e(n,1,0,n.component.leftSideExpanded)}))}function S(e){return o.Nb(0,[(e()(),o.Lb(-1,null,[" login\n"]))],null,null)}function I(e){return o.Nb(0,[(e()(),o.hb(16777216,null,null,2,null,m)),o.rb(1,16384,null,0,O.m,[o.O,o.L],{ngIf:[0,"ngIf"],ngIfElse:[1,"ngIfElse"]},null),o.Fb(131072,O.b,[o.h]),(e()(),o.hb(0,[["loginTemplate",2]],null,0,null,S))],(function(e,n){var t=n.component;e(n,1,0,o.Mb(n,1,0,o.Db(n,2).transform(t.user$)),o.Db(n,3))}),null)}function M(e){return o.Nb(0,[(e()(),o.sb(0,0,null,null,1,"dwu-image-sources",[],null,null,null,I,_)),o.rb(1,49152,null,0,C,[u.n,l.l,l.a],null,null)],null,null)}var P=o.ob("dwu-image-sources",C,M,{},{},[]),v=t("PTyj"),j=t("gIcY"),y=t("0gVX"),T=t("trGy"),R=t("Z2Br"),E=t("xpxz"),w=t("mrSG"),A=t("6blF"),x=t("67Y/"),k=function(){function e(e,n,t,o,r){this.firebaseFunctionsService=e,this.firestore=n,this.storage=t,this.imageProcessing=o,this.exifService=r}return e.prototype.generateImageSourceToken=function(e){return w.__awaiter(this,void 0,void 0,(function(){return w.__generator(this,(function(n){switch(n.label){case 0:return[4,this.firebaseFunctionsService.functions.httpsCallable("generateImageSourceTokenTask")({imageSourceId:e})];case 1:return[2,n.sent()]}}))}))},e.prototype.deleteFile=function(e){return w.__awaiter(this,void 0,void 0,(function(){return w.__generator(this,(function(n){switch(n.label){case 0:return[4,this.storage.deleteFile(e)];case 1:return n.sent(),[4,this.firestore.unregisterFile(e)];case 2:return[2,n.sent()]}}))}))},e.prototype.uploadImageSourceFile=function(e,n,t){return w.__awaiter(this,void 0,void 0,(function(){var o,r,c,i,a,s,u;return w.__generator(this,(function(l){switch(l.label){case 0:return[4,this.exifService.getExifData(e)];case 1:return o=l.sent(),r=this.exifService.getLocationData(o),c={userId:n.uid,fileName:e.name,isUploaded:!1,sourceId:t,locationData:w.__assign({},r)},[4,this.firestore.insertUploadDoc(c)];case 2:return i=l.sent(),a=w.__assign({},c,{id:i.id}),[4,this.imageProcessing.processImageFile(e,o)];case 3:return s=l.sent(),[4,this.storage.uploadFile(s,a.id)];case 4:return[4,l.sent().ref.getDownloadURL()];case 5:return u=l.sent(),[4,this.firestore.registerFileUploaded(a.id,{downloadUrl:u})];case 6:return[2,l.sent()]}}))}))},e.prototype.updateImageSource=function(e,n){return this.firestore.db.collection("imageSources").doc(e).update(n)},e.prototype.loadImageSourceTokens=function(e){var n=this;return A.a.create((function(t){return n.firestore.db.collection("imageSources").doc(e).collection("accessTokens").orderBy("createdAt","desc").onSnapshot(t)})).pipe(Object(x.a)((function(e){return e.docs.map((function(e){return w.__assign({},e.data(),{id:e.id})}))})))},e}(),B=t("QmNs"),F=t("GrFz"),G=t("cxyc"),U=t("YDhq"),D=t("T2NM"),L=t("7bNT"),Y=t("5a0h"),z=t("ntSj"),N=t("O0RR"),$=t("FE7n"),V=t("Rkte"),q=t("mRcA"),Q=t("R7F0"),J=t("a6Df"),W=t("s/lM"),K=t("Fzqc"),X=t("dWZg"),Z=t("qAlS"),H=t("FdjG"),ee=t("mzR0"),ne=t("Wu5v"),te=t("R3e+"),oe=function(){return t.e(28).then(t.bind(null,"YykA")).then((function(e){return e.ImageSourcesIntroModuleNgFactory}))},re=function(){return t.e(37).then(t.bind(null,"9Vr9")).then((function(e){return e.ImageSourceViewModuleNgFactory}))},ce=function(){return function(){}}(),ie=t("3A+F"),ae=t("jG/M"),se=t("Ql0z"),ue=t("W61y");t.d(n,"ImageSourcesModuleNgFactory",(function(){return le}));var le=o.pb(r,[],(function(e){return o.Ab([o.Bb(512,o.j,o.ab,[[8,[c.a,i.a,P,v.b]],[3,o.j],o.w]),o.Bb(4608,O.o,O.n,[o.t,[2,O.A]]),o.Bb(4608,j.r,j.r,[]),o.Bb(135680,y.a,y.a,[o.j,o.g,o.q]),o.Bb(4608,T.a,T.a,[R.a]),o.Bb(4608,E.a,E.a,[R.a]),o.Bb(4608,k,k,[B.a,E.a,F.a,G.a,U.a]),o.Bb(4608,D.a,D.a,[u.n,L.a,E.a,k,l.l,Y.a]),o.Bb(1073742336,O.c,O.c,[]),o.Bb(1073742336,j.q,j.q,[]),o.Bb(1073742336,j.h,j.h,[]),o.Bb(1073742336,z.a,z.a,[]),o.Bb(1073742336,N.a,N.a,[]),o.Bb(1073742336,$.a,$.a,[]),o.Bb(1073742336,V.a,V.a,[]),o.Bb(1073742336,q.a,q.a,[]),o.Bb(1073742336,Q.a,Q.a,[]),o.Bb(1073742336,J.a,J.a,[]),o.Bb(1073742336,W.b,W.b,[]),o.Bb(1073742336,K.a,K.a,[]),o.Bb(1073742336,X.b,X.b,[]),o.Bb(1073742336,Z.h,Z.h,[]),o.Bb(1073742336,H.a,H.a,[]),o.Bb(1073742336,ee.a,ee.a,[]),o.Bb(1073742336,ne.a,ne.a,[]),o.Bb(1073742336,te.a,te.a,[]),o.Bb(1073742336,l.p,l.p,[[2,l.u],[2,l.l]]),o.Bb(1073742336,ce,ce,[]),o.Bb(1073742336,ie.a,ie.a,[]),o.Bb(1073742336,ae.a,ae.a,[]),o.Bb(1024,u.O,(function(){return[{}]}),[]),o.Bb(1024,u.j,(function(){return[{key:"imageSources",reducerFactory:u.s,metaReducers:[],initialState:void 0}]}),[]),o.Bb(1024,u.P,u.W,[o.q,u.O,u.j]),o.Bb(1024,u.N,(function(){return[se.a]}),[]),o.Bb(1024,u.Q,(function(e){return[e]}),[u.N]),o.Bb(1024,u.b,(function(e,n,t){return[u.X(e,n,t)]}),[o.q,u.N,u.Q]),o.Bb(1024,u.U,(function(e){return[u.H(e)]}),[u.T]),o.Bb(1073873408,u.o,u.o,[u.P,u.b,u.g,u.p,[2,u.U]]),o.Bb(1024,L.p,(function(){return[[D.a]]}),[]),o.Bb(1024,L.g,(function(){return[[]]}),[]),o.Bb(1024,L.q,(function(e,n,t){return[L.k(e,n,t)]}),[o.q,L.p,L.g]),o.Bb(1073742336,L.d,L.d,[L.e,L.q,[2,u.p],[2,u.o]]),o.Bb(1073742336,r,r,[]),o.Bb(1024,l.j,(function(){return[[{path:"",component:C,children:[{path:"intro",loadChildren:oe},{path:":imageSourceId",loadChildren:re},{path:"",pathMatch:"full",redirectTo:"intro"}]}],[{path:"auth",component:ue.a},{path:"auth-success",component:ue.a}]]}),[])])}))},Jtcz:function(e,n,t){"use strict";t.d(n,"a",(function(){return u}));var o=t("CcnG"),r=t("26FU"),c=t("15JJ"),i=t("67Y/"),a=t("yGQT"),s=t("RrDs"),u=function(){function e(e){var n=this;this.store=e,this.filterStr="",this.selectedResourceIdChange=new o.n,this.selectedResourceIdsChange=new o.n,this.resourceConfig$=new r.a(void 0),this.resourceList$=this.resourceConfig$.pipe(Object(c.a)((function(e){return n.store.pipe(Object(a.B)(s.b),Object(i.a)((function(n){return n&&n[e.path]})))})))}return e.prototype.ngOnChanges=function(e){if(e.resourceConfig){this.resourceConfig$.next(this.resourceConfig);var n=e.resourceConfig,t=n.currentValue,o=n.previousValue;t&&this.store.dispatch(s.a.addVisibleResourceList({resource:t})),o&&this.store.dispatch(s.a.removeVisibleResourceList({resource:o}))}},e.prototype.ngOnDestroy=function(){this.resourceConfig&&this.store.dispatch(s.a.removeVisibleResourceList({resource:this.resourceConfig}))},e.prototype.onSelectedImageSourceIdChange=function(e){this.selectedResourceIdChange.emit(e)},e.prototype.onSelectedResourceIdsChange=function(e){this.selectedResourceIdsChange.emit(e)},e}()},Ql0z:function(e,n,t){"use strict";t.d(n,"a",(function(){return s}));var o=t("mrSG"),r=t("yGQT"),c=t("YMmn"),i=t("YDRF"),a=Object(r.w)(i.a,Object(r.z)(c.a.setSelectedImageSourceId,(function(e,n){return o.__assign({},e,{selectedImageSourceId:n.payload})})),Object(r.z)(c.a.addImagesBySourceId,(function(e,n){return o.__assign({},e,{imagesBySourceId:o.__assign({},e,n.payload)})})),Object(r.z)(c.a.setImageSourceViewTab,(function(e,n){return o.__assign({},e,{imageSourceViewTab:n.payload})})),Object(r.z)(c.a.generateImageSourceToken,(function(e,n){var t;return o.__assign({},e,{isGeneratingTokenByImageSource:o.__assign({},e.isGeneratingTokenByImageSource,(t={},t[n.payload]=!0,t))})})),Object(r.z)(c.a.generateImageSourceTokenSuccess,(function(e,n){var t;return o.__assign({},e,{isGeneratingTokenByImageSource:o.__assign({},e.isGeneratingTokenByImageSource,(t={},t[n.payload]=!1,t))})})),Object(r.z)(c.a.generateImageSourceTokenFailure,(function(e,n){var t;return o.__assign({},e,{isGeneratingTokenByImageSource:o.__assign({},e.isGeneratingTokenByImageSource,(t={},t[n.payload]=!1,t))})})),Object(r.z)(c.a.loadImageSourceTokensSuccess,(function(e,n){var t;return o.__assign({},e,{imageSourceTokensByImageSource:o.__assign({},e.imageSourceTokensByImageSource,(t={},t[n.imageSourceId]=n.imageSourceTokens,t))})})));function s(e,n){return a(e,n)}},"R3e+":function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var o=function(){return function(){}}()},RrDs:function(e,n,t){"use strict";var o=t("yLDM");t.d(n,"a",(function(){return o.a})),t("dW0t"),t("dYoV");var r=t("rUW/");t.d(n,"b",(function(){return r.a})),t("iKuT")},T2NM:function(e,n,t){"use strict";t.d(n,"a",(function(){return O}));var o=t("mrSG"),r=t("7bNT"),c=t("yGQT"),i=t("F/XL"),a=t("0/uQ"),s=t("/PH2"),u=t("15JJ"),l=t("67Y/"),d=t("9Z1F"),g=t("YMmn"),b=t("nAcS"),f=t("YZbJ"),O=function(){return function(e,n,t,O,h,p){var C=this;this.store$=e,this.actions$=n,this.firestore=t,this.imageSourcesService=O,this.router=h,this.ppService=p,this.loadImagesBySourceId$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.loadImagesBySourceId),Object(s.a)(C.store$.pipe(Object(c.B)(f.d))),Object(u.a)((function(e){var n=o.__read(e,2),t=n[0].payload;return t&&n[1]?C.ppService.getFilesForSource$(t).pipe(Object(l.a)((function(e){var n;return g.a.addImagesBySourceId({payload:(n={},n[t]=e,n)})}))):Object(i.a)(g.a.addImagesBySourceId({payload:{}}))})))})),this.uploadImageSourceFile$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.uploadImageSourceFile),Object(s.a)(C.store$.pipe(Object(c.B)(f.d))),Object(u.a)((function(e){var n=o.__read(e,2),t=n[0],r=n[1],c=t.selectedImageSourceId,s=t.file;return c&&r?Object(a.a)(C.imageSourcesService.uploadImageSourceFile(s,r,c)).pipe(Object(l.a)((function(e){return g.a.uploadImageSourceFileSuccess({selectedImageSourceId:c})}))):Object(i.a)(g.a.uploadImageSourceFileFailure({payload:"no user or source"}))})))})),this.deleteUpload$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.deleteUpload),Object(u.a)((function(e){var n=e.payload;return n?Object(a.a)(C.imageSourcesService.deleteFile(n)).pipe(Object(l.a)((function(e){return g.a.deleteUploadSuccess({payload:n})}))):Object(i.a)(g.a.deleteUploadFailure({payload:"no uploadId"}))})))})),this.navigateToImageSourceView$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.navigateToImageSourceView),Object(s.a)(C.store$.pipe(Object(c.B)(b.b))),Object(l.a)((function(e){var n=o.__read(e,2),t=n[1];return C.router.navigate(o.__spread([n[0].payload],t?[t]:[]))})))}),{dispatch:!1}),this.updateImageSource$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.updateImageSource),Object(u.a)((function(e){var n=e.imageSourceId,t=e.patch;return Object(a.a)(C.imageSourcesService.updateImageSource(n,t)).pipe(Object(l.a)((function(e){return g.a.updateImageSourceSuccess({imageSourceId:n,patch:t})})))})))})),this.generateImageSourceToken$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.generateImageSourceToken),Object(u.a)((function(e){var n=e.payload;return Object(a.a)(C.imageSourcesService.generateImageSourceToken(n)).pipe(Object(l.a)((function(){return g.a.generateImageSourceTokenSuccess({payload:n})})),Object(d.a)((function(){return Object(i.a)(g.a.generateImageSourceTokenFailure({payload:n}))})))})))})),this.loadImageSourceTokens$=Object(r.h)((function(){return C.actions$.pipe(Object(r.j)(g.a.loadImageSourceTokens),Object(u.a)((function(e){var n=e.imageSourceId;return Object(a.a)(C.imageSourcesService.loadImageSourceTokens(n)).pipe(Object(l.a)((function(e){return g.a.loadImageSourceTokensSuccess({imageSourceId:n,imageSourceTokens:e})})))})))}))}}()},Wu5v:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var o=function(){return function(){}}()},YDRF:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var o={imageSourcesListVisible:!1,imageSourcesList:[],selectedImageSourceId:void 0,imagesBySourceId:{},imageSourceViewTab:void 0,isGeneratingTokenByImageSource:{},imageSourceTokensByImageSource:{}}},YMmn:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var o=t("yGQT"),r=function(){function e(){}return e.CATEGORY="[IMAGE_SOURCES]",e.setSelectedImageSourceId=Object(o.u)(e.CATEGORY+" SET_SELECTED_IMAGE_SOURCE_ID",Object(o.A)()),e.loadImagesBySourceId=Object(o.u)(e.CATEGORY+" LOAD_IMAGES_BY_SOURCE_ID",Object(o.A)()),e.addImagesBySourceId=Object(o.u)(e.CATEGORY+" ADD_IMAGES_BY_SOURCE_ID",Object(o.A)()),e.uploadImageSourceFile=Object(o.u)(e.CATEGORY+" UPLOAD_IMAGE_SOURCE_FILE",Object(o.A)()),e.uploadImageSourceFileSuccess=Object(o.u)(e.CATEGORY+" UPLOAD_IMAGE_SOURCE_FILE_SUCCESS",Object(o.A)()),e.uploadImageSourceFileFailure=Object(o.u)(e.CATEGORY+" UPLOAD_IMAGE_SOURCE_FILE_FAILURE",Object(o.A)()),e.deleteUpload=Object(o.u)(e.CATEGORY+" DELETE_UPLOAD",Object(o.A)()),e.deleteUploadSuccess=Object(o.u)(e.CATEGORY+" DELETE_UPLOAD_SUCCESS",Object(o.A)()),e.deleteUploadFailure=Object(o.u)(e.CATEGORY+" DELETE_UPLOAD_FAILURE",Object(o.A)()),e.setImageSourceViewTab=Object(o.u)(e.CATEGORY+" SET_IMAGE_SOURCE_VIEW_TAB",Object(o.A)()),e.navigateToImageSourceView=Object(o.u)(e.CATEGORY+" NAVIGATE_TO_IMAGE_SOURCE_VIEW",Object(o.A)()),e.updateImageSource=Object(o.u)(e.CATEGORY+" UPDATE_IMAGE_SOURCE",Object(o.A)()),e.updateImageSourceSuccess=Object(o.u)(e.CATEGORY+" UPDATE_IMAGE_SOURCE_SUCCESS",Object(o.A)()),e.updateImageSourceFailure=Object(o.u)(e.CATEGORY+" UPDATE_IMAGE_SOURCE_FAILURE",Object(o.A)()),e.generateImageSourceToken=Object(o.u)(e.CATEGORY+" GENERATE_IMAGE_SOURCE_TOKEN",Object(o.A)()),e.generateImageSourceTokenSuccess=Object(o.u)(e.CATEGORY+" GENERATE_IMAGE_SOURCE_TOKEN_SUCCESS",Object(o.A)()),e.generateImageSourceTokenFailure=Object(o.u)(e.CATEGORY+" GENERATE_IMAGE_SOURCE_TOKEN_FAILURE",Object(o.A)()),e.loadImageSourceTokens=Object(o.u)(e.CATEGORY+" LOAD_IMAGE_SOURCE_TOKENS",Object(o.A)()),e.loadImageSourceTokensSuccess=Object(o.u)(e.CATEGORY+" LOAD_IMAGE_SOURCE_TOKENS_SUCCESS",Object(o.A)()),e.loadImageSourceTokensFailure=Object(o.u)(e.CATEGORY+" LOAD_IMAGE_SOURCE_TOKENS_FAILURE",Object(o.A)()),e}()},iUGO:function(e,n,t){"use strict";t.d(n,"a",(function(){return r}));var o=t("RrDs"),r=function(){function e(e){this.store=e,this.buttonLabel="++"}return e.prototype.onCreateResource=function(){this.store.dispatch(o.a.createResourceDoc({resource:this.resourceConfig,patch:{}}))},e}()},l0ih:function(e,n,t){"use strict";var o=t("CcnG");t("iUGO"),t("yGQT"),t.d(n,"a",(function(){return r})),t.d(n,"b",(function(){return c}));var r=o.qb({encapsulation:0,styles:[["[_nghost-%COMP%]{height:100%;width:100%}[_nghost-%COMP%]   .wide-button[_ngcontent-%COMP%]{background-color:#eae6da;min-width:2rem;padding:.25rem .5rem;font-size:1rem;cursor:pointer;text-align:center;outline:0;white-space:nowrap;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:none}[_nghost-%COMP%]   .wide-button[_ngcontent-%COMP%]:hover:not([disabled]){background-color:#bac39f}[_nghost-%COMP%]   .wide-button.active[_ngcontent-%COMP%]:not([disabled]){background-color:#708238;color:#fcfcf9}[_nghost-%COMP%]   .wide-button[disabled][_ngcontent-%COMP%]{pointer-events:none;opacity:.3}"]],data:{}});function c(e){return o.Nb(0,[(e()(),o.sb(0,0,null,null,1,"div",[["class","wide-button"]],null,[[null,"click"]],(function(e,n,t){var o=!0;return"click"===n&&(o=!1!==e.component.onCreateResource()&&o),o}),null,null)),(e()(),o.Lb(1,null,[" ","\n"]))],null,(function(e,n){e(n,1,0,n.component.buttonLabel)}))}},mzR0:function(e,n,t){"use strict";t.d(n,"a",(function(){return o}));var o=function(){return function(){}}()},nAcS:function(e,n,t){"use strict";t.d(n,"f",(function(){return s})),t.d(n,"e",(function(){return u})),t.d(n,"c",(function(){return l})),t.d(n,"b",(function(){return d})),t.d(n,"d",(function(){return b})),t.d(n,"a",(function(){return f}));var o=t("yGQT"),r=t("LvDl"),c=t("RrDs"),i=Object(o.v)("imageSources"),a=(Object(o.y)(i,(function(e){return e.imageSourcesListVisible})),Object(o.y)(c.b,(function(e){return Object(r.keyBy)(e.imageSources,"id")}))),s=Object(o.y)(i,(function(e){return e.selectedImageSourceId})),u=Object(o.y)(a,s,(function(e,n){return e[n]})),l=Object(o.y)(i,(function(e){return e.imagesBySourceId})),d=Object(o.y)(i,(function(e){return e.imageSourceViewTab})),g=Object(o.y)(i,(function(e){return e.isGeneratingTokenByImageSource})),b=Object(o.y)(s,g,(function(e,n){return n[e]})),f=Object(o.y)(i,(function(e){return e.imageSourceTokensByImageSource}))},ssbT:function(e,n,t){"use strict";var o=t("YMmn");t.d(n,"a",(function(){return o.a})),t("T2NM"),t("Ql0z");var r=t("nAcS");t.d(n,"b",(function(){return r.a})),t.d(n,"c",(function(){return r.c})),t.d(n,"d",(function(){return r.d})),t.d(n,"e",(function(){return r.e})),t.d(n,"f",(function(){return r.f})),t("YDRF")}}]);