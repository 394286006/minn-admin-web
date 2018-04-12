/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class RoleMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getTreeDataSuccess',
      'saveResourceSuccess'
    );
  }

  getDic() {

    $.ajax({ url: MainConstant.baseApp +'/dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'LANGUAGE\',\'ACTIVETYPE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  
  getTreeData(row) {
    let messageBody={};
     if(row==null){
      messageBody.query=MainConstant.UNKNOWN;
      }else{
       messageBody.query=row.id;
      }
     
     messageBody.qtype="roleid";
     let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);
  

    $.ajax({ url: MainConstant.baseApp +'/role?method=getRoleRes',type:'POST',data:param })
      .done(data => {
        data.selectedRow=row;
        this.actions.getTreeDataSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  
  }

    query(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.baseApp +'/role?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

  saveResource(row,resourceids){
    let messageBody={};
   
     messageBody.roleid=row.id;
     messageBody.resourceids=resourceids;
     let param={};
     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.baseApp +'/role?method=saveRoleRes',type:'POST',data:param })
      .done(data => {
        this.actions.saveResourceSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  

  }

  saveOrUpdate(method,selectRow,messageBody){
     let url=MainConstant.baseApp +'/role?method=save';
      if(method=='modify'){
        url=MainConstant.baseApp +'/role?method=update';
        messageBody.id=selectRow.id;
        messageBody.gid=selectRow.gid
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
     $.ajax({ url: MainConstant.baseApp +'/role?method=del',type:'POST',data:param })
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
      messageBody.tablename='role';
      param.messageBody=  MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/dic?method=getDicLang',type:'POST',data:param})
      .done(data => {
        data.tablename='role';
        data.selectedRow=row;
        this.actions.getDicLangSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

   
  }

  
}

export default alt.createActions(RoleMngAction);