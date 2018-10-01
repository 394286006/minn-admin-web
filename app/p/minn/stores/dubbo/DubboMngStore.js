/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MainConstant from '../../utils/MainConstant'; 
import DubboMngAction from '../../actions/dubbo/DubboMngAction';

class DubboMngStore {
  constructor() {
    this.bindActions(DubboMngAction);
    this.data={};
    this.failmsg='';
  }  


   onGetMsgSuccess(data) { 
      this.actionType='getMsgSuccess';
      this.data=data;
  }

  onFail(failMessage) {
     this.failmsg=failMessage
     this.actionType='fail';
  }
  
    
}

export default alt.createStore(DubboMngStore);