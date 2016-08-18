/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../alt';
import MenubarAction from '../actions/MenubarAction';

class MenubarStore {
  constructor() {
    this.bindActions(MenubarAction);
    this.privateMenu = new Object();
    this.onlineUsers = 0;
    this.searchQuery = '';
    this.ajaxAnimationClass = '';
    this.actionType='';
    this.userInfo=null;
    this.loginName='';
  }

  onLogoutSuccess(successMessage) {
    this.userInfo=null;
    this.loginName='';
    this.actionType='logoutSuccess';
  }

  onLogoutFail(failMessage) {
    his.actionType='logoutFail';
  }


  onUpdateAjaxAnimation(className) {
    this.ajaxAnimationClass = className;
  }

  onUpdateSearchQuery(event) {
    this.searchQuery = event.target.value;
  }

  onGetPrivateMenuSuccess(data) {
    this.actionType='getPrivateMenuSuccess';
    this.privateMenu = data.data;
  }

  onFail(jqXhr) {
   // toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MenubarStore);