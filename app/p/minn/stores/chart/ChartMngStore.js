/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MainConstant from '../../utils/MainConstant'; 
import ChartMngAction from '../../actions/chart/ChartMngAction';

class ChartMngStore {
  constructor() {
    this.bindActions(ChartMngAction);
    this.data={};
  }  

  onConnectSuccess(ws) { 
    this.ws = ws;
    this.actionType='connectSuccess';
  }


  
  onFail(failMessage) {
     this.failmsg=failMessage
     this.actionType='fail';
  }
  
    
}

export default alt.createStore(ChartMngStore);