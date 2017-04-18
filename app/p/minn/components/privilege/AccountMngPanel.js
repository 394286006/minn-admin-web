/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';
import TemplateComponent from './TemplateComponent';
import {Link} from 'react-router';
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import { Panel,ButtonToolbar,Button,Modal ,Grid,Row,Col,Table,Well,FormControl,DropdownButton,MenuItem,Form,FormGroup,ControlLabel,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
import AccountMngStore from '../../stores/privilege/AccountMngStore'
import AccountMngAction from '../../actions/privilege/AccountMngAction';
import ThirdPartPanel from './ThirdPartPanel';

class AccountMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,AccountMngStore);
  }

  componentDidMount() {
    AccountMngStore.listen(this.onChange);
    this.refreshTreeMenu(null);
    AccountMngAction.getDic();

  }

  componentWillUnmount() {
    AccountMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='getAccountRoleSuccess'){
       this.invokeTreeMenu(state.treeMenuData);
    }
    if(state.actionType=='getDicSuccess'){

      let actives=state.dicData.ACTIVETYPE;
      $("#active_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      MinnUtil.genSelectOptions($("#active_id"),state.dicData.ACTIVETYPE,MainConstant.UNKNOWN,1);
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
        this.refresh(null);
    }
    if(state.actionType=='delSuccess'){
      $('#del_id').val('');
       this.refresh(null);
    }
    if(this.state.result){
      if(this.state.result.sucess==false){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.state.result.messageBody,confirmButton: this.minnUtil.get('main_alert_oklabel')});

      }
    }

    state.actionType='';
    this.setState(state);
  }

  refreshTreeMenu(event){
     AccountMngAction.getAccountRole(this.state.selectedRow);
  }

  invokeTreeMenu(treeData){
     $('#menu_sub_sys_div').empty();
     $('#menu_sub_sys_div').removeAttr('class');
     $('#menu_sub_sys_div').removeAttr('role');
     $('#menu_sub_sys_div').jstree({ 'checkbox':{'three_state':false},'cascade':false,'plugins':["checkbox"],'core' : {'data' :treeData} });
  }

  saveResource(event){
     let  nodes=$('#menu_sub_sys_div').jstree(true).get_checked(true);
      if(nodes.length==0){
    $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('role_resource_selected'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
      return;
     }
     let role_ids='';
     let key=new Object();
     for(let i=0;i<nodes.length;i++){
        let pathstr= $('#menu_sub_sys_div').jstree(true).get_path(nodes[i],',',true);
        let ids=pathstr.split(",");
        for(let j=0;j<ids.length;j++){
          key['p_'+ids[j]]=ids[j];
        }

       }
     for(let k in key){
       if(role_ids!=""){
         role_ids+=",";
       }
       role_ids+=key[k];
     }

    AccountMngAction.saveResource(this.state.selectedRow,role_ids);

  }

  delHandler(event){
    this.invokeDelHandler(function(){
      let messageBody={};
       messageBody.id=$('#del_id').val();
       AccountMngAction.del(messageBody);

    });
  }

  refresh(event) {
    if (event!=null)
       event.preventDefault();
    let messageBody={};

    if($('#curpage_id').val()==''){
        messageBody.page=0;
    }else{
       messageBody.page=$('#curpage_id').val();
    }

    messageBody.rp=this.refs.datagrid_id.props.options.sizePerPage;

    let query=MainConstant.UNKNOWN;

    if($('#name_id').val()==''){
      query=MainConstant.UNKNOWN;
    }else{
      query=$('#name_id').val();
    }
    query+=","

    query+=$('#active_id').val();


    messageBody.qtype="name,active";
    messageBody.query=query;

    AccountMngAction.query(messageBody);

  }


  onPageChange(page,sizePerPage){

    $('#curpage_id').val(page-1);
    let messageBody={};
    messageBody.page=page-1;
    messageBody.rp=sizePerPage;

    let query=MainConstant.UNKNOWN;

    if($('#name_id').val()==''){
      query=MainConstant.UNKNOWN;
    }else{
      query=$('#name_id').val();
    }
    query+=","
    if($('#active_id').val()==''){
      query+=$('#active_id').val();
    }else{
      query+=MainConstant.UNKNOWN;
    }

    messageBody.qtype="name,active";
    messageBody.query=query;

    AccountMngAction.query(messageBody);
  }


  onRowSelect(row, isSelected , event){
     $('#del_id').val(row.id);
    if(isSelected)
     AccountMngAction.getAccountRole(row);
    }

  saveHandler(event){
      event.preventDefault();
      if(this.invokeSaveHandler()){
        return;
      }

      let messageBody={};
      messageBody.name=this.state.name;
      messageBody.pwd=this.state.pwd;
      messageBody.type=$('#type_id').val();
      messageBody.loginType=$('#logintype_id').val();
      messageBody.active=$('#common_active_id').val();
      messageBody.departmentId=$('#dep_id').val();

      AccountMngAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);

    }

    initData(event){
      if(this.state.myMethod=='add'){
        //$( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
      this.setState({ validationState:{alertVisible:'none',pwd:'',name:'',input:false},helpBlock:{pwd:'',name:''}});

       MinnUtil.genSelectOptions($('#dep_id'),this.state.dicData.DEPARTMENTCODE,(this.state.myMethod=='add'? null:this.state.selectedRow.departmentId));
       MinnUtil.genSelectOptions($('#common_active_id'),this.state.dicData.ACTIVETYPE,(this.state.myMethod=='add'? null:this.state.selectedRow.active));
       MinnUtil.genSelectOptions($('#logintype_id'),this.state.dicData.LOGINTYPE,(this.state.myMethod=='add'? null:this.state.selectedRow.logintype));
       MinnUtil.genSelectOptions($('#type_id'),this.state.dicData.ACCOUNTTYPE,(this.state.myMethod=='add'? null:this.state.selectedRow.type));



    }

    thirdPartHandler(event){
      if($('#del_id').val()==''){
           $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
           return;
         }
        this.setState({ gshow: true});

    }

    initGData(event){
      this.refs.thirdPart_id.init(this.state.selectedRow.id);
    }

  render() {

    return (
      <div >
      <Panel header={this.minnUtil.get('account_title')} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={9}>
       <form className='navbar-form '  onSubmit={this.refresh.bind(this)}>
               <input type='hidden' id="del_id" />
               <input type='hidden' id="curpage_id" />
            <span className='spanlabel'>{this.minnUtil.get('common_search_name')} :</span>
            <div className='input-group ' >
              <input type='text' className='form-control' id="name_id" placeholder={this.minnUtil.get('common_search_name')} />
            </div>
            <span className='spanlabel'>{this.minnUtil.get('common_active')} :</span>
            <div className='input-group selectlabel' >
                 <FormControl componentClass="select" id="active_id" placeholder={this.minnUtil.get('common_active')} >
                 </FormControl>
            </div>

            <div className='input-group '>

                <ButtonToolbar>
                 <button className='btn btn-default'><span className='glyphicon glyphicon-search'></span></button>
                 <Button bsStyle="primary"  onClick={()=>this.setState({ show: true,myMethod:'add'})}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.modifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 <Button bsStyle="primary" onClick={this.thirdPartHandler.bind(this)}>{this.minnUtil.get('account_thirdpart')}</Button>
                 </ButtonToolbar>

            </div>
          </form>

      <BootstrapTable data={this.state.data}  options={this.tableProp(this)} ref='datagrid_id' remote={true} fetchInfo={{dataTotalSize:this.state.total}}
       pagination={true} striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('account_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="type_name">{this.minnUtil.get('account_type')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="logintype_name">{this.minnUtil.get('account_logintype')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="active_name">{this.minnUtil.get('common_active')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="department_name">{this.minnUtil.get('common_active')}</TableHeaderColumn>
        </BootstrapTable>
      </Col>
      <Col  md={3}>
          <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <span className='spanlabel'>{this.minnUtil.get('account_resource_tree')}:</span>
                <div className='input-group '>
                <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.saveResource.bind(this)}>{this.minnUtil.get('account_save_account_resource')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="menu_sub_sys_div" className="welllabel">
            </Well>
          </td>
          </tr>
        </tbody>
        </Table>
        </Col>
     </Row>
    </Grid>
    </Panel>

      <Modal
          show={this.state.show}  onEntered={this.initData.bind(this)}
          onHide={() => this.setState({ show: false})}
          container={this}  id='mngmodal_id' ref='mngmodal_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('account_maintain')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')}
             </Alert>
              <Form horizontal onSubmit={this.saveHandler.bind(this)} id='submitform_id'>
                <FormGroup validationState={this.state.validationState.name} >
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.name}  onChange={AccountMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.pwd}>
                  <Col componentClass={ControlLabel} sm={2} >
                      {this.minnUtil.get('account_pwd')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="password" id="pwd"  placeholder={this.minnUtil.get('account_pwd')} value={this.state.pwd} onChange={AccountMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.pwd)}</span>
                  </Col>
                </FormGroup>
                <FormGroup >
                  <Col componentClass={ControlLabel} sm={2}>
                        {this.minnUtil.get('account_type')}
                  </Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" id="type_id"  >

                  </FormControl>
                  </Col>
                </FormGroup>
                 <FormGroup >
                  <Col componentClass={ControlLabel} sm={2}>
                        {'部门'}
                  </Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" id="dep_id"  >

                  </FormControl>
                  </Col>
                </FormGroup>

                 <FormGroup >
                  <Col componentClass={ControlLabel} sm={2}>
                        {this.minnUtil.get('account_logintype')}
                  </Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" id="logintype_id"  >
                  </FormControl>
                  </Col>
                </FormGroup>
                <FormGroup >
                  <Col componentClass={ControlLabel} sm={2}>
                        {this.minnUtil.get('common_active')}
                  </Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" id="common_active_id"  >

                  </FormControl>
                  </Col>
                </FormGroup>

                <FormGroup>
                  <Col smOffset={5} sm={10}>
                    <Button bsStyle="primary"  type="submit"  id="common_ok_id">
                      {this.minnUtil.get('common_ok')}
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
          </Modal.Body>
        </Modal>

        <Modal onEntered={this.initGData.bind(this)}
          show={this.state.gshow}
          onHide={() => this.setState({ gshow: false})}
          container={this}  id='gmngmodal_id' ref='gmngmodal_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
             <ThirdPartPanel id='thirdPart_id' ref='thirdPart_id'/></Modal.Title>
          </Modal.Header>
        </Modal>
  </div>

    );
  }
}

export default AccountMngPanel;
