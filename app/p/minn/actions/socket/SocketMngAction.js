/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
import MessageUtil from '../../utils/MessageUtil';
class SocketMngAction {
  constructor() {
    this.generateActions('fail',
      'connectSuccess',
      'disconnectSuccess',
      'eventSuccess' 
    );
  }

  connect(uuid,url){
 let fail=this.actions.fail;
   if("WebSocket" in window)
    {
      let param={};
      param.group=-1;
      param.clientId=-1;
      param.method='connect';
      param.invokeMethod='invokeConnect';
      param.data=new Object();
      param.data.msg='connect';
      param.status=MainConstant.CONNECT;
      param.uuid=uuid;
      let ws = new WebSocket(url);
      let connectSuccess=this.actions.connectSuccess;
      ws.onopen = function()
      {
         ws.send(MinnUtil.convert2Json(param));
        connectSuccess(ws);
      };
      let eventSuccess=this.actions.eventSuccess;
      ws.onmessage = function (evt) 
      { 
         console.log('receive onmessage'+evt.data);
          let data=JSON.parse(evt.data);
          switch(data.status){
            case MainConstant.CONNECTFAIL:
              MessageUtil.getInstance(document).showMessage(data.data.msg);
            break;
            case MainConstant.CONNECTED:
              MessageUtil.getInstance(document).showMessage(data.data.msg);
              eventSuccess(data);
            break;
            case MainConstant.CONNECT:
              MessageUtil.getInstance(document).showMessage(data.data.msg);
            break;
            case MainConstant.CONNECTING:
             eventSuccess(data);
            break;
          }  
         
      };
    
      ws.onclose = function()
      { 
        fail("Connection is closed...");
      };
    }else{
       fail("WebSocket NOT supported by your Browser!");
    }
  }

  getMsg(ws,param){
     let str=MinnUtil.convert2Json(param);
     ws.send(str);
  }
 

  disconnect(ws){
    ws.close();
  MessageUtil.getInstance(document).showMessage('用户退出');
  
  }

}

export default alt.createActions(SocketMngAction);