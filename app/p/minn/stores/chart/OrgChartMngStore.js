/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MainConstant from '../../utils/MainConstant'; 
import OrgChartMngAction from '../../actions/chart/OrgChartMngAction';

class OrgChartMngStore {
  constructor() {
    this.bindActions(OrgChartMngAction);
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

export default alt.createStore(OrgChartMngStore);