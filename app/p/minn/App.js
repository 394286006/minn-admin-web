/**
* @auth:minn
* @qq:394286006
*/
import React from 'react'
import ReactDOM from 'react-dom';
import {Link,Router} from 'react-router';
import {Treebeard} from 'react-treebeard';
import {Layout, LayoutSplitter} from 'react-flex-layout';
import MainConstant from './utils/MainConstant';
import UserLogin from './security/UserLogin';
import Menubar from './components/Menubar';
import MinnUtil from './utils/MinnUtil';
import { Panel,ButtonToolbar,Button,Modal,Grid,Row,Col,Well, } from 'react-bootstrap';
var history;
class App extends React.Component {
 constructor(props) {
    super(props);
    this.minnUtil=MinnUtil.getInstance(document);
    $( document ).on( 'loginCompleteEvent', this.loginCompleteEventHandler);
    $( document ).on( 'logoutCompleteEvent', this.logoutCompleteEventHandler);
    $( document ).on( 'invokeGetPrivateMenuCompleteEvent', this.invokeAppTreeMenu);
    history=props.history;
  }

  componentDidMount() {
    $('#menu_sys_div').on("click.jstree", function (e, data) {
        var nodes= $('#menu_sys_div').jstree(true).get_selected(true);
         let url=nodes[0].original.url;
         if(url!=='systemmng'&&url.indexOf('/')>0){
           let ps=url.split('/');
           go('/'+ps[ps.length-2]);
          }
    });   
  }

  loginCompleteEventHandler(event,param){
    if(param!=null){
       $( '#context' ).show();

       $( '#userlogin' ).hide();
    }else{
       $( '#context' ).hide();
       $( '#userlogin' ).show();
    }
  }
  logoutCompleteEventHandler(event,param){
       $( '#context' ).hide();
       $( '#userlogin' ).show();

  }
   
 invokeAppTreeMenu(event,treeData){ 
     $('#menu_sys_div').empty();
     $('#menu_sys_div').removeAttr('class');
     $('#menu_sys_div').removeAttr('role');
     $('#menu_sys_div').jstree({ 'core' : {'data' :treeData.data} ,data:true});
  }

  render() {
    return (
      <div>
      	<div id='context' style={{display:'none'}}>
            <Menubar history={this.props.history} />
             <table><td width='280px' >
                <Panel header={this.minnUtil.get('main_sys_menu')} bsStyle="info" className="modal-container">
                   <Well id="menu_sys_div" className="welllabel">
                  </Well>
                </Panel>
             </td><td width='80%'>{this.props.children}</td></table>
         </div>
         <Link id='action_id' style={{display:'none'}} to={MainConstant.app+'/account'} ></Link>
           <div id='userlogin' style={{display:'none'}}>
               <UserLogin/>
          </div>
       </div>
    );
  }
}

export default App;

 function go(path){
  history.push(MainConstant.app+path);
  }
