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
import {Navbar,Nav,NavItem,NavDropdown,Button,MenuItem,Modal,Form,FormGroup,Col} from 'react-bootstrap';
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
     if(state.actionType=='qrCodeLoginSuccess'){
       state.qrcodeShow=true;
       state.thirdpartShow=false;
       let param={};
       param.key=state.randomKey;
       param.type='mobile';
       param.title=this.minnUtil.get('main_title');
       param.info=this.minnUtil.get('login_qrcode_info');
       param.config=this.minnUtil.get('login_certain');
       param.scan=this.minnUtil.get('login_scan');
       param.lang='';
       if(this.minnUtil.isLogin()){
         param.lang=this.minnUtil.getCurrentLocale();
       }
       $(document).trigger( "randomkeyCompleteEvent",param);

     }
     if(state.actionType=='getThirdPartsSuccess'){
       let fg=[];
       for(let i=0;i<state.thirdParts.length;i++){
        let data=state.thirdParts[i];
       fg.push(<FormGroup  inline>
          <Col  sm={5} >
            <Button disabled={true}>{data.name+'['+(data.status==-1? this.minnUtil.get('account_thirdpart_unbinding'):this.minnUtil.get('account_thirdpart_binding'))+']'}</Button>
          </Col>
          <Col sm={5} >
          <Button   onClick={this.handleThirdPartBindUnBind.bind(this,data)}>{(data.status==-1? this.minnUtil.get('account_thirdpart_bind'):this.minnUtil.get('account_thirdpart_unbind'))}</Button>
          </Col>
        </FormGroup>);
       }
      state.fg=fg;
      state.thirdpartShow=true;
      state.qrcodeShow=false;
     }

     if(state.actionType=='unBindThirdPardSuccess'){
        MenubarAction.getThirdParts();
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

  handleQrCodeLogin(event){
    event.preventDefault();
    MenubarAction.qrcodeLogin(this.minnUtil.getCurrentLocale());
  }

  handleThirdPartLogin(event){
    event.preventDefault();
    MenubarAction.getThirdParts();
  }
  handleThirdPartBindUnBind(data,event) {
    if(data.status==-1){
        window.open(data.var1);
         this.setState({thirdpartShow:false});
    }else{
      let messageBody={};
       messageBody.id=data.id;
       MenubarAction.unBindThirdPard(messageBody);
    }

  }


  render() {

    return (
      <div>
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
          <li><Link to={MainConstant.app+'/'} onClick={this.handleQrCodeLogin.bind(this)}>{this.minnUtil.get('login_scanlogin')}</Link></li>
          <li><Link to={MainConstant.app+'/'} onClick={this.handleThirdPartLogin.bind(this)}>{this.minnUtil.get('account_thirdpart_bind')}</Link></li>
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
                <li><Link id='chart_id' style={{display:'none'}} to={MainConstant.app+'/chart'}></Link></li>
                <li><Link id='orgChart_id' style={{display:'none'}} to={MainConstant.app+'/orgChart'}></Link></li>
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
      <Modal
          show={this.state.qrcodeShow}
          onHide={() => this.setState({ qrcodeShow: false})}
          container={this}  id='qrcode_id' ref='qrcode_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('login_mobiledevice')}</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{height:'230px',width:'300px'}}>
          <iframe id="qrcode" name="qrcode" src="third-part/qrcode.html" frameBorder="0"   style={{position: 'fixed', height: '200px', width: '570px',frameBorder:0,scrolling:'no',overFlow:'hidden'}}/>
          </Modal.Body>
        </Modal>
        <Modal
            show={this.state.thirdpartShow}
            onHide={() => this.setState({ thirdpartShow: false})}
            container={this}  id='thridpart_id' ref='thridpart_id'
            aria-labelledby="contained-modal-title">
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title">{this.minnUtil.get('account_thirdpart_bind_title')}</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{height:'230px',width:'300px'}}>
            <Form horizontal id='submitform_id'>

              {this.state.fg}
            </Form>

            </Modal.Body>
          </Modal>
        </div>
    );
  }
}

export default Menubar;
