/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from '../privilege/TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
class LuceneMngAction extends TemplateAction{
  constructor() {
    super(); 
    this.generateActions(
      'addSuccess',
      'querySuccess'
    );
  }

  add(name,age){
     let messageBody={};
    let param={};
    messageBody.name=name;
    messageBody.age=age;
    param.messageBody=MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/lucene?method=add',type:'POST',data:param })
      .done(data => {
       this.actions.addSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }


query(name){
    let messageBody={};
    let param={};
    messageBody.name=name;
    param.messageBody=MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp + '/lucene?method=query',type:'POST',data:param })
      .done(data => {
        this.actions.querySuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

  }
}

export default alt.createActions(LuceneMngAction);
