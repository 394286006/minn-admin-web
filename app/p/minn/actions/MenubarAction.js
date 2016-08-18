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
}

export default alt.createActions(MenubarAction);