import React from 'react';
import {Route} from 'react-router';
import MainConstant from './p/minn/utils/MainConstant';
import App from './p/minn/App';
import Home from './p/minn/components/Home';
import UserLogin from './p/minn/security/UserLogin';
import AccountMngPanel from './p/minn/components/privilege/AccountMngPanel';
import MenuMngPanel from './p/minn/components/privilege/MenuMngPanel';
import DepartmentMngPanel from './p/minn/components/privilege/DepartmentMngPanel';
import RoleMngPanel from './p/minn/components/privilege/RoleMngPanel';
import DicMngPanel from './p/minn/components/privilege/DicMngPanel';
import WorkFlowConfigMngPanel from './p/minn/components/workflow/WorkFlowConfigMngPanel';
import LeaveProcessMngPanel from './p/minn/components/workflow/LeaveProcessMngPanel';
import SocketMngPanel from './p/minn/components/socket/SocketMngPanel';
import ChartMngPanel from './p/minn/components/chart/ChartMngPanel';
import OrgChartMngPanel from './p/minn/components/chart/OrgChartMngPanel';
import AiMngPanel from './p/minn/components/ai/AiMngPanel';


export default (
  <Route component={App} >
    <Route path={MainConstant.app} component={Home} />
    <Route path={MainConstant.app+'/account'} component={AccountMngPanel} />
    <Route path={MainConstant.app+'/menu'} component={MenuMngPanel} />
    <Route path={MainConstant.app+'/department'} component={DepartmentMngPanel} />
    <Route path={MainConstant.app+'/role'} component={RoleMngPanel} />
    <Route path={MainConstant.app+'/dic'} component={DicMngPanel} />
    <Route path={MainConstant.app+'/workflowconfig'} component={WorkFlowConfigMngPanel} />
    <Route path={MainConstant.app+'/leaveprocess'} component={LeaveProcessMngPanel} />
    <Route path={MainConstant.app+'/socket'} component={SocketMngPanel} />
    <Route path={MainConstant.app+'/chart'} component={ChartMngPanel} />
    <Route path={MainConstant.app+'/orgChart'} component={OrgChartMngPanel} />
    <Route path={MainConstant.app+'/ai'} component={AiMngPanel} />
  </Route>
);
