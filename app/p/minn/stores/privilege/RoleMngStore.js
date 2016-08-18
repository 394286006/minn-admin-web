/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import RoleMngAction from '../../actions/privilege/RoleMngAction';

class RoleMngStore extends TemplateStore{
  constructor() {
     super(RoleMngAction);
    this.dicData = null;
    this.treeMenuData=null;
    this.data=[];
    this.name='';
    this.code='';
    this.sort='';
    this.comment='';
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

  onGetTreeDataSuccess(data) {
     this.result=data;

    let menud=data.data;
    this.menuDataChange(menud);
    this.treeMenuData = menud;
    this.selectedRow=data.selectedRow;
    if(this.selectedRow!=null){
       this.name=this.selectedRow.name;
       
    }
  
    if(this.selectedRow!=null){
      this.name=this.selectedRow.name;
      this.code=this.selectedRow.code;
      this.sort=this.selectedRow.sort;
      this.comment=this.selectedRow.comment;
     }
    this.actionType='onGetTreeDataSuccess';
  }

  menuDataChange(data){
    for(let i=0;i<data.length;i++){
      if(data[i].selected==true){
        data[i].state={};
        data[i].state.selected=true;
        data[i].state.opend=true;
      }
      if(data[i].children.length>0){
        this.menuDataChange(data[i].children);
      }
    }
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
    
}

export default alt.createStore(RoleMngStore);