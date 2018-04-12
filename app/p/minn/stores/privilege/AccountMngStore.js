/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import AccountMngAction from '../../actions/privilege/AccountMngAction';

class AccountMngStore extends TemplateStore{
  constructor() {
    super(AccountMngAction);
    this.treeMenuData=null;
    this.data=[];
    this.name='';
    this.pwd='';

   
  }

  onGetDicSuccess(data) { 
    this.result=data;
    this.dicData = data.data;
    this.actionType='getDicSuccess';
  }

  onGetAccountRoleSuccess(data) {
     this.result=data;
    for(let i=0;i<data.data.length;i++){
      if(data.data[i].selected==true){
        data.data[i].state={};
        data.data[i].state.selected=true;
        data.data[i].state.opend=true;
      }
    }
    this.treeMenuData = data.data;
    this.selectedRow=data.selectedRow;
    if(this.selectedRow!=null){
       this.name=this.selectedRow.name;
       
    }
    
    this.actionType='getAccountRoleSuccess';
  }
    
  onSaveResourceSuccess(data) {
    this.result=data;
    this.actionType='saveResourceSuccess';
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

export default alt.createStore(AccountMngStore);