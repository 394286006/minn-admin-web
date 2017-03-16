/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import MainConstant from '../../utils/MainConstant';

class UserAction {
  constructor() {
    this.generateActions(
      'loginSuccess',
      'loginFail',
      'checkLoginSuccess',
      'tabChangeSuccess',
      'fail',
      'updateValue'
    );
  }

  login(name, pwd,lang) {
    $.ajax({
      type: 'POST',
      url: 'j_spring_security_check',
      data: {username: name, password: pwd ,logintype:'3',key:'',lang:lang}
    })
      .done((data) => {
        data.actionType='jsloginSuccess';
        this.actions.loginSuccess(data);

      })
      .fail((jqXhr) => {
        this.actions.loginFail(jqXhr);
      });
  }

  checkLogin(lang) {
    $.ajax({
      type: 'POST',
      url: 'login?lang='+MainConstant.currentLocale,
      data: {}
    })
      .done((data) => {
        data.actionType='loginSuccess';
        this.actions.checkLoginSuccess(data);

      })
      .fail((jqXhr) => {  
        this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  tabChange(index,last){
    let data={};
    data.actionType='tabChangeSuccess';
    data.index=index;
    data.last=last;
    data.randomKey='';
    if(index==0){
      this.actions.tabChangeSuccess(data);
    }else{
      $.ajax({
        type: 'POST',
        url: 'swfqrcodekey',
        data: {}
      })
        .done((d) => {
          data.randomKey=d.data.key;
          this.actions.tabChangeSuccess(data);

        })
        .fail((jqXhr) => {
          this.actions.fail(jqXhr.responseJSON.message);
        });
    }

  }


}

export default alt.createActions(UserAction);
