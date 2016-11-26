/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MainConstant from '../../utils/MainConstant'; 
import SocketMngAction from '../../actions/socket/SocketMngAction';

class SocketMngStore {
  constructor() {
    this.bindActions(SocketMngAction);
    this.data={};
    this.evt=null;
    this.ws =null;
    this.url='ws://localhost:8990';
    this.failmsg='';
    this.connectStatus=MainConstant.CONNECT;
  }  

  onConnectSuccess(ws) { 
    this.ws = ws;
    this.actionType='connectSuccess';
  }

   onEventSuccess(evt) { 
    this.evt = evt;
    if(evt.status==MainConstant.CONNECTED){
      this.connectStatus=MainConstant.CONNECTING;
      evt.status=MainConstant.CONNECTING;
    }else{
       this.actionType='eventSuccess';
    }
   
  }

  onDisconnectSuccess(data) { 
    this.data = data.data;
    this.actionType='disconnectSuccess';
  }
  
  onFail(failMessage) {
     this.failmsg=failMessage
     this.actionType='fail';
  }
  
    
}

export default alt.createStore(SocketMngStore);