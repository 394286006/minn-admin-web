import React from 'react';
import Router from 'react-router';
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';  
import AppStore from './p/minn/stores/AppStore';
import MainConstant from './p/minn/utils/MainConstant';
import UserLogin from './p/minn/security/UserLogin';
import jstree from 'jstree';
import d3 from 'd3';
import $ from 'jquery';
window.$ = $ ;
window.jQuery = $ ;
export default $ ;
let history = createBrowserHistory();
MainConstant.currentLocale=(navigator.language || navigator.userLanguage).replace('-','_');
AppStore.init();
function localCallback(messageResource){
     if(messageResource.isLoaded()){
          document.global=AppStore.getInstance().getGlobal(messageResource);
         ReactDOM.render(<Router history={history}>{routes}</Router>,document.getElementById('app'));
      }else{
           console.log('local resource load error!');
      }
};
AppStore.getInstance().getResource(localCallback);
 

