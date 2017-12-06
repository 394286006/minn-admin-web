/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from '../privilege/TemplateStore';
import LuceneMngAction from '../../actions/lucene/LuceneMngAction';

class LuceneMngStore extends TemplateStore{
  constructor() {
    super(LuceneMngAction);
    this.data=[];
    this.age='无匹配数据';
  }

 onAddSuccess(data){
    this.actionType='addSuccess';
    console.log(data.info);
    this.data=data.data;
  }
   onQuerySuccess(data) {
     this.age='年龄:';
    if(data.hits>0){
      if(data.hits>1){
        this.age+=',';
      }
      this.age+=','+data.age;
    }else{
      this.age='无匹配数据';
    }
   console.log(this.age);
    this.actionType='querySuccess';
  }


}

export default alt.createStore(LuceneMngStore);
