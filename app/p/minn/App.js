/**
* @auth:minn
* @qq:394286006
*/
import React from 'react'
import ReactDOM from 'react-dom';
import UserLogin from './security/UserLogin';
import Menubar from './components/Menubar';
import { Panel,ButtonToolbar,Button,Modal,Grid,Row,Col } from 'react-bootstrap';
class App extends React.Component {
 constructor(props) {
    super(props);
    $( document ).on( 'loginCompleteEvent', this.loginCompleteEventHandler);
    $( document ).on( 'logoutCompleteEvent', this.logoutCompleteEventHandler);

  }
  loginCompleteEventHandler(event,param){
    if(param!=null){
       $( '#context' ).show();

       $( '#userlogin' ).hide();
    }else{
       $( '#context' ).hide();
       $( '#userlogin' ).show();
    }
  }
  logoutCompleteEventHandler(event,param){
       $( '#context' ).hide();
       $( '#userlogin' ).show();

  }

  render() {
    return (
      <div>
      	<div id='context' style={{display:'none'}}>
            <Menubar history={this.props.history} />
               {this.props.children}
         </div>
           <div id='userlogin' style={{display:'none'}}>
               <UserLogin/>
          </div>
       </div>
    );
  }
}

export default App;
