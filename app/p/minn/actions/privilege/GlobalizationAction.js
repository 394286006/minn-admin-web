/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class GlobalizationAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getDicTypeSuccess',
      'getDicLangSuccess',
      'getGlobalDataSuccess'
    );
  }

  getDic() {

    $.ajax({ url: MainConstant.baseApp +'/dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'LANGUAGE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }


   getDicLang(messageBody) {

      let param={};
      param.messageBody=  MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/dic?method=getDicLang',type:'GET',data:param})
      .done(data => {
        this.actions.getDicLangSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  

    query(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: MainConstant.baseApp +'/dic?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }


  saveOrUpdate(method,selectRow,messageBody){
     let url=MainConstant.baseApp +'/gla?method=save';
      if(method=='modify'){
        url=MainConstant.baseApp +'/gla?method=update';
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
     $.ajax({ url: MainConstant.baseApp +'/gla?method=del',type:'POST',data:param })
      .done(data => {

        this.actions.delSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.delFail(jqXhr.responseJSON.message);
      });
  }

  getGlobalData(row){
    this.actions.getGlobalDataSuccess(row);
  }
  
}

export default alt.createActions(GlobalizationAction);