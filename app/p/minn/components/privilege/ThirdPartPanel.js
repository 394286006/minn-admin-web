/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';
import templateComponent from './templateComponent';
import {Link} from 'react-router';
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Panel,ButtonToolbar,Button,Modal ,Grid,Row,Col,Table,Well,FormControl,DropdownButton,MenuItem,Form,FormGroup,ControlLabel,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
import ThirdPartStore from '../../stores/privilege/ThirdPartStore'
import ThirdPartAction from '../../actions/privilege/ThirdPartAction';

class ThirdPartPanel extends templateComponent {
  constructor(props) {
    super(props,ThirdPartStore);
  }

  componentDidMount() {
    ThirdPartStore.listen(this.onChange);
  }

  componentWillUnmount() {
    ThirdPartStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='getDicSuccess'){
      this.refresh(null);
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
        this.refresh(null);
    }
    if(state.actionType=='delSuccess'){
      $('#gdel_id').val('');
       this.refresh(null);
    }

    state.actionType='';
    this.setState(state);
  }

   delHandler(event){
    this.invokeDelHandler(function(){
      let messageBody={};
       messageBody.id=$('#c_del_id').val();
       ThirdPartAction.del(messageBody);

    });
  }


  init(id){
      ThirdPartAction.getDic();
      this.setState({_curid:id});

  }

  refresh(event) {
    if (event!=null)
       event.preventDefault();
    let messageBody={};
    messageBody.qtype="accountId";
    messageBody.query=this.state._curid;
   ThirdPartAction.query(messageBody);

  }

    saveOrUpdate(event){
      event.preventDefault();


      if($('#c_name_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('validate_check_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

      let messageBody={};
      messageBody.accountId=this.state._curid;
      messageBody.name=$('#c_name_id').val();
      messageBody.type=$('#c_type_id').val();
      messageBody.secretkey=$('#c_key_id').val();
      messageBody.active=$('#c_active_id').val();
      messageBody.mark=$('#c_mark_id').val();
      ThirdPartAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);

    }
    onRowSelect(row, isSelected , event){
       $('#c_del_id').val(row.id);
       ThirdPartAction.getSelectedData(row);
    }

    newHandler(event){

      this.setState({show:true,myMethod:'add'});
    }
    showModifyHandler(event){
      if($('#c_del_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

      this.setState({ show: true,myMethod:'modify'});

    }
    initData(event){
      if(this.state.myMethod=='add'){
        $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }else{
        $('#c_name_id').val(this.state.selectedRow.name);
        $('#c_key_id').val(this.state.selectedRow.secretkey);
        $('#c_mark_id').val(this.state.selectedRow.mark);
      }
      this.setState({ validationState:{alertVisible:'none',key:'',mark:'',name:'',input:false},helpBlock:{name:'',key:''}});

       MinnUtil.genSelectOptions($('#c_active_id'),this.state.dicData.ACTIVETYPE,this.state.selectedRow.active);
       MinnUtil.genSelectOptions($('#c_type_id'),this.state.dicData.ACCOUNTTHIRDPATH,this.state.selectedRow.type);
    }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={this.minnUtil.get('acount_thirdpart_manager')} bsStyle="primary"  closeButton>
           <Form horizontal id='submitform_id'>
            <input type='hidden' id="c_del_id" />
              <FormGroup>
                <Col smOffset={3} sm={9}>
                  <ButtonToolbar>
                    <Button bsStyle="primary"  onClick={this.newHandler.bind(this)}>{this.minnUtil.get('common_add')} </Button>
                    <Button bsStyle="primary" onClick={this.showModifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                    <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>

      <BootstrapTable data={this.state.data} options={this.tableProp(this)} ref='datagrid_id' remote={true}
        striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name" editable={{validator:true}} editColumnClassName='editing-jobsname-class' invalidEditColumnClassName='invalid-jobsname-class'>{this.minnUtil.get('common_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="secretkey" editable={true}>{this.minnUtil.get('account_thirdpart_key')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="type_name">{this.minnUtil.get('account_thirdpart_type')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="active_name">{this.minnUtil.get('common_active')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="mark">{this.minnUtil.get('common_mark')}</TableHeaderColumn>
        </BootstrapTable>
    </Panel>
    <Modal
        show={this.state.show}  onEntered={this.initData.bind(this)} dialogClassName='my-modal'
        onHide={() => this.setState({ show: false})}
        container={this}  id='gmngmodal_id' ref='gmngmodal_id'
        aria-labelledby="contained-modal-title">
        <Modal.Header  closeButton> 
          <Modal.Title id="contained-modal-title">{this.minnUtil.get('account_modify_title')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
              {this.minnUtil.get('validate_check_msg')}
           </Alert>
            <Form horizontal onSubmit={this.saveOrUpdate.bind(this)} id='submitform_id'>
               <FormGroup validationState={this.state.validationState.name} inline>
                <Col componentClass={ControlLabel} sm={3} >
                  {this.minnUtil.get('common_name')}
                </Col>
                <Col sm={6} >
                  <FormControl type="input" id="c_name_id" ref="c_name_id"  placeholder={this.minnUtil.get('common_name')}  />
                  <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                </Col>

              </FormGroup>

              <FormGroup validationState={this.state.validationState.key} inline>
                <Col componentClass={ControlLabel} sm={3} >
                  {this.minnUtil.get('account_thirdpart_key')}
                </Col>
                <Col sm={6} >
                  <FormControl type="input" id="c_key_id"  ref="c_key_id" placeholder={this.minnUtil.get('account_thirdpart_key')} />
                </Col>
              </FormGroup>
              <FormGroup  inline>
                <Col componentClass={ControlLabel} sm={3} >
                  {this.minnUtil.get('account_thirdpart_type')}
                </Col>
                <Col sm={6} >
                  <FormControl componentClass="select" id="c_type_id" ref="c_type_id"/>
                </Col>

              </FormGroup>

              <FormGroup  inline>
                <Col componentClass={ControlLabel} sm={3} >
                  {this.minnUtil.get('common_active')}
                </Col>
                <Col sm={6} >
                  <FormControl componentClass="select" id="c_active_id" ref="c_active_id"/>
                </Col>

              </FormGroup>
              <FormGroup  inline>
                <Col componentClass={ControlLabel} sm={3} >
                  {this.minnUtil.get('common_mark')}
                </Col>
                <Col sm={6} >
                  <FormControl type="input" id="c_mark_id" ref="c_mark_id" placeholder={this.minnUtil.get('common_mark')}/>
                </Col>

              </FormGroup>

              <FormGroup>
                <Col smOffset={4} sm={5}>
                  <Button bsStyle="primary"  type="submit"  id="common_ok_id">
                    {this.minnUtil.get('common_ok')}
                  </Button>
                </Col>
              </FormGroup>
            </Form>
        </Modal.Body>
      </Modal>
   </div>
    );
  }
}

export default ThirdPartPanel;
