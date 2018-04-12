/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from '../privilege/TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class WorkFlowConfigChartMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getAccountRoleSuccess',
      'saveResourceSuccess',
      'processQueryTreeSuccess',
      'processSaveOrUpdateSuccess',
      'processSelectedNodeSuccess',
      'processDelSuccess',
      'processSaveAllSuccess',
      'nodeQueryTreeSuccess',
      'nodeSaveOrUpdateSuccess',
      'nodeSelectedNodeSuccess',
      'nodeDelSuccess',
      'changeModelTypeSuccess',
      'resourceQueryTreeSuccess',
      'targetQueryTreeSuccess',
      'targetSaveOrUpdateSuccess',
      'getModelSuccess'
    );
  }
  getDic() {
    $.ajax({ url: MainConstant.baseApp +'/dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'ACCOUNTTYPE\',\'ACTIVETYPE\',\'LOGINTYPE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

  changeModelType(type,myMethod){
    let param={};
    param.type=type;
    param.myMethod=myMethod;
    this.actions.changeModelTypeSuccess(param);
  }
 
  process_queryTree(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/processDefinition?method=queryTree',type:'POST',data:param})
      .done(data => {
        this.actions.processQueryTreeSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }  

  process_saveOrUpdate(method,selectRow,messageBody){
     let url=MainConstant.workflowApp +'/processDefinition?method=save';
      if(method=='modify'){
        url=MainConstant.workflowApp +'/processDefinition?method=update';
        messageBody.id=selectRow.id;
        messageBody.gid=selectRow.gid;
        messageBody.pId=selectRow.pid;
      }
     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: url,type:'POST',data:param })
      .done(data => {
        this.actions.processSaveOrUpdateSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

  process_saveAll(method,selectRow,messageBody){
     let url=MainConstant.workflowApp +'/processDefinition?method=save';
      if(method=='modify'){
        url=MainConstant.workflowApp +'/processDefinition?method=update';
        messageBody.id=selectRow.id;
        messageBody.gid=selectRow.gid;
        messageBody.pId=selectRow.pid;
      }
     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: url,type:'POST',data:param })
      .done(data => {
        this.actions.processSaveAllSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
 
process_del(messageBody){
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: MainConstant.workflowApp +'/processDefinition?method=del',type:'POST',data:param })
      .done(data => {
        this.actions.processDelSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });  
  }

process_selectedNode(selectedNode){
  this.actions.processSelectedNodeSuccess(selectedNode);
}


node_queryTree(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/processNode?method=queryTree',type:'POST',data:param})
      .done(data => {
        this.actions.nodeQueryTreeSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

node_saveOrUpdate(method,selectRow,messageBody){
     let url=MainConstant.workflowApp +'/processNode?method=save';
      if(method=='modify'){
        url=MainConstant.workflowApp +'/processNode?method=update';
        messageBody.id=selectRow.id;
        messageBody.gid=selectRow.gid;
        messageBody.pId=selectRow.pid;
      }
     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: url,type:'POST',data:param })
      .done(data => {
        this.actions.nodeSaveOrUpdateSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
 
node_del(messageBody){
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: MainConstant.workflowApp +'/processNode?method=del',type:'POST',data:param })
      .done(data => {
        this.actions.nodeDelSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

node_selectedNode(selectedNode){
  this.actions.nodeSelectedNodeSuccess(selectedNode);
}

resource_queryTree(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/workFlow?method=queryTree',type:'POST',data:param})
      .done(data => {
        this.actions.resourceQueryTreeSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

  target_queryTree(selectedNode) {
   
    let param={};
     param.messageBody=MinnUtil.convert2Json(selectedNode);

    $.ajax({ url: MainConstant.workflowApp +'/processNM?method=queryTree',type:'POST',data:param})
      .done(data => {
        this.actions.targetQueryTreeSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

  target_saveOrUpdate(method,selectRow,messageBody){
     let url=MainConstant.workflowApp +'/processNM?method=save';
      
     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: url,type:'POST',data:param })
      .done(data => {
        this.actions.targetSaveOrUpdateSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  
getAccountRole(row) {
    let messageBody={};
     if(row==null){
      messageBody.query=MainConstant.UNKNOWN;
      }else{
       messageBody.query=row.id;
      }
     
     messageBody.qtype="accountid";
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/account?method=getAccountRole',type:'POST',data:param })
      .done(data => {
        data.selectedRow=row;
        this.actions.getAccountRoleSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  
  }

saveResource(row,roleids){
    let messageBody={};
   
     messageBody.accountid=row.id;
     messageBody.roleids=roleids;
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.baseApp +'/account?method=saveRoleRes',type:'POST',data:param })
      .done(data => {
        this.actions.saveResourceSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  
  }   

  getModel(messageBody) {
   
    let param={};      

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/processDefinition?method=getModel',type:'POST',data:param})
      .done(data => {
        this.actions.getModelSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

}

export default alt.createActions(WorkFlowConfigChartMngAction);