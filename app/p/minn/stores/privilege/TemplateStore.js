/**
* @auth:minn
* @qq:394286006
*/

class TemplateStore {
  constructor(action) {
    this.bindActions(action);
    this.validationState={};
    this.validationState['alertVisible']='none';
    this.validationState['input']=false;
    this.helpBlock={};
    this.result=null;
    this.actionType='';
    this.total=0;
    this.selectedRow=null;
    this.dicData = null;
   
  }


  onFail(errorMessage) {
   // toastr.error(errorMessage);
  }
    
  onDelSuccess(data){
     this.result=data;
     this.actionType='delSuccess';
  }

 onSaveOrUpdateSuccess(data) { 
     this.result=data;
     this.actionType='saveOrUpdateSuccess';
  }

onQuerySuccess(data) {
     this.result=data;
    this.actionType='querySuccess';
    this.data=data.result;
    this.total=data.total;
  }
}

export default TemplateStore;