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
import { Panel,Tabs,Tab,Button,Alert,Image,Grid,Row,Col,Well} from 'react-bootstrap';
import Upload from 'rc-upload';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant';
import LuceneMngStore from '../../stores/lucene/LuceneMngStore'
import LuceneMngAction from '../../actions/lucene/LuceneMngAction';

class LuceneMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,LuceneMngStore);
  }

  componentDidMount() {
    LuceneMngStore.listen(this.onChange);

  }

  componentWillUnmount() {
    LuceneMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='addSuccess'){
      //  console.log('onSuccess', state.file);
    }
    if(state.actionType=='querySuccess'){
      //  console.log('onSuccess', state.file);
    }
    state.actionType='';  
    this.setState(state);
  }

  add(event){      
    LuceneMngAction.add($('#name_id').val(),$('#age_id').val());
  }


  query(){
     LuceneMngAction.query($('#search_name_id').val());
  }

  render() {
    return ( 
      <div style={{width:'85%'}}>        
      <Panel header={this.minnUtil.get('lucene_title')} bsStyle="primary" className="modal-container bounceIn animated" >
     
        <Grid>
    <Row className="show-grid">
      <Col xs={5} md={5}> <code>{this.minnUtil.get('lucene_name')}:<input type='text' className='form-control' id="name_id" name="name_id" placeholder={this.minnUtil.get('lucene_name')} />{this.minnUtil.get('lucene_age')}:<input type='text' className='form-control' id="age_id" placeholder={this.minnUtil.get('lucene_age')} />
      <Button bsStyle="primary" onClick={this.add}>{this.minnUtil.get('common_add')}</Button></code></Col>
      <Col xs={5} md={5}><div>{this.minnUtil.get('common_search_name')} <input type='text' className='form-control' id="search_name_id" placeholder={this.minnUtil.get('common_search_name')} />
      <Button className='btn btn-default' onClick={this.query}><span className='glyphicon glyphicon-search'></span></Button></div></Col>
    </Row>

    <Row className="show-grid">
      <Col xs={5} md={5}>
        <BootstrapTable data={this.state.data}  ref='datagrid_id' remote={true} >
       <TableHeaderColumn isKey={true} dataField="id" hidden={true}>Id</TableHeaderColumn>
        <TableHeaderColumn  dataField="name">{this.minnUtil.get('lucene_name')}</TableHeaderColumn>
        <TableHeaderColumn  dataField="age">{this.minnUtil.get('lucene_age')}</TableHeaderColumn>
        </BootstrapTable>
      </Col>
      <Col xs={5} md={5}><Well>{this.minnUtil.get('common_result')}:{this.state.age}</Well></Col>
    </Row>
    </Grid>

    </Panel>
  </div>

    );
  }
}

export default LuceneMngPanel;
