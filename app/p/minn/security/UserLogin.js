/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import UserStore from '../stores/privilege/UserStore';
import UserAction from '../actions/privilege/UserAction';
import MainConstant from '../utils/MainConstant';
import MinnUtil from '../utils/MinnUtil';
import { Button,Modal,Form,FormGroup,Col,FormControl,ControlLabel,Image,Alert,Grid,Row} from 'react-bootstrap';



class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = UserStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document);
    this.checkLogin();
  }

  componentDidMount() {
    UserStore.listen(this.onChange);
    let locals=this.minnUtil.getLocales();
    for(let i=0;i<locals.length;i++){
         $('#main_language_id').append('<option value='+locals[i].locale+'>'+locals[i].name+'</option>');
      }

  }

  componentWillUnmount() {
    UserStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='loginSuccess'){
       this.minnUtil.setLogin(true);
       this.minnUtil.setUserInfo(state.userInfo);
        this.minnUtil.setCurrentLocale(state.userInfo.language);
       state.userInfo.locale=this.minnUtil.getCurrentLocale();

       $(document).trigger( "loginCompleteEvent",state.userInfo);
     }
     if(state.actionType=='checkLoginFail' || state.actionType=='checkLoginFail'){
        this.minnUtil.setLogin(false);
       this.minnUtil.setUserInfo(null);
       $(document).trigger( "loginCompleteEvent",null);
     }

    if(state.actionType=='jsloginSuccess'){
      this.minnUtil.setLogin(true);
       this.minnUtil.setUserInfo(state.userInfo);
        this.minnUtil.setCurrentLocale(state.userInfo.language);
       state.userInfo.locale=this.minnUtil.getCurrentLocale();

       $(document).trigger( "loginCompleteEvent",state.userInfo);
       //UserAction.checkLogin();
     }
     if(state.actionType=='tabChangeSuccess'){

       if(state.tabIndex==0){
          $('#login_action_id').show();
          $('#main_language_id').show();
          $('#main_language_flagImg_id').show();
       }else if(state.tabIndex==1){
         $('#login_action_id').hide();
           $('#main_language_id').hide();
           $('#main_language_flagImg_id').hide();
           let param={};
           param.key=state.loginKeys;
           param.type='pc';
           param.title=this.minnUtil.get('main_title');
           param.info=this.minnUtil.get('login_qrcode_info');
           param.config=this.minnUtil.get('login_certain');
           param.scan=this.minnUtil.get('login_scan');
           param.lang='';
           if(this.minnUtil.isLogin()){
             param.lang=this.minnUtil.getCurrentLocale();
           }
           $(document).trigger( "randomkeyCompleteEvent",param);
          
       }else if(state.tabIndex==2){
         $('#login_action_id').hide();
         $('#main_language_id').hide();
         $('#main_language_flagImg_id').hide();
         let fg=[];
        
         for(let i=0;i<state.loginKeys.length;i++){
          let data=state.loginKeys[i];
         fg.push(<FormGroup  inline>
            <Col  sm={4} >
            </Col>
            <Col sm={5} >
            <Button   onClick={this.handleThirdPartLoginBind.bind(this,data)}>{data.name}</Button>
            </Col>
          </FormGroup>);
         }
        state.fg=fg;
       
       }else if(state.tabIndex==3){
          $('#login_action_id').hide();
         $('#main_language_id').hide();
         $('#main_language_flagImg_id').hide();

       }

         this.forceUpdate();
      }

    state.actionType='';
     this.setState(state);
  }



  handleChangeLanguage(event){
    let locale=event.target.value;
    this.minnUtil.setCurrentLocale(locale);
    this.forceUpdate();
  }

  checkLogin(){
    UserAction.checkLogin(this.minnUtil.getCurrentLocale());
  }

  handleSubmit(event) {
    event.preventDefault();
    var name =this.state.name;
    var pwd = this.state.pwd;
    if(this.state.validationState['input']==false){
        this.setState({ validationState:{alertVisible:''} });
        return;
      }

      UserAction.login(name, pwd,this.minnUtil.getCurrentLocale());

    }

    tabChange(index,last){
      UserAction.tabChange(index,last,this.minnUtil.getCurrentLocale());
    }

    handleThirdPartLoginBind(data,event){
        event.preventDefault();
          window.open(data.var1);
    }

    downloadAndroid(){
       document.getElementById("ifile_android").src="download/minnAndroid.apk";
    }
   
    downloadIos(){
         document.getElementById("ifile_ios").src="download/minnIos.zip";
         console.log("download/minnIos.zip");
    }

    openPortal(){
      window.open('./public/index.html','_blank');
    }
    swfManager(){
      window.open('./Main.html','_blank');
    }
  
   render() {
    return (
      <Modal.Dialog >
        <Modal.Header>
          <Modal.Title id="login_title_id">{this.minnUtil.get('login_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                  {this.minnUtil.get('validate_check_msg')}
          </Alert>
        <Form horizontal>
        <Tabs onSelect={(index,last)=>this.tabChange(index,last)}>
          <TabList>
           <Tab>{this.minnUtil.get('login_pwd')}</Tab>
           <Tab>{this.minnUtil.get('login_qrcode')}</Tab>    
           <Tab>{this.minnUtil.get('login_thirdpart')}</Tab>
           <Tab>{this.minnUtil.get('mobile_xiaochengxu')}</Tab>
         </TabList>
        <TabPanel>
        <FormGroup validationState={this.state.validationState.name}>
        <Col componentClass={ControlLabel} sm={2} id="login_name_prex_id">
          {this.minnUtil.get('login_name')}
        </Col>
        <Col sm={10}>
          <FormControl type="input" id="name" placeholder={this.minnUtil.get('login_name')} value={this.state.name} onChange={UserAction.updateValue}/>
          <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
        </Col>
      </FormGroup>

      <FormGroup validationState={this.state.validationState.pwd}>
        <Col componentClass={ControlLabel} sm={2} id="login_pwd_prex_id">
            {this.minnUtil.get('login_pwd')}
        </Col>
        <Col sm={10}>
          <FormControl type="password" id="pwd" placeholder={this.minnUtil.get('login_pwd')} value={this.state.pwd} onChange={UserAction.updateValue}/>
          <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.pwd)}</span>
        </Col>
      </FormGroup>
      </TabPanel>
      <TabPanel style={{height:'150px'}}>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={0} >
        </Col>
        <Col sm={12}>
           <iframe id="qrcode" name="qrcode" src="third-part/qrcode.html" frameBorder="0"  height="140px" width="200px" style={{position: 'fixed', height: '200px', width: '570px',frameBorder:0,scrolling:'no',overFlow:'hidden'}}/>
        </Col>
      </FormGroup>
     </TabPanel>
     <TabPanel style={{height:'150px'}}>
       {this.state.fg}
    </TabPanel>
      <TabPanel style={{height:'150px'}}>
      <FormGroup>
        <Col componentClass={ControlLabel} sm={0} >
        </Col>
        <Col sm={12}>
           <iframe id="webqrcode" name="webqrcode" src="third-part/webqrcode.html" frameBorder="0"  height="140px" width="200px" style={{position: 'fixed', height: '200px', width: '570px',frameBorder:0,scrolling:'no',overFlow:'hidden'}}/>
        </Col>
      </FormGroup>
     </TabPanel>
     </Tabs>
      <FormGroup >
        <Col componentClass={ControlLabel} sm={2}>
             <Image src={this.minnUtil.get('main_language_flagImg')} width={20} height={18} id="main_language_flagImg_id" rounded/>
        </Col>
        <Col sm={10}>
          <FormControl componentClass="select" id="main_language_id" onChange={this.handleChangeLanguage.bind(this)}>

        </FormControl>
        </Col>
      </FormGroup>

      <FormGroup>
        <Col smOffset={2} sm={2}>
          <Button bsStyle="primary"  type="submit"  onClick={this.handleSubmit.bind(this)} id="login_action_id">
            {this.minnUtil.get('login_action')}
          </Button>
        </Col>
         <Col sm={3}>
        <Button bsStyle="primary"  type="button"  onClick={this.swfManager.bind(this)} id="login_swf_id">
            {this.minnUtil.get('login_swf_manager')}
          </Button>
        </Col>
        <Col sm={2}>
        <Button bsStyle="primary"  type="button"  onClick={this.openPortal.bind(this)} id="login_portal_id">
            {this.minnUtil.get('login_portal_web')}
          </Button>
        </Col>
      </FormGroup>

       <FormGroup>
        <Col smOffset={2} sm={3}>{this.minnUtil.get('mobile_app_download')}:</Col>
        <Col sm={2} ><a href="javascript:void" onClick={this.downloadAndroid.bind(this)}>{this.minnUtil.get('mobile_app_android')}</a>
          <iframe id="ifile_android" name="ifile_android" style={{display:'none'}}/>
        </Col>
        <Col sm={2} ><a href="#" onClick={this.downloadIos.bind(this)}>{this.minnUtil.get('mobile_app_ios')}</a>
          <iframe id="ifile_ios" name="ifile_ios" style={{display:'none'}}/>
        </Col>
       
      </FormGroup>

     </Form>
     
     </Modal.Body>

  </Modal.Dialog>

    );
  }
}


export default UserLogin;
