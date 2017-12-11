/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';    
import {Link} from 'react-router'; 
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; 
import { Panel,ButtonToolbar,Button,Modal ,Grid,Row,Col,Table,Well,FormControl,DropdownButton,MenuItem,Form,FormGroup,ControlLabel,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import SocketClient from '../../utils/SocketClient';
import MessageUtil from '../../utils/MessageUtil';
import MainConstant from '../../utils/MainConstant'; 
import SocketMngStore from '../../stores/socket/SocketMngStore'
import SocketMngAction from '../../actions/socket/SocketMngAction';

class SocketMngPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = SocketMngStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document); 
    this.sc=null;
  }

  componentDidMount() {
    SocketMngStore.listen(this.onChange);
  }

  componentWillUnmount() {
    SocketMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='onDisconnectSuccess'){
       this.invokeShowMsg(state.data);
    }
   if(state.actionType=='eventSuccess'){
       this.eventSwitch(state.evt);
    }
     if(state.actionType=='fail'){
      MessageUtil.getInstance(document).showMessage(state.failmsg);
    }


    state.actionType='';
    this.setState(state); 
  }

   
 
 getMsg(event){
    let param={};
    param.method='msg';
    param.invokeMethod='invokeMsg';
    param.status=this.state.connectStatus;
    param.uuid='minn';
    param.group='-1';
    param.clientId='-1';
    param.data=new Object();  
    param.data.name='hello';
    param.data.id='1';
    SocketMngAction.getMsg(this.state.ws,param); 
    //this.sc.send(param);
  }
  disconnect(event){      
     SocketMngAction.disconnect(this.state.ws); 
  }
    
  eventSwitch(evt){

    switch(evt.invokeMethod){
      case 'invokeMsg':
       //$('#msg_id').text(evt.data.msg);
         this.invokeMsg(evt.data);
      break;   
      

    }  
     
  }

  invokeMsg(data){
   $('#msg_id').text(data.msg);
  }


 connect(event){
     SocketMngAction.connect('minn',$('#url').val()); 
     //this.sc=SocketClient.getInstance($('#url').val(),'minn',this.eventSwitch);
     //this.sc.connect();
  }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={'webSocket测试'} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={9}>
       <form className='navbar-form '>       
             
            <span className='spanlabel'>{'地址'} :</span>
            <div className='input-group ' >
              <input type='text' className='form-control' id='url' value={'ws://192.168.1.2:8990'}  />
            </div>
           
            <div className='input-group '>
  
                <ButtonToolbar> 

                <Button bsStyle="primary"  onClick={this.connect.bind(this)}>{'连接'} </Button>
                <Button bsStyle="primary" onClick={this.getMsg.bind(this)}>{'获取信息'}</Button>
                 <Button bsStyle="primary" onClick={this.disconnect.bind(this)}>{'退出'}</Button>
                 </ButtonToolbar>
              
            </div> 
          </form>
          <span className='spanlabel'>{'时间'} :</span><Well id='msg_id'></Well>
     
      </Col>
     
     </Row>
    </Grid>
    </Panel>
  
    
  </div>

    );
  }
}

export default SocketMngPanel;