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
import RoleMngStore from '../../stores/privilege/RoleMngStore'
import RoleMngAction from '../../actions/privilege/RoleMngAction';
import GlobalizationPanel from './GlobalizationPanel';

class RoleMngPanel extends templateComponent {
  constructor(props) {
    super(props,RoleMngStore);
  }
 
  componentDidMount() {
    RoleMngStore.listen(this.onChange);
    this.refreshTreeMenu(null);
    RoleMngAction.getDic(); 
           
  }

  componentWillUnmount() {
    RoleMngStore.unlisten(this.onChange);
  }

  onChange(state) {

   if(state.actionType=='getDicLangSuccess'){
       this.refs.globalization_id.init(state.dicData.LANGUAGE);
      this.refs.globalization_id.getDicLang(state._curid,state._tablename,state.columns,state.languagemkey,state.languagekey,state.langdata);
    }
    if(state.actionType=='onGetTreeDataSuccess'){
       this.invokeTreeMenu(state.treeMenuData);
    }
    if(state.actionType=='getDicSuccess'){
     
      let actives=state.dicData.ACTIVETYPE;
      $("#role_active_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      MinnUtil.genSelectOptions($("#role_active_id"),state.dicData.ACTIVETYPE,MainConstant.UNKNOWN,1);
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
        this.refresh(null);
    }
    if(state.actionType=='delSuccess'){
      $('#del_id').val('');
       this.refresh(null);
    }
    if(state.actionType=='saveResourceSuccess'){

        $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_success_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});

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
     RoleMngAction.getTreeData(this.state.selectedRow); 
  }

  invokeTreeMenu(treeData){
     $('#role_sys_menu_div').empty();
     $('#role_sys_menu_div').removeAttr('class');
     $('#role_sys_menu_div').removeAttr('role');
     $('#role_sys_menu_div').jstree({ 'checkbox':{'three_state':false},'cascade':false,'plugins':["checkbox"],'core' : {'data' :treeData} });
  }

  saveResource(event){
     let  nodes=$('#role_sys_menu_div').jstree(true).get_checked(true);
      if(nodes.length==0){
    $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('role_resource_selected'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
      return;
     }
     let resourceids='';
     let key=new Object();
     for(let i=0;i<nodes.length;i++){
        let pathstr= $('#role_sys_menu_div').jstree(true).get_path(nodes[i],',',true);
        let ids=pathstr.split(",");
        for(let j=0;j<ids.length;j++){
          key['p_'+ids[j]]=ids[j];
        }
        
       }
     for(let k in key){
       if(resourceids!=""){
         resourceids+=",";
       }
       resourceids+=key[k];
     }

    RoleMngAction.saveResource(this.state.selectedRow,resourceids);

  }


   delHandler(event){
    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#del_id').val();
       RoleMngAction.del(messageBody);

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
  
    query+=$('#role_active_id').val();
   
    
    messageBody.qtype="name,active";
    messageBody.query=query;
   
    RoleMngAction.query(messageBody);

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
    if($('#role_active_id').val()==''){
      query+=$('#role_active_id').val();
    }else{
      query+=MainConstant.UNKNOWN;
    }
    
    messageBody.qtype="name,active";
    messageBody.query=query;
   
    RoleMngAction.query(messageBody);
  }

 
  onRowSelect(row, isSelected , event){
     $('#del_id').val(row.id);
    if(isSelected)
     RoleMngAction.getTreeData(row); 
    }

  saveHandler(event){
    event.preventDefault();
     if(this.invokeSaveHandler()){
        return;
      }

      let messageBody={};
      messageBody.name=this.state.name;
      messageBody.language=$('#language_id').val();
      messageBody.code=this.state.code;
      messageBody.sort=this.state.sort;
      messageBody.comment=this.state.comment;
      messageBody.active=$('#common_role_active_id').val();
     
      RoleMngAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);
  
    }

 
    initData(event){
      if(this.state.myMethod=='add'){
        $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
      this.setState({ validationState:{alertVisible:'none',code:'',comment:'',sort:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
         
       MinnUtil.genSelectOptions($('#language_id'),this.state.dicData.LANGUAGE,this.minnUtil.getCurrentLocale().split('_')[0]);
       MinnUtil.genSelectOptions($('#common_role_active_id'),this.state.dicData.ACTIVETYPE,(this.state.myMethod=='add'? null:this.state.selectedRow.active));

    }
  
   initGData(event){

      RoleMngAction.getDicLang(this.state.selectedRow);
    }

    showGHandler(event){
      if($('#del_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }
      this.setState({ gshow: true});
    }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={this.minnUtil.get('role_title')} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={9}>
       <form className='navbar-form '  onSubmit={this.refresh.bind(this)}>
               <input type='hidden' id="del_id" />
               <input type='hidden' id="curpage_id" />
            <span className='spanlabel'>{this.minnUtil.get('role_name')} :</span>
            <div className='input-group ' >
              <input type='text' className='form-control' id="name_id" placeholder={this.minnUtil.get('common_search_name')} />
            </div>
            <span className='spanlabel'>{this.minnUtil.get('common_active')} :</span> 
            <div className='input-group selectlabel' >
                 <FormControl componentClass="select" id="role_active_id" placeholder={this.minnUtil.get('common_active')} >
                 </FormControl>
            </div>
           
            <div className='input-group '>
  
                <ButtonToolbar> 
                 <button className='btn btn-default'><span className='glyphicon glyphicon-search'></span></button> 
                <Button bsStyle="primary"  onClick={()=>this.setState({ show: true,myMethod:'add'})}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.modifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 <Button bsStyle="primary" onClick={this.showGHandler.bind(this)}>{this.minnUtil.get('globalization_field_language_setting')}</Button>
                 </ButtonToolbar>
              
            </div> 
          </form>
          
      <BootstrapTable data={this.state.data}  options={this.tableProp(this)} ref='datagrid_id' remote={true} fetchInfo={{dataTotalSize:this.state.total}}
       pagination={true} striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('role_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="code">{this.minnUtil.get('role_code')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="active_name">{this.minnUtil.get('common_active')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="sort">{this.minnUtil.get('role_sort')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="comment">{this.minnUtil.get('role_comment')}</TableHeaderColumn>
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
                <Button bsStyle="primary" onClick={this.saveResource.bind(this)}>{this.minnUtil.get('role_save_role_resource')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="role_sys_menu_div" className="welllabel">
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
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('role_maintain')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')} 
             </Alert>
              <Form horizontal onSubmit={this.saveHandler.bind(this)} id='submitform_id'>
                 <FormGroup validationState={this.state.validationState.name} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.name}  onChange={RoleMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="language_id"  disabled={true}/>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('role_code')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="code" ref="role_code_id"  placeholder={this.minnUtil.get('role_code')} value={this.state.code}  onChange={RoleMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.code)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_active')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="common_role_active_id"  />
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('role_sort')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="sort" ref="role_sort"   placeholder={this.minnUtil.get('role_sort')}  value={this.state.sort} onChange={RoleMngAction.updateValue}/>
                     <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.sort)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('role_comment')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="comment" ref="role_comment"   placeholder={this.minnUtil.get('role_comment')}  value={this.state.comment} onChange={RoleMngAction.updateValue}/>
                     <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.comment)}</span>
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
             <GlobalizationPanel id='globalization_id' ref='globalization_id'/></Modal.Title>
          </Modal.Header>
        </Modal>
  </div>

    );
  }
}

export default RoleMngPanel;