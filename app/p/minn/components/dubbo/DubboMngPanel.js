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
import MessageUtil from '../../utils/MessageUtil';
import MainConstant from '../../utils/MainConstant'; 
import DubboMngStore from '../../stores/dubbo/DubboMngStore'
import DubboMngAction from '../../actions/dubbo/DubboMngAction';

class DubboMngPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = DubboMngStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document); 
    this.sc=null;
  }

  componentDidMount() {
    DubboMngStore.listen(this.onChange);
  }

  componentWillUnmount() {
    DubboMngStore.unlisten(this.onChange);
  }

  onChange(state) {

   if(state.actionType=='getMsgSuccess'){
       this.invokeMsg(state.data);
    }
     if(state.actionType=='fail'){
      MessageUtil.getInstance(document).showMessage(state.failmsg);
    }


    state.actionType='';
    this.setState(state); 
  }

   
 
 getMsg(event){
    let param={};
    param.name='minn';
    param.qq='394286006';
  
    DubboMngAction.getMsg(param); 
    //this.sc.send(param);
  }


  invokeMsg(data){
   $('#msg_id').text(data.msg);
  }



  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={'dubbo集成测试'} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={9}>
       <form className='navbar-form '>       
             
            <span className='spanlabel'>{'请求'} :</span>
            
           
            <div className='input-group '>
  
                <ButtonToolbar> 

                <Button bsStyle="primary" onClick={this.getMsg.bind(this)}>{'获取信息'}</Button>
                 </ButtonToolbar>
              
            </div> 
          </form>
          <span className='spanlabel'>{'信息'} :</span><Well id='msg_id'></Well>
     
      </Col>
     
     </Row>
    </Grid>
    </Panel>
  
    
  </div>

    );
  }
}

export default DubboMngPanel;