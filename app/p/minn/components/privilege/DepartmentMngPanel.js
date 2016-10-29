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
import DepartmentMngStore from '../../stores/privilege/DepartmentMngStore'
import DepartmentMngAction from '../../actions/privilege/DepartmentMngAction';
import GlobalizationPanel from './GlobalizationPanel';
class DepartmentMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,DepartmentMngStore);
  }
 
  componentDidMount() {
    DepartmentMngStore.listen(this.onChange);
    this.refreshTreeMenu(null);
    DepartmentMngAction.getDic(); 
    
    $('#menu_sub_div').on("click.jstree", function (e, data) {

       let messageBody={}; 
       
        if($('#curpage_id').val()==''){
            messageBody.page=0;
        }else{
           messageBody.page=$('#curpage_id').val();
        }
       
        messageBody.rp=MainConstant.sizePerPage;
        let query='-1';

        var nodes= $('#menu_sub_div').jstree(true).get_selected (true);
         if(nodes.length>0){
           query=nodes[0].id;
         } 
        
        query+=","
        if($('#name_id').val()==''){
          query+=MainConstant.UNKNOWN;
        }else{
          query+=$('#name_id').val();
        }

        messageBody.qtype="nodeid,name";
        messageBody.query=query;
        DepartmentMngAction.query(messageBody,nodes[0]);
    });       
  }

  componentWillUnmount() {
    DepartmentMngStore.unlisten(this.onChange);
  }

  onChange(state) {

     if(state.actionType=='getDicLangSuccess'){
       this.refs.globalization_id.init(state.dicData.LANGUAGE);
      this.refs.globalization_id.getDicLang(state._curid,state._tablename,state.columns,state.languagemkey,state.languagekey,state.langdata);
    }

    if(state.actionType=='getResourceSuccess'){
       this.invokeTreeMenu(state.treeMenuData);
    }
    if(state.actionType=='getDicSuccess'){
      $("#resource_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      MinnUtil.genSelectOptions($("#resource_id"),state.dicData.RESOURCETYPE,MainConstant.UNKNOWN,1);
      $("#resourceurltype_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      MinnUtil.genSelectOptions($("#resourceurltype_id"),state.dicData.RESOURCEURLTYPE,MainConstant.UNKNOWN,1);
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
     DepartmentMngAction.getResource(this.state.selectedRow); 
  }

  invokeTreeMenu(treeData){
     $('#menu_sub_div').empty();
     $('#menu_sub_div').removeAttr('class');
     $('#menu_sub_div').removeAttr('role');
     $('#menu_sub_div').jstree({ 'core' : {'data' :treeData} ,data:true});


  }

  saveResource(event){
     let  nodes=$('#menu_sub_div').jstree(true).get_checked(true);
     if(nodes.length==0){
    $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('role_resource_selected'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
      return;
     }
     let role_ids='';
     let key=new Object();
     for(let i=0;i<nodes.length;i++){
        let pathstr= $('#menu_sub_div').jstree(true).get_path(nodes[i],',',true);
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

    DepartmentMngAction.saveResource(this.state.selectedRow,role_ids);

  }

   delHandler(event){

    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#del_id').val();
       DepartmentMngAction.del(messageBody);

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
   
    let query='-1';

    var nodes= $('#menu_sub_div').jstree(true).get_selected (true);
     if(nodes.length>0){
       query=nodes[0].id;
     }
    
    query+=","
    if($('#name_id').val()==''){
      query+=MainConstant.UNKNOWN;
    }else{
      query+=$('#name_id').val();
    }
    query+=",";
    query+=$('#resource_id').val();
    query+=",";
    query+=$('#resourceurltype_id').val();

    messageBody.qtype="nodeid,name,resource,resourceurltype";
    messageBody.query=query;
    DepartmentMngAction.query(messageBody,nodes[0]);

  }

 
  onPageChange(page,sizePerPage){

    $('#curpage_id').val(page-1);
    let messageBody={};
    messageBody.page=page-1;
    messageBody.rp=sizePerPage;
   
    let query='-1';

     var nodes= $('#menu_sub_div').jstree(true).get_selected ();
     if(nodes.length>0){
       query=nodes[0];
     }
    
    query+=","
    if($('#name_id').val()==''){
      query+=MainConstant.UNKNOWN;
    }else{
      query+=$('#name_id').val();
    }

    messageBody.qtype="nodeid,name";
    messageBody.query=query;
   
    DepartmentMngAction.query(messageBody);
  }

 
  onRowSelect(row, isSelected , event){
     $('#del_id').val(row.id);  
       DepartmentMngAction.getSelected(row); 
    }

    showWinHandler(event){
      let nodes= $('#menu_sub_div').jstree(true).get_selected (true);

       if(nodes.length==0){
          this.alertShowMsg(this.minnUtil.get('department_resource_selected')); 
        
         return;
       }
     
     
      this.setState({ show: true,myMethod:'add'});
    }

  saveHandler(event){
    event.preventDefault();

      if(this.invokeSaveHandler()){
        return;
      }

      let messageBody={};
      var nodes= $('#menu_sub_div').jstree(true).get_selected ();
      messageBody.pId=nodes[0];
      messageBody.name=this.state.name;
      messageBody.language=$('#language_id').val();
      messageBody.code=this.state.code;
      messageBody.active=$('#common_active_id').val();


      DepartmentMngAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);
  
    }

     
    initData(event){
      if(this.state.myMethod=='add'){
        //$( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
       MinnUtil.genSelectOptions($('#common_active_id'),this.state.dicData.ACTIVETYPE,(this.state.myMethod=='add'? null:this.state.selectedRow.active_v));
       MinnUtil.genSelectOptions($('#language_id'),this.state.dicData.LANGUAGE,this.minnUtil.getCurrentLocale().split('_')[0]);

    }

    initGData(event){

      DepartmentMngAction.getDicLang(this.state.selectedRow);
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
      <div >
      <Panel header={this.minnUtil.get('department_title')} bsStyle="primary" className="modal-container flipInX animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={2}>
        <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <span className='spanlabel'>{this.minnUtil.get('department_tree')}:</span>
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
           <Well id="menu_sub_div" className="welllabel">
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
            <span className='spanlabel'>{this.minnUtil.get('common_name')} :</span>
            <div className='input-group ' >
              <input type='text' className='form-control' id="name_id" placeholder={this.minnUtil.get('common_search_name')} />
            </div>
            
            
            <div className='input-group '>
  
                <ButtonToolbar> 
                 <button className='btn btn-default'><span className='glyphicon glyphicon-search'></span></button> 
                <Button bsStyle="primary"  onClick={this.showWinHandler.bind(this)}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.modifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 <Button bsStyle="primary" onClick={this.showGHandler.bind(this)}>{this.minnUtil.get('globalization_field_language_setting')}</Button>
                 </ButtonToolbar>
              
            </div> 
          </form>
          
      <BootstrapTable data={this.state.data}  options={this.tableProp(this)} ref='datagrid_id' remote={true} fetchInfo={{dataTotalSize:this.state.total}}
       pagination={true} striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('common_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="pNode">{this.minnUtil.get('department_pId')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="code">{this.minnUtil.get('department_code')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="active">{this.minnUtil.get('common_active')}</TableHeaderColumn>
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
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('department_maintain')}</Modal.Title>
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
                    <FormControl type="input" id="name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.name}  onChange={DepartmentMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="language_id"  disabled={true}/>
                  </Col>
                </FormGroup>

                <FormGroup >
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('department_pId')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="pnodeId" ref="department_pId"   placeholder={this.minnUtil.get('department_pId')}  value={this.state.pNode} />
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_active')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="common_active_id"  />
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('department_code')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="code" ref="department_code_id"  placeholder={this.minnUtil.get('department_code')} value={this.state.code}  onChange={DepartmentMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.code)}</span>
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

export default DepartmentMngPanel;