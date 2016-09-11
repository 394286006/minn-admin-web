/**
* @creator:minn
* @qq:394286006
*/
import WebGL from './WebGL';
class TemplateGL extends WebGL{
  constructor() {
    super();
    this.mvMatrix;
    this.mvMatrixStack=[];
    this.perspectiveMatrix;
  }

 loadMvMatrix(){
    this.mvMatrix=Matrix.I(4);
    
  }
   multMatrix(m){
      this.mvMatrix=this.mvMatrix.x(m);
      
  }

  mvTranslate(v){
    this.multMatrix(Matrix.Translation($V(v)).ensure4x4());
  }

  mvPushMatrix(m){
    if(m){
      this.mvMatrixStack.push(m.dup());
      this.mvMatrix=m.dup();
    }else{
      this.mvMatrixStack.push(this.mvMatrix.dup());
    }

  }

  mvPopMatrix(){
    if(!this.mvMatrixStack.length){
       throw('can not pot from an empty matrix stack');
    }
    this.mvMatrix=this.mvMatrixStack.pop();
    return this.mvMatrix;
  }

  mvRotate(angle,v){
    let inRadians=angle*Math.PI/180.0;
    let m=Matrix.Rotation(inRadians, $V(v) ).ensure4x4();
    this.multMatrix(m);

  }

  setMatrixUniform(webGL,shaderProgram,matrix,id){
    let uniform=webGL.getUniformLocation(shaderProgram,id);
    webGL.uniformMatrix4fv(uniform,false,new Float32Array(matrix.flatten()));
 
  }
 

}
export default TemplateGL;
