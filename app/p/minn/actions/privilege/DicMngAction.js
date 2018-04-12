/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class DicMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getDicTypeSuccess',
      'getDicLangSuccess'
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
   getDicType() {

    $.ajax({ url: MainConstant.baseApp +'/dic?method=getDicType',type:'GET',data:{}})
      .done(data => {
        this.actions.getDicTypeSuccess(data);
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
     let url=MainConstant.baseApp +'/dic?method=save';
      if(method=='modify'){
        url=MainConstant.baseApp +'/dic?method=update';
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
     $.ajax({ url: MainConstant.baseApp +'/dic?method=del',type:'POST',data:param })
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
      messageBody.tablename='dictionary';
      param.messageBody=  MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/dic?method=getDicLang',type:'POST',data:param})
      .done(data => {
        data.tablename='dictionary';
        data.selectedRow=row;
        this.actions.getDicLangSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

   
  }
  
}

export default alt.createActions(DicMngAction);