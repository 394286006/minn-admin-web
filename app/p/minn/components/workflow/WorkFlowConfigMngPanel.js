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
import WorkFlowConfigMngStore from '../../stores/workflow/WorkFlowConfigMngStore'
import WorkFlowConfigMngAction from '../../actions/workflow/WorkFlowConfigMngAction';

class WorkFlowConfigMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,WorkFlowConfigMngStore); 
    this.process_selectedNode=null; 
      
  } 
    
  componentDidMount() {
    WorkFlowConfigMngStore.listen(this.onChange);
    WorkFlowConfigMngAction.getDic();  
    $('#ztree_process_definition_id').on("loaded.jstree", function (e, data) {
     WorkFlowConfigMngAction.process_selectedNode($('#ztree_process_definition_id').jstree(true).get_selected(true)[0]['original']);
    }); 
    $('#ztree_process_definition_id').on("activate_node.jstree", function (e, data) {
     WorkFlowConfigMngAction.process_selectedNode(data.node.original);
    });
    WorkFlowConfigMngAction.process_queryTree({}); 

    $('#ztree_process_node_id').on("loaded.jstree", function (e, data) {
      let nodes=$('#ztree_process_node_id').jstree(true).get_selected(true);
      if(nodes.length>0)
       WorkFlowConfigMngAction.node_selectedNode(nodes[0]['original']);
    }); 
    $('#ztree_process_node_id').on("activate_node.jstree", function (e, data) {
      WorkFlowConfigMngAction.node_selectedNode(data.node.original);
      WorkFlowConfigMngAction.target_queryTree(data.node.original); 
         
    });
    WorkFlowConfigMngAction.node_queryTree({});  

     WorkFlowConfigMngAction.resource_queryTree({}); 
  }  

  componentWillUnmount() {
    WorkFlowConfigMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='getDicSuccess'){
      let actives=state.dicData.ACTIVETYPE;
      $("#active_id").append("<option value='"+MainConstant.UNKNOWN+"'></option>");
       MinnUtil.genSelectOptions($("#active_id"),state.dicData.ACTIVETYPE,MainConstant.UNKNOWN,1);
    }

    if(state.actionType=='resourceQueryTreeSuccess'){
       this.resource_invokeTree(state.resourceTree);
    }

    if(state.actionType=='targetQueryTreeSuccess'){
       this.target_invokeTree(state.targetTree);
    }

    if(state.actionType=='targetSaveOrUpdateSuccess'){
        this.alertShowMsg('save success');
    }
 
    if(state.actionType=='processQueryTreeSuccess'){
       this.process_invokeTree(state.processTree);
    }

    if(state.actionType=='processSaveOrUpdateSuccess'){
       WorkFlowConfigMngAction.process_queryTree({}); 
       this.setState({ processshow: false});
    }


    if(state.actionType=='processSaveAllSuccess'){
       WorkFlowConfigMngAction.process_queryTree({}); 
       this.alertShowMsg('保存成功');
    }
    

    if(state.actionType=='processSelectedNodeSuccess'){
      this.process_selectedNode=$('#ztree_process_definition_id').jstree(true).get_selected(true)[0];
      $('#process_del_id').val(this.process_selectedNode.id);
    }

    if(state.actionType=='processDelSuccess'){
       $('#process_del_id').val('');
       WorkFlowConfigMngAction.process_queryTree({}); 
    }

   if(state.actionType=='nodeQueryTreeSuccess'){
       this.node_invokeTree(state.nodeTree); 
    }  

    if(state.actionType=='nodeSaveOrUpdateSuccess'){
       WorkFlowConfigMngAction.node_queryTree({}); 
       this.setState({ nodeshow: false});
    }

    if(state.actionType=='nodeSelectedNodeSuccess'){
      this.node_selectedNode=$('#ztree_process_node_id').jstree(true).get_selected(true)[0];
      $('#node_del_id').val(this.node_selectedNode.id);
    }

    if(state.actionType=='nodeDelSuccess'){
       $('#node_del_id').val('');
       WorkFlowConfigMngAction.node_queryTree({}); 
    }


    

    if(state.actionType=='saveOrUpdateSuccess'){
       //this.setState({ processshow: false});
       
    }

 
    state.actionType=''; 
    this.setState(state); 
  }

  treeDropCopy(operation, node, node_parent, node_position, more){
     //console.log('operation:'+operation);
    if(more) {
         more.origin.settings.dnd.always_copy = true;    

      }
    return true;
  } 
   resource_invokeTree(treeData){
     $('#ztree_resource_id').empty();
     $('#ztree_resource_id').removeAttr('class');
     $('#ztree_resource_id').removeAttr('role');
     $('#ztree_resource_id').jstree({ 'core' : {'animation':0,'check_callback':true,'data' :treeData} ,data:true, 'plugins':['dnd']});
  }

 target_invokeTree(treeData){
     $('#ztree_target_id').empty();
     $('#ztree_target_id').removeAttr('class');
     $('#ztree_target_id').removeAttr('role');
     $('#ztree_target_id').jstree({ 'core' : {'animation':0,'check_callback':this.treeDropCopy,'data' :treeData} ,data:true, 'plugins':['dnd','contextmenu']}).on('copy_node.jstree',function(node,data,parent){

         data.node.original.type=data.original.original.type;
         data.node.original.rid=data.parent+'_'+data.original.original.rid;
         data.node.original.rpid=data.node.parent;
         data.node.original.text=data.original.original.text;
  
     });
  }            
 
  process_invokeTree(treeData){
     $('#ztree_process_definition_id').empty();
     $('#ztree_process_definition_id').removeAttr('class');
     $('#ztree_process_definition_id').removeAttr('role');
     $('#ztree_process_definition_id').jstree({ 'core' : {'animation':0,'check_callback':this.treeDropCopy,'data' :treeData} ,data:true, 'plugins':['dnd','contextmenu']}).on('copy_node.jstree',function(node,data,parent){
         data.node.original.code=data.original.original.code;
         data.node.original.sort=data.original.original.sort;
         data.node.original.id=data.parent+'_'+data.original.original.id;
         data.node.original.pnId=data.original.original.id;
         data.node.original.pid=data.node.parent;
         data.node.original.text=data.original.original.text;
        // console.log(data.node.original.id);
     });
  }

  process_delHandler(event){
    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#process_del_id').val();
       WorkFlowConfigMngAction.process_del(messageBody);

    });
  }

 
  process_saveHandler(event){
      event.preventDefault();
      if(this.invokeSaveHandler()){
        return;
      } 
    
       var nodes= $('#ztree_process_definition_id').jstree(true).get_selected(true);
      
       if(this.state.process_pid=='-2'&&this.state.myMethod=='modify'){
        $.alert({title: this.minnUtil.get('alert_title_msg'),content: '根节点不能编辑',confirmButton: this.minnUtil.get('main_alert_oklabel')});
        return;
       }   
   
 
      let messageBody={};
      messageBody.pId=nodes[0].id;
      messageBody.name=this.state.process_name;
      messageBody.code=this.state.process_code;
      messageBody.sort=this.state.process_sort;
      messageBody.active=$('#process_common_active_id').val();
     
      WorkFlowConfigMngAction.process_saveOrUpdate(this.state.myMethod,this.state.process_selectedNode,messageBody);
  
    }



    process_saveAllHandler(){
      let treeObj=$('#ztree_process_definition_id').jstree(true);
      treeObj.select_all();
      let  nodes= treeObj.get_selected(true);

      let idstr='';
      let pIdstr='';
      let pnIds='';
      let namestr='';
      let sortstr='';
      let codestr='';
      for(let i=0;i<nodes.length;i++){
         let vobj=nodes[i]['original'];
        if(idstr!=''){
          idstr+=',';
          pIdstr+=',';
          namestr+=',';
          pnIds+=',';
          sortstr+=',';
          codestr+=',';
        }
        idstr+=vobj.id;
        pIdstr+=vobj.pid;
        pnIds+=vobj.pnId;
        sortstr+=vobj.sort;
        namestr+=vobj.text;
        codestr+=vobj.code;
    }  
    let messageBody={};
    messageBody.ids=idstr;
    messageBody.pIds=pIdstr;
    messageBody.name=namestr;
    messageBody.pnIds=pnIds;
    messageBody.sorts=sortstr;
    messageBody.codes=codestr;

    WorkFlowConfigMngAction.process_saveOrUpdate('save',null,messageBody);
   
  }
 
  process_initData(event){
    if(this.state.myMethod=='add'){
      $( '#'+event.id ).find( "input[type='input']" ).val( '' );
    }
 //   this.setState({ validationState:{alertVisible:'none',pwd:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
       WorkFlowConfigMngAction.changeModelType('process',this.state.myMethod);
     MinnUtil.genSelectOptions($('#process_common_active_id'),this.state.dicData.ACTIVETYPE,this.state.process_selectedNode.active);
    
  }

node_invokeTree(treeData){
     $('#ztree_process_node_id').empty();
     $('#ztree_process_node_id').removeAttr('class');
     $('#ztree_process_node_id').removeAttr('role');
     $('#ztree_process_node_id').jstree({ 'core' : {"animation" : 0,"check_callback" : true,'data' :treeData} ,data:true, 'plugins':['dnd','contextmenu']});
     
  }

  node_delHandler(event){
    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#node_del_id').val();
       WorkFlowConfigMngAction.node_del(messageBody);

    });
  }

 
  node_saveHandler(event){
      event.preventDefault();
      if(this.invokeSaveHandler()){
        return;
      } 
    
     //  var nodes= $('#ztree_process_definition_id').jstree(true).get_selected(true);
      
       if(this.state.node_pid=='-2'&&this.state.myMethod=='modify'){
        $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('workflow_config_root_node_edit'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
        return;
       }   
   
 
      let messageBody={};
      messageBody.pId=this.state.node_id;
      messageBody.name=this.state.node_name;
      messageBody.code=this.state.node_code;
      messageBody.sort=this.state.node_sort;
      messageBody.url=this.state.node_url; 
     
      WorkFlowConfigMngAction.node_saveOrUpdate(this.state.myMethod,this.state.node_selectedNode,messageBody);
   
    }
 
  node_initData(event){
    if(this.state.myMethod=='add'){
      //$( '#'+event.id ).find( "input[type='input']" ).val( '' );
    }
 //   this.setState({ validationState:{alertVisible:'none',pwd:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
       WorkFlowConfigMngAction.changeModelType('node',this.state.myMethod);
     //MinnUtil.genSelectOptions($('#node_common_active_id'),this.state.dicData.ACTIVETYPE,this.state.node_selectedNode.active);
    
  }

  target_saveAllHandler(event){
      
      let treeObj=$('#ztree_target_id').jstree(true);
      treeObj.select_all();
      let  nodes= treeObj.get_selected(true);

      let idstr='';
      let pIdstr='';
      let typestr='';

      for(let i=0;i<nodes.length;i++){
         let vobj=nodes[i]['original'];
        if(idstr!=''){
          idstr+=',';
          pIdstr+=','; 
          typestr+=',';
        }
        idstr+=vobj.rid;  
        pIdstr+=vobj.rpid;
        typestr+=vobj.type;
    }
    let messageBody={};

    messageBody.pnId=this.node_selectedNode.id;
    messageBody.ids=idstr;
    messageBody.pIds=pIdstr;
    messageBody.types=typestr;

    WorkFlowConfigMngAction.target_saveOrUpdate('save',null,messageBody);
   
  }

  saveResource(){

  }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={this.minnUtil.get('workflow_config_title')} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={3}>
        <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
              <input type='hidden' id="process_del_id" />
               <span className='spanlabel'>{this.minnUtil.get('workflow_config_process_definition')} :</span>
                <div className='input-group '>
                <ButtonToolbar>               
                <Button bsStyle="primary" disabled={this.state.process_selectedNode.pid!='-2'} onClick={() => this.setState({modelType:'process',myMethod:'add', processshow: true,processtitle:'流程配置'})}>{this.minnUtil.get('common_add')} </Button>
                <Button bsStyle="primary" disabled={this.state.process_selectedNode.pid=='-2'} onClick={() => this.setState({modelType:'process',myMethod:'modify', processshow: true,processtitle:'流程配置'})}>{this.minnUtil.get('common_modify')} </Button>
                 <Button bsStyle="primary" disabled={this.state.process_selectedNode.pid=='-2'} onClick={this.process_delHandler.bind(this)}>{this.minnUtil.get('common_del')} </Button>
                 <Button bsStyle="primary" onClick={this.process_saveAllHandler.bind(this)}>{this.minnUtil.get('common_save')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="ztree_process_definition_id" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
      </Col>
      <Col sm={12} md={3}>
        <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <input type='hidden' id="node_del_id" />
               <span className='spanlabel'>{this.minnUtil.get('workflow_config_node_definition')}:</span>
                <div className='input-group '>
                <ButtonToolbar>               
                <Button bsStyle="primary" onClick={() => this.setState({modelType:'node', myMethod:'add',nodeshow: true,nodetitle:'环节配置'})}>{this.minnUtil.get('common_add')} </Button>
                <Button bsStyle="primary" disabled={this.state.node_selectedNode.pid=='-2'} onClick={() => this.setState({modelType:'node',myMethod:'modify', nodeshow: true,nodetitle:'环节配置'})}>{this.minnUtil.get('common_modify')} </Button>
                 <Button bsStyle="primary" disabled={this.state.node_selectedNode.pid=='-2'} onClick={this.node_delHandler.bind(this)}>{this.minnUtil.get('common_del')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="ztree_process_node_id" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
      </Col>
      <Col  md={3}>
          <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <span className='spanlabel'>{this.minnUtil.get('workflow_config_node_process_config')}:</span>
                <div className='input-group '>
                <ButtonToolbar>               
                <Button bsStyle="primary" onClick={this.target_saveAllHandler.bind(this)}>{this.minnUtil.get('common_save')} </Button>
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="ztree_target_id" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
        </Col>
        <Col  md={3}>
          <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
               <span className='spanlabel'>{this.minnUtil.get('common_resource')}:</span>
                <div className='input-group '>
                <ButtonToolbar>               
               
                 </ButtonToolbar>
               </div>
               </form>
             </th>
          </tr>
        </thead>
        <tbody>
        <tr>
          <td>
           <Well id="ztree_resource_id" className="welllabel">
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
          show={this.state.processshow} onEntered={this.process_initData.bind(this)}
          onHide={() => this.setState({ processshow: false})} 
          container={this} id='process_model_id' ref='process_model_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{this.state.processtitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['process_alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')} 
             </Alert>
              <Form horizontal onSubmit={this.process_saveHandler.bind(this)} >
                <FormGroup validationState={this.state.validationState.process_name} >
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="process_name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.process_name}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.process_name)}</span>
                  </Col>
                </FormGroup>
                  <FormGroup validationState={this.state.validationState.process_code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_code')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="process_code" ref="menu_code_id"  placeholder={this.minnUtil.get('menu_code')} value={this.state.process_code}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.process_code)}</span>
                  </Col>
                </FormGroup>
                
                 <FormGroup validationState={this.state.validationState.process_sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_sort')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="process_sort" ref="menu_sort_id"  placeholder={this.minnUtil.get('menu_sort')} value={this.state.process_sort}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.sort)}</span>
                  </Col>
                </FormGroup>

                <FormGroup >
                  <Col componentClass={ControlLabel} sm={2}>
                        {this.minnUtil.get('common_active')}
                  </Col>
                  <Col sm={10}>
                    <FormControl componentClass="select" id="process_common_active_id"  >

                  </FormControl>
                  </Col>
                </FormGroup>
               
                <FormGroup>
                  <Col smOffset={5} sm={10}>
                    <Button bsStyle="primary"  type="submit"  id="process_common_ok_id">
                      {this.minnUtil.get('common_ok')}
                    </Button>
                  </Col>
                </FormGroup>
              </Form>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.nodeshow} onEntered={this.node_initData.bind(this)}
          onHide={() => this.setState({ nodeshow: false})} 
          container={this} id='node_model_id' ref='node_model_id'
          aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">{this.state.nodetitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
             <Alert bsStyle='warning' style={{display:this.state.validationState['node_alertVisible']}} >
                {this.minnUtil.get('validate_check_msg')} 
             </Alert>
              <Form horizontal onSubmit={this.node_saveHandler.bind(this)} >
                <FormGroup validationState={this.state.validationState.node_name} >
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('common_name')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.node_name}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_name)}</span>
                  </Col>
                </FormGroup>
                  <FormGroup validationState={this.state.validationState.node_code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_code')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_code" ref="node_code_id"  placeholder={this.minnUtil.get('menu_code')} value={this.state.node_code}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_code)}</span>
                  </Col>
                </FormGroup>
                <FormGroup validationState={this.state.validationState.node_url} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_url')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_url" ref="node_sort_id"  placeholder={this.minnUtil.get('menu_url')} value={this.state.node_url}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_url)}</span>
                  </Col>
                </FormGroup>
                 <FormGroup validationState={this.state.validationState.node_sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_sort')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_sort" ref="node_sort_id"  placeholder={this.minnUtil.get('menu_sort')} value={this.state.node_sort}  onChange={WorkFlowConfigMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_sort)}</span>
                  </Col>
                </FormGroup>
               
                <FormGroup>
                  <Col smOffset={5} sm={10}>
                    <Button bsStyle="primary"  type="submit"  id="node_common_ok_id">
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

export default WorkFlowConfigMngPanel;