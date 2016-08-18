import React from 'react';
import {Route} from 'react-router';
import MainConstant from './p/minn/utils/MainConstant'; 
import App from './p/minn/App';
import Home from './p/minn/components/Home';
import UserLogin from './p/minn/security/UserLogin';
import AccountMngPanel from './p/minn/components/privilege/AccountMngPanel';
import MenuMngPanel from './p/minn/components/privilege/MenuMngPanel';
import RoleMngPanel from './p/minn/components/privilege/RoleMngPanel';
import DicMngPanel from './p/minn/components/privilege/DicMngPanel';

 
export default (
  <Route component={App} >
    <Route path={MainConstant.app} component={Home} />
    <Route path={MainConstant.app+'/account'} component={AccountMngPanel} />
    <Route path={MainConstant.app+'/menu'} component={MenuMngPanel} />
    <Route path={MainConstant.app+'/role'} component={RoleMngPanel} />
    <Route path={MainConstant.app+'/dic'} component={DicMngPanel} />
  </Route>
);
