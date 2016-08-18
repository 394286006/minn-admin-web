/**
* @auth:minn
* @qq:394286006
*/
class MainUtil {
  constructor(doc) {
    this.global=doc.global;
    this.locale=this.global.currentLocale;
    this.properties=this.global.messageResource.properties;
    this.mainUtil=null;
  }

static getInstance(doc){
 
    if(this.mainUtil==null){
        this.mainUtil=new MainUtil(doc);
    }
    return this.mainUtil;
  }

  
 convertUnicodeString(str) {
      let convertedText = str.replace(/\\u[\dA-Fa-f]{4}/g, function (unicodeChar) {
        return String.fromCharCode(parseInt(unicodeChar.replace(/\\u/g, ''), 16));
      });
      return convertedText;
    }

    getLocales(){
      return this.global.locales;
    }

    getCurrentLocale(){
      return this.locale;
    }

     setCurrentLocale(locale){
      return this.locale=locale;
    }
    get(key){
      var value='';
      if (typeof this.properties[this.locale][key] !== 'undefined'){
            value = this.properties[this.locale][key];
        }       
      return this.convertUnicodeString(value);
     }
    
    setLogin(b){
      this.global.isLogin=b;
    }
    setUserInfo(value){
      this.global.userInfo=value;
    }
    getUserInfo(){
      return this.global.userInfo;
    }

    convert2JsonStr(obj){
      let str='{';
        let idx=0;
        for(let k in obj){
            if(idx>0){
              str+=',';
            }
            if((typeof obj[k])=='number'){
              str+=k+':'+obj[k];
            }else{
              str+=k+':\''+obj[k]+'\'';
            }
            idx++;
        }
        str+='}';
        return str;
    }

   static convert2Json(obj){
      let str='{';
        let idx=0;
        for(let k in obj){
            if(idx>0){
              str+=',';
            }
            if((typeof obj[k])=='number'){
              str+=k+':'+obj[k];
            }else{
              str+=k+':\''+obj[k]+'\'';
            }
            idx++;
        }
        str+='}';
        return str;
    }

    static genSelectOptions(el,arr,selected,idx){
      if(idx==undefined){
        idx=0;
      }
      if(el.children().length>idx){
         return;
      }
      for(let i=0;i<arr.length;i++){
         el.append("<option value='"+arr[i].id+"'>"+arr[i].text+"</option>");
      }
      if(selected!=null)
        el.val(selected);
    }
}
export default MainUtil;
