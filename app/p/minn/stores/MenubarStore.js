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
    this.qrcodeShow=false;
    this.randomKey='';
    this.thirdParts=[{name:'支付宝',val:'zhifubao'},{name:'QQ',val:'qq'},{name:'微信',val:'weixin'}];
    this.fg;

  }

  onLogoutSuccess(successMessage) {
    this.userInfo=null;
    this.loginName='';
    this.actionType='logoutSuccess';
  }

  onGetThirdPartsSuccess(data) {
    this.thirdParts=data.data;
    this.actionType='getThirdPartsSuccess';
  }
  onUnBindThirdPardSuccess(data){
      this.actionType='unBindThirdPardSuccess';
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

  onQrCodeLoginSuccess(data){
    this.actionType='qrCodeLoginSuccess';
    this.randomKey = data.randomKey;

  }

  onFail(jqXhr) {
   // toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MenubarStore);
