/**
* @auth:minn
* @qq:394286006
*/
import React from 'react';
import MinnUtil from '../../utils/MinnUtil';
import MainConstant from '../../utils/MainConstant'; 


class TemplateComponent extends React.Component {
  constructor(props,store) {
    super(props);
        this.state = store.getState();
        this.onChange = this.onChange.bind(this);
        this.minnUtil=MinnUtil.getInstance(document); 
        this.selectedRow=null;
        this.store=store;
  }

  tableProp(compoent){
    let minnUtil=MinnUtil.getInstance(document);
     let options={sizePerPage:MainConstant.sizePerPage,sizePerPageList:MainConstant.sizePerPageList,noDataText:minnUtil.get('query_data_null')};
     if(compoent.onPageChange!='undefined'){
        options.onPageChange=compoent.onPageChange;  
     }
     if(compoent.paginationShowsTotal!='undefined'){
        options.paginationShowsTotal=compoent.paginationShowsTotal;
     }
    return options;
  }

 rowProp(compoent){
     let prop = {mode: "radio",clickToSelect: true}; 
     if(compoent.onRowSelect!='undefined'){
        prop.onSelect=compoent.onRowSelect;
     } 
     return prop;
 }
  
   paginationShowsTotal(start, to, total){
      let minnUtil=MinnUtil.getInstance(document);

      return (total==0? 0:(start+1))+'-'+to+','+minnUtil.get('pagebar_total')+total+minnUtil.get('pagebar_row');
   }

   modifyHandler(event){
     if($('#del_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }
       this.setState({ show: true,myMethod:'modify'});
  }

  invokeDelHandler(callback){
      if($('#del_id').val()==''){
          $.alert({title: this.minnUtil.get('alert_title_msg'),content: this.minnUtil.get('alert_select_del_msg'),confirmButton: this.minnUtil.get('main_alert_oklabel')});
          return;
        }

        $.confirm({
            title: this.minnUtil.get('alert_title_msg'),
            content: this.minnUtil.get('common_delete_alert'),
            confirmButton: this.minnUtil.get('main_alert_oklabel'),
            cancelButton: this.minnUtil.get('login_cancel'),
            confirm: callback
        });
    }

    invokeSaveHandler(){
      if(this.state.validationState['input']==false){
        this.setState({ validationState:{alertVisible:''} });
        return true;
      }
      return false;
  
    }
 
}

export default TemplateComponent;