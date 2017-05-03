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
import AiMngStore from '../../stores/ai/AiMngStore'
import AiMngAction from '../../actions/ai/AiMngAction';

class AiMngPanel extends TemplateComponent {
  constructor(props) {
    super(props,AiMngStore);
    this.uploaderProps = {
      action: './tensorflow?method=updatePic',
      data: { upfilename:'targetimg'},
      multiple: true,
      beforeUpload(file) {
        console.log('beforeUpload', file.name);

      },
      onStart: (file) => {
        console.log('onStart', file.name);
          AiMngAction.clearImg();
      },
      onSuccess(file) {
        AiMngAction.uploadSuccess(file);
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log('onError', err);
      },
    };

  }

  componentDidMount() {
    AiMngStore.listen(this.onChange);

  }

  componentWillUnmount() {
    AiMngStore.unlisten(this.onChange);
  }

  onChange(state) {

    if(state.actionType=='uploadSuccess'){
      //  console.log('onSuccess', state.file);
    }
    if(state.actionType=='compareTensorflowSuccess'){
      //  console.log('onSuccess', state.file);
    }
    state.actionType='';
    this.setState(state);
  }



  compareTensorflow(){
     AiMngAction.compareTensorflow(this.state.filename);
  }
 
  render() {
    return (
      <div >
      <Panel header={this.minnUtil.get('workflow_config_title')} bsStyle="primary" className="modal-container bounceIn animated" >
      <Tabs defaultActiveKey={1} id="ai-tab">
        <Tab eventKey={1} title="tensorflow">
        <Grid>
    <Row className="show-grid">
      <Col xs={5} md={5}> <code><Upload  {...this.uploaderProps} ><Button bsStyle="primary">开始上传</Button></Upload></code></Col>
      <Col xs={5} md={5}> <Button bsStyle="primary" onClick={this.compareTensorflow.bind(this)}>tensorflow比对</Button></Col>
    </Row>

    <Row className="show-grid">
      <Col xs={5} md={5}><Image  src={this.state.imgpath} rounded /></Col>
      <Col xs={5} md={5}><Well>比对结果,名称:{this.state.matchname},匹配率:{this.state.matchpercent}％</Well></Col>
    </Row>
    </Grid>


        </Tab>
       </Tabs>
    </Panel>
  </div>

    );
  }
}

export default AiMngPanel;
