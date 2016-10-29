/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from '../privilege/TemplateStore';
import LeaveProcessMngAction from '../../actions/workflow/LeaveProcessMngAction';

class LeaveProcessMngStore extends TemplateStore{
  constructor() {
    super(LeaveProcessMngAction);
    this.data=[];
    this.auditData=[];
    this.name='';
    this.desc='';
    this.startTime='';
    this.endTime='';
    this.pdId=''
    this._curid='';
    this._tablename='';
    this.columns=[];
    this.languagemkey={};
    this.languagekey={};
    this.langdata=null;
   
  }

  onGetDicSuccess(data) { 
    this.result=data;
    this.dicData = data.data;
    this.actionType='getDicSuccess';
    for(let i=0;i<this.dicData.LANGUAGE.length;i++){
            let obj=this.dicData.LANGUAGE[i];
            if(!this.languagekey[obj.id]){
              this.languagekey[obj.id]=i;
              this.languagemkey[obj.id]=obj.text;
            }
          }
  }

  onQueryModelTreeSuccess(data) {

    this.treeMenuData = data.data;
    
    this.actionType='queryModelTreeSuccess';
  }


  onQuerySuccess(data) {
     this.result=data;
    this.actionType='querySuccess';
    this.data=data.result;
    this.total=data.total;
  }
    
    
  onSaveOrUpdateSuccess(data) { 
     this.result=data;
     this.actionType='saveOrUpdateSuccess';
     this.name='';
     this.startTime='';  
     this.endTime='';
     this.desc='';
     this.selectedRow=null;
  }
    
  onGetSelectedSuccess(row) {
   this.selectedRow=row;
   this.name=row.titleName;
   this.desc=row.desc;
   this.startTime=row.startTime;
   this.endTime=row.endTime;
   this.pdId=row.pdId;
  }
  onUpdateValue(event){
 
    let id=event.target.id;
    this[id] = event.target.value;
    if(id=='name'){
      if(this[id]==''){
        this.validationState[event.target.id]='error';
        this.helpBlock[event.target.id] ='dictionary_validate_pkey_notnull';
        this.validationState['alertVisible']='';
      }else{
        this.validationState['input']=true;
        this.validationState[event.target.id]='';
        this.helpBlock[event.target.id] ='';
        this.validationState['alertVisible']='none';
      }    
    }
    if(id=='code'){
      if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='menu_desc_notnulll';
          this.validationState['alertVisible']='';
      }else{
         this.validationState['input']=true;
         this.validationState[event.target.id]='';
         this.helpBlock[event.target.id] ='';
         this.validationState['alertVisible']='none';
      }    
    }
    if(id=='sort'){
      if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='menu_validate_num_notnull';
          this.validationState['alertVisible']='';
      }else{
         this.validationState['input']=true;
         this.validationState[event.target.id]='';
         this.helpBlock[event.target.id] ='';
         this.validationState['alertVisible']='none';
      }    
    }
    if(this.name==''||this.code==''||this.sort==''){
          this.validationState['input']=false;
    }
  }
  onDelSuccess(data){
     this.result=data;
     this.actionType='delSuccess';
  }

  onGetDicLangSuccess(data){
    this.actionType='getDicLangSuccess';
    this.langdata=data.data;
    for(let i=0;i<this.langdata.length;i++){
         this.langdata[i].languagename=this.languagemkey[this.langdata[i].language];
        this.langdata[i].languageidx=this.languagekey[this.langdata[i].language]
    }
     let key={};
    for(let i=0;i<this.langdata.length;i++){
      if(!key[this.langdata[i].tablecolumn]){
        key[this.langdata[i].tablecolumn]=this.langdata[i].tablecolumn;
        this.columns.push({id:this.langdata[i].tablecolumn,text:this.langdata[i].tablecolumn});
      }
    }

    this.selectedRow=data.selectedRow;
    this._tablename=data.tablename;
    if(this.selectedRow!=null){
      this._curid=this.selectedRow.id;

      this.name=this.selectedRow.name;
     }

  }
  onSelectedNodeSuccess(data){
    this.selectedNode=data;
    this.actionType='selectedNodeSuccess';
  }

  onLaunchSuccess(data){

    this.actionType='launchSuccess';
  }

  onSaveAuditSuccess(data){
    
    this.actionType='saveAuditSuccess';
  }

  onQueryAuditSuccess(data) {
    this.auditData=data.result;
    this.actionType='queryAuditSuccess';
  }
    
}

export default alt.createStore(LeaveProcessMngStore);