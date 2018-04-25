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
      url: MainConstant.authApp + '/j_spring_security_check',
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
      url: MainConstant.authApp + '/login?lang='+MainConstant.currentLocale,
      data: {}
    })
      .done((data) => {
        data.actionType='loginSuccess';
        this.actions.checkLoginSuccess(data);

      })
      .fail((jqXhr) => {
         let data ={};
         data.actionType='checkLoginFail';
         this.actions.loginFail(data);
         //this.actions.fail(jqXhr.responseJSON.message);
      });
  }
  tabChange(index,last,lang){
    let data={};
    data.actionType='tabChangeSuccess';
    data.index=index;
    data.last=last;
    data.randomKey='';
    if(index==0||index==3){
      this.actions.tabChangeSuccess(data);
    }else if(index==1){
      $.ajax({
        type: 'POST',
        url: 'swfqrcodekey',
        data: {}
      })
        .done((d) => {
          data.loginKeys=d.data.key;
          this.actions.tabChangeSuccess(data);

        })
        .fail((jqXhr) => {
          this.actions.fail(jqXhr.responseJSON.message);
        });
    }else if(index==2){
        $.ajax({ url: MainConstant.baseApp + '/acountTP?method=getLoginThirdParts&lang='+lang.split('_')[0],type:'GET',data:{}})
          .done(d => {
            data.loginKeys=d.data;
            this.actions.tabChangeSuccess(data);
          })
          .fail(jqXhr => {
            this.actions.fail(jqXhr.responseJSON.message);
          });

    }

  }




}

export default alt.createActions(UserAction);
