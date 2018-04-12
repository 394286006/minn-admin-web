/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';    
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; 
import { Panel ,Grid,Row,Col,Table,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import SocketClient from '../../utils/SocketClient';
import MessageUtil from '../../utils/MessageUtil';
import MainConstant from '../../utils/MainConstant'; 
import OrgChartMngStore from '../../stores/chart/OrgChartMngStore'
import OrgChartMngAction from '../../actions/chart/OrgChartMngAction';

class OrgChartMngPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = OrgChartMngStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document); 
    this.sc=null;
  }

  componentDidMount() {
    OrgChartMngStore.listen(this.onChange);
    google.charts.load('current', {packages:["orgchart","wordtree"]});
    google.charts.setOnLoadCallback(this.drawChart);
  }

  componentWillUnmount() {
    OrgChartMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='onDisconnectSuccess'){
       this.invokeShowMsg(state.data);
    }
   if(state.actionType=='eventSuccess'){
       this.eventSwitch(state.evt);
    }
     if(state.actionType=='fail'){
      MessageUtil.getInstance(document).showMessage(state.failmsg);
    }


    state.actionType='';
    this.setState(state); 
  }

 
  drawChart() {
      var nodeListData = new google.visualization.arrayToDataTable([
          ['id', 'childLabel', 'parent', 'size', { role: 'style' }],
          [0, 'Life', -1, 1, 'black'],
          [1, 'Archaea', 0, 1, 'green'],
          [2, 'Eukarya', 0, 5, 'black'],
          [3, 'Bacteria', 0, 1, 'green'],

          [4, 'Crenarchaeota', 1, 1, 'red'],
          [5, 'Euryarchaeota', 1, 1, 'black'],
          [6, 'Korarchaeota', 1, 1, 'red'],
          [7, 'Nanoarchaeota', 1, 1, 'black'],
          [8, 'Thaumarchaeota', 1, 1, 'green']

          ]);

        var options = {
          colors: ['red', 'green', 'black'],
          wordtree: {
            format: 'explicit',
            type: 'suffix'
          }
        };

        var wordtree = new google.visualization.WordTree(document.getElementById('wordtree_basic'));
        wordtree.draw(nodeListData, options);

      }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={'结构思维图'} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={6}>
      
      <div id="org_chart_div"></div>
     
      </Col>
     <Col  md={6}>
    
      <span id='wordtree_basic'></span>
     
 

      </Col>
     
     </Row>
     <Row className="show-grid">
      <Col sm={12} md={6}>
      
      <div id="gantt_chart_div"></div>
     
      </Col>
     <Col  md={6}>
      
     <div id="curve_chart" ></div>
     
      </Col>
     
     </Row>
    </Grid>
    </Panel>
  
    
  </div>

    );
  }
}

export default OrgChartMngPanel;