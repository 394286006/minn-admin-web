/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import UserAction from '../../actions/privilege/UserAction';

class UserStore {
  constructor() {
    this.bindActions(UserAction);
    this.validationState={};
    this.validationState['alertVisible']='none';
    this.validationState['input']=false;
    this.validationState['state']=this.validationNum;
    this.helpBlock={};
    this.result=null;
    this.name = '';
    this.pwd = '';
    this.actionType='';
    this.userInfo=null;

  }

  onLoginSuccess(successMessage) {
    this.result=successMessage;
    this.userInfo=successMessage.data;
    
    this.actionType=successMessage.actionType;
    this.name='';
    this.pwd='';
    this.validationState['input']=false;
    if(successMessage.success==false){
      this.validationState['alertVisible']='';
    }else{
      this.validationState['alertVisible']='none';
    }
  }

  onLoginFail(errorMessage) {
    this.validationState['input']=false;
    this.name='';
    this.pwd='';
  }

  onCheckLoginSuccess(successMessage) {
    this.userInfo=successMessage.data;
    if(successMessage.success){
      this.actionType=successMessage.actionType;
    }else{
      this.actionType='checkLoginFail';
    }
  }

  onFail(errorMessage) {
    this.actionType=successMessage.actionType='fail';
  }

  onUpdateValue(event){
 
    let id=event.target.id;
    this[id] = event.target.value;
    if(id=='name'){
      if(this[id]==''){
        this.validationState[event.target.id]='error';
        this.helpBlock[event.target.id] ='validate_username_notnull';
        this.validationState['alertVisible']='';
        this.validationState['state']=this.validationState['state']+1;;
      }else{
        this.validationState['input']=true;
        this.validationState[event.target.id]='';
        this.helpBlock[event.target.id] ='';
        this.validationState['alertVisible']='none';
      }    
    }
    if(id=='pwd'){
      if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='validate_password_notnull';
          this.validationState['alertVisible']='';
      }else{
         this.validationState['input']=true;
         this.validationState[event.target.id]='';
         this.helpBlock[event.target.id] ='';
         this.validationState['alertVisible']='none';
      }    
    }
    if(this.name==''||this.pwd==''){
          this.validationState['input']=false;
    }
  }

  
}

export default alt.createStore(UserStore);