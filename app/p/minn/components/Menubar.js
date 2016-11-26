/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';
import {Link,Router} from 'react-router';
import MenubarStore from '../stores/MenubarStore';
import MenubarAction from '../actions/MenubarAction';
import MainConstant from '../utils/MainConstant';
import MinnUtil from '../utils/MinnUtil';
import {Navbar,Nav,NavItem,NavDropdown,MenuItem} from 'react-bootstrap';
class Menubar extends React.Component {
  constructor(props) {
    super(props);
    this.state = MenubarStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document);
    this.userInfo=null;
    $( document ).on( 'loginCompleteEvent', this.loginCompleteEventHandler);
   
  }
 loginCompleteEventHandler(event,param){
    if(param!=null){
      this.userInfo=param;
       $('#loginName_id').text(this.userInfo.loginName);
        MenubarAction.getPrivateMenu(param.locale.split('_')[0]);
    }
     
  }
  componentDidMount() {
    MenubarStore.listen(this.onChange);
   
    $(document).ajaxStart(() => {
      MenubarAction.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        MenubarAction.updateAjaxAnimation('fadeOut');
      }, 750);
    });
  }

  componentWillUnmount() {
    MenubarStore.unlisten(this.onChange);
  }

  onChange(state) {
    if(state.actionType=='logoutSuccess'){
       this.minnUtil.setLogin(false);
       this.minnUtil.setUserInfo(null);
       state.actionType='';
       this.userInfo=null;
       $(document).trigger( 'logoutCompleteEvent',null);
    }
     if(state.actionType=='getPrivateMenuSuccess'){
        this.invokeGetPrivateMenu(state.privateMenu);
        this.removeMenu();
     }
    state.actionType='';
    this.setState(state);
    
  }

  invokeGetPrivateMenu(menus){
    let type=-1;
    for(let i=0;i<menus.length;i++){
        let type=menus[i].type_v;
        if(type==0){
           let urls=menus[i].url.split('?');
           let ps=urls[0].split('/');
           let pid=ps[ps.length-2];
           if(urls.length>1){
              let params=urls[1].split('&');
              for(let j=0;j<params.length;j++){
                 let kvs=params[j].split('=');
                 pid=pid+'_'+kvs[1];
              }
           }
          $('#'+pid+'_id').text(menus[i].text);
          $('#'+pid+'_id').show();
        }else{
          $('#'+menus[i].url.trim()+'_id').html(menus[i].text);
          this.invokeGetPrivateMenu(menus[i].children);
          $('#'+menus[i].url.trim()+'_id').parent().parent().show();
        }
       
    }
   
  }
    
  removeMenu(){
    //$('a[style="display:none;"]' ).remove();
  }


  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findCharacter({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  handleMenubarExit(selectedKey){
       MenubarAction.logout();
  }

  render() {
               
    return (
      
        <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
          <Link to={MainConstant.app}>
          <span className={'triangles animated ' + this.state.ajaxAnimationClass}>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
            </span>
             {this.minnUtil.get('main_title')}
             </Link>
          </Navbar.Brand>
        </Navbar.Header>

         <Navbar.Collapse >
          <Nav id='privateMenu_id' ref='privateMenu_id_ref'>
          <li><Link to={MainConstant.app+'/'} >{this.minnUtil.get('main_home')}</Link></li>
          <li className='dropdown' style={{display:'none'}}>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'><span id='systemmng_id'></span> <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link id='account_id' style={{display:'none'}} to={MainConstant.app+'/account'}></Link></li>
                <li><Link id='menu_id' style={{display:'none'}} to={MainConstant.app+'/menu'}></Link></li>
                <li><Link id='department_id' style={{display:'none'}} to={MainConstant.app+'/department'}></Link></li>
                <li><Link id='role_id' style={{display:'none'}} to={MainConstant.app+'/role'}></Link></li>
                <li><Link id='dictionary_id' style={{display:'none'}} to={MainConstant.app+'/dic'}></Link></li>
              </ul>
          </li>
          <li className='dropdown' style={{display:'none'}}>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'><span id='logmng_id'></span> <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link id='log_id' style={{display:'none'}} to={MainConstant.app+'/log'}></Link></li>
              </ul>
          </li>
          <li className='dropdown' style={{display:'none'}}>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'><span id='querymng_id'></span> <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link id='query_privilege_getConfigMenu_id' style={{display:'none'}} to={MainConstant.app+'/picture'}></Link></li>
                <li><Link id='query_privilege_getConfigRole_id' style={{display:'none'}} to={MainConstant.app+'/hadoopspark'}></Link></li>
              </ul>
          </li>
         
          <li className='dropdown' style={{display:'none'}}>
              <a href='#' className='dropdown-toggle' data-toggle='dropdown'><span id='devmng_id'></span> <span className='caret'></span></a>
              <ul className='dropdown-menu'>
                <li><Link id='picture_id' style={{display:'none'}} to={MainConstant.app+'/picture'}></Link></li>
                <li><Link id='hadoopspark_id' style={{display:'none'}} to={MainConstant.app+'/hadoopspark'}></Link></li>
                <li><Link id='workflowconfig_id' style={{display:'none'}} to={MainConstant.app+'/workflowconfig'}></Link></li>
                <li><Link id='leaveprocess_id' style={{display:'none'}} to={MainConstant.app+'/leaveprocess'}></Link></li>
                <li><Link id='socket_id' style={{display:'none'}} to={MainConstant.app+'/socket'}></Link></li>
              </ul>
          </li>
          </Nav>
          <Nav  pullRight>
            <NavItem  disabled={true}>{this.minnUtil.get('main_wellcome_msg')}:</NavItem>
            <NavItem  disabled={true}  id='loginName_id'></NavItem>
            <li><Link to={MainConstant.app+'/'} onClick={this.handleMenubarExit.bind(this)}>{this.minnUtil.get('main_wellcome_exit')}</Link></li>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
     
    );
  }
}

export default Menubar;