/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';

class UserAction {
  constructor() {
    this.generateActions(
      'loginSuccess',
      'loginFail',
      'checkLoginSuccess',
      'fail',
      'updateValue'
    );
  }

  login(name, pwd) {
    $.ajax({
      type: 'POST',
      url: 'j_spring_security_check',
      data: { username: name, password: pwd }
    })
      .done((data) => {
        data.actionType='jsloginSuccess';
        this.actions.loginSuccess(data);

      })
      .fail((jqXhr) => {
        this.actions.loginFail(jqXhr);
      });
  }

  checkLogin() {
    $.ajax({
      type: 'POST',
      url: 'login',
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
}

export default alt.createActions(UserAction);