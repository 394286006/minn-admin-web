/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../alt';
import MinnUtil from '../utils/MinnUtil';
import {assign} from 'underscore';
import MainConstant from '../utils/MainConstant';

class MenubarAction {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getPrivateMenuSuccess',
      'qrCodeLoginSuccess',
      'logoutSuccess',
      'getThirdPartsSuccess',
      'unBindThirdPardSuccess',
      'changeModalStatusSuccess',
      'fail'
    );
  }


  logout() {
    $.ajax({
      url: MainConstant.baseApp + '/logout',
      data: { }
    })
      .done((data) => {
        console.log('logout:'+data);
        this.actions.logoutSuccess();
      })
      .fail(() => {
        this.actions.fail();
      });
  }

  getPrivateMenu(lang) {
    $.ajax({ url: MainConstant.baseApp +'/menu?method=getPrivateMenu',data:{lang:lang} })
      .done((data) => {
        this.actions.getPrivateMenuSuccess(data)
      })
      .fail((jqXhr) => {
        this.actions.fail(jqXhr)
      });
  }

  qrcodeLogin(lang){
    let data={};
      $.ajax({
        type: 'POST',
        url: MainConstant.baseApp +'/swfqrcodekey',
        data: {lang:lang}
      })
        .done((d) => {
          data.randomKey=d.data.key;
          this.actions.qrCodeLoginSuccess(data);

        })
        .fail((jqXhr) => {
          this.actions.fail(jqXhr.responseJSON.message);
        });
    }

    getThirdParts(){
      $.ajax({ url: MainConstant.baseApp +'/acountTP?method=getThirdParts',type:'GET',data:{}})
        .done(data => {
          this.actions.getThirdPartsSuccess(data);
        })
        .fail(jqXhr => {
          this.actions.fail(jqXhr.responseJSON.message);
        });
    }

    unBindThirdPard(messageBody){
      let param={};
      param.messageBody=MinnUtil.convert2Json(messageBody);
      $.ajax({ url: MainConstant.baseApp +'/acountTP?method=unbind',type:'POST',data:param})
        .done(data => {
          this.actions.unBindThirdPardSuccess(data);
        })
        .fail(jqXhr => {
          this.actions.fail(jqXhr.responseJSON.message);
        });
    }

    changeModalStatus(type,show){
        this.actions.changeModalStatusSuccess({type:type,show:show});
    }

}

export default alt.createActions(MenubarAction);
