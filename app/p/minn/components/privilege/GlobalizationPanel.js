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
import GlobalizationStore from '../../stores/privilege/GlobalizationStore'
import GlobalizationAction from '../../actions/privilege/GlobalizationAction';

class GlobalizationPanel extends templateComponent {
  constructor(props) {
    super(props,GlobalizationStore);
    this.langdata=[];
    this._curid='';
    this._tablename='';
    this.columns=[];
    this.languagemkey={};
    this.languagekey={};
    this.langs=[];
  }

  componentDidMount() {
    GlobalizationStore.listen(this.onChange);


  }

  componentWillUnmount() {
    GlobalizationStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='getDicLangSuccess'){
      MinnUtil.genSelectOptions($("#column_id"),state.columns);

      for(let i=0;i<state.data.length;i++){
            state.data[i].languagename=this.languagemkey[state.data[i].language];
            state.data[i].languageidx=this.languagekey[state.data[i].language]
          }

    }
    if(state.actionType=='getDicTypeSuccess'){
      $("#dictype_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
      for(let i=0;i<state.dicType.length;i++){
         $("#dictype_id").append("<option value='"+state.dicType[i].MKEY+"'>"+state.dicType[i].name+"</option>");
      }
    }
    if(state.actionType=='saveOrUpdateSuccess'){
       this.setState({ show: false});
        this.refresh(null);
    }
    if(state.actionType=='delSuccess'){
      $('#gdel_id').val('');
       this.refresh(null);
    }

   if(state.actionType=='getGlobalDataSuccess'){
       state.data=this.state.data;
       $('#gname_id').val(state.selectedRow.name);
      MinnUtil.genSelectOptions($('#glanguage_id'),this.langs,state.selectedRow.language);
      MinnUtil.genSelectOptions($('#column_id'),this.columns,state.selectedRow.tablecolumn);
    }
      state.actionType='';
    this.setState(state);
  }


   delHandler(event){
    this.invokeDelHandler(function(){
      let messageBody={};
       messageBody.id=$('#gdel_id').val();
       GlobalizationAction.del(messageBody);

    });
  }


  init(langs){
    this.langs=langs;
    $("#glanguage_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
     MinnUtil.genSelectOptions($("#glanguage_id"),langs,MainConstant.UNKNOWN,1);
  }

  refresh(event) {
    if (event!=null)
       event.preventDefault();
    let messageBody={};
    messageBody.did=this._curid+'';
    messageBody.tablename=this._tablename;

   GlobalizationAction.getDicLang(messageBody);

  }



  getDicLang(did,tablename,columns,languagemkey,languagekey,langdata){
     this._curid=did;
     this._tablename=tablename;
     this.columns=columns;
     this.languagemkey=languagemkey;
     this.languagekey=languagekey
     this.langdata=langdata;
     this.state.data=this.langdata;

    MinnUtil.genSelectOptions($("#column_id"),columns);
  }


  onRowSelect(row, isSelected , event){
     $('#gdel_id').val(row.id);
     GlobalizationAction.getGlobalData(row);
    }

  saveHandler(event){
    event.preventDefault();

    let eexiest=false;
        for(let i=0;i<this.state.data.length;i++)
        {
          let lan=this.state.data[i];
          if(lan.language==$('#glanguage_id').val()){
            eexiest=true;
            break;
          }
        }
        if(eexiest){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('globalization_languge_exists'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }
      if($('#gname_id').val()==''||$('#glanguage_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('validate_check_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

      this.state.myMethod='add';
      let messageBody={};
      messageBody.name=$('#gname_id').val();
      messageBody.language=$('#glanguage_id').val();
      messageBody.tablecolumn=$('#column_id').val();
      messageBody.tableid=this._curid;
      messageBody.tablename=this._tablename;

      GlobalizationAction.saveOrUpdate(this.state.myMethod,null,messageBody);

    }

    showModifyHandler(event){
      if($('#gdel_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

      this.setState({ show: true,myMethod:'modify'});

    }

    modifyHandler(event){
      event.preventDefault();


      if($('#gname_id2').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('validate_check_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

      this.state.myMethod='modify';
      let messageBody={};
      messageBody.name=$('#gname_id2').val();
      messageBody.language=$('#glanguage_id2').val();
      messageBody.tablecolumn=$('#column_id2').val();
      messageBody.tableid=this._curid;
      messageBody.tablename=this._tablename;

      GlobalizationAction.saveOrUpdate(this.state.myMethod,this.state.selectedRow,messageBody);

    }

    initData(event){
      if(this.state.myMethod=='add'){
        $( '#'+event.id ).find( "input[type='input']" ).val( '' );
      }
      this.setState({ validationState:{alertVisible:'none',code:'',comment:'',sort:'',name:'',input:false},helpBlock:{pwd:'',name:''}});

         $('#gname_id2').val(this.state.selectedRow.name);
       MinnUtil.genSelectOptions($('#glanguage_id2'),this.langs,this.state.selectedRow.language);
       MinnUtil.genSelectOptions($('#column_id2'),this.columns,this.state.selectedRow.tablecolumn);

    }


  render() {

    return (
      <div>
      <Panel header={this.minnUtil.get('globalization_modify_title')} bsStyle="primary"  closeButton>

           <Form horizontal onSubmit={this.saveHandler.bind(this)} id='submitform_id'>
            <input type='hidden' id="gdel_id" />
                 <FormGroup validationState={this.state.validationState.name} >
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('globalization_field_name')}
                  </Col>
                  <Col sm={5} >
                    <FormControl type="input" id="gname_id" ref="globalization_field_name_id"  placeholder={this.minnUtil.get('globalization_field_name')}  />
                  </Col>

                </FormGroup>

                <FormGroup validationState={this.state.validationState.column}>
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('globalization_field_column')}
                  </Col>
                  <Col sm={5} >
                    <FormControl componentClass="select" id='column_id' ref="globalization_field_column_id"  />
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.column)}</span>
                  </Col>

                </FormGroup>
                <FormGroup validationState={this.state.validationState.language} >
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={5} >
                    <FormControl componentClass="select" id="glanguage_id" ref="globalization_field_language"   />
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.language)}</span>
                  </Col>

                </FormGroup>


                <FormGroup>
                  <Col smOffset={3} sm={9}>
                       <ButtonToolbar>

                <Button bsStyle="primary"  onClick={this.saveHandler.bind(this)}>{this.minnUtil.get('common_add')} </Button>
                 <Button bsStyle="primary" onClick={this.showModifyHandler.bind(this)}>{this.minnUtil.get('common_modify')}</Button>
                 <Button bsStyle="primary" onClick={this.delHandler.bind(this)}>{this.minnUtil.get('common_delete')}</Button>
                 </ButtonToolbar>
                  </Col>
                </FormGroup>
              </Form>

      <BootstrapTable data={this.state.data}  ref='datagrid_id' remote={true}
        striped={true} hover={true} condensed={true} selectRow={this.rowProp(this)}>
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}></TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('globalization_field_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="languagename">{this.minnUtil.get('globalization_field_language')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="tablecolumn">{this.minnUtil.get('globalization_field_column')}</TableHeaderColumn>
        </BootstrapTable>

    </Panel>

      <Modal
          show={this.state.show}  onEntered={this.initData.bind(this)} dialogClassName='my-modal'
          onHide={() => this.setState({ show: false})}
          container={this}  id='gmngmodal_id' ref='gmngmodal_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header  closeButton>
            <Modal.Title id="contained-modal-title">{this.minnUtil.get('dictionary_modify_title')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')}
             </Alert>
              <Form horizontal onSubmit={this.modifyHandler.bind(this)} id='submitform_id'>
                 <FormGroup validationState={this.state.validationState.name} inline>
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={6} >
                    <FormControl type="input" id="gname_id2" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')}  />
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.name)}</span>
                  </Col>

                </FormGroup>

                <FormGroup validationState={this.state.validationState.key} inline>
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('globalization_field_column')}
                  </Col>
                  <Col sm={6} >
                    <FormControl componentClass="select" id="column_id2"  disabled={true}/>
                  </Col>
                </FormGroup>

                <FormGroup validationState={this.state.validationState.sort} inline>
                  <Col componentClass={ControlLabel} sm={3} >
                    {this.minnUtil.get('globalization_field_language')}
                  </Col>
                  <Col sm={6} >
                    <FormControl componentClass="select" id="glanguage_id2"  disabled={true}/>
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

export default GlobalizationPanel;
