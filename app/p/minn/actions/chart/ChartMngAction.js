/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
import MessageUtil from '../../utils/MessageUtil';
class ChartMngAction {
  constructor() {
    this.generateActions('fail',
      'connectSuccess',
      'disconnectSuccess',
      'eventSuccess' 
    );
  }

  connect(){
 
  }



}

export default alt.createActions(ChartMngAction);