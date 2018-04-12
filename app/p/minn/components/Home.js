import React from 'react';
import {Link} from 'react-router';
import HomeStore from '../stores/HomeStore'
import HomeActions from '../actions/HomeActions';
import { Panel,ButtonToolbar,Button,Modal,Grid,Row,Col } from 'react-bootstrap';
import MainConstant from '../utils/MainConstant';
import MinnUtil from '../utils/MinnUtil';
import Cube from '../4d/cube/Cube';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
    this.minnUtil=MinnUtil.getInstance(document);
    this.cube=Cube.getInstance(document);
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
    this.cube.start();

  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {


    return (
       <div style={{width:"90%"}} >
      <Panel id='panel_id' header={this.minnUtil.get('main_home')} bsStyle="primary" className="modal-container flipInX animated" >
       <canvas id="glcanvas" width="80%" height="100%"></canvas>
       </Panel>

     </div>

    );
  }
}

export default Home;
