/**
* @auth:minn
* @qq:394286006
*/
var _params;
var inter;
var trycount=0;
 $( document ).on( 'randomkeyCompleteEvent', randomkeyCompleteEvent);
 function randomkeyCompleteEvent(event,param){
	 _params=param;
 }
 function get(key){
	 return _params[key];
 }

function checkLogin(){
    $.ajax({
      type: 'POST',
      url: 'j_spring_security_check',
      data: {username: '', password: '',logintype:'4',key:_params.key,lang:''}
    })
      .done((data) => {
    	  location.reload();
      })
      .fail((jqXhr) => {
        console.log('fail:'+jqXhr);
      });

}
