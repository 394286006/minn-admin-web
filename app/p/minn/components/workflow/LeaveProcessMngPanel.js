/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';
import TemplateComponent from '../privilege/TemplateComponent';
import {Link} from 'react-router';
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; 
import { Panel,ButtonToolbar,Button,Modal ,Grid,Row,Col,Table,Well,FormControl,DropdownButton,MenuItem,Form,FormGroup,ControlLabel,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 
import LeaveProcessMngStore from '../../stores/workflow/LeaveProcessMngStore'
import LeaveProcessMngAction from '../../actions/workflow/LeaveProcessMngAction'; 
import GlobalizationPanel from '../privilege/GlobalizationPanel';
class LeaveProcessMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,LeaveProcessMngStore);
  }
 
  componentDidMount() {
    LeaveProcessMngStore.listen(this.onChange);
    this.refreshTreeMenu(null);
    LeaveProcessMngAction.getDic(); 
    
    $('#process_model_div').on("click.jstree", function (e, data) {

       let minnUtil=MinnUtil.getInstance(document); 

        var nodes= $('#process_model_div').jstree(true).get_selected (true);
        if($('#del_id').val()==''){
          $.alert({title: minnUtil.get('alert_title_msg'),content: minnUtil.get('workflow_config_process_selected'),confirmButton: minnUtil.get('main_alert_oklabel')});
          return;
        }
        LeaveProcessMngAction.selectedNode(nodes[0]);
         LeaveProcessMngAction.queryAudit(nodes[0],$('#del_id').val());

    });       
  }

  componentWillUnmount() {
    LeaveProcessMngStore.unlisten(this.onChange);
  }

  onChange(state) {  

     if(state.actionType=='getDicLangSuccess'){
       this.refs.globalization_id.init(state.dicData.LANGUAGE);
      this.refs.globalization_id.getDicLang(state._curid,state._tablename,state.columns,state.languagemkey,state.languagekey,state.langdata);
    }

    if(state.actionType=='queryModelTreeSuccess'){
       this.invokeTreeMenu(state.treeMenuData);
    }
    if(state.actionType=='getDicSuccess'){
    
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
       this.refresh(null);
    }
    if(state.actionType=='selectedNodeSuccess'){
  
       
    }
    if(state.actionType=='saveOrUpdateSHSuccess'){
       this.setState({ shShow: false});
       LeaveProcessMngAction.queryAudit(messageBody);
    }
    if(state.actionType=='delSuccess'){
      $('#del_id').val('');
       this.refresh(null);
    }
    if(state.actionType=='launchSuccess'){
      this.refresh(null);
    }
    if(state.actionType=='saveAuditSuccess'){
      this.setState({ shShow: false});
      LeaveProcessMngAction.queryAudit(state.selectedNode,$('#del_id').val());
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
     LeaveProcessMngAction.queryModelTree(); 
  }

  invokeTreeMenu(treeData){
     $('#process_model_div').empty();  
     $('#process_model_div').removeAttr('class');
     $('#process_model_div').removeAttr('role');
     $('#process_model_div').jstree({ 'core' : {'data' :treeData} ,data:true});


  }


   delHandler(event){

    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#del_id').val();
       LeaveProcessMngAction.del(messageBody);

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
   
    let query='';

    if($('#name_id').val()==''){
      query+=MainConstant.UNKNOWN;
    }else{
      query+=$('#name_id').val();
    }

    messageBody.qtype="name";
    messageBody.query=query;
    LeaveProcessMngAction.query(messageBody);

  }

 
  onPageChange(page,sizePerPage){

    $('#curpage_id').val(page-1);
    let messageBody={};
    messageBody.page=page-1;
    messageBody.rp=sizePerPage;
   
    let query='';

    if($('#name_id').val()==''){
      query+=MainConstant.UNKNOWN;
    }else{
      query+=$('#name_id').val();
    }
    messageBody.qtype="name";
    messageBody.query=query;
   
    LeaveProcessMngAction.query(messageBody);
  }

    
  onRowSelect(row, isSelected , event){
     $('#del_id').val(row.id);  
       LeaveProcessMngAction.getSelected(row); 
        var nodes= $('#process_model_div').jstree(true).get_selected (true);
       LeaveProcessMngAction.queryAudit(nodes[0],$('#del_id').val());
    }

    showWinHandler(event){

      this.setState({ show: true,myMethod:'add'});
    }

  saveHandler(event){
    event.preventDefault();

      if(this.invokeSaveHandler()){
        return;
      }

      let messageBody={};
       var nodes= $('#process_model_div').jstree(true).get_selected ();
        messageBody.name=this.state.name;
        messageBody.language=$('#language_id').val();
        messageBody.pdId='108_1';
        messageBody.desc=this.state.desc;
         messageBody.status=$('#status_id').val();
        messageBody.startTime=this.state.startTime; 
        messageBody.endTime=this.state.endTime;


      LeaveProcessMngAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);
  
    }

     
    initData(event){
      if(this.state.myMethod=='add'){
        $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
   
      
       MinnUtil.genSelectOptions($('#language_id'),this.state.dicData.LANGUAGE,this.minnUtil.getCurrentLocale().split('_')[0]);
        MinnUtil.genSelectOptions($('#status_id'),this.state.dicData.WORKFLOWSTATUS,(this.state.myMethod=='add'? null:this.state.selectedRow.status));
     }

    initGData(event){

      LeaveProcessMngAction.getDicLang(this.state.selectedRow);
    }

    showGHandler(event){
      if($('#del_id').val()==''){
        this.alertShowMsg(this.minnUtil.get('alert_select_del_msg'));
          return;
        }
      this.setState({ gshow: true}); 
    }
          
               
   showSHWinHandler(event){

      this.setState({ shShow: true,myMethod:'add'});
    }

   saveAuditHandler(event){
     event.preventDefault();
         
      let messageBody={};
      var nodes= $('#process_model_div').jstree(true).get_selected (true);
      console.log('node:'+nodes[0]['original']);
      messageBody.lpId=$('#del_id').val()+'';
      messageBody.language=$('#shlanguage_id').val();
      messageBody.pdId=nodes[0].id;
      messageBody.pId=this.state.pdId;  
      messageBody.comment=this.state.shDesc;
      messageBody.status=$('#shstatus_id').val();

      LeaveProcessMngAction.saveAudit(messageBody);  
   }
       
    initSHData(event){
      if(this.state.myMethod=='add'){
       // $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
      
       MinnUtil.genSelectOptions($('#shlanguage_id'),this.state.dicData.LANGUAGE,this.minnUtil.getCurrentLocale().split('_')[0]);
        MinnUtil.genSelectOptions($('#shstatus_id'),this.state.dicData.WORKFLOWPASS,(this.state.myMethod=='add'? null:this.state.selectedRow.status));
     }

     reLaunch(event){
      console.log('rerequest');
     }   

     launch(event){
      var nodes= $('#process_model_div').jstree(true).get_selected (true);
      console.log('language nodeid:'+nodes[0].original.pnId);
       LeaveProcessMngAction.launch($('#del_id').val()+'',nodes[0].id+'');   

     }


   
  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={this.minnUtil.get('menu_title')} bsStyle="primary" className="modal-container flipInX animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={2}>
        <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <span className='spanlabel'>{this.minnUtil.get('workflow_config_tree')}:</span>
                <div className='input-group '>
                <ButtonToolbar>               
                <Button bsStyle="primary" onClick={this.refreshTreeMenu.bind(this)}>{this.minnUtil.get('common_refresh')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="process_model_div" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
      </Col>
      <Col  md={10}>
          <form className='navbar-form '  onSubmit={this.refresh.bind(this)}>
               <input type='hidden' id="del_id" />
               <input type='hidden' id="curpage_id" />
            <span className='spanlabel'>{this.minnUtil.get('workflow_project_titlename')} :</span>
            <div className='input-group ' >
              <input type='text' className='form-control' id="name_id" placeholder={this.minnUtil.get('workflow_project_titlename')} />
            </div>
           
            <div className='input-group '>
  
                <ButtonToolbar> 
                 <button className='btn btn-default'><span className='glyphicon glyphicon-search'></span></button> 
                <Button bsStyle="primary"  onClick={this.showWinHandler.bind(this)}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.modifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 <Button bsStyle="primary" onClick={this.showGHandler.bind(this)}>{this.minnUtil.get('globalization_field_language_setting')}</Button>
                  <Button bsStyle="primary" onClick={this.reLaunch.bind(this)}>{this.minnUtil.get('workflow_config_rerequest')}</Button>
                  <Button bsStyle="primary" onClick={this.launch.bind(this)}>{this.minnUtil.get('leaveprocess_launch')}</Button>
                 </ButtonToolbar>
              
            </div>  
          </form>
          
      <BootstrapTable data={this.state.data}  options={this.tableProp(this)} ref='datagrid_id' remote={true} fetchInfo={{dataTotalSize:this.state.total}}
       pagination={true} striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)} >
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
       <TableHeaderColumn  dataField="requestName">{this.minnUtil.get('workflow_project_requestname')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="titleName">{this.minnUtil.get('workflow_project_titlename')}</TableHeaderColumn>
         <TableHeaderColumn  dataField="desc">{this.minnUtil.get('workflow_project_desc')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="startTime">{this.minnUtil.get('workflow_project_starttime')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="endTime">{this.minnUtil.get('workflow_project_endtime')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="statusName">{this.minnUtil.get('workflow_config_status')}</TableHeaderColumn>
        </BootstrapTable> 

      <form className='navbar-form '  >   
            <span className='spanlabel'>{this.minnUtil.get('workflow_config_node_name')} :</span>
            <div className='input-group '>
  
                <ButtonToolbar> 
                
                <Button bsStyle="primary"  onClick={this.showSHWinHandler.bind(this)}>{this.minnUtil.get('workflow_config_audit')} </Button>
                 
                 </ButtonToolbar>        
                  
            </div>    
          </form>
        <BootstrapTable data={this.state.auditData} options={this.tableProp(this)} ref='datagrid_audit_id' remote={true} 
       pagination={false} striped={true} hover={true} condensed={true} >
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
       <TableHeaderColumn  dataField="auditName">{this.minnUtil.get('workflow_config_auditname')}</TableHeaderColumn>
       <TableHeaderColumn  dataField="auditDept">{this.minnUtil.get('workflow_config_auditdept')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="step">{'步骤'}</TableHeaderColumn>
        <TableHeaderColumn  dataField="statusName">{this.minnUtil.get('workflow_project_auditstatus')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="comment">{this.minnUtil.get('workflow_project_desc')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="auditTime">{this.minnUtil.get('workflow_config_audittime')}</TableHeaderColumn>
        

        </BootstrapTable>

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
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('workflow_leaveprocess_title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')} 
             </Alert>
              <Form horizontal onSubmit={this.saveHandler.bind(this)} id='submitform_id' ref="submitform_id">
                <FormGroup validationState={this.state.validationState.name} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.name}  onChange={LeaveProcessMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="language_id"  disabled={true}/>
                  </Col>
                </FormGroup>
  
                <FormGroup  inline>
                 
                  <Col componentClass={ControlLabel} sm={2} > 
                    {this.minnUtil.get('workflow_project_auditstatus')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="status_id"  />
                  </Col>
                </FormGroup> 

                <FormGroup validationState={this.state.validationState.startTime} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('workflow_project_starttime')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="startTime" ref="starttime_id"   placeholder={this.minnUtil.get('workflow_project_starttime')}  value={this.state.startTime} onChange={LeaveProcessMngAction.updateValue}/>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('workflow_project_endtime')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="endTime" ref="endtime_id"   placeholder= {this.minnUtil.get('workflow_project_endtime')}  value={this.state.endTime} onChange={LeaveProcessMngAction.updateValue}/>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.desc} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                     {this.minnUtil.get('workflow_project_desc')}
                  </Col> 
                  <Col sm={10} >
                    <FormControl componentClass="textarea" id="desc" ref="desc_id"  placeholder={this.minnUtil.get('workflow_project_desc')} value={this.state.desc}  onChange={LeaveProcessMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.desc)}</span>
                  </Col>
                  
                </FormGroup> 
               
                <FormGroup>
                  <Col smOffset={5} sm={10}>
                    <Button bsStyle="primary"  type="submit"  id="common_ok_id" ref="common_ok_id">
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
             <GlobalizationPanel id='globalization_id' ref='globalization_id'/></Modal.Title>
          </Modal.Header>
        </Modal>

        <Modal 
          show={this.state.shShow}  onEntered={this.initSHData.bind(this)}
          onHide={() => this.setState({ shShow: false})}
          container={this}  id='shmodal_id' ref='shmodal_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('workflow_config_audit')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')} 
             </Alert>
              <Form horizontal onSubmit={this.saveAuditHandler.bind(this)} id='shsubmitform_id' ref="shsubmitform_id">
                <FormGroup >
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="shlanguage_id"  disabled={true}/>
                  </Col>
                </FormGroup>

                <FormGroup  inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {'状态'}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="shstatus_id"  />
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.shDesc} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {'原因'} 
                  </Col> 
                  <Col sm={10} >
                    <FormControl componentClass="textarea" id="shDesc" ref="shDesc_id"  placeholder={this.minnUtil.get('menu_code')} value={this.state.shDesc}  onChange={LeaveProcessMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.shDesc)}</span>
                  </Col>
                  
                </FormGroup> 
               
                <FormGroup>
                  <Col smOffset={5} sm={10}>
                    <Button bsStyle="primary"  type="submit"  id="shcommon_ok_id" ref="shcommon_ok_id">
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

export default LeaveProcessMngPanel;