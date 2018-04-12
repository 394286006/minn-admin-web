/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import DepartmentMngAction from '../../actions/privilege/DepartmentMngAction';

class DepartmentMngStore extends TemplateStore{
  constructor() {
    super(DepartmentMngAction);
    this.selectedNode;
    this.data=[];
    this.name='';
    this.code='';
    this.pNode='';
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

  onGetResourceSuccess(data) {
     this.result=data;
    for(let i=0;i<data.data.length;i++){
      if(data.data[i].selected==true){
        data.data[i].state={};
        data.data[i].state.selected=true;
        data.data[i].state.opend=true;
      }
    }
    this.treeMenuData = data.data;
    
    this.actionType='getResourceSuccess';
  }


  onQuerySuccess(data) {
     this.result=data;
     this.selectedNode=data.selectedNode;
     this.pNode=data.selectedNode.text;
     console.log('pbode:'+this.pNode);
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
     this.name='';
     this.url='';
     this.code='';
     this.sort='';
     this.pNode='';
     this.selectedRow=null;
  }
    
  onGetSelectedSuccess(row) {
   this.selectedRow=row;
   this.name=row.name;
   this.url=row.url;
   this.code=row.code;
   this.sort=row.sort;
   this.pNode=row.pNode;
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
    
}

export default alt.createStore(DepartmentMngStore);