/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from './TemplateStore';
import ThirdPartAction from '../../actions/privilege/ThirdPartAction';

class ThirdPartStore extends TemplateStore{
  constructor() {
    super(ThirdPartAction);
    this.dicData = null;
    this.dicType=null;
    this.data=[];
    this._curid;
    this.name='';
    this.selectedRow={};
  }

   onGetDicSuccess(data) {
    this.dicData = data.data;
    this.actionType='getDicSuccess';
  }

  onGetSelectedDataSuccess(data){
    this.actionType='getSelectedDataSuccess';
    this.selectedRow=data;
  }

  onQuerySuccess(data) {
     this.result=data;
    this.actionType='querySuccess';
    this.data=data.result;
    this.total=data.total;
  }

  onSaveOrUpdateSuccess(data) {
     this.result=data;
     this.actionType='saveOrUpdateSuccess';
  }

  onDelSuccess(data){
     this.result=data;
     this.actionType='delSuccess';
  }

}

export default alt.createStore(ThirdPartStore);
