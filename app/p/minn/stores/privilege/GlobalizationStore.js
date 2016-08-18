/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import GlobalizationAction from '../../actions/privilege/GlobalizationAction';

class GlobalizationStore extends TemplateStore{
  constructor() {
    super(GlobalizationAction);
    this.dicData = null;
    this.dicType=null;
    this.treeMenuData=null;
    this.data=[];
    this.name='';
    this.key='';
    this.keyval='';
    this.sort='';
    this._curid='';
    this._tablename='';
    this.columns=[];
    this.languagemkey={};
   
  }

   onGetDicSuccess(data) { 
    this.result=data;
    this.dicData = data.data;
    this.actionType='getDicSuccess';
  }
  onGetDicTypeSuccess(data){
   this.dicType=data.data;
    this.actionType='getDicTypeSuccess';
  }

  onGetGlobalDataSuccess(data) {
    this.selectedRow=data;
    this.actionType='getGlobalDataSuccess';
  }

  

  onQuerySuccess(data) {
     this.result=data;
    this.actionType='querySuccess';
    this.data=data.result;
    this.total=data.total;
  }
    
  onSaveResourceSuccess(data) {
    this.result=data;
    this.actionType='saveResourceSuccess';
  }
    
  onSaveOrUpdateSuccess(data) { 
     this.result=data;
     this.actionType='saveOrUpdateSuccess';
  }
  
  onGetDicLangSuccess(data){
    this.actionType='getDicLangSuccess';
    this.data=data.data;

  }

  
  onDelSuccess(data){
     this.result=data;
     this.actionType='delSuccess';
  }
    
}

export default alt.createStore(GlobalizationStore);