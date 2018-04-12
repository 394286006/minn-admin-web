/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateAction from '../privilege/TemplateAction';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
class AiMngAction extends TemplateAction{
  constructor() {
    super(); 
    this.generateActions(
      'uploadSuccess',
      'compareTensorflowSuccess',
      'clearImgSuccess'
    );
  }

  uploadSuccess(file){
    this.actions.uploadSuccess(file);
  }

  clearImg(){
    this.actions.clearImgSuccess();
  }

compareTensorflow(filename){
    let messageBody={};
    let param={};
    messageBody.filename=filename;
    param.messageBody=MinnUtil.convert2Json(messageBody);
    $.ajax({ url: MainConstant.baseApp +'/tensorflow?method=compare',type:'POST',data:param })
      .done(data => {
        this.actions.compareTensorflowSuccess(data);
      })
      .fail(jqXhr => {
        this.actions.fail(jqXhr.responseJSON.message);
      });

  }
}

export default alt.createActions(AiMngAction);
