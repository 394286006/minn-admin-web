/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
class ThirdPartAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getDicTypeSuccess',
      'getDicLangSuccess',
      'getSelectedDataSuccess'
    );
  }

  getDic() {

    $.ajax({ url: 'dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'ACCOUNTTHIRDPATH\',\'ACTIVETYPE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }

    query(messageBody) {

    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: 'acountTP?method=query',type:'POST',data:param})
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
    }

  saveOrUpdate(method,selectRow,messageBody){
     let url='acountTP?method=save';
      if(method=='modify'){
        url='acountTP?method=update';
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
     $.ajax({ url: 'acountTP?method=del',type:'POST',data:param })
      .done(data => {

        this.actions.delSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.delFail(jqXhr.responseJSON.message);
      });
  }

  getSelectedData(row){
    this.actions.getSelectedDataSuccess(row);
  }

}

export default alt.createActions(ThirdPartAction);
