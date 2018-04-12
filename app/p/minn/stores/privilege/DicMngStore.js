/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import DicMngAction from '../../actions/privilege/DicMngAction';

class DicMngStore extends TemplateStore{
  constructor() {
    super(DicMngAction);
    this.dicData = null;
    this.dicType=null;
    this.treeMenuData=null;
    this.data=[];
    this.name='';
    this.key='';
    this.keyval='';
    this.sort='';
    this.var1='';
    this.var2='';
    this.var3='';
    this.var4='';
    this.var5='';
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
  onGetDicTypeSuccess(data){
   this.dicType=data.data;
    this.actionType='getDicTypeSuccess';
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
      this.key=this.selectedRow.pkey;
      this.keyval=this.selectedRow.value;
      this.sort=this.selectedRow.sort;
      this.var1=this.selectedRow.var1;
      this.var2=this.selectedRow.var2;
      this.var3=this.selectedRow.var3;
      this.var4=this.selectedRow.var4;
      this.var5=this.selectedRow.var5;
     }

  }

  onUpdateValue(event){

    let id=event.target.id;
    this[id] = event.target.value;
    if(id=='name'){
      if(this[id]==''){
        this.validationState[event.target.id]='error';
        this.helpBlock[event.target.id] ='globalization_validate_name_notnull';
        this.validationState['alertVisible']='';
        this.validationState['state']=this.validationState['state']+1;;
      }else{
        this.validationState['input']=true;
        this.validationState[event.target.id]='';
        this.helpBlock[event.target.id] ='';
        this.validationState['alertVisible']='none';
      }
    }
    if(id=='mkey'){
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
    if(id=='keyval'){
      if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='dictionary_validate_keyval_notnull';
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
          this.helpBlock[event.target.id] ='dictionary_validate_sort_notnull';
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

}

export default alt.createStore(DicMngStore);
