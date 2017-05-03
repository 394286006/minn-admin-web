/**
* @auth:minn
* @qq:394286006
*/
import alt from '../../../../alt';
import TemplateStore from '../privilege/TemplateStore';
import AiMngAction from '../../actions/ai/AiMngAction';

class AiMngStore extends TemplateStore{
  constructor() {
    super(AiMngAction);
    this.file;
    this.filename;
    this.imgpath;
    this.tensorflowResult;
    this.matchname;
    this.matchpercent;
  }

 onUploadSuccess(file){
    this.actionType='uploadSuccess';
    this.file=file;
    this.filename=file.data.fileName;
    this.imgpath=file.data.imgpath;

  }
   onCompareTensorflowSuccess(data) {
    this.tensorflowResult=data.data;
    this.matchname=data.data.matchname;
    this.matchpercent=data.data.matchpercent;
    this.actionType='compareTensorflowSuccess';
  }
  onClearImgSuccess(){
      this.imgpath='';
      this.actionType='clearImgSuccess';
  }

}

export default alt.createStore(AiMngStore);
