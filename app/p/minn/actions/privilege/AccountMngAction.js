/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class AccountMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getAccountRoleSuccess',
      'saveResourceSuccess'
    );
  }

saveOrUpdate(method,selectRow,messageBody){
     let url='account?method=save';
      if(method=='modify'){
        url='account?method=update';
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
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

del(messageBody){
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);
     $.ajax({ url: 'account?method=del',type:'POST',data:param })
      .done(data => {
        this.actions.delSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

query(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: 'account?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }


getDic() {

    $.ajax({ url: 'dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'ACCOUNTTYPE\',\'ACTIVETYPE\',\'LOGINTYPE\',\'DEPARTMENTCODE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
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
    $.ajax({ url: 'account?method=getAccountRole',type:'POST',data:param })
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

    $.ajax({ url: 'account?method=saveRoleRes',type:'POST',data:param })
      .done(data => {
        this.actions.saveResourceSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  
  }
}

export default alt.createActions(AccountMngAction);