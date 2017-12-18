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
import WorkFlowConfigChartMngStore from '../../stores/workflow/WorkFlowConfigChartMngStore'
import WorkFlowConfigChartMngAction from '../../actions/workflow/WorkFlowConfigChartMngAction';
var myDiagram;
var ztreeProcessNode;
var flowgo;
var tmpdata;
class WorkFlowConfigChartMngPanel extends TemplateComponent {
   constructor(props) {
    super(props,WorkFlowConfigChartMngStore); 
    this.process_selectedNode=null; 
    this.ztreeResource=null;
    tmpdata=this.modelData;
  } 
    
  componentDidMount() {
    WorkFlowConfigChartMngStore.listen(this.onChange);
    WorkFlowConfigChartMngAction.getDic();  
    $('#ztree_process_definition_config_id').on("loaded.jstree", function (e, data) {
     WorkFlowConfigChartMngAction.process_selectedNode($('#ztree_process_definition_config_id').jstree(true).get_selected(true)[0]['original']);
    }); 
    $('#ztree_process_definition_config_id').on("activate_node.jstree", function (e, data) {
     WorkFlowConfigChartMngAction.process_selectedNode(data.node.original);
    });
    WorkFlowConfigChartMngAction.process_queryTree({}); 

    $('#ztree_process_node_config_id').on("loaded.jstree", function (e, data) {
      let nodes=$('#ztree_process_node_config_id').jstree(true).get_selected(true);
      if(nodes.length>0)
       WorkFlowConfigChartMngAction.node_selectedNode(nodes[0]['original']);
    }); 
    $('#ztree_process_node_config_id').on("activate_node.jstree", function (e, data) {
      WorkFlowConfigChartMngAction.node_selectedNode(data.node.original);
      WorkFlowConfigChartMngAction.target_queryTree(data.node.original); 
         
    });
    WorkFlowConfigChartMngAction.node_queryTree({});  

     WorkFlowConfigChartMngAction.resource_queryTree({}); 

     this.initFlowChart();
  }  

  componentWillUnmount() {
    WorkFlowConfigChartMngStore.unlisten(this.onChange);
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
       WorkFlowConfigChartMngAction.process_queryTree({}); 
       this.setState({ processshow: false});
    }
      
    if(state.actionType=='processSaveAllSuccess'){
       WorkFlowConfigChartMngAction.process_queryTree({}); 
       this.alertShowMsg('保存成功');
    } 
    
    if(state.actionType=='processSelectedNodeSuccess'){
      this.process_selectedNode=$('#ztree_process_definition_config_id').jstree(true).get_selected(true)[0];
      $('#process_del_id').val(this.process_selectedNode.id);
      $('#process_del_gid').val(this.process_selectedNode.original.gid);
      if(this.process_selectedNode.original.pnId==-2){
       let param={};
        param.processId=this.process_selectedNode.original.id;  
        WorkFlowConfigChartMngAction.getModel(param);
      }
    }

    if(state.actionType=='processDelSuccess'){
       $('#process_del_id').val('');
        $('#process_del_gid').val('');
       WorkFlowConfigChartMngAction.process_queryTree({}); 
    }

   if(state.actionType=='nodeQueryTreeSuccess'){
       this.node_invokeTree(state.nodeTree); 
    }  

    if(state.actionType=='nodeSaveOrUpdateSuccess'){
       WorkFlowConfigChartMngAction.node_queryTree({}); 
       this.setState({ nodeshow: false});
    }

    if(state.actionType=='nodeSelectedNodeSuccess'){
      this.node_selectedNode=$('#ztree_process_node_config_id').jstree(true).get_selected(true)[0];
      $('#node_del_id').val(this.node_selectedNode.id);
    }

    if(state.actionType=='nodeDelSuccess'){
       $('#node_del_id').val('');
       WorkFlowConfigChartMngAction.node_queryTree({}); 
    }

   if(state.actionType=='getModelSuccess'){
       myDiagram.model = go.Model.fromJson(state.modelData);
       loadDiagramProperties();     
    }   
    
  
    if(state.actionType=='saveOrUpdateSuccess'){
       //this.setState({ processshow: false});
    }

 
    state.actionType=''; 
    this.setState(state); 
  }

  treeDropCopy(operation, node, node_parent, node_position, more){
    if(more) {
         more.origin.settings.dnd.always_copy = true;    

      }
    return true;
  }    
   resource_invokeTree(treeData){  
     treeData.push({ text: "Comment", figure: "RoundedRectangle", fill: "lightyellow" ,id:'JS',code:'JS'});
     this.ztreeResource =
      flowgo(go.Palette, "ztree_resource_config_id",  
        {
          maxSelectionCount: 1,
          nodeTemplateMap: myDiagram.nodeTemplateMap,  
          model: new go.GraphLinksModel(treeData, [
            { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
          ])
        });
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
     $('#ztree_process_definition_config_id').empty();
     $('#ztree_process_definition_config_id').removeAttr('class');
     $('#ztree_process_definition_config_id').removeAttr('role');
     $('#ztree_process_definition_config_id').jstree({ 'core' : {'animation':0,'check_callback':this.treeDropCopy,'data' :treeData} ,data:true, 'plugins':['dnd','contextmenu']}).on('copy_node.jstree',function(node,data,parent){
         data.node.original.code=data.original.original.code;
         data.node.original.sort=data.original.original.sort;
         data.node.original.id=data.parent+'_'+data.original.original.id;
         data.node.original.pnId=data.original.original.id;
         data.node.original.pid=data.node.parent;
         data.node.original.text=data.original.original.text;
     });
  }

  process_delHandler(event){
    this.invokeDelHandler(function(){    
      let messageBody={}; 
       messageBody.id=$('#process_del_id').val();
       messageBody.gid=$('#process_del_gid').val();
       WorkFlowConfigChartMngAction.process_del(messageBody);
    });
  }

 
  process_saveHandler(event){
      event.preventDefault();
      if(this.invokeSaveHandler()){
        return;
      } 
    
       var nodes= $('#ztree_process_definition_config_id').jstree(true).get_selected(true);
      
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
     
      WorkFlowConfigChartMngAction.process_saveOrUpdate(this.state.myMethod,this.state.process_selectedNode,messageBody);
  
    }       

    process_saveAllHandler(){    
      saveDiagramProperties(); 

      let treeObj=$('#ztree_process_definition_config_id').jstree(true);
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
    messageBody.model=myDiagram.model.toJson();
    messageBody.processId=this.process_selectedNode.id;
    messageBody.modelExists=this.state.modelExists; 
              
    WorkFlowConfigChartMngAction.process_saveOrUpdate('save',null,messageBody);

  }
 
  process_initData(event){
    if(this.state.myMethod=='add'){
      $( '#'+event.id ).find( "input[type='input']" ).val( '' );
    }
 //   this.setState({ validationState:{alertVisible:'none',pwd:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
       WorkFlowConfigChartMngAction.changeModelType('process',this.state.myMethod);
     MinnUtil.genSelectOptions($('#process_common_active_id'),this.state.dicData.ACTIVETYPE,this.state.process_selectedNode.active);
    
  }

node_invokeTree(treeData){ 
    ztreeProcessNode =
      flowgo(go.Palette, "ztree_process_node_config_id", 
        {
          maxSelectionCount: 1,
          nodeTemplateMap: myDiagram.nodeTemplateMap,  
          model: new go.GraphLinksModel(treeData, [
            { points: new go.List(go.Point).addAll([new go.Point(0, 0), new go.Point(30, 0), new go.Point(30, 40), new go.Point(60, 40)]) }
          ])
        });
  }

  node_delHandler(event){
    this.invokeDelHandler(function(){  
      let messageBody={}; 
       messageBody.id=$('#node_del_id').val();
    //   WorkFlowConfigChartMngAction.node_del(messageBody);

    });
  }

 
  node_saveHandler(event){
      event.preventDefault();
      if(this.invokeSaveHandler()){
        return;
      } 
    
     //  var nodes= $('#ztree_process_definition_config_id').jstree(true).get_selected(true);
      
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
     
      WorkFlowConfigChartMngAction.node_saveOrUpdate(this.state.myMethod,this.state.node_selectedNode,messageBody);
   
    }
 
  node_initData(event){
    if(this.state.myMethod=='add'){
      //$( '#'+event.id ).find( "input[type='input']" ).val( '' );
    }
 //   this.setState({ validationState:{alertVisible:'none',pwd:'',name:'',input:false},helpBlock:{pwd:'',name:''}});
       WorkFlowConfigChartMngAction.changeModelType('node',this.state.myMethod);
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

    WorkFlowConfigChartMngAction.target_saveOrUpdate('save',null,messageBody);
   
  }

  saveResource(){

  }

  initFlowChart(){
    flowgo= go.GraphObject.make;   
    myDiagram =
      flowgo(go.Diagram, "myDiagramDiv",  
        {
          grid: flowgo(go.Panel, "Grid",
                  flowgo(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.5 }),
                  flowgo(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.5, interval: 10 }),
                  flowgo(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.5 }),
                  flowgo(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.5, interval: 10 })
                ),
          allowDrop: true,  
          "draggingTool.dragsLink": true,
          "draggingTool.isGridSnapEnabled": true,
          "linkingTool.isUnconnectedLinkValid": true,
          "linkingTool.portGravity": 20,
          "relinkingTool.isUnconnectedLinkValid": true,
          "relinkingTool.portGravity": 20,
          "relinkingTool.fromHandleArchetype":
            flowgo(go.Shape, "Diamond", { segmentIndex: 0, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "tomato", stroke: "darkred" }),
          "relinkingTool.toHandleArchetype":
            flowgo(go.Shape, "Diamond", { segmentIndex: -1, cursor: "pointer", desiredSize: new go.Size(8, 8), fill: "darkred", stroke: "tomato" }),
          "linkReshapingTool.handleArchetype":
            flowgo(go.Shape, "Diamond", { desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
          rotatingTool: flowgo(TopRotatingTool),  
          "rotatingTool.snapAngleMultiple": 15,
          "rotatingTool.snapAngleEpsilon": 15,
          "undoManager.isEnabled": true
        });

    myDiagram.addDiagramListener("Modified", function(e) {
      var idx = document.title.indexOf("*");
      if (myDiagram.isModified) {
        if (idx < 0) document.title += "*";
      } else {
        if (idx >= 0) document.title = document.title.substr(0, idx);
      }
    });


    function makePort(name, spot, output, input) {
    
      return flowgo(go.Shape, "Circle",
               {
                  fill: null,  
                  stroke: null,
                  desiredSize: new go.Size(7, 7),
                  alignment: spot,  
                  alignmentFocus: spot,  
                  portId: name, 
                  fromSpot: spot, toSpot: spot,  
                  fromLinkable: output, toLinkable: input, 
                  cursor: "pointer" 
               });
    }

    var nodeSelectionAdornmentTemplate =
      flowgo(go.Adornment, "Auto",
        flowgo(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
        flowgo(go.Placeholder)
      );

    var nodeResizeAdornmentTemplate =
      flowgo(go.Adornment, "Spot",
        { locationSpot: go.Spot.Right },
        flowgo(go.Placeholder),
        flowgo(go.Shape, { alignment: go.Spot.TopLeft, cursor: "nw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { alignment: go.Spot.Top, cursor: "n-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { alignment: go.Spot.TopRight, cursor: "ne-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        flowgo(go.Shape, { alignment: go.Spot.Left, cursor: "w-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { alignment: go.Spot.Right, cursor: "e-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),

        flowgo(go.Shape, { alignment: go.Spot.BottomLeft, cursor: "se-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { alignment: go.Spot.Bottom, cursor: "s-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { alignment: go.Spot.BottomRight, cursor: "sw-resize", desiredSize: new go.Size(6, 6), fill: "lightblue", stroke: "deepskyblue" })
      );

    var nodeRotateAdornmentTemplate =
      flowgo(go.Adornment,
        { locationSpot: go.Spot.Center, locationObjectName: "CIRCLE" },
        flowgo(go.Shape, "Circle", { name: "CIRCLE", cursor: "pointer", desiredSize: new go.Size(7, 7), fill: "lightblue", stroke: "deepskyblue" }),
        flowgo(go.Shape, { geometryString: "M3.5 7 L3.5 30", isGeometryPositioned: true, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] })
      );

    myDiagram.nodeTemplate =
      flowgo(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        { selectable: true, selectionAdornmentTemplate: nodeSelectionAdornmentTemplate },
        { resizable: true, resizeObjectName: "PANEL", resizeAdornmentTemplate: nodeResizeAdornmentTemplate },
        { rotatable: true, rotateAdornmentTemplate: nodeRotateAdornmentTemplate },
        new go.Binding("angle").makeTwoWay(),
        flowgo(go.Panel, "Auto",
          { name: "PANEL" },
          new go.Binding("desiredSize", "size", go.Size.parse).makeTwoWay(go.Size.stringify),
          flowgo(go.Shape, "Rectangle",  
            {
              portId: "", 
              fromLinkable: true, toLinkable: true, cursor: "pointer",
              fill: "white",  
              strokeWidth: 2
            },
            new go.Binding("figure"),
            new go.Binding("fill")),
          flowgo(go.TextBlock,
            {
              font: "bold 11pt Helvetica, Arial, sans-serif",
              margin: 8,
              maxSize: new go.Size(160, NaN),
              wrap: go.TextBlock.WrapFit,
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        ),
 
        makePort("T", go.Spot.Top, false, true),
        makePort("L", go.Spot.Left, true, true),
        makePort("R", go.Spot.Right, true, true),
        makePort("B", go.Spot.Bottom, true, false),
        {
          mouseEnter: function(e, node) { showSmallPorts(node, true); },
          mouseLeave: function(e, node) { showSmallPorts(node, false); }
        }
      );

    function showSmallPorts(node, show) {
      node.ports.each(function(port) {
        if (port.portId !== "") {  
          port.fill = show ? "rgba(0,0,0,.3)" : null;
        }
      });
    }

    var linkSelectionAdornmentTemplate =
      flowgo(go.Adornment, "Link",
        flowgo(go.Shape,
          { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }) 
      );

    myDiagram.linkTemplate =
      flowgo(go.Link,  
        { selectable: true, selectionAdornmentTemplate: linkSelectionAdornmentTemplate },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4
        },
        new go.Binding("points").makeTwoWay(),
        flowgo(go.Shape, 
          { isPanelMain: true, strokeWidth: 2 }),
        flowgo(go.Shape,  
          { toArrow: "Standard", stroke: null }),
        flowgo(go.Panel, "Auto",
          new go.Binding("visible", "isSelected").ofObject(),
          flowgo(go.Shape, "RoundedRectangle",  
            { fill: "#F8F8F8", stroke: null }),
          flowgo(go.TextBlock,
            {
              textAlign: "center",
              font: "10pt helvetica, arial, sans-serif",
              stroke: "#919191",
              margin: 2,
              minSize: new go.Size(10, NaN),
              editable: true
            },
            new go.Binding("text").makeTwoWay())
        )
      );  

    load();  

  }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={this.minnUtil.get('workflow_config_title')} id="header_id" bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={2}>
        <Table responsive>
           <thead>
            <tr>
            <th>
              <form className='navbar-form navbar-form-label'>
              <input type='hidden' id="process_del_id" />
              <input type='hidden' id="process_del_gid" />
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
           <Well id="ztree_process_definition_config_id" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
      </Col>
      <Col sm={12} md={6}>
        <div id="myDiagramDiv" style={{border: 'solid 1px black',height: '520px'}}></div>
      </Col>
      <Col  md={2}>
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
           <Well id="ztree_process_node_config_id" className="welllabel">
            </Well>
          </td>
          </tr>     
        </tbody>
        </Table>
      </Col>
        <Col  md={2}>
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
           <Well id="ztree_resource_config_id" className="welllabel">
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
                    <FormControl type="input" id="process_name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.process_name}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.process_name)}</span>
                  </Col>
                </FormGroup>
                  <FormGroup validationState={this.state.validationState.process_code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_code')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="process_code" ref="menu_code_id"  placeholder={this.minnUtil.get('menu_code')} value={this.state.process_code}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.process_code)}</span>
                  </Col>
                </FormGroup>
                
                 <FormGroup validationState={this.state.validationState.process_sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_sort')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="process_sort" ref="menu_sort_id"  placeholder={this.minnUtil.get('menu_sort')} value={this.state.process_sort}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
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
                    <FormControl type="input" id="node_name" ref="common_name_id"  placeholder={this.minnUtil.get('common_name')} value={this.state.node_name}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_name)}</span>
                  </Col>
                </FormGroup>
                  <FormGroup validationState={this.state.validationState.node_code} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_code')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_code" ref="node_code_id"  placeholder={this.minnUtil.get('menu_code')} value={this.state.node_code}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_code)}</span>
                  </Col>
                </FormGroup>
                <FormGroup validationState={this.state.validationState.node_url} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_url')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_url" ref="node_sort_id"  placeholder={this.minnUtil.get('menu_url')} value={this.state.node_url}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
                    <span className='help-block'>{this.minnUtil.get(this.state.helpBlock.node_url)}</span>
                  </Col>
                </FormGroup>
                 <FormGroup validationState={this.state.validationState.node_sort} inline>
                  <Col componentClass={ControlLabel} sm={2} >
                    {this.minnUtil.get('menu_sort')}
                  </Col>
                  <Col sm={10} >
                    <FormControl type="input" id="node_sort" ref="node_sort_id"  placeholder={this.minnUtil.get('menu_sort')} value={this.state.node_sort}  onChange={WorkFlowConfigChartMngAction.updateValue}/>
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

function TopRotatingTool() {
    go.RotatingTool.call(this);
  }
  go.Diagram.inherit(TopRotatingTool, go.RotatingTool);

  TopRotatingTool.prototype.updateAdornments = function(part) {
    go.RotatingTool.prototype.updateAdornments.call(this, part);
    var adornment = part.findAdornment("Rotating");
    if (adornment !== null) {
      adornment.location = part.rotateObject.getDocumentPoint(new go.Spot(0.5, 0, 0, -30));  // above middle top
    }
  };

  TopRotatingTool.prototype.rotate = function(newangle) {
    go.RotatingTool.prototype.rotate.call(this, newangle + 90);
  };

 
  function saveDiagramProperties() {
    myDiagram.model.modelData.position = go.Point.stringify(myDiagram.position);
  }
  function loadDiagramProperties(e) {
    var pos = myDiagram.model.modelData.position;
    if (pos) myDiagram.initialPosition = go.Point.parse(pos);
  }

export default WorkFlowConfigChartMngPanel;