/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from '../privilege/TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class LeaveProcessMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'queryModelTreeSuccess',
      'queryAuditSuccess',
      'selectedNodeSuccess',
      'launchSuccess',
      'saveAuditSuccess'
    );
  }

  getDic() {

    $.ajax({ url: MainConstant.baseApp +'/dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'LANGUAGE\',\'WORKFLOWSTATUS\',\'WORKFLOWPASS\',\'WORKFLOWPROCESS\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      }) 
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  
 queryModelTree() {
     let messageBody={};
     messageBody.id='108_1'; 
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);

     
    $.ajax({ url: MainConstant.workflowApp +'/workFlow?method=queryModelTree',type:'GET',data:param })
      .done(data => {
        this.actions.queryModelTreeSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
       
  } 

    query(messageBody) {
   
    let param={}; 

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/leaveProcess?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

  getSelected(row){
       
   this.actions.getSelectedSuccess(row);

  }
 
  saveOrUpdate(method,selectRow,messageBody){

    
     let url=MainConstant.workflowApp +'/leaveProcess?method=save';
      if(method=='modify'){
        url=MainConstant.workflowApp +'/leaveProcess?method=update';
        messageBody.id=selectRow.id;
      }

     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: url,type:'POST',data:param })
      .done(data => {
        this.actions.saveOrUpdateSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.saveOrUpdateFail(jqXhr.responseJSON.message);
      });
  }
 
   del(messageBody){
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: MainConstant.workflowApp +'/leaveProcess?method=del',type:'POST',data:param })
      .done(data => {

        this.actions.delSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.delFail(jqXhr.responseJSON.message);
      });
  }

  getDicLang(row){
  
     let param={};
      let messageBody={};
      messageBody.did=row.id+'';
      messageBody.tablename='resource';
      param.messageBody=  MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/dic?method=getDicLang',type:'POST',data:param})
      .done(data => {
        data.tablename='resource';
        data.selectedRow=row;
        this.actions.getDicLangSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

   
  }

  selectedNode(selectedNode){
    this.actions.selectedNodeSuccess(selectedNode);
  }
                  
  launch(lpId,pdId){     
    let messageBody={}; 
    messageBody.lpId=lpId;
    messageBody.pdId=pdId;
    let param={}; 

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/leaveProcess?method=launch',type:'POST',data:param})
      .done(data => {
        this.actions.launchSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
     
  saveAudit(messageBody){
     let param={};
     param.messageType=0;
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url:MainConstant.workflowApp +'/workFlow?method=saveAudit',type:'POST',data:param })
      .done(data => { 
        this.actions.saveAuditSuccess(data);    
      })
      .fail(jqXhr => {
        this.actions.saveOrUpdateFail(jqXhr.responseJSON.message);
      });
  } 

  queryAudit(selectedNode,lpId) {
    let messageBody={};   
    let query='';
    query+=selectedNode.id;
    query+=',';
    query+=lpId;
     messageBody.qtype="pdId,lpId";
     messageBody.query=query;
    let param={}; 

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.workflowApp +'/processAudit?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.queryAuditSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

}

export default alt.createActions(LeaveProcessMngAction);