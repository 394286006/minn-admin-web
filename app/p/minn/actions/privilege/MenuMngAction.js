/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from './TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
class MenuMngAction extends TemplateAction{
  constructor() {
    super();
    this.generateActions(
      'getResourceSuccess'
    );
  }

  getDic() {

    $.ajax({ url: 'dic',type:'GET',data:{method:'getDic',aptype:'swf',type:'\'LANGUAGE\',\'RESOURCETYPE\',\'RESOURCEURLTYPE\',\'ACTIVETYPE\''}})
      .done(data => {
        this.actions.getDicSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  
 getResource() {
    let messageBody={};
     
     let param={};

     
    $.ajax({ url: 'menu?method=getResource&atype=swf',type:'GET',data:param })
      .done(data => {
        this.actions.getResourceSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  
  }

    query(messageBody) {
   
    let param={};

     param.messageBody=MinnUtil.convert2Json(messageBody);

    $.ajax({ url: 'menu?method=query',type:'POST',data:param})
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

    
     let url='menu?method=save';
      if(method=='modify'){
        url='menu?method=update';
        messageBody.id=selectRow.id;
        messageBody.gid=selectRow.gid;
        messageBody.pId=selectRow.pId;
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
     $.ajax({ url: 'menu?method=del',type:'POST',data:param })
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
    $.ajax({ url: 'dic?method=getDicLang',type:'POST',data:param})
      .done(data => {
        data.tablename='resource';
        data.selectedRow=row;
        this.actions.getDicLangSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

   
  }
  
}

export default alt.createActions(MenuMngAction);