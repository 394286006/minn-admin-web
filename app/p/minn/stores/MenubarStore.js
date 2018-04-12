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
    this.thirdpartShow=false;
    this.randomKey='';
    this.thirdParts=[];
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

  onChangeModalStatusSuccess(data) {
    if(data.type=='qrcode'){
      this.qrcodeShow=data.show;
    }
    if(data.type=='thirdpart'){
      this.thirdpartShow=data.show;
    }
  }
  onFail(jqXhr) {
   // toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(MenubarStore);
