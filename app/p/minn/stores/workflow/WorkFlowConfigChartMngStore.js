/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from '../privilege/TemplateStore';
import WorkFlowConfigChartMngAction from '../../actions/workflow/WorkFlowConfigChartMngAction';

class WorkFlowConfigChartMngStore extends TemplateStore{
  constructor() {
    super(WorkFlowConfigChartMngAction);
    this.processTree=null;
    this.data=[];
    
    this.modelType='process';

    this.process_selectedNode={};
    this.process_id='-1';
    this.process_gid=-2;
    this.process_name='';
    this.process_code='';
    this.process_sort='';

    this.node_selectedNode={};
    this.node_id='-1';
    this.node_gid=-2;
    this.node_name='';
    this.node_code='';
    this.node_sort='';
    this.node_url='';

    this.resourceTree=null;
    this.targetTree=null;
    this.modelExists=false;
    this.originalModelData={ "class": "go.GraphLinksModel",
  "linkFromPortIdProperty": "fromPort",
  "linkToPortIdProperty": "toPort",
  "nodeDataArray": [
 ],
  "linkDataArray": [
 ]};;
    this.modelData;
   
  }

  onGetDicSuccess(data) { 
    this.result=data;
    this.dicData = data.data;
    this.actionType='getDicSuccess';
  }

  onChangeModelTypeSuccess(data) { 
    this.modelType=data.type;
    this.actionType='changeModelType';
    if(data.myMethod=='add'){
      this.process_id='-1';
      this.process_gid=-2;
      this.process_name='';
      this.process_code='';
      this.process_sort='';

      this.node_id='-1';
      this.node_gid=-2;
      this.node_name='';
      this.node_sort='';
      this.node_code='';
      this.node_url='';
    }else{
      this.process_id=this.process_selectedNode.id;
      this.process_pid=this.process_selectedNode.pid;
      this.process_name=this.process_selectedNode.text;
      this.process_code=this.process_selectedNode.code;
      this.process_sort=this.process_selectedNode.sort;

      this.node_id=this.node_selectedNode.id;
      this.node_pid=this.node_selectedNode.pid;
      this.node_name=this.node_selectedNode.text;
      this.node_code=this.node_selectedNode.code;
      this.node_sort=this.node_selectedNode.sort;
      this.node_url=this.node_selectedNode.url;
    }
    
  }

 onProcessSaveOrUpdateSuccess(data){
    this.processTree=data;
    this.actionType='processSaveOrUpdateSuccess';

  }

  onProcessSaveAllSuccess(data){
    this.actionType='processSaveAllSuccess';
  }

onProcessSelectedNodeSuccess(data){
    if(data){
      this.process_selectedNode=data;
      this.actionType='processSelectedNodeSuccess';
      this.process_id=data.id;
      this.process_pid=data.pid;
      this.process_name=data.text;
      this.process_code=data.code;
      this.process_sort=data.sort;
    }
    this.validationState['process_alertVisible']='none';
  }
    

  onProcessQueryTreeSuccess(data){
    this.processTree=data;
    this.actionType='processQueryTreeSuccess';
  }

 onProcessDelSuccess(data){
    this.process_id='-1';
    this.process_pid=-2;
    this.actionType='processDelSuccess';
  }

onNodeSaveOrUpdateSuccess(data){
    this.nodeTree=data;
    this.actionType='nodeSaveOrUpdateSuccess';

  }

onNodeSelectedNodeSuccess(data){
    if(data){
      this.node_selectedNode=data;
      this.actionType='nodeSelectedNodeSuccess';
      this.node_id=data.id;
      this.node_pid=data.pid;
      this.node_name=data.text;
      this.node_code=data.code;
      this.node_sort=data.sort;
      this.node_url=data.url;
    }
    this.validationState['node_alertVisible']='none';
    
  }
    

onNodeQueryTreeSuccess(data){
    this.nodeTree=data;
    this.actionType='nodeQueryTreeSuccess';
  }

 onNodeDelSuccess(data){
    this.node_id='-1';
    this.node_pid=-2;
    this.actionType='nodeDelSuccess';
  }
 
   onSaveResourceSuccess(data) {
    this.result=data;
    this.actionType='saveResourceSuccess';
  }

  onGetModelSuccess(data){

   if(data=='getModel'){
     this.modelExists=false;
     this.modelData=this.originalModelData;
   }else{
     this.modelExists=true;
     this.modelData=data.model;
   }
    this.actionType='getModelSuccess';
  }
    
  onUpdateValue(event){
 
    let id=event.target.id;
    this[id] = event.target.value;
    if(this.modelType=='process'){
      if(id=='process_name'){
        if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='validate_name_notnull';
          this.validationState['process_alertVisible']='';
        }else{
          this.validationState['input']=true;
          this.validationState[event.target.id]='success';
          this.helpBlock[event.target.id] ='';
          this.validationState['process_alertVisible']='none';
        }    
      }
      if(id=='process_code'){
        if(this[id]==''){
            this.validationState[event.target.id]='error';
            this.helpBlock[event.target.id] ='validate_code_notnull';
            this.validationState['process_alertVisible']='';
        }else{
           this.validationState['input']=true;
           this.validationState[event.target.id]='success';
           this.helpBlock[event.target.id] ='';
           this.validationState['process_alertVisible']='none';
        }    
      }
      if(id=='process_sort'){
        if(this[id]==''){
            this.validationState[event.target.id]='error';
            this.helpBlock[event.target.id] ='validate_sort_notnull';
            this.validationState['process_alertVisible']='';
        }else{
           this.validationState['input']=true;
           this.validationState[event.target.id]='success';
           this.helpBlock[event.target.id] ='';
           this.validationState['process_alertVisible']='none';
        }    
      }
      if(this.process_name==''||this.process_code==''||this.process_sort==''){
            this.validationState['input']=false;
      }
     }
     if(this.modelType=='node'){
      if(id=='node_name'){
        if(this[id]==''){
          this.validationState[event.target.id]='error';
          this.helpBlock[event.target.id] ='validate_name_notnull';
          this.validationState['node_alertVisible']='';
        }else{
          this.validationState['input']=true;
          this.validationState[event.target.id]='success';
          this.helpBlock[event.target.id] ='';
          this.validationState['node_alertVisible']='none';
        }    
      }
      if(id=='node_code'){
        if(this[id]==''){
            this.validationState[event.target.id]='error';
            this.helpBlock[event.target.id] ='validate_code_notnull';
            this.validationState['node_alertVisible']='';
        }else{
           this.validationState['input']=true;
           this.validationState[event.target.id]='success';
           this.helpBlock[event.target.id] ='';
           this.validationState['node_alertVisible']='none';
        }    
      }
      if(id=='node_sort'){
        if(this[id]==''){
            this.validationState[event.target.id]='error';
            this.helpBlock[event.target.id] ='validate_sort_notnull';
            this.validationState['node_alertVisible']='';
        }else{
           this.validationState['input']=true;
           this.validationState[event.target.id]='success';
           this.helpBlock[event.target.id] ='';
           this.validationState['node_alertVisible']='none';
        }    
      }
      if(this.node_name==''||this.node_code==''||this.node_sort==''){
            this.validationState['input']=false;
      }
     }

  }

 onResourceQueryTreeSuccess(data){
    this.resourceTree=data;
    this.actionType='resourceQueryTreeSuccess';
  }

  onTargetQueryTreeSuccess(data){
    this.targetTree=data;
    this.actionType='targetQueryTreeSuccess';
    
  }
  onTargerSaveOrUpdateSuccess(data){
    //this.targetTree=data;
    this.actionType='targerSaveOrUpdateSuccess';

  }
    
}

export default alt.createStore(WorkFlowConfigChartMngStore);