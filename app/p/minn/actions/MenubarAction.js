/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../alt';
import {assign} from 'underscore';

class MenubarAction { 
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getPrivateMenuSuccess',
      'qrCodeLoginSuccess',
      'logoutSuccess',
      'fail'
    );
  }


  logout() {
    $.ajax({
      url: 'logout',
      data: { }
    })
      .done((data) => {
        this.actions.logoutSuccess();
      })
      .fail(() => {
        this.actions.fail();
      });
  }

  getPrivateMenu(lang) {
    $.ajax({ url: 'menu?method=getPrivateMenu',data:{lang:lang} })
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
        url: 'swfqrcodekey',
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

}

export default alt.createActions(MenubarAction);
