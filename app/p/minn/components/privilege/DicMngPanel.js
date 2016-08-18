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
import DicMngStore from '../../stores/privilege/DicMngStore'
import DicMngAction from '../../actions/privilege/DicMngAction';
import GlobalizationPanel from './GlobalizationPanel';

class AccountMngPanel extends templateComponent {
  constructor(props) {
    super(props,DicMngStore);
  }
 
  componentDidMount() {
    DicMngStore.listen(this.onChange);
    DicMngAction.getDicType();
    DicMngAction.getDic(); 

           
  } 

  componentWillUnmount() {
    DicMngStore.unlisten(this.onChange);
  }

  onChange(state) {



    if(state.actionType=='getDicSuccess'){
      this.refs.globalization_id.init(state.dicData.LANGUAGE);
    }

    if(state.actionType=='getDicLangSuccess'){
    
      this.refs.globalization_id.getDicLang(state._curid,state._tablename,state.columns,state.languagemkey,state.languagekey,state.langdata);
    }
    if(state.actionType=='getDicTypeSuccess'){
      $("#dictype_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      for(let i=0;i<state.dicType.length;i++){
         $("#dictype_id").append("<option value='"+state.dicType[i].mkey+"'>"+state.dicType[i].name+"</option>");
      }
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
        this.refresh(null);
    }
    if(state.actionType=='delSuccess'){
      $('#del_id').val('');
       this.refresh(null);
    }
    
    state.actionType='';
    this.setState(state); 
  }


   delHandler(event){
    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#del_id').val();
       DicMngAction.del(messageBody);

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
   
    
    messageBody.qtype="pkey";
    messageBody.query=$('#dictype_id').val();
   
    DicMngAction.query(messageBody);

  }

 
  onPageChange(page,sizePerPage){

    $('#curpage_id').val(page-1);
    let messageBody={};
    messageBody.page=page-1;
    messageBody.rp=sizePerPage;

    messageBody.qtype="pkey";
    messageBody.query=$('#dictype_id').val();
   
    DicMngAction.query(messageBody);
  }

 
  onRowSelect(row, isSelected , event){
     $('#del_id').val(row.id);
       DicMngAction.getDicLang(row);
    }

  saveHandler(event){
    event.preventDefault();
     if(this.invokeSaveHandler()){
        return;
      }

      let messageBody={};
      messageBody.name=this.state.name;
      messageBody.language=$('#language_id').val();
      messageBody.mkey=this.state.key;
      messageBody.sort=this.state.sort;
      messageBody.val=this.state.keyval;
     
      DicMngAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);
  
    }

 
    initData(event){
      if(this.state.myMethod=='add'){
        $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
      this.setState({ validationState:{alertVisible:'none',code:'',comment:'',sort:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
         
       MinnUtil.genSelectOptions($('#language_id'),this.state.dicData.LANGUAGE,this.minnUtil.getCurrentLocale().split('_')[0]);
  
    }
   

  render() {

    return (
      <div >
      <Panel header={this.minnUtil.get('dictionary_mng_title')} bsStyle="primary" className="modal-container fadeIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={7}>
       <form className='navbar-form '  onSubmit={this.refresh.bind(this)}>
               <input type='hidden' id="del_id" />
               <input type='hidden' id="curpage_id" />
            
            <span className='spanlabel'>{this.minnUtil.get('dictionary_type')} :</span> 
            <div className='input-group selectlabel' >
                 <FormControl componentClass="select" id="dictype_id" >
                 </FormControl>
            </div>
           
            <div className='input-group '>
  
                <ButtonToolbar> 
                 <button className='btn btn-default'><span className='glyphicon glyphicon-search'></span></button> 
                <Button bsStyle="primary"  onClick={()=>this.setState({ show: true,myMethod:'add'})}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.modifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 </ButtonToolbar>
              
            </div> 
          </form>
          
      <BootstrapTable data={this.state.data}  options={this.tableProp(this)} ref='datagrid_id' remote={true} fetchInfo={{dataTotalSize:this.state.total}}
       pagination={true} striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('dictionary_field_keyval')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="pkey">{this.minnUtil.get('dictionary_field_keyval')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="value">{this.minnUtil.get('globalization_field_language')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="createname">{this.minnUtil.get('common_createname')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="createtime">{this.minnUtil.get('common_createtime')}</TableHeaderColumn>
        </BootstrapTable>
      </Col>
      <Col  md={5}>
          <Table responsive>
           <thead>
            <tr>
            <th>
            </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
             <GlobalizationPanel id='globalization_id' ref='globalization_id'/>
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
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('dictionary_modify_title')}</Modal.Title>
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
                    <FormControl type="input" id="name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.name}  onChange={DicMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={4} >
                    <FormControl componentClass="select" id="language_id"  disabled={true}/>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.key} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('dictionary_field_key')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="key" ref="dictionary_field_key_id"  placeholder={this.minnUtil.get('dictionary_field_key')} value={this.state.key}  onChange={DicMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.key)}</span>
                  </Col>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('dictionary_field_keyval')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="keyval" ref="dictionary_field_keyval_id"   placeholder={this.minnUtil.get('dictionary_field_keyval')}  value={this.state.keyval} onChange={DicMngAction.updateValue}/>
                     <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.keyval)}</span>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('dictionary_field_sort')}
                  </Col>
                  <Col sm={4} >
                    <FormControl type="input" id="sort" ref="dictionary_field_sort_id"   placeholder={this.minnUtil.get('dictionary_field_sort')}  value={this.state.sort} onChange={DicMngAction.updateValue}/>
                     <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.sort)}</span>
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
        
  </div>

    );
  }
}

export default AccountMngPanel;