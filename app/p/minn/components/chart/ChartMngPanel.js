/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import ReactDOM from 'react-dom';    
import {Link} from 'react-router'; 
import {first, without, findWhere} from 'underscore';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table'; 
import { Panel,ButtonToolbar,Button,Modal ,Grid,Row,Col,Table,Well,FormControl,DropdownButton,MenuItem,Form,FormGroup,ControlLabel,Alert} from 'react-bootstrap';
import MinnUtil from '../../utils/MinnUtil';
import SocketClient from '../../utils/SocketClient';
import MessageUtil from '../../utils/MessageUtil';
import MainConstant from '../../utils/MainConstant'; 
import ChartMngStore from '../../stores/chart/ChartMngStore'
import ChartMngAction from '../../actions/chart/ChartMngAction';

class ChartMngPanel extends React.Component{
  constructor(props) {
    super(props);
    this.state = ChartMngStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document); 
    this.sc=null;
  }

  componentDidMount() {
    ChartMngStore.listen(this.onChange);
    google.charts.load('current', {packages:["orgchart","gauge","corechart","gantt"]});
    google.charts.setOnLoadCallback(this.drawChart);
  }

  componentWillUnmount() {
    ChartMngStore.unlisten(this.onChange);
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
       var gauge_data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['内存', 80],
          ['CPU', 55],
          ['网络', 68]
        ]);

        var gauge_options = {
          width: 400, height: 120,
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
        };

        var gauge_chart = new google.visualization.Gauge(document.getElementById('gauge_chart_div'));

        gauge_chart.draw(gauge_data, gauge_options);

        setInterval(function() {
          gauge_data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
          gauge_chart.draw(gauge_data, gauge_options);
        }, 5000);
        setInterval(function() {
          gauge_data.setValue(1, 1, 40 + Math.round(60 * Math.random()));
          gauge_chart.draw(gauge_data, gauge_options);
        }, 2500);
        setInterval(function() {
          gauge_data.setValue(2, 1, 60 + Math.round(20 * Math.random()));
          gauge_chart.draw(gauge_data, gauge_options);
        }, 6500);


      var oldData = google.visualization.arrayToDataTable([
        ['主修', '商务'],
        ['商务', 256070], ['物理学', 108034],
        ['社会科学', 127101],
        ['心理学', 74194]]);

      var newData = google.visualization.arrayToDataTable([
        ['主修', '商务'],
        ['商务', 358293], ['物理学', 101265],
        ['社会科学', 172780],
        ['心理学', 97216]]);

      var diff_options = { pieSliceText: 'none' };

      var chartDiff = new google.visualization.PieChart(document.getElementById('piechart_diff'));


      var diffData = chartDiff.computeDiff(oldData, newData);
      chartDiff.draw(diffData, diff_options);
   


       var gantt_data = new google.visualization.DataTable();
      gantt_data.addColumn('string', 'Task ID');
      gantt_data.addColumn('string', 'Task Name');
      gantt_data.addColumn('string', 'Resource');
      gantt_data.addColumn('date', 'Start');
      gantt_data.addColumn('date', 'End');
      gantt_data.addColumn('number', 'Duration');
      gantt_data.addColumn('number', 'Percent Complete');
      gantt_data.addColumn('string', 'Dependencies');

      gantt_data.addRows([
        ['toTrain', '步行到车站', '走路', null, null, 5* 60 * 1000, 100, null],
        ['music', '听音乐', '全部', null, null,70* 60 * 1000, 100, null],
        ['wait', '候车', '等候', null, null, 10* 60 * 1000, 100, 'toTrain'],
        ['train', '乘车', '车上', null, null, 45* 60 * 1000, 75, 'wait'],
        ['toWork', '走路上班', '走路', null, null, 10* 60 * 1000, 0, 'train'],
        ['work', '坐在桌子旁', null, null, null, 2* 60 * 1000, 0, 'toWork'],

      ]);

      var gantt_options = {
        height: 275,
        gantt: {
          defaultStartDateMillis: new Date(2017,1,1)
        }
      };

        var gantt_chart = new google.visualization.Gantt(document.getElementById('gantt_chart_div'));

        gantt_chart.draw(gantt_data, gantt_options);


        var curve_data = google.visualization.arrayToDataTable([
          ['年', '收入', '支出'],
          ['2004',  1000,      400],
          ['2005',  1170,      460],
          ['2006',  660,       1120],
          ['2007',  1030,      540]
        ]);

        var curve_options = {
          title: '收支情况',
          curveType: 'function',
          legend: { position: 'bottom' }
        };

        var curve_chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

        curve_chart.draw(curve_data, curve_options);

      }

  render() {

    return (
      <div style={{width:'85%'}}>
      <Panel header={'chart测试'} bsStyle="primary" className="modal-container bounceIn animated" >
      <Grid fluid={true}>
      <Row className="show-grid">
      <Col sm={12} md={6}>
      
      <div id="gauge_chart_div"></div>
     
      </Col>
     <Col  md={6}>
    
      <span id='piechart_before' style={{width:'450px',display:'inline-block'}}></span>
      <span id='piechart_after' style={{width:'450px',display:'inline-block'}}></span>
       <br/>
      <span id='piechart_diff' style={{width:'450px',left:'250px'}}></span>
 

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

export default ChartMngPanel;