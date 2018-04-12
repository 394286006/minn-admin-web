/**
* @auth:minn
* @qq:394286006
*/
import React from 'react'
import ReactDOM from 'react-dom';
import {Link,Router} from 'react-router';
import MainConstant from './utils/MainConstant';
import UserLogin from './security/UserLogin';
import Menubar from './components/Menubar';
import MinnUtil from './utils/MinnUtil';
import {Tabs,Tab,DynamicTabBadge} from 'react-draggable-tab';
import { Panel,ButtonToolbar,Button,Modal,Grid,Row,Col,Well } from 'react-bootstrap';
import Home from './components/Home';
import ah from 'ajax-hook';
var history;
const tabsClassNames = {
  tabWrapper: 'primary',
  tabBar: 'primary',
  tab:      'primary',
  tabTitle: 'sty1',
  tabCloseIcon: 'tabCloseIcon'
};

const tabsStyles = {
  tabWrapper: {marginTop: '-10px'},
  tabBar: {},
  tab:{},
  tabTitle: {},
  tabCloseIcon: {},
  tabBefore: {},
  tabAfter: {}
};
class App extends React.Component {
 constructor(props) {
    super(props);
    this.minnUtil=MinnUtil.getInstance(document);
    $( document ).on( 'loginCompleteEvent', this.loginCompleteEventHandler);
    $( document ).on( 'logoutCompleteEvent', this.logoutCompleteEventHandler);
    $( document ).on( 'invokeGetPrivateMenuCompleteEvent', this.invokeAppTreeMenu);
    history=props.history;
    this.menuKey={};
     let icon = (<image src='assets/close.png' style={{height:'13px'}}/>);
    this.state = {
      tabs:[
        (<Tab key={'tab_0'} title={this.minnUtil.get('main_home')} disableClose={true} >
          <div style={{marginTop:'16px',width:'100%'}}>
            <Home style={{width:'80%'}}/>
          </div>
        </Tab>)
      ],
      badgeCount: 0
    };
  }

  componentDidMount() {
    $('#menu_sys_div').on("click.jstree", function (e, data) {
        var nodes= $('#menu_sys_div').jstree(true).get_selected(true);
        if(nodes.length>0){
          let url=nodes[0].original.url;
          if(url!=='systemmng'&&url.indexOf('/')>0){
           let ps=url.split('/');
           go('/'+ps[ps.length-2],nodes[0].original.id,nodes[0].original.text);
          }
        }
    });   
    $( ".rdTabAddButton" ).remove();
  }

  loginCompleteEventHandler(event,param){
    if(param!=null){
       $( '#context' ).show();
       $( '#userlogin' ).hide();
      ah.hookAjax({
        open:function(arg){
          if(arg[1].indexOf('?')!=-1){
            arg[1]+="&accessKey="+param.accessKey+'&secretKey='+param.secretKey+'&id='+param.id+'&userName='+param.username;
          }else{
            arg[1]+="?accessKey="+param.accessKey+'&secretKey='+param.secretKey+'&id='+param.id+'&userName='+param.username;
          }
        }
       });

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

  componentWillReceiveProps(nextProps) {
    if(nextProps.location.state==null||nextProps.location.state.type!='systemmng'){
      return;
    }
    const key = 'tab_' + nextProps.location.state.id;
    if(this.menuKey[key]==undefined||this.menuKey[key]=='undefined'){
      this.menuKey[key]=nextProps.children;
      let newTab = (<Tab key={key}  title={nextProps.location.state.title}><div id={key} style={{marginTop:'16px',width:'100%'}}>{nextProps.children}</div></Tab>);
      let currentTabs=this.state.tabs;
      let newTabs = currentTabs.concat([newTab]);
      this.setState({tabs: newTabs,selectedTab: key});
    }else{
      this.setState({selectedTab: key});
    }
  }

  handleTabSelect(e, key, currentTabs) {
    this.setState({selectedTab: key, tabs: currentTabs});
  }
 
  handleTabClose(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
    this.menuKey[key]=undefined;
  }
 
  handleTabPositionChange(e, key, currentTabs) {
    this.setState({tabs: currentTabs});
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
             </td><td width='80%'>
                <Tabs
                    tabsClassNames={tabsClassNames}
                    tabsStyles={tabsStyles}
                    selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab_0"}
                    onTabSelect={this.handleTabSelect.bind(this)}
                    onTabClose={this.handleTabClose.bind(this)}
                    onTabPositionChange={this.handleTabPositionChange.bind(this)}
                    tabs={this.state.tabs}
                    shortCutKeys={
                      {
                        'close': ['alt+command+w', 'alt+ctrl+w'],
                        'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
                        'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
                      }
                    }/>
         
         </td></table>
         </div>
           <div id='userlogin' style={{display:'none'}}>
               <UserLogin/>
          </div>
       </div>
    );
  }
}

export default App;

 function go(path,id,title){
  var data={type:'systemmng',id:id,title:title};
  var gpath = {
      pathname:path,
      state:data,
    }
  history.push(gpath);
}
