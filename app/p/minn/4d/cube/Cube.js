/**
* @creator:minn
* @qq:394286006
*/
import TemplateGL from '../TemplateGL';
import Shader from './Shader';
import dataBuffer from './dataBuffer';
import Texture from './Texture';
class Cube extends TemplateGL{
  constructor(dom) {
    super();
    this.dom=dom;
    this.squareRotation=0.0;
    this.lastSquareUpdateTime;
    this.shader=Shader.getInstance(this.dom);
    this.dataBuffer=dataBuffer.getInstance();
    this.cubeTexture=Texture.getInstance();
  }

  static getInstance(dom){
    return new Cube(dom);
  }

  start(){
  
   this.getWebGL(this.dom,'glcanvas');

   if(this.webGLEnabled){

     this.shader.initShaders(this.webGL);

     this.dataBuffer.initBuffers(this.webGL);

     this.cubeTexture.initTextures(this.webGL);

     setInterval(this.drawScene.bind(null,this), 15);
   
   }
 }

  drawScene(cube){

    let webGL=cube.webGL;
    webGL.clear(webGL.COLOR_BUFFER_BIT | webGL.DEPTH_BUFFER_BIT);
    cube.perspectiveMatrix=makePerspective(60, 840.0/480.0, 0.1, 100.0);
    cube.loadMvMatrix();
  
    cube.mvTranslate([0.0, 1.0, -6.0]);

    cube.mvPushMatrix();
    cube.mvRotate(cube.squareRotation,[1,0,1]);
    
    
    webGL.bindBuffer(webGL.ARRAY_BUFFER, cube.dataBuffer.verticesBuffer);
    webGL.vertexAttribPointer(cube.shader.vertexPositionAttribute, 3, webGL.FLOAT, false, 0, 0);

    webGL.bindBuffer(webGL.ARRAY_BUFFER, cube.dataBuffer.verticesTextureCoordBuffer);
    webGL.vertexAttribPointer(cube.shader.vertexAttribute, 2, webGL.FLOAT, false, 0, 0);

    webGL.activeTexture(webGL.TEXTURE0);
    webGL.bindTexture(webGL.TEXTURE_2D,cube.cubeTexture.texture);
    webGL.uniform1i(webGL.getUniformLocation(cube.shader.shaderProgram,'uSampler'),0);
    
    webGL.bindBuffer(webGL.ELEMENT_ARRAY_BUFFER,cube.dataBuffer.verticesIndexBuffer);
    cube.setMatrixUniforms(webGL);

    webGL.drawElements(webGL.TRIANGLES,36,webGL.UNSIGNED_SHORT,0);

    let currentTime=Date.now();
    if(cube.lastSquareUpdateTime){
      let delta=currentTime-cube.lastSquareUpdateTime;
      cube.squareRotation+=(30*delta)/1000.0;
    }

    cube.lastSquareUpdateTime=currentTime;

  }

  setMatrixUniforms(webGL){
     this.setMatrixUniform(this.webGL,this.shader.shaderProgram,this.perspectiveMatrix,'uPMatrix');
     this.setMatrixUniform(this.webGL,this.shader.shaderProgram,this.mvMatrix,'uMVMatrix');
  }

  
}
export default Cube;
