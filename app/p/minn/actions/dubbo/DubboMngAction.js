/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
import MessageUtil from '../../utils/MessageUtil';
class DubboMngAction {
  constructor() {
    this.generateActions('fail',
      'getMsgSuccess' 
    );
  }


  getMsg(param){
    param.messageBody=MinnUtil.convert2Json(param);
    $.ajax({ url: MainConstant.dubboApp +'/consumer?method=getMsg',type:'POST',data:param })
      .done(data => {
       this.actions.getMsgSuccess(data.data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
 


}

export default alt.createActions(DubboMngAction);