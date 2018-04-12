/**
* @auth:minn
* @qq:394286006
*/
import MainConstant from '../utils/MainConstant';
import PropertiesResourceReader from '../utils/PropertiesResourceReader';
 class AppStore {
  constructor() {
    this.astore=null;
    this.login=false;
    this.locale=MainConstant.global.locale.locale.split('_')[0];
    this.messageResource=null;

  }
static init(){
    if(this.astore==null){
       this.astore=new AppStore();
    }
    return this.astore;
  }


   getResource(localCallback){
    if(this.messageResource==null){
      this.messageResource=PropertiesResourceReader.getInstance(MainConstant.global.pkg,MainConstant.global.locales,MainConstant.global.prefix,localCallback);
    }
  }
   static getInstance(){
     
    return this.astore;
  }

  getGlobal(messageResource){
    let global=MainConstant.global;
    global.messageResource=messageResource;
    return global;
  }


  isLoaded(){
    return this.messageResource.isLoaded();
  }
  isLogin(){
    return this.login;
  }
   get(key){
      
    return this.messageResource.get(key,MainConstant.locale);
  }

}

export default AppStore;